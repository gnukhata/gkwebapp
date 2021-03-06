/*
   Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
   Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
   "Abhijith Balan" <abhijithb21@openmailbox.org.in>
*/

//This is a script for the template showing list of customers and suppliers for unadjusted amounts module.

//Events that take place as soon as the template is loaded.
$(document).ready(function() {
  //When the page is ready focus must be on the first select field.
    $("#custradio").focus();
    $("#supselectdiv").hide();
    $(document).off('change', '.cussup').on('change', '.cussup', function(event) {
	if ($("#custradio").is(":checked")) {
	    $("#custselectdiv").show();
	    $("#supselectdiv").hide();
	}
	else if ($("#supradio").is(":checked")) {
	    $("#custselectdiv").hide();
	    $("#supselectdiv").show();
	}
    });
    //keydown event for radio buttons to show perticular drop down list.
    $(document).off('keydown', '.cussup').on('keydown', '.cussup', function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#custradio").is(":checked")) {
		$("#customerselect").focus();
	    }
	    else if ($("#supradio").is(":checked")) {
		$("#supplierselect").focus();
	    }
	}
    });
  //Actions that happen after change in the list of customers. This implies a customer or supplier has been selected.

  /*
     The value of the selected option contains custid of a customer. This custid is sent to view for fetching bill details.
     The view returns a jinja template with bill details represented in tabular form. It also returns unadjusted amounts.
   */
  $(document).off('change', '#customerselect').on('change', '#customerselect', function(event) {
      event.preventDefault();
      if ($("#customerselect option:selected").val() != 0) {
    $.ajax(
      {
        type: "POST",
        url: "/billwise?action=showunadjustedamounts",
        global: false,
        async: false,
          data:{"csid":$("#customerselect").val(), "csflag":3},
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
	  $('#supplierselect option[value="0"]').prop("selected", true);  //If a customer is selected then the list of suppliers is reset.
	  $("#cstitle").show();  //Displays a the title of the table.
	  $("#csname").html($("#customerselect option:selected").text());  //Loads customer name into a span to be displayed next to the title.
	    $("#txtareahelp").show();
	    $("#billwisediv").show();
	}
      }
    );
      }
  });

  //Actions that occur when key is pressed down while at list of customers.  
  $(document).off('keydown', '#customerselect').on('keydown', '#customerselect', function(event) {
    if (event.which == 13) {
	event.preventDefault();
	$("#vouchertable tbody tr:first a").focus();
	$("#vouchertable tbody tr:first").addClass("selected");
    }
     else if (event.which == 38) {
	 if ($("#customerselect option:visible").first().is(":selected") || $("#customerselect option").first().is(":selected")) {
	     $("#custradio").focus();
	 }
	 
     }
  });
  //This is similar to the change event of list of customers.
  $(document).off('change', '#supplierselect').on('change', '#supplierselect', function(event) {
      event.preventDefault();
      if ($("#supplierselect option:selected").val() != 0) {
    $.ajax(
      {
        type: "POST",
        url: "/billwise?action=showunadjustedamounts",
        global: false,
        async: false,
          data:{"csid":$("#supplierselect").val(), "csflag": 19},
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
	  $('#customerselect option[value="0"]').prop("selected", true);  //Here list of suppliers is reset when a supplier is selected.
	  $("#cstitle").show();
	  $("#csname").html($("#supplierselect option:selected").text());
	    $("#txtareahelp").show();
	    $("#billwisediv").show();
        }
      }
    );
      }
  });
  //Key events for list of suppliers which is similar to that of list of customers.
  $(document).off('keydown', '#supplierselect').on('keydown', '#supplierselect', function(event) {
    if (event.which == 13) {
	event.preventDefault();
	$("#vouchertable tbody tr:first a").focus();
	$("#vouchertable tbody tr:first").addClass("selected");
    }
     else if (event.which == 38) {
	 if ($("#supplierselect option:visible").first().is(":selected") || $("#supplierselect option").first().is(":selected")) {
	     $("#supradio").focus();
	 }
     } 
  });

     //change event for radio buttons to get first selected option.
    $(document).off('focusin', '.cussup').on('focusin', '.cussup', function(event) {
    $("#customerselect option:first").prop("selected",true);
    $("#customerselect").change();
    $("#supplierselect option:first").prop("selected",true);
	$("#supplierselect").change();
	$("#billwisediv").hide();
	$("#txtareahelp").hide();
	$(".panel-footer").hide();
    });
    //Reset button reloads page
    $("#btreset").click(function(){
	$("#showbillwiseaccounting").click();
    });
});
