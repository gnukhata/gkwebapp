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
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
*/

$(document).ready(function(){

  $(".regdate").autotab('number');
  $(".fcradate").autotab('number');

  $(".regdate").numeric({negative: false});
  $(".fcradate").numeric({negative: false});

  if ($("#orgtype").val()=="Not For Profit")
  {
    $("#orgregno").focus().select();
  }
  else
  {
    $("#orgaddr").focus().select();
  }

  $('input:visible, textarea').keydown(function(event){
    var n =$('input:visible,textarea').length;
    var f= $('input:visible, textarea');
    if (event.which == 13)
    {
      var nextIndex = f.index(this)+1;
      if(nextIndex < n){
        event.preventDefault();
        f[nextIndex].focus().select();
      }
    }
    if(event.which == 38){
      var prevIndex = f.index(this)-1;
      if(prevIndex < n){
        event.preventDefault();
        f[prevIndex].focus().select();
      }
    }
  });

  $("#reset").click(function()
  {
    $("#showeditorg").click();
  });

  $("#editorganisationform").submit(function(event){

    var regdate=""
    var fcraregdate=""
    var regno=""
    var fcrano=""

    if($("#orgtype").val()=="Not For Profit")
    {

      if ($("#regyear").val()!="" || $("#regmonth").val()!="" || $("#regday").val()!="" )
      {
          regdate= $("#regyear").val() + "-" + $("#regmonth").val() + "-" + $("#regday").val();
          regno = $("#orgregno").val();
          if(!Date.parseExact(regdate,"yyyy-MM-dd")){
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
              $("#date-alert").hide();
            });
            $('#regday').focus().select();
            return false;
          }
      }

      if ($("#fcraregyear").val()!="" || $("#fcraregmonth").val()!="" || $("#fcraregday").val()!="" )
      {
        fcraregdate= $("#fcraregyear").val() + "-" + $("#fcraregmonth").val() + "-" + $("#fcraregday").val();
        fcrano = $("#orgfcrano").val();
        if(!Date.parseExact(fcraregdate,"yyyy-MM-dd")){
          $("#date-alert").alert();
          $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
          });
          $('#fcraregday').focus().select();
          return false;
        }
      }
    }

    $.ajax({
      type: 'POST',
      url: '/editorganisation',
      global: false,
      async: false,
      dataType: 'json',
      data: {"orgcity":$("#orgcity").val(),"orgaddr":$("#orgaddr").val(),"orgpincode":$("#orgpincode").val(),"orgstate":$("#orgstate").val(), "orgcountry":$("#orgcountry").val(),"orgtelno":$("#orgtelno").val(), "orgfax":$("#orgfax").val(),"orgwebsite":$("#orgwebsite").val(),"orgemail":$("#orgemail").val(),"orgpan":$("#orgpan").val(),"orgmvat":$("#orgmvat").val(),"orgstax":$("#orgstax").val(),"orgregno":regno,"orgregdate":regdate, "orgfcrano":fcrano,"orgfcradate":fcraregdate},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(jsonObj)
      {
        if(jsonObj["gkstatus"]==0)
        {
          $("#reset").click();
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#success-alert").hide();
          });
        }
        else
        {
          $("#connectionfailed").alert();
          $("#connectionfailed").fadeTo(2250, 500).slideUp(500, function(){
            $("#connectionfailed").hide();
          });
        }
      }
    });


  });
});
