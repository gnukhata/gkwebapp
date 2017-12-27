/*
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
   "Krishnakant Mane" <kk@gmail.com>
   "Ishan Masdekar " <imasdekar@dff.org.in>
   "Navin Karkera" <navin@dff.org.in>
   "Bhavesh Bawadhane" <bbhavesh07@gmail.com>
   "Dinesh Sutar" <dinesh.sutar@openmailbox.org>
   "Abhijith Balan" <abhijithb21@openmailbox.org>
   "Parabjyot Singh" <parabjyot1996@gmail.com>
   "Rahul Chaurasiya" <crahul4133@gmail.com>
   "Mohd. Talha Pawaty" <mtalha456@gmail.com>
   "prajkta Patkar" <prajakta@dff.org.in>
   "Reshma Bhatawadekar" <reshma@dff.org.in>
 */
// This script is for the mainshell page and loads when the main page of GNUKhata is loaded.
// Also all the external js libraries we have used is loaded along with the mainshell.
$(document).ready(function(){
var username1;
var userrole1;
  $('.modal-backdrop').remove();

  //Checking flags set according organisation preferences.
  // For Accounting Only invflag=0, invsflag=0 and billflag=0. Inventory Menu, Invoice, Cash Memo and related Reports are hidden.
  // For Invoicing Only invflag=0, invsflag=1 and billflag=0. Inventory Menu is hidden and  sub-menus which are 'Category', 'Product/Service' and 'Unit of Measurement' under 'Master' menu.
  // For Invoicing with Billwise Accounting invflag=0, invsflag=1 and billflag=1. Inventory Menu is hidden. Sub-menus viz., 'Category', 'Product/Service' and 'Unit of Measurement' are added under Master Menu. Also Unadjusted sub-menu is added under Voucher for Billwise Accounting.
  // For Inventory with Invoicing and Billwise Accounting invflag=1, invsflag=1 and billflag=1. It includes Inventory, Billwise Accounting, Invoicing and extra sub-menus(viz., 'Category', 'Product/Service' and 'Unit of Measurement') will be removed from Master menu.
    if(sessionStorage.invflag==0 && sessionStorage.invsflag==0 && sessionStorage.billflag==0) {
      $(".productinmaster").hide();
      $(".categoryinmaster").hide();
      $(".uominmaster").hide();
      $('.inventorymenu').hide();
      $('.invsbill').hide();
      $("#customersupplier").hide();
      $(".inventory_hide").hide();
      $("#showbillwiseaccounting").hide();
      $(".invoicemenu").hide();
    }

    if(sessionStorage.invflag==0 && sessionStorage.invsflag==1 && sessionStorage.billflag==0) {
        $('.invoicemenu').show();
        $(".productinmaster").show();
      	$(".categoryinmaster").show();
        $(".uominmaster").show();
        $(".inventorymenu").hide();
        $('.inventory_hide').hide();
        $("#showbillwiseaccounting").hide();
    }

    if(sessionStorage.invflag==0 && sessionStorage.invsflag==1 && sessionStorage.billflag==1) {
      $(".productinmaster").show();
      $(".categoryinmaster").show();
      $("#customersupplier").show();
      $(".uominmaster").show();
      $("#showbillwiseaccounting").show();
      $('.inventorymenu').hide();
    	$('.inventory_hide').hide();
    }

    if(sessionStorage.invflag==1 && sessionStorage.invsflag==1 && sessionStorage.billflag==1) {
      $('.inventorymenu').show();
      $('.invsbill').show();
      $("#customersupplier").show();
      $('.inventory_hide').show();
      $("#showbillwiseaccounting").show();
      $(".productinmaster").hide();
      $(".categoryinmaster").hide();
      $(".uominmaster").hide();
    }

  if (sessionStorage.reload == 1)// The mainshell when loads for the first time its reloaded so that the javascript file can be fully loaded.
    {
      sessionStorage.reload = 0;
      location.reload();
    }
  var oninvoice = 0;// This variable is set to 1 only when its in the print page of invoice, cashmemo or deliverychallan or transfernote. Reason: The organisation details that appear in all print pages of GNUKhata is not required in the pages where its set to 1.
  $("#msspinmodal").modal("hide"); //Hides the loading spinner.
  $("#bootstrap").attr('href', '../static/css/'+sessionStorage.gktheme+'.min.css');// set the theme depending on users previous choice.
  $("#"+sessionStorage.gktheme+"span").show();

  $(document).keydown(function(event) {
    // Shortcuts
    if(event.ctrlKey && event.keyCode == 83) {
      $("#signout").click();
      event.preventDefault();
    }

    if(event.ctrlKey && event.keyCode == 77) {
      $("#master").click();
      event.preventDefault();
    }
    if(event.ctrlKey && event.keyCode == 73) {
      $("#inventory").click();
      event.preventDefault();
    }
    if(event.ctrlKey && event.keyCode == 86) {
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
    if(event.altKey && event.keyCode == 67) {
      $("#showproject").click();
      event.preventDefault();
    }
    if(event.altKey && event.keyCode == 76) {
      $("#showclosebooks").click();
      event.preventDefault();
    }
    if(event.altKey && event.keyCode == 77) {
      $("#manual").click();
      event.preventDefault();
    }
    if(event.ctrlKey && event.keyCode == 71) {
      $("#lang").click();
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
    if(event.keyCode == 122) {
      $("#showviewledger").click();
      event.preventDefault();
    }
    if(event.keyCode == 123) {
      $("#showtrialbalance").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 53||event.keyCode == 101)) {
      $("#showprjstate").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 54||event.keyCode == 102)) {
      $("#showcashflow").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 56||event.keyCode == 104)) {
      $("#showbalancesheet").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 57||event.keyCode == 105)) {
      $("#showprofitloss").click();
      event.preventDefault();
    }
    if(event.keyCode == 121) {
      $("#fevoucher").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 55||event.keyCode == 103)) {
      $("#listofaccounts").click();
      event.preventDefault();
    }
    if(event.keyCode == 119) {
      $("#showcontra").click();
      event.preventDefault();
    }
    if(event.keyCode == 116) {
      $("#showpayment").click();
      event.preventDefault();
    }
    if(event.keyCode == 115) {
      $("#showreceipt").click();
      event.preventDefault();
    }
    if(event.keyCode == 120) {
      $("#showjournal").click();
      event.preventDefault();
    }
    if(event.keyCode == 117) {
      $("#showsales").click();
      event.preventDefault();
    }
    if(event.keyCode == 118) {
      $("#showpurchase").click();
      event.preventDefault();
    }
    if(event.ctrlKey &&  event.keyCode == 66) {
      event.preventDefault();
      $("#newt").focus();
      var e = jQuery.Event("keydown");
      e.which = 13; // # Some key code value
      $("#newt").trigger(e);
    }
    if(event.ctrlKey && (event.keyCode == 51 || event.keyCode == 99)) {
      $("#showcreditnote").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 52 || event.keyCode == 100)) {
      $("#showdebitnote").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 49 || event.keyCode == 97)) {
      $("#showsalesreturn").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 50 || event.keyCode == 98)) {
      $("#showpurchasereturn").click();
      event.preventDefault();
    }
    if (event.ctrlKey && event.keyCode == 192) {
      $(".search").children(".form-control").focus();
    }
    if (event.ctrlKey && event.keyCode == 192) {
      $(".search").children(".form-control:first").focus();
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 192) {
      $(".search").children(".form-control:last").focus();
    }
  });
  $(".mastermenu").keydown(function(event){
    // Navigation between menu items.
    if(event.which == 39){
      if (sessionStorage.invflag ==1)// if inventory is activated then on right arrow key inventory menu is selected.
        {
          $("#inventory").click();
        }
      else// else transaction menu is selected.
        {
          $("#transaction").click();
        }
    }
    if(event.which == 37){// left arrow will select toolbar.
      $("#toolbar").click();
    }
  });
  $(".inventorymenu").keydown(function(event){
    // As mentioned above left right arrow navigation for menu items.
    if(event.which == 39){
      $("#transaction").click();
    }
    if(event.which == 37){
      $("#master").click();
    }
  });
  $(".transactionmenu").keydown(function(event){
    if(event.which == 39){
      $("#report").click();
    }
    if(event.which == 37){
      if (sessionStorage.invflag ==1)
        {
          $("#inventory").click();
        }
      else
        {
          $("#master").click();
        }
    }
  });
  $(".reportmenu").keydown(function(event){
    if(event.which == 39){
      $("#administration").click();
    }
    if(event.which == 37){
      $("#transaction").click();
    }
  });
  $(".administrationmenu").keydown(function(event){
    if(event.which == 39){
      $("#help").click();
    }
    if(event.which == 37){
      $("#report").click();
    }
  });
  $(".helpmenu").keydown(function(event){
    if(event.which == 39){
      $("#newt").focus();
    }
    if(event.which == 37){
      $("#administration").click();
    }
  });
  $(".newtabmenu").keydown(function(event){
    if(event.which == 39){
      $("#signout").click();
    }
    if(event.which == 13){
      $("#newt").click();
    }
    if(event.which == 37){
      $("#help").click();
    }
  });
  $(".signoutmenu").keydown(function(event){
    if(event.which == 39){
      $("#themes").click();
    }
    if(event.which == 37){
      $("#newt").focus();
    }
  });
  $(".themesmenu").keydown(function(event){
    if(event.which == 39){

      $("#lang").click();
    }
    if(event.which == 37){

      $("#signout").click();
    }
  });
  $("#themes").keydown(function(event){
    if(event.which == 39){

      $("#lang").click();
    }
    if(event.which == 37){
      $("#signout").click();
    }
  });
  $(".langmenu").keydown(function(event){
    if(event.which == 39){

      $("#toolbar").click();
    }
    if(event.which == 37){

      $("#themes").click();
    }
  });


  $(".toolbarmenu").keydown(function(event){
    if(event.which == 39){
      $("#master").click();
    }
    if(event.which == 37){
      $("#lang").click();
    }
  });

      //default focuses on first option of dropdowns.
  $('#masterdropdown').on('shown.bs.dropdown', function () {
    $("#addaccount").focus();
  });
  $('#inventorydropdown').on('shown.bs.dropdown', function () {
    $("#product").focus();
  });
  $('#transactiondropdown').on('shown.bs.dropdown', function () {
    $("#showreceipt").focus();
  });
  $('#reportdropdown').on('shown.bs.dropdown', function () {
    $("#addaccount").focus();
  });
  $('#inventorydropdown').on('shown.bs.dropdown', function () {
    $("#product").focus();
  });
  $('#transactiondropdown').on('shown.bs.dropdown', function () {
    $("#showreceipt").focus();
  });
  $('#reportdropdown').on('shown.bs.dropdown', function () {
    $("#showviewledger").focus();
  });
  $('#administrationdropdown').on('shown.bs.dropdown', function () {
    $("#createuser").focus();
  });
    
  $('#helpdropdown').on('shown.bs.dropdown', function () {
    $("#manual").focus();
  });
  $('#signoutdropdown').on('shown.bs.dropdown', function () {
    $("#logout").focus();
  });
  $('#themesdropdown').on('shown.bs.dropdown', function () {
    $("#Default").focus();
  });
  $('#langdropdown').on('shown.bs.dropdown', function () {
    $("#eng").focus();
  });
  $('#toolbardropdown').on('shown.bs.dropdown', function () {
    $("#addaccounttb").focus();
  });

  $("#toolbar").click(function(){
    // Expands the toolbar on click to the height slightly less than the windowheight.
    var windowheight = window.innerHeight;
    var scrollerheight = windowheight - 40;
    $(".scrollable").css("max-height", scrollerheight);
    if (!window.screenTop && !window.screenY) {
      $(".scrollable").css("max-height", windowheight);
    }
  });
  $("#themes").click(function(){
    // Same as toolbar.
    var windowheight = window.innerHeight;
    var scrollerheight = windowheight - 40;
    $(".scrollable").css("max-height", scrollerheight);
    if (!window.screenTop && !window.screenY) {
      $(".scrollable").css("max-height", windowheight);
    }
  });
  if (sessionStorage.orgt=="Not For Profit") {
    // If orgtype is Not for Profit than some heading and menu items text is changed.
    $("#showprofitloss").text("Income & Expenditure");
    $("#showbalancesheet").text("Statement of Affairs");
    $("#showcashflow").text("Receipt & Payment");
    $("#cashflowtb").text("Receipt & Payment - CTRL+6");
    $("#showproject").text("Project");
    $("#projecttb").text("Project - ALT+P");
    $("#showprjstate").text("Project Statement");
    $("#projectstatementtb").text("Project Statement - CTRL+5");
  }

  // Following ajax will fetch organisation data and user data and make changes accordingly.
  // if user is an operator than all items with hideoperator class are removed.
  // if user is an manager than all items with hidemanager class are removed.
  // if organisation books have been closed than all items with closebooks class are removed.
  // if organisation has been rolled over than all items with rollover class are removed.
  // also booksclosedflag and roflag are stored in sessionstorage.
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
     if(resp["gkresult"]["userrole"]==3){
       $("#master").remove();
       $("#invoice").remove();
       $("#addcashmemo").remove();
       $("#godown").remove();
       $("#purchaseorder").remove();
       $("#transaction").remove();
       $("#showviewledger").remove();
       $("#showtrialbalance").remove();
       $("#showprjstate").remove();
       $("#showcashflow").remove();
       $("#showbalancesheet").remove();
       $("#consolidatedbalancesheet").remove();
       $("#exportledger").remove();
       $("#showprofitloss").remove();
       $("#listofaccounts").remove();
       $("#showdeletedvoucher").remove();
       $("#createuser").remove();
       $("#user").remove();
       $("#REMOVEuser").remove();
       $("#showclosebooks").remove();
       $("#deleteorg").remove();
       $("#tallyimport").remove();
       $("#showviewlog").remove();
       $("#orgpref").remove();
     }
     if(resp["gkresult"]["userrole"]==-1 || resp["gkresult"]["userrole"]==0){
       $("listofusers").remove();
     }
     if(resp["gkresult"]["userrole"]==1){
       $(".hideoperator").remove();
       $("#showviewlog").remove();
       $("#orgpref").remove();
     }
     if(resp["gkresult"]["userrole"]==0){
       $(".hidemanager").remove();
       $("#showviewlog").remove();
       $("#orgpref").remove();
     }
     if(resp["gkresult"]["userrole"]==2) {
	 $("#showviewlog").remove();
	 $("#orgpref").remove();
	 $(".mastermenu").remove();
	 $(".inventorymenu").remove();
	 $(".administrationmenu").remove();
	 $(".intauditor").remove();
	 $("#fevoucher").text("Find Voucher");
     }
     if (resp["gkresult"]["booksclosedflag"]==1) {
       $(".closebooks").remove();
       $("#fevoucher").text("Find Voucher");
       $("#findvouchertb").text("Find Voucher - F10");
     }
     if (resp["gkresult"]["roflag"]==1) {
       $(".rollover").remove();
       $("#showviewlog").remove();
     }

     if(resp["gkresult"]["userrole"]==-1) {
       userrole1="<i>Admin</i>";
     } else if(resp["gkresult"]["userrole"]==0) {
       userrole1="<i>Manager</i>";
     } else if(resp["gkresult"]["userrole"]==1) {
       userrole1="<i>Operator</i>";
     } else if(resp["gkresult"]["userrole"]==2) {
       userrole1="<i>Auditor</i>";
     } else if(resp["gkresult"]["userrole"]==3) {
       userrole1="<i>Godown In Charge</i>";
     }
     sessionStorage.setItem('booksclosedflag', resp["gkresult"]["booksclosedflag"]);
       sessionStorage.setItem('roflag', resp["gkresult"]["roflag"]);
       sessionStorage.setItem('vatorgstflag' , resp["vatorgstflag"] );
       if (resp["vatorgstflag"] == 22){
	   $("#productinmaster").text("Product");
	    $("#product").text("Product");
	   $("#productinmaster").text("Product");
	   $("#listofstockitems").text("List of Products");
       }
   });
  // for getting username who is logged in
  $.ajax({
    url: '/purchaseorder?action=getuser',
    type: 'POST',
    dataType: 'json',
    async : false,
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
   .done(function(resp) {
     username1=resp["username"];

   })
   .fail(function() {
     console.log("error");
   })
   .always(function() {
     console.log("complete");
   });

  // organisation name, type and financial year are stored in sessionstorage.
  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";	
  var userdata = "\xa0\xa0 <i>"+ username1 +"</i> <i>(</i>" + userrole1 + "<i>)</i>";
  var yeardata = "Financial Year : " + styear + " to " + enyear;
    
  // organisation details are stored in items that are only visible in print.
  $("title").append(orname);
  $("#printorgname").append(orname);
  $("#printyears").append(styear + " to " + enyear);
  $("#showedituser").click(function(e){
    // calls edit user form.
    $("#msspinmodal").modal("show");
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

  $('#showbillwiseaccounting').click(function (e) {
    // Loads customerlist page in the main div.
    $.ajax({
      url: '/billwise?action=showcustomersupplierlist',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'text/html',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }

    })
     .done(function(resp) {
       $("#info").html(resp);
     });
  });

  $('#godown').click(function (e) {
    // Loads godown page in the main div.
    $.ajax({
      url: '/godown',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'text/html',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }

    })
     .done(function(resp) {
       $("#info").html(resp);
     });
  });

  $("#exportbutton").click(function(e){
    // This function serves the client with a spreadsheet file having ledgers.
    var xhr = new XMLHttpRequest();
    var url = '/exportledger?yearstart='+sessionStorage.yyyymmddyear1+'&yearend='+sessionStorage.yyyymmddyear2;
    xhr.open('GET', url, true);
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

    $("#orgpref").click(function (e){

      $("#orgprefmodal").modal('show');
      // creates a modal(dialog box) asking user to choose between org preferences .

      $("#orgprefmodal").on('shown.bs.modal', function(event) {

        if (sessionStorage.invflag==1 && sessionStorage.invsflag==1 && sessionStorage.billflag==1) {
            $('#invinvsbillradio').focus().prop('checked', true);
        }
        if (sessionStorage.invflag==0 && sessionStorage.invsflag==1 && sessionStorage.billflag==1) {
            $('#invsbillradio').focus().prop('checked', true);
        }
        if (sessionStorage.invflag==0 && sessionStorage.invsflag==1 && sessionStorage.billflag==0) {
            $('#onlyinvsradio').focus().prop('checked', true);
        }
	   if (sessionStorage.invflag==0 && sessionStorage.invsflag==0 && sessionStorage.billflag==0) {
               $('#onlyaccradio').focus().prop('checked', true);
        }


                    $(".iib").keydown(function(event) {
                        if (event.which==13) {
                          event.preventDefault();
                          $('#orgprefsave').focus();

                      }
                    });



       $("#orgprefsave").click(function(event){
         if ($("#invinvsbillradio").is(":checked"))
         {
           invflag=1;
           invsflag=1;
           billflag=1;
       }

       if ($("#invsbillradio").is(":checked"))
       {
         invflag=0;
         invsflag=1;
         billflag=1;
     }
     if ($("#onlyinvsradio").is(":checked"))
     {
       invflag=0;
       invsflag=1;
       billflag=0;

   }
   if ($("#onlyaccradio").is(":checked"))
   {
     invflag=0;
     invsflag=0;
     billflag=0;
 }
                $.ajax({
                       url: '/editorganisation?action=orgpref',
                       type: "POST",
                       datatype: 'json',
                       global: false,
                       async: false,
                       data: {"invflag":invflag,"invsflag":invsflag,"billflag":billflag},
                       beforeSend: function(xhr)
                       {
                         xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                       }
                      })
                      .done(function(resp) {

                          if (invflag==1){
                          sessionStorage.invflag=1;
                          }

                          if (invflag==0){
                          sessionStorage.invflag=0;
                          }
                          if (invsflag==1){
                          sessionStorage.invsflag=1;
                          }
                          if (invsflag==0){
                          sessionStorage.invsflag=0;
                          }
                          if (billflag==1){
                          sessionStorage.billflag=1;
                          }
                          if (billflag==0){
                          sessionStorage.billflag=0;
                          }


                              if (resp['gkstatus']==0)
                          {
			      $("#orgpref-alert").alert();
			      $("#orgpref-alert").fadeTo(2250, 500).slideUp(500, function() {
				  $("#orgprefmodal").modal("hide");
                        $("#orgpref-alert").hide();
			location.reload();
                    });
                                }
                      })
                      .fail(function() {
                              console.log("error");
                      })
                      .always(function() {
                              console.log("complete");
                      });


                });


                  });
    });




  $("#exportdata").on('shown.bs.modal', function(event) {
    $("#exportbutton").focus();
  });

  $("#product").click(function (e){
    e.preventDefault();
    // calls product page.
    $.ajax({
      url: '/product?type=tab',
      type: "POST",
      datatype: 'text/html',
      global: false,
      async: false,
      beforeSend: function(xhr)
      {
	xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       $('#info').html(resp);
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
  });
  $("#productinmaster").click(function (e){
    e.preventDefault();
    // calls product page.
    $.ajax({
      url: '/product?type=tab',
      type: "POST",
      datatype: 'text/html',
      global: false,
      async: false,
      beforeSend: function(xhr)
      {
	xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       $('#info').html(resp);
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
  });

  $('#purchaseorder').click(function (e) {

    $.ajax({
      url: '/purchaseorder?type=tab',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'text/html',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       $("#info").html(resp);
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
  });

  $("#showeditorg").click(function (e){
    // calls edit organisation page.
    $("#msspinmodal").modal("show");
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
    // calls remove user page.
    $("#msspinmodal").modal("show");
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
    // calls edit account page.
    $("#msspinmodal").modal("show");
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
      });
  });

  $('#changeorg').click(function (e) {
    // clears sessionstorage and logs the user out to show select organisation page.
    sessionStorage.clear();
    $("#msspinmodal").modal();
    window.location.replace("/");

  });

  $("#logout").click(function(event) {
    // clears token in  sessionstorage and logs the user out to show login page.
    flag = 1;
    $("#msspinmodal").modal();
    $.ajax({
      url: '/getorgcode',
      type: 'POST',
      datatype: 'json',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(resp)
      {
        sessionStorage.gktoken="";
          var code = resp["gkdata"];
        $("body").load("/login?orgcode="+code+"&flag="+flag, setTimeout( function() {
          $("#username").focus();
        }, 500 ));
      }
    });
  });
  $(document).off("click","#deleteorg").on("click", "#deleteorg", function(event)
    {
      // opens a dialog box asking for confirmation to delete the organisation.
      event.preventDefault();
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');
      $('#m_confirmdelorg').modal('show').one('click', '#orgdel', function (e)
        {
          $("#msspinmodal").modal();
          $.ajax({
            url: '/deleteorg',
            type: 'POST',
            datatype: 'json',
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
          })
           .done(function(resp) {
             if (resp["gkstatus"]==0) {
               sessionStorage.clear();
               window.location.replace("/");
             }
           })
           .fail(function() {
             console.log("error");
           })
           .always(function() {
             console.log("complete");
           });

        });
      $('#m_confirmdelorg').on('shown.bs.modal', function(event) {
        $("#m_cancel").focus();
      });
    }
  );

  $('#consolidatedbalancesheet').click(function (e) {
    $.ajax(
      {
        type: "POST",
        url: "/showconsolidationpopup",
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
          //$("#holdingorg").modal("show");
        }
      });
  });

  $('#listofaccounts').click(function (e) {
    // calls list of accounts report.
    $("#msspinmodal").modal("show");
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

  $('#listofgodowns').click(function (e) {
    //calls list of godowns report.
    $.ajax(
      {

        type: "POST",
        url: "/godown?type=list",
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

  $('#listofcategories').click(function (e) {
    // calls list of categories report.
    $.ajax(
      {

        type: "POST",
        url: "/category?action=tree",
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

  $('#listofstockitems').click(function (e) {
    // calls list of stock items report.
    $.ajax(
      {

        type: "POST",
        url: "/product?type=list",
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

  $('#showstockreport').click(function (e) {
    // calls view page for stock report.
    $.ajax(
      {

        type: "POST",
        url: "/product?type=viewstockreport",
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
  $('#stockonhandreport').click(function (e) {
    // calls view page for stock report.
    $.ajax(
      {
        type: "POST",
        url: "/product?type=viewstockonhandreport",
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
  $('#categorywisestockonhandreport').click(function (e) {
      // calls view page for stock report.
        $.ajax(
          {

          type: "POST",
          url: "/product?type=viewcategorywisestockonhandreport",
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
    // calls find and edit voucher page.
    $("#msspinmodal").modal("show");
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


  if(orgdata!=""||yeardata!=""||userdata!="")// sets the organisation name & type, User name & role and year in the status bar below navbar.
    {
      $("#orgdata").html(orgdata);
      $("#yeardata").html(yeardata);
      $("#userdata").html(userdata); 
    }
  $('#addaccount').click(function (e) {
    // calls add account page.
    $("#msspinmodal").modal("show");
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

  /*$('#createuser').click(function (e) {
    // calls create user page.
    $("#msspinmodal").modal("show");
    $.ajax({
      url: '/showuser',
      type: 'POST',
      datatype: 'text/html',
    })
     .done(function(resp) {
       $("#info").html(resp);
     }*/


  $('#user').click(function (e) { // This calls user page.
    $("#msspinmodal").modal("show");
      $.ajax({
      type: 'POST',
      url: '/showuser?type=usertab',
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
    

  $("#showdeletedvoucher").click(function (e){
    // shows deleted vouchers report.
    $("#msspinmodal").modal("show");
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

  $("#listofusers").click(function (e){
    // shows deleted vouchers report.
    $("#msspinmodal").modal("show");
    $.ajax({
      url: '/showuser?type=list',
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
    // calls view page for ledger report.
    $("#msspinmodal").modal();
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

  $('#showviewlog').click(function (e) {
    // calls view page for ledger report.
    $("#msspinmodal").modal();
    $.ajax(
      {

        type: "POST",
        url: "/log?action=showviewlog",
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

  $('#showviewregister').click(function (e) {
    // calls view page for ledger report.
    $("#msspinmodal").modal();
    $.ajax(
      {
        type: "POST",
        url: "/invoice?action=showviewregister",
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
    // calls view page for bank reconcialation.
    $("#msspinmodal").modal("show");
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
    // calls view page for project statement report.
    $("#msspinmodal").modal("show");
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
    // calls add project page.
    $("#msspinmodal").modal("show");
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

  $('.addcategory').click(function (e) {// calls base category page.
    $.ajax(
      {
	type: "POST",
	url: "/category",
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

    $('#listofinvoices').click(function (e) {
    // calls list of invoices report
    $.ajax(
      {

        type: "POST",
        url: "/invoice?action=viewlist",
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

  $('#listoftransfernotes').click(function (e) {
    // calls list of stock items report.
    $.ajax(
      {

        type: "POST",
        url: "/transfernotes?action=viewlist",
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



  $('#invoice').click(function (e) {// calls base invoice page.
    $("#info").load("/invoice");
  });
  $('#customersupplier').click(function (e) {// calls base customersupplier page.
    $("#info").load("/customersuppliers");
  });
  $('#addunit').click(function (e) {// calls base unitofmeasurements page.
    $("#info").load("/unitofmeasurements");
  });
  $('#uominmaster').click(function (e) {// calls base unitofmeasurements page.
    $("#info").load("/unitofmeasurements");
  });
  $('#addcashmemo').click(function (e) {// calls base cash memo page.
    $("#info").load("/cashmemos");
  });
  $('#createtransfernote').click(function (e) {// calls base transfer note page.
    $("#info").load("/transfernotes");
  });

  $('#deliverychallan').click(function (e) {// calls base deliverychallan page.

    $.ajax(
      {
    	type: "POST",
    	url: "/deliverychallan",
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

  $("#showtrialbalance").click(function(event){// calls view page for trial balance report.
    $("#msspinmodal").modal("show");
    $("#info").load("/showtrialbalance");
  });

  $("#showcashflow").click(function(event){// calls cashflow report.
    $("#msspinmodal").modal("show");
    $("#info").load("/showcashflow");
  });
  $("#showprofitloss").click(function(event){// calls profit and loss report.
    var orgtype = sessionStorage.orgt.replace(/\s/g, "+");
    $("#msspinmodal").modal("show");
    $("#info").load("/showprofitloss?orgtype="+orgtype);
  });

  $("#showbalancesheet").click(function(event){// calls view page for balance sheet report.
    $("#msspinmodal").modal("show");
    $("#info").load("/showbalancesheet");
  });

  $("#showclosebooks").click(function(event){// calls close books and rollover page.
    $("#msspinmodal").modal("show");
    $("#info").load("/showclosebooks");
  });

  // following functions bind toolbar items to its corresponding menu items.
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
  /*  $('#createusertb').click(function(){
     $('#createuser').click();
     });
     $('#REMOVEusertb').click(function(){
     $('#REMOVEuser').click();
     });
     $('#changepasswordtb').click(function(){
     $('#showedituser').click();
     });*/
  $('#manualtb').click(function(){
    $('#manual').click();
  });
  /*  $('#logouttb').click(function(){
     $('#logout').click();
     });
     $('#changeogtb').click(function(){
     $('#changeorg').click();
     });*/
  $('#orgdata').click(function(){// clicking on organisation name and type in status bar will call edit organisation details page.
    $('#showeditorg').click();
  });

  $('#userdata').click(function(){// clicking on user name and role in status bar will call change password page.
    $('#showedituser').click();
  });
    
  $('#yeardata').click(function(){
    return false;
  });
  $('.themesmenu').click(function(){
    // sets the theme for the current user.
    var selectedtheme= $(this).attr('id');
    $("#msspinmodal").modal("show");
    $.ajax({
      url: '/addtheme',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
      data: {"themename":selectedtheme},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp){
       if(resp["status"]==0){
         sessionStorage.gktheme = selectedtheme;
       }
     });
  });
  $('#tallyimport').click(function (e) {// calls tally import page.
    $("#info").load("/import?action=show");
  });
});

$('#show_unbilled_deliveries').click(function (e) {
  //
  $.ajax(
    {
      type: "POST",
      url: "/del_unbilled?action=view",
      global: false,
      async: false,
      datatype: "json",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
	//alert(sessionStorage.gktoken);
	//alert(Date());
	//var financialstart = Date.parse(Date(), "yyyy-MM-dd");
	//alert(financialstart);
	//var temp_str = Date().getYear() + "-" + Date().getMonth() + "-" + Date().getDate();
	/*
	   today = new Date();
	   year = today.getFullYear();
	   month = today.getMonth();
	   month += 1;
	   date = today.getDate();
	   wholedate = year + "-" + month + "-" + date
	 */
	//var del_unbilled_array = temp_str.split(/\s*\-\s*/g)
      //alert(wholedate);
      $("#info").html(resp);
    }
    }
  );
  });
