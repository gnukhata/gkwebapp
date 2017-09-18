/*
  Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
*/

// This script is for the addcustomer/supplier.jinja2

$(document).ready(function() {
    //All the navigation events where pressing enter shifts focus to the next element and pressing the up arrow key focuses the previous element

  $("#add_cussup").focus().select();
  $("#add_cussup").keydown(function(event) {
    if (event.which==13) {

	if ($.trim($("#add_cussup").val())=="") {
            $("#role-blank-alert").alert();
            $("#role-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#role-blank-alert").hide();
            });
            $("#add_cussup").focus();
            return false;
          }
        event.preventDefault();
          $("#add_cussup_name").focus().select();
        }
      });
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
    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
  }
  else if (event.which==27) {
    event.preventDefault();
    $("#cussup_save").focus();
  }
});
    $(document).off("focusout",".gstin").on("focusout",".gstin",function(event) {
	var curindex = $(this).closest('tr').index();
	var gstin = $(this).val();
	var gstnint = parseInt(gstin[0] + gstin[1]);
	console.log($.isNumeric(gstnint));
	if(!($.isNumeric(gstnint)) || gstnint > 37 || gstnint < 0){
	    $("#gstin-improper-alert").alert();
            $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#gstin-improper-alert").hide();
		$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
            });
	    return false;
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
    if (curindex1 != ($("#gstintable tbody tr").length-1)) {
      $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    else {
      if (numberofstates > 0) {
        if ($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
            $("#state-blank-alert").alert();
          $("#state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#state-blank-alert").hide();
          });
          $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').val()=="") {
          $("#gstin-blank-alert").alert();
          $("#gstin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#gstin-blank-alert").hide();
          });
          $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').focus();
          return false;
        }
        $('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        if (curindex1 == 0) {
          $("#gstintable tbody tr:last td:last").append('<a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
        }
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
    $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select').focus();
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
$(document).off("click",".state_del").on("click", ".state_del", function() {
  $(this).closest('tr').fadeOut(200, function(){
    $(this).closest('tr').remove();	 //closest method gives the closest element specified
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
            $("#address-blank-alert").alert();
            $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#address-blank-alert").hide();
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
	if($("#vatorgstflag").val() == '22' || $("#vatorgstflag").val() == '29'){
	    $("#add_cussup_tan").focus().select();
	}
	else {
	    $(".gstinstate:first").focus();
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_fax").focus().select();
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
        }
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
  $("#add_cussup_reset").click(function(event) {
      // click the customer/supplier create tab to reload the current page in tab creating a reset effect
    $("#customersupplier_create").click();
  });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#cussup_save").click();
      event.preventDefault();
      return false;
    }
  });
  $("#cussup_save").click(function(event) {
      //save event for saving the customer/supplier
      event.preventDefault();
      var allow = 1;
    var custsupdata=$("#add_cussup option:selected").val(); //select with option either customer or supplier
    // custsupdata = 3 if customer or 19 if supplier
    var groupcode = -1;
    if (custsupdata == '3'){
      groupcode = $("#debtgroupcode").val();
    }
    else {
      groupcode = $("#credgroupcode").val();
    }
    //validations to check if none of the required fields are left blank
    if ($.trim($("#add_cussup option:selected").val())=="") {
      $("#cussup-blank-alert").alert();
      $("#cussup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#cussup-blank-alert").hide();
      });
      $("#add_cussup").focus();
      return false;
    }

    if ($.trim($("#add_cussup_name").val())=="") {
      $("#name-blank-alert").alert();
      $("#name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#name-blank-alert").hide();
      });
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

if($("#vatorgstflag").val() == '29'){
  console.log("Abdul Kalam: " + $("#add_cussup_tin").val());
  if ($.trim($("#add_cussup_tan").val())=="") {
    for (var i = 0; i < $('#gstintable tbody tr').length; i++) {
      if (($('#gstintable tbody tr:eq('+i+') td:eq(1) input').val())=="" ) {
           $("#both-blank-alert").alert();
           $("#both-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
             $("#both-blank-alert").hide();
           });
           $("#add_cussup_tin").focus();
           return false;
         }
    }
  }
}

if($("#vatorgstflag").val() == '7'){
  for (var i = 0; i < $('#gstintable tbody tr').length; i++) {
    if (($('#gstintable tbody tr:eq('+i+') td:eq(1) input').val())=="" ) {
         $("#gstin-blank-alert").alert();
         $("#gstin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#gstin-blank-alert").hide();
         });
         $("#add_cussup_tin").focus();
         return false;
       }
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
    var gobj = {}; // Creating a dictionary for storing godown wise opening stock
      $("#gstintable tbody tr").each(function(){
	  var curindex1 = $(this).index();
    if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid"))!="") {
	if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').val())!="") {
	    var gstin = $.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').val());
            var gstnint = parseInt(gstin[0] + gstin[1]);
            if(!($.isNumeric(gstnint)) || gstnint > 37 || gstnint < 0){
		allow = 0;
                $("#gstin-improper-alert").alert();
                $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#gstin-improper-alert").hide();
                    $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').focus().select();
                });
                return false;
            }
          gobj[$('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid")] = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').val();
      }
    }
      });
      var custtan  = "";
      if ($("#add_cussup_tan").length > 0) {
	  custtan = $("#add_cussup_tan").val();
      }
    // ajax call for saving the customer/supplier
      if (allow == 1){
	  $.ajax({
	      url: '/customersuppliers?action=save',
	      type: 'POST',
	      dataType: 'json',
	      async : false,
	      data: {"custname": $("#add_cussup_name").val(),
		     "custaddr": $.trim($("#add_cussup_address").val()),
		     "custphone": $("#add_cussup_phone").val(),
		     "custemail": $("#add_cussup_email").val(),
		     "custfax": $("#add_cussup_fax").val(),
		     "custpan": $("#add_cussup_pan").val(),
		     "custtan": custtan,
		     "gstin": JSON.stringify(gobj),
		     "state" : $("#add_state").val(),
		     "csflag": $("#add_cussup option:selected").val()
		    },
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
  });
});
