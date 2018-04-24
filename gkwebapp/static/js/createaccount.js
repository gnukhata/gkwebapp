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
  $("#openbal").numeric();
  $("#obal").hide();
  $("#openbal").hide();
  $("#baltbl").hide();
  $("#baltbl").hide();
  $("#groupname").focus().select();
  $("#accountform").validate();
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
          if (grpnam=="Direct Expense" || grpnam=="Indirect Expense" || grpnam=="Direct Income" || grpnam=="Indirect Income" || grpnam=="Loans(Asset)" || grpnam=="Reserves" || grpnam=="Capital" || grpnam=="Miscellaneous Expenses(Asset)" || grpnam=="Corpus")
          {
            $('#subgroupname').prepend('<option value="None">None</option>');
	    $("#subgroupname option:first").attr("selected", "selected");
          }
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
	  $('#gstaccountfields').show();
      }
      if ($.trim($("#subgroupname option:selected").text()) != 'Duties & Taxes') {
	  $('#gstaccountfields').hide();
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
	$("#accountname").focus().select();
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
	if(event.which==13) {
	    if ($.trim($("#subgroupname option:selected").val())=="New"){
	    event.preventDefault();
	    $("#newsubgroup").focus().select();
	    }
	    else {
		event.preventDefault();
	    $("#maccounts").focus().select();
	    }
	}
	    if (event.which==38 && (document.getElementById('subgroupname').selectedIndex==0)) {
      event.preventDefault();
      $("#groupname").focus().select();
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
	    event.preventDefault();
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
	    $("#accountname").focus().select();
	}
	 else if (event.which == 38){
	     event.preventDefault();
	     if ($("#newsubgroup").is(':visible')) {
		 $("#newsubgroup").focus().select();
	     }
	     else {
		 $("#subgroupname").focus().select();
	     }
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
	$("#maccounts").focus().select();
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


  $("#msspinmodal").modal("show");


  $.ajax(
    {

      type: "POST",
      url: "/addaccount",
      global: false,
      async: false,
      datatype: "json",
      data: $("#accountform").serialize(),
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


    $('#gstaccount').change(function(){
	if ($(this).is(":checked")) {
	    $('#accountname').prop("disabled", true);
	}
	else {
	    $('#accountname').prop("disabled", false);
	}
    });
    
  $('#maccounts').change(function() {
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
      $(".m_accname:enabled:first").focus().select();

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
});
