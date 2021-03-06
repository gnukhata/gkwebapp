$/*
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
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>


*/
// This script is for base page of invoice.
$(document).ready(function() {
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
    sessionStorage.wholedate = wholedate;

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
      $(".tab-content").show();
      $("#backbutton").show();
      $("#list_backbutton").hide();
      $("#invload, #printload").empty();
      $("#viewinvdiv").hide();
      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
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
	  $(".tab-content").show();
	  $("#invload, #printload").empty();
	  $("#viewinvdiv").hide();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	}
      }
    );
  });
  $("#invoice_view_sale").click(function(event) {// calls view invoice page.
    sessionStorage.salepurchase = 15;
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
	  $(".tab-content").show();

	  $("#backbutton").show();
	  $("#list_backbutton").hide();
	  $("#invload, #printload").empty();
	  $("#viewinvdiv").hide();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	  return false;
    }
    }
    );
  });
    $("#invoice_view_purchase").click(function(event) {// calls view invoice page.
        sessionStorage.salepurchase = 9;
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
      $(".tab-content").show();
      $("#backbutton").show();
      $("#list_backbutton").hide();
      $("#invload, #printload").empty();
      $("#viewinvdiv").hide();
      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      return false;
    }
    }
    );
    });
  $("#invoice_view_list").click(function(event) {// calls view invoice page.
  sessionStorage.onview=1;
    $.ajax({
      type: "POST",
      url: "/invoice?action=invoiceviewlist", 
      global: false,
      async: false,
      data: {"inputdate": wholedate},
      datatype: "text/html",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp){
  $("#invoice_div").html(resp);
  $(".tab-content").show();
      $("#viewanotherlist").hide();
      $("#backbutton").hide();
      $("#list_backbutton").show();
      $("#invload, #printload").empty();
      $("#viewinvdiv").hide();
      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      return false;
  }
    });
  });
    if (sessionStorage.salepurchase == "15") {
        if (sessionStorage.editprint == 1) {
            let invid = $("#info").data("invid");
            $("#invoice_view_sale").click();
            $("#invselect").val(invid);
            sessionStorage.editprint = 0;
            return false;
        }
	$("#invoice_create").click();// loads record purchase invoice page by default.
	return false;
    }
    else if(sessionStorage.salepurchase == 0){  // load list of invoice in tab. Return from print list of invoice.
      $("#invoice_view_list").click();
    }
    else{
	$("#invoice_record").click();// loads create sale invoice page by default.
	return false;
    }
return false;
});
