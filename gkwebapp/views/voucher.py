from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showvoucher")
def showvoucher(request):
    type= request.params["type"]
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
    if result.json()["gkstatus"]==0:
        return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"accounts":result.json()["gkresult"],"vtype":type},request=request)
    else:
        return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)

@view_config(route_name="getcjaccounts", renderer="json")
def cjaccounts(request):
    type= request.params["type"]
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
    if result.json()["gkstatus"]==0:
        return {"accounts":result.json()["gkresult"]}
    else:
        return {"accounts":False}
