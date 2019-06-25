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
"Prajkta Patkar"<prajakta@dff.org.in>
"Reshma Bhatawadekar<reshma@dff.org.in>"
"Nitesh Chaughule" <nitesh@disroot.org>
*/

// This script is for the addcustomer/supplier.jinja2

$(document).ready(function() {
    //All the navigation events where pressing enter shifts focus to the next element and pressing the up arrow key focuses the previous element
	if(sessionStorage.cussup == 0){
	$("#add_cussup input:radio[value=19]").click();
	}
	
    $("#moresmall").on('shown.bs.collapse', function(event) {
        event.preventDefault();
        $("#smalllink").html('See less. <span class="glyphicon glyphicon-triangle-top"></span>');
    });
    $("#moresmall").on('hidden.bs.collapse', function(event) {
        event.preventDefault();
        $("#smalllink").html('See more. <span class="glyphicon glyphicon-triangle-bottom"></span>');
	});
	
    $("#add_cussup input:radio").change(function(event) {
	event.preventDefault();
	if($("#add_cussup input:radio:checked").val() == '3'){
	    $("#bankdetails").hide();
	    $(".custlbl").show();
	    $(".suplbl").hide();
	} else {
	    $("#bankdetails").show();
	    $(".custlbl").hide();
	    $(".suplbl").show();
	}
    });
    $("#add_cussup input:radio").change();
    var gstinstring = "";

    // append remove button to all gstin field added.
    for(var i = 0; i < $("#gstintable tbody tr").length; i++) {
	//$("#gstintable tbody tr:eq(0) td:last").append('<a href="#" class="state_del"><i class="fa fa-refresh" aria-hidden="true"></i></a>');
	$("#gstintable tbody tr:last td:last").append('<div style="text-align: center;"><a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
    }
    
  $("#add_cussup input:radio:checked").focus().select();
  $("#add_cussup input:radio").keydown(function(event) {
      if (event.which==13) {

	if ($.trim($("#add_cussup input:radio:checked").val())=="") {
            $("#role-blank-alert").alert();
            $("#role-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#role-blank-alert").hide();
            });
            $("#add_cussup input:radio:checked").focus();
            return false;
          }
        event.preventDefault();
          $("#add_cussup_name").focus().select();
        }
  });
    
 $("#checkbnk").click(function(e){
    if ($(this).is(":checked")) {
	$("#bankdiv").show();
    }
     else {
	 $("#bankdiv").hide();
     }
 });
  $("#add_cussup_name").keydown(function(event) {
    if (event.which==13||event.which==9) {
    	if ($.trim($("#add_cussup_name").val())=="") {
	    if($("#add_cussup input:radio:checked").val() == '3'){
		$("#custname-blank-alert").alert();
		$("#custname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){    
		    $("#custname-blank-alert").hide();
		});
	    } else {
		$("#supname-blank-alert").alert();
		$("#supname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){    
		    $("#supname-blank-alert").hide();
		});
	    }
            $("#add_cussup_name").focus();
            return false;
          }
          event.preventDefault();
          $("#add_cussup_email").focus().select();
        }
  });

    var emailExp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //Expression to check proper email.
    var email="";
    
  $("#add_cussup_email").keydown(function(event) {
    if (event.which==13 || event.which==9) {
	event.preventDefault();
	email = $(this).val();
	if ((!email.match(emailExp)) && email!="") {
	  $("#email-improper-alert").alert();
            $("#email-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#email-improper-alert").hide();
		$("#add_cussup_email").focus().select();
            });   


	}
	else{
	$("#add_cussup_phone").focus().select();
	    return false;
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_name").focus().select();
    }
    });
  $("#add_cussup_phone").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_state").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_email").focus().select();
    }
  });
    //Function to add leading zeros in date and month fields.
    function pad(str, max) { //to add leading zeros in date
	if (str && str!="") {
	    str = str.toString();
	if (str.length == 1) {
	    return str.length < max ? pad("0" + str, max) : str;
	}
	else {
	    return str;
	}
	}
    }

    //Selected customer/supplier state autopopulate in gstin state and statecode.
    $("#add_state").change(function(event) {
        var availstate =  $("#add_state").val();
	$(".gstinstate").val(availstate);
	$(".statecode").val(pad($("#add_state option:selected").attr("stateid"), 2));
    });
    
$("#add_state").keydown(function(event) {
    if (event.which==13||event.which==9) {
    	event.preventDefault();
    	if ($.trim($("#add_state").val())=="") {
            $("#state-blank-alert").alert();
            $("#state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#state-blank-alert").hide();
            });
            $("#add_state").focus();
            return false;
          }
          event.preventDefault();
          $("#add_cussup_address").focus().select();
        }
        if (event.which==38 && $("#add_state option:selected").index()==0)  {
          event.preventDefault();
          $("#add_cussup_phone").focus().select();
        }
});
    
  $(document).off("keydown",".gstinstate").on("keydown",".gstinstate",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if(event.which==190 && event.shiftKey)
  {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
  }
  else if(event.which==188 && event.shiftKey)
  	{
	event.preventDefault();
	if(curindex == 0){
		$("#add_cussup_pan").focus();
	}
	else{
	$('#gstintable tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
	}
  	}
    else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();

	if ($.trim($("#add_cussup_pan").val()) !="") {
		$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:last').focus();
		 }
		 else {
		  $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').focus();
		 }
  }
  else if (event.which==13) {
      event.preventDefault();
      if ($.trim($("#add_cussup_pan").val()) !="") {
	 $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:last').focus();
      }
      else {
	   $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').focus();
      }
  }
  else if (event.which==27) {
      event.preventDefault();
      if($("#add_cussup input:radio:checked").val() == '19'){
	  $("#checkbnk").focus();
      } else {
	  $("#cussup_save").focus();
      }
  }
});
    $(document).off("keydown", "#checkbnk").on("keydown", "#checkbnk", function(event) {
	if(event.which == 13){
	    event.preventDefault();
	    if($("#checkbnk").is(':checked')){
		$("#accountno").focus().select();
	    }else{
		$("#cussup_save").focus();
	    }
	}
	else if(event.which == 38){
	    if ($("#vatorgstflag").val() == '22'){
		$("#add_cussup_tan").focus();
	    } else {
		$(".gstin").focus().select();
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
	$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val(pad(cusstatecode, 2)); //for state code
	if ($('#add_cussup_pan').val() != ''){
	    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val($('#add_cussup_pan').val()).prop("disabled",true); //for pan
	}
	else {
	    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').prop("disabled",false);
	}
	
    });

    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    var panno="";
    //Keydown event on gstin's panno 
    $(document).off("keydown", ".panno").on("keydown", ".panno", function(event) {
	var curindex = $(this).closest('tr').index();
	var previndex = curindex-1;
	var nextindex = curindex+1;
	panno = $(this).val();
	if (event.which == 13 || event.which ==9) {
	    event.preventDefault();
	    if ((panno.length != 10 || !panno.match(regExp)) && panno !="" ) {
		$("#gstin-improper-alert").alert();
		$("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-alert").hide();
		});
		$(this).focus().select();
	    }
	    else{
		$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:last').focus();
		return false;
	    }
	}
	else if (event.which==27) {
		event.preventDefault();
		if($("#add_cussup input:radio:checked").val() == '19'){
		$("#checkbnk").focus();
		} else {
		$("#cussup_save").focus();
		}
	}
		else if (event.which==188 && event.ctrlKey) {
		$('#gstintable tbody tr:eq('+curindex+') td:eq(0) select').focus();
		}
		else if (event.which==190 && event.ctrlKey) {
			$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:last').focus();
			}
		else if(event.which==190 && event.shiftKey){
			  event.preventDefault();
			  $('#gstintable tbody tr:eq('+nextindex+') td:eq(1) input:eq(1)').focus();
			}
		else if(event.which==188 && event.shiftKey){
			  event.preventDefault();
			  if(curindex != 0){
			  $('#gstintable tbody tr:eq('+previndex+') td:eq(1) input:eq(1)').focus();
			  }
				}
    });

    $(document).off("change",".gstin").on("change",".gstin",function(event) {
	var curindex = $(this).closest('tr').index();
	gstinstring = $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val();
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#gstin-improper-alert").alert();
		$("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#gstin-improper-alert").hide();
  		    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').focus().select();
		});
  		return false;
          }
  }

    });
    
    $(document).off("keydown",".gstin").on("keydown",".gstin",function(event){
	var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1+1;
  var previndex1 = curindex1-1;
  var selectedstate = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid");
  var numberofstates = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) option:selected:not(:hidden)').length-1;
  var regExp_change = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
  var txtpan_change = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();
  if (event.which==13) {
      event.preventDefault();
      gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
      if($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val()=="" && $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val()=="" ){
	  if($("#add_cussup input:radio:checked").val() == '19'){
	      $("#checkbnk").focus();
	  } else {
	      $("#cussup_save").focus();
	  }
      }
      else if ($(".gstin").val() !="" && curindex1 != ($("#gstintable tbody tr").length-1)) {
	  $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else if((txtpan_change.length != 10 || !txtpan_change.match(regExp_change)) && txtpan_change !="") {
	  $("#gstin-improper-alert").alert();
	  $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#gstin-improper-alert").hide();
	      $(".panno").focus();
	  });
      }
      else {
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#gstin-improper-alert").alert();
		$("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#gstin-improper-alert").hide();
  		    $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').focus().select();
		});
  		return false;
            }
	}
	  if (numberofstates >= 0) {
              $('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	      $('#gstintable tbody tr:eq('+curindex1+') td:eq(2) span').hide(".addbtn");
        $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select option[stateid='+selectedstate+']').prop('hidden', true).prop('disabled', true);
	$('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select option[value=""]').prop('selected', true);
        $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        $("#cussup_save").focus();
      }
    }
  }
  else if(event.which==190 && event.shiftKey)
  {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(1) input').focus();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex1>-1)
    {
      event.preventDefault();
      $('#gstintable tbody tr:eq('+previndex1+') td:eq(1) input:eq(2)').focus();
    }
  }
  else if (event.ctrlKey && event.which==188) {
	event.preventDefault();
	if($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').is(":disabled")){
	$('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select').focus();
  }
  else{
	$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').focus();
  }
}
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
  }
  else if (event.which==27) {
      event.preventDefault();
      if($("#add_cussup input:radio:checked").val() == '19'){
	  $("#checkbnk").focus();
      } else {
	  $("#cussup_save").focus();
      }
  }
    });

    //Click button for '+' that will trigger click event of 'gstin' field.
    $(document).off("click",".addbtn").on("click",".addbtn",function(event){
	$(".gstin").trigger({type:"keydown",which:"13"});
    });
    
    // Keydown events for bank details
    $("#accountno").numeric();
    $("#accountno").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    $("#bankname").focus();
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#checkbnk").focus();
	}

    });
    $("#bankname").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if ($("#accountno").val() != "" && $("#bankname").val() == "" ) {
		$("#bankname-blank-alert").alert();
		$("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert").hide();
		    $("#bankname").focus();
		});
		return false;
	    } else if ($("#accountno").val() == "" && $("#bankname").val() != "" ) {
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		});
		$("#accountno").focus();
		return false;
	    } else {
		$('#branchname').focus();
	    }
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#accountno").focus().select();
	}

    });
    $("#branchname").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if($("#accounno").val() != "" && $("#bankname").val() != "" && $("#branchname").val() == "") {
		$("#branchname-blank-alert").alert();
		$("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#branchname-blank-alert").hide();
		    $("#branchname").focus();
		});
		return false;
	    } else if($("#accountno").val() == "" && $("#branchname").val() != ""){
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		    $("#accountno").focus();
		});
		return false;
	    }else if($("#bankname").val() == "" && $("#branchname").val() != ""){
		$("#bankname-blank-alert").alert();
		$("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert").hide();
		    $("#bankname").focus();
		});
		return false;
	    } else {
		$("#ifsc").focus();
	    }
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#bankname").focus().select();
	}

    });
    $("#ifsc").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if ($("#accounno").val() != "" && $("#bankname").val() != "" && $("#branchname").val() != "" && $("#ifsc").val() == "") {
		$("#ifsc-blank-alert").alert();
		$("#ifsc-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#ifsc-blank-alert").hide();
		    $("#ifsc").focus();
		});
		return false;
	    } else if($("#accountno").val() == "" && $("#ifsc").val() != ""){
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		    $("#accountno").focus();
		});
		return false;
	    } else if($("#bankname").val() == "" && $("#ifsc").val() != ""){
		$("#bankname-blank-alert").alert();
		$("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert").hide();
		    $("#bankname").focus();
		});
		return false;
	    } else if($("#branchname").val() == "" && $("#ifsc").val() != ""){
		$("#branchname-blank-alert").alert();
		$("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#branchname-blank-alert").hide();
		    $("#branchname").focus();
		});
		return false;
		}else {
		$("#cussup_save").focus();
	    } 
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#branchname").focus().select();
	}

    });

    //change event for bank details
    $("#bankname").change(function(event) {
	event.preventDefault();
	if ($("#accountno").val() == "" && $("#bankname").val() != "" ) {
	    $("#accountno-blank-alert").alert();
	    $("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#accountno-blank-alert").hide();
	    });
	    $("#accountno").focus();
	    return false;
	}
	else if ($("#accountno").val() != "" && $("#bankname").val() == "" ) {
	    $("#bankname-blank-alert").alert();
	    $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert").hide();
	    });
	    $("#bankname").focus();
	    return false;
	}
	else {
	    $('#branchname').focus();
	}
    });

    $("#branchname").change(function(event) {
	event.preventDefault();
	if($("#accounno").val() != "" && $("#bankname").val() != "" && $("#branchname").val() == "") {
	    $("#branchname-blank-alert").alert();
	    $("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#branchname-blank-alert").hide();
	    });
	    $("#branchname").focus();
	    return false;
	} else if($("#accountno").val() == "" && $("#branchname").val() != ""){ 
	    $("#accountno-blank-alert").alert();
	    $("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#accountno-blank-alert").hide();
	    });
	    $("#accountno").focus();
	    return false;
	}else if($("#bankname").val() == "" && $("#branchname").val() != ""){ 
	    $("#bankname-blank-alert").alert();
	    $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert").hide();
	    });
	    $("#bankname").focus();
	    return false;
	    }
	else {
	    $("#ifsc").focus();
	}
    });

    $("#ifsc").change(function(event) {
	event.preventDefault();
	if($("#accounno").val() != "" && $("#bankname").val() != "" && $("#branchname").val() != "" && $("#ifsc").val() == "") {
	    $("#ifsc-blank-alert").alert();
	    $("#ifsc-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#ifsc-blank-alert").hide();
	    });
	    $("#ifsc").focus();
	    return false;
	} else if($("#accountno").val() == "" && $("#ifsc").val() != ""){
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		});
	    $("#accountno").focus();
	    return false;
	} else if($("#bankname").val() == "" && $("#ifsc").val() != ""){
	    $("#bankname-blank-alert").alert();
	    $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert").hide();
	    });
	    $("#bankname").focus();
	    return false;
	} else if($("#branchname").val() == "" && $("#ifsc").val() != ""){
	    $("#branchname-blank-alert").alert();
	    $("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#branchname-blank-alert").hide();
	    });
	    $("#branchname").focus();
	    return false;
	} else {
	    $("#cussup_save").focus();
	} 
    });	

    
$(document).off("click",".state_del").on("click", ".state_del", function() {
  $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      if($('#gstintable tbody tr').length == 0){  // After deleting 0th row gives field to adding new gstin.
	  $('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
      }
      //After delete one row of gstin then attach '+' button to previous row.
      if(!($('.addbtn').is(':visible'))){
	  $('#gstintable tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
      }
      $('#gstintable tbody tr:last td:eq(0) select').focus().select();
  });
  $('#gstintable tbody tr:last td:eq(0) select').select();
});
  var delta = 500;
  var lastKeypressTime = 0;
  /*Customer/Supplier address field being a textarea pressing enter will shift the cursor on the new line
   instead of the next element. So the below function will detect the event where enter key is pressed twice
   and if so then shift the focus to the next element */
  $("#add_cussup_address").keydown(function(event) {
      if (event.which==13){
	  var thisKeypressTime = new Date();
	  if ( thisKeypressTime - lastKeypressTime <= delta )
	  {
              if ($.trim($("#add_cussup_address").val())=="") {
		  $("#address-blank-alert").alert();
		  $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		      $("#address-blank-alert").hide();
		  });
		  $("#add_cussup_address").focus();
		  return false;
              }
              $("#add_cussup_pin").focus();
              // optional - if we'd rather not detect a triple-press
              // as a second double-press, reset the timestamp
              thisKeypressTime = 0;
	  }
	  lastKeypressTime = thisKeypressTime;
      }
      if (event.which==9) {
	  event.preventDefault();
          if ($.trim($("#add_cussup_address").val())=="") {
              $("#address-blank-alert").alert();
              $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#address-blank-alert").hide();
            });
              $("#add_cussup_address").focus();
              return false;
	  }
          $("#add_cussup_pin").focus();
      }
    if (event.which==38) {
      event.preventDefault();
      $("#add_state").focus();
    }
  });
  $("#add_cussup_pin").keydown(function(event) {
    if (event.which==13) {
	  event.preventDefault();
		var pincode_val=($("#add_cussup_pin").val());
		var reg = /^[0-9]+$/;
	  if (pincode_val == "") {
		$("#pin-blank-alert").alert();
		$("#pin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pin-blank-alert").hide();
		});
		$("#add_cussup_pin").focus();
		return false;
			}
	else if (!reg.test(pincode_val) || pincode_val.length != 6) {
			$("#pinval-blank-alert").alert();
			$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pinval-blank-alert").hide();
			});
			$("#add_cussup_pin").focus();
			return false;
			}
			$("#add_cussup_fax").focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_address").focus().select();
    }
  });
  $("#add_cussup_fax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_pin").focus().select();
    }
  });
  $("#add_cussup_pan").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
	var txtpan = $(this).val();
	if ((txtpan.length != 10 || !txtpan.match(regExp)) && $.trim($("#add_cussup_pan").val())!="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#add_cussup_pan").focus();
	}
	else {
	    if($("#vatorgstflag").val() == '22' || $("#vatorgstflag").val() == '29'){
		$("#add_cussup_tan").focus();
	    }
	    else {
		$(".gstinstate:first").focus();
	    }
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_fax").focus().select();
    }
  });

    $("#add_cussup_pan").change(function(event) {
	var regExp_change = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
	var txtpan_change = $(this).val();
	$(".panno").prop("disabled",false); 
	if ((txtpan_change.length != 10 || !txtpan_change.match(regExp_change)) && $.trim($("#add_cussup_pan").val())!="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
		$("#add_cussup_pan").focus();
	    });
	}
	else{
	    if($.trim($("#add_cussup_pan").val())!=""){
		$(".panno").val($("#add_cussup_pan").val());
		$(".panno").prop("disabled",true);
	    }else{
		$(".panno").val("");
		$(".panno").prop("disabled",false);
	    }
	}
    });

    $("#add_cussup_tan").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if($("#vatorgstflag").val() == '22'){
	    if ($.trim($("#add_cussup_tan").val())=="") {
		$("#tin-blank-alert").alert();
		$("#tin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tin-blank-alert").hide();
		});
		$("#add_cussup_tan").focus();
		return false;
            } else if($("#add_cussup input:radio:checked").val() == '19'){
		$("#checkbnk").focus();
	    } else {
	      $("#cussup_save").focus();
	  }
	} else{
	    $(".gstinstate:first").focus();
	}
   }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
    });
  $("#add_cussup_reset").click(function(event) {
	  sessionStorage.cussup=1;
      // click the customer/supplier create tab to reload the current page in tab creating a reset effect
      $("#customersupplier_create").click();
  });

    $(document).off("keyup").on("keyup", function(event) {
        if(event.which == 45) {
	    event.preventDefault();
            $("#cussup_save").click();
        }
    });
    
    $("#cussup_save").click(function(event) {
      //save event for saving the customer/supplier
      event.preventDefault();
	var allow = 1;
	var custsupdata=$("#add_cussup input:radio:checked").val(); //select with option either customer or supplier
    // custsupdata = 3 if customer or 19 if supplier
	var groupcode = -1;
	var cuss_pan = $("#add_cussup_pan").val();
        var panno1= $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();
	var regExp1 = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
	var curindex1 = $(this).closest('tr').index();
	gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
   
    	email = $("#add_cussup_email").val();  // Validation for email.
	if ((!email.match(emailExp)) && email!="") {
	    $("#email-improper-alert").alert();
            $("#email-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#email-improper-alert").hide();
            });
	    $("#add_cussup_email").focus().select();
	    return false;
	}
	    if ((cuss_pan.length != 10 || !cuss_pan.match(regExp1)) && cuss_pan !="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#add_cussup_pan").focus();
	    return false;
	}

    if (custsupdata == '3'){
      groupcode = $("#debtgroupcode").val();
    }
    else {
      groupcode = $("#credgroupcode").val();
    }
	// Validation for bank details

	  if ($("#checkbnk").is(":checked")) {
	  if($("#accountno").val()=="" || $("#bankname").val()=="" || $("#branchname").val()=="" || $("#ifsc").val()=="" ) {
	      $("#allbank-blank-alert").alert();
	      $("#allbank-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#allbank-blank-alert").hide();
	      });
	      $("#accountno").focus();
	      return false;
	  }
      }
	if (!($("#accountno").val() == "" && $("#bankname").val() == "" && $("#branchname").val() == "" && $("#ifsc").val() == "")){
	   if ($("#accountno").val() == "" || $("#bankname").val() == "" || $("#branchname").val() == "" || $("#ifsc").val() == ""){
	    $("#allbank-blank-alert").alert();
	    $("#allbank-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#allbank-blank-alert").hide();
	    });
	    $("#accountno").focus();
	       return false;
	   }
	}
    //validations to check if none of the required fields are left blank
	    
    if ($.trim($("#add_cussup input:radio:checked").val())=="") {
      $("#cussup-blank-alert").alert();
      $("#cussup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#cussup-blank-alert").hide();
      });
      $(".gstinstate").focus();
      return false;
    }

    if ($.trim($("#add_cussup_name").val())=="") {
	if($("#add_cussup input:radio:checked").val() == '3'){
		$("#custname-blank-alert").alert();
		$("#custname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){    
		    $("#custname-blank-alert").hide();
		});
	    } else {
		$("#supname-blank-alert").alert();
		$("#supname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){    
		    $("#supname-blank-alert").hide();
		});
	    }
      $("#add_cussup_name").focus();
      return false;
    }

if($("#vatorgstflag").val() == '22'){
 if ($.trim($("#add_cussup_tan").val())=="") {
      $("#tin-blank-alert").alert();
      $("#tin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tin-blank-alert").hide();
      });
      $("#add_cussup_tin").focus();
      return false;
    }
}

    if ($.trim($("#add_state").val())=="") {
      $("#state-blank-alert").alert();
      $("#state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#state-blank-alert").hide();
      });

      $("#add_state").focus();
      return false;
    }
    if ($.trim($("#add_cussup_address").val())=="") {
      $("#address-blank-alert").alert();
      $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#address-blank-alert").hide();
      });
      $("#add_cussup_address").focus();
      return false;
	}

	//Validation for pin code number
	var pincode_val=($("#add_cussup_pin").val());
	var reg = /^[0-9]+$/;
	if (pincode_val == "") {
		$("#pin-blank-alert").alert();
		$("#pin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#pin-blank-alert").hide();
		});
		$("#add_cussup_pin").focus();
		return false;
	  }
	else if (!reg.test(pincode_val) || pincode_val.length != 6) {
			$("#pinval-blank-alert").alert();
			$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pinval-blank-alert").hide();
			});
			$("#add_cussup_pin").focus();
			return false;
			}
				
	
    var gobj = {}; // Creating a dictionary for storing statecode with gstin.
      $("#gstintable tbody tr").each(function(){
	  var curindex1 = $(this).index();
	  var panno1= $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();
    if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid"))!="") {
	gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
        var lastleg = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();

	if (curindex1 != 0 && lastleg != ""){
	//Validation for GSTIN on save button 
	if((panno1.length != 10 || !panno1.match(regExp1)) && panno1 !="" ) {
	    $("#gstin-improper-alert").alert();
	    $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-alert").hide();
		$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').focus();
	    });
	    allow = 0;
	    return false;
	}
	else if(panno1 =="" && $(".gstin").val() !=""){
	    $("#gstin-improper-alert").alert();
	    $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-alert").hide();
	    });
	    allow = 0;
	    $(".panno").focus();
	    return false;
	}
	else if(panno1 !="" && $(".gstin").val() ==""){
	    $("#gstin-improper-alert").alert();
	    $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-alert").hide();
	    });
	    allow = 0;
	    $(".gstin").focus();
	    return false;
	}else if(panno1 !="" && lastleg.length != 3){
	    $("#gstin-improper-alert").alert();
	    $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-alert").hide();
	    });
	    allow = 0;
	    $(".gstin").focus();
	    return false;
	}
}
	if(gstinstring.length == 15){
            gobj[$('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid")] = gstinstring;
	}
    }
      });
      var custtan  = "";
      if ($("#add_cussup_tan").length > 0) {
	  custtan = $("#add_cussup_tan").val();
	  } 
	var form_data = new FormData();
	form_data.append("custname", $("#add_cussup_name").val());
	form_data.append("custaddr", $.trim($("#add_cussup_address").val()));
	form_data.append("pincode", $("#add_cussup_pin").val());
	form_data.append("custphone", $("#add_cussup_phone").val());
	form_data.append("custemail", $("#add_cussup_email").val());
	form_data.append("custfax", $("#add_cussup_fax").val());
	form_data.append("custpan", $("#add_cussup_pan").val());
	form_data.append("custtan", custtan);
	form_data.append("state", $("#add_state").val());
	form_data.append("csflag", $("#add_cussup input:radio:checked").val());
	if ($("#add_cussup input:radio:checked").val() == "19"){
	    var bankdetails = {}; //for bank details
	if ($.trim($("#accountno").val()) != "" && $.trim($("#bankname").val()) !="" && $.trim($("#ifsc").val()) !="" && $.trim($("#branchname").val()) !=""){
	    bankdetails["accountno"] = $.trim($("#accountno").val());
	    bankdetails["bankname"] = $.trim($("#bankname").val());
	    bankdetails["ifsc"] = $.trim($("#ifsc").val());
	    bankdetails["branchname"] = $.trim($("#branchname").val());
	    form_data.append("bankdetails", JSON.stringify(bankdetails));
	}
	}
		if(!($.isEmptyObject( gobj ))){
			form_data.append("gstin", JSON.stringify(gobj));
		}
    // ajax call for saving the customer/supplier
	if (allow == 1){
		var csflag = $("#add_cussup input:radio:checked").val();
	  $.ajax({
	      url: '/customersuppliers?action=save',
	      type: 'POST',
	      global: false,
              contentType: false,
              cache: false,
              processData: false,
	      dataType: 'json',
	      async : false,
	      data: form_data,
	      beforeSend: function(xhr)
	      {
		  xhr.setRequestHeader('gktoken', sessionStorage.gktoken); //attaching the jwt token in the header
	      }
	  })
	      .done(function(resp) {
		  if(resp["gkstatus"] == 0){
		      allow = 0;
		      $.ajax(
			  {

			      type: "POST",
			      url: "/addaccount",
			      global: false,
			      async: false,
			      datatype: "json",
			      data: {"accountname":$("#add_cussup_name").val(),"openbal":0,"subgroupname":groupcode},
			      beforeSend: function(xhr)
			      {
				  xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
			      },
			      success: function(resp)
			      {
				  if(resp["gkstatus"]==0)
				  {
					  $("#customersupplier_create").click();
				      $("#add_cussup input:radio:checked").val(csflag);
				      if (custsupdata == '3') {
					  $("#cus-success-alert").alert();
					  $("#cus-success-alert").fadeTo(2250, 500).slideUp(500, function(){
					      $("#cus-success-alert").hide();
					  });

				      }
				      else  {
					  $("#sup-success-alert").alert();
					  $("#sup-success-alert").fadeTo(2250, 500).slideUp(500, function(){
					      $("#sup-success-alert").hide();
					  });

				      }
				      $('#custsupmodal').modal('hide');
				      $('.modal-backdrop').remove();
				      return false;
				  }
			      }
			  }
		      );
		      return false;
		  }
		  if(resp["gkstatus"] ==1){
		      // gkstatus 1 implies its a duplicate entry.
		      $("#add_cussup_name").focus();
		      $("#cus-duplicate-alert").alert();
		      $("#cus-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
			  $("#cus-duplicate-alert").hide();
		      });
		      return false;
		  }
		  else {
		      $("#add_cussup input:radio:checked").focus();
		      $("#failure-alert").alert();
		      $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
			  $("#failure-alert").hide();
		      });
		      return false;
		  }
	      })
	      .fail(function() {
		  console.log("error");
	      })
	      .always(function() {
		  console.log("complete");
	      });
	}
	$("#add_cussup input:radio:checked").change();
    });
	$("#my-file-selector").change(function(event) {
	  $('#upload-file-info').html($(this).val());
	  if ($("#my-file-selector").val()=='') {
		$("#import-blank-alert").alert("");
		$("#import-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#import-blank-alert").hide();
		});
		return false;
	  }
	  $("#import-error-modal").on('shown.bs.modal', function(event) {
		$('#import-error-modal .modal-body').scrollTop(0);
		$('#import-error-modal .modal-body').scrollLeft(0);
	  });
	  $('#confirm_yes_print').modal('show').one('click', '#tn_save_yesprint', function (e)
	  {
	  var form_data = new FormData();
	  var file = $("#my-file-selector")[0].files[0];
	  form_data.append("xlsxfile",file);
	  $("#msspinmodal").modal("show");
	  $.ajax({
		type: "POST",
		url: "/import?action=cussupimport",
		global: false,
		contentType: false,
		cache: false,
		processData: false,
		async: false,
		datatype: "json",
		data: form_data,
		beforeSend: function(xhr)
		{
		  xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
		},
	  })
	  .done(function(resp) {
		if (resp["gkstatus"]==0) {
		  $("#filename").html($("#my-file-selector").val());
		  $("#my-file-selector").val("");
		  $("#upload-file-info").html("");
		  $("#msspinmodal").modal("hide");
		  $("#import-success-alert").alert();
		  $("#import-success-alert").fadeTo(2250, 400).slideUp(500, function(){
			$("#import-success-alert").hide();
		  });
		  return false;
		}
		else if(resp["gkstatus"]==6){
			$("#msspinmodal").modal("hide");
			$("#import-error-modal").modal("show");
			var custable=document.querySelector("#cus-errors");
			while(custable.firstChild)
			{
				custable.removeChild(custable.firstChild);
			}
			rowcount=0
			for (var key in resp["errorRows"]["Customers"])
			{
				var tr = document.createElement("tr");  
				rowcount=key;
				tr.setAttribute("data-row",rowcount);
				colcount=1                  
				var td = document.createElement("td");
				td.textContent=key;         
				td.setAttribute("column-id",(rowcount).toString()+(colcount++).toString()); 
				td.textContent=key;
				tr.appendChild(td); 
				for(cell in resp["errorRows"]["Customers"][key])
				{
					var td = document.createElement("td");
					td.textContent=key;         
					td.setAttribute("column-id",(rowcount).toString()+(colcount++).toString()); 
					td.textContent=resp["errorRows"]["Customers"][key][cell];
					tr.appendChild(td);         
				}
				custable.appendChild(tr);
			}
			var suptable=document.querySelector("#sup-errors");
			while(suptable.firstChild)
			{
				suptable.removeChild(suptable.firstChild);
			}
			rowcount=0
			for (var key in resp["errorRows"]["Suppliers"])
			{
				var tr = document.createElement("tr");  
				rowcount=key;
				tr.setAttribute("data-row",rowcount);
				colcount=1                  
				var td = document.createElement("td");
				td.textContent=key;         
				td.setAttribute("column-id",(rowcount).toString()+(colcount++).toString()); 
				td.textContent=key;
				tr.appendChild(td); 
				for(cell in resp["errorRows"]["Suppliers"][key])
				{
					var td = document.createElement("td");
					td.textContent=key;         
					td.setAttribute("column-id",(rowcount).toString()+(colcount++).toString()); 
					td.textContent=resp["errorRows"]["Suppliers"][key][cell];
					tr.appendChild(td);         
				}
				suptable.appendChild(tr);
			}
			if(resp["dupFlag"]==false)
			{
				$("#errormsg").html("Please fix the following errors before import");
				for (var key in resp["errorTuples"]["Customers"])
				{
					row=resp["errorTuples"]["Customers"][key][1].toString();
					column=(resp["errorTuples"]["Customers"][key][0].charCodeAt(0)-65+2).toString();
					element=row+column;
					$("#cus-errors").find("[column-id="+element+"]").attr("style","background-color:red;");
				}
				for (var key in resp["errorTuples"]["Suppliers"])
				{
					row=resp["errorTuples"]["Suppliers"][key][1].toString();
					column=(resp["errorTuples"]["Suppliers"][key][0].charCodeAt(0)-65+2).toString();
					element=row+column;
					$("#sup-errors").find("[column-id="+element+"]").attr("style","background-color:red;");
				}
			}
			else if(resp["dupFlag"]==true)
			{
				$("#errormsg").html("The following entries are duplicate");
			}
			if(resp["errorTuples"]["Customers"].length==0)
			{
				$("#customer-section").hide();
			}
			else
			{
				$("#customer-section").show();
			}
			if(resp["errorTuples"]["Suppliers"].length==0)
			{
				$("#supplier-section").hide();
			}
			else
			{
				$("#supplier-section").show();
			}
			return false;
		}
		else {
		  $("#msspinmodal").modal("hide");
		  $("#import-failure-alert").alert();
		  $("#import-failure-alert").fadeTo(2250, 400).slideUp(500, function(){
			$("#import-failure-alert").hide();
		  });
		  return false;
		}
	  })
	  .fail(function() {
		console.log("error");
	  })
	  .always(function() {
		console.log("complete");
	  });
	  });
  });
});
