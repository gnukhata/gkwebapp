
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
from pyramid.response import Response
import os
from odslib import ODS

@view_config(route_name="category",renderer="gkwebapp:templates/category.jinja2")
def showcategory(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	categories = result.json()["gkresult"]
	gkresult = len(categories)
	""" gkresult used to decide whether to show Edit Category button or not """
	return {"status":True, "gkresult": gkresult}

@view_config(route_name="category",request_param="action=showadd",renderer="gkwebapp:templates/addcategory.jinja2")
def showaddcategory(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"],"categorycount":len(result.json()["gkresult"])}

@view_config(route_name="category",request_param="action=showedit",renderer="gkwebapp:templates/editcategory.jinja2")
def showeditcategory(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=getspecs",renderer="json")
def getspecs(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categoryspecs?categorycode=%d"%(int(request.params["categorycode"])), headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=gettax",renderer="json")
def gettax(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/tax?pscflag=c&categorycode=%d"%(int(request.params["categorycode"])), headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=getCategory",renderer="json")
def getCategory(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories?type=single&categorycode=%d"%(int(request.params["categorycode"])), headers=header)
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
		taxes = json.loads(request.params["taxes"])
		for tax in taxes:
			taxdata= {"taxname":tax["taxname"],"taxrate":float(tax["taxrate"]),"categorycode":result.json()["gkresult"]}
			if tax["state"]!='':
				taxdata["state"]=tax["state"]
			taxresult = requests.post("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
		return {"gkstatus": result.json()["gkstatus"]}
	else:
		return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="category",request_param="action=edit",renderer="json")
def editspecs(request):
	header={"gktoken":request.headers["gktoken"]}
	if request.params["subcategoryof"]!='':
		categorydata={"categoryname":request.params["categoryname"],"subcategoryof":int(request.params["subcategoryof"]),"categorycode":int(request.params["categorycode"])}
	else:
		categorydata={"categoryname":request.params["categoryname"],"subcategoryof":None,"categorycode":int(request.params["categorycode"])}
	result = requests.put("http://127.0.0.1:6543/categories",data=json.dumps(categorydata) ,headers=header)
	if result.json()["gkstatus"]==0:
		specs = json.loads(request.params["specs"])
		deletedspecs = json.loads(request.params["deletedspecs"])
		for spec in specs:
			if spec["spcode"] != "New":
				specdata= {"attrname":spec["attrname"],"attrtype":int(spec["attrtype"]),"spcode":int(spec["spcode"]),"categorycode":int(request.params["categorycode"])}
				specresult = requests.put("http://127.0.0.1:6543/categoryspecs",data=json.dumps(specdata) ,headers=header)
			else:
				specdata= {"attrname":spec["attrname"],"attrtype":int(spec["attrtype"]),"categorycode":int(request.params["categorycode"])}
				specresult = requests.post("http://127.0.0.1:6543/categoryspecs",data=json.dumps(specdata) ,headers=header)
		if len(deletedspecs)>0:
			for deletedspec in deletedspecs:
				deletedspecdata= {"spcode":int(deletedspec)}
				deletedspecresult = requests.delete("http://127.0.0.1:6543/categoryspecs",data=json.dumps(deletedspecdata) ,headers=header)
		taxs = json.loads(request.params["taxes"])
		deletedtaxs = json.loads(request.params["deletedtaxs"])
		for tax in taxs:
			if tax["taxid"] != "New":
				taxdata= {"taxid":tax["taxid"],"taxname":tax["taxname"],"taxrate":float(tax["taxrate"]),"categorycode":int(request.params["categorycode"])}
				if tax["state"]!='':
					taxdata["state"]=tax["state"]
				else:
					taxdata["state"]=None
				taxresult = requests.put("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
			else:
				taxdata= {"taxname":tax["taxname"],"taxrate":float(tax["taxrate"]),"categorycode":int(request.params["categorycode"])}
				if tax["state"]!='':
					taxdata["state"]=tax["state"]
				taxresult = requests.post("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
		if len(deletedtaxs)>0:
			for deletedtax in deletedtaxs:
				deletedtaxdata= {"taxid":int(deletedtax)}
				deletedtaxresult = requests.delete("http://127.0.0.1:6543/tax",data=json.dumps(deletedtaxdata) ,headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="category",request_param="action=delete",renderer="json")
def deletecategory(request):
	header={"gktoken":request.headers["gktoken"]}
	categorydata = {"categorycode":int(request.params["categorycode"])}
	result = requests.delete("http://127.0.0.1:6543/categories",data=json.dumps(categorydata), headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="category",request_param="action=list",renderer="gkwebapp:templates/listofcategories.jinja2")
def listofcategories(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=printable", renderer="gkwebapp:templates/printlistofcategories.jinja2")
def printlistofgodowns(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=spreadsheet", renderer="")
def listofgodownssspreadsheet(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	result = result.json()["gkresult"]
	fystart = str(request.params["fystart"]);
	fyend = str(request.params["fyend"]);
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fystart+" to "+fyend +")"
	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.setSheetName("List of Categories")
	sheet.getRow(0).setHeight("23pt")

	sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
	ods.content.mergeCells(0,0,4,1)
	sheet.getRow(1).setHeight("18pt")
	sheet.getCell(0,1).stringValue("List Of Categories").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	ods.content.mergeCells(0,1,4,1)
	sheet.getColumn(1).setWidth("7cm")
	sheet.getColumn(2).setWidth("7cm")
	sheet.getColumn(3).setWidth("2cm")
	sheet.getCell(0,2).stringValue("Sr. No.").setBold(True)
	sheet.getCell(1,2).stringValue("Child Category").setBold(True)
	sheet.getCell(2,2).stringValue("Parent Category").setBold(True)
	sheet.getCell(3,2).stringValue("Status").setBold(True)
	row = 3
	for category in result:
		sheet.getCell(0, row).stringValue(category["srno"])
		sheet.getCell(1, row).stringValue(category["categoryname"])
		sheet.getCell(2, row).stringValue(category["parentcategory"])
		sheet.getCell(3, row).stringValue(category["categorystatus"])
		row += 1

	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	os.remove("response.ods")
	return Response(rep, headerlist=headerList.items())

@view_config(route_name="category",request_param="action=tree",renderer="gkwebapp:templates/treeviewofcategories.jinja2")
def treeviewofcategories(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories?type=topcategories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="action=treechildren",renderer="json")
def childrenofcategories(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories?type=children&categorycode=%d"%(int(request.params["categorycode"])), headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="category",request_param="type=countcategory",renderer="json")
def countcategory(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/categories", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "categorycount": len(result.json()["gkresult"])}
