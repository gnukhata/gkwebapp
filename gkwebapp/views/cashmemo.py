
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
"sachin Patil"  <sachpatil@openmailbox.org>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="cashmemos",renderer="gkwebapp:templates/cashmemo.jinja2")
def showinvoice(request):
	return {"status":True}

@view_config(route_name="cashmemos",request_param="action=showadd",renderer="gkwebapp:templates/addcashmemo.jinja2")
def showaddcashmemo(request):
	header={"gktoken":request.headers["gktoken"]}
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	return {"gkstatus": request.params["status"],"products": products.json()["gkresult"]}

@view_config(route_name="cashmemos",request_param="action=showedit",renderer="gkwebapp:templates/viewcashmemo.jinja2")
def showeditcashmemo(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/invoice?cash=all", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="cashmemos",request_param="action=getproducts",renderer="json")
def getproducts(request):
	header={"gktoken":request.headers["gktoken"]}
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	return {"gkstatus": products.json()["gkstatus"],"products": products.json()["gkresult"]}


@view_config(route_name="cashmemos",request_param="action=save",renderer="json")
def savecashmemo(request):
	header={"gktoken":request.headers["gktoken"]}
	print request.params
	cashmemodata = {"invoiceno":request.params["invoiceno"],"invoicetotal":request.params["invoicetotal"],"icflag":3,"taxstate":request.params["taxstate"],"invoicedate":request.params["invoicedate"],
		"tax":json.loads(request.params["tax"]),
		"contents":json.loads(request.params["contents"]),"freeqty":json.loads(request.params["freeqty"]),"discount":json.loads(request.params["discount"])}
	print cashmemodata
	stock = json.loads(request.params["stock"])
	invoicewholedata = {"invoice":cashmemodata,"stock":stock}
	print invoicewholedata
	result=requests.post("http://127.0.0.1:6543/invoice",data=json.dumps(invoicewholedata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="cashmemos",request_param="action=gettax",renderer="json")
def getstatetax(request):
	header={"gktoken":request.headers["gktoken"]}
	if request.params["state"]=="":
		taxdata = requests.get("http://127.0.0.1:6543/tax?pscflag=i&productcode=%d"%(int(request.params["productcode"])), headers=header)
	else:
		taxdata = requests.get("http://127.0.0.1:6543/tax?pscflag=i&productcode=%d&state=%s"%(int(request.params["productcode"]),request.params["state"]), headers=header)


	return {"gkstatus": taxdata.json()["gkstatus"],"taxdata": taxdata.json()["gkresult"]}



@view_config(route_name="cashmemos",request_param="action=getinvdetails",renderer="json")
def getInvoiceDetails(request):
	header={"gktoken":request.headers["gktoken"]}
	invoicedata = requests.get("http://127.0.0.1:6543/invoice?inv=single&invid=%d"%(int(request.params["invid"])), headers=header)
	return {"gkstatus": invoicedata.json()["gkstatus"],"invoicedata": invoicedata.json()["gkresult"]}

@view_config(route_name="cashmemos",request_param="action=cancel",renderer="json")
def getproducts(request):
	header={"gktoken":request.headers["gktoken"]}
	invoice = requests.delete("http://127.0.0.1:6543/invoice",data=json.dumps({"invid":request.params["cashmemoid"],"cancelflag":1,"icflag":3}), headers=header)
	return {"gkstatus": invoice.json()["gkstatus"]}

@view_config(route_name="cashmemos",request_param="action=print",renderer="gkwebapp:templates/printcashmemo.jinja2")
def Invoiceprint(request):
	header={"gktoken":request.headers["gktoken"]}
	org = requests.get("http://127.0.0.1:6543/organisation", headers=header)
	tableset = json.loads(request.params["printset"])
	return {"gkstatus":org.json()["gkstatus"],"org":org.json()["gkdata"],
	"tableset":tableset,"invoiceno":request.params["invoiceno"],"invoicedate":request.params["invoicedate"],
	"subtotal":request.params["subtotal"],
	"taxtotal":request.params["taxtotal"],"gtotal":request.params["gtotal"]}
