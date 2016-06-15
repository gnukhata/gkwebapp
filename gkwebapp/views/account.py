
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.and old.stockflag = 's'

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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate
from reportlab.lib.units import mm, cm, inch
from reportlab.platypus.flowables import PageBreak, Spacer
from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from formula import CurrentPageColSum, PreviousPagesColSum, RowNumber
from spreadsheettable import SpreadsheetTable
from reportlab.pdfgen import canvas
from reportlab.lib.enums import  TA_LEFT, TA_CENTER
from reportlab.rl_config import defaultPageSize

@view_config(route_name="printlistofaccounts", renderer="")
def printlistofaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	gkresult = result.json()["gkresult"]
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styles = getSampleStyleSheet()
	doc = SimpleDocTemplate("listOfAccounts.pdf", pagesize=A4)
	style = styles["BodyText"]
	style.alignment = TA_CENTER
	stylenormal = styles["Normal"]
	stylenormal.alignment = TA_CENTER
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	def myFirstPage(canvas, doc):
		canvas.saveState()
		canvas.setFont('Times-Bold',18)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, orgname)
		canvas.setFont('Times-Bold',16)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, "List of Accounts" )
		canvas.setFont('Times-Bold',12)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-100, PAGE_WIDTH - 10, PAGE_HEIGHT-100)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.55 * inch, "Page1")
		canvas.restoreState()
	def myLaterPages(canvas, doc):
		canvas.saveState()
		canvas.setFont('Times-Bold',12)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-40, orgname)
		canvas.setFont('Times-Roman',10)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-60, "List of Accounts")
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-70, PAGE_WIDTH - 10, PAGE_HEIGHT-70)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.5 * inch, "Page %d" % doc.page)
		canvas.restoreState()
	# Headers
	srno = Paragraph('''<b>Sr.No.</b>''', stylenormal)
	accname = Paragraph('''<b>Account Name</b>''', stylenormal)
	grpname = Paragraph('''<b>Group Name</b>''', stylenormal)
	subgrpname = Paragraph('''<b>Sub-Group Name</b>''', stylenormal)
	data= [[srno, accname, grpname, subgrpname]]
	for record in  gkresult:
		srno = Paragraph(str(record["srno"]), style)
		accountname = Paragraph(str(record["accountname"]), style)
		groupname = Paragraph(str(record["groupname"]), style)
		subgroupname = Paragraph(str(record["subgroupname"]), style)
		data.append([srno, accountname, groupname, subgroupname] );
	table_style = [('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
				('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
				   ('BOX', (0,0), (-1,-1), 0.25, colors.black),
				   ('BOX', (0,0), (-1,0), 0.25, colors.black),]
	story = [Spacer(1,0.4*inch)]
	spreadsheet_table = SpreadsheetTable(data, repeatRows = 1, colWidths = (1.5 * cm, 7.1 * cm,  5.6* cm, 5 * cm))
	spreadsheet_table.setStyle(table_style)
	story.append(spreadsheet_table)
	doc.multiBuild(story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
	f = open("listOfAccounts.pdf", 'rb');
	body = f.read();
	f.close()
	response = Response(content_type='application/pdf',content_disposition='attachment; filename=listOfAccounts.pdf', body=body)
	os.remove("listOfAccounts.pdf")
	return response

@view_config(route_name="showaccount", renderer="gkwebapp:templates/createaccount.jinja2")
def showaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/groupsubgroups", headers=header)
	grpdata=[]
	for record in result.json()["gkresult"]:
		gdata= {"groupname":str(record["groupname"]),"groupcode":str(record["groupcode"])}
		grpdata.append(gdata)
	return {"gkresult":grpdata,"baltbl":result.json()["baltbl"]}


@view_config(route_name="showlistofaccounts", renderer="gkwebapp:templates/listofaccounts.jinja2")
def showlistofaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)

	return {"gkresult":result.json()["gkresult"],"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="accountexists", renderer="json")
def accountexists(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts?find=exists&accountname=%s"%(request.params["accountname"]), headers=header)

	return {"gkstatus":result.json()["gkstatus"]}


@view_config(route_name="showmultiacc", renderer="gkwebapp:templates/multipleaccounts.jinja2")
def showmultiacc(request):

	return {"gkresult":request.params}


@view_config(route_name="showeditaccount", renderer="gkwebapp:templates/editaccount.jinja2")
def showeditaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
	accdata=[]
	for record in result.json()["gkresult"]:
		adata= {"accountname":str(record["accountname"]),"accountcode":str(record["accountcode"])}
		accdata.append(adata)
	return {"gkresult":accdata}


@view_config(route_name="deleteaccount", renderer="json")
def deleteaccount(request):

	header={"gktoken":request.headers["gktoken"]}
	gkdata={"accountcode":request.params["accountcode"]}
	result = requests.delete("http://127.0.0.1:6543/accounts",data =json.dumps(gkdata), headers=header)
	return {"gkstatus":result.json()["gkstatus"]}




@view_config(route_name="getaccdetails", renderer="json")
def getaccdetails(request):

	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/account/%s"%(request.params["accountcode"]), headers=header)
	record = result.json()["gkresult"]
	result = requests.get("http://127.0.0.1:6543/groupsubgroup/%s"%(record["groupcode"]), headers=header)

	grprecord = result.json()["gkresult"]


	if grprecord["groupcode"]==grprecord["subgroupcode"]:
		grprecord["subgroupname"] = "None"



	accdetails={"accountcode":record["accountcode"],"accountname":record["accountname"],"openingbal":record["openingbal"],"groupname":grprecord["groupname"],"subgroupname":grprecord["subgroupname"]}

	return {"gkresult":accdetails}


@view_config(route_name="getsubgroup", renderer="json")
def getsubgroup(request):
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/groupDetails/%s"%(request.params["groupcode"]), headers=header)
	subgrpdata=[]
	for record in result.json()["gkresult"]:
		sgdata= {"subgroupname":record["subgroupname"],"subgroupcode":record["groupcode"]}

		subgrpdata.append(sgdata)

	return {"gkresult":subgrpdata}

@view_config(route_name="addaccount", renderer="json")
def addaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata = {"accountname":request.params["accountname"],"openingbal":request.params["openbal"]}
	if request.params["subgroupname"]=="New":
		gkdata1={"groupname":request.params["newsubgroup"],"subgroupof":request.params["groupname"]}
		result = requests.post("http://127.0.0.1:6543/groupsubgroups", data =json.dumps(gkdata1),headers=header)

		if result.json()["gkstatus"]==0:
			gkdata["groupcode"] = result.json()["gkresult"]

		else:
			return {"gkstatus":False}

	elif request.params["subgroupname"]=="None":
		grpcode= request.params["groupname"]

		gkdata["groupcode"] = grpcode
	else:
		gkdata["groupcode"] = request.params["subgroupname"]

	result = requests.post("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="multiacc", renderer="json")
def addmultiaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	accdetails = json.loads(request.params["accdetails"])

	gkdata = {}
	if accdetails[0]["subgroupname"]=="New":
		gkdata1={"groupname":accdetails[0]["newsubgroup"],"subgroupof":accdetails[0]["groupname"]}
		result = requests.post("http://127.0.0.1:6543/groupsubgroups", data =json.dumps(gkdata1),headers=header)

		if result.json()["gkstatus"]==0:
			gkdata["groupcode"] = result.json()["gkresult"]

		else:
			return {"gkstatus":False}

	elif accdetails[0]["subgroupname"]=="None":
		gkdata["groupcode"] = accdetails[0]["groupname"]

	else:
		gkdata["groupcode"] = accdetails[0]["subgroupname"]

	for acc in accdetails:
		gkdata["accountname"]=acc["accountname"]
		gkdata["openingbal"]=acc["openbal"]

		result = requests.post("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="editaccount", renderer="json")
def editaccount(request):
	header={"gktoken":request.headers["gktoken"]}
	gkdata = {"accountname":request.params["accountname"],"openingbal":request.params["openingbal"],"accountcode":request.params["accountcode"]}
	result = requests.put("http://127.0.0.1:6543/accounts", data =json.dumps(gkdata),headers=header)
	return {"gkstatus":result.json()["gkstatus"]}
