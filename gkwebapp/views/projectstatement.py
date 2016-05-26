from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showviewprojectstatement", renderer="gkwebapp:templates/viewprojectstatement.jinja2")
def showviewprojectstatement(request):
	header={"gktoken":request.headers["gktoken"]}
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"projects":projects.json()["gkresult"]}

@view_config(route_name="showprojectstatementreport")
def showprojectstatementreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	projectcode = int(request.params["projectcode"])
	projectname = request.params["projectname"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=projectstatement&calculateto=%s&financialstart=%s&projectcode=%d"%(calculateto,financialstart,projectcode), headers=header)
	return render_to_response("gkwebapp:templates/projectstatementreport.jinja2",{"records":result.json()["gkresult"],"projectcode":projectcode,"projectname":projectname,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
