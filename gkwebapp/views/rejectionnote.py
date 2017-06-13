
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
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="rejectionnote",renderer="gkwebapp:templates/rejectionnote.jinja2")
def showrejectionnote(request):
	header={"gktoken":request.headers["gktoken"]}
	rnotes = requests.get("http://127.0.0.1:6543/rejectionnote?type=all", headers=header)
	return {"noofrejectionnotes":len(rnotes.json()["gkresult"]),"status":True}

@view_config(route_name="rejectionnote",request_param="action=showadd",renderer="gkwebapp:templates/addrejectionnote.jinja2")
def showaddrejectionnote(request):
	header={"gktoken":request.headers["gktoken"]}
	unbilled_delnotes = requests.get("http://127.0.0.1:6543/invoice?unbilled_delnotes", data=json.dumps(gkdata), headers=header)
	result = requests.get("http://127.0.0.1:6543/invoice?inv=all", headers=header)
	return {"gkstatus": request.params["status"], "invoices": result.json()["gkresult"], "deliverynotes":unbilled_delnotes.json()["gkresult"]}

@view_config(route_name="rejectionnote",request_param="action=showview",renderer="gkwebapp:templates/viewrejectionnote.jinja2")
def showviewrejectionnote(request):
	header={"gktoken":request.headers["gktoken"]}
	rnotes = requests.get("http://127.0.0.1:6543/rejectionnote?type=all", headers=header)
	suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	return {"gkstatus":rnotes.json()["gkstatus"],"rejectionnotes":rnotes.json()["gkresult"],"suppliers":suppliers.json()["gkresult"],"customers":customers.json()["gkresult"]}
