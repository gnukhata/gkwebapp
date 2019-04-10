
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
   "Ishan Masdekar " <imasdekar@dff.org.in>
   "Navin Karkera" <navin@dff.org.in>
   "Bhavesh Bawadhane" <bbhavesh07@gmail.com>
   "Dinesh Sutar" <dinesh.sutar@openmailbox.org>
   "Abhijith Balan" <abhijithb21@openmailbox.org>
   "Parabjyot Singh" <parabjyot1996@gmail.com>
   "Rahul Chaurasiya" <crahul4133@gmail.com>
   "Mohd. Talha Pawaty" <mtalha456@gmail.com>
   "prajkta Patkar" <prajkta@riseup.net>
   "Reshma Bhatawadekar" <reshma@dff.org.in>
   "Pravin Dake" <pravindake24@gmail.com>
   "Aditya Shukla" <adityashukla9158.as@gmail.com>
   "Rohan Khairnar" <rohankhairnar5@gmail.com>
   "Rupali Badgujar" <rupalibadgujar1234@gmail.com>

 */
// This script is for the mainshell page and loads when the main page of GNUKhata is loaded.
// Also all the external js libraries we have used is loaded along with the mainshell.
$(document).ready(function(){
    var username1;
    var userrole1;
    sessionStorage.editprint = 0;
    sessionStorage.onview=0;
    $("#spinmodal").modal("hide");
    $('.modal-backdrop').remove();
    jQuery.fn.extend({
	searchify : function(){
	    var selectwidth = $(this).width(); //Width of original element
	    var selectheight = $(this).height(); //Height of original element
	    $(this).searchable();  // Function to convert original select element into a searcheable element
	    //Setting triggerHandler()e dimensions of new element same as that of the original element.
	    $(this).width(parseFloat(selectwidth));
	    $(this).height(parseFloat(selectheight));
	    $(this).find("option").height(parseFloat(selectheight)).width(parseFloat(selectwidth));
	    $(this).find("option").each(function() {
		if ($(this).html()=="") {
		    $(this).remove();
		}
	    });
	    $(this).next().next().css({"margin-top":"-7px"});
	    $(this).next().width(parseFloat(selectwidth));
	}
    });
    //Checking flags set according organisation preferences.
    // For Accounting Only invflag=0, invsflag=0 and billflag=0. Inventory Menu, Invoice, Cash Memo and related Reports are hidden.
    // For Invoicing Only invflag=0, invsflag=1 and billflag=0. Inventory Menu is hidden and  sub-menus which are 'Category', 'Product/Service' and 'Unit of Measurement' under 'Master' menu.
    // For Invoicing with Billwise Accounting invflag=0, invsflag=1 and billflag=1. Inventory Menu is hidden. Sub-menus viz., 'Category', 'Product/Service' and 'Unit of Measurement' are added under Master Menu. Also Unadjusted sub-menu is added under Voucher for Billwise Accounting.
    // For Inventory with Invoicing and Billwise Accounting invflag=1, invsflag=1 and billflag=1. It includes Inventory, Billwise Accounting, Invoicing and extra sub-menus(viz., 'Category', 'Product/Service' and 'Unit of Measurement') will be removed from Master menu.
    if(sessionStorage.invflag==0 && sessionStorage.invsflag==0 && sessionStorage.billflag==0) {
      $(".productinmaster").remove();
      $(".custsuninmaster").remove();
      $('.invsbill').remove();
      $(".categoryinmaster").remove();
      $(".uominmaster").remove();
      $('.inventorymenu').remove();
      $(".inventory_hide").remove();
      $("#showbillwiseaccounting").remove();
      $(".businessmenu").remove();	
      $("#Documents_id").remove();	
      $(".gstmenuitem").remove();
      $("#gstmenu_id").remove();
      $("#gstmenu").remove();
      $(".accountinghide").remove();
      $(".delchalhide").remove();
    }

    if(sessionStorage.invflag==0 && sessionStorage.invsflag==1 && sessionStorage.billflag==0) {
        $('.invoicemenu').show();
        $(".productinmaster").show();
      	$(".categoryinmaster").show();
        // $('.uominmaster').show();
        $(".inventorymenu").remove();
        $('.inventory_hide').remove();
	      $("#showviewregister").show();
        $("#showbillwiseaccounting").remove();
         $(".businessmenu").show();
        $(".hidemenu").remove();
      $(".delchalhide").remove();
      $(".hidevoucher").remove();


         
    }

    if(sessionStorage.invflag==0 && sessionStorage.invsflag==1 && sessionStorage.billflag==1) {
      $(".productinmaster").show();
      $(".categoryinmaster").show();
      $(".uominmaster").show();
      $("#showbillwiseaccounting").show();
      $('.inventorymenu').remove();
      $('.inventory_hide').remove();
      $("#showviewregister").show();
      $(".businessmenu").show();
      $(".hidemenu").remove();
      $(".delchalhide").remove();
      $(".hidevoucher").remove();

    }

    if(sessionStorage.invflag==1 && sessionStorage.invsflag==1 && sessionStorage.billflag==1) {
      $(".productinmaster").remove();
      $(".categoryinmaster").remove();
      $(".uominmaster").remove();
      $(".hidevoucher").remove();
    }

  if (sessionStorage.reload == 1)// The mainshell when loads for the first time its reloaded so that the javascript file can be fully loaded.
    {
      sessionStorage.reload = 0;
      location.reload();
    }

  $('#receive_payment').click(function(){
    $('#showreceipt').click();
  });

  $("#create-cust").click(function() {
    $("#customersupplier").click();
  });

  $("#create-prod").click(function() {
    $("#productinmaster").click();
  });

  $("#create-invoice").click(function() {
    $("#invoice").click();
  });

  $("#make-payments").click(function() {
    $("#showreceipt").click();
  });

  $("#view-charts").click(function() {
    $("#listofaccounts").click();
  });

  if (sessionStorage.invsflag==0) {
    $("#help-message").hide();
  }

  else {
    $.ajax({
      url: '/genstats',
      type: 'GET',
      global: false,
      async: false,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp){
       if(resp["gkstatus"] == 0) {
         if (resp["gkresult"]["party_count"] > 0) {
           $("#create-cust").hide();
           $("#create-prod").css("font-weight", "bold");
         }
         if (resp["gkresult"]["prod_count"] > 0) {
           $("#create-prod").hide();
           $("#create-invoice").css("font-weight", "bold");
         }
         if (resp["gkresult"]["inv_count"] > 0) {
	     $("#recentuser").hide();
         }
       }
     })
  }
  var oninvoice = 0;// This variable is set to 1 only when its in the print page of invoice, cashmemo or deliverychallan or transfernote. Reason: The organisation details that appear in all print pages of GNUKhata is not required in the pages where its set to 1.
  $("#msspinmodal").modal("hide"); //Hides the loading spinner.
  $("#bootstrap").attr('href', '../static/css/'+sessionStorage.gktheme+'.min.css');// set the theme depending on users previous choice.
  $("#"+sessionStorage.gktheme+"span").show();
    //Setting index after sorting to the Sr. No. column
    $(document).off('click' ,'.sortableHeader').on('click' ,'.sortableHeader',function(e) {
	$("table tbody tr").each(function(index){
	    $('table tbody tr:eq('+index+') td:eq(0)').text(index+1);
	});
    });

  $(document).keydown(function(event) {
    // Shortcuts
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
    if(event.keyCode == 113) {
      $("#addaccount").click();
      event.preventDefault();
    }
    if(event.keyCode == 114) {
      $("#sidebar").click();
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
      event.preventDefault();
      $("#showpayment").click();    }
    if(event.keyCode == 115) {
      event.preventDefault();
      $("#showreceipt").click();
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
    $("#showprofitloss_a").text("Income & Expenditure");
    $("#showbalancesheet_a").text("Statement of Affairs");
    $("#showcashflow_a").text("Receipt & Payment");
    $("#showproject_a").text("Project");
    $("#showprjstate_a").text("Project Statement");
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
       $("#showviewbudget").remove();
       $("#budget").remove();
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
       $("#gstmenu").remove();
       $(".godownhide").remove();	
       $(".mastermenu").remove();	 
      $(".hidevoucher").remove();
      $(".transactionmenu").remove();
      $(".gstmenuitem").remove(); 
     }

     if(resp["gkresult"]["userrole"]==-1 || resp["gkresult"]["userrole"]==0){
       $("listofusers").remove();
       $(".adminhide").remove();
      $(".hidevoucher").remove();

     }       
     if(resp["gkresult"]["userrole"]==1){
       $(".hideoperator").remove();
       $("#showviewlog").remove();
       $("#orgpref").remove();
       $("#showviewbudget").remove();
       $("#budget").remove();
       $(".operatorhide").remove();
       $("#listofusers").remove();

     }
     if(resp["gkresult"]["userrole"]==0){
       $(".hidemanager").remove();
       $("#showviewlog").remove();
       $("#orgpref").remove();
      $(".hidevoucher").remove();

     }
     if(resp["gkresult"]["userrole"]==2) {
	 $("#showviewlog").remove();
	 $("#orgpref").remove();
	 $(".mastermenu").remove();
	 $(".inventorymenu").remove();
	 $(".administrationmenu").remove();
	 $(".intauditor").remove();
	 $("#findvoucher_a").text("Find Voucher");
   $("#business").remove();
   $("#help-message").hide();
   $("#showviewbudget").remove();
   $("#budget").remove();
   $(".internalaud").remove();
   $("#Documents_id").remove();
   $(".hidevoucher").remove();
   $(".businessmenu").remove();
     }
     
     if (resp["gkresult"]["booksclosedflag"]==1 && resp["gkresult"]["roflag"] ==1) {
	 $(".closebooks").remove();
	 $(".rollover").remove();
       $("#findvoucher_a").text("Find Voucher");
       $("#findvouchertb").text("Find Voucher - F10");
     }
     if (resp["gkresult"]["roflag"]==1 && resp["gkresult"]["booksclosedflag"]==0) {
       $("#showclosebooks").text("Close Books");
       $("#showviewlog").remove();
     }

     if (resp["gkresult"]["roflag"]==0 && resp["gkresult"]["booksclosedflag"]== 1) {
       $("#showclosebooks").text("Roll Over");
       $("#showviewlog").remove();
       $("#findvoucher_a").text("Find Voucher");
       $("#findvouchertb").text("Find Voucher - F10");
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
  var branchname = sessionStorage.getItem('goname');
  var orgdata = orname + " (" + ortype + ")";	
  var userdata = "\xa0\xa0 <i>"+ username1 +"</i> <i>(</i>" + userrole1 + "<i>)</i>";
  var yeardata =styear + " to " + enyear;
    
  // organisation details are stored in items that are only visible in print.
  $("title").append(orname);
  $("#printorgname").append(orname);
  // shown branchname when logged in to branch
  if (branchname != ''){
    $("#branch, #branch_sm").html(branchname);
  }
  else{
    $("#branch, #branch_sm").hide();
  }
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
      data: {"gbflag":7},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }

    })
     .done(function(resp) {
       $("#info").html(resp);
     });
  });

  $('#branchmenu').click(function (e) {
    // Loads godown page in the main div.
    $.ajax({
      url: '/godown',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'text/html',
      data: {"gbflag":2},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }

    })
     .done(function(resp) {
       $("#info").html(resp);
     });
  });

  $('#budget').click(function (e) {
    // Loads budget page in the main div.
    $.ajax({
      url: '/budget',
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

  $('#showviewbudget').click(function (e) {
    // Loads list of all budget to view budget report.
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
	window.location.assign(url);
      }
    };
    xhr.send();
  });

    $("#orgpref").click(function (e){
 
      $("#orgprefmodal").modal('show');
      // creates a modal(dialog box) asking user to choose between org preferences .

	$("#orgprefmodal").on('shown.bs.modal', function(event) {
	        $("#onlyaccradio").click(function(event){
	$("#ledgerdiv").hide();
    });
    $("#invinvsbillradio").click(function(event) {
	$("#ledgerdiv").show();
    });
    $("#invsbillradio").click(function(event) {
        //event.preventDefault();
	$("#ledgerdiv").show();
    });
    $("#onlyinvsradio").click(function(event){
        //event.preventDefault();
	$("#ledgerdiv").show();
    });

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
          if (sessionStorage.modeflag == 1) {
              $("#mode").prop("checked", true);
          }
	  if(sessionStorage.avflag==1) {
	      $('#sales').prop('checked', true);
	  }else{
	      $('#sales').prop('checked', false);
	  }
	  if(sessionStorage.maflag==1) {
	      $('#multiplesales').prop('checked', true);
	  }else{
	      $('#singlesales').prop('checked', true);
	  }
	  if(sessionStorage.avnoflag==1){
	      $('#avno').prop('checked', true);
	  }else{
	      $('#avno').prop('checked', false);
	  }
	  

        $(".iib").keydown(function(event) {
            if (event.which==13) {
              event.preventDefault();
              $('#mode').focus();

          }
        });

	 
        $("#mode").keydown(function(event) {
          if (event.which == 13) {
        event.preventDefault();
              if ($("#ledgerdiv").is(":hidden")) {
		  $("#avno").focus();
              }
              else {
		  $("#sales").focus();
              }
	  }
          else if (event.which == 38) {
            event.preventDefault();
            $("#invinvsbillradio").focus();
          }
        });
          
	  if ($("#sales").is(":checked")) {
	      $(".ledger").prop("disabled", false);
	  }
	  else{
	      $(".ledger").prop("disabled", true);
	  }

	  $("#sales").keydown(function(event){
	      if (event.which==13) {
		  event.preventDefault();
		  if($("#singlesales").is(":disabled")){
		      $("#avno").focus();
		  }
		  else{
		      $('#singlesales').focus();
		  }
	      }
	      if (event.which == 38) {
		  $("#invinvsbillradio").focus();
	      }
	  });
	  $("#sales").change(function(event){
	      if ($("#sales").is(":checked")) {
		  $(".ledger").prop("disabled", false);
	      }
	      else{
		  $(".ledger").prop("disabled", true);
	      }
	  });
	  $(".ledger").keydown(function(event){
	      if (event.which==13) {
		  event.preventDefault();
		  $('#avno').focus();
	      }
	      if (event.which == 38) {
		  $("#sales").focus();
	      }
	  });
	  $(".voucherno").keydown(function(event){
	      if (event.which==13) {
		  event.preventDefault();
		  $('#orgprefsave').focus();
	      }
	      if (event.which == 38) {
		  $("#sales").focus();
	      }
	  });
	  
       $("#orgprefsave").click(function(event){
	   var invflag,billflag,invsflag,avnoflag,avflag,maflag,modeflag;
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
	   if ($("#mode").is(":checked")) {
	       modeflag = 1;
	   }
	   else {
	       modeflag = 0;
	   }
	   if ($("#avno").is(":checked"))
	   {
	       avnoflag=1;
	   }else{
	       avnoflag=0;
	   }
	   if ($("#sales").is(":checked")) {
	       avflag=1;
	   }
	   else {
	       avflag= 0;
	   }
	   if ($("#singlesales").is(":checked")) {
	       maflag = 0;
	   }
	   if ($("#multiplesales").is(":checked")) {
	       maflag=1;
	   }
                $.ajax({
                       url: '/editorganisation?action=orgpref',
                       type: "POST",
                       datatype: 'json',
                       global: false,
                       async: false,
                    data: {"invflag":invflag,"invsflag":invsflag,"billflag":billflag,"avnoflag":avnoflag,"maflag":maflag,"avflag":avflag,"modeflag":modeflag},
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
			  if(avnoflag==0){
			      sessionStorage.avnoflag=0;
			  }else{
			      sessionStorage.avnoflag=1;
			  }
			  if(maflag==0){
			      sessionStorage.maflag=0;
			  }else{
			      sessionStorage.maflag=1;
			  }
			  if(avflag==0){
			      sessionStorage.avflag=0;
			  }
			  else{
			      sessionStorage.avflag=1;
			  }

                          sessionStorage.modeflag = modeflag;


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
      datatype: 'text/html'
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
        $("#msspinmodal").modal("hide");

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

  $('#changeorg').click(function (e) {
    // clears sessionstorage and logs the user out to show select organisation page.
    sessionStorage.clear();
    $("#msspinmodal").modal();
      window.location.replace("/");
      sessionStorage.changeorg = 1;
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

   
  $('#gstsummary').click(function (e) {
    $.ajax(
      {
        type: "POST",
        url: "/gstsummary",
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

  $("#r1").click(function (e) {
    console.log("r1");
    $.ajax(
      {
        type: "GET",
        url: "/viewgstreturns?type=r1",
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
        data: {"gbflag": 7},
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

  $('#listofbranches').click(function (e) {
    //calls list of godowns report.
    $.ajax(
      {

        type: "POST",
        url: "/godown?type=list",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"gbflag": 2},
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
    // calls view page for stock on hand report.
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
    
  $('#consolidatedbalancesheet').click(function (e) {
    // calls view page for consolidate balance sheet report.
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
      $("#orgdata, #orgdata_sm").html(orgdata);
      $("#yeardata, #yeardata_sm").html(yeardata);
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
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
	},
	success: function(resp)
	{
    $("#info").html(resp);
    $("#msspinmodal").modal("hide");
    
	}
      }
    );
    return false;
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
    sessionStorage.onview=0;
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

    $('#listofunpaidinvoices').click(function (e) {
    // calls list of invoices report
    sessionStorage.onview=0;
    $.ajax(
      {

        type: "POST",
        url: "/billwise?action=viewlistofunpaidinvoices",
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
      // return false;
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
      // return false;
  });
  $('#createtransfernote').click(function (e) {// calls base transfer note page.
    $("#info").load("/transfernotes");
  });

    $('#rejectionnote').click(function (e) {// calls route rejectionnote and loads show page.
    $.ajax(
      {
      type: "POST",
      url: "/rejectionnote",
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
    console.log("kkakakakakak")
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

  $('#changecompany').click(function(){// clicking on user name and role in status bar will call change password page.
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

//debit credit note tab

$('#drcrnote').click(function (e) {// calls base drcrnote page.
    $("#info").load("/drcrnote");
    $("#drcrnote_div").show();
});
    $(document).off('click' ,'#viewnews').on('click' ,'#viewnews',function(event){
	$("#rss-feed").html("");
	$("#rss-feed2").html("");
	$("#rss-feed")
          .rss("https://www.gstindia.com/feed/", {
            limit: 5,
            effect: 'slideFastSynced',
            layoutTemplate: '{entries}',
              entryTemplate: '<div><a href="{url}" target="_blank"><b>{title}</b></a></div></div><small>[{date}]</small></div><div><p>{bodyPlain}</p></div>',
	      dateFormat: 'ddd, DD MMM YYYY'
          }, function() {
	      $("#taxfeedmessage").hide();
            $("#gstindia").show();
          });
	$("#rss-feed2")
          .rss("https://www.incometaxindia.gov.in/_layouts/15/Dit/Pages/Rss.aspx?List=Latest%20Tax%20Updates", {
            limit: 5,
            effect: 'slideFastSynced',
            layoutTemplate: '{entries}',
              entryTemplate: '<div><a href="{url}" target="_blank"><b>{title}</b></a></div></div><small>[{date}]</small></div><div><p>{bodyPlain}</p></div>',
	      dateFormat: 'ddd, DD MMM YYYY'
          }, function() {
            $("#incometaxindia").show();
          });
    });

    $(document).off('click' ,'#reportsearchspan').on('click' ,'#reportsearchspan',function(e) {
	let searchtext = $("#reportsearch").val().toLowerCase();
	if (searchtext != "") {
	    $("table tbody tr").each(function(index){
		if (index != 0) {
		    let rowtext = $(this).text().toLowerCase();
		    if (rowtext.indexOf(searchtext) != -1) {
			$(this).show();
		    }
		    else {
			$(this).hide();
		    }
		}
	    });
	}
    });
    $(document).off('keydown' ,'#reportsearch').on('keydown' ,'#reportsearch',function(e) {
	//String to search for is stored in searchtext variable.
	let searchtext = $("#reportsearch").val().toLowerCase();
	    //When search field is blank the clear search button is hidden.
	    if (searchtext == "") {
		$("#reportclearsearchspan").hide();
	    }
	    //When there is some text in the field clear search button is shown.
	    if (searchtext != "") {
		$("#reportclearsearchspan").show();
	    }
	    //Table rows containing search text are shown and others hidden.
	    if (searchtext != "") {
		$("table tbody tr").each(function(index){
			let rowtext = $(this).text().toLowerCase();
			if (rowtext.indexOf(searchtext) != -1) {
			    $(this).show();
			}
			else {
			    $(this).hide();
			}
		});
	    }
	    //Pressing 'Esc' button clears search.
	    if (e.which == 27) {
		$("#reportsearch").val("");
		$("tr").show();
	    }
	    if (e.which == 8) {
		if($("#reportsearch").length == 1){
		    $("#reportclearsearchspan").trigger("click");
		    $("#reportsearch").focus();
		}
	    }
	    //Pressing Enter key shifts focus to first row.
	    if (e.which == 13) {
		$("tbody tr:visible").first().find('a').focus();
	    }
    });
    $(document).off('click' ,'#reportclearsearchspan').on('click' ,'#reportclearsearchspan',function(e) {
	$("#reportsearch").val("");
	$("table tbody tr").show();
	$("#reportclearsearchspan").hide();
	$("tbody tr:visible").first().find('a').focus();
    });
    $(window).load(function(){
        $("#logodiv").fadeOut(1000);
        $("#info").fadeIn();
    });
});   
     
