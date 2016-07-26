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
  $("#pnl_todate").focus();
  $('.pnl_autotab').autotab('number');
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

  $("#pnl_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#pnl_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#pnl_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $('input:text:enabled').keydown( function(e) {
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

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#pnl_fromdate").val(fromdatearray[2])
  $("#pnl_frommonth").val(fromdatearray[1])
  $("#pnl_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#pnl_todate").val(todatearray[2])
  $("#pnl_tomonth").val(todatearray[1])
  $("#pnl_toyear").val(todatearray[0])
  $("#pnl_todate").select();

  $("#pnl_toyear").keydown(function(event) {
    if (event.which==13) {
      $(this).val(yearpad($(this).val(),4));
      $("#pnl_view").click();
    }
  });

  $("#pnl_view").click(function(event) {
    if ($("#pnl_toyear").val() ==0||$("#pnl_tomonth").val()==0||$("#pnl_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#pnl_todate').focus().select();
      return false;
    }
    var todate = $("#pnl_toyear").val()+$("#pnl_tomonth").val()+$("#pnl_todate").val();
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#pnl_todate').focus().select();
      return false;
    }

    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#pnl_todate').focus().select();
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showprofitlossreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":$("#pnl_toyear").val()+"-"+$("#pnl_tomonth").val()+"-"+$("#pnl_todate").val()},
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
  $("#pnl_reset").click(function(event) {
    $("#showprofitloss").click();
  });
});
