from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
s = requests.session()

@view_config(route_name="index", renderer="gkwebapp:templates/index.jinja2")
def index(request):
	return {"a":1}

@view_config(route_name="about", renderer="gkwebapp:templates/about.jinja2")
def about(request):
	return {"a":1}

@view_config(route_name="existingorg", renderer="gkwebapp:templates/existingorg.jinja2")
def existingorg(request):
	result = s.get("http://127.0.0.1:6543/organisations")
	strData = []
	for records in result.json()["gkdata"]:
		sdata = {"orgname":str(records["orgname"]),"orgtype":str(records["orgtype"])}
		strData.append(sdata)
	return {"gkresult":strData}

@view_config(route_name="yearcode", renderer="json")
def yearcode(request):
	oname = request.params["orgname"]
	otype = request.params["orgtype"]
	result = s.get("http://127.0.0.1:6543/orgyears/%s/%s"%(oname,otype))
	strData = []

	for records in result.json()["gkdata"]:
		print datetime.strftime(datetime.strptime(records["yearstart"],"%Y-%m-%d"),"%d-%m-%Y")
		sdata = {"yearstart":datetime.strftime(datetime.strptime(records["yearstart"],"%Y-%m-%d"),"%d-%m-%Y"),"yearend":datetime.strftime(datetime.strptime(records["yearend"],"%Y-%m-%d"),"%d-%m-%Y"), "orgcode":records["orgcode"]}
		strData.append(sdata)
	return {"gkresult":strData}

@view_config(route_name="login", renderer="gkwebapp:templates/login.jinja2")
def login(request):
	print request.params["orgcode"]
	return {"code":request.params["orgcode"]}


@view_config(route_name="createorg", renderer="gkwebapp:templates/createorg.jinja2")
def createorg(request):
	#print "asdasdasdasdasdasdasdasdas"
	return {"a":1}

@view_config(route_name="createadmin", renderer="gkwebapp:templates/createadmin.jinja2")
def createadmin(request):
	orgname = request.params["orgname"]
	#print request.params["orgname"]

	orgtype = request.params["orgtype"]
	#print request.params["orgtype"]

	fromdate = request.params["fdate"]
	#print request.params["fdate"]

	todate = request.params["tdate"]
	#print type(datetime.strptime(request.params["tdate"],"%Y-%m-%d"))

	return {"orgname":orgname, "orgtype":orgtype, "fromdate":fromdate, "todate":todate}

@view_config(route_name="createorglogin",renderer="json")
def orglogin(request):

	gkdata = {"orgdetails":{"orgname":request.params["orgname"], "orgtype":request.params["orgtype"], "yearstart":request.params["yearstart"], "yearend":request.params["yearend"]}, "userdetails":{"username":request.params["username"], "userpassword":request.params["password"],"userquestion":request.params["securityquestion"], "useranswer":request.params["securityanswer"]}}
	print gkdata
	result = s.post("http://127.0.0.1:6543/organisations", data =json.dumps(gkdata))
	print result.json()
	return  {"gktoken":result.json()["token"]}

@view_config(route_name="userlogin",renderer="json")
def selectorglogin(request):

	gkdata = {"username":request.params["username"], "userpassword":request.params["userpassword"],"orgcode":request.params["orgcode"]}
	print gkdata
	result = s.post("http://127.0.0.1:6543/login", data =json.dumps(gkdata))
	print result.json()
	return  {"gktoken":result.json()["token"]}


@view_config(route_name="showmainshell",renderer="gkwebapp:templates/mainshell.jinja2")
def mainshell(request):
	return {"status":"ok"}
