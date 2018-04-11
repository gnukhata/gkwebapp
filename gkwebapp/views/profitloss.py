
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
import openpyxl
from openpyxl.styles import Font, Alignment
import calendar

@view_config(route_name = "printprofitandloss", renderer = "")
def printprofitandloss(request):
    calculateto = request.params["calculateto"]
    orgtype = request.params["orgtype"]
    header={"gktoken":request.headers["gktoken"]}
    fyend = str(request.params["fyend"])
    result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
    DirectIncome = result.json()["gkresult"]["Direct Income"]
    InDirectIncome = result.json()["gkresult"]["Indirect Income"]
    DirectExpense = result.json()["gkresult"]["Direct Expense"]
    InDirectExpense = result.json()["gkresult"]["Indirect Expense"]
    net = {}
    try:
        net["netprofit"] = result.json()["gkresult"]["netprofit"]
    except:
        net["netloss"] = result.json()["gkresult"]["netloss"]
    Total = result.json()["gkresult"]["Total"]
    fystart = str(request.params["fystart"])
    orgname = str(request.params["orgname"])
    calculateto = calculateto[8:10]+calculateto[4:8]+calculateto[0:4]
    # A workbook is opened.
    pandlwb = openpyxl.Workbook()
    # The new sheet is the active sheet as no other sheet exists. It is set as value of variable - sheet.
    sheet = pandlwb.active
    # Title of the sheet and width of columns are set.
    sheet.title = "List of Accounts"
    sheet.column_dimensions['A'].width = 40
    sheet.column_dimensions['B'].width = 15
    sheet.column_dimensions['C'].width = 40
    sheet.column_dimensions['D'].width = 15
    # Cells of first two rows are merged to display organisation details properly.
    sheet.merge_cells('A1:D2')
    # Font and Alignment of cells are set. Each cell can be identified using the cell index - column name and row number.
    sheet['A1'].font = Font(name='Liberation Serif',size='16',bold=True)
    sheet['A1'].alignment = Alignment(horizontal = 'center', vertical='center')
    # Organisation name and financial year are displayed.
    sheet['A1'] = orgname + ' (FY: ' + fystart + ' to ' + fyend +')'
    sheet.merge_cells('A3:D3')
    sheet['A3'].font = Font(name='Liberation Serif',size='14',bold=True)
    sheet['A3'].alignment = Alignment(horizontal = 'center', vertical='center')
    if orgtype == "Profit Making":
        sheet['A3'] = 'Profit and Loss'
    else:
        sheet['A3'] = 'Income and Expenditure'
    sheet.merge_cells('A3:G3')
    sheet['A4'] = 'Particulars'
    sheet['B4'] = 'Amount'
    sheet['C4'] = 'Particulars'
    sheet['D4'] = 'Amount'
    titlerow = sheet.row_dimensions[4]
    titlerow.font = Font(name='Liberation Serif',size=12,bold=True)
    sheet['A5'] = "DIRECT EXPENSE"
    sheet['B5'] = DirectExpense["direxpbal"]
    grouprow = sheet.row_dimensions[5]
    grouprow.font = Font(name='Liberation Serif',size=12,bold=True)
    row = 6
    if "Purchase" in DirectExpense:
        sheet["A" + str(row)] = "PURCHASE"
        sheet["B" + str(row)] = DirectExpense["Purchase"]["balance"]
        row = row + 1
    pandlwb.save("response.xlsx")
    repFile = open("response.xlsx")
    rep = repFile.read()
    repFile.close()
    headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.xlsx', 'Set-Cookie':'fileDownload=true; path=/'}
    os.remove("response.xlsx")
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
    DirectIncome = result.json()["gkresult"]["Direct Income"]
    InDirectIncome = result.json()["gkresult"]["Indirect Income"]
    DirectExpense = result.json()["gkresult"]["Direct Expense"]
    InDirectExpense = result.json()["gkresult"]["Indirect Expense"]
    net = {}
    try:
        net["netprofit"] = result.json()["gkresult"]["netprofit"]
    except:
        net["netloss"] = result.json()["gkresult"]["netloss"]
    Total = result.json()["gkresult"]["Total"]    
    return render_to_response("gkwebapp:templates/profitlossreport.jinja2",{"DirectIncome":DirectIncome,"InDirectIncome":InDirectIncome,"DirectExpense":DirectExpense,"InDirectExpense":InDirectExpense,"net":net,"orgtype":orgtype,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y'),"Total":Total},request=request)

@view_config(route_name="showprofitlossreport", request_param="type=print", renderer="gkwebapp:templates/printprofitlossreport.jinja2")
def printprofitloss(request):
    calculateto = request.params["calculateto"]
    financialstart = request.params["financialstart"]
    orgtype = request.params["orgtype"]
    header={"gktoken":request.headers["gktoken"]}

    result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
    DirectIncome = result.json()["gkresult"]["Direct Income"]
    InDirectIncome = result.json()["gkresult"]["Indirect Income"]
    DirectExpense = result.json()["gkresult"]["Direct Expense"]
    InDirectExpense = result.json()["gkresult"]["Indirect Expense"]
    net = {}
    try:
        net["netprofit"] = result.json()["gkresult"]["netprofit"]
    except:
        net["netloss"] = result.json()["gkresult"]["netloss"]
    Total = result.json()["gkresult"]["Total"]
    return {"DirectIncome":DirectIncome,"InDirectIncome":InDirectIncome,"DirectExpense":DirectExpense,"InDirectExpense":InDirectExpense,"net":net,"orgtype":orgtype,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y'),"Total":Total}
