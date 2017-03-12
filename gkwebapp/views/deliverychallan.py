
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
	lastdelchaldata = {}
	if request.params["status"]=='in':
		podata = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=16", headers=header)
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
		lastdelchaldata = requests.get("http://127.0.0.1:6543/delchal?delchal=last&dcflag=16", headers=header)
	else:
		podata = requests.get("http://127.0.0.1:6543/purchaseorder?psflag=20", headers=header)
		suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
		lastdelchaldata = requests.get("http://127.0.0.1:6543/delchal?delchal=last&dcflag=4", headers=header)
	products = requests.get("http://127.0.0.1:6543/products", headers=header)
	godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)

	return {"gkstatus": request.params["status"],"suppliers": suppliers.json()["gkresult"],"products": products.json()["gkresult"],"godowns":godowns.json()["gkresult"],"purchaseorders":podata.json()["gkresult"], "lastdelchaldata":lastdelchaldata.json()["gkresult"]}

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
	delchalresult = {}
	delchalresult = delchaldata.json()["gkresult"]
	if int(delchalresult["stockdata"]["inout"])==9:
		inoutflag="in"
	else:
		inoutflag="out"
	return {"gkstatus": delchaldata.json()["gkstatus"],"delchaldata": delchaldata.json()["gkresult"],"inoutflag":inoutflag}


@view_config(route_name="deliverychallan",request_param="action=save",renderer="json")
def savedelchal(request):
	header={"gktoken":request.headers["gktoken"]}
	delchaldata = {"custid":int(request.params["custid"]),"dcno":request.params["dcno"],"dcdate":request.params["dcdate"],"dcflag":request.params["dcflag"], "noofpackages":request.params["noofpackages"], "modeoftransport":request.params["modeoftransport"]}
	products = {}
	for  row in json.loads(request.params["products"]):
		products[row["productcode"]] = row["qty"]
	stockdata = {"inout":int(request.params["inout"]),"items":products}

	if request.params["goid"]!='':
		stockdata["goid"]=int(request.params["goid"])
	if request.params.has_key("issuername"):
		delchaldata["issuername"]=request.params["issuername"]
	if request.params.has_key("designation"):
		delchaldata["designation"]=request.params["designation"]
	delchalwholedata = {"delchaldata":delchaldata,"stockdata":stockdata}
	result=requests.post("http://127.0.0.1:6543/delchal",data=json.dumps(delchalwholedata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="deliverychallan",request_param="action=edit",renderer="json")
def editdelchal(request):
	header={"gktoken":request.headers["gktoken"]}
	delchaldata = {"custid":int(request.params["custid"]),"dcno":request.params["dcno"],"dcid":request.params["dcid"],"dcdate":request.params["dcdate"],"dcflag":request.params["dcflag"], "noofpackages":request.params["noofpackages"], "modeoftransport":request.params["modeoftransport"]}
	products = {}
	for  row in json.loads(request.params["products"]):
		products[row["productcode"]] = row["qty"]
	stockdata = {"inout":int(request.params["inout"]),"items":products}
	if request.params["goid"]!='':
		stockdata["goid"]=int(request.params["goid"])
	if request.params.has_key("issuername"):
		delchaldata["issuername"]=request.params["issuername"]
	if request.params.has_key("designation"):
		delchaldata["designation"]=request.params["designation"]
	delchalwholedata = {"delchaldata":delchaldata,"stockdata":stockdata}
	result=requests.put("http://127.0.0.1:6543/delchal",data=json.dumps(delchalwholedata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="deliverychallan",request_param="action=delete",renderer="json")
def deletedelchal(request):
	header={"gktoken":request.headers["gktoken"]}
	deldata = {"dcid":int(request.params["dcid"]),"cancelflag":1}
	result = requests.delete("http://127.0.0.1:6543/delchal",data=json.dumps(deldata), headers=header)
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="deliverychallan",request_param="action=print",renderer="gkwebapp:templates/printdeliverychallan.jinja2")
def deliveryprint(request):
	header={"gktoken":request.headers["gktoken"]}
	org = requests.get("http://127.0.0.1:6543/organisation", headers=header)
	cust = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(request.params["custid"])), headers=header)
	if request.params["goid"] != '':
		godown = requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(request.params["goid"])), headers=header)
		godowndata = godown.json()["gkresult"]
	else:
		godowndata = ''
	tableset = json.loads(request.params["printset"])
	return {"gkstatus":org.json()["gkstatus"],"org":org.json()["gkdata"],"cust":cust.json()["gkresult"],
	"tableset":tableset,"dcno":request.params["dcno"],"dcdate":request.params["dcdate"],"dcno":request.params["dcno"],
	"issuername":request.params["issuername"],"designation":request.params["designation"],"godown":godowndata,
	"notetype":request.params["notetype"],"qtytotal":request.params["qtytotal"]}

@view_config(route_name="show_del_unbilled_report",renderer="gkwebapp:templates/unbilled_deliveries_report.jinja2")
def show_unbilled_deliveries_report(request):
	header={"gktoken":request.headers["gktoken"]}
	inputdate = request.params["inputdate"];
	inout = request.params["inout"]
	gkdata = {"inputdate": inputdate}
	new_inputdate = datetime.strftime(datetime.strptime(str(inputdate),"%Y-%m-%d").date(),'%d-%m-%Y')
	if inout == "9":
		result = requests.get("http://127.0.0.1:6543/report?type=del_unbilled_for_entire_org&inout=i", data = json.dumps(gkdata), headers=header)
	elif inout == "15":
		result = requests.get("http://127.0.0.1:6543/report?type=del_unbilled_for_entire_org&inout=o", data = json.dumps(gkdata), headers=header)
	#print "result : "
	#for row in result.json()["gkresult"]:
	#	print row
	return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["gkresult"], "inputdate":inputdate, "new_inputdate":new_inputdate, "inout":inout}

@view_config(route_name="del_unbilled", request_param="action=view", renderer="gkwebapp:templates/view_unbilled_deliveries.jinja2")
def view_unbilled_deliveries(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/godown", headers=header)
	goddata=[]
	for record in result.json()["gkresult"]:
		gdata= {"godownid": str(record["goid"]), "godownname" : str(record["goname"])}
		goddata.append(gdata)
	print goddata
	return {"gkstatus":result.json()["gkstatus"], "gkresult": goddata}

@view_config(route_name="print_unbilled_deliveries_report",renderer="gkwebapp:templates/print_unbilled_deliveries.jinja2")
def print_del_unbilled(request):
	header={"gktoken":request.headers["gktoken"]}
	inputdate = request.params["inputdate"];
	gkdata = {"inputdate": inputdate}
	new_inputdate = datetime.strftime(datetime.strptime(str(inputdate),"%Y-%m-%d").date(),'%d-%m-%Y')
	inout = request.params["inout"]
	if inout == "9":
		result = requests.get("http://127.0.0.1:6543/report?type=del_unbilled_for_entire_org&inout=i", data = json.dumps(gkdata), headers=header)
	elif inout == "15":
		result = requests.get("http://127.0.0.1:6543/report?type=del_unbilled_for_entire_org&inout=o", data = json.dumps(gkdata), headers=header)
	return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["gkresult"], "inputdate":inputdate, "new_inputdate":new_inputdate, "inout":inout}
