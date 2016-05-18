from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showviewledger", renderer="gkwebapp:templates/viewledger.jinja2")
def showviewledger(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"gkresult":result.json()["gkresult"],"projects":projects.json()["gkresult"]}

@view_config(route_name="showledgerreport", renderer="gkwebapp:templates/ledgerreport.jinja2")
def showledgerreport(request):
	accountcode = int(request.params["accountcode"])
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	projectcode = request.params["projectcode"]
	header={"gktoken":request.headers["gktoken"]}
	if projectcode=="":
		result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode,calculatefrom,calculateto,financialstart), headers=header)
	else:
		result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode,calculatefrom,calculateto,financialstart,int(projectcode)), headers=header)
	return {"records":result.json()["gkresult"]}
