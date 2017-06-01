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
   "Abhijith Balan" <abhijithb21@openmailbox.org.in>
 */

// This script is for bill wise accounting

/* 
   When Receipt/Payment vouchers are created a modal appears asking if user wants to continue to bill wise accounting.  
   When confirmed a table is presented with fields Invoice No, Invoice Date, Invoice Amount, Amount Pending and Amount to be Paid(input by user).  
   Account name and Debit/Credit amount are displayed on the title bar of the modal.  
   Total amount paid is displayed in table footer.  
   As user enters Amount Paid it is reduced from Amount Pending until Amount Pending is zero.  

   Validations :-  
   Total Amount Paid must be equal to Debit/Credit Amount.  
   Amount Paid cannot be blank.  
 */ 

$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#btbillwise").hide();
  var typingTimer;                //timer identifier
  var doneTypingInterval = 100; //typing interval
  clearTimeout(typingTimer);  //clearing timeout
  //Actions to be triggered when focus is on amount paid field
  $(document).off('focus', '.amountpaid').on('focus', '.amountpaid', function(event) {
    event.preventDefault();
    /* Act on the event */
    //Preventing input of alphabets and negative numbers in Amount Paid
    clearTimeout(typingTimer);
    $(".numtype").numeric({ negative : false });
  });
  //When focus shifts from Amount Paid field value entererd is converted to float.
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
      //Click event force 'Done' button is fired when 'Enter' is pressed from Amount Paid in last row. Note that current index is compared with number of rows
      if (curindex == numberofrows) {
	$("#btclose").click();
      }
      else {
	//Alert is displayed when Amount Paid is blank
	if ($("#latable tbody tr:eq("+curindex+") td:eq(4) input").val()=="") {
	  $("#bwamount-blank-alert").alert();
	  $("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwamount-blank-alert").hide();
	  });
	  return false;
	}
	//If 'Enter' is pressed from Amount Paid in any row but the last row focus shifts to Amount Paid field of next row.
	$("#latable tbody tr:eq("+nextindex+") td:eq(4) input").focus().select();
      }
    }
    else if (event.which == 38) {
      event.preventDefault();
      //If 'Up' arrow key is pressed focus shifts to Amount Paid in previous row.
      $("#latable tbody tr:eq("+previndex+") td:eq(4) input").focus().select();
    }
    else if (event.which == 45) {
      event.preventDefault();
      //Pressing 'Insert' key triggers click event of 'Done' button.
      $("#btclose").click();
    }
  });

  //Actions that take place when key is released from Amount Paid field.
  $(document).off('keyup', '.amountpaid').on('keyup', '.amountpaid', function(event) {
    /* Act on the event */
    var curindex1 = $(this).closest('tr').index();
    clearTimeout(typingTimer);
    /*
       setTimeout is a built in function that is used to do something after certain interval of time.
       Here it used to do certain actions after user enters some value in Amount Paid.
       Whenever user enters a value it is reduced from Amount Pending of corresponding rows. Also the sum of value in Amount Paid column in all rows is displayed in the footer of the table as Total.
     */
    
    typingTimer = setTimeout(function(){
      //Original value of Amount Pending is stored in a variable so that the field can be reset when user clears Amount Paid field.
      if ($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val() == "") {
	var originalvalue = parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"));
	$("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(originalvalue).toFixed(2)+'</div>');
      }
      else {
	//Whenever Amount Paid equals or exceeds Amount Pending the below snippet sets Amount Pending to 0.00.
	if (parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val()) >= parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"))) {
	  $("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">0.00</div>');
	}
	    else {
	      //When Amount Paid is not empty and less than Amount Pending the below snippet finds the difference and updates Amount Pending.
	      var bwdiff = parseFloat(parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending")) - parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val()));
	      $("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(bwdiff).toFixed(2)+'</div');
	}
      }
      //Total Amount Paid is found out and displayed on the foooter.
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
    }, doneTypingInterval);
  });

  //Actions that occur when On Account is clicked.
  $(document).off('click', '#btonacc').on('click', '#btonacc', function(event) {
    event.preventDefault();
    $("#latable").hide();
    $("#asadvancediv").hide();
    $("#txtareahelp2").hide();
    $("#onaccdiv").show();
    $("#btbillwise").show();
    $("#btonacc").hide();
    $("#btasadv").show();
    $("#onaccount").focus().select();
  });

  //Actions that occur when As Advance is clicked.
  $(document).off('click', '#btasadv').on('click', '#btasadv', function(event) {
    event.preventDefault();
    $("#latable").hide();
    $("#onaccdiv").hide();
    $("#txtareahelp2").hide();
    $("#asadvancediv").show();
    $("#btbillwise").show();
    $("#btonacc").show();
    $("#btasadv").hide();
    $("#asadvance").focus().select();
  });

  //Actions that occur when Bill Wise button is clicked.
  $(document).off('click', '#btbillwise').on('click', '#btbillwise', function(event) {
    event.preventDefault();
    $("#onaccdiv").hide();
    $("#asadvancediv").hide();
    $("#txtareahelp2").show();
    $("#latable").show();
    $("#btbillwise").hide();
    $("#btonacc").show();
    $("#btasadv").show();
    $("#onaccount").focus().select();
  });
  
  //Actions that occur on click of 'Done' button.
  $(document).off('click', '#btclose').on('click', '#btclose', function(event) {
    event.preventDefault();
    var billwisedata = [];  //List to store data.
    var totalamountpaid = 0;  //Variable to store total amount paid. Total is recalculated here to avoid errors.
    /*
       The loop below makes a dictionaries from values stored in each row in this format - {"pdamt":amount paid, "invid":invoice id}.
       It appends each dictionary into a list billwisedata.
       It stores the total amount paid in the variable totalamountpaid which is later used for validations.
     */
    for(var i = 0; i < $("#latable tbody tr").length; i++) {
      //Alert is displayed when Amount Paid is left blank. It is autofilled with 0.00 and selected so that user can leave it as 0.00 or easily edit the field.
      if ($("#latable tbody tr:eq("+i+") td:eq(4) input").val()=="") {
	$("#latable tbody tr:eq("+i+") td:eq(4) input").val("0.00");
	$("#latable tbody tr:eq("+i+") td:eq(4) input").focus().select();
	$("#bwamount-blank-alert").alert();
	$("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#bwamount-blank-alert").hide();
	});
	return false;
      }
      //Creating a dictionary and appending to the list.
      var amountpaid = parseFloat($("#latable tbody tr:eq("+i+") td:eq(4) input").val());
      var invid = parseInt($("#latable tbody tr:eq("+i+")").data("invid"));
      var invamount = {};
      invamount["pdamt"] = amountpaid;
      invamount["invid"] = invid;
      billwisedata.push(invamount);
      totalamountpaid = totalamountpaid + amountpaid;
    }
    //Validations.
    //Alert is displayed when total amount paid is greater than Debit/Credit amount(retrieved from session storage). See addvoucher.js to see when the amount is stored in session storage.
    if (parseFloat(totalamountpaid) > parseFloat(sessionStorage.customeramount)) {
      $("#latable tbody tr:last td:eq(4) input").focus().select();
      $("#bwamount-alert").alert();
      $("#bwamount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-alert").hide();
      });
      return false;
    }
    //Alert is displayed when amount paid is less than Debit/Credit amount.
    if (parseFloat(totalamountpaid) < parseFloat(sessionStorage.customeramount)) {
      $("#latable tbody tr:last td:eq(4) input").focus().select();
      $("#bwamount-less-alert").alert();
      $("#bwamount-less-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-less-alert").hide();
      });
      return false;
    }
    //If amount paid equals Debit/Credit amount AJAX request below is sent to the front-end view. Alert is displayed when the requast is successful.
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
	  $("#bwamount-success-alert").alert();
	  $("#bwamount-success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwamount-success-alert").hide();
	    $("#bwtable").modal("hide");
	  });
	}
	else {
	  $("#bwfailure-alert").alert();
	  $("#bwfailure-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwfailure-alert").hide();
	  });
	}
      }
    });
  });
});
