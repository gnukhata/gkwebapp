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
import os
from odslib import ODS

@view_config(route_name="gstsummary",renderer="gkwebapp:templates/viewgstsummary.jinja2")
def viewGstSummary(request):

    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
    state = requests.get("http://127.0.0.1:6543/state", headers=header)
    return {"gkresult":result.json()["gkresult"],"states":state.json()["gkresult"]}

@view_config(route_name="gstsummary",request_param="type=senddata",renderer="gkwebapp:templates/gstsummaryreport.jinja2")
def sendReportData(request):
    #calculateto = request.params["calculateto"]
    #calculatefrom = request.params["calculatefrom"]
    taxdata = request.params["tax"]
    header={"gktoken":request.headers["gktoken"]}
    gkdata ={"startdate":request.params["calculatefrom"],"enddate":request.params["calculateto"],"taxData":json.loads(request.params["tax"])}
    result = requests.get("http://127.0.0.1:6543/report?type=GSTCalc",data =json.dumps(gkdata), headers=header)
    reportheader = {"startDate":str(request.params["calculatefrom"]),"enddate":str(request.params["calculateto"]),"state": request.params["statename"]}
    data = result.json()["gkresult"]
    data["lenSGSTin"] = len(result.json()["gkresult"]["sgstin"])
    data["lenSGSTout"] = len(result.json()["gkresult"]["sgstout"])
    data["lenCGSTin"] =  len(result.json()["gkresult"]["cgstin"])
    data["lenCGSTout"] =  len(result.json()["gkresult"]["cgstout"])
    data["lenIGSTin"] =  len(result.json()["gkresult"]["igstin"])
    data["lenIGSTout"] =  len(result.json()["gkresult"]["igstout"])
    data["lenCESSin"] =  len(result.json()["gkresult"]["cessin"])
    data["lenCESSout"] = len(result.json()["gkresult"]["cessout"])
   
    return{"reportheader":reportheader,"gstData":data,"gkstatus":result.json()["gkstatus"]}
    
    

