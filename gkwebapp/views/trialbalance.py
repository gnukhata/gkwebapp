from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
#from reportlab.platypus import Table
from reportlab.lib.pagesizes import A4, landscape, letter
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from spreadsheettable import SpreadsheetTable
from pyramid.response import Response
import os
import calendar
from formula import TotalPagesColSum, PreviousPagesColSum

@view_config(route_name="showtrialbalance", renderer="gkwebapp:templates/viewtrialbalance.jinja2")
def showtrialbalance(request):
	return {"gkstatus":0}

@view_config(route_name="showtrialbalancereport")
def showtrialbalancereport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	trialbalancetype = int(request.params["trialbalancetype"])
	header={"gktoken":request.headers["gktoken"]}
	if trialbalancetype == 1:
		result = requests.get("http://127.0.0.1:6543/report?type=nettrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/nettrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":1,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
	elif trialbalancetype == 2:
		result = requests.get("http://127.0.0.1:6543/report?type=grosstrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/grosstrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":2,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
	elif trialbalancetype == 3:
		result = requests.get("http://127.0.0.1:6543/report?type=extendedtrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		return render_to_response("gkwebapp:templates/extendedtrialbalance.jinja2",{"records":result.json()["gkresult"],"trialbalancetype":3,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)

@view_config(route_name="printtrialbalance")
def printtrialbalance(request):
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styleSheet = getSampleStyleSheet()
	simplestyle = styleSheet['BodyText']
	simplestyle.alignment = TA_CENTER
	simplestyle.fontSize = 9
	headingstyle = styleSheet['Heading4']
	headingstyle.alignment = TA_CENTER
	headingstyle.fontSize = 10

	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	trialbalancetype = int(request.params["trialbalancetype"])


	orgname = request.params["orgname"]
	orgtype = request.params["orgtype"]
	startyear = request.params["startyear"]
	endyear = request.params["endyear"]
	orgdata = orgname + " (" + orgtype + ")"
	yeardata = "Financial Year : " + startyear + " to " + endyear
	period = financialstart[8:10] + "-" + str(calendar.month_abbr[int(financialstart[6:7])]) + "-" + financialstart[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[6:7])]) + "-" +  calculateto[0:4]

	header={"gktoken":request.headers["gktoken"]}

	#Net_Trial = "Net Trial Balance for the period from " + financialstart + " to " + calculateto
	#Gross_Trial = "Gross Trial Balance for the period from " + financialstart + " to " + calculateto
	#Extended_Trial = "Extended Trial Balance for the period from " + financialstart + " to " + calculateto
	Net_Trial = "Net Trial Balance for the period from " + period
	Gross_Trial = "Gross Trial Balance for the period from " + period
	Extended_Trial = "Extended Trial Balance for the period from " + period


	pageinfo = "Trial Balance Report"

	Filename_net = "NetBalanceReport.pdf"
	Filename_gross = "GrossBalanceReport.pdf"
	Filename_ext = "ExtendedBalanceReport.pdf"

	def myFirstPage_Net(canvas, doc):
			canvas.saveState()
			#canvas.setPageSize(A4)
			canvas.setFont('Times-Bold',16)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-45, orgdata)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, yeardata)
			canvas.setFont('Times-Bold',13)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-108, Net_Trial)
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "First Page / %s" % pageinfo)
			canvas.restoreState()

	def myLaterPages_Net(canvas, doc):
			canvas.saveState()
			#canvas.setPageSize(landscape(letter))
			canvas.setFont('Times-Bold',12)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-40, orgname + "  FY: (" + startyear + " to " + endyear + ")")
			canvas.setFont('Times-Roman',11)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, "Net Trial Balance")
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, period)
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "Page %d %s" % (doc.page, pageinfo))
			canvas.restoreState()

	def myFirstPage_Gross(canvas, doc):
			canvas.saveState()
			#canvas.setPageSize(landscape(letter))
			canvas.setFont('Times-Bold',16)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-45, orgdata)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, yeardata)
			canvas.setFont('Times-Bold',13)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-108, Gross_Trial)
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "First Page / %s" % pageinfo)
			canvas.restoreState()

	def myLaterPages_Gross(canvas, doc):
			canvas.saveState()
			#canvas.setPageSize(landscape(letter))
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "Page %d %s" % (doc.page, pageinfo))
			canvas.restoreState()

	def myFirstPage_Extended(canvas, doc):
			canvas.saveState()
			#canvas.setPageSize(landscape(letter))
			canvas.setFont('Times-Bold',16)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-45, orgdata)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, yeardata)
			canvas.setFont('Times-Bold',13)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-108, Extended_Trial)
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "First Page / %s" % pageinfo)
			canvas.restoreState()

	def myLaterPages_Extended(canvas, doc):
			canvas.saveState()
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "Page %d %s" % (doc.page, pageinfo))
			canvas.restoreState()

	def makepdf(balancetype, result):
		srnum = Paragraph("Sr.No", headingstyle)
		accntname = Paragraph("Account Name", headingstyle)
		grpname = Paragraph("Group Name", headingstyle)

		if(balancetype == "Net"):
			doc = SimpleDocTemplate(Filename_net, pagesize=A4)
			deb = Paragraph("Debit", headingstyle)
			cred = Paragraph("Credit", headingstyle)
			temp_list = [srnum, accntname, deb, cred, grpname]
		elif(balancetype == "Gross"):
			doc = SimpleDocTemplate(Filename_gross, pagesize=A4)
			deb = Paragraph("Debit", headingstyle)
			cred = Paragraph("Credit", headingstyle)
			temp_list = [srnum, accntname, deb, cred, grpname]
		elif(balancetype == "Extended"):
			doc = SimpleDocTemplate(Filename_ext, pagesize=A4)
			openingg = Paragraph("Opening", headingstyle)
			totaldeb = Paragraph("Total Drs", headingstyle)
			totalcred = Paragraph("Total Crs", headingstyle)
			dr_balance = Paragraph("Dr Balance", headingstyle)
			cr_balance = Paragraph("Cr Balance", headingstyle)
			temp_list = [srnum, accntname, openingg, totaldeb, totalcred, dr_balance, cr_balance, grpname]

		Story = [Spacer(1,1*inch)]

		data_json = result.json()["gkresult"]
		listoflist = []
		listoflist.append(temp_list)
		if(balancetype == "Net" or balancetype == "Gross"):
			listoflist.append([Paragraph("", simplestyle), Paragraph("BroughtForward:", simplestyle), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])
		elif(balancetype == "Extended"):
			listoflist.append([Paragraph("", simplestyle), Paragraph("BroughtForward:", simplestyle), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])
		for entry in data_json:
				accountcode = entry["accountcode"]
				srno = entry["srno"]
				srno = Paragraph(str(srno), simplestyle)
				accountname = entry["accountname"]
				accountname = Paragraph(accountname, simplestyle)
				groupname = entry["groupname"]
				groupname = Paragraph(groupname, simplestyle)
				if(balancetype == "Net"):
					Cr = entry["Cr"]
					#Cr = Paragraph(Cr, simplestyle)
					Dr = entry["Dr"]
					#Dr = Paragraph(Dr, simplestyle)
					row = [srno, accountname, Dr, Cr, groupname]
				elif(balancetype == "Gross"):
					Cr = entry["Cr balance"]
					#Cr = Paragraph(Cr, simplestyle)
					Dr = entry["Dr balance"]
					#Dr = Paragraph(Dr, simplestyle)
					row = [srno, accountname, Dr, Cr, groupname]
				elif(balancetype == "Extended"):
					openingbalance = entry["openingbalance"]
					#openingbalance = Paragraph(openingbalance, simplestyle)
					curbalcr = entry["curbalcr"]
					#curbalcr = Paragraph(curbalcr, simplestyle)
					curbaldr = entry["curbaldr"]
					#curbaldr = Paragraph(curbaldr, simplestyle)
					totaldr = entry["totaldr"]
					#totaldr = Paragraph(totaldr, simplestyle)
					totalcr = entry["totalcr"]
					#totalcr = Paragraph(totalcr, simplestyle)
					row = [srno, accountname, openingbalance, totaldr, totalcr, curbaldr, curbalcr, groupname]
				listoflist.append(row)
		data = listoflist
		table_style = [
						('BACKGROUND', (0, 0), (-1, 0), colors.grey),
						('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
						#('GRID', (0, 0), (-1, -1), 1, colors.black),
						('GRID', (0, 0), (-1, 0), 1, colors.white),
						('BOX', (0, 0), (-1, 0), 1, colors.black),
						('BOX', (0, 0), (-1, -1), 1, colors.black),
						#('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
		]

		if(balancetype == "Net" or balancetype == "Gross"):
			data.append([Paragraph("", simplestyle), Paragraph("CarriedForward:", simplestyle), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])
			spreadsheet_table = SpreadsheetTable(data, repeatRows = 2, repeatRowsB = 1, colWidths = (2*cm, 6*cm, 4*cm, 4*cm, 3.5*cm))
		elif(balancetype == "Extended"):
			data.append([Paragraph("", simplestyle), Paragraph("CarriedForward:", simplestyle), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])
			spreadsheet_table = SpreadsheetTable(data, repeatRows = 2, repeatRowsB = 1, colWidths = (1*cm, 3.5*cm, 2.6*cm, 2.6*cm, 2.6*cm, 2.6*cm, 2.6*cm, 2*cm))

		spreadsheet_table.setStyle(table_style)

		Story.append(spreadsheet_table)
		style = styleSheet["Normal"]
		Story.append(Spacer(1,0.2*inch))

		if(balancetype == "Net"):
			doc.build(Story, onFirstPage=myFirstPage_Net, onLaterPages=myLaterPages_Net)
		elif(balancetype == "Gross"):
			doc.build(Story, onFirstPage=myFirstPage_Gross, onLaterPages=myLaterPages_Gross)
		elif(balancetype == "Extended"):
			doc.build(Story, onFirstPage=myFirstPage_Extended, onLaterPages=myLaterPages_Extended)

	if trialbalancetype == 1:
		result = requests.get("http://127.0.0.1:6543/report?type=nettrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		makepdf("Net", result)
		fileobj = open(Filename_net, 'rb')
		filecontent = fileobj.read()
		fileobj.close()
		response = Response(content_type='application/pdf', content_disposition='attachment; filename=Filename_net', body=filecontent)
		os.remove(Filename_net)
		return response
	elif trialbalancetype == 2:
		result = requests.get("http://127.0.0.1:6543/report?type=grosstrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		makepdf("Gross", result)
		fileobj = open(Filename_gross, 'rb')
		filecontent = fileobj.read()
		fileobj.close()
		response = Response(content_type='application/pdf', content_disposition='attachment; filename=Filename_gross', body=filecontent)
		os.remove(Filename_gross)
		return response
	elif trialbalancetype == 3:
		result = requests.get("http://127.0.0.1:6543/report?type=extendedtrialbalance&calculateto=%s&financialstart=%s"%(calculateto,financialstart), headers=header)
		makepdf("Extended", result)
		fileobj = open(Filename_ext, 'rb')
		filecontent = fileobj.read()
		fileobj.close()
		response = Response(content_type='application/pdf', content_disposition='attachment; filename=Filename_ext', body=filecontent)
		os.remove(Filename_ext)
		return response
	else:
		return {"gkstatus":1}
