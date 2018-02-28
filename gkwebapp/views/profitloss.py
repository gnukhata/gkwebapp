
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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

@view_config(route_name = "printprofitandloss", renderer = "")
def printprofitandloss(request):
    calculateto = request.params["calculateto"]
    orgtype = request.params["orgtype"]
    header={"gktoken":request.headers["gktoken"]}
    fyend = str(request.params["fyend"])
    result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
    expense = result.json()["expense"]
    income = result.json()["income"]
    fystart = str(request.params["fystart"]);
    orgname = str(request.params["orgname"])
    calculateto = calculateto[8:10]+calculateto[4:8]+calculateto[0:4]

    ods = ODS()
    sheet = ods.content.getSheet(0)
    sheet.getRow(0).setHeight("23pt")
    sheet.getCell(0,0).stringValue(orgname+" (FY: "+fystart+" to "+fyend+")").setBold(True).setAlignHorizontal("center").setFontSize("16pt")
    ods.content.mergeCells(0,0,6,1)
    sheet.getRow(1).setHeight("18pt")
    if orgtype=="Profit Making":
        sheet.setSheetName("Profit & Loss")
        sheet.getCell(0,1).stringValue("Profit & Loss ("+fystart+" to "+calculateto+")").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
    if orgtype=="Not For Profit":
        sheet.setSheetName("Income & Expenditure")
        sheet.getCell(0,1).stringValue("Income & Expenditure ("+fystart+" to "+calculateto+")").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
    ods.content.mergeCells(0,1,6,1)
    sheet.getColumn(0).setWidth("1cm")
    sheet.getColumn(1).setWidth("8cm")
    sheet.getColumn(2).setWidth("3cm")
    sheet.getColumn(3).setWidth("1cm")
    sheet.getColumn(4).setWidth("8cm")
    sheet.getColumn(5).setWidth("3cm")
    sheet.getCell(1,2).stringValue("Particulars").setBold(True)
    sheet.getCell(2,2).stringValue("Amount").setBold(True).setAlignHorizontal("right")
    sheet.getCell(4,2).stringValue("Particulars").setBold(True)
    sheet.getCell(5,2).stringValue("Amount").setBold(True).setAlignHorizontal("right")
    row = 3
    for account in expense:
        sheet.getCell(0, row).stringValue(account["toby"])
        sheet.getCell(1, row).stringValue(account["accountname"])
        sheet.getCell(2, row).stringValue(account["amount"]).setAlignHorizontal("right")
        row += 1

    row = 3
    for account in income:
        sheet.getCell(3, row).stringValue(account["toby"])
        sheet.getCell(4, row).stringValue(account["accountname"])
        sheet.getCell(5, row).stringValue(account["amount"]).setAlignHorizontal("right")
        row += 1

    ods.save("response.ods")
    repFile = open("response.ods")
    rep = repFile.read()
    repFile.close()
    headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
    os.remove("response.ods")
    return Response(rep, headerlist=headerList.items())


@view_config(route_name="showprofitloss", renderer="gkwebapp:templates/viewprofitloss.jinja2")
def showprofitloss(request):
    orgtype = request.params["orgtype"]
    return {"gkstatus":0,"orgtype":orgtype}

@view_config(route_name="showprofitlossreport")
def showprofitlossreport(request):
    calculateto = request.params["calculateto"]
    financialstart = request.params["financialstart"]
    orgtype = request.params["orgtype"]
    header={"gktoken":request.headers["gktoken"]}

    result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
 
    return render_to_response("gkwebapp:templates/profitlossreport.jinja2",{"expense":result.json()["expense"],"income":result.json()["income"],"orgtype":orgtype,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
