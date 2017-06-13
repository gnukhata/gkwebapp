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

// This script is for the add addrejectionnote.jinja2


$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.rndate').autotab('number');
  $("#rejectionnote_noteno").focus().select();
  $("#rejectionnote_date").numeric();
  $("#rejectionnote_month").numeric();
  $("#rejectionnote_year").numeric();
  $('.rejectionnote_product_quantity').numeric({ negative: false});
  $('.rejectionnote_product_rejected_quantity').numeric({ negative: false});
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
    }
  }
  function yearpad (str, max) { //to add leading 20 or 200 in the year
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("200" + str, max) : str;
    }
    else if (str.length==2) {
      return str.length < max ? pad("20" + str, max) : str;
    }
    else{
      return str
    }
  }
  $("#rejectionnote_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#rejectionnote_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#rejectionnote_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  // events for shifting focus. Enter shifts to next element and up arrow shifts to previous
  $("#rejectionnote_noteno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_date").focus().select();
    }
  });
  $("#rejectionnote_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#rejectionnote_noteno").focus().select();
    }
  });
  $("#rejectionnote_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#rejectionnote_date").focus().select();
    }
  });
  $("#rejectionnote_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_invoice").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#rejectionnote_month").focus().select();
    }
  });
  $("#rejectionnote_invoice").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#rejectionnote_deliverynote").focus();
    }
    if (event.which==38 && document.getElementById('rejectionnote_invoice').selectedIndex==1) {
      event.preventDefault();
      $('#rejectionnote_year').focus().select();
    }
  });
  $("#rejectionnote_deliverynote").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#rejectionnote_product_table tbody tr:first td:eq(2) input').focus().select();
    }
    if (event.which==38 && document.getElementById('rejectionnote_deliverynote').selectedIndex==1) {
      event.preventDefault();
      $("#rejectionnote_invoice").focus();
    }
  });
});
