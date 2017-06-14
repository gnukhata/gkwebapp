
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
        'Prajkta Patkar' <prajakta.dff.org.in>
        "Mohd. Talha Pawaty" <mtalha456@gmail.com>
        "Abhijith Balan" <abhijithb21@openmailbox.org>
               
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

@view_config(route_name="transfernotes",request_param="action=viewlist",renderer="gkwebapp:templates/viewlistoftransfernotes.jinja2")
def viewlistoftransfernotes(request):
                header={"gktoken":request.headers["gktoken"]}
                result = requests.get("http://127.0.0.1:6543/godown", headers=header)
                goddata=[]
                for record in result.json()["gkresult"]:
                    gdata= {"godownname":str(record["goname"]),"godownid":str(record["goid"]),"godownaddress": str(record["goaddr"])}
                    goddata.append(gdata)
                transfernotes = requests.get("http://127.0.0.1:6543/transfernote?type=all", headers=header)
                return {"gkresult":goddata, "numberoftransfernotes":len(transfernotes.json()["gkresult"])}

@view_config(route_name="transfernotes",request_param="action=printlist",renderer="gkwebapp:templates/printlistoftransfernotes.jinja2")
def printlistoftransfernotes(request):
                header={"gktoken":request.headers["gktoken"]}
                startDate =str(request.params["startdate"])
                endDate =str(request.params["enddate"])
                godownname = ""
                godownaddress = ""
                goid = 0
                if request.params.has_key("goid"):
                    goid = int(request.params["goid"])
                    transfernotes = requests.get("http://127.0.0.1:6543/transfernote?type=list&startdate=%s&enddate=%s&"%(startDate, endDate),headers=header)
                    godown = requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(request.params["goid"])), headers=header)
                    godownname = godown.json()["gkresult"]["goname"]
                    godownaddress = godown.json()["gkresult"]["goaddr"]
                else:
                    transfernotes = requests.get("http://127.0.0.1:6543/transfernote?type=list&startdate=%s&enddate=%s"%(startDate, endDate),headers=header)
                return {"transfernotes":transfernotes.json()["gkresult"], "startdate":startDate, "enddate":endDate, "godownname":godownname, "godownaddress":godownaddress, "goid":goid}

@view_config(route_name="transfernotes",request_param="action=generatespreadsheet", renderer="")
def listoftransfernotesspreadsheet(request):
    header={"gktoken":request.headers["gktoken"]}
    fystart = str(request.params["fystart"]);
    fyend = str(request.params["fyend"]);
    orgname = str(request.params["orgname"])
    orgname += " (FY: " + fystart+" to "+fyend +")"
    startDate =str(request.params["startdate"])
    endDate =str(request.params["enddate"])
    godownname = ""
    godownaddress = ""
    goid = 0
    ods = ODS()
    sheet = ods.content.getSheet(0)
    sheet.setSheetName("List of Transfer Notes")
    sheet.getRow(0).setHeight("23pt")

    sheet.getCell(0,0).stringValue(orgname).setBold(True).setAlignHorizontal("center").setFontSize("16pt")
    ods.content.mergeCells(0,0,8,1)
    sheet.getRow(1).setHeight("18pt")
    sheet.getCell(0,1).stringValue("List Of Transfer Notes").setBold(True).setFontSize("14pt").setAlignHorizontal("center")
    if request.params.has_key("goid"):
        goid = int(request.params["goid"])
        transfernotes = requests.get("http://127.0.0.1:6543/transfernote?type=list&startdate=%s&enddate=%s&"%(startDate, endDate),headers=header)
        godown = requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(request.params["goid"])), headers=header)
        godownname = godown.json()["gkresult"]["goname"]
        godownaddress = godown.json()["gkresult"]["goaddr"]
        nameofgodown = "Name of Godown: "+godownname+" Godown Address: "+godownaddress
        ods.content.mergeCells(0,2,8,2)
        sheet.getRow(1).setHeight("18pt")
        sheet.getCell(0,1).stringValue(nameofgodown).setBold(True).setFontSize("14pt").setAlignHorizontal("center")
    else:
        transfernotes = requests.get("http://127.0.0.1:6543/transfernote?type=list&startdate=%s&enddate=%s"%(startDate, endDate),headers=header)
        ods.content.mergeCells(0,1,4,1)
        sheet.getColumn(1).setWidth("3cm")
        sheet.getColumn(2).setWidth("3cm")
        sheet.getColumn(3).setWidth("7cm")
        sheet.getColumn(4).setWidth("7cm")
        sheet.getColumn(5).setWidth("7cm")
        sheet.getColumn(6).setWidth("3cm")
        sheet.getColumn(7).setWidth("3cm")
        sheet.getCell(0,2).stringValue("Sr. No.").setBold(True)
        sheet.getCell(1,2).stringValue("TN No.").setBold(True)
        sheet.getCell(2,2).stringValue("Date").setBold(True)
        sheet.getCell(3,2).stringValue("Dispatched From").setBold(True)
        sheet.getCell(4,2).stringValue("To be Delivered At").setBold(True)
        sheet.getCell(5,2).stringValue("Products").setBold(True)
        sheet.getCell(6,2).stringValue("Quantity").setBold(True)
        sheet.getCell(7,2).stringValue("Status").setBold(True)
        row = 3
        for transfernote in transfernotes:
            sheet.getCell(0, row).stringValue(transfernote["srno"])
            sheet.getCell(1, row).stringValue(transfernote["transfernoteno"])
            sheet.getCell(2, row).stringValue(transfernote["transfernotedate"])
            sheet.getCell(3, row).stringValue(transfernote["fromgodown"])
            sheet.getCell(4, row).stringValue(transfernote["togodown"])
            if len(transfernote["products"]) == 1:
                sheet.getCell(5, row).stringValue(transfernote["products"][0])
            else:
                sheet.getCell(5, row).stringValue(transfernote["products"][0] + len(transfernote["products"][0]))
            sheet.getCell(5, row).stringValue(stock["unitname"])
            sheet.getCell(6, row).stringValue(stock["unitname"])
            sheet.getCell(7, row).stringValue(stock["unitname"])
            row += 1

    ods.save("response.ods")
    repFile = open("response.ods")
    rep = repFile.read()
    repFile.close()
    headerList = {'Content-Type':'application/vnd.oasis.opendocument.spreadsheet ods' ,'Content-Length': len(rep),'Content-Disposition': 'attachment; filename=report.ods', 'Set-Cookie':'fileDownload=true; path=/'}
    os.remove("response.ods")
    return Response(rep, headerlist=headerList.items())

@view_config(route_name="transfernotes",request_param="action=showlist",renderer="gkwebapp:templates/listoftransfernotes.jinja2")
def showlistoftransfernotes(request):
                header={"gktoken":request.headers["gktoken"]}
                startDate =str(request.params["startdate"])
                endDate =str(request.params["enddate"])
                godownname = ""
                godownaddress = ""
                goid = 0
                if request.params.has_key("goid"):
                    goid = int(request.params["goid"])
                    transfernotes = requests.get("http://127.0.0.1:6543/transfernote?type=list&startdate=%s&enddate=%s&"%(startDate, endDate),headers=header)
                    godown = requests.get("http://127.0.0.1:6543/godown?qty=single&goid=%d"%(int(request.params["goid"])), headers=header)
                    godownname = godown.json()["gkresult"]["goname"]
                    godownaddress = godown.json()["gkresult"]["goaddr"]
                else:
                    transfernotes = requests.get("http://127.0.0.1:6543/transfernote?type=list&startdate=%s&enddate=%s"%(startDate, endDate),headers=header)
                return {"transfernotes":transfernotes.json()["gkresult"], "startdate":startDate, "enddate":endDate, "godownname":godownname, "godownaddress":godownaddress, "goid":goid}

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
                
                if request.params.has_key("duedate"):
                    transferdata["duedate"]=request.params["duedate"]
                if request.params.has_key("grace"):
                    transferdata["grace"]=request.params["grace"]
                
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
                "tableset":tableset,"transfernoteno":request.params["transfernoteno"],"transfernotedate":request.params["transfernotedate"],"receiveddate":request.params["receiveddate"],"duedate":request.params["duedate"],"grace":request.params["grace"],
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
