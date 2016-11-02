
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

@view_config(route_name="deliverychallan",renderer="gkwebapp:templates/deliverychallan.jinja2")
def showdeliverychallan(request):
	return {"status":True}

@view_config(route_name="deliverychallan",request_param="action=showadd",renderer="gkwebapp:templates/adddeliverychallan.jinja2")
def showadddeliverychallan(request):
	header={"gktoken":request.headers["gktoken"]}
	podata = requests.get("http://127.0.0.1:6543/purchaseorder?po=all", headers=header)
	customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
	return {"gkstatus": podata.json()["gkstatus"], "customers": customers.json()["gkresult"],"products": products.json()["gkresult"],"purchaseorders":podata.json()["gkresult"],"godowns":godowns.json()["gkresult"]}

@view_config(route_name="deliverychallan",request_param="action=showedit",renderer="gkwebapp:templates/editdeliverychallan.jinja2")
def showeditdeliverychallan(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}
