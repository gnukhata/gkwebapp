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
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
*/

$(document).ready(function(){
  $("#msspinmodal").modal("hide");
  $(".regdate").autotab('number');
    $(".fcradate").autotab('number');
    if($("#state").val() != "" ){
	$("#orgstate").val($("#state").val());}
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


  $(document).off("click", "#submit").on("click", "#submit", function(event){
    event.preventDefault();

    var regdate="";
    var fcraregdate="";
    var regno="";
    var fcrano="";

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
    var form_data = new FormData();
    form_data.append("orgcity", $("#orgcity").val());
    form_data.append("orgaddr", $("#orgaddr").val());
    form_data.append("orgpincode", $("#orgpincode").val());
    form_data.append("orgstate",$("#orgstate").val());
    form_data.append("orgcountry",$("#orgcountry").val());
    form_data.append("orgtelno",$("#orgtelno").val());
    form_data.append("orgfax",$("#orgfax").val());
    form_data.append("orgwebsite",$("#orgwebsite").val());
    form_data.append("orgemail",$("#orgemail").val());
    form_data.append("orgpan",$("#orgpan").val());
    form_data.append("orgmvat",$("#orgmvat").val());
    form_data.append("orgstax",$("#orgstax").val());
    form_data.append("orgregno",regno);
    form_data.append("orgregdate",regdate);
    form_data.append( "orgfcrano",fcrano);
    form_data.append("orgfcradate",fcraregdate);
    if ($("#my-file-selector")[0].files[0])
    {

      var file = $("#my-file-selector")[0].files[0];
      form_data.append("logo",file);
    }

  $("#msspinmodal").modal("show");
    $.ajax({
      type: 'POST',
      url: '/editorganisation',
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      dataType: 'json',
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(jsonObj)
      {

        if(jsonObj["gkstatus"]==0)
        {
          console.log("success");
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

  $.ajax({
          url: '/editorganisation?action=getattachment',
          type: 'POST',
          datatype: 'json',
          beforeSend: function(xhr) {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          },
          data: {},
      })
      .done(function(resp) {
            var imagesrc = "data:image/png;base64,"+resp["logo"];

           $("#imgbox").attr("src", imagesrc);

          console.log("success");
      })
      .fail(function() {
          console.log("error");
      })
      .always(function() {
          console.log("complete");
      });

});
