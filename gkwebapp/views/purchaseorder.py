
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
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="purchaseorder",renderer="gkwebapp:templates/purchaseorder.jinja2")
def purchaseorder(request):
	return {"status":True}


@view_config(route_name="purchaseorder",request_param="type=showview",renderer="gkwebapp:templates/viewpurchaseorder.jinja2")
def showviewpurchaseorder(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=16",headers=header)
	return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="purchaseorder",request_param="type=details", renderer="gkwebapp:templates/viewpurchaseorderdetails.jinja2")
def purchaseorderdetails(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/purchaseorder?poso=single&orderid=%d"%(int(request.params['orderid'])),headers=header)
	podetails = result.json()["gkresult"]
	print "heyyo"
	print podetails
	supplierid = podetails["csid"]
	supplier = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(supplierid)), headers=header)
	print podetails["schedule"]
	togoid = podetails["togodown"]
	print togoid
	togodown=requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(togoid)), headers=header)
	return{"gkresult":result.json()["gkresult"], "supplier":supplier.json()["gkresult"], "schedule":podetails["schedule"],"togodown":togodown.json()["gkresult"]}

@view_config(route_name="salesorder",request_param="type=details", renderer="gkwebapp:templates/viewsalesorderdetails.jinja2")
def salesorderdetails(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/purchaseorder?poso=single&orderid=%d"%(int(request.params['orderid'])),headers=header)
	sodetails = result.json()["gkresult"]
	customerid = sodetails["csid"]
	customer = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(customerid)), headers=header)
	print sodetails
	return{"gkresult":result.json()["gkresult"], "customer":customer.json()["gkresult"], "schedule":sodetails["schedule"]}



@view_config(route_name="salesorder",request_param="type=showview",renderer="gkwebapp:templates/viewsalesorder.jinja2")
def showviewsalesorder(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=20",headers=header)
	return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="purchaseorder",request_param="action=showadd",renderer="gkwebapp:templates/addpurchaseorder.jinja2")
def showaddpurchaseorder(request):
	header={"gktoken":request.headers["gktoken"]}
	suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
	return {"status":True,"suppliers": suppliers.json()["gkresult"],"products": products.json()["gkresult"],"godowns":godowns.json()["gkresult"]}



@view_config(route_name="salesorder",request_param="action=showsalesadd",renderer="gkwebapp:templates/addsalesorder.jinja2")
def showaddsalesorder(request):
	header={"gktoken":request.headers["gktoken"]}
	customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
	return {"status":True,"customers": customers.json()["gkresult"],"products": products.json()["gkresult"],"godowns":godowns.json()["gkresult"]}

@view_config(route_name="purchaseorder",request_param="action=save",renderer="json")
def savepurchaseorder(request):
	header={"gktoken":request.headers["gktoken"]}
	purchaseorderdata = {"orderno":request.params["orderno"],"orderdate":request.params["orderdate"],"creditperiod":request.params["creditperiod"],"payterms":request.params["payterms"],
		"modeoftransport":request.params["modeoftransport"],"designation":request.params["designation"],"schedule":json.loads(request.params["schedule"]),"taxstate":request.params["taxstate"],"psflag":request.params["psflag"],"csid":request.params["csid"],"togodown":request.params["togodown"]
		}
	result=requests.post("http://127.0.0.1:6543/purchaseorder",data=json.dumps(purchaseorderdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="salesorder",request_param="action=save",renderer="json")
def savesalesorder(request):
	header={"gktoken":request.headers["gktoken"]}
	salesorderdata = {"orderno":request.params["orderno"],"orderdate":request.params["orderdate"],"creditperiod":request.params["creditperiod"],"payterms":request.params["payterms"],
		"modeoftransport":request.params["modeoftransport"],"designation":request.params["designation"],"schedule":json.loads(request.params["schedule"]),"taxstate":request.params["taxstate"],"psflag":request.params["psflag"],"csid":request.params["csid"],"togodown":request.params["togodown"]
		}
	print salesorderdata
	result=requests.post("http://127.0.0.1:6543/purchaseorder",data=json.dumps(salesorderdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="purchaseorder",request_param="action=getuser",renderer="json")
def getuser(request):
	header={"gktoken":request.headers["gktoken"]}
	usern = requests.get("http://127.0.0.1:6543/user", headers=header)
	username = usern.json()["gkresult"]["username"]
	return {"status":True,"username":username}

@view_config(route_name="purchaseorder",request_param="action=getproduct",renderer="json")
def getproduct(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(request.params['productcode'])),headers=header)
	unit = result.json()["gkresult"]
	return {"gkstatus": result.json()["gkstatus"],"unitname":unit["unitname"]}


@view_config(route_name="purchaseorder",request_param="action=getproducts",renderer="json")
def getproducts(request):
	header={"gktoken":request.headers["gktoken"]}
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	return {"gkstatus": products.json()["gkstatus"],"products": products.json()["gkresult"]}
