from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
import calendar
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
from reportlab.lib.enums import  TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.rl_config import defaultPageSize

@view_config(route_name="printprojectstatementreport", renderer = "")
def printprojectstatementreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["fystart"]
	projectcode = int(request.params["projectcode"])
	projectname = request.params["projectname"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=projectstatement&calculateto=%s&financialstart=%s&projectcode=%d"%(calculateto,financialstart,projectcode), headers=header)
	gkresult = result.json()["gkresult"]
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styles = getSampleStyleSheet()
	doc = SimpleDocTemplate("ProjectReport.pdf", pagesize=A4)
	style = styles["BodyText"]
	style.alignment = TA_CENTER
	stylenormal = styles["Normal"]
	stylenormal.alignment = TA_CENTER
	styleright = styles["Normal"]
	styleright.alignment = TA_RIGHT
	hsrno = Paragraph('''<b>Sr. No.</b>''', stylenormal)
	haccount = Paragraph('''<b>Account</b>''', stylenormal)
	hgroup = Paragraph('''<b>Group</b>''', stylenormal)
	houtgoing = Paragraph('''<b>Total Outgoing</b>''', styleright)
	hincoming = Paragraph('''<b>Total Incoming</b>''', styleright)
	data= [[hsrno, haccount, hgroup, houtgoing, hincoming]]
	for record in  gkresult:
		srno = Paragraph(str(record["srno"]), style)
		account = Paragraph(str(record["accountname"]), style)
		group = Paragraph(str(record["groupname"]), style)
		outgoing = incoming = "0.0"
		if(record["totalout"] <> ""):
			outgoing = "%.2f" % (float(record["totalout"]))
		else:
			outgoing = "0.00"
		if(record["totalin"] <> ""):
			incoming = "%.2f" % (float(record["totalin"]))
		else:
			incoming = "0.00"
		data.append([srno, account, group, outgoing, incoming]);
	table_style = [('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
				('ALIGN',(1,1),(-1,-1),'RIGHT'),
				   ('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
				   ('BOX', (0,0), (-1,-1), 0.25, colors.black),
				   ('BOX', (0,0), (-1,0), 0.25, colors.black),
				  ]
	fy = str(request.params["fystart"]);
	fy = fy[0:4]
	fy = fy + "-" + (str(request.params["fyend"])[2:4])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	period = financialstart[8:10] + "-" + str(calendar.month_abbr[int(financialstart[5:7])]) + "-" + financialstart[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4];
	def myFirstPage(canvas, doc):
		canvas.saveState()
		canvas.setFont('Times-Bold',18)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, orgname)
		canvas.setFont('Times-Bold',16)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, "Project Satement for " + projectname)
		canvas.setFont('Times-Bold',12)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-90, period)
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
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-60, projectname + " : " + period)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-70, PAGE_WIDTH - 10, PAGE_HEIGHT-70)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.5 * inch, "Page %d" % doc.page)
		canvas.restoreState()
	data.insert(1,["", "",  Paragraph("Brought Forward",style), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2)])
	data.append(["", "",  Paragraph("Carried Forward",style), CurrentPageColSum(decimal_places = 2), CurrentPageColSum(decimal_places = 2)])
	story = [Spacer(1,0.4*inch)]
	spreadsheet_table = SpreadsheetTable(data, repeatRows = 2, repeatRowsB = 1, colWidths=(2.0 * cm, 3.8 * cm,  4.6 * cm, 4.5 * cm, 4.5 * cm))
	spreadsheet_table.setStyle(table_style)
	story.append(spreadsheet_table)
	doc.multiBuild(story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
	f = open("ProjectReport.pdf", 'rb');
	body = f.read();
	f.close()
	response = Response(content_type='application/pdf',content_disposition='attachment; filename=ProjectReport.pdf', body=body)
	os.remove("ProjectReport.pdf")
	return response
@view_config(route_name="showviewprojectstatement", renderer="gkwebapp:templates/viewprojectstatement.jinja2")
def showviewprojectstatement(request):
	header={"gktoken":request.headers["gktoken"]}
	projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
	return {"projects":projects.json()["gkresult"]}

@view_config(route_name="showprojectstatementreport")
def showprojectstatementreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	projectcode = int(request.params["projectcode"])
	projectname = request.params["projectname"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=projectstatement&calculateto=%s&financialstart=%s&projectcode=%d"%(calculateto,financialstart,projectcode), headers=header)
	return render_to_response("gkwebapp:templates/projectstatementreport.jinja2",{"records":result.json()["gkresult"],"projectcode":projectcode,"projectname":projectname,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
