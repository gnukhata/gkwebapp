
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
  Free Software Foundation, Inc.,51 Franklin Street, Fifth Floor, 
  Boston, MA 02110, United States


Contributors:
"Krishnakant Mane" <kk@dff.org.in>
"Arun Kelkar" <arunkelkar@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
'Prajkta Patkar' <prajkta@riseup.net>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from odslib import ODS
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os

@view_config(route_name="printlistofaccounts", renderer="")
def printlistofaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	result = result.json()["gkresult"]
	fystart = str(request.params["fystart"]);
	fyend = str(request.params["fyend"]);
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fystart+" to "+fyend +")"
	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.setSheetName("List of Acounts")
	sheet.getRow(0).setHeight("23pt")

	sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
	ods.content.mergeCells(0,0,4,1)
	sheet.getRow(1).setHeight("18pt")
	sheet.getCell(0,1).stringValue("List Of Accounts").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	ods.content.mergeCells(0,1,4,1)
	sheet.getColumn(1).setWidth("8cm")
	sheet.getColumn(2).setWidth("4cm")
	sheet.getColumn(3).setWidth("4cm")
	sheet.getCell(0,2).stringValue("Sr. No.").setBold(True)
	sheet.getCell(1,2).stringValue("Account Name").setBold(True)
	sheet.getCell(2,2).stringValue("Group Name").setBold(True)
	sheet.getCell(3,2).stringValue("Sub-Group Name").setBold(True)
	row = 3
	for account in result:
		sheet.getCell(0, row).stringValue(account["srno"])
		sheet.getCell(1, row).stringValue(account["accountname"])
		sheet.getCell(2, row).stringValue(account["groupname"])
		sheet.getCell(3, row).stringValue(account["subgroupname"])
		row += 1

	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	os.remove("response.ods")
	return Response(rep, headerlist=headerList.items())


@view_config(route_name="showaccount", renderer="gkwebapp:templates/createaccount.jinja2")
def showaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
	grpdata=[]
	for record in result.json()["gkresult"]:
		gdata= {"groupname":str(record["groupname"]),"groupcode":str(record["groupcode"])}
		grpdata.append(gdata)
	return {"gkresult":grpdata,"baltbl":result.json()["baltbl"]}


@view_config(route_name="listofaccountsprint", renderer="gkwebapp:templates/printlistofaccounts.jinja2")
def listofaccountprint(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)

	return {"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="showlistofaccounts", renderer="gkwebapp:templates/listofaccounts.jinja2")
def showlistofaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)

	return {"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="accountexists", renderer="json")
def accountexists(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts?find=exists&accountname=%s"%(request.params["accountname"]), headers=header)

	return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="showmultiacc", renderer="gkwebapp:templates/multipleaccounts.jinja2")
def showmultiacc(request):

	return {"gkresult":request.params}


@view_config(route_name="showeditaccount", renderer="gkwebapp:templates/editaccount.jinja2")
def showeditaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	accdata=[]
	for record in result.json()["gkresult"]:
		adata= {"accountname":str(record["accountname"]),"accountcode":str(record["accountcode"])}
		accdata.append(adata)
	result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
	return {"gkresult":accdata, "baltbl":result.json()["baltbl"]}


@view_config(route_name="deleteaccount", renderer="json")
def deleteaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	gkdata={"accountcode":request.params["accountcode"]}
	result = requests.get("http://127.0.0.1:6543/account/%s"%(request.params["accountcode"]), headers=header)
	accountname = result.json()["gkresult"]["accountname"]
	groupcode = result.json()["gkresult"]["groupcode"]
	result = requests.delete("http://127.0.0.1:6543/accounts",data =json.dumps(gkdata), headers=header)
	if result.json()["gkstatus"] == 0:
		groups = requests.get("http://127.0.0.1:6543/groupsubgroups?groupflatlist", headers=header)
		debtgroupcode = groups.json()["gkresult"]["Sundry Debtors"]
		credgroupcode = groups.json()["gkresult"]["Sundry Creditors for Purchase"]
		custid = -1
		if debtgroupcode == groupcode:
			resultcust = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
			for cust in resultcust.json()["gkresult"]:
				if cust["custname"] == accountname:
					custid = cust["custid"]
					break
			if custid != -1:
				gkdata = {"custid":custid}
				resultdelc = requests.delete("http://127.0.0.1:6543/customersupplier", data =json.dumps(gkdata),headers=header)
				gkdata = {"activity":accountname + " customer deleted"}
				resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
		elif credgroupcode == groupcode:
			resultsup = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
			for cust in resultsup.json()["gkresult"]:
				if cust["custname"] == accountname:
					custid = cust["custid"]
					break
			if custid != -1:
				gkdata = {"custid":custid}
				resultdels = requests.delete("http://127.0.0.1:6543/customersupplier", data =json.dumps(gkdata),headers=header)
				gkdata = {"activity":accountname + " supplier deleted"}
				resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
		gkdata = {"activity":accountname + " account deleted"}
		resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}




@view_config(route_name="getaccdetails", renderer="json")
def getaccdetails(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/account/%s"%(request.params["accountcode"]), headers=header)
	record = result.json()["gkresult"]
	result = requests.get("http://127.0.0.1:6543/groupsubgroup/%s"%(record["groupcode"]), headers=header)

	grprecord = result.json()["gkresult"]


	if grprecord["groupcode"]==grprecord["subgroupcode"]:
		grprecord["subgroupname"] = "None"



	accdetails={"accountcode":record["accountcode"],"accountname":record["accountname"],"openingbal":record["openingbal"],"groupname":grprecord["groupname"],"subgroupname":grprecord["subgroupname"]}

	return {"gkresult":accdetails}


@view_config(route_name="getsubgroup", renderer="json")
def getsubgroup(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/groupDetails/%s"%(request.params["groupcode"]), headers=header)
	subgrpdata=[]
	for record in result.json()["gkresult"]:
		sgdata= {"subgroupname":record["subgroupname"],"subgroupcode":record["groupcode"]}

		subgrpdata.append(sgdata)

	return {"gkresult":subgrpdata}

@view_config(route_name="addaccount", renderer="json")
def addaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata = {"accountname":request.params["accountname"],"openingbal":request.params["openbal"]}
	if request.params["subgroupname"]=="New":
		gkdata1={"groupname":request.params["newsubgroup"],"subgroupof":request.params["groupname"]}
		result = requests.post("http://127.0.0.1:6543/groupsubgroups", data =json.dumps(gkdata1),headers=header)

		if result.json()["gkstatus"]==0:
			gkdata["groupcode"] = result.json()["gkresult"]

		else:
			return {"gkstatus":False}

	elif request.params["subgroupname"]=="None":
		grpcode= request.params["groupname"]

		gkdata["groupcode"] = grpcode
	else:
		gkdata["groupcode"] = request.params["subgroupname"]

	result = requests.post("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
	if result.json()["gkstatus"] == 0:
		gkdata = {"activity":request.params["accountname"] + " account created"}
		resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="multiacc", renderer="json")
def addmultiaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	accdetails = json.loads(request.params["accdetails"])

	gkdata = {}
	if accdetails[0]["subgroupname"]=="New":
		gkdata1={"groupname":accdetails[0]["newsubgroup"],"subgroupof":accdetails[0]["groupname"]}
		result = requests.post("http://127.0.0.1:6543/groupsubgroups", data =json.dumps(gkdata1),headers=header)

		if result.json()["gkstatus"]==0:
			gkdata["groupcode"] = result.json()["gkresult"]

		else:
			return {"gkstatus":False}

	elif accdetails[0]["subgroupname"]=="None":
		gkdata["groupcode"] = accdetails[0]["groupname"]

	else:
		gkdata["groupcode"] = accdetails[0]["subgroupname"]

	for acc in accdetails:
		gkdata["accountname"]=acc["accountname"]
		gkdata["openingbal"]=acc["openbal"]
		result = requests.post("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
		if result.json()["gkstatus"] == 0:
			gkdata2 = {"activity":acc["accountname"] + " account created"}
			resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata2),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}


#the functionality to edit customer after editing account and other such functionality should be done in core please make a note of this and change it later.
@view_config(route_name="editaccount", renderer="json")
def editaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/account/%s"%(request.params["accountcode"]), headers=header)
	accountname = result.json()["gkresult"]["accountname"]
	groupcode = result.json()["gkresult"]["groupcode"]
	gkdata = {"accountname":request.params["accountname"],"openingbal":request.params["openingbal"],"accountcode":request.params["accountcode"]}
	result = requests.put("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
	if result.json()["gkstatus"] == 0:
		groups = requests.get("http://127.0.0.1:6543/groupsubgroups?groupflatlist", headers=header)
		debtgroupcode = groups.json()["gkresult"]["Sundry Debtors"]
		credgroupcode = groups.json()["gkresult"]["Sundry Creditors for Purchase"]
		custid = -1
		custdetails = {}
		if debtgroupcode == groupcode:
			resultcust = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
			for cust in resultcust.json()["gkresult"]:
				if cust["custname"] == accountname:
					custid = cust["custid"]
					custdetailsres = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(cust["custid"])), headers=header)
					row = custdetailsres.json()["gkresult"]
					custdetails = {"custid":row["custid"], "custname":request.params["accountname"], "custaddr":row["custaddr"], "custphone":row["custphone"], "custemail":row["custemail"], "custfax":row["custfax"], "custpan":row["custpan"], "custtan":row["custtan"],"state":row["state"], "custdoc":row["custdoc"], "csflag":row["csflag"]}
					break
			if custid != -1:
				resultdelc = requests.put("http://127.0.0.1:6543/customersupplier", data =json.dumps(custdetails),headers=header)
		elif credgroupcode == groupcode:
			resultsup = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
			for cust in resultsup.json()["gkresult"]:
				if cust["custname"] == accountname:
					custid = cust["custid"]
					custdetailsres = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(cust["custid"])), headers=header)
					row = custdetailsres.json()["gkresult"]
					custdetails = {"custid":row["custid"], "custname":request.params["accountname"], "custaddr":row["custaddr"], "custphone":row["custphone"], "custemail":row["custemail"], "custfax":row["custfax"], "custpan":row["custpan"], "custtan":row["custtan"],"state":row["state"], "custdoc":row["custdoc"], "csflag":row["csflag"]}
					break
			if custid != -1:
				gkdata = {"custid":custid}
				resultdels = requests.put("http://127.0.0.1:6543/customersupplier", data =json.dumps(custdetails),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}
