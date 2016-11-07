
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

@view_config(route_name="unitofmeasurements",renderer="gkwebapp:templates/unitofmeasurement.jinja2")
def showunit(request):
	return {"status":True}

@view_config(route_name="unitofmeasurements",request_param="action=showadd",renderer="gkwebapp:templates/addunitofmeasurement.jinja2")
def showaddunit(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="unitofmeasurements",request_param="action=showedit",renderer="gkwebapp:templates/editunitofmeasurement.jinja2")
def showeditunit(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}


@view_config(route_name="unitofmeasurements",request_param="action=getunit",renderer="json")
def getunit(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=single&uomid=%d"%(int(request.params["uomid"])), headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="unitofmeasurements",request_param="action=save",renderer="json")
def saveunit(request):
	header={"gktoken":request.headers["gktoken"]}
	if request.params["subunitof"]!='':
		dataset={"unitname":request.params["unitname"],"conversionrate":float(request.params["conversionrate"]),"subunitof":int(request.params["subunitof"])}
	else:
		dataset={"unitname":request.params["unitname"]}
	result = requests.post("http://127.0.0.1:6543/unitofmeasurement", data=json.dumps(dataset),headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="unitofmeasurements",request_param="action=edit",renderer="json")
def editunit(request):
	header={"gktoken":request.headers["gktoken"]}
	if request.params["subunitof"]!='':
		dataset={"unitname":request.params["unitname"],"conversionrate":float(request.params["conversionrate"]),"subunitof":int(request.params["subunitof"]),"uomid":int(request.params["uomid"])}
	else:
		dataset={"unitname":request.params["unitname"],"uomid":int(request.params["uomid"])}
	result = requests.put("http://127.0.0.1:6543/unitofmeasurement", data=json.dumps(dataset),headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="unitofmeasurements", request_param="action=delete",renderer="json")
def deleteunit(request):
	header={"gktoken":request.headers["gktoken"]}
	dataset={"uomid":int(request.params["uomid"])}
	result = requests.delete("http://127.0.0.1:6543/unitofmeasurement",data =json.dumps(dataset), headers=header)
	return {"gkstatus":result.json()["gkstatus"]}
