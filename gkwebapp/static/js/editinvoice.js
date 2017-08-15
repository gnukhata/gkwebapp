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
	$("#viewinvfooter").show();
	if (parseInt($("#attachmentcount").val()) > 0) {
	$("#viewattach").show();
    }
    else {
	$("#viewattach").hide();
    }
	console.log($("#status").val());
	if ($("#status").val() == '9') {
	$("#invoice_editprint").hide();
    }
    else {
	$("#invoice_editprint").show();
    }
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
	    data: { "invid": $("#invselect option:selected").val() },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
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
        $.ajax({
                url: '/invoice?action=print',
                type: 'POST',
                dataType: 'html',
            data: {"invid":$("#invselect option:selected").val()},
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
