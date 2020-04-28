
"""
Copyright (C) 2013, 2014, 2015, 2016, 2017 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from PIL import Image
import base64
import io


@view_config(route_name="showvoucher")
def showvoucher(request):
    type = request.params["type"]
    header = {"gktoken": request.headers["gktoken"]}

    # if mode is set to automatic then user friendly API should be shown for
    # payment and receipt
    if request.params.get("modeflag") == "1" and type in ["receipt", "payment"]:
        accounts = []
        groups = requests.get("http://127.0.0.1:6543/groupsubgroups?groupflatlist", headers=header).json()
        cust_grpcode = groups["gkresult"]["Sundry Debtors"]
        cust_result = requests.get("http://127.0.0.1:6543/accounts?accbygrp&groupcode=%d"%(int(cust_grpcode)),headers=header).json()
        if cust_result["gkstatus"] == 0:
            accounts = cust_result["gkresult"]
        sup_grpcode = groups["gkresult"]["Sundry Creditors for Purchase"]
        sup_result = requests.get("http://127.0.0.1:6543/accounts?accbygrp&groupcode=%d"%(int(sup_grpcode)),headers=header).json()
        if sup_result["gkstatus"] == 0:
            accounts.extend(sup_result["gkresult"])

        flags = dict()
        flags["invflag"] = request.params.get("invflag")
        flags["invsflag"] = request.params.get("invsflag")
        flags["billflag"] = request.params.get("billflag")
    
        resultauto = requests.get("http://127.0.0.1:6543/transaction?details=last&type=%s"%(type), headers=header)
        lastdetailsauto = resultauto.json()["gkresult"]
        if(lastdetailsauto["narration"] != ""):
            lastdetailsauto["narration"] = lastdetailsauto["narration"]
        else:
            lastdetailsauto["narration"]=""
        if(lastdetailsauto["vno"] != ""):
            lastdetailsauto["vno"] = lastdetailsauto["vno"]
        else:
            lastdetailsauto["vno"] = 1
            vdate = str(request.params["financialstart"])
            lastdetailsauto["vdate"] = vdate[8:] + "-" + vdate[5:7] + "-" + vdate[0:4]

        if cust_result["gkstatus"] == 0 and sup_result["gkstatus"] == 0:
            if int(flags["invflag"]) == 1:
                invdata = requests.get("http://127.0.0.1:6543/billwise?type=all", headers=header)
                if invdata.json()["gkstatus"]==0:
                    return render_to_response("gkwebapp:templates/addvoucherauto.jinja2",{"vtype":type,"accounts":accounts,"flags":flags,"invoicedata":invdata.json()["invoices"],"invoicecount":len(invdata.json()["invoices"]),"lastdetails":lastdetailsauto},request=request)
            else:
                return render_to_response("gkwebapp:templates/addvoucherauto.jinja2",{"vtype":type,"accounts":accounts,"flags":flags, "invoicedata":0,"invoicecount":0,"lastdetails":lastdetailsauto},request=request)

    invflag= int(request.params["invflag"])
    result = requests.get("http://127.0.0.1:6543/transaction?details=last&type=%s"%(type), headers=header)
    lastdetails = result.json()["gkresult"]
    if(lastdetails["narration"] != ""):
        lastdetails["narration"] = lastdetails["narration"]
    else:
        lastdetails["narration"]=""

    if(lastdetails["vno"] != ""):
        lastdetails["vno"] = lastdetails["vno"]
    else:
        lastdetails["vno"] = 1
        vdate = str(request.params["financialstart"])
        lastdetails["vdate"] = vdate[8:] + "-" + vdate[5:7] + "-" + vdate[0:4]
    if type=="contra" or type=="journal":
        result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
        projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
        if result.json()["gkstatus"]==0:
            return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"lastdetails":lastdetails,"draccounts":result.json()["gkresult"],"craccounts":result.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type,"invoicedata":0},request=request)
    elif type=="creditnote" or type=="debitnote" or type=="salesreturn" or type=="purchasereturn":
        result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=journal", headers=header)
        projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
        if result.json()["gkstatus"]==0:
            return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"lastdetails":lastdetails,"draccounts":result.json()["gkresult"],"craccounts":result.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type,"invoicedata":0},request=request)
    else:
        drresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Dr"%(type), headers=header)
        crresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Cr"%(type), headers=header)
        projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
        if drresult.json()["gkstatus"]==0 and crresult.json()["gkstatus"]==0:
            if invflag == 1 and (type =="purchase" or type =="sales"):
                invdata = requests.get("http://127.0.0.1:6543/invoice?forvoucher", headers=header)
                if invdata.json()["gkstatus"]==0:
                    return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"lastdetails":lastdetails,"draccounts":drresult.json()["gkresult"],"craccounts":crresult.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type,"invoicedata":invdata.json()["gkresult"],"invoicecount":len(invdata.json()["gkresult"])},request=request)
            elif invflag == 1 and (type =="payment" or type =="receipt"):
                invdata = requests.get("http://127.0.0.1:6543/billwise?type=all", headers=header)
                if invdata.json()["gkstatus"]==0:
                    return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"lastdetails":lastdetails,"draccounts":drresult.json()["gkresult"],"craccounts":crresult.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type,"invoicedata":invdata.json()["invoices"],"invoicecount":len(invdata.json()["invoices"])},request=request)
            else:
                return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"lastdetails":lastdetails,"draccounts":drresult.json()["gkresult"],"craccounts":crresult.json()["gkresult"],"projects":projects.json()["gkresult"],"vtype":type,"invoicedata":0},request=request)

@view_config(route_name="getcjaccounts", renderer="json")
def cjaccounts(request):
    type= request.params["type"]
    header={"gktoken":request.headers["gktoken"]}
    if type=="contra" or type=="journal":
        result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
        if result.json()["gkstatus"]==0:
            return {"accounts":result.json()["gkresult"]}
        else:
            return {"accounts":False}
    elif type=="creditnote" or type=="debitnote" or type=="salesreturn" or type=="purchasereturn":
        result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=journal", headers=header)
        if result.json()["gkstatus"]==0:
            return {"accounts":result.json()["gkresult"]}
        else:
            return {"accounts":False}
    else:
        side= request.params["side"]
        result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=%s"%(type,side), headers=header)
        if result.json()["gkstatus"]==0:
            return {"accounts":result.json()["gkresult"]}
        else:
            return {"accounts":False}

@view_config(route_name="addvoucher", renderer="json")
def addvoucher(request):
    vdetails = json.loads(request.params["vdetails"])
    rowdetails= json.loads(request.params["transactions"])
    crs={}
    drs={}
    if "vno" in vdetails:
        if vdetails["projectcode"] !="":
            gkdata={"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"],"projectcode":int(vdetails["projectcode"])}
        else:
            gkdata={"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"]}
        if vdetails["vtype"] == "purchase" or vdetails["vtype"] == "sales" or vdetails["vtype"] == "payment" or vdetails["vtype"] == "receipt":
            if vdetails["invid"] != "":
                gkdata["invid"] = vdetails["invid"]

            else:
                gkdata["invid"] = None
    else:
        if vdetails["projectcode"] !="":
            gkdata={"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"],"projectcode":int(vdetails["projectcode"])}
        else:
            gkdata={"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"]}
        if vdetails["vtype"] == "purchase" or vdetails["vtype"] == "sales" or vdetails["vtype"] == "payment" or vdetails["vtype"] == "receipt":
            if vdetails["invid"] != "":
                gkdata["invid"] = vdetails["invid"]
            else:
                gkdata["invid"] = None
    if vdetails["instrumentno"] !="":
        gkdata["instrumentno"]=vdetails["instrumentno"]
        gkdata["bankname"]=vdetails["bankname"]
        gkdata["branchname"]=vdetails["branchname"]
        gkdata["instrumentdate"] = vdetails["instrumentdate"]

    try:
        files = {}
        count = 0
        for i in list(request.POST.keys()):
            if "file" not in i:
                continue
            else:
                img = request.POST[i].file
                image = Image.open(img)
                imgbuffer = io.BytesIO()
                image.save(imgbuffer, format="JPEG")
                img_str = base64.b64encode(imgbuffer.getvalue())
                img_str = img_str.decode("ascii")
                image.close()
                files[count] = img_str
                count += 1
        if len(files)>0:
            gkdata["attachment"] = files
            gkdata["attachmentcount"] = len(gkdata["attachment"])
    except:
        print("no attachment found")
    for row in rowdetails:
        if row["side"]=="Cr":
            crs[row["accountcode"]]=row["cramount"]
        if row["side"]=="Dr":
            drs[row["accountcode"]]=row["dramount"]
    header={"gktoken":request.headers["gktoken"]}
    result = requests.post("http://127.0.0.1:6543/transaction",data=json.dumps(gkdata) , headers=header)
    if result.json()["gkstatus"]==0:
        '''
        When a transaction is successful it is checked if there are any bill adjustments to be made.
        This happens in the case of Receipt/Payment vouchers.
        Voucher code returned by core engine is added to details of adjustments and billwise API is called.
        '''
        if 'billdetails' in request.params:
            payment = json.loads(request.params["billdetails"])
            payment["vouchercode"] = result.json()["vouchercode"]
            payments = []
            payments.append(payment)
            billdata = {"adjbills":payments}
            paymentupdate = requests.post("http://127.0.0.1:6543/billwise",data=json.dumps(billdata),headers = header)
            if paymentupdate.json()["gkstatus"] == 0:
                return {"gkstatus":True,"vouchercode":result.json()["vouchercode"],"vouchernumber":result.json()["vouchernumber"], "paymentstatus":True, "billdetails":{"amount":payment["adjamount"], "invoice":request.params["invoice"]}}
            else:
                return {"gkstatus":True,"vouchercode":result.json()["vouchercode"],"vouchernumber":result.json()["vouchernumber"], "paymentstatus":False}
        return {"gkstatus":True,"vouchercode":result.json()["vouchercode"],"vouchernumber":result.json()["vouchernumber"], "paymentstatus":False}
    else:
        return {"gkstatus":False}

@view_config(route_name="addvoucherauto", renderer="json")
def addvoucherauto(request):
    header = {"gktoken": request.headers["gktoken"]}

    data = dict()
    data["vdetails"] = dict()
    data["transactions"] = dict()

    data["vdetails"]["vouchertype"] = request.params["vtype"]
    data["vdetails"]["voucherdate"] = request.params["date"]
    data["vdetails"]["narration"] = request.params["narration"]
    data["transactions"]["party"] = request.params["party"]
    data["transactions"]["payment_mode"] = request.params["payment_mode"]

    if data["transactions"]["payment_mode"] in ["both", "bank"]:
        data["transactions"]["bamount"] = request.params["bamount"]
    if data["transactions"]["payment_mode"] in ["both", "cash"]:
        data["transactions"]["camount"] = request.params["camount"]
    if "invid" in request.params:
        data["vdetails"]["invid"] = request.params["invid"]
    
   # try:
    files = {}
    count = 0
    for i in list(request.POST.keys()):
        if "file" not in i:
            continue
        else:
            img = request.POST[i].file
            image = Image.open(img)
            imgbuffer = io.BytesIO()
            image.save(imgbuffer, format="JPEG")
            img_str = base64.b64encode(imgbuffer.getvalue())
            img_str = img_str.decode("ascii")
            image.close()
            files[count] = img_str
            count += 1
    if len(files) > 0:
        data["vdetails"]["attachment"] = files
        data["vdetails"]["attachmentcount"] = len(data["vdetails"]["attachment"])
   # except:
   #     print("no attachment found")

    result = requests.post("http://127.0.0.1:6543/transaction?mode=auto",data=json.dumps(data),headers=header)
    if result.json()["gkstatus"] == 0:
        if 'billdetails' in request.params:
            payment = json.loads(request.params["billdetails"])
            payment["vouchercode"] = result.json()["vouchercode"]
            payments = []
            payments.append(payment)
            billdata = {"adjbills":payments}
            paymentupdate = requests.post("http://127.0.0.1:6543/billwise",data=json.dumps(billdata),headers = header)
            if paymentupdate.json()["gkstatus"] == 0:
                return {"gkstatus":True,"vouchercode":result.json()["vouchercode"], "paymentstatus":True, "billdetails":{"amount":payment["adjamount"], "invoice":request.params["invoice"]}}
            else:
                return {"gkstatus":True,"vouchercode":result.json()["vouchercode"],"paymentstatus":False}
        return {"gkstatus": True}
    else:
        return {"gkstatus": False}

@view_config(route_name="accountpopup", renderer="gkwebapp:templates/createaccountpopup.jinja2")
def accountpopup(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
    grpdata=[]
    for record in result.json()["gkresult"]:
        gdata= {"groupname":str(record["groupname"]),"groupcode":str(record["groupcode"])}
        grpdata.append(gdata)
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    states = requests.get("http://127.0.0.1:6543/state", headers=header)
    return {"gkresult":grpdata,"baltbl":result.json()["baltbl"],"vatorgstflag":resultgstvat.json()["gkresult"],"states": states.json()["gkresult"]}

@view_config(route_name="showdeletedvoucher", renderer="gkwebapp:templates/deletedvoucher.jinja2")
def showdeletedvoucher(request):
    header={"gktoken":request.headers["gktoken"]}
    if "orderflag" in request.params:
        result = requests.get("http://127.0.0.1:6543/report?type=deletedvoucher&orderflag=%d"%(int(request.params["orderflag"])), headers=header)
        orderflag = "1"
    else:
        result = requests.get("http://127.0.0.1:6543/report?type=deletedvoucher", headers=header)
        orderflag = "4"
    return {"gkresult":result.json()["gkresult"],"orderflag":orderflag}

@view_config(route_name="getattachment", renderer="gkwebapp:templates/viewimages.jinja2")
def getattachment(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/transaction?attach=image&vouchercode=%d"%(int(request.params["vouchercode"])), headers=header)
    return {"attachment":result.json()["gkresult"],"vno":request.params["vno"],"vtype":request.params["vtype"],"lockflag":result.json()["lockflag"],"userrole":result.json()["userrole"],"vouchercode":request.params["vouchercode"]}

@view_config(route_name="updateattachment", renderer="gkwebapp:templates/viewimages.jinja2")
def updateattachment(request):
    header={"gktoken":request.headers["gktoken"]}
    deletedids = request.params["deletedids"]
    result = requests.get("http://127.0.0.1:6543/transaction?attach=image&vouchercode=%d"%(int(request.params["vouchercode"])), headers=header)
    docs = result.json()["gkresult"]
    a = [i.encode('UTF8') for i in deletedids.split(',')]
    if len(deletedids)>0:
        for val in a:
            docs.pop(val)
    if len(docs)>0:
        count = int(max(docs, key=int))+1
    else:
        count = 0
    try:
        for i in list(request.POST.keys()):
            if "file" not in i:
                continue
            else:
                img = request.POST[i].file
                image = Image.open(img)
                imgbuffer = io.BytesIO()
                image.save(imgbuffer, format="JPEG")
                img_str = base64.b64encode(imgbuffer.getvalue())
                img_str = img_str.decode("ascii")
                image.close()
                docs[count] = img_str
                count += 1
    except:
        print("No attachment found")
    if len(docs)>0:
        gkdata = {"attachment":docs,"attachmentcount":len(docs),"vouchercode":request.params["vouchercode"]}
    else:
        gkdata = {"attachment":None,"attachmentcount":0,"vouchercode":request.params["vouchercode"]}
    result1 = requests.put("http://127.0.0.1:6543/transaction",data=json.dumps(gkdata) , headers=header)
    return {"attachment":docs,"vouchercode":request.params["vouchercode"],"vno":request.params["vno"],"lockflag":result.json()["lockflag"],"vtype":request.params["vtype"],"userrole":result.json()["userrole"]}

@view_config(route_name="showvoucher", request_param = "type=getclosingbal", renderer="json")
def getClosingBal(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/report?type=closingbalance&accountcode=%d&financialstart=%s&calculateto=%s"%(int(request.params["accountcode"]), request.params["financialstart"], request.params["calculateto"]), headers=header)
    if result.json()["gkstatus"] == 0:
        return {"gkstatus":result.json()["gkstatus"], "gkresult":result.json()["gkresult"]}
    else:
        return {"gkstatus":result.json()["gkstatus"]}
