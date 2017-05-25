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
        "Ishan Masdekar " <imasdekar@dff.org.in>
        "Navin Karkera" <navin@dff.org.in>
        "Sachin Patil" <sachpatil@openmailbox.org>
        "Mohd. Talha Pawaty" <mtalha456@gmail.com>
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



@view_config(route_name="transfernotes",request_param="action=showreceived",renderer="gkwebapp:templates/receivedtransfernote.jinja2")
def showreceivedtransfernote(request):
                header={"gktoken":request.headers["gktoken"]}
                transfernote = requests.get("http://127.0.0.1:6543/transfernote?tn=all",headers=header)
                return {"transfernote":transfernote.json()["gkresult"]}

@view_config(route_name="transfernotes",request_param="action=get",renderer="json")
def gettransfernote(request):
                header={"gktoken":request.headers["gktoken"]}
                result = requests.get("http://127.0.0.1:6543/transfernote?tn=single&transfernoteid=%d"%(int(request.params["transfernoteid"])), headers=header)
                return {"gkstatus": result.json()["gkstatus"], "gkresult": result.json()["gkresult"]}



@view_config(route_name="transfernotes",request_param="action=save",renderer="json")
def savetransfernote(request):
                header={"gktoken":request.headers["gktoken"]}
                transferdata = {"transfernoteno":request.params["transfernoteno"],"transfernotedate":request.params["transfernotedate"],"togodown":request.params["togodown"],"fromgodown":request.params["fromgodown"],"transportationmode":request.params["transportationmode"],"issuername":request.params["issuername"],"designation":request.params["designation"]}
                if request.params["nopkt"]!='':
                        transferdata["nopkt"]=request.params["nopkt"]
                products = {}
                for  row in json.loads(request.params["products"]):
                        products[row["productcode"]] = row["qty"]
                stockdata = {"items":products}
                tnwholedata = {"transferdata":transferdata,"stockdata":stockdata}
                result=requests.post("http://127.0.0.1:6543/transfernote",data=json.dumps(tnwholedata),headers=header)
                return {"gkstatus":result.json()["gkstatus"]}



@view_config(route_name="transfernotes",request_param="action=received",renderer="json")
def recieved(request):
                header={"gktoken":request.headers["gktoken"]}
                dataset={"transfernoteid":int(request.params["transfernoteid"]),"recieveddate":request.params["receiveddate"]}
                result=requests.put("http://127.0.0.1:6543/transfernote?received=true",data=json.dumps(dataset),headers=header)
                return {"gkstatus":result.json()["gkstatus"]}

@view_config(route_name="transfernotes",request_param="action=print",renderer="gkwebapp:templates/printtransfernote.jinja2")
def tnprint(request):
        header={"gktoken":request.headers["gktoken"]}
        org = requests.get("http://127.0.0.1:6543/organisation", headers=header)
        fromgodown=requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(request.params["fromgodown"])), headers=header)
        togodown=requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(request.params["togodown"])), headers=header)
        tableset = json.loads(request.params["printset"])
        
        return {"gkstatus":org.json()["gkstatus"],"org":org.json()["gkdata"],
                "tableset":tableset,"transfernoteno":request.params["transfernoteno"],"transfernotedate":request.params["transfernotedate"],"receiveddate":request.params["receiveddate"],
        "togodown":togodown.json()["gkresult"],"transportationmode":request.params["transportationmode"],"issuername":request.params["issuername"],
        "designation":request.params["designation"],"nopkt":request.params["nopkt"],"fromgodown":fromgodown.json()["gkresult"]}

@view_config(route_name="transfernotes",request_param="action=getprod",renderer="json")
def getproductsFromGodown(request):
                header={"gktoken":request.headers["gktoken"]}
                result = requests.get("http://127.0.0.1:6543/products?from=godown&godownid=%d"%int(request.params["godownid"]),headers=header)
                proddata = []
                for record in result.json()["gkresult"]:
                        product = requests.get("http://127.0.0.1:6543/products?qty=single&productcode=%d"%(int(record["productcode"])), headers=header)
                        pdata= {"productcode":str(product.json()["gkresult"]["productcode"]),"productdesc":str(product.json()["gkresult"]["productdesc"])}
                        proddata.append(pdata)
                return {"gkstatus": result.json()["gkstatus"], "products": proddata}

@view_config(route_name="transfernotes",request_param="type=stock",renderer="json")
def showstockreport(request):
        header={"gktoken":request.headers["gktoken"]}
        goid = int(request.params["goid"])
        productcode = int(request.params["productcode"])
        scalculateto = request.params["endDate"]
        result = requests.get("http://127.0.0.1:6543/report?godownwisestockonhand&type=pg&goid=%d&productcode=%d&enddate=%s"%(goid, productcode, scalculateto),headers=header)
        return {"gkresult":result.json()["gkresult"][0]["balance"]}


@view_config(route_name="transfernotes",request_param="action=getgodowns", renderer="json")
def listofgodowns(request):
        header={"gktoken":request.headers["gktoken"]}
        result = requests.get("http://127.0.0.1:6543/godown?type=togodown", headers=header)
        goddata=[]
        for record in result.json()["gkresult"]:
                gdata= {"goid": str(record["goid"]), "goname" : str(record["goname"]), "goaddr": str(record["goaddr"])}
                goddata.append(gdata)
        return {"gkstatus": result.json()["gkstatus"], "godowns":goddata}
