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

  $('.date').autotab('number');    //autotab is a library for automatically switching the focus to next input when max allowed characters are filled.

  $("#vdate").focus();

  $("#reset").click(function(event) {
    event.preventDefault();
    $('#vdetails').find('input:text, textarea').val('');
    $("#date").trigger("reset");
  })

  $("#narration").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#submit").click();
    }
    else if (event.which == 38) {
      event.preventDefault();
      $("#payment-mode").focus();
    }
  })

  $("#payment-mode").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#narration").focus();
    } 
    else if (event.which == 38) {
      event.preventDefault();
      $("#amount").focus();
    }
  })
 
  $("#amount").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#payment-mode").focus();
    }
    else if (event.which == 38) {
      event.preventDefault();
      $("#pname").focus();
    }
  })
 
  $("#pname").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#pname option:selected").val() == "") {
        $("#pname-blank").alert();
        $("#pname-blank").fadeTo(2250, 500).slideUp(500, function(){
          $("#pname-blank").hide();
        });
      };
      $("#amount").focus();
    }
    else if (event.which == 38) {
      $("#vdate").focus();
    }
  })

  $(document).off("focusout","#amount").on("focusout","#amount",function(event) {
    if ($(this).val()=="" || $.trim($(this).val())==".") {
      $(this).val("0.00");
    }
    else{
      $(this).val((parseFloat($(this).val()).toFixed(2)));
    }
  });


  $("#vdate").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#vdate").val() == "") {
        $("#vdate-blank").alert();
        $("#vdate-blank").fadeTo(2250, 500).slideUp(500, function() {
          $("#vdate-blank").hide();
        });
      }
      $("#month").focus();
    }
  })

  $("#month").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if($("#month").val() == "") {
        $("#month-blank").alert();
        $("#month-blank").fadeTo(2250, 500).slideUp(500, function() {
          $("#month-blank").hide();
        })
      }
      $("#year").focus();
      }
    })

  $("#year").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      if ($("#year").val() == "") {
        $("#year-blank").alert();
        $("#year-blank").fadeTo(2250, 500).slideUp(500, function() {
          $("#year-blank").hide();
        })
      }
      $("#pname").focus();
    }
  })


  $("#year").blur(function(event) {
    if (!Date.parseExact($("#vdate").val()+$("#month").val()+$("#year").val(), "ddMMyyyy")) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
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

    //if (Date.today().compareTo(curdate) == -1) {
    //  $("#postdate-alert").alert();
    //  $("#postdate-alert").show();
    //}
    //else {
    //  $("#postdate-alert").hide();
    //}
  });


  $("#vdetails").submit(function(event) {
    event.preventDefault();

    var date = $("#year").val()+"-"+$("#month").val()+"-"+$("#vdate").val();
    var party = $("#pname option:selected").val();
    var amount = $("#amount").val();
    var payment_mode = $("#payment-mode option:selected").val();
    var vtype = $("#vtype").val();
    var narration = $("#narration").val();

    if ($("#vdate").val() == "") {
      $("#vdate-blank").alert();
      $("#vdate-blank").fadeTo(2250, 500).slideUp(500, function() {
        $("#vdate-blank").hide();
      })
      return false;
    }

    if ($("#month").val() == "") {
      $("#month-blank").alert();
      $("#month-blank").fadeTo(2250, 500).slideUp(500, function() {
        $("#month-blank").hide();
      })
      return false;
    }

    if ($("#year").val() == "") {
      $("#year-blank").alert();
      $("#year-blank").fadeTo(2250, 500).slideUp(500, function() {
        $("#year-blank").hide();
      })
      return false;
    }

    if (amount == "") {
      $("#amount-blank").alert();
      $("#amount-blank").fadeTo(2250, 500).slideUp(500, function() {
        $("#amount-blank").hide();
      })
      return false;
    }

    if (amount == "0.00") {
      $("#amount-zero-alert").alert();
      $("#amount-zero-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#amount-zero-alert").hide();
      })
      return false;
    }

    var form_data = new FormData();

    var files = $("#my-file-selector")[0].files;
    var filelist = [];
    for (var i = 0; i < files.length; i++) {
      form_data.append("file"+i,files[i]);
    }

    form_data.append("party", party);
    form_data.append("amount", amount);
    form_data.append("payment_mode", payment_mode);
    form_data.append("vtype", vtype);
    form_data.append("date", date);
    form_data.append("narration", narration);

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
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#success-alert").hide();
          })
        }
        else {
          $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#failure-alert").hide();
          })
          return false;
        }
      }
    })
  })

})
