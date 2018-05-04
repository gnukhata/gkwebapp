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
  $("#groupname").focus().select();
    $("#accountform").validate();
    var taxstate = "";
    var taxtype = "";
    var taxrate = "";
    var cessrate = "";
  $("#groupname").bind("change keyup", function(){
      var gname = $("#groupname option:selected").text();
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
          $('#subgroupname').empty();
          for (i in subgroups ) {
            $('#subgroupname').append('<option value="' + subgroups[i].subgroupcode + '">' +subgroups[i].subgroupname+ '</option>');
          }
            var grpnam=$("#groupname option:selected").text();
            $('#subgroupname').prepend('<option value="None">None</option>');
	    $("#subgroupname option:first").attr("selected", "selected");
            $('#subgroupname').append('<option value="New">New Sub-Group</option>');
        }
      });
    }
  });

  
  $("#nsgp").hide();

  $(".gsselect").bind("change keyup", function(){
    var sgroups = $("#subgroupname option:selected").val();
    if (sgroups=="New")
    {
      $("#nsgp").show();

    }
    else
    {
      $("#nsgp").hide();
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
      }else if($.trim($("#subgroupname option:selected").text()) == 'Cash'){
	  $("#chsdiv").show();
	  $("#bnkdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Purchase'){
	  $("#chsdiv").hide();
	  $("#bnkdiv").hide();
	  $("#purdiv").show();
	  $("#salediv").hide();
      }else if($.trim($("#subgroupname option:selected").text()) == 'Sales'){
	  $("#purdiv").hide();
	  $("#salediv").show();
	  $("#chsdiv").hide();
	  $("#bnkdiv").hide();
      }else{
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
	      if ($.trim($("#groupname option:selected").val())=="") {
		  
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
      $("#maccounts").focus().select();
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
	    var gname = $("#groupname option:selected").text();    //Storing selected value from Goup Name dropdown list. 
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

  if ($.trim($("#groupname option:selected").val())=="") {
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
    }else{
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
	data: {"accountname":$("#accountname").val(), "openbal":$("#openbal").val(), "groupname":$("#groupname option:selected").val(),"defaultflag":defaultflag, "subgroupname":$("#subgroupname option:selected").val(), "newsubgroup":$("#newsubgroup").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        if(resp["gkstatus"]==0)
        {
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
  }
  if ($.trim($("#groupname option:selected").val())=="") {
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

  $.ajax({
    type: "POST",
    url: "/showmultiacc",
    data: {"groupcode":$("#groupname option:selected").val(),"groupname":$("#groupname option:selected").text(),"subgroupcode":$("#subgroupname option:selected").val(),"subgroupname":$("#subgroupname option:selected").text(),"newsubgroup":$("#newsubgroup").val()},
    global: false,
    async: false,
    datatype: "text/html"

  })
  .done(function(resp) {
    $("#multiaccount_modal").html("");
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $("#multiaccount_modal").html(resp);
    $("#m_multiacc").modal('show');
    $('#m_multiacc').on('shown.bs.modal', function (e)
    {
	if($("#subgroupname option:selected").text() == 'Bank' || $("#subgroupname option:selected").text() == 'Cash' || $("#subgroupname option:selected").text() == 'Purchase' || $("#subgroupname option:selected").text() == 'Sales'){
	    $(".default:first").focus().select();
	}else{
	    $(".m_accname:first").focus().select();
	}

    });
    $('#m_multiacc').on('hidden.bs.modal', function (e)
    {
      $('#maccounts').attr('checked', false);
      $("#multiaccount_modal").html("");
      $("#reset").click();

    });

  })
  .fail(function() {
    alert("failed");
  });
  });
     $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	event.preventDefault();
	    $("#submit").click();
      }
     });
});
