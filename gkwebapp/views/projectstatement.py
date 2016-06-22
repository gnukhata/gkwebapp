
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
from formula import CurrentPageColSum, PreviousPagesColSum, RowNumber
from spreadsheettable import SpreadsheetTable

@view_config(route_name="printprojectstatementreport", renderer = "")
def printprojectstatementreport(request):
	calculateto = request.params["calculateto"]
	financialstart = request.params["fystart"]
	projectcode = int(request.params["projectcode"])
	projectname = request.params["projectname"]
	header={"gktoken":request.headers["gktoken"]}
	result = requests.get("http://127.0.0.1:6543/report?type=projectstatement&calculateto=%s&financialstart=%s&projectcode=%d"%(calculateto,financialstart,projectcode), headers=header)
	gkresult = result.json()["gkresult"]
	fy = str(request.params["fystart"]);
	fy = fy[0:4]
	fy = fy + "-" + (str(request.params["fyend"])[2:4])
	orgname = str(request.params["orgname"])
	orgname += " (FY: " + fy +")"
	period = financialstart[8:10] + "-" + str(calendar.month_abbr[int(financialstart[5:7])]) + "-" + financialstart[0:4] + " to " + calculateto[8:10] + "-" +  str(calendar.month_abbr[int(calculateto[5:7])]) + "-" +  calculateto[0:4];
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
