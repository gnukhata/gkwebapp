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

  var nstartday = $("#rbtoday").val();
  var nstartmonth = $("#rbtomonth").val();
  var nstartyear = $("#rbtoyear").val();
  var nstartdate = nstartday+nstartmonth+nstartyear;
  var enddate = Date.parseExact(nstartdate, "ddMMyyyy").add({days: 1}).toString("ddMMyyyy");
  var endday = enddate[0]+enddate[1];
  var endmonth = enddate[2]+enddate[3];
  var endyear = enddate[4]+enddate[5]+enddate[6]+enddate[7];
  $("#rbfrom_day").val(endday);
  $("#rbfrom_month").val(endmonth);
  $("#rbfrom_year").val(endyear);
var enddate2 = Date.parseExact(endday+endmonth+endyear, "ddMMyyyy").add({days: -1, years: 1}).toString("ddMMyyyy");
var endday2 = enddate2[0]+enddate2[1];
var endmonth2 = enddate2[2]+enddate2[3];
var endyear2 = enddate2[4]+enddate2[5]+enddate2[6]+enddate2[7];
$("#rbto_day").val(endday2);
$("#rbto_month").val(endmonth2);
$("#rbto_year").val(endyear2);


$("input:enabled:first").focus();

$('input:text,select, input:checkbox').keydown( function(event) {
  var n = $("input:text:visible,select, input:checkbox").length;
  var f = $('input:text:visible,select, input:checkbox');

  if (event.which == 13)
  {


    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      event.preventDefault();
      f[nextIndex].focus();
      f[nextIndex].select();
    }

  }



});

$("#cbtoyear").keydown(function(event) {
  /* Act on the event */
  $("#closebooks").click();
});

$("#rbto_year").keydown(function(event) {
  /* Act on the event */
  $("#rollover").click();
});

$(document).off("click","#closebooks").on("click", "#closebooks", function(event)
{

  event.preventDefault();
  $(".closebooks").attr("disabled",true)
  if ($.trim($("#cbfromday").val())==""||$.trim($("#cbfrommonth").val())==""||$.trim($("#cbfromyear").val())==""||$.trim($("#cbtoday").val())==""||$.trim($("#cbtomonth").val())==""||$.trim($("#cbtoyear").val())=="")
  {
    $("#closebook-blank-alert").alert();
    $("#closebook-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#closebook-blank-alert").hide();
    });
    $("#cbtoday").focus();
    return false;
  }

  $('#m_rollb').modal('show').one('click', '#m_remove', function (e)
  {

  $.ajax({
    url: '/closebooks',
    type: 'POST',
    datatype: 'json',
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(jsonobj) {
    if (jsonobj["gkstatus"]==0) {

      $(".closebooks").remove();
      sessionStorage.booksclosedflag=1;
      sessionStorage.roflag=0;
      $(".dis").attr("disabled", false);
      $("#showclosebooks").click();

    }
    else {
      $("#booksnot-alert").alert();
      $("#booksnot-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#booksnot-alert").hide();
      });

    }
  });

});


});
$(document).off("click","#rollover").on("click", "#rollover", function(event)
{
  if ($.trim($("#rbfrom_day").val())==""||$.trim($("#rbfrom_month").val())==""||$.trim($("#rbfrom_year").val())==""||$.trim($("#rbto_day").val())==""||$.trim($("#rbto_month").val())==""||$.trim($("#rbto_year").val())=="")
  {
    $("#closebook-blank-alert").alert();
    $("#closebook-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#closebook-blank-alert").hide();
    });

    return false;
  }
  $('#m_rollb').modal('show').one('click', '#m_remove', function (e)
  {
    var financialend = $("#rbto_year").val()+"-"+$("#rbto_month").val()+"-"+$("#rbto_day").val()
  $.ajax({
    url: '/rollover',
    type: 'POST',
    datatype: 'json',
    data:{"financialend":financialend},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(jsonobj) {
    if (jsonobj["gkstatus"]==0) {

      window.location.replace("/");

    }
    else {
      $("#booksnot-alert").alert();
      $("#booksnot-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#booksnot-alert").hide();
      });

    }
  });

});

});


$('#m_rollb').on('shown.bs.modal', function(event) {
  $("#m_cancel").focus();
});
});
