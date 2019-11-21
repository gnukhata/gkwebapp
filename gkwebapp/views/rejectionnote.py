
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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"""

from pyramid.view import view_config
import requests, json
import time
from pyramid.renderers import render_to_response

@view_config(route_name="rejectionnote",renderer="gkwebapp:templates/rejectionnote.jinja2")
def showrejectionnote(request):
    header={"gktoken":request.headers["gktoken"]}
    rnotes = requests.get("http://127.0.0.1:6543/rejectionnote?type=all", headers=header)
    return {"noofrejectionnotes":len(rnotes.json()["gkresult"]),"status":True}

@view_config(route_name="rejectionnote",request_param="action=showadd",renderer="gkwebapp:templates/addrejectionnote.jinja2")
def showaddrejectionnote(request):
    header={"gktoken":request.headers["gktoken"]}
    unbilled_delnotes = requests.get("http://127.0.0.1:6543/invoice?unbilled_delnotes", data=json.dumps({"inputdate": time.strftime("%Y-%m-%d"), "type":"rejectionnote"}), headers=header)
    nonrejectedinv = requests.get("http://127.0.0.1:6543/invoice?type=nonrejected", data=json.dumps({"inputdate": time.strftime("%Y-%m-%d")}), headers=header)
    return {"gkstatus": request.params["status"], "invoices": nonrejectedinv.json()["gkresult"], "deliverynotes":unbilled_delnotes.json()["gkresult"]}

@view_config(route_name="rejectionnote",request_param="action=showview",renderer="gkwebapp:templates/viewrejectionnote.jinja2")
def showviewrejectionnote(request):
    header={"gktoken":request.headers["gktoken"]}
    rnotes = requests.get("http://127.0.0.1:6543/rejectionnote?type=all", headers=header)
    return {"gkstatus":rnotes.json()["gkstatus"],"rejectionnotes":rnotes.json()["gkresult"],"noofrejectionnotesin":rnotes.json()["rejincount"],"noofrejectionnotesout":rnotes.json()["rejoutcount"]}

@view_config(route_name="rejectionnote",request_param="action=nonrejectedinvprods",renderer="json")
def nonrejectedinvprods(request):
    header={"gktoken":request.headers["gktoken"]}
    rnotes = requests.get("http://127.0.0.1:6543/invoice?type=nonrejectedinvprods", data=json.dumps({"invid":request.params["invid"] }), headers=header)
    orgaddress = requests.get("http://127.0.0.1:6543/organisation", headers=header)
    return {"gkstatus":rnotes.json()["gkstatus"],"items":rnotes.json()["gkresult"], "delchal": rnotes.json()["delchal"],"invDetails":rnotes.json()["invDetails"],"orgdata":orgaddress.json()["gkdata"]}


@view_config(route_name="rejectionnote",request_param="action=getrejectionnote",renderer="json")
def getrejectionnote(request):
    header={"gktoken":request.headers["gktoken"]}
    rnotes = requests.get("http://127.0.0.1:6543/rejectionnote?type=single&rnid=%d"%(int(request.params["rnid"])), headers=header)
    orgaddress = requests.get("http://127.0.0.1:6543/organisation", headers=header)
    return {"gkstatus":rnotes.json()["gkstatus"],"gkresult":rnotes.json()["gkresult"],"orgdata":orgaddress.json()["gkdata"]}

@view_config(route_name="rejectionnote",request_param="action=save",renderer="json")
def saverejectionnote(request):
    header={"gktoken":request.headers["gktoken"]}
    rndata = {"rnno":request.params["rnno"],"rndate":request.params["rndate"],"inout":request.params["inout"],"rejprods" : json.loads(request.params["products"]),"rejectedtotal":request.params["rejectedtotal"]}
    if "dcid" in request.params:
        rndata["dcid"] = request.params["dcid"]
    if "invid" in request.params:
        rndata["invid"] = request.params["invid"]
    stockdata = {"inout":int(request.params["inout"]),"items":json.loads(request.params["products"])}
    if request.params.has_key("goid"):
        stockdata["goid"]=int(request.params["goid"])
    rnwholedata = {"rejectionnotedata":rndata,"stockdata":stockdata}
    result=requests.post("http://127.0.0.1:6543/rejectionnote",data=json.dumps(rnwholedata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="rejectionnote",request_param="action=getprint",renderer="gkwebapp:templates/printrejectionnote.jinja2")
def printrejectionnote(request):
    header={"gktoken":request.headers["gktoken"]}
    rnotes = requests.get("http://127.0.0.1:6543/rejectionnote?type=single&rnid=%d"%(int(request.params["rnid"])), headers=header)
    org = requests.get("http://127.0.0.1:6543/organisation",headers=header)
    return {"gkstatus":org.json()["gkstatus"],"org":org.json()["gkdata"],"gkresult":rnotes.json()["gkresult"]}
