
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

@view_config(route_name="category",renderer="gkwebapp:templates/addcategory.jinja2")
def showcategory(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=getspecs",renderer="json")
def getspecs(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categoryspecs?categorycode=%d"%(int(request.params["categorycode"])), headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=save",renderer="json")
def savespecs(request):
	header={"gktoken":request.headers["gktoken"]}
	if request.params["subcategoryof"]!='':
		categorydata={"categoryname":request.params["categoryname"],"subcategoryof":int(request.params["subcategoryof"])}
	else:
		categorydata={"categoryname":request.params["categoryname"]}
	result = requests.post("http://127.0.0.1:6543/categories",data=json.dumps(categorydata) ,headers=header)
	if result.json()["gkstatus"]==0:
		specs = json.loads(request.params["specs"])
		for spec in specs:
			specdata= {"attrname":spec["attrname"],"attrtype":int(spec["attrtype"]),"categorycode":result.json()["gkresult"]}
			specresult = requests.post("http://127.0.0.1:6543/categoryspecs",data=json.dumps(specdata) ,headers=header)
		return {"gkstatus": specresult.json()["gkstatus"]}
	else:
		return {"gkstatus": result.json()["gkstatus"]}
