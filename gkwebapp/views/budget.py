

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.i18n import default_locale_negotiator
s = requests.session()
from PIL import Image
import base64
import cStringIO

@view_config(route_name="budget", renderer="gkwebapp:templates/budget.jinja2")
def budget(request):
    header={"gktoken":request.headers["gktoken"]}
    return {"status":True}

@view_config(route_name="budget",request_param="type=addtab", renderer="gkwebapp:templates/createbudget.jinja2")
def addbudgetpage(request):
    header={"gktoken":request.headers["gktoken"]}
    return {"status":True}

@view_config(route_name="budget",request_param="type=edit_tab", renderer="gkwebapp:templates/editbudget.jinja2")
def editbudgetpage(request):
    print("fff")
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/budget?bud=all", headers=header)
    buddata=[]
    for record in result.json()["gkresult"]:
        gdata= {"budname":str(record["budname"]),"budid":str(record["budid"]),"startdate": record["startdate"],"enddate": record["enddate"]}
        buddata.append(gdata)
    print(buddata)
    return {"gkresult":buddata,"numberofbudget":len(result.json()["gkresult"]),"status":True}
    
@view_config(route_name="budget",request_param="type=getbuddetails", renderer="json")
def editbudgetpage(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/budget?bud=details&budid=%d"%int(request.params["budid"]), headers=header)
    if(result.json()["gkstatus"] == 0):
        record = result.json()["gkresult"]
        resp = {"budnname":str(record["budname"]),"budid":str(record["budid"]),"startdate": record["startdate"],"enddate": record["enddate"],"contents":record["contents"],"btype":record["btype"],"gaflag":record["gaflag"]}
        return {"gkstatus":0, "gkresult":resp}
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="budget",request_param="type=add", renderer="json")
def addbudget(request):
    header={"gktoken":request.headers["gktoken"]}
    if "goid" in request.params:
        gkdata = {"goid":int(request.params["goid"]),"budname":request.params["budname"],"startdate":request.params["startdate"],"enddate":request.params["enddate"], "contents":json.loads(request.params["contents"])[0], "budtype":int(request.params["btype"]), "gaflag":int(request.params["gaflag"])}
    else:
        gkdata = {"budname":request.params["budname"],"startdate":request.params["startdate"],"enddate":request.params["enddate"], "contents":json.loads(request.params["contents"])[0], "budtype":request.params["btype"], "gaflag":request.params["gaflag"]}

    result = requests.post("http://127.0.0.1:6543/budget", data =json.dumps(gkdata),headers=header)
    if result.json()["gkstatus"] == 0:
        gkdata = {"activity":request.params["budname"] + " budget created"}   
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="budget",request_param="type=galisttable", renderer="gkwebapp:templates/createbudgetaccountstable.jinja2")
def galist(request):
    header={"gktoken":request.headers["gktoken"]}
    if(request.params["flag"] == '1'):
        result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
        return {"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"],"flag":request.params["flag"] }
    if(request.params["flag"] == '7'):
        result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
        grpdata=[]
        for record in result.json()["gkresult"]:
            gdata= {"accountname":str(record["groupname"]),"accountcode":str(record["groupcode"])}
            grpdata.append(gdata)
        return {"gkresult":grpdata,"gkstatus":result.json()["gkstatus"],"flag":request.params["flag"] }
    if(request.params["flag"] == '19'):
        result = requests.get("http://127.0.0.1:6543/groupsubgroups?allsubgroup", headers=header)
        sgrpdata=[]
        for record in result.json()["gkresult"]:
            gdata= {"accountname":str(record["groupname"]),"accountcode":str(record["groupcode"])}
            sgrpdata.append(gdata)
        return {"gkresult":sgrpdata,"gkstatus":result.json()["gkstatus"],"flag":request.params["flag"] }

@view_config(route_name="budget",request_param="type=edit", renderer="json")
def editbudget(request):
        header={"gktoken":request.headers["gktoken"]}
        gkdata = {"budid":request.params["budid"],"budname":request.params["budname"],"startdate":request.params["startdate"], "enddate":request.params["enddate"], "contents": json.loads(request.params["contents"])[0], "budtype":request.params["btype"],"gaflag":request.params["gaflag"]}
        result = requests.put("http://127.0.0.1:6543/budget", data =json.dumps(gkdata),headers=header)
        return {"gkstatus":result.json()["gkstatus"]}
        
