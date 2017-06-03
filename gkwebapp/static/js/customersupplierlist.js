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

//This is a script for the template showing list of customers and suppliers for unadjusted amounts module.

//Events that take place as soon as the template is loaded.
$(document).ready(function() {
  //When the page is ready focus must be on the first select field.
  $("select:first").focus();
  //Actions that happen after change in the list of customers. This implies a customer or supplier has been selected.

  /*
     The value of the selected option contains custid of a customer. This custid is sent to view for fetching bill details.
     The view returns a jinja template with bill details represented in tabular form. It also returns unadjusted amounts.
   */
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
          $("#billwisediv").html(resp);  //Here, resp contains jinja template with bill data. It is loaded into a div.
	  $(".panel-footer").show();  //Footer buttons are displayed.
	  $('#supplierselect option[value=""]').prop("selected", true);  //If a customer is selected then the list of suppliers is reset.
	  $("#cslisttitle").show();  //Displays a the title of the table.
	  $("#csname").html($("#customerselect option:selected").text());  //Loads customer name into a span to be displayed next to the title.
        }
      }
    );
  });

  //Actions that occur when key is pressed down while at list of customers.  
  $(document).off('keydown', '#customerselect').on('keydown', '#customerselect', function(event) {
    //When enter key is pressed focus shifts to first of amount paid fields. If no field is visible focus shifts to buttons at the footer.
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
  //This is similar to the change event of list of customers.
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
	  $('#customerselect option[value=""]').prop("selected", true);  //Here list of suppliers is reset when a supplier is selected.
	  $("#cslisttitle").show();
	  $("#csname").html($("#supplierselect option:selected").text());
        }
      }
    );
  });
  //Key events for list of suppliers which is similar to that of list of customers.
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
