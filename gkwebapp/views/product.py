
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
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="product",request_param="type=tab", renderer="gkwebapp:templates/producttab.jinja2")
def showproducttab(request):
	header={"gktoken":request.headers["gktoken"]}
	return{"gkresult":0}

@view_config(route_name="product",request_param="type=addtab", renderer="gkwebapp:templates/addproduct.jinja2")
def addproducttab(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	result1 = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)
	return{"gkresult":{"category":result.json()["gkresult"],"uom":result1.json()["gkresult"]},"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=specs", renderer="gkwebapp:templates/addproductspecs.jinja2")
def getcatspecs(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categoryspecs?categorycode=%d"%(int(request.params["categorycode"])), headers=header)
	return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=cattax", renderer="json")
def getcattax(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/tax?pscflag=c&categorycode=%d"%(int(request.params["categorycode"])), headers=header)
	return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=prodtax", renderer="json")
def getprodtax(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/tax?pscflag=p&productcode=%d"%(int(request.params["productcode"])), headers=header)
	return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=uom", renderer="json")
def produom(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.post("http://127.0.0.1:6543/unitofmeasurement", data=json.dumps({"unitname":request.params["unitname"]}),headers=header)
	if result.json()["gkstatus"] ==0:
		result = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)
		return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}
	else:
		return{"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=save", renderer="json")
def saveproduct(request):
	header={"gktoken":request.headers["gktoken"]}
	prdspecs = {}
	proddetails={}
	taxes =0
	for prd in request.params:

		if prd=="type":
			continue
		elif prd =="catselect":
			if request.params[prd] !="":
				proddetails["categorycode"] = request.params[prd]
		elif prd == "addproddesc":
			proddetails["productdesc"] = request.params[prd]
		elif prd == "uom":
			proddetails["uomid"] = request.params[prd]
		elif prd == "openingstock":
			proddetails["openingstock"] = request.params[prd]
		elif prd == "taxes":
			taxes = json.loads(request.params["taxes"])
		elif prd == "newuom":
			continue
		else:
			prdspecs[prd]= request.params[prd]

		proddetails["specs"] = prdspecs
	result = requests.post("http://127.0.0.1:6543/products", data=json.dumps(proddetails),headers=header)
	if len(taxes)>0:
		for tax in taxes:
			if len(tax)!=0:
				taxdata= {"taxname":tax["taxname"],"taxrate":float(tax["taxrate"]),"productcode":result.json()["gkresult"]}
				if tax["state"]!='':
					taxdata["state"]=tax["state"]
				taxresult = requests.post("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
	return {"gkstatus": result.json()["gkstatus"]}


@view_config(route_name="product",request_param="type=edit", renderer="json")
def editproduct(request):
	header={"gktoken":request.headers["gktoken"]}
	prdspecs = {}
	proddetails={}
	taxes =0

	for prd in request.params:
		if prd=="type":
			continue
		elif prd =="productcode":
			proddetails["productcode"] = request.params[prd]
		elif prd =="catselect":
			if request.params[prd] !="":
				proddetails["categorycode"] = request.params[prd]
		elif prd == "editproddesc":
			proddetails["productdesc"] = request.params[prd];
		elif prd == "uom":
			proddetails["uomid"] = request.params[prd]
		elif prd == "taxes":
			taxes = json.loads(request.params["taxes"])
		else:
			prdspecs[prd]= request.params[prd]
		proddetails["specs"] = prdspecs

	result = requests.put("http://127.0.0.1:6543/products", data=json.dumps(proddetails),headers=header)

	for tax in taxes:

		if len(tax)!=0:

			taxdata= {"taxname":tax["taxname"],"taxrate":float(tax["taxrate"]),"productcode":proddetails["productcode"]}
			if tax["state"]!='':
				taxdata["state"]=tax["state"]
			if tax["taxrowid"]=="new":
				taxresult = requests.post("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
			else:
				taxdata["taxid"] = tax["taxrowid"]
				taxresult = requests.put("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=delete", renderer="json")
def deleteproduct(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.delete("http://127.0.0.1:6543/products", data=json.dumps({"productcode":request.params["productcode"]}),headers=header)
	return{"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="product",request_param="type=edittab", renderer="gkwebapp:templates/editproduct.jinja2")
def editproducttab(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/products",headers=header)

	return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=details", renderer="gkwebapp:templates/editproductspecs.jinja2")
def productdetails(request):
	header={"gktoken":request.headers["gktoken"]}
	prodspecs={}
	result = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(request.params['productcode'])),headers=header)
	if result.json()["gkresult"]["categorycode"]!=None:
		result1 = requests.get("http://127.0.0.1:6543/categoryspecs?categorycode=%d"%(int(result.json()["gkresult"]["categorycode"])), headers=header)
		prodspecs = result1.json()["gkresult"]
	result2 = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)
	result3 = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return{"proddesc":result.json()["gkresult"],"prodspecs":prodspecs,"uom":result2.json()["gkresult"],"category":result3.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=list", renderer="gkwebapp:templates/listofstockitems.jinja2")
def listofstockitems(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/products",headers=header)

	return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}
