
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
from pyramid.i18n import default_locale_negotiator
s = requests.session()

@view_config(route_name="index", renderer="gkwebapp:templates/index.jinja2")
def index(request):
    return {"a":1}

@view_config(route_name="existingorg", renderer="gkwebapp:templates/existingorg.jinja2")
def existingorg(request):
    result = requests.get("http://127.0.0.1:6543/organisations")
    strData = []
    for records in result.json()["gkdata"]:
        sdata = {"orgname":records["orgname"],"orgtype":records["orgtype"]}
        strData.append(sdata)
    return {"gkresult":strData}

@view_config(route_name="orgexists", renderer="json")
def orgexists(request):
    result = s.get("http://127.0.0.1:6543/organisations")
    strData = []
    for records in result.json()["gkdata"]:
        sdata = {"orgname":records["orgname"],"orgtype":records["orgtype"]}
        strData.append(sdata)

    if len(strData) ==0:
        return {"gkresult":0}
    else:
        return {"gkresult":1}


@view_config(route_name="yearcode", renderer="json")
def yearcode(request):
    oname = request.params["orgname"]
    otype = request.params["orgtype"]
    result = requests.get("http://127.0.0.1:6543/orgyears/%s/%s"%(oname,otype))
    strData = []

    for records in result.json()["gkdata"]:
        sdata = {"yearstart":datetime.strftime(datetime.strptime(records["yearstart"],"%Y-%m-%d"),"%d-%m-%Y"),"yearend":datetime.strftime(datetime.strptime(records["yearend"],"%Y-%m-%d"),"%d-%m-%Y"), "orgcode":records["orgcode"]}
        strData.append(sdata)
    return {"gkresult":strData}

@view_config(route_name="login", renderer="gkwebapp:templates/login.jinja2")
def login(request):
    return {"code":request.params["orgcode"], "flag": request.params["flag"]}


@view_config(route_name="createorg", renderer="gkwebapp:templates/createorg.jinja2")
def createorg(request):

    return {"locale":default_locale_negotiator(request)}

@view_config(route_name="createadmin", renderer="gkwebapp:templates/createadmin.jinja2")
def createadmin(request):
    orgname = request.params["orgname"]
    orgtype = request.params["orgtype"]
    invflag = request.params["invflag"]
    fromdate = request.params["fdate"]
    todate = request.params["tdate"]
    invsflag=request.params["invsflag"]
    billflag=request.params["billflag"]
    return {"orgname":orgname, "orgtype":orgtype, "fromdate":fromdate, "todate":todate, "invflag":invflag,"invsflag":invsflag,"billflag":billflag}

@view_config(route_name="createorglogin",renderer="json")
def orglogin(request):
    gkdata = {"orgdetails":{"orgname":request.params["orgname"], "orgtype":request.params["orgtype"], "yearstart":request.params["yearstart"], "yearend":request.params["yearend"],"invflag":request.params["invflag"],"invsflag":request.params["invsflag"],"billflag":request.params["billflag"]}, "userdetails":{"username":request.params["username"], "userpassword":request.params["password"],"userquestion":request.params["securityquestion"], "useranswer":request.params["securityanswer"]}}
    result = requests.post("http://127.0.0.1:6543/organisations", data =json.dumps(gkdata))
    if result.json()["gkstatus"]==0:
        return  {"gktoken":result.json()["token"],"gkstatus":result.json()["gkstatus"]}
    else:
        return  {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="userlogin",renderer="json")
def selectorglogin(request):
    gkdata = {"username":request.params["username"], "userpassword":request.params["userpassword"],"orgcode":request.params["orgcode"]}
    result = requests.post("http://127.0.0.1:6543/login", data =json.dumps(gkdata))
    if result.json()["gkstatus"]==0:
        header = result.json()["token"]
        result1 = requests.get("http://127.0.0.1:6543/organisation",headers={"gktoken":header})
        return  {"gktoken":result.json()["token"], "gkstatus":result.json()["gkstatus"],"invflag":result1.json()["gkdata"]["invflag"],"invsflag":result1.json()["gkdata"]["invsflag"],"billflag":result1.json()["gkdata"]["billflag"]}
    else:
        return  {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="orgdata",renderer="json")
def orgdata(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/login",headers=header)
    if result.json()["gkstatus"]==0:
        resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
        return  {"gkresult":result.json()["gkresult"], "gkstatus":result.json()["gkstatus"],"vatorgstflag":resultgstvat.json()["gkresult"]}
    else:
        return  {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="showmainshell",renderer="gkwebapp:templates/mainshell.jinja2")
def mainshell(request):
    return {"status":"ok"}

@view_config(route_name="theme",renderer="json")
def theme(request):
    header={"gktoken":request.headers["gktoken"]}
    result= requests.get("http://127.0.0.1:6543/user?type=theme",headers=header)
    return {"theme":result.json()["gkresult"], "status":result.json()["gkstatus"]}

@view_config(route_name="addtheme", renderer="json")
def addtheme(request):
    header={"gktoken":request.headers["gktoken"]}
    themename= {"themename":request.params["themename"]}
    result= requests.put("http://127.0.0.1:6543/user?type=theme",headers=header,data =json.dumps(themename))
    return {"status":result.json()["gkstatus"]}
