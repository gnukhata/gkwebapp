/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"Reshma Bhatawadekar" <reshma_b@riseup.net>
*/

$(document).ready(function(){
  $("#msspinmodal").modal("hide");
  $(".regdate").autotab('number');
    $(".fcradate").autotab('number');
    function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
	return str;
    }
  }
  function yearpad (str, max) { //to add leading 20 or 200 in the year
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

  $("#regday").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#regmonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#regyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  $("#fcraregday").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#fcraregmonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#fcraregyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

    var curindex = $(this).closest('tr').index();
var gstinstring = ""; // for cocatination of GSTIN.
    	for(var i = 0; i < $("#gstintable tbody tr").length; i++) {
	    var state = $("#gstintable tbody tr:eq("+i+") td:eq(0) select").attr("stateid");
	    $("#gstintable tbody tr:eq("+i+") td:eq(0) select option[stateid="+state+"]").prop("selected", true);
	
	    var gstinstr =$('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(0)').val();
	    $('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(0)').val(gstinstr.substring(0, 2));
	    $('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(1)').val(gstinstr.substring(2, 12));
	    $('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(2)').val(gstinstr.substring(12, 15));
	    $("#gstintable tbody tr:eq(" + i +") td:last").append('<a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	}
    
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

    // Add GSTIN modal
    $('#addgstinmodal').on('shown.bs.modal', function() {
	$("#gstintable tbody tr:first td:eq(0) select").focus();
    });

    $('#addbankdel').on('shown.bs.modal', function() {
	//$("#banktable tbody tr:first td:eq(1) select").focus();
	$("#accno1").focus();
    });


$(document).off("keydown",".gstinstate").on("keydown",".gstinstate",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if (event.which==13) {
      event.preventDefault();
      if ($.trim($("#orgpan").val()) !="") {
	 $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:last').focus();
      }
      else {
	   $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').focus();
      }
  }
});

//Change event on GSTIN State
    $(document).off('change', '.gstinstate').on('change', '.gstinstate', function(event) {
	event.preventDefault();
	var curindex = $(this).closest('tr').index();
	var cusstatecode =  $('#gstintable tbody tr:eq('+curindex+') td:eq(0) select option:selected').attr("stateid");
	if (cusstatecode.length == 1){
	    cusstatecode = "0" + cusstatecode; 
	}
	$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val(cusstatecode); //for state code
	if ($('#orgpan').val() != ''){
	    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val($('#orgpan').val()).prop("disabled",true); //for pan
	}
	else {
	    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').prop("disabled",false);
	}
	
    });

    //Keydown event on gstin's panno
    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    var panno="";
    $(document).off("keydown", ".panno").on("keydown", ".panno", function(event) {
	var curindex = $(this).closest('tr').index();
	var previndex = curindex-1;
	panno = $(this).val();
	if (event.which == 13 || event.which ==9) {
	    event.preventDefault();
	    //Validation for PAN inside GSTIN.
	    if ((panno.length != 10 || !panno.match(regExp)) && panno != "") {
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$(this).focus().select();
	    }
	    else{
		$(this).next('input').focus().select();
		return false;
	    }
	}
    });

    $(document).off("change",".gstin").on("change",".gstin",function(event) {
	var curindex = $(this).closest('tr').index();
	gstinstring = $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val();
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#gstin-improper-modal").hide();
  		    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').focus().select();
		});
  		return false;
            }
  }

    });


    $(document).off("keydown",".gstin").on("keydown",".gstin",function(event)
{
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var selectedstate = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid");
    var numberofstates = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length-1;
    gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
  if (event.which==13) {
      event.preventDefault();
      if($(".gstin").val()=="" && $(".panno").val()==""){
	  $("#gstin_done").focus();
      }
      else if (curindex1 != ($("#gstintable tbody tr").length-1)) {
      $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#gstin-improper-modal").hide();
  		    $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').focus().select();
		});
  		return false;
            }
	}
	  if (numberofstates > 0) {
              $('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select option[stateid='+selectedstate+']').prop('hidden', true).prop('disabled', true);
	$('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select option[value=""]').prop('selected', true);
        $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        $("#gstin_done").focus();
      }
    }
  }
  else if(event.which==190 && event.shiftKey)
  {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex1>-1)
    {
      event.preventDefault();
      $('#gstintable tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
    }
  }
  else if (event.ctrlKey && event.which==188) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').focus();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
  }
});

    $(document).off("click",".state_del").on("click", ".state_del", function() {
	$(this).closest('tr').fadeOut(200, function(){
	    $(this).closest('tr').remove();//closest method gives the closest element specified
	    if($('#gstintable tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
		$('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	    }
	    $('#gstintable tbody tr:last td:eq(0) select').focus().select();
	});
	$('#gstintable tbody tr:last td:eq(0) select').select();
    });
    //Keydown event start here
    $("#orgaddr").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgcity").focus().select();
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
      $("#orgpincode").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#orgstate").focus().select();
    }
    });
    
    $("#orgstate").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgcountry").focus().select();
    }
     if (event.which==38 && $("#add_state option:selected").index()==0)  {
          event.preventDefault();
          $("#orgcity").focus().select();
        }
  });

    $("#orgcity").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgstate").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgaddr").focus().select();
        }
    });

    $("#regday").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#regmonth").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgtelno").focus().select();
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
      $("#orgwebsite").focus().select();
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
	    return false;
	}
	else {
	    if(sessionStorage.vatorgstflag == '22' || sessionStorage.vatorgstflag == '29' ){
		$("#orgmvat").focus();
	    } else {
		$("#orggstin").focus();
	    }
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#orgfax").focus().select();
    }
  });

   $("#orgemail").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgfax").focus().select();
    }
     if (event.which==38)  {
         event.preventDefault();
	 $("#orgwebsite").focus();
        }
   });

    $("#orgtelno").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($("#orgtype").val()=="Not For Profit"){
		$("#regday").focus();
		
	} else {
	    $("#orgwebsite").focus().select();
	}
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgpincode").focus().select();
        }
    });

    $("#orgwebsite").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgemail").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
	 if ($("#orgtype").val()=="Not For Profit"){
		$("#fcraregyear").focus();
		
	    }
	    else {
		$("#orgtelno").focus().select();
	    }
        }
    });


    $("#orgpincode").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgtelno").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgcountry").focus().select();
        }
    });

     $("#orgfax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgpan").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgemail").focus().select();
        }
     });



    $("#accno1").keydown(function(event) {
	if (event.which==13) {
	    $("#branchnm1").focus().select();
	}
    });  


    $("#branchnm1").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#banknm1").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#accno1").focus().select();
	}});


    $("#banknm1").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#ifsc1").focus().select();
    }
    });

    $("#ifsc1").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#gstin_done1").focus().select();
    }
    });
    

    $("#orgmvat").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	$("#orgstax").focus();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgpan").focus().select();
        }
    });

    $("#orgstax").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if($("#vatorgstflag").val() == '29'){
	    $("#orggstin").focus();
	} else {
	    $("#submit").focus();
	}
      
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgmvat").focus().select();
        }
    });

    // 'Esc' keyevent for shifting focus from GSTIN button to Save button.
    $("#orggstin").keydown(function(event) {
    if (event.which==27) {
	event.preventDefault();
	    $("#submit").focus(); 
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

    //Validation for GSTIN on Done Button inside Add GSTIN.
    $("#gstin_done").click(function(event) {
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
	var curindex1 = $(this).index();
	var panno1= $(".panno").val();
	if((panno1.length != 10 || !panno1.match(regExp)) && panno1 !="" ) {
	    $("#gstin-improper-modal").alert();
	    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-modal").hide();
		$(".gstin").focus();
	    });
	    return false;
	}
	else if(panno1 !="" && $(".gstin").val() ==""){
	    $("#gstin-improper-modal").alert();
	    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-modal").hide();
		$(".gstin").focus();
	    });
	    return false;
	}
	else if(gstinstring != ""){
	    if(gstinstring.length != 15){
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		    $(".gstin").focus();
		});
		return false;
	    }
	}
        $('#addgstinmodal').modal('hide');	    
    });

  $(document).off("click", "#submit").on("click", "#submit", function(event){
    event.preventDefault();
    var allow =1;
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

   var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
      if (($("#orgpan").val().length != 10 || !$("#orgpan").val().match(regExp)) && $.trim($("#orgpan").val())!="") {
	  $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#orgpan").focus();
	    return false;
	}
   var gobj = {}; // Creating a dictionary for storing statecode with gstin.
   $("#gstintable tbody tr").each(function(){
       var curindex1 = $(this).index();
       var panno1= $(".panno").val();
       if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid"))!="") {
	   gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
	   //Validation for GSTIN on Save Button.
	   if((panno1.length != 10 || !panno1.match(regExp)) && panno1 !="" ) {
	       $("#gstin-improper-alert").alert();
	       $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		   $("#gstin-improper-alert").hide();
		   $("#orggstin").focus();
	       });
	       allow =0;
	       return false;
	   }
	   else if(panno1 !="" && $(".gstin").val() ==""){
	       $("#gstin-improper-alert").alert();
	       $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		   $("#gstin-improper-alert").hide();
		   $("#orggstin").focus();
	       });
	       allow = 0;
	       return false;
	   }
	   else if(gstinstring != ""){
	       if(gstinstring.length != 15){
		   $("#gstin-improper-alert").alert();
		   $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		       $("#gstin-improper-alert").hide();
		       $("#orggstin").focus();
		   });
		   allow = 0;
		   return false;
	       }
	   }
           gobj[$('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid")] = gstinstring;
       }
   });
    
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
    form_data.append("gstin",JSON.stringify(gobj)); //for gstin     
    form_data.append("orgregno",regno);
    form_data.append("orgregdate",regdate);
    form_data.append( "orgfcrano",fcrano);
    form_data.append("orgfcradate",fcraregdate);
    if ($("#my-file-selector")[0].files[0])
    {

      var file = $("#my-file-selector")[0].files[0];
      form_data.append("logo",file);
    }
      
  if(allow == 1){ 
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
  //}
 //});
  
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
  }
  });
});
