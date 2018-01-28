$/*
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


*/
// This script is for base page of invoice.
(document).ready(function() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  month += 1;
  var date = today.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if(date < 10) {
    date = "0" + date;
  }
  var wholedate = year + "-" + month + "-" + date;

  $("#invoice_record").click(function() { // calls record invoice page i.e purchase invoice.
    $.ajax(
    {

    type: "POST",
    url: "/invoice?action=showadd&status=in",
    global: false,
    async: false,
    data: {"inputdate": wholedate},
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#invoice_div").html(resp);
    }
    }
  );
  });
  $("#invoice_create").click(function() {// calls create invoice page i.e sales invoice.
    $.ajax(
    {

    type: "POST",
    url: "/invoice?action=showadd&status=out",
    global: false,
    async: false,
    data: {"inputdate": wholedate},
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#invoice_div").html(resp);
    }
    }
  );
  });
  $("#invoice_view_sale").click(function(event) {// calls view invoice page.
    $.ajax(
	{
	    type: "POST",
	    url: "/invoice?action=showeditinv&status=out", 
	    global: false,
	    async: false,
	    data: {"inputdate": wholedate},
	    datatype: "text/html",
	    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
	$("#invoice_div").html(resp);
	return false;
    }
    }
    );
  });
    $("#invoice_view_purchase").click(function(event) {// calls view invoice page.
    $.ajax(
	{
	    type: "POST",
	    url: "/invoice?action=showeditinv&status=in",
	    global: false,
	    async: false,
	    data: {"inputdate": wholedate},
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
	$("#invoice_div").html(resp);
	return false;
    }
    }
    );
    });
    $("#editbutton").click(function(event) {
	$("#buttondiv, #invload").hide();
	var url = "/invoice?action=showeditinv&status=out";
	if ($("#backbutton").attr("inoutflag") == '9') {
	    url = "/invoice?action=showeditinv&status=in";
	}
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	month += 1;
	var date = today.getDate();
	if (month < 10) {
	    month = "0" + month;
	}
	if(date < 10) {
	    date = "0" + date;
	}
	var wholedate = year + "-" + month + "-" + date;
        $.ajax({
	    url: url,
	    type: 'POST',
            dataType: 'html',
	    data: {"invid":$("#editbutton").attr("invid"), "inputdate": wholedate},
            beforeSend: function(xhr) {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                $('#invload').html(resp);
		$('#invload').show();
		$("#invselectdiv").hide();
		$("#invselect").val($("#editbutton").attr("invid")).change();
		$("#invoice_edit").click();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });
    if ($("#invoice").attr("status") == "9") {
	$("#invoice_record").click();// loads record purchase invoice page by default.
    }
    else{
	$("#invoice_create").click();// loads create sale invoice page by default.
	$("#invoice").attr("status", 9);
    }
return false;
});
