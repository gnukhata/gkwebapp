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
"Prajkta Patkar"<prajkta.patkar007@gmail.com>
*/

// This script is for the addinvoice.jinja2


$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.invoicedate').autotab('number');
  $("#invoice_deliverynote").focus();
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var issuername;
  var designation;
  var pqty=0.00;
  var ptaxamt=0.00;
  var perprice=0.00;
  var ptotal=0.00;
  var taxrate=0.00;
  var dctaxstate;
  var custstate;
  var producstate;
  if ($("#status").val()=='15')
  {
    $(".invoice_issuer").show();
    $(".invstate").show();
    $(".fixed-table").removeClass('fixed-tablepurchase');
    $(".fixed-table").addClass('fixed-tablesale');

  }

  $("#invoice_date").numeric({ negative: false});
  $("#invoice_month").numeric({ negative: false});
  $("#invoice_year").numeric({ negative: false});
  $('.invoice_product_quantity').numeric({ negative: false});
  $('.invoice_product_per_price').numeric({ negative: false});
  $("#invoice_deliverynote").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#invoice_challanno").focus().select();
    }
  });

  $("#invoice_challanno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#invoice_date").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#invoice_deliverynote").focus().select();
    }
  });


  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
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
      return str
    }
  }
  $("#invoice_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#invoice_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#invoice_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#invoice_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#invoice_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#invoice_challanno").focus().select();
    }
  });
  $("#invoice_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#invoice_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#invoice_date").focus().select();
    }
  });

  $("#invoice_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($("#invoice_customer").is(":disabled")) {
        $('#invoice_product_table tbody tr:first td:eq(0) select').focus();
      }
      else {
        $("#invoice_customer").focus().select();
      }
    }
    if (event.which==38) {
      event.preventDefault();
      $("#invoice_month").focus().select();
    }
  });

  $("#invoice_customer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      //Checks if VAT Applicable to field is disabled or hidden and adjusts key events accordingly
      if ($("#invoice_state").is(":hidden") || $("#invoice_state").is(":disabled")) {
        $('#invoice_product_table tbody tr:first td:eq(0) select').focus();
      }
      else {
        $("#invoice_state").focus();
      }

    }
    if (event.which==38 && (document.getElementById('invoice_customer').selectedIndex==1||document.getElementById('invoice_customer').selectedIndex==0)) {
      event.preventDefault();


      $("#invoice_year").focus().select();


    }
    if (event.which==32){
      event.preventDefault();
      $('#invoice_addcust').click();
    }
  });

  $("#invoice_state").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#invoice_product_table tbody tr:first td:eq(0) select').focus();

    }
    if (event.which==38 && (document.getElementById('invoice_state').selectedIndex==0)) {
      event.preventDefault();

      if ($("#invoice_customer").is(":disabled")) {
        $("#invoice_year").focus().select();
      }
      else {
        $("#invoice_customer").focus().select();
      }


    }
  });

  $("#invoice_customer").change(function(event) {
    $.ajax({
      url: '/customersuppliers?action=get',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid":$("#invoice_customer option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       console.log("success");
       if (resp["gkstatus"]==0) {
         $("#invoice_customerstate").val(resp["gkresult"]["state"]);
         $("#invoice_supplierstate").val(resp["gkresult"]["state"]);
         $("#invoice_customeraddr").val(resp["gkresult"]["custaddr"]);
         $("#invoice_supplieraddr").val(resp["gkresult"]["custaddr"]);
         $("#invoice_customertin").val(resp["gkresult"]["custtan"]);
         $("#invoice_suppliertin").val(resp["gkresult"]["custtan"]);
       }
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
  });

  $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".numtype").numeric({ negative: false});
  });
  $(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()=="")
      {
	$(this).val(parseFloat(0).toFixed(2));
      }
    else
      {
	$(this).val(parseFloat($(this).val()).toFixed(2));
      }
  });

  $(document).off('focus', '.invoice_product_quantity').on('focus', '.invoice_product_quantity', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".numtype").numeric({ negative: false});
  });
  $(document).off('blur', '.invoice_product_quantity').on('blur', '.invoice_product_quantity', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()=="")
      {
	$(this).val(0);
      }
  });

  $(document).off('change', '#invoice_state').on('change', '#invoice_state', function(event) {
    event.preventDefault();
    /* Act on the event */
    var state = $("#invoice_state option:selected").val();
    var productcode;
    $(".product_name").each(function()
      {
	var curindex = $(this).closest('tbody tr').index();
	productcode = $(this).find('option:selected').val();
	if (state == "none")
	  {
            $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(0).toFixed(2));
	  }
	else
	  {
            if (productcode!="") {

              $.ajax({
		url: '/product?type=prodtax',
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
		 if (resp["gkresult"].length==0) {
		   $("#notax-alert").alert();
		   $("#notax-alert").fadeTo(2250, 500).slideUp(500, function(){
                     $("#notax-alert").hide();
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

              $.ajax({
		url: '/invoice?action=gettax',
		type: 'POST',
		dataType: 'json',
		async : false,
		data : {"productcode":productcode, "state":state},
		beforeSend: function(xhr)
		{
		  xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
              })
               .done(function(resp) {
		 console.log("success");
		 if (resp["gkstatus"]==0) {
		   $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(resp['taxdata']).toFixed(2));
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
      });
    if (state != "none")
      {
	$(".invoice_product_tax_rate").change();
      }

  });



  $(document).off('change', '.product_name').on('change', '.product_name', function(event) {
    event.preventDefault();
    /* Act on the event */
    var productcode = $(this).find('option:selected').val();
    var curindex = $(this).closest('tbody tr').index();
    if ($("#status").val()=='15')
      {
	$.ajax({
          url: '/product?type=prodtax',
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
           if (resp["gkresult"].length==0) {
             $("#notax-alert").alert();
             $("#notax-alert").fadeTo(2250, 500).slideUp(500, function(){
               $("#notax-alert").hide();
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

	var state = $("#invoice_state option:selected").val();
	if (state == "none")
	  {
            $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(0).toFixed(2));
	  }
	else {

          $.ajax({
            url: '/invoice?action=gettax',
            type: 'POST',
            dataType: 'json',
            async : false,
            data : {"productcode":productcode, "state":state},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
           .done(function(resp) {
             console.log("success");
             if (resp["gkstatus"]==0) {
               if (resp['taxdata'] == 0.00) {
		 $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').prop("disabled", false);
               }
               else {
		 $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(resp['taxdata']).toFixed(2));
		 $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').prop("disabled", true);
               }
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
         $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) span').text(resp["unitname"]);
       }

     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });


  });

  $(document).off('keydown', '#invoice_issuer_name').on('keydown', '#invoice_issuer_name', function(event) {
    /* Act on the event */
    if (event.which==13)
      {
	event.preventDefault();
	$("#invoice_issuer_designation").focus().select();
      }
  });

  $(document).off('keydown', '#invoice_issuer_designation').on('keydown', '#invoice_issuer_designation', function(event) {
    /* Act on the event */
    if (event.which==13)
      {
	event.preventDefault();
	$("#invoice_save").click();
      }
  });

  $(document).off("keyup").on("keyup",function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#invoice_save").click();
      return false;
    }
  });



  $("#invoice_deliverynote").change(function(event) {
    if ($("#invoice_deliverynote option:selected").val()!='') {
      $("#invoice_state").prop("disabled",true);
      $.ajax({
        url: '/invoice?action=getdeliverynote',
        type: 'POST',
        dataType: 'json',
        async : false,
        data : {"dcid":$("#invoice_deliverynote option:selected").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
       .done(function(resp) {
         if (resp["gkstatus"]==0) {
           $("#invoice_customer").val(resp["delchal"]["delchaldata"]["custid"]);
           dctaxstate = resp["delchal"]["delchaldata"]["gostate"];
           //$("#invoice_supplieraddr").val(resp[])
           $("#invoice_customer").prop("disabled",true);
           //yaha
           $.ajax({
             url: '/customersuppliers?action=get',
             type: 'POST',
             dataType: 'json',
             async : false,
             data: {"custid":$("#invoice_customer option:selected").val()},
             beforeSend: function(xhr)
             {
               xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
             }
           })
            .done(function(resp) {
              console.log("success");
              if (resp["gkstatus"]==0) {
		custstate = resp["gkresult"]["state"];
		$("#invoice_customerstate").val(resp["gkresult"]["state"]);
		$("#invoice_supplierstate").val(resp["gkresult"]["state"]);
		$("#invoice_customeraddr").val(resp["gkresult"]["custaddr"]);
		$("#invoice_supplieraddr").val(resp["gkresult"]["custaddr"]);
		$("#invoice_customertin").val(resp["gkresult"]["custtan"]);
		$("#invoice_suppliertin").val(resp["gkresult"]["custtan"]);
		if (custstate == dctaxstate) {
                  $("#invoice_state").val(custstate);
                  producstate = $("#invoice_state").val();
		}
		else {
                  $("#invoice_state").val("");
                  producstate = "";
		}
              }
            })
            .fail(function() {
              console.log("error");
            })
            .always(function() {
              console.log("complete");
            });
           $('#invoice_product_table tbody').empty();
           var totqty = 0;
           $.each(resp.delchal.stockdata.items, function(key, value) {
             $('#invoice_product_table tbody').append('<tr>'+
						      '<td class="col-xs-3">'+
						      '<select class="form-control deliverychallan_edit_disable input-sm product_name">'+
						      '<option value="'+key+'">'+value.productdesc+'</option>'+
						      '</select>'+
						      '</td>'+
						      '<td class="col-xs-2">'+
						      '<div class="input-group">'+
						      '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable input-sm text-right" value="'+value.qty+'">'+
						      '<span class="input-group-addon input-sm" id="unitaddon">'+value.unitname+'</span>'+
						      '</div>'+
						      '</td>'+
						      '<td class="col-xs-2">'+
						      '<input type="text" class="invoice_product_per_price form-control deliverychallan_edit_disable input-sm numtype text-right" value="0.00">'+
						      '</td>'+
						      '<td class="col-xs-1">'+
						      '<input type="text" class="invoice_product_tax_rate form-control input-sm numtype text-right" value="0.00">'+
						      '</td>'+
						      '<td class="col-xs-1">'+
						      '<input type="text" class="invoice_product_tax_amount form-control input-sm numtype text-right" value="0.00" disabled>'+
						      '</td>'+
						      '<td class="col-xs-2">'+
						      '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable input-sm numtype text-right" value="0.00" disabled>'+
						      '</td>'+
						      '<td class="col-xs-1">'+
						      '</td>'+
						      '</tr>');
             totqty += +value.qty;
             if ($("#status").val()=='15')
               {
		 $(".invoice_product_tax_rate").prop("disabled",true);

               }
             else
               {
		 $(".invoice_product_tax_rate").prop("disabled",false);
               }
           });

           var state = $("#invoice_state option:selected").val();
           var productcode;
           $(".product_name").each(function()
             {
               var curindex = $(this).closest('tbody tr').index();
               productcode = $(this).find('option:selected').val();
               if (state == "none")
		 {
		   $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(0).toFixed(2));
		 }
               else {


		 $.ajax({
                   url: '/invoice?action=gettax',
                   type: 'POST',
                   dataType: 'json',
                   async : false,
                   data : {"productcode":productcode, "state":state},
                   beforeSend: function(xhr)
                   {
                     xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                   }
		 })
		  .done(function(resp) {
                    console.log("success");
                    if (resp["gkstatus"]==0) {
                      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(resp['taxdata']).toFixed(2));
                    }

		  })
		  .fail(function() {
                    console.log("error");
		  })
		  .always(function() {
                    console.log("complete");
		  });
               }
             });

           $('#invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(totqty).toFixed(2));

         }
       })
       .fail(function() {
         console.log("error");
       })
       .always(function() {
         console.log("complete");
       });

    }
    else
      {
	$.ajax({
          url: '/invoice?action=getproducts',
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
           $("#invoice_customer").prop("disabled",false);
           if (resp["gkstatus"]==0) {
             $('#invoice_product_table tbody').empty();
             $('#invoice_product_table tbody').append('<tr>'+
						      '<td class="col-xs-3">'+
						      '<select class="form-control input-sm product_name"></select>'+
						      '</td>'+
						      '<td class="col-xs-2">'+
						      '<div class="input-group">'+
						      '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">'+
						      '<span class="input-group-addon input-sm" id="unitaddon"></span>'+
						      '</div>'+
						      '</td>'+
						      '<td class="col-xs-2">'+
						      '<input type="text" class="invoice_product_per_price form-control input-sm numtype text-right" value="0.00">'+
						      '</td>'+
						      '<td class="col-xs-1">'+
						      '<input type="text" class="invoice_product_tax_rate form-control input-sm numtype text-right" value="0.00">'+
						      '</td>'+
						      '<td class="col-xs-1">'+
						      '<input type="text" class="invoice_product_tax_amount form-control input-sm numtype text-right" value="0.00" disabled>'+
						      '</td>'+
						      '<td class="col-xs-2">'+
						      '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable input-sm numtype text-right" value="0.00" disabled>'+
						      '</td>'+
						      '<td class="col-xs-1">'+

						      '</td>'+
						      '</tr>');
             if ($("#status").val()=='15')
               {
		 $(".invoice_product_tax_rate").prop("disabled",true);

               }
             else
               {
		 $(".invoice_product_tax_rate").prop("disabled",false);
               }
             for (product of resp["products"]) {
               $('#invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
             }
             $('#invoice_product_table tbody tr:last td:eq(0) select').prepend(('<option value="" selected>None</option>'));

             $('.invoice_product_quantity').numeric({ negative: false});
             $('.invoice_product_per_price').numeric({ negative: false});
           }
           $('#invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(0).toFixed(2));
	 })
	 .fail(function() {
           console.log("error");
	 })
	 .always(function() {
           console.log("complete");
	 });
      }

  });


  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
    {
      var curindex = $(this).closest('tr').index();
      var nextindex = curindex+1;
      var previndex = curindex-1;
      if (event.which==13) {
	event.preventDefault();
	$('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      }
      else if(event.which==190 && event.shiftKey)
	{
	  $('#invoice_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
	}
      else if (event.which==188 && event.shiftKey)
	{
	  if(previndex>-1)
	    {
              event.preventDefault();
              $('#invoice_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
	    }
	  if (curindex==0) {
            event.preventDefault();
            if ($("#invoice_state").is(":hidden") || $("#invoice_state").is(":disabled")) {
              $('#invoice_customer').focus();
	    }
	    else {
              $("#invoice_state").focus();
	    }
	  }
	}
      else if (event.which==188 && event.ctrlKey) {
	event.preventDefault();
	if (curindex==0) {
          event.preventDefault();
          if ($("#invoice_state").is(":hidden") || $("#invoice_state").is(":disabled")) {
            $('#invoice_customer').focus();
	  }
	  else {
            $("#invoice_state").focus();
	  }
	}
      else {
        if ($("#status").val()=='9')
        {
          $('#invoice_product_table tbody tr:eq('+previndex+') td:eq(3) input').focus().select();
        }
        else
        {
          $('#invoice_product_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
        }
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
  });

  $(document).off('focus', '.invoice_product_quantity').on('focus', '.invoice_product_quantity', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".invoice_product_quantity").numeric({ negative: false});
  });

  $(document).off('focus', '.invoice_product_tax_rate').on('focus', '.invoice_product_tax_rate', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".invoice_product_quantity").numeric({ negative: false});
  });

  $(document).off('focus', '.invoice_product_per_price').on('focus', '.invoice_product_per_price', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".invoice_product_per_price").numeric({ negative: false});
  });


  $(document).off('blur', '.invoice_product_per_price').on('blur', '.invoice_product_per_price', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()!="") {
      $(this).val(parseFloat($(this).val()).toFixed(2));

    }
    else
    {
      $(this).val(parseFloat(0).toFixed(2));
    }
  });

  $(document).off('blur', '.invoice_product_tax_rate').on('blur', '.invoice_product_tax_rate', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()!="") {
      $(this).val(parseFloat($(this).val()).toFixed(2));

    }
    else
    {
      $(this).val(parseFloat(0).toFixed(2));
    }
  });

  $(document).off('focus', '.invoice_product_tax_amount').on('focus', '.invoice_product_tax_amount', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".invoice_product_tax_amount").numeric({ negative: false});
  });

  $(document).off('blur', '.invoice_product_tax_amount').on('blur', '.invoice_product_tax_amount', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()!="") {
      $(this).val(parseFloat($(this).val()).toFixed(2));

    }
    else
    {
      $(this).val(parseFloat(0).toFixed(2));
    }
  });

  $(document).off('change', '.invoice_product_quantity').on('change', '.invoice_product_quantity', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()=="")
    {
      $(this).val(0);
    }
    var curindex = $(this).closest('#invoice_product_table tbody tr').index();
    var rowqty = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
    var rowprice = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
    var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
    var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
    var rowtotal = (rowqty*rowprice)+taxpercentamount;
    $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));
    $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));

    pqty=0;
    ptaxamt=0.00;
    ptotal=0.00;

    $(".invoice_product_quantity").each(function(){
      pqty += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });

    $(".invoice_product_tax_amount").each(function(){
      ptaxamt += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
    });

    $(".invoice_product_total").each(function(){
      ptotal += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
    });

  });

  $(document).off("keydown",".invoice_product_quantity").on("keydown",".invoice_product_quantity",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;

    if (event.which==13) {
      event.preventDefault();
      var curindex = $(this).closest('#invoice_product_table tbody tr').index();
      var rowqty = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
      var rowprice = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
      var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
      var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
      var rowtotal = (rowqty*rowprice)+taxpercentamount;
      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));

      pqty=0;
      ptaxamt=0.00;
      ptotal=0.00;

      $(".invoice_product_quantity").each(function(){
        pqty += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
      });

      $(".invoice_product_tax_amount").each(function(){
        ptaxamt += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
      });

      $(".invoice_product_total").each(function(){
        ptotal += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
      });


      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#invoice_product_table tbody tr:eq('+nextindex+') td:eq(1) input').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#invoice_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();


      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();

    }
    else if (event.which==190 && event.ctrlKey) {
      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==35) {
      event.preventDefault();
      $("#invoice_issuer_name").focus().select();
    }
  });

  $(document).off('change', '.invoice_product_per_price').on('change', '.invoice_product_per_price', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()=="")
    {
      $(this).val(0);
    }
    var curindex = $(this).closest('#invoice_product_table tbody tr').index();
    var rowqty = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
    var rowprice = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
    var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
    var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
    var rowtotal = (rowqty*rowprice)+taxpercentamount;
    $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

    $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));
    perprice=0.00;
    ptaxamt=0.00;
    ptotal=0.00;

    $(".invoice_product_per_price").each(function(){
      perprice += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });

    $(".invoice_product_tax_amount").each(function(){
      ptaxamt += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
    });

    $(".invoice_product_total").each(function(){
      ptotal += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
    });

  });

  $(document).off("keydown",".invoice_product_per_price").on("keydown",".invoice_product_per_price",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==13) {
      event.preventDefault();
      if ($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').is(":disabled")) {
        var curindex = $(this).closest('#invoice_product_table tbody tr').index();
        var rowqty = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
        var rowprice = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
        var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
        var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
        var rowtotal = (rowqty*rowprice)+taxpercentamount;
        $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

        $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));
        perprice=0.00;
        ptaxamt=0.00;
        ptotal=0.00;

        $(".invoice_product_per_price").each(function(){
          perprice += +$(this).val();

          // jquery enables us to select specific elements inside a table easily like below.
          $('#invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
        });

        $(".invoice_product_tax_amount").each(function(){
          ptaxamt += +$(this).val();

          // jquery enables us to select specific elements inside a table easily like below.
          $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
        });

        $(".invoice_product_total").each(function(){
          ptotal += +$(this).val();

          // jquery enables us to select specific elements inside a table easily like below.
          $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
        });
        if ($("#status").val()=='9')
        {
          $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
        }
        else
        {
          if (curindex != ($("#invoice_product_table tbody tr").length-1)) {
            $('#invoice_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
          }
          else {
            if ($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(0) select option:selected').val()=="") {
              $("#product-blank-alert").alert();
              $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#product-blank-alert").hide();
              });
              $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(0) select').focus();
              return false;
            }
            $.ajax({
              url: '/invoice?action=getproducts',
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
                $('#invoice_product_table tbody').append('<tr>'+
                '<td class="col-xs-3">'+
                '<select class="form-control input-sm product_name"></select>'+
                '</td>'+
                '<td class="col-xs-2">'+
                '<div class="input-group">'+
                '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">'+
                  '<span class="input-group-addon input-sm" id="unitaddon"></span>'+
                '</div>'+
                '</td>'+
                '<td class="col-xs-2">'+
                '<input type="text" class="invoice_product_per_price form-control input-sm numtype text-right" value="0.00">'+
                '</td>'+
                '<td class="col-xs-1">'+
                '<input type="text" class="invoice_product_tax_rate form-control input-sm numtype text-right" value="0.00">'+
                '</td>'+
                '<td class="col-xs-1">'+
                '<input type="text" class="invoice_product_tax_amount form-control input-sm numtype text-right" value="0.00" disabled>'+
                '</td>'+
                '<td class="col-xs-2">'+
                '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable input-sm numtype text-right" value="0.00" disabled>'+
                '</td>'+
                '<td class="col-xs-1">'+
                '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
                '</td>'+
                '</tr>');
                if ($("#status").val()=='15')
                {
                  $(".invoice_product_tax_rate").prop("disabled",true);

                }
                else
                {
                  $(".invoice_product_tax_rate").prop("disabled",false);
                }
                for (product of resp["products"]) {
                  $('#invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
                }
                $('#invoice_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();

                if ($("#status").val()=='15') {


                  var state = $("#invoice_state option:selected").val();
                  var productcode = $('#invoice_product_table tbody tr:last td:eq(0) select option:selected').val();

                  var curindex = $(this).closest('tbody tr').index();
                  if (state == "none")
                  {
                    $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(0).toFixed(2));
                  }
                  else {


                    $.ajax({
                      url: '/invoice?action=gettax',
                      type: 'POST',
                      dataType: 'json',
                      async : false,
                      data : {"productcode":productcode, "state":state},
                      beforeSend: function(xhr)
                      {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                      }
                    })
                    .done(function(resp) {
                      console.log("success");
                      if (resp["gkstatus"]==0) {
                        $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(resp['taxdata']).toFixed(2));
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

                taxrate=0.00;
                ptaxamt=0.00;
                ptotal=0.00;


                $(".invoice_product_tax_rate").each(function(){
                  taxrate += +$(this).val();

                  // jquery enables us to select specific elements inside a table easily like below.
                  $('#invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                });

                $(".invoice_product_tax_amount").each(function(){
                  ptaxamt += +$(this).val();

                  // jquery enables us to select specific elements inside a table easily like below.
                  $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
                });

                $(".invoice_product_total").each(function(){
                  ptotal += +$(this).val();

                  // jquery enables us to select specific elements inside a table easily like below.
                  $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
                });

                $(".product_name").change();
                $('#invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
                $('.invoice_product_quantity').numeric({ negative: false});
                $('.invoice_product_per_price').numeric({ negative: false});
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
      }
      else {
        $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#invoice_product_table tbody tr:eq('+nextindex+') td:eq(2) input').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#invoice_product_table tbody tr:eq('+previndex+') td:eq(2) input').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();


      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();

    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      if ($("#status").val()=='9')
      {
        $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
      }
      else
      {
        $('#invoice_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
      }

    }
    else if (event.which==35) {
      event.preventDefault();
      $("#invoice_issuer_name").focus().select();
    }
  });

  $(document).off('change', '.invoice_product_tax_rate').on('change', '.invoice_product_tax_rate', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()=="")
    {
      $(this).val(0);
    }
    var curindex = $(this).closest('#invoice_product_table tbody tr').index();
    var rowqty = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
    var rowprice = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
    var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
    var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
    var rowtotal = (rowqty*rowprice)+taxpercentamount;
    $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

    $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));


    taxrate=0.00;
    ptaxamt=0.00;
    ptotal=0.00;


    $(".invoice_product_tax_rate").each(function(){
      taxrate += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });

    $(".invoice_product_tax_amount").each(function(){
      ptaxamt += +$(this).val();
      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
    });

    $(".invoice_product_total").each(function(){
      ptotal += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
    });

  });

  $(document).off("keydown",".invoice_product_tax_rate").on("keydown",".invoice_product_tax_rate",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;

    if (event.which==35 && $("#status").val()=='15')
    {
      event.preventDefault();
      var curindex = $(this).closest('#invoice_product_table tbody tr').index();
      var rowqty = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
      var rowprice = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
      var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
      var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
      var rowtotal = (rowqty*rowprice)+taxpercentamount;
      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));

      $("#invoice_issuer_name").focus().select();
    }

    else if (event.which==13)
    {
      event.preventDefault();
      if (curindex1 != ($("#invoice_product_table tbody tr").length-1)) {
        $('#invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
      }
      else {
        if ($('#invoice_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        $.ajax({
          url: '/invoice?action=getproducts',
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
            $('#invoice_product_table tbody').append('<tr>'+
            '<td class="col-xs-3">'+
            '<select class="form-control input-sm product_name"></select>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<div class="input-group">'+
            '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">'+
              '<span class="input-group-addon input-sm" id="unitaddon"></span>'+
            '</div>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_per_price form-control input-sm numtype text-right" value="0.00">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<input type="text" class="invoice_product_tax_rate form-control input-sm numtype text-right" value="0.00">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<input type="text" class="invoice_product_tax_amount form-control input-sm numtype text-right" value="0.00" disabled>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable input-sm numtype text-right" value="0.00" disabled>'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
            '</tr>');
            if ($("#status").val()=='15')
            {
              if ($("#invoice_deliverynote option:selected").val()!='') {
                $(".invoice_product_tax_rate").prop("disabled",true);
              }

            }
            else
            {
              $(".invoice_product_tax_rate").prop("disabled",false);
            }

            for (product of resp["products"]) {
              $('#invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
            }

            taxrate=0.00;
            ptaxamt=0.00;
            ptotal=0.00;


            $(".invoice_product_tax_rate").each(function(){
              taxrate += +$(this).val();
              // jquery enables us to select specific elements inside a table easily like below.
              $('#invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
            });

            $(".invoice_product_tax_amount").each(function(){
              ptaxamt += +$(this).val();

              // jquery enables us to select specific elements inside a table easily like below.
              $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
            });

            $(".invoice_product_total").each(function(){
              ptotal += +$(this).val();

              // jquery enables us to select specific elements inside a table easily like below.
              $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
            });

            $('#invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
            $('.invoice_product_quantity').numeric({ negative: false});
            $('.invoice_product_per_price').numeric({ negative: false});
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
      $('#invoice_product_table tbody tr:eq('+nextindex1+') td:eq(3) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#invoice_product_table tbody tr:eq('+previndex1+') td:eq(3) input').focus().select();
      }
      if (curindex1==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      $('#invoice_product_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
      event.preventDefault();
    }
    else if (event.which==35) {
      event.preventDefault();
      $("#invoice_issuer_name").focus().select();
    }
  });


  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#invoice_product_table tbody tr:last td:eq(0) input').focus().select();
      pqty=0;
      ptaxamt=0.00;
      ptotal=0.00;
      perprice=0.00;
      taxrate=0.00;

      $(".invoice_product_quantity").each(function(){
        pqty += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(1) input').val(pqty); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
      });

      $(".invoice_product_per_price").each(function(){
        perprice += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
      });

      $(".invoice_product_tax_rate").each(function(){
        taxrate += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
      });

      $(".invoice_product_tax_amount").each(function(){
        ptaxamt += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
      });

      $(".invoice_product_total").each(function(){
        ptotal += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
      });
    });


    $('#invoice_product_table tbody tr:last td:eq(0) select').select();
  });

 $("#invoice_addcust").click(function() {
   var statusinout;
   if ($("#status").val()=='9') {
     statusinout="in"
   }
   if($("#status").val()=='15'){
     statusinout="out"
   }
    $.ajax(
    {

    type: "POST",
    url: "/customersuppliers?action=showaddpopup",
    global: false,
    async: false,
    data: {"status":statusinout},
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
            if ($("#status").val()=='9'){
              $("#add_cussup").val('19');
            }
            else{
              $('#add_cussup').val('3');
            }

            $('#add_cussup_name').focus();
          });
          $('#custsupmodal').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the modal is opened
          {
           var text1 = $('#selectedcustsup').val();
          if(text1==''){
            $('#invoice_customer').focus();
            return false;
          }
          if ($("#status").val()=='9') {
            var urlcustsup = "/customersuppliers?action=getallsups"
          }
          if($("#status").val()=='15'){
            var urlcustsup = "/customersuppliers?action=getallcusts"
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
            $("#invoice_customer").empty();

            for (i in custs){
              $("#invoice_customer").append('<option value="'+custs[i].custid+'" >'+custs[i].custname+'</option>');
            }
          });
           $("#invoice_customer option").filter(function() {
                return this.text == text1;
              }).attr('selected', true).trigger('change');
            $("#selectedcustsup").val("");
            $("#invoice_customer").focus();
          });



    }
}
  );
  });


  $("#invoice_save").click(function(event) {
    event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#invoice_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#invoice_challanno').focus();
      return false;
    }

    if ($.trim($('#invoice_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#invoice_date').focus();
      return false;
    }
    if ($.trim($('#invoice_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#invoice_month').focus();
      return false;
    }
    if ($.trim($('#invoice_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#invoice_year').focus();
      return false;
    }
    if(!Date.parseExact($("#invoice_date").val()+$("#invoice_month").val()+$("#invoice_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#invoice_date').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#invoice_year").val()+$("#invoice_month").val()+$("#invoice_date").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#invoice_date').focus().select();
      return false;
    }

    if ($("#invoice_deliverynote option:selected").val()!="")
    {

        if (Date.parseExact($("#invoice_deliverynote option:selected").attr("dcdate"), "dd-MM-yyyy").compareTo(curdate)==1) {
            $("#invdc-date-alert").alert();
            $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#invdc-date-alert").hide();
            });
            $('#invoice_date').focus().select();
            return false;
        }
    }

    if ($.trim($('#invoice_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#invoice_customer').focus();
      return false;
    }
    var tax = {};
    var contents = {};
    var stock= {};
    var items= {};
    for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++) {
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      var productcode = $("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
          $.ajax({
            url: '/product?type=prodtax',
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
            if (resp["gkresult"].length==0) {
              $("#sometax-alert").alert();
              $("#sometax-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#sometax-alert").hide();
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
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="" || $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()<=0) {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val()=="" || $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val()<=0) {
        $("#price-blank-alert").alert();
        $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#price-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").focus();
        return false;
      }
      var obj = {};
      var productcode = $("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      var ppu = $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val();
      obj[ppu] = $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      tax[productcode] = $("#invoice_product_table tbody tr:eq("+i+") td:eq(3) input").val();
      contents[productcode] = obj;
      items[productcode] = $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val();

    }
    stock["items"] = items;

    if ($("#status").val()=='9') {
      stock["inout"] = 9;
      issuername="";
      designation="";
    }
    else {
      stock["inout"] = 15;
      issuername=$("#invoice_issuer_name").val();
      designation=$("#invoice_issuer_designation").val();
      if (issuername=="")
      {
        $("#invoice_issuer_name").focus();
        $("#issuer-blank-alert").alert();
        $("#issuer-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#issuer-blank-alert").hide();
        });
        return false;
      }
    }
    var form_data = new FormData();
    form_data.append("dcid", $("#invoice_deliverynote option:selected").val());
    form_data.append("custid", $("#invoice_customer option:selected").val());
    form_data.append("invoiceno", $("#invoice_challanno").val());
    form_data.append("invoicedate", $("#invoice_year").val()+'-'+$("#invoice_month").val()+'-'+$("#invoice_date").val());
    form_data.append("contents", JSON.stringify(contents));
    form_data.append("tax", JSON.stringify(tax));
    form_data.append("stock", JSON.stringify(stock));
    form_data.append("issuername", issuername);
    form_data.append("designation", designation);
    form_data.append("invtotal", $('#invoice_product_table tfoot tr:last td:eq(5) input').val());
    form_data.append("taxstate", $("#invoice_state option:selected").val());
    var files = $("#my-file-selector")[0].files
    var filelist = [];
    for (var i = 0; i < files.length; i++) {
      form_data.append("file"+i,files[i])
    }
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function (e)
    {
    $.ajax({
      url: '/invoice?action=save',
      type: 'POST',
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      dataType: 'json',
      async : false,
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        if ($("#status").val()=='9') {
          $("#invoice_record").click();
        }
        else {
          $("#invoice_create").click();
        }
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
        return false;
      }
      else if(resp["gkstatus"]==1) {
        $("#invoice_challanno").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#invoice_deliverynote").focus();
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
  $("#tn_save_no").focus();

});
$("#confirm_yes").on('hidden.bs.modal', function(event) {
  $("invoice_deliverynote").focus();
});
  $(document).off('click', '#invoice_reset').on('click', '#invoice_reset', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#status").val()=='9')
    {
      $("#invoice_record").click();

    }
    else
    {
      $("#invoice_create").click();
    }
  });

  $("#invoice_saveprint").click(function(event) {
    event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#invoice_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#invoice_challanno').focus();
      return false;
    }

    if ($.trim($('#invoice_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#invoice_date').focus();
      return false;
    }
    if ($.trim($('#invoice_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#invoice_month').focus();
      return false;
    }
    if ($.trim($('#invoice_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#invoice_year').focus();
      return false;
    }
    if(!Date.parseExact($("#invoice_date").val()+$("#invoice_month").val()+$("#invoice_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#invoice_date').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#invoice_year").val()+$("#invoice_month").val()+$("#invoice_date").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#invoice_date').focus().select();
      return false;
    }

    if ($("#invoice_deliverynote option:selected").val()!="")
    {

        if (Date.parseExact($("#invoice_deliverynote option:selected").attr("dcdate"), "dd-MM-yyyy").compareTo(curdate)==1) {
            $("#invdc-date-alert").alert();
            $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#invdc-date-alert").hide();
            });
            $('#invoice_date').focus().select();
            return false;
        }
    }

    if ($.trim($('#invoice_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#invoice_customer').focus();
      return false;
    }
    var tax = {};
    var contents = {};
    var stock= {};
    var items= {};
    for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++) {
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="" || $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()<=0) {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val()=="" || $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val()<=0) {
        $("#price-blank-alert").alert();
        $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#price-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").focus();
        return false;
      }
      var obj = {};
      var productcode = $("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      var ppu = $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val();
      obj[ppu] = $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      tax[productcode] = $("#invoice_product_table tbody tr:eq("+i+") td:eq(3) input").val();
      contents[productcode] = obj;
      items[productcode] = $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val();

    }
    stock["items"] = items;

    if ($("#status").val()=='9') {
      stock["inout"] = 9;
      issuername="";
      designation="";
    }
    else {
      stock["inout"] = 15;
      issuername=$("#invoice_issuer_name").val();
      designation=$("#invoice_issuer_designation").val();
      if (issuername=="")
      {
        $("#invoice_issuer_name").focus();
        $("#issuer-blank-alert").alert();
        $("#issuer-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#issuer-blank-alert").hide();
        });
        return false;
      }
    }
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes_print').modal('show').one('click', '#tn_save_yesprint', function (e)
    {
    $.ajax({
      url: '/invoice?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"dcid": $("#invoice_deliverynote option:selected").val(),
      "custid":$("#invoice_customer option:selected").val(),
      "invoiceno":$("#invoice_challanno").val(),
      "invoicedate":$("#invoice_year").val()+'-'+$("#invoice_month").val()+'-'+$("#invoice_date").val(),
      "contents":JSON.stringify(contents),
      "tax":JSON.stringify(tax),
      "stock":JSON.stringify(stock),
      "issuername":issuername,
      "designation":designation,
      "invtotal": $('#invoice_product_table tfoot tr:last td:eq(5) input').val(),
      "taxstate":$("#invoice_state option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        printset = [];
        subtotal = 0;
        for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++) {
          var obj = {};

          obj.productdesc = $("#invoice_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text();
          obj.qty = $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val();
          obj.unitname = $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) span").text();
          obj.ppu = $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val();
          subtotal += +(obj.qty*obj.ppu);
          obj.taxrate = $("#invoice_product_table tbody tr:eq("+i+") td:eq(3) input").val();
          obj.taxamt = $("#invoice_product_table tbody tr:eq("+i+") td:eq(4) input").val();
          obj.rowtotal = $("#invoice_product_table tbody tr:eq("+i+") td:eq(5) input").val();
          printset.push(obj);
        }
        $.ajax({
          url: '/invoice?action=print',
          type: 'POST',
          dataType: 'html',
          data: {"dc": $("#invoice_deliverynote option:selected").attr("dcno"),
          "custid":$("#invoice_customer option:selected").val(),
          "invoiceno":$("#invoice_challanno").val(),
          "invoicedate":$("#invoice_date").val()+'-'+$("#invoice_month").val()+'-'+$("#invoice_year").val(),
          "printset":JSON.stringify(printset),
          "issuername":$("#invoice_issuer_name").val(),
          "designation":$("#invoice_issuer_designation").val(),
          "subtotal":parseFloat(subtotal).toFixed(2),
          "taxtotal":$("#invoice_product_table tfoot tr:first td:eq(4) input").val(),
          "gtotal":$("#invoice_product_table tfoot tr:first td:eq(5) input").val(),
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
      else if(resp["gkstatus"]==1) {
        $("#invoice_challanno").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#invoice_deliverynote").focus();
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
  });



  });
  $("#confirm_yes_print").on('shown.bs.modal', function(event) {
    $("#tn_save_noprint").focus();

  });
  $("#confirm_yes_print").on('hidden.bs.modal', function(event) {
    $("#invoice_challanno").focus();
  });
});
