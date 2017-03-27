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
This script is for the view page of Ledger report.
*/
$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();

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

  $("#viewbalsht_today").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewbalsht_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewbalsht_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  var sel1 = 0; // flag for focus on combo box
  var s1 ;
  // Changing titles according to org type.
  if (sessionStorage.orgt=="Profit Making")
  {
    $(".panel-title").append(" Balance Sheet");
    $("#baltypelbl").prepend("Balance Sheet ");
    $(".cbl").show();


    $("#viewbalsht_baltype").focus(function(){
      sel1 = 1;
    });
    $("#viewbalsht_baltype").blur(function(){
      sel1 = 0;
    });
  }
  if (sessionStorage.orgt=="Not For Profit")
  {
    $(".panel-title").append(" Statement of Affairs");
    $("#baltypelbl").prepend("Statement of Affairs ");
    $(".csa").show();


    $("#viewsa_baltype").focus(function(){
      sel1 = 1;
    });
    $("#viewsa_baltype").blur(function(){
      sel1 = 0;
    });
  }


  $("#viewbalsht_today").focus(); // set focus on to date on load.
  $('.viewbalsht_date').autotab('number');



// Setting default date to financialstart and end.
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewbalsht_fromday").val(fromdatearray[2])
  $("#viewbalsht_frommonth").val(fromdatearray[1])
  $("#viewbalsht_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewbalsht_today").val(todatearray[2])
  $("#viewbalsht_tomonth").val(todatearray[1])
  $("#viewbalsht_toyear").val(todatearray[0])
  $("#viewbalsht_today").select();
  $('input:text:enabled,select:visible').keydown( function(e) { // function for shifting focus on enter and up arrow key.
    var n = $("input:text:enabled,select:visible").length;
    var f = $('input:text:enabled,select:visible');
    if (e.which == 13)
    {
      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }
    }

    if (sessionStorage.orgt=="Profit Making")
    {
      s1 = $("#viewbalsht_baltype option:selected").index();

    }
    if (sessionStorage.orgt=="Not For Profit")
    {
      s1 = $("#viewsa_baltype option:selected").index();

    }
    if ((e.which == 38 && sel1 == 1 && s1 == 0) || (e.which == 38 && sel1 == 0))
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex < n){
        e.preventDefault();
        f[prevIndex].focus();
        f[prevIndex].select();
      }
    }
  });
  $(".cblsel").keydown(function(event) {
    if (event.which==13) {

      $("#viewbalsht_submit").click();
    }
  });


  $("#viewbalsht_submit").click(function(event) {
    // --------------------starting validations------------------
    if ($("#viewbalsht_toyear").val() ==0||$("#viewbalsht_tomonth").val()==0||$("#viewbalsht_today").val()==0) {
      $("#improperdate-alert").alert();
      $("#improperdate-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#improperdate-alert").hide();
      });
      $('#viewbalsht_today').focus().select();
      return false;
    }
    var todate = $("#viewbalsht_toyear").val()+$("#viewbalsht_tomonth").val()+$("#viewbalsht_today").val();
    var fstart = Date.parseExact(sessionStorage.yyyymmddyear1,"yyyy-MM-dd");
    var fend = Date.parseExact(sessionStorage.yyyymmddyear2,"yyyy-MM-dd");
    if (!Date.parseExact(todate,"yyyyMMdd"))
    {
      $("#improperdate-alert").alert();
      $("#improperdate-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#improperdate-alert").hide();
      });
      $("#viewbalsht_today").focus();
      $("#viewbalsht_today").select();
      return false;
    };
    if (!Date.parseExact(todate,"yyyyMMdd").between(fstart,fend))
    {
      $("#betweendate-alert").alert();
      $("#betweendate-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#betweendate-alert").hide();
      });

      $("#viewbalsht_today").focus();
      $("#viewbalsht_today").select();
      return false;

    }


    var btyp;
    if (sessionStorage.orgt=="Profit Making")
    {
      if ($("#viewbalsht_baltype").val()==null) {
        return false;
      }
      btyp = $("#viewbalsht_baltype").val();
    }
    if (sessionStorage.orgt=="Not For Profit")
    {

      if ($("#viewsa_baltype").val()==null) {
        return false;
      }

      btyp = $("#viewsa_baltype").val();
    }


    if (($("#viewbalsht_viewbalsht_fromday").val()=="" || $("#viewbalsht_frommonth").val()=="" || $("#viewbalsht_fromyear").val()=="" || $("#viewbalsht_today").val()=="" || $("#viewbalsht_tomonth").val()=="" || $("#viewbalsht_toyear").val()=="")) {
      return false;
    }
    // -----------------------end of validations---------------------
    $("#msspinmodal").modal("show");
    $.ajax(
      {
        type: "POST",
        url: "/showbalancesheetreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"balancesheettype":btyp,"calculateto":$("#viewbalsht_toyear").val()+"-"+$("#viewbalsht_tomonth").val()+"-"+$("#viewbalsht_today").val(),"orgtype":sessionStorage.orgt, "flag":0},
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

  $("#viewbalsht_reset").click(function(event) {
    $("#showbalancesheet").click();
  });
});
