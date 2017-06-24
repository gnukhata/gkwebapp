
"""
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
'Rohini Baraskar' <robaraskar@gmail.com>
'Prajkta Patkar'<prajakta@dff.org.in>
"""

from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

'''
This function brings data of unpaid bills and unadjusted amounts.
This could be either called after a voucher is created or from the Unadjusted Amounts module.
If accountcode is received it must have been called after voucher entry. In this case we retrieve custid from backend by sending accountcode and then get the bill details by sending the custid.
In case of unadjusted amounts module custid is received instead of account code and bill details are subsequently fetched.
The details of bills, sum of invoice and pending amounts and custid are then returned.
'''

@view_config(route_name="billwise", request_param = "type=showbillwisetable", renderer="gkwebapp:templates/billwiseaccounting.jinja2")
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
            return {"gkstatus":result.json()["gkstatus"], "gkresult":unpaidbills, "sumofinvoiceamounts":sumofinvoiceamounts, "sumofpendingamounts":sumofpendingamounts, "custid":custid, "onaccount":"%.2f"%customerdetails["onaccamt"], "asadvance":"%.2f"%customerdetails["advamt"]}
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
