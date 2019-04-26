/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
	This file is part of GNUKhata:A modular,robust and Free Accounting System.

	GNUKhata is Free Software; you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as
	published by the Free Software Foundation; either version 3 of
	the License, or (at your option) any later version.

	GNUKhata is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public
	License along with GNUKhata (COPYING); if not, write to the
	Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
	Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
  "Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/
/*
This script is for the view page of list of Invoices.
*/
$(document).ready(function() {
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    $('.viewlist_date').autotab('number');

    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");

    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var sel1 = 0; // flag for focus on combo box

    // Setting default date to financialstart and end.
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g);
    $("#viewlist_fromdate").val(fromdatearray[2]);
    $("#viewlist_frommonth").val(fromdatearray[1]);
    $("#viewlist_fromyear").val(fromdatearray[0]);
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g);
    $("#viewlist_todate").val(todatearray[2]);
    $("#viewlist_tomonth").val(todatearray[1]);
    $("#viewlist_toyear").val(todatearray[0]);
    $("#invoicetypeselect").focus();

    function pad(str, max) { //to add leading zeros in date
        str = str.toString();
        if (str.length == 1) {
            return str.length < max ? pad("0" + str, max) : str;
        } else {
            return str;
        }
    }

    function yearpad(str, max) { //to add leading 20 or 200 to year
        str = str.toString();
        if (str.length == 1) {
            return str.length < max ? pad("200" + str, max) : str;
        } else if (str.length == 2) {
            return str.length < max ? pad("20" + str, max) : str;
        } else {
            return str;
        }
    }
    $("#viewlist_fromdate").blur(function(event) {
        $(this).val(pad($(this).val(), 2));
    });
    $("#viewlist_frommonth").blur(function(event) {
        $(this).val(pad($(this).val(), 2));
    });
    $("#viewlist_todate").blur(function(event) {
        $(this).val(pad($(this).val(), 2));
    });
    $("#viewlist_tomonth").blur(function(event) {
        $(this).val(pad($(this).val(), 2));
    });

    $("#viewlist_fromyear").blur(function(event) {
        $(this).val(yearpad($(this).val(), 4));
    });

    $("#viewlist_toyear").blur(function(event) {
        $(this).val(yearpad($(this).val(), 4));
    });
    // navigation functions for enter key and up arrow keys.
    $("#invoicetypeselect").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#viewlist_fromdate").focus().select();
        }
    });
    $("#viewlist_fromdate").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#viewlist_frommonth").focus().select();
        }
        if (e.which == 38) {
            $("#invoicetypeselect").focus();
        }
    });
    $("#viewlist_frommonth").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#viewlist_fromyear").focus().select();
        }
        if (e.which == 38) {
            $("#viewlist_fromdate").focus().select();
        }
    });
    $("#viewlist_fromyear").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#viewlist_todate").focus().select();
        }
        if (e.which == 38) {
            $("#viewlist_frommonth").focus().select();
        }
    });
    $("#viewlist_todate").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#viewlist_tomonth").focus().select();
        }
        if (e.which == 38) {
            $("#viewlist_fromyear").focus();
        }
    });
    $("#viewlist_tomonth").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#viewlist_toyear").focus().select();
        }
        if (e.which == 38) {
            $("#viewlist_todate").focus().select();
        }
    });
    $("#viewlist_toyear").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#viewlist_submit").focus();
        }
        if (e.which == 38) {
            $("#viewlist_tomonth").focus().select();
        }
    });
    $("#viewlist_submit").click(function(event) {
        // --------------------starting validations------------------
        if ($("#viewlist_fromdate").val() == 0) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_fromdate').focus().select();
            return false;
        }
        if ($("#viewlist_frommonth").val() == 0) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_frommonth').focus().select();
            return false;
        }
        if ($("#viewlist_fromyear").val() == 0) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_fromyear').focus().select();
            return false;
        }
        if ($("#viewlist_todate").val() == 0) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_todate').focus().select();
            return false;
        }
        if ($("#viewlist_tomonth").val() == 0) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_tomonth').focus().select();
            return false;
        }
        if ($("#viewlist_toyear").val() == 0) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_toyear').focus().select();
            return false;
        }
        var todate = $("#viewlist_toyear").val() + $("#viewlist_tomonth").val() + $("#viewlist_todate").val();
        var fromdate = $("#viewlist_fromyear").val() + $("#viewlist_frommonth").val() + $("#viewlist_fromdate").val();
        if (!Date.parseExact(fromdate, "yyyyMMdd")) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_fromdate').focus().select();
            return false;
        }
        if (!Date.parseExact(fromdate, "yyyyMMdd").between(financialstart, financialend)) {
            $("#between-date-alert").alert();
            $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#between-date-alert").hide();
            });
            $('#viewlist_fromdate').focus().select();
            return false;
        }
        if (!Date.parseExact(todate, "yyyyMMdd")) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#date-alert").hide();
            });
            $('#viewlist_todate').focus().select();
            return false;
        }
        if (!Date.parseExact(todate, "yyyyMMdd").between(financialstart, financialend)) {
            $("#between-date-alert").alert();
            $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#between-date-alert").hide();
            });
            $('#viewlist_todate').focus().select();
            return false;
        }
        if (Date.parseExact(fromdate, "yyyyMMdd").compareTo(Date.parseExact(todate, "yyyyMMdd")) == 1) {
            $("#compare-date-alert").alert();
            $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function() {
                $("#compare-date-alert").hide();
            });
            $('#viewlist_todate').focus().select();
            return false;
        }
        // -----------------------end of validations---------------------

        // creating dataset for retrieving report from the server.
        var dataset = {};
        dataset = {
            "flag": $("#invoicetypeselect option:selected").val(),
            "fromdate": $("#viewlist_fromyear").val() + "-" + $("#viewlist_frommonth").val() + "-" + $("#viewlist_fromdate").val(),
            "todate": $("#viewlist_toyear").val() + "-" + $("#viewlist_tomonth").val() + "-" + $("#viewlist_todate").val()
        };
        $("#msspinmodal").modal("show");
        $.ajax({
                type: "POST",
                url: "/invoice?action=showlist",
                global: false,
                async: false,
                datatype: "text/html",
                data: dataset,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
            })
            .done(function(resp) {
                $("#info").html(resp);
            });
    });

    $("#viewlist_reset").click(function(event) {
        $("#listofinvoices").click();
    });
    $("#vouchertransaction").click(function(e){
        e.preventDefault();
        
    });
    $(document).off("click", "#vouchertransaction").on("click", "#vouchertransaction", function(event) {
        event.preventDefault();
        $('#vch_confirmdel').modal('show');

        // $('.modal-backdrop').remove();
        // $('.modal').modal('hide');
        // $('#m_confirmdel').modal('show').on('click', '#goddel', function(e) {
        //     $.ajax({
        //         type: "POST",
        //         url: "/budget?type=delete",
        //         global: false,
        //         async: false,
        //         datatype: "json",
        //         data: {"budid": $("#budgetlist option:selected").val(),"budname":$("#bname").val()},
        //         beforeSend: function(xhr) {
        //             xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        //         },
        //         success: function(resp) {
        //             if (resp["gkstatus"] == 0) {
        //                 $('.modal-backdrop').remove();
        //                 $("#delete-alert").alert();
        //                 $("#delete-alert").fadeTo(2250, 500).slideUp(500, function() {
        //                     $("#delete-alert").hide();
        //                     $("a[href ='#budget_edit']").click();
        //                 });
        //             }
        //         }
        //     });
        // });
        // $("#goddel").keydown(function(e){
        //     if (e.which==37 || e.which==38)
        //     {
        //     e.preventDefault();
        //     $("#m_cancel").focus();
        //     }
        // });
        // $("#m_cancel").keydown(function(e){
        //     if (e.which==39)
        //     {
        //     e.preventDefault();
        //     $("#goddel").focus();
        //     }
        // });
        // $('#m_confirmdel').on('shown.bs.modal', function(event) {
        //     $("#m_cancel").focus();
        // });
        // $('#m_confirmdel').on('hidden.bs.modal', function(event) {
        //     $("#editgoddet").focus();
        // });
    });
});
