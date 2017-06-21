
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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
from PIL import Image
import base64
import cStringIO
import os
from odslib import ODS

@view_config(route_name="invoice",renderer="gkwebapp:templates/invoice.jinja2")
def showinvoice(request):
	return {"status":True}

@view_config(route_name="invoice", request_param="action=showviewregister", renderer="gkwebapp:templates/viewregister.jinja2")
def showviewregister(request):
	return {"status":True}

@view_config(route_name="invoice", request_param="action=viewlist", renderer="gkwebapp:templates/viewlistofinvoices.jinja2")
def showlistofinv(request):
	result = requests.get("http://127.0.0.1:6543/invoice?inv=all", headers=header)
	return {"status":True, "numberofinvoices": len(result.json()["gkresult"])}

@view_config(route_name="invoice",request_param="action=showadd",renderer="gkwebapp:templates/addinvoice.jinja2")
def showaddinvoice(request):
	header={"gktoken":request.headers["gktoken"]}
	inputdate = request.params["inputdate"]
	gkdata = {"inputdate": inputdate, "type": "invoice"}
	unbilled_delnotes = requests.get("http://127.0.0.1:6543/invoice?unbilled_delnotes", data=json.dumps(gkdata), headers=header)
	if request.params["status"]=='in':
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
	else:
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	return {"gkstatus": request.params["status"],"suppliers": suppliers.json()["gkresult"],"products": products.json()["gkresult"],"deliverynotes":unbilled_delnotes.json()["gkresult"]}

@view_config(route_name="invoice",request_param="action=getproducts",renderer="json")
def getproducts(request):
	header={"gktoken":request.headers["gktoken"]}
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	return {"gkstatus": products.json()["gkstatus"],"products": products.json()["gkresult"]}


@view_config(route_name="invoice",request_param="action=save",renderer="json")
def saveinvoice(request):
	header={"gktoken":request.headers["gktoken"]}

	invoicedata = {"invoiceno":request.params["invoiceno"],"taxstate":request.params["taxstate"],"invoicedate":request.params["invoicedate"],
		"tax":json.loads(request.params["tax"]),"custid":request.params["custid"],"invoicetotal":request.params["invtotal"],
		"contents":json.loads(request.params["contents"]),
		"issuername":request.params["issuername"],"designation":request.params["designation"],"freeqty":json.loads(request.params["freeqty"])}

	try:
		files = {}
		count = 0
		for i in request.POST.keys():
			if "file" not in i:
				continue
			else:
				img = request.POST[i].file
				image = Image.open(img)
				imgbuffer = cStringIO.StringIO()
				image.save(imgbuffer, format="JPEG")
				img_str = base64.b64encode(imgbuffer.getvalue())
				image.close()
				files[count] = img_str
				count += 1
		if len(files)>0:
			invoicedata["attachment"] = files
			invoicedata["attachmentcount"] = len(invoicedata["attachment"])
	except:
		print "no attachment found"
	stock = json.loads(request.params["stock"])
	if request.params["dcid"]!="":
		invoicedata["dcid"] = request.params["dcid"]
	invoicewholedata = {"invoice":invoicedata,"stock":stock}
	result=requests.post("http://127.0.0.1:6543/invoice",data=json.dumps(invoicewholedata),headers=header)
	if result.json()["gkstatus"]==0:
		return {"gkstatus":result.json()["gkstatus"],"gkresult":result.json()["gkresult"]}
	else:
		return {"gkstatus":result.json()["gkstatus"]}
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
	result = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(request.params['productcode'])),headers=header)
	unit = result.json()["gkresult"]
	return {"gkstatus": taxdata.json()["gkstatus"],"taxdata": taxdata.json()["gkresult"],"unitname":unit["unitname"]}

@view_config(route_name="invoice",request_param="action=getproduct",renderer="json")
def getproduct(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(request.params['productcode'])),headers=header)
	unit = result.json()["gkresult"]
	return {"gkstatus": result.json()["gkstatus"],"unitname":unit["unitname"]}


@view_config(route_name="invoice",request_param="action=showedit",renderer="gkwebapp:templates/editinvoice.jinja2")
def showeditinvoice(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/invoice?inv=all", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}


@view_config(route_name="invoice",request_param="action=getinvdetails",renderer="json")
def getInvoiceDetails(request):
	header={"gktoken":request.headers["gktoken"]}
	invoicedata = requests.get("http://127.0.0.1:6543/invoice?inv=single&invid=%d"%(int(request.params["invid"])), headers=header)
	return {"gkstatus": invoicedata.json()["gkstatus"],"invoicedata": invoicedata.json()["gkresult"]}

@view_config(route_name="invoice", request_param="action=showlist", renderer="gkwebapp:templates/listofinvoices.jinja2")
def listofinv(request):
	result = requests.get("http://127.0.0.1:6543/invoice?type=list&flag=%s&fromdate=%s&todate=%s"%(request.params["flag"], request.params["fromdate"], request.params["todate"]), headers=header)
	return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["gkresult"], "flag": request.params["flag"], "fromdate": request.params["fromdate"], "todate": request.params["todate"]}

@view_config(route_name="invoice",request_param="action=cancel",renderer="json")
def Invoicedelete(request):
	header={"gktoken":request.headers["gktoken"]}
	invoicedata = requests.delete("http://127.0.0.1:6543/invoice",data =json.dumps({"invid":request.params["invid"],"cancelflag":1,"icflag":9}), headers=header)
	return {"gkstatus": invoicedata.json()["gkstatus"]}

@view_config(route_name="invoice",request_param="action=print",renderer="gkwebapp:templates/printinvoice.jinja2")
def Invoiceprint(request):
	header={"gktoken":request.headers["gktoken"]}
	org = requests.get("http://127.0.0.1:6543/organisation", headers=header)
	cust = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(request.params["custid"])), headers=header)
	tableset = json.loads(request.params["printset"])
	return {"gkstatus":org.json()["gkstatus"],"org":org.json()["gkdata"],"cust":cust.json()["gkresult"],
	"tableset":tableset,"invoiceno":request.params["invoiceno"],"invoicedate":request.params["invoicedate"],"dcno":request.params["dc"],
	"issuername":request.params["issuername"],"designation":request.params["designation"],"subtotal":request.params["subtotal"],
	"taxtotal":request.params["taxtotal"],"gtotal":request.params["gtotal"]}

@view_config(route_name="invoice", request_param="action=getattachment", renderer="gkwebapp:templates/viewinvoiceattachment.jinja2")
def getattachment(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/invoice?attach=image&invid=%d"%(int(request.params["invid"])), headers=header)
	return {"attachment":result.json()["gkresult"],"invid":request.params["invid"], "cancelflag":result.json()["cancelflag"],"userrole":result.json()["userrole"],"invoiceno":result.json()["invoiceno"]}

'''
The below function calls a function in API for invoice that updates the amount paid field in invoice table and advamt and onaccamt fields in customersupplier table.
It receives a list of dictionaries.
It contains a flag(payflag) to check for the type of payment. It could be settlement of a bill(payflag=2), advance payment(payflag=1) of amount or amount set as on account(payflag=15).
For advance and on account payments an additional flag(icflag) is also sent which tells the API whether to increment organisation decrement the advamt or onaccamt fields.
Each dictionary also has custid(id of customer or supplier) and amount.
'''
@view_config(route_name="invoice", request_param="action=updatepayment", renderer="json")
def updatepayment(request):
	header={"gktoken":request.headers["gktoken"]}
	payments = json.loads(request.params["billwisedata"])
	for payment in payments:
		payflag = int(payment["payflag"])
		if payflag == 1 or payflag == 15:
		   custid = int(payment["custid"])
		   pdamt = float(payment["pdamt"])
		   icflag = int(payment["icflag"])
		   result = requests.put("http://127.0.0.1:6543/invoice?type=bwa&payflag=%d&icflag=%d&custid=%d&pdamt=%f"%(payflag, icflag, custid, pdamt), headers=header)

		elif payflag == 2:
		   invid = int(payment["invid"])
		   pdamt = float(payment["pdamt"])
		   result = requests.put("http://127.0.0.1:6543/invoice?type=bwa&payflag=%d&invid=%d&pdamt=%f"%(payflag, invid, pdamt), headers=header)

	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="invoice", request_param="action=getdelinvprods", renderer="json")
def getdelinvproducts(request):
	header={"gktoken":request.headers["gktoken"]}
	dcid = request.params["dcid"]
	result = requests.get("http://127.0.0.1:6543/delchal?action=getdcinvprods&dcid=%d"%(int(dcid)), headers=header)
	return {"gkstatus": result.json()["gkstatus"], "items": result.json()["gkresult"]}

@view_config(route_name="invoice",request_param="action=showregisterreport",renderer="gkwebapp:templates/registerreport.jinja2")
def showregisterreport(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=register&flag=%d&calculatefrom=%s&calculateto=%s"%(int(request.params["flag"]), str(request.params["calculatefrom"]), str(request.params["calculateto"])), headers=header)
	registerheader = {"flag": request.params["flag"], "calculatefrom": request.params["calculatefrom"], "calculateto": request.params["calculateto"]}
	return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["gkresult"], "totalrow": result.json()["totalrow"], "taxcolumns":result.json()["taxcolumns"], "registerheader": registerheader}

@view_config(route_name="invoice",request_param="type=spreadsheet", renderer="")
def registerspreadsheet(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=register&flag=%d&calculatefrom=%s&calculateto=%s"%(int(request.params["flag"]), str(request.params["calculatefrom"]), str(request.params["calculateto"])), headers=header)
	taxcolumns = result.json()["taxcolumns"]
	totalrow = result.json()["totalrow"]
	result = result.json()["gkresult"]
	fystart = str(request.params["fystart"]);
	fyend = str(request.params["fyend"]);
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fystart+" to "+fyend +")"
	ods = ODS()
	sheet = ods.content.getSheet(0)
	if request.params["flag"] == "0":
		   sheet.setSheetName("Sales Register")
	else:
		sheet.setSheetName("Purchase Register")
	sheet.getRow(0).setHeight("23pt")
	sheet.getRow(1).setHeight("18pt")
	sheet.getRow(2).setHeight("15pt")
	sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
	ods.content.mergeCells(0,0,7,1)
	if request.params["flag"] == "0":
		sheet.getCell(0,1).stringValue("Sales Register").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	else:
		sheet.getCell(0,1).stringValue("Purchase Register").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	ods.content.mergeCells(0,1,7,1)
	sheet.getCell(0,2).stringValue("Period: "+request.params["calculatefrom"]+" To "+request.params["calculateto"]).setBold(True).setAlignHorizontal("center").setFontSize("12pt")
	ods.content.mergeCells(0,2,7,1)
	sheet.getColumn(1).setWidth("4cm")
	sheet.getColumn(2).setWidth("4cm")
	sheet.getColumn(3).setWidth("4cm")
	sheet.getColumn(4).setWidth("4cm")
	sheet.getColumn(5).setWidth("4cm")
	sheet.getColumn(6).setWidth("4cm")
	sheet.getColumn(7).setWidth("4cm")
	sheet.getCell(0,3).stringValue("Sr. No.").setBold(True)
	sheet.getCell(1,3).stringValue("Invoice No.").setBold(True)
	sheet.getCell(2,3).stringValue("Invoice Dt.").setBold(True)
	if request.params["flag"] == "0":
		   sheet.getCell(3,3).stringValue("Cust. Name").setBold(True)
		   sheet.getCell(4,3).stringValue("Cust. TIN").setBold(True)
	else:
		sheet.getCell(3,3).stringValue("Suppl. Name").setBold(True)
		sheet.getCell(4,3).stringValue("Suppl. TIN").setBold(True)
	sheet.getCell(5,3).stringValue("Gross Amt.").setBold(True)
	sheet.getCell(6,3).stringValue("TAX Free").setBold(True)
	i = 8
	for taxc in taxcolumns:
		sheet.getColumn(i).setWidth("4cm")
		sheet.getCell(i-1,3).stringValue("Net @" + taxc + "%").setBold(True)
		i += 1
	for taxc in taxcolumns:
		sheet.getColumn(i).setWidth("4cm")
		sheet.getCell(i-1,3).stringValue(taxc + "% TAX").setBold(True)
		i += 1
	row = 4
	for invoice in result:
		sheet.getCell(0, row).stringValue(invoice["srno"])
		sheet.getCell(1, row).stringValue(invoice["invoiceno"])
		sheet.getCell(2, row).stringValue(invoice["invoicedate"])
		sheet.getCell(3, row).stringValue(invoice["customername"])
		sheet.getCell(4, row).stringValue(invoice["customertin"])
		sheet.getCell(5, row).stringValue(invoice["grossamount"])
		sheet.getCell(6, row).stringValue(invoice["taxfree"])
		i = 7
		for taxc in taxcolumns:
			if taxc in invoice["tax"]:
				sheet.getCell(i,row).stringValue(invoice["tax"][taxc])
			else:
				sheet.getCell(i,row).stringValue("0.00")
			i += 1
		for taxc in taxcolumns:
			if taxc in invoice["taxamount"]:
				sheet.getCell(i,row).stringValue(invoice["taxamount"][taxc])
			else:
				sheet.getCell(i,row).stringValue("0.00")
			i += 1
		row += 1
	sheet.getCell(0, row).stringValue("Total").setBold(True)
	ods.content.mergeCells(0,row,5,1)
	sheet.getCell(5, row).stringValue(totalrow["grossamount"]).setBold(True)
	sheet.getCell(6, row).stringValue(totalrow["taxfree"]).setBold(True)
	i = 7
	for taxc in taxcolumns:
		if taxc in totalrow["tax"]:
			sheet.getCell(i,row).stringValue(totalrow["tax"][taxc]).setBold(True)
		else:
			sheet.getCell(i,row).stringValue("0.00").setBold(True)
		i += 1
	for taxc in taxcolumns:
		if taxc in totalrow["taxamount"]:
			sheet.getCell(i,row).stringValue(totalrow["taxamount"][taxc]).setBold(True)
		else:
			sheet.getCell(i,row).stringValue("0.00").setBold(True)
		i += 1

	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	os.remove("response.ods")
	return Response(rep, headerlist=headerList.items())
