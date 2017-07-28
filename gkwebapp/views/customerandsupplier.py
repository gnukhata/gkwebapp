
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
"Arun Kelkar" <arunkelkar@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Sachin Patil" <sachpatil@openmailbox.org>
'Prajkta Patkar'<prajkta@dff.org.in>
"""

from pyramid.view import view_config
import requests, json

@view_config(route_name="customersuppliers",renderer="gkwebapp:templates/customersupplier.jinja2")
def showcustomersupplier(request):
    return {"status":True}

@view_config(route_name="customersuppliers",request_param="action=showadd",renderer="gkwebapp:templates/addcustomersupplier.jinja2")
def showaddcustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
    suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
    groups = requests.get("http://127.0.0.1:6543/groupsubgroups?groupflatlist", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    debtgroupcode = groups.json()["gkresult"]["Sundry Debtors"]
    credgroupcode = groups.json()["gkresult"]["Sundry Creditors for Purchase"]
    return {"customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"], "debtgroupcode":debtgroupcode, "credgroupcode":credgroupcode, "states":states.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=showaddpopup",renderer="gkwebapp:templates/createcustsuppopup.jinja2")
def showaddcustomersupplierpopup(request):
    header={"gktoken":request.headers["gktoken"]}

    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
    suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
    groups = requests.get("http://127.0.0.1:6543/groupsubgroups?groupflatlist", headers=header)
    debtgroupcode = groups.json()["gkresult"]["Sundry Debtors"]
    credgroupcode = groups.json()["gkresult"]["Sundry Creditors for Purchase"]
    return {"gkstatus" : request.params["status"], "customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"], "debtgroupcode":debtgroupcode, "credgroupcode":credgroupcode}

@view_config(route_name="customersuppliers",request_param="action=showedit",renderer="gkwebapp:templates/editcustomersupplier.jinja2")
def showeditcustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
    suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
    return {"customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=get",renderer="json")
def getcustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(request.params["custid"])), headers=header)
    return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=save",renderer="json")
def savecustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    dataset={"custname":request.params["custname"],"custaddr":request.params["custaddr"],"custphone":request.params["custphone"],"custemail":request.params["custemail"],"custfax":request.params["custfax"],"state":request.params["state"],"custpan":request.params["custpan"],"custtan":request.params["custtan"],"gstin":json.loads(request.params["gstin"]),"csflag":int(request.params["csflag"])}
    result=requests.post("http://127.0.0.1:6543/customersupplier",data=json.dumps(dataset),headers=header)
    if result.json()["gkstatus"] == 0:
        if dataset["csflag"] == 3:
            gkdata = {"activity":dataset["custname"] + " customer created"}
        else:
            gkdata = {"activity":dataset["custname"] + " supplier created"}
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus": result.json()["gkstatus"]}


@view_config(route_name="customersuppliers",request_param="action=edit",renderer="json")
def editcustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    dataset={"custname":request.params["custname"],"custaddr":request.params["custaddr"],"custphone":request.params["custphone"],"custemail":request.params["custemail"],"custfax":request.params["custfax"],"custpan":request.params["custpan"],"state":request.params["state"],"custtan":request.params["custtan"],"gstin":request.params["gstin"],"custid":int(request.params["custid"])}
    result=requests.put("http://127.0.0.1:6543/customersupplier",data=json.dumps(dataset),headers=header)
    if result.json()["gkstatus"] == 0:
        accs = requests.get("http://127.0.0.1:6543/accounts", headers=header)
        for acc in accs.json()["gkresult"]:
            if acc["accountname"] == request.params["oldcustname"]:
                gkdata = {"accountname":request.params["custname"],"openingbal":acc["openingbal"],"accountcode":acc["accountcode"]}
                resulteditacc = requests.put("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
                break
    return {"gkstatus": result.json()["gkstatus"],"custsup":request.params["custsup"]}

@view_config(route_name="customersuppliers", request_param="action=delete",renderer="json")
def deletecustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%(int(request.params["custid"])), headers=header)
    custname = result.json()["gkresult"]["custname"]
    custdetails = {"csflag": result.json()["gkresult"]["csflag"], "custname":result.json()["gkresult"]["custname"]}
    dataset={"custid":int(request.params["custid"])}
    result = requests.delete("http://127.0.0.1:6543/customersupplier",data =json.dumps(dataset), headers=header)
    if result.json()["gkstatus"] == 0:
        accs = requests.get("http://127.0.0.1:6543/accounts", headers=header)
        for acc in accs.json()["gkresult"]:
            if acc["accountname"] == custname:
                gkdata={"accountcode":acc["accountcode"]}
                result = requests.delete("http://127.0.0.1:6543/accounts",data =json.dumps(gkdata), headers=header)
                break
        gkdata = {"activity":custname + " account deleted"}
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
        if custdetails["csflag"] == 3:
                  gkdata = {"activity":custdetails["custname"] + " customer deleted"}
        else:
            gkdata = {"activity":custdetails["custname"] + " supplier deleted"}
        resultlog = requests.post("http://127.0.0.1:6543/log", data =json.dumps(gkdata),headers=header)
    return {"gkstatus":result.json()["gkstatus"],"csflag":custdetails["csflag"]}

@view_config(route_name='customersuppliers', request_param='action=getallcusts',renderer ='json')
def getallcusts(request):
    header={"gktoken":request.headers["gktoken"]}
    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall",headers=header)
    return {"customers":customers.json()["gkresult"]}

@view_config(route_name='customersuppliers', request_param='action=getallsups',renderer ='json')
def getallsups(request):
    header={"gktoken":request.headers["gktoken"]}
    suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall",headers=header)
    return {"customers":suppliers.json()["gkresult"]}
