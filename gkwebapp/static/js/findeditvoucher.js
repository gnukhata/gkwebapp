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
  $("#searchby").focus();
  $('.vcdate').autotab('number');
  $(".vtp").hide();
  $(".vn").hide();
  $(".amt").hide();
  $(".vdate").hide();
  $(".nar").hide();
  $("#vct").hide();


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


        $("#fday").blur(function(event) {
          $(this).val(pad($(this).val(),2));
        });
        $("#fmonth").blur(function(event) {
          $(this).val(pad($(this).val(),2));
        });

        $("#fyear").blur(function(event) {
          $(this).val(yearpad($(this).val(),4));
        });

      $("#tday").blur(function(event) {
        $(this).val(pad($(this).val(),2));
      });
      $("#tmonth").blur(function(event) {
        $(this).val(pad($(this).val(),2));
      });

      $("#tyear").blur(function(event) {
        $(this).val(yearpad($(this).val(),4));
      });



  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#fday").val(fromdatearray[2])
  $("#fmonth").val(fromdatearray[1])
  $("#fyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#tday").val(todatearray[2])
  $("#tmonth").val(todatearray[1])
  $("#tyear").val(todatearray[0])



  $("#vtype").keyup(function(event)
  {
    if (event.which==13)
    {
      $("#submit").click();
    }
  });


  $("#fday").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#fmonth").focus();
      $("#fmonth").select();
    }
  });

  $("#fmonth").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#fyear").focus();
      $("#fyear").select();
    }
  });

  $("#fyear").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#tday").focus();
      $("#tday").select();
    }
  });

  $("#tday").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#tmonth").focus();
      $("#tmonth").select();
    }
  });

  $("#tmonth").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#tyear").focus();
      $("#tyear").select();
    }
  });


  $("#searchby").bind("change keyup",function(event) {


    var search = $("#searchby option:selected").val();

    if (search=="type")
    {
      $(".vtp").show();

      $(".vn").hide();
      $(".amt").hide();
      $(".vdate").hide();
      $(".nar").hide();

      if (event.which==13)
      {
        $("#vtype").focus();
      }

    }
    else if (search=="vnum")
    {
      $(".vn").show();

      $(".vtp").hide();
      $(".amt").hide();
      $(".vdate").hide();
      $(".nar").hide();

      if (event.which==13)
      {
        $("#vnum").focus();
      }

    }
    else if (search=="amount")
    {
      $(".vn").hide();
      $(".vtp").hide();
      $(".amt").show();

      $(".vdate").hide();
      $(".nar").hide();

      if (event.which==13)
      {
        $("#amount").focus();
      }

    }
    else if (search=="date")
    {
      $(".vn").hide();
      $(".vtp").hide();
      $(".amt").hide();
      $(".vdate").show();

      $(".nar").hide();

      if (event.which==13)
      {
        $("#fday").focus();
        $("#fday").select();
      }

    }

    else if (search=="narration")
    {
      $(".vn").hide();
      $(".vtp").hide();
      $(".amt").hide();
      $(".vdate").hide();
      $(".nar").show();


      if (event.which==13)
      {
        $("#narration").focus();

      }

    }



  });

  $("#narration").keydown(function(event) {
    if (event.which==13)
    {
      event.preventDefault();
      $("#submit").click();
    }
  });


  $("#reset").click(function()
  {
    $('#fevoucher').click();
  }
);


$("#findvoucher").submit(function(event) {

  var search = $("#searchby option:selected").val();
  if (search=="vnum")
  {
    if ($('#vnum').val()=="") {
      $("#vno-alert").alert();
      $("#novn").focus();
      $("#vno-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vno-alert").hide();
      });
      $('#vnum').focus();
      return false;
    }
  }
  else if (search=="amount")
  {
    if ($('#amount').val()=="") {
      $("#vamt-alert").alert();
      $("#noamt").focus();
      $("#vamt-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vamt-alert").hide();
      });
      $('#amount').focus();
      return false;
    }
  }
  else if (search=="date")
  {


    var todate = $("#tyear").val()+$("#tmonth").val()+$("#tday").val();
    var fromdate = $("#fyear").val()+$("#fmonth").val()+$("#fday").val();
    var fstart = Date.parseExact(sessionStorage.yyyymmddyear1,"yyyy-MM-dd");
    var fend = Date.parseExact(sessionStorage.yyyymmddyear2,"yyyy-MM-dd");

    if ($('#fday').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#fday').focus();
      return false;
    }

    if ($('#fmonth').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#fmonth').focus();
      return false;
    }

    if ($('#fyear').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#fyear').focus();
      return false;
    }

    if ($('#tday').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#tday').focus();
      return false;
    }

    if ($('#tmonth').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#tmonth').focus();
      return false;
    }
    if ($('#tyear').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#tyear').focus();
      return false;
    }

    if (!Date.parseExact(todate,"yyyyMMdd"))
    {
      $("#improperdate-alert").alert();
      $("#improperdate-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#improperdate-alert").hide();
      });
      $("#tday").focus();
      $("#tday").select();
      return false;
    };
    if (!Date.parseExact(fromdate,"yyyyMMdd"))
    {
      $("#improperdate-alert").alert();
      $("#improperdate-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#improperdate-alert").hide();
      });
      $("#fday").focus();
      $("#fday").select();
      return false;
    };
    if (!Date.parseExact(todate,"yyyyMMdd").between(fstart,fend))
    {
      $("#betweendate-alert").alert();
      $("#betweendate-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#betweendate-alert").hide();
      });

      $("#tday").focus();
      $("#tday").select();
      return false;

    }

    if (!Date.parseExact(fromdate,"yyyyMMdd").between(fstart,fend))
    {
      $("#betweendate-alert").alert();
      $("#betweendate-alert").fadeTo(2250, 400).slideUp(500, function(){
        $("#betweendate-alert").hide();
      });

      $("#fday").focus();
      $("#fday").select();
      return false;

    }
  }

  else if (search=="narration")
  {
    if ($('#narration').val()=="") {
      $("#vnar-alert").alert();
      $("#nonar").focus();
      $("#vnar-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vnar-alert").hide();
      });
      $('#narration').focus();
      return false;
    }

  }

  $("#vct").show();
  $(".table").empty();

  var search = $("#searchby option:selected").val();

  $.ajax({
    type: "POST",
    url: "/getvouchers",
    data: $("#findvoucher").serialize(),
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
    success: function(resp)
    {
      $("#vct").html(resp);

    }
  });
  event.preventDefault();
});


})
