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
    result = requests.get("http://127.0.0.1:6543/budget?type=addtab&financialstart=%s&uptodate=%s"%(request.params["financialstart"],request.params["uptodate"]), headers=header)
    
    return {"status":result.json()["gkstatus"],"gkresult":result.json()["gkresult"]}

@view_config(route_name="budget",request_param="type=edittab", renderer="gkwebapp:templates/editbudget.jinja2")
def editbudgetpage(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/budget?bud=all", headers=header)
    buddata=[]
    for record in result.json()["gkresult"]:
        gdata= {"budname":str(record["budname"]),"budid":str(record["budid"]),"startdate": record["startdate"],"enddate": record["enddate"]}
        buddata.append(gdata)
    return {"gkresult":buddata,"numberofbudget":len(result.json()["gkresult"]),"status":True}

@view_config(route_name="budget",request_param="type=bdg_list", renderer="gkwebapp:templates/viewbudgetreport.jinja2")
def alllist(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/budget?bud=all", headers=header)
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
    result = requests.get("http://127.0.0.1:6543/budget?type=budgetReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
    
    return {"gkstatus":result.json()["gkstatus"], "gkresult":result.json()["gkresult"], "budgetdetail":request.params["buddetails"], "budid":int(request.params["budid"]) }

@view_config(route_name="budget",request_param="type=printreport", renderer="gkwebapp:templates/printbudgetreport.jinja2")
def printbudgetreport(request):
    header={"gktoken":request.headers["gktoken"]}
    financialstart = request.params["financialstart"]
    result = requests.get("http://127.0.0.1:6543/budget?type=budgetReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
    
    return {"gkstatus":result.json()["gkstatus"], "gkresult":result.json()["gkresult"], "budgetdetails":request.params["buddetails"], "budid":int(request.params["budid"]), "financialstart":financialstart }

@view_config(route_name="budget",request_param="type=spreadsheet", renderer="") 
def reportspreadsheet(request):
    try:
        header={"gktoken":request.headers["gktoken"]}
        financialstart = request.params["financialstart"]
        fystart = str(request.params["fystart"])
        fyend = str(request.params["fyend"])
        orgname = str(request.params["orgname"])
        budgetdetails = str(request.params["budgetdetails"])
        result = requests.get("http://127.0.0.1:6543/budget?type=budgetReport&budid=%d&financialstart=%s"%(int(request.params["budid"]),str(financialstart)), headers=header)
        result = result.json()["gkresult"];
        budgetwb = openpyxl.Workbook()
        # The new sheet is the active sheet as no other sheet exists. It is set as value of variable - sheet.
        sheet = budgetwb.active
        # Title of the sheet and width of columns are set.
        sheet.title = "Budget Report"

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
        sheet['A3'] = 'Budget Report :'+ str(budgetdetails)
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
        sheet['C6'] = result["budgetOut"]
        sheet['C6'].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D6'] = result["budgetBal"]
        sheet['D6'].alignment = Alignment(horizontal = 'right', vertical='center')
        row=8
        for budget in result["accData"]:
            sheet['A'+str(row)] = budget["accountname"]
            sheet['A'+str(row)].font = Font(italic=True )
            sheet['A'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['B'+str(row)] = budget["accDr"]
            sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['C'+str(row)] = budget["accCr"]
            sheet['C'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            sheet['D'+str(row)] = budget["accBal"]
            sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
            row=row+1
        sheet['A'+str(row)] = 'Total'
        sheet['A'+str(row)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['B'+str(row)] = result["totalDr"]
        sheet['B'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['C'+str(row)] = result["totalCr"]
        sheet['C'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D'+str(row)] = result["budgetclosingbal"]
        sheet['D'+str(row)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['A'+str(row+1)] = 'Variance'
        sheet['A'+str(row+1)].font = Font(name='Liberation Serif' ,bold=True)
        sheet['B'+str(row+1)] = result["varDr"]
        sheet['B'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['C'+str(row+1)] = result["varCr"]
        sheet['C'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')
        sheet['D'+str(row+1)] = result["varBal"]
        sheet['D'+str(row+1)].alignment = Alignment(horizontal = 'right', vertical='center')

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

