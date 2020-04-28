/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"Akhil KP Dasan" <akhilkpdasan@protonmail.com>
*/

// This script is for user friendly voucher page for payment and receipt

$(document).ready(function() {
  if($("#voucher_modal").length==0){
  $("#msspinmodal").modal("hide");  //Hides a spinner used to indicate that the page is getting loaded.
  $(".modal-backdrop").remove();  //Removes any backdrop of the spinner.
  }
  $("#amount").numeric({ negative: false });
  $("#b-amount").numeric({ negative: false });
  $("#c-amount").numeric({ negative: false });

  $("#amount").val("0.00");
  $("#b-amount").val("0.00");
  $("#c-amount").val("0.00");

    $('.date').autotab('number');    //autotab is a library for automatically switching the focus to next input when max allowed characters are filled.

    //Converting Party Name List to Searchable Combo
    $("#pname").searchify();

    if (!$("#invsel").is(":hidden")) {
	//Converting Invoice List to Searchable Combo
	$("#invsel").searchify();
    }
    
    if ($("#invsel").length > 0){
	$("#invsel").focus();
	}
    else{
	$('#vdate').focus().select();
    }

  function raiseAlertById(id) {
    $(id).alert();
    $(id).fadeTo(2250, 500).slideUp(500, function() {
  $(id).hide();
  $("#msspinmodal").modal("hide");
  if(id=="#success-alert"){
    $("#reset").click();
  if($('#voucher_modal').length>0)  {
  $('#voucher_modal').modal('hide');}

  }
  
    });

  }

  function adjustAmountByID(id) {
    $(document).off("focusout",id).on("focusout",id,function(event) {
      if ($(this).val()=="" || $.trim($(this).val())==".") {
        $(this).val("0.00");
      }
      else{
        $(this).val((parseFloat($(this).val()).toFixed(2)));
      }
    });
  }

  adjustAmountByID("#amount");
  adjustAmountByID("#b-amount");
  adjustAmountByID("#c-amount");

  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str;
    }
  }

  function yearpad (str, max) {
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("200" + str, max) : str;
    }
    else if (str.length==2) {
      return str.length < max ? pad("20" + str, max) : str;
    }
    else{
      return str;
    }
  }

  $("#reset").click(function(event) {
    event.preventDefault();
    if($("#voucher_modal").length==0){
    $("#show"+$("#vtype").val()).click();
    }
    else{
      var inv = $("#invsel option:selected").attr("total"); //Total amount of invoices.
      var invbalance = $("#invsel option:selected").attr("balance");  //Balance of invoices.
    if ($.trim(inv)!="")
    {
        $("#invtotal").val(parseFloat(inv).toFixed(2));  //Total amount of invoice is displayed.
        $("#invbalance").val(parseFloat(invbalance).toFixed(2));  //Balance of invoice is displayed.
    }
    else
      {
    //Total and balance displayed are set to zero when no invoice is selected.
        $("#invtotal").val(parseFloat(0).toFixed(2));
        $("#invbalance").val(parseFloat(0).toFixed(2));
        inv = 0;
        invbalance = 0;
      }
      //Customer/Supplier is picked up from invoice and corresponding account is selected automatically.
      var value = $('#invsel option:selected').attr("customername");
    $("#amount").val(invbalance);
    if(value){
        $('#pname option').each(function(index) {
      if ($(this).text() == value) {
          $(this).prop("selected", true);
      }
        });
      }
    }
  });

  var delta = 600;
    var lastKeypressTime = 0;
    
  $("#narration").keydown(function(event) {
    if (event.which==13){
      var thisKeypressTime = new Date();
      if ( thisKeypressTime - lastKeypressTime <= delta ) {
        $("#submit").click();
        thisKeypressTime = 0;
      }
	  lastKeypressTime = thisKeypressTime;
    }
    else if (event.which == 38) {
      event.preventDefault();
      if ($("#amount-container").is(":visible")) {
        $("#amount").focus().select();
      }
      else {
        $("#c-amount").focus().select();
      }
    }
  });

  $("#payment-mode").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($("#amount-container").is(":visible")) {
        $("#amount").focus().select();
      }
      else {
        $("#b-amount").focus().select();
      }
    } 
    else if (event.which == 38) {
      if ($("#payment-mode").val() == "bank") {
        $("#pname").focus();
      }
    }
  });
 
  $("#amount").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($("#amount").val() == "0.00" || $("#amount").val() == "0") {
        raiseAlertById("#amount-zero-alert");
        $("#amount").focus().select();
        return false;
      }
      if ($("#amount").val() == "") {
        raiseAlertById("#amount-blank");
        $("#amount").focus().select();
        return false;
      }
      $("#narration").focus();
    }
    else if (event.which == 38) {
      event.preventDefault();
      $("#payment-mode").focus();
    }
  });
 
  $("#pname").keydown(function(event) {
    if (event.which == 13) {
	event.preventDefault();
	$("#msspinmodal").modal("show");
	setTimeout( function() {
	    if ($("#pname").next().val() == "") {
		raiseAlertById("#pname-blank");
	    }
	    $("#payment-mode").focus();
	    $("#msspinmodal").modal("hide");
	}, 25 );
    }
    else if (event.which == 38) {
      var curName = $("#pname option:selected").val();
      var firstOption = $("#pname option:first").val();
      if (curName == firstOption) {
        $("#vdate").focus();
      }
    }
  });

  $("#b-amount").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($("#b-amount").val() == "0.00" || $("#b-amount").val() == "0") {
        raiseAlertById("#amount-zero-alert");
        $("#b-amount").focus().select();
        return false;
      }
      if ($("#b-amount").val() == ""){
        raiseAlertById("#b-amount-blank");
        $("#b-amount").focus().select();
        return false;
      }
      $("#c-amount").focus().select();
    }
    else if (event.which == 38) {
      $("#payment-mode").focus();
    }
  });

  $("#c-amount").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($("#c-amount").val() == "0.00" || $("#c-amount").val() == "0") {
        raiseAlertById("#amount-zero-alert");
        $("#c-amount").focus().select();
        return false;
      }
      if ($("#c-amount").val() == ""){
        raiseAlertById("#c-amount-blank");
        $("#c-amount").focus().select();
        return false;
      }
      $("#narration").focus();
    }
    else if (event.which == 38) {
      $("#b-amount").focus().select();
    }
  });

  $("#vdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#vdate").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#vdate").val() == "") {
        raiseAlertById("#vdate-blank");
      }
      $("#month").focus();
    }
  });

  $("#month").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if($("#month").val() == "") {
        raiseAlertById("#month-blank");
      }
      $("#year").focus();
      }
  });

  $("#year").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#year").val() == "") {
        raiseAlertById("#year-blank");
      }
      $("#pname").focus();
    }
  }); 


  $("#year").blur(function(event) {
    if (!Date.parseExact($("#vdate").val()+$("#month").val()+$("#year").val(), "ddMMyyyy")) {
      raiseAlertById("#date-alert");
      $("#postdate-alert").hide();
      $('#vdate').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#year").val()+$("#month").val()+$("#vdate").val(), "yyyyMMdd");
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var invoicedate= Date.parseExact($("#invsel option:selected").attr("invdate"), "dd-MM-yyyy");
   
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
        $("#postdate-alert").hide();
        $('#vdate').focus().select();
      });
      return false;
  }

  if(curdate < invoicedate){
    $('#vdate').focus().select();
    $("#inv-date-alert").alert();
      $("#inv-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#inv-date-alert").hide();
        $("#postdate-alert").hide();
        $('#vdate').focus().select();
      });
      return false;
  }
  
  });

  $("#payment-mode").change(function() {
    if ($(this).val() == "both") {
      $("#amount-container").hide();
      $("#split-amount-container").show();
    }
    else {
      $("#amount-container").show();
      $("#split-amount-container").hide();
    }
  });

    $("#addcust").click(function(event) {
  event.preventDefault();
	var statusinout;
    if ($("#vtype").val() == 'payment') {
      statusinout = "in";
    }
    if ($("#vtype").val() == 'receipt') {
      statusinout = "out";
    }
    $.ajax({

      type: "POST",
      url: "/customersuppliers?action=showaddpopup",
      global: false,
      async: false,
      data: { "status": statusinout },
      datatype: "text/html",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(resp) {

        $("#viewcustsup").html("");

        $('.modal-backdrop').remove();
        $('.modal').modal('hide');

        $("#viewcustsup").html(resp);
          $('#custsupmodal').modal('show');

        $('#custsupmodal').on('shown.bs.modal', function(e) // shown.bs.modal is an event which fires when the modal is opened
			      {
            $('#add_cussup_name').focus();
          });
        $('#custsupmodal').on('hidden.bs.modal', function(e) // hidden.bs.modal is an event which fires when the modal is opened
			      {
            var text1 = $('#selectedcustsup').val();
            if (text1 == '') {
              $('#invoice_customer').focus();
              return false;
            }
            var urlcustsup = "/customersuppliers?action=getallsups";
            if ($("#vtype").val() == 'receipt') {
		urlcustsup = "/customersuppliers?action=getallcusts";
            }
            $.ajax({
              type: "POST",
              url: urlcustsup,
              global: false,
              async: false,
              datatype: "text/json",
              beforeSend: function(xhr) {
                xhr.setRequestHeader("gktoken", sessionStorage.gktoken);
              }
            })
             .done(function(resp) {
               var custs = resp["customers"];
               $("#pname").empty();

               for (var i in custs) {
                 $("#pname").append('<option value="' + custs[i].custid + '" >' + custs[i].custname + '</option>');
               }
		 $("#pname option").filter(function() {
                     return this.text == text1;
                 }).attr('selected', true).trigger('change'); //Selects the latest added customer/supplier.
		 $("#pname").change();
             });
            $("#selectedcustsup").val("");
              $("#pname").focus();
	      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
          });
      }
    });
    })

    
    $("#invsel").keydown(function(event) {
    if (event.which == 13) {
	event.preventDefault();
	$("#msspinmodal").modal("show");
	setTimeout( function() {
	    $("#vdate").focus();
	    $("#msspinmodal").modal("hide");
	}, 25 );
    }
  });
    
    $(document).off("change","#invsel").on('change', '#invsel', function(event) {
  event.preventDefault();
    /* Act on the event */
    var inv = $("#invsel option:selected").attr("total"); //Total amount of invoices.
    var invbalance = $("#invsel option:selected").attr("balance");  //Balance of invoices.
  if ($.trim(inv)!="")
  {
      $("#invtotal").val(parseFloat(inv).toFixed(2));  //Total amount of invoice is displayed.
      $("#invbalance").val(parseFloat(invbalance).toFixed(2));  //Balance of invoice is displayed.
  }
  else
    {
	//Total and balance displayed are set to zero when no invoice is selected.
      $("#invtotal").val(parseFloat(0).toFixed(2));
      $("#invbalance").val(parseFloat(0).toFixed(2));
      inv = 0;
      invbalance = 0;
    }
    //Customer/Supplier is picked up from invoice and corresponding account is selected automatically.
    var value = $('#invsel option:selected').attr("customername");
	$("#amount").val(invbalance);
	if(value){
	    $('#pname option').each(function(index) {
		if ($(this).text() == value) {
		    $(this).prop("selected", true);
		}
	    });
    }

});

  $("#submit").click(function(event) {
    event.preventDefault();
    var invoicedate= Date.parseExact($("#invsel option:selected").attr("invdate"), "dd-MM-yyyy");
    var date = $("#year").val()+"-"+$("#month").val()+"-"+$("#vdate").val();
    var party = $("#pname option:selected").val();
    var payment_mode = $("#payment-mode option:selected").val();
    var vtype = $("#vtype").val();
      var narration = $("#narration").val();
      var customername = "";
      var customercode = 0;
      var numberofcustomers = 0;
      
    if(payment_mode == "both") {
      var bamount = $("#b-amount").val();
      var camount = $("#c-amount").val();
    }
    else {
      var amount = $("#amount").val();
    }


    if ($("#vdate").val() == "") {
      raiseAlertById("#vdate-blank");
      $("#vdate").focus();
      return false;
    }

    if ($("#month").val() == "") {
      raiseAlertById("#month-blank");
      $("#month").focus();
      return false;
    }

    if ($("#year").val() == "") {
      raiseAlertById("#year-blank");
      $("#year").focus();
      return false;
    }

    if( Date.parseExact(date, "yyyy-MM-dd") < invoicedate){
      $('#vdate').focus().select();
      $("#inv-date-alert").alert();
        $("#inv-date-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#inv-date-alert").hide();
          $("#postdate-alert").hide();
          $('#vdate').focus().select();
        });
        return false;
    }

    if (payment_mode == "both") {
      if (bamount == "") {
        raiseAlertById("#b-amount-blank");
        $("#b-amount").focus();
        return false;
      }
      if (camount == "") {
        raiseAlertById("#c-amount-blank");
        $("#c-amount").focus();
        return false;
      }
      if (bamount == "0.00" || camount == "0.00") {
        raiseAlertById("#amount-zero-alert");
        return false;
      }
    }
    else {
      if (amount == "") {
          raiseAlertById("#amount-blank");
        $("#amount").focus();
        return false;
      }
      if (amount == "0.00") {
        raiseAlertById("#amount-zero-alert");
        return false;
      }
    }
      var vtotal = 0.00;

    var form_data = new FormData();

    var files = $("#my-file-selector")[0].files;
    var filelist = [];
    for (var i = 0; i < files.length; i++) {
      form_data.append("file"+i,files[i]);
    }

    form_data.append("party", party);
    form_data.append("payment_mode", payment_mode);
    form_data.append("vtype", vtype);
    form_data.append("date", date);
    form_data.append("narration", narration);

    if (payment_mode == "both") {
      form_data.append("bamount", bamount);
	form_data.append("camount", camount);
	vtotal = bamount + camount;
    }
    else if (payment_mode == "cash") {
	form_data.append("camount", amount);
	vtotal = amount;
    }
    else {
	form_data.append("bamount", amount);
	vtotal = amount;
    }
      if ($("#invsel").length > 0 && $("#invsel option:selected").val() != "") {
	  form_data.append("invid", $("#invsel option:selected").val());
      }
      if (sessionStorage.billflag == 1 && $("#invsel option:selected").val() != '') {
	  let billamount = $("#invbalance").val();  // Amount to be adjusted is set to balance of invoice selected.
	  if(parseFloat(billamount) > parseFloat(vtotal)) {
	      billamount = vtotal;  // If balance of invoice is more than voucher amount then amount to be adjusted is set to voucher amount.
	  }
	  //A dictionary with invoice id and amount to be adjusted is created.
	  let billdetails = {};
	  billdetails["invid"] = parseInt($("#invsel option:selected").val());
	  billdetails["adjamount"] = billamount;
	  form_data.append("billdetails",JSON.stringify(billdetails));
	  form_data.append("invoice", $("#invsel option:selected").text());
      }
    $.ajax({
      type: "POST",
      url: "/addvoucherauto",
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      datatype: "json",
      data: form_data,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken );
      },
      success: function(resp) {
        if(resp.gkstatus == true) { // if the voucher is saved show an alert and then reset the voucher form and clear all variables.
	    if(resp.paymentstatus == true){
		    $("#success-alert").html("Voucher saved successfully. Amount of <b class='text-danger'>" + parseFloat(resp.billdetails.amount).toFixed(2) + "</b> adjusted to invoice <b class='text-primary'>" + resp.billdetails.invoice + "</b>.");
	    }
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
          raiseAlertById("#success-alert");
        }
          else {
	      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
          raiseAlertById("#failure-alert");
          return false;
        }
      }
    });
  });

});
