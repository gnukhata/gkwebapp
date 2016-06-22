
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
	
	#else:
		#return {"gkstatus":1}
