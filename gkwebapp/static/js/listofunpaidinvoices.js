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
"Abhijith Balan" <abhijith@dff.org.in>
*/
// This script is for list of unpaid invoices report.
$(document).ready(function() {
    //Hides spinner and removes modal backdrop and loading message.
    $("#msspinmodal").modal("hide");
    $(".modal-backdrop").remove();
    $(".fixed-table-loading").remove();
    var currentrow = 0;

    // First row is selected and focus set on it.
    $('#latable tbody tr:first td:eq(1) a').focus();
    $('#latable tbody tr:first').addClass('selected');

    //A row is highlighted when focus shifts to it.
    $(document).off('focus', '.libgname').on('focus', '.libgname', function() {
        $('#latable tr').removeClass('selected');
        $(this).closest('tr').addClass('selected');
    });

    //When a row looses highlight is removed.
    $(document).off('blur', '.libgname').on('blur', '.libgname', function() {
        $('#latable tr').removeClass('selected');

    });

    //Clearing the search fields.
    $('#laclearfields').click(function() {
        $(".search").children(".form-control").val("");
    });

    //Escape key clears search field.
    $(".search").children(".form-control").keyup(function(event) {
        if (event.keyCode == 27) {
            $(this).val("");
            $("#laclearfields").hide();
        } else if ($(this).val() != "") {
            $("#laclearfields").show();
        } else {
            $("#laclearfields").hide();
        }
    });

    //Enter key shifts focus from search to first visible row.
    $(".search").children(".form-control").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').focus();
        }
    });

    var curindex;
    var nextindex;
    var previndex;

    //View Another List button takes user back to view page.
    $('#viewanotherlist').click(function(e) {
        e.preventDefault();
        $("#msspinmodal").modal("show");
        sessionStorage.onview=0;
    $.ajax(
      {

        type: "POST",
        url: "/billwise?action=viewlistofunpaidinvoices",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          $("#info").html(resp);
        }
      }
    );
    });

    //View Printable Version button gives a view that does not have scrolling so that it can be printed or converted to PDF.
    $('#viewprintableversion').click(function(e) {
        $("#msspinmodal").modal("show");
	//Datas Set has data that the view requires.
        var dataset = {
	    "inoutflag": $("#reportinoutselect").val(),
	    "orderflag": $("#reportorderselect").val(),
            "typeflag": $("#reporttypeselect").val(),
            "fromdate": $("#fromdate").data("fromdate"),
            "todate": $("#todate").data("todate")
        };
        $.ajax({
                type: "POST",
                url: "/billwise?action=printlist",
                global: false,
                async: false,
                data: dataset,
                datatype: "text/html",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                $("#info").html(resp);
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });


    //Key Events for each row.
    $(document).off('keydown', '.libgname').on('keydown', '.libgname', function(event) {
        curindex = $(this).closest('tr').index();
        nextindex = curindex + 1;
        previndex = curindex - 1;
	//Down arrow takes to the row below.
        if (event.which == 40) {
            event.preventDefault();
            $('#latable tbody tr:eq(' + nextindex + ') td:eq(1) a').focus();
        }
	//Up arrow takes to the row above.
	else if (event.which == 38) {
            if (previndex > -1) {
                event.preventDefault();
                $('#latable tbody tr:eq(' + previndex + ') td:eq(1) a').focus();
            } else {
                $(".search").children(".form-control").focus().select();
            }
        }

    });


    //Clicking a row selects it.
    $("#latable").off('click', 'tr').on('click', 'tr', function(e) {
        e.preventDefault();
        var id = $(this).attr('value');
        var currindex = $(this).index();
        $('#latable tr').removeClass('selected');
        $(this).toggleClass('selected');
        $('#latable tbody tr:eq(' + currindex + ') a').focus();

    });

    //Enter key triggers click.
    $("#latable").off('keydown', 'tr').on('keydown', 'tr', function(e) {
        var id = $(this).data("invid");
        var currindex = $(this).index();
        if (e.which == 13) {
            e.preventDefault();
            $('#latable tbody tr:eq(' + currindex + ')').dblclick();
        }
    });

    //Double click triggers drilldown. Invoice is shown to the user.
    $("#latable").off('dblclick', 'tr').on('dblclick', 'tr', function(e) {
        // This function opens a modal of the selected voucher.
        // It shows the complete details of the selected voucher along with option to edit, delete and clone.
        currentrow = $(this).index();
        e.preventDefault();
        var id = "";
        id = $(this).data("invid");
        if (id == "") {
            return false;
        }
        $.ajax({

                type: "POST",
                url: "/invoice?action=showinv",
                global: false,
                async: false,
                datatype: "text/html",
                data: {
                    "invid": id
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                $("#invload").html("");
                $("#invload").html(resp);
                $('#listdiv').hide();
        $("#viewinvdiv").show();
        // delete button hide or show depends on deletable data
        if($("#deletable").val() > 0){
            $("#delete").hide();
        }
        else{
            $("#delete").show(); 
        }
            });
    });
    //Back button closes the Invoice view.
    $("#backbutton").click(function(event){
	$("#invload").html("");
	$("#viewinvdiv").hide();
	$('#listdiv').show();
	$('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').focus();
        $('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').closest('tr').addClass('selected');
    });
    //Print button gives the report in spreadsheet format.
    $("#print").click(function(event) {
        event.preventDefault();
        var xhr = new XMLHttpRequest();
        var linvurlstring = '&inoutflag=' + $("#reportinoutselect").val() + '&orderflag=' + $("#reportorderselect").val() + '&typeflag=' + $("#reporttypeselect").val() + '&fromdate=' + $("#fromdate").data("fromdate") + '&todate=' + $("#todate").data("todate");
        xhr.open('GET', '/billwise?type=spreadsheet&fystart=' + sessionStorage.getItem('year1') + '&orgname=' + sessionStorage.getItem('orgn') + '&fyend=' + sessionStorage.getItem('year2') + linvurlstring, true);
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        xhr.responseType = 'blob';

        xhr.onload = function(e) {
            if (this.status == 200) {
                // get binary data as a response
                var blob = this.response;
                let windowURL = window.webkitURL || window.URL;
                var dwelement = document.createElement('a');
                let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                dwelement.download = "OutstandingInvoice.xlsx";
                dwelement.href = windowURL.createObjectURL(blob);
                dwelement.textContent = 'Download Sheet';
                dwelement.dataset.downloadurl = [contentType, dwelement.download, dwelement.href].join(':');
                dwelement.click();
            }
        };
        xhr.send();
    });
    // Print button from the invoice view opens a printable view of the invoice.
    $("#printbutton").click(function(event) {
	var invid = $("#latable tbody tr:eq(" + currentrow + ")").data("invid");
        $.ajax({
                url: '/invoice?action=print',
                type: 'POST',
                dataType: 'html',
            data: {"invid":invid,"pflag":'0'},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                $('#printload').html(resp);
		$("#invload").hide();
		$("#buttondiv").hide();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });
// below function is for delete invoice and reload to previous list
$(document).off("click", "#delete").on("click", "#delete", function(event) {
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#m_confirmdel').modal('show').one('click', '#invcancel', function(e) {
        $.ajax({
            type: "POST",
            url: "/invoice?type=delete",
            global: false,
            async: false,
            datatype: "json",
            data: {
                "invid": $("#invid").val()
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            success: function(resp) {
                dataset = {
                    "inoutflag": $("#reportinoutselect").val(),
                    "orderflag": $("#reportorderselect").val(),
                        "typeflag": $("#reporttypeselect").val(),
                        "fromdate": $("#fromdate").data("fromdate"),
                        "todate": $("#todate").data("todate")
                    };
                // here reload previously selected list page after deleting
                if (resp["gkstatus"] == 0) {
                    $('.modal-backdrop').remove();
                    $('html,body').animate({scrollTop: ($("#viewinvdiv").offset().top)},'fast');
                    $("#delsuccess-alert").alert();
                    $("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#delsuccess-alert").hide();
                        $("#msspinmodal").modal("show");
                        $.ajax({
                                type: "POST",
                                url: "/billwise?action=showlist",
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
            }
                else {
                    $('html,body').animate({scrollTop: ($("#viewinvdiv").offset().top)},'fast');
                    $("#transaction-alert").alert();
                    $("#transaction-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#transaction-alert").hide();
                        $("#msspinmodal").modal("show");
                        $.ajax({
                                type: "POST",
                                url: "/billwise?action=showlist",
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
                } 
            }
        });
    });
});
});
