$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    $("#invoice_all_no").focus();
  //  $(".hidden-load").hide();
  //  $(".disable").prop("disabled", true);
    //$("#invoice_editprint").hide();

    var pqty = 0.00;
    var ptaxamt = 0.00;
    var perprice = 0.00;
    var ptotal = 0.00;
    var taxrate = 0.00;

  $("#invoice_all_no").change(function(event) {
        /*
        Getting complete information for the selected cash memo using its id.
        Display details in the corresponding fields.
*/

        var invid = $("#invoice_all_no option:selected").val();
        console.log("inv selected"+invid);
        if (invid != "") {


            $.ajax({
                    url: '/invoice?action=getinvdetails',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: { "invid": invid },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    if (resp["gkstatus"] == 0) {
                      console.log("invoice?action=getinvdetails successful");
                        $(".hidden-load").show();
                        if (resp.invoicedata.cancelflag == 1) // show cancel message and alert depending on cancel flag.
                        {
                            $("#cancelmsg").show();
                            $("#alertstrong").html("Cashmemo cancelled on " + resp.invoicedata.canceldate);
                            $("#invcl").prop("disabled", true);
                            $("#invcl").hide();


                        } else {
                            $("#cancelmsg").hide();
                            $("#invcl").prop("disabled", false);
                            $("#invcl").show();
                        }
                        var invdatearray = resp.invoicedata.invoicedate.split(/\s*\-\s*/g);

                        $("#invoice_date").val(invdatearray[0]);
                        $("#invoice_month").val(invdatearray[1]);
                        $("#invoice_year").val(invdatearray[2]);
                        console.log(invdatearray);
                        $(".invdetails").show();
                        $(document).find('.invdetails input,.invdetails select, .invstate select,.invoice_issuer input').prop("disabled", true); // disable all input fields for viewing only.


                        $(document).find('input, textarea ').attr('disabled',true);



                        $("#invoice_challanno").val(resp["invoicedata"]["invoiceno"]);
                        $("#footer_id").show();
                        $("#invoice_editprint").show();
                        $("#invoice_state").val(resp["invoicedata"]["sourcestate"]);
                        $("#taxablevaluetotal_product_gst").text(resp["invoicedata"]["totaltaxablevalue"]);
                        $("#discounttotal_product_gst").text(resp["invoicedata"]["totaldiscount"]);
                        $("#totalsgst_product_gst").text(resp["invoicedata"]["totaltaxamt"]);
                        $("#totalcgst_product_gst").text(resp["invoicedata"]["totaltaxamt"]);
                        $("#total_product_gst").text(resp["invoicedata"]["invoicetotal"]);
                        $("#totalinvoicevalue").text(resp["invoicedata"]["invoicetotal"]);
                        $("#taxapplicable").val(resp["invoicedata"]["taxflag"]);
                        console.log(resp["invoicedata"]["bankdetails"]["accountno"]);
                        $("#accountno").val(resp["invoicedata"]["bankdetails"]["accountno"]);
                        $("#bankname").val(resp["invoicedata"]["bankdetails"]["bankname"]);
                        $("#branchname").val(resp["invoicedata"]["bankdetails"]["branchname"]);
                        $("#ifsc").val(resp["invoicedata"]["bankdetails"]["ifsc"]);
                        console.log(resp["invoicedata"]["sourcestate"]);
                          console.log("contents of inv"+resp["invoicedata"]);
                          console.log(JSON.stringify(resp));
                        $('#invoice_product_table tbody').empty();
                          $('#invoice_product_table_gst tbody').empty();
                        var invdata=resp["invoicedata"]
                        var invcontents=invdata["invcontents"]
                        if (invdata["taxflag"]==22)
                        {
                          $("#total").val(resp["invoicedata"]["invoicetotal"]);
                            $('#invoice_product_table_gst').hide();
                            $('#invoice_product_table').show();
                          for (pc in invcontents)
                          {
                            var productdecs=invcontents[pc]

                            console.log("taxamount "+productdecs["taxamount"]);
                            console.log("desc"+productdecs["proddesc"]);

                              // Displaying product details in table.
                              $('#invoice_product_table tbody').append('<tr>' +
                                  '<td class="col-xs-2">' +
                                  '<input type="text" class="form-control deliverychallan_edit_disable edit_invoice_disable input-sm product_name invdetails" value="' + productdecs["proddesc"] + '"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<div class="input-group">' +
                                  '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm invdetails text-right" value="' + productdecs["qty"] + '"disabled>' +
                                  '<span class="input-group-addon input-sm" id="unitaddon">' + productdecs["uom"] + '</span>' +
                                  '</div>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<div class="input-group">' +
                                  '<input type="text" class="invoice_product_freequantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm text-right invdetails" value="' + productdecs["freeqty"] + '"disabled>' +
                                  '<span class="input-group-addon input-sm" id="unitaddon">' + productdecs["uom"] + '</span>' +
                                  '</div>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<input type="text" class="invoice_product_per_price form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right invdetails" value="' + productdecs["priceperunit"] + '"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_discount form-control input-sm text-right numtype invdetails" value="' + productdecs["discount"] + '" size="8" placeholder="0.00"disabled>'+
                                  '</td>'+
                                  '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_taxablevalue form-control input-sm text-right numtype invdetails" value="' + productdecs["taxableamount"] + '" size="8" placeholder="0.00"disabled>'+
                                  '</td>'+
                                  '<td class="col-xs-1">' +
                                  '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype text-right invdetails" value="' + productdecs["taxrate"] + '"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-1">' +
                                  '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right invdetails" value="' + productdecs["taxamount"] + '" disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype invdetails text-right" value="'+ productdecs["totalAmount"] +'" disabled>' +
                                  '</td>' +

                                  '</tr>');


                          }
                        }
                        else{
                            $('#invoice_product_table').hide();
                            $('#invoice_product_table_gst').show();
                          for (pc in invcontents)
                          {
                            var productdecs=invcontents[pc]

                            console.log("taxamount "+productdecs["taxamount"]);
                            console.log("desc"+productdecs["proddesc"]);

                              // Displaying product details in table.
                              $('#invoice_product_table_gst tbody').append('<tr>' +
                                  '<td class="col-xs-2">' +
                                  '<input type="text" class="form-control deliverychallan_edit_disable edit_invoice_disable input-sm product_name invdetails" value="' + productdecs["proddesc"] + '"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<input type="text" class="form-control deliverychallan_edit_disable edit_invoice_disable input-sm product_name invdetails" value="'+ productdecs["gscode"] +'"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<div class="input-group">' +
                                  '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm invdetails text-right" value="' + productdecs["qty"] + '"disabled>' +
                                  '<span class="input-group-addon input-sm" id="unitaddon">' + productdecs["uom"] + '</span>' +
                                  '</div>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<div class="input-group">' +
                                  '<input type="text" class="invoice_product_freequantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm text-right invdetails" value="' + 0 + '"disabled>' +
                                  '<span class="input-group-addon input-sm" id="unitaddon">' + productdecs["uom"] + '</span>' +
                                  '</div>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<input type="text" class="invoice_product_per_price form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right invdetails" value="' + productdecs["priceperunit"] + '"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_discount form-control input-sm text-right numtype invdetails" value="' + productdecs["discount"] + '" size="8" placeholder="0.00"disabled>'+
                                  '</td>'+
                                  '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_taxablevalue form-control input-sm text-right numtype invdetails" value="' + productdecs["taxableamount"] + '" size="8" placeholder="0.00"disabled>'+
                                  '</td>'+
                                  '<td class="col-xs-1">' +
                                  '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype invdetails text-right" value="' + productdecs["taxrate"] + '"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-1">' +
                                  '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right invdetails" value="' + productdecs["taxamount"] + '" disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-1">' +
                                  '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype text-right invdetails" value="' + productdecs["taxrate"] + '"disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-1">' +
                                  '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right invdetails" value="' + productdecs["taxamount"] + '" disabled>' +
                                  '</td>' +
                                  '<td class="col-xs-2">' +
                                  '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype invdetails text-right" value="'+ productdecs["totalAmount"] +'" disabled>' +
                                  '</td>' +
                                
                                  '</tr>');

                          }
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
    /*$("#invcl").click(function(event) {
        event.stopPropagation();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#confirm_del').modal('show').one('click', '#accdel', function(e) {
            $.ajax({

                type: "POST",
                url: '/cashmemos?action=cancel',
                async: false,
                datatype: "json",
                data: { "cashmemoid": $("#invoice_all_no option:selected").val() },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
                success: function(resp) {
                    if (resp["gkstatus"] == 0) {
                        $("#invoice_all_no").click();
                        $('.modal-backdrop').remove();
                        $("#cash-success-alert").alert();
                        $("#cash-success-alert").fadeTo(2250, 500).slideUp(500, function() {
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


    });*/

    // Function to print selected cash memo.
    // All the details from the current page is sent to the print view in server.
    /*$("#invoice_editprint").click(function(event) {
        printset = [];
        subtotal = 0;
        // List of dictionaries with the table details is created to print.
        for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++) {
            var obj = {};

            obj.productdesc = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select option:selected").text();
            obj.qty = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val();
            obj.freeqty = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val();
            obj.ppu = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(3) input").val();
            obj.unitname = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) span").text();
            subtotal += +((obj.qty - obj.freeqty) * obj.ppu);
            obj.taxrate = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(4) input").val();
            obj.taxamt = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(5) input").val();
            obj.rowtotal = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(6) input").val();
            printset.push(obj);
        }
        $.ajax({
                url: '/cashmemos?action=print',
                type: 'POST',
                dataType: 'html',
                data: {
                    "invoiceno": $("#invoice_challanno").val(),
                    "invoicedate": $("#invoice_date").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_year").val(),
                    "printset": JSON.stringify(printset),
                    "subtotal": parseFloat(subtotal).toFixed(2),
                    "taxtotal": $("#invoice_product_table tfoot tr:first td:eq(4) input").val(),
                    "gtotal": $("#invoice_product_table tfoot tr:first td:eq(5) input").val(),
                },
                beforeSend: function(xhr) {
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
    });*/
});
