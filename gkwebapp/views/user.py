
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
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="showuser", renderer="gkwebapp:templates/createuser.jinja2")
def showuser(request):
    return {"gkresult":"0"}

@view_config(route_name="showedituser", renderer="gkwebapp:templates/edituser.jinja2")
def showedituser(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/user", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="edituser", renderer="json")
def edituser(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata={"userid":request.params["userid"], "username":request.params["username"], "userpassword":request.params["userpassword"]}
	result = requests.put("http://127.0.0.1:6543/users", headers=header, data=json.dumps(gkdata))
	print result.json()["gkstatus"]
	print "abc"
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="createuser", renderer="json")
def createuser(request):
    headers={"gktoken":request.headers["gktoken"]}
    gkdata = {"username":request.params["username"],"userpassword":request.params["userpassword"],"userrole":int(request.params["userrole"]),"userquestion":request.params["userquestion"],"useranswer":request.params["useranswer"]}
    print gkdata
    result = requests.post("http://127.0.0.1:6543/users", data =json.dumps(gkdata), headers=headers)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="removeuser", renderer="gkwebapp:templates/removeUser.jinja2")
def removeuser(request):
    headers={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/users", headers=headers)
    return {"gkstatus": result.json()["gkstatus"], "Users": result.json()["gkresult"]}


@view_config(route_name="deleteuser", renderer="json")
def deleteuser(request):
    headers={"gktoken":request.headers["gktoken"]}
    gkdata={"userid":request.params["username"] }
    result = requests.delete("http://127.0.0.1:6543/users", data=json.dumps(gkdata), headers=headers)
    print result.json()
    return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="forgotpassword", renderer="gkwebapp:templates/forgotpassword.jinja2")
def forgotpassword(request):
    code = request.params["orgcode"]
    return {"orgcode":code}

@view_config(route_name="securityquestion", renderer="json")
def securityquestion(request):
    result = requests.get("http://127.0.0.1:6543/forgotpassword?orgcode=%s&username=%s" % ((request.params["orgcode"]),(request.params["username"])))
    userdata=[]
    userdata.append(result.json()["gkresult"])
    print userdata
    return {"gkresult":userdata}
