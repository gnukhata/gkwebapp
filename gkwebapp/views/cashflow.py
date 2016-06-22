
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
	return response
