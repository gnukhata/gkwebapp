
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
    if orgtype == "Profit Making":
        sheet.title = 'Profit and Loss'
    else:
        sheet.title = 'Income and Expenditure'
    sheet.column_dimensions['A'].width = 30
    sheet.column_dimensions['B'].width = 12
    sheet.column_dimensions['C'].width = 12
    sheet.column_dimensions['D'].width = 12
    sheet.column_dimensions['E'].width = 30
    sheet.column_dimensions['F'].width = 12
    sheet.column_dimensions['G'].width = 12
    sheet.column_dimensions['H'].width = 12
    # Cells of first two rows are merged to display organisation details properly.
    sheet.merge_cells('A1:H2')
    # Font and Alignment of cells are set. Each cell can be identified using the cell index - column name and row number.
    sheet['A1'].font = Font(name='Liberation Serif',size='16',bold=True)
    sheet['A1'].alignment = Alignment(horizontal = 'center', vertical='center')
    # Organisation name and financial year are displayed.
    sheet['A1'] = orgname + ' (FY: ' + fystart + ' to ' + fyend +')'
    sheet.merge_cells('A3:H3')
    sheet['A3'].font = Font(name='Liberation Serif',size='14',bold=True)
    sheet['A3'].alignment = Alignment(horizontal = 'center', vertical='center')
    # Setting heading of spreadsheet
    if orgtype == "Profit Making":
        sheet['A3'] = 'Profit and Loss'
    else:
        sheet['A3'] = 'Income and Expenditure'
    # Setting title for columns.
    sheet['A4'] = 'Particulars'
    sheet['D4'] = 'Amount'
    sheet['D4'].alignment = Alignment(horizontal = "right")
    sheet.merge_cells('B4:D4')
    sheet.merge_cells('F4:H4')
    sheet['E4'] = 'Particulars'
    sheet['F4'] = 'Amount'
    sheet['F4'].alignment = Alignment(horizontal = "right")
    titlerow = sheet.row_dimensions[4]
    # Making text bold for titles.
    titlerow.font = Font(name='Liberation Serif',size=12,bold=True)
    #Loiading data for Direct Expense group
    sheet['A5'] = "DIRECT EXPENSE"
    sheet['D5'] = DirectExpense["direxpbal"]
    sheet["D5"].alignment = Alignment(horizontal = "right")
    grouprow = sheet.row_dimensions[5]
    grouprow.font = Font(name='Liberation Serif',size=12,bold=True)
    row = 6
    # If Purchase accounts are there they are displayed on the top
    if "Purchase" in DirectExpense:
        sheet["A" + str(row)] = "        PURCHASE"
        sheet["A" + str(row)].font = Font(name='Liberation Serif',size=12,italic=False)
        sheet["C" + str(row)] = DirectExpense["Purchase"]["balance"]
        sheet["C" + str(row)].alignment = Alignment(horizontal = "right")
        row = row + 1
    
    for purchaseaccount in DirectExpense["Purchase"]:
        if purchaseaccount != "balance":
            sheet["A" + str(row)] = "                " + purchaseaccount
            sheet["B" + str(row)] = DirectExpense["Purchase"][purchaseaccount]
            sheet["B" + str(row)].alignment = Alignment(horizontal = "right")
            row = row + 1

    for subgroup in DirectExpense:
        if subgroup != "Purchase" and "balance" in DirectExpense[subgroup]:
            try:
                sheet["A" + str(row)] = "        " + subgroup.upper()
            except:
                sheet["A" + str(row)] = "        " + subgroup
            sheet["A" + str(row)].font = Font(name='Liberation Serif',size=12,italic=False)
            sheet["C" + str(row)] = DirectExpense[subgroup]["balance"]
            sheet["C" + str(row)].alignment = Alignment(horizontal = "right")
            row = row + 1
            for subgroupaccount in DirectExpense[subgroup]:
                if subgroupaccount != "balance":
                    sheet["A" + str(row)] = "                " + subgroupaccount
                    sheet["A" + str(row)].font = Font(name='Liberation Serif',size=12,italic=True)
                    sheet["B" + str(row)] = DirectExpense[subgroup][subgroupaccount]
                    sheet["B" + str(row)].alignment = Alignment(horizontal = "right")
                    row = row + 1
        if subgroup != "Purchase" and subgroup != "direxpbal" and "balance" not in DirectExpense[subgroup]:
            sheet["A" + str(row)] = "        " + subgroup
            sheet["A" + str(row)].font = Font(name='Liberation Serif',size=12,italic=True)
            sheet["C" + str(row)] = DirectExpense[subgroup]
            sheet["C" + str(row)].alignment = Alignment(horizontal = "right")
            row = row + 1

    #Loading data for Indirect Expense group.
    sheet["A" + str(row)] = "INDIRECT EXPENSE"
    sheet["D" + str(row)] = InDirectExpense["indirexpbal"]
    sheet["D" + str(row)].alignment = Alignment(horizontal = "right")
    grouprow = sheet.row_dimensions[5]
    grouprow.font = Font(name='Liberation Serif',size=12,bold=True)
    row = row + 1
    
    for subgroup in InDirectExpense:
        if "balance" in InDirectExpense[subgroup]:
            try:
                sheet["A" + str(row)] = "        " + subgroup.upper()
            except:
                sheet["A" + str(row)] = "        " + subgroup
            sheet["A" + str(row)].font = Font(name='Liberation Serif',size=12,italic=False)
            sheet["C" + str(row)] = InDirectExpense[subgroup]["balance"]
            sheet["C" + str(row)].alignment = Alignment(horizontal = "right")
            row = row + 1
            for subgroupaccount in InDirectExpense[subgroup]:
                if subgroupaccount != "balance":
                    sheet["A" + str(row)] = "                " + subgroupaccount
                    sheet["A" + str(row)].font = Font(name='Liberation Serif',size=12,italic=True)
                    sheet["B" + str(row)] = InDirectExpense[subgroup][subgroupaccount]
                    sheet["B" + str(row)].alignment = Alignment(horizontal = "right")
                    row = row + 1
        if subgroup != "Purchase" and subgroup != "indirexpbal" and "balance" not in InDirectExpense[subgroup]:
            sheet["A" + str(row)] = "        " + subgroup
            sheet["A" + str(row)].font = Font(name='Liberation Serif',size=12,italic=True)
            sheet["C" + str(row)] = InDirectExpense[subgroup]
            sheet["C" + str(row)].alignment = Alignment(horizontal = "right")
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
