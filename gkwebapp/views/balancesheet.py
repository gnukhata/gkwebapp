
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
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
import calendar

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
	return response

@view_config(route_name="showbalancesheet", renderer="gkwebapp:templates/viewbalancesheet.jinja2")
def showbalancesheet(request):
	return {"gkstatus":0}

@view_config(route_name="showbalancesheetreport")
def showbalancesheetreport(request):
	calculateto = request.params["calculateto"]
	balancesheettype = request.params["balancesheettype"]
	orgtype = request.params["orgtype"]
	header={"gktoken":request.headers["gktoken"]}
	if balancesheettype == "conventionalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=1"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/conventionalbalancesheetreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":"verticalbalancesheet","to":calculateto,"orgtype":orgtype},request=request)
	if balancesheettype == "verticalbalancesheet":
		result = requests.get("http://127.0.0.1:6543/report?type=balancesheet&calculateto=%s&baltype=2"%(calculateto), headers=header)
		return render_to_response("gkwebapp:templates/sourcesandapplicationoffundsreport.jinja2",{"records":result.json()["gkresult"],"balancesheettype":"conventionalbalancesheet","to":calculateto,"orgtype":orgtype},request=request)
