
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
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
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
	PAGE_HEIGHT=defaultPageSize[1]
	PAGE_WIDTH=defaultPageSize[0]

	styleSheet = getSampleStyleSheet()
	simplestyle = styleSheet['BodyText']
	simplestyle.alignment = TA_CENTER
	simplestyle.fontSize = 9

	headingstyle = styleSheet['Heading4']
	headingstyle.alignment = TA_CENTER
	headingstyle.fontSize = 11
	headingstyle.fontName = 'Times-Bold'

	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	trialbalancetype = int(request.params["trialbalancetype"])

	orgname = request.params["orgname"]
	orgtype = request.params["orgtype"]
	startyear = request.params["startyear"]
	endyear = request.params["endyear"]
	orgdata = orgname + " (" + orgtype + ")"

	period = financialstart[8:10] + "-" + str(calendar.month_abbr[int(financialstart[5:7])]) + "-" + financialstart[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4]
	year = startyear[0:2] + "-" + str(calendar.month_abbr[int(startyear[3:5])]) + "-" + startyear[6:10] + " to " + endyear[0:2] + "-" +  str(calendar.month_abbr[int(endyear[3:5])]) + "-" +  endyear[6:10]
	yeardata = "Financial Year: " + year

	header={"gktoken":request.headers["gktoken"]}

	Net_Trial = "Net Trial Balance for the period from " + period
	Gross_Trial = "Gross Trial Balance for the period from " + period
	Extended_Trial = "Extended Trial Balance for the period from " + period

	pageinfo = "Trial Balance Report"

	Filename_net = "NetBalanceReport.pdf"
	Filename_gross = "GrossBalanceReport.pdf"
	Filename_ext = "ExtendedBalanceReport.pdf"

	def myFirstPage(canvas, doc):
			canvas.saveState()
			canvas.setFont('Times-Bold',15)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-35, orgdata)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, yeardata)
			canvas.setFont('Times-Bold',13)
			if(trialbalancetype == 1):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-80, Net_Trial)
			elif(trialbalancetype == 2):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-80, Gross_Trial)
			elif(trialbalancetype == 3):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-80, Extended_Trial)
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "Page %d %s" % (doc.page, pageinfo))
			canvas.restoreState()

	def myLaterPages(canvas, doc):
			canvas.saveState()
			canvas.setFont('Times-Bold',12)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-40, orgname + "  FY: (" + year + ")")
			canvas.setFont('Times-Roman',11)
			if(trialbalancetype == 1):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, "Net Trial Balance")
			elif(trialbalancetype == 2):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, "Gross Trial Balance")
			elif(trialbalancetype == 3):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, "Extended Trial Balance")
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, period)
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

		Story = [Spacer(1,0.2*inch)]

		data_json = result.json()["gkresult"]
		listoflist = []
		listoflist.append(temp_list)

		if(balancetype == "Net" or balancetype == "Gross"):
			listoflist.append([Paragraph("", simplestyle), Paragraph("Brought Forward:", simplestyle), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])
		elif(balancetype == "Extended"):
			listoflist.append([Paragraph("", simplestyle), Paragraph("Brought Forward:", simplestyle), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), PreviousPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])

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
					Dr = entry["Dr"]
					row = [srno, accountname, Dr, Cr, groupname]
				elif(balancetype == "Gross"):
					Cr = entry["Cr balance"]
					Dr = entry["Dr balance"]
					row = [srno, accountname, Dr, Cr, groupname]
				elif(balancetype == "Extended"):
					openingbalance = entry["openingbalance"]
					curbalcr = entry["curbalcr"]
					curbaldr = entry["curbaldr"]
					totaldr = entry["totaldr"]
					totalcr = entry["totalcr"]
					row = [srno, accountname, openingbalance, totaldr, totalcr, curbaldr, curbalcr, groupname]
				listoflist.append(row)
		data = listoflist
		table_style = [
						('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
						('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
						('GRID', (0, 0), (-1, 0), 1, colors.white),
						('BOX', (0, 0), (-1, -1), 1, colors.grey),
						('BOX', (0, 0), (-1, 0), 1, colors.grey),
						('BOX', (0, 0), (-1, -1), 0.25, colors.black),
						('BOX', (0, 0), (-1, 0), 0.25, colors.black),
		]

		if(balancetype == "Net" or balancetype == "Gross"):
			data.append([Paragraph("", simplestyle), Paragraph("Carried Forward:", simplestyle), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])
			spreadsheet_table = SpreadsheetTable(data, repeatRows = 2, repeatRowsB = 1, colWidths = (2*cm, 6*cm, 4*cm, 4*cm, 3.5*cm))
		elif(balancetype == "Extended"):
			data.append([Paragraph("", simplestyle), Paragraph("Carried Forward:", simplestyle), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), TotalPagesColSum(decimal_places = 2), Paragraph("", simplestyle)])
			spreadsheet_table = SpreadsheetTable(data, repeatRows = 2, repeatRowsB = 1, colWidths = (1.5*cm, 3.5*cm, 2.6*cm, 2.6*cm, 2.6*cm, 2.6*cm, 2.6*cm, 2*cm))

		spreadsheet_table.setStyle(table_style)

		Story.append(spreadsheet_table)
		style = styleSheet["Normal"]
		Story.append(Spacer(1,0.2*inch))
		doc.build(Story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
		
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
