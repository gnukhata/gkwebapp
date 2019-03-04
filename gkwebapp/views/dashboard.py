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
def showprofitlossreport(request):
    calculateto = request.params["calculateto"]
    # financialstart = request.params["financialstart"]
    # orgtype = request.params["orgtype"]
    header={"gktoken":request.headers["gktoken"]}

    result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
    DirectIncome = result.json()["gkresult"]["Direct Income"]
    InDirectIncome = result.json()["gkresult"]["Indirect Income"]
    DirectExpense = result.json()["gkresult"]["Direct Expense"]
    InDirectExpense = result.json()["gkresult"]["Indirect Expense"]
    print (DirectIncome,"DI")
    print (InDirectIncome,"II")
    print (DirectExpense,"DE")
    print (InDirectExpense,"IE")

    # return render_to_response("gkwebapp:templates/profitlossreport.jinja2",{"DirectIncome":DirectIncome,"ClosingStock":result.json()["gkresult"]["Closing Stock"],"InDirectIncome":InDirectIncome,"DirectExpense":DirectExpense,"InDirectExpense":InDirectExpense,"net":net,"gross":gross,"orgtype":orgtype,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y'),"Total":Total},request=request)
