from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="showeditOrg", renderer="gkwebapp:templates/editorganisation.jinja2")
def showeditOrg(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/organisation", headers=header)
	print result.json()["gkdata"]
	return {"gkresult":result.json()["gkdata"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="editorganisation", renderer="json")
def editOrganisation(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata= {"orgcity":request.params["orgcity"],"orgaddr":request.params["orgaddr"],"orgpincode":request.params["orgpincode"],"orgstate":request.params["orgstate"], "orgcountry":request.params["orgcountry"],"orgtelno":request.params["orgtelno"], "orgfax":request.params["orgfax"],"orgwebsite":request.params["orgwebsite"],"orgemail":request.params["orgemail"],"orgpan":request.params["orgpan"],"orgmvat":request.params["orgmvat"],"orgstax":request.params["orgstax"],"orgregno":request.params["orgregno"],"orgregdate":request.params["orgregdate"], "orgfcrano":request.params["orgfcrano"],"orgfcradate":request.params["orgfcradate"]}
	result = requests.put("http://127.0.0.1:6543/organisations", headers=header, data=json.dumps(gkdata))
	print "pqr"
	return {"gkstatus":result.json()["gkstatus"]}
