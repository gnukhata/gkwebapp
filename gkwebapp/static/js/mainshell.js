/*
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
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/

$(document).ready(function(){

  $(document).keydown(function(event) {
        if(event.ctrlKey && event.keyCode == 71) {
          $("#gnukhata").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 77) {
          $("#master").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 84) {
          $("#transaction").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 82) {
          $("#report").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 68) {
          $("#administration").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 72) {
          $("#help").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 76) {
          $("#logout").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 79) {
          $("#changeorg").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 81) {
          $("#quit").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 80) {
          $("#showproject").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 82) {
          $("#BRS").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 78) {
          $("#createuser").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 85) {
          $("#REMOVEuser").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 67) {
          $("#showedituser").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 76) {
          $("#showclosebooks").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 73) {
          $("#deleteorg").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 77) {
          $("#manual").click();
          event.preventDefault();
          }
        if(event.keyCode == 112) {
          $("#toolbar").click();
          event.preventDefault();
        }
        if(event.keyCode == 113) {
          $("#addaccounttb").click();
          event.preventDefault();
          }
        if(event.keyCode == 114) {
          $("#editaccount").click();
          event.preventDefault();
          }
        if(event.keyCode == 115) {
          $("#showviewledger").click();
          event.preventDefault();
          }
        if(event.keyCode == 116) {
          $("#showtrialbalance").click();
          event.preventDefault();
          }
        if(event.keyCode == 117) {
          $("#showprjstate").click();
          event.preventDefault();
          }
        if(event.keyCode == 118) {
          $("#showcashflow").click();
          event.preventDefault();
          }
        if(event.keyCode == 119) {
          $("#showbalancesheet").click();
          event.preventDefault();
          }
        if(event.keyCode == 120) {
          $("#showprofitloss").click();
          event.preventDefault();
          }
        if(event.keyCode == 121) {
          $("#fevoucher").click();
          event.preventDefault();
          }
        if(event.keyCode == 122) {
          $("#listofaccounts").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 49 || event.keyCode == 97)) {
          $("#showcontra").click();
          event.preventDefault();
        }
        if(event.ctrlKey && (event.keyCode == 50 || event.keyCode == 98)) {
          $("#showpayment").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 51 || event.keyCode == 99)) {
          $("#showreceipt").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 52 || event.keyCode == 100)) {
          $("#showjournal").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 53 || event.keyCode == 101)) {
          $("#showsales").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 54 || event.keyCode == 102)) {
          $("#showpurchase").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 55 || event.keyCode == 103)) {
          $("#showcreditnote").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 56 || event.keyCode == 104)) {
          $("#showdebitnote").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 57 || event.keyCode == 105)) {
          $("#showsalesreturn").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 48 || event.keyCode == 96)) {
          $("#showpurchasereturn").click();
          event.preventDefault();
          }
      });

      if (sessionStorage.orgt=="Not For Profit") {
        $("#showprofitloss").text("Income & Expenditure");
        $("#showbalancesheet").text("Statement of Affairs");
        $("#showcashflow").text("Receipt & Payment");
        $("#showproject").text("Project");
        $("#projecttb").text("Project - ALT+P");
        $("#showprjstate").text("Project Statement");
      }

      $.ajax({
        url: '/orgdata',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'json',
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp){
        if(resp["gkresult"]["userrole"]==1){
          $(".hideoperator").remove();
        }
        if(resp["gkresult"]["userrole"]==0){
          $(".hidemanager").remove();
        }
         if (resp["gkresult"]["booksclosedflag"]==1) {
           $(".closebooks").remove();
         }
         if (resp["gkresult"]["roflag"]==1) {
           $(".rollover").remove();
         }
         sessionStorage.setItem('booksclosedflag', resp["gkresult"]["booksclosedflag"]);
         sessionStorage.setItem('roflag', resp["gkresult"]["roflag"]);
      });

  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";
  var yeardata = "Financial Year : " + styear + " to " + enyear;

$("title").append(orname);

$("#showedituser").click(function(e){

$.ajax({
  url: '/showedituser',
  type: 'POST',
  global: false,
  async: false,
  datatype: 'text/html',
  beforeSend: function(xhr)
  {
    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
  },
  success: function(resp)
  {
    $('#info').html(resp);
  }
});
});

  $("#showeditorg").click(function (e){

    $.ajax({
      type:"POST",
      url: "/showeditOrg",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(resp)
      {
        $('#info').html(resp);
      }
    });
  });


  $('#REMOVEuser').click(function (e) {
      $.ajax(
      {

      type: "POST",
      url: "/removeuser",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#info").html(resp);
      }
      }
    );
    });

  $('#editaccount').click(function (e) {

      $.ajax(
      {

      type: "POST",
      url: "/showeditaccount",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#info").html(resp);
      }
      }
    );
    });

    $('#changeorg').click(function (e) {
      sessionStorage.clear();
      window.location.replace("/");

      });

    $('#listofaccounts').click(function (e) {
      $.ajax(
        {

        type: "POST",
        url: "/showlistofaccounts",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        success: function(resp)
        {
          $("#info").html(resp);
        }
        }
      );
      });


  $('#fevoucher').click(function (e) {

      $.ajax(
      {

      type: "POST",
      url: "/findeditvoucher",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#info").html(resp);
      }
      }
    );
    });


  if(orgdata!=""||yeardata!="")
  {
  $("#orgdata").html(orgdata);
  $("#yeardata").html(yeardata);
  }
  $('#addaccount').click(function (e) {
    $.ajax(
    {

    type: "POST",
    url: "/showaccount",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#info").html(resp);
    }
    }
  );
  });

  $('#createuser').click(function (e) {

    $.ajax({
      url: '/showuser',
      type: 'POST',
      datatype: 'text/html',

    })
    .done(function(resp) {
      $("#info").html(resp);
    })

    });


    $("#showdeletedvoucher").click(function (e){

      $.ajax({
        url: '/showdeletedvoucher',
        type: 'POST',
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        success: function(resp)
        {
          $("#info").html(resp);
        }
      });
    });


  $('#showviewledger').click(function (e) {

      $.ajax(
      {

      type: "POST",
      url: "/showviewledger",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#info").html(resp);
      }
      }
    );
    });

    $('#BRS').click(function (e) {

        $.ajax(
        {

        type: "POST",
        url: "/showviewbankrecon",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          }
        })
        .done(function(resp){
            $("#info").html(resp);
        });
      });

    $('#showprjstate').click(function (e) {

        $.ajax(
        {

        type: "POST",
        url: "/showviewprojectstatement",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        success: function(resp)
        {
          $("#info").html(resp);
        }
        }
      );
      });

  $('#showproject').click(function (e) {
    $.ajax(
    {

    type: "POST",
    url: "/showproject",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#info").html(resp);
    }
    }
  );
  });

  $("#showtrialbalance").click(function(event){
    $("#info").load("/showtrialbalance");
  });

  $("#showcashflow").click(function(event){
    $("#info").load("/showcashflow");
  });
  $("#showprofitloss").click(function(event){
    var orgtype = sessionStorage.orgt.replace(/\s/g, "+");
    $("#info").load("/showprofitloss?orgtype="+orgtype);
  });

    $("#showbalancesheet").click(function(event){
      $("#info").load("/showbalancesheet");
    });

  $("#showclosebooks").click(function(event){
    $("#info").load("/showclosebooks");
  });

  $('#addaccounttb').click(function(){
    $('#addaccount').click();
  });
  $('#findvouchertb').click(function(){
    $('#fevoucher').click();
  });
  $('#contratb').click(function(){
    $('#showcontra').click();
  });
  $('#paymenttb').click(function(){
    $('#showpayment').click();
  });
  $('#receipttb').click(function(){
    $('#showreceipt').click();
  });
  $('#journaltb').click(function(){
    $('#showjournal').click();
  });
  $('#salestb').click(function(){
    $('#showsales').click();
  });
  $('#purchasetb').click(function(){
    $('#showpurchase').click();
  });
  $('#creditnotetb').click(function(){
    $('#showcreditnote').click();
  });
  $('#debitnotetb').click(function(){
    $('#showdebitnote').click();
  });
  $('#salesreturntb').click(function(){
    $('#showsalesreturn').click();
  });
  $('#purchasereturntb').click(function(){
    $('#showpurchasereturn').click();
  });
  $('#editaccounttb').click(function(){
    $('#editaccount').click();
  });
  $('#projecttb').click(function(){
    $('#showproject').click();
  });
  $('#projecttb').click(function(){
    $('#showproject').click();
  });
  $('#brstb').click(function(){
    $('#BRS').click();
  });
  $('#ledgertb').click(function(){
    $('#showviewledger').click();
  });
  $('#trialbalancetb').click(function(){
    $('#showtrialbalance').click();
  });
  $('#projectstatementtb').click(function(){
    $('#showprjstate').click();
  });
  $('#cashflowtb').click(function(){
    $('#showcashflow').click();
  });
  $('#listofaccountstb').click(function(){
    $('#listofaccounts').click();
  });
  $('#createusertb').click(function(){
    $('#createuser').click();
  });
  $('#REMOVEusertb').click(function(){
    $('#REMOVEuser').click();
  });
  $('#changepasswordtb').click(function(){
    $('#showedituser').click();
  });
  $('#manualtb').click(function(){
    $('#manual').click();
  });
  $('#logouttb').click(function(){
    $('#logout').click();
  });
  $('#changeogtb').click(function(){
    $('#changeorg').click();
  });
  $('#orgdata').click(function(){
    $('#showeditorg').click();
  });
  $('#yeardata').click(function(){
    return false;
  });
});
