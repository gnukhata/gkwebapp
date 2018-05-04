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
  Free Software Foundation, Inc.,51 Franklin Street, 
  Fifth Floor, Boston, MA 02110, United States


Contributors:
   "Krishnakant Mane" <kk@gmail.com>
   'Prajkta Patkar'<prajkta@riseup.net>
   
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import openpyxl
from openpyxl.styles import Font, Alignment
import os
from openpyxl.utils import get_column_letter

@view_config(route_name="gstsummary",renderer="gkwebapp:templates/viewgstsummary.jinja2")
def viewGstSummary(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
    state = requests.get("http://127.0.0.1:6543/state", headers=header)
    return {"gkresult":result.json()["gkresult"],"states":state.json()["gkresult"]}

@view_config(route_name="gstsummary",request_param="type=senddata",renderer="gkwebapp:templates/gstsummaryreport.jinja2")
def sendReportData(request):
    header={"gktoken":request.headers["gktoken"]}
    gkdata ={"startdate":request.params["calculatefrom"],"enddate":request.params["calculateto"],"statename":request.params["statename"]}
    result = requests.get("http://127.0.0.1:6543/report?type=GSTCalc",data =json.dumps(gkdata), headers=header)
    reportheader = {"startDate":str(request.params["calculatefrom"]),"enddate":str(request.params["calculateto"]),"state": request.params["statename"]}
    data = result.json()["gkresult"]
    data["lenSGSTin"] = len(result.json()["gkresult"]["sgstin"])
    data["lenSGSTout"] = len(result.json()["gkresult"]["sgstout"])
    data["lenCGSTin"] =  len(result.json()["gkresult"]["cgstin"])
    data["lenCGSTout"] = len(result.json()["gkresult"]["cgstout"])
    data["lenIGSTin"] =  len(result.json()["gkresult"]["igstin"])
    data["lenIGSTout"] =  len(result.json()["gkresult"]["igstout"])
    data["lenCESSin"] =  len(result.json()["gkresult"]["cessin"])
    data["lenCESSout"] = len(result.json()["gkresult"]["cessout"])
   
    return{"reportheader":reportheader,"gstData":data,"gkstatus":result.json()["gkstatus"]}
    
@view_config(route_name="gstsummary",request_param="action=gstsummaryreportspreadsheet", renderer="")
def gstsummspreadsheet(request):
    #try:
        print "I am here"
        header={"gktoken":request.headers["gktoken"]}
        gkdata ={"startdate":request.params["calculatefrom"],"enddate":request.params["calculateto"],"statename":request.params["statename"]}
        result = requests.get("http://127.0.0.1:6543/report?type=GSTCalc",data =json.dumps(gkdata), headers=header)
        
        data = result.json()["gkresult"]
        '''
        lenSGSTin = len(result.json()["gkresult"]["sgstin"])
        data["lenSGSTout"] = len(result.json()["gkresult"]["sgstout"])
        data["lenCGSTin"] =  len(result.json()["gkresult"]["cgstin"])
        data["lenCGSTout"] = len(result.json()["gkresult"]["cgstout"])
        data["lenIGSTin"] =  len(result.json()["gkresult"]["igstin"])
        data["lenIGSTout"] =  len(result.json()["gkresult"]["igstout"])
        data["lenCESSin"] =  len(result.json()["gkresult"]["cessin"])
        data["lenCESSout"] = len(result.json()["gkresult"]["cessout"])'''
        gstsmwb = openpyxl.Workbook()
        sheet = gstsmwb.active
        sheet.title= "GST Summary "
        sheet.merge_cells('A1:E2')
        sheet.column_dimensions['A'].width = 8
        sheet['A1'].font = Font(name='Liberation Serif',size='16',bold=True)
        sheet['A1'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['A1'] = str(request.params["orgname"])
        sheet.merge_cells('A3:E3')
        sheet['A3'].font = Font(name='Liberation Serif',size='14',bold=True)
        sheet['A3'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['A3'] = 'Statement of GST Calculation '
        sheet.merge_cells('A4:G4')
        sheet['A4'].font = Font(name='Liberation Serif',size='12',italic=True)
        sheet['A4'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['A4'] ="State :"+ gkdata["statename"] + "                  "+"Peroid :"+ gkdata["startdate"] + "to" +gkdata["enddate"]

        sheet.merge_cells('A6:A7')
        sheet['A6'].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['A6'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['A6'] = "Type of Tax"

        sheet.merge_cells(start_row=6, start_column=2, end_row=7, end_column=3)
        sheet['B6'].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['B6'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['B6'] = "Tax Amount"
  
        sheet.merge_cells('D6:E6')
        sheet['D6'].font = Font(name='Liberation Serif',size='12',bold=True)
        sheet['D6'].alignment = Alignment(horizontal = 'center', vertical='center')
        sheet['D6'] = "Net Tax Amount"

        sheet['D7'] = "Payable"
        sheet['E7'] = "Carried Forward "

        sheet.column_dimensions["A"].width = 30
        sheet.column_dimensions["B"].width = 15
        sheet.column_dimensions["C"].width = 15
        sheet.column_dimensions["D"].width = 15
        sheet.column_dimensions["E"].width = 15

        c = 1
        r = 7
        
        if len(result.json()["gkresult"]["sgstin"]) > 0:
            sheet.cell(row=r,column=c,value= "SGST")
            sheet.cell(row=r+1,column=c+1,value= "\tInput Tax")
            for sgstinacc in data["sgstin"]:
                n = 1
                
                
                

        
        
        

        

        
        
        gstsmwb.save('report.xlsx')
        xlsxfile = open("report.xlsx","r")
        
        reportxslx = xlsxfile.read()
        headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(reportxslx),'Content-Disposition': 'attachment; filename=report.xlsx', 'Set-Cookie':'fileDownload=true; path=/'}
        xlsxfile.close()
        os.remove("report.xlsx")
        return Response(reportxslx, headerlist=headerList.items())
        
    #except:
    #    print "file not found"
    #    return {"gkstatus":3}

