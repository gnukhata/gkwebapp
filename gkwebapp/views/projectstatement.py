
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
from formula import CurrentPageColSum, PreviousPagesColSum, RowNumber
from spreadsheettable import SpreadsheetTable

@view_config(route_name="printprojectstatementreport", renderer = "")
def printprojectstatementreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["fystart"]
	projectcode = int(request.params["projectcode"])
	projectname = request.params["projectname"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=projectstatement&calculateto=%s&financialstart=%s&projectcode=%d"%(calculateto,financialstart,projectcode), headers=header)
	result = result.json()["gkresult"]
	fystart = str(request.params["fystart"]);
	fyend = str(request.params["fyend"]);
	fystart = fystart[8:10]+fystart[4:8]+fystart[0:4]
	fyend = fyend[8:10]+fyend[4:8]+fyend[0:4]
	calculateto = str(request.params["calculateto"])
	calculateto = calculateto[8:10]+calculateto[4:8]+calculateto[0:4]
	orgname = str(request.params["orgname"])
	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.setSheetName("Project Statement ("+projectname+")")
	sheet.getRow(0).setHeight("23pt")

	sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("18pt")
	ods.content.mergeCells(0,0,5,1)
	sheet.getRow(1).setHeight("18pt")
	sheet.getCell(0,1).stringValue("Statement for: "+projectname+ " ("+fystart+" to "+calculateto+")").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	ods.content.mergeCells(0,1,5,1)
	sheet.getColumn(1).setWidth("8cm")
	sheet.getColumn(2).setWidth("4cm")
	sheet.getColumn(3).setWidth("3cm")
	sheet.getColumn(4).setWidth("3cm")
	sheet.getCell(0,2).stringValue("Sr. No.").setBold(True)
	sheet.getCell(1,2).stringValue("Account Name").setBold(True)
	sheet.getCell(2,2).stringValue("Group Name").setBold(True)
	sheet.getCell(3,2).stringValue("Total Outgoing").setBold(True)
	sheet.getCell(4,2).stringValue("Total Incoming").setBold(True)
	row = 3;
	for transaction in result:
		sheet.getCell(0, row).stringValue(transaction["srno"])
		sheet.getCell(1, row).stringValue(transaction["accountname"])
		sheet.getCell(2, row).stringValue(transaction["groupname"])
		sheet.getCell(3, row).stringValue(transaction["totalout"]).setAlignHorizontal("right")
		sheet.getCell(4, row).stringValue(transaction["totalin"]).setAlignHorizontal("right")
		row += 1

	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	return Response(rep, headerlist=headerList.items())


@view_config(route_name="showviewprojectstatement", renderer="gkwebapp:templates/viewprojectstatement.jinja2")
def showviewprojectstatement(request):
	header={"gktoken":request.headers["gktoken"]}
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"projects":projects.json()["gkresult"]}

@view_config(route_name="showprojectstatementreport")
def showprojectstatementreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	projectcode = int(request.params["projectcode"])
	projectname = request.params["projectname"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=projectstatement&calculateto=%s&financialstart=%s&projectcode=%d"%(calculateto,financialstart,projectcode), headers=header)
	return render_to_response("gkwebapp:templates/projectstatementreport.jinja2",{"records":result.json()["gkresult"],"projectcode":projectcode,"projectname":projectname,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
