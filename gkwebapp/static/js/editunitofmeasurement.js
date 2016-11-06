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
      $("#sub_unit_edit").val(result["subunitof"]);
      $("#unit_edit_conversion_rate").val(result["conversionrate"]);
      $(".panel-footer").show();
      $("#unit_edit_innerdiv").show();
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
      if (event.which==13 &&  $("#unit_edit_list option:selected").val()!='') {
        event.preventDefault();
        $("#unit_edit_innerdiv").show();
        $("#unit_edit_name").focus().select();
      }
      else  {
        $("#unit_edit_innerdiv").hide();
      }
      if (event.which==38  && $("#unit_edit_list option:selected").val()=='') {
        event.preventDefault();
        $("#unit_btn").hide();
      }

   });


    $("#sub_unit_edit").keydown(function(event) {
      if (event.which==13 && $("#sub_unit_edit option:selected").val()=='') {
        event.preventDefault();
        $("#unit_edit_save").click();
      }
      else if(event.which==13 && $("#sub_unit_edit option:selected").val()!='') {
        event.preventDefault();
        $("#unit_edit_conversion_rate").focus().select();

      }
      if (event.which==38 && $("#sub_unit_edit option:selected").val()=='') {
        event.preventDefault();
        $("#unit_edit_name").focus().select();
        $("#edit_conversion_div").hide();
      }
      if(event.which==40 && $("#sub_unit_edit option:selected").val()!='') {
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

  $("#unit_edit_save").click(function(event) {
    if ($.trim($('#unit_edit_name').val())=="") {
      $("#unit-blank-alert").alert();
      $("#unit-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#unit-blank-alert").hide();
      });
      $('#unit_edit_name').focus().select();
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
              $("#unit_reset").click();
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
                $("a[href ='#unit_edit']").click();
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
