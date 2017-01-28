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
"Abhijith Balan" <abhijithb21@openmailbox.org>
*/
/*
This script is for the view page of Ledger report.
*/
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#msspinmodal").modal("hide");
  $("#viewledger_accname").focus();
  $('.viewledger_date').autotab('number');
$("#viewledger_monthly").attr('checked', true);
$(".dis").attr('disabled', true);
if (sessionStorage.orgt=="Profit Making") { // changing headings and messages depending on type of organisation.
  $("#prjnamelbl").html("Cost Center: ");
}
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var sel1 = 0; // flag for focus on combo box
  $("#viewledger_prjname").focus(function(){
    sel1 = 1;
  });
  $("#viewledger_prjname").blur(function(){
    sel1 = 0;
  });

	// Setting default date to financialstart and end.
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewledger_fromdate").val(fromdatearray[2])
  $("#viewledger_frommonth").val(fromdatearray[1])
  $("#viewledger_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewledger_todate").val(todatearray[2])
  $("#viewledger_tomonth").val(todatearray[1])
  $("#viewledger_toyear").val(todatearray[0])

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

  $("#viewledger_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewledger_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewledger_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewledger_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewledger_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#viewledger_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  // navigation functions for enter key and up arrow keys.
  $("#viewledger_fromdate").keydown(function(e){
    if(e.which==13){
      $("#viewledger_frommonth").focus();
    }
    if(e.which==38){
      $("#viewledger_monthly").focus();
    }
  });
  $("#viewledger_frommonth").keydown(function(e){
    if(e.which==13){
      $("#viewledger_fromyear").focus();
    }
    if(e.which==38){
      $("#viewledger_fromdate").focus();
    }
  });
  $("#viewledger_fromyear").keydown(function(e){
    if(e.which==13){
      $("#viewledger_todate").focus();
    }
    if(e.which==38){
      $("#viewledger_frommonth").focus();
    }
  });
  $("#viewledger_todate").keydown(function(e){
    if(e.which==13){
      $("#viewledger_tomonth").focus();
    }
    if(e.which==38){
      $("#viewledger_fromyear").focus();
    }
  });
  $("#viewledger_tomonth").keydown(function(e){
    if(e.which==13){
      $("#viewledger_toyear").focus();
    }
    if(e.which==38){
      $("#viewledger_todate").focus();
    }
  });
  $("#viewledger_toyear").keydown(function(e){
    if(e.which==13){
      $("#viewledger_nar").focus();
    }
    if(e.which==38){
      $("#viewledger_tomonth").focus();
    }
  });

  $("#viewledger_nar").keydown(function(e){
    if(e.which==13){
      if (  $('#viewledger_prjname').val()== undefined) {
      $('#viewledger_submit').click();
      event.preventDefault();
      }
      else {
        $('#viewledger_prjname').focus();
        event.preventDefault();
      }
    }
    if(e.which==38){
      $("#viewledger_toyear").focus();
    event.preventDefault();
    }
  });
  $("#viewledger_prjname").keydown(function(e){
    var s1 = $("#viewledger_prjname option:selected").index();
    if(e.which==38 && s1==0){
      $("#viewledger_nar").focus();
    event.preventDefault();
    }
  });

  // function to toggle Monthly option depending on check box.
    $("#viewledger_monthly").change(function(event) {
      if ($("#viewledger_monthly").is(":checked")) {
        $('.dis').attr('disabled', true);
      }
      else {
        $('.dis').attr('disabled', false);
      }
    });


    $('input:text:enabled,input:checkbox:enabled,select:enabled').keydown( function(e) { // function for shifting focus on enter and up arrow key.
      var n = $("input:text:enabled,input:checkbox:enabled,select:enabled").length;
      var f = $('input:text:enabled,input:checkbox:enabled,select:enabled');
        if (e.which == 13)
        {
          var nextIndex = f.index(this) + 1;
          if(nextIndex < n){
            e.preventDefault();
            f[nextIndex].focus();
            f[nextIndex].select();
          }
        }
        var s1 = $("#viewledger_prjname option:selected").index();
        if (e.which == 38 && sel1 == 1 && s1 == 0 || (e.which == 38 && sel1 == 0))
        {
          var prevIndex = f.index(this) - 1;
          if(prevIndex < n){
            e.preventDefault();
            f[prevIndex].focus();
            f[prevIndex].select();
          }
        }
      });
    $("#viewledger_prjname").keydown(function(event) {
      if (event.which==13) {
        $("#viewledger_submit").click();
      event.preventDefault();
      }
    });

  $("#viewledger_monthly").keydown(function(event) {
    if (event.which==13) {
      if ($("#viewledger_monthly").is(":checked")) {
      $("#viewledger_submit").click();
      event.preventDefault();
    }
    }
  });

  $("#viewledger_submit").click(function(event) {
    // --------------------starting validations------------------
    if ($("#viewledger_accname").val()==null) {
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      $('#viewledger_accname').focus()
      return false;
    }
    if ($("#viewledger_fromyear").val()==0 ||$("#viewledger_frommonth").val()==0 ||$("#viewledger_fromdate").val()==0 ) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewledger_fromdate').focus().select();
      return false;
    }
    if ($("#viewledger_toyear").val() ==0||$("#viewledger_tomonth").val()==0||$("#viewledger_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewledger_todate').focus().select();
      return false;
    }
    var todate = $("#viewledger_toyear").val()+$("#viewledger_tomonth").val()+$("#viewledger_todate").val();
    var fromdate = $("#viewledger_fromyear").val()+$("#viewledger_frommonth").val()+$("#viewledger_fromdate").val();
    if(!Date.parseExact(fromdate,"yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewledger_fromdate').focus().select();
      return false;
    }
    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewledger_fromdate').focus().select();
      return false;
    }
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewledger_todate').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewledger_todate').focus().select();
      return false;
    }
    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      $("#compare-date-alert").alert();
      $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#compare-date-alert").hide();
      });
      $('#viewledger_todate').focus().select();
      return false;
    }
    // -----------------------end of validations---------------------
    $("#msspinmodal").modal("show");

      var prj;
      if ($('#viewledger_prjname').length) {
        prj=$('#viewledger_prjname').val();
      } // returns 1
      else {
      prj ="";
      }

    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":0,"accountcode":$("#viewledger_accname").val(),"calculatefrom":$("#viewledger_fromyear").val()+"-"+$("#viewledger_frommonth").val()+"-"+$("#viewledger_fromdate").val(),"calculateto":$("#viewledger_toyear").val()+"-"+$("#viewledger_tomonth").val()+"-"+$("#viewledger_todate").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":prj,"monthlyflag":$("#viewledger_monthly").is(":checked"),"narrationflag":$("#viewledger_nar").is(":checked")},
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

  $("#viewledger_reset").click(function(event) {
    $("#showviewledger").click();
  });
  });
