
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
"Krishnakant Mane" <kk@dff.org.in>
"Arun Kelkar" <arunkelkar@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showproject")
def showproject(request):
    header={"gktoken":request.headers["gktoken"]}
    projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
    if projects.json()["gkstatus"]==0:
        return render_to_response("gkwebapp:templates/project.jinja2",{"projects":projects.json()["gkresult"]},request=request)
    else:
        return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)


@view_config(route_name="addproject", renderer="json")
def addproject(request):
    header={"gktoken":request.headers["gktoken"]}
    gkdata = {"projectname":request.params["projectname"].strip(),"sanctionedamount":float(request.params["sanctionedamount"])}
    result = requests.post("http://127.0.0.1:6543/projects",data=json.dumps(gkdata), headers=header)
    if result.json()["gkstatus"] == 0:
		gkdata = {"activity":gkdata["projectname"] + " project/cost center created"}
		resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="delproject", renderer="json")
def delproject(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/project/%s"%(request.params["projectcode"]), headers=header)
    projectname = result.json()["gkresult"]["projectname"]
    gkdata = {"projectcode":request.params["projectcode"]}
    result = requests.delete("http://127.0.0.1:6543/projects",data=json.dumps(gkdata), headers=header)
    if result.json()["gkstatus"] == 0:
		gkdata = {"activity":projectname + " project/cost center deleted"}
		resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="viewproject", renderer="json")
def viewproject(request):
    header={"gktoken":request.headers["gktoken"]}
    code = request.params["projectcode"]
    result = requests.get("http://127.0.0.1:6543/project/%s"%(code), headers=header)
    return {"gkstatus":result.json()["gkstatus"],"gkdata":result.json()["gkresult"]}

@view_config(route_name="editproject", renderer="json")
def editproject(request):
    header={"gktoken":request.headers["gktoken"]}
    gkdata = {"projectcode":request.params["projectcode"],"projectname":request.params["projectname"].strip(),"sanctionedamount":float(request.params["sanctionedamount"])}
    result = requests.put("http://127.0.0.1:6543/projects",data=json.dumps(gkdata), headers=header)
    return {"gkstatus":result.json()["gkstatus"]}
