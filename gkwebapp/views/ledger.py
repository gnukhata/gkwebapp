from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
import calendar
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate,Table, TableStyle
from reportlab.lib.units import mm, cm, inch
from reportlab.platypus.flowables import PageBreak, Spacer
from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from formula import CurrentPageColSum, PreviousPagesColSum,RowNumber
from spreadsheettable import SpreadsheetTable
from reportlab.pdfgen import canvas
from reportlab.lib.enums import  TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.rl_config import defaultPageSize

@view_config(route_name="printmonthlyledgerreport", renderer="")
def printmonthlyledgerreport(request):
	result = request
	accountcode = int(request.params["accountcode"])
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	accname = ""
	def myFirstPage(canvas, doc):
		accname = request.params["accname"]
		canvas.saveState()
		canvas.setFont('Times-Bold',18)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, orgname)
		canvas.setFont('Times-Bold',16)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, accname )
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
		accname = request.params["accname"]
		canvas.saveState()
		canvas.setFont('Times-Bold',12)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-40, orgname)
		canvas.setFont('Times-Roman',10)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-60, "" + accname)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-70, PAGE_WIDTH - 10, PAGE_HEIGHT-70)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.5 * inch, "Page %d" % doc.page)
		canvas.restoreState()
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=monthlyledger&accountcode=%d"%(accountcode), headers=header)
	gkresult = result.json()["gkresult"]
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styles = getSampleStyleSheet()
	doc = SimpleDocTemplate("monthlyledgerReport.pdf", pagesize=A4)
	style = styles["BodyText"]
	style.alignment = TA_RIGHT
	stylenormal = styles["Normal"]
	stylenormal.alignment = TA_CENTER
	hdebit = Paragraph('''<b>Debit</b>''', style)
	hcredit = Paragraph('''<b>Credit</b>''', style)
	hmonth = Paragraph('''<b>Month</b>''', stylenormal)
	data= [[hmonth, hdebit, hcredit]]
	for record in  gkresult:
		month = Paragraph(str(record["month"]), stylenormal)
		debit = Paragraph(str(record["Dr"]), style)
		credit = Paragraph(str(record["Cr"]), style)
		data.append([month, debit, credit] );
	table = Table(data, colWidths=[4.8 *cm,  7.6 * cm, 7.6*cm])
	table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
				   ('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
				   ('BOX', (0,0), (-1,-1), 0.25, colors.black),
				   ]))
	Story = [Spacer(1,0.4*inch)]
	Story.append(table);
	doc.multiBuild(Story, onFirstPage=myFirstPage)
	f = open("monthlyledgerReport.pdf", 'rb');
	body = f.read();
	f.close()
	response = Response(content_type='application/pdf',content_disposition='attachment; filename=monthlyledgerReport.pdf', body=body)
	os.remove("monthlyledgerReport.pdf")
	return response

@view_config(route_name="printledgerreport", renderer="")
def printLedgerReport(request):
	result = request
	accountcode = int(request.params["accountcode"])
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	backflag = request.params["backflag"]
	monthlyflag = request.params["monthlyflag"]
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	accname = ""
	period = calculatefrom[8:10] + "-" + str(calendar.month_abbr[int(calculatefrom[6:7])]) + "-" + calculatefrom[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[6:7])]) + "-" +  calculateto[0:4];
	def myFirstPage(canvas, doc):
		accname = result.json()["ledgerheader"]["accountname"]
		projectname = result.json()["ledgerheader"]["projectname"]
		canvas.saveState()
		canvas.setFont('Times-Bold',18)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, orgname)
		canvas.setFont('Times-Bold',16)
		if(projectname == ""):
			projectname = "Ledger Report for ACCOUNT: " + accname
		else:
			projectname = "Ledger Report for ACCOUNT: " + accname + ", PROJECT: " + projectname
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, projectname )
		canvas.setFont('Times-Bold',12)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-90, period)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-100, PAGE_WIDTH - 10, PAGE_HEIGHT-100)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.55 * inch, "Page1")
		canvas.restoreState()
	def myLaterPages(canvas, doc):
		accname = result.json()["ledgerheader"]["accountname"]
		canvas.saveState()
		canvas.setFont('Times-Bold',12)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-40, orgname)
		canvas.setFont('Times-Roman',10)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-60, "" + accname + " : " + period)
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-70, PAGE_WIDTH - 10, PAGE_HEIGHT-70)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.5 * inch, "Page %d" % doc.page)
		canvas.restoreState()
	projectcode = request.params["projectcode"]
	header={"gktoken":request.headers["gktoken"]}
	if projectcode=="":
		result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode="%(accountcode,calculatefrom,calculateto,financialstart), headers=header)
	else:
		result = requests.get("http://127.0.0.1:6543/report?type=ledger&accountcode=%d&calculatefrom=%s&calculateto=%s&financialstart=%s&projectcode=%d"%(accountcode,calculatefrom,calculateto,financialstart, int(projectcode)), headers=header)
	gkresult = result.json()["gkresult"]
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styles = getSampleStyleSheet()
	doc = SimpleDocTemplate("ledgerReport.pdf", pagesize=A4)
	style = styles["BodyText"]
	style.alignment = TA_CENTER
	stylenormal = styles["Normal"]
	stylenormal.alignment = TA_CENTER
	hdate = Paragraph('''<b>Date</b>''', stylenormal)
	hvno = Paragraph('''<b>V.No.</b>''', stylenormal)
	hparticulars = Paragraph('''<b>Particulars</b>''', stylenormal)
	hdebit = Paragraph('''<b>Debit</b>''', stylenormal)
	hcredit = Paragraph('''<b>Credit</b>''', stylenormal)
	hbalance = Paragraph('''<b>Balance</b>''', stylenormal)
	data= [[hdate, hvno, hparticulars, hdebit, hcredit, hbalance]]
	debit = credit = "0.00"
	for record in  gkresult:
		date = Paragraph(str(record["voucherdate"]), style)
		vno = Paragraph(str(record["vouchernumber"]), style)
		particulars = str(record["particulars"][0])
		if(record["narration"] != ""):
			particulars = particulars + "(" + str(record["narration"]) + ")"
		particulars = Paragraph(particulars, style)
		if("Cr" in record.keys() and "Dr" in record.keys()):
			if(record["Dr"] <> ""):
				debit = str("%.2f" % (float(record["Dr"])))
			else:
				debit = "0.00"
			if(record["Cr"] <> ""):
				credit = str("%.2f" % (float(record["Cr"])))
			else:
				credit = "0.00"
		else:
			debit = Paragraph("", style)
			credit = Paragraph("", style)
		balance = Paragraph(str(record["balance"]), style)
		data.append([date, vno,  particulars, debit, credit, balance] );
	data.insert(1,["", "", Paragraph("Brought Forward",style), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), ""])
	data.append(["", "", Paragraph("Carried Forward",style), CurrentPageColSum(decimal_places = 2), CurrentPageColSum(decimal_places = 2), ""])
	table_style = [('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
				   ('ALIGN',(0,0),(-1,-1),'RIGHT'),
				   ('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
				   ('BOX', (0,0), (-1,-1), 0.25, colors.black),
				   ('BOX', (0,0), (-1,0), 0.25, colors.black),
				  ]
	story = [Spacer(1,0.4*inch)]
	spreadsheet_table = SpreadsheetTable(data, repeatRows = 2, repeatRowsB = 1, colWidths= (2.4 * cm, 2.0 * cm,  4.8 * cm,
						   3.4 * cm, 3.4 * cm, 3.5 * cm))
	spreadsheet_table.setStyle(table_style)
	story.append(spreadsheet_table)
	doc.multiBuild(story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
	f = open("ledgerReport.pdf", 'rb');
	body = f.read();
	f.close()
	response = Response(content_type='application/pdf',content_disposition='attachment; filename=ledgerReport.pdf', body=body)
	os.remove("ledgerReport.pdf")
	return response

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
