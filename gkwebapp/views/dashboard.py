
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@dff.org.in>
"Abhijith Balan" <abhijithb21@openmailbox.org>
"prajkta Patkar" <prajkta@riseup.net>
"Rupali Badgujar" <rupalibadgujar1234@gmail.com>
   """

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

@view_config(route_name="dashboard", request_param="action=countdelchal", renderer="json")
def delchalcountbymonth(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=delchalcountbymonth&inoutflag=%d"%(int(request.params["inoutflag"])),headers=header)
    return {"gkstatus":result.json()["gkstatus"],"delchalcount":result.json()["delchalcount"],"inoutflag":int(request.params["inoutflag"])}

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

@view_config(route_name="dashboard", request_param="action=balancesheetchart", renderer="json")
def balancesheetreport(request):
    calculateto = request.params["calculateto"]
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
    data1=[]
    data2=[]
    for content in result.json()["gkresult"]["rightlist"]:
        if (content["groupAccname"]=="Total"):
            data1.append(content["amount"])
    for content in result.json()["gkresult"]["leftlist"]:
        count = 0
        if (content["groupAccname"]=="Total"):
            count = count + 1
            data2.append(content["amount"])
            if (count == 2):
                data1.append (data2[1])
            else:
                data1.append (data2[0])
    return {"gkstatus":result.json()["gkstatus"],"data":data1}

@view_config(route_name="dashboard", request_param="action=profitlosschart", renderer="json")
def profitlossreport(request):
    calculatefrom = request.params["calculatefrom"]
    calculateto = request.params["calculateto"]
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculatefrom=%s&calculateto=%s"%(calculatefrom,calculateto), headers=header)
    DirectIncome = result.json()["gkresult"]["Direct Income"]["Sales"]["balance"]
    InDirectIncome = result.json()["gkresult"]["Indirect Income"]["indirincmbal"]
    DirectExpense = result.json()["gkresult"]["Direct Expense"]["direxpbal"]
    InDirectExpense = result.json()["gkresult"]["Indirect Expense"]["indirexpbal"]
    return {"gkstatus":result.json()["gkstatus"],"DirectIncome":DirectIncome,"InDirectIncome":InDirectIncome,"DirectExpense":DirectExpense,"InDirectExpense":InDirectExpense}

@view_config(route_name="dashboard", request_param="action=stockonhandforgodownincharge", renderer="json")
def stockonhandforgodownincharge(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/report?godownwisestockforgodownincharge&type=pg&goid=%d&enddate=%s"%(int(request.params["goid"]),request.params["calculateto"]),headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["gkresult"],"proddesc":result.json()["proddesclist"]}

@view_config(route_name="dashboard", request_param="action=godowndesc", renderer="json")
def godowndesc(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=godowndesc",headers=header)
    return {"gkstatus":result.json()["gkstatus"],"goname":result.json()["goname"]}

@view_config(route_name="dashboard", request_param="action=transfernotecount", renderer="json")
def transfernotecountmonthly(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/dashboard?type=transfernotecountbymonth&goid=%d"%(int(request.params["goid"])),headers=header)
    return {"gkstatus":result.json()["gkstatus"],"innotecount":result.json()["innotecount"],"outnotecount":result.json()["outnotecount"]}

@view_config(route_name="showreport",renderer="gkwebapp:templates/showreport.jinja2")
def showreport(request):
    return {"status":True}
 
