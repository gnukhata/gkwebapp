$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.invoicedate').autotab('number');
  $("#invoice_deliverynote").focus();

  var issuername;
  var designation;
  var pqty=0.00;
  var ptaxamt=0.00;
  var perprice=0.00;
  var ptotal=0.00;
  var taxrate=0.00;
  if ($("#status").val()=='15')
  {
    $(".invoice_issuer").show();
    $(".invstate").show();
    $(".fixed-table").removeClass('fixed-tablepurchase');
    $(".fixed-table").addClass('fixed-tablesale');

  }

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
        $('#invoice_product_table tbody tr:first td:eq(0) select').focus();
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
      $('#invoice_product_table tbody tr:first td:eq(0) select').focus();

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
      if (state == "none")
      {
        $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').val(parseFloat(0).toFixed(2));
      }
      else
      {

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


  });



  $(document).off('change', '.product_name').on('change', '.product_name', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#status").val()=='15')
    {

      var state = $("#invoice_state option:selected").val();
      var productcode = $(this).find('option:selected').val();
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
            '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable input-sm text-right" value="'+value.qty+'">'+
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
            '<a href="#" class="product_del deliverychallan_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
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
        if (resp["gkstatus"]==0) {
          $('#invoice_product_table tbody').empty();
          $('#invoice_product_table tbody').append('<tr>'+
          '<td class="col-xs-3">'+
          '<select class="form-control input-sm product_name"></select>'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">'+
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
          $('#invoice_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
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
        $('#invoice_product_table tbody tr:eq('+previndex+') td:eq(3) input').focus().select();
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
    if ($(this).val()=="")
    {
      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(1) input').val(0);
    }
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
  });

  $(document).off('change', '.invoice_product_per_price').on('change', '.invoice_product_per_price', function(event) {
    event.preventDefault();
    /* Act on the event */
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
              '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">'+
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
      $('#invoice_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
      event.preventDefault();
    }
  });

  $(document).off('change', '.invoice_product_tax_rate').on('change', '.invoice_product_tax_rate', function(event) {
    event.preventDefault();
    /* Act on the event */
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
            '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">'+
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
    else
    {
      if ($("#status").val()=='15')
      {
        event.preventDefault();

      }

    }
  });


  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#invoice_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#invoice_product_table tbody tr:last td:eq(0) input').select();
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
      if ($("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="" || $("#invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val()==0) {
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
});
