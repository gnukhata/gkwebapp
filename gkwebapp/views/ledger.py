
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.and old.stockflag = 's'

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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
from odslib import ODS
import calendar
from formula import CurrentPageColSum, PreviousPagesColSum,RowNumber
from spreadsheettable import SpreadsheetTable

@view_config(route_name="printmonthlyledgerreport", renderer="")
def printmonthlyledgerreport(request):
	result = request
	accountcode = int(request.params["accountcode"])
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode), headers=header)
	gkresult = result.json()["gkresult"]
	return response

@view_config(route_name="printledgerreport", renderer="")
def printLedgerReport(request):
	accountcode = int(request.params["accountcode"])
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	fystart = request.params["fystart"]
	fyend = request.params["fyend"]
	orgname = str(request.params["orgname"])
	projectcode = request.params["projectcode"]
	header={"gktoken":request.headers["gktoken"]}
	if projectcode=="":
		result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode,calculatefrom,calculateto,fystart), headers=header)
	else:
		result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode,calculatefrom,calculateto,fystart, int(projectcode)), headers=header)
	headerrow = result.json()["ledgerheader"]
	result = result.json()["gkresult"]

	calculateto = calculateto[8:10]+calculateto[4:8]+calculateto[0:4]
	calculatefrom = calculatefrom[8:10]+calculatefrom[4:8]+calculatefrom[0:4]
	fystart = fystart[8:10]+fystart[4:8]+fystart[0:4]

	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.getRow(0).setHeight("23pt")
	sheet.getCell(0,0).stringValue(orgname+" (FY: "+fystart+" to "+fyend+")").setBold(True).setAlignHorizontal("center").setFontSize("18pt")
	ods.content.mergeCells(0,0,8,1)
	sheet.getRow(1).setHeight("18pt")
	sheet.getCell(0,1).stringValue("Account: "+headerrow["accountname"] +"(Period: "+calculatefrom+" to "+calculateto+")").setBold(True).setAlignHorizontal("center").setFontSize("14pt")
	ods.content.mergeCells(0,1,8,1)
	row = 2
	if headerrow["projectname"]!="":
		sheet.getCell(0,row).stringValue("Project: "+headerrow["projectname"]).setBold(True).setAlignHorizontal("center")
		ods.content.mergeCells(0,row,8,1)
		row += 1
	sheet.getColumn(0).setWidth("3cm")
	sheet.getColumn(1).setWidth("1cm")
	sheet.getColumn(2).setWidth("2cm")
	sheet.getColumn(3).setWidth("3cm")
	sheet.getColumn(4).setWidth("8cm")
	sheet.getColumn(5).setWidth("3cm")
	sheet.getColumn(6).setWidth("3cm")
	sheet.getColumn(7).setWidth("3cm")
	sheet.getCell(0,row).stringValue("Date").setBold(True)
	sheet.getCell(1,row).stringValue("V.No.").setBold(True)
	sheet.getCell(2,row).stringValue("Status").setBold(True)
	sheet.getCell(3,row).stringValue("Voucher Type").setBold(True)
	sheet.getCell(4,row).stringValue("Particulars").setBold(True)
	sheet.getCell(5,row).stringValue("Debit").setBold(True).setAlignHorizontal("right")
	sheet.getCell(6,row).stringValue("Credit").setBold(True).setAlignHorizontal("right")
	sheet.getCell(7,row).stringValue("Balance").setBold(True).setAlignHorizontal("right")
	for transaction in result:
		row += 1
		sheet.getCell(0,row).stringValue(transaction["voucherdate"])
		sheet.getCell(1,row).stringValue(transaction["vouchernumber"])
		sheet.getCell(2,row).stringValue(transaction["status"])
		sheet.getCell(3,row).stringValue(transaction["vouchertype"])
		narration = str(transaction["narration"])
		particulars = str(transaction["particulars"])
		sheet.getCell(4,row).stringValue(particulars+" ("+narration+")")
		sheet.getCell(5,row).stringValue(transaction["Dr"]).setAlignHorizontal("right")
		sheet.getCell(6,row).stringValue(transaction["Cr"]).setAlignHorizontal("right")
		sheet.getCell(7,row).stringValue(transaction["balance"]).setAlignHorizontal("right")


	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	return Response(rep, headerlist=headerList.items())


@view_config(route_name="showviewledger", renderer="gkwebapp:templates/viewledger.jinja2")
def showviewledger(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"gkresult":result.json()["gkresult"],"projects":projects.json()["gkresult"]}

@view_config(route_name="viewdualledger", renderer="gkwebapp:templates/viewdualledger.jinja2")
def showviewdualledger(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"gkresult":result.json()["gkresult"],"projects":projects.json()["gkresult"]}



@view_config(route_name="showledgerreport")
def showledgerreport(request):
	accountcode = int(request.params["accountcode"])
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	backflag = request.params["backflag"]
	monthlyflag = request.params["monthlyflag"]
	if request.params["narrationflag"]=="true":
		narrationflag = True
	else:
		narrationflag = False
	projectcode = request.params["projectcode"]
	ledgerrefresh = {"accountcode":accountcode,"calculatefrom":calculatefrom,"calculateto":calculateto,"financialstart":financialstart,"monthlyflag":monthlyflag,"backflag":int(backflag),"projectcode":projectcode,"narrationflag":request.params["narrationflag"]}
	header={"gktoken":request.headers["gktoken"]}
	if monthlyflag=="true":
		result = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode), headers=header)
		return render_to_response("gkwebapp:templates/monthledger.jinja2",{"records":result.json()["gkresult"],"accountcode":result.json()["accountcode"],"accountname":result.json()["accountname"] },request=request)
	else:
		if request.params.has_key("side"):
			if projectcode=="":
				result = requests.get("http://127.0.0.1:6543/report?type=crdrledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=&side=%s"%(accountcode,calculatefrom,calculateto,financialstart,request.params["side"]), headers=header)
			else:
				result = requests.get("http://127.0.0.1:6543/report?type=crdrledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d&side=%s"%(accountcode,calculatefrom,calculateto,financialstart,int(projectcode),request.params["side"]), headers=header)
				ledgerrefresh["projectname"] = result.json()["ledgerheader"]["projectname"]
			ledgerrefresh["side"]=request.params["side"]
		else:
			if projectcode=="":
				result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode,calculatefrom,calculateto,financialstart), headers=header)
			else:
				result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode,calculatefrom,calculateto,financialstart,int(projectcode)), headers=header)
				ledgerrefresh["projectname"] = result.json()["ledgerheader"]["projectname"]
		return render_to_response("gkwebapp:templates/ledgerreport.jinja2",{"records":result.json()["gkresult"],"narrationflag":narrationflag,"userrole":result.json()["userrole"],"ledgerrefresh":ledgerrefresh,"ledgerheader":result.json()["ledgerheader"] },request=request)


@view_config(route_name="showdualledgerreport")
def showdualledgerreport(request):
	result1=None
	result2=None
	accountcode1 = int(request.params["accountcode1"])
	calculatefrom1 = request.params["calculatefrom1"]
	calculateto1 = request.params["calculateto1"]
	financialstart = request.params["financialstart"]
	backflag = request.params["backflag"]
	monthlyflag1 = request.params["monthlyflag1"]
	if request.params["narrationflag1"]=="true":
		narrationflag1 = True
	else:
		narrationflag1 = False
	projectcode1 = request.params["projectcode1"]
	ledgerrefresh1 = {"accountcode":accountcode1,"calculatefrom":calculatefrom1,"calculateto":calculateto1,"financialstart":financialstart,"monthlyflag":monthlyflag1,"backflag":int(backflag),"projectcode":projectcode1,"narrationflag":request.params["narrationflag1"]}
	header={"gktoken":request.headers["gktoken"]}
	if monthlyflag1=="true":
		result1 = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode1), headers=header)
		return render_to_response("gkwebapp:templates/monthledger.jinja2",{"records":result.json()["gkresult"],"accountcode":result.json()["accountcode"],"accountname":result.json()["accountname"] },request=request)
	else:
		if projectcode1=="":
			result1 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode1,calculatefrom1,calculateto1,financialstart), headers=header)
		else:
			result1 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode1,calculatefrom1,calculateto1,financialstart,int(projectcode1)), headers=header)
			ledgerrefresh1["projectname"] = result1.json()["ledgerheader"]["projectname"]
	accountcode2 = int(request.params["accountcode2"])
	calculatefrom2 = request.params["calculatefrom2"]
	calculateto2 = request.params["calculateto2"]
	monthlyflag2 = request.params["monthlyflag2"]
	if request.params["narrationflag2"]=="true":
		narrationflag2 = True
	else:
		narrationflag2 = False
	projectcode2 = request.params["projectcode2"]
	ledgerrefresh2 = {"accountcode":accountcode2,"calculatefrom":calculatefrom2,"calculateto":calculateto2,"financialstart":financialstart,"monthlyflag":monthlyflag2,"backflag":int(backflag),"projectcode":projectcode2,"narrationflag":request.params["narrationflag2"]}

	if monthlyflag2=="true":
		result2 = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode2), headers=header)
		return render_to_response("gkwebapp:templates/monthledger.jinja2",{"records":result.json()["gkresult"],"accountcode":result.json()["accountcode"],"accountname":result.json()["accountname"] },request=request)
	else:
		if projectcode2=="":
			result2 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode2,calculatefrom2,calculateto2,financialstart), headers=header)
		else:
			result2 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode2,calculatefrom2,calculateto2,financialstart,int(projectcode2)), headers=header)
			ledgerrefresh2["projectname"] = result2.json()["ledgerheader"]["projectname"]
		return render_to_response("gkwebapp:templates/dualledgerreport.jinja2",{"records1":result1.json()["gkresult"],"records2":result2.json()["gkresult"],"narrationflag1":narrationflag1,"narrationflag2":narrationflag2,"userrole":result1.json()["userrole"],"ledgerrefresh1":ledgerrefresh1,"ledgerrefresh2":ledgerrefresh2,"ledgerheader1":result1.json()["ledgerheader"],"ledgerheader2":result2.json()["ledgerheader"] },request=request)
