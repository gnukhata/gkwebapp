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
    return {"gkresult":grpdata}

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
    if result.json()["gkstatus"]==0:
        return {"gkstatus":True}
    else:
        return {"gkstatus":False}
