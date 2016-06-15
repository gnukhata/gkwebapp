
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
from reportlab.lib.pagesizes import A4

from spreadsheettable import SpreadsheetTable
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from pyramid.response import Response
import os
import calendar
from formula import TotalPagesColSum, PreviousPagesColSum


@view_config(route_name="showcashflow", renderer="gkwebapp:templates/viewcashflow.jinja2")
def showcashflow(request):
	return {"gkstatus":0}

@view_config(route_name="showcashflowreport")
def showcashflowreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	calculatefrom = request.params["calculatefrom"]
	orgtype = request.params["orgtype"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=cashflow&calculateto=%s&financialstart=%s&calculatefrom=%s"%(calculateto,financialstart,calculatefrom), headers=header)
	return render_to_response("gkwebapp:templates/cashflowreport.jinja2",{"rcrecords":result.json()["rcgkresult"],"pyrecords":result.json()["pygkresult"],"orgtype":orgtype,"backflag":4,"from":datetime.strftime(datetime.strptime(str(calculatefrom),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)

@view_config(route_name="printcashflowreport")
def printcashflowreport(request):
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styleSheet = getSampleStyleSheet()
	styletwo = getSampleStyleSheet()
	stylethree = getSampleStyleSheet()

	simplestyle = styleSheet['BodyText']
	simplestyle.alignment = TA_CENTER
	simplestyle.fontSize = 9

	simplestyleleft = styletwo['BodyText']
	simplestyle.alignment = TA_LEFT
	simplestyle.fontSize = 9

	headingstyle = styleSheet['Heading4']
	headingstyle.alignment = TA_CENTER
	headingstyle.fontSize = 10
	headingstyle.fontName = 'Times-Bold'

	headingstyleright = styletwo['Heading4']
	headingstyleright.alignment = TA_RIGHT
	headingstyleright.fontSize = 10
	headingstyleright.fontName = 'Times-Bold'

	headingstyleleft = stylethree['Heading4']
	headingstyleleft.alignment = TA_LEFT
	headingstyleleft.fontSize = 10
	headingstyleleft.fontName = 'Times-Bold'

	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	calculatefrom = request.params["calculatefrom"]

	orgname = request.params["orgname"]
	orgtype = request.params["orgtype"]
	startyear = request.params["startyear"]
	endyear = request.params["endyear"]
	orgdata = orgname + " (" + orgtype + ")"
	period = calculatefrom[8:10] + "-" + str(calendar.month_abbr[int(calculatefrom[5:7])]) + "-" + calculatefrom[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4]
	year = startyear[0:2] + "-" + str(calendar.month_abbr[int(startyear[3:5])]) + "-" + startyear[6:10] + " to " + endyear[0:2] + "-" +  str(calendar.month_abbr[int(endyear[3:5])]) + "-" +  endyear[6:10]
	yeardata = "Financial Year: " + year

	header={"gktoken":request.headers["gktoken"]}

	if(orgtype == "Profit Making"):
		CashFlow = "Cash Flow Account for the period " + period
	elif(orgtype == "Not For Profit"):
		CashFlow = "Receipt & Payment Account for the period " + period
	pageinfo = "Cash Flow Report"
	filename = "CashFlowReport.pdf"

	def myFirstPage(canvas, doc):
			canvas.saveState()
			canvas.setFont('Times-Bold',15)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-35, orgdata)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, yeardata)
			canvas.setFont('Times-Bold',13)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-80, CashFlow)
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "Page %d %s" % (doc.page, pageinfo))
			canvas.restoreState()

	def myLaterPages(canvas, doc):
			canvas.saveState()
			canvas.setFont('Times-Bold',12)
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-40, orgname + "  FY: (" + year + ")")
			canvas.setFont('Times-Roman',11)
			if(orgtype == "Profit Making"):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, "Cash Flow")
			elif(orgtype == "Not For Profit"):
				canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-55, "Receipt & Payment")
			canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, period)
			canvas.setFont('Times-Roman',9)
			canvas.drawString(inch, 0.75 * inch, "Page %d %s" % (doc.page, pageinfo))
			canvas.restoreState()

	def makepdf(result):
		To = Paragraph("To", headingstyle)
		By = Paragraph("By", headingstyle)
		Particularsleft = Paragraph("Particulars", headingstyleleft)
		Particularsright = Paragraph("Particulars", headingstyleleft)
		Amtleft = Paragraph("Amount", headingstyleright)
		Amtright = Paragraph("Amount", headingstyleright)

		doc = SimpleDocTemplate(filename, pagesize=A4)
		temp_list = [To, Particularsleft, Amtleft, By, Particularsright, Amtright]

		Story = [Spacer(1,0.2*inch)]
		data_json_left = result.json()["rcgkresult"]
		data_json_right = result.json()["pygkresult"]
		listoflist = []
		listoflist.append(temp_list)
		#listoflist.append([Paragraph("", simplestyle), Paragraph("Brought Forward:", simplestyle), PreviousPagesColSum(decimal_places = 2), Paragraph("", simplestyle), Paragraph("Brought Forward:", simplestyle), PreviousPagesColSum(decimal_places = 2)])


		for entry in data_json_left:
				accountcode_left = entry["accountcode"]
				to = entry["toby"]
				to = Paragraph(to, simplestyle)
				particularsleft = entry["particulars"]
				particularsleft = Paragraph(particularsleft, simplestyleleft)
				amtleft = entry["amount"]
				listoflist.append([to, particularsleft, amtleft])

		i=1
		for entryy in data_json_right:
				accountcode_right = entryy["accountcode"]
				by = entryy["toby"]
				by = Paragraph(by, simplestyle)
				particularsright = entryy["particulars"]
				particularsright = Paragraph(particularsright, simplestyleleft)
				amtright = entryy["amount"]
				listoflist[i].append(by)
				listoflist[i].append(particularsright)
				listoflist[i].append(amtright)
				i+=1
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
		#data.append([Paragraph("", simplestyle), Paragraph("Carried Forward:", simplestyle), TotalPagesColSum(decimal_places = 2), Paragraph("", simplestyle), Paragraph("Carried Forward:", simplestyle), TotalPagesColSum(decimal_places = 2)])
		spreadsheet_table = SpreadsheetTable(data, repeatRows = 1, colWidths = (1*cm, 5.2*cm, 3.8*cm, 1*cm, 5.2*cm, 3.8*cm))
		spreadsheet_table.setStyle(table_style)

		Story.append(spreadsheet_table)
		Story.append(Spacer(1,0.2*inch))
		doc.build(Story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
	result = requests.get("http://127.0.0.1:6543/report?type=cashflow&calculateto=%s&financialstart=%s&calculatefrom=%s"%(calculateto,financialstart,calculatefrom), headers=header)
	makepdf(result)
	fileobj = open(filename, 'rb')
	filecontent = fileobj.read()
	fileobj.close()
	response = Response(content_type='application/pdf', content_disposition='attachment; filename=Filename_net', body=filecontent)
	os.remove(filename)
	return response
