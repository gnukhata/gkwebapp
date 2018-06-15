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
*/

$(document).ready(function()
{
  $("#bnkdiv").hide();
  $("#chsdiv").hide();
  $("#purdiv").hide();
  $("#salediv").hide();
  $("#m_openbal").numeric();
  $("#gstaccount").prop("disabled", true);
  $("#gstfielddiv").show();
  $('#gstaccountfields').hide();  
  var sel1 = 0;
  var sel2 = 0;
  var taxstate = "";
  var taxtype = "";
  var taxrate = "";
  var cessrate = "";

  $("#m_groupname").focus(function() {
    sel1 = 1;
  });
  $("#m_groupname").blur(function(){
    sel1 = 0;
  });
  $("#m_subgroupname").focus(function() {
    sel2 = 1;
  });
  $("#m_subgroupname").blur(function(){
    sel2 = 0;
  });

  $('#m_accountname').keydown( function(event) {
    if (event.which==13)
     {
       event.preventDefault();
      if($("#m_openbal").is(':visible'))
      {
        $("#m_openbal").focus();
        $("#m_openbal").select();
      }
      else
      {
        $("#m_submit").click();

      }
    }
  });

  $("#m_groupname").focus();
  $("#m_accountform").validate();
  $("#m_groupname").bind("change keyup", function(){
    var gname = $("#m_groupname option:selected").text();

    if (gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income")
    {
      $("#m_obal").hide();
      $("#m_openbal").hide();
      $("#m_baltbl").hide();

    }
    else
    {
      $("#m_baltbl").show();
      $("#m_obal").show();
      $("#m_openbal").show();
    }

    var groups = $("#m_groupname option:selected").val();
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
        subgroups = jsonObj["gkresult"],
        $('#m_subgroupname').empty();
        for (i in subgroups ) {
          $('#m_subgroupname').append('<option value="' + subgroups[i].subgroupcode + '">' +subgroups[i].subgroupname+ '</option>');
        }
          var grpnam=$("#m_groupname option:selected").text();
          $('#m_subgroupname').prepend('<option value="None">None</option>');
	  $("#m_subgroupname option:first").attr("selected", "selected");
          $('#m_subgroupname').append('<option value="New">New Sub-Group</option>');
      }
    });
  });

$("#m_nsgp").hide();

$(".gsselect").bind("change keyup", function(){
var sgroups = $("#m_subgroupname option:selected").val();
if (sgroups=="New")
{
  $("#m_nsgp").show();

}
else
{
  $("#m_nsgp").hide();
}

    /** Under Group 'Current asset' if subgroup 'Bank' or 'Cash' is selected then 'bnkdiv' or 'chsdiv' show or hide respectively **/
      if($.trim($("#m_subgroupname option:selected").text()) == 'Bank'){
	  $("#bnkdiv").show();
	  $("#chsdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
      }else if($.trim($("#m_subgroupname option:selected").text()) == 'Cash'){
	  $("#chsdiv").show();
	  $("#bnkdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
      }else if($.trim($("#m_subgroupname option:selected").text()) == 'Purchase'){
	  $("#purdiv").show();
	  $("#salediv").hide();
	  $("#bnkdiv").hide();
	  $("#chsdiv").hide();
      }else if($.trim($("#m_subgroupname option:selected").text()) == 'Sales'){
	  $("#purdiv").hide();
	  $("#salediv").show();
	  $("#bnkdiv").hide();
	  $("#chsdiv").hide();
      }else{
	  $("#bnkdiv").hide();
	  $("#chsdiv").hide();
	  $("#purdiv").hide();
	  $("#salediv").hide();
      }

    // 'GST Account' field is display only if sub-group name is 'Duties & Taxes'. 
    if ($.trim($("#m_subgroupname option:selected").text()) == 'Duties & Taxes') {
	$('#gstaccountfields').show();
	$('#gstfielddiv').show();
	$("#gstaccount").prop("disabled", false);
    }
    else {
	$('#gstaccountfields').hide();
	$('#gstfielddiv').hide();
	$("#gstaccount").prop("disabled", true);
    }
});

// Keydown event for Group Name.
// Validations for Group Name.
      $("#m_groupname").keydown(function(event) {
	  if(event.which==13 || event.which == 9) {
	      event.preventDefault();
	      if ($.trim($("#m_groupname option:selected").val())=="") {	  
		  $("#m_grpblank-alert").alert();
		  $("#m_grpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
		      $("#m_grpblank-alert").hide();
		  });
		  $("#m_groupname").focus();
		  $("#m_groupname").select();
		  return false;
	      }
	  }
	  if(event.which==13){
	      event.preventDefault();
	      $("#m_subgroupname").focus().select();
	  }
      });

//key down event for subgroup.
    $("#m_subgroupname").keydown(function(event){
	if(event.which==13 || event.which == 9) {   
	    event.preventDefault();
	    if ($.trim($("#m_subgroupname option:selected").val())=="New"){
		$("#m_newsubgroup").focus().select();
	    }else if($.trim($("#m_subgroupname option:selected").text())=="Bank" || $.trim($("#m_subgroupname option:selected").text())=="Cash" || $.trim($("#m_subgroupname option:selected").text())=="Purchase" || $.trim($("#m_subgroupname option:selected").text())=="Sales"){
		$(".defbx").focus().select();
	    }else if($.trim($("#m_subgroupname option:selected").text())=="Duties & Taxes"){
		$('#gstaccount').focus().select();
	    }else {
		$("#m_accountname").focus().select();
	    }
	}
	if (event.which==38 && (document.getElementById('m_subgroupname').selectedIndex==0)) {
	    event.preventDefault();
	    $("#m_groupname").focus().select();
	}
    });

    /** Keydown for 'bnkac' and 'chsac' checkbox **/
    $(".defbx").keydown(function(event){
	if(event.which==13) {
	    event.preventDefault();
	    $("#m_accountname").focus();
	}
	if (event.which==38){
	    $("#m_subgroupname").focus();
	}
    });

//key down event for newsubgroup.
    $("#m_newsubgroup").keydown(function(event) {
	if (event.which==13 || event.which==9) {
	    event.preventDefault();
	    if ($.trim($("#m_newsubgroup").val())=="") {
		$("#m_nsblank-alert").alert();
		$("#m_nsblank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#m_nsblank-alert").hide();
		});
		$("#m_newsubgroup").focus().select();
		return false;
	    }
      $("#m_accountname").focus().select();
	}
	if (event.which==38) {
	 event.preventDefault();
	 $("#m_subgroupname").focus().select();
	}
    });

    //Change event for 'GST Account' checkbox.
    $('#gstaccount').change(function(){
	if ($(this).is(":checked")) {
	    $('#m_accountname').prop("disabled", true);
	    $("#gstaccountdiv").show();
	}
	else {
	    $('#m_accountname').prop("disabled", false);
	    $("#gstaccountdiv").hide();
	}
    });

    //Keydown event for 'GST Account' checkbox.
    $('#gstaccount').keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($(this).is(":checked")) {
		$("#taxtype").focus();
	    }
	    else{
		$('#m_accountname').focus();
	    }
	}
	else if (event.which == 38) {
	    $('#m_subgroupname').focus().select();
	}
    });

    //Change event for Tax Type.
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
	    $('#m_accountname').val(taxtype + "_" + taxstate + "@" + taxrate);
	}
	else {
	    $('#m_accountname').val("");
	}
    });

    //Keydown event for Tax type.
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

    //ajax call will gives abbreviation of selected state.
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
			      $('#m_accountname').val(taxtype + "_" + taxstate + "@" + taxrate);
			  }
		      }
		      else {
			  taxstate = "";
			  $("#m_accountname").val("");
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
	    $("#m_accountname").val("");
	}
    });

    //Keydown event for Tax State.
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

    //Change event for Tax Rate.
    $("#taxrate").change(function(){
	taxrate = $.trim($("#taxrate option:selected").val());
	if (taxtype!="" && taxstate!="" && taxrate!="") {
	    $('#m_accountname').val(taxtype + "_" + taxstate + "@" + taxrate);
	}
	else {
	    $("#m_accountname").val("");
	}
    });

    //Keydown event for Tax Rate.
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
	    $("#m_openbal").focus();
	}
	else if (event.which == 38) {
	    if ($("#taxrate option:visible").first().is(":selected")) {
		$("#taxstate").focus();
	    }
	}
    });

    //Change event for Cess Rate.
    $("#cessrate").change(function(){
	cessrate = $.trim($("#cessrate").val());
	if (taxtype!="" && taxstate!="" && cessrate!="") {
	    $('#m_accountname').val(taxtype + "_" + taxstate + "@" + cessrate + "%");
	}
	else {
	    $("#m_accountname").val("");
	}
    });

    //Keydown event for Cess Rate.
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
	    $("#m_openbal").focus();
	}
	else if (event.which == 38) {
	    $("#taxstate").focus();
	}
    });
    
    // Keydown event for Account Name.
    // Validations for Account Name.
    $("#m_accountname").keydown(function(event) {
	if(event.which==13 || event.which == 9) {
	    event.preventDefault();
	    if ($.trim($("#m_accountname").val())=="") {
		$("#m_blank-alert").alert();
		$("#m_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#m_blank-alert").hide();
		});
		$("#m_accountname").focus().select();
		return false;
	    }
	}
	if(event.which==13){
	    event.preventDefault();
	    $("#m_openbal").focus().select();
	}else if (event.which == 38){
	    event.preventDefault();
	    if ($("#m_newsubgroup").is(':visible')) {
		$("#m_newsubgroup").focus().select();
	    }
	    else if($(".defbx").is(':visible')){
		$(".defbx").focus();
	    }
	    else if($("#gstaccount").is(':visible')){
		$("#gstaccount").focus();
	    }
	    else {
		$("#m_subgroupname").focus().select();
	    }
	}
    });

    //Keydown event for Opening Balance.
    $("#m_openbal").keydown(function(event) {
	if(event.which==13) {
	    $('#m_submit').focus();
	}else if(event.which==38){
	    if($('#gstaccount').is(':checked')){
		$('#taxrate').focus();
	    }else{
		$('#m_accountname').focus();
	    }
	}
    });
 
  $("#m_accountform").submit(function(e)
  {

    if ($.trim($("#m_accountname").val())=="") {
      $("#m_blank-alert").alert();
      $("#m_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#m_blank-alert").hide();
      });
      $("#m_accname").focus().select();
      return false;
    }

    if ($.trim($("#m_groupname option:selected").val())=="") {
      $("#m_grpblank-alert").alert();
      $("#m_grpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#m_grpblank-alert").hide();
      });
      $("#m_groupname").focus().select();
      return false;
    }

    if ($.trim($("#m_subgroupname option:selected").val())=="") {
      $("#m_sgrpblank-alert").alert();
      $("#m_sgrpblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#m_sgrpblank-alert").hide();
      });
      $("#m_subgroupname").focus().select();
      return false;
    }

if ($("#m_newsubgroup").is(':visible')) {

  if ($.trim($("#m_newsubgroup").val())=="") {
    $("#m_nsblank-alert").alert();
    $("#m_nsblank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#m_nsblank-alert").hide();
    });
    $("#m_newsubgroup").focus().select();
    return false;
  }

}

    var ob = $('#m_openbal').val();
    if(ob=="")
    {
      $('#m_openbal').val("0.00");
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

      $.ajax(
        {

          type: "POST",
          url: "/addaccount",
          global: false,
          async: false,
          datatype: "json",
          data: {"accountname":$("#m_accountname").val(), "openbal":$("#m_openbal").val(), "groupname":$("#m_groupname option:selected").val(),"defaultflag":defaultflag, "subgroupname":$("#m_subgroupname option:selected").val(), "newsubgroup":$("#m_newsubgroup").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if(resp["gkstatus"]==0)
            {
              $("#selpopupaccount").val($("#m_accountname").val());
              $("#m_success-alert").alert();
              $("#m_success-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $('#m_accmodal').modal('hide');
		  $('.modal-backdrop').remove();
		  $("#m_success-alert").hide();
              });
            }
            else if(resp["gkstatus"]==1)
            {
              $("#m_duplicate-alert").alert();
              $("#m_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#m_duplicate-alert").hide();
              });
              $("#m_accname").focus().select();
            }
            else
            {
              $("#m_failure-alert").alert();
              $("#m_failure-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#m_failure-alert").hide();
              });
              $("#m_accname").focus().select();
            }
          }

        }
      );




    e.preventDefault();
  }
);
});
