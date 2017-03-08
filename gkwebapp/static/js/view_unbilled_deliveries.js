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
This script is for the view page of unbilled deliveries report.
*/
$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  $("#del_unbilled_date").focus();
  $('.del_unbilled_autotab').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  //alert(financialstart);
  var sel1 = 0; // flag for focus on unbilled delivery type
  var sel2 = 0; // flag for focus on godown name
  $("#del_unbilled_type").focus(function(){
    sel1 = 1;
    //console.log("sel1 = 1");
  });
  $("#del_unbilled_type").blur(function(){
    sel1 = 0;
    //console.log("sel1 = 0");
  });
  $("#godown_name").focus(function(){
    sel2 = 1;
  });
  $("#godown_name").blur(function(){
    sel2 = 0;
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

  $("#del_unbilled_date").blur(function(event) { // padding 0's on blur
    $(this).val(pad($(this).val(),2));
  });
  $("#del_unbilled_month").blur(function(event) { // padding 0's on blur
    $(this).val(pad($(this).val(),2));
  });
  $("#del_unbilled_year").blur(function(event) { // padding 20 or 200 on blur
    $(this).val(yearpad($(this).val(),4));
  });

  $('input:text:enabled,select').keydown( function(event) { // function for shifting focus on enter and up arrow key.
    var n = $("input:text:enabled,select").length;
    //console.log(n);
    var f = $('input:text:enabled,select');
    //console.log(f);
      if (event.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          event.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }
      var s1 = $("#del_unbilled_type option:selected").index();
      var s2 = $("#godown_name option:selected").index();
      if ((event.which == 38 && sel1 == 1 && s1 == 0) || (event.which == 38 && sel2 == 1 && s2 == 0) || (event.which == 38 && (sel1 == 0 && sel2==0)))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          event.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
        }
      }
    });

// Setting default date to financial end.
  today = new Date();
  year = today.getFullYear();
  month = today.getMonth();
  month += 1;
  date = today.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if(date < 10) {
    date = "0" + date;
  }
  wholedate = year + "-" + month + "-" + date;
  reversedate = date + "-" + month + "-" + year;
  var del_unbilled_array = wholedate.split(/\s*\-\s*/g);
  $("#del_unbilled_date").val(del_unbilled_array[2]);
  $("#del_unbilled_month").val(del_unbilled_array[1]);
  $("#del_unbilled_year").val(del_unbilled_array[0]);
  $("#del_unbilled_date").select();

  $("#godown_name").keydown(function(event) {
    if (event.which==13) {
      $("#unbilled_deliveries_view").click();
    }
  });

  $("#unbilled_deliveries_view").click(function(event) {

    // --------------------starting validations------------------
    if ($("#del_unbilled_year").val() ==0||$("#del_unbilled_month").val()==0||$("#del_unbilled_date").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#del_unbilled_date').focus().select();
      return false;
    }
    var inputdate = $("#del_unbilled_year").val()+$("#del_unbilled_month").val()+$("#del_unbilled_date").val();
    var date_input = $("#del_unbilled_date").val()+"-"+$("#del_unbilled_month").val()+"-"+$("#del_unbilled_year").val();
    if(!Date.parseExact(inputdate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#del_unbilled_date').focus().select();
      return false;
    }

    if (!Date.parseExact(inputdate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#del_unbilled_date').focus().select();
      return false;
    }
    date_today = Date.parseExact(wholedate, "yyyy-MM-dd");
    if (!Date.parseExact(inputdate,"yyyyMMdd").between(financialstart, date_today)) {
      $("#financial-date-alert").alert();
      $("#financial-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#financial-date-alert").hide();
      });
      $('#del_unbilled_date').focus().select();
      return false;
    }

    /*if (!Date.parseExact(wholedate,"yyyy-MM-dd").between(financialstart, financialend)) {
      $("#financial-date-alert").alert();
      $("#financial-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#financial-date-alert").hide();
      });
      $('#del_unbilled_date').focus().select();
      return false;
    }

    if (!Date.parseExact(inputdate,"yyyyMMdd").between(financialstart,wholedate)) {
      $("#valid-date-alert").alert();
      $("#valid-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#valid-date-alert").hide();
      });
      $('#del_unbilled_date').focus().select();
      return false;
    }*/
    // -----------------------end of validations---------------------

    // ajax function to get unbilled delivery report for given period.
    $.ajax(
      {
        type: "POST",
        url: "/show_del_unbilled_report",
        global: false,
        async: false,
        data: {"inputdate": date_input},
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        }
      })
      .done(function(resp) {
        $("#info").html(resp);
        //alert("Show_Delivery_Report_Success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

  });
  // reset function.
  $("#unbilled_deliveries_reset").click(function(event) {
    $("#show_unbilled_deliveries").click();
  });
});
