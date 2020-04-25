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
  Free Software Foundation, Inc.,51 Franklin Street, Fifth Floor,
  Boston, MA 02110, United States


Contributors:
"Akhil KP" <akhilkpdasan@protonmail.com>
'Prajkta Patkar'<prajakta@dff.org.in>"""

import os, io
from io import BytesIO
import requests
from pyramid.view import view_config
from pyramid.response import Response
from gkwebapp.views.gst_r1_generator import gst_r1_template


@view_config(route_name="viewgstreturns",
             renderer="gkwebapp:templates/viewgstreturns.jinja2")
def viewgstreturns(request):
    """Renders the page that allows user to enter period for GST return"""

    return {"type": request.params.get("type")}


@view_config(route_name="gstreturns",
             request_param="type=r1",
             renderer="gkwebapp:templates/gstreturnreport.jinja2")
def gstr1(request):
    """Renders the report page showing section wise GSTR1 data"""

    header = {"gktoken": request.headers["gktoken"]}
    params = request.params
    results = requests.get("http://127.0.0.1:6543/gstreturns",
                          headers=header,
                          params=params)
    result1 = results.json()
    result1["gkdata"]["report_type"] = "r1"
    result1["gkdata"]["startdate"] = params["start"]
    result1["gkdata"]["enddate"] = params["end"]
    return result1["gkdata"]


@view_config(route_name="gstreturns",
             request_param="action=spreadsheet",
             request_method="GET")
def gstr1_spreadsheet(request):
    """Creates the spreadsheet for GSTR1"""

    header = {"gktoken": request.headers["gktoken"]}
    params = request.params

    result = requests.get("http://127.0.0.1:6543/gstreturns?type=r1",
                          headers=header,
                          params=params).json()

    wb = gst_r1_template(result)

    output = io.BytesIO()
    wb.save(output)
    contents = output.getvalue()
    output.close()
    headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(contents),'Content-Disposition': 'attachment; filename=report.xlsx','X-Content-Type-Options':'nosniff', 'Set-Cookie':'fileDownload=true; path=/ [;HttpOnly]'}
    # headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(contents),'Content-Disposition': 'attachment; filename=report.xlsx','Set-Cookie':'fileDownload=true; path=/'}
    return Response(contents, headerlist=list(headerList.items()))
