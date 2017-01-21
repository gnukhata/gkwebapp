$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.invoicedate').autotab('number');
  $("#invoice_all_no").focus();
  $(".hidden-load").hide();
  $(".disable").prop("disabled", true);
  $("#invoice_editprint").hide();

  var pqty=0.00;
  var ptaxamt=0.00;
  var perprice=0.00;
  var ptotal=0.00;
  var taxrate=0.00;

  $("#invoice_all_no").change(function(event) {
    /*
    Getting complete information for the selected cash memo using its id.
    Display details in the corresponding fields.
    */

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
        $(".hidden-load").show();
        if (resp.invoicedata.cancelflag==1) // show cancel message and alert depending on cancel flag.
        {
          $("#cancelmsg").show();
          $("#alertstrong").html("Cashmemo cancelled on "+resp.invoicedata.canceldate);
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
        $(document).find('.invdetails input,.invdetails select, .invstate select,.invoice_issuer input').prop("disabled",true); // disable all input fields for viewing only.
        $("#invoice_challanno").val(resp["invoicedata"]["invoiceno"]);
        $("#invoice_editprint").show();
        $("#invoice_state").val(resp["invoicedata"]["taxstate"]);
        $('#edit_invoice_product_table tbody').empty();
        for (content in resp["invoicedata"]["contents"])
        {
          // Displaying product details in table.
          $('#edit_invoice_product_table tbody').append('<tr>'+
          '<td class="col-xs-3">'+
          '<select class="form-control deliverychallan_edit_disable edit_invoice_disable input-sm product_name">'+
          '<option value="">'+resp["invoicedata"]["contents"][content]["productdesc"]+'</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-2">'+
          '<div class="input-group">'+
          '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm text-right" value="'+resp["invoicedata"]["contents"][content]["qty"]+'">'+
            '<span class="input-group-addon input-sm" id="unitaddon">'+resp["invoicedata"]["contents"][content]["unitname"]+'</span>'+
          '</div>'+
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
          // all the column totals are directly calculated dynamically on the change of any of the related fields in the column.
          // all the following values are also calculated
          // Tax amount= qty*price per unit*(taxrate/100)
          // Row total = (qty*price per unit)+tax amount.
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


// Function to cancel a cash memo.
// Id of the selected cash memo is sent.
  $("#invcl").click(function(event) {
    event.stopPropagation();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_del').modal('show').one('click', '#accdel', function (e)
    {
      $.ajax(
        {

          type: "POST",
          url: '/cashmemos?action=cancel',
          async: false,
          datatype: "json",
          data:{"cashmemoid": $("#invoice_all_no option:selected").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              $("#invoice_all_no").click();
              $('.modal-backdrop').remove();
              $("#cash-success-alert").alert();
              $("#cash-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#cash-success-alert").hide();

              });
            }



          }

        });

    });
    // Navigation functions for modal.
    $("#confirm_del").on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
    });
    $("#confirm_del").on('hidden.bs.modal', function(event) {
      $("#invoice_all_no").focus();
    });


    });

    // Function to print selected cash memo.
    // All the details from the current page is sent to the print view in server.
    $("#invoice_editprint").click(function(event) {
      printset = [];
      subtotal = 0;
      // List of dictionaries with the table details is created to print.
      for (var i = 0; i < $("#edit_invoice_product_table tbody tr").length; i++) {
        var obj = {};

        obj.productdesc = $("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text();
        obj.qty = $("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(1) input").val();
        obj.ppu = $("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(2) input").val();
        obj.unitname = $("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(1) span").text();
        subtotal += +(obj.qty*obj.ppu);
        obj.taxrate = $("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(3) input").val();
        obj.taxamt = $("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(4) input").val();
        obj.rowtotal = $("#edit_invoice_product_table tbody tr:eq("+i+") td:eq(5) input").val();
        printset.push(obj);
      }
      $.ajax({
        url: '/cashmemos?action=print',
        type: 'POST',
        dataType: 'html',
        data: {
        "invoiceno":$("#invoice_challanno").val(),
        "invoicedate":$("#invoice_date").val()+'-'+$("#invoice_month").val()+'-'+$("#invoice_year").val(),
        "printset":JSON.stringify(printset),
        "subtotal":parseFloat(subtotal).toFixed(2),
        "taxtotal":$("#edit_invoice_product_table tfoot tr:first td:eq(4) input").val(),
        "gtotal":$("#edit_invoice_product_table tfoot tr:first td:eq(5) input").val(),
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
    });
});
