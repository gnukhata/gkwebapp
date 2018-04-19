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
"Rohini Baraskar" <robaraskar@gmail.com>
"Prajkta Patkar"<prajakta@dff.org.in>
"Abhijith Balan"<abhijith@dff.org.in>
*/

$(document).ready(function() {
    $("#add_cussup_name").focus();
    var gstinstring = "";
    for(var i = 0; i < $("#gstintable tbody tr").length; i++) {
	$("#gstintable tbody tr:eq(" + i +") td:last").append('<a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
    }

  // Bankdetails will be hidden for Customer
  if($('#status').val()=='9'){
      $("#bankdetails").show();
      $("#textareahelplbl").hide();
  } else {
      $("#bankdetails").hide();
      $("#textareahelplbl").show();
  }

  $("#add_cussup_name").keydown(function(event) {
    if (event.which==13) {
    	if ($.trim($("#add_cussup_name").val())=="") {
            $("#name-blank-alert").alert();
            $("#name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#name-blank-alert").hide();
            });
            $("#add_cussup_name").focus();
            return false;
          }
          event.preventDefault();
          $("#add_cussup_email").focus().select();
        }
  });
     $("#checkbnkpop").click(function(e){
    if ($(this).is(":checked")) {
      $("#checkbnkpop").val(1);
      $("#bnkdetails").show();
    }
    else {
      $("#checkbnkpop").val(0);
      $("#bnkdetails").hide();
     
    }
     });
    $("#checkbnkpop").keydown(function(e){
	if (e.which == 13) {
	    e.preventDefault();
	    if ($(this).is(":checked")) {
		$("#cust_accountno").focus();
	    }
	    else {
		$("#cussup_save").focus();
	    }
	}
	else if(e.which == 38){
	    if ($("#vatorgstflag").val() == '22'){
		$("#add_cussup_tan").focus();
	    } else {
		$(".gstin").focus().select();
	    }
	}
  });
  $("#add_cussup_email").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_phone").focus().select();
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

     function pad(str, max) {
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
	$(".statecode").val(pad($("#add_state option:selected").attr("stateid"),2));
    });
    
    
$("#add_state").keydown(function(event) {
    if (event.which==13) {
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
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
  }
  else if (event.which==190 && event.ctrlKey) {
    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    event.preventDefault();
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
    $("#cussup_save").focus();
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
	panno = $(this).val();
	if (event.which == 13 || event.which ==9) {
	    event.preventDefault();
	    //Validation for PAN inside GSTIN.
	    if ((panno.length != 10 || !panno.match(regExp)) && panno !="") {
		$("#improper-gstin-alert").alert();
		$("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#improper-gstin-alert").hide();
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
	gstinstring = gstinstring = $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val();
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#improper-gstin-alert").alert();
		$("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#improper-gstin-alert").hide();
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
  if (event.which==13) {
      event.preventDefault();
      gstinstring = gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
      if($(".gstin").val()=="" && $(".panno").val()=="" /*|| $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val() == ""*/){
	  if($('#status').val()=='9'){
	      $("#checkbnkpop").focus();
	  } else {
	      $("#cussup_save").focus();
	  }
      }
      else if (curindex1 != ($("#gstintable tbody tr").length-1)) {
	  $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#improper-gstin-alert").alert();
		$("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#improper-gstin-alert").hide();
  		    $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').focus().select();
		});
  		return false;
            }
	}
      if (numberofstates > 0) {

        $('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        /*if (curindex1 == 0) {
          $("#gstintable tbody tr:last td:last").append('<a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
        }*/
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
    $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) input:eq(1)').focus();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
  }
  else if (event.which==27) {
      event.preventDefault();
      $("#cussup_save").focus();
  }
});

    // Keydown events for bank details
    $("#cust_accountno").numeric();
    $("#cust_accountno").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    $("#cust_bankname").focus();
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#checkbnkpop").focus();
	}

    });
    $("#cust_bankname").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if ($("#cust_accountno").val() != "" && $("#cust_bankname").val() == "" ) {
		$("#bankname-blank-alert-popup").alert();
		$("#bankname-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert-popup").hide();
		    $("#cust_bankname").focus();
		});
		return false;
	    } else if ($("#cust_accountno").val() == "" && $("#cust_bankname").val() != "" ) {
		$("#accountno-blank-alert-popup").alert();
		$("#accountno-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert-popup").hide();
		});
		$("#cust_accountno").focus();
		return false;
	    } else {
		$('#cust_branchname').focus();
	    }
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#cust_accountno").focus().select();
	}

    });
    $("#cust_branchname").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if($("#cust_accounno").val() != "" && $("#cust_bankname").val() != "" && $("#cust_branchname").val() == "") {
		$("#branchname-blank-alert").alert();
		$("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#branchname-blank-alert").hide();
		    $("#cust_branchname").focus();
		});
		return false;
	    } else if($("#cust_accountno").val() == "" && $("#cust_branchname").val() != ""){
		$("#accountno-blank-alert-popup").alert();
		$("#accountno-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert-popup").hide();
		    $("#cust_accountno").focus();
		});
		return false;
	    }else if($("#cust_bankname").val() == "" && $("#cust_branchname").val() != ""){
		$("#bankname-blank-alert-popup").alert();
		$("#bankname-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert-popup").hide();
		    $("#cust_bankname").focus();
		});
		return false;
	    } else {
		$("#cust_ifsc").focus();
	    }
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#cust_bankname").focus().select();
	}

    });
    $("#cust_ifsc").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if ($("#cust_accounno").val() != "" && $("#cust_bankname").val() != "" && $("#cust_branchname").val() != "" && $("#cust_ifsc").val() == "") {
		$("#ifsc-blank-alert-popup").alert();
		$("#ifsc-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#ifsc-blank-alert-popup").hide();
		    $("#cust_ifsc").focus();
		});
		return false;
	    } else if($("#cust_accountno").val() == "" && $("#cust_ifsc").val() != ""){
		$("#accountno-blank-alert-popup").alert();
		$("#accountno-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert-popup").hide();
		    $("#cust_accountno").focus();
		});
		return false;
	    } else if($("#cust_bankname").val() == "" && $("#cust_ifsc").val() != ""){
		$("#bankname-blank-alert-popup").alert();
		$("#bankname-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert-popup").hide();
		    $("#cust_bankname").focus();
		});
		return false;
	    } else if($("#cust_branchname").val() == "" && $("#cust_ifsc").val() != ""){
		$("#branchname-blank-alert").alert();
		$("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#branchname-blank-alert").hide();
		    $("#cust_branchname").focus();
		});
		return false;
	    } else {
		$("#cussup_save").focus();
	    } 
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#cust_branchname").focus().select();
	}

    });

    //change event for bank details
    $("#cust_bankname").change(function(event) {
	event.preventDefault();
	if ($("#cust_accountno").val() == "" && $("#cust_bankname").val() != "" ) {
	    $("#accountno-blank-alert-popup").alert();
	    $("#accountno-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		$("#accountno-blank-alert-popup").hide();
		$("#cust_accountno").focus();
	    });
	    return false;
	}
	else if ($("#cust_accountno").val() != "" && $("#cust_bankname").val() == "" ) {
	    $("#bankname-blank-alert-popup").alert();
	    $("#bankname-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert-popup").hide();
		$("#cust_bankname").focus();
	    });
	    return false;
	}
	else {
	    $('#cust_branchname').focus();
	}
	
    });

    $("#cust_branchname").change(function(event) {
	event.preventDefault();
	if($("#cust_accounno").val() != "" && $("#cust_bankname").val() != "" && $("#cust_branchname").val() == "") {//not working
	    $("#branchname-blank-alert").alert();
	    $("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#branchname-blank-alert").hide();
		$("#cust_branchname").focus();
	    });
	    return false;
	} else if($("#cust_accountno").val() == "" && $("#cust_branchname").val() != ""){ //working
	    $("#accountno-blank-alert-popup").alert();
	    $("#accountno-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		$("#accountno-blank-popup").hide();
		$("#cust_accountno").focus();
	    });
	    return false;
	}else if($("#cust_bankname").val() == "" && $("#cust_branchname").val() != ""){ //working
	    $("#bankname-blank-alert-popup").alert();
	    $("#bankname-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert-popup").hide();
		$("#cust_bankname").focus();
	    });
	    return false;
	    }
	else {
	    $("#cust_ifsc").focus();
	}
	
    });

    $("#cust_ifsc").change(function(event) {
	event.preventDefault();
	if($("#cust_accounno").val() != "" && $("#cust_bankname").val() != "" && $("#cust_branchname").val() != "" && $("#cust_ifsc").val() == "") {
	    $("#ifsc-blank-alert-popup").alert();
	    $("#ifsc-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		$("#ifsc-blank-alert-popup").hide();
		$("#cust_ifsc").focus();
	    });
	    return false;
	} else if($("#cust_accountno").val() == "" && $("#cust_ifsc").val() != ""){
		$("#accountno-blank-alert-popup").alert();
		$("#accountno-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert-popup").hide();
		    $("#cust_accountno").focus();
		});
	    return false;
	} else if($("#cust_bankname").val() == "" && $("#cust_ifsc").val() != ""){
	    $("#bankname-blank-alert-popup").alert();
	    $("#bankname-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert-popup").hide();
		$("#cust_bankname").focus();
	    });
	    return false;
	} else if($("#cust_branchname").val() == "" && $("#cust_ifsc").val() != ""){
	    $("#branchname-blank-alert").alert();
	    $("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#branchname-blank-alert").hide();
		$("#cust_branchname").focus();
	    });
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
    if (event.which==13)
    {
      var thisKeypressTime = new Date();
      if ( thisKeypressTime - lastKeypressTime <= delta )
      {
          if ($.trim($("#add_cussup_address").val())=="") {
            $("#address-blank-alert-popup").alert();
            $("#address-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
              $("#address-blank-alert-popup").hide();
            });
            $("#add_cussup_address").focus();
            return false;
          }
        $("#add_cussup_fax").focus();
        // optional - if we'd rather not detect a triple-press
        // as a second double-press, reset the timestamp
        thisKeypressTime = 0;
      }
      lastKeypressTime = thisKeypressTime;
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_state").focus();
    }
  });
  $("#add_cussup_fax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_address").focus().select();
    }
  });
    
  $("#add_cussup_pan").keydown(function(event) {
      if (event.which==13) {
      event.preventDefault();
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; //regEx for PAN
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
	var regExp_change = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; //regEx for PAN
	var txtpan_change = $(this).val();
	if ((txtpan_change.length != 10 || !txtpan_change.match(regExp_change)) && $.trim($("#add_cussup_pan").val())!="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
		$("#add_cussup_pan").focus();
	    });
	}
	else{
	    $(".panno").val($("#add_cussup_pan").val());
	    $(".panno").prop("disabled",true);
	}
    });

    /*
    $("#add_cussup_tan").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if($("#vatorgstflag") == '22'){
          $("#cussup_save").focus();
}
else{
	$(".gstinstate:first").focus();
 }

   }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
    });
    $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#cussup_save").click();
      event.preventDefault();
      return false;
    }
    }); */

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
		}
           else if($("#add_cussup").val() == '19'){
		$("#checkbnkpop").focus();
	    } else {
	      $("#cussup_save").focus();
	  }
}
else{
	$(".gstinstate:first").focus();
 }

   }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
    });

  $("#cussup_save").click(function(event) {
      //save event for saving the customer/supplier
      event.preventDefault();
      //Validation for PAN
        var allow = 1;
        var cuss_pan = $("#add_cussup_pan").val();
        var panno1= $(".panno").val();
	var regExp1 = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    
	if ((cuss_pan.length != 10 || !cuss_pan.match(regExp1)) && cuss_pan !="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#add_cussup_pan").focus();
	    return false;
	}
      
    var custsupval;
      if ($("#deliverychallan_gkstatus").val()=='in' || $('#status').val()=='9' || $("#status").val()=="16" ){
      custsupval= 19;
    }
    else {
      custsupval = 3 ;
    }
    // custsupval= 3 if customer or 19 if supplier

    var groupcode = -1;
    if (custsupval == '3'){
      groupcode = $("#debtgroupcode").val();
    }
    else {
      groupcode = $("#credgroupcode").val();
    }

    if ($.trim($("#add_cussup_name").val())=="") {
      $("#name-blank-alert").alert();
      $("#name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#name-blank-alert").hide();
      });
      $("#add_cussup_name").focus();
      return false;
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
      $("#address-blank-alert-popup").alert();
      $("#address-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
        $("#address-blank-alert-popup").hide();
      });
      $("#add_cussup_address").focus();
      return false;
    }

      // Validation for bank details
	if (!($("#cust_accountno").val() == "" && $("#cust_bankname").val() == "" && $("#cust_branchname").val() == "" && $("#cust_ifsc").val() == "")){
	   if ($("#cust_accountno").val() == "" || $("#cust_bankname").val() == "" || $("#cust_branchname").val() == "" || $("#cust_ifsc").val() == ""){
	    $("#allbank-blank-alert").alert();
	    $("#allbank-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#allbank-blank-alert").hide();
	    });
	    $("#cust_accountno").focus();
	       return false;
	  }
	}
      
      var gobj = {}; // Creating a dictionary for storing statecode with gstin.
      $("#gstintable tbody tr").each(function(){
	  var curindex1 = $(this).index();
	  var panno1= $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();
	  var gstin1= $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
    if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid"))!="") {
	gstinstring = gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
	
	if((panno1.length != 10 || !panno1.match(regExp1)) && panno1 !="" ) {
	    $("#improper-gstin-alert").alert();
	    $("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#improper-gstin-alert").hide();
		$(".gstin").focus();
	    });
	    allow = 0;
	    return false;
	}
	else if(panno1 !="" && gstin1 ==""){
	    $("#improper-gstin-alert").alert();
	    $("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#improper-gstin-alert").hide();
		$(".gstin").focus();
	    });
	    allow = 0;
	    return false;
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
	form_data.append("custphone", $("#add_cussup_phone").val());
	form_data.append("custemail", $("#add_cussup_email").val());
	form_data.append("custfax", $("#add_cussup_fax").val());
	form_data.append("custpan", $("#add_cussup_pan").val());
	form_data.append("custtan", custtan);
	form_data.append("gstin", JSON.stringify(gobj));
	form_data.append("state", $("#add_state").val());
	form_data.append("csflag", $("#add_cussup").val());
	if ($("#status").val() == "9"){
	    var bankdetails = {}; //dictionary for bank details
	if ($.trim($("#accountno").val()) != "" && $.trim($("#bankname").val()) !="" && $.trim($("#ifsc").val()) !="" && $.trim($("#branchname").val()) !=""){
	    bankdetails["accountno"] = $.trim($("#accountno").val());
	    bankdetails["bankname"] = $.trim($("#bankname").val());
	    bankdetails["ifsc"] = $.trim($("#ifsc").val());
	    bankdetails["branchname"] = $.trim($("#branchname").val());
	    form_data.append("bankdetails", JSON.stringify(bankdetails));
	}
	}
        form_data.append("csflag", custsupval);
      // ajax call for saving the customer/supplier
      if(allow == 1){
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
	    allow =0;
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
		var customeradded = $("#add_cussup_name").val();
                $('#selectedcustsup').val(customeradded);

            //    $('#selectedcustsup').val($.trim($("#add_cussup_name").val()));
                      if (custsupval == '3') {
                  $("#cus-success-alert").alert();
                  $("#cus-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $('#custsupmodal').modal('hide');
                    $('.modal-backdrop').remove();
                    $("#cus-success-alert").hide();
                  });

                }
                else  {
                  $("#sup-success-alert").alert();
                  $("#sup-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $('#custsupmodal').modal('hide');
                    $('.modal-backdrop').remove();
                    $("#sup-success-alert").hide();
                  });

                }
              return false;
              }
            }
          });
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
        $("#add_cussup").focus();
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
    event.stopPropagation(); // stoopping the event for unnecessarily repeating itself
  });
});
