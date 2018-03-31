
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="purchaseorder",request_param="type=tab",renderer="gkwebapp:templates/purchaseorder.jinja2")
def purchaseorder(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=16",headers=header)
    result1 = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=19",headers=header)
    return{"numberofpurchaseorders":len(result.json()["gkresult"]),"numberofsalesorders":len(result1.json()["gkresult"]),"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="purchaseorder",request_param="type=showview",renderer="gkwebapp:templates/viewpurchaseorder.jinja2")
def showviewpurchaseorder(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=16",headers=header)
    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="purchaseorder",request_param="type=details", renderer="gkwebapp:templates/viewsinglepurchaseorder.jinja2")
def purchaseorderdetails(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/purchaseorder?poso=single&orderid=%d"%(int(request.params['orderid'])),headers=header)
    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="salesorder",request_param="type=showview",renderer="gkwebapp:templates/viewsalesorder.jinja2")
def showviewsalesorder(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=19",headers=header)
    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="purchaseorder",request_param="action=showadd",renderer="gkwebapp:templates/addsalesorder.jinja2")
def showaddpurchaseorder(request):
    header={"gktoken":request.headers["gktoken"]}
    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
    products = requests.get("http://127.0.0.1:6543/products?invdc=4", headers=header)
    productsnservices = requests.get("http://127.0.0.1:6543/products", headers=header)
    godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    return {"status":16,"customers": customers.json()["gkresult"],"products": products.json()["gkresult"], "productsnservices": productsnservices.json()["gkresult"],"godowns":godowns.json()["gkresult"], "states": states.json()["gkresult"], "resultgstvat":resultgstvat.json()["gkresult"]}



@view_config(route_name="salesorder",request_param="action=showsalesadd",renderer="gkwebapp:templates/addsalesorder.jinja2")
def showaddsalesorder(request):
    header={"gktoken":request.headers["gktoken"]}
    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
    products = requests.get("http://127.0.0.1:6543/products?invdc=4", headers=header)
    productsnservices = requests.get("http://127.0.0.1:6543/products", headers=header)
    godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    return {"status":19,"customers": customers.json()["gkresult"],"products": products.json()["gkresult"],"productsnservices": productsnservices.json()["gkresult"],"godowns":godowns.json()["gkresult"],"states": states.json()["gkresult"], "resultgstvat":resultgstvat.json()["gkresult"]}

@view_config(route_name="purchaseorder",request_param="action=save",renderer="json")
def savepurchaseorder(request):
    header={"gktoken":request.headers["gktoken"]}
    purchaseorderdata = {"orderno":request.params["orderno"],"orderdate":request.params["orderdate"],"creditperiod":request.params["creditperiod"],"payterms":request.params["payterms"], "modeoftransport":request.params["modeoftransport"],"issuername":request.params["issuername"],"designation":request.params["designation"],"schedule":json.loads(request.params["schedule"]),"taxstate":request.params["taxstate"],"psflag":request.params["psflag"],"csid":request.params["csid"], "tax":json.loads(request.params["tax"]),"cess":json.loads(request.params["cess"]), "sourcestate":request.params["sourcestate"], "taxstate":request.params["taxstate"], "orgstategstin":request.params["orgstategstin"], "consignee":json.loads(request.params["consignee"]), "freeqty":json.loads(request.params["freeqty"]), "reversecharge":request.params["reversecharge"], "vehicleno":request.params["vehicleno"], "discount":json.loads(request.params["discount"]), "paymentmode":request.params["paymentmode"], "address":request.params["address"]}
    if "togodown" in request.params:
        purchaseorderdata["togodown"] = request.params["togodown"]
    if "bankdetails" in request.params:
        purchaseorderdata["bankdetails"] = json.loads(request.params["bankdetails"])
    if  "dateofsupply" in request.params:
        purchaseorderdata["dateofsupply"] = request.params["dateofsupply"]
    result=requests.post("http://127.0.0.1:6543/purchaseorder",data=json.dumps(purchaseorderdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="purchaseorder",request_param="action=getuser",renderer="json")
def getuser(request):
	header={"gktoken":request.headers["gktoken"]}
	usern = requests.get("http://127.0.0.1:6543/users?user=single", headers=header)
	username = usern.json()["gkresult"]["username"]
	return {"status":True,"username":username}
