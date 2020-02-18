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
"Sanket Kolnoorkar" <sanketf123@gmail.com>
*/

$(document).ready(function()
{

  $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    $("#gstaccount").prop("disabled", true);
    $("#gstfielddiv").show();
    $("#openbal").numeric();
  $("#obal").hide();
  $("#openbal").hide();
  $("#baltbl").hide();
    $("#bnkdiv").hide();
    $("#chsdiv").hide();
    $("#purdiv").hide();
	$("#salediv").hide();
	$("#addcust").hide();
  $("#groupname").focus().select();
    $("#accountform").validate();
    var taxstate = "";
    var taxtype = "";
    var taxrate = "";
	var cessrate = "";
	var custsup;

	$(".groupname-option").click(function(){
		//Creating an object to store organisation name and type
		$("#groupname").data("value", $(this).data("value"));
		$("#groupname").text($(this).text());
		$("#groupname").focus();
// 	  });

// //   $("#groupname").bind("change keyup", function(){

	var gname = $("#groupname").text();
	//   console.log(gname,"gname");
	//   var gname1 = $(".groupname-option").text();
    if (gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income" || gname=="Select Group")
    {
      $("#obal").hide();
      $("#openbal").hide();
      $("#baltbl").hide();

    }
    else
    {
      $("#baltbl").show();
      $("#obal").show();
      $("#openbal").show();
    }

	var groups = $("#groupname").data("value");
	console.log(groups,"groups");
    if (groups != '') {
      $.ajax({
        type: "POST",
        url: "/getsubgroup",
        data: {"groupcode":groups},
        global: false,
        async: false,
        dataType: "json",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
            var subgroups = jsonObj["gkresult"];
          $('#subgroupname').empty();
          for (i in subgroups ) {
            $('#subgroupname').append('<option value="' + subgroups[i].subgroupcode + '">' +subgroups[i].subgroupname+ '</option>');
          }
            var grpnam=$("#groupname").text();
			$('#subgroupname').prepend('<option value="None">None</option>');
	    $("#subgroupname option:first").attr("selected", "selected");
			$('#subgroupname').append('<option value="New">New Sub-Group</option>');
			$(".gsselect").change();
        }
      });
    }
  });


  $(document).off('keyup' ,'#groupname-input').on('keyup' ,'#groupname-input',function(event) {
    let searchtext = $("#groupname-input").val().toLowerCase();
    if (searchtext != "") {
      $(".groupname-option").each(function(index){
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
      $(".groupname-option").each(function(index){
	$(this).parent().show();
	$(this).show();
      });
    }
  });

  $(document).off('keydown' ,'#groupname-input').on('keydown' ,'#groupname-input',function(event) {
    if (event.which == 13 || event.which == 40){
      event.preventDefault();
      $("#groupname-input").parent().parent().find("a:visible").first().focus();
    }

  });


  $(".searchabledropdown").on("shown.bs.dropdown", function () {
    let searchinput = $(this).data("input-id");
    document.getElementById(searchinput).focus();
  });
  $("#nsgp").hide();

  $(".gsselect").bind("change keyup", function(){
	$("#addcust").hide();
	var sgroups = $("#subgroupname option:selected").val();
    if (sgroups=="New")
    {
      $("#nsgp").show();
	  $("#rodivpaid").hide();
	  $("#rodivreceived").hide();
    }
    else
    {
	  $("#nsgp").hide();
	  if ($("#groupname").text() == "Indirect Expense"){
		$("#rodivpaid").show();
		$("#rodivreceived").hide();
	  }
	  if ($("#groupname").text() == "Indirect Income"){
		$("#rodivpaid").hide();
		$("#rodivreceived").show();
	  }
    }
      if ($.trim($("#subgroupname option:selected").text()) == 'Duties & Taxes') {
	  $('#gstfielddiv').show();
	  $("#gstaccount").prop("disabled", false);
      }
      else {
	  $('#gstfielddiv').hide();
	  $("#gstaccount").prop("disabled", true);
      }

      /** Under Group 'Current asset' if subgroup 'Bank' or 'Cash' is selected then 'bnkdiv' or 'chsdiv' show or hide respectively **/
      if($.trim($("#subgroupname option:selected").text()) == 'Bank'){
	  $("#bnkdiv").show();
	  $("#chsdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
	  $("#rodivpaid").hide();
		$("#rodivreceived").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Cash'){
	  $("#chsdiv").show();
	  $("#bnkdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
	  $("#rodivpaid").hide();
		$("#rodivreceived").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Purchase'){
	  $("#chsdiv").hide();
	  $("#bnkdiv").hide();
	  $("#purdiv").show();
	  $("#salediv").hide();
	  $("#rodivpaid").hide();
		$("#rodivreceived").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Sales'){
	  $("#purdiv").hide();
	  $("#salediv").show();
	  $("#chsdiv").hide();
	  $("#bnkdiv").hide();
	  $("#rodivpaid").hide();
	   $("#rodivreceived").hide();
	  }else if($.trim($("#subgroupname option:selected").text()) == 'Sundry Debtors'){
		$("#addcust").show();
		$("#addcust").removeClass("disabled");
		custsup = '15';
	  }else if($.trim($("#subgroupname option:selected").text()) == 'Sundry Creditors for Purchase'){
		$("#addcust").show();
		$("#addcust").removeClass("disabled");
		custsup = '9';
	  }
	  else{
	  $("#bnkdiv").hide();
	  $("#chsdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
      }

  });

  $("#reset").click(function()
  {
    $('#addaccount').click();
  }
);
$("#groupname").change(function(e){
	if($.trim($("#groupname").text()) == 'Indirect Expense' ){
		$("#rodivpaid").show();
		$("#rodivreceived").hide();
	  }
	  else if($.trim($("#groupname").text()) == 'Indirect Income'){
		$("#rodivpaid").hide();
		$("#rodivreceived").show();
	  }
	  else{
		$("#rodivpaid").hide();
		$("#rodivreceived").hide();
	  }
});
  // Keydown event for Opening Balance.
$("#openbal").keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    $("#submit").click();
	}
    else if (event.which == 38){
	event.preventDefault();
	if (!$("#accountname").is(":disabled")) {
	    $("#accountname").focus().select();
	}
	else {
	    $("#taxrate:visible, #cessrate:visible").focus();
	}
    }
});
    // Keydown event for Group Name.
    // Validations for Group Name.
      $("#groupname").keydown(function(event) {
	  if(event.which==13 || event.which == 9) {
	      event.preventDefault();
	      if ($.trim($("#groupname").data('value'))=="") {
		  
		  $("#grpblank-alert").alert();
		  $("#grpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
		      $("#grpblank-alert").hide();
		  });
		  $("#groupname").focus();
		  $("#groupname").select();
		  return false;
	      }
	  }
	  if(event.which==13){
	      event.preventDefault();
	      $("#subgroupname").focus().select();
	  }
      });
	  
    // Keydown event for Sub-Group Name.
    $("#subgroupname").keydown(function(event){
		if(event.which==16){
	    	event.preventDefault();
			$("#subgroupname").val("New");
      		$("#nsgp").show();
			$("#newsubgroup").focus().select();
		}
	if(event.which==13 || event.which == 9) {
	    event.preventDefault();
	    if ($.trim($("#subgroupname option:selected").val())=="New"){
	    $("#newsubgroup").focus().select();
	    }
	    else if($('.defbx').is(':visible')){
		$(".defbx").focus().select();
	    }
	    else {
		    $("#maccounts").focus().select();
	    }
	}
	    if (event.which==38 && (document.getElementById('subgroupname').selectedIndex==0)) {
      event.preventDefault();
      $("#groupname").focus().select();
	    }
    });

    /** Keydown for 'bnkac' and 'chsac' checkbox **/
    $(".defbx").keydown(function(event){
	if(event.which==13) {
	    event.preventDefault();
	    $("#maccounts").focus();
	}
	if (event.which==38){
	    $("#subgroupname").focus();
	}
    });
    
//key down event for newsubgroup.
    $("#newsubgroup").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    if ($.trim($("#newsubgroup").val())=="") {
		$("#nsblank-alert").alert();
		$("#nsblank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#nsblank-alert").hide();
		});
		$("#newsubgroup").focus().select();
		return false;
	    }
		// Ajax to add new subgroup
			$.ajax({
				url: '/addaccount?type=subgroup',
				type: 'POST',
				global: false,
				async: false,
				datatype: 'json',
				data: {"groupname": $("#groupname").data("value"),"newsubgroup":$("#newsubgroup").val()},
				beforeSend: function(xhr)
			{
			xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			}
			})
			.done(function(resp)  
			{
				$('#subgroupname').append('<option value="' + resp["subgroupcode"] + '">' +$("#newsubgroup").val()+ '</option>');
				$("#subgroupname option").filter(function(i, e) { return $(e).text() == $("#newsubgroup").val(); }).prop('selected', true);
				$("#nsgp").hide();
				$("#subgroupname").focus();
				$("#newsubgroup").val("");
			});
	}
	if (event.which==38) {
	 event.preventDefault();
	 $("#subgroupname").focus().select();
	}
    });
    // Keydown event for Create Multiple Accounts Checkbox.  
     $("#maccounts").keydown(function(event){
	if(event.which==13) {
	    event.preventDefault();
	    if ($("#gstaccount").is(":visible")) {
		    $("#gstaccount").focus().select();
		}
	    else {
		$("#accountname").focus().select();
	    }
	}
	 else if (event.which == 38){
	     event.preventDefault();
	     if ($("#newsubgroup").is(':visible')) {
		 $("#newsubgroup").focus().select();
	     }
	     else if($(".defbx").is(':visible')){
		 $(".defbx").focus();
	     }
	     else {
		 $("#subgroupname").focus().select();
	     }
	     }
     });
    //Events for creating GST Accounts beigin here.
    $("#taxtype").change(function(){
	taxtype = $.trim($("#taxtype option:selected").val());
	if (taxtype == "CESSIN" || taxtype == "CESSOUT") {
	    $("#taxrate").hide();
	    $("#cessratediv, #cessrate, #cessrateaddon").show();
	}
	else {
	    $("#taxrate").show();
	    $("#cessratediv, #cessrate, #cessrateaddon").hide();
	    if (taxtype == 'IGSTIN' || taxtype == 'IGSTOUT') {
		$("#taxrate option.sgstopt").prop("disabled", true).prop("hidden", true);
		$("#taxrate option.igstopt").prop("disabled", false).prop("hidden", false);
	    }
	    else {
		$("#taxrate option.igstopt").prop("disabled", true).prop("hidden", true);
		$("#taxrate option.sgstopt").prop("disabled", false).prop("hidden", false);
	    }
	}
	if (taxtype!="" && taxstate!="" && taxrate!="") {
	    $('#accountname').val(taxtype + "_" + taxstate + "@" + taxrate);
	}
	else {
	    $('#accountname').val("");
	}
    });
    $("#taxtype").keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($.trim($("#taxtype option:selected").val())=="") {
                $("#taxtype-alert").alert();
                $("#taxtype-alert").fadeTo(2250, 200).slideUp(500, function(){
                    $("#taxtype-alert").hide();
		});
                $("#taxtype").focus();
                return false;
            }
	    $("#taxstate").focus();
	}
	else if (event.which == 38) {
	    if ($("#taxtype option:visible").first().is(":selected") || $.trim($("#taxtype option:selected").val())=="") {
		$("#gstaccount").focus();
	    }
	}
    });
    $("#taxstate").change(function(){
	let taxstatecode = $("#taxstate option:selected").attr("stateid");
	if (taxstatecode !== "") {
	    $.ajax({
	    url: '/addaccount?type=abbreviation',
	    type: 'POST',
	    global: false,
	    async: false,
	    datatype: 'json',
	    data: {"statecode": taxstatecode},
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    }
	})
	    .done(function(resp)   /*This function will return spec name of the product*/
		  {
		      if (resp.gkstatus == 0) {
			  taxstate = resp.abbreviation;
			  if (taxtype!="" && taxstate!="" && taxrate!="") {
			      $('#accountname').val(taxtype + "_" + taxstate + "@" + taxrate);
			  }
		      }
		      else {
			  taxstate = "";
			  $("#accountname").val("");
		      }
		  })
	    .fail(function() {
		console.log("error");
	    })
	    .always(function() {
		console.log("complete");
	    });
	}
	else {
	    taxstate = "";
	    $("#accountname").val("");
	}
    });
    $("#taxstate").keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($.trim($("#taxstate option:selected").val())=="") {
                $("#taxstate-alert").alert();
                $("#taxstate-alert").fadeTo(2250, 200).slideUp(500, function(){
                    $("#taxstate-alert").hide();
		});
                $("#taxstate").focus();
                return false;
            }	
	    if (taxtype == "CESSIN" || taxtype == "CESSOUT") {
		$("#cessrate").focus();
	    }
	    else {
		$("#taxrate").focus();
	    }
	}
	else if (event.which == 38) {
	    if ($("#taxstate option:visible").first().is(":selected") || $.trim($("#taxstate option:selected").val())=="") {
		$("#taxtype").focus();
	    }
	}
    });
    $("#taxrate").change(function(){
	taxrate = $.trim($("#taxrate option:selected").val());
	if (taxtype!="" && taxstate!="" && taxrate!="") {
	    $('#accountname').val(taxtype + "_" + taxstate + "@" + taxrate);
	}
	else {
	    $("#accountname").val("");
	}
    });
    $("#taxrate").keydown(function(event){
	if (event.which == 13 ) {
	    event.preventDefault();
	    if ($.trim($("#taxrate option:selected").val())=="") {
                $("#taxrate-alert").alert();
                $("#taxrate-alert").fadeTo(2250, 200).slideUp(500, function(){
                    $("#taxrate-alert").hide();
		});
                $("#taxrate").focus();
                return false;
            }
	    $("#openbal").focus();
	}
	else if (event.which == 38) {
	    if ($("#taxrate option:visible").first().is(":selected")) {
		$("#taxstate").focus();
	    }
	}
    });
    $("#cessrate").change(function(){
	cessrate = $.trim($("#cessrate").val());
	if (taxtype!="" && taxstate!="" && cessrate!="") {
	    $('#accountname').val(taxtype + "_" + taxstate + "@" + cessrate + "%");
	}
	else {
	    $("#accountname").val("");
	}
    });
    $("#cessrate").keydown(function(event){
	if (event.which == 13 ) {
	    event.preventDefault();
	    if ($.trim($("#cessrate").val())=="") {
                $("#cessrate-alert").alert();
                $("#cessrate-alert").fadeTo(2250, 200).slideUp(500, function(){
                    $("#cessrate-alert").hide();
		});
                $("#cessrate").focus();
                return false;
            }
	    $("#openbal").focus();
	}
	else if (event.which == 38) {
	    $("#taxstate").focus();
	}
    });
    // Keydown event for Account Name.
    //Validations for Account Name.
     $("#accountname").keydown(function(event){
	if(event.which==13||event.which==9) {
	    event.preventDefault();
	    var gname = $("#groupname").text();    //Storing selected value from Goup Name dropdown list. 
            if (gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income" || gname=="Select Group"){
		$("#submit").click();	
	    } else {
	    $("#openbal").focus().select();
	    }
	    if ($.trim($("#accountname").val())=="") {
                $("#blank-alert").alert();
                $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
                $("#blank-alert").hide();
           });
                $("#accname").focus().select();
                  return false;
                }
	}
	else if (event.which == 38){
	    event.preventDefault();
	    if($("#gstaccount").is(':visible')){
		$("#gstaccount").focus().select();
	    }else{
		$("#maccounts").focus().select();
	    }
    }
	});

	
	var emailExp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var email="";
	var custsupdatatemp = {};
  
	$(document).off("click", '#cussup_save_acc').on("click", '#cussup_save_acc', function(event) {
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
  
  
	  if ($("#checkbnkpop").is(":checked")) {
		  if($("#cust_accountno").val()=="" || $("#cust_bankname").val()=="" || $("#cust_branchname").val()=="" || $("#cust_ifsc").val()=="" ) {
			  $("#allbank-blank-alert").alert();
			  $("#allbank-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			  $("#allbank-blank-alert").hide();
			  });
			  $("#cust_accountno").focus();
			  return false;
		  }
		  }
	
		  
		  // Validation for proper email.
		  email = $("#add_cussup_email").val();
		  if ((!email.match(emailExp)) && email!="") {
		  $("#improper-email-alert").alert();
		  $("#improper-email-alert").fadeTo(2250, 500).slideUp(500, function(){
			  $("#improper-email-alert").hide();
			  });
		  $("#add_cussup_email").focus().select();
		  return false;
		  }
  
	  if ($.trim($("#add_cussup_name").val())=="") {
		  if($('#status').val()=='9' || $('#status').val()=="16"){
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
	
		//validation for pincode number
		var pincode_val=($("#add_cussup_pin").val());
		var reg = /^[0-9]+$/;
		if (pincode_val == "") {
			$("#pin-blank-alert-popup").alert();
			$("#pin-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
				$("#pin-blank-alert-popup").hide();
			});
			$("#add_cussup_pin").focus();
			return false;
			  }
		  else if (!reg.test(pincode_val) || pincode_val.length != 6) {
			  $("#pinval-blank-alert-popup").alert();
			  $("#pinval-blank-alert-popup").fadeTo(2250, 500).slideUp(500, function(){
				  $("#pinval-blank-alert-popup").hide();
			  });
			  $("#add_cussup_pin").focus();
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
	 var lastleg = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();
	 if((panno1.length != 10 || !panno1.match(regExp1)) && panno1 !="" ) {
		 $("#improper-gstin-alert").alert();
		 $("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
		 $("#improper-gstin-alert").hide();
		 $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').focus();
		 });
		 allow = 0;
		 return false;
	 }
	 else if(panno1 =="" && gstin1 !=""){
		 $("#improper-gstin-alert").alert();
		 $("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
		 $("#improper-gstin-alert").hide();
		 });
		 allow = 0;
		 $(".panno").focus();
		 return false;
	 }
	 else if(panno1 !="" && gstin1 ==""){
		 $("#improper-gstin-alert").alert();
		 $("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
		 $("#improper-gstin-alert").hide();
		 });
		 allow = 0;
		 $(".gstin").focus();
		 return false;
	 }else if(panno1 !="" && lastleg.length != 3){
		 $("#improper-gstin-alert").alert();
		 $("#improper-gstin-alert").fadeTo(2250, 500).slideUp(500, function(){
		 $("#improper-gstin-alert").hide();
		 });
		 allow = 0;
		 $(".gstin").focus();
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
	  if ($("#status").val() == "9" || $('#status').val()=="16"){
		   var bankdetails = {}; //dictionary for bank details
	   if ($.trim($("#cust_accountno").val()) != "" && $.trim($("#cust_bankname").val()) !="" && $.trim($("#cust_ifsc").val()) !="" && $.trim($("#cust_branchname").val()) !=""){
		   bankdetails["accountno"] = $.trim($("#cust_accountno").val());
		   bankdetails["bankname"] = $.trim($("#cust_bankname").val());
		   bankdetails["ifsc"] = $.trim($("#cust_ifsc").val());
		   bankdetails["branchname"] = $.trim($("#cust_branchname").val());
	   }
		 }
		  if(allow == 1){
		  custsupdatatemp["custname"] = $("#add_cussup_name").val();
		  custsupdatatemp["custaddr"] = $.trim($("#add_cussup_address").val());
		  custsupdatatemp["pincode"] = $("#add_cussup_pin").val();
		  custsupdatatemp["custphone"] = $("#add_cussup_phone").val();
		  custsupdatatemp["custemail"] = $("#add_cussup_email").val();
		  custsupdatatemp["custfax"] = $("#add_cussup_fax").val();
		  custsupdatatemp["custpan"] = $("#add_cussup_pan").val();
		  custsupdatatemp["custtan"] = custtan;
		  custsupdatatemp["gstin"] = gobj;
		  custsupdatatemp["state"] = $("#add_state").val();
		  custsupdatatemp["csflag"] = $("#add_cussup").val();
		  custsupdatatemp["bankdetails"] = bankdetails;
		  custsupdatatemp["state"] = $("#add_state").val();
		  custsupdatatemp["state"] = $("#add_state").val();
		  $('#custsupmodal').modal('hide');
		  allow = 0 ;
			  } 
			  event.stopPropagation(); // stoopping the event for unnecessarily repeating itself
		  }
	  );
  
  
	$("#addcust").click(function() {
	  if ($.trim($("#accountname").val())=="") {
		  $("#blank-alert").alert();
		  $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
		  $("#blank-alert").hide();
	 });
	 sessionStorage.removeItem('custsupdata');
		  $("#accname").focus().select();
			return false;
		  }
		  
		let custname=$("#accountname").val();
		var statusinout;
		if (custsup == '9') {
		  $("#status").val('9');
		  statusinout = "in";
		}
		if (custsup == '15') {
		  $("#status").val('15');
		  statusinout = "out";
		}
	  $.ajax({
  
		  type: "POST",
		  url: "/customersuppliers?action=showaddpopup",
		  global: false,
		  async: false,
		  data: { "status": statusinout },
		  datatype: "text/html",
		  beforeSend: function(xhr) {
			xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		  },
		  success: function(resp) {
	
			$("#viewcustsup").html("");
			$('.modal-backdrop').remove();
			$('.modal').modal('hide');
			$("#viewcustsup").html(resp);
			  $('#custsupmodal').modal('show');
			$('#custsupmodal').on('shown.bs.modal', function(e) // shown.bs.modal is an event which fires when the modal is opened
					  {					
					  modalpresent = 1;
				if (custsup == '9') {
				  $("#add_cussup").val('19');
				} else {
				  $('#add_cussup').val('3');
				}
				$('#add_cussup_name').val(custname);
				$(".hidetitle").hide();
				$('#add_cussup_name').prop("disabled",true);
				$("#add_cussup_email").focus();  	
				$("#cussup_save_acc").show();
				$("#cussup_save").hide();		    
			  });
			$('#custsupmodal').on('hidden.bs.modal', function(e) // hidden.bs.modal is an event which fires when the modal is closeed
					  {
						modalpresent = 0;
				  $("#obal").focus().select();
					  });
			  }
		  });
			  
	});  


    $("#accountform").submit(function(e)
{

  if ($.trim($("#accountname").val())=="") {
    $("#blank-alert").alert();
    $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
      $("#blank-alert").hide();
    });
    $("#accname").focus().select();
    return false;
  }

  if ($.trim($("#groupname").data('value'))=="") {
    $("#grpblank-alert").alert();
    $("#grpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#grpblank-alert").hide();
    });
    $("#groupname").focus().select();
    return false;
  }

  if ($.trim($("#subgroupname option:selected").val())=="") {
    $("#sgrpblank-alert").alert();
    $("#sgrpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#sgrpblank-alert").hide();
    });
    $("#subgroupname").focus().select();
    return false;
  }

  if ($("#newsubgroup").is(':visible')) {

    if ($.trim($("#newsubgroup").val())=="") {
      $("#nsblank-alert").alert();
      $("#nsblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#nsblank-alert").hide();
      });
      $("#newsubgroup").focus().select();
      return false;
    }

  }

  var ob = $('#openbal').val();
  if(ob=="")
  {
    $('#openbal').val("0.00");
  }

    /** Under Sub-Group 'Bank' is selected and 'bnkac' checkbox is 'checked' then set 'defaultflag' is 2, 
        If 'Cash' is selected and 'chsac' checkbox is 'checked' then set 'defaultflag' is 3.
     **/
    if($("#bnkac").is(':checked')){
	var defaultflag = 2;
    }else if($("#chsac").is(':checked')){
	defaultflag = 3;
    }else if($("#purac").is(':checked')){
	defaultflag = 16;
    }else if($("#saleac").is(':checked')){
	defaultflag = 19;
	}else if($("#roundoffpaid").is(':checked')){
	defaultflag = 180;
	}else if($("#roundoffreceived").is(':checked')){
	defaultflag = 181;
	}
	else{
	defaultflag = 0;
	}
  $("#msspinmodal").modal("show");
  $.ajax(
    {

      type: "POST",
      url: "/addaccount",
      global: false,
      async: false,
      datatype: "json",
	data: {"accountname":$("#accountname").val(), "openbal":$("#openbal").val(), "groupname":$("#groupname").data('value'),"defaultflag":defaultflag, "subgroupname":$("#subgroupname option:selected").val(), "newsubgroup":$("#newsubgroup").val(),"moredata":JSON.stringify(custsupdatatemp)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        if(resp["gkstatus"]==0)
        {
		sessionStorage.removeItem('custsupdata');
          $('.modal-backdrop').remove();
          $("#success-alert").alert();
            $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#success-alert").hide();
		$("#reset").click();
          });
        }
        else if(resp["gkstatus"]==1)
          {
	    $("#msspinmodal").modal("hide");
	    $('.modal-backdrop').remove();
            $("#duplicate-alert").alert();
            $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#duplicate-alert").hide();
            });
            $("#accname").focus().select();
          }
        else
          {
	    $("#msspinmodal").modal("hide");
	    $('.modal-backdrop').remove();
            $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#failure-alert").hide();
          });
          $("#accname").focus().select();
        }
      }

    }
  );

  e.preventDefault();
}
);

    //Events for gst checkbox
    //Change event - toggling fields when checkbox is checked or unchecked.
    $('#gstaccount').change(function(){
	if ($(this).is(":checked")) {
	    $('#accountname').prop("disabled", true);
	    $("#gstaccountdiv").show();
	}
	else {
	    $('#accountname').prop("disabled", false);
	    $("#gstaccountdiv").hide();
	}
    });
    //Key event for navigation
    $('#gstaccount').keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($(this).is(":checked")) {
		$("#taxtype").focus();
	    }
	    else{
		$('#accountname').focus();
	    }
	}
	else if (event.which == 38) {
	    if ($("#newsubgroup").is(':visible')) {
		$("#newsubgroup").focus().select();
	    }
	    else {
		$("#maccounts").focus();
	    }
	}
    });
  $('#maccounts').change(function() {
  if($('#maccounts').attr('checked', true)){
      $(".defbx").attr('checked',false);
	  $("#gstaccount").attr('checked',false);
	  $("#addcust").addClass("disabled");
  }
  if ($.trim($("#groupname").data('value'))=="") {
    $("#grpblank-alert").alert();
    $("#grpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#grpblank-alert").hide();
    });
    $("#groupname").focus().select();
    $('#maccounts').attr('checked', false);
    return false;
  }
  else if($.trim($("#subgroupname option:selected").val())=="") {
    $("#sgrpblank-alert").alert();
    $("#sgrpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#sgrpblank-alert").hide();
    });
    $("#subgroupname").focus().select();
    $('#maccounts').attr('checked', false);
    return false;
  }
  else if ($("#newsubgroup").is(':visible')) {

    if ($.trim($("#newsubgroup").val())=="") {
      $("#nsblank-alert").alert();
      $("#nsblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#nsblank-alert").hide();
      });
      $("#newsubgroup").focus().select();
      $('#maccounts').attr('checked', false);
      return false;
    }

  }

      var url = "/showmultiacc";
      if ($("#groupname").text() == "Current Liabilities" && $("#subgroupname option:selected").text() == "Duties & Taxes" && ($("#vatorgstflag").val() == 7 || $("#vatorgstflag").val() == 29)) {
	  url = "/showmultiacc?taxes";
      }
      $.ajax({
	  type: "POST",
	  url: url,
	  data: {"groupcode":$("#groupname").data('value'),"groupname":$("#groupname").text(),"subgroupcode":$("#subgroupname option:selected").val(),"subgroupname":$("#subgroupname option:selected").text(),"newsubgroup":$("#newsubgroup").val()},
	  global: false,
	  async: false,
	  datatype: "text/html",
	  beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      }
      })
	  .done(function(resp) {
	      $("#multiaccount_modal").html("");
	      $('.modal-backdrop').remove();
	      $('.modal').modal('hide');
	      $("#multiaccount_modal").html(resp);
	      $("#m_multiacc").modal('show');
	      $('#m_multiacc').on('shown.bs.modal', function (e){
		  if($("#subgroupname option:selected").text() == 'Bank' || $("#subgroupname option:selected").text() == 'Cash' || $("#subgroupname option:selected").text() == 'Purchase' || $("#subgroupname option:selected").text() == 'Sales'){
		      $(".default:first").focus().select();
		  }else if ($("#m_gstaccount").is(":visible")) {
		      $("#m_gstaccount").focus().select();
		      $("input.gstaccountfields, select.gstaccountfields").prop("disabled", true);
		  }
		  else{
		      $(".m_accname:enabled:first").focus().select();
		  }	  
	      });
	      $('#m_multiacc').on('hidden.bs.modal', function (e){
		  $('#maccounts').attr('checked', false);
		  $("#multiaccount_modal").html("");
		  $("#reset").click();
	      });

	  })
	  .fail(function() {
	      console.log("failed");
	  });
  });

	 var modalpresent = 0;
	 $(document).off("keyup").on("keyup", function(event) {
		 if (event.which == 45) {
			 event.preventDefault();
			 if (modalpresent == 0) {
				 $("#submit").click();
			 }
			 else {
				 $("#cussup_save_acc").click();
			 }
			 return false;
		 }
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
		$('#confirm_yes_print').modal('show').one('click', '#tn_save_yesprint', function (e)
		{
		var form_data = new FormData();
		var file = $("#my-file-selector")[0].files[0];
		form_data.append("xlsxfile",file);
		$("#msspinmodal").modal("show");
		$.ajax({
		  type: "POST",
		  url: "/import?action=accountimport",
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
			console.log(resp)
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
