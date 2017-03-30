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
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/
/*
This script is for the view page of Cash Flow report.
*/
$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  $("#cashfl_fromdate").focus();
  $('.cashfl_autotab').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  if (sessionStorage.orgt=="Not For Profit") {
    $(".panel-title").html("View Receipt & Payment"+' <i class="fa fa-question-circle pull-right" style="font-size:16px;color:white;"data-toggle="modal" data-target="#CashFModal"></i>');
    
  }

	// Setting default date to financialstart and end.
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#cashfl_fromdate").val(fromdatearray[2])
  $("#cashfl_frommonth").val(fromdatearray[1])
  $("#cashfl_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#cashfl_todate").val(todatearray[2])
  $("#cashfl_tomonth").val(todatearray[1])
  $("#cashfl_toyear").val(todatearray[0])
  $("#cashfl_fromdate").select();



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

  $("#cashfl_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#cashfl_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#cashfl_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#cashfl_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#cashfl_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#cashfl_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  $("#cashfl_toyear").keydown(function(event) {
    if (event.which == 13) {
      $(this).val(yearpad($(this).val(),4));
      $("#cashfl_view").click();
    }
  });
  $('input:text:enabled').keydown( function(e) { // function for shifting focus on enter and up arrow key.
    var n = $("input:text:enabled").length;
    var f = $('input:text:enabled');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }

      if (e.which == 38)
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
        }
      }
    });

  $("#cashfl_view").click(function(event) {
    // --------------------starting validations------------------
    if ($("#cashfl_fromyear").val()==0 ||$("#cashfl_frommonth").val()==0 ||$("#cashfl_fromdate").val()==0 ) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#cashfl_fromdate').focus().select();
      return false;
    }
    if ($("#cashfl_toyear").val() ==0||$("#cashfl_tomonth").val()==0||$("#cashfl_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#cashfl_todate').focus().select();
      return false;
    }
    var todate = $("#cashfl_toyear").val()+$("#cashfl_tomonth").val()+$("#cashfl_todate").val();
    var fromdate = $("#cashfl_fromyear").val()+$("#cashfl_frommonth").val()+$("#cashfl_fromdate").val();
    if(!Date.parseExact(fromdate,"yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#cashfl_fromdate').focus().select();
      return false;
    }
    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#cashfl_fromdate').focus().select();
      return false;
    }
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#cashfl_todate').focus().select();
      return false;
    }
    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      $("#compare-date-alert").alert();
      $("#compare-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#compare-date-alert").hide();
      });
      $('#cashfl_todate').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#cashfl_todate').focus().select();
      return false;
    }
    // -----------------------end of validations---------------------
    $.ajax(
      {
        type: "POST",
        url: "/showcashflowreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":$("#cashfl_toyear").val()+"-"+$("#cashfl_tomonth").val()+"-"+$("#cashfl_todate").val(),"calculatefrom":$("#cashfl_fromyear").val()+"-"+$("#cashfl_frommonth").val()+"-"+$("#cashfl_fromdate").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        }
      })
      .done(function(resp) {
        $("#info").html(resp);
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

  });
  $("#cashfl_reset").click(function(event) {
    $("#showcashflow").click();
  });
});
