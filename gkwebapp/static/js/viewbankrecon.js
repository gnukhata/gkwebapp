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
  $("#viewbankrecon_accname").focus();
  $('.viewbankrecon_date').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewbankrecon_fromdate").val(fromdatearray[2])
  $("#viewbankrecon_frommonth").val(fromdatearray[1])
  $("#viewbankrecon_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewbankrecon_todate").val(todatearray[2])
  $("#viewbankrecon_tomonth").val(todatearray[1])
  $("#viewbankrecon_toyear").val(todatearray[0])

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
      if (e.which == 38 )
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
        }
      }
    });
  $("#viewbankrecon_nar").keydown(function(event) {
    if (event.which==13) {
      $("#viewbankrecon_submit").click();
    }
  });


  $("#viewbankrecon_submit").click(function(event) {
    if ($("#viewbankrecon_accname").val()==null) {
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      $('#viewbankrecon_accname').focus()
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
    $.ajax(
      {
        type: "POST",
        url: "/showunclearedbankrecon",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"accountcode":$("#viewbankrecon_accname").val(),"accountname":$("#viewbankrecon_accname option:selected").text(),"calculatefrom":$("#viewbankrecon_fromyear").val()+"-"+$("#viewbankrecon_frommonth").val()+"-"+$("#viewbankrecon_fromdate").val(),"calculateto":$("#viewbankrecon_toyear").val()+"-"+$("#viewbankrecon_tomonth").val()+"-"+$("#viewbankrecon_todate").val(),"narrationflag":$("#viewbankrecon_nar").is(":checked")},
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
