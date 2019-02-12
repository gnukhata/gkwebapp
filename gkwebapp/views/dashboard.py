from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import openpyxl
from openpyxl.styles import Font, Alignment
import os

# @view_config(route_name="dashboard", request_param="action=showlist", renderer="gkwebapp:templates/mainshell.jinja2")
# def listofUnpaidInvoices(request):
#     header={"gktoken":request.headers["gktoken"]}
#     result = requests.get("http://127.0.0.1:6543/billwise?type=onlybillsforall&inoutflag=%d&orderflag=%d&typeflag=%d&startdate=%s&enddate=%s"%(int(request.params["inoutflag"]), int(request.params["orderflag"]),int(request.params["typeflag"]), request.params["fromdate"], request.params["todate"]), headers=header)
#     return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["invoices"], "type": result.json()["type"], "order": result.json()["order"], "inout": result.json()["inout"], "inoutflag":int(request.params["inoutflag"]), "orderflag": request.params["orderflag"], "typeflag": request.params["typeflag"], "fromdate": request.params["fromdate"], "todate": request.params["todate"]}
