$(document).ready(function() {
  $("#add_cussup").focus().select();
  $("#add_cussup").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_name").focus().select();
    }
  });
  $("#add_cussup_name").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_email").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup").focus().select();
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
      $("#add_cussup_address").focus().select();
    }
    if (event.which==38 && $("#add_state option:selected").index()==0)  {
      event.preventDefault();
      $("#add_cussup_phone").focus().select();
    }
  });
  var delta = 500;
  var lastKeypressTime = 0;
  $("#add_cussup_address").keydown(function(event) {
    if (event.which==13)
    {
      var thisKeypressTime = new Date();
      if ( thisKeypressTime - lastKeypressTime <= delta )
      {
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
      $("#add_cussup_tan").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_fax").focus().select();
    }
  });
  $("#add_cussup_tan").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#cussup_save").click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
  });
  $("#add_cussup_reset").click(function(event) {
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
    event.preventDefault();
    var custsupdata=$("#add_cussup option:selected").val();
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
      "custtan": $("#add_cussup_tan").val(),
      "state" : $("#add_state").val(),
      "csflag": $("#add_cussup option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#customersupplier_create").click();
        if (custsupdata == '3') {
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
      if(resp["gkstatus"] ==1){
        if (custsupdata == '3') {
          $("#add_cussup_name").focus();
          $("#cus-duplicate-alert").alert();
          $("#cus-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#cus-duplicate-alert").hide();
          });
          return false;
        }
        else  {
          $("#add_cussup_name").focus();
          $("#sup-duplicate-alert").alert();
          $("#sup-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#sup-duplicate-alert").hide();
          });
          return false;
        }

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
    event.stopPropagation();
  });
});
