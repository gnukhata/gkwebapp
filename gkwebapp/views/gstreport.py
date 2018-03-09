"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc.,51 Franklin Street, 
  Fifth Floor, Boston, MA 02110, United States


Contributors:
   "Krishnakant Mane" <kk@gmail.com>
   'Prajkta Patkar'<prajkta@riseup.net>
   
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import os
from odslib import ODS

@view_config(route_name="gstsummary",renderer="gkwebapp:templates/viewgstsummary.jinja2")
def viewGstSummary(request):

    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/accounts", headers=header)
    projects = requests.get("http://127.0.0.1:6543/projects", headers=header)
    return {"gkresult":result.json()["gkresult"]}

@view_config(route_name="gstsummary",request_param="type=senddata",)
def sendReportData(request):
    print "Hii "
    calculateto = request.params["calculateto"]
   # financialstart = request.params["financialstart"]
    calculatefrom = request.params["calculatefrom"]
    orgtype = request.params["orgtype"]
    header={"gktoken":request.headers["gktoken"]}
    print "hello you are here"
    #result = requests.get("http://127.0.0.1:6543/report?type=cashflow&calculateto=%s&financialstart=%s&calculatefrom=%s"%(calculateto,financialstart,calculatefrom), headers=header)
'''
