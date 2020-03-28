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
  var todaysdate = new Date();
  var dd = todaysdate.getDate(); //yields day
  var mm = todaysdate.getMonth()+1; //yields month
  var yyyy = todaysdate.getFullYear(); //yields year
	// Setting default date to financialstart and end.
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g);
    $("#viewlog_fromdate").val(fromdatearray[2]);
    $("#viewlog_frommonth").val(fromdatearray[1]);
    $("#viewlog_fromyear").val(fromdatearray[0]);
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g);
    $("#viewlog_todate").val(dd);
    $("#viewlog_tomonth").val(mm);
    $("#viewlog_toyear").val(yyyy);

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

  $(".viewlog_username-option").click(function(){
		$("#viewlog_username").data("value", $(this).data("value"));
		$("#viewlog_username").text($(this).text());
    $("#viewlog_username").focus();
  });
  $("#viewlog_username-input").keyup(function(event) {
    let searchtext = $("#viewlog_username-input").val().toLowerCase();
      if (searchtext != "") {
        $(".viewlog_username-option").each(function(index){
    if (index != -1) {
      let rowtext = $(this).text().toLowerCase();
      if (rowtext.indexOf(searchtext) != -1) {
        $(this).parent().show();
        $(this).show();
      }
      else {
        $(this).parent().hide();
        $(this).hide();
      }
    }
        });
      }
      else{
        $(".viewlog_username-option").each(function(index){
    $(this).parent().show();
    $(this).show();
        });
      }
    });
  
    $(document).off('keydown' ,'#viewlog_username-input').on('keydown' ,'#viewlog_username-input',function(event) {
      if (event.which == 13 || event.which == 40){
        event.preventDefault();
        $(".viewlog_username-option").parent().parent().find("a:visible").first().focus();
    }
    });
  
    $(".searchabledropdown").on("shown.bs.dropdown", function () {
    let searchinput = $(this).data("input-id");
      document.getElementById(searchinput).focus();
    });
  

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
$("#viewlog_todate").val(pad($("#viewlog_todate").val(),2));
$("#viewlog_tomonth").val(pad($("#viewlog_tomonth").val(),2));
$("#viewlog_toyear").val(yearpad($("#viewlog_toyear").val(),4));
  // navigation functions for enter key and up arrow keys.

    $("#viewlog_type").keydown(function(e){
      if(e.which==13){
	  if ($("#viewlog_type").val()==null) {
	      $("#type-blank-alert").alert();
	      $("#type-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#type-blank-alert").hide();
	      });
	      $('#viewlog_type').focus();
	      return false;
	  }
	  e.preventDefault();
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
    else if(e.which == 38) {
      $("#viewlog_username").prop("disabled", true);
      e.preventDefault();
      $("#viewlog_type").focus();
      setTimeout(function () {
        $("#viewlog_username").prop("disabled", false);
          }, 0);
  
    }
    else {
      if (!$("#viewlog_username").hasClass("open")){
        $("#viewlog_username").click();
        }
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
  $("#viewlog_submit").click(function(event) {
    // --------------------starting validations------------------
    if ($("#viewlog_type").val()==null) {
      $("#type-blank-alert").alert();
      $("#type-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#type-blank-alert").hide();
      });
	$('#viewlog_type').focus();
      return false;
    }
    if($("#viewlog_type option:selected").val() == 2){
      if ($("#viewlog_username").data('value')==null) {
        $("#user-blank-alert").alert();
        $("#user-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#user-blank-alert").hide();
        });
          $('#viewlog_username').focus();
        return false;
      }
    }
    if ($("#viewlog_fromyear").val()==0 ||$("#viewlog_frommonth").val()==0 ||$("#viewlog_fromdate").val()==0 ) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewlog_fromdate').focus().select();
      return false;
    }
    if ($("#viewlog_toyear").val() ==0||$("#viewlog_tomonth").val()==0||$("#viewlog_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewlog_todate').focus().select();
      return false;
    }
    var todate = $("#viewlog_toyear").val()+$("#viewlog_tomonth").val()+$("#viewlog_todate").val();
    var fromdate = $("#viewlog_fromyear").val()+$("#viewlog_frommonth").val()+$("#viewlog_fromdate").val();



       if(!Date.parseExact(fromdate,"yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewlog_fromdate').focus().select();
      return false;
    }
    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,todaysdate)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewlog_fromdate').focus().select();
      return false;
    }
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewlog_todate').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,todaysdate)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewlog_todate').focus().select();
      return false;
    }
    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      $("#compare-date-alert").alert();
      $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#compare-date-alert").hide();
      });
      $('#viewlog_todate').focus().select();
      return false;
    }
    // -----------------------end of validations---------------------
    $("#msspinmodal").modal("show");
          $.ajax(
      {
        type: "POST",
        url: "/log?action=showlogreport",
        global: false,
        async: false,
        datatype: "text/html",
          data: {"typeflag":$("#viewlog_type option:selected").val(),"userid":$("#viewlog_username").data('value'), "username":$("#viewlog_username").text(), "calculatefrom":$("#viewlog_fromyear").val()+"-"+$("#viewlog_frommonth").val()+"-"+$("#viewlog_fromdate").val(),"calculateto":$("#viewlog_toyear").val()+"-"+$("#viewlog_tomonth").val()+"-"+$("#viewlog_todate").val(), "backflag":0},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          $("#info").html(resp);
        }
      );
  });

  $("#viewlog_reset").click(function(event) {
    $("#msspinmodal").modal();
    $.ajax(
      {

        type: "POST",
        url: "/log?action=showviewlog",
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
});
