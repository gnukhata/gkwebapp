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
    header={"gktoken":request.headers["gktoken"]}
    if request.params["drcrflag"]=='3':
        invoices = requests.get("http://127.0.0.1:6543/invoice?inv=all&type=sale", headers=header)
        #print "Sale3"
        #print invoices.json()["gkresult"]
    else:
        invoices = requests.get("http://127.0.0.1:6543/invoice?inv=all&type=purchase", headers=header)
    #it gives tax type VAT or GST on the basis of financialEnd Year of organisation    
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    return {"drcrflag": request.params["drcrflag"],"invoices":invoices.json()["gkresult"],"resultgstvat":resultgstvat.json()["gkresult"]}
