from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import openpyxl
from openpyxl.styles import Font, Alignment
import os

@view_config(route_name="dashboard", request_param="action=showlist", renderer="json")
def fiveinvoicelist(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=fiveinvoicelist&inoutflag=%d&typeflag=%d"%(int(request.params["inoutflag"]),int(request.params["typeflag"])), headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["invoices"], "inoutflag":int(request.params["inoutflag"]), "typeflag": request.params["typeflag"]}

@view_config(route_name="dashboard", request_param="action=countinvoice", renderer="json")
def invoicecountbymonth(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=invoicecountbymonth&inoutflag=%d"%(int(request.params["inoutflag"])),headers=header)
    return {"gkstatus":result.json()["gkstatus"],"month": result.json()["month"],"invcount":result.json()["invcount"],"inoutflag":int(request.params["inoutflag"])}

@view_config(route_name="dashboard", request_param="action=topcustlist", renderer="json")
def topfivecustsuplist(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=topfivecustsup&inoutflag=%d"%(int(request.params["inoutflag"])), headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["topfivecustlist"],"inoutflag":int(request.params["inoutflag"])}
