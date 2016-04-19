from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="findeditvoucher", renderer="gkwebapp:templates/findeditvoucher.jinja2")
def showfindvoucher(request):

	return {"gkresult":True}

@view_config(route_name="getvouchers", renderer="json")
def getvouchers(request):
	header={"gktoken":request.headers["gktoken"]}
	searchby=request.params["searchby"]
	if searchby== "type":
		vtype = request.params["vtype"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&vouchertype=%s"%(searchby,vtype), headers=header)
		print "this issss itttt: ",result.json()["gkstatus"]

	if searchby== "vnum":
		vnum = request.params["vnum"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&voucherno=%s"%(searchby,vnum), headers=header)

	if searchby== "date":
		fromdate = request.params["fyear"]+"-"+request.params["fmonth"]+"-"+request.params["fday"]
		todate = request.params["tyear"]+"-"+request.params["tmonth"]+"-"+request.params["tday"]
		vfrom = datetime.strptime(fromdate,"%Y-%m-%d")
		vto = datetime.strptime(todate,"%Y-%m-%d")
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&from=%s&to=%s"%(searchby,vfrom,vto), headers=header)
		'''for vc in range(len(result.json()["gkresult"])):
			a=datetime.strftime(datetime.strptime(result.json()["gkresult"][vc]["voucherdate"],"%Y-%m-%d %H:%M:%S"),"%d-%m-%Y")
			print "daaaattteee: ",a
			result.json()["gkresult"][vc]["voucherdate"] = a'''

	if searchby== "amount":
		amt = request.params["amount"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&total=%s"%(searchby,amt), headers=header)

	if searchby== "narration":
		nar = request.params["narration"]
		result = requests.get("http://127.0.0.1:6543/transaction?searchby=%s&nartext=%s"%(searchby,nar), headers=header)

	if result.json()["gkstatus"]==0:
		print result.json()["gkresult"]
		print "uuuuuuuussssssssseeeeeeeeerrrrrrr: ",result.json()["userrole"]
		return {"vouchers":result.json()["gkresult"],"userrole":result.json()["userrole"]}
	else:
		return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)


@view_config(route_name="lockvoucher", renderer="json")
def lockvoucher(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata = {"vouchercode":request.params["id"],"lockflag":request.params["vstatus"]}
	print"gkdataaaaa: ",gkdata
	result = requests.put("http://127.0.0.1:6543/transaction", data =json.dumps(gkdata),headers=header)
	print"statttttuuuuusssss:",result.json()["gkstatus"]

	if result.json()["gkstatus"]==0:
		return {"gkstatus":True}
	else:
		return {"gkstatus":False}
