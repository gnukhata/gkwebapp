from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showproject")
def showproject(request):
    header={"gktoken":request.headers["gktoken"]}
    projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
    if projects.json()["gkstatus"]==0:
        return render_to_response("gkwebapp:templates/project.jinja2",{"projects":projects.json()["gkresult"]},request=request)
    else:
        return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)


@view_config(route_name="addproject", renderer="json")
def addproject(request):
    header={"gktoken":request.headers["gktoken"]}
    gkdata = {"projectname":request.params["projectname"],"sanctionedamount":float(request.params["sanctionedamount"])}
    print gkdata
    result = requests.post("http://127.0.0.1:6543/projects",data=json.dumps(gkdata), headers=header)
    return {"gkstatus":result.json()["gkstatus"]}
