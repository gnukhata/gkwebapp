
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
"Ishan Masdekar " <imasdekar@dff.org.in>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="invoice",renderer="gkwebapp:templates/invoice.jinja2")
def showinvoice(request):
	return {"status":True}

@view_config(route_name="invoice",request_param="action=showadd",renderer="gkwebapp:templates/addinvoice.jinja2")
def showaddinvoice(request):
	header={"gktoken":request.headers["gktoken"]}
	delchal = requests.get("http://127.0.0.1:6543/delchal?delchal=all", headers=header)
	if request.params["status"]=='in':
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	else:
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	products = requests.get("http://127.0.0.1:6543/products", headers=header)

	return {"gkstatus": request.params["status"],"suppliers": suppliers.json()["gkresult"],"products": products.json()["gkresult"],"deliverynotes":delchal.json()["gkresult"]}

@view_config(route_name="invoice",request_param="action=getproducts",renderer="json")
def getproducts(request):
	header={"gktoken":request.headers["gktoken"]}
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	return {"gkstatus": products.json()["gkstatus"],"products": products.json()["gkresult"]}


@view_config(route_name="invoice",request_param="action=save",renderer="json")
def saveinvoice(request):
	header={"gktoken":request.headers["gktoken"]}

	invoicedata = {"invoiceno":request.params["invoiceno"],"invoicedate":request.params["invoicedate"],
		"tax":json.loads(request.params["tax"]),"custid":request.params["custid"],
		"contents":json.loads(request.params["contents"])}

	stock = json.loads(request.params["stock"])
	if request.params["dcid"]!="":
		invoicedata["dcid"] = request.params["dcid"]
	invoicewholedata = {"invoice":invoicedata,"stock":stock}
	result=requests.post("http://127.0.0.1:6543/invoice",data=json.dumps(invoicewholedata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="invoice",request_param="action=showedit",renderer="gkwebapp:templates/editinvoice.jinja2")
def showeditinvoice(request):
	header={"gktoken":request.headers["gktoken"]}
	delchals = requests.get("http://127.0.0.1:6543/delchal?delchal=all", headers=header)
	return {"gkstatus":delchals.json()["gkstatus"],"delchals":delchals.json()["gkresult"]}


@view_config(route_name="invoice",request_param="action=getdeliverynote",renderer="json")
def getdeliverynote(request):
	header={"gktoken":request.headers["gktoken"]}
	delchal = requests.get("http://127.0.0.1:6543/delchal?delchal=single&dcid=%d"%(int(request.params["dcid"])), headers=header)
	return {"gkstatus": delchal.json()["gkstatus"],"delchal": delchal.json()["gkresult"]}

@view_config(route_name="invoice",request_param="action=gettax",renderer="json")
def getstatetax(request):
	header={"gktoken":request.headers["gktoken"]}
	if request.params["state"]=="":
		taxdata = requests.get("http://127.0.0.1:6543/tax?pscflag=i&productcode=%d"%(int(request.params["productcode"])), headers=header)
	else:
		taxdata = requests.get("http://127.0.0.1:6543/tax?pscflag=i&productcode=%d&state=%s"%(int(request.params["productcode"]),request.params["state"]), headers=header)


	return {"gkstatus": taxdata.json()["gkstatus"],"taxdata": taxdata.json()["gkresult"]}



'''


@view_config(route_name="invoice",request_param="action=getdelchal",renderer="json")
def getdelchal(request):
	header={"gktoken":request.headers["gktoken"]}
	delchaldata = requests.get("http://127.0.0.1:6543/delchal?delchal=single&dcid=%d"%(int(request.params["dcid"])), headers=header)

	return {"gkstatus": delchaldata.json()["gkstatus"],"delchaldata": delchaldata.json()["gkresult"]}

@view_config(route_name="invoice",request_param="action=showedit",renderer="gkwebapp:templates/editinvoice.jinja2")
def showeditinvoice(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/delchal?delchal=all", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}


'''
