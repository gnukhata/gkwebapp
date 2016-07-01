
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
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
from odslib import ODS
import calendar

@view_config(route_name="printconvbalsheetreport")
def printconvbalsheetreport(request):
	calculateto = request.params["calculateto"]
	header={"gktoken":request.headers["gktoken"]}
	fystart = str(request.params["fystart"]);
	orgname = str(request.params["orgname"])
	fyend = str(request.params["fyend"]);
	orgtype = str(request.params["orgtype"])
	result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
	calculateto = calculateto[8:10]+calculateto[4:8]+calculateto[0:4]
	sources = result.json()["gkresult"]["leftlist"]
	applications = result.json()["gkresult"]["rightlist"]

	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.getRow(0).setHeight("23pt")
	sheet.getCell(0,0).stringValue(orgname+" (FY: "+fystart+" to "+fyend+")").setBold(True).setAlignHorizontal("center").setFontSize("16pt")
	ods.content.mergeCells(0,0,8,1)
	sheet.getRow(1).setHeight("18pt")
	ods.content.mergeCells(0,1,8,1)
	sheet.getColumn(0).setWidth("8cm")
	sheet.getColumn(1).setWidth("2.5cm")
	sheet.getColumn(2).setWidth("2.5cm")
	sheet.getColumn(3).setWidth("2.5cm")
	sheet.getColumn(4).setWidth("8cm")
	sheet.getColumn(5).setWidth("2.5cm")
	sheet.getColumn(6).setWidth("2.5cm")
	sheet.getColumn(7).setWidth("2.5cm")
	if orgtype == "Profit Making":
		sheet.getCell(0,1).stringValue("Conventional Balance Sheet as on "+calculateto).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
		sheet.getCell(0,2).stringValue("Capital and Liabilities").setBold(True)
	if orgtype == "Not For Profit":
		sheet.getCell(0,1).stringValue("Conventional Statement of Affairs as on "+calculateto).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
		sheet.getCell(0,2).stringValue("Corpus and Liabilities").setBold(True)
	sheet.getCell(3,2).stringValue("Amount").setBold(True)
	sheet.getCell(4,2).stringValue("Property and Assets").setBold(True)
	sheet.getCell(7,2).stringValue("Amount").setBold(True)
	row = 2
	for record in sources:
		if record["groupAccname"]!="":
			if record["groupAccname"]!="Sources:":
				if record["groupAccname"]=="Total" or record["groupAccname"]=="Sources:" or record["groupAccname"]=="Difference" :
					sheet.getCell(0,row).stringValue(record["groupAccname"].upper()).setBold(True)
				elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
					sheet.getCell(0,row).stringValue("			   "+record["groupAccname"])
				elif record["groupAccflag"]==1 :
					sheet.getCell(0,row).stringValue("			   			   "+record["groupAccname"])
				elif record["groupAccflag"]==2:
					sheet.getCell(0,row).stringValue("			   			   "+record["groupAccname"])
				else:
					sheet.getCell(0,row).stringValue(record["groupAccname"].upper())

			if record["groupAccflag"]==2 or record["groupAccflag"]==1:
				if record["advflag"]==1:
					sheet.getCell(1,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
				else:
					sheet.getCell(1,row).stringValue(record["amount"]).setAlignHorizontal("right")
			elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
				if record["advflag"]==1:
					sheet.getCell(2,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
				else:
					sheet.getCell(2,row).stringValue(record["amount"]).setAlignHorizontal("right")
			else:
				if record["advflag"]==1:
					sheet.getCell(3,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
				else:
					sheet.getCell(3,row).stringValue(record["amount"]).setAlignHorizontal("right").setBold(True)
			row += 1

	row = 2
	for record in applications:
		if record["groupAccname"]!="":
			if record["groupAccname"]!="Applications:":
				if record["groupAccname"]=="Total" or record["groupAccname"]=="Sources:" or record["groupAccname"]=="Difference" :
					sheet.getCell(4,row).stringValue(record["groupAccname"].upper()).setBold(True)
				elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
					sheet.getCell(4,row).stringValue("			   "+record["groupAccname"])
				elif record["groupAccflag"]==1 :
					sheet.getCell(4,row).stringValue("			   			   "+record["groupAccname"])
				elif record["groupAccflag"]==2:
					sheet.getCell(4,row).stringValue("			   			   "+record["groupAccname"])
				else:
					sheet.getCell(4,row).stringValue(record["groupAccname"].upper())

			if record["groupAccflag"]==2 or record["groupAccflag"]==1:
				if record["advflag"]==1:
					sheet.getCell(5,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
				else:
					sheet.getCell(5,row).stringValue(record["amount"]).setAlignHorizontal("right")
			elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
				if record["advflag"]==1:
					sheet.getCell(6,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
				else:
					sheet.getCell(6,row).stringValue(record["amount"]).setAlignHorizontal("right")
			else:
				if record["advflag"]==1:
					sheet.getCell(7,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
				else:
					sheet.getCell(7,row).stringValue(record["amount"]).setAlignHorizontal("right").setBold(True)
			row += 1


	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	return Response(rep, headerlist=headerList.items())


@view_config(route_name="printsourcesandappfundreport")
def printsourcesandappfundreport(request):
	calculateto = request.params["calculateto"]
	header={"gktoken":request.headers["gktoken"]}
	fystart = str(request.params["fystart"]);
	orgname = str(request.params["orgname"])
	fyend = str(request.params["fyend"]);
	result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=2"%(calculateto), headers=header)
	calculateto = calculateto[8:10]+calculateto[4:8]+calculateto[0:4]
	sources = result.json()["gkresult"]["leftlist"]
	applications = result.json()["gkresult"]["rightlist"]

	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.getRow(0).setHeight("23pt")
	sheet.getCell(0,0).stringValue(orgname+" (FY: "+fystart+" to "+fyend+")").setBold(True).setAlignHorizontal("center").setFontSize("16pt")
	ods.content.mergeCells(0,0,4,1)
	sheet.getRow(1).setHeight("18pt")
	sheet.getCell(0,1).stringValue("Statement of Sources and Applications of Funds as on "+calculateto).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	ods.content.mergeCells(0,1,4,1)
	sheet.getColumn(0).setWidth("8cm")
	sheet.getColumn(1).setWidth("3cm")
	sheet.getColumn(2).setWidth("3cm")
	sheet.getColumn(3).setWidth("3cm")
	row = 2
	for record in sources:
		if record["groupAccname"]=="Total" or record["groupAccname"]=="Sources:" or record["groupAccname"]=="Difference" :
			sheet.getCell(0,row).stringValue(record["groupAccname"].upper()).setBold(True)
		elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
			sheet.getCell(0,row).stringValue("			   "+record["groupAccname"])
		elif record["groupAccflag"]==1 :
			sheet.getCell(0,row).stringValue("			   			   "+record["groupAccname"])
		elif record["groupAccflag"]==2:
			sheet.getCell(0,row).stringValue("			   			   "+record["groupAccname"])
		else:
			sheet.getCell(0,row).stringValue(record["groupAccname"].upper())

		if record["groupAccflag"]==2 or record["groupAccflag"]==1:
			if record["advflag"]==1:
				sheet.getCell(1,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
			else:
				sheet.getCell(1,row).stringValue(record["amount"]).setAlignHorizontal("right")
		elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
			if record["advflag"]==1:
				sheet.getCell(2,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
			else:
				sheet.getCell(2,row).stringValue(record["amount"]).setAlignHorizontal("right")
		else:
			if record["advflag"]==1:
				sheet.getCell(3,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
			else:
				sheet.getCell(3,row).stringValue(record["amount"]).setAlignHorizontal("right").setBold(True)
		row += 1

	for record in applications:
		if record["groupAccname"]=="Total" or record["groupAccname"]=="Sources:" or record["groupAccname"]=="Difference" :
			sheet.getCell(0,row).stringValue(record["groupAccname"].upper()).setBold(True)
		elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
			sheet.getCell(0,row).stringValue("			   "+record["groupAccname"])
		elif record["groupAccflag"]==1 :
			sheet.getCell(0,row).stringValue("			   			   "+record["groupAccname"])
		elif record["groupAccflag"]==2:
			sheet.getCell(0,row).stringValue("			   			   "+record["groupAccname"])
		else:
			sheet.getCell(0,row).stringValue(record["groupAccname"].upper())

		if record["groupAccflag"]==2 or record["groupAccflag"]==1:
			if record["advflag"]==1:
				sheet.getCell(1,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
			else:
				sheet.getCell(1,row).stringValue(record["amount"]).setAlignHorizontal("right")
		elif (record["groupAccflag"]=="" and record["subgroupof"]!=""):
			if record["advflag"]==1:
				sheet.getCell(2,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
			else:
				sheet.getCell(2,row).stringValue(record["amount"]).setAlignHorizontal("right")
		else:
			if record["advflag"]==1:
				sheet.getCell(3,row).stringValue(record["amount"]).setAlignHorizontal("right").setFontColor("#ff0000").setBold(True)
			else:
				sheet.getCell(3,row).stringValue(record["amount"]).setAlignHorizontal("right").setBold(True)
		row += 1


	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	return Response(rep, headerlist=headerList.items())


@view_config(route_name="showbalancesheet", renderer="gkwebapp:templates/viewbalancesheet.jinja2")
def showbalancesheet(request):
	return {"gkstatus":0}

@view_config(route_name="showbalancesheetreport")
def showbalancesheetreport(request):
	calculateto = request.params["calculateto"]
	balancesheettype = request.params["balancesheettype"]
	orgtype = request.params["orgtype"]
	header={"gktoken":request.headers["gktoken"]}
	if balancesheettype == "conventionalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/conventionalbalancesheetreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":"verticalbalancesheet","to":calculateto,"orgtype":orgtype},request=request)
	if balancesheettype == "verticalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=2"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/sourcesandapplicationoffundsreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":"conventionalbalancesheet","to":calculateto,"orgtype":orgtype},request=request)
