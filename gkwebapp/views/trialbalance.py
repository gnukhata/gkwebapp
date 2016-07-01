
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

@view_config(route_name="printtrialbalancereport")
def printtrialbalancereport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	trialbalancetype = int(request.params["trialbalancetype"])

	header={"gktoken":request.headers["gktoken"]}
	if trialbalancetype == 1:
		result = requests.get("http://127.0.0.1:6543/report?type=nettrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/printnettrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":1,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
	elif trialbalancetype == 2:
		result = requests.get("http://127.0.0.1:6543/report?type=grosstrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/printgrosstrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":2,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
	elif trialbalancetype == 3:
		result = requests.get("http://127.0.0.1:6543/report?type=extendedtrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/printextendedtrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":3,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)


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
	fyend = request.params["fyend"]
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
	sheet.getRow(0).setHeight("23pt")

	sheet.getCell(0,0).stringValue(orgname+" (FY: "+financialstart[8:10]+financialstart[4:8]+financialstart[0:4]+" to "+fyend+")").setBold(True).setFontSize("16pt").setAlignHorizontal("center")
	if trialbalancetype == 1:
		ods.content.mergeCells(0,0,5,1)
		sheet.getRow(1).setHeight("18pt")
		sheet.getCell(0,1).stringValue("Net Trial Balance for the period from "+financialstart[8:10]+financialstart[4:8]+financialstart[0:4]+" to "+calculateto[8:10]+calculateto[4:8]+calculateto[0:4]).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
		ods.content.mergeCells(0,1,5,1)
		sheet.getColumn(4).setWidth("4cm")
		sheet.getColumn(1).setWidth("8cm")
		sheet.getCell(0,2).stringValue("Sr. No.").setBold(True).setAlignHorizontal("center")
		sheet.getCell(1, 2).stringValue("Account Name").setBold(True)
		sheet.getCell(2, 2).stringValue("Debit").setBold(True).setAlignHorizontal("right")
		sheet.getCell(3, 2).stringValue("Credit").setBold(True).setAlignHorizontal("right")
		sheet.getCell(4, 2).stringValue("Group Name").setBold(True).setAlignHorizontal("center")
		row = 3
		for record in records:
			sheet.getCell(0,row).stringValue(record["srno"]).setAlignHorizontal("center")
			sheet.getCell(1, row).stringValue(record["accountname"])
			if record["advflag"]==1:
				sheet.getCell(2, row).stringValue(record["Dr"]).setAlignHorizontal("right").setBold(True).setFontColor("#ff0000")
				sheet.getCell(3, row).stringValue(record["Cr"]).setAlignHorizontal("right").setBold(True).setFontColor("#ff0000")
			else:
				sheet.getCell(2, row).stringValue(record["Dr"]).setAlignHorizontal("right")
				sheet.getCell(3, row).stringValue(record["Cr"]).setAlignHorizontal("right")
			sheet.getCell(4, row).stringValue(record["groupname"]).setAlignHorizontal("center")
			row+=1

	elif trialbalancetype == 2:
		ods.content.mergeCells(0,0,5,1)
		sheet.getRow(1).setHeight("18pt")
		sheet.getCell(0,1).stringValue("Gross Trial Balance for the period from "+financialstart[8:10]+financialstart[4:8]+financialstart[0:4]+" to "+calculateto[8:10]+calculateto[4:8]+calculateto[0:4]).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
		ods.content.mergeCells(0,1,5,1)
		sheet.getColumn(4).setWidth("4cm")
		sheet.getColumn(1).setWidth("8cm")
		sheet.getCell(0,2).stringValue("Sr. No.").setBold(True).setAlignHorizontal("center")
		sheet.getCell(1, 2).stringValue("Account Name").setBold(True)
		sheet.getCell(2, 2).stringValue("Debit").setBold(True).setAlignHorizontal("right")
		sheet.getCell(3, 2).stringValue("Credit").setBold(True).setAlignHorizontal("right")

		sheet.getCell(4, 2).stringValue("Group Name").setBold(True).setAlignHorizontal("center")
		row = 3
		for record in records:
			sheet.getCell(0,row).stringValue(record["srno"]).setAlignHorizontal("center")
			sheet.getCell(1, row).stringValue(record["accountname"])
			if record["advflag"]==1:
				if record["Dr balance"] > record["Cr balance"]:
					sheet.getCell(2, row).stringValue(record["Dr balance"]).setAlignHorizontal("right").setBold(True).setFontColor("#ff0000")
					sheet.getCell(3, row).stringValue(record["Cr balance"]).setAlignHorizontal("right")
				elif record["Dr balance"] < record["Cr balance"]:
					sheet.getCell(2, row).stringValue(record["Dr balance"]).setAlignHorizontal("right")
					sheet.getCell(3, row).stringValue(record["Cr balance"]).setAlignHorizontal("right").setBold(True).setFontColor("#ff0000")
			else:
				sheet.getCell(2, row).stringValue(record["Dr balance"]).setAlignHorizontal("right")
				sheet.getCell(3, row).stringValue(record["Cr balance"]).setAlignHorizontal("right")
			sheet.getCell(4, row).stringValue(record["groupname"]).setAlignHorizontal("center")
			row+=1

	elif trialbalancetype == 3:
		ods.content.mergeCells(0,0,8,1)
		sheet.getRow(1).setHeight("18pt")
		sheet.getCell(0,1).stringValue("Extended Trial Balance for the period from "+financialstart[8:10]+financialstart[4:8]+financialstart[0:4]+" to "+calculateto[8:10]+calculateto[4:8]+calculateto[0:4]).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
		ods.content.mergeCells(0,1,8,1)
		sheet.getColumn(1).setWidth("8cm")
		sheet.getColumn(2).setWidth("3cm")
		sheet.getColumn(5).setWidth("3cm")
		sheet.getColumn(6).setWidth("3cm")
		sheet.getColumn(7).setWidth("4cm")
		sheet.getCell(0,2).stringValue("Sr. No.").setAlignHorizontal("center").setBold(True)
		sheet.getCell(1, 2).stringValue("Account Name").setBold(True)
		sheet.getCell(2, 2).stringValue("Opening Balance").setAlignHorizontal("right").setBold(True)
		sheet.getCell(3, 2).stringValue("Total Debit").setAlignHorizontal("right").setBold(True)
		sheet.getCell(4, 2).stringValue("Total Credit").setAlignHorizontal("right").setBold(True)
		sheet.getCell(5, 2).stringValue("Debit Balance").setAlignHorizontal("right").setBold(True)
		sheet.getCell(6, 2).stringValue("Credit Balance").setAlignHorizontal("right").setBold(True)
		sheet.getCell(7, 2).stringValue("Group Name").setAlignHorizontal("center").setBold(True)
		row = 3
		for record in records:
			sheet.getCell(0,row).stringValue(record["srno"]).setAlignHorizontal("center")
			sheet.getCell(1, row).stringValue(record["accountname"])
			sheet.getCell(2, row).stringValue(record["openingbalance"]).setAlignHorizontal("right")
			sheet.getCell(3, row).stringValue(record["totaldr"]).setAlignHorizontal("right")
			sheet.getCell(4, row).stringValue(record["totalcr"]).setAlignHorizontal("right")
			if record["advflag"]==1:
				sheet.getCell(5, row).stringValue(record["curbaldr"]).setAlignHorizontal("right").setBold(True).setFontColor("#ff0000")
				sheet.getCell(6, row).stringValue(record["curbalcr"]).setAlignHorizontal("right").setBold(True).setFontColor("#ff0000")
			else:
				sheet.getCell(5, row).stringValue(record["curbaldr"]).setAlignHorizontal("right")
				sheet.getCell(6, row).stringValue(record["curbalcr"]).setAlignHorizontal("right")
			sheet.getCell(7, row).stringValue(record["groupname"]).setAlignHorizontal("center")
			row+=1

	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	return Response(rep, headerlist=headerList.items())

	#else:
		#return {"gkstatus":1}
