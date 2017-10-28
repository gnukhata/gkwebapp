$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#edit_cussup_list").focus();
    $(".panel-footer").hide();
    
    var gstinstring = "";
    
  $("#edit_cussup_list").change(function(event) {
    $.ajax({
      url: '/customersuppliers?action=get',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid": $("#edit_cussup_list option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      var result = resp["gkresult"];
	$(".hidden-load").show();
      $("#edit_cussup").val(result["csflag"]);
	if(result["csflag"] == 3){

    	  $("#edit_cussup").val("Customer");
      }
      else {
    	  $("#edit_cussup").val("Supplier");
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
      $("#edit_cussup_pan").val(result["custpan"]);
      $("#edit_cussup_pan").prop("disabled", true);
      $("#edit_cussup_tan").val(result["custtan"]);
	$("#edit_cussup_tan").prop("disabled", true);
	var rowhtml = $('#gstintable tbody tr:first').html();
	$('#gstintable tbody').empty();
	$('#gstintable tbody').append('<tr>' + rowhtml + '</tr>');
	for(var gstin in result["gstin"]){
	    var gstinstr = result["gstin"][gstin]; 
	    $('#gstintable tbody tr:last td:eq(0) select option[stateid='+gstin+']').prop("selected", true);
	    $('#gstintable tbody tr:last td:eq(1) input:eq(0)').val(gstinstr.substring(0, 2));
	    $('#gstintable tbody tr:last td:eq(1) input:eq(1)').val(gstinstr.substring(2, 12));
	    $('#gstintable tbody tr:last td:eq(1) input:eq(2)').val(gstinstr.substring(12, 15));
	    $('#gstintable tbody').append('<tr>' + rowhtml + '</tr>');
	}
	for(var i = 0; i < $("#gstintable tbody tr").length; i++) {
	    if (i > 0) {
		$("#gstintable tbody tr:eq(" + i +") td:last").append('<a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
		for(var k = i-1; k >= 0; k--) {
		    var selectedstate = $('#gstintable tbody tr:eq(' + k + ') td:eq(0) select option:selected').attr("stateid");
		    $('#gstintable tbody tr:eq(' + i + ') td:eq(0) select option[stateid='+selectedstate+']').prop("hidden", true).prop("disabled", true);
		}
	    }
	}
	$(".gstinstate, .statecode, .panno, .gstin").prop("disabled", true);
      $(".panel-footer").show();
      $("#cus_innerdiv").show();
      $("#cussup_edit_save").hide();
      $("#edit_cussup_btn").show();

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });
  $("#edit_cussup_list").keydown(function(event) {

    if (event.which==13) {
      event.preventDefault();
      $("#edit_cussup_btn").click();
    }

  });
  $("#edit_cussup_list").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_cussup_name").focus().select();
    }
    if (event.which==38){
      event.preventDefault();
      $("#edit_cussup_list").focus().select();
    }
  });
  $("#edit_cussup_name").keydown(function(event) {
    if (event.which==13) {
    	if ($.trim($("#edit_cussup_name").val())=="") {
            $("#name-blank-alert").alert();
            $("#name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#name-blank-alert").hide();
            });
            $("#edit_cussup_name").focus();
            return false;
          }
          event.preventDefault();
          $("#edit_cussup_email").focus().select();
        }
      });
  $("#edit_cussup_email").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_cussup_phone").focus().select();
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
  $("#edit_state").keydown(function(event) {
    if (event.which==13) {
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
    if (event.which==13)
    {
      var thisKeypressTime = new Date();
      if ( thisKeypressTime - lastKeypressTime <= delta )
      {if ($.trim($("#edit_cussup_address").val())=="") {
          $("#address-blank-alert").alert();
          $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#address-blank-alert").hide();
          });
          $("#edit_cussup_address").focus();
          return false;
        }
        $("#edit_cussup_fax").focus();
        // optional - if we'd rather not detect a triple-press
        // as a second double-press, reset the timestamp
        thisKeypressTime = 0;
      }
      lastKeypressTime = thisKeypressTime;
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_state").focus();
    }
  });
  $("#edit_cussup_fax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_cussup_pan").focus().select();
    }
    if (event.which==38){
      event.preventDefault();
      $("#edit_cussup_address").focus().select();
    }
  });
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
		$(".gstinstate:first").focus();
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
	      $("#cussup_edit_save").focus();
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
    if ($.trim($("#edit_cussup_pan").val()) !="") {
	 $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').focus();
      }
      else {
	   $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').focus();
      }
  }
  else if (event.which==27) {
    event.preventDefault();
    $("#cussup_edit_save").focus();
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
    $(document).off("keydown", ".panno").on("keydown", ".panno", function(event) {
	var curindex = $(this).closest('tr').index();
	var previndex = curindex-1;
	if (event.which == 13) {
	    event.preventDefault();
	    if($(this).val() != '') {
		$(this).next('input').focus().select();
	
	    }
	    else {
		$("#panno-blank-alert").alert();
                $("#panno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#panno-blank-alert").hide();
  		$(this).focus().select();
		});
		return false;
	    }
	}
    });
    
    $(document).off("focusout",".gstin").on("focusout",".gstin",function(event) {
	var curindex = $(this).closest('tr').index();
	gstinstring = $(".statecode").val() + $(".panno").val() + $(".gstin").val();
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
  var numberofstates = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length-1;
  if (event.which==13) {
    event.preventDefault();
    if (curindex1 != ($("#gstintable tbody tr").length-1)) {
      $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    else {
      if (numberofstates > 0) {
        
        $('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        if (curindex1 == 0) {
          $("#gstintable tbody tr:last td:last").append('<a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
        }
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
    $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select').focus();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
  }
  else if (event.which==27) {
    event.preventDefault();
    $("#cussup_edit_save").focus();
  }
});
$(document).off("click",".state_del").on("click", ".state_del", function() {
  $(this).closest('tr').fadeOut(200, function(){
    $(this).closest('tr').remove();	 //closest method gives the closest element specified
    $('#gstintable tbody tr:last td:eq(0) select').focus().select();
  });
  $('#gstintable tbody tr:last td:eq(0) select').select();
});
  $("#edit_cussup_reset").click(function(event) {
    $("#customersupplier_edit").click();
  });
  $("#edit_cussup_btn").click(function(event) {
    $("#edit_cussup_btn").hide();
    $("#cussup_edit_save").show();
    $("#edit_cussup").prop("disabled", true);
    $("#edit_cussup_list").focus().select();
    $("#edit_cussup_name").prop("disabled", false);
    $("#edit_cussup_email").prop("disabled", false);
    $("#edit_cussup_phone").prop("disabled", false);
    $("#edit_cussup_address").prop("disabled", false);
    $("#edit_cussup_fax").prop("disabled", false);
    $("#edit_cussup_pan").prop("disabled", false);
      $("#edit_cussup_tan").prop("disabled", false);
      $(".gstinstate, .panno, .gstin").prop("disabled",false);
    $("#edit_state").prop("disabled", false);
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

    if ($.trim($("#edit_cussup_name").val())=="") {
      $("#name-blank-alert").alert();
      $("#name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#name-blank-alert").hide();
      });
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
  /*    if ($.trim($("#edit_cussup_tan").val())==""){
      $("#both-blank-alert").alert();
      $("#both-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#both-blank-alert").hide();
      });
      $("#edit_cussup_tan").focus();
      return false;
      } */
      var gobj = {}; // Creating a dictionary for storing godown wise opening stock
      $("#gstintable tbody tr").each(function(){
	  var curindex1 = $(this).index();
    if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid"))!="") {
	if ($.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').val())!="") {
	    var gstin = $.trim($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').val());
      if(gstin != '') {
        var gstnint = parseInt(gstin[0] + gstin[1]);
        if(!($.isNumeric(gstnint)) || gstnint > 37 || gstnint < 0 || gstin.length !=15){
allow = 0;
            $("#gstin-improper-alert").alert();
            $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#gstin-improper-alert").hide();
                $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').focus().select();
            });
            return false;
        }
      }
          gobj[$('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:selected').attr("stateid")] = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input').val();
      }
    }
      });
      let custtan = "";
      if ($("#edit_cussup_tan").length > 0){
	  custtan = $("#edit_cussup_tan").val();
      }
	if(allow == 1){
	    $.ajax({
                url: '/customersuppliers?action=edit',
                type: 'POST',
                dataType: 'json',
                async : false,
                data: {"custid": $("#edit_cussup_list option:selected").val(),
                       "custname": $("#edit_cussup_name").val(),
                       "custaddr": $.trim($("#edit_cussup_address").val()),
                       "custphone": $("#edit_cussup_phone").val(),
                       "custemail": $("#edit_cussup_email").val(),
                       "custfax": $("#edit_cussup_fax").val(),
                       "custpan": $("#edit_cussup_pan").val(),
                       "custtan": custtan,
                       "gstin": JSON.stringify(gobj),
                       "state"  : $("#edit_state").val(),
                       "oldcustname" : $("#edit_cussup_list option:selected").text(),
                       "custsup":$("#edit_cussup").val()
                      },
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
                        if (custsupdat == '3') {
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
    $.ajax(
      {

        type: "POST",
        url: '/customersuppliers?action=delete',
        async: false,
        datatype: "json",
        data:{"custid": $("#edit_cussup_list option:selected").val()},
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

  });
});
  $("#confirm_del").on('shown.bs.modal', function(event) {
    $("#m_cancel").focus();
  });
  $("#confirm_del").on('hidden.bs.modal', function(event) {
    $("#edit_cussup_list").focus();
  });
});
