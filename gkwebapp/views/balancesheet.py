from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
import calendar
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4, cm
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT

def coord(x, y, unit=1):
	x, y = x * unit, height -  y * unit
	return x, y

@view_config(route_name="printconvbalsheetreport")
def printconvbalsheetreport(request):
	calculateto = request.params["calculateto"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	period = " On " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4];
	def myFirstPage(canvas, doc):
		canvas.saveState()
		canvas.setFont('Times-Bold',18)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, orgname)
		canvas.setFont('Times-Bold',16)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, "Conventional Balance Sheet" + period)
		canvas.setStrokeColorRGB(0, 0, 0)
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
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-60, "Conventional Balance Sheet" + period)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-70, PAGE_WIDTH - 10, PAGE_HEIGHT-70)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.5 * inch, "Page %d" % doc.page)
		canvas.restoreState()
	rightlist = result.json()["gkresult"]["rightlist"]
	leftlist = result.json()["gkresult"]["leftlist"]
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styles = getSampleStyleSheet()
	doc = SimpleDocTemplate("ConventionalBalSheet.pdf", pagesize=A4)
	style = styles["BodyText"]
	style.alignment = TA_RIGHT
	stylenormal = styles["Normal"]
	stylenormal.alignment = TA_LEFT
	groupname = Paragraph("<b>Capital and Liabilities</b>", stylenormal)
	groupname1 = Paragraph("<b>Properties and Assets</b>", stylenormal)
	amount = Paragraph("<b>Amount</b>", style)
	data = [[groupname, amount, groupname1, amount]];
	for record in leftlist:
		groupname = Paragraph(str(record["groupname"]), stylenormal)
		amount = Paragraph(str(record["amount"]), style)
		data.append([groupname, amount]);
		account = record["accounts"]
		if(account):
			for accountinfo in account:
				data.append(["       " + accountinfo["accountname"], accountinfo["amount"] + "       "])
	i = 1
	for record in  rightlist:
		groupname = Paragraph(str(record["groupname"]), stylenormal)
		if(record["amount"] == "."):
			record["amount"] = ""
		amount = Paragraph(str(record["amount"]), style)
		try:
			data[i].append(groupname);
			data[i].append(amount);
			i += 1
		except IndexError:
			data.append(["","",groupname,amount])
			i += 1
		account = record["accounts"]
		if(account):
			for accountinfo in account:
				try:
					data[i].append("       " + accountinfo["accountname"])
					data[i].append(accountinfo["amount"] + "       ")
					i += 1
				except IndexError:
					data.append(["","","       " + accountinfo["accountname"], accountinfo["amount"] + "       "])
					i += 1


	table = Table(data, colWidths=[7.0*cm, 2.7 *cm, 7.0*cm, 2.7*cm])
	table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
					('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
				   ('BOX', (0,0), (-1,-1), 0.25, colors.black),
				   ]))

	Story = [Spacer(1,0.4*inch)]
	Story.append(table);
	doc.multiBuild(Story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
	f = open("ConventionalBalSheet.pdf", 'rb');
	body = f.read();
	f.close()
	response = Response(content_type='application/pdf',content_disposition='attachment; filename=ConventionalBalSheet.pdf', body=body)
	os.remove("ConventionalBalSheet.pdf")
	return response

@view_config(route_name="printsourcesandappfundreport")
def printsourcesandappfundreport(request):
	calculateto = request.params["calculateto"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=2"%(calculateto), headers=header)
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	period =  calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4];
	def myFirstPage(canvas, doc):
		canvas.saveState()
		canvas.setFont('Times-Bold',18)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, orgname)
		canvas.setFont('Times-Bold',16)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, "Sources and Application of Funds On " + period)
		canvas.setStrokeColorRGB(0, 0, 0)
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
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-60, "Sources and Application of Funds: " + period)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-70, PAGE_WIDTH - 10, PAGE_HEIGHT-70)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.5 * inch, "Page %d" % doc.page)
		canvas.restoreState()
	rightlist = result.json()["gkresult"]["rightlist"]
	leftlist = result.json()["gkresult"]["leftlist"]
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styles = getSampleStyleSheet()
	doc = SimpleDocTemplate("SourceAndAppFund.pdf", pagesize=A4)
	style = styles["BodyText"]
	style.alignment = TA_RIGHT
	stylenormal = styles["Normal"]
	stylenormal.alignment = TA_LEFT
	leftlist.pop(0)
	rightlist.pop(0)
	groupname = Paragraph("<b>Sources</b>", stylenormal)
	amount = Paragraph("<b>Amount</b>", style)
	data = [[groupname, amount]];
	for record in leftlist:
		groupname = Paragraph(str(record["groupname"]), stylenormal)
		amount = Paragraph(str(record["amount"]), style)
		data.append([groupname, amount]);
		account = record["accounts"]
		if(account):
			for accountinfo in account:
				data.append(["            " + accountinfo["accountname"], accountinfo["amount"] +"            "])
	groupname = Paragraph("<b>Applications</b>", stylenormal)
	amount = Paragraph("", style)
	data.append([groupname, amount]);
	for record in  rightlist:
		groupname = Paragraph(str(record["groupname"]), stylenormal)
		amount = Paragraph(str(record["amount"]), style)
		data.append([groupname, amount]);
		account = record["accounts"]
		if(account):
			for accountinfo in account:
				data.append(["            " + str(accountinfo["accountname"]), accountinfo["amount"] + "            "])


	table = Table(data, colWidths=[12.8 *cm,  6.6 * cm])
	table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
				   ('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
				   ('BOX', (0,0), (-1,-1), 0.25, colors.black),
				   ]))
	Story = [Spacer(1,0.4*inch)]
	Story.append(table);
	doc.multiBuild(Story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
	f = open("SourceAndAppFund.pdf", 'rb');
	body = f.read();
	f.close()
	response = Response(content_type='application/pdf',content_disposition='attachment; filename=SourceAndAppFund.pdf', body=body)
	os.remove("SourceAndAppFund.pdf")
	return response

@view_config(route_name="showbalancesheet", renderer="gkwebapp:templates/viewbalancesheet.jinja2")
def showtrialbalance(request):
	return {"gkstatus":0}

@view_config(route_name="showbalancesheetreport")
def showtrialbalancereport(request):
	calculateto = request.params["calculateto"]
	print"asdfyguygfdcwerv: ",calculateto
	balancesheettype = request.params["balancesheettype"]
	print"asdfyguygfdcwerv: ",balancesheettype
	orgtype = request.params["orgtype"]
	print"asdfyguygfdcwerv: ",orgtype
	header={"gktoken":request.headers["gktoken"]}
	if balancesheettype == "conventionalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/conventionalbalancesheetreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":"verticalbalancesheet","to":calculateto,"orgtype":orgtype},request=request)
	if balancesheettype == "verticalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=2"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/sourcesandapplicationoffundsreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":"conventionalbalancesheet","to":calculateto,"orgtype":orgtype},request=request)
