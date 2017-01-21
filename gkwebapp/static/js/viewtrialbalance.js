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
This script is for the view page of trialbalance report.
*/
$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  $("#trialbal_todate").focus();
  $('.trialbal_autotab').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var sel1 = 0; // flag for focus on trialbal type
  $("#trialbal_type").focus(function(){
    sel1 = 1;
  });
  $("#trialbal_type").blur(function(){
    sel1 = 0;
  });
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

  $("#trialbal_todate").blur(function(event) { // padding 0's on blur
    $(this).val(pad($(this).val(),2));
  });
  $("#trialbal_tomonth").blur(function(event) { // padding 0's on blur
    $(this).val(pad($(this).val(),2));
  });
  $("#trialbal_toyear").blur(function(event) { // padding 20 or 200 on blur
    $(this).val(yearpad($(this).val(),4));
  });

  $('input:text:enabled,select').keydown( function(e) { // function for shifting focus on enter and up arrow key.
    var n = $("input:text:enabled,select").length;
    var f = $('input:text:enabled,select');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }
      var s1 = $("#trialbal_type option:selected").index();
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

// Setting default date to financialstart and end.
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#trialbal_fromdate").val(fromdatearray[2])
  $("#trialbal_frommonth").val(fromdatearray[1])
  $("#trialbal_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#trialbal_todate").val(todatearray[2])
  $("#trialbal_tomonth").val(todatearray[1])
  $("#trialbal_toyear").val(todatearray[0])
  $("#trialbal_todate").select();

  $("#trialbal_type").keydown(function(event) {
    if (event.which==13) {
      $("#trialbal_view").click();
    }
  });

  $("#trialbal_view").click(function(event) {

    // --------------------starting validations------------------
    if ($("#trialbal_toyear").val() ==0||$("#trialbal_tomonth").val()==0||$("#trialbal_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#trialbal_todate').focus().select();
      return false;
    }
    var todate = $("#trialbal_toyear").val()+$("#trialbal_tomonth").val()+$("#trialbal_todate").val();
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#trialbal_todate').focus().select();
      return false;
    }

    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#trialbal_todate').focus().select();
      return false;
    }
    // -----------------------end of validations---------------------

    // ajax function to get trail balance report for given period.
    $.ajax(
      {
        type: "POST",
        url: "/showtrialbalancereport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"financialstart":sessionStorage.yyyymmddyear1,"calculateto":$("#trialbal_toyear").val()+"-"+$("#trialbal_tomonth").val()+"-"+$("#trialbal_todate").val(),"trialbalancetype":$("#trialbal_type").val()},
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

  // reset function.
  $("#trialbal_reset").click(function(event) {
    $("#showtrialbalance").click();
  });
});
