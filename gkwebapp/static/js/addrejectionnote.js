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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/

// This script is for the add addrejectionnote.jinja2


$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.rndate').autotab('number');
  $("#rejectionnote_noteno").focus().select();
  $("#rejectionnote_date").numeric();
  $("#rejectionnote_month").numeric();
  $("#rejectionnote_year").numeric();
  $('.rejectionnote_product_quantity').numeric({ negative: false});
  $('.rejectionnote_product_rejected_quantity').numeric({ negative: false});
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
    }
  }
  function yearpad (str, max) { //to add leading 20 or 200 in the year
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("200" + str, max) : str;
    }
    else if (str.length==2) {
      return str.length < max ? pad("20" + str, max) : str;
    }
    else{
      return str
    }
  }
  $("#rejectionnote_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#rejectionnote_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#rejectionnote_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  // events for shifting focus. Enter shifts to next element and up arrow shifts to previous
  $("#rejectionnote_noteno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_date").focus().select();
    }
  });
  $("#rejectionnote_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#rejectionnote_noteno").focus().select();
    }
  });
  $("#rejectionnote_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#rejectionnote_date").focus().select();
    }
  });
  $("#rejectionnote_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_invoice").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#rejectionnote_month").focus().select();
    }
  });
  $("#rejectionnote_invoice").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_deliverynote").focus();
    }
    if (event.which==38 && document.getElementById('rejectionnote_invoice').selectedIndex==0) {
      event.preventDefault();
      $('#rejectionnote_year').focus().select();
    }
  });
  $("#rejectionnote_deliverynote").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#rejectionnote_product_table tbody tr:first td:eq(2) input').focus().select();
    }
    if (event.which==38 && document.getElementById('rejectionnote_deliverynote').selectedIndex==0) {
      event.preventDefault();
      $("#rejectionnote_invoice").focus();
    }
  });
  //insert key press event
  $(document).off("keyup").on("keyup",function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#rejectionnote_save").click();
      return false;
    }
  });
  $(document).off("keydown",".rejectionnote_product_rejected_quantity").on("keydown",".rejectionnote_product_rejected_quantity",function(event) {
    if (event.which==13) {
      event.preventDefault();
      if($(this).closest("tr").is(":last-child")){
        $("#rejectionnote_save").focus();
      }
      else{
        var ind = $(this).closest("tr").index() + 1;
        $('#rejectionnote_product_table tbody tr:eq('+ind+') td:eq(2) input').focus().select();
      }
    }
    if (event.which==38) {
      event.preventDefault();
      if($(this).closest("tr").is(":first-child")){
        $("#rejectionnote_deliverynote").focus();
      }
      else{
        var ind = $(this).closest("tr").index() - 1;
        $('#rejectionnote_product_table tbody tr:eq('+ind+') td:eq(2) input').focus().select();
      }
    }
  });
  $(document).off("change", "#rejectionnote_deliverynote").on("change", "#rejectionnote_deliverynote", function(event) {
    if ($("#rejectionnote_deliverynote option:selected").val() != '') {
      $("#rejectionnote_invoice option[value='']").prop("selected", true);
      $.ajax({
        url: '/invoice?action=getdeliverynote',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: { "dcid": $("#rejectionnote_deliverynote option:selected").val() },
        beforeSend: function(xhr) {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
       .done(function(resp) {
         if(resp["delchal"]["delchaldata"]["dcflag"] == 1){
           $("#rejectionnote_consignment").val("Approval");
         }
         else if(resp["delchal"]["delchaldata"]["dcflag"] == 3){
           $("#rejectionnote_consignment").val("Consignment");
         }
         else if(resp["delchal"]["delchaldata"]["dcflag"] == 4){
           $("#rejectionnote_consignment").val("Sale");
         }
         else if(resp["delchal"]["delchaldata"]["dcflag"] == 5){
           $("#rejectionnote_consignment").val("Free Replacement");
         }
         else if(resp["delchal"]["delchaldata"]["dcflag"] == 19){
           $("#rejectionnote_consignment").val("Sample");
         }
         $("#rejectionnote_godown").val(resp["delchal"]["delchaldata"]["goname"] + "("+ resp["delchal"]["delchaldata"]["gostate"] +")");
         if (resp["gkstatus"] == 0) {
           $.ajax({
             url: '/customersuppliers?action=get',
             type: 'POST',
             dataType: 'json',
             async: false,
             data: { "custid": resp["delchal"]["delchaldata"]["custid"] },
             beforeSend: function(xhr) {
               xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
             }
           })
            .done(function(resp) {
              console.log("success");
              if (resp["gkstatus"] == 0) {
                $("#rejectionnote_customer").val(resp["gkresult"]["custname"]);
                $("#rejectionnote_customeraddr").val(resp["gkresult"]["custaddr"]);
                $("#rejectionnote_supplieraddr").val(resp["gkresult"]["custaddr"]);
                $("#rejectionnote_customertin").val(resp["gkresult"]["custtan"]);
                $("#rejectionnote_suppliertin").val(resp["gkresult"]["custtan"]);
              }
            })
            .fail(function() {
              console.log("error");
            })
            .always(function() {
              console.log("complete");
            });
           $('#rejectionnote_product_table tbody').empty();
           $.ajax({
                   url: '/invoice?action=getdelinvprods',
                   type: 'POST',
                   dataType: 'json',
                   async: false,
                   data: {"dcid": $("#rejectionnote_deliverynote option:selected").val()},
                   beforeSend: function(xhr) {
                       xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                   }
               })
               .done(function(resp) {
                   console.log("success");
                   if (resp["gkstatus"] == 0) {
                     $.each(resp.items, function(key, value) {
                       $('#rejectionnote_product_table tbody').append('<tr>' +
                           '<td class="col-xs-5">' +
                           '<input class="form-control input-sm product_name" data="' + key + '" value="' + value.productdesc + '" disabled>' +
                           '</td>' +
                           '<td class="col-xs-3">' +
                           '<div class="input-group">' +
                           '<input type="text" class="rejectionnote_product_quantity form-control input-sm text-right" data="' + value.qty + '" value="' + value.qty + '" disabled>' +
                           '<span class="input-group-addon input-sm" id="unitaddon">' + value.unitname + '</span>' +
                           '</div>' +
                           '</td>' +
                           '<td class="col-xs-3">' +
                           '<div class="input-group">' +
                           '<input type="text" class="rejectionnote_product_rejected_quantity form-control input-sm text-right value="0.00">' +
                           '<span class="input-group-addon input-sm" id="unitaddon">' + value.unitname + '</span>' +
                           '</div>' +
                           '</td>' +
                           '<td class="col-xs-1">' +
                           '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
                           '</td>' +
                           '</tr>');
                        $('#rejectionnote_product_table tbody tr:eq(' + $(this).closest("tr").index() + ') td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
                     });
                   }
               })
               .fail(function() {
                   console.log("error");
               })
               .always(function() {
                   console.log("complete");
               });
         }
       })
       .fail(function() {
         console.log("error");
       })
       .always(function() {
         console.log("complete");
       });
     }
     else{
       $('#rejectionnote_product_table tbody').empty();
       $('#rejectionnote_product_table tbody').append('<tr>' +
           '<td class="col-xs-5">' +
           '<input class="form-control input-sm product_name" placeholder="None" disabled>' +
           '</td>' +
           '<td class="col-xs-3">' +
           '<div class="input-group">' +
           '<input type="text" class="rejectionnote_product_quantity form-control input-sm text-right" placeholder="0.00" disabled>' +
           '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
           '</div>' +
           '</td>' +
           '<td class="col-xs-3">' +
           '<div class="input-group">' +
           '<input type="text" class="rejectionnote_product_rejected_quantity form-control input-sm text-right value="0.00">' +
           '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
           '</div>' +
           '</td>' +
           '<td class="col-xs-1">' +
           '</td>' +
           '</tr>');
     }
  });
  
  $("#confirm_yes").on('shown.bs.modal', function(event) {
      // on opening of modal the focus should be by efault on the no option so this event
    $("#dc_save_no").focus();

  });
  $("#confirm_yes").on('hidden.bs.modal', function(event) {
      // after te modal is closed the focus should be on the delivery note number so this event
    $("#rejectionnote_noteno").focus();
  });
  $("#rejectionnote_reset").click(function(event) {
      // function for resetting the entered delivery note details
    if ($("#status").val()=='9') {
      $("#rejectionnote_in").click();
    }
    else {
      $("#rejectionnote_out").click();
    }
  });
});
