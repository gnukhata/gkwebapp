"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@dff.org.in>
"Arun Kelkar" <arunkelkar@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Abhijith Balan" <abhijithb21@openmailbox.org>
"Prajkta Patkar" <prajkta.patkar007@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import base64
import os, shutil
from openpyxl import load_workbook
from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.drawing.graphic import GroupShape

@view_config(route_name='import',request_param='action=show',renderer='gkwebapp:templates/tallyimport.jinja2')
def showtallyImport(request):
	return {"gkstatus":0}

@view_config(route_name='import',request_param='action=import',renderer='json')
def tallyImport(request):
	"""
	This function will take a spreadsheet containing data from tally.
	Then the code will read the file using parsing library (openpyxl).
	With a number of post calls to REST API, the data is added to GNUKhata.
	The data consists of :
	*new subgroups if they don't exist,
	*new accounts under existing or new subgroups
	* new accounts undr group as per data provided.
	The data from tally should be in the following format.
	* first sheet must contain the list of accounts
	* Structure should be groups with their optional subgroups
	* if accounts are to be under a group then they should come immediately below the group
	* if there are subgroups under the group they should imediately follow the group
	* groups are in bold
	*accounts are italics
	* subgroups are normal
	* list of groups should be exactly as per GNUKhata (13 at the most ).
	The code will then look at rest of the sheets which contain list of transactions for every account.
	a loop will first go through list of sheets, skipping first sheet with index 0
	then for every sheet, list of rows will be taken.
	For every row containing date in first column it will look for all data in same row.
	The data will include particular, voucher type, voucher number, Dr or Cr.
	The name of the account in the particulars column is  in the same row.
	Note that title of the sheet has the account name for which transactions are being recorded.
	This is called the ledger account.
	So if the amount in a certain transaction is in the Dr. column,
	it means that the account in particulars column will have same amount for Cr.
	If the row next to the row containing date is blank except the particulars column, it means it is narration.
	If the row has empty value in date column but has all other columns filled,
	then it means this voucher is for the same date.
	So it is obvious that once we see date in the first column, it is stored in a variable.
	This value will only change the next time we see another date.
	"""
	#First we will get list of existing groups and subgroups for this organisation.
	#we will of course lead the workbook from the request.
	try:
		header={"gktoken":request.headers["gktoken"]}
		xlsxfile = request.POST['xlsxfile'].file
		wbTally = load_workbook(xlsxfile)
		wbTally._active_sheet_index = 0
		accountSheet = wbTally.active
		accountList = tuple(accountSheet.rows)
		gsResult = requests.get("http://127.0.0.1:6543/groupsubgroups?groupflatlist",headers=header)
		groups = gsResult.json()["gkresult"]
		curgrpid = None
		parentgroupid = None
		for accRow in accountList:
			if accRow[0].value == None:
				continue
			if accRow[0].font.b:
				curgrpid = groups[accRow[0].value.strip()]
				parentgroupid = groups[accRow[0].value.strip()]
				continue
			if accRow[0].font.b == False and accRow[0].font.i == False:
				if groups.has_key(accRow[0].value):
					curgrpid = groups[accRow[0].value.strip()]
				else:
					newsub = requests.post("http://127.0.0.1:6543/groupsubgroups",data = json.dumps({"groupname":accRow[0].value,"subgroupof":parentgroupid}),headers=header)
					curgrpid = newsub.json()["gkresult"]
			if accRow[0].font.i:
				if accRow[1].value==None and accRow[2].value==None:
					newsub = requests.post("http://127.0.0.1:6543/accounts",data = json.dumps({"accountname":accRow[0].value,"groupcode":curgrpid,"openingbal":0.00}),headers=header)
					continue
				if accRow[1].value==None:
					newsub = requests.post("http://127.0.0.1:6543/accounts",data = json.dumps({"accountname":accRow[0].value,"groupcode":curgrpid,"openingbal":accRow[2].value}),headers=header)
					continue
				try:
					if accRow[2].value==None:
						newsub = requests.post("http://127.0.0.1:6543/accounts",data = json.dumps({"accountname":accRow[0].value,"groupcode":curgrpid,"openingbal":accRow[1].value}),headers=header)
						continue
				except IndexError:
					pass


		#the dictionary thus returned will have
		#accountname as key and accountcode as value.
		acclist = requests.get("http://127.0.0.1:6543/accounts?acclist",headers=header)
		accounts = acclist.json()["gkresult"]
		#getting all sheets from workbook.
		#first sheet with index 0 will be skipped.
		sheets = wbTally.worksheets
		#we need two variables for accountname and accountcode.
		#the name and code will be changed when main for loop iterates.
		ledgerAccount = ""
		ledgerCode = None
		voucherCodes = []
		for accSheet in sheets:
			if wbTally.index(accSheet) == 0:
				continue
			ledgerAccount = accSheet.title.strip()
			ledgerCode = accounts[ledgerAccount]
			voucherRows = tuple(accSheet.rows)
			voucherDate = ""
			for v in voucherRows:
				if v[3].value !=  None and v[4].value != None:
					numType = {v[4].value:v[3].value.strip().lower()}
				if (v[3].value == None) or numType in voucherCodes:
					continue
				if v[0].value != None:
					voucherDate = str(v[0].value)
					if voucherDate[2]=='-':
						vdates = voucherDate.split('-')
						voucherDate = vdates[2]+'/'+vdates[1]+'/'+vdates[0]
				vouchernumber = v[4].value
				voucherCodes.append(numType)
				vouchertype = v[3].value.strip().lower()
				if v[5].value != None:
					drs = {ledgerCode: v[5].value}
					if v[2].value == "(as per details)":
						accIndex = voucherRows.index(v )+1
						CurAccount = voucherRows[voucherRows.index(v)+1 ][2].value.strip()
						crs = {}
						while accounts.has_key(CurAccount):
							crs  [accounts[CurAccount.strip()]] = voucherRows[accIndex][6].value
							accIndex = accIndex +1
							CurAccount = voucherRows[accIndex][2].value
						narration = voucherRows[accIndex][2].value
					else:
						crs = {accounts[v[2].value]:v[5].value}
						try:
							narration = voucherRows[voucherRows.index(v)+1 ][2].value
						except IndexError:
							pass
	 			if v[6].value != None:
					crs = {ledgerCode: v[6].value}
					if v[2].value == "(as per details)":
						accIndex = voucherRows.index(v)+1
						CurAccount = voucherRows[voucherRows.index(v)+1 ][2].value.strip()
						drs = {}
						while accounts.has_key(CurAccount):
							drs[accounts[CurAccount.strip()]] = voucherRows[accIndex][5].value
							accIndex = accIndex +1
							CurAccount = voucherRows[accIndex][2].value
						narration = voucherRows[accIndex][2].value
					else:
						drs = {accounts[v[2].value]:v[6].value}
						try:
							narration = voucherRows[voucherRows.index(v )+1 ][2].value
						except IndexError:
							pass
				newvch = requests.post("http://127.0.0.1:6543/transaction",data = json.dumps({"voucherdate":voucherDate,"vouchernumber":vouchernumber,"vouchertype":vouchertype,"drs":drs,"crs":crs,"narration":narration}),headers=header)

		return {"gkstatus":0}
	except:
		print "file not found"
		return {"gkstatus":3}


@view_config(route_name="exportledger", renderer="")
def exportLedger(request):
	try:
		header={"gktoken":request.headers["gktoken"]}
		gkwb = Workbook()
		accountList = gkwb.active
		accountList.title = "Account List"
		accountList.column_dimensions["A"].width = 80
		accountList.column_dimensions["B"].width = 30
		gsResult = requests.get("http://127.0.0.1:6543/groupsubgroups",headers=header)
		groupList = gsResult.json()["gkresult"]
		cellCounter = 1
		for group in groupList:
			g = accountList.cell(row=cellCounter,column=1,value=group["groupname"])
			g.font = Font(name=g.font.name,bold=True)
			cellCounter = cellCounter + 1
			accResult = requests.get("http://127.0.0.1:6543/accounts?accbygrp&groupcode=%s"%group["groupcode"],headers=header)
			accList = accResult.json()["gkresult"]
			for acc in accList:
				a = accountList.cell(row=cellCounter,column=1,value=(acc["accountname"]).replace("/",""))
				a.font = Font(name=g.font.name,italic=True)
				ob = accountList.cell(row=cellCounter,column=2,value=acc["openingbal"])
				ob2 = accountList.cell(row=cellCounter,column=3,value="")
				cellCounter = cellCounter + 1
			sgResult = requests.get("http://127.0.0.1:6543/groupDetails/%s"%(group["groupcode"]),headers=header)
			subgrpList = sgResult.json()["gkresult"]
			for sg in subgrpList:
				sbg = accountList.cell(row=cellCounter,column=1,value=sg["subgroupname"])
				cellCounter = cellCounter + 1
				accsgResult = requests.get("http://127.0.0.1:6543/accounts?accbygrp&groupcode=%s"%sg["groupcode"],headers=header)
				accListsg = accsgResult.json()["gkresult"]
				for accsg in accListsg:
					a = accountList.cell(row=cellCounter,column=1,value=(accsg["accountname"]).replace("/",""))
					a.font = Font(name=g.font.name,italic=True)
					ob = accountList.cell(row=cellCounter,column=2,value=accsg["openingbal"])
					ob2 = accountList.cell(row=cellCounter,column=3,value="")
					cellCounter = cellCounter + 1

			acclist = requests.get("http://127.0.0.1:6543/accounts?acclist",headers=header)
			accounts = acclist.json()["gkresult"]

		for acct in accounts:
			accname = str(acct)
			accountcode = accounts[acct]
			calculatefrom = request.params["yearstart"]
			calculateto = request.params["yearend"]
			financialstart = request.params["yearstart"]
			result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode,calculatefrom,calculateto,financialstart), headers=header)
			ledgerResult = result.json()["gkresult"]
			if len(ledgerResult) == 1:
				continue
			firstVal = ledgerResult[0]["particulars"][0]
			secondVal = ledgerResult[1]["particulars"][0]
			if firstVal == "Opening Balance" and secondVal == "Total of Transactions":
				continue
			Ledger = gkwb.create_sheet()
			Ledger.title = accname.replace("/","")
			Ledger.column_dimensions["A"].width =10
			Ledger.column_dimensions["C"].width = 50
			Ledger.column_dimensions["F"].width = 10
			Ledger.column_dimensions["G"].width = 10
			ledgerRowCounter = 1
			for row in ledgerResult:
				particulars = row["particulars"]
				if particulars[0] == "Opening Balance" or particulars[0] == "Total of Transactions" or particulars[0] == "Closing Balance C/F" or particulars[0] == "Grand Total":
					continue
				Ledger.cell(row=ledgerRowCounter, column=1, value=row["voucherdate"])
				particularCounter = ledgerRowCounter
				if len(particulars) == 1:
					Ledger.cell(row=ledgerRowCounter, column=3, value=particulars[0])
					Ledger.cell(row=ledgerRowCounter+1 , column=3, value=row["narration"])
					particularCounter = ledgerRowCounter +1
				if len(particulars) > 1:
					Ledger.cell(row=ledgerRowCounter, column=3, value="(as per details)")
					for p in particulars:
						particularCounter = particularCounter +1
						Ledger.cell(row=particularCounter, column=3, value=p)
					particularCounter = particularCounter +1
					Ledger.cell(row=particularCounter, column=3, value=row["narration"])
				Ledger.cell(row=ledgerRowCounter, column=4, value=row["vouchertype"])
				Ledger.cell(row=ledgerRowCounter, column=5, value=row["vouchernumber"])
				Ledger.cell(row=ledgerRowCounter, column=6, value=row["Dr"])
				Ledger.cell(row=ledgerRowCounter, column=7, value=row["Cr"])
				ledgerRowCounter = particularCounter +1

		gkwb.save(filename = "AllLedger.xlsx")
		AllLedgerfile = open("AllLedger.xlsx","r")
		bf = AllLedgerfile.read()
		AllLedgerfile.close()
		headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(bf),'Content-Disposition': 'attachment; filename=AllLedger.xlsx', 'Set-Cookie':'fileDownload=true; path=/'}
		os.remove("AllLedger.xlsx")
		return Response(bf, headerlist=headerList.items())
	except:
		print "file not found"
		return {"gkstatus":3}
