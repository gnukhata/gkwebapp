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
"Rohini Baraskar" <robaraskar@gmail.com>
*/

// This script is for the add cashmemo page

$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    $("#invoice_challanno").focus();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var issuername;
    var designation;
    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html();  //HTML for table displaying totals in GST Product Table.
    var pqty = 0.00;
    var ptaxamt = 0.00;
    var perprice = 0.00;
    var ptotal = 0.00;
    var taxrate = 0.00;
//for calculating tax for each row we have used following function

var pqty = 0.00;
var perprice = 0.00;
var taxrate = 0.00;
var ptaxamt = 0.00;
var ptotal = 0.00;
var dctaxstate;
var custstate;
var producstate;
  function calculategstaxamt(curindex) {

var rowqty = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
var rowprice = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
var rowdiscount = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
var taxdetails = $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').data("taxdetails");
console.log(taxdetails);
var taxamount = 0.00;
if (prodservflag==1)
{
  var rowtaxableamount=rowprice-rowdiscount;
  console.log("prodservflag=1");
}
else{
  var rowtaxableamount=(rowqty  * rowprice)-rowdiscount;
  console.log("prodservflag=0");
}

var rowtotal = 0.00;
var totalamount = 0.00;
var totalcgst = 0.00;
var totalsgst = 0.00;

var totaldiscount = 0.00;
var totaltaxable = 0.00;
$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtaxableamount).toFixed(2));
taxamount = (rowtaxableamount * taxdetails["taxrate"])/100;
if (taxdetails["taxname"] == "SGST") {
  $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(taxamount).toFixed(2));
  $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(10) input').val(parseFloat(taxamount).toFixed(2));
    rowtotal = rowtaxableamount + taxamount;
    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(rowtotal).toFixed(2));
}

for(var i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
    totaldiscount = totaldiscount + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
    totaltaxable = totaltaxable + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(6) input').val());
    totalcgst = totalcgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(8) input').val());
    totalsgst = totalsgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(10) input').val());

    totalamount = totalamount + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(11) input').val());
}
$('#discounttotal_product_gst').text(parseFloat(totaldiscount).toFixed(2));
$('#taxablevaluetotal_product_gst').text(parseFloat(totaltaxable).toFixed(2));
$('#totalcgst_product_gst').text(parseFloat(totalcgst).toFixed(2));
$('#totalsgst_product_gst').text(parseFloat(totalsgst).toFixed(2));

$('#total_product_gst').text(parseFloat(totalamount).toFixed(2));

$('#totalinvoicevalue').text(parseFloat(totalamount).toFixed(2));
  }


    $(".invoice_issuer").show();
    $(".invstate").show();
    $(".fixed-table").removeClass('fixed-tablepurchase');
    $(".fixed-table").addClass('fixed-tablesale');



    $("#invoice_date").numeric();
    $("#invoice_month").numeric();
    $("#invoice_year").numeric();
    $('.invoice_product_quantity').numeric({ negative: false });
    $('.invoice_product_per_price').numeric({ negative: false });
    $("#invoice_deliverynote").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_challanno").focus().select();
        }
    });

    $("#invoice_challanno").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_date").focus().select();
        }

    });


    function pad(str, max) { //to add leading zeros in date
        str = str.toString();
        if (str.length == 1) {
            return str.length < max ? pad("0" + str, max) : str;
        } else {
            return str
        }
    }

    function yearpad(str, max) { //to add leading 20 or 200 to the year
        str = str.toString();
        if (str.length == 1) {
            return str.length < max ? pad("200" + str, max) : str;
        } else if (str.length == 2) {
            return str.length < max ? pad("20" + str, max) : str;
        } else {
            return str
        }
    }
    $("#invoice_date").blur(function(event) {
        $(this).val(pad($(this).val(), 2));
    });
    $("#invoice_month").blur(function(event) {
        $(this).val(pad($(this).val(), 2));
    });

    $("#invoice_year").blur(function(event) {
        $(this).val(yearpad($(this).val(), 4));
    });

    $("#invoice_date").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_month").focus().select();
        }
        if (event.which == 38) {
            event.preventDefault();
            $("#invoice_challanno").focus().select();
        }
    });
    $("#invoice_month").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_year").focus().select();
        }
        if (event.which == 38) {
            event.preventDefault();
            $("#invoice_date").focus().select();
        }
    });

    $("#invoice_year").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_state").focus().select();
        }
        if (event.which == 38) {
            event.preventDefault();
            $("#invoice_month").focus().select();
        }
    });

    $("#invoice_reset").click(function(event) {
        $("#cashmemo_create").click();

    });

    $("#invoice_state").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            //$('#invoice_product_table tbody tr:first td:eq(0) select').focus();
            $('#taxapplicable').focus();

        }
        if (event.which == 38 && (document.getElementById('#invoice_state').selectedIndex == 0)) {
            event.preventDefault();


            $("#invoice_year").focus();


        }
    });
    $("#taxapplicable").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
              if ($("#taxapplicable option:selected").val() == 22 ) {
            $('#invoice_product_table tbody tr:first td:eq(0) select').focus();
          }
          else{
            $('#invoice_product_table_gst tbody tr:first td:eq(0) select').focus();
          }


        }
        if (event.which == 38 && (document.getElementById('#taxapplicable').selectedIndex == 0)) {
            event.preventDefault();


            $("#invoice_state").focus();


        }
    });
    $(document).off('change', '#taxapplicable').on('change', '#taxapplicable', function(event) {
        event.preventDefault();

        if ($("#taxapplicable option:selected").val() == 22 ) {
          //VAT
          console.log("show VAT");
          $("#gstproducttable").hide();
          $("#invoice_product_table").show();

          console.log("//VAT");
        }
        if ($("#taxapplicable option:selected").val() == 7 ) {

          console.log("GST");
          $("#gstproducttable").show();
          $("#invoice_product_table").hide();

          console.log("//gst");
        }


      });


    $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
        event.preventDefault();
        /* Act on the event */
        //being a dynamic generated field the numeric property is added on their focus
        $(".numtype").numeric();
    });
    $(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this).val() == "") {
            $(this).val(parseFloat(0).toFixed(2));
        } else {
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
        if ($(this).val() == "") {
            $(this).val(0);
        }
    });

    // following is a function to fil tax rate depending on the state choosen, against the respective products
    //if state selected is none then zero is added in the tax rate fields of product rows
    // else the tax rate is retrieved from the database with the combination of state and product code
    $(document).off('change', '#invoice_state').on('change', '#invoice_state', function(event) {
        event.preventDefault();
        /* Act on the event */

        var sourcestate=$("#invoice_state option:selected").val();
        var destinationstate=$("#invoice_state option:selected").val();
        var taxflag=$("#taxapplicable option:selected").val();
        var productcode;
        $(".product_name_vat").each(function() {
            var curindex = $(this).closest('tbody tr').index();
            productcode = $(this).find('option:selected').val();
            if (sourcestate == "none") {
                $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
            } else {

                $.ajax({
                        url: '/invoice?action=getappliedtax',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        data: { "productcode": productcode, "source": sourcestate,"destination":destinationstate,"taxflag":taxflag },
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                        }
                    })
                    .done(function(resp) {
                        console.log("success");
                        if (resp["gkstatus"] == 0) {
                          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').data("taxdetails", {taxname: resp["taxname"], taxrate:resp["taxrate"]});
                            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['taxrate']).toFixed(2));
                        }

                    })
                    .fail(function() {
                        console.log("error");
                          $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0.0).toFixed(2));
                    })
                    .always(function() {
                        console.log("complete");
                    });
            }
        });


    });


    // if the selected product is changed the tax rate is again retrieved from the database, again using the combination of product code and state
    $(document).off('change', '.product_name_vat').on('change', '.product_name_vat', function(event) {
      console.log("CHANGE VAT PROD NAME");
        event.preventDefault();
        /* Act on the event */
      var sourcestate=$("#invoice_state option:selected").val();
      var destinationstate=$("#invoice_state option:selected").val();
      var taxflag=$("#taxapplicable option:selected").val();
        var productcode = $(this).find('option:selected').val();
        var curindex = $(this).closest('tbody tr').index();
        console.log("VAT"+productcode);

        if (sourcestate == "none") {
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
        } else {

            $.ajax({
                    url: '/invoice?action=getappliedtax',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: { "productcode": productcode, "source": sourcestate,"destination":destinationstate,"taxflag":taxflag },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    console.log("success");
                    console.log("getappliedtax called");
                    if (resp["gkstatus"] == 0) {
                        $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['taxrate']).toFixed(2));
                        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').data("taxdetails", {taxname: resp["taxname"], taxrate:resp["taxrate"]});
                        console.log(resp);

                    }

                })
                .fail(function() {
                    console.log("error in getappliedtax");
                    $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0.0).toFixed(2));
                })
                .always(function() {
                    console.log("complete");
                });
        }
        // the unit of measurement name that is associted with the product is retrieved by pasing the product code and is displayed in the span element against the respective produt
        $.ajax({
                url: '/invoice?action=getproduct',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: { "productcode": productcode },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                if (resp["gkstatus"] == 0) {
                    $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) span').text(resp["unitname"]);
                    $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]);
                }

            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });



    });

var prodservflag=0;
    //Key events for GST Product Table
    $(document).off("keydown", ".product_name_gst").on("keydown", ".product_name_gst", function(event) {
      var curindex = $(this).closest('tr').index();
      var nextindex = curindex + 1;
      var previndex = curindex - 1;
      $(".product_name_gst").change();
      if (event.which == 38 || event.which == 40) {
        event.preventDefault();
          $(".product_name_gst").change();
      }
      if (event.which == 13) {
        event.preventDefault();

        $(".product_name_gst").change();
        if (prodservflag==1){
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
        }
        else{
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
        }


      } else if (event.which == 190 && event.shiftKey) {
        $('#invoice_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
      } else if (event.which == 188 && event.shiftKey) {
        if (previndex > -1) {
          event.preventDefault();
          $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(0) select').focus();
        }
        if (curindex == 0) {
          event.preventDefault();
            $("#taxapplicable").focus();
          }
      } else if (event.which == 188 && event.ctrlKey) {
        event.preventDefault();
        if (curindex == 0) {
          event.preventDefault();
            $("#taxapplicable").focus();
          } else {
          $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(4) input').focus().select();
        }
      } else if (event.which == 190 && event.ctrlKey) {
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
        event.preventDefault();
      }
    });

          $(document).off('change', '.product_name_gst').on('change', '.product_name_gst', function(event) {
            console.log("product_name_gst");
            event.preventDefault();
            /* Act on the event */
            var productcode = $(this).find('option:selected').val();
            var curindex = $(this).closest('tbody tr').index();
            var sourcestate=$("#invoice_state option:selected").val();

            var taxflag=$("#taxapplicable option:selected").val();

            $.ajax({
                    url: '/invoice?action=getappliedtax',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: { "productcode": productcode, "source": sourcestate,"destination":sourcestate,"taxflag":taxflag },
                    beforeSend: function(xhr) {
                      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                  })
                   .done(function(resp) {
                     console.log(resp);
                     if (resp["gkstatus"] == 0) {
        		 console.log("yo yo INSERTION OF taxdetails");
        		 $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').data("taxdetails", {taxname: resp["taxname"], taxrate:resp["taxrate"]});
                       if(resp['taxname']=='SGST'){
                          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(resp['taxrate']).toFixed(2));
                          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(resp['taxrate']).toFixed(2));
                       }


                       //$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').prop("disabled", false);
                     }
                   })
                   .fail(function() {
                     console.log("error");
                   })
                   .always(function() {
                     console.log("complete");
                   });
            $.ajax({
              url: '/invoice?action=getproduct',
              type: 'POST',
              dataType: 'json',
              async: false,
              data: { "productcode": productcode },
              beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
              }
            })
             .done(function(resp) {
               console.log("success");
               if (resp["gkstatus"] == 0) {

                 $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(1) .invoice_product_hsncode').text(resp["gscode"]);
                 if (resp["gsflag"]==7){
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", false);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", false);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text(resp["unitname"]);

                 }

                 if (resp["gsflag"]!=7){
                   prodservflag=1;
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", true);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", true);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text("");
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text("");


                   console.log("not goods");
                 }
                 else{
                   prodservflag=0;

                 }



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
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_issuer_designation").focus().select();
        }
    });

    $(document).off('keydown', '#invoice_issuer_designation').on('keydown', '#invoice_issuer_designation', function(event) {
        /* Act on the event */
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_save").click();
        }
    });

    $(document).off("keyup").on("keyup", function(event) {
        if (event.which == 45) {
            event.preventDefault();
            $("#invoice_save").click();
            return false;
        }
    });



    // navigation using ctrl key and shift key
    $(document).off("keydown", ".product_name_vat").on("keydown", ".product_name_vat", function(event) {
        var curindex = $(this).closest('tr').index();
        var nextindex = curindex + 1;
        var previndex = curindex - 1;
        if (event.which == 13) {
            event.preventDefault();
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();
        } else if (event.which == 190 && event.shiftKey) {
            $('#invoice_product_table tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
        } else if (event.which == 188 && event.shiftKey) {
            if (previndex > -1) {
                event.preventDefault();
                $('#invoice_product_table tbody tr:eq(' + previndex + ') td:eq(0) select').focus();
            }
            if (curindex == 0) {
                event.preventDefault();
                $("#invoice_schedule").focus().select();
            }
        } else if (event.which == 188 && event.ctrlKey) {
            event.preventDefault();
            if (curindex == 0) {
                event.preventDefault();
                $("#invoice_schedule").focus().select();
            } else {
                $('#invoice_product_table tbody tr:eq(' + previndex + ') td:eq(4) input').focus().select();
            }
        } else if (event.which == 190 && event.ctrlKey) {
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();
            event.preventDefault();
        }
    });
    //being dynamic generated fields the numeric property is added on their focus
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

    // to add trailing ".00"
    $(document).off('blur', '.invoice_product_per_price').on('blur', '.invoice_product_per_price', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this).val() != "") {
            $(this).val(parseFloat($(this).val()).toFixed(2));

        } else {
            $(this).val(parseFloat(0).toFixed(2));
        }
    });

    $(document).off('blur', '.invoice_product_tax_rate').on('blur', '.invoice_product_tax_rate', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this).val() != "") {
            $(this).val(parseFloat($(this).val()).toFixed(2));

        } else {
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
        if ($(this).val() != "") {
            $(this).val(parseFloat($(this).val()).toFixed(2));

        } else {
            $(this).val(parseFloat(0).toFixed(2));
        }
    });
    // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
    // the following values are also calculated
    //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
    // Row Total = (Quantity * Price Per Unit) + Tax Amount
    $(document).off('change', '.invoice_product_quantity').on('change', '.invoice_product_quantity', function(event) {
        event.preventDefault();
        /* Act on the event */
        if ($(this).val() == "") {
            $(this).val(0);
        }
        var curindex = $(this).closest('#invoice_product_table tbody tr').index();
        var rowqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
        var rowfreeqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
        var rowprice = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
        var rowdiscount = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
          var rowtaxableamount=((rowqty - rowfreeqty) * rowprice)-rowdiscount;
          $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2));
        var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);

        var taxpercentamount = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) * (rowtaxrate / 100);
        var rowtotal = ((rowqty - rowfreeqty) * (rowprice-rowdiscount)) + taxpercentamount;
        $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxpercentamount).toFixed(2));
        $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));

        pqty = 0;
        ptaxamt = 0.00;
        ptotal = 0.00;

        $(".invoice_product_quantity").each(function() {
            pqty += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
        });

        $(".invoice_product_tax_amount").each(function() {
            ptaxamt += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(6) input').val(parseFloat(ptaxamt).toFixed(2));
        });

        $(".invoice_product_total").each(function() {
            ptotal += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
        });

    });

    $(document).off("keydown", ".invoice_product_quantity").on("keydown", ".invoice_product_quantity", function(event) {
        var curindex = $(this).closest('tr').index();
        var nextindex = curindex + 1;
        var previndex = curindex - 1;
        if ($(this).val() == "") {
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val(0);
        }
        if (event.which == 13) {
            // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
            // the following values are also calculated
            //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
            // Row Total = (Quantity * Price Per Unit) + Tax Amount
            event.preventDefault();
            var curindex = $(this).closest('#invoice_product_table tbody tr').index();
            var rowqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
            var rowfreeqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
            var rowprice = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);

///
var rowdiscount = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
  var rowtaxableamount= ((rowqty - rowfreeqty) * rowprice)-rowdiscount;
  $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2));
var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);

var taxpercentamount = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) * (rowtaxrate / 100);
var rowtotal = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) + taxpercentamount;
$('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxpercentamount).toFixed(2));
$('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));


///
            pqty = 0;
            ptaxamt = 0.00;
            ptotal = 0.00;

            $(".invoice_product_quantity").each(function() {
                pqty += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
            });

            $(".invoice_product_tax_amount").each(function() {
                ptaxamt += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(6) input').val(parseFloat(ptaxamt).toFixed(2));
            });

            $(".invoice_product_total").each(function() {
                ptotal += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
            });


            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
        } else if (event.which == 190 && event.shiftKey) {
            $('#invoice_product_table tbody tr:eq(' + nextindex + ') td:eq(1) input').focus();
        } else if (event.which == 188 && event.shiftKey) {
            if (previndex > -1) {
                event.preventDefault();
                $('#invoice_product_table tbody tr:eq(' + previndex + ') td:eq(1) input').focus();
            }
            if (curindex == 0) {
                event.preventDefault();
                $("#invoice_schedule").focus().select();
            }
        } else if (event.which == 188 && event.ctrlKey) {
            event.preventDefault();


            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

        } else if (event.which == 190 && event.ctrlKey) {
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
            event.preventDefault();
        }
    });
    //.................................................
    $(document).off("keydown", ".invoice_product_freequantity").on("keydown", ".invoice_product_freequantity", function(event) {
        var curindex = $(this).closest('tr').index();
        var nextindex = curindex + 1;
        var previndex = curindex - 1;
        if ($(this).val() == "") {
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val(0);
        }
        if (event.which == 13) {
            // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
            // the following values are also calculated
            //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
            // Row Total = (Quantity * Price Per Unit) + Tax Amount
            event.preventDefault();
            var curindex = $(this).closest('#invoice_product_table tbody tr').index();
            var rowqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
            var rowfreeqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
            var rowprice = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
            ///
            var rowdiscount = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
              var rowtaxableamount= ((rowqty - rowfreeqty) * rowprice)-rowdiscount;
              $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2));
            var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);

            var taxpercentamount = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) * (rowtaxrate / 100);
            var rowtotal = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) + taxpercentamount;
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxpercentamount).toFixed(2));
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));

            ///


            pqty = 0;
            ptaxamt = 0.00;
            ptotal = 0.00;

            $(".invoice_product_quantity").each(function() {
                pqty += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
            });

            $(".invoice_product_tax_amount").each(function() {
                ptaxamt += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(6) input').val(parseFloat(ptaxamt).toFixed(2));
            });

            $(".invoice_product_total").each(function() {
                ptotal += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
            });


            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
        } else if (event.which == 190 && event.shiftKey) {
            $('#invoice_product_table tbody tr:eq(' + nextindex + ') td:eq(1) input').focus();
        } else if (event.which == 188 && event.shiftKey) {
            if (previndex > -1) {
                event.preventDefault();
                $('#invoice_product_table tbody tr:eq(' + previndex + ') td:eq(1) input').focus();
            }
            if (curindex == 0) {
                event.preventDefault();
                $("#invoice_schedule").focus().select();
            }
        } else if (event.which == 188 && event.ctrlKey) {
            event.preventDefault();


            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

        } else if (event.which == 190 && event.ctrlKey) {
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
            event.preventDefault();
        }
    });
    //.............................................................
    // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
    // the following values are also calculated
    //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
    // Row Total = (Quantity * Price Per Unit) + Tax Amount
    $(document).off('change', '.invoice_product_discount').on('change', '.invoice_product_discount', function(event) {
        event.preventDefault();
        /* Act on the event */
        var curindex = $(this).closest('#invoice_product_table tbody tr').index();
        var rowqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
        var rowfreeqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
        var rowprice = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);


///
var rowdiscount = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
  var rowtaxableamount= ((rowqty - rowfreeqty) * rowprice)-rowdiscount;
  $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2));
var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);

var taxpercentamount = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) * (rowtaxrate / 100);
var rowtotal = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) + taxpercentamount;
$('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxpercentamount).toFixed(2));
$('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));

///


        perprice = 0.00;
        ptaxamt = 0.00;
        ptotal = 0.00;

        $(".invoice_product_per_price").each(function() {
            perprice += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
        });

        $(".invoice_product_tax_amount").each(function() {
            ptaxamt += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(6) input').val(parseFloat(ptaxamt).toFixed(2));
        });

        $(".invoice_product_total").each(function() {
            ptotal += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(7) input').val(parseFloat(ptotal).toFixed(2));
        });

    });

    $(document).off("keydown", ".invoice_product_discount").on("keydown", ".invoice_product_discount", function(event) {
      console.log("KEYDOWN DISC");
        var curindex = $(this).closest('tr').index();
        var nextindex = curindex + 1;
        var previndex = curindex - 1;
        if (event.which == 13) {
            // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
            // the following values are also calculated
            //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
            // Row Total = (Quantity * Price Per Unit) + Tax Amount
            event.preventDefault();
            var curindex = $(this).closest('#invoice_product_table tbody tr').index();
            var rowqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
            var rowfreeqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
            var rowprice = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);

///
var rowdiscount = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
  var rowtaxableamount= (((rowqty - rowfreeqty) * rowprice)-rowdiscount);
  $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2));
var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);

var taxpercentamount = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) * (rowtaxrate / 100);
var rowtotal = ((((rowqty - rowfreeqty) * rowprice)-rowdiscount)) + taxpercentamount;
$('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxpercentamount).toFixed(2));
$('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));

///


            perprice = 0.00;
            ptaxamt = 0.00;
            ptotal = 0.00;

            $(".invoice_product_per_price").each(function() {
                perprice += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
            });

            $(".invoice_product_tax_amount").each(function() {
                ptaxamt += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptaxamt).toFixed(2));
            });

            $(".invoice_product_total").each(function() {
                ptotal += +$(this).val();

                // jquery enables us to select specific elements inside a table easily like below.
                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
            });

            if (curindex != ($("#invoice_product_table tbody tr").length - 1)) {
                $('#invoice_product_table tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
            } else {
                if ($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
                    $("#product-blank-alert").alert();
                    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#product-blank-alert").hide();
                    });
                    $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
                    return false;
                }
                //a new row is added on pressing enter key and the list of products are appended in the select box of the 1st column of the newly generated row
                $.ajax({
                        url: '/invoice?action=getproducts&taxflag=22',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                        }
                    })
                    .done(function(resp) {
                        console.log("success");
                        if (resp["gkstatus"] == 0) {
                            $('#invoice_product_table tbody').append('<tr>' +
                                '<td class="col-xs-3">' +
                                '<select class="form-control input-sm product_name_vat"></select>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<div class="input-group">' +
                                '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">' +
                                '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
                                '</div>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<div class="input-group">' +
                                '<input type="text" class="invoice_product_freequantity form-control input-sm text-right" value="0" placeholder="0" aria-describedby="unitaddon">' +
                                '<span class="input-group-addon input-sm" id="freeunitaddon"></span>' +
                                '</div>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<input type="text" class="invoice_product_per_price form-control input-sm numtype text-right" value="0.00">' +
                                '</td>' +
                                '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_discount form-control input-sm text-right numtype" value="0.00" placeholder="0.00" size="8">'+
                                '</td>'+
                                '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_taxablevalue form-control input-sm text-right numtype" value="0.00" placeholder="0.00" size="8" disabled>'+
                                '</td>'+
                                '<td class="col-xs-1">' +
                                '<input type="text" class="invoice_product_tax_rate form-control input-sm numtype text-right" value="0.00">' +
                                '</td>' +
                                '<td class="col-xs-1">' +
                                '<input type="text" class="invoice_product_tax_amount form-control input-sm numtype text-right" value="0.00" disabled>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable input-sm numtype text-right" value="0.00" disabled>' +
                                '</td>' +
                                '<td class="col-xs-1" style="width: 5%">' +
                                '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
                                '</td>' +
                                '</tr>');

                            $(".invoice_product_tax_rate").prop("disabled", true);


                            for (product of resp["products"]) {
                                $('#invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' + product.productdesc + '</option>');
                            }
                            $('#invoice_product_table tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();



                            var sourcestate=$("#invoice_state option:selected").val();
                            var destinationstate=$("#invoice_state option:selected").val();
                            var taxflag=$("#taxapplicable option:selected").val();
                            var productcode = $('#invoice_product_table tbody tr:last td:eq(0) select option:selected').val();
                            console.log("BEFORE AJX getappliedtax");
                            var curindex = $(this).closest('tbody tr').index();
                            if (sourcestate == "none") {
                                $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
                                console.log("none");
                            } else {

                                //tax rate is retrieved from the database with the combination of state and product code

                                $.ajax({
                                        url: '/invoice?action=getappliedtax',
                                        type: 'POST',
                                        dataType: 'json',
                                        async: false,
                                        data: { "productcode": productcode, "source": sourcestate,"destination":destinationstate,"taxflag":taxflag },
                                        beforeSend: function(xhr) {
                                            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                                        }
                                    })
                                    .done(function(resp) {
                                        console.log("success");
                                        if (resp["gkstatus"] == 0) {
                                          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').data("taxdetails", {taxname: resp["taxname"], taxrate:resp["taxrate"]});
                                            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['taxrate']).toFixed(2));
                                        }

                                    })
                                    .fail(function() {
                                        console.log("error");
                                        $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0.0).toFixed(2));
                                    })
                                    .always(function() {
                                        console.log("complete");
                                    });
                            }


                            taxrate = 0.00;
                            ptaxamt = 0.00;
                            ptotal = 0.00;


                            $(".invoice_product_tax_rate").each(function() {
                                taxrate += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_tax_amount").each(function() {
                                ptaxamt += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#invoice_product_table tfoot tr:last td:eq(6) input').val(parseFloat(ptaxamt).toFixed(2));
                            });

                            $(".invoice_product_total").each(function() {
                                ptotal += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
                                $('#totalinvoicevalue').text(parseFloat(ptotal).toFixed(2));
                            });

                            //$('#invoice_product_table tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
                            console.log("NEXTINDEX PRODUCT");
                            $('.invoice_product_quantity').numeric({ negative: false });
                            $('.invoice_product_freequantity').numeric({ negative: false });
                            $('.invoice_product_per_price').numeric({ negative: false });
                        }
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        console.log("complete");
                    });

            }


        } else if (event.which == 190 && event.shiftKey) {
            $('#invoice_product_table tbody tr:eq(' + nextindex + ') td:eq(2) input').focus();
        } else if (event.which == 188 && event.shiftKey) {
            if (previndex > -1) {
                event.preventDefault();
                $('#invoice_product_table tbody tr:eq(' + previndex + ') td:eq(2) input').focus();
            }
            if (curindex == 0) {
                event.preventDefault();
                $("#invoice_schedule").focus().select();
            }
        } else if (event.which == 188 && event.ctrlKey) {
            event.preventDefault();


            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();

        } else if (event.which == 190 && event.ctrlKey) {
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
            event.preventDefault();
        }
    });
    // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
    // the following values are also calculated
    //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
    // Row Total = (Quantity * Price Per Unit) + Tax Amount
    $(document).off('change', '.invoice_product_tax_rate').on('change', '.invoice_product_tax_rate', function(event) {
        event.preventDefault();
        /* Act on the event */
        var curindex = $(this).closest('#invoice_product_table tbody tr').index();
        var rowqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
        var rowfreeqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
        var rowprice = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
        var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
        var rowdiscount = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
        var taxpercentamount = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) * (rowtaxrate / 100);
        var rowtotal = (((rowqty - rowfreeqty) * rowprice)-rowdiscount) + taxpercentamount;
        $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(taxpercentamount).toFixed(2));

        $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(rowtotal).toFixed(2));


        taxrate = 0.00;
        ptaxamt = 0.00;
        ptotal = 0.00;


        $(".invoice_product_tax_rate").each(function() {
            taxrate += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
        });

        $(".invoice_product_tax_amount").each(function() {
            ptaxamt += +$(this).val();
            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(6) input').val(parseFloat(ptaxamt).toFixed(2));
        });

        $(".invoice_product_total").each(function() {
            ptotal += +$(this).val();

            // jquery enables us to select specific elements inside a table easily like below.
            $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
        });

    });
///
$(document).off("keydown", ".invoice_product_per_price").on("keydown", ".invoice_product_per_price", function(event) {
  var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1 + 1;
  var previndex1 = curindex1 - 1;
  if (event.which == 13) {
    event.preventDefault();
      $('#invoice_product_table tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus().select();
      console.log("per price to disc ");

  }
});

///

///

    $(document).off("keydown", ".invoice_product_tax_rate").on("keydown", ".invoice_product_tax_rate", function(event) {
        var curindex1 = $(this).closest('tr').index();
        var nextindex1 = curindex1 + 1;
        var previndex1 = curindex1 - 1;

        if (event.which == 35) {
            // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
            // the following values are also calculated
            //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
            // Row Total = (Quantity * Price Per Unit) + Tax Amount

            event.preventDefault();
            var curindex = $(this).closest('#invoice_product_table tbody tr').index();
            var rowqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
            var rowfreeqty = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
            var rowprice = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
            var rowtaxrate = parseFloat($('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
            var taxpercentamount = (rowqty - rowfreeqty) * rowprice * (rowtaxrate / 100);
            var rowtotal = ((rowqty - rowfreeqty) * rowprice) + taxpercentamount;
            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(taxpercentamount).toFixed(2));

            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtotal).toFixed(2));

            $("#invoice_issuer_name").focus().select();
        } else if (event.which == 13) {
            event.preventDefault();
            if (curindex1 != ($("#invoice_product_table tbody tr").length - 1)) {
                $('#invoice_product_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
            } else {
                // all the column totals are directly calculated dynamically on the change of any of the related fields in the column
                // the following values are also calculated
                //Tax Amount = Quantity * Price Per Unit *(tax rate/100)
                // Row Total = (Quantity * Price Per Unit) + Tax Amount

                if ($('#invoice_product_table tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
                    $("#product-blank-alert").alert();
                    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#product-blank-alert").hide();
                    });
                    $('#invoice_product_table tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
                    return false;
                }
                $.ajax({
                        url: '/invoice?action=getproducts&taxflag=22',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                        }
                    })
                    .done(function(resp) {
                        console.log("success");
                        if (resp["gkstatus"] == 0) {
                            $('#invoice_product_table tbody').append('<tr>' +
                                '<td class="col-xs-3">' +
                                '<select class="form-control input-sm product_name_vat"></select>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<div class="input-group">' +
                                '<input type="text" class="invoice_product_quantity form-control input-sm text-right" value="0">' +
                                '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
                                '</div>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<div class="input-group">' +
                                '<input type="text" class="invoice_product_freequantity form-control input-sm text-right" value="0" placeholder="0" aria-describedby="unitaddon">' +
                                '<span class="input-group-addon input-sm" id="freeunitaddon"></span>' +
                                '</div>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<input type="text" class="invoice_product_per_price form-control input-sm numtype text-right" value="0.00">' +
                                '</td>' +
                                '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_discount form-control input-sm text-right numtype" value="0.00" placeholder="0.00" size="8">'+
                                '</td>'+
                                '<td class="col-xs-1">'+
                                  '<input type="text" class="invoice_product_taxablevalue form-control input-sm text-right numtype" value="0.00" placeholder="0.00" size="8" disabled>'+
                                '</td>'+
                                '<td class="col-xs-1">' +
                                '<input type="text" class="invoice_product_tax_rate form-control input-sm numtype text-right" value="0.00">' +
                                '</td>' +
                                '<td class="col-xs-1">' +
                                '<input type="text" class="invoice_product_tax_amount form-control input-sm numtype text-right" value="0.00" disabled>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable input-sm numtype text-right" value="0.00" disabled>' +
                                '</td>' +
                                '<td class="col-xs-1" style="width: 5%">' +
                                '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
                                '</td>' +
                                '</tr>');

                            $(".invoice_product_tax_rate").prop("disabled", true);



                            for (product of resp["products"]) {
                                $('#invoice_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' + product.productdesc + '</option>');
                            }

                            var sourcestate=$("#invoice_state option:selected").val();
                            var destinationstate=$("#invoice_state option:selected").val();
                            var taxflag=$("#taxapplicable option:selected").val();
                            var productcode = $('#invoice_product_table tbody tr:last td:eq(0) select option:selected').val();
                            console.log("befor ajax getappliedtax");
                            var curindex = $(this).closest('tbody tr').index();
                            if (sourcestate == "none") {
                                $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
                            } else {
                                //tax rate is retrieved from the database with the combination of state and product code

                                $.ajax({
                                        url: '/invoice?action=getappliedtax',
                                        type: 'POST',
                                        dataType: 'json',
                                        async: false,
                                        data: { "productcode": productcode, "source": sourcestate,"destination":destinationstate,"taxflag":taxflag },
                                        beforeSend: function(xhr) {
                                            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                                        }
                                    })
                                    .done(function(resp) {
                                        console.log("success");
                                        if (resp["gkstatus"] == 0) {
                                          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').data("taxdetails", {taxname: resp["taxname"], taxrate:resp["taxrate"]});
                                            $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['taxrate']).toFixed(2));
                                        }

                                    })
                                    .fail(function() {
                                        console.log("error");
                                        $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0.0).toFixed(2));
                                    })
                                    .always(function() {
                                        console.log("complete");
                                    });
                            }


                            taxrate = 0.00;
                            ptaxamt = 0.00;
                            ptotal = 0.00;


                            $(".invoice_product_tax_rate").each(function() {
                                taxrate += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_tax_amount").each(function() {
                                ptaxamt += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#invoice_product_table tfoot tr:last td:eq(6) input').val(parseFloat(ptaxamt).toFixed(2));
                            });

                            $(".invoice_product_total").each(function() {
                                ptotal += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
                            });

                            $('#invoice_product_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
                            $('.invoice_product_quantity').numeric({ negative: false });
                            $('.invoice_product_per_price').numeric({ negative: false });
                        }
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        console.log("complete");
                    });

            }
        } else if (event.which == 190 && event.shiftKey) {
            event.preventDefault();
            $('#invoice_product_table tbody tr:eq(' + nextindex1 + ') td:eq(4) input').focus().select();
        } else if (event.which == 188 && event.shiftKey) {
            if (previndex1 > -1) {
                event.preventDefault();
                $('#invoice_product_table tbody tr:eq(' + previndex1 + ') td:eq(4) input').focus().select();
            }
            if (curindex1 == 0) {
                event.preventDefault();
                $("#invoice_schedule").focus().select();
            }
        } else if (event.which == 190 && event.ctrlKey) {
            $('#invoice_product_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
            event.preventDefault();
        } else if (event.ctrlKey && event.which == 188) {
            $('#invoice_product_table tbody tr:eq(' + curindex1 + ') td:eq(2) input').focus();
            event.preventDefault();
        } else {

            event.preventDefault();


        }
    });
    ///




///
    $(document).off("click", ".product_del").on("click", ".product_del", function() {
        $(this).closest('tr').fadeOut(200, function() {
            $(this).closest('tr').remove(); //closest method gives the closest element productified
            $('#invoice_product_table tbody tr:last td:eq(0) input').focus().select();
        });
        $('#invoice_product_table tbody tr:last td:eq(0) input').select();
    });
    $("#invoice_save").click(function(event) {
        // validations start below
        event.stopPropagation();

        var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
        if ($.trim($('#invoice_challanno').val()) == "") {
            $("#challanno-blank-alert").alert();
            $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#challanno-blank-alert").hide();
            });
            $('#invoice_challanno').focus();
            return false;
        }

        if ($.trim($('#invoice_date').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_date').focus();
            return false;
        }
        if ($.trim($('#invoice_month').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_month').focus();
            return false;
        }
        if ($.trim($('#invoice_year').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_year').focus();
            return false;
        }
        if (!Date.parseExact($("#invoice_date").val() + $("#invoice_month").val() + $("#invoice_year").val(), "ddMMyyyy")) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#invoice_date').focus().select();
            return false;
        }
        var curdate = Date.parseExact($("#invoice_year").val() + $("#invoice_month").val() + $("#invoice_date").val(), "yyyyMMdd")
        if (!curdate.between(financialstart, financialend)) {
            $("#between-date-alert").alert();
            $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#between-date-alert").hide();
            });
            $('#invoice_date').focus().select();
            return false;
        }

        var tax = {};
        var contents = {};
        var stock = {};
        var freeqty = {};
        var productqtys=[];
        var items = {};
        var discount = {};
          var bankdetails = {};
          bankdetails["accountno"] = $("#accountno").val();
          bankdetails["bankname"] = $("#bankname").val();
          bankdetails["ifsc"] = $("#ifsc").val();
          bankdetails["branchname"] = $("#branchname").val();
          console.log(bankdetails);
        if ($("#taxapplicable option:selected").val() == 22) {
        for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++) {
            if ($("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == "") {
                $("#product-blank-alert").alert();
                $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#product-blank-alert").hide();
                });
                $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
                return false;
            }
            if ($("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val() == "" || $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val() == 0) {
                $("#quantity-blank-alert").alert();
                $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#quantity-blank-alert").hide();
                });
                $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").focus();
                return false;
            }
            if ($("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val() == "" || $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val() == 0) {
                $("#price-blank-alert").alert();
                $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#price-blank-alert").hide();
                });
                $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").focus();
                return false;
            }
            var obj = {};
            var productcode = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
            // data is saved as dict where key is priceperunit and value is the product quantity so the below two lines of code
            var ppu = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(3) input").val();
            obj[ppu] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val();
            //tax is stored as a dict with key as productcode and value as the tax rate
            tax[productcode] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(4) input").val();
            // nested dictionary with key as product code and value is another dict with key as priceperunit and value is the product quantity
            contents[productcode] = obj;
            items[productcode] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val();
            freeqty[productcode] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val();
        }
      }
       if ($("#taxapplicable option:selected").val() == 7) {
         productqtys.push(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()));
     	  var obj = {};
     	for (var i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
        obj={};
     	productcode = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
             ppu = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val();
             obj[ppu] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
     	   // obj["discount"] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val();
          console.log(obj["discount"]);
     	    console.log("OBJ" + obj);
             contents[productcode] = obj;
          items[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
           freeqty[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val();
           discount[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val();
     	}
      console.log(discount);
     	    invoicetotal = $('#total_product_gst').text();
          console.log("inv total "+invoicetotal);

       }
        stock["items"] = items;


        stock["inout"] = 15;

console.log("tax apllicable ::"+$("#taxapplicable option:selected").val());
if ($("#taxapplicable option:selected").val() == 7) {
       var form_data = new FormData();
       console.log("tax apllicable ::"+$("#taxapplicable option:selected").val());

        form_data.append("invoiceno", $("#invoice_challanno").val());
        form_data.append("invoicedate", $("#invoice_year").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_date").val());
        form_data.append("contents", JSON.stringify(contents));
        form_data.append("tax", JSON.stringify(tax));
        form_data.append("stock", JSON.stringify(stock));
        form_data.append("invoicetotal", invoicetotal);
        form_data.append("taxstate", $("#invoice_state option:selected").val());
        form_data.append("sourcestate", $("#invoice_state option:selected").val());
        form_data.append("taxflag",$("#taxapplicable option:selected").val() );
        form_data.append("freeqty", JSON.stringify(freeqty));
        form_data.append("discount", JSON.stringify(discount));
        form_data.append("bankdetails", JSON.stringify(bankdetails));
console.log("sourcestate"+$("#invoice_state option:selected").val());
console.log("taxstate"+$("#invoice_state option:selected").val());


        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function(e) {
          console.log("action=save");
          $.ajax({
            url: '/cashmemos?action=save',
            type: 'POST',
            global: false,
            contentType: false,
            cache: false,
            processData: false,
            dataType: 'json',
            async: false,
            data: form_data,
            beforeSend: function(xhr) {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
           .done(function(resp) {
             if (resp["gkstatus"] == 0) {
               $("#cashmemo_create").click();
               if ($("#status").val() == '9') {
                 $("#invoice_record").click();

               } else {

                 $("#invoice_create").click();
               }
               $("#success-alert").alert();
               $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                 $("#success-alert").hide();
               });
               return false;
             } else if (resp["gkstatus"] == 1) {
               $("#invoice_challanno").focus();
               $("#duplicate-alert").alert();
               $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                 $("#duplicate-alert").hide();
               });
               return false;
             } else {
               $("#invoice_deliverynote").focus();
               $("#failure-alert").alert();
               $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
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
      }




if ($("#taxapplicable option:selected").val() == 22) {
        event.preventDefault();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function(e) {
            //ajax call to save the cash memo
            $.ajax({
                    url: '/cashmemos?action=save',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        "invoiceno": $("#invoice_challanno").val(),
                        "invoicedate": $("#invoice_year").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_date").val(),
                        "invoicetotal": $("#invoice_product_table tfoot tr:last td:eq(5) input").val(),
                        "contents": JSON.stringify(contents),
                        "taxstate": $("#invoice_state option:selected").val(),
                        "sourcestate": $("#invoice_state option:selected").val(),
                        "tax": JSON.stringify(tax),
                        "stock": JSON.stringify(stock),
                        "freeqty": JSON.stringify(freeqty),
                        "bankdetails": JSON.stringify(bankdetails),
                        "taxflag":$("#taxapplicable option:selected").val()
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    if (resp["gkstatus"] == 0) {

                        $("#cashmemo_create").click();

                        $("#success-alert").alert();
                        $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
                        });
                        return false;
                    } else if (resp["gkstatus"] == 1) {
                        $("#invoice_challanno").focus();
                        $("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        return false;
                    } else {
                        $("#invoice_challanno").focus();
                        $("#failure-alert").alert();
                        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
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
      }
    });
    $("#confirm_yes").on('shown.bs.modal', function(event) {
        $("#tn_save_no").focus();

    });
    $("#confirm_yes").on('hidden.bs.modal', function(event) {
        $("#invoice_challanno").focus();
    });
    // Function to save and print the cash memo
    // All details from the current page is sent to the print view in server
    $("#invoice_saveprint").click(function(event) {
        event.stopPropagation();
        var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
        if ($.trim($('#invoice_challanno').val()) == "") {
            $("#challanno-blank-alert").alert();
            $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#challanno-blank-alert").hide();
            });
            $('#invoice_challanno').focus();
            return false;
        }

        if ($.trim($('#invoice_date').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_date').focus();
            return false;
        }
        if ($.trim($('#invoice_month').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_month').focus();
            return false;
        }
        if ($.trim($('#invoice_year').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_year').focus();
            return false;
        }
        if (!Date.parseExact($("#invoice_date").val() + $("#invoice_month").val() + $("#invoice_year").val(), "ddMMyyyy")) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#invoice_date').focus().select();
            return false;
        }
        var curdate = Date.parseExact($("#invoice_year").val() + $("#invoice_month").val() + $("#invoice_date").val(), "yyyyMMdd")
        if (!curdate.between(financialstart, financialend)) {
            $("#between-date-alert").alert();
            $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#between-date-alert").hide();
            });
            $('#invoice_date').focus().select();
            return false;
        }
        var tax = {};
        var contents = {};
        var stock = {};
        var freeqty = {};
        var items = {};
        for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++) {
            if ($("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == "") {
                $("#product-blank-alert").alert();
                $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#product-blank-alert").hide();
                });
                $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
                return false;
            }
            if ($("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val() == "" || $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val() == 0) {
                $("#quantity-blank-alert").alert();
                $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#quantity-blank-alert").hide();
                });
                $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").focus();
                return false;
            }
            if ($("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val() == "" || $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val() == 0) {
                $("#price-blank-alert").alert();
                $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#price-blank-alert").hide();
                });
                $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").focus();
                return false;
            }
            var obj = {};
            var productcode = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
            var ppu = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val();
            obj[ppu] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val();
            tax[productcode] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(3) input").val();
            contents[productcode] = obj;
            items[productcode] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val();
            freeqty[productcode] = $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val();
        }
        stock["items"] = items;


        stock["inout"] = 15;


        event.preventDefault();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#confirm_yes_print').modal('show').one('click', '#tn_save_yesprint', function(e) {
            $.ajax({
                    url: '/cashmemos?action=save',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        "invoiceno": $("#invoice_challanno").val(),
                        "invoicedate": $("#invoice_year").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_date").val(),
                        "invoicetotal": $("#invoice_product_table tfoot tr:last td:eq(5) input").val(),
                        "contents": JSON.stringify(contents),
                        "taxstate": $("#invoice_state option:selected").val(),
                        "tax": JSON.stringify(tax),
                        "stock": JSON.stringify(stock),
                        "freeqty": JSON.stringify(freeqty),
                        "taxflag":$("#taxapplicable option:selected").val()
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    if (resp["gkstatus"] == 0) {
                        printset = [];
                        subtotal = 0;
                        for (var i = 0; i < $("#invoice_product_table tbody tr").length; i++) {
                            var obj = {};
                            //List of dictionaries with the table details to be sent to the print page
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
                    } else if (resp["gkstatus"] == 1) {
                        $("#invoice_challanno").focus();
                        $("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        return false;
                    } else {
                        $("#invoice_deliverynote").focus();
                        $("#failure-alert").alert();
                        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
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
    $(document).off('keydown', '.invoice_product_quantity_gst').on('keydown', '.invoice_product_quantity_gst', function(event) {
      if (event.which == 13) {
          event.preventDefault();
          console.log("enter on gst qty");
          $(".invoice_product_freequantity_gst").focus().select();
      }
    });
    $(document).off('keydown', '.invoice_product_freequantity_gst').on('keydown', '.invoice_product_freequantity_gst', function(event) {
      if (event.which == 13) {
          event.preventDefault();
          console.log("enter on gst freeqty to priceperunit");
          $(".invoice_product_per_price_gst").focus().select();
      }
    });
    $(document).off('keydown', '.invoice_product_per_price_gst').on('keydown', '.invoice_product_per_price_gst', function(event) {
      if (event.which == 13) {
          event.preventDefault();
          console.log("enter on gst freeqty to priceperunit");
          $(".invoice_product_discount_gst").focus().select();
      }
    });


    $(document).off('change', '.invoice_product_quantity_gst').on('change', '.invoice_product_quantity_gst', function(event) {
      event.preventDefault();

      /* Act on the event */
      if ($(this).val() == "") {
        $(this).val(0);
      }


  console.log("quantity");
      var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
      console.log("before change qty gst");
      calculategstaxamt(curindex);
     /* var rowtotal = ((rowqty - rowfreeqty) * (rowprice-rowdiscount)) + taxpercentamount;
      $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(taxpercentamount).toFixed(2));
      $('#invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtotal).toFixed(2));*/

      pqty = 0.00;
      ptaxamt = 0.00;
      ptotal = 0.00;
      var var_invoice_product_taxablevalue_gst;
      $(".invoice_product_quantity_gst").each(function() {
        pqty += +$(this).val();

        // jquery enables us to select specific elements inside a table easily like below.
        $('#invoice_product_table_gst tfoot tr:last td:eq(1) input').val(parseFloat(pqty).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
      });

    });
    $(document).off("keydown", ".invoice_product_discount_gst").on("keydown", ".invoice_product_discount_gst", function(event) {
    //write your code here
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1 + 1;
    var previndex1 = curindex1 - 1;
    console.log("discount");
    if (event.which == 13) {
      event.preventDefault();

      var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
      console.log("discount gst keydown");
       calculategstaxamt(curindex);
      //$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtotal).toFixed(2));


    	  if (curindex1 != ($("#invoice_product_table_gst tbody tr").length - 1)) {//Not a last row.
        $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
      } else if ($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option').length >= 2){//Last row along with additional conditions.
        if ($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
          return false;
        }
        $('#invoice_product_table_gst tbody').append('<tr>' + gsthtml + '</tr>');
        $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
  	  $('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
  	  for (let i = 0; i <= curindex1; i++) {
                var selectedproduct = $("#invoice_product_table_gst tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
  	      $("#invoice_product_table_gst tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
            }
        $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
        $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
        $(".product_name_gst").change();
           }
      else {
        if ($("#status").val() == '9')  {
          $("#invoice_save").click();
        }
        else if ($("#status").val() == '15') {
          //$("#invoice_issuer_name").focus();
        }
      }
    }
    });
      $(document).off('keydown', '#ifsc').on('keydown', '#ifsc', function(event) {
        if(event.which==13){
        $("#invoice_save").focus();
        }

      })



});
