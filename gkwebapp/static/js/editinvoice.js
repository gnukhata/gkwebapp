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
    $("#invoice_all_no").focus();
    $("#invoice_editprint").hide();
    var dcno = '';
    var pqty = 0.00;
    var ptaxamt = 0.00;
    var perprice = 0.00;
    var ptotal = 0.00;
    var taxrate = 0.00;

    $("#selectinvoice").change(function(event) {
        /* Act on the event */

        var invid = $("#invoice_all_no option:selected").val();
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
                        $(".btndisablediv").show();
                        $(".btn-success").hide();
                        if (resp.invoicedata.cancelflag == 1) {
                            $("#cancelmsg").show();
                            $("#alertstrong").html("Invoice cancelled on " + resp.invoicedata.canceldate);
                            //$("#invcl").prop("disabled", true);
                            //$("#invcl").hide();


                        } else {
                            $("#cancelmsg").hide();
                            //$("#invcl").prop("disabled", false);
                            //$("#invcl").show();
                        }
                        if (resp.invoicedata.attachmentcount > 0) {
                            $("#viewattach").show();
                        } else {
                            $("#viewattach").hide();
                        }
                        var invdatearray = resp.invoicedata.invoicedate.split(/\s*\-\s*/g);
                        $("#invoice_date").val(invdatearray[0]);
                        $("#invoice_month").val(invdatearray[1]);
                        $("#invoice_year").val(invdatearray[2]);

                        if (resp.invoicedata.dcno != null) {
                            dcno = resp.invoicedata.dcno;
                            $("#invoice_deliverynote").val(resp.invoicedata.dcno + ", " + resp.invoicedata.custname);
                        } else {
                            $("#invoice_deliverynote").val("None");
                        }
                        $(".invdetails").show();
                        $(document).find('.invdetails input,.invdetails select, .invstate select,.invoice_issuer input').prop("disabled", true);
                        $("#invoice_challanno").val(resp["invoicedata"]["invoiceno"]);
                        if (resp["invoicedata"]["csflag"] == 3) {
                            $(".invstate").show();
                            $(".cust").show();
                            $(".supp").hide();
                            $(".addr").show();
                            $(".tin").show();
                            $(".invoice_issuer").show();
                            $("#invoice_issuer_name").val(resp["invoicedata"]["issuername"]);
                            $("#invoice_issuer_designation").val(resp["invoicedata"]["designation"]);
                            $(".fixed-table").removeClass('viewfixed-tablepurchase');
                            $(".fixed-table").addClass('viewfixed-tablesale');
                            $("#invoice_editprint").show();

                        } else {
                            $(".fixed-table").removeClass('viewfixed-tablesale');
                            $(".fixed-table").addClass('viewfixed-tablepurchase');
                            $(".cust").hide();
                            $(".supp").show();
                            $(".addr").show();
                            $(".tin").show();
                            $(".invstate").hide();
                            $(".invoice_issuer").hide();
                            $("#invoice_editprint").hide();
                        }
                        $("#invoice_customer").empty();
                        $("#invoice_customer").append('<option value="' + resp["invoicedata"]["custid"] + '">' + resp["invoicedata"]["custname"] + '</option>');
                        $("#invoice_state").val(resp["invoicedata"]["taxstate"]);
                        $('#edit_invoice_product_table tbody').empty();
                        $.ajax({
                                url: '/customersuppliers?action=get',
                                type: 'POST',
                                dataType: 'json',
                                async: false,
                                data: { "custid": resp["invoicedata"]["custid"] },
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                                }
                            })
                            .done(function(resp) {
                                console.log("success");
                                if (resp["gkstatus"] == 0) {
                                    $("#invoice_customeraddr").val(resp["gkresult"]["custaddr"]);
                                    $("#invoice_customertin").val(resp["gkresult"]["custtan"]);
                                }
                            })
                            .fail(function() {
                                console.log("error");
                            })
                            .always(function() {
                                console.log("complete");
                            });
                        for (content in resp["invoicedata"]["contents"]) {

                            $('#edit_invoice_product_table tbody').append('<tr>' +
                                '<td class="col-xs-3">' +
                                '<select class="form-control deliverychallan_edit_disable edit_invoice_disable input-sm product_name">' +
                                '<option value="' + content + '">' + resp["invoicedata"]["contents"][content]["productdesc"] + '</option>' +
                                '</select>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<div class="input-group">' +
                                '<input type="text" class="invoice_product_quantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm text-right" value="' + resp["invoicedata"]["contents"][content]["qty"] + '">' +
                                '<span class="input-group-addon input-sm" id="unitaddon">' + resp["invoicedata"]["contents"][content]["unitname"] + '</span>' +
                                '</div>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<div class="input-group">' +
                                '<input type="text" class="invoice_product_freequantity form-control deliverychallan_edit_disable edit_invoice_disable input-sm text-right" value="' + resp["invoicedata"]["freeqty"] + '">' +
                                '<span class="input-group-addon input-sm" id="unitaddon">' + resp["invoicedata"]["contents"][content]["unitname"] + '</span>' +
                                '</div>' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<input type="text" class="invoice_product_per_price form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="' + resp["invoicedata"]["contents"][content]["priceperunit"] + '">' +
                                '</td>' +
                                '<td class="col-xs-1">' +
                                '<input type="text" class="invoice_product_tax_rate form-control edit_invoice_disable input-sm numtype text-right" value="' + resp["invoicedata"]["contents"][content]["taxamount"] + '">' +
                                '</td>' +
                                '<td class="col-xs-1">' +
                                '<input type="text" class="invoice_product_tax_amount form-control edit_invoice_disable input-sm numtype text-right" value="0.00" >' +
                                '</td>' +
                                '<td class="col-xs-2">' +
                                '<input type="text" class="invoice_product_total form-control deliverychallan_edit_disable edit_invoice_disable input-sm numtype text-right" value="0.00" disabled>' +
                                '</td>' +
                                '<td class="col-xs-1" style="width: 3%;">' +
                                '</td>' +
                                '</tr>');
                            $(".edit_invoice_disable").prop("disabled", true);
                            var curindex = $(this).closest('#edit_invoice_product_table tbody tr').index();
                            var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
                            var freeqty = parseFloat($('#edit_invoice_product_table tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
                            var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
                            var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
                            var taxpercentamount = (rowqty - freeqty) * rowprice * (rowtaxrate / 100);
                            var rowtotal = ((rowqty - freeqty) * rowprice) + taxpercentamount;
                            $('#edit_invoice_product_table tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(taxpercentamount).toFixed(2));
                            $('#edit_invoice_product_table tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtotal).toFixed(2));

                            pqty = 0;
                            ptaxamt = 0.00;
                            ptotal = 0.00;
                            perprice = 0.00;
                            taxrate = 0.00;

                            $(".invoice_product_quantity").each(function() {
                                pqty += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(1) input').val(pqty); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_per_price").each(function() {
                                perprice += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_tax_rate").each(function() {
                                taxrate += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_tax_amount").each(function() {
                                ptaxamt += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
                            });

                            $(".invoice_product_total").each(function() {
                                ptotal += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(5) input').val(parseFloat(ptotal).toFixed(2));
                            });
                        }
                        for (var i = 0; i < $('#edit_invoice_product_table tbody tr').length; i++) {
                            var Pcode = $('#edit_invoice_product_table tbody tr:eq(' + i + ') td:eq(0) select').val();
                            var freeqtyv = resp["invoicedata"]["freeqty"][Pcode];
                            //rowfreeqty=freeqty;
                            $('#edit_invoice_product_table tbody tr:eq(' + i + ') td:eq(2) input').val(freeqtyv);
                            var rowqty = parseFloat($('#edit_invoice_product_table tbody tr:eq(' + i + ') td:eq(1) input').val()).toFixed(2);
                            var rowprice = parseFloat($('#edit_invoice_product_table tbody tr:eq(' + i + ') td:eq(3) input').val()).toFixed(2);
                            var rowtaxrate = parseFloat($('#edit_invoice_product_table tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2);
                            var taxpercentamount = (rowqty - freeqtyv) * rowprice * (rowtaxrate / 100);
                            var rowtotal = ((rowqty - freeqtyv) * rowprice) + taxpercentamount;
                            $('#edit_invoice_product_table tbody tr:eq(' + i + ') td:eq(5) input').val(parseFloat(taxpercentamount).toFixed(2));
                            $('#edit_invoice_product_table tbody tr:eq(' + i + ') td:eq(6) input').val(parseFloat(rowtotal).toFixed(2));

                            pqty = 0;
                            ptaxamt = 0.00;
                            ptotal = 0.00;
                            perprice = 0.00;
                            taxrate = 0.00;

                            $(".invoice_product_quantity").each(function() {
                                pqty += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(1) input').val(pqty); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_per_price").each(function() {
                                perprice += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(2) input').val(parseFloat(perprice).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_tax_rate").each(function() {
                                taxrate += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(3) input').val(parseFloat(taxrate).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
                            });

                            $(".invoice_product_tax_amount").each(function() {
                                ptaxamt += +$(this).val();

                                // jquery enables us to select specific elements inside a table easily like below.
                                $('#edit_invoice_product_table tfoot tr:last td:eq(4) input').val(parseFloat(ptaxamt).toFixed(2));
                            });

                            $(".invoice_product_total").each(function() {
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
