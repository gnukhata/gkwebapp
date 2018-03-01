from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
from PIL import Image
import base64
import cStringIO
import os
from odslib import ODS

@view_config(route_name="drcrnote",renderer="gkwebapp:templates/drcrnote.jinja2")
def showdrcrnote(request):
    return {"status":True}
@view_config(route_name="drcrnote",request_param="action=add",renderer="gkwebapp:templates/adddrcrnote.jinja2")
def showaddcreditnote(request):
    #header={"gktoken":request.headers["gktoken"]}
    #states = requests.get("http://127.0.0.1:6543/state", headers=header)
    if request.params["drcrflag"] =='3':
        print "\n credit= "
        print request.params["drcrflag"]
    else:
        print "\n debit= "
        print request.params["drcrflag"]        
    return {"drcrflagstatus": request.params["drcrflag"],"status":True}

