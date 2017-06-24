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
   "Krishnakant Mane" <kk@dff.org.in>
   "Abhijith Balan" <abhijithb21@openmailbox.org.in>
   "Prajkta Patkar" <prajkta@dff.org.in>
   "Arun Kelkar" <arunkelkar@dff.org.in>
   "Rohini Baraskar"<robaraskar@dff.org.in>
 */

// This script is for bill wise accounting

/* 
   When Receipt/Payment vouchers are created a modal appears asking if user wants to continue to bill wise accounting.  
   When confirmed a table is presented with fields Invoice No, Invoice Date, Invoice Amount, Amount Pending and Amount to be Adjusted(input by user).  
   Account name and Debit/Credit amount are displayed on the title bar of the modal.  
   Total amount paid is displayed in table footer.  
   As user enters Amount Adjusted it is reduced from Amount Pending until Amount Pending is zero.  

   In case the user does not intend to settle any bills the debit/credit amount can be set as "On Account".
   To make advance payments the amount can be set as "As Advance".
   A user may choose to set some amount as advance, some on account and the remaining may be used to settle bills.
   
   At a later point Unadjusted Amounts module can be activated to use the advance or on account amounts to settle bills.
   It can also be done when bill wise accounting is activated again another voucher is made.

   
   Validations :-  
   Sum of Total Amount Adjusted, On Account amount and As Advance amount must be equal to the sum of Debit/Credit Amount and previous unadjusted amounts.  
   Amount Adjusted cannot be blank.
 */ 

$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#btbillwise").hide();
  var typingTimer;                //timer identifier
  var doneTypingInterval = 100; //typing interval
  clearTimeout(typingTimer);  //clearing timeout
  //Actions to be triggered when focus is on amount adjusted field
  $(".numtype").numeric({ negative : false });
  $(document).off('focus', '.amountpaid').on('focus', '.amountpaid', function(event) {
    event.preventDefault();
    /* Act on the event */
    //Preventing input of alphabets and negative numbers in Amount Adjusted
    clearTimeout(typingTimer);
    $(".numtype").numeric({ negative : false });
  });
  //When focus shifts from Amount Adjusted field value entererd is converted to float.
  $(document).off('focusout', '.amountpaid').on('focusout', '.amountpaid', function(event) {
    event.preventDefault();
    var curindex = $(this).closest('tr').index(); //Current Index
    if ($("#latable tbody tr:eq("+curindex+") td:eq(4) input").val() == "") {
      $("#latable tbody tr:eq("+curindex+") td:eq(4) input").val("0.00");
    }
    else {
      var originalvalue = parseFloat($("#latable tbody tr:eq("+curindex+") td:eq(4) input").val()).toFixed(2);
      $("#latable tbody tr:eq("+curindex+") td:eq(4) input").val(originalvalue);
    }
  });
  
  //Actions to be triggered when a key is pressed down.
  $(document).off('keydown', '.amountpaid').on('keydown', '.amountpaid', function(event) {
    /* Act on the event */
    clearTimeout(typingTimer);
    // Indexes tell us the row number.
    var curindex = $(this).closest('tr').index(); //Current Index
    var nextindex = curindex + 1; //Next Index
    var previndex = curindex - 1; //Previous Index
    var numberofrows = $("#latable tbody tr").length - 1; //Number of rows is reduced by 1 to match indexing of elements which starts from 0.
    //Actions for 'Enter' key.
    if (event.which == 13) {
      event.preventDefault(); //Prevents default behaviour of any event. In this case, submiting the form.
      //Focus is shifted to 'Done' button when 'Enter' is pressed from Amount Adjusted in last row. Note that current index is compared with number of rows
      if (curindex == numberofrows) {
	$("#btclose").focus();
      }
      else {
	//Alert is displayed when Amount Adjusted is blank
	  if ($("#latable tbody tr:eq("+curindex+") td:eq(4) input").val()=="") {
	      $("#latable tbody tr:eq("+curindex+") td:eq(4) input").val(parseFloat(0).toFixed(2)).focus().select();
	  $(".alert").hide();
	  $("#bwamount-blank-alert").alert();
	  $("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwamount-blank-alert").hide();
	  });
	  return false;
	}
	//If 'Enter' is pressed from Amount Adjusted in any row but the last row focus shifts to Amount Adjusted field of next row.
	$("#latable tbody tr:eq("+nextindex+") td:eq(4) input").focus().select();
      }
    }
    else if (event.which == 38) {
      event.preventDefault();
      //If 'Up' arrow key is pressed focus shifts to Amount Adjusted in previous row.
      $("#latable tbody tr:eq("+previndex+") td:eq(4) input").focus().select();
    }
    else if (event.which == 35) {
      event.preventDefault();
      //If 'End' key is pressed focus shifts to buttons in footer.
      $("#btclose").focus();
    }
    else if(event.which == 45) {
      event.preventDefault();
      //Pressing 'Insert' key triggers click event of 'Done' button.
      $("#btclose").click();
      return false;
    }
  });

  //Actions that take place when key is released from Amount Adjusted field.
  $(document).off('keyup', '.amountpaid').on('keyup', '.amountpaid', function(event) {
    /* Act on the event */
    var curindex1 = $(this).closest('tr').index();
    clearTimeout(typingTimer);
    /*
       setTimeout is a built in function that is used to do something after certain interval of time.
       Here it used to do certain actions after user enters some value in Amount Adjusted.
       Whenever user enters a value it is reduced from Amount Adjusted of corresponding rows. Also the sum of value in Amount Paid column in all rows is displayed in the footer of the table as Total.
     */
    
    typingTimer = setTimeout(function(){
      //Original value of Amount Adjusted is stored in a variable so that the field can be reset when user clears Amount Paid field.
      if ($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val() == "") {
	var originalvalue = parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"));
	$("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(originalvalue).toFixed(2)+'</div>');
      }
      else {
	//Whenever Amount Adjusted is greater than Amount Pending alert is displayed.
	if (parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val()) > parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"))) {
	    $("#latable tbody tr:eq("+curindex1+") td:eq(4) input").focus().select();
	    $(".alert").hide();
	  $("#bwinvamount-alert").alert();
	  $("#bwinvamount-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwinvamount-alert").hide();
	  });
	  return false;
	}
	//Whenever Amount Adjusted equals Amount Pending the below snippet sets Amount Pending to 0.00.
	else if (parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val()) >= parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"))) {
	  $("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">0.00</div>');
	}
	else {
	  //When Amount Adjusted is not empty and less than Amount Pending the below snippet finds the difference and updates Amount Pending.
	  var bwdiff = parseFloat(parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending")) - parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val()));
	  $("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(bwdiff).toFixed(2)+'</div');
	}
      }
      //Total Amount Adjusted is found out and displayed on the foooter.
      var totalap = 0.00;
      var ap = 0.00;
      for(var i = 0; i < $("#latable tbody tr").length; i++) {
	//Empty fields are treated as fields with value 0.00
	if ($("#latable tbody tr:eq("+i+") td:eq(4) input").val()=="") {
	  ap = 0.00;
	}
	else {
	  ap = parseFloat($("#latable tbody tr:eq("+i+") td:eq(4) input").val());
	}
	totalap = totalap + ap;
      }
      $('#latable tfoot tr:eq(0) td:eq(3)').html('<div class="form-control" disabled>'+parseFloat(totalap).toFixed(2)+'</div');
      //Total Amount Pending is found out and displayed on the foooter.
      var totalpending = 0.00;
      var pending = 0.00;
      for(var i = 0; i < $("#latable tbody tr").length; i++) {
	pending = parseFloat($("#latable tbody tr:eq("+i+") td:eq(3) div").text());
	totalpending = totalpending + pending;
      }
      $('#latable tfoot tr:eq(0) td:eq(2)').html('<div class="form-control" disabled>'+parseFloat(totalpending).toFixed(2)+'</div');
	$(".billamount").html("<b>"+parseFloat(totalap).toFixed(2)+"</b>");
      //Alert is displayed when sum of total amount paid and sum of unadjusted amounts is more than sum of Debit/Credit amount and previous unadjusted amounts.
	if (parseFloat(totalap) > parseFloat(sessionStorage.customeramount)) {
	  $(".alert").hide();
      $("#bwamount-alert").alert();
      $("#bwamount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-alert").hide();
      });
      return false;
    }
    }, doneTypingInterval);
  });
    
  
  
    var allow = 1;
  //Actions that occur on click of 'Done' button.
  $(document).off('click', '#btclose').on('click', '#btclose', function(event) {
      event.preventDefault();
      event.stopPropagation();
    var billwisedata = [];  //List to store data.
    var totalamountpaid = 0;  //Variable to store total amount paid. Total is recalculated here to avoid errors.
    /*
       The loop below makes dictionaries from values stored in each row in this format -{"vouchercode": vouchercode, "invid":invoiceid,"adjamount": adjusted amount}.
       It appends each dictionary into a list, adjbills.
       It stores the total amount adjusted in the variable totalamountpaid which is later used for validations.
     */
    for(var i = 0; i < $("#latable tbody tr").length; i++) {
      //Alert is displayed when Amount Adjusted is left blank. It is autofilled with 0.00 and selected so that user can leave it as 0.00 or easily edit the field.
      if ($("#latable tbody tr:eq("+i+") td:eq(4) input").val()=="") {
	$("#latable tbody tr:eq("+i+") td:eq(4) input").val("0.00");
	  $("#latable tbody tr:eq("+i+") td:eq(4) input").focus().select();
	  $(".alert").hide();
	$("#bwamount-blank-alert").alert();
	$("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#bwamount-blank-alert").hide();
	});
	return false;
      }
      //Alert is displayed when amount adjusted is greater than amount pending.
      if (parseFloat($("#latable tbody tr:eq("+i+") td:eq(4) input").val()) > parseFloat($("#latable tbody tr:eq("+i+") td:eq(3)").data("amountpending"))) {
	$("#latable tbody tr:eq("+i+") td:eq(4) input").focus().select();
	$(".alert").hide();
	$("#bwinvamount-alert").alert();
	$("#bwinvamount-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#bwinvamount-alert").hide();
	});
	return false;
      }
      if ($("#latable tbody tr:eq("+i+") td:eq(4) input").length != 0) {
	//Creating a dictionary and appending to the list.
	var amountpaid = parseFloat($("#latable tbody tr:eq("+i+") td:eq(4) input").val());
	var invid = parseInt($("#latable tbody tr:eq("+i+")").data("invid"));
	  var invamount = {};
	invamount["vouchercode"] = $("#vchcode").val();  
	invamount["adjamount"] = amountpaid;
	invamount["invid"] = invid;
	billwisedata.push(invamount);
	totalamountpaid = totalamountpaid + amountpaid;
      }
    }
      //Validations.
     //Alert is displayed when no changes have been made.
      if (parseFloat((totalamountpaid + parseFloat($("#asadvance").val()) + parseFloat($("#onaccount").val()))) == 0) {
	  $(".alert").hide();
	  $("#nochange-alert").alert();
	  $("#nochange-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#nochange-alert").hide();
	  });
	  return false;
    }
    //Alert is displayed when sum of total amount adjusted and sum of unadjusted amounts is greater than sum of Debit/Credit amount(retrieved from session storage) and previous unadjusted amounts. See addvoucher.js to see when the amount is stored in session storage.
      if (parseFloat((totalamountpaid + parseFloat($("#asadvance").val()) + parseFloat($("#onaccount").val()))) > (parseFloat(sessionStorage.customeramount) + parseFloat($("#asadvancelabel").data("asadvance")) + parseFloat($("#onaccountlabel").data("onaccount")))) {
	  $(".alert").hide();
      $("#bwamount-alert").alert();
      $("#bwamount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-alert").hide();
      });
      return false;
    }
    if (parseFloat((totalamountpaid + parseFloat($("#asadvance").val()) + parseFloat($("#onaccount").val()))) > parseFloat(sessionStorage.customeramount) && ($("#useasadvance").val()=="" || $("#useasadvance").val()==0) && ($("#useonaccount").val()=="" || $("#useonaccount").val()==0)) {
	if ($("#customerselect").length == 0) {
	    $(".alert").hide();
	$("#bwvamount-alert").alert();
	$("#bwvamount-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#bwvamount-alert").hide();
	});
	return false;
      }
	else {
	    $(".alert").hide();
	$("#bwamount-alert").alert();
      $("#bwamount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-alert").hide();
      });
	return false;
      }
    }
      if (parseFloat((parseFloat($("#useasadvance").val()) + parseFloat($("#useonaccount").val()))) > parseFloat(parseFloat($("#asadvancelabel").data("asadvance")) + parseFloat($("#onaccountlabel").data("onaccount")) + parseFloat($("#asadvance").val()) + parseFloat($("#onaccount").val()))) {
	  $(".alert").hide();
      $("#bwadvac-alert").alert();
      $("#bwadvac-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwadvac-alert").hide();
      });
      return false;
    }
    //Alert is displayed when sum of total amount paid and sum of unadjusted amounts is less than sum of Debit/Credit amount and previous unadjusted amounts.
      if (parseFloat((totalamountpaid + parseFloat($("#asadvance").val()) + parseFloat($("#onaccount").val()))) < (parseFloat(sessionStorage.customeramount) + parseFloat($("#useasadvance").val()) + parseFloat($("#useonaccount").val()))) {
	  $(".alert").hide();
      $("#bwamount-less-alert").alert();
      $("#bwamount-less-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-less-alert").hide();
      });
      return false;
      }

      //Alert is displayed when sum of total amount paid and sum of unadjusted amounts is more than sum of Debit/Credit amount and previous unadjusted amounts.
      if (parseFloat((totalamountpaid + parseFloat($("#asadvance").val()) + parseFloat($("#onaccount").val()))) > (parseFloat(sessionStorage.customeramount) + parseFloat($("#useasadvance").val()) + parseFloat($("#useonaccount").val()))) {
	  $(".alert").hide();
      $("#bwamount-alert").alert();
      $("#bwamount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-alert").hide();
      });
      return false;
    }

    if (parseFloat($("#useasadvance").val()) > parseFloat($("#asadvancelabel").data("asadvance"))) {
	$("#useasadvance").focus().select();
	$(".alert").hide();
      $("#asadvance-alert").alert();
      $("#asadvance-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#asadvance-alert").hide();
      });
      return false;
    }

    if (parseFloat($("#useonaccount").val()) > parseFloat($("#onaccountlabel").data("onaccount"))) {
	$("#useonaccount").focus.select();
	$(".alert").hide();
      $("#onaccount-alert").alert();
      $("#onaccount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#onaccount-alert").hide();
      });
      return false;
    }

    var usedasadvance = {};
    var usedonaccount = {};
    usedasadvance = {"payflag":1,"icflag":4, "pdamt":parseFloat($("#useasadvance").val()), "custid":$("#custid").val()};
    usedonaccount = {"payflag":15,"icflag":4, "pdamt":parseFloat($("#useonaccount").val()), "custid":$("#custid").val()};
    billwisedata.push(usedasadvance);
    billwisedata.push(usedonaccount);
      //If amount adjusted equals Debit/Credit amount AJAX request below is sent to the front-end view. Alert is displayed when the requast is successful.
      if (allow == 1) {
	  allow = 0;
	$.ajax({
      url: '/invoice?action=updatepayment',
      type: 'POST',
      async: false,
      dataType: 'json',
      data: {"billwisedata":JSON.stringify(billwisedata)},
      beforeSend: function(xhr)
      {
	xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(jsonObj) {
	var status = jsonObj["gkstatus"];
	  if (status == 0) {
	      $(".alert").hide();
	  $("#bwamount-success-alert").alert();
	  $("#bwamount-success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwamount-success-alert").hide();
	    if ($("#customerselect").length == 0) {
		$("#bwtable").modal("hide");
		$("#bwtableload").html("");
	    }
	    else {
	      $("#showbillwiseaccounting").click();
	    }
	  });
	      return false;
	}
	  else {
	      $(".alert").hide();
	  $("#bwfailure-alert").alert();
	  $("#bwfailure-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwfailure-alert").hide();
	  });
	      return false;
	}
      }
    });
    }
      return false;
  });
});
