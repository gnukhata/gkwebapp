from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="showuser", renderer="gkwebapp:templates/createuser.jinja2")
def showuser(request):
    return {"gkresult":"0"}

@view_config(route_name="createuser", renderer="json")
def createuser(request):
    headers={"gktoken":request.headers["gktoken"]}
    gkdata = {"username":request.params["username"],"userpassword":request.params["userpassword"],"userrole":int(request.params["userrole"]),"userquestion":request.params["userquestion"],"useranswer":request.params["useranswer"]}
    print gkdata
    result = requests.post("http://127.0.0.1:6543/users", data =json.dumps(gkdata), headers=headers)
    if result.json()["gkstatus"]==0:
        return {"gkstatus":"User added successfully"}
    elif result.json()["gkstatus"]==4:
        return {"gkstatus":"Access denied!"}
    elif result.json()["gkstatus"]==1:
        return {"gkstatus":"User already exists!"}
    elif result.json()["gkstatus"]==3:
        return {"gkstatus":"Connection Failed"}

@view_config(route_name="removeuser", renderer="gkwebapp:templates/removeUser.jinja2")
def removeuser(request):
    headers={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/users", headers=headers)
    return {"gkstatus": result.json()["gkstatus"], "Users": result.json()["gkresult"]}


@view_config(route_name="deleteuser", renderer="json")
def deleteuser(request):
    headers={"gktoken":request.headers["gktoken"]}
    gkdata={"userid":request.params["username"] }
    result = requests.delete("http://127.0.0.1:6543/users", data=json.dumps(gkdata), headers=headers)
    print result.json()
    return {"gkstatus":result.json()["gkstatus"]}
