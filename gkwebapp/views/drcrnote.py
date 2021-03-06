from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
from PIL import Image
import base64
import io
import os

@view_config(route_name="drcrnote",renderer="gkwebapp:templates/drcrnote.jinja2")
def showdrcrnote(request):
    return {"status":True}
#it will gives sale and purchase invoice on the basis of drcrflag status. and also gives tax type 
@view_config(route_name="drcrnote",request_param="action=add",renderer="gkwebapp:templates/adddrcrnote.jinja2")
def showadddrcrnote(request):
    header={"gktoken":request.headers["gktoken"]}
    invoicesS = requests.get("http://127.0.0.1:6543/drcrnote?inv=all&type=sale&drcrflag=%d"%(int(request.params["drcrflag"])), headers=header)
    invoicesP = requests.get("http://127.0.0.1:6543/drcrnote?inv=all&type=purchase&drcrflag=%d"%(int(request.params["drcrflag"])), headers=header)
    #it gives tax type VAT or GST on the basis of financialEnd Year of organisation     
    resultgstvat = requests.get("http://127.0.0.1:6543/products?tax=vatorgst",headers=header)
    return {"lastdrcrno":invoicesS.json()["lastdrcrno"],"drcrflag": request.params["drcrflag"],"invoicesS":invoicesS.json()["gkresult"],"invoicesP":invoicesP.json()["gkresult"],"resultgstvat":resultgstvat.json()["gkresult"]}
'''  this is for storing drcrnote details '''
@view_config(route_name="drcrnote",request_param="action=save",renderer="json")
def savedrcrnote(request):
    header={"gktoken":request.headers["gktoken"]}
    drcrdata = {"invid":request.params["invid"],"drcrdate":request.params["drcrdate"],"drcrno":request.params["drcrno"],"totreduct":request.params["totreduct"],"dctypeflag":request.params["dctypeflag"],"reductionval":json.loads(request.params["reductionval"]), "drcrmode":request.params["drcrmode"],"dcinvtnflag":request.params["dcinvtnflag"], }
    if ("drcr_narration" in request.params):
        s = str(request.params["drcr_narration"]).isspace()
        if (s == False):
            drcrdata["drcrnarration"] = request.params["drcr_narration"]
    drcrdata["roundoffflag"] = int(request.params["roundoffflag"])
    if "reference" in request.params:
        drcrdata["reference"]=json.loads(request.params["reference"])
    if "usr" in request.params:
        drcrdata["userid"]=request.params["usr"]

    wholedataset = {}
    wholedataset["dataset"] = drcrdata
    wholedataset["vdataset"] = json.loads(request.params["vdetails"])
    result=requests.post("http://127.0.0.1:6543/drcrnote",data=json.dumps(wholedataset),headers=header)
    if "vchCode" in result.json():
        return {"gkstatus":result.json()["gkstatus"], "vchCode":result.json()["vchCode"]}
    return {"gkstatus":result.json()["gkstatus"]}
    
''' this is for single view i=of drcrnote after saving data '''
@view_config(route_name="drcrnote",request_param="action=showdrcrnote",renderer="gkwebapp:templates/viewdrcrnote.jinja2")
def showsingledrcrnote(request):
    header={"gktoken":request.headers["gktoken"]}
    if int(request.params["drcrflag"]) == 3:
         drcrdata = requests.get("http://127.0.0.1:6543/drcrnote?drcr=all&drcrflag=3", headers=header)
    if int(request.params["drcrflag"]) == 4:
        drcrdata = requests.get("http://127.0.0.1:6543/drcrnote?drcr=all&drcrflag=4", headers=header)
    return {"gkstatus":drcrdata.json()["gkstatus"],"drcrdata":drcrdata.json()["gkresult"],"status":request.params["drcrflag"], "drcrdatalength":len(drcrdata.json()["gkresult"])}

@view_config(route_name="drcrnote",request_param="action=getdrcrnotedetail", renderer="gkwebapp:templates/viewsingledrcrnote.jinja2")
def getDrCrDetails(request):
    header={"gktoken":request.headers["gktoken"]}
    drcrnotedata = requests.get("http://127.0.0.1:6543/drcrnote?drcr=single&drcrid=%d"%(int(request.params["drcrid"])),headers=header)
    if drcrnotedata.json()["gkstatus"] == 0:
         return {"gkstatus": drcrnotedata.json()["gkstatus"],"gkresult":drcrnotedata.json()["gkresult"]}

@view_config(route_name="drcrnote",request_param="action=print",renderer="gkwebapp:templates/printdrcrnote.jinja2")
def drcrNoteprint(request):
    header={"gktoken":request.headers["gktoken"]}
    orgdata = requests.get("http://127.0.0.1:6543/organisation", headers=header)
    drcrdata = requests.get("http://127.0.0.1:6543/drcrnote?drcr=single&drcrid=%d"%(int(request.params["drcrid"])),headers=header)
    return {"gkstatus":orgdata.json()["gkstatus"],"org":orgdata.json()["gkdata"],"gkresult":drcrdata.json()["gkresult"]}
