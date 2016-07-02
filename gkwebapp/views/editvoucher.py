
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

@view_config(route_name="findeditvoucher", renderer="gkwebapp:templates/findeditvoucher.jinja2")
def showfindvoucher(request):

	return {"gkresult":True}

@view_config(route_name="printvouchers", renderer="gkwebapp:templates/printtransactions.jinja2")
def printvouchers(request):
	header={"gktoken":request.headers["gktoken"]}
	searchby=request.params["searchby"]
	if searchby== "type":
		vtype = request.params["vtype"]

		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&vouchertype=%s"%(searchby,vtype), headers=header)


	if searchby== "vnum":
		vnum = request.params["vnum"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&voucherno=%s"%(searchby,vnum), headers=header)

	if searchby== "date":
		fromdate = request.params["fyear"]+"-"+request.params["fmonth"]+"-"+request.params["fday"]
		todate = request.params["tyear"]+"-"+request.params["tmonth"]+"-"+request.params["tday"]
		vfrom = datetime.strptime(fromdate,"%Y-%m-%d")
		vto = datetime.strptime(todate,"%Y-%m-%d")
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&from=%s&to=%s"%(searchby,vfrom,vto), headers=header)

	if searchby== "amount":
		amt = request.params["amount"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&total=%s"%(searchby,amt), headers=header)

	if searchby== "narration":
		nar = request.params["narration"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&nartext=%s"%(searchby,nar), headers=header)

	return {"gkstatus":result.json()["gkstatus"],"vouchers":result.json()["gkresult"],"backdata":request.params}



@view_config(route_name="getvouchers", renderer="gkwebapp:templates/findvouchertable.jinja2")
def getvouchers(request):
	header={"gktoken":request.headers["gktoken"]}
	searchby=request.params["searchby"]
	if searchby== "type":
		vtype = request.params["vtype"]

		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&vouchertype=%s"%(searchby,vtype), headers=header)


	if searchby== "vnum":
		vnum = request.params["vnum"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&voucherno=%s"%(searchby,vnum), headers=header)

	if searchby== "date":
		fromdate = request.params["fyear"]+"-"+request.params["fmonth"]+"-"+request.params["fday"]
		todate = request.params["tyear"]+"-"+request.params["tmonth"]+"-"+request.params["tday"]
		vfrom = datetime.strptime(fromdate,"%Y-%m-%d")
		vto = datetime.strptime(todate,"%Y-%m-%d")
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&from=%s&to=%s"%(searchby,vfrom,vto), headers=header)

	if searchby== "amount":
		amt = request.params["amount"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&total=%s"%(searchby,amt), headers=header)

	if searchby== "narration":
		nar = request.params["narration"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&nartext=%s"%(searchby,nar), headers=header)

	return {"gkstatus":result.json()["gkstatus"],"vouchers":result.json()["gkresult"],"userrole":result.json()["userrole"]}



@view_config(route_name="lockvoucher", renderer="json")
def lockvoucher(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata = {"vouchercode":request.params["id"],"lockflag":request.params["vstatus"]}

	result = requests.put("http://127.0.0.1:6543/transaction", data =json.dumps(gkdata),headers=header)

	if result.json()["gkstatus"]==0:
		return {"gkstatus":True}
	else:
		return {"gkstatus":False}

@view_config(route_name="viewvoucher", renderer="gkwebapp:templates/viewvoucher.jinja2")
def viewvoucher(request):
	header={"gktoken":request.headers["gktoken"]}
	vcode =request.params["id"]
	gkdata = {"code":int(vcode)}

	result = requests.get("http://127.0.0.1:6543/transaction?code=%d"%(int(request.params["id"])),headers=header)
	vc=result.json()["gkresult"]

	type = vc["vouchertype"]
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	if type=="contra" or type=="journal":
		result1 = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
		if result1.json()["gkstatus"]==0:
			draccounts=result1.json()["gkresult"]
			craccounts=result1.json()["gkresult"]
	elif type=="creditnote" or type=="debitnote" or type=="salesreturn" or type=="purchasereturn":
		result1 = requests.get("http://127.0.0.1:6543/accountsbyrule?type=journal", headers=header)
		if result1.json()["gkstatus"]==0:
			draccounts=result1.json()["gkresult"]
			craccounts=result1.json()["gkresult"]

	else:
		drresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Dr"%(type), headers=header)
		crresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Cr"%(type), headers=header)
		if drresult.json()["gkstatus"]==0 and crresult.json()["gkstatus"]==0:
			draccounts=drresult.json()["gkresult"]
			craccounts=crresult.json()["gkresult"]
		else:
			return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)



	if result.json()["gkstatus"]==0:
		return {"projects":projects.json()["gkresult"],"vtype":type,"voucher":vc,"userrole":result.json()["userrole"],"draccounts":draccounts,"craccounts":craccounts}
	else:
		return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)

@view_config(route_name="editvoucher", renderer="json")
def editvoucher(request):
	vdetails = json.loads(request.params["vdetails"])
	rowdetails= json.loads(request.params["transactions"])

	crs={}
	drs={}

	if vdetails["projectcode"] !="":
		gkdata={"vouchercode":vdetails["vcode"],"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"],"projectcode":int(vdetails["projectcode"])}
	else:
		gkdata={"vouchercode":vdetails["vcode"],"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"],"projectcode":None}
	if vdetails["delattach"]:
		gkdata["attachment"]=None
		gkdata["attachmentcount"]=0
	else:
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
				gkdata["attachment"] = files
				gkdata["attachmentcount"] = len(gkdata["attachment"])
		except:
			print "no attachment found"
	for row in rowdetails:
		if row["side"]=="Cr":
			crs[row["accountcode"]]=row["cramount"]
		if row["side"]=="Dr":
			drs[row["accountcode"]]=row["dramount"]
	header={"gktoken":request.headers["gktoken"]}

	result = requests.put("http://127.0.0.1:6543/transaction",data=json.dumps(gkdata) , headers=header)
	if result.json()["gkstatus"]==0:
		return {"gkstatus":True}
	else:
		return {"gkstatus":False}

@view_config(route_name="deletevoucher", renderer="json")
def deletevoucher(request):

	header={"gktoken":request.headers["gktoken"]}
	gkdata={"vouchercode":request.params["vcode"]}
	result = requests.delete("http://127.0.0.1:6543/transaction",data =json.dumps(gkdata), headers=header)
	return {"gkstatus":result.json()["gkstatus"]}
