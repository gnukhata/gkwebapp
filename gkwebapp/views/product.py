
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


Contributors:
"Krishnakant Mane" <kk@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Abhijith Balan" <abhijithb21@openmailbox.org>
"Prajkta Patkar" <prajkta.patkar007@gmail.com>
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
"Ravishankar Purne" <ravismail96@gmail.com>
"Reshma Bhatawadekar" <bhatawadekar1reshma@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
from odslib import ODS


@view_config(route_name="product",request_param="type=tab", renderer="gkwebapp:templates/producttab.jinja2")
def showproducttab(request):
    header={"gktoken":request.headers["gktoken"]}
    return{"a":1}
@view_config(route_name="product",request_param="type=addtabvat", renderer="gkwebapp:templates/addproductvat.jinja2")
def addProductTabVat(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/categories", headers=header)
    result1 = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)
    result2 = requests.get("http://127.0.0.1:6543/godown", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    userrole = requests.get("http://127.0.0.1:6543/user?type=role", headers=header)
    return{"gkresult":{"category":result.json()["gkresult"],"uom":result1.json()["gkresult"]},"godown":result2.json()["gkresult"],"gkstatus":result.json()["gkstatus"], "states": states.json()["gkresult"], "userrole": userrole.json()["gkresult"]}


@view_config(route_name="product",request_param="type=addtab", renderer="gkwebapp:templates/addproduct.jinja2")
def addproducttab(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/categories", headers=header)
    result1 = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)
    result2 = requests.get("http://127.0.0.1:6543/godown", headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    userrole = requests.get("http://127.0.0.1:6543/user?type=role", headers=header)
    products=requests.get("http://127.0.0.1:6543/products?list=all",headers=header)
    print products.json()["gkresult"]
    return{"gkresult":{"category":result.json()["gkresult"],"uom":result1.json()["gkresult"]},"godown":result2.json()["gkresult"],"gkstatus":result.json()["gkstatus"],"vatorgstflag":resultgstvat.json()["gkresult"], "states": states.json()["gkresult"], "userrole": userrole.json()["gkresult"],"products":products.json()["gkresult"]}

@view_config(route_name="product",request_param="type=hsnuom", renderer="json")
def gethsnuom(request):
    header={"gktoken":request.headers["gktoken"]}
    print request.params["productcode"]
    result = requests.get("http://127.0.0.1:6543/products?type=hsnuom&productcode=%d"%(int(request.params["productcode"])), headers=header)
    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="product",request_param="type=stockproduct", renderer="json")
def productstock(request):
    header = {"gktoken":request.headers["gktoken"]}
    gkdata = {"goid":request.params["goid"],"productdetails":json.loads(request.params["productdetails"])}
    print gkdata
    result = requests.post("http://127.0.0.1:6543/products?type=addstock",data=json.dumps(gkdata), headers=header)
    print result.json()["gkstatus"]
    return {"gkstatus": result.json()["gkstatus"]}

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

@view_config(route_name="product",request_param="by=category", renderer="json")
def getprodbycat(request):
    header={"gktoken":request.headers["gktoken"]}
    if request.params["categorycode"]=="":
        result = requests.get("http://127.0.0.1:6543/products?by=category&categorycode=", headers=header)
    else:
        result = requests.get("http://127.0.0.1:6543/products?by=category&categorycode=%d"%(int(request.params["categorycode"])), headers=header)

    if len(result.json()["gkresult"])==0:
        return{"gkresult":0,"gkstatus":result.json()["gkstatus"]}
    else:
        return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

'''This method is used to get opening stock and godown id's of given productcode(i.e. opening stock of a product in different godowns).'''
@view_config(route_name="product",request_param="by=godown", renderer="json")
def getgodownproduct(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products?by=godown&productcode=%d"%int(request.params["productcode"]), headers=header)
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
    productdetails={}
    godownflag=False
    taxes =0
    godowns={}
    goid=0
    goopeningstock=0.00
    for prd in request.params:

        if prd=="type":
            continue
        elif prd=="godownflag":
            if int(request.params[prd]) > 0:
                godownflag=True
            else:
                godownflag=False
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
        elif prd == "godowns":
            godowns = json.loads(request.params["godowns"])
        elif prd == "newuom":
            continue
        else:
            proddetails["specs"]= json.loads(request.params["specs"])

    if request.params.has_key("gscode"):
        proddetails["gscode"]=request.params["gscode"]
    if request.params.has_key("gsflag"):
        proddetails["gsflag"]=request.params["gsflag"]
    else:
        proddetails["gsflag"] = 7

    productdetails = {"productdetails":proddetails, "godetails":godowns, "godownflag":godownflag}
    if godownflag == True:
            godnames = ""
            j = 1;
            for i in godowns.keys():
                resultgodown = requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(i)), headers=header)
                godnames += resultgodown.json()["gkresult"]["goname"] + "(" + resultgodown.json()["gkresult"]["goaddr"] + ")"
                if j != len(godowns):
                    godnames += ", "
                j += 1

    result = requests.post("http://127.0.0.1:6543/products",data=json.dumps(productdetails),headers=header)

    if result.json()["gkstatus"] == 0:
        if godownflag == True:
            gkdata = {"activity":proddetails["productdesc"] + " product created in " + godnames + " godowns"}
        else:
            gkdata = {"activity":proddetails["productdesc"] + " product created"}
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)

    if result.json()["gkstatus"] == 0:
        if len(taxes)>0:
            for tax in taxes:
                taxdata= {"taxname":tax["taxname"],"taxrate":float(tax["taxrate"]),"productcode":result.json()["gkresult"]}
                if tax["state"]!='':
                    taxdata["state"]=tax["state"]

                taxresult = requests.post("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
    return {"gkstatus": result.json()["gkstatus"]}


@view_config(route_name="product",request_param="type=edit", renderer="json")
def editproduct(request):
    header={"gktoken":request.headers["gktoken"]}
    proddetails={}
    productdetails={}
    taxes =0
    taxdata = {}
    godownflag=False
    godowns={}
    goid=0
    goopeningstock=0.00
    for prd in request.params:
        if prd=="type":
            continue
        elif prd=="godownflag":
            if int(request.params[prd]) > 0:
                godownflag=True
            else:
                godownflag=False
        elif prd =="productcode":
            proddetails["productcode"] = request.params[prd]
        elif prd =="catselect":
            if request.params[prd] !="":
                proddetails["categorycode"] = request.params[prd]
        elif prd == "editproddesc":
            proddetails["productdesc"] = request.params[prd];
        elif prd == "uom":
            proddetails["uomid"] = request.params[prd]
        elif prd == "openingstock":
            proddetails["openingstock"] = request.params[prd]
        elif prd == "taxes":
            taxes = json.loads(request.params["taxes"])
        elif prd == "godowns":
            godowns = json.loads(request.params["godowns"])
        else:
            proddetails["specs"]= json.loads(request.params["specs"])
    if request.params.has_key("gscode"):
        proddetails["gscode"]=request.params["gscode"]
    if request.params.has_key("gsflag"):
        proddetails["gsflag"]=request.params["gsflag"]
    else:
         proddetails["gsflag"] = 7


    productdetails = {"productdetails":proddetails, "godetails":godowns, "godownflag":godownflag}
    result = requests.put("http://127.0.0.1:6543/products", data=json.dumps(productdetails),headers=header)
    if result.json()["gkstatus"] == 0:
        for tax in taxes:
            if len(tax)!=0:
                if tax["taxrowid"]!="new":
                    taxdata["taxid"] = tax["taxrowid"]
                    taxresult = requests.delete("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
        for tax in taxes:
            if len(tax)!=0:
                taxdata= {"taxname":tax["taxname"],"taxrate":float(tax["taxrate"]),"productcode":proddetails["productcode"]}
                if tax["state"]!='':
                    taxdata["state"]=tax["state"]
                taxresult = requests.post("http://127.0.0.1:6543/tax",data=json.dumps(taxdata) ,headers=header)
    return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=delete", renderer="json")
def deleteproduct(request):
    header={"gktoken":request.headers["gktoken"]}
    resultprod = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(request.params['productcode'])),headers=header)
    resultgoprod = requests.get("http://127.0.0.1:6543/products?by=godown&productcode=%d"%(int(request.params["productcode"])), headers=header)
    goproddata = resultgoprod.json()["gkresult"]
    result = requests.delete("http://127.0.0.1:6543/products", data=json.dumps({"productcode":request.params["productcode"]}),headers=header)
    if result.json()["gkstatus"] == 0:
        goddetdata = ""
        if len(goproddata) > 0:
            goddetdata = " from godown "
            j = 1
            for goprod in goproddata:
                result = requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(goprod["goid"])), headers=header)
                goddetdata = goddetdata + result.json()["gkresult"]["goname"] + "(" + result.json()["gkresult"]["goaddr"] + ")"
                if j != len(goproddata):
                    goddetdata += ", "
                j += 1
        gkdata = {"activity":resultprod.json()["gkresult"]["productdesc"] + " product deleted" + goddetdata + "."}
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return{"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="product",request_param="type=edittab", renderer="gkwebapp:templates/editproduct.jinja2")
def editproducttab(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products",headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    userrole = requests.get("http://127.0.0.1:6543/user?type=role", headers=header)
    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"],"vatorgstflag":resultgstvat.json()["gkresult"], "userrole":userrole.json()["gkresult"],"numberofproducts":len(result.json()["gkresult"])}

@view_config(route_name="product",request_param="type=edittabvat", renderer="gkwebapp:templates/editproductvat.jinja2")
def editProductTabVat(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products",headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    userrole = requests.get("http://127.0.0.1:6543/user?type=role", headers=header)
    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"],"vatorgstflag":resultgstvat.json()["gkresult"], "userrole": userrole.json()["gkresult"],"numberofproducts":len(result.json()["gkresult"])}


@view_config(route_name="product",request_param="type=details", renderer="gkwebapp:templates/editproductspecs.jinja2")
def productdetails(request):
    header={"gktoken":request.headers["gktoken"]}
    prodspecs={}
    result = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(request.params['productcode'])),headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    userrole = requests.get("http://127.0.0.1:6543/user?type=role", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)

    if result.json()["gkresult"]["gsflag"]==7:

        if result.json()["gkresult"]["categorycode"]!=None:
            result1 = requests.get("http://127.0.0.1:6543/categoryspecs?categorycode=%d"%(int(result.json()["gkresult"]["categorycode"])), headers=header)
            prodspecs = result1.json()["gkresult"]
        result2 = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)

        result3 = requests.get("http://127.0.0.1:6543/categories", headers=header)
        result4 = requests.get("http://127.0.0.1:6543/godown", headers=header)
        numberofgodowns = int(result.json()["numberofgodowns"])
        return{"proddesc":result.json()["gkresult"],"prodspecs":prodspecs,"uom":result2.json()["gkresult"],"category":result3.json()["gkresult"],"godown":result4.json()["gkresult"],"numberofgodowns":numberofgodowns,"gkstatus":result.json()["gkstatus"],"vatorgstflag":resultgstvat.json()["gkresult"], "states": states.json()["gkresult"], "userrole": userrole.json()["gkresult"]}
    else:
        return{"proddesc":result.json()["gkresult"],"vatorgstflag":resultgstvat.json()["gkresult"], "states": states.json()["gkresult"],"userrole": userrole.json()["gkresult"]}




@view_config(route_name="product",request_param="type=detailsvat", renderer="gkwebapp:templates/editproductspecsvat.jinja2")
def productDetailsVat(request):
    header={"gktoken":request.headers["gktoken"]}
    prodspecs={}
    result = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(request.params['productcode'])),headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    userrole = requests.get("http://127.0.0.1:6543/user?type=role", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)

    if result.json()["gkresult"]["gsflag"]==7:

        if result.json()["gkresult"]["categorycode"]!=None:
            result1 = requests.get("http://127.0.0.1:6543/categoryspecs?categorycode=%d"%(int(result.json()["gkresult"]["categorycode"])), headers=header)
            prodspecs = result1.json()["gkresult"]
        result2 = requests.get("http://127.0.0.1:6543/unitofmeasurement?qty=all", headers=header)

        result3 = requests.get("http://127.0.0.1:6543/categories", headers=header)
        result4 = requests.get("http://127.0.0.1:6543/godown", headers=header)
        numberofgodowns = int(result.json()["numberofgodowns"])
        return{"proddesc":result.json()["gkresult"],"prodspecs":prodspecs,"uom":result2.json()["gkresult"],"category":result3.json()["gkresult"],"godown":result4.json()["gkresult"],"numberofgodowns":numberofgodowns,"gkstatus":result.json()["gkstatus"],"vatorgstflag":resultgstvat.json()["gkresult"], "states": states.json()["gkresult"], "userrole": userrole.json()["gkresult"]}
    else:
        return{"proddesc":result.json()["gkresult"],"vatorgstflag":resultgstvat.json()["gkresult"], "states": states.json()["gkresult"]}


@view_config(route_name="product",request_param="type=list", renderer="gkwebapp:templates/listofstockitems.jinja2")
def listofstockitems(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products",headers=header)
    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=printable", renderer="gkwebapp:templates/printlistofstockitems.jinja2")
def printlistofstockitems(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products",headers=header)

    return{"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="product",request_param="type=spreadsheet", renderer="")
def listofstockitemsspreadsheet(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products", headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    resultgstvat = resultgstvat.json()["gkresult"]
    result = result.json()["gkresult"]
    fystart = str(request.params["fystart"]);
    fyend = str(request.params["fyend"]);
    orgname = str(request.params["orgname"])
    orgname += " (FY: " + fystart+" to "+fyend +")"
    ods = ODS()
    sheet = ods.content.getSheet(0)
    sheet.setSheetName("List of Products")
    sheet.getRow(0).setHeight("23pt")

    sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
    ods.content.mergeCells(0,0,4,1)
    sheet.getRow(1).setHeight("18pt")
    sheet.getCell(0,1).stringValue("List Of Products").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
    ods.content.mergeCells(0,1,4,1)
    sheet.getColumn(1).setWidth("9cm")
    sheet.getColumn(2).setWidth("4cm")
    sheet.getColumn(3).setWidth("4cm")
    sheet.getCell(0,2).stringValue("Sr. No.").setBold(True)
    if resultgstvat == "22":
        sheet.getCell(1,2).stringValue("Product").setBold(True)
        sheet.getCell(2,2).stringValue("Category").setBold(True)
        sheet.getCell(3,2).stringValue("UOM").setBold(True)
    else:
        sheet.getCell(1,2).stringValue("Product / Service").setBold(True)
        sheet.getCell(2,2).stringValue("Type").setBold(True)
        sheet.getCell(3,2).stringValue("Category").setBold(True)
        sheet.getCell(4,2).stringValue("UOM").setBold(True)

    if resultgstvat == "22":
        row = 3
        for stock in result:
            sheet.getCell(0, row).stringValue(stock["srno"])
            sheet.getCell(1, row).stringValue(stock["productdesc"])
            sheet.getCell(2, row).stringValue(stock["categoryname"])
            sheet.getCell(3, row).stringValue(stock["unitname"])
            row += 1
    else:
        row = 4
        for stock in result:
            sheet.getCell(0, row).stringValue(stock["srno"])
            sheet.getCell(1, row).stringValue(stock["productdesc"])
            if stock["gsflag"] == 7:
                sheet.getCell(2, row).stringValue("Product")
            else:
                sheet.getCell(2, row).stringValue("Service")
            sheet.getCell(3, row).stringValue(stock["categoryname"])
            sheet.getCell(4, row).stringValue(stock["unitname"])
            row += 1

    ods.save("response.ods")
    repFile = open("response.ods")
    rep = repFile.read()
    repFile.close()
    headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
    os.remove("response.ods")
    return Response(rep, headerlist=headerList.items())

@view_config(route_name="product",request_param="type=viewstockreport", renderer="gkwebapp:templates/viewstockreport.jinja2")
def viewstockreport(request):

    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products?invdc=4",headers=header)
    result1 = requests.get("http://127.0.0.1:6543/godown",headers=header)
    result2 = requests.get("http://127.0.0.1:6543/login", headers=header)
    userrole = result2.json()["gkresult"]["userrole"]
    return{"gkresult":result.json()["gkresult"], "godown":result1.json()["gkresult"], "gkstatus":result.json()["gkstatus"], "userrole":userrole}

@view_config(route_name="product",request_param="type=showstockreport")
def showstockreport(request):
    header={"gktoken":request.headers["gktoken"]}
    godownflag = int(request.params["godownflag"])
    goid = int(request.params["goid"])
    goname = request.params["goname"]
    if godownflag==1:
        goaddr = request.params["goaddr"]
    productcode = int(request.params["productcode"])
    calculatefrom = request.params["calculatefrom"]
    calculateto = request.params["calculateto"]
    scalculatefrom = request.params["calculatefrom"]
    scalculateto = request.params["calculateto"]
    productdesc = request.params["productdesc"]
    if int(request.params["backflag"]) > 0:
        scalculatefrom = datetime.strptime(calculatefrom, '%d-%m-%Y').strftime('%Y-%m-%d')
        scalculateto = datetime.strptime(calculateto, '%d-%m-%Y').strftime('%Y-%m-%d')
        stockrefresh = {"productcode":productcode,"calculatefrom":calculatefrom,"calculateto":calculateto,"productdesc":productdesc,"godownflag":godownflag,"goid":goid }
    else:
        stockrefresh = {"productcode":productcode,"calculatefrom":datetime.strptime(calculatefrom, '%Y-%m-%d').strftime('%d-%m-%Y'),"calculateto":datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y'),"productdesc":productdesc,"godownflag":godownflag,"goid":goid}
    if godownflag>0:
        result = requests.get("http://127.0.0.1:6543/report?type=godownstockreport&goid=%d&productcode=%d&startdate=%s&enddate=%s"%(goid, productcode, scalculatefrom, scalculateto),headers=header)
    else:
        result = requests.get("http://127.0.0.1:6543/report?type=stockreport&productcode=%d&startdate=%s&enddate=%s"%(productcode, scalculatefrom, scalculateto),headers=header)
    if godownflag==1:
        return render_to_response("gkwebapp:templates/showstockreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":goname, "godownadd":goaddr},request=request)
    return render_to_response("gkwebapp:templates/showstockreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":goname},request=request)

@view_config(route_name="product",request_param="type=printablestockreport")
def printablestockreport(request):
    header={"gktoken":request.headers["gktoken"]}
    godownflag = int(request.params["godownflag"])
    goid = int(request.params["goid"])
    goname = request.params["goname"]
    if godownflag==1:
        goaddr = request.params["goaddr"]
    productcode = int(request.params["productcode"])
    scalculatefrom = request.params["calculatefrom"]
    scalculateto = request.params["calculateto"]
    calculatefrom = datetime.strptime(scalculatefrom, '%d-%m-%Y').strftime('%Y-%m-%d')
    calculateto = datetime.strptime(scalculateto, '%d-%m-%Y').strftime('%Y-%m-%d')
    productdesc = request.params["productdesc"]
    stockrefresh = {"productcode":productcode,"calculatefrom":scalculatefrom,"calculateto":scalculateto,"productdesc":productdesc,"godownflag":godownflag,"goid":goid}
    if godownflag > 0:
        result = requests.get("http://127.0.0.1:6543/report?type=godownstockreport&productcode=%d&startdate=%s&enddate=%s&goid=%d&godownflag=%d"%(productcode, calculatefrom, calculateto, goid, godownflag),headers=header)
    else:
        result = requests.get("http://127.0.0.1:6543/report?type=stockreport&productcode=%d&startdate=%s&enddate=%s"%(productcode, calculatefrom, calculateto),headers=header)
    if godownflag==1:
        return render_to_response("gkwebapp:templates/printstockreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":goname, "godownadd":goaddr},request=request)
    return render_to_response("gkwebapp:templates/printstockreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":goname},request=request)

@view_config(route_name="product",request_param="type=stockreportspreadsheet", renderer="")
def stockreportspreadsheet(request):
    header={"gktoken":request.headers["gktoken"]}
    godownflag = int(request.params["godownflag"])
    goid = int(request.params["goid"])
    goname = request.params["goname"]
    if godownflag==1:
        goaddr = request.params["goaddr"]
    productcode = int(request.params["productcode"])
    calculatefrom = request.params["calculatefrom"]
    calculateto = request.params["calculateto"]
    scalculatefrom = datetime.strptime(calculatefrom, '%d-%m-%Y').strftime('%Y-%m-%d')
    scalculateto = datetime.strptime(calculateto, '%d-%m-%Y').strftime('%Y-%m-%d')
    productdesc = request.params["productdesc"]
    if godownflag > 0:
        result = requests.get("http://127.0.0.1:6543/report?type=godownstockreport&productcode=%d&startdate=%s&enddate=%s&goid=%d&godownflag=%d"%(productcode, scalculatefrom, scalculateto, goid, godownflag),headers=header)
    else:
        result = requests.get("http://127.0.0.1:6543/report?type=stockreport&productcode=%d&startdate=%s&enddate=%s"%(productcode, scalculatefrom, scalculateto),headers=header)
    result = result.json()["gkresult"]
    fystart = str(request.params["fystart"]);
    ystart = datetime.strptime(fystart, '%Y-%m-%d').strftime('%d-%m-%Y')
    fyend = str(request.params["fyend"]);
    orgname = str(request.params["orgname"])
    orgname += " (FY: " + ystart+" to "+fyend +")"
    ods = ODS()
    sheet = ods.content.getSheet(0)
    sheet.setSheetName("Product Report")
    sheet.getRow(0).setHeight("23pt")

    if godownflag > 0:
        sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
        ods.content.mergeCells(0,0,9,1)
        sheet.getRow(1).setHeight("18pt")
        sheet.getCell(0,1).stringValue("Godown Wise Product Report  (Period : "+calculatefrom+" to "+calculateto+")").setBold(True).setFontSize("12pt").setAlignHorizontal("center")
        ods.content.mergeCells(0,1,9,1)
        sheet.getRow(2).setHeight("16pt")
        sheet.getCell(0,2).stringValue("Name of the Product: "+productdesc).setBold(True).setFontSize("12pt").setAlignHorizontal("center")
        ods.content.mergeCells(0,2,9,1)
        sheet.getRow(3).setHeight("16pt")
        sheet.getCell(0,3).stringValue("Name of the Godown : "+goname+", Godown Address: "+goaddr).setBold(True).setFontSize("12pt").setAlignHorizontal("center")
        ods.content.mergeCells(0,3,9,1)
        sheet.getColumn(1).setWidth("8cm")
        sheet.getColumn(2).setWidth("4cm")
        sheet.getColumn(3).setWidth("4cm")
        sheet.getColumn(4).setWidth("2cm")
        sheet.getCell(0,4).stringValue("Date").setBold(True).setAlignHorizontal("center")
        sheet.getCell(1,4).stringValue("Particulars").setBold(True).setAlignHorizontal("center")
        sheet.getCell(2,4).stringValue("Document Type").setBold(True).setAlignHorizontal("center")
        sheet.getCell(3,4).stringValue("Deli Note No.").setBold(True).setAlignHorizontal("center")
        sheet.getCell(4,4).stringValue("INV No.").setBold(True).setAlignHorizontal("center")
        sheet.getCell(5,4).stringValue("TN No.").setBold(True).setAlignHorizontal("center")
        #sheet.getCell(6,4).stringValue("RN No.").setBold(True).setAlignHorizontal("center")
        sheet.getCell(6,4).stringValue("Inward").setBold(True).setAlignHorizontal("right")
        sheet.getCell(7,4).stringValue("Outward").setBold(True).setAlignHorizontal("right")
        sheet.getCell(8,4).stringValue("Balance").setBold(True).setAlignHorizontal("right")
        row = 5
        for stock in result:
            if stock["particulars"]=="opening stock" and stock["dcno"]=="" and stock["invno"]=="" and stock["date"]=="":
                sheet.getCell(0, row).stringValue("")
                sheet.getCell(1, row).stringValue(stock["particulars"].title())
                sheet.getCell(2, row).stringValue("")
                sheet.getCell(3, row).stringValue("")
                sheet.getCell(4, row).stringValue("")
                sheet.getCell(5, row).stringValue("")
                #sheet.getCell(6, row).stringValue("")
                sheet.getCell(6, row).stringValue(stock["inward"]).setAlignHorizontal("right")
                sheet.getCell(7, row).stringValue("")
                sheet.getCell(8, row).stringValue("")
            if stock["particulars"]!="Total" and (stock["dcno"]!="" or stock["invno"]!="" or stock["tnno"]!="" or stock["rnno"] != "") and stock["date"]!="":
                sheet.getCell(0, row).stringValue(stock["date"])
                sheet.getCell(1, row).stringValue(stock["particulars"])
                sheet.getCell(2, row).stringValue(stock["trntype"])
                sheet.getCell(3, row).stringValue(stock["dcno"])
                sheet.getCell(4, row).stringValue(stock["invno"])
                sheet.getCell(5, row).stringValue(stock["tnno"])
                #sheet.getCell(6, row).stringValue(stock["rnno"])
                sheet.getCell(6, row).stringValue(stock["inwardqty"]).setAlignHorizontal("right")
                sheet.getCell(7, row).stringValue(stock["outwardqty"]).setAlignHorizontal("right")
                sheet.getCell(8, row).stringValue(stock["balance"]).setAlignHorizontal("right")
            if stock["particulars"]=="Total" and stock["dcno"]=="" and stock["invno"]=="" and stock["date"]=="":
                sheet.getCell(0, row).stringValue("")
                sheet.getCell(1, row).stringValue(stock["particulars"])
                sheet.getCell(2, row).stringValue("")
                sheet.getCell(3, row).stringValue("")
                sheet.getCell(4, row).stringValue("")
                sheet.getCell(5, row).stringValue("")
                #sheet.getCell(6, row).stringValue("")
                sheet.getCell(6, row).stringValue(stock["totalinwardqty"]).setAlignHorizontal("right")
                sheet.getCell(7, row).stringValue(stock["totaloutwardqty"]).setAlignHorizontal("right")
                sheet.getCell(8, row).stringValue("")
            row += 1
    else:
        sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
        ods.content.mergeCells(0,0,8,1)
        sheet.getRow(1).setHeight("18pt")
        sheet.getCell(0,1).stringValue("Product Report (Period : "+calculatefrom+" to "+calculateto+")").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
        ods.content.mergeCells(0,1,8,1)
        sheet.getRow(2).setHeight("16pt")
        sheet.getCell(0,2).stringValue("Name of the Product: "+productdesc).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
        ods.content.mergeCells(0,2,8,1)
        sheet.getColumn(1).setWidth("4cm")
        sheet.getColumn(2).setWidth("5cm")
        sheet.getColumn(3).setWidth("4cm")
        sheet.getColumn(4).setWidth("3cm")
        sheet.getCell(0,3).stringValue("Date").setBold(True).setAlignHorizontal("center")
        sheet.getCell(1,3).stringValue("Particulars").setBold(True).setAlignHorizontal("center")
        sheet.getCell(2,3).stringValue("Document Type").setBold(True).setAlignHorizontal("center")
        sheet.getCell(3,3).stringValue("Deli Note No.").setBold(True).setAlignHorizontal("center")
        sheet.getCell(4,3).stringValue("INV No.").setBold(True).setAlignHorizontal("center")
        #sheet.getCell(5,3).stringValue("RN No.").setBold(True).setAlignHorizontal("center")
        sheet.getCell(5,3).stringValue("Inward").setBold(True).setAlignHorizontal("right")
        sheet.getCell(6,3).stringValue("Outward").setBold(True).setAlignHorizontal("right")
        sheet.getCell(7,3).stringValue("Balance").setBold(True).setAlignHorizontal("right")
        row = 4
        for stock in result:
            if stock["particulars"]=="opening stock" and stock["dcno"]=="" and stock["invno"]=="" and stock["date"]=="":
                sheet.getCell(0, row).stringValue("")
                sheet.getCell(1, row).stringValue(stock["particulars"].title())
                sheet.getCell(2, row).stringValue("")
                sheet.getCell(3, row).stringValue("")
                sheet.getCell(4, row).stringValue("")
                #sheet.getCell(5, row).stringValue("")
                sheet.getCell(5, row).stringValue(stock["inward"]).setAlignHorizontal("right")
                sheet.getCell(6, row).stringValue("")
                sheet.getCell(7, row).stringValue("")
            if stock["particulars"]!="Total" and (stock["dcno"]!="" or stock["invno"]!="" or stock["rnid"] != "") and stock["date"]!="":
                sheet.getCell(0, row).stringValue(stock["date"])
                sheet.getCell(1, row).stringValue(stock["particulars"])
                sheet.getCell(2, row).stringValue(stock["trntype"])
                sheet.getCell(3, row).stringValue(stock["dcno"])
                sheet.getCell(4, row).stringValue(stock["invno"])
                #sheet.getCell(5, row).stringValue(stock["rnno"])
                sheet.getCell(5, row).stringValue(stock["inwardqty"]).setAlignHorizontal("right")
                sheet.getCell(6, row).stringValue(stock["outwardqty"]).setAlignHorizontal("right")
                sheet.getCell(7, row).stringValue(stock["balance"]).setAlignHorizontal("right")
            if stock["particulars"]=="Total" and stock["dcno"]=="" and stock["invno"]=="" and stock["date"]=="":
                sheet.getCell(0, row).stringValue("")
                sheet.getCell(1, row).stringValue(stock["particulars"])
                sheet.getCell(2, row).stringValue("")
                sheet.getCell(3, row).stringValue("")
                sheet.getCell(4, row).stringValue("")
                #sheet.getCell(5, row).stringValue("")
                sheet.getCell(5, row).stringValue(stock["totalinwardqty"]).setAlignHorizontal("right")
                sheet.getCell(6, row).stringValue(stock["totaloutwardqty"]).setAlignHorizontal("right")
                sheet.getCell(7, row).stringValue("")
            row += 1

    ods.save("response.ods")
    repFile = open("response.ods")
    rep = repFile.read()
    repFile.close()
    headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
    os.remove("response.ods")
    return Response(rep, headerlist=headerList.items())


@view_config(route_name="product",request_param="type=viewstockonhandreport", renderer="gkwebapp:templates/viewstockonhandreport.jinja2")
def viewStockOnHandReport(request):

    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/products?invdc=4",headers=header)
    result1 = requests.get("http://127.0.0.1:6543/godown",headers=header)
    result2 = requests.get("http://127.0.0.1:6543/login", headers=header)
    userrole = result2.json()["gkresult"]["userrole"]
    return{"gkresult":result.json()["gkresult"], "godown":result1.json()["gkresult"], "gkstatus":result.json()["gkstatus"], "userrole":userrole}

@view_config(route_name="product",request_param="type=viewcategorywisestockonhandreport", renderer="gkwebapp:templates/viewcategorywisestockonhandreport.jinja2")
def viewCategorywiseStockOnHandReport(request):

    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/categories",headers=header)
    result1 = requests.get("http://127.0.0.1:6543/godown",headers=header)
    result2 = requests.get("http://127.0.0.1:6543/login", headers=header)
    userrole = result2.json()["gkresult"]["userrole"]
    return{"gkresult":result.json()["gkresult"], "godown":result1.json()["gkresult"], "gkstatus":result.json()["gkstatus"], "userrole":userrole}

@view_config(route_name="product",request_param="type=showstockonhandreport")
def showstockonhandreport(request):
    header={"gktoken":request.headers["gktoken"]}
    godownflag = int(request.params["godownflag"])
    goid = int(request.params["goid"])
    goname = request.params["goname"]

    if godownflag==1:
        goaddr = request.params["goaddr"]
    productcode = int(request.params["productcode"])
    calculateto = request.params["calculateto"]
    scalculateto = request.params["calculateto"]


    productdesc = request.params["productdesc"]
    if int(request.params["backflag"]) == 1 :
        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        date = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y')
        stockrefresh = {"productcode":productcode,"calculateto":calculateto,"productdesc":"All Products","godownflag":godownflag,"goid":goid,"date":date }
        result = requests.get("http://127.0.0.1:6543/report?stockonhandreport&productcode=all&enddate=%s"%(scalculateto),headers=header)


    if int(request.params["backflag"]) == 0:
        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        date = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y')
        stockrefresh = {"productcode":productcode,"calculateto":datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d'),"productdesc":productdesc,"godownflag":godownflag,"goid":goid,"date":date}
        result = requests.get("http://127.0.0.1:6543/report?stockonhandreport&productcode=%d&enddate=%s"%(productcode,scalculateto),headers=header)

    if godownflag == 1 and int(request.params["backflag"]) == 3 :
        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        date = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y')
        stockrefresh = {"productcode":productcode,"calculateto":calculateto,"productdesc":productdesc,"godownflag":godownflag,"goid":goid,"date":date}
        result = requests.get("http://127.0.0.1:6543/report?godownwisestockonhand&type=pg&goid=%d&productcode=%d&enddate=%s"%(goid, productcode, scalculateto),headers=header)

    if godownflag == 1 and int(request.params["backflag"]) == 2 and goid == 0:
        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        date = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y')
        stockrefresh = {"productcode":productcode,"calculateto":calculateto,"productdesc":productdesc,"godownflag":godownflag,"goid":goid,"date":date}
        result = requests.get("http://127.0.0.1:6543/report?godownwisestockonhand&type=pag&productcode=%d&enddate=%s"%(productcode, scalculateto),headers=header)

    if godownflag==1:
        return render_to_response("gkwebapp:templates/showstockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":goname, "goaddr":goaddr},request=request)

    return render_to_response("gkwebapp:templates/showstockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":goname},request=request)

@view_config(route_name="product",request_param="type=showcategorywisestockonhandreport")
def showcategorywisestockonhandreport(request):
    header={"gktoken":request.headers["gktoken"]}
    godownflag = int(request.params["godownflag"])
    if godownflag == 0:
        goid = "-1"
    else:
        goid = request.params["goid"]
    categorycode = int(request.params["categorycode"])
    calculateto = request.params["calculateto"]
    categoryname = request.params["categoryname"]
    subcategoryname = request.params["subcategoryname"]
    specname = request.params["specname"]
    stockrefresh = {"categorycode":categorycode,"calculateto":datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d'),"categoryname":categoryname, "subcategoryname": subcategoryname, "specname":specname, "godownflag":godownflag,"goid":goid,"date":datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y')}
    if int(request.params["backflag"]) == 1 :
        result = requests.get("http://127.0.0.1:6543/report?stockonhandreport&productcode=all&enddate=%s"%(calculateto),headers=header)
        if godownflag==1:
            if request.params["goid"] == "all":
                return render_to_response("gkwebapp:templates/showcategorywisestockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh},request=request)
            else:
                return render_to_response("gkwebapp:templates/showcategorywisestockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":request.params["goname"], "goaddr":request.params["goaddr"]},request=request)
        else:
            return render_to_response("gkwebapp:templates/showcategorywisestockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh},request=request)

    if int(request.params["backflag"]) == 0:
        result = requests.get("http://127.0.0.1:6543/report?type=categorywisestockonhand&categorycode=%d&subcategorycode=%s&speccode=%s&goid=%s&enddate=%s"%(categorycode, request.params["subcategorycode"], request.params["speccode"], goid, calculateto),headers=header)
        if godownflag==1:
            if request.params["goid"] == "all":
                return render_to_response("gkwebapp:templates/showcategorywisestockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh},request=request)
            else:
                return render_to_response("gkwebapp:templates/showcategorywisestockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":request.params["goname"], "goaddr":request.params["goaddr"]},request=request)
        else:
            return render_to_response("gkwebapp:templates/showcategorywisestockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh},request=request)

    '''if godownflag == 1 and int(request.params["backflag"]) == 3 :
        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        date = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y')
        result = requests.get("http://127.0.0.1:6543/report?godownwisestockonhand&type=pg&goid=%d&productcode=%d&enddate=%s"%(goid, productcode, scalculateto),headers=header)

    if godownflag == 1 and int(request.params["backflag"]) == 2 and goid == 0:

        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        date = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%d-%m-%Y')
        result = requests.get("http://127.0.0.1:6543/report?godownwisestockonhand&type=pag&productcode=%d&enddate=%s"%(productcode, scalculateto),headers=header)
    '''



@view_config(route_name="product",request_param="type=printablestockonhandreport")
def printablestockonhandreport(request):

    header={"gktoken":request.headers["gktoken"]}
    godownflag = int(request.params["godownflag"])
    goid = int(request.params["goid"])
    goname = request.params["goname"]
    productcode = int(request.params["productcode"])
    calculateto = request.params["calculateto"]
    productdesc = request.params["productdesc"]
    scalculateto = request.params["calculateto"]
    if int(request.params["backflag"]) == 1 :

        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        stockrefresh = {"productcode":productcode,"calculateto":calculateto,"productdesc":"all","godownflag":godownflag,"goid":goid }

        result = requests.get("http://127.0.0.1:6543/report?stockonhandreport&productcode=all&enddate=%s"%(scalculateto),headers=header)

    if int(request.params["backflag"]) == 0 :
        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        stockrefresh = {"productcode":productcode,"calculateto":calculateto,"productdesc":productdesc,"godownflag":godownflag,"goid":goid}
        result = requests.get("http://127.0.0.1:6543/report?stockonhandreport&productcode=%d&enddate=%s"%(productcode,scalculateto),headers=header)

    if godownflag == 1 and int(request.params["backflag"]) == 3 :

        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        stockrefresh = {"productcode":productcode,"calculateto":calculateto,"productdesc":productdesc,"godownflag":godownflag,"goid":goid}
        result = requests.get("http://127.0.0.1:6543/report?godownwisestockonhand&type=pg&goid=%d&productcode=%d&enddate=%s"%(goid, productcode, scalculateto),headers=header)

    if godownflag == 1 and int(request.params["backflag"]) == 2 and goid == 0:

        scalculateto = datetime.strptime(calculateto, '%Y-%m-%d').strftime('%Y-%m-%d')
        stockrefresh = {"productcode":productcode,"calculateto":calculateto,"productdesc":productdesc,"godownflag":godownflag,"goid":goid}
        result = requests.get("http://127.0.0.1:6543/report?godownwisestockonhand&type=pag&productcode=%d&enddate=%s"%(productcode, scalculateto),headers=header)

    return render_to_response("gkwebapp:templates/printstockonhandreport.jinja2",{"gkresult":result.json()["gkresult"],"stockrefresh":stockrefresh,"godown":goname},request=request)
