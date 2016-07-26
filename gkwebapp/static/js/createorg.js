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

$(document).ready(function()
{
  $("#orgname").focus();
  var sel1 = 0;
  var sel2 = 0;
  $("#orgcase").focus(function(){
    sel1 = 1;
  });
  $("#orgcase").blur(function(){
    sel1 = 0;
  });
  $("#orgtype").focus(function(){
    sel2 = 1;
  });
  $("#orgtype").blur(function(){
    sel2 = 0;
  });
  var forname = "";
  $("#orgname").focusout(function(){
    forname = $("#orgname").val();
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

  $("#fromday").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#today").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $('.vdate').autotab('number');
  $('input:text,select').keydown( function(e) {
    var n = $("input:text,select").length;
    var f = $('input:text,select');
    if (e.which == 13)
    {

      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }

      }

      var s1 = $("#orgcase option:selected").index();
      var s2 = $("#orgtype option:selected").index();
      if ((e.which == 38 && sel1 == 1 && s1 == 0) || (e.which == 38 && sel2 == 1 && s2 == 0) || (e.which == 38 && (sel1 == 0 && sel2==0)))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
          }
        }
      });


      $("#orgcase").bind("change keyup", function(e){
        var ocase = $("#orgcase option:selected").val();
        var oname = "";
        String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

        if(ocase == "As-Is")
        {
          sessionStorage.setItem('orgn', forname);
          $("#orgname").val(forname);
        }
        if(ocase == "Upper Case")
        {
          oname = forname.toUpperCase();
          $("#orgname").val(oname);
          sessionStorage.setItem('orgn', oname);
        }
        if(ocase == "Lower Case")
        {
          oname = forname.toLowerCase();
          $("#orgname").val(oname);
          sessionStorage.setItem('orgn', oname);
        }
        if(ocase == "Title Case")
        {
          oname = forname.toProperCase();
          $("#orgname").val(oname);
          sessionStorage.setItem('orgn', oname);
        }
      });

      $("#today").focusin(function(event) {
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = $("#fromday").val()+$("#frommonth").val()+$("#fromyear").val();
        if (!Date.parseExact(startdate, "ddMMyyyy")) {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
      });

      $("#fromyear").blur(function(){
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = startday+startmonth+startyear;
        var enddate = Date.parseExact(startdate, "ddMMyyyy").add({days: -1, years: 1}).toString("ddMMyyyy");
        var endday = enddate[0]+enddate[1];
        var endmonth = enddate[2]+enddate[3];
        var endyear = enddate[4]+enddate[5]+enddate[6]+enddate[7];
        $("#today").val(endday);
        $("#tomonth").val(endmonth);
        $("#toyear").val(endyear);
      });
      $("#toyear").keydown(function(event) {
        if (event.which==13) {
          $(this).val(yearpad($(this).val(),4));
          $("#btnsubmit").click();
        }
      });

      $("#btnsubmit").click(function(event){
        event.preventDefault();
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = startday+startmonth+startyear;
        var startday = $("#today").val();
        var startmonth = $("#tomonth").val();
        var startyear = $("#toyear").val();
        var enddate = startday+startmonth+startyear;
        if ($.trim($("#orgname").val())=="") {
          $("#orgname-blank-alert").alert();
          $("#orgname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#orgname-blank-alert").hide();
          });
          $("#orgname").focus();
          return false;
        }
          if ($.trim($("#fromday").val())==""||$.trim($("#frommonth").val())==""||$.trim($("#fromyear").val())==""||$.trim($("#today").val())==""||$.trim($("#tomonth").val())==""||$.trim($("#toyear").val())=="") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#date-blank-alert").hide();
            });
            $("#fromday").focus();
            return false;
        }
        if (!Date.parseExact(startdate, "ddMMyyyy")) {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
        if (!Date.parseExact(enddate, "ddMMyyyy")) {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#today").focus();
          $("#today").select();
          return false;
        }

        if (Date.parseExact(startdate,"ddMMyyyy").compareTo(Date.parseExact(enddate,"ddMMyyyy"))==1) {
          $("#compare-date-alert").alert();
          $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#compare-date-alert").hide();
          });
          $('#today').focus().select();
          return false;
        }

        var orgname = $("#orgname").val().replace(/\s/g, "+");
        var orgtype = $("#orgtype option:selected").val().replace(/\s/g, "+");
        var fdate = $("#fromyear").val()+"-"+$("#frommonth").val()+"-"+$("#fromday").val();
        var tdate = $("#toyear").val()+"-"+$("#tomonth").val()+"-"+$("#today").val();
        var financialyears = fdate+tdate;
        var otype = $("#orgtype option:selected").val();
        var fadate = $("#fromday").val()+"-"+$("#frommonth").val()+"-"+$("#fromyear").val();
        var tadate = $("#today").val()+"-"+$("#tomonth").val()+"-"+$("#toyear").val();
        sessionStorage.setItem('orgt', otype);
        sessionStorage.setItem('year1', fadate);
        sessionStorage.setItem('year2', tadate);
        sessionStorage.setItem('yyyymmddyear1', fdate );
        sessionStorage.setItem('yyyymmddyear2', tdate );
        $.ajax({
          url: '/oexists',
          type: 'POST',
          datatype: 'json',
          data: {orgname:$("#orgname").val(),orgtype:orgtype,finstart:fdate,finend:tdate }
        })
        .done(function(resp) {
          if(resp["gkstatus"]==1)
          {

              $("#orgname-duplicate-alert").alert();
              $("#orgname-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#orgname-duplicate-alert").hide();
              });
              $("#orgname").focus();
              return false;

          }
          else
          {
          $("#createorg").load("/createadmin?orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate );
          }
          console.log("success");
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });



      });
    });
