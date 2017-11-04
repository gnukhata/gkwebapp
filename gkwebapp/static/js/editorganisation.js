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

  if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
      $(".tinfield").show();
    } else {
      $(".gstinfield").show();
    }
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

    $('#addgstinmodal').on('shown.bs.modal', function() {
	$("#gstintable tbody tr:first td:eq(0) input").focus();
    });

    
    //Keydown event start here
    $("#orgaddr").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgcountry").focus().select();
    }
    });

     $("#orgregno").keydown(function(event) {
     if (event.which==13) {
	 event.preventDefault();
	 $("#orgfcrano").focus().select();
     }
     });

    $("#orgfcrano").keydown(function(event) {
     if (event.which==13) {
	 event.preventDefault();
	 $("#orgaddr").focus().select();
     }
     if (event.which==38) {
	 event.preventDefault();
	 $("#orgregno").focus().select();
     }
    });
    
    $("#orgcountry").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgstate").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#orgaddr").focus().select();
    }
    });
    
    $("#orgstate").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgcity").focus().select();
    }
     if (event.which==38 && $("#add_state option:selected").index()==0)  {
          event.preventDefault();
          $("#orgcountry").focus().select();
        }
  });

    $("#orgcity").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgstax").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgstate").focus().select();
        }
    });

    $("#orgstax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgpan").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgcity").focus().select();
        }
    });

    $("#regday").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#regmonth").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgpan").focus().select();
        }
    });

    $("#regmonth").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#regyear").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#regday").focus().select();
        }
    });

    $("#regyear").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#fcraregday").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#regmonth").focus().select();
        }
    });

    $("#fcraregday").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#fcraregmonth").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#regyear").focus().select();
        }
    });

    $("#fcraregmonth").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#fcraregyear").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#fcraregday").focus().select();
        }
    });

     $("#fcraregyear").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgemail").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#fcraregmonth").focus().select();
        }
  });

    // Validation for PAN
    $("#orgpan").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
	var txtpan = $(this).val();
	if ((txtpan.length != 10 || !txtpan.match(regExp)) && $.trim($("#orgpan").val())!="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#orgpan").focus();
	}
	else {
	    if ($("#orgtype").val()=="Not For Profit"){
		$("#regday").focus();
		
	    }
	    else {
		$("#orgemail").focus();
	    }
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#orgstax").focus().select();
    }
  });

   $("#orgemail").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgtelno").focus().select();
    }
     if (event.which==38)  {
         event.preventDefault();
	  if ($("#orgtype").val()=="Not For Profit"){
		$("#fcraregyear").focus();
		
	    }
	    else {
		$("#orgpan").focus().select();
	    }
        }
   });

    $("#orgtelno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgwebsite").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgemail").focus().select();
        }
    });

    $("#orgwebsite").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgpincode").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgtelno").focus().select();
        }
    });


    $("#orgpincode").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgfax").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgwebsite").focus().select();
        }
    });

     $("#orgfax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgmvat").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgpincode").focus().select();
        }
     });

    $("#orgmvat").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if($("#vatorgstflag").val() == '7' || $("#vatorgstflag").val() == '29'){
		$("#orggstin").focus();
	}
	else {
	    $("#submit").focus();
	}
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgfax").focus().select();
        }
     });
    
  /**$('input:visible, textarea').keydown(function(event){
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
  });**/

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
