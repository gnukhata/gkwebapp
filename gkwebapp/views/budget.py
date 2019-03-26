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
   "Krishnakant Mane" <kk@gmail.com>
   "Karan Kamdar" <kamdar.karan@gmail.com>
   "Prajkta Patkar" <prajkta@riseup.com>
   "Abhijith Balan" <abhijith@dff.org.in>
   "rohan khairnar" <rohankhairnar@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side
import os
from pyramid.i18n import default_locale_negotiator
s = requests.session()
from PIL import Image
import base64
import cStringIO

@view_config(route_name="budget", renderer="gkwebapp:templates/budget.jinja2")
def budget(request):
    header={"gktoken":request.headers["gktoken"]}
    return {"status":True}

@view_config(route_name="budget",request_param="type=addtab", renderer="gkwebapp:templates/createbudget.jinja2")
def addbudgetpage(request):
    header={"gktoken":request.headers["gktoken"]}
    return {"status":True}

@view_config(route_name="budget",request_param="type=balance", renderer="gkwebapp:templates/createbudgetaccountstable.jinja2")
def balance(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/budget?type=addtab&financialstart=%s&uptodate=%s&btype=%d"%(request.params["financialstart"],request.params["uptodate"],int(request.params["budgettype"])), headers=header)
    
    return {"status":result.json()["gkstatus"],"gkresult":result.json()["gkresult"],"btype":int(request.params["budgettype"])}

@view_config(route_name="budget",request_param="type=edittab", renderer="gkwebapp:templates/editbudget.jinja2")
def editbudgetpage(request):
    header={"gktoken":request.headers["gktoken"]}
    return {"status":True}

@view_config(route_name="budget",request_param="type=viewbudgetreportpage", renderer="gkwebapp:templates/viewbudgetreport.jinja2")
def viewreportpage(request):
    header={"gktoken":request.headers["gktoken"]}
    return {"status":True,"menuflag":int(request.params["menuflag"])}

@view_config(route_name="budget",request_param="type=bdg_list", renderer="json")
def alllist(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/budget?bud=all&btype=%d"%int(request.params["btype"]), headers=header)
    buddata=[]
    for record in result.json()["gkresult"]:
        gdata= {"budname":str(record["budname"]),"budid":str(record["budid"]),"startdate": record["startdate"],"enddate": record["enddate"]}
        buddata.append(gdata)
    return {"gkresult":buddata,"numberofbudget":len(result.json()["gkresult"]),"status":True}
    
@view_config(route_name="budget",request_param="type=getbuddetails", renderer="json")
def getbuddetails(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/budget?bud=details&budid=%d"%int(request.params["budid"]), headers=header)
    
    if(result.json()["gkstatus"] == 0):
        record = result.json()["gkresult"]
        return {"gkstatus":0, "gkresult":record}
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="budget",request_param="type=add", renderer="json")
def addbudget(request):
    header={"gktoken":request.headers["gktoken"]}
    if "goid" in request.params:
        gkdata = {"goid":int(request.params["goid"]),"budname":request.params["budname"],"startdate":request.params["startdate"],"enddate":request.params["enddate"], "contents":json.loads(request.params["contents"])[0], "budtype":int(request.params["btype"]), "gaflag":int(request.params["gaflag"])}
    else:
        gkdata = {"budname":request.params["budname"],"startdate":request.params["startdate"],"enddate":request.params["enddate"], "contents":json.loads(request.params["contents"])[0], "budtype":int(request.params["btype"]), "gaflag":int(request.params["gaflag"])}

    result = requests.post("http://127.0.0.1:6543/budget", data =json.dumps(gkdata),headers=header)
    if result.json()["gkstatus"] == 0:
        gkdata = {"activity":request.params["budname"] + " budget created"}   
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="budget",request_param="type=edit", renderer="json")
def editbudget(request):
    header={"gktoken":request.headers["gktoken"]}
    gkdata = {"budid":request.params["budid"],"budname":request.params["budname"],"startdate":request.params["startdate"], "enddate":request.params["enddate"], "contents": json.loads(request.params["contents"])[0], "budtype":request.params["btype"],"gaflag":request.params["gaflag"]}
    result = requests.put("http://127.0.0.1:6543/budget", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="budget",request_param="type=delete", renderer="json")
def deletebudget(request):
    header={"gktoken":request.headers["gktoken"]}
    budname = request.params["budname"]
    gkdata={"budid":request.params["budid"]}
    result = requests.delete("http://127.0.0.1:6543/budget",data =json.dumps(gkdata), headers=header)
    if result.json()["gkstatus"] == 0:
        gkdata = {"activity":budname + " budget deleted"}
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="budget",request_param="type=report", renderer="gkwebapp:templates/budgetreport.jinja2")
def budgetreport(request):
    header={"gktoken":request.headers["gktoken"]}
    financialstart = request.params["financialstart"]
    if (request.params["btype"] == '3'):
        result = requests.get("http://127.0.0.1:6543/budget?type=cashReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
    if (request.params["btype"] == '5'):
        result = requests.get("http://127.0.0.1:6543/budget?type=expenseReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
    if (request.params["btype"] == '19'):
        result = requests.get("http://127.0.0.1:6543/budget?type=salesReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
    
    return {"gkstatus":result.json()["gkstatus"], "gkresult":result.json()["gkresult"], "budgetdetail":request.params["buddetails"], "btype":request.params["btype"],"budid":int(request.params["budid"]),"menuflag":request.params["menuflag"] }

@view_config(route_name="budget",request_param="type=printreport", renderer="gkwebapp:templates/printbudgetreport.jinja2")
def printbudgetreport(request):
    header={"gktoken":request.headers["gktoken"]}
    financialstart = request.params["financialstart"]
    if (request.params["btype"] == '3'):
        result = requests.get("http://127.0.0.1:6543/budget?type=cashReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
    if (request.params["btype"] == '5'):
        result = requests.get("http://127.0.0.1:6543/budget?type=expenseReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
    if (request.params["btype"] == '19'):
        result = requests.get("http://127.0.0.1:6543/budget?type=salesReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)

    return {"gkstatus":result.json()["gkstatus"], "gkresult":result.json()["gkresult"], "budgetdetails":request.params["buddetails"], "budid":int(request.params["budid"]), "financialstart":financialstart,"btype":request.params["btype"],"menuflag":request.params["menuflag"] }

@view_config(route_name="budget",request_param="type=cashspreadsheet", renderer="") 
def cashspreadsheet(request):
    try:
        header={"gktoken":request.headers["gktoken"]}
        financialstart = request.params["financialstart"]
        fystart = str(request.params["fystart"])
        fyend = str(request.params["fyend"])
        orgname = str(request.params["orgname"])
        budgetdetails = str(request.params["budgetdetails"])
        result = requests.get("http://127.0.0.1:6543/budget?type=cashReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
        result = result.json()["gkresult"];
        budgetwb = openpyxl.Workbook()
        # The new sheet is the active sheet as no other sheet exists. It is set as value of variable - sheet.
        sheet = budgetwb.active
        # Title of the sheet and width of columns are set.
        sheet.title = "Cash Budget Report"

        sheet.column_dimensions['A'].width = 36
        sheet.column_dimensions['B'].width = 20
        sheet.column_dimensions['C'].width = 20
        sheet.column_dimensions['D'].width = 20
        # Cells of first two rows are merged to display organisation details properly.
        sheet.merge_cells('A1:D2')
        # Font and Alignment of cells are set. Each cell can be identified using the cell index - column name and row number.
        sheet['A1'].font = Font(name='Liberation Serif',size='16',bold=True)
        sheet['A1'].alignment = Alignment(horizontal = 'center', vertical='center')
        # Organisation name and financial year are displayed.
        sheet['A1'] = orgname + ' (FY: ' + fystart + ' to ' + fyend +')'
        sheet['A3'].font = Font(name='Liberation Serif',size='14',bold=True)
        sheet['A3'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['A3'] = 'Cash Budget Report :'+ str(budgetdetails)
        sheet.merge_cells('A3:D3')

        sheet['A4'].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['A4'].alignment = Alignment(horizontal = 'left', vertical='center')
        sheet['A4'] = 'Total Opening Balance : '+ result["totalopeningbal"]
        sheet.merge_cells('A4:D4')

        sheet['A5'] = 'Particulars'
        sheet['B5'] = 'Cash Inflow'
        sheet['C5'] = 'Cash Outflow'
        sheet['D5'] = 'Balance'
        sheet['A6'].font = Font(name='Liberation Serif' ,bold=True)
        sheet['A6'] = 'Budget Amount'
        sheet['A7'] = 'Actuals'
        sheet['A7'].font = Font(name='Liberation Serif' ,bold=True)
        titlerow = sheet.row_dimensions[5]
        titlerow.font = Font(name='Liberation Serif',size='12',bold=True)
        titlerow.alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['B6'] = result["budgetIn"]
        sheet['B6'].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['B6'].font = Font(name='Liberation Serif' )
        sheet['C6'] = result["budgetOut"]
        sheet['C6'].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['C6'].font = Font(name='Liberation Serif' )
        sheet['D6'] = result["budgetBal"]
        sheet['D6'].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D6'].font = Font(name='Liberation Serif' )
        row=8
        for budget in result["accData"]:
            sheet['A'+str(row)] = budget["accountname"]
            sheet['A'+str(row)].font = Font(italic=True )
            sheet['A'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['B'+str(row)] = budget["accDr"]
            sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['B'+str(row)].font = Font(name='Liberation Serif' )
            sheet['C'+str(row)] = budget["accCr"]
            sheet['C'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['C'+str(row)].font = Font(name='Liberation Serif' )
            sheet['D'+str(row)] = budget["accBal"]
            sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['D'+str(row)].font = Font(name='Liberation Serif' )
            row=row+1
        sheet['A'+str(row)] = 'Total'
        sheet['A'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['B'+str(row)] = result["totalDr"]
        sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['B'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['C'+str(row)] = result["totalCr"]
        sheet['C'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['C'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['D'+str(row)] = result["budgetclosingbal"]
        sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D'+str(row)].font = Font(name='Liberation Serif' ,bold=True)

        sheet['A'+str(row+1)] = 'Variance'
        sheet['A'+str(row+1)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['B'+str(row+1)] = result["varDr"]
        sheet['B'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['B'+str(row+1)].font = Font(name='Liberation Serif' )
        sheet['C'+str(row+1)] = result["varCr"]
        sheet['C'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['C'+str(row+1)].font = Font(name='Liberation Serif' )
        sheet['D'+str(row+1)] = result["varBal"]
        sheet['D'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D'+str(row+1)].font = Font(name='Liberation Serif' )

        sheet['A'+str(row+2)].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['A'+str(row+2)].alignment = Alignment(horizontal = 'left', vertical='center')
        sheet['A'+str(row+2)] = 'Budget Closing Balance : '+ result["budgetclosingbal"]
        a = 'A'+str(row+2)
        d = 'D'+str(row+2)
        sheet.merge_cells('A'+str(row+2)+':D'+str(row+2))

        budgetwb.save('report.xlsx')
        xlsxfile = open("report.xlsx","r")
        reportxslx = xlsxfile.read()
        headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(reportxslx),'Content-Disposition': 'attachment; filename=report.xlsx', 'Set-Cookie':'fileDownload=true; path=/'}
        xlsxfile.close()
        os.remove("report.xlsx")
        return Response(reportxslx, headerlist=headerList.items())       
    except:
        return {"gkstatus":3}

@view_config(route_name="budget",request_param="type=expensespreadsheet", renderer="") 
def expensespreadsheet(request):
    try:
        header={"gktoken":request.headers["gktoken"]}
        financialstart = request.params["financialstart"]
        fystart = str(request.params["fystart"])
        fyend = str(request.params["fyend"])
        orgname = str(request.params["orgname"])
        budgetdetails = str(request.params["budgetdetails"])
        result = requests.get("http://127.0.0.1:6543/budget?type=expenseReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
        result = result.json()["gkresult"]
        budgetwb = openpyxl.Workbook()
        # The new sheet is the active sheet as no other sheet exists. It is set as value of variable - sheet.
        sheet = budgetwb.active
        # Title of the sheet and width of columns are set.
        sheet.title = "Expense Budget Report"

        sheet.column_dimensions['A'].width = 36
        sheet.column_dimensions['B'].width = 25
        sheet.column_dimensions['C'].width = 25
        sheet.column_dimensions['D'].width = 25
        sheet.column_dimensions['E'].width = 25
        sheet.column_dimensions['F'].width = 25
        # Cells of first two rows are merged to display organisation details properly.
        sheet.merge_cells('A1:F2')
        # Font and Alignment of cells are set. Each cell can be identified using the cell index - column name and row number.
        sheet['A1'].font = Font(name='Liberation Serif',size='16',bold=True)
        sheet['A1'].alignment = Alignment(horizontal = 'center', vertical='center')
        # Organisation name and financial year are displayed.
        sheet['A1'] = orgname + ' (FY: ' + fystart + ' to ' + fyend +')'
        sheet['A3'].font = Font(name='Liberation Serif',size='14',bold=True)
        sheet['A3'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['A3'] = 'Expense Budget Report :'+ str(budgetdetails)
        sheet.merge_cells('A3:F3')

        sheet['A4'].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['A4'].alignment = Alignment(horizontal = 'left', vertical='center')
        sheet['A4'] = 'Total Previous Expense : '+ result["totalpreviousbal"]
        sheet.merge_cells('A4:F4')

        sheet['A5'] = 'Particulars'
        sheet['B5'] = 'Budgeted Expense'
        sheet['C5'] = 'Actual Expense'
        sheet['D5'] = 'Variance'
        sheet['E5'] = 'Budgeted Balance'
        sheet['F5'] = 'Actual Balance'
        titlerow = sheet.row_dimensions[5]
        titlerow.font = Font(name='Liberation Serif',size='12',bold=True)
        titlerow.alignment = Alignment(horizontal = 'center', vertical='center')

        row = 6
        for budget in result["accountdata"]:
            sheet['A'+str(row)] = budget["accountname"]
            sheet['A'+str(row)].font = Font(italic=True )
            sheet['A'+str(row)].alignment = Alignment(horizontal = 'left', vertical='center')
            sheet['B'+str(row)] = budget["budgetamount"]
            sheet['B'+str(row)].font = Font(name='Liberation Serif')
            sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['C'+str(row)] = budget["actualamount"]
            sheet['C'+str(row)].font = Font(name='Liberation Serif' )
            sheet['C'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['D'+str(row)] = budget["accvariance"]
            sheet['D'+str(row)].font = Font(name='Liberation Serif' )
            sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['E'+str(row)] = budget["budgetedbal"]
            sheet['E'+str(row)].font = Font(name='Liberation Serif' )
            sheet['E'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['F'+str(row)] = budget["actualbal"]
            sheet['F'+str(row)].font = Font(name='Liberation Serif' )
            sheet['F'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            row=row+1
        sheet['A'+str(row)] = 'Total'
        sheet['A'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['A'+str(row)].alignment = Alignment(horizontal = 'left', vertical='center')
        sheet['B'+str(row)] = result["totalbudget"]
        sheet['B'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['C'+str(row)] = result["totalactual"]
        sheet['C'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['C'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D'+str(row)] = result["totalvariance"]
        sheet['D'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['E'+str(row)] = result["totalbudgetedbal"]
        sheet['E'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['E'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['F'+str(row)] = result["totalactualbal"]
        sheet['F'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['F'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['A'+str(row+1)].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['A'+str(row+1)].alignment = Alignment(horizontal = 'left', vertical='center')
        sheet['A'+str(row+1)] = 'Budget Closing Expense : '+ result["totalactual"]

        a = 'A'+str(row+1)
        d = 'D'+str(row+1)
        sheet.merge_cells('A'+str(row+1)+':D'+str(row+1))

        budgetwb.save('report.xlsx')
        xlsxfile = open("report.xlsx","r")
        reportxslx = xlsxfile.read()
        headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(reportxslx),'Content-Disposition': 'attachment; filename=report.xlsx', 'Set-Cookie':'fileDownload=true; path=/'}
        xlsxfile.close()
        os.remove("report.xlsx")
        return Response(reportxslx, headerlist=headerList.items()) 
    except:
        return {"gkstatus":3}

@view_config(route_name="budget",request_param="type=salesspreadsheet", renderer="") 
def salesspreadsheet(request):
    try:
        header={"gktoken":request.headers["gktoken"]}
        financialstart = request.params["financialstart"]
        fystart = str(request.params["fystart"])
        fyend = str(request.params["fyend"])
        orgname = str(request.params["orgname"])
        budgetdetails = str(request.params["budgetdetails"])
        result = requests.get("http://127.0.0.1:6543/budget?type=salesReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
        result = result.json()["gkresult"]
        budgetwb = openpyxl.Workbook()
        # The new sheet is the active sheet as no other sheet exists. It is set as value of variable - sheet.
        sheet = budgetwb.active
        # Title of the sheet and width of columns are set.
        sheet.title = "Sales Budget Report"

        sheet.column_dimensions['A'].width = 15
        sheet.column_dimensions['B'].width = 30
        sheet.column_dimensions['C'].width = 15
        sheet.column_dimensions['D'].width = 30
        sheet.column_dimensions['E'].width = 15
        sheet.column_dimensions['F'].width = 20
        # Cells of first two rows are merged to display organisation details properly.
        sheet.merge_cells('A1:F2')
        # Font and Alignment of cells are set. Each cell can be identified using the cell index - column name and row number.
        sheet['A1'].font = Font(name='Liberation Serif',size='16',bold=True)
        sheet['A1'].alignment = Alignment(horizontal = 'center', vertical='center')
        # Organisation name and financial year are displayed.
        sheet['A1'] = orgname + ' (FY: ' + fystart + ' to ' + fyend +')'
        sheet['A3'].font = Font(name='Liberation Serif',size='14',bold=True)
        sheet['A3'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['A3'] = 'Sales Budget Report :'+ str(budgetdetails)
        sheet.merge_cells('A3:F3')

        sheet['A4'].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['A4'].alignment = Alignment(horizontal = 'left', vertical='center')
        sheet['A4'] = 'Total Opening Balance : '+ result["openingbal"]
        sheet.merge_cells('A4:F4')

        sheet['A5'] = 'Particulars'
        sheet['B5'] = 'Purchases'
        sheet.merge_cells('B5:C5')
        sheet['D5'] = 'Sales'
        sheet.merge_cells('D5:E5')
        sheet['F5'] = 'Profit'
        titlerow = sheet.row_dimensions[5]
        titlerow.font = Font(name='Liberation Serif',size='12',bold=True)
        titlerow.alignment = Alignment(horizontal = 'center', vertical='center')

        sheet['A6'] = 'Budget'
        sheet['A6'].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['B6'] = result["budgetexpense"]
        sheet.merge_cells('B6:C6')
        sheet['B6'].font = Font(name='Liberation Serif' )
        sheet['B6'].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D6'] = result["budgetincome"]
        sheet.merge_cells('D6:E6')
        sheet['D6'].font = Font(name='Liberation Serif' )
        sheet['D6'].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['F6'] = result["budgetprofit"]
        sheet['F6'].font = Font(name='Liberation Serif' )
        sheet['F6'].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['A7'] = 'Actuals'
        sheet['A7'].font = Font(name='Liberation Serif',size='12',bold=True)
        row=7
        for expense in result["expensedata"]:
            sheet['B'+str(row)] = expense["accountname"]
            sheet['B'+str(row)].font = Font(italic=True,size='12' )
            sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['C'+str(row)] = expense["actual"]
            sheet['C'+str(row)].font = Font(name='Liberation Serif' )
            sheet['C'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            row=row+1
        row=7
        for income in result["incomedata"]:
            sheet['D'+str(row)] = income["accountname"]
            sheet['D'+str(row)].font = Font(italic=True,size='12' )
            sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['E'+str(row)] = income["actual"]
            sheet['E'+str(row)].font = Font(name='Liberation Serif' )

            sheet['E'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            row=row+1
        if(len(result["incomedata"]) > len(result["expensedata"]) ):
            row = 7+len(result["incomedata"])
        else:
            row = 7+len(result["expensedata"])
        sheet['A'+str(row)] = 'Total'
        sheet['A'+str(row)].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['B'+str(row)] = result["actualexpense"]
        sheet.merge_cells('B'+str(row)+':C'+str(row))
        sheet['B'+str(row)].font = Font(name='Liberation Serif' )
        sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D'+str(row)] = result["actualincome"]
        sheet.merge_cells('D'+str(row)+':E'+str(row))
        sheet['D'+str(row)].font = Font(name='Liberation Serif' )
        sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['F'+str(row)] = result["actualprofit"]
        sheet['F'+str(row)].font = Font(name='Liberation Serif' )
        sheet['F'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')

        sheet['A'+str(row+1)] = 'Variance'
        sheet['A'+str(row+1)].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['B'+str(row+1)] = result["varexpense"]
        sheet.merge_cells('B'+str(row+1)+':C'+str(row+1))
        sheet['B'+str(row+1)].font = Font(name='Liberation Serif',bold=True )
        sheet['B'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D'+str(row+1)] = result["varincome"]
        sheet.merge_cells('D'+str(row+1)+':E'+str(row+1))
        sheet['D'+str(row+1)].font = Font(name='Liberation Serif',bold=True )
        sheet['D'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['F'+str(row+1)] = result["varprofit"]
        sheet['F'+str(row+1)].font = Font(name='Liberation Serif',bold=True )
        sheet['F'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')

        sheet['A'+str(row+2)] = 'Total Closing Balance : '+ result["closingbal"]
        sheet.merge_cells('A'+str(row+2)+':F'+str(row+2))
        sheet['A'+str(row+2)].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['A'+str(row+2)].alignment = Alignment(horizontal = 'left', vertical='center')

        budgetwb.save('report.xlsx')
        xlsxfile = open("report.xlsx","r")
        reportxslx = xlsxfile.read()
        headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(reportxslx),'Content-Disposition': 'attachment; filename=report.xlsx', 'Set-Cookie':'fileDownload=true; path=/'}
        xlsxfile.close()
        os.remove("report.xlsx")
        return Response(reportxslx, headerlist=headerList.items()) 
    except:
        return {"gkstatus":3}