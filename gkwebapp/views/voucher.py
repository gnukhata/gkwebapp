from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showvoucher")
def showvoucher(request):
    type= request.params["type"]
    header={"gktoken":request.headers["gktoken"]}
    if type=="contra" or type=="journal":
        result = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s"%(type), headers=header)
        if result.json()["gkstatus"]==0:
            return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"draccounts":result.json()["gkresult"],"craccounts":result.json()["gkresult"],"vtype":type},request=request)
        else:
            return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)
    else:
        drresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Dr"%(type), headers=header)
        crresult = requests.get("http://127.0.0.1:6543/accountsbyrule?type=%s&side=Cr"%(type), headers=header)
        if drresult.json()["gkstatus"]==0 and crresult.json()["gkstatus"]==0:
            return render_to_response("gkwebapp:templates/addvoucher.jinja2",{"draccounts":drresult.json()["gkresult"],"craccounts":crresult.json()["gkresult"],"vtype":type},request=request)
        else:
            return render_to_response("gkwebapp:templates/index.jinja2",{"status":"Please select an organisation and login again"},request=request)

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
    for row in rowdetails:
        if row["side"]=="Cr":
            crs[row["accountcode"]]=row["cramount"]
        if row["side"]=="Dr":
            drs[row["accountcode"]]=row["dramount"]
    header={"gktoken":request.headers["gktoken"]}
    gkdata={"vouchernumber":vdetails["vno"],"voucherdate":vdetails["vdate"],"narration":vdetails["narration"],"drs":drs,"crs":crs,"vouchertype":vdetails["vtype"],"projectcode":int(vdetails["projectcode"])}
    result = requests.post("http://127.0.0.1:6543/transaction",data=json.dumps(gkdata) , headers=header)
    if result.json()["gkstatus"]==0:
        return {"gkstatus":True}
    else:
        return {"gkstatus":False}
