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

$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#viewstock_productname").focus();
  $('.viewstock_date').autotab('number');
  $(".dis").attr('disabled', true);

  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var sel1 = 0;
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewstock_fromdate").val(fromdatearray[2])
  $("#viewstock_frommonth").val(fromdatearray[1])
  $("#viewstock_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewstock_todate").val(todatearray[2])
  $("#viewstock_tomonth").val(todatearray[1])
  $("#viewstock_toyear").val(todatearray[0])

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

  $("#viewstock_productname").keydown(function(e){
    if (e.which == 13) {
      e.preventDefault();
      $(".dis").attr('disabled', false);
      $("#viewstock_fromdate").focus();
    }
  });

  $("#viewstock_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewstock_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewstock_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewstock_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewstock_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#viewstock_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  $("#viewstock_fromdate").keydown(function(e){
    if(e.which==13){
      $("#viewstock_frommonth").focus();
    }
    if(e.which==38){
      $("#viewstock_monthly").focus();
    }
  });
  $("#viewstock_frommonth").keydown(function(e){
    if(e.which==13){
      $("#viewstock_fromyear").focus();
    }
    if(e.which==38){
      $("#viewstock_fromdate").focus();
    }
  });
  $("#viewstock_fromyear").keydown(function(e){
    if(e.which==13){
      $("#viewstock_todate").focus();
    }
    if(e.which==38){
      $("#viewstock_frommonth").focus();
    }
  });
  $("#viewstock_todate").keydown(function(e){
    if(e.which==13){
      $("#viewstock_tomonth").focus();
    }
    if(e.which==38){
      $("#viewstock_fromyear").focus();
    }
  });
  $("#viewstock_tomonth").keydown(function(e){
    if(e.which==13){
      $("#viewstock_toyear").focus();
    }
    if(e.which==38){
      $("#viewstock_todate").focus();
    }
  });
  $("#viewstock_toyear").keydown(function(e){
    if(e.which==13){
      $("#viewstock_submit").click();
    }
    if(e.which==38){
      $("#viewstock_tomonth").focus();
    }
  });

  $("#viewstock_submit").click(function(event) {
    if ($("#viewstock_productname").val()==null) {
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      $('#viewstock_productname').focus()
      return false;
    }
    if ($("#viewstock_fromyear").val()==0 ||$("#viewstock_frommonth").val()==0 ||$("#viewstock_fromdate").val()==0 ) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewstock_fromdate').focus().select();
      return false;
    }
    if ($("#viewstock_toyear").val() ==0||$("#viewstock_tomonth").val()==0||$("#viewstock_todate").val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewstock_todate').focus().select();
      return false;
    }
    var todate = $("#viewstock_toyear").val()+$("#viewstock_tomonth").val()+$("#viewstock_todate").val();
    var fromdate = $("#viewstock_fromyear").val()+$("#viewstock_frommonth").val()+$("#viewstock_fromdate").val();
    if(!Date.parseExact(fromdate,"yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewstock_fromdate').focus().select();
      return false;
    }
    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewstock_fromdate').focus().select();
      return false;
    }
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewstock_todate').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewstock_todate').focus().select();
      return false;
    }
    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      $("#compare-date-alert").alert();
      $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#compare-date-alert").hide();
      });
      $('#viewstock_todate').focus().select();
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/product?type=showstockreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"productcode":$("#viewstock_productname").val(),"calculatefrom":$("#viewstock_fromyear").val()+"-"+$("#viewstock_frommonth").val()+"-"+$("#viewstock_fromdate").val(),"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"financialstart":sessionStorage.yyyymmddyear1},
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

  $("#viewstock_reset").click(function(event) {
    $("#showstockreport").click();
  });
  });
