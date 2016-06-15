
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

@view_config(route_name="showeditOrg", renderer="gkwebapp:templates/editorganisation.jinja2")
def showeditOrg(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/organisation", headers=header)
	return {"gkresult":result.json()["gkdata"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="editorganisation", renderer="json")
def editOrganisation(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata= {"orgcity":request.params["orgcity"],"orgaddr":request.params["orgaddr"],"orgpincode":request.params["orgpincode"],"orgstate":request.params["orgstate"], "orgcountry":request.params["orgcountry"],"orgtelno":request.params["orgtelno"], "orgfax":request.params["orgfax"],"orgwebsite":request.params["orgwebsite"],"orgemail":request.params["orgemail"],"orgpan":request.params["orgpan"],"orgmvat":request.params["orgmvat"],"orgstax":request.params["orgstax"],"orgregno":request.params["orgregno"],"orgregdate":request.params["orgregdate"], "orgfcrano":request.params["orgfcrano"],"orgfcradate":request.params["orgfcradate"]}
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
	result = requests.get("http://127.0.0.1:6543/rollclose?task=closebooks", headers=header)
	print result.json()["gkstatus"]
	return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="rollover", renderer="json")
def rollover(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/rollclose?task=rollover&financialend=%s"%(request.params["financialend"]), headers=header)
	print result.json()["gkstatus"]
	return {"gkstatus":result.json()["gkstatus"]}
