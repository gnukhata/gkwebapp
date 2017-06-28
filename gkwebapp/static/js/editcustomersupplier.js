$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#edit_cussup_list").focus();
  $(".panel-footer").hide();

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
      $("#edit_cussup_btn").hide();
      $("#cussup_edit_save").show();
      $("#edit_cussup").prop("disabled", false);
      $("#edit_cussup").focus().select();
      $("#edit_cussup_name").prop("disabled", false);
      $("#edit_cussup_email").prop("disabled", false);
      $("#edit_cussup_phone").prop("disabled", false);
      $("#edit_cussup_address").prop("disabled", false);
      $("#edit_cussup_fax").prop("disabled", false);
      $("#edit_cussup_pan").prop("disabled", false);
      $("#edit_cussup_tan").prop("disabled", false);
      $("#edit_state").prop("disabled", false);

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
      $("#edit_cussup_tan").focus().select();
    }
    if (event.which==38){
      event.preventDefault();
      $("#edit_cussup_fax").focus().select();
    }
  });
  $("#edit_cussup_tan").keydown(function(event) {
    if (event.which==13) {
    	if ($.trim($("#edit_cussup_tan").val())=="") {
            $("#tin-blank-alert").alert();
            $("#tin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#tin-blank-alert").hide();
            });
            $("#edit_cussup_tan").focus();
            return false;
          }
          event.preventDefault();
          $("#cussup_edit_save").click();
        }
        if (event.which==38) {
          event.preventDefault();
          $("#edit_cussup_pan").focus().select();
        }
      });
  $("#edit_cussup_reset").click(function(event) {
    $("#customersupplier_edit").click();
  });
  $("#edit_cussup_btn").click(function(event) {
    $("#edit_cussup_btn").hide();
    $("#cussup_edit_save").show();
    $("#edit_cussup").prop("disabled", false);
    $("#edit_cussup").focus().select();
    $("#edit_cussup_name").prop("disabled", false);
    $("#edit_cussup_email").prop("disabled", false);
    $("#edit_cussup_phone").prop("disabled", false);
    $("#edit_cussup_address").prop("disabled", false);
    $("#edit_cussup_fax").prop("disabled", false);
    $("#edit_cussup_pan").prop("disabled", false);
    $("#edit_cussup_tan").prop("disabled", false);
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
    var custsupdat=$("#edit_cussup option:selected").val();
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
    if ($.trim($("#edit_cussup_tan").val())=="") {
      $("#tin-blank-alert").alert();
      $("#tin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tin-blank-alert").hide();
      });
      $("#edit_cussup_tan").focus();
      return false;
    }

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
	     "custtan": $("#edit_cussup_tan").val(),
	     "state"  : $("#edit_state").val(),
	     "oldcustname" : $("#edit_cussup_list option:selected").text(),
	     "csflag":$("edit_cussup_list").closest('optgroup').attr('label'));
		/*  "csflag": $("#edit_cussup option:selected").val()*/},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#customersupplier_edit").click();
        if (custsupdat == '3') {
          $("#cus-success-alert").alert();
          $("#cus-success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#cus-success-alert").hide();
          });
          return false;
        }
        else  {
          $("#sup-success-alert").alert();
          $("#sup-success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#sup-success-alert").hide();
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
        $("#edit_cussup").focus();
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
    event.stopPropogation();
});
$("#cussup_delete").click(function(event) {
  event.preventDefault();
  var custsupdat=$("#edit_cussup option:selected").val();
  console.log(custsupdat);
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
