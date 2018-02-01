$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#unit_edit_conversion_rate").numeric();
  $("#unit_edit_name").focus();

  $("#unit_edit_list").change(function(event) {

    $.ajax({
      url: '/unitofmeasurements?action=getunit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"uomid": $("#unit_edit_list option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      var result = resp["gkresult"]
      $("#unit_edit_name").val(result["unitname"]);
      $("#unit_edit_name").prop("disabled", true);
      $("#sub_unit_edit").val(result["subunitof"]);
      $("#sub_unit_edit").prop("disabled", true);
      $("#unit_edit_conversion_rate").val(result["conversionrate"]);
      $("#unit_edit_conversion_rate").prop("disabled", true);
      $(".panel-footer").show();
      $("#unit_edit_innerdiv").show();
      $("#unit_edit_save").hide();
      $("#edit_btn").show();

      if($("#sub_unit_edit option:selected").val()==''){
        $("#edit_conversion_div").hide();
      }
      else{
        $("#edit_conversion_div").show();
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

});

    $("#unit_edit_name").keydown(function(event) {
      if (event.which==13) {
        event.preventDefault();
        $("#sub_unit_edit").focus().select();
      }
      if (event.which==38){
        event.preventDefault();
        $("#unit_edit_list").focus().select();
      }
    });
    $("#unit_edit_list").keydown(function(event) {

      if (event.which==13) {
        event.preventDefault();
        $("#edit_btn").hide();
        $("#unit_edit_save").show();
        $("#unit_edit_name").prop("disabled", false);
        $("#unit_edit_name").focus().select();
        $("#sub_unit_edit").prop("disabled", false);
        $("#unit_edit_conversion_rate").prop("disabled", false);
	      }

   });


    $("#sub_unit_edit").keydown(function(event) {
      if (event.which==13 && $("#sub_unit_edit option:selected").val()=='') {
        event.preventDefault();
        $("#unit_edit_save").click();
      }
      if(event.which==13 && $("#sub_unit_edit option:selected").val()!='') {
        event.preventDefault();
        $("#unit_edit_conversion_rate").focus().select();

      }
      if (event.which==38 && $("#sub_unit_edit option:selected").val()=='') {
        event.preventDefault();
        $("#unit_edit_name").focus().select();
        $("#edit_conversion_div").hide();
      }
      if(event.which==40 || $("#sub_unit_edit option:selected").val()!='') {
        event.preventDefault();
        $("#edit_conversion_div").show();
      }
    });
    $("#unit_edit_conversion_rate").keydown(function(event) {
      if (event.which==13){
        event.preventDefault();
        $("#unit_edit_save").click();
      }
      if (event.which==38){
        event.preventDefault();
        $("#sub_unit_edit").focus();
      }
    });

  $("#unit_reset").click(function(event) {
    $("a[href ='#unit_edit']").click();
  });

  $("#edit_btn").click(function(event) {
    $("#edit_btn").hide();
    $("#unit_edit_save").show();
    $("#unit_edit_name").prop("disabled", false);
    $("#unit_edit_name").focus().select();
    $("#sub_unit_edit").prop("disabled", false);
    $("#unit_edit_conversion_rate").prop("disabled", false);

  });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#unit_edit_save").click();
      event.preventDefault();
      return false;
    }
  });
  $("#unit_edit_save").click(function(event) {
    if ($.trim($('#unit_edit_name').val())=="") {
      $("#unit-blank-alert").alert();
      $("#unit-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#unit-blank-alert").hide();
      });
      $('#unit_edit_name').focus().select();
      return false;
    }

    if ($("#unit_edit_name").val()==$("#sub_unit_edit option:selected").text()){
      $("#sameUnit-alert").alert();
      $("#sameUnit-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#sameUnit-alert").hide();
      });
      $('#sub_unit_edit').focus().select();
      return false;
    }

    if ($("#unit_edit_conversion_rate").val()=='' && $("#sub_unit_edit option:selected").val()!=''){
      $("#conversion-alert").alert();
      $("#conversion-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#conversion-alert").hide();
      });
      $('#conversion_rate').focus().select();
      return false;
    }

    if ($("#unit_edit_conversion_rate").val()==0 && $("#unit_edit_conversion_rate").val()==0.00 && $("#sub_unit_edit option:selected").val()!=''){
      $("#conversion-rate-alert").alert();
      $("#conversion-rate-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#conversion-rate-alert").hide();
      });
      $('#conversion_rate').focus().select();
      return false;
    }


    $.ajax({
      url: '/unitofmeasurements?action=edit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"unitname": $("#unit_edit_name").val(),"conversionrate":$("#unit_edit_conversion_rate").val(),"subunitof":$("#sub_unit_edit option:selected").val(),"uomid": $("#unit_edit_list option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("a[href='#unit_edit']").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
        return false;
      }
      else if(resp["gkstatus"] == 1){
        $("#unit_edit_name").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("duplicate-alert").hide();
        });
        return false;
      }

      else {
        $("#unit_edit_name").focus();
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
  $("#unit_delete").click(function(event) {
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_del').modal('show').one('click', '#accdel', function (e)
    {
      $.ajax(
        {

          type: "POST",
          url: '/unitofmeasurements?action=delete',
          async: false,
          datatype: "json",
          data:{"uomid": $("#unit_edit_list option:selected").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              $('.modal-backdrop').remove();
              $("#delsuccess-alert").alert();
              $("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#delsuccess-alert").hide();
              $("a[href ='#unit_edit']").click();
              });
            }
            else {
              $("#unit_edit_name").focus();
              $("#subunit-alert").alert();
              $("#subunit-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#subunit-alert").hide();
              });
              return false;
            }


          }

        });

    });
    $("#confirm_del").on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
    });
    $("#confirm_del").on('hidden.bs.modal', function(event) {
      $("#unit_edit_list").focus();
    });
   });
});
