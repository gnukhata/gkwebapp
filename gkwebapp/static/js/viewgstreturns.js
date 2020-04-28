/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
  Free Software Foundation, Inc.,51 Franklin Street,
  Fifth Floor, Boston, MA 02110, United States


Contributors:
   "Akhil KP" <akhilkpdasan@protonmail>
*/

$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  $("#from_date").focus().select();
  $('.autotab').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");

  // Setting default date to first and last day of month

  var fd = Date.today().clearTime().moveToFirstDayOfMonth();
  var firstday = fd.toString("yyyy-MM-dd");

  var ld = Date.today().clearTime().moveToLastDayOfMonth();
  var lastday = ld.toString("yyyy-MM-dd");

  var fromdatearray = firstday.split(/\s*\-\s*/g);
  $("#from_date").val(fromdatearray[2]);
  $("#from_month").val(fromdatearray[1]);
  $("#from_year").val(fromdatearray[0]);
    
  var todatearray = lastday.split(/\s*\-\s*/g);
  $("#to_date").val(todatearray[2]);
  $("#to_month").val(todatearray[1]);
  $("#to_year").val(todatearray[0]);

  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    } else {
      return str;
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
      return str;
    }
  }

  function raiseAlertById(id) {
    $(id).alert();
    $(id).fadeTo(2250, 400).slideUp(500, function(){
      $(id).hide();
    });
  }

  $("#from_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#from_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#to_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#to_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#from_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#to_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#to_year").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $(this).val(yearpad($(this).val(),4));
      $("#view").focus();
      event.stopPropagation();
    }
  });

  $("#from_date").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#from_month").focus();
    }
     });
     $("#from_month").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#from_year").focus();
    }
  });

  $("#from_year").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#to_date").focus();
    }
   });

   $("#to_date").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#to_month").focus();
    }
     if (event.which == 38) {
       event.preventDefault();
       $("#from_date").focus();
     }
   });

    $("#to_month").keydown(function(event) {
      if (event.which == 13) {
        event.preventDefault();
      $("#to_year").focus();
      }
    });

  $("#to_year").keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#view").focus();
    }
  });

  $("#view").keydown(function(event) {
    if (event.which == 38) {
      event.preventDefault();
      $("#to_date").focus();
    }
  });

  $(document).off('click' ,'#view').on('click' ,'#view', function(event) {
	
    // alert for Date
    if ($("#from_year").val()==0 ||$("#from_month").val()==0 ||$("#from_date").val()==0 ) {
      raiseAlertById("#date-alert");
      $('#from_date').focus().select();
      return false;
    }

    if ($("#to_year").val() ==0||$("#to_month").val()==0||$("#to_date").val()==0) {
      raiseAlertById("#date-alert");
      $('#to_date').focus().select();
      return false;
    }

    var todate = $("#to_year").val()+$("#to_month").val()+$("#to_date").val();
    var fromdate = $("#from_year").val()+$("#from_month").val()+$("#from_date").val();

    if(!Date.parseExact(fromdate,"yyyyMMdd")){
      raiseAlertById("#date-alert");
      $('#from_date').focus().select();
      return false;
    }

    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
      raiseAlertById("#between-date-alert");
      $('#from_date').focus().select();
      return false;
    }

    if(!Date.parseExact(todate, "yyyyMMdd")){
      raiseAlertById("#date-alert");
      $('#to_date').focus().select();
      return false;
    }

    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      raiseAlertById("#compare-date-alert");
      $('#to_date').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      raiseAlertById("#between-date-alert");
      $('#to_date').focus().select();
      return false;
    }
	

    $("#msspinmodal").modal("show");
    $.ajax(
      {
        type: "GET",
        url: "/gstreturns",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"type": $("#type").val(), "end":$("#to_year").val()+"-"+$("#to_month").val()+"-"+$("#to_date").val(),"start":$("#from_year").val()+"-"+$("#from_month").val()+"-"+$("#from_date").val()},
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

  $("#reset").click(function(event) {
    $("#r1").click();
  });
   
});
