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
  var typingTimer;                //timer identifier
  var doneTypingInterval = 200; //typing interval
  clearTimeout(typingTimer);  //clearing timeout
  $(document).off('focus', '.amountpaid').on('focus', '.amountpaid', function(event) {
    event.preventDefault();
    /* Act on the event */
    //Preventing input of alphabets and negative numbers in Amount Paid
    clearTimeout(typingTimer);
    $(".numtype").numeric({ negative : false });
  });
  //Actions to be triggered when a key is pressed down.
  $(document).off('keydown', '.amountpaid').on('keydown', '.amountpaid', function(event) {
    /* Act on the event */
    clearTimeout(typingTimer);
    // Indexes tell us the row number.
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    var numberofrows = $("#latable tbody tr").length - 1; //Number of rows is reduced by 1 to match indexing of elements which starts from 0.
    //Actions for 'Enter' key.
    if (event.which == 13) {
      event.preventDefault();
      if (curindex == numberofrows) {
	$("#btclose").click();
      }
      else {
	if ($("#latable tbody tr:eq("+curindex+") td:eq(4) input").val()=="") {
	  $("#bwamount-blank-alert").alert();
	  $("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bwamount-blank-alert").hide();
	  });
	  return false;
	}
	$("#latable tbody tr:eq("+nextindex+") td:eq(4) input").focus().select();
      }
    }
    else if (event.which == 38) {
      event.preventDefault();
      $("#latable tbody tr:eq("+previndex+") td:eq(4) input").focus().select();
    }
    else if (event.which == 45) {
      event.preventDefault();
      $("#btclose").click();
    }
  });

  $(document).off('keyup', '.amountpaid').on('keyup', '.amountpaid', function(event) {
    /* Act on the event */
    var curindex1 = $(this).closest('tr').index();
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function(){
      if ($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val() == "") {
	var originalvalue = parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"));
	$("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(originalvalue).toFixed(2)+'</div>');
      }
      else {
	if (parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val()) >= parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending"))) {
	  $("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">0.00</div>');
	}
	else {
	  var bwdiff = parseFloat(parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(3)").data("amountpending")) - parseFloat($("#latable tbody tr:eq("+curindex1+") td:eq(4) input").val()));
	  $("#latable tbody tr:eq("+curindex1+") td:eq(3)").html('<div class="form-control">'+parseFloat(bwdiff).toFixed(2)+'</div');
	}
      }
      var totalap = 0.00;
      var ap = 0.00;
      for(var i = 0; i < $("#latable tbody tr").length; i++) {
	if ($("#latable tbody tr:eq("+i+") td:eq(4) input").val()=="") {
	  ap = 0.00;
	}
	else {
	  ap = parseFloat($("#latable tbody tr:eq("+i+") td:eq(4) input").val());
	}
	totalap = totalap + ap;
      }
      $('#latable tfoot tr:eq(0) td:eq(1)').html('<div class="form-control" disabled>'+parseFloat(totalap).toFixed(2)+'</div');
    }, doneTypingInterval);
  });
  
  $(document).off('click', '#btclose').on('click', '#btclose', function(event) {
    event.preventDefault();
    var billwisedata = [];
    var totalamountpaid = 0;
    for(var i = 0; i < $("#latable tbody tr").length; i++) {
      if ($("#latable tbody tr:eq("+i+") td:eq(4) input").val()=="") {
	$("#latable tbody tr:eq("+i+") td:eq(4) input").focus();
	$("#bwamount-blank-alert").alert();
	$("#bwamount-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#bwamount-blank-alert").hide();
	});
	return false;
      }
      var amountpaid = parseFloat($("#latable tbody tr:eq("+i+") td:eq(4) input").val());
      var invid = parseInt($("#latable tbody tr:eq("+i+")").data("invid"));
      var invamount = {};
      invamount["pdamt"] = amountpaid;
      invamount["invid"] = invid;
      billwisedata.push(invamount);
      totalamountpaid = totalamountpaid + amountpaid;
    }
    if (parseFloat(totalamountpaid) > parseFloat(sessionStorage.customeramount)) {
      $("#latable tbody tr:last td:eq(4) input").focus().select();
      $("#bwamount-alert").alert();
      $("#bwamount-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-alert").hide();
      });
      return false;
    }
    if (parseFloat(totalamountpaid) < parseFloat(sessionStorage.customeramount)) {
      $("#latable tbody tr:last td:eq(4) input").focus().select();
      $("#bwamount-less-alert").alert();
      $("#bwamount-less-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#bwamount-less-alert").hide();
      });
      return false;
    }
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
      }
    });
  });
});
