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

$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#viewdualledger_accname").focus();
  $('.viewdualledger_date').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var sel1 = 0;
  $("#viewdualledger_prjname").focus(function(){
    sel1 = 1;
  });
  $("#viewdualledger_prjname").blur(function(){
    sel1 = 0;
  });

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewdualledger_fromdate").val(fromdatearray[2])
  $("#viewdualledger_frommonth").val(fromdatearray[1])
  $("#viewdualledger_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewdualledger_todate").val(todatearray[2])
  $("#viewdualledger_tomonth").val(todatearray[1])
  $("#viewdualledger_toyear").val(todatearray[0])

  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
    }
  }
  function yearpad (str, max) {
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

  $("#viewdualledger_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewdualledger_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewdualledger_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewdualledger_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewdualledger_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#viewdualledger_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });


  $('input:text:enabled,input:checkbox:enabled,select:enabled').keydown( function(e) {
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
      var s1 = $("#viewdualledger_prjname option:selected").index();
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
    $("#viewdualledger_nar").keydown(function(e){
      if(e.which==13){
        if (  $('#viewdualledger_prjname').val()== undefined) {
        $('#viewdualledger_submit').click();
        event.preventDefault();
        }
        else {
          $('#viewdualledger_prjname').focus();
          event.preventDefault();
        }
      }
      if(e.which==38){
        $("#viewdualledger_toyear").focus();
      event.preventDefault();
      }
    });
  $("#viewdualledger_prjname").keydown(function(event) {
    if (event.which==13) {
      $("#viewdualledger_submit").click();
    }
  });


  $("#viewdualledger_submit").click(function(event) {
    if ($("#viewdualledger_accname").val()==null) {
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      $('#viewdualledger_accname').focus()
      return false;
    }
    if ($("#viewdualledger_fromyear").val()==0 ||$("#viewdualledger_frommonth").val()==0 ||$("#viewdualledger_fromdate").val()==0 ) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewdualledger_fromdate').focus().select();
      return false;
    }
    if ($("#viewdualledger_toyear").val() ==0||$("#viewdualledger_tomonth").val()==0||$("#viewdualledger_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewdualledger_todate').focus().select();
      return false;
    }
    var todate = $("#viewdualledger_toyear").val()+$("#viewdualledger_tomonth").val()+$("#viewdualledger_todate").val();
    var fromdate = $("#viewdualledger_fromyear").val()+$("#viewdualledger_frommonth").val()+$("#viewdualledger_fromdate").val();
    if(!Date.parseExact(fromdate,"yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewdualledger_fromdate').focus().select();
      return false;
    }
    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewdualledger_fromdate').focus().select();
      return false;
    }
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewdualledger_todate').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewdualledger_todate').focus().select();
      return false;
    }
    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      $("#compare-date-alert").alert();
      $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#compare-date-alert").hide();
      });
      $('#viewdualledger_todate').focus().select();
      return false;
    }
    var prj;
    if ($('#viewdualledger_prjname').length) {
      prj=$('#viewdualledger_prjname').val();
    } // returns 1
    else {
    prj ="";
    }
    $.ajax(
      {
        type: "POST",
        url: "/showdualledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":$("#backflag").val(),"accountcode2":$("#accountcode").val(),"calculatefrom2":$("#calculatefrom").val(),"calculateto2":$("#calculateto").val(),"financialstart":$("#financialstart").val(),"projectcode2":$("#projectcode").val(),"monthlyflag2":"false" ,"narrationflag2":$("#narrationflag").val(),"accountcode1":$("#viewdualledger_accname").val(),"calculatefrom1":$("#viewdualledger_fromyear").val()+"-"+$("#viewdualledger_frommonth").val()+"-"+$("#viewdualledger_fromdate").val(),"calculateto1":$("#viewdualledger_toyear").val()+"-"+$("#viewdualledger_tomonth").val()+"-"+$("#viewdualledger_todate").val(),"projectcode1":prj,"monthlyflag1":"false","narrationflag1":$("#viewdualledger_nar").is(":checked")},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          $(".modal-backdrop").remove();
          $("#info").html(resp);
        }
      );
  });

  $("#viewdualledger_reset").click(function(event) {
    $("#showviewdualledger").click();
  });
  });
