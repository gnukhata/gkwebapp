/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/

$(document).ready(function()
{
  var invflag;
  var invsflag;
  var billflag;
  $("#orgname").focus();
  var sel1 = 0;
  var sel2 = 0;
  var sel3 = 0;
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
  $("#finalyears").focus(function(){
    sel3 = 1;
  });
  $("#finalyears").blur(function(){
    sel3 = 0;
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
    var n = $('input:text,select').length;
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
      var s3 = $("#finalyears option:selected").index();
      if ((e.which == 38 && sel1 == 1 && s1 == 0) || (e.which == 38 && sel2 == 1 && s2 == 0) ||(e.which == 38 && sel3 == 1 && s3 == 0) || (e.which == 38 && (sel1 == 0 && sel2==0 && sel3==0)))
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

          $("#orgname").val(forname);
        }
        if(ocase == "Upper Case")
        {
          oname = forname.toUpperCase();
          $("#orgname").val(oname);

        }
        if(ocase == "Lower Case")
        {
          oname = forname.toLowerCase();
          $("#orgname").val(oname);

        }
        if(ocase == "Title Case")
        {
          oname = forname.toProperCase();
          $("#orgname").val(oname);

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
        if (startday==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
        if (startmonth==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#frommonth").focus();
          $("#frommonth").select();
          return false;
        }
        if (startyear==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromyear").focus();
          $("#fromyear").select();
          return false;
        }

        $("#today").val(endday);
        $("#tomonth").val(endmonth);
        $("#toyear").val(endyear);
      });
      $("#toyear").keydown(function(event) {
          if (event.which==13) {
	      event.preventDefault();
          $(this).val(yearpad($(this).val(),4));
          $('#onlyaccradio').focus();
        }
      });

     $(".iib").keydown(function(event) {
          if (event.which==13) {
	      event.preventDefault();
          $('#btnsubmit').focus();
        }
     });

     $("#onlyaccradio").keydown(function(event) {
          if (event.which==38) {
	      event.preventDefault();
          $('#toyear').focus();
        }
     });

    
              $(document).off('change', '.iib').on('change', '.iib', function(event) {
                          if ($("#invinvsbillradio").is(":checked")) {
                          //  event.preventDefault();
                              invflag=1;
                              invsflag=1;
                              billflag=1;
                          }
                          if ($("#invsbillradio").is(":checked")) {
                            //event.preventDefault();
                              invflag=0;
                              invsflag=1;
                            billflag=1;
                            
                          }

                            if ($("#onlyinvsradio").is(":checked")) {
                            //  event.preventDefault();
                                invflag=0;
                                invsflag=1;
                              billflag=0;
                            }

                            if ($("#onlyaccradio").is(":checked")) {
                              //event.preventDefault();
                                invflag=0;
                                invsflag=0;
                              billflag=0;
                            }
                            });

      $("#btnsubmit").click(function(event){
        event.preventDefault();
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = startday+startmonth+startyear;
        var endday = $("#today").val();
        var endmonth = $("#tomonth").val();
        var endyear = $("#toyear").val();
        var enddate = endday+endmonth+endyear;
        if ($.trim($("#orgname").val())=="") {
          $("#orgname-blank-alert").alert();
          $("#orgname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#orgname-blank-alert").hide();
          });
          $("#orgname").focus();
          return false;
        }

        if (startday==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
        if (startmonth==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#frommonth").focus();
          $("#frommonth").select();
          return false;
        }
        if (startyear==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromyear").focus();
          $("#fromyear").select();
          return false;
        }
        if (endday==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#today").focus();
          $("#today").select();
          return false;
        }
        if (endmonth==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#tomonth").focus();
          $("#tomonth").select();
          return false;
        }
        if (endyear==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#toyear").focus();
          $("#toyear").select();
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

        if ($("#invinvsbillradio").is(":checked")) {
            invflag=1;
            invsflag=1;
            billflag=1;
        }
        if ($("#invsbillradio").is(":checked")) {
            invflag=0
            invsflag=1;
          billflag=1;
          console.log("rohini");
        }

          if ($("#onlyinvsradio").is(":checked")) {
              invflag=0;
              invsflag=1;
            billflag=0;
          }
          if ($("#onlyaccradio").is(":checked")) {
              invflag=0;
              invsflag=0;
            billflag=0;
          }

        sessionStorage.setItem('orgn', $("#orgname").val());
        sessionStorage.setItem('orgt', otype);
        sessionStorage.setItem('year1', fadate);
        sessionStorage.setItem('year2', tadate);
        sessionStorage.setItem('yyyymmddyear1', fdate );
        sessionStorage.setItem('yyyymmddyear2', tdate );
        sessionStorage.setItem('invflag', invflag );
        sessionStorage.setItem('invsflag', invsflag );
        sessionStorage.setItem('billflag', billflag );
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
          $("#createorg").load("/createadmin?orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate+"&invflag="+invflag+"&invsflag="+invsflag+"&billflag="+billflag);
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
