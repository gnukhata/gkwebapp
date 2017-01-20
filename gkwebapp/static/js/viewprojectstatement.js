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
  if ($('#viewprjstate_prjname').length) {
    $("#viewprjstate_todate").focus();
  }
  else {
    $("#failure-alert1").alert();
    $("#failure-alert1").fadeTo(2250, 500)
    $("#viewprjstate_reset").prop('disabled', true);
    $("#viewprjstate_submit").prop('disabled',true);
  }
  $('.modal-backdrop').remove();
  $("#viewprjstate_todate").focus();
  $('.viewprjstate_date').autotab('number');
  var sel1 = 0;
  $("#viewprjstate_prjname").focus(function(){
    sel1 = 1;
  });
  $("#viewprjstate_prjname").blur(function(){
    sel1 = 0;
  });
  if (sessionStorage.orgt=="Profit Making") {
    $("#prjhead").html("Cost Center");
    $("#prjalert").html("Please select a cost center");
    $("#prjnamelbl").html("Cost Center: ");
    $("#failure-alert1").html("No cost center Found");
  }
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

  $("#viewprjstate_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewprjstate_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewprjstate_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewprjstate_fromdate").val(fromdatearray[2])
  $("#viewprjstate_frommonth").val(fromdatearray[1])
  $("#viewprjstate_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewprjstate_todate").val(todatearray[2])
  $("#viewprjstate_tomonth").val(todatearray[1])
  $("#viewprjstate_toyear").val(todatearray[0])
  $("#viewprjstate_todate").select();
  $('input:text:enabled,select:enabled').keydown( function(e) {
    var n = $("input:text:enabled,select:enabled").length;
    var f = $('input:text:enabled,select:enabled');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }
      var s1 = $("#viewprjstate_prjname option:selected").index();
      if ((e.which == 38 && sel1 == 1 && s1 == 0) ||(e.which == 38 && sel1 == 1 && s1 == 1) || (e.which == 38 && sel1 == 0))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
        }
      }
    });
  $("#viewprjstate_prjname").keydown(function(event) {
    if (event.which==13) {
      $("#viewprjstate_submit").click();
    }
  });

  $("#viewprjstate_submit").click(function(event) {
    if ($("#viewprjstate_prjname").val()==null) {
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      $('#viewprjstate_prjname').focus()
      return false;
    }

    if ($("#viewprjstate_toyear").val() ==0||$("#viewprjstate_tomonth").val()==0||$("#viewprjstate_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewprjstate_todate').focus().select();
      return false;
    }
    var todate = $("#viewprjstate_toyear").val()+$("#viewprjstate_tomonth").val()+$("#viewprjstate_todate").val();
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewprjstate_todate').focus().select();
      return false;
    }

    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewprjstate_todate').focus().select();
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showprojectstatementreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"calculateto":$("#viewprjstate_toyear").val()+"-"+$("#viewprjstate_tomonth").val()+"-"+$("#viewprjstate_todate").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#viewprjstate_prjname").val(),"projectname":$("#viewprjstate_prjname option:selected").text()},
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

  $("#viewprjstate_reset").click(function(event) {
    $("#showprjstate").click();
  });
  });
