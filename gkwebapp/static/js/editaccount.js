
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
"Prajkta Patkar" <prajakta@dff.org.in>
*/

$(document).ready(function()
{
  $("#baltbl").hide();
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  $("#editaccountname").focus();
  $("#editaccountform").validate();
  $("#editaccountform").hide();
  $("#alertmsg").hide();  
  $("#addcust").hide();
  $("#bnkac").prop("disabled",false);
  $("#chsac").prop("disabled",false);  
  $('#openingbal').numeric();   //numeric is a library used for restricting the user to input only numbers and decimal inside a text box
  $("#submit").hide();
  $("#delete").hide();
  var custsup;
  var deflag;  
  var oldcustname;
  var custsupflag = 0;
  $(".editaccountname-option").click(function(){

    $("#editaccountname").data("value", $(this).data("value"));
    $("#editaccountname").data("sysaccount", $(this).data("sysaccount"));
    $("#editaccountname").text($(this).text());
    $("#editaccountname").focus();
	  
        custsupflag = 0;
        custsupdatatemp = {};
        $("#addcust").hide();
        $("#addcust").addClass('disabled');
        oldcustname = $("#editaccountname").text();
        $("#submit").hide();
        $("#alertmsg").hide();
        var acccode = $("#editaccountname").data('value');
        var accname= $("#editaccountname").text();
        var sysaccount = $("#editaccountname").data("sysaccount");

    if (acccode !=""){
    $.ajax({
      type: "POST",
      url: "/getaccdetails",
      data: {"accountcode":acccode},
      global: false,
      async: false,
      dataType: "json",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(jsonObj)
      {
        let accdetails=jsonObj["gkresult"];  
	deflag = accdetails["defaultflag"];
	$("#editaccountform").show();  
	$("#groupname").val(accdetails["groupcode"]);
        $("#groupname").prop("disabled", true);  
	$('#subgroupname').empty();
	$('#subgroupname').append('<option value="' + accdetails["subgroupcode"] + '">' + accdetails["subgroupname"] + '</option>');  
        $("#subgroupname").prop("disabled", true);
    $("groupname").change();  
    if ($("#groupname option:selected").text() == 'Indirect Expense'){
        if(accdetails["defaultflag"] == 180){
        $("#alertroundoffpaid").alert();
        $("#alertroundoffpaid").show();
        $("#roundoffdivpaid").hide();
        $("#roundoffdivreceived").hide();
        $("#alertroundoffreceived").hide();
        }
        else{
            $("#alertroundoffpaid").hide();
            $("#alertroundoffreceived").hide();
            $("#roundoffdivreceived").hide();
            $("#roundoffdivpaid").show();
            $("#roundoffpaid").prop("checked", false);
		    $("#roundoffpaid").prop("disabled", true);
        }
    }
    else if ($("#groupname option:selected").text() == 'Indirect Income'){
        if(accdetails["defaultflag"] == 181){
            $("#alertroundoffpaid").alert();
            $("#alertroundoffpaid").hide();
            $("#roundoffdivpaid").hide();
            $("#roundoffdivreceived").hide();
            $("#alertroundoffreceived").show();
        }
        else{
            $("#alertroundoffpaid").hide();
            $("#alertroundoffreceived").hide();
            $("#roundoffdivreceived").show();
            $("#roundoffdivpaid").hide();
            $("#roundoffreceived").prop("checked", false);
		    $("#roundoffreceived").prop("disabled", true);
        }
    }
    else{
        $("#roundoffdivpaid").hide();
        $("#alertroundoffpaid").hide();
        $("#roundoffdivreceived").hide();
        $("#alertroundoffreceived").hide();
    }
	if($('#subgroupname').text() == "Bank"){
	    $("#chsdiv").hide();
	    $("#salediv").hide();
	    $("#purdiv").hide();
	    $("#alertchs").hide();
	    $('#alertpur').hide();
        $('#alertsale').hide();
        $('#roundoffsale').hide();
	    if(accdetails["defaultflag"] == 2){
		$("#alertbnk").alert();
        $("#alertbnk").show();
		$("#bnkdiv").hide();
	    }else{
		$("#bnkdiv").show();
        $("#alertbnk").hide();
        $('#roundoffsale').hide();
		$("#bnkac").prop("checked", false);
		$("#bnkac").prop("disabled", true);
	    }
	}else if($('#subgroupname').text() == "Cash"){
	    $("#bnkdiv").hide();
	    $("#salediv").hide();
	    $("#purdiv").hide();
        $("#alertbnk").hide();
        $('#roundoffsale').hide();
	    $('#alertpur').hide();
	    $('#alertsale').hide();
            if(accdetails["defaultflag"] == 3){
		$("#alertchs").alert();
		$("#alertchs").show();
		$("#chsdiv").hide();
	    }else{
		$("#alertbnk").hide();
		$("#chsdiv").show();
		$("#chsac").prop("checked", false);
		$("#chsac").prop("disabled", true);
	    }
	}else if($('#subgroupname').text() == "Purchase"){
	    $("#salediv").hide();
	    $("#bnkdiv").hide();
	    $("#chsdiv").hide();
	    $("#alertsale").hide();
	    $("#alertbnk").hide();  
	    $("#alertchs").hide();
	    if(accdetails["defaultflag"] == 16){
		$("#purdiv").hide();
		$("#alertpur").alert();
		$("#alertpur").show();
	    }else{
		$("#alertpur").hide();
		$("#purdiv").show();
		$("#purac").prop("checked", false);
		$("#purac").prop("disabled", true);
	    }
	}else if($('#subgroupname').text() == "Sales"){
	    $("#purdiv").hide();
	    $("#bnkdiv").hide();
	    $("#chsdiv").hide();
	    $("#alertpur").hide();
	    $("#alertbnk").hide();  
	    $("#alertchs").hide();
            if(accdetails["defaultflag"] == 19){
		$("#salediv").hide();
		$("#alertsale").alert();
		$("#alertsale").show();
	    }else{
		$("#alertsale").hide();
		$("#salediv").show();
		$("#saleac").prop("checked", false);
		$("#saleac").prop("disabled", true);
	    }
    }else if($("#subgroupname").text() == 'Sundry Debtors'){
		$("#addcust").show();
    custsup = '15';
    custsupflag = 1;
	  }else if($("#subgroupname").text() == 'Sundry Creditors for Purchase'){
		$("#addcust").show();
    custsup = '9';
    custsupflag = 1;
	  }
    else{
	    $("#bnkdiv").hide();
	    $("#chsdiv").hide();
	    $("#salediv").hide();
	    $("#purdiv").hide();
	    $("#alertbnk").hide();  
        $("#alertchs").hide();
        $('#roundoffsale').hide();
	    $("#alertpur").hide();
        $("#alertsale").hide();
		$("#addcust").hide();
        
	}
	$("#accountname").val(accdetails["accountname"]);
        $("#accountname").prop("disabled", true);
        $("#openingbal").val(accdetails["openingbal"]);
        $("#openingbal").prop("disabled", true);
        $("#accountcode").val(accdetails["accountcode"]);

 
    if(accname=="Income & Expenditure" ||  accname=="Profit & Loss" )
    {
      $("#accnamenoedit").hide();

      $("#alertmsg").alert();
      $("#alertmsg").show();

      $("#delete").hide();
      $("#edit").hide();

    }
    else if(accname=="Closing Stock" || accname=="Stock at the Beginning" || accname=="Opening Stock" || sysaccount == 1){

      $("#accnamenoedit").alert();
      $("#accnamenoedit").show();
      $("#alertmsg").hide();
      $("#delete").hide();
      $("#edit").show();
    }
    else
    {
      $("#accnamenoedit").hide();
      $("#alertmsg").hide();
      $("#delete").show();
      $("#edit").show();
    }

    if(accdetails["defaultflag"] == 2 || accdetails["defaultflag"] == 3 || accdetails["defaultflag"] == 19 || accdetails["defaultflag"] == 16 || sysaccount == 1){
	$("#delete").hide();
    }else{
	$("#delete").show();
    }
    var grpname = $("#groupname option:selected").text();
	if (grpname=="Direct Expense"|| grpname=="Direct Income"||grpname=="Indirect Expense"|| grpname=="Indirect Income") {
	    $("#openingbal").hide();
	    $("#openbal").hide();
	    $("#baltbl").hide();
	}
	else {
	    $("#openingbal").show();
	    $("#openbal").show();
	    $("#baltbl").show();
	} 
      }
    });
    }
  });

    $("#editaccountname-input").keyup(function(event){
    let searchtext = $("#editaccountname-input").val().toLowerCase();
    if (searchtext != "") {
      $(".editaccountname-option").each(function(index){
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
      $(".editaccountname-option").each(function(index){
	$(this).parent().show();
	$(this).show();
      });
    }
  });

  $(document).off('keydown' ,'#editaccountname-input').on('keydown' ,'#editaccountname-input',function(event) {
    if (event.which == 13 || event.which == 40){
      event.preventDefault();
      $("#editaccountname-input").parent().parent().find("a:visible").first().focus();
    }
  });

  $(".searchabledropdown").on("shown.bs.dropdown", function () {
    let searchinput = $(this).data("input-id");
    document.getElementById(searchinput).focus();
  });



  $("#edit").click(function(event)
  {
    event.preventDefault();
    var grpname= $("#groupname").val();  

    $("#submit").show();
    $("#alertmsg").hide();
    $("#edit").hide();
    $("#addcust").removeClass('disabled');
    var acccode = $("#editaccountname").data('value');
      var accname= $("#editaccountname").text();
      var sysaccount = $("#editaccountname").data("sysaccount");
    if (accname=="Closing Stock" || accname=="Stock at the Beginning" || accname=="Opening Stock" || sysaccount == 1){
      $("#accountname").prop("disabled", true);
      $("#openingbal").prop("disabled", false);
      $("#openingbal").focus().select();
      $("#groupname").prop("disabled", true);
      $("#subgroupname").prop("disabled", true);
      $("#newsubgrouptxt").hide();
    }
    else{
      if (grpname=="Direct Expense"|| grpname=="Direct Income"||grpname=="Indirect Expense"|| grpname=="Indirect Income") {
        $("#openingbal").prop("disabled", true);
      }
      else {
        $("#openingbal").prop("disabled", false);
      }
      $("#bnkac").prop("disabled",false);
      $("#roundoffpaid").prop("disabled",false);
      $("#roundoffreceived").prop("disabled",false);
      $("#chsac").prop("disabled",false);
      $("#purac").prop("disabled",false);
      $("#saleac").prop("disabled",false);
      $("#accountname").prop("disabled",false);
      $("#groupname").focus().select();
	if(deflag == 2 || deflag == 3 || deflag == 16 || deflag == 19 || deflag == 180 || deflag == 181){
	    $("#groupname").prop('disabled',true);
	    $("#subgroupname").prop("disabled", true);
        $("#newsubgrouptxt").hide();
	    $("#accountname").focus().select();
	}else{
	    $("#subgroupname").prop("disabled", false);
        $("#newsubgrouptxt").show();
	    $("#groupname").prop("disabled", false);
	    $("#groupname").focus().select();
	}
    }
  }
);
    //Change event for 'group name' field.
    $("#groupname").bind("change keyup", function(){
      $("#addcust").hide();
	if($("#editaccountname").data('value') !=""){
	    var gname = $("#groupname option:selected").text();
	    if (gname=="Direct Expense"|| gname=="Direct Income"||gname=="Indirect Expense"|| gname=="Indirect Income") {
		$("#openingbal").hide();
		$("#openbal").hide();
        $("#baltbl").hide();
        if(gname=="Indirect Expense"){
            $("#roundoffdivpaid").show();
       $("#roundoffdivreceived").hide();
        }
        else{
            $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").show();
        }
	    }
	    else {
		$("#openingbal").show();
		$("#openbal").show();
        $("#baltbl").show();
        $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").hide();
        }
    if (gname=="Current Assets"|| gname=="Current Liabilities"){
      $("#addcust").show();
    }
        
	}
	var groups = $("#groupname option:selected").val();
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
		    var subgrp = $("#subgroupname option:selected").val();
		    $('#subgroupname').empty();
		    var grpnam=$("#groupname option:selected").text();
		    $('#subgroupname').prepend('<option value="None">None</option>');
		    $('#subgroupname option:first').attr("selected", "selected");		    
		    for (i in subgroups ) {
			//assign subgroup name selected if assign 'group name' is not changed.
			if(subgrp == subgroups[i].subgroupcode){
			    $('#subgroupname').append('<option value="' + subgroups[i].subgroupcode + '" selected>' +subgroups[i].subgroupname+ '</option>');
			}
			else{
			    $('#subgroupname').append('<option value="' + subgroups[i].subgroupcode + '">' +subgroups[i].subgroupname+ '</option>');
			}
		    }
		    $('#subgroupname').append('<option value="New">New Sub-Group</option>');
		}
	    });
	}
    });

    //Keydown for 'group name' field.
    $("#groupname").keydown(function(event){
	if(event.which == 13){
	    event.preventDefault();
	    $("#subgroupname").focus().select();
	}
	$("#groupname").change();
    });

    //Keydown for 'subgroupname' field.
    $("#subgroupname").keydown(function(event){
        if(event.which==16){
		$("#subgroupname option").filter(function(i, e) { return $(e).text() == "New Sub-Group"; }).prop('selected', true);
		$("#nsgp").show();
        $('.default').hide();
		$("#newsubgroup").focus().select();
		}
	if(event.which == 13){
	    event.preventDefault();
	    if($.trim($("#subgroupname option:selected").val())=="New"){
		$("#newsubgroup").focus().select();
	    }else if($(".defbx").is(':visible')){
		$(".defbx").focus().select();
	    }else{
		$("#accountname").focus();
	    }
	}
	if(event.which ==38 && (document.getElementById('subgroupname').selectedIndex==0)){
	    event.preventDefault();
	    $("#groupname").focus().select();
	}
    });

    $("#nsgp").hide();
    $(".gsselect").bind("change keyup", function(){
      $("#addcust").hide();
	var sgroups = $("#subgroupname option:selected").val();
	if(sgroups == "New"){
        $("#nsgp").show();
        $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").hide();
	}else{
        $("#nsgp").hide();
        if ($("#groupname option:selected").text()=="Indirect Expense"){
            $("#roundoffdivpaid").show();
            $("#roundoffdivreceived").hide();
        }
        if ($("#groupname option:selected").text()=="Indirect Income"){
            $("#roundoffdivpaid").hide();
            $("#roundoffdivreceived").show();
        }
        
	}

	if($.trim($("#subgroupname option:selected").text()) == 'Bank'){
	  $("#bnkdiv").show();
	  $("#chsdiv").hide();
	  $("#purdiv").hide();
      $("#salediv").hide();
      $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Cash'){
	  $("#chsdiv").show();
	  $("#bnkdiv").hide();
	  $("#purdiv").hide();
      $("#salediv").hide();
      $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Purchase'){
	  $("#chsdiv").hide();
	  $("#bnkdiv").hide();
	  $("#purdiv").show();
      $("#salediv").hide();
      $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Sales'){
	  $("#purdiv").hide();
	  $("#salediv").show();
	  $("#chsdiv").hide();
      $("#bnkdiv").hide();
      $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Sundry Debtors' && $("#groupname option:selected").text()=="Current Assets"){
		$("#addcust").show();
    custsup = '15';
    custsupflag = 1;
	  }else if($.trim($("#subgroupname option:selected").text()) == 'Sundry Creditors for Purchase' && $("#groupname option:selected").text()=="Current Liabilities"){
		$("#addcust").show();
    custsup = '9';
    custsupflag = 1;
	  }else{
	  $("#bnkdiv").hide();
	  $("#chsdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
      }
	
    });
    if($.trim($("#groupname option:selected").text()) == 'Indirect Expense'){
       $("#roundoffdivpaid").show();
       $("#roundoffdivreceived").hide();
    }
    else if($.trim($("#groupname option:selected").text()) == 'Indirect Income'){
        $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").show();
    }
    else{
        $("#roundoffdivpaid").hide();
       $("#roundoffdivreceived").hide();
    }

    /** Keydown for 'bnkac' and 'chsac' checkbox **/
    $(".defbx").keydown(function(event){
	if(event.which==13) {
	    event.preventDefault();
	    $("#accountname").focus();
	}
	if (event.which==38){
	    $("#subgroupname").focus();
	}
    });


    //Keydown for 'Newsubgroup name' field.
    $("#newsubgroup").keydown(function(event){
	if(event.which == 13){
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
				data: {"groupname": $("#groupname option:selected").val(),"newsubgroup":$("#newsubgroup").val()},
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
	if(event.which == 38){
	    event.preventDefault();
	    $("#subgroupname").focus().select();
	}
    });

$("#editaccountname").keyup(function(e) {
  if($("#editaccountform").is(':visible'))
  {
    if(e.which == 13)
    {  if( $("#editaccountname").text()=="Income & Expenditure" ||  $("#editaccountname").text()=="Profit & Loss" )
    {
      $("#alertmsg").alert();
      $("#alertmsg").show();

    }
    else
    {
      $("#edit").click();
    }
  }
}
else {
  if (!$("#editaccountname").hasClass("open")){
$("#editaccountname").click();
  }
}
});

$("#accountname").keydown(function(event) {
  /* Act on the event */

    if (event.which==40)
    {

	$("#openingbal").select().focus();
    }
    if (event.which==13) {	
	if (!$("#openingbal").is(':disabled')) {
	    event.preventDefault();
	    if ($.trim($("#accountname").val())=="") {
		$("#blank-alert").alert();
		$("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#blank-alert").hide();
		});
		$("#accountname").focus().select();
		return false;
	    };
	    $("#openingbal").focus().select();
	}
	if(!$("#openingbal").is(':visible')){
	    $("#editaccountform").submit();
	}
    }
    if(event.which == 38){
	event.preventDefault();
	if($("#newsubgroup").is(':visible')){
	    $("#newsubgroup").focus();
	}else if($(".defbx").is(':visible')){
	    $(".defbx").focus().select();
	}else{
	    $("#subgroupname").focus();
	}
    }
});

$("#openingbal").keydown(function(event) {
  /* Act on the event */
  if (event.which==38)
  {
    $("#accountname").select();
    $("#accountname").focus();
  }
});


$("#reset").click(function()
{
  $('#edit_account').click();
}
);



$(document).off("click","#delete").on("click", "#delete", function(event)
{
  event.preventDefault();
  $("#msspinmodal").modal("show");
  $('.modal-backdrop').remove();
  $('.modal').modal('hide');
  $('#m_confirmdel').modal('show').one('click', '#accdel', function (e)
  {

    var code = $("#editaccountname").data('value');
    $.ajax(
      {

        type: "POST",
        url: "/deleteaccount",
        global: false,
        async: false,
        datatype: "json",
        data:{"accountcode":code},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if (resp["gkstatus"]==0) {
            $("#reset").click();
            $('.modal-backdrop').remove();
            $("#delsuccess-alert").alert();
            $("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#delsuccess-alert").hide();
            });
          }
          else if (resp["gkstatus"]==5) {
            $("#transaction-alert").alert();
            $("#transaction-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#transaction-alert").hide();
            });
            $("#editaccountname").focus().select();
          }

        }
      }
    );

  });
  $('#m_confirmdel').on('shown.bs.modal', function(event) {
    $("#m_cancel").focus();
  });
  $('#m_confirmdel').on('hidden.bs.modal', function(event) {
    $("#editaccountname").focus();
  });


}
);



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
   if (panno1 != ''){
    custsupdatatemp["gstin"] = gobj;
}
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
     custsupdatatemp["bankdetails"] = bankdetails;
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
    custsupdatatemp["state"] = $("#add_state").val();
    custsupdatatemp["csflag"] = $("#add_cussup").val();
    custsupdatatemp["state"] = $("#add_state").val();
    custsupdatatemp["state"] = $("#add_state").val();
    custsupdatatemp["oldcustname"] = oldcustname;
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
                // $('#checkbnkpop').val(1);
                // $("#bankdetails").show();
                // $("#textareahelplbl").hide();
              } else {
                $('#add_cussup').val('3');
                // $('#checkbnkpop').val(0);
                // $("#bankdetails").hide();
                // $("#textareahelplbl").show();
              }
              $('#add_cussup_name').val(custname);
              $(".hidetitle").hide();
              $('#add_cussup_name').prop("disabled",true);
              $("#add_cussup_email").focus();  	
              $("#cussup_save_acc").show();
              $("#cussup_save").hide();		    
            });
            if(!(jQuery.isEmptyObject(custsupdatatemp))){
              custresp=custsupdatatemp;
            }else{
            $.ajax({

              type: "POST",
              url: "/customersuppliers?action=getforacc",
              global: false,
              async: false,
              data: { "custname": oldcustname },
              datatype: "text/html",
              beforeSend: function(xhr) {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
              },
                success: function(resp) {
                custresp=resp.gkresult;
              }
            });
          }
            if(!(jQuery.isEmptyObject(custresp)))  {
              var rowhtml = $('#gstintable tbody tr:first').html();
              $("#add_cussup_email").val(custresp["custemail"]);
              $("#add_cussup_phone").val(custresp["custphone"]);
              $("#add_state").val(custresp["state"]);
              $("#add_cussup_address").val(custresp["custaddr"]);
              $("#add_cussup_pin").val(custresp["pincode"]);
              $("#add_cussup_fax").val(custresp["custfax"]);
              $("#add_cussup_pan").val(custresp["custpan"]);
              if(jQuery.isEmptyObject(custresp["gstin"])){
                $('#gstintable tbody').empty();
                $('#gstintable tbody').append('<tr>' + rowhtml + '</tr>');	
                $('#gstintable tbody tr:last td:eq(0) select option[stateid='+gstin+']').prop("selected", true);
                $('#gstintable tbody tr:last td:eq(1) input:eq(0)').val("");
                $('#gstintable tbody tr:last td:eq(1) input:eq(1)').val("");
                $('#gstintable tbody tr:last td:eq(1) input:eq(2)').val("");
              }else{
                $('#gstintable tbody').empty(); 
                  for(var gstin in custresp["gstin"]){
                var gstinstr = custresp["gstin"][gstin];
                $('#gstintable tbody').append('<tr>' + rowhtml + '</tr>');	
                $('#gstintable tbody tr:last td:eq(0) select option[stateid='+gstin+']').prop("selected", true);
                $('#gstintable tbody tr:last td:eq(1) input:eq(0)').val(gstinstr.substring(0, 2));
                $('#gstintable tbody tr:last td:eq(1) input:eq(1)').val(gstinstr.substring(2, 12));
                $('#gstintable tbody tr:last td:eq(1) input:eq(2)').val(gstinstr.substring(12, 15));
                  }
                  if (custresp["bankdetails"]["accountno"]) {
                    $("#bnkdetails").show();
                    $('#checkbnkpop').hide();
                    $("#cust_accountno").val(custresp["bankdetails"]["accountno"]);
                    $("#cust_bankname").val(custresp["bankdetails"]["bankname"]);
                    $("#cust_branchname").val(custresp["bankdetails"]["branchname"]);
                    $("#cust_ifsc").val(custresp["bankdetails"]["ifsc"]);
                      }
              }

            }

            $('#custsupmodal').on('hidden.bs.modal', function(e) // hidden.bs.modal is an event which fires when the modal is closeed
            {
            modalpresent = 0;

        $("#obal").focus().select();
            });
            }
        });
            
  });  







$("#editaccountform").submit(function(e)
{
  if ($.trim($("#accountname").val())=="") {
    $("#blank-alert").alert();
    $("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#blank-alert").hide();
    });
    $("#accountname").focus().select();
    return false;
  };

  var ob = $('#openingbal').val();  
  if(ob=="")
  {
      var openingbal=0.00;
  }
  else {
      openingbal=$("#openingbal").val();
  }
  var acccode = $("#editaccountname").data('value');
  var accname= $("#editaccountname").text();
  if(accname=="Closing Stock" || accname=="Stock at the Beginning"){
     var accountname=accname;
  }
  else{
    accountname=$("#accountname").val();
  }

    /** Under Sub-Group 'Bank' is selected and 'bnkac' checkbox is 'checked' then set 'defaultflag' is 2, 
        If 'Cash' is selected and 'chsac' checkbox is 'checked' then set 'defaultflag' is 3 otherwise set 'defaultflag' is 0.
    **/

    if($("#bnkac").is(':checked')){
	var defaultflag = 2;
    }else if($("#chsac").is(':checked')){
	defaultflag = 3;
    }else if($("#purac").is(':checked')){
	defaultflag = 16;
    }else if($("#saleac").is(':checked')){
	defaultflag = 19;
    }
    else if($("#roundoffpaid").is(':checked')){
    defaultflag = 180;
    }else if($("#roundoffreceived").is(':checked')){
    defaultflag = 181;
    }
    else if(deflag == 2){
	defaultflag = 2;
    }else if(deflag == 3){
	defaultflag = 3;
    }else if(deflag == 16){
	defaultflag = 16;
    }else if(deflag == 19){
	defaultflag = 19;
    }else if(deflag == 180){
    defaultflag = 180;
    }else if(deflag == 181){
    defaultflag = 181;
    }
    else{
	defaultflag = 0;
    }
    
    var accountcode = $("#accountcode").val();
    var groupname = $("#groupname option:selected").text();
    var groupcode = $("#groupname option:selected").val();
    var subgrpname = $("#subgroupname option:selected").text();
    var subgrpcode = $("#subgroupname option:selected").val();
    var newgrpname = $("#newsubgroup").val();
  $("#msspinmodal").modal("show");
  
  $.ajax(
    {
      type: "POST",
      url: "/editaccount",
      global: false,
      async: false,
      datatype: "json",
	data: {"accountname":accountname, "accountcode":accountcode, "openingbal":openingbal, "groupname":groupname, "groupcode":groupcode, "subgrpname":subgrpname, "subgrpcode":subgrpcode, "newgrpname":newgrpname, "defaultflag":defaultflag,"moredata":JSON.stringify(custsupdatatemp),"oldcustname":oldcustname,"custsupflag":custsupflag},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        if(resp["gkstatus"]==0)
        {
          $("#reset").click();
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#success-alert").modal("hide");
          });
        }
        else if(resp["gkstatus"]==1)
        {
          $("#duplicate-alert").alert();
          $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#duplicate-alert").modal("hide");
          });
	    $("#msspinmodal").hide();
          $("#accountname").focus().select();
        }
        else
        {
          $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#failure-alert").hide();
          });
	    $("#msspinmodal").hide();
          $("#accountname").focus().select();
        }
      }
    }
  );

  e.preventDefault();
});
 var modalpresent = 0;
 $(document).off("keyup").on("keyup", function(event) {
   if (event.which == 45) {
     event.preventDefault();
     if (modalpresent == 0) {
       $("#editaccountform").click();
     }
     else {
       $("#cussup_save_acc").click();
     }
     return false;
   }
 });
});
