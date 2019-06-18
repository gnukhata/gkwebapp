
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
"Arun Kelkar" <arunkelkar@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Sachin Patil" <sachpatil@openmailbox.org>
'Prajkta Patkar'<prajkta@dff.org.in>
"""

from pyramid.view import view_config
import requests, json
from openpyxl import load_workbook
from openpyxl import Workbook

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
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    debtgroupcode = groups.json()["gkresult"]["Sundry Debtors"]
    credgroupcode = groups.json()["gkresult"]["Sundry Creditors for Purchase"]
    return {"customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"], "debtgroupcode":debtgroupcode, "credgroupcode":credgroupcode, "states":states.json()["gkresult"],"vatorgstflag":resultgstvat.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=showaddpopup",renderer="gkwebapp:templates/createcustsuppopup.jinja2")
def showaddcustomersupplierpopup(request):
    header={"gktoken":request.headers["gktoken"]}

    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
    suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
    groups = requests.get("http://127.0.0.1:6543/groupsubgroups?groupflatlist", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    debtgroupcode = groups.json()["gkresult"]["Sundry Debtors"]
    credgroupcode = groups.json()["gkresult"]["Sundry Creditors for Purchase"]
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    return {"gkstatus" : request.params["status"], "customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"], "debtgroupcode":debtgroupcode, "credgroupcode":credgroupcode, "states":states.json()["gkresult"], "vatorgstflag":resultgstvat.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=showedit",renderer="gkwebapp:templates/editcustomersupplier.jinja2")
def showeditcustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
    suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    return {"customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"],"vatorgstflag":resultgstvat.json()["gkresult"] ,"states":states.json()["gkresult"],"noofcustomer" :len(customers.json()["gkresult"]),"noofsupplier":len(suppliers.json()["gkresult"])}

@view_config(route_name="customersuppliers",request_param="action=get",renderer="json")
def getcustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%int(request.params["custid"]),headers=header)
    
    return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}

@view_config(route_name="customersuppliers",request_param="action=save",renderer="json")
def savecustomersupplier(request):
    header={"gktoken":request.headers["gktoken"]}
    dataset={"custname":request.params["custname"],"custaddr":request.params["custaddr"],"custphone":request.params["custphone"],"custemail":request.params["custemail"],"custfax":request.params["custfax"],"state":request.params["state"],"custpan":request.params["custpan"],"custtan":request.params["custtan"],"csflag":int(request.params["csflag"]),"pincode":request.params["pincode"]}
    if request.params.has_key("bankdetails"): 
        dataset["bankdetails"]=json.loads(request.params["bankdetails"])
    if "gstin" in request.params:
        dataset["gstin"]=json.loads(request.params["gstin"])
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
    dataset={"custname":request.params["custname"],"custaddr":request.params["custaddr"],"custphone":request.params["custphone"],"custemail":request.params["custemail"],"custfax":request.params["custfax"],"custpan":request.params["custpan"],"state":request.params["state"],"custtan":request.params["custtan"],"custid":int(request.params["custid"]),"pincode":request.params["pincode"]}
    if request.params.has_key("bankdetails"):
        dataset["bankdetails"]=json.loads(request.params["bankdetails"])
    if request.params.has_key("gstin"):
        dataset["gstin"]=json.loads(request.params["gstin"])
    result=requests.put("http://127.0.0.1:6543/customersupplier",data=json.dumps(dataset),headers=header)
    if result.json()["gkstatus"] == 0:
        accs = requests.get("http://127.0.0.1:6543/accounts", headers=header)
        for acc in accs.json()["gkresult"]:
            if acc["accountname"] == request.params["oldcustname"]:
                updateacc = {"accountname":request.params["custname"],"openingbal":acc["openingbal"],"accountcode":acc["accountcode"]}
                resulteditacc = requests.put("http://127.0.0.1:6543/accounts", data =json.dumps(updateacc),headers=header)
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

@view_config(route_name='import',request_param='action=cussupimport',renderer='json')
def cussupimport(request):
    try:
        header={"gktoken":request.headers["gktoken"]}
        xlsxfile = request.POST['xlsxfile'].file
        wb=load_workbook(xlsxfile)
        ws=wb.sheetnames
        if(ws[0]=="Customers"):
            wb._active_sheet_index = 0
            cusSheet = wb.active
            cusList = tuple(cusSheet.rows)
            status_check=addcusts(cusList,header)
            if(status_check["gkstatus"]!=0):
                return status_check
            if(len(ws)==2):
                if(ws[1]=="Suppliers"):
                    wb._active_sheet_index = 1
                    supSheet = wb.active
                    supList = tuple(supSheet.rows)
                    status_check=addsups(supList,header)
            return status_check
        if(ws[0]=="Suppliers"):
            wb._active_sheet_index = 0
            supSheet = wb.active
            supList = tuple(supSheet.rows)
            status_check=addsups(supList,header)
            if(status_check["gkstatus"]!=0):
                return status_check
            if(len(ws)==2):
                if(ws[0]=="Customers"):
                    wb._active_sheet_index = 0
                    cusSheet = wb.active
                    cusList = tuple(cusSheet.rows)
                    status_check=addcusts(cusList,header)
            return status_check
    except Exception as e:
        print(e)
        return {"gkstatus":3}

def addcusts(cusList,header):
    try:
        row_no=0
        if(cusList[0][5].value.lower()=="state"):
            row_no=1
        while row_no < len(cusList):
            cusRow=cusList[row_no]
            row_no,gstin_dict=getGSTs(row_no,cusList)
            cusDict= {"custname":cusRow[0].value,"custphone":cusRow[1].value, "custemail":cusRow[2].value, "custaddr":cusRow[3].value, "pincode":cusRow[4].value, "state":cusRow[5].value, "custfax":cusRow[6].value, "custpan":cusRow[7].value, "gstin":gstin_dict, "csflag":3}
            result = requests.post("http://127.0.0.1:6543/customersupplier",data = json.dumps(cusDict),headers=header)
            result=result.json()
            if result["gkstatus"]!=0:
                return {"gkstatus":result["gkstatus"]}
        return {"gkstatus":0}
    except Exception as e:
        print(e)
        return {"gkstatus":3}

def addsups(supList,header):
    try:
        row_no=0
        if(supList[0][5].value.lower()=="state"):
            row_no=1
        while row_no < len(supList):
            supRow=supList[row_no]
            row_no,gstin_dict=getGSTs(row_no,supList)
            supDict={}
            if(supRow[9].value==None):
                supDict= {"custname":supRow[0].value,"custphone":supRow[1].value, "custemail":supRow[2].value, "custaddr":supRow[3].value, "pincode":supRow[4].value, "state":supRow[5].value, "custfax":supRow[6].value, "custpan":supRow[7].value, "gstin":gstin_dict, "csflag":19}
            else:
                bank_dict={"ifsc":supRow[12].value,"bankname":supRow[10].value,"accountno":supRow[9].value,"branchname":supRow[11].value}
                supDict= {"custname":supRow[0].value,"custphone":supRow[1].value, "custemail":supRow[2].value, "custaddr":supRow[3].value, "pincode":supRow[4].value, "state":supRow[5].value, "custfax":supRow[6].value, "custpan":supRow[7].value, "gstin":gstin_dict, "csflag":19, "bankdetails":bank_dict}
            result = requests.post("http://127.0.0.1:6543/customersupplier",data = json.dumps(supDict),headers=header)
            result=result.json()
            if result["gkstatus"]!=0:
                return {"gkstatus":result["gkstatus"]}
        return {"gkstatus":0}
    except Exception as e:
        print(e)
        return {"gkstatus":3}

def getGSTs(row_no,cussupList):
    gstin_dict={}
    if(cussupList[row_no][8].value!=None):
        while(True):
            gst_str=cussupList[row_no][8].value.encode('ascii','ignore')
            state_str=gst_str[:2]
            gstin_dict[state_str]=gst_str
            row_no+=1
            if(row_no==len(cussupList)):
                break
            if(cussupList[row_no][0].value!=None):
                break
    else:
        row_no+=1
    return row_no,gstin_dict
