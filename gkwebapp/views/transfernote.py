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
	"Sachin Patil" <sachpatil@openmailbox.org>
"""
from pyramid.view import view_config
import requests, json
from datetime import datetime
from pyramid.renderers import render_to_response

@view_config(route_name="transfernotes",renderer="gkwebapp:templates/transfernote.jinja2")
def showtransfernote(request):
		return {"status":True}

@view_config(route_name="transfernotes",request_param="action=showadd",renderer="gkwebapp:templates/createtransfernote.jinja2")
def showcreatetransfernote(request):
		header={"gktoken":request.headers["gktoken"]}
		products = requests.get("http://127.0.0.1:6543/products", headers=header)
		godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
		return {"products": products.json()["gkresult"],"godowns":godowns.json()["gkresult"]}

@view_config(route_name="transfernotes",request_param="action=showedit",renderer="gkwebapp:templates/edittransfernote.jinja2")
def showedittransfernote(request):
		header={"gktoken":request.headers["gktoken"]}
		products = requests.get("http://127.0.0.1:6543/products", headers=header)
		godowns = requests.get("http://127.0.0.1:6543/godown", headers=header)
		transfernote = requests.get("http://127.0.0.1:6543/transfernote?tn=all",headers=header)
		return {"products": products.json()["gkresult"],"godowns":godowns.json()["gkresult"],"transfernote":transfernote.json()["gkresult"]}

@view_config(route_name="transfernotes",request_param="action=get",renderer="json")
def gettransfernote(request):
		header={"gktoken":request.headers["gktoken"]}
		result = requests.get("http://127.0.0.1:6543/transfernote?tn=single&transfernoteid=%d"%(int(request.params["transfernoteid"])), headers=header)
		return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}



@view_config(route_name="transfernotes",request_param="action=save",renderer="json")
def savetransfernote(request):
		header={"gktoken":request.headers["gktoken"]}
		transferdata = {"transfernoteno":request.params["transfernoteno"],"transfernotedate":request.params["transfernotedate"],"togodown":request.params["togodown"],"transportationmode":request.params["transportationmode"],"issuername":request.params["issuername"],"designation":request.params["designation"]}
		if request.params["nopkt"]!='':
			transferdata["nopkt"]=request.params["nopkt"]
		products = {}
		for  row in json.loads(request.params["products"]):
			products[row["productcode"]] = row["qty"]
		stockdata = {"goid":request.params["fromgodown"],"items":products}
		tnwholedata = {"transferdata":transferdata,"stockdata":stockdata}
		result=requests.post("http://127.0.0.1:6543/transfernote",data=json.dumps(tnwholedata),headers=header)
		return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="transfernotes",request_param="action=edit",renderer="json")
def edittransfernote(request):
		header={"gktoken":request.headers["gktoken"]}
		transferdata = {"transfernoteno":request.params["transfernoteno"],"transfernotedate":request.params["transfernotedate"],"transfernoteid":request.params["transfernoteid"],"togodown":request.params["togodown"],"transportationmode":request.params["transportationmode"],"issuername":request.params["issuername"],"designation":request.params["designation"]}
		if request.params["nopkt"]!='':
			transferdata["nopkt"]=request.params["nopkt"]
		products = {}
		for  row in json.loads(request.params["products"]):
			products[row["productcode"]] = row["qty"]
		stockdata = {"goid":request.params["fromgodown"],"items":products}
		tnwholedata = {"transferdata":transferdata,"stockdata":stockdata}
		result=requests.put("http://127.0.0.1:6543/transfernote",data=json.dumps(tnwholedata),headers=header)
		return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="transfernotes", request_param="action=delete",renderer="json")
def deltransfernotes(request):
		header={"gktoken":request.headers["gktoken"]}
		dataset={"transfernoteid":int(request.params["transfernoteid"])}
		result = requests.delete("http://127.0.0.1:6543/transfernote",data =json.dumps(dataset), headers=header)
		return {"gkstatus":result.json()["gkstatus"]}
