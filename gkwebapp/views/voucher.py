
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
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from PIL import Image
import base64
import cStringIO


@view_config(route_name="showvoucher")
def showvoucher(request):
	type= request.params["type"]
	header={"gktoken":request.headers["gktoken"]}
	if type=="contra" or type=="journal":
		result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
		projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
		if result.json()["gkstatus"]==0:
			return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"draccounts":result.json()["gkresult"],"craccounts":result.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type},request=request)
	elif type=="creditnote" or type=="debitnote" or type=="salesreturn" or type=="purchasereturn":
		result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=journal", headers=header)
		projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
		if result.json()["gkstatus"]==0:
			return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"draccounts":result.json()["gkresult"],"craccounts":result.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type},request=request)
	else:
		drresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Dr"%(type), headers=header)
		crresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Cr"%(type), headers=header)
		projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
		if drresult.json()["gkstatus"]==0 and crresult.json()["gkstatus"]==0:
			return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"draccounts":drresult.json()["gkresult"],"craccounts":crresult.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type},request=request)

@view_config(route_name="getcjaccounts", renderer="json")
def cjaccounts(request):
	type= request.params["type"]
	header={"gktoken":request.headers["gktoken"]}
	if type=="contra" or type=="journal":
		result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
		if result.json()["gkstatus"]==0:
			return {"accounts":result.json()["gkresult"]}
		else:
			return {"accounts":False}
	elif type=="creditnote" or type=="debitnote" or type=="salesreturn" or type=="purchasereturn":
		result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=journal", headers=header)
		if result.json()["gkstatus"]==0:
			return {"accounts":result.json()["gkresult"]}
		else:
			return {"accounts":False}
	else:
		side= request.params["side"]
		result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=%s"%(type,side), headers=header)
		if result.json()["gkstatus"]==0:
			return {"accounts":result.json()["gkresult"]}
		else:
			return {"accounts":False}

@view_config(route_name="addvoucher", renderer="json")
def addvoucher(request):
	vdetails = json.loads(request.params["vdetails"])
	rowdetails= json.loads(request.params["transactions"])
	crs={}
	drs={}
	if vdetails["projectcode"] !="":
		gkdata={"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"],"projectcode":int(vdetails["projectcode"])}
	else:
		gkdata={"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"]}
	try:
		img = request.POST["img"].file
		image = Image.open(img)
		imgbuffer = cStringIO.StringIO()
		image.save(imgbuffer, format="JPEG")
		img_str = base64.b64encode(imgbuffer.getvalue())
		image.close()
		gkdata["attachment"] = img_str
	except:
		print "no attachment found"
	for row in rowdetails:
		if row["side"]=="Cr":
			crs[row["accountcode"]]=row["cramount"]
		if row["side"]=="Dr":
			drs[row["accountcode"]]=row["dramount"]
	header={"gktoken":request.headers["gktoken"]}

	result = requests.post("http://127.0.0.1:6543/transaction",data=json.dumps(gkdata) , headers=header)
	if result.json()["gkstatus"]==0:
		return {"gkstatus":True}
	else:
		return {"gkstatus":False}

@view_config(route_name="accountpopup", renderer="gkwebapp:templates/createaccountpopup.jinja2")
def accountpopup(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
	grpdata=[]
	for record in result.json()["gkresult"]:
		gdata= {"groupname":str(record["groupname"]),"groupcode":str(record["groupcode"])}
		grpdata.append(gdata)
	return {"gkresult":grpdata,"baltbl":result.json()["baltbl"]}

@view_config(route_name="showdeletedvoucher", renderer="gkwebapp:templates/deletedvoucher.jinja2")
def showdeletedvoucher(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=deletedvoucher", headers=header)
	return {"gkresult":result.json()["gkresult"]}

@view_config(route_name="getattachment", renderer="json")
def getattachment(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/transaction?attach=image&vouchercode=%d"%(int(request.params["vouchercode"])), headers=header)
	return {"attachment":result.json()["gkresult"]}
