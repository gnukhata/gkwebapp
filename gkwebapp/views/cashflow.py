
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
from spreadsheettable import SpreadsheetTable
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from pyramid.response import Response
import os
import calendar
from formula import TotalPagesColSum, PreviousPagesColSum


@view_config(route_name="showcashflow", renderer="gkwebapp:templates/viewcashflow.jinja2")
def showcashflow(request):
	return {"gkstatus":0}

@view_config(route_name="cashflowreportprint")
def cashflowreportprint(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	calculatefrom = request.params["calculatefrom"]
	orgtype = request.params["orgtype"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=cashflow&calculateto=%s&financialstart=%s&calculatefrom=%s"%(calculateto,financialstart,calculatefrom), headers=header)

	return render_to_response("gkwebapp:templates/printcashflowreport.jinja2",{"rcrecords":result.json()["rcgkresult"],"pyrecords":result.json()["pygkresult"],"orgtype":orgtype,"backflag":4,"from":datetime.strftime(datetime.strptime(str(calculatefrom),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)

@view_config(route_name="showcashflowreport")
def showcashflowreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	calculatefrom = request.params["calculatefrom"]
	orgtype = request.params["orgtype"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=cashflow&calculateto=%s&financialstart=%s&calculatefrom=%s"%(calculateto,financialstart,calculatefrom), headers=header)

	return render_to_response("gkwebapp:templates/cashflowreport.jinja2",{"rcrecords":result.json()["rcgkresult"],"pyrecords":result.json()["pygkresult"],"orgtype":orgtype,"backflag":4,"from":datetime.strftime(datetime.strptime(str(calculatefrom),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)

@view_config(route_name="printcashflowreport")
def printcashflowreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["fystart"]
	calculatefrom = request.params["calculatefrom"]
	orgname = request.params["orgname"]
	orgtype = request.params["orgtype"]
	fyend = str(request.params["fyend"])
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=cashflow&calculateto=%s&financialstart=%s&calculatefrom=%s"%(calculateto,financialstart,calculatefrom), headers=header)
	receipt = result.json()["rcgkresult"]
	payment = result.json()["pygkresult"]
	fystart = str(request.params["fystart"]);
	orgname = str(request.params["orgname"])
	calculateto = calculateto[8:10]+calculateto[4:8]+calculateto[0:4]
	calculatefrom = calculatefrom[8:10]+calculatefrom[4:8]+calculatefrom[0:4]

	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.getRow(0).setHeight("23pt")
	sheet.getCell(0,0).stringValue(orgname+" (FY: "+fystart+" to "+fyend+")").setBold(True).setAlignHorizontal("center").setFontSize("16pt")
	ods.content.mergeCells(0,0,8,1)
	sheet.getRow(1).setHeight("18pt")
	if orgtype=="Profit Making":
		sheet.setSheetName("Cash Flow Statement")
		sheet.getCell(0,1).stringValue("Cash Flow Statement ("+calculatefrom+" to "+calculateto+")").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	if orgtype=="Not For Profit":
		sheet.setSheetName("Receipt & Payment Account")
		sheet.getCell(0,1).stringValue("Receipt & Payment Account ("+calculatefrom+" to "+calculateto+")").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	ods.content.mergeCells(0,1,8,1)
	sheet.getColumn(0).setWidth("1cm")
	sheet.getColumn(1).setWidth("8cm")
	sheet.getColumn(2).setWidth("3cm")
	sheet.getColumn(3).setWidth("3cm")
	sheet.getColumn(4).setWidth("1cm")
	sheet.getColumn(5).setWidth("8cm")
	sheet.getColumn(6).setWidth("3cm")
	sheet.getColumn(7).setWidth("3cm")
	sheet.getCell(1,2).stringValue("Particulars").setBold(True)
	sheet.getCell(2,2).stringValue("Amount").setBold(True).setAlignHorizontal("right")
	sheet.getCell(3,2).stringValue("Amount").setBold(True).setAlignHorizontal("right")
	sheet.getCell(5,2).stringValue("Particulars").setBold(True)
	sheet.getCell(6,2).stringValue("Amount").setBold(True).setAlignHorizontal("right")
	sheet.getCell(7,2).stringValue("Amount").setBold(True).setAlignHorizontal("right")
	row = 3
	for account in receipt:
		sheet.getCell(0, row).stringValue(account["toby"])
		if account["toby"]!="" and account["particulars"]!="Opening balance":
			sheet.getCell(1, row).stringValue("			"+account["particulars"])
			sheet.getCell(2, row).stringValue(account["amount"]).setAlignHorizontal("right")
			sheet.getCell(3, row).stringValue("").setAlignHorizontal("right")
		else:
			sheet.getCell(1, row).stringValue(account["particulars"])
			sheet.getCell(2, row).stringValue("").setAlignHorizontal("right")
			sheet.getCell(3, row).stringValue(account["amount"]).setAlignHorizontal("right")
		row += 1

	row = 3
	for account in payment:
		sheet.getCell(4, row).stringValue(account["toby"])
		if account["toby"]!="" and account["particulars"]!="Closing balance":
			sheet.getCell(5, row).stringValue("			"+account["particulars"])
			sheet.getCell(6, row).stringValue(account["amount"]).setAlignHorizontal("right")
			sheet.getCell(7, row).stringValue("").setAlignHorizontal("right")
		else:
			sheet.getCell(5, row).stringValue(account["particulars"])
			sheet.getCell(6, row).stringValue("").setAlignHorizontal("right")
			sheet.getCell(7, row).stringValue(account["amount"]).setAlignHorizontal("right")
		row += 1

	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	os.remove("response.ods")
	return Response(rep, headerlist=headerList.items())
