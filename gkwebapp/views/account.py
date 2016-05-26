from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showaccount", renderer="gkwebapp:templates/createaccount.jinja2")
def showaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
	grpdata=[]
	for record in result.json()["gkresult"]:
		gdata= {"groupname":str(record["groupname"]),"groupcode":str(record["groupcode"])}
		grpdata.append(gdata)
	return {"gkresult":grpdata,"baltbl":result.json()["baltbl"]}


@view_config(route_name="accountexists", renderer="json")
def accountexists(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts?find=exists&accountname=%s"%(request.params["accountname"]), headers=header)

	return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="showmultiacc", renderer="gkwebapp:templates/multipleaccounts.jinja2")
def showmultiacc(request):
	print request.params
	return {"gkresult":request.params}


@view_config(route_name="showeditaccount", renderer="gkwebapp:templates/editaccount.jinja2")
def showeditaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	accdata=[]
	for record in result.json()["gkresult"]:
		adata= {"accountname":str(record["accountname"]),"accountcode":str(record["accountcode"])}
		accdata.append(adata)
	return {"gkresult":accdata}


@view_config(route_name="deleteaccount", renderer="json")
def deleteaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	gkdata={"accountcode":request.params["accountcode"]}
	result = requests.delete("http://127.0.0.1:6543/accounts",data =json.dumps(gkdata), headers=header)
	return {"gkstatus":result.json()["gkstatus"]}




@view_config(route_name="getaccdetails", renderer="json")
def getaccdetails(request):
	print "went inside ac details"
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/account/%s"%(request.params["accountcode"]), headers=header)

	record = result.json()["gkresult"]
	print "groupcode isssss: ",record["groupcode"]
	result = requests.get("http://127.0.0.1:6543/groupsubgroup/%s"%(record["groupcode"]), headers=header)
	print "this is gkkksssttt: ",str(result.json()["gkstatus"])
	grprecord = result.json()["gkresult"]
	print"this is grprec:",grprecord

	if grprecord["groupname"]==grprecord["subgroupname"]:
		grprecord["subgroupname"] = "None"
		print "wennnnnnttttt"

	print "asdasdasdasd"
	accdetails={"accountcode":record["accountcode"],"accountname":record["accountname"],"openingbal":record["openingbal"],"groupname":grprecord["groupname"],"subgroupname":grprecord["subgroupname"]}
	print "this is acccccddddeeee: ",accdetails
	print "type acccode: ",type(record["accountcode"])
	print "type opnbal: ",type(record["openingbal"])
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
	return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="multiacc", renderer="json")
def addmultiaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	accdetails = json.loads(request.params["accdetails"])
	print "this is accdetails: ",json.loads(request.params["accdetails"])
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
		print "thiiiiiiiiiiiiiiisssssssssss issssssssssssssssssss",gkdata
		result = requests.post("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="editaccount", renderer="json")
def editaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata = {"accountname":request.params["accountname"],"openingbal":request.params["openingbal"],"accountcode":request.params["accountcode"]}
	result = requests.put("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}
