
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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

"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from PIL import Image
import base64
import cStringIO


@view_config(route_name='locale')
def set_locale_cookie(request):
    if request.GET['language']:
        language = request.GET['language']
        response = Response()
        response.set_cookie('_LOCALE_',
                            value=language,
                            max_age=31536000)  # max_age = year
    return HTTPFound(location=request.environ['HTTP_REFERER'],
                     headers=response.headers)


@view_config(route_name="showeditOrg", renderer="gkwebapp:templates/editorganisation.jinja2")
def showeditOrg(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/organisation", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    return {"gkresult":result.json()["gkdata"],"gkstatus":result.json()["gkstatus"],"states": states.json()["gkresult"],"vatorgstflag":resultgstvat.json()["gkresult"]}

@view_config(route_name="existingorg", request_param="type=getgstin", renderer="json")
def getorgdata(request):
    header={"gktoken":request.headers["gktoken"]}
    orgdata = requests.get("http://127.0.0.1:6543/organisation", headers=header)
    return {"gkstatus": orgdata.json()["gkstatus"],"gkresult": orgdata.json()["gkdata"]}

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

    gkdata= {"orgcity":request.params["orgcity"],"orgaddr":request.params["orgaddr"],"orgpincode":request.params["orgpincode"],"orgstate":request.params["orgstate"], "orgcountry":request.params["orgcountry"],"orgtelno":request.params["orgtelno"], "orgfax":request.params["orgfax"],"orgwebsite":request.params["orgwebsite"],"orgemail":request.params["orgemail"],"orgpan":request.params["orgpan"],"orgmvat":request.params["orgmvat"],"gstin":json.loads(request.params["gstin"]),"orgstax":request.params["orgstax"],"orgregno":request.params["orgregno"],"orgregdate":request.params["orgregdate"], "orgfcrano":request.params["orgfcrano"],"orgfcradate":request.params["orgfcradate"]}
    filelogo={}
    try:
        if request.POST['logo'].file:

            img=request.POST['logo'].file
            image=Image.open(img)
            imgbuffer = cStringIO.StringIO()
            image.save(imgbuffer, format="JPEG")
            img_str = base64.b64encode(imgbuffer.getvalue())
            image.close()
            filelogo=img_str

            gkdata["logo"]=filelogo
    except:
        print "no file found "

    result = requests.put("http://127.0.0.1:6543/organisations", headers=header, data=json.dumps(gkdata))
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
    gkdata= {"invflag":request.params["invflag"],"invsflag":request.params["invsflag"],"billflag":request.params["billflag"]}
    result = requests.put("http://127.0.0.1:6543/organisations", headers=header, data=json.dumps(gkdata))
    return {"gkstatus":result.json()["gkstatus"]}
