
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
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
'Prajkta Patkar' <prajakta@dff.orgaddr.in>
"Nitesh Chaughule" <nitesh@disroot.org>
"Aditya Shukla" <adityashukla9158.as@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from PIL import Image
import base64
import io


@view_config(route_name='locale')
def set_locale_cookie(request):
    if request.GET['language']:
        language = request.GET['language']
        response = Response()
        response.set_cookie('_LOCALE_',
                            value=language,
                            max_age=31536000, httponly=True)  # max_age = year
    return HTTPFound(location=request.environ['HTTP_REFERER'],
                     headers=response.headers)


@view_config(route_name="genstats", renderer="json")
def getGeneralStats(request):
    header = {"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/organisations?type=genstats", headers=header)
    return {"gkresult": result.json()["gkresult"], "gkstatus": result.json()["gkstatus"]}

@view_config(route_name="showeditOrg", renderer="gkwebapp:templates/editorganisation.jinja2")
def showeditOrg(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/organisation", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)   
    return {"gkresult":result.json()["gkdata"],"gkstatus":result.json()["gkstatus"],"states": states.json()["gkresult"],"vatorgstflag":resultgstvat.json()["gkresult"]}

@view_config(route_name="showeditOrg", request_param="getgstgroupcode", renderer="json")
def getGSTGroupCode(request):
    header={"gktoken":request.headers["gktoken"]}
    groupcodedata = requests.get("http://127.0.0.1:6543/organisation?getgstgroupcode", headers=header)
    if groupcodedata.json()["gkstatus"] == 0:
        return {"gkstatus":groupcodedata.json()["gkstatus"], "groupcode":groupcodedata.json()["groupcode"], "subgroupcode":groupcodedata.json()["subgroupcode"]}
    else:
        return {"gkstatus":groupcodedata.json()["gkstatus"]}

@view_config(route_name="existingorg", request_param="type=getgstin", renderer="json")
def getorgdata(request):
    header={"gktoken":request.headers["gktoken"]}
    orgdata = requests.get("http://127.0.0.1:6543/organisations?osg=true&statecode=%d"%(int(request.params["gstinstate"])), headers=header)
    orgdetails = requests.get("http://127.0.0.1:6543/organisations?billingdetails&statecode=%d"%(int(request.params["gstinstate"])), headers=header)
    return {"gkstatus": orgdata.json()["gkstatus"],"gkresult": orgdata.json()["gkresult"], "orgdetails": orgdetails.json()["gkdata"]}

@view_config(route_name="existingorg", request_param="type=getaddress", renderer="json")
def getorgaddress(request):
    header={"gktoken":request.headers["gktoken"]}
    orgdetails = requests.get("http://127.0.0.1:6543/organisations?billingdetails&statecode=%d"%(int(request.params["invstate"])), headers=header)
    return {"gkstatus": orgdetails.json()["gkstatus"], "orgdetails": orgdetails.json()["gkdata"]}

@view_config(route_name="editorganisation", request_param="edit=inventoryactivate",  renderer="json")
def inventoryActivate(request):

    header={"gktoken":request.headers["gktoken"]}
    result = requests.put("http://127.0.0.1:6543/organisations?type=getinventory", data=json.dumps({"invflag":1}), headers=header)

    return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="oexists", renderer="json")
def oexists(request):
    result = requests.get("http://127.0.0.1:6543/organisations?type=exists&orgname=%s&orgtype=%s&finstart=%s&finend=%s"%(request.params["orgname"],request.params["orgtype"],request.params["finstart"],request.params["finend"]))
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="editorganisation", renderer="json")
def editOrganisation(request):
    header={"gktoken":request.headers["gktoken"]}
    gkdata= {"orgcity":request.params["orgcity"],"orgaddr":request.params["orgaddr"],"orgpincode":request.params["orgpincode"],"orgcountry":request.params["orgcountry"],"orgtelno":request.params["orgtelno"], "orgfax":request.params["orgfax"],"orgwebsite":request.params["orgwebsite"],"orgemail":request.params["orgemail"],"orgpan":request.params["orgpan"],"orgmvat":request.params["orgmvat"],"orgstax":request.params["orgstax"],"orgregno":request.params["orgregno"],"orgregdate":request.params["orgregdate"], "orgfcrano":request.params["orgfcrano"],"orgfcradate":request.params["orgfcradate"]}

    if "gstin" in request.params:
        gkdata["gstin"]=json.loads(request.params["gstin"])
    if "orgstate" in request.params:
        gkdata["orgstate"]=request.params["orgstate"]
    # conversion of data into json format for bank details# 
    if "bankdetails" in request.params:
        gkdata["bankdetails"]=json.loads(request.params["bankdetails"])
        
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
            gkdata["logo"]=filelogo
    except:
        print("no file found ")
    result = requests.put("http://127.0.0.1:6543/organisations", headers=header, data=json.dumps(gkdata))
    if (result.json()["gkstatus"]==0 and "bankdetails" in request.params):
            #this is use when bank account details are available it create  bank account of that details  when we editorganization.
        try:
            subgroupcode = requests.get("http://127.0.0.1:6543/groupsubgroups?orgbank", headers=header)
            bankacc = {"accountname":json.loads(request.params["bankdetails"])['bankname'],"openingbal":0.00,"groupcode":subgroupcode.json()['gkresult']}
            saveacc = requests.post("http://127.0.0.1:6543/accounts", data =json.dumps(bankacc),headers=header)
            if saveacc.json()["gkstatus"] == 0:
                logdata = {"activity":json.loads(request.params["bankdetails"])['bankname'] + " account created"}
                resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(logdata),headers=header)
        except:
            pass

    return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="getorgcode", renderer="json")
def getOrgcode(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/organisations?orgcode", headers=header)
    return {"gkdata":result.json()["gkdata"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="closebooks", renderer="json")
def closebooks(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/rollclose?task=closebooks&financialend=%s"%(request.params["financialend"]), headers=header)
    return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="rollover", renderer="json")
def rollover(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/rollclose?task=rollover&financialend=%s&financialstart=%s"%(request.params["financialend"],request.params["financialstart"]), headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="deleteorg", renderer="json")
def deleteorg(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.delete("http://127.0.0.1:6543/organisations", headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="editorganisation", request_param="action=getattachment", renderer="json")
def getattachment(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/organisation?attach=image", headers=header)
    return {"logo":result.json()["logo"]}


@view_config(route_name="editorganisation",request_param="action=orgpref", renderer="json")
def editOrganisationPreferences(request):
    header={"gktoken":request.headers["gktoken"]}
    gkdata= {"invflag":request.params["invflag"],"invsflag":request.params["invsflag"],"billflag":request.params["billflag"],"avnoflag":request.params["avnoflag"],"ainvnoflag":request.params["ainvnoflag"],"maflag":request.params["maflag"],"avflag":request.params["avflag"],"modeflag":request.params["modeflag"]}
    result = requests.put("http://127.0.0.1:6543/organisations", headers=header, data=json.dumps(gkdata))
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="editorganisation",request_param="action=orgbankdetails", renderer="json")
def orgbankDetails(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://0.0.0.0:6543/organisation?orgbankdetails", headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkbankdata":result.json()["gkbankdata"]}

@view_config(route_name="editorganisation",request_param="type=statename", renderer="json")
def getstatename(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://0.0.0.0:6543/state?statename&stateabbr=%s"%(request.params["stateabbr"]), headers=header)
    return {"gkstatus":result.json()["gkstatus"], "statename":result.json()["statename"]}

