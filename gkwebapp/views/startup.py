from pyramid.view import view_config
import requests, json

@view_config(route_name="index", renderer="gkwebapp:templates/index.jinja2")
def index(request):
    return {"a":1}

@view_config(route_name="about", renderer="gkwebapp:templates/about.jinja2")
def about(request):
    return {"a":1}

@view_config(route_name="existingorg", renderer="gkwebapp:templates/existingorg.jinja2")
def existingorg(request):
    s = requests.session()
    result = s.get("http://127.0.0.1:6543/organisations")
    print result.json()
    strData = []
    for records in result.json():
        sdata = {"orgname":str(records["orgname"]),"orgtype":str(records["orgtype"])}
        strData.append(sdata)
    return {"gkresult":strData}

@view_config(route_name="createorg", renderer="gkwebapp:templates/createorg.jinja2")
def createorg(request):
    return {"a":1}
