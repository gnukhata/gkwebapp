
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Vasudha Kadge" <kadge.vasudha@gmail.com>

"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response

@view_config(route_name="log",request_param="action=showviewlog", renderer="gkwebapp:templates/viewlog.jinja2")
def showviewlog(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/users", headers=header)
    users=[]
    if result.json()["gkstatus"] == 0:
        for record in result.json()["gkresult"]:
            udata= {"userid":str(record["userid"]), "username": str(record["username"])}
            users.append(udata)
    return {"gkresult":users}

@view_config(route_name="log",request_param="action=showlogreport")
def showlogreport(request):
    header={"gktoken":request.headers["gktoken"]}
    calculatefrom = request.params["calculatefrom"]
    calculateto = request.params["calculateto"]
    logcalculatefrom = request.params["calculatefrom"]
    logcalculateto = request.params["calculateto"]
    ''' typeflag = 1 means log by organisation and 2 means log by user'''
    if int(request.params["backflag"])==1:
        logcalculatefrom = datetime.strptime(calculatefrom, '%d-%m-%Y').strftime('%Y-%m-%d')
        logcalculateto = datetime.strptime(calculateto, '%d-%m-%Y').strftime('%Y-%m-%d')
        logheader = {"calculatefrom":calculatefrom,"calculateto":calculateto,"typeflag": request.params["typeflag"] }
    else:
        logheader = {"calculatefrom":datetime.strptime(calculatefrom, '%Y-%m-%d').strftime('%d-%m-%Y'),"calculateto":datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y'),"typeflag": request.params["typeflag"]}
    
    if request.params["typeflag"] == "1":
         if "orderflag" in request.params:
             result = requests.get("http://127.0.0.1:6543/report?type=logbyorg&calculatefrom=%s&calculateto=%s&orderflag=%d"%(logcalculatefrom, logcalculateto,int(request.params["orderflag"])), headers=header)
             return render_to_response("gkwebapp:templates/logreport.jinja2",{"records":result.json()["gkresult"],"logheader":logheader, "typeflag": "1","orderflag":"1"},request=request)
         else :
             result = requests.get("http://127.0.0.1:6543/report?type=logbyorg&calculatefrom=%s&calculateto=%s"%(logcalculatefrom, logcalculateto), headers=header) 
             return render_to_response("gkwebapp:templates/logreport.jinja2",{"records":result.json()["gkresult"],"logheader":logheader, "typeflag": "1","orderflag":"4"},request=request)
    else:
        userid = request.params["userid"]
        if "orderflag" in request.params:
            result = requests.get("http://127.0.0.1:6543/report?type=logbyuser&userid=%s&calculatefrom=%s&calculateto=%s&orderflag=%d"%(userid, logcalculatefrom, logcalculateto,int(request.params["orderflag"])), headers=header)
            return render_to_response("gkwebapp:templates/logreport.jinja2",{"records":result.json()["gkresult"],"logheader": logheader, "username": request.params["username"],"userid":userid, "typeflag": "2","orderflag":"1"},request=request)
        else :
             result = requests.get("http://127.0.0.1:6543/report?type=logbyuser&userid=%s&calculatefrom=%s&calculateto=%s"%(userid, logcalculatefrom, logcalculateto),headers=header)
             return render_to_response("gkwebapp:templates/logreport.jinja2",{"records":result.json()["gkresult"],"logheader": logheader, "username": request.params["username"],"userid":userid, "typeflag": "2","orderflag":"4"},request=request)

@view_config(route_name="log",request_param="action=printableshowlogreport")
def printableshowlogreport(request):
    header={"gktoken":request.headers["gktoken"]}
    userid = request.params["userid"]
    calculatefrom = request.params["calculatefrom"]
    calculateto = request.params["calculateto"]
    logcalculatefrom = datetime.strptime(calculatefrom, '%d-%m-%Y').strftime('%Y-%m-%d')
    logcalculateto = datetime.strptime(calculateto, '%d-%m-%Y').strftime('%Y-%m-%d')
    ''' typeflag = 1 means log by organisation and 2 means log by user'''

    if request.params["typeflag"] == "1":
        result = requests.get("http://127.0.0.1:6543/report?type=logbyorg&calculatefrom=%s&calculateto=%s"%(logcalculatefrom, logcalculateto), headers=header)
        return render_to_response("gkwebapp:templates/printactivitylog.jinja2",{"records":result.json()["gkresult"], "logheader": {"calculatefrom": calculatefrom, "calculateto": calculateto}, "typeflag": "1"},request=request)
    else:
        result = requests.get("http://127.0.0.1:6543/report?type=logbyuser&userid=%s&calculatefrom=%s&calculateto=%s"%(userid, logcalculatefrom, logcalculateto), headers=header)
        return render_to_response("gkwebapp:templates/printactivitylog.jinja2",{"records":result.json()["gkresult"], "logheader": {"calculatefrom": calculatefrom, "calculateto": calculateto, "username": request.params["username"], "userid": request.params["userid"]}, "typeflag": "2"},request=request)
