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
Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Akhil KP Dasan" <akhilkpdasan@protonmail.com>
*/

// This script is for user friendly voucher page for payment and receipt

$(document).ready(function() {
  $("#msspinmodal").modal("hide");  //Hides a spinner used to indicate that the page is getting loaded.
  $(".modal-backdrop").remove();  //Removes any backdrop of the spinner.

  $("#amount").numeric({ negative: false });
  $("#b-amount").numeric({ negative: false });
  $("#c-amount").numeric({ negative: false });

  $("#amount").val("0.00");
  $("#b-amount").val("0.00");
  $("#c-amount").val("0.00");

  $('.date').autotab('number');    //autotab is a library for automatically switching the focus to next input when max allowed characters are filled.

  $("#vdate").focus();

  function raiseAlertById(id) {
    $(id).alert();
    $(id).fadeTo(2250, 500).slideUp(500, function() {
      $(id).hide();
    })

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
    $("#show"+$("#vtype").val()).click();
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
  })
 
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
  })
 
  $("#pname").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#pname option:selected").val() == "") {
        raiseAlertById("#pname-blank");
      }
      $("#payment-mode").focus();
    }
    else if (event.which == 38) {
      var curName = $("#pname option:selected").val();
      var firstOption = $("#pname option:first").val();
      if (curName == firstOption) {
        $("#vdate").focus();
      }
    }
  })

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
  })

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
  })

  $("#vdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  })

  $("#vdate").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#vdate").val() == "") {
        raiseAlertById("#vdate-blank");
      }
      $("#month").focus();
    }
  })

  $("#month").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if($("#month").val() == "") {
        raiseAlertById("#month-blank");
      }
      $("#year").focus();
      }
    })

  $("#year").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#year").val() == "") {
        raiseAlertById("#year-blank");
      }
      $("#pname").focus();
    }
  })


  $("#year").blur(function(event) {
    if (!Date.parseExact($("#vdate").val()+$("#month").val()+$("#year").val(), "ddMMyyyy")) {
      raiseAlertById("#vdate-alert");
      $("#postdate-alert").hide();
      $('#vdate').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#year").val()+$("#month").val()+$("#vdate").val(), "yyyyMMdd");
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");

    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
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
  })


  $("#submit").click(function(event) {
    event.preventDefault();

    var date = $("#year").val()+"-"+$("#month").val()+"-"+$("#vdate").val();
    var party = $("#pname option:selected").val();
    var payment_mode = $("#payment-mode option:selected").val();
    var vtype = $("#vtype").val();
    var narration = $("#narration").val();

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
        raiseAlertById("#amount-blank")
        $("#amount").focus();
        return false;
      }
      if (amount == "0.00") {
        raiseAlertById("#amount-zero-alert");
        return false;
      }
    }

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
    }
    else if (payment_mode == "cash") {
      form_data.append("camount", amount);
    }
    else {
      form_data.append("bamount", amount);
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
          $("#reset").click();
          raiseAlertById("#success-alert");
        }
        else {
          raiseAlertById("#failure-alert");
          return false;
        }
      }
    })
  })

})
