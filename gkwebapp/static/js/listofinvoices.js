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

function vouchercall(vtype,inv_id){
    $.ajax(
        {
        type: "POST",
        url: "/showvoucher",
        global: false,
        async: false,
        datatype: "json",
          data : {
            "type":vtype,
            "invflag":sessionStorage.invsflag,
            "financialstart": sessionStorage.yyyymmddyear1,
            "modeflag": sessionStorage.modeflag,
            "invsflag": sessionStorage.invsflag,
            "billflag": sessionStorage.billflag
          },
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        success: function(resp)
        {
            if(sessionStorage.modeflag == 0){
                $("#mod_dialog").css({"width":'90%',"font-size":"90%"});
            }
            else{
                $(".classstyle").css("padding",'-15px');
            }
            $('#voucher_modal').modal('show');
            $('#voucher_modal').on('shown.bs.modal', function (e)
            {
                $("#show_voucher").html(resp);
                if(sessionStorage.modeflag != 0){
                    $("#forinvoice").removeClass("col-md-6");
                    $("#mod_dialog").removeClass("modal-lg");
                    $("#mod_dialog").addClass("modal-md");
                    $("#vdate").focus();

                }
                $("#invsel").val(inv_id).change();
                $('#invsel').prop('disabled', true);
                $("#addcust").hide();
                $("#popup").hide();
                $(".hideatinvoice").hide();

});
        }   
        }
      );
}

$(document).off('click', '.inv_receipt').on('click', '.inv_receipt', function(e) {
    inv_id = $(this).closest("tr").data("invid");
    vouchercall("receipt",inv_id)
  });

$(document).off('click', '.inv_payment').on('click', '.inv_payment', function(e) {
    inv_id = $(this).closest("tr").data("invid");
    vouchercall("payment",inv_id)
  });    
  
    if($("#invoiceviewlistdiv").length==0){
        if($("#latabledel").length > 0){
            $('#latabledel tbody tr:first td:eq(1) a').focus();
        $('#latabledel tbody tr:first').addClass('selected');
        }
        else{
            $('#latable tbody tr:first td:eq(1) a').focus();
    $('#latable tbody tr:first').addClass('selected');
        }
    }

    $(document).off('focus', '.libgname').on('focus', '.libgname', function() {
        if($("#latabledel").length){
            $('#latabledel tr').removeClass('selected');
            $(this).closest('tr').addClass('selected');
        }
        else{
            $('#latable tr').removeClass('selected');
            $(this).closest('tr').addClass('selected');
        }
    });

    $(document).off('blur', '.libgname').on('blur', '.libgname', function() {
        if($("#latabledel").length){
        $('#latabledel tr').removeClass('selected');
        }
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
        if ($("#invoice_view_list").length>0){
            $("#slectedlist").html(resp);    
            }
            else{
                $("#info").html(resp);
            }
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
        sessionStorage.onview=0;
    $.ajax(
      {

        type: "POST",
        url: "/invoice?action=viewlist",
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

    $('#viewanotherdeletedlist').click(function(e) {
        e.preventDefault();
        $("#msspinmodal").modal("show");
        sessionStorage.onview=0;
    $.ajax(
      {

        type: "POST",
        url: "/invoice?action=viewlistdeleted",
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
    $('.cancel_inv').tooltip({
        title : "Clicking this button will cancel this invoice.",
        placement : "bottom"
        });
        $('.inv_payment').tooltip({
        title : "Make Payment",
        placement : "bottom"
        });
        $('.inv_receipt').tooltip({
        title : "Receive Payment",
        placement : "bottom"
        });  
    $("#latable").off('click', '.cancel_inv').on('click', '.cancel_inv', function(e) {
    e.preventDefault();
    inv_id = $(this).closest("tr").data("invid");
    if (inv_id != "") {
	  $('#myModal').modal('hide');
	  $('#confirm_del').modal('show');
      $('#confirm_del').on('shown.bs.modal', function (e)
              {
                $("#m_cancel").focus();

              });
                $(document).off('click', '#invdel1').on('click', '#invdel1', function(e) {
              $.ajax(
                  {
                  type: "POST",
                  url: "/invoice?type=cancelinvoice",
                  global: false,
                  async: false,
                  datatype: "json",
                  data: {"invid":inv_id},
                  beforeSend: function(xhr)
                    {
                      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
                    },
                  success: function(resp)
                  {
                      if(resp["gkstatus"]==0){
                        $('#confirm_del').modal('hide');
                          $('#confirm_del').on('hidden.bs.modal', function (e)
                                {
                                  $("#success-alert1").alert();
                                  $("#success-alert1").fadeTo(2250, 500).slideUp(500, function(){
                                    $("#success-alert1").hide();
                                    var dataset = {
                                      "flag": $("#invoicetypeselect").val(),
                                      "fromdate": $("#fromdate").data("fromdate"),
                                      "todate": $("#todate").data("todate")
                                  };

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
                                      if ($("#invoice_view_list").length>0){
                                      $("#slectedlist").html(resp);    
                                      }
                                      else{$("#info").html(resp);}
                                  })
                                  .fail(function() {
                                      $("#failure-alert1").alert();
                                      $("#failure-alert1").fadeTo(2250, 500).slideUp(500, function(){
                                        $("#failure-alert1").hide();
                                      });
                                    })
                                  });
                                  }); 
                          }
                      else {
                          $("#notran-del-alert1").alert();
                          $("#notran-del-alert1").fadeTo(2250, 500).slideUp(500, function(){
                            $("#notran-del-alert1").hide();
                          });
                        }
                  }
                  });
          });
        }
        else{
            return false
        }
            });

    $('#voucher_modal').on('hidden.bs.modal', function (e){
        var allow = 1;
        if(allow == 1){
        if (!$("#viewinvdiv").is(":visible")){
        var dataset = {
            "flag": $("#invoicetypeselect").val(),
            "fromdate": $("#fromdate").data("fromdate"),
            "todate": $("#todate").data("todate")
        };
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
    })
    .fail(function() {
        $("#failure-alert1").alert();
        $("#failure-alert1").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert1").hide();
        });
      })
    }
    else{
        $("#latable tbody tr:eq(" + sessionStorage.currentrow + ")").dblclick();
    }
    } allow =0;
    });
        

    $('#viewprintableversion').click(function(e) {
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

    $('#viewprintableversioncan').click(function(e) {
        $("#msspinmodal").modal("show");
        var dataset = {
            "flag": $("#invoicetypeselect").val(),
            "fromdate": $("#fromdate").data("fromdate"),
            "todate": $("#todate").data("todate")
        };
        $.ajax({
                type: "POST",
                url: "/invoice?action=printcanceled",
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
        if($("#latable").length){
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
    }
    else{
        if (event.which == 40) {
            event.preventDefault();
            $('#latabledel tbody tr:eq(' + nextindex + ') td:eq(1) a').focus();
        } else if (event.which == 38) {
            if (previndex > -1) {
                event.preventDefault();
                $('#latabledel tbody tr:eq(' + previndex + ') td:eq(1) a').focus();
            } else {
                $(".search").children(".form-control").focus().select();
            }
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

    $("#latabledel").off('click', 'tr').on('click', 'tr', function(e) {
        e.preventDefault();
        var id = $(this).attr('value');
        var currindex = $(this).index();
        $('#latabledel tr').removeClass('selected');
        $(this).toggleClass('selected');
        $('#latabledel tbody tr:eq(' + currindex + ') a').focus();

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

    $("#latabledel").off('keydown', 'tr').on('keydown', 'tr', function(e) {
        var id = $(this).data("invid");
        var currindex = $(this).index();
        if (e.which == 13) {
            e.preventDefault();
            $('#latabledel tbody tr:eq(' + currindex + ')').dblclick();
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
        sessionStorage.currentrow = currentrow
        e.preventDefault();
    	invoice_id = "";
        invoice_id = $(this).data("invid");

        if (invoice_id == "") {
            return false;
        }
	var billentryflag = $("#latable tbody tr:eq(" + currentrow + ")").data("billentryflag");
	var inoutflag = $("#latable tbody tr:eq(" + currentrow + ")").data("inoutflag");
        $.ajax({

                type: "POST",
                url: "/invoice?action=showinv",
                global: false,
                async: false,
                datatype: "text/html",
                data: {
                    "invid": invoice_id,
                    "billentryflag":billentryflag
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


		if (inoutflag == '9') {
		    $("#printbutton").hide();
                }
                else {
                    $("#inv_rec").css("margin-right", "0px");
                }
        $("#viewinvdiv").show();
        $(".borderdiv").height($("#maindivviewinv").height());	

		if ($("#attachmentcount").val() > 0) {
		    $("#viewattachment").show();
		}
		else {
		    $("#viewattachment").hide();
        }
        if ($("#billentrysingleflag").val() !=  0) {
            $("#inv_pay").hide();
            $("#inv_rec").hide();
        }
        else{
            if(inoutflag == 9){
            $("#inv_pay").show();
            $("#inv_rec").hide();

            }
            else{
            $("#inv_rec").show();
            $("#inv_pay").hide();

            }
        }
            });
            $(document).off('click', '#inv_rec').on('click', '#inv_rec', function(e) {
                vouchercall("receipt",invoice_id)
              });
            
            $(document).off('click', '#inv_pay').on('click', '#inv_pay', function(e) {
                vouchercall("payment",invoice_id)
              });  
            
    });

  
    $("#latabledel").off('dblclick', 'tr').on('dblclick', 'tr', function(e) {
        // This function opens a modal of the selected voucher.
        // It shows the complete details of the selected voucher along with option to edit, delete and clone.
        currentrow = $(this).index();
        e.preventDefault();
	invoice_id = "";
        invoice_id = $(this).data("invid");
        if (invoice_id == "") {
            return false;
        }
	var inoutflag = $("#latable tbody tr:eq(" + currentrow + ")").data("inoutflag");
        $.ajax({

                type: "POST",
                url: "/invoice?action=showdeletedinv",
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



		if (inoutflag == '9') {
		    $("#printbutton").hide();
		}
        $("#viewinvdiv").show();
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
  if($("#latable").length){
	$('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').focus();
        $('#latable tbody tr:eq(' + currentrow + ') td:eq(1) a').closest('tr').addClass('selected');
    }
    else{
        $('#latabledel tbody tr:eq(' + currentrow + ') td:eq(1) a').focus();
        $('#latabledel tbody tr:eq(' + currentrow + ') td:eq(1) a').closest('tr').addClass('selected');
    }
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


    $("#printdelete").click(function(event) {
        event.preventDefault();
        var xhr = new XMLHttpRequest();
        var linvurlstring = '&flag=' + $("#invoicetypeselect").val() + '&fromdate=' + $("#fromdate").data("fromdate") + '&todate=' + $("#todate").data("todate");
        xhr.open('GET', '/invoice?action=listofcanceledinvspreadsheet&fystart=' + sessionStorage.getItem('year1') + '&orgname=' + sessionStorage.getItem('orgn') + '&fyend=' + sessionStorage.getItem('year2') + linvurlstring, true);
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
                if ($(".tab-content").is(":visible")) {
                    $(".printnopadding").css({"padding":"0px","margin":"0px","border":"none"});
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
