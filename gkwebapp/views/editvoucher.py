from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="findeditvoucher", renderer="gkwebapp:templates/findeditvoucher.jinja2")
def showfindvoucher(request):

	return {"gkresult":True}
