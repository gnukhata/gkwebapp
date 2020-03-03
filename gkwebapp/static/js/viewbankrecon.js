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
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/
/*
This script is for the view page of Bank reconciliation..
*/
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#viewbankrecon_accname").focus();
  $(".viewbankrecon_accname-option").click(function(){
		$("#viewbankrecon_accname").data("value", $(this).data("value"));
		$("#viewbankrecon_accname").text($(this).text());
    $("#viewbankrecon_accname").focus();
  });    
  $('.viewbankrecon_date').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  // Setting default date to financialstart and end.
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g);
    $("#viewbankrecon_fromdate").val(fromdatearray[2]);
    $("#viewbankrecon_frommonth").val(fromdatearray[1]);
    $("#viewbankrecon_fromyear").val(fromdatearray[0]);
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g);
    $("#viewbankrecon_todate").val(todatearray[2]);
    $("#viewbankrecon_tomonth").val(todatearray[1]);
    $("#viewbankrecon_toyear").val(todatearray[0]);

  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
	return str;
    }
  }
  function yearpad (str, max) {//to add leading 20 or 200 to year
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("200" + str, max) : str;
    }
    else if (str.length==2) {
      return str.length < max ? pad("20" + str, max) : str;
    }
    else{
	return str;
    }
  }

  $("#viewbankrecon_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewbankrecon_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewbankrecon_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewbankrecon_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewbankrecon_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#viewbankrecon_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });


  $("#viewbankrecon_accname-input").keyup(function(event) {
    let searchtext = $("#viewbankrecon_accname-input").val().toLowerCase();
      if (searchtext != "") {
        $(".viewbankrecon_accname-option").each(function(index){
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
        $(".viewbankrecon_accname-option").each(function(index){
    $(this).parent().show();
    $(this).show();
        });
      }
    });
  
    $(document).off('keydown' ,'#viewbankrecon_accname-input').on('keydown' ,'#viewbankrecon_accname-input',function(event) {
      if (event.which == 13 || event.which == 40){
        event.preventDefault();
        $(".viewbankrecon_accname-option").parent().parent().find("a:visible").first().focus();
    }
    });
  
    $(".searchabledropdown").on("shown.bs.dropdown", function () {
    let searchinput = $(this).data("input-id");
      document.getElementById(searchinput).focus();
    });

  $('#viewbankrecon_accname').keydown( function(e) {

    if (e.which == 13 || e.which == 9)
    {
      if ($("#viewbankrecon_accname").data('value')==null) {
	      $("#account-blank-alert").alert();
	      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#account-blank-alert").hide();
	  	  $('#viewbankrecon_accname').focus();

	      });
	      return false;
	  }
      $("#viewbankrecon_fromdate").focus().select();
    }
    else{
      if (!$("#viewbankrecon_accname").hasClass("open")){
        $("#viewbankrecon_accname").click();
        }
    }
  });

    // navigation functions for enter key and up arrow keys.
    $("#viewbankrecon_fromdate").keydown(function(e){
      if(e.which==13){
        $("#viewbankrecon_frommonth").focus().select();
      }
      if(e.which==38){
        $("#viewbankrecon_accname").focus().select();
      }
    });
    $("#viewbankrecon_frommonth").keydown(function(e){
      if(e.which==13){
        $("#viewbankrecon_fromyear").focus().select();
      }
      if(e.which==38){
        $("#viewbankrecon_fromdate").focus().select();
      }
    });
    $("#viewbankrecon_fromyear").keydown(function(e){
      if(e.which==13){
        $("#viewbankrecon_todate").focus().select();
      }
      if(e.which==38){
        $("#viewbankrecon_frommonth").focus().select();
      }
    });
    $("#viewbankrecon_todate").keydown(function(e){
      if(e.which==13){
        $("#viewbankrecon_tomonth").focus().select();
      }
      if(e.which==38){
        $("#viewbankrecon_fromyear").focus().select();
      }
    });
    $("#viewbankrecon_tomonth").keydown(function(e){
      if(e.which==13){
        $("#viewbankrecon_toyear").focus().select();
      }
      if(e.which==38){
        $("#viewbankrecon_todate").focus().select();
      }
    });
    $("#viewbankrecon_toyear").keydown(function(e){
      if(e.which==13){
        $("#viewbankrecon_nar").focus().select();
      }
      if(e.which==38){
        $("#viewbankrecon_tomonth").focus().select();
      }
    });

  $("#viewbankrecon_nar").keydown(function(event) {
    if (event.which==13) {
	$("#viewbankrecon_submit").focus();
	return false;
    }
    if (event.which==38) {
    $("#viewbankrecon_toyear").focus().select();
    }

  });


  $("#viewbankrecon_submit").click(function(event) {
    // --------------------starting validations------------------
      if ($("#viewbankrecon_accname").data('value')==null) {
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
	$('#viewbankrecon_accname').focus();
      return false;
    }
    if ($("#viewbankrecon_fromyear").val()==0 ||$("#viewbankrecon_frommonth").val()==0 ||$("#viewbankrecon_fromdate").val()==0 ) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewbankrecon_fromdate').focus().select();
      return false;
    }
    if ($("#viewbankrecon_toyear").val() ==0||$("#viewbankrecon_tomonth").val()==0||$("#viewbankrecon_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewbankrecon_todate').focus().select();
      return false;
    }
    var todate = $("#viewbankrecon_toyear").val()+$("#viewbankrecon_tomonth").val()+$("#viewbankrecon_todate").val();
    var fromdate = $("#viewbankrecon_fromyear").val()+$("#viewbankrecon_frommonth").val()+$("#viewbankrecon_fromdate").val();
    if(!Date.parseExact(fromdate,"yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewbankrecon_fromdate').focus().select();
      return false;
    }
    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewbankrecon_fromdate').focus().select();
      return false;
    }
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewbankrecon_todate').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewbankrecon_todate').focus().select();
      return false;
    }
    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      $("#compare-date-alert").alert();
      $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#compare-date-alert").hide();
      });
      $('#viewbankrecon_todate').focus().select();
      return false;
    }
    // -----------------------end of validations---------------------

    // ajax to get Uncleared transactions.
    // Data: accountcode, period and narrationflag
    $.ajax(
      {
        type: "POST",
        url: "/showunclearedbankrecon",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"accountcode":$("#viewbankrecon_accname").data('value'),"accountname":$("#viewbankrecon_accname").text(),"calculatefrom":$("#viewbankrecon_fromyear").val()+"-"+$("#viewbankrecon_frommonth").val()+"-"+$("#viewbankrecon_fromdate").val(),"calculateto":$("#viewbankrecon_toyear").val()+"-"+$("#viewbankrecon_tomonth").val()+"-"+$("#viewbankrecon_todate").val(),"narrationflag":$("#viewbankrecon_nar").is(":checked")},
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

  $("#viewbankrecon_reset").click(function(event) {
    $("#BRS").click();
  });
  });
