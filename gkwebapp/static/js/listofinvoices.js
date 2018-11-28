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
// This script is for list of invoices report.
$(document).ready(function() {
    $("#msspinmodal").modal("hide");
    $(".modal-backdrop").remove();
    $(".fixed-table-loading").remove();
    var currentrow = 0;

    if($("#invoiceviewlistdiv").length==0){
        $('#latable tbody tr:first td:eq(1) a').focus();
    $('#latable tbody tr:first').addClass('selected');
    }

    $(document).off('focus', '.libgname').on('focus', '.libgname', function() {
        $('#latable tr').removeClass('selected');
        $(this).closest('tr').addClass('selected');
    });

    $(document).off('blur', '.libgname').on('blur', '.libgname', function() {
        $('#latable tr').removeClass('selected');

    });

    $('#laclearfields').click(function() {
        $(".search").children(".form-control").val("");
    });

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

    $(".search").children(".form-control").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').focus();
        }
    });


    //Toggling the up and down arrow for sorting
    $('.glyphicon').click(function () {
	$(this).toggleClass("glyphicon-chevron-up").toggleClass("glyphicon-chevron-down"); // toggling the up and down
    });

    //click event for sorting date.
    $('.invDate').click(function (e) {
	var orderflag = $("#invoiceDate").attr("orderflag");
	if ( orderflag == 1 ){
	    $(this).find("#invoiceDate").attr("orderflag",4);
	    var dataset = {"flag": $("#invoicetypeselect").val(),"fromdate": $("#fromdate").data("fromdate"),"todate": $("#todate").data("todate")};
	}else{
	    $(this).find("#invoiceDate").attr("orderflag",1);
	    dataset = {"flag": $("#invoicetypeselect").val(),"fromdate": $("#fromdate").data("fromdate"),"todate": $("#todate").data("todate"),"orderflag":4};
	}
	$.ajax({
	    type: "POST",
	    url: "/invoice?action=showlist",
	    global: false,
	    async: false,
	    data: dataset,
	    datatype: "text/html",
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	    },
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
    var curindex;
    var nextindex;
    var previndex;

    $('#viewanotherlist').click(function(e) {
        e.preventDefault();
        $("#msspinmodal").modal("show");
        $("#listofinvoices").click();
    });

    $('#viewprintableversion').click(function(e) {
        $("#msspinmodal").modal("show");
        var dataset = {
            "flag": $("#invoicetypeselect").val(),
            "fromdate": $("#fromdate").data("fromdate"),
            "todate": $("#todate").data("todate")
        };
        $.ajax({
                type: "POST",
                url: "/invoice?action=printlist",
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


    $(document).off('keydown', '.libgname').on('keydown', '.libgname', function(event) {
        curindex = $(this).closest('tr').index();
        nextindex = curindex + 1;
        previndex = curindex - 1;
        if (event.which == 40) {
            event.preventDefault();
            $('#latable tbody tr:eq(' + nextindex + ') td:eq(1) a').focus();
        } else if (event.which == 38) {
            if (previndex > -1) {
                event.preventDefault();
                $('#latable tbody tr:eq(' + previndex + ') td:eq(1) a').focus();
            } else {
                $(".search").children(".form-control").focus().select();
            }
        }

    });


    $("#latable").off('click', 'tr').on('click', 'tr', function(e) {
        e.preventDefault();
        var id = $(this).attr('value');
        var currindex = $(this).index();
        $('#latable tr').removeClass('selected');
        $(this).toggleClass('selected');
        $('#latable tbody tr:eq(' + currindex + ') a').focus();

    });

    $("#latable").off('keydown', 'tr').on('keydown', 'tr', function(e) {
        var id = $(this).data("invid");
        var currindex = $(this).index();
        if (e.which == 13) {
            e.preventDefault();
            $('#latable tbody tr:eq(' + currindex + ')').dblclick();
        }
        if (e.which == 38) {
            e.preventDefault();
            if($("#invoiceviewlistdiv").length!=0){
            $("#invoiceviewlist input:radio:checked").focus();          
          }
        }
    });

    var invoice_id = "";

    $("#latable").off('dblclick', 'tr').on('dblclick', 'tr', function(e) {
        // This function opens a modal of the selected voucher.
        // It shows the complete details of the selected voucher along with option to edit, delete and clone.
        currentrow = $(this).index();
        e.preventDefault();
	invoice_id = "";
        invoice_id = $(this).data("invid");
        if (invoice_id == "") {
            return false;
        }
	var csflag = $("#latable tbody tr:eq(" + currentrow + ")").data("csflag");
        $.ajax({

                type: "POST",
                url: "/invoice?action=showinv",
                global: false,
                async: false,
                datatype: "text/html",
                data: {
                    "invid": invoice_id
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                $("#invload").html("");
                $("#invload").html(resp).show();
                $("#printload").hide();
                $('#listdiv').hide();
                $("#invoiceviewlistdiv").hide();


		if (csflag == '19') {
		    $("#printbutton").hide();
		}
        $("#viewinvdiv").show();
        if($("#deletable").val() > 0){
            $("#delete").hide();
        }
        else{
            $("#delete").show(); 
        }
		if ($("#attachmentcount").val() > 0) {
		    $("#viewattachment").show();
		}
		else {
		    $("#viewattachment").hide();
		}
            });
    });
    $("#viewattachment").click(function(event) {
        $.ajax({
            url: '/invoice?action=getattachment',
            type: 'POST',
            datatype: 'json',
	    data: { "invid": invoice_id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
        }).done(function(resp) {
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
        }).fail(function() {
            console.log("error");
        }).always(function() {
            console.log("complete");
        });	
    });
    $("#list_backbutton").click(function(event){
    $("#invload").html("");
	$("#viewinvdiv").hide();
    $('#listdiv').show();
  $("#invoiceviewlistdiv").show();    
	$('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').focus();
        $('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').closest('tr').addClass('selected');
        if($('#invoiceviewlistdiv').length>0){
            $(".tab-content").show();
        }
    });
    $("#print").click(function(event) {
        event.preventDefault();
        var xhr = new XMLHttpRequest();
        var linvurlstring = '&flag=' + $("#invoicetypeselect").val() + '&fromdate=' + $("#fromdate").data("fromdate") + '&todate=' + $("#todate").data("todate");
        xhr.open('GET', '/invoice?action=listofinvspreadsheet&fystart=' + sessionStorage.getItem('year1') + '&orgname=' + sessionStorage.getItem('orgn') + '&fyend=' + sessionStorage.getItem('year2') + linvurlstring, true);
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        xhr.responseType = 'blob';

        xhr.onload = function(e) {
            if (this.status == 200) {
                // get binary data as a response
                var blob = this.response;
                var url = window.URL.createObjectURL(blob);
                window.location.assign(url);
            }
        };
        xhr.send();
    });
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
                $('#printload').html(resp).show();
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

    $(document).off("click", "#delete").on("click", "#delete", function(event) {
        console.log("asdasdaaadasd")
        event.preventDefault();
		$('.modal-backdrop').remove();
        $('.modal').modal('hide');
        console.log($("#invid").val())
		$('#m_confirmdel').modal('show').one('click', '#invcancel', function(e) {
            console.log("sdaadsadsaa")
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
                        "flag": $("#invoicetypeselect").val() ,
                        "fromdate": $("#fromdate").data("fromdate"),
                        "todate": $("#todate").data("todate")
                    };
					if (resp["gkstatus"] == 0) {
						$('.modal-backdrop').remove();
						$("#delsuccess-alert").alert();
						$("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#delsuccess-alert").hide();
                        });
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
                }
                    else {
						$("#transaction-alert").alert();
						$("#transaction-alert").fadeTo(2250, 500).slideUp(500, function() {
							$("#transaction-alert").hide();
						});

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
						
					} 
	
				}
			});
			
		});
});
});
