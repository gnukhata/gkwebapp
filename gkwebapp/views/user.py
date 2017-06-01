
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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

@view_config(route_name="showuser", renderer="gkwebapp:templates/createuser.jinja2")
def showuser(request):
	return {"gkresult":"0"}

@view_config(route_name="showedituser", renderer="gkwebapp:templates/edituser.jinja2")
def showedituser(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/user", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="edituser", renderer="json")
def edituser(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata={"userid":request.params["userid"], "username":request.params["username"], "userpassword":request.params["userpassword"]}
	result = requests.put("http://127.0.0.1:6543/users", headers=header, data=json.dumps(gkdata))
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="createuser", renderer="json")
def createuser(request):
	headers={"gktoken":request.headers["gktoken"]}
	goflag = False
	if int(request.params["userrole"]) == 3:
		gkdata = {"username":request.params["username"],"userpassword":request.params["userpassword"],"userrole":int(request.params["userrole"]),"userquestion":request.params["userquestion"],"useranswer":request.params["useranswer"],"golist":json.loads(request.params["godowns"])}
	else:
		gkdata = {"username":request.params["username"],"userpassword":request.params["userpassword"],"userrole":int(request.params["userrole"]),"userquestion":request.params["userquestion"],"useranswer":request.params["useranswer"]}
	result = requests.post("http://127.0.0.1:6543/users", data =json.dumps(gkdata), headers=headers)
	if result.json()["gkstatus"] == 0:
		if request.params["userrole"] == "-1":
			userrole = "Admin"
		elif request.params["userrole"] == "0":
			userrole = "Manager"
		elif request.params["userrole"] == "1":
			userrole = "Operator"
		elif request.params["userrole"] == "2":
			userrole = "Internal Auditor"
		else:
			userrole = "Godown In Charge"
		gkdata = {"activity":gkdata["username"] + "(" + userrole + ")" + " user created"}
		resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=headers)
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="removeuser", renderer="gkwebapp:templates/removeUser.jinja2")
def removeuser(request):
	headers={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/users", headers=headers)
	return {"gkstatus": result.json()["gkstatus"], "Users": result.json()["gkresult"]}


@view_config(route_name="deleteuser", renderer="json")
def deleteuser(request):
	headers={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/users", headers=headers)
	uname = ""
	urole = ""
	userrole = ""
	for user in result.json()["gkresult"]:
		if user["userid"] == int(request.params["username"]):
			uname = user["username"]
			urole = user["userrole"]
	if urole == "-1":
		userrole = "Admin"
	elif urole == "0":
		userrole = "Manager"
	elif urole == "1":
		userrole = "Operator"
	elif urole == "2":
		userrole = "Internal Auditor"
	else:
		userrole = "Godown In Charge"
	gkdata={"userid":request.params["username"] }
	result = requests.delete("http://127.0.0.1:6543/users", data=json.dumps(gkdata), headers=headers)
	if result.json()["gkstatus"] == 0:
		gkdata = {"activity":uname + "(" + userrole + ")" + " user deleted"}
		resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=headers)
	return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="forgotpassword", renderer="gkwebapp:templates/forgotpassword.jinja2")
def forgotpassword(request):
	code = request.params["orgcode"]
	return {"orgcode":code}

@view_config(route_name="securityquestion", renderer="json")
def securityquestion(request):
	result = requests.get("http://127.0.0.1:6543/forgotpassword?orgcode=%s&username=%s" % ((request.params["orgcode"]),(request.params["username"])))
	if result.json()["gkstatus"] == 0:
		userdata=[]
		userdata.append(result.json()["gkresult"])
		return {"gkresult":userdata, "gkstatus":result.json()["gkstatus"]}
	else:
		return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="securityanswer", renderer="json")
def securityanswer(request):
	result = requests.get("http://127.0.0.1:6543/forgotpassword?type=securityanswer&userid=%s&useranswer=%s" % ((request.params["userid"]),(request.params["useranswer"])))
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="newpassword", renderer="json")
def verifypassword(request):
	gkdata = {"userid":request.params["userid"],"userpassword":request.params["userpassword"],"useranswer":request.params["useranswer"]}
	result = requests.put("http://127.0.0.1:6543/forgotpassword", data =json.dumps(gkdata))
	return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="showuser",request_param="type=list", renderer="gkwebapp:templates/listofusers.jinja2")
def listofusers(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/users?type=list", headers=header)
	return {"gkresult":result.json()["gkresult"]}

@view_config(route_name="showuser",request_param="type=printable", renderer="gkwebapp:templates/printlistofusers.jinja2")
def printlistofusers(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/users?type=list", headers=header)
	return {"gkresult":result.json()["gkresult"]}

@view_config(route_name="showuser",request_param="type=spreadsheet", renderer="")
def listofusersspreadsheet(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/users?type=list", headers=header)
	result = result.json()["gkresult"]
	fystart = str(request.params["fystart"]);
	fyend = str(request.params["fyend"]);
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fystart+" to "+fyend +")"
	ods = ODS()
	sheet = ods.content.getSheet(0)
	sheet.setSheetName("List of Users")
	sheet.getRow(0).setHeight("23pt")

	sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
	ods.content.mergeCells(0,0,7,1)
	sheet.getRow(1).setHeight("18pt")
	sheet.getCell(0,1).stringValue("List Of Users").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
	ods.content.mergeCells(0,1,7,1)
	sheet.getColumn(1).setWidth("6cm")
	sheet.getColumn(2).setWidth("6cm")
	sheet.getColumn(3).setWidth("12cm")
	sheet.getCell(0,2).stringValue("Sr. No.").setBold(True)
	sheet.getCell(1,2).stringValue("User Name").setBold(True)
	sheet.getCell(2,2).stringValue("User Role").setBold(True)
	sheet.getCell(3,2).stringValue("Associated Godowns").setBold(True)
	row = 3
	for user in result:
		sheet.getCell(0, row).stringValue(user["srno"])
		sheet.getCell(1, row).stringValue(user["username"])
		sheet.getCell(2, row).stringValue(user["userrole"])
		gostring = ""
		i = 0
		for godown in user["godowns"]:
			if i == user["noofgodowns"]:
				gostring += godown
			else:
				gostring = gostring + godown + ","
			i += 1
		sheet.getCell(3, row).stringValue(gostring)
		row += 1

	ods.save("response.ods")
	repFile = open("response.ods")
	rep = repFile.read()
	repFile.close()
	headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
	os.remove("response.ods")
	return Response(rep, headerlist=headerList.items())
