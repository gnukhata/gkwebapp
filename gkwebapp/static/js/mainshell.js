/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020, 2019 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
    var userrole2;
    sessionStorage.editprint = 0;
    sessionStorage.onview=0;
    sessionStorage.companyremovables = [];
    sessionStorage.userremovables = [];
    sessionStorage.accMenuFlag = 0;   // flag for print account list back button
    $("#spinmodal").modal("hide");
    $('.modal-backdrop').remove();
    jQuery.fn.extend({
	searchify : function(){
	  var selectwidth = $(this).width(); //Width of original element
	  var selectheight = $(this).height(); //Height of original element
            var optionwidth = $(this).find("option").width();
            var optiondivwidth = parseFloat(optionwidth) + 20;
	    if(!$(this).hasClass("searchifiedselect")){
                $(this).searchable({maxListSize: Infinity, maxMultiMatch: Infinity,});  // Function to convert original select element into a searcheable element
                $(this).addClass("searchifiedselect");
            }
	    //Setting triggerHandler()e dimensions of new element same as that of the original element.
	  $(this).width(parseFloat(selectwidth));
	  $(this).height(parseFloat(selectheight));
	    $(this).find("option").height(parseFloat(selectheight));
            var optionsdiv = $(this).closest("div");
            optionsdiv.find('select[style*="display: none"]').width(optiondivwidth);
	    optionsdiv.find("option").each(function(index) {
		if ($(this).html()=="") {
		    $(this).remove();
		}
	    });
	    $(this).next().next().css({"margin-top":"-7px"});
            $(this).next().css({"margin-bottom":"20px", "max-height":"60vh"});
	}
    });
    function hideinvdiv(){
	$("#viewinvdiv").hide();
	$("#invload").empty();
	$("#printload").empty();
    }
    //   show pop up
  $('#salesprefdiv').tooltip({
    title : "Accounting entries will be generated automatically on creation of Invoice, Cash Memo and Debit & Credit Notes.",
    placement : "bottom"});
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
        let companyremovables = ["#inventoryrepdiv", "#documentsrepdiv"];
        sessionStorage.companyremovables = companyremovables;
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
      $(".hidebillwisecompany").remove();
      let companyremovables = ["#listoftransfernotes", "#show_unbilled_deliveries","#showstockreport","#stockonhandreport","#categorywisestockonhandreport","#listofgodowns"];
      sessionStorage.companyremovables = companyremovables;
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
    sessionStorage.cussup=1;
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
      $('.close').click();	
      $("#logout").click();
      event.preventDefault();
    }
    if(event.ctrlKey && event.keyCode == 79) {
	$('.close').click();
      $("#changeorg").click();
      event.preventDefault();
    }
    if(event.ctrlKey && event.keyCode == 81) {
	$('.close').click();
      $("#quit").click();
      event.preventDefault();
    }
    if(event.altKey && event.keyCode == 80) {
	$('.close').click();
      $("#showproject").click();
      event.preventDefault();
    }
    if(event.altKey && event.keyCode == 82) {
	$('.close').click();
      $("#BRS").click();
      event.preventDefault();
    }
    if(event.altKey && event.keyCode == 67) {
	$('.close').click();
      $("#showproject").click();
      event.preventDefault();
    }
    if(event.altKey && event.keyCode == 76) {
	$('.close').click();
      $("#showclosebooks").click();
      event.preventDefault();
    }
    if(event.altKey && event.keyCode == 77) {
	$('.close').click();
      $("#manual").click();
      event.preventDefault();
    }
    if(event.ctrlKey && event.keyCode == 71) {
	$('.close').click();
      $("#lang").click();
      event.preventDefault();
    }
    if(event.keyCode == 113) {
	$('.close').click();
      $("#addaccount").click();
      event.preventDefault();
    }
    if(event.keyCode == 114) {
	$('.close').click();
      $("#sidebar").click();
      event.preventDefault();
    }
    if(event.keyCode == 121) {
	$('.close').click();
      $("#fevoucher").click();
      event.preventDefault();
    }
    if(event.keyCode == 122) {
	$('.close').click();
      $("#report_li").click();
      event.preventDefault();
    }
    if(event.keyCode == 119) {
	$('.close').click();
      $("#showcontra").click();
      event.preventDefault();
    }
    if(event.keyCode == 116) {
	$('.close').click();
      event.preventDefault();
      $("#showpayment").click();    }
    if(event.keyCode == 115) {
	$('.close').click();
      event.preventDefault();
      $("#showreceipt").click();
    }
    if(event.keyCode == 120) {
	$('.close').click();
      $("#showjournal").click();
      event.preventDefault();
    }
    if(event.keyCode == 117) {
	$('.close').click();
      $("#showsales").click();
      event.preventDefault();
    }
    if(event.keyCode == 118) {
	$('.close').click();
      $("#showpurchase").click();
      event.preventDefault();
    }
    if(event.ctrlKey &&  event.keyCode == 66) {
	$('.close').click();
      event.preventDefault();
      $("#newt").focus();
      var e = jQuery.Event("keydown");
      e.which = 13; // # Some key code value
      $("#newt").trigger(e);
    }
    if(event.ctrlKey && (event.keyCode == 51 || event.keyCode == 99)) {
	$('.close').click();
      $("#showcreditnote").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 52 || event.keyCode == 100)) {
	$('.close').click();
      $("#showdebitnote").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 49 || event.keyCode == 97)) {
	$('.close').click();
      $("#showsalesreturn").click();
      event.preventDefault();
    }
    if(event.ctrlKey && (event.keyCode == 50 || event.keyCode == 98)) {
	$('.close').click();
      $("#showpurchasereturn").click();
      event.preventDefault();
    }
    if (event.ctrlKey && event.keyCode == 192) {
	$('.close').click();
      $(".search").children(".form-control").focus();
    }
    if (event.ctrlKey && event.keyCode == 192) {
	$('.close').click();
      $(".search").children(".form-control:first").focus();
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 192) {
	$('.close').click();
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
    $("#showproject_a").text("Project");
    $(".hidefornof").hide();
  }
  else{
    $(".hideforfm").hide();
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
    sessionStorage.userrole=resp["gkresult"]["userrole"];
     userrole2 = resp["gkresult"]["userrole"];
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
      let userremovables = ["#showviewlog","#accountingrepdiv", "#showviewregister","#listofinvoices", "#listofunpaidinvoices", "#show_unbilled_deliveries","#listofusers","#listofdeletedinvoices","#administrationrepdiv"];
      sessionStorage.userremovables = userremovables;

     }

     if(resp["gkresult"]["userrole"]==-1 || resp["gkresult"]["userrole"]==0){
       $("listofusers").remove();
       $(".adminhide").remove();
     }       
     if(resp["gkresult"]["userrole"]==1){
       $(".hideoperator").remove();
       $("#showviewlog").remove();
       $("#orgpref").remove();
       $("#showviewbudget").remove();
       $("#budget").remove();
       $(".operatorhide").remove();
       $("#listofusers").remove();
       let userremovables = ["#consolidatedbalancesheet","#showprofitloss","#listofusers","#showviewbudget","#showviewlog","#showdeletedvoucher","#showprjstate","#administrationrepdiv"];
       sessionStorage.userremovables = userremovables;
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
	 $("#findvoucher_a").text("Find Voucher");
   $("#business").remove();
   $("#help-message").hide();
   $("#showviewbudget").remove();
   $("#budget").remove();
   $(".internalaud").remove();
   $("#Documents_id").remove();
   $(".hidevoucher").remove();
   $(".businessmenu").remove();
   let userremovables = ["#showviewbudget","#showdeletedvoucher","#listofusers","#showviewlog","#administrationrepdiv"];
   sessionStorage.userremovables = userremovables;
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
	   $("#productinmaster_a").text("Product");
	    $("#product_a").text("Product");
	   $("#productinmaster_a").text("Product");
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
     sessionStorage.username=resp["username"];

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
  var yeardata =styear + " to " + enyear;
    
  // organisation details are stored in items that are only visible in print.
  $("title").append(orname);
  $("#printorgname").append(orname);
  $("#printyears").append(styear + " to " + enyear);
    $("#showedituser").click(function(e){
	hideinvdiv();
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
	hideinvdiv();
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
	hideinvdiv();
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

  $('#budget').click(function (e) {
      // Loads budget page in the main div.
      hideinvdiv();
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

    $(document).off("click", '#showviewbudget').on("click", '#showviewbudget', function(event) {
	hideinvdiv();
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
	hideinvdiv();
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
    if(sessionStorage.ainvnoflag==1){
      $('#ainvno').prop('checked', true);
  }else{
      $('#ainvno').prop('checked', false);
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
		  $("#mode").focus();
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
	  $("#avno").keydown(function(event){
	      if (event.which==13) {
		  event.preventDefault();
		  $('#ainvno').focus();
	      }
	      if (event.which == 38) {
		  $("#sales").focus();
	      }
	  });
    $("#ainvno").keydown(function(event){
      if (event.which==13) {
    event.preventDefault();
    $('#orgprefsave').focus();
      }
      if (event.which == 38) {
    $("#avno").focus();
      }
  });
       $("#orgprefsave").click(function(event){
	   var invflag,billflag,invsflag,avnoflag,ainvnoflag,avflag,maflag,modeflag;
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
     if ($("#ainvno").is(":checked"))
	   {
	       ainvnoflag=1;
	   }else{
	       ainvnoflag=0;
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
                    data: {"invflag":invflag,"invsflag":invsflag,"billflag":billflag,"avnoflag":avnoflag,"ainvnoflag":ainvnoflag,"maflag":maflag,"avflag":avflag,"modeflag":modeflag},
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
        if(ainvnoflag==0){
          sessionStorage.ainvnoflag=0;
      }else{
          sessionStorage.ainvnoflag=1;
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

  $('#shortcuts').click(function (e) {
    hideinvdiv();
    // calls add ac2123count page.
    $("#msspinmodal").modal("show");
      $.ajax(
        {
  
    type: "POST",
    url: "/shortcuts",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
    $('#info').html(resp);
    $("#msspinmodal").modal("hide");

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
});

  
  $('#authors').click(function (e) {
    hideinvdiv();
    // calls add account page.
    $("#msspinmodal").modal("show");
      $.ajax(
        {
  
    type: "POST",
    url: "/authors",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
    $('#info').html(resp);
    $("#msspinmodal").modal("hide");

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
});

  $('#license').click(function (e) {
    hideinvdiv();
    // calls add account page.
    $("#msspinmodal").modal("show");
      $.ajax(
        {
  
    type: "POST",
    url: "/license",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
    }
  })
    .done(function(resp) {
      $('#info').html(resp);
      $("#msspinmodal").modal("hide");

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });

  $('#about').click(function (e) {
    hideinvdiv();
    // calls add account page.
    $("#msspinmodal").modal("show");
      $.ajax(
        {
  
    type: "POST",
    url: "/about",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
    }
    })
    .done(function(resp) {
      $('#info').html(resp);
      $("#msspinmodal").modal("hide");

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });

  $('#deletecompany').click(function (e) {
    hideinvdiv();
    // calls add account page.
    $("#msspinmodal").modal("show");
      $.ajax(
        {
  
    type: "POST",
    url: "/deletecompany",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
    }
    })
    .done(function(resp) {
      $('#info').html(resp);
      $("#msspinmodal").modal("hide");

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });

  $("#exportdata").click(function() {
    hideinvdiv();
    $("#info").load("/export");
  });

  $("#product").click(function (e){
    hideinvdiv();
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
	hideinvdiv();
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
	hideinvdiv();
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
	hideinvdiv();
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
	hideinvdiv();
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
	hideinvdiv();
    // clears sessionstorage and logs the user out to show select organisation page.
    sessionStorage.clear();
    $("#msspinmodal").modal();
      window.location.replace("/");
      sessionStorage.changeorg = 1;
  });

    $("#logout").click(function(event) {
	hideinvdiv();
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

  $(document).off("click", '#report_back').on("click", '#report_back', function(event) {
    $("#report_li").click();
  });

  $(document).off("click", '#pnlback').on("click", '#pnlback', function(event) {
    if(sessionStorage.pnlbackflag==0){
      $("#report_back").hide();
    }
    else{$("#report_back").show();}
  });

  $(document).off("click", '#balback').on("click", '#balback', function(event) {
    if(sessionStorage.balbackflag==0){
      $("#report_back").hide();
    }
    else{$("#report_back").show();}
  });

  $(document).off("click", '#saback').on("click", '#saback', function(event) {
    if(sessionStorage.balbackflag==0){
      $("#report_back").hide();
    }
    else{
      $("#report_back").show();}
  });
    $(document).off("click", '#listofaccounts').on("click", '#listofaccounts', function(event) {
	hideinvdiv();
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
	hideinvdiv();
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
    hideinvdiv();
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
	hideinvdiv();
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

    $(document).off("click", '#listofgodowns').on("click", '#listofgodowns', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#listofcategories').on("click", '#listofcategories', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#listofstockitems').on("click", '#listofstockitems', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#showstockreport').on("click", '#showstockreport', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#stockonhandreport').on("click", '#stockonhandreport', function(event) {
	hideinvdiv();
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
    
    $(document).off("click", '#consolidatedbalancesheet').on("click", '#consolidatedbalancesheet', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#categorywisestockonhandreport').on("click", '#categorywisestockonhandreport', function(event) {
	hideinvdiv();
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
	hideinvdiv();
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
	hideinvdiv();
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

    $('#report_li').click(function (e) {
	hideinvdiv();
    sessionStorage.rtflag = 1;     // flag fot print invoice list back  button
    sessionStorage.accMenuFlag = 1;   // flag for print account list back button
    $("#msspinmodal").modal("show");
    $.ajax(
      {

	type: "POST",
	url: "/showreport",
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
            $.each(sessionStorage.companyremovables.split(","), function(index, value){
                $(value).remove();
            });
            $.each(sessionStorage.userremovables.split(","), function(index, value){
              $(value).remove();
          });
    $("#msspinmodal").modal("hide");
    
	}
      }
    );
    return false;
  });

  $('#report_li').click(function(event) {
    $(document).ready(function(){ 
      if(userrole2 == 3){
        event.preventDefault();
        $('.inventoryfocus:first').closest('div').addClass('keyclass');
        $('.inventoryfocus:first').focus();
      }
      else{
        event.preventDefault();
      $('.accountingfocus:first').closest('div').addClass('keyclass');
      $('.accountingfocus:first').focus();
      }
     });
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
	hideinvdiv();
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

    $(document).off("click", '#showdeletedvoucher').on("click", '#showdeletedvoucher', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#listofusers').on("click", '#listofusers', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#showviewledger').on("click", '#showviewledger', function(event) {
	hideinvdiv();
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


    $(document).off("click", '#showviewlog').on("click", '#showviewlog', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#showviewregister').on("click", '#showviewregister', function(event) {
	hideinvdiv();
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
	hideinvdiv();
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

    $(document).off("click", '#showprjstate').on("click", '#showprjstate', function(event) {
	hideinvdiv();
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
	hideinvdiv();
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
	hideinvdiv();
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

    $(document).off("click", '#listofinvoices').on("click", '#listofinvoices', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#listofdeletedinvoices').on("click", '#listofdeletedinvoices', function(event) {
	hideinvdiv();
      // calls list of invoices report
      sessionStorage.onview=0;
      $.ajax(
        {
  
          type: "POST",
          url: "/invoice?action=viewlistdeleted",
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
	    $("#printbutton, #inv_rec, #inv_pay").hide();
          }
        }
      );
      });


    $(document).off("click", '#show_cancelled_deliveries').on("click", '#show_cancelled_deliveries', function(event) {
	hideinvdiv();
        $.ajax(
          {
            type: "POST",
            url: "/deliverychallan?action=viewcanceldel",
            global: false,
            async: false,
            datatype: "json",
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
    

    $(document).off("click", '#listofunpaidinvoices').on("click", '#listofunpaidinvoices', function(event) {
	hideinvdiv();
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

    $(document).off("click", '#listoftransfernotes').on("click", '#listoftransfernotes', function(event) {
	hideinvdiv();
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


  sessionStorage.salepurchase = 1;
  sessionStorage.inv_type = 0;
  $('#invoice').click(function (e) {// calls base invoice page.
    hideinvdiv();
      $("#info").load("/invoice");
      // return false;
  });
    $('#customersupplier').click(function (e) {// calls base customersupplier page.
	hideinvdiv();
    sessionStorage.cussup=1;
    $("#info").load("/customersuppliers");
  });
    $('#addunit').click(function (e) {// calls base unitofmeasurements page.
	hideinvdiv();
    $("#info").load("/unitofmeasurements");
  });
    $('#uominmaster').click(function (e) {// calls base unitofmeasurements page.
	hideinvdiv();
    $("#info").load("/unitofmeasurements");
  });
    $('#addcashmemo').click(function (e) {// calls base cash memo page.
	hideinvdiv();
      $("#info").load("/cashmemos");
      // return false;
  });
  $('#createtransfernote').click(function (e) {// calls base transfer note page.
    hideinvdiv();
    $("#info").load("/transfernotes");
  });

    $('#rejectionnote').click(function (e) {// calls route rejectionnote and loads show page.
	hideinvdiv();
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
	hideinvdiv();
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
    $(document).off("click", '#showtrialbalance').on("click", '#showtrialbalance', function(event) {
	hideinvdiv();
// calls view page for trial balance report.
    $("#msspinmodal").modal("show");
    $("#info").load("/showtrialbalance");
  });

    $(document).off("click", '#showcashflow').on("click", '#showcashflow', function(event) {
	hideinvdiv();
  // calls cashflow report.
    $("#msspinmodal").modal("show");
    $("#info").load("/showcashflow");
  });

    $(document).off("click", '#showprofitloss').on("click", '#showprofitloss', function(event) {
	hideinvdiv();
    // calls profit and loss report.
    var orgtype = sessionStorage.orgt.replace(/\s/g, "+");
    sessionStorage.pnlbackflag = 1;
    $("#msspinmodal").modal("show");
    $.ajax({
      url: "/showprofitloss?orgtype="+orgtype,
      type: 'POST',
      global: false,
      async: false,
      datatype: 'text/html',
      data: {"backflag":1},
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

    $(document).off("click", '#showbalancesheet').on("click", '#showbalancesheet', function(event) {
	hideinvdiv();
// calls view page for balance sheet report.
    sessionStorage.balbackflag = 1;
    $("#msspinmodal").modal("show");
    $.ajax({
      url: "/showbalancesheet",
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

    $("#showclosebooks").click(function(event){// calls close books and rollover page.
	hideinvdiv();
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

  $('#changecompany').click(function(){// clicking on user role in status bar will call change password page.
    $('#showedituser').click();
  });
  
  $('#userdata').click(function(){// clicking on user name in status bar will call change password page.
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
	hideinvdiv();
    $("#info").load("/import?action=show");
  });

    $(document).off("click", '#show_unbilled_deliveries').on("click", '#show_unbilled_deliveries', function(event) {
	hideinvdiv();
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
	hideinvdiv();
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
    $('#voucher_modal').on('hidden.bs.modal', function (e){
        var allow = 1;
        if(allow == 1){
        var dataset = {
            "flag": $("#invoicetypeselect").val(),
            "fromdate": $("#fromdate").data("fromdate"),
            "todate": $("#todate").data("todate")
        };
    $.ajax({
        type: "POST",
        url: "/invoice?action=showlist",
        global: false,
        async: false,
        datatype: "text/html",
        data: dataset,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
    })
    .done(function(resp) {
	if ($("#slectedlist").length > 0){
	    $("#slectedlist").html(resp);
	    $("#invoiceviewlist input:radio:checked").focus();
            $("#viewanotherlist").hide();
	    $("#viewinvdiv").hide();
	    $("#invload").html("");
	}
	else {
	    $("#info").html(resp);
	    $("#viewinvdiv").hide();
	    $("#invload").html("");
	}
	if ($("#pillsdiv").length > 0){
	    $("#pillsdiv").show();
	}
	if ($("#listdiv").length > 0){
	    $("#listdiv").show();
	}
    })
    .fail(function() {
        $("#failure-alert1").alert();
        $("#failure-alert1").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert1").hide();
        });
    });
    } allow =0;
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

