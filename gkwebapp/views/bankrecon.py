from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showviewbankrecon", renderer="gkwebapp:templates/viewbankrecon.jinja2")
def showviewbankrecon(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/bankrecon", headers=header)
	return {"gkresult":result.json()["gkresult"]}

@view_config(route_name="showunclearedbankrecon")
def showunclearedbankrecon(request):
	accountcode = int(request.params["accountcode"])
	accountname = request.params["accountname"]
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	if request.params["narrationflag"]=="true":
		narrationflag = True
	else:
		narrationflag = False
	ledgerheader = {"accountcode":accountcode,"calculatefrom":datetime.strftime(datetime.strptime(str(calculatefrom),"%Y-%m-%d").date(),'%d-%m-%Y'),"calculateto":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y'),"accountname":accountname, "narrationflag":request.params["narrationflag"]}
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/bankrecon?recon=uncleared&accountcode=%d&calculatefrom=%s&calculateto=%s"%(accountcode,calculatefrom,calculateto), headers=header)
	return render_to_response("gkwebapp:templates/bankreconreport.jinja2",{"recongrid":result.json()["gkresult"]["recongrid"],"reconstmt":result.json()["gkresult"]["reconstatement"],"ledgerheader":ledgerheader,"narrationflag":narrationflag},request=request)

@view_config(route_name="showclearedbankrecon")
def showclearedbankrecon(request):
	accountcode = int(request.params["accountcode"])
	accountname = request.params["accountname"]
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	if request.params["narrationflag"]=="true":
		narrationflag = True
	else:
		narrationflag = False
	ledgerheader = {"accountcode":accountcode,"calculatefrom":datetime.strftime(datetime.strptime(str(calculatefrom),"%Y-%m-%d").date(),'%d-%m-%Y'),"calculateto":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y'),"accountname":accountname, "narrationflag":request.params["narrationflag"]}
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/bankrecon?recon=cleared&accountcode=%d&calculatefrom=%s&calculateto=%s"%(accountcode,calculatefrom,calculateto), headers=header)
	return render_to_response("gkwebapp:templates/clearedbankreconreport.jinja2",{"recongrid":result.json()["gkresult"]["recongrid"],"reconstmt":result.json()["gkresult"]["reconstatement"],"ledgerheader":ledgerheader,"narrationflag":narrationflag},request=request)


@view_config(route_name="updaterecon")
def updaterecon(request):
	if request.params["clearancedate"]=="":
		clearancedate=None
	else:
		clearancedate = request.params["clearancedate"]
	gkdata = {"accountcode":int(request.params["accountcode"]),"reconcode":int(request.params["reconcode"]),"memo":str(request.params["memo"]),"clearancedate":clearancedate,"calculatefrom":request.params["calculatefrom"],"calculateto":request.params["calculateto"]}
	header={"gktoken":request.headers["gktoken"]}
	result = requests.put("http://127.0.0.1:6543/bankrecon",data =json.dumps(gkdata), headers=header)
	return render_to_response("gkwebapp:templates/reconstatement.jinja2",{"reconstmt":result.json()["gkresult"]["reconstatement"]},request=request)
