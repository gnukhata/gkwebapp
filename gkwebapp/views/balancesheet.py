from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showbalancesheet", renderer="gkwebapp:templates/viewbalancesheet.jinja2")
def showtrialbalance(request):
	return {"gkstatus":0}

@view_config(route_name="showbalancesheetreport")
def showtrialbalancereport(request):
	calculateto = request.params["calculateto"]
	balancesheettype = request.params["balancesheettype"]
	orgtype = request.params["orgtype"]
	header={"gktoken":request.headers["gktoken"]}
	if balancesheettype == "conventionalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/conventionalbalancesheetreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":balancesheettype,"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y'),"orgtype":orgtype},request=request)
	if balancesheettype == "verticalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=2"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/sourcesandapplicationoffundsreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":balancesheettype,"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y'),"orgtype":orgtype},request=request)
