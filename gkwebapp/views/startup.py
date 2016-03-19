from pyramid.view import view_config
import requests, json
from datetime import datetime
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
	for records in result.json():
		sdata = {"orgname":str(records["orgname"]),"orgtype":str(records["orgtype"])}
		strData.append(sdata)
	return {"gkresult":strData}

@view_config(route_name="yearcode", renderer="json")
def yearcode(request):
	oname = request.params["orgname"]
	otype = request.params["orgtype"]
	result = s.get("http://127.0.0.1:6543/orgyears/%s/%s"%(oname,otype))
	strData = []

	for records in result.json():
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
	return {"a":1}
