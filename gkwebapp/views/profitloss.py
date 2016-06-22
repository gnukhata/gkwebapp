
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
from formula import CurrentPageColSum, PreviousPagesColSum,RowNumber
from spreadsheettable import SpreadsheetTable

@view_config(route_name = "printprofitandloss", renderer = "")
def printprofitandloss(request):
	calculatefrom = request.params["calculatefrom"]
	calculateto = request.params["calculateto"]
	headingprofit = request.params["headingprofit"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=profitloss&calculateto=%s"%(calculateto), headers=header)
	expense = result.json()["expense"]
	income = result.json()["income"]
	fy = str(request.params["fystart"]);
	fy = fy[6:]
	fy = fy + "-" + (str(request.params["fyend"])[8:])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	period = calculatefrom[8:10] + "-" + str(calendar.month_abbr[int(calculatefrom[5:7])]) + "-" + calculatefrom[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4];
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
