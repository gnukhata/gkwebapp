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
"Abhijith Balan" <abhijithb21@openmailbox.org.in>
"Sachin Patil" <sachin619patil@rediffmail.com>
"Bhavesh Bhawadhane" <bbhavesh07@gmail.com>
"Prajkta Patkar" <prajkta.patkar007@gmail.com>
"Reshma Bhatawadekar" <bhatawadekar1reshma@gmail.com>
"Sanket Kolnoorkar" <sanketf123@gmail.com>
"Nitesh Chaughule" <nitesh@disroot.org>
*/

$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#edit_cussup_list").focus();
  $("#edit_cussup_reset").hide();  
    $(".panel-footer").hide();
    $("#custradio").focus();    
    $("#suppl").hide();
    $("#scrollbar").hide();
    	var custid;
	$("#moresmall").on('shown.bs.collapse', function(event) {
        event.preventDefault();
        $("#smalllink").html('See less. <span class="glyphicon glyphicon-triangle-top"></span>');
    });
    $("#moresmall").on('hidden.bs.collapse', function(event) {
        event.preventDefault();
        $("#smalllink").html('See more. <span class="glyphicon glyphicon-triangle-bottom"></span>');
	});
	
    var gstinstring = ""; //for concatination of 'gstin'.
     for(var i = 0; i < $("#gstintable tbody tr").length; i++) {
	$("#gstintable tbody tr:eq(" + i +") td:last").append('<div style="text-align: center;"><a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
    }
    var custsupdata = $("#edit_cussup").val();
	
    //code for change event of edit lists custid as variable taken and conditions are applied. condition is set to call ajax only if custid is not null.
	$(".editcustomerlist-option, .editsupplierlist-option").click(function(event) {
	$("#edit_cussup_reset").hide();
	 if ($("#custradio").is(":checked"))
	{
		$("#editcustomerlist").data("value", $(this).data("value"));
		$("#editcustomerlist").text($(this).text());
		$("#editcustomerlist").focus();
		custid=$("#editcustomerlist").data('value');
	}
	else  {
		$("#editsupplierlist").data("value", $(this).data("value"));
		$("#editsupplierlist").text($(this).text());
		$("#editsupplierlist").focus();
	    custid=$("#editsupplierlist").data('value');

	}
	 	if (custid!=''){
	$.ajax({
	    url: '/customersuppliers?action=get',
	    type: 'POST',
	    dataType: 'json',
	    async : false,
	    data: {"custid": custid},
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    }
	})
	    .done(function(resp) {
		var result = resp["gkresult"];
		$(".hidden-load").show();
		$('#gstintable tbody tr:last td:eq(2)').empty();
		var rowhtml = $('#gstintable tbody tr:first').html();
		$("#edit_cussup").val(result["csflag"]);
		if(result["csflag"] == 3){
		    $("#edit_cussup").val("Customer");
		    $("#edit_bankdetails").hide();
		    $(".custlbl").show();
		    $(".suplbl").hide();
		    $("#textareahelp3").hide();
		    $("#textareahelp2").show();
		}
		else {
    		    $("#edit_cussup").val("Supplier");
		    $("#edit_bankdetails").show();
		    if (result["bankdetails"]["accountno"]) {
			$("#bankcheckboxdiv").hide();
			$("#bankdetailslabel").show();
			$("#bankdetailsdiv").show();
		    }
		    else{
			$("#bankcheckboxdiv").show();
			$("#bankdetailslabel").hide();
			$("#bankdetailsdiv").hide();
		    }
		    $(".suplbl").show();
		    $(".custlbl").hide();
		    $("#textareahelp3").show();
		    $("#textareahelp2").hide();
		    
		}
	$("#edit_cussup").prop("disabled", true);
	$("#edit_cussup_name").val(result["custname"]);
	$("#edit_cussup_name").prop("disabled", true);
	$("#edit_cussup_email").val(result["custemail"]);   
	$("#edit_cussup_email").prop("disabled", true);
	$("#edit_cussup_phone").val(result["custphone"]);
	$("#edit_cussup_phone").prop("disabled", true);
	$("#edit_cussup_address").val(result["custaddr"]);
	$("#edit_cussup_address").prop("disabled", true);   
	$("#edit_state").val(result["state"]);
	$("#edit_state").prop("disabled", true);
	$("#edit_cussup_fax").val(result["custfax"]);
	$("#edit_cussup_fax").prop("disabled", true);
	$("#edit_cussup_pin").val(result["pincode"]);
	$("#edit_cussup_pin").prop("disabled", true);
	$("#edit_cussup_pan").val(result["custpan"]);
	$("#edit_cussup_pan").prop("disabled", true);
	$("#edit_cussup_tan").val(result["custtan"]);
	$("#edit_cussup_tan").prop("disabled", true);
	//fetching bank details.	
	$("#edit_accountno").val(result["bankdetails"]["accountno"]);
	$("#edit_accountno").prop("disabled", true);
	$("#edit_bankname").val(result["bankdetails"]["bankname"]);
	$("#edit_bankname").prop("disabled", true);
	$("#edit_branchname").val(result["bankdetails"]["branchname"]);
	$("#edit_branchname").prop("disabled", true);
	$("#edit_ifsc").val(result["bankdetails"]["ifsc"]);
	$("#edit_ifsc").prop("disabled", true);
	if(jQuery.isEmptyObject(result["gstin"])){
		$('#gstintable tbody').empty();
		$('#gstintable tbody').append('<tr>' + rowhtml + '</tr>');	
		$('#gstintable tbody tr:last td:eq(0) select option[stateid='+gstin+']').prop("selected", true);
		$('#gstintable tbody tr:last td:eq(1) input:eq(0)').val("");
		$('#gstintable tbody tr:last td:eq(1) input:eq(1)').val("");
		$('#gstintable tbody tr:last td:eq(1) input:eq(2)').val("");
	}else{
		$('#gstintable tbody').empty(); 
	    for(var gstin in result["gstin"]){
		var gstinstr = result["gstin"][gstin];
		$('#gstintable tbody').append('<tr>' + rowhtml + '</tr>');	
		$('#gstintable tbody tr:last td:eq(0) select option[stateid='+gstin+']').prop("selected", true);
		$('#gstintable tbody tr:last td:eq(1) input:eq(0)').val(gstinstr.substring(0, 2));
		$('#gstintable tbody tr:last td:eq(1) input:eq(1)').val(gstinstr.substring(2, 12));
		$('#gstintable tbody tr:last td:eq(1) input:eq(2)').val(gstinstr.substring(12, 15));
	    }
	}
	for(var i = 0; i < $("#gstintable tbody tr").length; i++) {
	    if (i > 0) {
		for(var k = i-1; k >= 0; k--) {
		    var selectedstate = $('#gstintable tbody tr:eq(' + k + ') td:eq(0) select option:selected').attr("stateid");
		    $('#gstintable tbody tr:eq(' + i + ') td:eq(0) select option[stateid='+selectedstate+']').prop("hidden", true).prop("disabled", true);
		}
	    }
	}
	$('#gstintable tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	$(".gstinstate, .statecode, .panno, .gstin, .state_del, .addbtn").prop("disabled", true);
      $(".panel-footer").show();
      $("#cus_innerdiv").show();
      $("#cussup_edit_save").hide();
	  $("#edit_cussup_btn").show();
      $(".state_del").hide();
	  
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

		}
	    else{
		$(".hidden-load").hide();
		$(".panel-footer").hide();
	    }
	});
	
	$("#editcustomerlist-input").keyup(function(event){
		let searchtext = $("#editcustomerlist-input").val().toLowerCase();
		if (searchtext != "") {
		  $(".editcustomerlist-option").each(function(index){
		if (index != -1) {
		  let rowtext = $(this).text().toLowerCase();
		  if (rowtext.indexOf(searchtext) != -1) {
			$(this).parent().show();
			$(this).show();
		  }
		  else {
			$(this).parent().hide();
			$(this).hide();
		  }
		}
		  });
		}
		else{
		  $(".editcustomerlist-option").each(function(index){
		$(this).parent().show();
		$(this).show();
		  });
		}
	  });
	
	  $(document).off('keydown' ,'#editcustomerlist-input').on('keydown' ,'#editcustomerlist-input',function(event) {
		if (event.which == 13 || event.which == 40){
		  event.preventDefault();
		  $("#editcustomerlist-input").parent().parent().find("a:visible").first().focus();
		}
	  });

	  $("#editsupplierlist-input").keyup(function(event){
		let searchtext = $("#editsupplierlist-input").val().toLowerCase();
		if (searchtext != "") {
		  $(".editsupplierlist-option").each(function(index){
		if (index != -1) {
		  let rowtext = $(this).text().toLowerCase();
		  if (rowtext.indexOf(searchtext) != -1) {
			$(this).parent().show();
			$(this).show();
		  }
		  else {
			$(this).parent().hide();
			$(this).hide();
		  }
		}
		  });
		}
		else{
		  $(".editsupplierlist-option").each(function(index){
		$(this).parent().show();
		$(this).show();
		  });
		}
	  });
	
	  $(document).off('keydown' ,'#editsupplierlist-input').on('keydown' ,'#editsupplierlist-input',function(event) {
		if (event.which == 13 || event.which == 40){
		  event.preventDefault();
		  $("#editsupplierlist-input").parent().parent().find("a:visible").first().focus();
		}
	  });

	
	  $(".searchabledropdown").on("shown.bs.dropdown", function () {
		let searchinput = $(this).data("input-id");
		document.getElementById(searchinput).focus();
	  });
	
    
  $("#editcustomerlist").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
	  $("#edit_cussup_btn").click();
      $("#edit_cussup_name").focus().select();
	}
	else {
		if (!$("#editcustomerlist").hasClass("open")){
	  $("#editcustomerlist").click();
		}
	}
  });

    $("#editsupplierlist").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
	  $("#edit_cussup_btn").click();
      $("#edit_cussup_name").focus().select();
	}
	else {
		if (!$("#editsupplierlist").hasClass("open")){
	  $("#editsupplierlist").click();
		}
	}	
  });
    
  $("#edit_cussup_name").keydown(function(event) {
    if (event.which==13||event.which==9) {
    	if ($.trim($("#edit_cussup_name").val())=="") {
	    if ($("#edit_cussup").val() == "Supplier"){
		$("#supname-blank-alert").alert();
		$("#supname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#supname-blank-alert").hide();
            });
	    } else {
		$("#custname-blank-alert").alert();
		$("#custname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#custname-blank-alert").hide();
            });
	    }
            $("#edit_cussup_name").focus();
            return false;
          }
          event.preventDefault();
          $("#edit_cussup_email").focus().select();
        }
  });
      var editemailExp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var editemail="";
    
  $("#edit_cussup_email").keydown(function(event) {
    if (event.which==13 || event.which==9) {
	event.preventDefault();
	editemail = $(this).val();
		if ((!editemail.match(editemailExp)) && editemail!= "") {
		    $("#email-editimproper-alert").alert();
		    $("#email-editimproper-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#email-editimproper-alert").hide();
			$("#edit_cussup_email").focus().select();
		    });
		}
	else{	    
	    $("#edit_cussup_phone").focus().select();
	    return false;
	}
    }
    if (event.which==38){
      event.preventDefault();
      $("#edit_cussup_name").focus().select();
    }
  });
  $("#edit_cussup_phone").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_state").focus().select();
    }
    if (event.which==38){
      event.preventDefault();
      $("#edit_cussup_email").focus().select();
    }
  });

    //Function to add leading zeros in date and month fields.
    /**function pad(str, max) { //to add leading zeros in date
	if (str && str!="") {
	    str = str.toString();
	    if (str.length == 1) {
		return str.length < max ? pad("0" + str, max) : str;
	    }
	    else {
		return str;
	    }
	}
    }**/

  //Change event for 'state'.
  /**$("#edit_state").change(function(event) {
      var availstate =  $("#edit_state").val();
      $('#gstintable tbody tr:last td:eq(0) select').val(availstate);
      $('#gstintable tbody tr:last td:eq(1) input:eq(0)').val(pad($("#edit_state option:selected").attr("stateid"), 2));
  });**/
    
  $("#edit_state").keydown(function(event) {
    if (event.which==13||event.which==9) {
      event.preventDefault();
      if ($.trim($("#edit_state").val())=="") {
        $("#state-blank-alert").alert();
        $("#state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#state-blank-alert").hide();
        });

        $("#edit_state").focus();
        return false;
      }
      $("#edit_cussup_address").focus().select();
    }
    if (event.which==38 && $("#edit_state option:selected").index()==0) {
      event.preventDefault();
      $("#edit_cussup_phone").focus().select();
    }
  });
  var delta = 500;
  var lastKeypressTime = 0;
  $("#edit_cussup_address").keydown(function(event) {
    if (event.which==13) {
      var thisKeypressTime = new Date();
	if ( thisKeypressTime - lastKeypressTime <= delta ){
	
	if ($.trim($("#edit_cussup_address").val())=="") {
          $("#address-blank-alert").alert();
          $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#address-blank-alert").hide();
          });
          $("#edit_cussup_address").focus();
          return false;
        }
        $("#edit_cussup_pin").focus();
        // optional - if we'd rather not detect a triple-press
        // as a second double-press, reset the timestamp
        thisKeypressTime = 0;
      }
      lastKeypressTime = thisKeypressTime;
    }
      if(event.which==9) {
	  event.preventDefault();
	  if($.trim($("#edit_cussup_address").val())=="") {
              $("#address-blank-alert").alert();
              $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#address-blank-alert").hide();
              });
              $("#edit_cussup_address").focus();
              return false;
          }
          $("#edit_cussup_pin").focus();
      }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_state").focus();
    }
  });
  $("#edit_cussup_pin").keydown(function(event) {
    if (event.which==13) {
	  event.preventDefault();
	  var pincode_val=$("#edit_cussup_pin").val();
	  var reg = /^[0-9]+$/;
	  if (pincode_val == "") {
		$("#pin-blank-alert").alert();
		$("#pin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pin-blank-alert").hide();
		});
		$("#edit_cussup_pin").focus();
		return false;
			}
	else if (!reg.test(pincode_val) || pincode_val.length != 6) {	
		$("#pinval-blank-alert").alert();
		$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pinval-blank-alert").hide();
		});
		$("#edit_cussup_pin").focus();
		return false;
	}	
			$("#edit_cussup_fax").focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_cussup_address").focus().select();
    }
  });
  $("#edit_cussup_fax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_cussup_pan").focus().select();
    }
    if (event.which==38){
      event.preventDefault();
      $("#edit_cussup_pin").focus().select();
    }
  });

  /**$("#edit_cussup_pan").change(function(event) {
      var regExp1 = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
      var txtpan1 = $(this).val();
      if($.trim($("#edit_cussup_pan").val())!=""){
	  $('#gstintable tbody tr:last td:eq(1) input:eq(1)').val($("#edit_cussup_pan").val());
	  $(".panno").prop("disabled",true);
      }else{
	  $(".panno").val("");
	  $(".panno").prop("disabled",false);
      }
  });**/
    
  $("#edit_cussup_pan").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; //Regular expression for PAN
	var txtpan = $(this).val();
	if ((txtpan.length != 10 || !txtpan.match(regExp)) && $.trim($("#edit_cussup_pan").val())!="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#edit_cussup_pan").focus();
	}
	else {
	    if($("#vatorgstflag").val() == '22' || $("#vatorgstflag").val() == '29'){
		$("#edit_cussup_tan").focus();
	    }
	    else {
			if($("#gstintable tbody tr:eq(0) td:eq(0) select").is(":disabled") ){
				$("#cussup_edit_save").focus();
		}
		else{
			$(".gstinstate:first").focus();
		}
	}
	}
    }
    if (event.which==38){
      event.preventDefault();
      $("#edit_cussup_fax").focus().select();
    }
  });
  $("#edit_cussup_tan").keydown(function(event) {
      if (event.which==13) {
	  event.preventDefault();
	 if($("#vatorgstflag").val() == '22'){
    	if ($.trim($("#edit_cussup_tan").val())=="") {
            $("#tin-blank-alert").alert();
            $("#tin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#tin-blank-alert").hide();
            });
            $("#edit_cussup_tan").focus();
            return false;
        }}
          if($("#vatorgstflag").val() == '22'){
	      if($("#edit_cussup").val() == 'Supplier'){
		  $("#edit_accountno").focus();
	      } else {
		  $("#cussup_edit_save").focus();
	      }
	  }
	  else{
          $(".gstinstate:first").focus();
	  }
      }
        if (event.which==38) {
          event.preventDefault();
          $("#edit_cussup_pan").focus().select();
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
    $('#gstintable tbody tr:eq('+nextindex+') td:eq(0) select').focus();
  }
  else if (event.which==188 && event.shiftKey) {
	event.preventDefault();
	if(curindex == 0){
		$("#edit_cussup_pan").focus();
	}
	else{
    $('#gstintable tbody tr:eq('+previndex+') td:eq(0) select').focus();
  }
}
  else if (event.which==188 && event.ctrlKey) {
	event.preventDefault();
	if(curindex != 0){
		$('#gstintable tbody tr:eq('+previndex+') td:eq(1) input').focus();
	}
  }
  else if (event.which==190 && event.ctrlKey) {
	event.preventDefault();
	if ($('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').is(":disabled")){
    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:last').focus();
  }
  else{
    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').focus();
  }
}
  else if (event.which==13) {
    event.preventDefault();
    if ($.trim($("#edit_cussup_pan").val()) !="") {
	 $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').focus();
      }
      else {
	  $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').focus();
      }
  }
  else if (event.which==27) {
      event.preventDefault();
      if ($("#edit_cussup").val() == "Supplier") {
	  if ($("#checkbnk").is(":visible")) {
	      $("#checkbnk").focus();
	  }
	  else{
	      $("#edit_accountno").focus();
	  }
      } else {
	  $("#cussup_edit_save").focus();
      }
  }
});

    // keydown event for radiobutton so that the focus will reach to frop down list after enter press.
    $("#custradio").keydown(function(event) {
	if (event.which==13) {
	    $("#editcustomerlist").focus().select();
	}
    });
    $("#supradio").keydown(function(event) {
	if (event.which==13) {
	    $("#editsupplierlist").focus().select();
	}
    });


    //this is the change event written for radio buttons in customer supplier. 
   //on change event one of the list will be hidden. 
  //also keydown performed.

    $(document).off("change",".custsupradio").on("change",".custsupradio",function(event) {
	//Checking which radio button is selected.
        if ($("#custradio").is(":checked")) {
	    
                $("#custo").show();
		$("#suppl").hide();

        } else {
	    
                $("#custo").hide();
		$("#suppl").show();
        }
	if ($("#custradio").is(":checked")){
	    if ($("#editcustomerlist").data("value") != undefined){
	    if ($("#editcustomerlist").data('value')!=""){   
		let selectedcust = $("#editcustomerlist").data('value'); //Current Customer/Supplier.
		$(".editcustomerlist-option[data-value='" + selectedcust + "']").click();
	    }
		else{
		    $(".hidden-load").hide();
		    $(".panel-footer").hide();
		}
	    }
	    else{
		$(".hidden-load").hide();
		$(".panel-footer").hide();
		}
      }
      else{
	  if ($("#editsupplierlist").data("value") != undefined){
	    if ($("#editsupplier").data('value')!=""){   
		let selectedcust = $("#editsupplier").data('value'); //Current Customer/Supplier.
		$(".editsupplier-option[data-value='" + selectedcust + "']").click();
	    }
	      else{
		  $(".hidden-load").hide();
		  $(".panel-footer").hide();
	      }
	  }
	  else{
	      $(".hidden-load").hide();
	      $(".panel-footer").hide();
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
	if ($('#edit_cussup_pan').val() != ''){
	    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val($('#edit_cussup_pan').val()).prop("disabled",true); //for pan
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
	var nextindex = curindex+1;
	panno = $(this).val();
	if (event.which == 13 || event.which == 9) {
	    event.preventDefault();
	    if ((panno.length != 10 || !panno.match(regExp)) && panno !="") {
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
		if ($("#edit_cussup").val() == "Supplier") {
		if ($("#checkbnk").is(":visible")) {
			$("#checkbnk").focus();
		}
		else{
			$("#edit_accountno").focus();
		}
		} else {
		$("#cussup_edit_save").focus();
		}
	}
	else if (event.which==188 && event.ctrlKey) {
		event.preventDefault();
			$('#gstintable tbody tr:eq('+curindex+') td:eq(0) select').focus();
	  }
	  else if (event.which==190 && event.ctrlKey) {
		event.preventDefault();
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
    $(document).off("keydown",".gstin").on("keydown",".gstin",function(event)
{
    var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1+1;
  var previndex1 = curindex1-1;
  var selectedstate = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid");
  var numberofstates = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) option:selected:not(:hidden)').length-1;
  var regExp_change = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
  var txtpan_change = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();  
  if (event.which==13 /*|| event.which==9*/) {
      event.preventDefault();
      if($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val()=="" && $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val()==""){
	  if ($("#edit_cussup").val() == "Supplier"){
	      if ($("#checkbnk").is(":visible")) {
		  $("#checkbnk").focus();
	      }else{
		  $("#edit_accountno").focus();
	      }
	  } else {
	      $("#cussup_edit_save").focus();
	  }
      }
      else if ($(".gstin").val()!="" && curindex1 != ($("#gstintable tbody tr").length-1)) {
	  $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }else if((txtpan_change.length != 10 || !txtpan_change.match(regExp_change)) && txtpan_change !="") {
	  $("#gstin-improper-alert").alert();
	  $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#gstin-improper-alert").hide();
	      $(".panno").focus();
	  });
      }
      else {
	   gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
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
        $("#cussup_edit_save").focus();
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
      if ($("#edit_cussup").val() == "Supplier") {
	  if ($("#checkbnk").is(":visible")) {
	      $("#checkbnk").focus();
	  }
	  else{
	      $("#edit_accountno").focus();
	  }
      } else {
	  $("#cussup_edit_save").focus();
      }
  }
});

    //Click event for '+' button which trigger click event of 'gstin' field. 
    $(document).off("click",".addbtn").on("click",".addbtn",function(event){
	$(".gstin").trigger({type:"keydown",which:"13"});
	$("#gstintable tbody tr:last").find(".gstinstate, .panno, .gstin, .state_del, .addbtn").prop("disabled",false);
	$("#gstintable tbody tr:last").find(".state_del").show();

    });

    // Keydown events for bank details
    $("#checkbnk").click(function(e){
    if ($(this).is(":checked")) {
      $("#checkbnk").val(1);
      $("#bankdetailsdiv").show();
    }
    else {
      $("#checkbnk").val(0);
      $("#bankdetailsdiv").hide();
     
    }
    });
    $("#checkbnk").keydown(function(e){
	if (e.which == 13) {
	    e.preventDefault();
	    if ($(this).is(":checked")) {
		$("#edit_accountno").focus();
	    }
	    else {
		$("#cussup_edit_save").focus();
	    }
	}
    });
  
    $("#edit_accountno").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    $("#edit_bankname").focus();
	}
	else if (event.which==38){
	    event.preventDefault();
	    if ($("#vatorgstflag").val() == '22'){
		$("#edit_cussup_tan").focus();
	    } else {
		$(".gstin").focus().select();
	    }
	}

    });
    $("#edit_bankname").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if ($("#edit_accountno").val() != "" && $("#edit_bankname").val() == "" ) {
		$("#bankname-blank-alert").alert();
		$("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert").hide();
		    $("#edit_bankname").focus();
		});
		return false;
	    } else if ($("#edit_accountno").val() == "" && $("#edit_bankname").val() != "" ) {
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		});
		$("#edit_accountno").focus();
		return false;
	    } else {
		$('#edit_branchname').focus();
	    }
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#edit_accountno").focus().select();
	}

    });
    $("#edit_branchname").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if($("#edit_accounno").val() != "" && $("#edit_bankname").val() != "" && $("#edit_branchname").val() == "") {
		$("#branchname-blank-alert").alert();
		$("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#branchname-blank-alert").hide();
		    $("#edit_branchname").focus();
		});
		return false;
	    } else if($("#edit_accountno").val() == "" && $("#edit_branchname").val() != ""){
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		    $("#edit_accountno").focus();
		});
		return false;
	    }else if($("#edit_bankname").val() == "" && $("#edit_branchname").val() != ""){
		$("#bankname-blank-alert").alert();
		$("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert").hide();
		    $("#edit_bankname").focus();
		});
		return false;
	    } else {
		$("#edit_ifsc").focus();
	    }
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#edit_bankname").focus().select();
	}

    });
    $("#edit_ifsc").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if ($("#edit_accounno").val() != "" && $("#edit_bankname").val() != "" && $("#edit_branchname").val() != "" && $("#edit_ifsc").val() == "") {
		$("#ifsc-blank-alert").alert();
		$("#ifsc-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#ifsc-blank-alert").hide();
		    $("#edit_ifsc").focus();
		});
		return false;
	    } else if($("#edit_accountno").val() == "" && $("#edit_ifsc").val() != ""){
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		    $("#edit_accountno").focus();
		});
		return false;
	    } else if($("#edit_bankname").val() == "" && $("#edit_ifsc").val() != ""){
		$("#bankname-blank-alert").alert();
		$("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#bankname-blank-alert").hide();
		    $("#edit_bankname").focus();
		});
		return false;
	    } else if($("#edit_branchname").val() == "" && $("#edit_ifsc").val() != ""){
		$("#branchname-blank-alert").alert();
		$("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#branchname-blank-alert").hide();
		    $("#edit_branchname").focus();
		});
		return false;
	    } else {
		$("#cussup_edit_save").focus();
	    } 
	}
	else if (event.which==38){
	    event.preventDefault();
	    $("#edit_branchname").focus().select();
	}
    });

    //change event for bank details
    $("#edit_bankname").change(function(event) {
	event.preventDefault();
	if ($("#edit_accountno").val() == "" && $("#edit_bankname").val() != "" ) {
	    $("#accountno-blank-alert").alert();
	    $("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#accountno-blank-alert").hide();
	    });
	    $("#edit_accountno").focus();
	    return false;
	}
	else if ($("#edit_accountno").val() != "" && $("#edit_bankname").val() == "" ) {
	    $("#bankname-blank-alert").alert();
	    $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert").hide();
	    });
	    $("#edit_bankname").focus();
	    return false;
	}
	else {
	    $('#edit_branchname').focus();
	}
	
    });

    $("#edit_branchname").change(function(event) {
	event.preventDefault();
	if($("#edit_accounno").val() != "" && $("#edit_bankname").val() != "" && $("#edit_branchname").val() == "") {
	    $("#branchname-blank-alert").alert();
	    $("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#branchname-blank-alert").hide();
	    });
	    $("#edit_branchname").focus();
	    return false;
	} else if($("#edit_accountno").val() == "" && $("#edit_branchname").val() != ""){ 
	    $("#accountno-blank-alert").alert();
	    $("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#accountno-blank-alert").hide();
	    });
	    $("#edit_accountno").focus();
	    return false;
	}else if($("#bankname").val() == "" && $("#edit_branchname").val() != ""){ 
	    $("#bankname-blank-alert").alert();
	    $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert").hide();
	    });
	    $("#edit_bankname").focus();
	    return false;
	    }
	else {
	    $("#edit_ifsc").focus();
	}
	
    });

    $("#edit_ifsc").change(function(event) {
	event.preventDefault();
	if($("#edit_accounno").val() != "" && $("#edit_bankname").val() != "" && $("#edit_branchname").val() != "" && $("#edit_ifsc").val() == "") {
	    $("#ifsc-blank-alert").alert();
	    $("#ifsc-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#ifsc-blank-alert").hide();
	    });
	    $("#edit_ifsc").focus();
	    return false;
	} else if($("#edit_accountno").val() == "" && $("#edit_ifsc").val() != ""){
		$("#accountno-blank-alert").alert();
		$("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#accountno-blank-alert").hide();
		});
	    $("#edit_accountno").focus();
	    return false;
	} else if($("#edit_bankname").val() == "" && $("#edit_ifsc").val() != ""){
	    $("#bankname-blank-alert").alert();
	    $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#bankname-blank-alert").hide();
	    });
	    $("#edit_bankname").focus();
	    return false;
	} else if($("#edit_branchname").val() == "" && $("#edit_ifsc").val() != ""){
	    $("#branchname-blank-alert").alert();
	    $("#branchname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#branchname-blank-alert").hide();
	    });
	    $("#edit_branchname").focus();
	    return false;
	} else {
	    $("#cussup_edit_save").focus();
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
    $("#edit_cussup_reset").click(function(event) {
	if($("#editsupplierlist").data('value')==undefined){
	if ($("#editcustomerlist").data('value')!=""){   
	    let selectedcust = $("#editcustomerlist").data('value'); //Current Customer/Supplier.
	$(".editcustomerlist-option[data-value='" + selectedcust + "']").click();

	$("#Customer_edit_list").focus();    
	}}
	if($("#editcustomerlist").data('value')==undefined){
	if ($("#editsupplierlist").data('value')!=""){
	    let selectedsup = $("#editsupplierlist").data('value'); //Current Customer/Supplier.
		$(".editsupplierlist-option[data-value='" + selectedsup + "']").click();

	    $("#editsupplierlist").focus();
	}}
	});
  $("#edit_cussup_btn").click(function(event) {
    $("#edit_cussup_btn").hide();
    $("#cussup_edit_save").show();
    $("#edit_cussup_reset").show();  
	$("#textareahelp1").show();
	$(".state_del").show();
    $("#edit_cussup").prop("disabled", true);
    $("#edit_cussup_list").focus().select();
    $("#edit_cussup_name").prop("disabled", false);
    $("#edit_cussup_email").prop("disabled", false);
    $("#edit_cussup_phone").prop("disabled", false);
    $("#edit_cussup_address").prop("disabled", false);
    $("#edit_cussup_pin").prop("disabled", false);
    $("#edit_cussup_fax").prop("disabled", false);
    $("#edit_cussup_pan").prop("disabled", false);
	$("#edit_cussup_tan").prop("disabled", false);
	if($(".gstinstate:first option:selected").val()==""){
		$(".gstinstate, .panno, .gstin, .state_del, .addbtn").prop("disabled", false);
	}
	$(".addbtn").prop("disabled",false);
    $("#edit_state").prop("disabled", false);
    $("#edit_accountno").prop("disabled", false);
    $("#edit_bankname").prop("disabled", false);
    $("#edit_branchname").prop("disabled", false);
    $("#edit_ifsc").prop("disabled", false);
  });
  $(document).keyup(function(event) {
      if(event.which == 45) {
      $("#cussup_edit_save").click();
      event.preventDefault();
      return false;
    }
  });
    $("#cussup_edit_save").click(function(event) {
	var allow = 1;
	var cuss_pan = $("#edit_cussup_pan").val();
        var panno1= $(".panno").val();
	var regExp1 = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
        // validation for PAN
	if ((cuss_pan.length != 10 || !cuss_pan.match(regExp1)) && cuss_pan !="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#edit_cussup_pan").focus();
	    return false;
	}

	if ($("#checkbnk").is(":checked")) {
	    if($("#edit_accountno").val()=="" || $("#edit_bankname").val()=="" || $("#edit_branchname").val()=="" || $("#edit_ifsc").val()=="" ) {
		$("#allbank-blank-alert").alert();
		$("#allbank-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#allbank-blank-alert").hide();
		});
		$("#edit_accountno").focus();
		return false;
	    }
	}

	// Validation for proper email.
	editemail = $("#edit_cussup_email").val();
	if ((!editemail.match(editemailExp)) && editemail!= "") {
	    $("#email-editimproper-alert").alert();
	    $("#email-editimproper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#email-editimproper-alert").hide();
	    });
	    $("#edit_cussup_email").focus().select();
	    return false;
	}

	if ($.trim($("#edit_cussup_name").val())=="") {
	    if ($("#edit_cussup").val() == "Supplier"){
		$("#supname-blank-alert").alert();
		$("#supname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#supname-blank-alert").hide();
            });
	    } else if($("#edit_cussup").val() == "Customer") {
		$("#custname-blank-alert").alert();
		$("#custname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#custname-blank-alert").hide();
            });
	    }
      $("#edit_cussup_name").focus();
      return false;
    }
    if ($.trim($("#edit_state").val())=="") {
      $("#state-blank-alert").alert();
      $("#state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#state-blank-alert").hide();
      });

      $("#edit_state").focus();
      return false;
    }
    if ($.trim($("#edit_cussup_address").val())=="") {
      $("#address-blank-alert").alert();
      $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#address-blank-alert").hide();
      });
      $("#edit_cussup_address").focus();
      return false;
	}

	//Validation for pin code number
	var pincode_val=$("#edit_cussup_pin").val();
	var reg = /^[0-9]+$/;
	if (pincode_val == "") {
		$("#pin-blank-alert").alert();
		$("#pin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#pin-blank-alert").hide();
		});
		$("#edit_cussup_pin").focus();
		return false;
	  }
	  else if (!reg.test(pincode_val) || pincode_val.length != 6) {	
		$("#pinval-blank-alert").alert();
		$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pinval-blank-alert").hide();
		});
		$("#edit_cussup_pin").focus();
		return false;
	}

        // Validation for bank details
	if (!($("#edit_accountno").val() == "" && $("#edit_bankname").val() == "" && $("#edit_branchname").val() == "" && $("#edit_ifsc").val() == "")){
	   if ($("#edit_accountno").val() == "" || $("#edit_bankname").val() == "" || $("#edit_branchname").val() == "" || $("#edit_ifsc").val() == ""){
	    $("#allbank-blank-alert").alert();
	    $("#allbank-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#allbank-blank-alert").hide();
	    });
	    $("#edit_accountno").focus();
	       return false;
	   }
	}
	
	
  /*if ($.trim($("#edit_cussup_tan").val())==""){
      $("#both-blank-alert").alert();
      $("#both-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#both-blank-alert").hide();
      });
      $("#edit_cussup_tan").focus();
      return false;
      } */
	
      var gobj = {}; // Creating a dictionary for storing statecode with gstin.
      $("#gstintable tbody tr").each(function(){
	  var curindex1 = $(this).index();
	  var panno1= $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();
	  if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid"))!="") {
	      gstinstring =	gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
	      var lastleg = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();

	  // Validation for GSTIN on Save Button.
	      if((panno1.length != 10 || !panno1.match(regExp1)) && panno1 !="" ) {
		  $("#gstin-improper-alert").alert();
		  $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-alert").hide();
		$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').focus();
	    });
	    allow = 0;
	    return false;
	}else if($(".gstin").val() !="" && panno1 ==""){
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
	if(gstinstring.length == 15){
	    gobj[$('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid")] =gstinstring;
	}
      }
      });
      let custtan = "";
      if ($("#edit_cussup_tan").length > 0){
	  custtan = $("#edit_cussup_tan").val();
      }
	var form_data = new FormData();
	if ($("#custradio").is(":checked")){ 
	    form_data.append("custid", $("#editcustomerlist").data('value'));}
	else{
	    form_data.append("custid", $("#editsupplierlist").data('value'));}
	form_data.append("custname", $("#edit_cussup_name").val());
	form_data.append("custaddr", $.trim($("#edit_cussup_address").val()));
	form_data.append("custphone", $("#edit_cussup_phone").val());
	form_data.append("custemail", $("#edit_cussup_email").val());
	form_data.append("pincode", $("#edit_cussup_pin").val());
	form_data.append("custfax", $("#edit_cussup_fax").val());
	form_data.append("custpan", $("#edit_cussup_pan").val());
	form_data.append("custtan", custtan);
	var curindex2 = $(this).index();
	var panno= $('#gstintable tbody tr:eq('+curindex2+') td:eq(1) input:eq(1)').val();
	if (panno!=''){
	    form_data.append("gstin", JSON.stringify(gobj));
	}
	form_data.append("state", $("#edit_state").val());
	if ($("#custradio").is(":checked")){
	    form_data.append("oldcustname", $("#editcustomerlist").text());}
	else{
	    form_data.append("oldcustname", $("#editsupplierlist").text());}
	
	if ($("#edit_cussup").val() == "Supplier"){
	    var bankdetails = {}; //for bank details
	if ($.trim($("#edit_accountno").val()) != "" && $.trim($("#edit_bankname").val()) !="" && $.trim($("#edit_ifsc").val()) !="" && $.trim($("#edit_branchname").val()) !=""){
	     bankdetails["accountno"] = $.trim($("#edit_accountno").val());
	    bankdetails["bankname"] = $.trim($("#edit_bankname").val());
	    bankdetails["ifsc"] = $.trim($("#edit_ifsc").val());
	    bankdetails["branchname"] = $.trim($("#edit_branchname").val());
	    form_data.append("bankdetails", JSON.stringify(bankdetails));
	}
	}
	form_data.append("custsup", $("#edit_cussup").val());
	if(allow == 1){
	    $.ajax({
                url: '/customersuppliers?action=edit',
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
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
                .done(function(resp) {
                    if(resp["gkstatus"] == 0){
			allow = 0;
			
                        $("#customersupplier_edit").click();
                        if (resp["custsup"] == 'Customer') {
			    
                            $("#cus-edit-alert").alert();
                            $("#cus-edit-alert").fadeTo(2250, 500).slideUp(500, function(){
                                $("#cus-edit-alert").hide();
                            });
                            return false;
                        }
                        else  {
                            $("#sup-edit-alert").alert();
                            $("#sup-edit-alert").fadeTo(2250, 500).slideUp(500, function(){
                                $("#sup-edit-alert").hide();
                            });
                            return false;
                        }

                    }
                    if(resp["gkstatus"] == 1){
                        if (resp["custsup"] == 'Customer') {
                            $("#edit_cussup_name").focus();
                            $("#cus-duplicate-alert").alert();
                            $("#cus-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                                $("#cus-duplicate-alert").hide();
                            });
                            return false;
                        }
                        else  {

                            $("#edit_cussup_name").focus();
                            $("#sup-duplicate-alert").alert();
                            $("#sup-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                                $("#sup-duplicate-alert").hide();
                            });
                            return false;
                        }

                    }
                    else {
                        alert(resp["gkstatus"]);
                        $("#edit_cussup_list").focus();
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
});
$("#cussup_delete").click(function(event) {
  event.preventDefault();

  $('.modal-backdrop').remove();
  $('.modal').modal('hide');
  $('#confirm_del').modal('show').one('click', '#accdel', function (e)
  {
      if ($("#custradio").is(":checked")){
	  custid=$("#editcustomerlist").data('value');
      }
      else{
	  custid=$("#editsupplierlist").data('value');
      }
      if (custid!=''){
      $.ajax(
      {
        type: "POST",
        url: '/customersuppliers?action=delete',
        async: false,
        datatype: "json",
        data:{"custid": custid},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)

        {
          if (resp["gkstatus"]==0) {
            $("#customersupplier_edit").click();
            if (resp["csflag"] == 3) {
              $("#cus-delsuccess-alert").alert();
              $("#cus-delsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#cus-delsuccess-alert").hide();
              });
              return false;
            }
            else  {
              $("#sup-delsuccess-alert").alert();
              $("#sup-delsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#sup-delsuccess-alert").hide();
              });
              return false;
            }
          }

	  if (resp["gkstatus"]==5) {
          $("#customersupplier_edit").click();
          if (resp["csflag"] == 3) {
            $("#cus-failure-alert").alert();
            $("#cus-failure-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#cus-failure-alert").hide();
            });
            return false;
          }
          else  {
            $("#sup-failure-alert").alert();
            $("#sup-failure-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#sup-failure-alert").hide();
            });
            return false;
          }
        }

	}

      });
      }
  });

});
  $("#confirm_del").on('shown.bs.modal', function(event) {
    $("#m_cancel").focus();
  });
  $("#confirm_del").on('hidden.bs.modal', function(event) {
    $("#edit_cussup_list").focus();
  });
});
