
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
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@dff.org.in>
"Arun Kelkar" <arunkelkar@dff.org.in>
'Abhijith Balan'<abhijith@dff.org.in>
'Prajkta Patkar'<prajakta@dff.org.in>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response
from pyramid.response import Response
import base64
import os
'''
This function brings data of unpaid bills and unadjusted amounts.
This could be either called after a voucher is created or from the Unadjusted Amounts module.
If accountcode is received it must have been called after voucher entry. In this case we retrieve custid from backend by sending accountcode and then get the bill details by sending the custid.
In case of unadjusted amounts module custid is received instead of account code and bill details are subsequently fetched.
The details of bills, sum of invoice and pending amounts and custid are then returned.
'''

@view_config(route_name="billwise", request_param = "type=vchbillwise", renderer="gkwebapp:templates/billwiseaccounting.jinja2")
def getBillTable(request):
    header={"gktoken":request.headers["gktoken"]}
    accountcode = int(request.params["accountcode"])
    voucherdate = request.params["voucherdate"]
    voucherdate = datetime.strptime(voucherdate, "%d%m%Y")
    result = requests.get("http://127.0.0.1:6543/customersupplier?by=account&accountcode=%d"%accountcode, headers=header)
    if result.json()["gkstatus"] == 0:
        custid = result.json()["gkresult"]
        customer = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%custid, headers=header)
        customerdetails = customer.json()["gkresult"]
        billdetails = requests.get("http://127.0.0.1:6543/invoice?type=bwa&custid=%d"%custid, headers=header)
        unpaidbills = []
        sumofinvoiceamounts = 0.00
        sumofpendingamounts = 0.00
        if billdetails.json()["gkstatus"] == 0:
            for bill in billdetails.json()["gkresult"]["unpaidbills"]:
                invoicedate = bill["invoicedate"]
                invoicedate = datetime.strptime(invoicedate, "%d-%m-%Y")
                if invoicedate <= voucherdate:
                    sumofinvoiceamounts = sumofinvoiceamounts + float(bill["invoicetotal"])
                    sumofpendingamounts = sumofpendingamounts + float(bill["pendingamount"])
                    unpaidbills.append(bill)
            return {"gkstatus":result.json()["gkstatus"], "gkresult":unpaidbills, "sumofinvoiceamounts":sumofinvoiceamounts, "sumofpendingamounts":sumofpendingamounts, "custid":custid, "vouchercode":request.params["vouchercode"]}
    return {"gkresult":[]}
    """
    elif request.params.has_key("custid"):
        custid = int(request.params["custid"])
        customer = requests.get("http://127.0.0.1:6543/customersupplier?qty=single&custid=%d"%custid, headers=header)
        customerdetails = customer.json()["gkresult"]
        billdetails = requests.get("http://127.0.0.1:6543/invoice?type=bwa&custid=%d"%custid, headers=header)
        unpaidbills = []
        sumofinvoiceamounts = 0.00
        sumofpendingamounts = 0.00
        if billdetails.json()["gkstatus"] == 0:
            for bill in billdetails.json()["gkresult"]["unpaidbills"]:
                sumofinvoiceamounts = sumofinvoiceamounts + float(bill["invoicetotal"])
                sumofpendingamounts = sumofpendingamounts + float(bill["pendingamount"])
                unpaidbills.append(bill)
            return {"gkstatus":customer.json()["gkstatus"], "gkresult":unpaidbills, "sumofinvoiceamounts":sumofinvoiceamounts, "sumofpendingamounts":sumofpendingamounts, "custid":custid, "onaccount":"%.2f"%customerdetails["onaccamt"], "asadvance":"%.2f"%customerdetails["advamt"]}
        return {"gkresult":[]}
    else:
        return {"gkresult":[]}

"""
'''
The below function calls a function in API for invoice that updates the amount paid field in invoice table and advamt and onaccamt fields in customersupplier table.
It receives a list of dictionaries.
It contains a flag(payflag) to check for the type of payment. It could be settlement of a bill(payflag=2), advance payment(payflag=1) of amount or amount set as on account(payflag=15).
For advance and on account payments an additional flag(icflag) is also sent which tells the API whether to increment organisation decrement the advamt or onaccamt fields.
Each dictionary also has custid(id of customer or supplier) and amount.
'''
@view_config(route_name="billwise", request_param="action=updatepayment", renderer="json")
def updatepayment(request):
    header={"gktoken":request.headers["gktoken"]}
    payments = json.loads(request.params["billwisedata"])
    dataset = {"adjbills":payments}
    result = requests.post("http://127.0.0.1:6543/billwise",data=json.dumps(dataset),headers = header)
    return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="billwise", request_param = "action=showcustomersupplierlist", renderer="gkwebapp:templates/customersupplierlist.jinja2")
def getCustomerSupplierList(request):
    header={"gktoken":request.headers["gktoken"]}
    customers = requests.get("http://127.0.0.1:6543/customersupplier?qty=custall", headers=header)
    suppliers = requests.get("http://127.0.0.1:6543/customersupplier?qty=supall", headers=header)
    return {"customers": customers.json()["gkresult"], "suppliers": suppliers.json()["gkresult"]}

@view_config(route_name="billwise", request_param = "action=showunadjustedamounts", renderer="gkwebapp:templates/unadjustedamount.jinja2")
def getunadjustedamounts(request):
    header={"gktoken":request.headers["gktoken"]}
    unadjustedamounts = requests.get("http://127.0.0.1:6543/billwise?csid=%d&csflag=%d"%(int(request.params["csid"]), int(request.params["csflag"])), headers=header)
    invs = unadjustedamounts.json()["invoices"]
    totalinv = 0.00
    totalamtpending = 0.00
    for inv in invs:
        totalinv = totalinv + float(inv["invoiceamount"])
        totalamtpending = totalamtpending + float(inv["balanceamount"])
        
    return {"invoices":invs, "vouchers":unadjustedamounts.json()["vouchers"],"totalinv":"%.2f"%(totalinv),"totalamtpending":"%.2f"%(totalamtpending)}

@view_config(route_name="billwise", request_param = "action=viewlistofunpaidinvoices", renderer="gkwebapp:templates/viewlistofunpaidinvoices.jinja2")
def viewListofInvoices(request):
    header={"gktoken":request.headers["gktoken"]}
    invoices = requests.get("http://127.0.0.1:6543/billwise?type=all",headers=header)
    return {"status":True,"numberofinvoices":len(invoices.json()["invoices"])}

@view_config(route_name="billwise", request_param="action=showlist", renderer="gkwebapp:templates/listofunpaidinvoices.jinja2")
def listofUnpaidInvoices(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/billwise?type=onlybillsforall&inoutflag=%d&orderflag=%d&typeflag=%d&startdate=%s&enddate=%s"%(int(request.params["inoutflag"]), int(request.params["orderflag"]),int(request.params["typeflag"]), request.params["fromdate"], request.params["todate"]), headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["invoices"], "inoutflag":int(request.params["inoutflag"]), "orderflag": request.params["orderflag"], "typeflag": request.params["typeflag"], "fromdate": request.params["fromdate"], "todate": request.params["todate"]}

@view_config(route_name="billwise", request_param="action=printlist", renderer="gkwebapp:templates/printlistofunpaidinvoices.jinja2")
def printListofUnpaidInvoices(request):
    header={"gktoken":request.headers["gktoken"]}
    result = requests.get("http://127.0.0.1:6543/billwise?type=onlybillsforall&inoutflag=%d&orderflag=%d&typeflag=%d&startdate=%s&enddate=%s"%(int(request.params["inoutflag"]), int(request.params["orderflag"]),int(request.params["typeflag"]), request.params["fromdate"], request.params["todate"]), headers=header)
    return {"gkstatus":result.json()["gkstatus"], "gkresult": result.json()["invoices"], "inoutflag":int(request.params["inoutflag"]), "orderflag": request.params["orderflag"], "typeflag": request.params["typeflag"], "fromdate": request.params["fromdate"], "todate": request.params["todate"]}

@view_config(route_name="billwise", request_param="type=spreadsheet", renderer="")
def unpaidInvoicesSpreadsheet(request):
    try:
        header={"gktoken":request.headers["gktoken"]}
        result = requests.get("http://127.0.0.1:6543/billwise?type=spreadsheet&inoutflag=%d&typeflag=%d&orderflag=%d&startdate=%s&enddate=%s"%(int(request.params["inoutflag"]), int(request.params["typeflag"]), int(request.params["orderflag"]), request.params["fromdate"], request.params["todate"]), headers=header)
        invoices = result.json()["gkdata"]
        invoices_str = base64.b64decode(invoices)
        xlsxfile = open("report.xlsx","w")
        xlsxfile.write(invoices_str)
        xlsxfile.close()
        xlsxfile = open("report.xlsx","r")
        reportxslx = xlsxfile.read()
        headerList = {'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,'Content-Length': len(reportxslx),'Content-Disposition': 'attachment; filename=report.xlsx', 'Set-Cookie':'fileDownload=true; path=/'}
        xlsxfile.close()
        os.remove("report.xlsx")
        return Response(reportxslx, headerlist=headerList.items())
    except:
        print "file not found"
        return {"gkstatus":3}
