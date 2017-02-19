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
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/

// This script is for the add adddeliverychallan.jinja2


$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.delchaldate').autotab('number');
  $("#deliverychallan_challanno").focus().select();
  $("#deliverychallan_date").numeric();
  $("#deliverychallan_month").numeric();
  $("#deliverychallan_year").numeric();
  $('.deliverychallan_product_quantity').numeric({ negative: false});
  $('#deliverychallan_noofpackages').numeric({ negative: false});
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
  $("#deliverychallan_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#deliverychallan_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#deliverychallan_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  // events for shifting focus. Enter shifts to next element and up arrow shifts to previous
  $("#deliverychallan_purchaseorder").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_challanno").focus().select();
    }
  });

  $("#deliverychallan_customer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_godown").focus().select();
    }
    if (event.which==38 && (document.getElementById('deliverychallan_customer').selectedIndex==1||document.getElementById('deliverychallan_customer').selectedIndex==0)) {
      event.preventDefault();
      $("#deliverychallan_year").focus().select();
    }
    if (event.which==32){
      event.preventDefault();
      $('#deliverychallan_addcust').click();
    }
  });

  $("#deliverychallan_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_challanno").focus().select();
    }
  });
  $("#deliverychallan_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_date").focus().select();
    }
  });

  $("#deliverychallan_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_customer").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_month").focus().select();
    }
  });

  $("#deliverychallan_challanno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_date").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_purchaseorder").focus().select();
    }
  });

  $("#deliverychallan_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_consignment').focus();
    }
    if (event.which==38 && $("#deliverychallan_godown option:selected").index()==0) {
      event.preventDefault();
      $("#deliverychallan_customer").focus().select();
    }
  });

  $("#deliverychallan_consignment").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:first td:eq(0) select').focus();
    }
    if (event.which==38 && document.getElementById('deliverychallan_consignment').selectedIndex==0) {
      event.preventDefault();
      $("#deliverychallan_godown").focus().select();
    }
  });
  $("#deliverychallan_noofpackages").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_modeoftransport').focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:last td:eq(1) input').focus();
    }
  });
  $("#deliverychallan_modeoftransport").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if($("#deliverychallan_issuername").length) {
        $('#deliverychallan_issuername').focus();
      }
      else {
        $('#deliverychallan_save').click();
      }
    }
    if (event.which==38) {
      event.preventDefault();
      $('#deliverychallan_noofpackages').focus();
    }
  });
  $("#deliverychallan_issuername").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_designation').focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $('#deliverychallan_modeoftransport').focus();
    }
  });
  $("#deliverychallan_designation").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_save').click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_issuername").focus().select();
    }
  });



  $(document).off("keyup").on("keyup",function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#deliverychallan_save").click();
      return false;
    }
  });

  $("#deliverychallan_customer").change(function(event) {
    $.ajax({
      url: '/customersuppliers?action=get',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid":$("#deliverychallan_customer option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
      if (resp["gkstatus"]==0) {
        $("#deliverychallan_customeraddr").val(resp["gkresult"]["custaddr"]);
        $("#deliverychallan_supplieraddr").val(resp["gkresult"]["custaddr"]);
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });


  $(document).off("change",".product_name").on("change",".product_name",function(event)
  { // depending on the productcode its unit of measurement is retrieved from te database and displayed to the user
    var productcode = $(this).find('option:selected').val();
    var curindex = $(this).closest('tbody tr').index();
  $.ajax({
    url: '/invoice?action=getproduct',
    type: 'POST',
    dataType: 'json',
    async : false,
    data : {"productcode":productcode},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
    console.log("success");
    if (resp["gkstatus"]==0) {
        // retrieved unit name is displayed as a span element
      $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) span').text(resp["unitname"]);
    }

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
});


  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
  {
      // focus shifting events based on ctrl and shift keys
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#deliverychallan_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#deliverychallan_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_consignment").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_consignment").focus().select();
      }
      else {
        $('#deliverychallan_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".deliverychallan_product_quantity").on("keydown",".deliverychallan_product_quantity",function(event)
  {
      /* enter key event. If enter key is pressed on product quaantity and
      all the details f this and all the details of previous rows of product table and the current row are filled
      then a new row is added aong with the availbable products filled in the product name select box*/
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#deliverychallan_product_table tbody tr").length-1)) {
        $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
      }
      else {
        if ($('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        //ajax call for getting all the available products in the database
        $.ajax({
          url: '/deliverychallan?action=getproducts',
          type: 'POST',
          dataType: 'json',
          async : false,
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp) {
          console.log("success");
          if (resp["gkstatus"]==0) {
              // new row is appended to the product table and the product name select box is populated with the retrieved products
            $('#deliverychallan_product_table tbody').append('<tr>'+
            '<td class="col-xs-7">'+
            '<select class="form-control input-sm product_name"></select>'+
            '</td>'+
            '<td class="col-xs-4">'+
            '<div class="input-group">'+
            '<input type="text" class="deliverychallan_product_quantity form-control input-sm text-right" value="">'+
              '<span class="input-group-addon input-sm" id="unitaddon"></span>'+
            '</div>'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
            '</tr>');
            for (product of resp["products"]) {
                // for loop to populate product in product name select box
              $('#deliverychallan_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
            }
            $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
            $('.deliverychallan_product_quantity').numeric({ negative: false});
            $(".product_name").change();
          }
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });

      }
    }

    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#deliverychallan_product_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
      if (curindex1==0) {
        event.preventDefault();
        $("#deliverychallan_consignment").focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      $('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
      event.preventDefault();
    }
    else if (event.which==35) {
      event.preventDefault();
      $("#deliverychallan_noofpackages").focus().select();
    }
  });


  $(document).off("click",".product_del").on("click", ".product_del", function() {
      // removing the row where the del is clicked
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#deliverychallan_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#deliverychallan_product_table tbody tr:last td:eq(0) input').select();
  });

  $("#deliverychallan_addcust").click(function() {
     $.ajax(
     {

     type: "POST",
     url: "/customersuppliers?action=showaddpopup",
     global: false,
     async: false,
     datatype: "text/html",
     beforeSend: function(xhr)
       {
         xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
       },
     success: function(resp)
     {

           $("#viewcustsup").html("");
           $('.modal-backdrop').remove();
           $('.modal').modal('hide');
           $("#viewcustsup").html(resp);
           $('#custsupmodal').modal('show');
           $('#custsupmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
           {
             $('#add_cussup').focus();
           });
           $('#custsupmodal').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the modal is opened
           {
            var text1 = $('#selectedcustsup').val();
           if(text1==''){
             $('#deliverychallan_customer').focus();
             return false;
           }
           console.log($('#status').val());
           if ($("#status").val()=='9') {
             var urlcustsup = "/customersuppliers?action=getallsups"
             console.log("inside in");
           }
           if($("#status").val()=='15'){
             var urlcustsup = "/customersuppliers?action=getallcusts"
             console.log("inside out");
           }
           $.ajax({
             type:"POST",
             url: urlcustsup,
             global:false,
             async:false,
             datatype: "text/json",
             beforeSend: function(xhr){
             xhr.setRequestHeader("gktoken",sessionStorage.gktoken);
             },
           })
           .done(function(resp) {
             var custs = resp["customers"];
             console.log("inside ajax done.");
             $("#deliverychallan_customer").empty();
             console.log($('#deliverychallan_customer').length);
             for (i in custs){
               $("#deliverychallan_customer").append('<option value="'+custs[i].custid+'" >'+custs[i].custname+'</option>');
             }
           });
           console.log($('#selectedcustsup').val());

            $("#deliverychallan_customer option").filter(function() {
                 return this.text == text1;
               }).attr('selected', true);
             $("#selectedcustsup").val("");
             $("#deliverychallan_customer").focus();
           });



     }
  }
   );
   });


  $("#deliverychallan_save").click(function(event) {
      // save event for saving the delivery note
    event.stopPropagation();
    // below are all the validation checks
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#deliverychallan_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#deliverychallan_challanno').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_date').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_month').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_year').focus();
      return false;
    }
    if(!Date.parseExact($("#deliverychallan_date").val()+$("#deliverychallan_month").val()+$("#deliverychallan_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#deliverychallan_date').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#deliverychallan_year").val()+$("#deliverychallan_month").val()+$("#deliverychallan_date").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#deliverychallan_date').focus().select();
      return false;
    }
    if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#deliverychallan_customer').focus();
      return false;
    }


    var products = []; // list to store dictionaries containing product details
    for (var i = 0; i < $("#deliverychallan_product_table tbody tr").length; i++) {
        // loop for getting details from each row at a time
      if ($("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      if ($("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      var obj = {}; //dict with keys as productcode and qty
      obj.productcode = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj); // a list named products is populated with the dictionaries obj
    }
    if ($.trim($('#deliverychallan_noofpackages').val())=="") {
      $("#noofpackages-blank-alert").alert();
      $("#noofpackages-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#noofpackages-blank-alert").hide();
      });
      $('#deliverychallan_noofpackages').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_modeoftransport').val())=="") {
      $("#modeoftransport-blank-alert").alert();
      $("#modeoftransport-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#modeoftransport-blank-alert").hide();
      });
      $('#deliverychallan_modeoftransport').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_issuername').val())=="" && $("#status").val()=='15') {
      $("#issuername-blank-alert").alert();
      $("#issuername-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#issuername-blank-alert").hide();
      });
      $('#deliverychallan_issuername').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_designation').val())=="" && $("#status").val()=='15') {
      $("#designation-blank-alert").alert();
      $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#designation-blank-alert").hide();
      });
      $('#deliverychallan_designation').focus();
      return false;
    }
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes').modal('show').one('click', '#dc_save_yes', function (e)
    {
        // modal opened for save confirmation as delivery note once created cannot be edited later
    $.ajax({ //ajax call for saving the delivery note
      url: '/deliverychallan?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid":$("#deliverychallan_customer option:selected").val(),
      "dcno":$("#deliverychallan_challanno").val(),
      "dcdate":$("#deliverychallan_year").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_date").val(),
      "inout":$("#status").val(),
      "noofpackages":$('#deliverychallan_noofpackages').val(),
      "modeoftransport":$('#deliverychallan_modeoftransport').val(),
      "issuername":$("#deliverychallan_issuername").val(),
      "designation":$("#deliverychallan_designation").val(),
      "goid":$("#deliverychallan_godown option:selected").val(),
      "products":JSON.stringify(products),// a list always needs to be stringified into json before sending it ahead
      "dcflag":$("#deliverychallan_consignment option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){

        if ($("#status").val()=='9') {
            //9 is for delivery in
          $("#deliverychallan_record").click();
        }
        else {
          $("#deliverychallan_create").click();
        }
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
        return false;
      }
      else if(resp["gkstatus"]==1) {
        $("#deliverychallan_challanno").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#deliverychallan_purchaseorder").focus();
        $("#failure-alert").alert();
        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert").hide();
        });
        return false;
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

    return false;
  });
  });
  $("#confirm_yes").on('shown.bs.modal', function(event) {
      // on opening of modal the focus should be by efault on the no option so this event
    $("#dc_save_no").focus();

  });
  $("#confirm_yes").on('hidden.bs.modal', function(event) {
      // after te modal is closed the focus should be on the delivery note number so this event
    $("#deliverychallan_challanno").focus();
  });

  $("#deliverychallan_saveprint").click(function(event) {
      /* event is same as save event just that the data is collected and
       the delivery note is saved and the same data is passed on
       to a page displaying the print preview ready to be printed */
    event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#deliverychallan_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#deliverychallan_challanno').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_date').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_month').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_year').focus();
      return false;
    }
    if(!Date.parseExact($("#deliverychallan_date").val()+$("#deliverychallan_month").val()+$("#deliverychallan_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#deliverychallan_date').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#deliverychallan_year").val()+$("#deliverychallan_month").val()+$("#deliverychallan_date").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#deliverychallan_date').focus().select();
      return false;
    }
    if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#deliverychallan_customer').focus();
      return false;
    }


    var products = [];
    for (var i = 0; i < $("#deliverychallan_product_table tbody tr").length; i++) {
      if ($("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      if ($("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      var obj = {};
      obj.productcode = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj);
    }
    if ($.trim($('#deliverychallan_noofpackages').val())=="") {
      $("#noofpackages-blank-alert").alert();
      $("#noofpackages-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#noofpackages-blank-alert").hide();
      });
      $('#deliverychallan_noofpackages').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_modeoftransport').val())=="") {
      $("#modeoftransport-blank-alert").alert();
      $("#modeoftransport-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#modeoftransport-blank-alert").hide();
      });
      $('#deliverychallan_modeoftransport').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_issuername').val())=="" && $("#status").val()=='15') {
      $("#issuername-blank-alert").alert();
      $("#issuername-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#issuername-blank-alert").hide();
      });
      $('#deliverychallan_issuername').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_designation').val())=="" && $("#status").val()=='15') {
      $("#designation-blank-alert").alert();
      $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#designation-blank-alert").hide();
      });
      $('#deliverychallan_designation').focus();
      return false;
    }
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes_dc').modal('show').one('click', '#dc_save_yesprint', function (e)
    {
    $.ajax({ // ajax for saving the delivery note
      url: '/deliverychallan?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid":$("#deliverychallan_customer option:selected").val(),
      "dcno":$("#deliverychallan_challanno").val(),
      "dcdate":$("#deliverychallan_year").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_date").val(),
      "inout":$("#status").val(),
      "noofpackages":$('#deliverychallan_noofpackages').val(),
      "modeoftransport":$('#deliverychallan_modeoftransport').val(),
      "issuername":$("#deliverychallan_issuername").val(),
      "designation":$("#deliverychallan_designation").val(),
      "goid":$("#deliverychallan_godown option:selected").val(),
      "products":JSON.stringify(products),
      "dcflag":$("#deliverychallan_consignment option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        if ($("#status").val()=='15') {
          printset = []; // list containing dict of product details
          qtytotal =0;
          for (var i = 0; i < $("#deliverychallan_product_table tbody tr").length; i++) {
            var obj = {};// dict containing product details

            obj.productdesc = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text();
            obj.qty = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val();
            obj.unitname = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) span").text();
            /* total of product quantities to be displayed in the delivery note at the very end of product details*/
            qtytotal += +obj.qty;
            printset.push(obj);
          }
          $.ajax({ // passing the delivery note details to a page displaying it as a print preview
            url: '/deliverychallan?action=print',
            type: 'POST',
            dataType: 'html',
            data: {"dcno": $("#deliverychallan_challanno").val(),
            "custid":$("#deliverychallan_customer option:selected").val(),
            "dcdate":$("#deliverychallan_date").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_year").val(),
            "printset":JSON.stringify(printset),
            "issuername":$("#deliverychallan_issuername").val(),
            "designation":$("#deliverychallan_designation").val(),
            "goid":$("#deliverychallan_godown option:selected").val(),
            "notetype":$("#deliverychallan_consignment option:selected").text(),
            "qtytotal":qtytotal,
            },
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
          .done(function(resp) {
            console.log("success");
            $('#info').html(resp);
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });
      }
    }
      else if(resp["gkstatus"]==1) {
        $("#deliverychallan_challanno").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#deliverychallan_purchaseorder").focus();
        $("#failure-alert").alert();
        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert").hide();
        });
        return false;
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

    return false;
  });
});
$("#confirm_yes_dc").on('shown.bs.modal', function(event) {
  $("#dc_save_noprint").focus();

});
$("#confirm_yes_dc").on('hidden.bs.modal', function(event) {
  $("#deliverychallan_challanno").focus();
});


  $("#deliverychallan_reset").click(function(event) {
      // function for resetting the entered delivery note details
    if ($("#status").val()=='9') {
      $("#deliverychallan_record").click();
    }
    else {
      $("#deliverychallan_create").click();
    }
  });
});
