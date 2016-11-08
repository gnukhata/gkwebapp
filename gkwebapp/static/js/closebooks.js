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
"Dinesh Sutar" <dinesh.sutar@openmailbox.org>
*/

$(document).ready(function()
{
  $("#msspinmodal").modal("hide");
  if (sessionStorage.booksclosedflag==1)
  {
    $(".closebooks").hide();
    $(".closebooks").remove();

  }
  else
  {
    $(".closebooks").show();
    $('.dis').attr('disabled', true);
  }

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

  $("#cbtoday").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#cbtomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#rbto_day").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#rbto_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#cbtoyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#rbto_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $('.modal-backdrop').remove();
  $('.crdate').autotab('number');
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#cbfromday").val(fromdatearray[2])
  $("#cbfrommonth").val(fromdatearray[1])
  $("#cbfromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#cbtoday").val(todatearray[2])
  $("#cbtomonth").val(todatearray[1])
  $("#cbtoyear").val(todatearray[0])


  $("#rbfromday").val(fromdatearray[2])
  $("#rbfrommonth").val(fromdatearray[1])
  $("#rbfromyear").val(fromdatearray[0])

  $("#rbtoday").val(todatearray[2])
  $("#rbtomonth").val(todatearray[1])
  $("#rbtoyear").val(todatearray[0])


if(sessionStorage.newfstartday)
{
  $("#rbfrom_day").val(sessionStorage.newfstartday);
  $("#rbfrom_month").val(sessionStorage.newfstartmonth);
  $("#rbfrom_year").val(sessionStorage.newfstartyear);

  $("#rbto_day").val(sessionStorage.newfendday);
  $("#rbto_month").val(sessionStorage.newfendmonth);
  $("#rbto_year").val(sessionStorage.newfendyear);

}
else
{
  var clsdate = $("#rbtoday").val()+$("#rbtomonth").val()+$("#rbtoyear").val();
  var enddate = Date.parseExact(clsdate, "ddMMyyyy").add({days: 1}).toString("ddMMyyyy");
  var endday = enddate[0]+enddate[1];
  var endmonth = enddate[2]+enddate[3];
  var endyear = enddate[4]+enddate[5]+enddate[6]+enddate[7];

  $("#rbfrom_day").val(endday);
  $("#rbfrom_month").val(endmonth);
  $("#rbfrom_year").val(endyear);
  sessionStorage.newfstartday =endday;
  sessionStorage.newfstartmonth = endmonth;
  sessionStorage.newfstartyear= endyear;
  var enddate2 = Date.parseExact(endday+endmonth+endyear, "ddMMyyyy").add({days: -1, years: 1}).toString("ddMMyyyy");
  var endday2 = enddate2[0]+enddate2[1];
  var endmonth2 = enddate2[2]+enddate2[3];
  var endyear2 = enddate2[4]+enddate2[5]+enddate2[6]+enddate2[7];
  $("#rbto_day").val(endday2);
  $("#rbto_month").val(endmonth2);
  $("#rbto_year").val(endyear2);
  sessionStorage.newfendday =endday2;
  sessionStorage.newfendmonth = endmonth2;
  sessionStorage.newfendyear= endyear2;

}



if ($(".closebooks").length) {

  $("input:enabled:first").focus();
  $("input:enabled:first").select();

}
else {
  $("#rbto_day").focus();
  $("#rbto_day").select();
}


$('input:text,select, input:checkbox').keydown( function(event) {
  var n = $("input:text:visible,select, input:checkbox").length;
  var f = $('input:text:visible,select, input:checkbox');

  if (event.which == 13 || event.which == 38)
  {


    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      event.preventDefault();
      f[nextIndex].focus();
      f[nextIndex].select();
    }


  }
  if (event.which == 40)
  {


    var prevIndex = f.index(this) - 1;

      event.preventDefault();
      f[prevIndex].focus();
      f[prevIndex].select();



  }


});
$("#rbfrom_year").blur(function(event) {
  var enddate2 = Date.parseExact($("#rbfrom_day").val()+$("#rbfrom_month").val()+$("#rbfrom_year").val(), "ddMMyyyy").add({days: -1, years: 1}).toString("ddMMyyyy");
  var endday2 = enddate2[0]+enddate2[1];
  var endmonth2 = enddate2[2]+enddate2[3];
  var endyear2 = enddate2[4]+enddate2[5]+enddate2[6]+enddate2[7];
  $("#rbto_day").val(endday2);
  $("#rbto_month").val(endmonth2);
  $("#rbto_year").val(endyear2);
});

$("#cbtoyear").keydown(function(event) {
  /* Act on the event */
  if (event.which==13) {

    $("#closebooks").click();
  }
});

$("#rbto_year").keydown(function(event) {
  /* Act on the event */
  if (event.which==13) {

    $("#rollover").click();
  }
});

$("#closebooks").click(function(event)
{
  $("#cbtoyear").val(yearpad($("#cbtoyear").val(),4));
  var closebooksend = $("#cbtoyear").val()+"-"+$("#cbtomonth").val()+"-"+$("#cbtoday").val();
  var closebooksstart = $("#cbfromyear").val()+"-"+$("#cbfrommonth").val()+"-"+$("#cbfromday").val();


  if ($.trim($("#cbfromday").val())==""||$.trim($("#cbfrommonth").val())==""||$.trim($("#cbfromyear").val())==""||$.trim($("#cbtoday").val())==""||$.trim($("#cbtomonth").val())==""||$.trim($("#cbtoyear").val())=="")
  {
    $("#closebook-blank-alert").alert();
    $("#closebook-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#closebook-blank-alert").hide();
    });
    $("#cbtoday").focus();
    $("#cbtoday").select();
    return false;
  }

  if ($("#cbtoyear").val()==0)
  {
    $("#date-improper-alert").alert();
    $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#date-improper-alert").hide();
    });
    $("#cbtoyear").focus();
    $("#cbtoyear").select();
    return false;
  }
  if ($("#cbtomonth").val()==0)
  {
    $("#date-improper-alert").alert();
    $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#date-improper-alert").hide();
    });
    $("#cbtomonth").focus();
    $("#cbtomonth").select();
    return false;
  }
  if ($("#cbtoday").val()==0)
  {
    $("#date-improper-alert").alert();
    $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#date-improper-alert").hide();
    });
    $("#cbtoday").focus();
    $("#cbtoday").select();
    return false;
  }

  if (!Date.parseExact($("#cbtoday").val()+$("#cbtomonth").val()+$("#cbtoyear").val(), "ddMMyyyy")) {
    $("#date-improper-alert").alert();
    $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#date-improper-alert").hide();
    });
    $("#cbtoday").focus();
    $("#cbtoday").select();
    return false;
  }
  var comparestartdate = Date.parseExact(closebooksstart,"yyyy-MM-dd");
  var compareenddate = Date.parseExact(closebooksend,"yyyy-MM-dd");
  if (comparestartdate.compareTo(compareenddate)==1) {
    $("#compare-date-alert").alert();
    $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#compare-date-alert").hide();
    });
    $('#cbtoday').focus().select();
    return false;
  }
  var clsdate = $("#cbtoday").val()+$("#cbtomonth").val()+$("#cbtoyear").val();
  var enddate = Date.parseExact(clsdate, "ddMMyyyy").add({days: 1}).toString("ddMMyyyy");
  var endday = enddate[0]+enddate[1];
  var endmonth = enddate[2]+enddate[3];
  var endyear = enddate[4]+enddate[5]+enddate[6]+enddate[7];

  $("#rbfrom_day").val(endday);
  $("#rbfrom_month").val(endmonth);
  $("#rbfrom_year").val(endyear);
  sessionStorage.newfstartday =endday;
  sessionStorage.newfstartmonth = endmonth;
  sessionStorage.newfstartyear= endyear;
  var enddate2 = Date.parseExact(endday+endmonth+endyear, "ddMMyyyy").add({days: -1, years: 1}).toString("ddMMyyyy");
  var endday2 = enddate2[0]+enddate2[1];
  var endmonth2 = enddate2[2]+enddate2[3];
  var endyear2 = enddate2[4]+enddate2[5]+enddate2[6]+enddate2[7];
  $("#rbto_day").val(endday2);
  $("#rbto_month").val(endmonth2);
  $("#rbto_year").val(endyear2);
  sessionStorage.newfendday =endday2;
  sessionStorage.newfendmonth = endmonth2;
  sessionStorage.newfendyear= endyear2;
  event.preventDefault();
  $(".closebooks").attr("disabled",true)
  $('.modal-backdrop').remove();
  $('.modal').modal('hide');
  $('#m_rollb').modal('show').one('click', '#m_remove', function (e)
  {
    $('.modal').modal('hide');
    $("#msspinmodal").modal("show");
  $.ajax({
    url: '/closebooks',
    type: 'POST',
    datatype: 'json',
    data:{"financialend": closebooksend},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(jsonobj) {
    if (jsonobj["gkstatus"]==0) {
      $("#success-alert").alert();
      $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#success-alert").hide();
      });
      $(".closebooks").remove();
      sessionStorage.booksclosedflag=1;
      sessionStorage.roflag=0;
      $(".dis").attr("disabled", false);
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');

    }
    else if (jsonobj["gkstatus"]==5)
    {
      $("#transactions-alert").alert();
      $("#transactions-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#transactions-alert").hide();
      });
      $('.modal').modal('hide');
      return false;
    }
    else {
      $("#booksnot-alert").alert();
      $("#booksnot-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#booksnot-alert").hide();
      });
      $('.modal').modal('hide');
      return false;
    }
  });

});
$('#m_rollb').on('hidden.bs.modal', function (e)
{
  $('.modal-backdrop').remove();
  if ($(".closebooks").length) {
    $(".closebooks").attr("disabled",false);

  }
  $("input:enabled:first").focus();
  $("input:enabled:first").select();



});

});
$("#rollover").click(function(event)
{
  $("#rbto_year").val(yearpad($("#rbto_year").val(),4));
  var financialend = $("#rbto_year").val()+"-"+$("#rbto_month").val()+"-"+$("#rbto_day").val();
  var financialstart = $("#rbfrom_year").val()+"-"+$("#rbfrom_month").val()+"-"+$("#rbfrom_day").val();


    if (!Date.parseExact($("#rbfrom_day").val()+$("#rbfrom_month").val()+$("#rbfrom_year").val(), "ddMMyyyy")) {
      $("#date-improper-alert").alert();
      $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-improper-alert").hide();
      });
      $("#rbfrom_day").focus();
      $("#rbfrom_day").select();
      return false;
    }
    if (!Date.parseExact($("#rbto_day").val()+$("#rbto_month").val()+$("#rbto_year").val(), "ddMMyyyy")) {
      $("#date-improper-alert").alert();
      $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-improper-alert").hide();
      });
      $("#rbto_day").focus();
      $("#rbto_day").select();
      return false;
    }
  var rollcomparestart = Date.parseExact(financialstart, "yyyy-MM-dd");
  var rollcompareend = Date.parseExact(financialend, "yyyy-MM-dd");
  if (rollcomparestart.compareTo(rollcompareend)==1) {
    $("#compare-date-alert").alert();
    $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
      $("#compare-date-alert").hide();
    });
    $('#rbto_day').focus().select();
    return false;
  }
  if ($.trim($("#rbfrom_day").val())==""||$.trim($("#rbfrom_month").val())==""||$.trim($("#rbfrom_year").val())==""||$.trim($("#rbto_day").val())==""||$.trim($("#rbto_month").val())==""||$.trim($("#rbto_year").val())=="")
  {
    $("#closebook-blank-alert").alert();
    $("#closebook-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#closebook-blank-alert").hide();
    });

    return false;
  }

  if ($("#rbto_year").val()==0)
  {
    $("#date-improper-alert").alert();
    $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#date-improper-alert").hide();
    });
    $("#rbto_year").focus();
    $("#rbto_year").select();
    return false;
  }
  if ($("#rbto_month").val()==0)
  {
    $("#date-improper-alert").alert();
    $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#date-improper-alert").hide();
    });
    $("#rbto_month").focus();
    $("#rbto_month").select();
    return false;
  }
  if ($("#rbto_day").val()==0)
  {
    $("#date-improper-alert").alert();
    $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#date-improper-alert").hide();
    });
    $("#rbto_day").focus();
    $("#rbto_day").select();
    return false;
  }


  $('.modal-backdrop').remove();
  $('.modal').modal('hide');
  $('#m_rollb').modal('show').one('click', '#m_remove', function (e)
  {
  $.ajax({
    url: '/rollover',
    type: 'POST',
    datatype: 'json',
    data:{"financialend":financialend,"financialstart":financialstart},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(jsonobj) {
    if (jsonobj["gkstatus"]==0) {

      window.location.replace("/");
      return false;
    }
    else {
      $("#rollnot-alert").alert();
      $("#rollnot-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#rollnot-alert").hide();
      });
      $('.modal').modal('hide');
      return false;
    }
  });

});

});

$('.modal-backdrop').remove();
$('.modal').modal('hide');
$('#m_rollb').on('shown.bs.modal', function(event) {
  $("#m_cancel").focus();
});
});
