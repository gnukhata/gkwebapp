
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
"Sachin Patil" <sachpatil@openmailbox.org>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="customersuppliers",renderer="gkwebapp:templates/customersupplier.jinja2")
def showcustomersupplier(request):
	return {"status":True}

@view_config(route_name="customersuppliers",request_param="action=showadd",renderer="gkwebapp:templates/addcustomersupplier.jinja2")
def showaddcustomersupplier(request):
	header={"gktoken":request.headers["gktoken"]}
	customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	return {"customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=showedit",renderer="gkwebapp:templates/editcustomersupplier.jinja2")
def showeditcustomersupplier(request):
	header={"gktoken":request.headers["gktoken"]}
	customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	return {"customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=get",renderer="json")
def getcustomersupplier(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(request.params["custid"])), headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=save",renderer="json")
def savecustomersupplier(request):
	header={"gktoken":request.headers["gktoken"]}
	dataset={"custname":request.params["custname"],"custaddr":request.params["custaddr"],"custphone":request.params["custphone"],"custemail":request.params["custemail"],"custfax":request.params["custfax"],"state":request.params["state"],"custpan":request.params["custpan"],"custtan":request.params["custtan"],"csflag":int(request.params["csflag"])}
	result=requests.post("http://127.0.0.1:6543/customersupplier",data=json.dumps(dataset),headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="customersuppliers",request_param="action=edit",renderer="json")
def editcustomersupplier(request):
	header={"gktoken":request.headers["gktoken"]}
	dataset={"custname":request.params["custname"],"custaddr":request.params["custaddr"],"custphone":request.params["custphone"],"custemail":request.params["custemail"],"custfax":request.params["custfax"],"custpan":request.params["custpan"],"state":request.params["state"],"custtan":request.params["custtan"],"csflag":int(request.params["csflag"]),"custid":int(request.params["custid"])}
	result=requests.put("http://127.0.0.1:6543/customersupplier",data=json.dumps(dataset),headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="customersuppliers", request_param="action=delete",renderer="json")
def deletecustomersupplier(request):
	header={"gktoken":request.headers["gktoken"]}
	dataset={"custid":int(request.params["custid"])}
	result = requests.delete("http://127.0.0.1:6543/customersupplier",data =json.dumps(dataset), headers=header)
	return {"gkstatus":result.json()["gkstatus"]}
