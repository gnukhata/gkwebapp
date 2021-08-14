
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
from PIL import Image
import base64
import io

gk_version = "7.0"

@view_config(route_name="index", renderer="gkwebapp:templates/index.jinja2")
def index(request):
    request.response.headerlist = [('Content-Type','text/html'),('X-Content-Type-Options','nosniff'),('X-Frame-Options','DENY')]
    return {"a":1, "gk_version": gk_version}


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
     states = requests.get("http://127.0.0.1:6543/state")
     return {"locale":default_locale_negotiator(request),"states": states.json()["gkresult"]}

@view_config(route_name="createadmin", renderer="gkwebapp:templates/createadmin.jinja2")
def createadmin(request):
    orgname = request.params["orgname"]
    orgtype = request.params["orgtype"]
    invflag = request.params["invflag"]
    fromdate = request.params["fdate"]
    todate = request.params["tdate"]
    invsflag=request.params["invsflag"]
    billflag=request.params["billflag"]
    modeflag = request.params["modeflag"]
    return {"orgname":orgname, "orgtype":orgtype, "fromdate":fromdate,"todate":todate,"invflag":invflag,"invsflag":invsflag,"billflag":billflag,"modeflag":modeflag}

@view_config(route_name="createorglogin",renderer="json")
def orglogin(request):
    gkdata = {"orgdetails":{"orgname":request.params["orgname"], "orgtype":request.params["orgtype"], "yearstart":request.params["yearstart"], "yearend":request.params["yearend"],"invflag":request.params["invflag"],"invsflag":request.params["invsflag"],"billflag":request.params["billflag"], "orgcity":request.params["orgcity"],"orgaddr":request.params["orgaddr"],"orgpincode":request.params["orgpincode"], "orgcountry":request.params["orgcountry"],"orgtelno":request.params["orgtelno"], "orgfax":request.params["orgfax"],"orgwebsite":request.params["orgwebsite"],"orgemail":request.params["orgemail"],"orgpan":request.params["orgpan"],"orgmvat":request.params["orgmvat"],"orgstax":request.params["orgstax"],"orgregno":request.params["orgregno"],"orgregdate":request.params["orgregdate"], "orgfcrano":request.params["orgfcrano"],"orgfcradate":request.params["orgfcradate"], "avflag":request.params["avflag"], "maflag":request.params["maflag"],"avnoflag":request.params["avnoflag"],"ainvnoflag":request.params["ainvnoflag"],"modeflag":request.params["modeflag"]}, "userdetails":{"username":request.params["username"], "userpassword":request.params["password"],"userquestion":request.params["securityquestion"], "useranswer":request.params["securityanswer"]}}
    
    if "gstin" in request.params:
        gkdata["orgdetails"]["gstin"]=json.loads(request.params["gstin"])
    if "orgstate" in request.params:
        gkdata["orgdetails"]["orgstate"]=request.params["orgstate"]
    if "bankdetails" in request.params:
        gkdata["orgdetails"]["bankdetails"]=json.loads(request.params["bankdetails"])
        
    filelogo={}
    try:
        if request.POST['logo'].file:

            img=request.POST['logo'].file
            image=Image.open(img)
            imgbuffer = io.BytesIO()
            image.save(imgbuffer, format="JPEG")
            img_str = base64.b64encode(imgbuffer.getvalue())
            img_str = img_str.decode("ascii")
            image.close()
            filelogo=img_str
            gkdata["orgdetails"]["logo"]=filelogo
    except:
        print("no file found ")
    result = requests.post("http://127.0.0.1:6543/organisations", data =json.dumps(gkdata))
    if result.json()["gkstatus"]==0:
        if "bankdetails" in request.params:
            #this is use when bank account details are available it create  bank account of that details  when we create new organization.
            try:
                header={"gktoken":result.json()["token"]}
                subgroupcode = requests.get("http://127.0.0.1:6543/groupsubgroups?orgbank", headers=header)
                bankacc = {"accountname":json.loads(request.params["bankdetails"])['bankname'],"openingbal":0.00,"groupcode":subgroupcode.json()['gkresult']}
                saveacc = requests.post("http://127.0.0.1:6543/accounts", data =json.dumps(bankacc),headers=header)
                if saveacc.json()["gkstatus"] == 0:
                    logdata = {"activity":json.loads(request.params["bankdetails"])['bankname'] + " account created"}
                    resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(logdata),headers=header)
            except:
                pass
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
        return  {"gktoken":result.json()["token"], "gkstatus":result.json()["gkstatus"],"invflag":result1.json()["gkdata"]["invflag"],"invsflag":result1.json()["gkdata"]["invsflag"],"billflag":result1.json()["gkdata"]["billflag"],"avnoflag":result1.json()["gkdata"]["avnoflag"],"ainvnoflag":result1.json()["gkdata"]["ainvnoflag"],"maflag":result1.json()["gkdata"]["maflag"],"avflag":result1.json()["gkdata"]["avflag"],"modeflag":result1.json()["gkdata"]["modeflag"]}
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
    request.response.headerlist = [('Content-Type','text/html'),('X-Content-Type-Options','nosniff'),('X-Frame-Options','DENY')]
    return {"status":"ok", "gk_version": gk_version}

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
