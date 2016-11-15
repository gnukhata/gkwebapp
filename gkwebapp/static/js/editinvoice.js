$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.invoicedate').autotab('number');
  $("#invoice_all_no").focus();

  var pqty=0.00;
  var ptaxamt=0.00;
  var perprice=0.00;
  var ptotal=0.00;
  var taxrate=0.00;

  $("#invoice_all_no").change(function(event) {
    /* Act on the event */


    var invid = $("#invoice_all_no option:selected").val();
    if (invid!="")
    {


    $.ajax({
      url: '/invoice?action=getinvdetails',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"invid": invid},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {

      if (resp["gkstatus"]==0)
      {
        $(".btndisablediv").show();
        $(".btn-success").hide();
        if (resp.invoicedata.cancelflag==1)
        {
          $("#cancelmsg").show();
          $("#alertstrong").html("Invoice cancelled on "+resp.invoicedata.canceldate);
          $("#invcl").prop("disabled",true);
          $("#invcl").hide();


        }
        else
        {
          $("#cancelmsg").hide();
          $("#invcl").prop("disabled",false);
          $("#invcl").show();
        }
        var invdatearray = resp.invoicedata.invoicedate.split(/\s*\-\s*/g);
        $("#invoice_date").val(invdatearray[0]);
        $("#invoice_month").val(invdatearray[1]);
        $("#invoice_year").val(invdatearray[2]);
        $(".invdetails").show();
        $(document).find('.invdetails input,.invdetails select, .invstate select,.invoice_issuer input').prop("disabled",true);
        $("#invoice_challanno").val(resp["invoicedata"]["invoiceno"]);
        if (resp["invoicedata"]["csflag"]==3)
        {
          $(".invstate").show();
          $(".cust").show();
          $(".supp").hide();
          $(".invoice_issuer").show();
          $("#invoice_issuer_name").val(resp["invoicedata"]["issuername"]);
          $("#invoice_issuer_designation").val(resp["invoicedata"]["designation"]);
          $(".fixed-table").removeClass('viewfixed-tablepurchase');
          $(".fixed-table").addClass('viewfixed-tablesale');


        }
        else
        {
          $(".fixed-table").removeClass('viewfixed-tablesale');
          $(".fixed-table").addClass('viewfixed-tablepurchase');
          $(".cust").hide();
          $(".supp").show();
          $(".invstate").hide();
          $(".invoice_issuer").hide();
        }
        $("#invoice_customer").empty();
        $("#invoice_customer").append('<option value="'+resp["invoicedata"]["custid"]+'">'+resp["invoicedata"]["custname"]+'</option>');
        $("#invoice_state").val(resp["invoicedata"]["taxstate"]);
        $('#edit_invoice_product_table tbody').empty();
        for (content in resp["invoicedata"]["contents"])
        {

          $('#edit_invoice_product_table tbody').append('<tr>'+
          '<td class="col-xs-3">'+
          '<select class="form-control deliverychallan_edit_disable edit_invoice_disable input-sm product_name">'+
          '<option value="">'+resp["invoicedata"]["contents"][content]["productdesc"]+'</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm text-right" value="'+resp["invoicedata"]["contents"][content]["qty"]+'">'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<input type="text" class="invoice_product_per_price form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="'+resp["invoicedata"]["contents"][content]["priceperunit"]+'">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype text-right" value="'+resp["invoicedata"]["contents"][content]["taxamount"]+'">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right" value="0.00" >'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '</td>'+
          '</tr>');
          $(".edit_invoice_disable").prop("disabled",true);
          var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
          var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
          var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
          var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
          var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
          var rowtotal = (rowqty*rowprice)+taxpercentamount;
          $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));
          $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));

          pqty=0;
          ptaxamt=0.00;
          ptotal=0.00;
          perprice=0.00;
          taxrate=0.00;

          $(".invoice_product_quantity").each(function(){
            pqty += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#edit_invoice_product_table tfoot tr:last td:eq(1) input').val(pqty); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
          });

          $(".invoice_product_per_price").each(function(){
            perprice += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#edit_invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
          });

          $(".invoice_product_tax_rate").each(function(){
            taxrate += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#edit_invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
          });

          $(".invoice_product_tax_amount").each(function(){
            ptaxamt += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
          });

          $(".invoice_product_total").each(function(){
            ptotal += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
          });
        }
      }

      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    }

  });

$("#invoice_all_no").keydown(function(event) {
  /* Act on the event */
  if (event.which==13) {
    /*$("#invedit").click();*/
  }
});
$(document).off('click', '#invedit').on('click', '#invedit', function(event) {
  event.preventDefault();
  /* Act on the event */
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
      for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++)
      {
        for (product of resp["products"]) {
          alert("asd");
          var curprd = $('#invoice_product_table tbody tr:'+i+' td:eq(0) select').text();
          $('#invoice_product_table tbody tr:'+i+' td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');

        }

      }
    }

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  $(".btndisablediv").show();
  $(".btndisable").hide();
  $(".btn-success").show();
  $(document).find('.invdetails input,.invdetails select, .invstate select,.invoice_issuer input').prop("disabled",false);

  for (product of resp["products"]) {
    $('#invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
  }
});
  /*if ($("#status").val()=='15')
  {
    $(".invoice_issuer").show();
    $(".invstate").show();
    $(".fixed-table").removeClass('fixed-tablepurchase');
    $(".fixed-table").addClass('fixed-tablesale');

  }*/

  $("#invoice_date").numeric();
  $("#invoice_month").numeric();
  $("#invoice_year").numeric();
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
        $("#invoice_customer").focus().select();
      }
      if (event.which==38) {
        event.preventDefault();
        $("#invoice_month").focus().select();
      }
    });

  $("#invoice_customer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($("#status").val()=='15')
      {
        $('#invoice_state').focus();

      }
      else
      {
      $('#edit_invoice_product_table tbody tr:first td:eq(0) select').focus();
      }

    }
    if (event.which==38 && (document.getElementById('invoice_customer').selectedIndex==1||document.getElementById('invoice_customer').selectedIndex==0)) {
      event.preventDefault();


        $("#invoice_year").focus().select();


    }
  });

  $("#invoice_state").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#edit_invoice_product_table tbody tr:first td:eq(0) select').focus();

    }
    if (event.which==38 && (document.getElementById('invoice_state').selectedIndex==0)) {
      event.preventDefault();


        $("#invoice_customer").focus();


    }
  });

  $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".numtype").numeric();
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
    $(".numtype").numeric();
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
          $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(resp['taxdata']).toFixed(2));
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



$(document).off('change', '.product_name').on('change', '.product_name', function(event) {
  event.preventDefault();
  /* Act on the event */
  var state = $("#invoice_state option:selected").val();
  var productcode = $(this).find('option:selected').val();
  var curindex = $(this).closest('tbody tr').index();
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
        $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(resp['taxdata']).toFixed(2));
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
          $('#edit_invoice_product_table tbody').empty();
          var totqty = 0;
          $.each(resp.delchal.stockdata.items, function(key, value) {
            $('#edit_invoice_product_table tbody').append('<tr>'+
            '<td class="col-xs-3">'+
            '<select class="form-control deliverychallan_edit_disable edit_invoice_disable input-sm product_name">'+
            '<option value="'+key+'">'+value.productdesc+'</option>'+
            '</select>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm text-right" value="'+value.qty+'">'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_per_price form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="0.00">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype text-right" value="0.00">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<a href="#" class="product_del deliverychallan_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
            '</tr>');
            totqty += +value.qty;
          });
          $('#edit_invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(totqty).toFixed(2));

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
        if (resp["gkstatus"]==0) {
          $('#edit_invoice_product_table tbody').empty();
          $('#edit_invoice_product_table tbody').append('<tr>'+
          '<td class="col-xs-3">'+
          '<select class="form-control edit_invoice_disable input-sm product_name"></select>'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<input type="text" class="invoice_product_quantity form-control edit_invoice_disable input-sm text-right" value="0">'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<input type="text" class="invoice_product_per_price form-control edit_invoice_disable input-sm numtype text-right" value="0.00">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype text-right" value="0.00">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>'+
          '</td>'+
          '<td class="col-xs-1">'+

          '</td>'+
          '</tr>');
          for (product of resp["products"]) {
            $('#edit_invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
          }
          $('#edit_invoice_product_table tbody tr:last td:eq(0) select').prepend(('<option value="" selected>None</option>'));
          $('#edit_invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
          $('.invoice_product_quantity').numeric({ negative: false});
          $('.invoice_product_per_price').numeric({ negative: false});
        }
        $('#edit_invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(0).toFixed(2));
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
      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#edit_invoice_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#edit_invoice_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
      else {
        $('#edit_invoice_product_table tbody tr:eq('+previndex+') td:eq(3) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
  });

$(document).off('focus', '.invoice_product_quantity').on('focus', '.invoice_product_quantity', function(event) {
  event.preventDefault();
  /* Act on the event */
  $(".invoice_product_quantity").numeric();
});

$(document).off('focus', '.invoice_product_tax_rate').on('focus', '.invoice_product_quantity', function(event) {
  event.preventDefault();
  /* Act on the event */
  $(".invoice_product_quantity").numeric();
});

$(document).off('focus', '.invoice_product_per_price').on('focus', '.invoice_product_per_price', function(event) {
  event.preventDefault();
  /* Act on the event */
  $(".invoice_product_per_price").numeric();
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
  $(".invoice_product_tax_amount").numeric();
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
    var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
    var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
    var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
    var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
    var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
    var rowtotal = (rowqty*rowprice)+taxpercentamount;
    $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));
    $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));

    pqty=0;
    ptaxamt=0.00;
    ptotal=0.00;

    $(".invoice_product_quantity").each(function(){
      pqty += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });

    $(".invoice_product_tax_amount").each(function(){
      ptaxamt += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
    });

    $(".invoice_product_total").each(function(){
      ptotal += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
    });

  });

  $(document).off("keydown",".invoice_product_quantity").on("keydown",".invoice_product_quantity",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if ($(this).val()=="")
    {
    $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val(0);
    }
    if (event.which==13) {
      event.preventDefault();
      var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
      var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
      var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
      var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
      var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
      var rowtotal = (rowqty*rowprice)+taxpercentamount;
      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));

      pqty=0;
      ptaxamt=0.00;
      ptotal=0.00;

      $(".invoice_product_quantity").each(function(){
        pqty += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#edit_invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
      });

      $(".invoice_product_tax_amount").each(function(){
        ptaxamt += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
      });

      $(".invoice_product_total").each(function(){
        ptotal += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
      });


      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#edit_invoice_product_table tbody tr:eq('+nextindex+') td:eq(1) input').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#edit_invoice_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();


        $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();

    }
    else if (event.which==190 && event.ctrlKey) {
      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
      event.preventDefault();
    }
  });

  $(document).off('change', '.invoice_product_per_price').on('change', '.invoice_product_per_price', function(event) {
    event.preventDefault();
    /* Act on the event */
    var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
    var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
    var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
    var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
    var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
    var rowtotal = (rowqty*rowprice)+taxpercentamount;
    $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

    $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));
    perprice=0.00;
    ptaxamt=0.00;
    ptotal=0.00;

    $(".invoice_product_per_price").each(function(){
      perprice += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });

    $(".invoice_product_tax_amount").each(function(){
      ptaxamt += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
    });

    $(".invoice_product_total").each(function(){
      ptotal += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
    });

  });

  $(document).off("keydown",".invoice_product_per_price").on("keydown",".invoice_product_per_price",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==13) {
      event.preventDefault();
      var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
      var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
      var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
      var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
      var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
      var rowtotal = (rowqty*rowprice)+taxpercentamount;
      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));
      perprice=0.00;
      ptaxamt=0.00;
      ptotal=0.00;

      $(".invoice_product_per_price").each(function(){
        perprice += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#edit_invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
      });

      $(".invoice_product_tax_amount").each(function(){
        ptaxamt += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
      });

      $(".invoice_product_total").each(function(){
        ptotal += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
      });

      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#edit_invoice_product_table tbody tr:eq('+nextindex+') td:eq(2) input').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#edit_invoice_product_table tbody tr:eq('+previndex+') td:eq(2) input').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();


        $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();

    }
    else if (event.which==190 && event.ctrlKey) {
      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
      event.preventDefault();
    }
  });

  $(document).off('change', '.invoice_product_tax_rate').on('change', '.invoice_product_tax_rate', function(event) {
    event.preventDefault();
    /* Act on the event */
    var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
    var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
    var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
    var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
    var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
    var rowtotal = (rowqty*rowprice)+taxpercentamount;
    $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

    $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));


    taxrate=0.00;
    ptaxamt=0.00;
    ptotal=0.00;


    $(".invoice_product_tax_rate").each(function(){
      taxrate += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });

    $(".invoice_product_tax_amount").each(function(){
      ptaxamt += +$(this).val();
      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
    });

    $(".invoice_product_total").each(function(){
      ptotal += +$(this).val();

      // jquery enables us to select specific elements inside a table easily like below.
      $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
    });

  });

  $(document).off("keydown",".invoice_product_tax_rate").on("keydown",".invoice_product_tax_rate",function(event)
  {

    if (event.which==35 && $("#status").val()=='15')
    {
      event.preventDefault();
      var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
      var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val()).toFixed(2);
      var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(2) input').val()).toFixed(2);
      var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val()).toFixed(2);
      var taxpercentamount =rowqty*rowprice*(rowtaxrate/100);
      var rowtotal = (rowqty*rowprice)+taxpercentamount;
      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(4) input').val(parseFloat(taxpercentamount).toFixed(2));

      $('#edit_invoice_product_table tbody tr:eq('+curindex+') td:eq(5) input').val(parseFloat(rowtotal).toFixed(2));

      $("#invoice_issuer_name").focus().select();
    }

    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#edit_invoice_product_table tbody tr").length-1)) {
        $('#edit_invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
      }
      else {
        if ($('#edit_invoice_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#edit_invoice_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
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
            $('#edit_invoice_product_table tbody').append('<tr>'+
            '<td class="col-xs-3">'+
            '<select class="form-control edit_invoice_disable input-sm product_name"></select>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_quantity form-control edit_invoice_disable input-sm text-right" value="0">'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_per_price form-control edit_invoice_disable input-sm numtype text-right" value="0.00">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype text-right" value="0.00">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
            '</tr>');
            for (product of resp["products"]) {
              $('#edit_invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
            }
            taxrate=0.00;
            ptaxamt=0.00;
            ptotal=0.00;


            $(".invoice_product_tax_rate").each(function(){
              taxrate += +$(this).val();

              // jquery enables us to select specific elements inside a table easily like below.
              $('#edit_invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
            });

            $(".invoice_product_tax_amount").each(function(){
              ptaxamt += +$(this).val();

              // jquery enables us to select specific elements inside a table easily like below.
              $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
            });

            $(".invoice_product_total").each(function(){
              ptotal += +$(this).val();

              // jquery enables us to select specific elements inside a table easily like below.
              $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
            });

            $('#edit_invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
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

    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#edit_invoice_product_table tbody tr:eq('+nextindex1+') td:eq(3) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#edit_invoice_product_table tbody tr:eq('+previndex1+') td:eq(3) input').focus().select();
      }
      if (curindex1==0) {
        event.preventDefault();
        $("#invoice_schedule").focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#edit_invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      $('#edit_invoice_product_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
      event.preventDefault();
    }
  });


  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#edit_invoice_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#edit_invoice_product_table tbody tr:last td:eq(0) input').select();
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
      if ($("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="" || $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()==0) {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val()=="" || $("#invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val()==0) {
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
      "designation":designation},
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
  $(document).off('click', '#invoice_reset').on('click', '#invoice_reset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#invoice_view").click();
  });


      $('#invcl').click(function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        invcode= $("#invoice_all_no option:selected").val();
        $('#m_confirmdel').modal('show').one('click', '#invcancel', function (e)
        {
          $.ajax({
            url: '/invoice?action=cancel',
            type: 'POST',
            global: false,
            async: false,
            datatype: 'json',
            data: {"invid":invcode},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
          .done(function(resp) {
            if (resp["gkstatus"] ==0) {
              $('.modal-backdrop').remove();
              $("#invoice_view").click();
              $("#invoicecancelsuccess-alert").alert();
              $("#invoicecancelsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#invoicecancelsuccess-alert").hide();
              });
            }
            else if(resp["gkstatus"] == 5) {
              $("#invoice_all_no").focus();
              $("#failure-delete-alert").alert();
              $("#failure-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#failure-delete-alert").hide();
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
        $('#m_confirmdel').on('shown.bs.modal', function(event) {
          $("#m_cancel").focus();
        });
        $('#m_confirmdel').on('hidden.bs.modal', function(event) {
          $("#invoice_all_no").focus();
        });

      });

});
