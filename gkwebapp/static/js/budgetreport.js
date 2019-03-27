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
    $("#back").click(function(e){
        if($("#menuflag").val() == 2){
            $("#showviewbudget").click();
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
        if($("#btype").val() == 5){
            xhr.open('GET', '/budget?type=expensespreadsheet&budgetdetails='+$("#budgetdetails").text()+'&financialstart='+sessionStorage.yyyymmddyear1+'&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2')+'&budid=' + $("#budid").val(), true);            
        }
        if($("#btype").val() == 19){
            xhr.open('GET', '/budget?type=salesspreadsheet&budgetdetails='+$("#budgetdetails").text()+'&financialstart='+sessionStorage.yyyymmddyear1+'&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2')+'&budid=' + $("#budid").val(), true);            
        }
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        xhr.responseType = 'blob';

        xhr.onload = function(e) {
        if (this.status == 200) {
        // get binary data as a response
          var blob = this.response;
          var url = window.URL.createObjectURL(blob);
          window.location.assign(url)
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