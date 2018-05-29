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
  $("#bnkac").prop("disabled",false);
  $("#chsac").prop("disabled",false);  
  $('#openingbal').numeric();   //numeric is a library used for restricting the user to input only numbers and decimal inside a text box
  $("#submit").hide();
  $("#delete").hide();
  $("#editaccountname").bind("change keyup", function()
  {	  
    $("#alertmsg").hide();
    var acccode = $("#editaccountname option:selected").val();
      var accname= $("#editaccountname option:selected").text();
      var sysaccount = $("#editaccountname option:selected").attr("sysaccount");
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
	$("#editaccountform").show();  
	$("#groupname").val(accdetails["groupcode"]);
        $("#groupname").prop("disabled", true);  
	$('#subgroupname').empty();
	$('#subgroupname').append('<option value="' + accdetails["subgroupcode"] + '">' + accdetails["subgroupname"] + '</option>');  
        $("#subgroupname").prop("disabled", true);
	$("groupname").change();
	if($('#subgroupname').text() == "Bank"){
	    $("#bnkdiv").show();
	    if(accdetails["defaultflag"] == 2){
		$("#bnkac").prop("checked", true);
		$("#bnkac").prop("disabled", true);
	    }else{
		$("#bnkac").prop("checked", false);
		$("#bnkac").prop("disabled", true);
	    }
	}else if($('#subgroupname').text() == "Cash"){
	    $("#chsdiv").show();
            if(accdetails["defaultflag"] == 3){
		$("#chsac").prop("checked", true);
		$("#chsac").prop("disabled", true);
	    }else{
		$("#chsac").prop("checked", false);
		$("#chsac").prop("disabled", true);
	    }
	}else{
	    $("#bnkdiv").hide();
	    $("#chsdiv").hide();
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

  $("#edit").click(function(event)
  {
    event.preventDefault();
    var grpname= $("#groupname").val();

    $("#submit").show();
    $("#alertmsg").hide();
   
    $("#edit").hide();
    var acccode = $("#editaccountname option:selected").val();
      var accname= $("#editaccountname option:selected").text();
      var sysaccount = $("#editaccountname option:selected").attr("sysaccount");
    if (accname=="Closing Stock" || accname=="Stock at the Beginning" || accname=="Opening Stock" || sysaccount == 1){
      $("#accountname").prop("disabled", true);
      $("#openingbal").prop("disabled", false);
      $("#openingbal").focus().select();
      $("#groupname").prop("disabled", true);
      $("#subgroupname").prop("disabled", true);
    }
    else{
      if (grpname=="Direct Expense"|| grpname=="Direct Income"||grpname=="Indirect Expense"|| grpname=="Indirect Income") {
        $("#openingbal").prop("disabled", true);
      }
      else {
        $("#openingbal").prop("disabled", false);

      }
      $("#bnkac").prop("disabled",false);
      $("#chsac").prop("disabled",false);
      $("#subgroupname").prop("disabled", false);
      $("#groupname").prop("disabled", false);
      $("#accountname").prop("disabled",false);
      $("#groupname").focus().select();

    }


  }
);
    //Change event for 'group name' field.
    $("#groupname").bind("change keyup", function(){
	if($("#editaccountname option:selected").val() !=""){
	    var gname = $("#groupname option:selected").text();
	    if (gname=="Direct Expense"|| gname=="Direct Income"||gname=="Indirect Expense"|| gname=="Indirect Income") {
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
	if(event.which == 13){
	    event.preventDefault();
	    if($.trim($("#subgroupname option:selected").val())=="New"){
		$("#newsubgroup").focus().select();
	    }else if($.trim($("#subgroupname option:selected").text())=="Bank"){
		$("#bnkac").focus().select();
	    }
	    else if($.trim($("#subgroupname option:selected").text())=="Cash"){
		$("#chsac").focus().select();
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
	var sgroups = $("#subgroupname option:selected").val();
	if(sgroups == "New"){
	    $("#nsgp").show();
	}else{
	    $("#nsgp").hide();
	}

	if($.trim($("#subgroupname option:selected").text()) == 'Bank'){
	    $("#bnkdiv").show();
	    $("#chsdiv").hide();
	}else if($.trim($("#subgroupname option:selected").text()) == 'Cash'){
	    $("#chsdiv").show();
	    $("#bnkdiv").hide();
	}else{
	    $("#bnkdiv").hide();
	    $("#chsdiv").hide();
	}
    });

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
	    $("#accountname").focus();
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
    {  if( $("#editaccountname option:selected").text()=="Income & Expenditure" ||  $("#editaccountname option:selected").text()=="Profit & Loss" )
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
	}else if($.trim($("#subgroupname option:selected").text())=="Bank"){
		$("#bnkac").focus().select();
	}
	else if($.trim($("#subgroupname option:selected").text())=="Cash"){
	    $("#chsac").focus().select();
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
  $('#editaccount').click();
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

    var code = $("#editaccountname option:selected").val();
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
  var acccode = $("#editaccountname option:selected").val();
  var accname= $("#editaccountname option:selected").text();
  if(accname=="Closing Stock" || accname=="Stock at the Beginning"){
     var accountname=accname;
  }
  else{
    accountname=$("#accountname").val();
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
	data: {"accountname":accountname, "accountcode":accountcode, "openingbal":openingbal, "groupname":groupname, "groupcode":groupcode, "subgrpname":subgrpname, "subgrpcode":subgrpcode, "newgrpname":newgrpname},
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
            $("#success-alert").hide();
          });
        }
        else if(resp["gkstatus"]==1)
        {
          $("#duplicate-alert").alert();
          $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#duplicate-alert").hide();
          });
	    $("#msspinmodal").modal("hide");
          $("#accountname").focus().select();
        }
        else
        {
          $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#failure-alert").hide();
          });
	    $("#msspinmodal").modal("hide");
          $("#accountname").focus().select();
        }
      }
    }
  );

  e.preventDefault();
});
 $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	event.preventDefault();
	    $("#editaccountform").submit();
      }
 });
});
