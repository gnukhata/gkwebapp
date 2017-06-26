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

// This script is for Unadjusted Amounts modules

/* 
   The user is presented with two tables - one with a list of Amounts to be adjusted(Vouchers) and another with a list of uncleared invoices.
   The user has to select a voucher. The selection is confirmed by pressing enter key which shifts focus to Amount Adjusted field in list of Invoices.
   Total amount adjusted is displayed in table footer.  
   As user enters Amount Adjusted it is reduced from Amount Pending until Amount Pending is zero.  
   
   Validations :-  
   Total Amount Adjusted must be less then or equal to Debit/Credit Amount.  
   Amount Adjusted cannot be blank.
 */ 

$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#btbillwise").hide();
  var typingTimer;                //timer identifier
    var doneTypingInterval = 100; //typing interval
    var enter = 0;
    var voucherrow = 0;
  clearTimeout(typingTimer);  //clearing timeout
  //Actions to be triggered when focus is on amount adjusted field
    $(".numtype").numeric({ negative : false });

    //Function to find Total Amount Adjusted.
    function totalamountadjusted(){
      var totalap = 0.00;
      var ap = 0.00;
      for(var i = 0; i < $("#invtable tbody tr").length; i++) {
	//Empty fields are treated as fields with value 0.00
	if ($("#invtable tbody tr:eq("+i+") td:eq(4) input").val()=="") {
	  ap = 0.00;
	}
	else {
	  ap = parseFloat($("#invtable tbody tr:eq("+i+") td:eq(4) input").val());
	}
	totalap = totalap + ap;
      }
	return totalap;
    }

    //Function to find Total Amount Pending.
    function totalamountpending(){
      var totalpending = 0.00;
      var pending = 0.00;
      for(var i = 0; i < $("#invtable tbody tr").length; i++) {
	pending = parseFloat($("#invtable tbody tr:eq("+i+") td:eq(3) div").text());
	totalpending = totalpending + pending;
      }
	return totalpending;
    }

    //Function to clear Amount Adjusted.
    function clearamounts() {
	for(var i = 0; i < $("#invtable tbody tr").length; i++) {
	    $("#invtable tbody tr:eq("+i+") td:eq(4) input").val("0.00");
	    //Amount pending is reset when Amount Asjusted is cleared.
	    var originalvalue = parseFloat($("#invtable tbody tr:eq("+i+") td:eq(3)").data("amountpending")).toFixed(2);
	    $("#invtable tbody tr:eq("+i+") td:eq(3)").html('<div class="form-control">'+parseFloat(originalvalue).toFixed(2)+'</div');
	}
    }

    //Events to change selection in Voucher table. The '.selected' class is added to indicate a row is selected by changing its color.
    $(document).off('focus' ,'.vouchernumber').on('focus' ,'.vouchernumber',function() {
    $('#vouchertable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.vouchernumber').on('blur' ,'.vouchernumber',function() {
    if (enter == 0) {
	$('#vouchertable tr').removeClass('selected');
    }
  });

    //Voucher number is shown inside '<a></a>' tags because we need to shift focus when Up/Down arrow keys are pressed. They are given a class "vouchernumber".
    //Key events are written taking the class 'vouchernumber' into consideration.
    $(document).off('keydown' ,'.vouchernumber').on('keydown' ,'.vouchernumber',function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)  //Actions that take place when Down Arrow is pressed.
    {
      event.preventDefault();
      $('#vouchertable tbody tr:eq('+nextindex+') td:eq(1) a').focus();  //Focus shifts to next row.
    }
    else if (event.which==38)  //Actions that take place when Up Arrow is pressed.
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vouchertable tbody tr:eq('+previndex+') td:eq(1) a').focus();  //Focus shifts to previous row.
      }
    }

  });

  //Actions that take place when a row in voucher table is clicked.
  $("#vouchertable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var currindex = $(this).index();
    $('#vouchertable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#vouchertable tbody tr:eq('+currindex+') a').focus();
  });

    //To confirm a voucher is selected enter key is to be pressed. A flag 'enter' is set to 1 to prevent selected class from being removed when blur event triggers.
    $("#vouchertable").off('keydown','tr').on('keydown','tr',function(e){
	if (e.which == 13) {
	    e.preventDefault();
	    enter = 1;
	    var id = $(this).data('value');
	    var voucheramount = $(this).data('voucheramount');
	    voucherrow = $(this).index();
	    $(".amountpaid:first").focus().select();
	    $("#selectedvoucher").val(id);
	    $("#selectedvoucheramount").val(voucheramount);
	}
  });
    
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
    if ($("#invtable tbody tr:eq("+curindex+") td:eq(4) input").val() == "") {
      $("#invtable tbody tr:eq("+curindex+") td:eq(4) input").val("0.00");
    }
    else {
      var originalvalue = parseFloat($("#invtable tbody tr:eq("+curindex+") td:eq(4) input").val()).toFixed(2);
      $("#invtable tbody tr:eq("+curindex+") td:eq(4) input").val(originalvalue);
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
    var numberofrows = $("#invtable tbody tr").length - 1; //Number of rows is reduced by 1 to match indexing of elements which starts from 0.
    //Actions for 'Enter' key.
    if (event.which == 13) {
      event.preventDefault(); //Prevents default behaviour of any event. In this case, submiting the form.
      //Focus is shifted to 'Done' button when 'Enter' is pressed from Amount Adjusted in last row. Note that current index is compared with number of rows
      if (curindex == numberofrows) {
	$("#btclose").focus();
      }
      else {
	//Alert is displayed when Amount Adjusted is blank
	  if ($("#invtable tbody tr:eq("+curindex+") td:eq(4) input").val()=="") {
	      $("#invtable tbody tr:eq("+curindex+") td:eq(4) input").val(parseFloat(0).toFixed(2)).focus().select();
	  $(".alert").hide();
	  $("#bwamount-blank-alert").alert();
	  $("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwamount-blank-alert").hide();
	  });
	  return false;
	}
	//If 'Enter' is pressed from Amount Adjusted in any row but the last row focus shifts to Amount Adjusted field of next row.
	$("#invtable tbody tr:eq("+nextindex+") td:eq(4) input").focus().select();
      }
    }
    else if (event.which == 38) {
      event.preventDefault();
      //If 'Up' arrow key is pressed focus shifts to Amount Adjusted in previous row.
      $("#invtable tbody tr:eq("+previndex+") td:eq(4) input").focus().select();
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
      if (event.shiftKey && event.which == 13) {
	  event.preventDefault();
	   $("#vouchertable tbody tr:eq("+voucherrow+") td:eq(2)").html(parseFloat($("#selectedvoucheramount").val()).toFixed(2)).removeClass("text-success");
	  clearamounts();
	  //Total Amount Adjusted is found out and displayed on the footer.
	  var totalap = totalamountadjusted();
	  $('#invtable tfoot tr:eq(0) td:eq(3)').html('<div class="form-control" disabled>'+parseFloat(totalap).toFixed(2)+'</div');
	  //Total Amount Pending is found out and displayed on the footer.
	  var totalpending = totalamountpending();
	  $('#invtable tfoot tr:eq(0) td:eq(2)').html('<div class="form-control" disabled>'+parseFloat(totalpending).toFixed(2)+'</div');
	  $("#vouchertable tbody tr:first a").focus();
	  $("#vouchertable tbody tr:first").addClass("selected");
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
      if ($("#invtable tbody tr:eq("+curindex1+") td:eq(4) input").val() == "") {
	var originalvalue = parseFloat($("#invtable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"));
	$("#invtable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(originalvalue).toFixed(2)+'</div>');
      }
      else {
	//Whenever Amount Adjusted is greater than Amount Pending alert is displayed.
	if (parseFloat($("#invtable tbody tr:eq("+curindex1+") td:eq(4) input").val()) > parseFloat($("#invtable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"))) {
	    $("#invtable tbody tr:eq("+curindex1+") td:eq(4) input").focus().select();
	    $(".alert").hide();
	  $("#bwinvamount-alert").alert();
	  $("#bwinvamount-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwinvamount-alert").hide();
	  });
	  return false;
	}
	//Whenever Amount Adjusted equals Amount Pending the below snippet sets Amount Pending to 0.00.
	else if (parseFloat($("#invtable tbody tr:eq("+curindex1+") td:eq(4) input").val()) >= parseFloat($("#invtable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"))) {
	  $("#invtable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">0.00</div>');
	}
	else {
	  //When Amount Adjusted is not empty and less than Amount Pending the below snippet finds the difference and updates Amount Pending.
	  var bwdiff = parseFloat(parseFloat($("#invtable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending")) - parseFloat($("#invtable tbody tr:eq("+curindex1+") td:eq(4) input").val()));
	    $("#invtable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(bwdiff).toFixed(2)+'</div');
	}
      }
      //Total Amount Adjusted is found out and displayed on the foooter.
	var totalap = totalamountadjusted();
      $('#invtable tfoot tr:eq(0) td:eq(3)').html('<div class="form-control" disabled>'+parseFloat(totalap).toFixed(2)+'</div');
      //Total Amount Pending is found out and displayed on the foooter.
	var totalpending = totalamountpending();
      $('#invtable tfoot tr:eq(0) td:eq(2)').html('<div class="form-control" disabled>'+parseFloat(totalpending).toFixed(2)+'</div');
	$(".billamount").html("<b>"+parseFloat(totalap).toFixed(2)+"</b>");
	var vdiff = parseFloat(parseFloat($("#selectedvoucheramount").val()) - parseFloat(totalap));
	if (parseFloat(vdiff) >= 0) {
	    $("#vouchertable tbody tr:eq("+voucherrow+") td:eq(2)").html(parseFloat(vdiff).toFixed(2)).addClass("text-success");
	}
	//Alert is displayed when sum of total amount paid and sum of unadjusted amounts is more than sum of Debit/Credit amount and previous unadjusted amounts.
	if (parseFloat(totalap) > parseFloat($("#selectedvoucheramount").val())) {
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
    for(var i = 0; i < $("#invtable tbody tr").length; i++) {
      //Alert is displayed when Amount Adjusted is left blank. It is autofilled with 0.00 and selected so that user can leave it as 0.00 or easily edit the field.
      if ($("#invtable tbody tr:eq("+i+") td:eq(4) input").val()=="") {
	$("#invtable tbody tr:eq("+i+") td:eq(4) input").val("0.00");
	  $("#invtable tbody tr:eq("+i+") td:eq(4) input").focus().select();
	  $(".alert").hide();
	$("#bwamount-blank-alert").alert();
	$("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#bwamount-blank-alert").hide();
	});
	return false;
      }
      //Alert is displayed when amount adjusted is greater than amount pending.
      if (parseFloat($("#invtable tbody tr:eq("+i+") td:eq(4) input").val()) > parseFloat($("#invtable tbody tr:eq("+i+") td:eq(3)").data("amountpending"))) {
	$("#invtable tbody tr:eq("+i+") td:eq(4) input").focus().select();
	$(".alert").hide();
	$("#bwinvamount-alert").alert();
	$("#bwinvamount-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#bwinvamount-alert").hide();
	});
	return false;
      }
      if ($("#invtable tbody tr:eq("+i+") td:eq(4) input").length != 0) {
	//Creating a dictionary and appending to the list.
	var amountpaid = parseFloat($("#invtable tbody tr:eq("+i+") td:eq(4) input").val());
	var invid = parseInt($("#invtable tbody tr:eq("+i+")").data("invid"));
	  var invamount = {};
	invamount["vouchercode"] = $("#selectedvoucher").val();  
	invamount["adjamount"] = amountpaid;
	invamount["invid"] = invid;
	billwisedata.push(invamount);
	totalamountpaid = totalamountpaid + amountpaid;
      }
    }
      //Validations.
     //Alert is displayed when no changes have been made.
      if (parseFloat(totalamountpaid ) === 0) {
	  $(".alert").hide();
	  $("#nochange-alert").alert();
	  $("#nochange-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#nochange-alert").hide();
	  });
	  return false;
    }
    //Alert is displayed when  total amount adjusted and sum of unadjusted amounts is greater than sum of Debit/Credit amount(retrieved from session storage) and previous unadjusted amounts. See addvoucher.js to see when the amount is stored in session storage.
      if (parseFloat(totalamountpaid) > (parseFloat($("#selectedvoucheramount").val()))) {
	  $(".alert").hide();
      $("#bwamount-alert").alert();
      $("#bwamount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-alert").hide();
      });
      return false;
    }
  
  
      //If amount adjusted equals Debit/Credit amount AJAX request below is sent to the front-end view. Alert is displayed when the request is successful.
      if (allow == 1) {
	  allow = 0;
	$.ajax({
      url: '/billwise?action=updatepayment',
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
