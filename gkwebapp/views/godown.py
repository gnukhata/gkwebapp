
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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os

@view_config(route_name="godown",renderer="gkwebapp:templates/godown.jinja2")
def showcategory(request):
	return {"status":True}

@view_config(route_name="showgodown", renderer="gkwebapp:templates/creategodown.jinja2")
def showgodown(request):
	return {"status":True}

@view_config(route_name="showmultigodown", renderer="gkwebapp:templates/multiplegodowns.jinja2")
def showmultigodown(request):
	return {"status":True}

@view_config(route_name="addgodown", renderer="json")
def addgodown(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata = {"goname":request.params["godownname"],"goaddr":request.params["godownaddress"], "gocontact":request.params["godowncontact"]}
	print gkdata
	result = requests.post("http://127.0.0.1:6543/godown", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="addmultigodowns", renderer="json")
def addmultigodowns(request):
	header={"gktoken":request.headers["gktoken"]}
	goddetails = json.loads(request.params["goddetails"])
	gkdata = {}
	for godown in goddetails:
		gkdata["goname"] = godown["godownname"]
		gkdata["goaddr"] = godown["godownaddress"]
		gkdata["gocontact"] = godown["godowncontact"]
		result = requests.post("http://127.0.0.1:6543/godown", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="showeditgodown", renderer="gkwebapp:templates/editgodown.jinja2")
def showeditgodown(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/godown", headers=header)
	goddata=[]
	for record in result.json()["gkresult"]:
		gdata= {"godownname":str(record["goname"]),"godownid":str(record["goid"])}
		goddata.append(gdata)
	return {"gkresult":goddata}

@view_config(route_name="getgoddetails", renderer="json")
def getgoddetails(request):
	header={"gktoken":request.headers["gktoken"]}
	goid = int(request.params["goid"])
	result = requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(goid), headers=header)
	if(result.json()["gkstatus"] == 0):
		record = result.json()["gkresult"]
		resp = {"godownid": str(record["goid"]), "godownname" : str(record["goname"]), "godownaddress": str(record["goaddr"]), "godowncontact": str(record["gocontact"])}
		return {"gkstatus":0, "gkresult":resp}
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="deletegodown", renderer="json")
def deletegodown(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata={"goid":request.params["goid"]}
	result = requests.delete("http://127.0.0.1:6543/godown",data =json.dumps(gkdata), headers=header)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="editgodown", renderer="json")
def editgodown(request):
		header={"gktoken":request.headers["gktoken"]}
		gkdata = {"goid":request.params["goid"],"goname":request.params["goname"],"goaddr":request.params["goaddr"], "gocontact": request.params["gocontact"]}
		result = requests.put("http://127.0.0.1:6543/godown", data =json.dumps(gkdata),headers=header)
		return {"gkstatus":result.json()["gkstatus"]}
