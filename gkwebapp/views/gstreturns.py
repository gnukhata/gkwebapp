import os
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
    result = requests.get("http://127.0.0.1:6543/gstreturns",
                          headers=header,
                          params=params)
    result = result.json()
    result["gkdata"]["report_type"] = "r1"
    result["gkdata"]["startdate"] = params["start"]
    result["gkdata"]["enddate"] = params["end"]
    return result["gkdata"]


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

    wb.save('report.xlsx')
    xlsxfile = open("report.xlsx", "r")
    reportxslx = xlsxfile.read()
    headerList = {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Length': len(reportxslx),
        'Content-Disposition': 'attachment; filename=report.xlsx',
        'Set-Cookie': 'fileDownload=true; path=/'
    }
    xlsxfile.close()
    os.remove("report.xlsx")
    return Response(reportxslx, headerlist=headerList.items())
