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
   "Abhijith Balan" <abhijithb21@openmailbox.org.in>
 */
$(document).ready(function() {
  $("select:first").focus();
  $(document).off('change', '#customerselect').on('change', '#customerselect', function(event) {
    event.preventDefault();
    $.ajax(
      {
        type: "POST",
        url: "/addvoucher?type=showbillwisetable",
        global: false,
        async: false,
        data:{"custid":$("#customerselect").val()},
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
	  sessionStorage.customeramount =  0.00;
          $("#billwisediv").html(resp);
	  $(".panel-footer").show();
	  $('#supplierselect option[value=""]').prop("selected", true);
	  $("#cslisttitle").show();
	  $("#csname").html($("#customerselect option:selected").text());
        }
      }
    );
  });

  $(document).off('keydown', '#customerselect').on('keydown', '#customerselect', function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($(".amountpaid").length > 0) {
	$(".amountpaid:first").focus().select();
      }
      else{
	$(".footerbutton:first").focus();
      }
    }
  });
  
  $(document).off('change', '#supplierselect').on('change', '#supplierselect', function(event) {
    event.preventDefault();
    $.ajax(
      {
        type: "POST",
        url: "/addvoucher?type=showbillwisetable",
        global: false,
        async: false,
        data:{"custid":$("#supplierselect").val()},
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
	  sessionStorage.customeramount =  0.00;
          $("#billwisediv").html(resp);
	  $(".panel-footer").show();
	  $('#customerselect option[value=""]').prop("selected", true);
	  $("#cslisttitle").show();
	  $("#csname").html($("#supplierselect option:selected").text());
        }
      }
    );
  });

  $(document).off('keydown', '#supplierselect').on('keydown', '#supplierselect', function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($(".amountpaid").length > 0) {
	$(".amountpaid:first").focus().select();
      }
      else{
	$(".footerbutton:first").focus();
      }
    }
  });
});
