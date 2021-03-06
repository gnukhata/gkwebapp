
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
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
"Reshma Bhatawadekar" <reshma_b@riseup.net>
"Sanket Kolnoorkar" <sanketf123@gmail.com>
*/

$(document).ready(function(){
    $.ajax({
          url: '/editorganisation?action=getattachment',
          type: 'POST',
          datatype: 'json',
          beforeSend: function(xhr) {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          },
          data: {}
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
  $("#msspinmodal").hide("hide");
  $(".modal-backdrop").remove();

  $(".regdate").autotab('number');
    // '+' Button is attach only last record of gstin. 
    $("#gstintable tbody tr:last td:eq(2)").append('<div style="text-align:center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
    $(".fcradate").autotab('number');
    $('[data-toggle="popover"]').popover({
        html: true,
        template: '<div class="popover"><div class="alert alert-danger" id="cess-blank-alert" aria-live="rude" role="alert" hidden>Please enter Cess Rate!</div><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-footer"<div class="form-group input-group input-group-sm"><div id="cessratediv"><input class="input-sm form-control cessrate" size="23"></div><span class="glyphicon glyphicon-plus input-group-addon" id="addcessrate"></span></div></div></div>'
    });
    $('[data-toggle="popover"]').on('shown.bs.popover', function(){
        $(".cessrate").eq(0).focus().select();
    });
    var cessrates = [];
    $('[data-toggle="popover"]').on('hide.bs.popover', function(){
        $(".cessrate").each(function(index){
	    cessrates.push($(this).val());
	});
    });
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
	    $("#gstintable tbody tr:eq(" + i +") td:last").append('<div style="text-align:center;"><a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
	}
    
  if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
      $(".tinfield").show();
    } else {
      $(".gstinfield").show();
    }
    if($("#state").val() != ""){
	$("#orgstate").val($("#state").val());
    }
    if($("#state").val() == 'null'){
	$("#orgstate").val("");
    }
    
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

    $(document).off("keydown",".gstrate").on("keydown",".gstrate",function(event){
	let curindex = $(".gstrate").index(this);
	if (event.which == 13) {
	    event.preventDefault();
	    $(".gstrate").eq(curindex + 1).focus().select();
	}
	else if (event.which == 38) {
	    event.preventDefault();
	    $(".gstrate").eq(curindex - 1).focus().select();
	}
    });
    // add bankdetails modal
    $('#addbankdel').on('shown.bs.modal', function() {
	//$("#banktable tbody tr:first td:eq(1) select").focus();
	$("#accnum").focus();
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

    //change event for bank details
    $("#bank_name").change(function(event) {
	event.preventDefault();
        if(event.which==9){
	if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())=="") {
	    $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
            $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
        }}
	else if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())=="") {
	     $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
	    });
	    $("#bank_name").focus();
            return false;
         } else {
	     $("#branch_name").focus();
	 }
	});

      $("#branch_name").change(function(event){
      event.preventDefault();
	  if ($.trim($("#accnum").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
          }else if ($.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
            });
            $("#bank_name").focus();
	    return false;
             }
	  else if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())=="" ) {
            $("#branchname-improper-modal").alert();
            $("#branchname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
            $("#branchname-improper-modal").hide();
            });
            $("#branch_name").focus();
            return false;
        }
	  else{
	      $("#ifsc_code").focus();
	  }
	    });

    $("#ifsc_code").change(function(event){
      event.preventDefault();
	 if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())=="" && $.trim($("#ifsc_code").val())!="" ) {
            $("#both1-improper-modal").alert();
            $("#both1-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#both1-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
         }

          if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())!="" && $.trim($("#ifsc_code").val())=="" ) {
            $("#ifsc-improper-modal").alert();
            $("#ifsc-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
            $("#ifsc-improper-modal").hide();
            });
            $("#ifsc_code").focus();
            return false;
          }
	else{
	    $("#bankdel_done").focus();
	}
	    });

    //Click event for '+'(add button) which trigger keydown of 'gstin' field.
    $(document).off("click",".addbtn").on("click",".addbtn",function(event){	
	$(".gstin").trigger({type:"keydown",which:"13"});
    });
    
    $(document).off("keydown",".gstin").on("keydown",".gstin",function(event)
    {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    var alfhanum = /^[0-9a-zA-Z]+$/;
    var panno = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();	
    var numberofstates = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length-1;
    gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();	
  if (event.which==13) {
      event.preventDefault();

      if($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val() !="" && !$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val().match(alfhanum)){
	  $("#gstin-improper-modal").alert();
	  $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
	      $("#gstin-improper-modal").hide();
	  });
	  $('.gstin').focus().select();
	  return false;
      }else if($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val()=="" && $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val()=="" && $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val()==""){
	  $("#gstin_done").focus();
      }
      else if (curindex1 != ($("#gstintable tbody tr").length-1)) {
      $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else if ((panno.length != 10 || !panno.match(regExp)) && panno != "") {
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$('.panno').focus().select();
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
	    $('#gstintable tbody tr:eq('+ nextindex1 +') td:eq(1) input:eq(0)').val("");
	    $('#gstintable tbody tr:eq('+ curindex1 +') td:eq(2) span').hide(".addbtn");
	    //selected states are disabled when new row of gstin added.
	    for (let j = 0; j < curindex1 + 1; j++) {
		var selectedstate = $('#gstintable tbody tr:eq('+ j +') td:eq(0) select option:selected').attr("stateid");
                for (let i=j+1; i<=curindex1+1;i++){
                    $('#gstintable tbody tr:eq('+ i +') td:eq(0) select option[stateid='+selectedstate+']').prop('hidden', true).prop('disabled', true);
                }
            }
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
	    if(!($('.addbtn').is(':visible'))){
		$('#gstintable tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
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
          $("#orgwebsite").focus().select();
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

    //validation for done button of bankdetails field.
    $(document).off("click","#bankdel_done").on("click","#bankdel_done",function(event){
	if($("#accnum").val()=="" && $("#branch_name").val()=="" && $("#bank_name").val()=="" && $("#ifsc_code").val()=="" )
	{	      
	    $('#addbankdel').modal('hide');	      			     
	}
	else if($("#accnum").val()=="" || $("#branch_name").val()=="" || $("#bank_name").val()=="" || $("#ifsc_code").val()=="" ){
	    $("#bankdetails-improper-modal").alert();
		$("#bankdetails-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#bankdetails-improper-modal").hide();
		    $("#accnum").focus();
		});
	}
	if($("#accnum").val()!="" && $("#branch_name").val()!="" && $("#bank_name").val()!="" && $("#ifsc_code").val()!="" )
	{	      
		$('#addbankdel').modal('hide');			      			     
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
		$("#orgstax").focus();
	    }
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#orgfax").focus().select();
    }
  });
    var emailExp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //Expression to check proper email.
    var email="";
   $("#orgemail").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	email= $(this).val();
	if((!email.match(emailExp)) && email!=""){
	    $("#email-incorrect-alert").alert();
	    $("#email-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#email-incorrect-alert").hide();
		$("#orgemail").focus().select();
	    });
	}
	else{
	    $("#orgfax").focus().select();
	    return false;
	}
    }
     if (event.which==38)  {
         event.preventDefault();
	 if ($("#orgtype").val()=="Not For Profit"){
		$("#fcraregyear").focus();    
	 }else{
	     $("#orgwebsite").focus();
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
          $("#orgpincode").focus().select();
        }
    });

    $("#orgwebsite").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($("#orgtype").val()=="Not For Profit"){
	    $("#regday").focus();
	}else{
	    $("#orgemail").focus().select();
	}
    }
     if (event.which==38)  {
          event.preventDefault();
	 $("#orgtelno").focus().select();
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

      //Keydown EVENT for BANK DETAILS

    $("#accnum").keydown(function(event) {
	if (event.which==13) {
	    $("#bank_name").focus().select();
	}
    });  


    $("#bank_name").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
           
         if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())!="") {
            $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
         }

         else if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())=="") {
            $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
            });
            $("#bank_name").focus();
            return false;
          }
	    
      $("#branch_name").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#accnum").focus().select();
	};
    });


    $("#branch_name").keydown(function(event) {
	if (event.which==13) {
	     if ($.trim($("#accnum").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
          }

	     if ( $.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
            });
            $("#bank_name").focus();
            return false;
          }


	if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())=="" ) {
            $("#branchname-improper-modal").alert();
            $("#branchname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#branchname-improper-modal").hide();
            });
            $("#branch_name").focus();
            return false;
          }    
	    
	    event.preventDefault();
      $("#ifsc_code").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#bank_name").focus().select();
	};
    });
    

    $("#ifsc_code").keydown(function(event) {
	if (event.which==13) {

         if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())=="" && $.trim($("#ifsc_code").val())!="" ) {
            $("#both1-improper-modal").alert();
            $("#both1-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#both1-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
         }

            if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())!="" && $.trim($("#ifsc_code").val())=="" ) {
            $("#ifsc-improper-modal").alert();
            $("#ifsc-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#ifsc-improper-modal").hide();
            });
            $("#ifsc_code").focus();
            return false;
            }
      event.preventDefault();
      $("#bankdel_done").focus().click();
    }
    if (event.which==38) {
	 event.preventDefault();
	 $("#branch_name").focus().select();
       };
    });
   
    $("#bankdel_done").keydown(function(event) {
	if (event.which==13) {
	    if($("#accnum").val()=="" && $("#branch_name").val()=="" && $("#bank_name").val()=="" && $("#ifsc_code").val()=="" )
	    {		      
		$('#addbankdel').modal('hide');	      			     
	    }
	    else if($("#accnum").val()=="" || $("#branch_name").val()=="" || $("#bank_name").val()=="" || $("#ifsc_code").val()=="" ){
	    $("#bankdetails-improper-modal").alert();
		$("#bankdetails-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#bankdetails-improper-modal").hide();
		    $("#accnum").focus();
		});
	    }
	    if($("#accnum").val()!="" && $("#branch_name").val()!="" && $("#bank_name").val()!="" && $("#ifsc_code").val()!="" )
	    {	      
		    $('#addbankdel').modal('hide');			      			     
	    }
	}
	if (event.which==38) {
	    event.preventDefault();
	    $("#ifsc_code").focus().select();
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
	if($("#vatorgstflag").val() == '29' || $("#vatorgstflag").val() == '7'){
	    $("#orggstin").focus();
	} else {
	    $("#orgbankdel").focus();
	}
      
    }
     if (event.which==38)  {
         event.preventDefault();
	 if($("#vatorgstflag").val() == '7'){
             $("#orgpan").focus().select();
	 }else{
	     $("#orgmvat").focus().select();
	 }
          
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
	var alfhanum = /^[0-9a-zA-Z]+$/;
	var panno1= $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val();
	gstinstring = $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val();

	if($('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val() !="" && !$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val().match(alfhanum)){
	  $("#gstin-improper-modal").alert();
	  $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
	      $("#gstin-improper-modal").hide();
	  });
	  $('.gstin').focus().select();
	  return false;
	}else if((panno1.length != 10 || !panno1.match(regExp)) && panno1 !="" ) {
	    $("#gstin-improper-modal").alert();
	    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-modal").hide();
		$(".panno").focus();
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
    // Events for popover
    $(document).off("click", "#addcessrate").on("click", "#addcessrate", function(event){
	var allowadd = 0;
	var addcessindex = $('.cessrate').index();
	event.preventDefault();
	$(".cessrate").each(function(index){
	    if($('.cessrate:eq('+ index +')').val() == ""){
		$("#cess-blank-alert").alert();
		$("#cess-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#cess-blank-alert").hide();
		});
		$('.cessrate:eq('+ index +')').focus();
		allowadd = 1;
		return false;
	    }
	});
	if(allowadd == 0){
	    $("#cessratediv").append('<input class="input-sm form-control cessrate" size="23">');
	    $(".cessrate:last").focus();
	}
    });
    $(document).off("focus", ".cessrate").on("focus", ".cessrate", function(event){
	$(this).numeric({"negative":false});
    });
    $(document).off("keydown", ".cessrate").on("keydown", ".cessrate", function(event){
	var cessindex = $(this).index();
	if (event.which == 13) {
	    event.preventDefault();
	    if($('.cessrate:eq('+ cessindex +')').val() == ""){
		$("#cess-blank-alert").alert();
		$("#cess-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#cess-blank-alert").hide();
		    $('.cessrate:eq('+ cessindex +')').focus();
		});
		return false;
	    }
	    $("#cessratediv").append('<input class="input-sm form-control cessrate" size="23">');
	    $(".cessrate:last").focus(); 
	}
	if (event.which == 27) {
	    $('[data-toggle="popover"]').click();
	}
    });
    $(document).off("click", ".popover-content").on("click", ".popover-content", function(event){
	$('[data-toggle="popover"]').click();
    });
  $(document).off("click", "#submit").on("click", "#submit", function(event){
    event.preventDefault();
    var allow =1;
    var regdate="";
    var fcraregdate="";
    var regno="";
    var fcrano="";

      if ($(".popover").is(":visible")) {
	  $('[data-toggle="popover"]').click();
      }
    //validation for bankdetails on save button.  
    if(!($("#accnum").val()=="" && $("#branch_name").val()=="" && $("#bank_name").val()=="" && $("#ifsc_code").val()=="")){
        if($("#accnum").val()=="" || $("#branch_name").val()=="" || $("#bank_name").val()=="" || $("#ifsc_code").val()=="" ) {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	        $("#allbank-blank-alert").alert();
		$("#allbank-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#allbank-blank-alert").hide();
		});
		$("#orgbankdel").focus();
		return false;
	     }
	 }
    
    if($("#orgtype").val()=="Not For Profit")
    {

      if ($("#regyear").val()!="" || $("#regmonth").val()!="" || $("#regday").val()!="" )
      {
          regdate= $("#regyear").val() + "-" + $("#regmonth").val() + "-" + $("#regday").val();
          regno = $("#orgregno").val();
          if(!Date.parseExact(regdate,"yyyy-MM-dd")){
	      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
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
	      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
          $("#date-alert").alert();
          $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
          });
          $('#fcraregday').focus().select();
          return false;
        }
      }
    }
      	email = $("#orgemail").val();  // Validation for email.
      if ((!email.match(emailExp)) && email!="") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	    $("#email-incorrect-alert").alert();
            $("#email-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#email-incorrect-alert").hide();
            });
	    $("#orgemail").focus().select();
	    return false;
	}

   var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
      if (($("#orgpan").val().length != 10 || !$("#orgpan").val().match(regExp)) && $.trim($("#orgpan").val())!="") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
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
       var alfhanum = /^[0-9a-zA-Z]+$/;
       var panno1= $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();
       if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid"))!="") {
	   gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
	   //Validation for GSTIN on Save Button.
	   if($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val()!="" && !$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val().match(alfhanum)){
	       $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	       $("#gstin-improper-alert").alert();
	       $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		   $("#gstin-improper-alert").hide();
	       });
	       $('#orggstin').focus();
	       allow = 0;
	       return false;
	   }else if((panno1.length != 10 || !panno1.match(regExp)) && panno1 !="" ) {
	       $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	       $("#gstin-improper-alert").alert();
	       $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		   $("#gstin-improper-alert").hide();
		   $("#orggstin").focus();
	       });
	       allow =0;
	       return false;
	   }
	   else if(panno1 !="" && $(".gstin").val() ==""){
	       $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
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
		   $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
		   $("#gstin-improper-alert").alert();
		   $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		       $("#gstin-improper-alert").hide();
		       $("#orggstin").focus();
		   });
		   allow = 0;
		   return false;
	       }
     }
	if(gstinstring.length == 15){
           gobj[$('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid")] = gstinstring;
  }
       }
   });
    
    var form_data = new FormData();
    form_data.append("orgcity", $("#orgcity").val());
    form_data.append("orgaddr", $("#orgaddr").val());
    form_data.append("orgpincode", $("#orgpincode").val());
    form_data.append("orgcountry",$("#orgcountry").val());
    form_data.append("orgtelno",$("#orgtelno").val());
    form_data.append("orgfax",$("#orgfax").val());
    form_data.append("orgwebsite",$("#orgwebsite").val());
    form_data.append("orgemail",$("#orgemail").val());
    form_data.append("orgpan",$("#orgpan").val());
    form_data.append("orgmvat",$("#orgmvat").val());
    form_data.append("orgstax",$("#orgstax").val());  
    if (!(jQuery.isEmptyObject( gobj ))){ 
      form_data.append("gstin",JSON.stringify(gobj)); //for gstin
    }  
    if ($("#orgstate").val() !=null){
      form_data.append("orgstate",$("#orgstate").val());
    }
      if($("#accnum").val()!="" && $("#branch_name").val()!="" && $("#bank_name").val()!="" && $("#ifsc_code").val()!=""){
	  var bankdetails={};
         bankdetails["accountno"]=$.trim($("#accnum").val());
         bankdetails["bankname"]=$.trim($("#bank_name").val());
         bankdetails["branchname"]=$.trim($("#branch_name").val());
          bankdetails["ifsc"]=$.trim($("#ifsc_code").val());
	  
	  form_data.append("bankdetails",JSON.stringify(bankdetails));
      } //For bank details
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
      var accounts = [];
      // If there are GSTINs for an organisation accounts for GST will be created under subgroup 'Duties & Taxes' in group 'Current Liabilities'.
      if (Object.keys(gobj).length > 0) {
	  var groupcode = "";
	  var subgroupcode = "";
	  var newsubgroup = "";
	  //Fetching groupcode and subgroup codes for GST accconts to be created.
	  $.ajax({
	      url: '/showeditOrg?getgstgroupcode',
	      type: 'POST',
	      global: false,
	      async: false,
	      datatype: 'json',
	      beforeSend: function(xhr)
	      {
		  xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	      }
	  }).done(function(resp){
	      if (resp.gkstatus == 0) {
		  groupcode = resp.groupcode;
		  subgroupcode = resp.subgroupcode;
		  // If subgroup 'Duties & Taxes' is not present it will be created.
		  if (subgroupcode == "New") {
		      newsubgroup = "Duties & Taxes";
		  }
	      }
	      else {
		  $("#connectionfailed").alert();
		  $("#connectionfailed").fadeTo(2250, 500).slideUp(500, function(){
		      $("#connectionfailed").hide();
		  });
	      }
	      console.log("success");
	  }).fail(function() {
	      console.log("error");
	  }).always(function() {
	      console.log("complete");
	  });
	  // GST account will be of the format 'TAX/CESSTYPE_STATEABBREVIATION@RATE%' like 'SGST_KL@12%'
	  var taxes = ["SGSTIN", "SGSTOUT", "CGSTIN", "CGSTOUT", "IGSTIN", "IGSTOUT"];
	  var cesses = ["CESSIN", "CESSOUT"];
	  var taxstate = "";
	  var taxtype = "";
	  var taxrate = "";
	  var accountname = "";
	  var newtaxrate = "";
	  //Looping through GSTIN table rows to fetch state abbreviations.
	  $("#gstintable tbody tr").each(function(index) {
	      if ($("#gstintable tbody tr:eq(" + index + ") td:eq(0) select option:selected").attr("stateid") != "") {
		  let statecode = $("#gstintable tbody tr:eq(" + index + ") td:eq(0) select option:selected").attr("stateid");
		  $.ajax({
		      url: '/addaccount?type=abbreviation',
		      type: 'POST',
		      global: false,
		      async: false,
		      datatype: 'json',
		      data: {"statecode": statecode},
		      beforeSend: function(xhr)
		      {
			  xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		      }
		  }).done(function(resp){
		      if (resp.gkstatus == 0) {
			  taxstate = resp.abbreviation;
			  //For each state choon GST and CESS rates are found
			  $(".gstrate").each(function(index){
			      if ($(this).is(":checked")) {
				  taxrate = $(this).data("taxrate");
				  newtaxrate = parseFloat(taxrate)/2;
				  newtaxrate = newtaxrate.toString();
			      }
			      else{
				  taxrate = "";
			      }
			      //For each tax rate accounts are created for all types of tax.
			      $.each(taxes, function(index, taxtype) {
				  if (taxrate != "" && taxstate != "") {
				      if(taxtype == 'SGSTIN' || taxtype == 'CGSTIN' || taxtype == 'SGSTOUT' || taxtype == 'CGSTOUT'){
					  accountname = taxtype + '_' + taxstate + '@' + newtaxrate + '%';
				      }
				      else{
					  accountname = taxtype + '_' + taxstate + '@' + taxrate + '%';
				      }
				      accounts.push({"accountname":accountname, "subgroupname":subgroupcode, "groupname":groupcode, "newsubgroup":newsubgroup, "openbal":"0.00"});
				  }
			      });
			  });
			  //Accounts are created for CESS like they were created for tax.
			  $.each(cessrates, function(index, cessrate){
			      $.each(cesses, function(index, cesstype) {
				  if (cessrate != "" && taxstate != "") {
				      accountname = cesstype + '_' + taxstate + '@' + cessrate + "%";
				      accounts.push({"accountname":accountname, "subgroupname":subgroupcode, "groupname":groupcode, "newsubgroup":newsubgroup, "openbal":"0.00"});
				  }
			      });
			  });
		      }
		  }).fail(function() {
		      console.log("error");
		  }).always(function() {
		      console.log("complete");
		  });
	      }
	  });
      }
      // Organisation details are saved.
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
	    $("#msspinmodal").modal("hide");
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#success-alert").hide();
	      if (accounts.length > 0) {
		  $("#msspinmodal").modal("show");
	      $.ajax(
		  {
		      type: "POST",
		      url: "/multiacc?type=GST",
		      global: false,
		      async: false,
		      datatype: "json",
		      data:{"accdetails":JSON.stringify(accounts)} ,
		      beforeSend: function(xhr)
		      {
			  xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		      },
		      success: function(resp)
		      {
			  if(resp["accounts"].length>0)
			  {
			      $("#msspinmodal").modal("hide");
			      $("#gstaccountsmodal").modal("show");
			      let count = 0;
			      $.each(resp.accounts, function(index, account) {
				  let firstacc = account;
				  let secondacc;
				  if (resp.accounts[index+1] == null){
				      secondacc="";
				  }else{
				      secondacc = resp.accounts[index+1];
				  }
				  //Separate out 'abbreviation' of state in account name.(i.e abbreviation of 'IGSTIN_MH@5.0%' is 'MH')
				  let fin_1 = firstacc.indexOf("_");
				  let fin_2 = firstacc.indexOf("@");
				  let sin_1 = secondacc.indexOf("_");
				  let sin_2 = secondacc.indexOf("@");
				  let result1 = firstacc.slice(fin_1+1,fin_2);
				  let result2 = secondacc.slice(sin_1+1,sin_2);
				  if(result1 == result2){
				      if(count % 6 == 0){
					  if(count == 0){
					      //This ajax will gives state name from "state abbreviation".
					      let stateabbr = result1;
					      $.ajax({
						  url: '/editorganisation?type=statename',
						  type: 'POST',
						  global: false,
						  async: false,
						  datatype: 'json',
						  data: {"stateabbr": stateabbr},
						  beforeSend: function(xhr)
						  {
						      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
						  }
					      }).done(function(resp){
						  if (resp.gkstatus == 0) {
						      $("#gstaccountstable tbody").append("<tr><td colspan='3'><div style='font-weight:bold; text-decoration:underline; background-color:#fafafa;'>" + "Accounts For "+ resp["statename"] + "</div></td></tr>");
						  }
					      });
					  }
					  $("#gstaccountstable tbody").append("<tr><td>" + account + "</td></tr>");
					  count = count+1; 
				      }
				      else{
					  $("#gstaccountstable tbody tr:last").append("<td>" + account + "</td>");
					  count = count+1;
				      }
				  }
				  else if(result1 != result2) {
				      $("#gstaccountstable tbody tr:last").append("<td>" + account + "</td>");
				      $("#gstaccountstable tbody").append("<tr></tr>");
				      count =0;
				  }else if(result1 !="" && result2 ==""){
				      $("#gstaccountstable tbody tr:last").append("<td>" + account + "</td>");
				  }
			      });
			  }
			  else {
			      $("#msspinmodal").modal("hide");
			  }
		      }
		  });
	      }
	      else{
		  $("#reset").click();
	      }
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

      $("#gstaccountsmodal").on('hidden.bs.modal', function(event) {
	  $(".modal-backdrop").remove();
        $("#reset").click();
    });
  $.ajax({
          url: '/editorganisation?action=getattachment',
          type: 'POST',
          datatype: 'json',
          beforeSend: function(xhr) {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          },
          data: {}
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

    $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	event.preventDefault();
	    $("#submit").click();
      }
  });
});
