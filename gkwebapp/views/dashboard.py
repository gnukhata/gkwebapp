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
    return {"gkstatus":result.json()["gkstatus"],"invcount":result.json()["invcount"],"inoutflag":int(request.params["inoutflag"])}

@view_config(route_name="dashboard", request_param="action=topcustlist", renderer="json")
def topfivecustsuplist(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=topfivecustsup&inoutflag=%d"%(int(request.params["inoutflag"])), headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["topfivecustlist"],"inoutflag":int(request.params["inoutflag"])}

@view_config(route_name="dashboard", request_param="action=topfiveproduct", renderer="json")
def topfiveproductlist(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=topfiveproduct&inoutflag=%d"%(int(request.params["inoutflag"])), headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["topfiveprod"]}

@view_config(route_name="dashboard", request_param="action=stockonhandfordashboard", renderer="json")
def stockonhandfordashboard(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/report?stockonhandfordashboard&calculateto=%s"%(request.params["calculateto"]),headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["gkresult"],"productname":result.json()["productname"]}

@view_config(route_name="dashboard", request_param="action=profitlosschart", renderer="json")
def profitlossreport(request):
    calculateto = request.params["calculateto"]
    # financialstart = request.params["financialstart"]
    # orgtype = request.params["orgtype"]
    header={"gktoken":request.headers["gktoken"]}

    result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
    DirectIncome = result.json()["gkresult"]["Direct Income"]["Sales"]["balance"]
    InDirectIncome = result.json()["gkresult"]["Indirect Income"]["indirincmbal"]
    DirectExpense = result.json()["gkresult"]["Direct Expense"]["direxpbal"]
    InDirectExpense = result.json()["gkresult"]["Indirect Expense"]["indirexpbal"]
    return {"gkstatus":result.json()["gkstatus"],"DirectIncome":DirectIncome,"InDirectIncome":InDirectIncome,"DirectExpense":DirectExpense,"InDirectExpense":InDirectExpense}

@view_config(route_name="dashboard", request_param="action=countdelchal", renderer="json")
def delchalcountbymonth(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=delchalcountbymonth&inoutflag=%d"%(int(request.params["inoutflag"])),headers=header)
    return {"gkstatus":result.json()["gkstatus"],"delchalcount":result.json()["delchalcount"],"inoutflag":int(request.params["inoutflag"])}

@view_config(route_name="dashboard", request_param="action=balancesheetchart", renderer="json")
def balancesheetreport(request):
    calculateto = request.params["calculateto"]
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
    # print result.json()
    # return render_to_response("gkwebapp:templates/conventionalbalancesheetreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":"verticalbalancesheet","to":calculateto,"orgtype":orgtype,"flag":flag},request=request)
