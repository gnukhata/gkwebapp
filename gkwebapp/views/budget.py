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
        gkdata = {"budname":request.params["budname"],"startdate":request.params["startdate"],"enddate":request.params["enddate"], "contents":json.loads(request.params["contents"])[0], "budtype":request.params["btype"], "gaflag":request.params["gaflag"]}

    result = requests.post("http://127.0.0.1:6543/budget", data =json.dumps(gkdata),headers=header)
    if result.json()["gkstatus"] == 0:
        gkdata = {"activity":request.params["budname"] + " budget created"}   
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="budget",request_param="type=galisttable", renderer="gkwebapp:templates/createbudgetaccountstable.jinja2")
def galist(request):
    header={"gktoken":request.headers["gktoken"]}
    if(request.params["flag"] == '1'):
        result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
        return {"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"],"flag":request.params["flag"] }
    if(request.params["flag"] == '7'):
        result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
        grpdata=[]
        for record in result.json()["gkresult"]:
            gdata= {"accountname":str(record["groupname"]),"accountcode":str(record["groupcode"])}
            grpdata.append(gdata)
        return {"gkresult":grpdata,"gkstatus":result.json()["gkstatus"],"flag":request.params["flag"] }
    if(request.params["flag"] == '19'):
        result = requests.get("http://127.0.0.1:6543/groupsubgroups?allsubgroup", headers=header)
        sgrpdata=[]
        for record in result.json()["gkresult"]:
            gdata= {"accountname":str(record["groupname"]),"accountcode":str(record["groupcode"])}
            sgrpdata.append(gdata)
        return {"gkresult":sgrpdata,"gkstatus":result.json()["gkstatus"],"flag":request.params["flag"] }

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
    reportdata=[]
    for record in result.json()["gkresult"]:
            reportdata.append({"totalopeningbal":record["totalopeningbal"],"budgetIn":record["budgetIn"],"budgetOut":record["budgetOut"],"budgetBal":record["budgetBal"],"varCr":record["varCr"],"varDr":record["varDr"],"varBal":record["varBal"],"accData":record["accData"]})
    
    return {"gkstatus":result.json()["gkstatus"], "gkresult":reportdata, "budgetdetail":request.params["buddetails"] }
    
    
