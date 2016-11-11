
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
	if request.params["status"]=='in':
		podata = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=16", headers=header)
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	else:
		podata = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=20", headers=header)
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
	return {"gkstatus": request.params["status"],"suppliers": suppliers.json()["gkresult"],"products": products.json()["gkresult"],"godowns":godowns.json()["gkresult"],"purchaseorders":podata.json()["gkresult"]}

@view_config(route_name="deliverychallan",request_param="action=showedit",renderer="gkwebapp:templates/editdeliverychallan.jinja2")
def showeditdeliverychallan(request):
	header={"gktoken":request.headers["gktoken"]}
	delchals = requests.get("http://127.0.0.1:6543/delchal?delchal=all", headers=header)
	suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
	return {"gkstatus":delchals.json()["gkstatus"],"delchals":delchals.json()["gkresult"],"suppliers":suppliers.json()["gkresult"],"customers":customers.json()["gkresult"],"godowns":godowns.json()["gkresult"]}

@view_config(route_name="deliverychallan",request_param="action=getproducts",renderer="json")
def getproducts(request):
	header={"gktoken":request.headers["gktoken"]}
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	return {"gkstatus": products.json()["gkstatus"],"products": products.json()["gkresult"]}

@view_config(route_name="deliverychallan",request_param="action=getpurchaseorder",renderer="json")
def getpurchaseorder(request):
	header={"gktoken":request.headers["gktoken"]}
	podata = requests.get("http://127.0.0.1:6543/purchaseorder?poso=single&orderid=%d"%(int(request.params["orderid"])), headers=header)
	return {"gkstatus": podata.json()["gkstatus"],"podata": podata.json()["gkresult"]}

@view_config(route_name="deliverychallan",request_param="action=getdelchal",renderer="json")
def getdelchal(request):
	header={"gktoken":request.headers["gktoken"]}
	delchaldata = requests.get("http://127.0.0.1:6543/delchal?delchal=single&dcid=%d"%(int(request.params["dcid"])), headers=header)
	return {"gkstatus": delchaldata.json()["gkstatus"],"delchaldata": delchaldata.json()["gkresult"]}


@view_config(route_name="deliverychallan",request_param="action=save",renderer="json")
def savedelchal(request):
	header={"gktoken":request.headers["gktoken"]}
	delchaldata = {"custid":int(request.params["custid"]),"dcno":request.params["dcno"],"dcdate":request.params["dcdate"],"dcflag":request.params["dcflag"]}
	products = {}
	for  row in json.loads(request.params["products"]):
		products[row["productcode"]] = row["qty"]
	stockdata = {"inout":request.params["inout"],"items":products}
	if request.params["orderid"]!='':
		delchaldata["orderno"]=request.params["orderid"]
	if request.params["goid"]!='':
		stockdata["goid"]=int(request.params["goid"])
	if request.params.has_key("issuername"):
		delchaldata["issuername"]=request.params["issuername"]
	if request.params.has_key("designation"):
		delchaldata["designation"]=request.params["designation"]
	delchalwholedata = {"delchaldata":delchaldata,"stockdata":stockdata}
	result=requests.post("http://127.0.0.1:6543/delchal",data=json.dumps(delchalwholedata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}
