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
This script is for the view page of register report.
*/
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#msspinmodal").modal("hide");
  $("#viewregister_type").focus();
  $('.viewregister_date').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var todaysdate = new Date();
  var dd = todaysdate.getDate(); //yields day
  var mm = todaysdate.getMonth()+1; //yields month
  var yyyy = todaysdate.getFullYear(); //yields year
	// Setting default date to financialstart and end.
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewregister_fromdate").val(fromdatearray[2])
  $("#viewregister_frommonth").val(fromdatearray[1])
  $("#viewregister_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewregister_todate").val(dd)
  $("#viewregister_tomonth").val(mm)
  $("#viewregister_toyear").val(yyyy)

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

  $("#viewregister_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewregister_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewregister_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewregister_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewregister_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#viewregister_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
$("#viewregister_todate").val(pad($("#viewregister_todate").val(),2));
$("#viewregister_tomonth").val(pad($("#viewregister_tomonth").val(),2));
$("#viewregister_toyear").val(yearpad($("#viewregister_toyear").val(),4));
  // navigation functions for enter key and up arrow keys.
  $("#viewregister_type").keydown(function(e){
    if(e.which==13){
      e.preventDefault();
      if ($("#viewregister_type").val() != null) {
        $("#viewregister_fromdate").focus();
      }
    }
  });
  $("#viewregister_fromdate").keydown(function(e){
    if(e.which==13){
      $("#viewregister_frommonth").focus().select();
    }
    if(e.which==38){
      $("#viewregister_type").focus();
    }
  });
  $("#viewregister_frommonth").keydown(function(e){
    if(e.which==13){
      $("#viewregister_fromyear").focus().select();
    }
    if(e.which==38){
      $("#viewregister_fromdate").focus().select();
    }
  });
  $("#viewregister_fromyear").keydown(function(e){
    if(e.which==13){
      $("#viewregister_todate").focus().select();
    }
    if(e.which==38){
      $("#viewregister_frommonth").focus().select();
    }
  });
  $("#viewregister_todate").keydown(function(e){
    if(e.which==13){
      $("#viewregister_tomonth").focus().select();
    }
    if(e.which==38){
      $("#viewregister_fromyear").focus().select();
    }
  });
  $("#viewregister_tomonth").keydown(function(e){
    if(e.which==13){
      $("#viewregister_toyear").focus().select();
    }
    if(e.which==38){
      $("#viewregister_todate").focus().select();
    }
  });
  $("#viewregister_toyear").keydown(function(e){
    if(e.which==13){
      $('#viewregister_submit').click();
    }
    if(e.which==38){
      $("#viewregister_tomonth").focus().select();
    }
  });
  $("#viewregister_submit").click(function(event) {
  // --------------------starting validations------------------
  if ($("#viewregister_type").val()==null) {
    $("#type-blank-alert").alert();
    $("#type-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#type-blank-alert").hide();
    });
    $('#viewregister_type').focus()
    return false;
  }
  if ($("#viewregister_fromyear").val()==0 ||$("#viewregister_frommonth").val()==0 ||$("#viewregister_fromdate").val()==0 ) {
    $("#date-alert").alert();
    $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#date-alert").hide();
    });
    $('#viewregister_fromdate').focus().select();
    return false;
  }
  if ($("#viewregister_toyear").val() ==0||$("#viewregister_tomonth").val()==0||$("#viewregister_todate").val()==0) {
    $("#date-alert").alert();
    $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#date-alert").hide();
    });
    $('#viewregister_todate').focus().select();
    return false;
  }
  var todate = $("#viewregister_toyear").val()+$("#viewregister_tomonth").val()+$("#viewregister_todate").val();
  var fromdate = $("#viewregister_fromyear").val()+$("#viewregister_frommonth").val()+$("#viewregister_fromdate").val();
  if(!Date.parseExact(fromdate,"yyyyMMdd")){
    $("#date-alert").alert();
    $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#date-alert").hide();
    });
    $('#viewregister_fromdate').focus().select();
    return false;
  }
  if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,todaysdate)) {
    $("#between-date-alert").alert();
    $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#between-date-alert").hide();
    });
    $('#viewregister_fromdate').focus().select();
    return false;
  }
  if(!Date.parseExact(todate, "yyyyMMdd")){
    $("#date-alert").alert();
    $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#date-alert").hide();
    });
    $('#viewregister_todate').focus().select();
    return false;
  }
  if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,todaysdate)) {
    $("#between-date-alert").alert();
    $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#between-date-alert").hide();
    });
    $('#viewregister_todate').focus().select();
    return false;
  }
  if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
    $("#compare-date-alert").alert();
    $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#compare-date-alert").hide();
    });
    $('#viewregister_todate').focus().select();
    return false;
  }
  // -----------------------end of validations---------------------
  $("#msspinmodal").modal("show");
  $.ajax(
    {
      type: "POST",
      url: "/invoice?action=showregisterreport",
      global: false,
      async: false,
      datatype: "text/html",
      data: {"flag":$("#viewregister_type option:selected").val(), "calculatefrom":$("#viewregister_fromdate").val()+"-"+$("#viewregister_frommonth").val()+"-"+$("#viewregister_fromyear").val(),"calculateto":$("#viewregister_todate").val()+"-"+$("#viewregister_tomonth").val()+"-"+$("#viewregister_toyear").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    })
    .done(function(resp)
    {
      //$("#msspinmodal").modal("hide");
      $("#info").html(resp);
    });
  });
  $("#viewregister_reset").click(function(event) {
      $("#showviewregister").click();
  });
});
