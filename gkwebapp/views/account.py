from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
s = requests.session()

@view_config(route_name="showaccount", renderer="gkwebapp:templates/createaccount.jinja2")
def showaccount(request):

    s.headers.update({"gktoken":request.headers["gktoken"]})
    result = s.get("http://127.0.0.1:6543/groupsubgroups")
    grpdata=[]
    for record in result.json()["gkresult"]:
        gdata= {"groupname":str(record["groupname"]),"groupcode":str(record["groupcode"])}
        grpdata.append(gdata)
    return {"gkresult":grpdata}

@view_config(route_name="getsubgroup", renderer="json")
def getsubgroup(request):
    s.headers.update({"gktoken":request.headers["gktoken"]})
    result = s.get("http://127.0.0.1:6543/groupDetails/%s"%(request.params["groupcode"]))
    subgrpdata=[]
    for record in result.json()["gkresult"]:
        sgdata= {"subgroupname":record["subgroupname"],"subgroupcode":record["groupcode"]}
        print "this idddddddddd: ", sgdata
        subgrpdata.append(sgdata)

    return {"gkresult":subgrpdata}

@view_config(route_name="addaccount", renderer="json")
def addaccount(request):
    s.headers.update({"gktoken":request.headers["gktoken"]})

    gkdata = {"accountname":request.params["accountname"],"openingbal":request.params["openbal"]}
    if request.params["subgroupname"]=="None":
        grpcode= request.params["groupname"]
        print "thissssssssssssssssssssss: ",grpcode
        gkdata["groupcode"] = grpcode
    else:
        gkdata["groupcode"] = request.params["subgroupname"]
    result = s.post("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata))
    if result.json()["gkstatus"]==0:
        return {"gkstatus":True}
    else:
        return {"gkstatus":False}
