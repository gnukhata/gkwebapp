
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
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from odslib import ODS
#from odslib import sheetTable
#from odslib import sheetCell
from spreadsheettable import SpreadsheetTable
from pyramid.response import Response
import os
import calendar
from formula import TotalPagesColSum, PreviousPagesColSum

@view_config(route_name="showtrialbalance", renderer="gkwebapp:templates/viewtrialbalance.jinja2")
def showtrialbalance(request):
	return {"gkstatus":0}

@view_config(route_name="showtrialbalancereport")
def showtrialbalancereport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	trialbalancetype = int(request.params["trialbalancetype"])
	header={"gktoken":request.headers["gktoken"]}
	if trialbalancetype == 1:
		result = requests.get("http://127.0.0.1:6543/report?type=nettrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/nettrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":1,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
	elif trialbalancetype == 2:
		result = requests.get("http://127.0.0.1:6543/report?type=grosstrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/grosstrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":2,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
	elif trialbalancetype == 3:
		result = requests.get("http://127.0.0.1:6543/report?type=extendedtrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/extendedtrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":3,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)

@view_config(route_name="printtrialbalance", renderer ="json")
def printtrialbalance(request):
	orgname = request.params["orgname"]
	financialstart = request.params["financialstart"]
	calculateto = request.params["calculateto"]
	trialbalancetype = int(request.params["trialbalancetype"])
	header = {"gktoken": request.headers["gktoken"]}
	if trialbalancetype == 1:
		result = requests.get("http://127.0.0.1:6543/report?type=nettrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
	elif trialbalancetype == 2:
		result = requests.get("http://127.0.0.1:6543/report?type=grosstrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
	elif trialbalancetype == 3:
		result = requests.get("http://127.0.0.1:6543/report?type=extendedtrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)

	records = result.json()["gkresult"]

	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.setSheetName("Trial Balance of "+orgname)
	sheet.getCell(0,0).stringValue(orgname)
	if trialbalancetype == 1:
		ods.content.mergeCells(0,0,5,1)
		sheet.getCell(0,1).stringValue("Net Trial Balance for the period from "+financialstart+" to "+calculateto)
		ods.content.mergeCells(0,1,5,1)
		sheet.getCell(0,2).stringValue("Sr. No.")
		sheet.getCell(1, 2).stringValue("Account Name")
		sheet.getCell(2, 2).stringValue("Debit")
		sheet.getCell(3, 2).stringValue("Credit")
		sheet.getCell(4, 2).stringValue("Group Name")
		row = 3
		for record in records:
				sheet.getCell(0,row).stringValue(record["srno"])
				sheet.getCell(1, row).stringValue(record["accountname"])
				sheet.getCell(2, row).stringValue(record["Dr"])
				sheet.getCell(3, row).stringValue(record["Cr"])
				sheet.getCell(4, row).stringValue(record["groupname"])
				row+=1

	elif trialbalancetype == 2:
		ods.content.mergeCells(0,0,5,1)
		sheet.getCell(0,1).stringValue("Gross Trial Balance for the period from "+financialstart+" to "+calculateto)
		ods.content.mergeCells(0,1,5,1)
		sheet.getCell(0,2).stringValue("Sr. No.")
		sheet.getCell(1, 2).stringValue("Account Name")
		sheet.getCell(2, 2).stringValue("Debit")
		sheet.getCell(3, 2).stringValue("Credit")
		sheet.getCell(4, 2).stringValue("Group Name")
		row = 3
		for record in records:
				sheet.getCell(0,row).stringValue(record["srno"])
				sheet.getCell(1, row).stringValue(record["accountname"])
				sheet.getCell(2, row).stringValue(record["Dr balance"])
				sheet.getCell(3, row).stringValue(record["Cr balance"])
				sheet.getCell(4, row).stringValue(record["groupname"])
				row+=1

	elif trialbalancetype == 3:
		ods.content.mergeCells(0,0,8,1)
		sheet.getCell(0,1).stringValue("Extended Trial Balance for the period from "+financialstart+" to "+calculateto)
		ods.content.mergeCells(0,1,8,1)
		sheet.getCell(0,2).stringValue("Sr. No.")
		sheet.getCell(1, 2).stringValue("Account Name")
		sheet.getCell(2, 2).stringValue("Group Name")
		sheet.getCell(3, 2).stringValue("Total Debit")
		sheet.getCell(4, 2).stringValue("Total Credit")
		sheet.getCell(5, 2).stringValue("Debit Balance")
		sheet.getCell(6, 2).stringValue("Credit Balance")
		sheet.getCell(7, 2).stringValue("Group Name")
		row = 3
		for record in records:
				sheet.getCell(0,row).stringValue(record["srno"])
				sheet.getCell(1, row).stringValue(record["accountname"])
				sheet.getCell(2, row).stringValue(record["openingbalance"])
				sheet.getCell(3, row).stringValue(record["totaldr"])
				sheet.getCell(4, row).stringValue(record["totalcr"])
				sheet.getCell(5, row).stringValue(record["curbaldr"])
				sheet.getCell(6, row).stringValue(record["curbalcr"])
				sheet.getCell(7, row).stringValue(record["curbalcr"])
				row+=1

	ods.save("response.ods")
	response = {"abc":"a"}
	return response

	#else:
		#return {"gkstatus":1}
