/*
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
   "Karan Kamdar" <kamdar.karan@gmail.com>
   "Prajkta Patkar" <prajkta@riseup.com>
   "Abhijith Balan" <abhijith@dff.org.in>
   "Rohan khairnar" <rohankhairnar@gmail.com>
 */
// This js is use in createbudget.jinja2 file
$(document).ready(function(){
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    if (sessionStorage.orgt=="Not For Profit") {
        // If orgtype is Not for Profit than some heading and menu items text is changed.
        $('#profitlossname').text("Income and Expenditure Budget Report");
    }
    else{
        $('#profitlossname').text("Profit and Loss");
    }
    $("#back").click(function(e){
        if($("#menuflag").val() == 2){
            $.ajax({
                url: '/budget?type=viewbudgetreportpage',
                type: 'POST',
                global: false,
                async: false,
                datatype: 'text/html',
                data: {"menuflag":2},
                beforeSend: function(xhr)
                {
                  xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
              })
               .done(function(resp) {
                 $("#info").html(resp);
               });
        }
        else{
            $("a[href ='#budget_report']").click();
        }
    });
    $("#printversion").click(function(e){
      $.ajax({
        type: "POST",
        url: "/budget?type=printreport",
        global: false,
        async: false,
        datatype: "json",
        data: {"buddetails":$("#budgetdetails").text(),"budid":$("#budid").val(),"financialstart":sessionStorage.yyyymmddyear1,"btype":$("#btype").val(),"menuflag":$("#menuflag").val()},
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
        success: function(resp) {
            if($("#menuflag").val() == '2'){
                $("#info").html(resp);
            }
            else{
            $("#viewreportpage").hide();
            $("#foot").hide();
            $("#reportpage").html("");
            $("#printreportpage").html(resp).show();
            }
        }
    });
    });
    $("#spreadsheet").click(function(e){
        // event.preventDefault();
        var xhr = new XMLHttpRequest();
        if($("#btype").val() == 3){
            xhr.open('GET', '/budget?type=cashspreadsheet&budgetdetails='+$("#budgetdetails").text()+'&financialstart='+sessionStorage.yyyymmddyear1+'&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2')+'&budid=' + $("#budid").val(), true);
        }
        if($("#btype").val() == 16){
            xhr.open('GET', '/budget?type=pnlspreadsheet&budgetdetails='+$("#budgetdetails").text()+'&orgtype='+sessionStorage.orgt+'&financialstart='+sessionStorage.yyyymmddyear1+'&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2')+'&budid=' + $("#budid").val(), true);            
        }
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        xhr.responseType = 'blob';

        xhr.onload = function(e) {
        if (this.status == 200) {
        // get binary data as a response
        var blob = this.response;
        let windowURL = window.webkitURL || window.URL;
        var dwelement = document.createElement('a');
        let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        dwelement.download = "Budget.xlsx";
        dwelement.href = windowURL.createObjectURL(blob);
        dwelement.textContent = 'Download Sheet';
        dwelement.dataset.downloadurl = [contentType, dwelement.download, dwelement.href].join(':');
        dwelement.click();
        }
      };

      xhr.send();
    });
    oninvoice = 0;
     $("#loaprint").click(function(event) {
      $("title").html("GNUKhata")
       window.print();
     });
     $("#loaback").click(function(event){
        $.ajax({
        type: "POST",
        url: "/budget?type=report",
        global: false,
        async: false,
        datatype: "json",
        data: {"buddetails":$("#printbudgetdetails").text(),"budid": $("#printbudid").val(),"financialstart":sessionStorage.yyyymmddyear1,"btype":$("#printbtype").val(),"menuflag":$("#menuflag").val()},
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
        success: function(resp) {
            if($("#menuflag").val() == '2'){
                $("#info").html(resp);
            }
            else{
            $("#viewreportpage").hide();
            $("#foot").hide();
            $("#reportpage").html(resp).show();
            $("#printreportpage").html("");
            }
        }
    });
     });
});