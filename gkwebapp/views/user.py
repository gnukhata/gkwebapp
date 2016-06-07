from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="showuser", renderer="gkwebapp:templates/createuser.jinja2")
def showuser(request):
    return {"gkresult":"0"}

@view_config(route_name="showedituser", renderer="gkwebapp:templates/edituser.jinja2")
def showedituser(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/user", headers=header)
	return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="edituser", renderer="json")
def edituser(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata={"userid":request.params["userid"], "username":request.params["username"], "userpassword":request.params["userpassword"]}
	result = requests.put("http://127.0.0.1:6543/users", headers=header, data=json.dumps(gkdata))
	print result.json()["gkstatus"]
	print "abc"
	return {"gkstatus": result.json()["gkstatus"]}

@view_config(route_name="createuser", renderer="json")
def createuser(request):
    headers={"gktoken":request.headers["gktoken"]}
    gkdata = {"username":request.params["username"],"userpassword":request.params["userpassword"],"userrole":int(request.params["userrole"]),"userquestion":request.params["userquestion"],"useranswer":request.params["useranswer"]}
    print gkdata
    result = requests.post("http://127.0.0.1:6543/users", data =json.dumps(gkdata), headers=headers)
    return {"gkstatus":result.json()["gkstatus"]}

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


@view_config(route_name="forgotpassword", renderer="gkwebapp:templates/forgotpassword.jinja2")
def forgotpassword(request):
    code = request.params["orgcode"]
    return {"orgcode":code}
