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
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
*/

// This script is for the addinvoice.jinja2

$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    $("#invselect").focus();
    $("#invoice_editprint").hide();
    var dcno = '';
    var pqty = 0.00;
    var ptaxamt = 0.00;
    var perprice = 0.00;
    var ptotal = 0.00;
    var taxrate = 0.00;

    $("#invselect").change(function(event) {
        /* Act on the event */
        var invid = $("#invselect option:selected").val();
	console.log("Invid" + invid);
        if (invid != "") {
	    $.ajax(
    {

    type: "POST",
    url: "/invoice?action=showinv",
    global: false,
    async: false,
    data: {"invid": invid},
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#invdetailsdiv").html(resp);
    }
    }
  );
        }

    });
    $("#viewattach").click(function(event) {
        $.ajax({
                url: '/invoice?action=getattachment',
                type: 'POST',
                datatype: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
                data: { "invid": $("#invoice_all_no option:selected").val() },
            })
            .done(function(resp) {
                var x = window.open();
                if (x) {
                    //Browser has allowed it to be opened
                    x.focus();
                    x.document.open();
                    x.document.write(resp);
                    x.document.close();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups and retry');
                    x.close();
                }

                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

    });
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

    $("#invoice_editprint").click(function(event) {
        printset = [];
        subtotal = 0;
        for (var i = 0; i < $("#edit_invoice_product_table tbody tr").length; i++) {
            var obj = {};

            obj.productdesc = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select option:selected").text();
            obj.qty = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(1) input").val();
            obj.unitname = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(1) span").text();
            obj.freeqty = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(2) input").val();
            obj.ppu = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(3) input").val();
            subtotal += +((obj.qty - obj.freeqty) * obj.ppu);
            obj.taxrate = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(4) input").val();
            obj.taxamt = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(5) input").val();
            obj.rowtotal = $("#edit_invoice_product_table tbody tr:eq(" + i + ") td:eq(6) input").val();
            printset.push(obj);
        }
        $.ajax({
                url: '/invoice?action=print',
                type: 'POST',
                dataType: 'html',
                data: {
                    "dc": dcno,
                    "custid": $("#invoice_customer option:selected").val(),
                    "invoiceno": $("#invoice_challanno").val(),
                    "invoicedate": $("#invoice_date").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_year").val(),
                    "printset": JSON.stringify(printset),
                    "issuername": $("#invoice_issuer_name").val(),
                    "designation": $("#invoice_issuer_designation").val(),
                    "subtotal": parseFloat(subtotal).toFixed(2),
                    "taxtotal": $("#edit_invoice_product_table tfoot tr:first td:eq(4) input").val(),
                    "gtotal": $("#edit_invoice_product_table tfoot tr:first td:eq(5) input").val(),
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
    });
});
