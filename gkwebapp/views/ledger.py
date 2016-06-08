from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response


@view_config(route_name="showviewledger", renderer="gkwebapp:templates/viewledger.jinja2")
def showviewledger(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"gkresult":result.json()["gkresult"],"projects":projects.json()["gkresult"]}

@view_config(route_name="viewdualledger", renderer="gkwebapp:templates/viewdualledger.jinja2")
def showviewdualledger(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"gkresult":result.json()["gkresult"],"projects":projects.json()["gkresult"]}



@view_config(route_name="showledgerreport")
def showledgerreport(request):
	accountcode = int(request.params["accountcode"])
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	backflag = request.params["backflag"]
	monthlyflag = request.params["monthlyflag"]
	if request.params["narrationflag"]=="true":
		narrationflag = True
	else:
		narrationflag = False
	projectcode = request.params["projectcode"]
	ledgerrefresh = {"accountcode":accountcode,"calculatefrom":calculatefrom,"calculateto":calculateto,"financialstart":financialstart,"monthlyflag":monthlyflag,"backflag":int(backflag),"projectcode":projectcode,"narrationflag":request.params["narrationflag"]}
	header={"gktoken":request.headers["gktoken"]}
	if monthlyflag=="true":
		result = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode), headers=header)
		return render_to_response("gkwebapp:templates/monthledger.jinja2",{"records":result.json()["gkresult"],"accountcode":result.json()["accountcode"],"accountname":result.json()["accountname"] },request=request)
	else:
		if projectcode=="":
			result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode,calculatefrom,calculateto,financialstart), headers=header)
		else:
			result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode,calculatefrom,calculateto,financialstart,int(projectcode)), headers=header)
			ledgerrefresh["projectname"] = result.json()["ledgerheader"]["projectname"]
		return render_to_response("gkwebapp:templates/ledgerreport.jinja2",{"records":result.json()["gkresult"],"narrationflag":narrationflag,"userrole":result.json()["userrole"],"ledgerrefresh":ledgerrefresh,"ledgerheader":result.json()["ledgerheader"] },request=request)



@view_config(route_name="showdualledgerreport")
def showdualledgerreport(request):
	result1=None
	result2=None
	accountcode1 = int(request.params["accountcode1"])
	calculatefrom1 = request.params["calculatefrom1"]
	calculateto1 = request.params["calculateto1"]
	financialstart = request.params["financialstart"]
	backflag = request.params["backflag"]
	monthlyflag1 = request.params["monthlyflag1"]
	if request.params["narrationflag1"]=="true":
		narrationflag1 = True
	else:
		narrationflag1 = False
	projectcode1 = request.params["projectcode1"]
	ledgerrefresh1 = {"accountcode":accountcode1,"calculatefrom":calculatefrom1,"calculateto":calculateto1,"financialstart":financialstart,"monthlyflag":monthlyflag1,"backflag":int(backflag),"projectcode":projectcode1,"narrationflag":request.params["narrationflag1"]}
	header={"gktoken":request.headers["gktoken"]}
	if monthlyflag1=="true":
		result1 = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode1), headers=header)
		return render_to_response("gkwebapp:templates/monthledger.jinja2",{"records":result.json()["gkresult"],"accountcode":result.json()["accountcode"],"accountname":result.json()["accountname"] },request=request)
	else:
		if projectcode1=="":
			result1 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode1,calculatefrom1,calculateto1,financialstart), headers=header)
		else:
			result1 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode1,calculatefrom1,calculateto1,financialstart,int(projectcode1)), headers=header)
			ledgerrefresh1["projectname"] = result1.json()["ledgerheader"]["projectname"]
	accountcode2 = int(request.params["accountcode2"])
	calculatefrom2 = request.params["calculatefrom2"]
	calculateto2 = request.params["calculateto2"]
	monthlyflag2 = request.params["monthlyflag2"]
	if request.params["narrationflag2"]=="true":
		narrationflag2 = True
	else:
		narrationflag2 = False
	projectcode2 = request.params["projectcode2"]
	ledgerrefresh2 = {"accountcode":accountcode2,"calculatefrom":calculatefrom2,"calculateto":calculateto2,"financialstart":financialstart,"monthlyflag":monthlyflag2,"backflag":int(backflag),"projectcode":projectcode2,"narrationflag":request.params["narrationflag2"]}

	if monthlyflag2=="true":
		result2 = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode2), headers=header)
		return render_to_response("gkwebapp:templates/monthledger.jinja2",{"records":result.json()["gkresult"],"accountcode":result.json()["accountcode"],"accountname":result.json()["accountname"] },request=request)
	else:
		if projectcode2=="":
			result2 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode2,calculatefrom2,calculateto2,financialstart), headers=header)
		else:
			result2 = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode2,calculatefrom2,calculateto2,financialstart,int(projectcode2)), headers=header)
			ledgerrefresh2["projectname"] = result2.json()["ledgerheader"]["projectname"]
		return render_to_response("gkwebapp:templates/dualledgerreport.jinja2",{"records1":result1.json()["gkresult"],"records2":result2.json()["gkresult"],"narrationflag1":narrationflag1,"narrationflag2":narrationflag2,"userrole":result1.json()["userrole"],"ledgerrefresh1":ledgerrefresh1,"ledgerrefresh2":ledgerrefresh2,"ledgerheader1":result1.json()["ledgerheader"],"ledgerheader2":result2.json()["ledgerheader"] },request=request)
