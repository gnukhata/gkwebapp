from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="findeditvoucher", renderer="gkwebapp:templates/findeditvoucher.jinja2")
def showfindvoucher(request):

	return {"gkresult":True}

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

	if result.json()["gkstatus"]==0:

		return {"vouchers":result.json()["gkresult"],"userrole":result.json()["userrole"]}
	else:
		return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)


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
	if type=="contra" or type=="journal":
		result1 = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
		if result1.json()["gkstatus"]==0:
			draccounts=result1.json()["gkresult"]
			craccounts=result1.json()["gkresult"]
		else:
			return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)
	else:
		drresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Dr"%(type), headers=header)
		crresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Cr"%(type), headers=header)
		if drresult.json()["gkstatus"]==0 and crresult.json()["gkstatus"]==0:
			draccounts=drresult.json()["gkresult"]
			craccounts=crresult.json()["gkresult"]
		else:
			return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)

	print"statttttuuuuusssss:",result.json()["gkstatus"]

	if result.json()["gkstatus"]==0:
		return {"voucher":vc,"userrole":result.json()["userrole"],"draccounts":draccounts,"craccounts":craccounts}
	else:
		return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)

@view_config(route_name="editvoucher", renderer="json")
def editvoucher(request):
	vdetails = json.loads(request.params["vdetails"])
	rowdetails= json.loads(request.params["transactions"])
	crs={}
	drs={}
	if vdetails["projectcode"] !="":
		gkdata={"vouchercode":vdetails["vcode"],"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"],"projectcode":int(vdetails[projectcode])}
	else:
		gkdata={"vouchercode":vdetails["vcode"],"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"]}
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
