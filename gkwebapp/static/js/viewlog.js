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
This script is for the view page of Log report.
*/
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#msspinmodal").modal("hide");
  $("#viewlog_type").focus();
  $('.viewlog_date').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
	// Setting default date to financialstart and end.
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewlog_fromdate").val(fromdatearray[2])
  $("#viewlog_frommonth").val(fromdatearray[1])
  $("#viewlog_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewlog_todate").val(todatearray[2])
  $("#viewlog_tomonth").val(todatearray[1])
  $("#viewlog_toyear").val(todatearray[0])

  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
    }
  }
  function yearpad (str, max) { //to add leading 20 or 200 to year
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

  $("#viewlog_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewlog_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewlog_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewlog_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewlog_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#viewlog_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  // navigation functions for enter key and up arrow keys.
  $("#viewlog_type").keydown(function(e){
    if(e.which==13){
      if ($("#viewlog_type option:selected").val() == 2) {
        $("#viewlog_username").focus();
      }
      else{
        $("#viewlog_fromdate").focus().select();
      }
    }
  });
  $("#viewlog_username").keydown(function(e){
    if(e.which==13){
      $("#viewlog_fromdate").focus().select();
    }
    if(e.which == 38 && (document.getElementById('viewlog_username').selectedIndex==1||document.getElementById('viewlog_username').selectedIndex==0)) {
      e.preventDefault();
      $("#viewlog_type").focus();
    }
  });
  $("#viewlog_fromdate").keydown(function(e){
    if(e.which==13){
      $("#viewlog_frommonth").focus().select();
    }
    if(e.which==38){
      if ($("#viewlog_type option:selected").val() == 2) {
        $("#viewlog_username").focus();
      }
      else{
        $("#viewlog_type").focus();
      }
    }
  });
  $("#viewlog_frommonth").keydown(function(e){
    if(e.which==13){
      $("#viewlog_fromyear").focus().select();
    }
    if(e.which==38){
      $("#viewlog_fromdate").focus().select();
    }
  });
  $("#viewlog_fromyear").keydown(function(e){
    if(e.which==13){
      $("#viewlog_todate").focus().select();
    }
    if(e.which==38){
      $("#viewlog_frommonth").focus().select();
    }
  });
  $("#viewlog_todate").keydown(function(e){
    if(e.which==13){
      $("#viewlog_tomonth").focus().select();
    }
    if(e.which==38){
      $("#viewlog_fromyear").focus().select();
    }
  });
  $("#viewlog_tomonth").keydown(function(e){
    if(e.which==13){
      $("#viewlog_toyear").focus().select();
    }
    if(e.which==38){
      $("#viewlog_todate").focus().select();
    }
  });
  $("#viewlog_toyear").keydown(function(e){
    if(e.which==13){
      $('#viewlog_submit').click();
    }
    if(e.which==38){
      $("#viewlog_tomonth").focus().select();
    }
  });
  $("#viewlog_type").change(function(event) {
    if($("#viewlog_type option:selected").val() == 2){
      $("#viewlog_users").show();
    }
    else{
      $("#viewlog_users").hide();
    }
  });
  
});
