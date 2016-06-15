
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
import calendar
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate
from reportlab.lib.units import mm, cm, inch
from reportlab.platypus.flowables import PageBreak, Spacer
from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from formula import CurrentPageColSum, PreviousPagesColSum,RowNumber
from spreadsheettable import SpreadsheetTable
from reportlab.pdfgen import canvas
from reportlab.lib.enums import  TA_LEFT, TA_CENTER,TA_RIGHT
from reportlab.rl_config import defaultPageSize

@view_config(route_name = "printprofitandloss", renderer = "")
def printprofitandloss(request):
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	headingprofit = request.params["headingprofit"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
	expense = result.json()["expense"]
	income = result.json()["income"]
	PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
	styles = getSampleStyleSheet()
	doc = SimpleDocTemplate("ProfitLoss.pdf", pagesize=A4)
	style = styles["BodyText"]
	style.alignment = TA_CENTER
	stylenormal = styles["Normal"]
	stylenormal.alignment = TA_CENTER
	style1 = styles["BodyText"]
	style1.alignment = TA_LEFT
	styleright = styles["BodyText"]
	styleright.alignment = TA_RIGHT
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	period = calculatefrom[8:10] + "-" + str(calendar.month_abbr[int(calculatefrom[5:7])]) + "-" + calculatefrom[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4];
	def myFirstPage(canvas, doc):
		canvas.saveState()
		canvas.setFont('Times-Bold',18)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, orgname)
		canvas.setFont('Times-Bold',16)
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, headingprofit )
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
		canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-60, "Profit and Loss : " + period )
		canvas.setStrokeColorRGB(0, 0, 0)
		canvas.setLineWidth(0.5)
		canvas.line(1 * cm, PAGE_HEIGHT-70, PAGE_WIDTH - 10, PAGE_HEIGHT-70)
		canvas.line(1 * cm, 50, PAGE_WIDTH - 10, 50)
		canvas.setFont('Times-Roman',9)
		canvas.drawString(inch, 0.5 * inch, "Page %d" % doc.page)
		canvas.restoreState()
	to = Paragraph('''<b>To</b>''', stylenormal)
	particulars = Paragraph('''<b>Particulars</b>''', stylenormal)
	amount = Paragraph('''<b>Amount</b>''', styleright)
	by = Paragraph('''<b>By</b>''', stylenormal)
	data= [[to, particulars, amount, by, particulars, amount]]
	for record in  expense:
		amount = "0.00"
		if(record["amount"] <> "" or record["amount"] <> "." or record["amount"] <> "\n"):

			amount = str((record["amount"]))
		else:
			amount = "0.00"
		accountname = Paragraph(str(record["accountname"]), style)
		toby = Paragraph(str(record["toby"]), style)
		data.append([toby, accountname, amount] );
	i = 1
	for record in income:
		amount = "0.00"
		if(record["amount"] <> "" or record["amount"] <> "."):
			amount = str((record["amount"]))
		else:
			amount = "0.00"
		accountname = Paragraph(str(record["accountname"]), style)
		toby = Paragraph(str(record["toby"]), style)
		data[i].append(toby)
		data[i].append(accountname)
		data[i].append(amount)
		i += 1
	data.insert(1,["", Paragraph("Brought Forward", style1), PreviousPagesColSum(decimal_places = 2), "", Paragraph("Brought Forward",style1), PreviousPagesColSum(decimal_places = 2)])
	data.append([ "", Paragraph("Carried Forward", style1), CurrentPageColSum(decimal_places = 2), "", Paragraph("Carried Forward",style1), CurrentPageColSum(decimal_places = 2)])
	table_style = [('BACKGROUND', (0, 0), (-1, 0), '#a7a5a5'),
					('ALIGN',(1,1),(-1,-1),'RIGHT'),
				   ('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
				   ('BOX', (0,0), (-1,-1), 0.25, colors.black),
				   ('BOX', (0,0), (-1,0), 0.25, colors.black),
				  ]
	story = [Spacer(1,0.4*inch)]
	spreadsheet_table = SpreadsheetTable(data, repeatRows = 2, repeatRowsB = 1, colWidths= (1.2* cm, 4.8* cm,  3.5 * cm,
						   1.2* cm, 4.7 * cm, 3.5 * cm))
	spreadsheet_table.setStyle(table_style)
	story.append(spreadsheet_table)
	doc.multiBuild(story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)
	f = open("ProfitLoss.pdf", 'rb');
	body = f.read();
	f.close()
	response = Response(content_type='application/pdf',content_disposition='attachment; filename=ProfitLoss.pdf', body=body)
	os.remove("ProfitLoss.pdf")
	return response

@view_config(route_name="showprofitloss", renderer="gkwebapp:templates/viewprofitloss.jinja2")
def showprofitloss(request):
	orgtype = request.params["orgtype"]
	return {"gkstatus":0,"orgtype":orgtype}

@view_config(route_name="showprofitlossreport")
def showprofitlossreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["financialstart"]
	orgtype = request.params["orgtype"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
	return render_to_response("gkwebapp:templates/profitlossreport.jinja2",{"expense":result.json()["expense"],"income":result.json()["income"],"orgtype":orgtype,"from":datetime.strftime(datetime.strptime(str(financialstart),"%Y-%m-%d").date(),'%d-%m-%Y'),"to":datetime.strftime(datetime.strptime(str(calculateto),"%Y-%m-%d").date(),'%d-%m-%Y')},request=request)
