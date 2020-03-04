$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#unit_edit_conversion_rate").numeric();
  $("#unit_edit_list").focus();
  $("#unit_edit_name").focus();
    var sysuom = "";
    $("#alertmsg").hide();
    $(".unit_edit_list-option").click(function(event) {
      $("#unit_edit_list").data("value", $(this).data("value"));
      $("#unit_edit_list").text($(this).text());
      $("#unit_edit_list").focus();
    $.ajax({
      url: '/unitofmeasurements?action=getunit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"uomid": $("#unit_edit_list").data('value')},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
	var result = resp["gkresult"];
  sysuom = resp["gkresult"]["sysunit"];
      $("#unit_edit_name").val(result["unitname"]);
      $("#unit_edit_name").prop("disabled", true);
      $("#unit_edit_desc").val(result["description"]);
      $("#unit_edit_desc").prop("disabled", true);	
      if (result["subunitof"] == null){
        $(".sub_unit_edit-option:first").click();
      }
      else{
      $(".sub_unit_edit-option[data-value='" + result["subunitof"] + "']").click();
    }
      $("#sub_unit_edit").prop("disabled", true);
      $("#unit_edit_conversion_rate").val(result["conversionrate"]);
      $("#unit_edit_conversion_rate").prop("disabled", true);
      $(".panel-footer").show();
      $("#unit_edit_innerdiv").show();
      $("#unit_edit_save").hide();
      $("#edit_btn").show();
      $(".subunit").show();
      $("#alertmsg").hide();
	//condition of delete button for uom which are associated with products. 
	if(resp["gkresult"]["flag"] == "True"){
	   $("#unit_delete").hide();
	}
	else if(resp["gkresult"]["flag"] == "False"){
 	    $("#unit_delete").show();
	}

	//selected unit is system generated then it cannot be deleted or edited. 
	if(resp["gkresult"]["sysunit"] == 1){
	    $("#alertmsg").show();
	    $("#unit_delete").hide();
	    $("#edit_btn").hide();
	    $(".subunit").hide();
	}

      if($("#sub_unit_edit").data('value')==''){
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

$("#unit_edit_list-input").keyup(function(event) {
	let searchtext = $("#unit_edit_list-input").val().toLowerCase();
    if (searchtext != "") {
      $(".unit_edit_list-option").each(function(index){
	if (index != -1) {
	  let rowtext = $(this).text().toLowerCase();
	  if (rowtext.indexOf(searchtext) != -1) {
	    $(this).parent().show();
	    $(this).show();
	  }
	  else {
	    $(this).parent().hide();
	    $(this).hide();
	  }
	}
      });
    }
    else{
      $(".unit_edit_list-option").each(function(index){
	$(this).parent().show();
	$(this).show();
      });
    }
  });

  $(document).off('keydown' ,'#unit_edit_list-input').on('keydown' ,'#unit_edit_list-input',function(event) {
    if (event.which == 13 || event.which == 40){
      event.preventDefault();
      $(".unit_edit_list-option").parent().parent().find("a:visible").first().focus();
	}
  });


  $(".sub_unit_edit-option").click(function(event) {
    $("#sub_unit_edit").data("value", $(this).data("value"));
    $("#sub_unit_edit").text($(this).text());
    $("#sub_unit_edit").focus();
   if ($("#sub_unit_edit").data('value')==""){
    $("#edit_conversion_div").val(0.00);
    $("#edit_conversion_div").hide();
  }
  });

  $("#sub_unit_edit-input").keyup(function(event) {
    let searchtext = $("#sub_unit_edit-input").val().toLowerCase();
      if (searchtext != "") {
        $(".sub_unit_edit-option").each(function(index){
    if (index != -1) {
      let rowtext = $(this).text().toLowerCase();
      if (rowtext.indexOf(searchtext) != -1) {
        $(this).parent().show();
        $(this).show();
      }
      else {
        $(this).parent().hide();
        $(this).hide();
      }
    }
        });
      }
      else{
        $(".sub_unit_edit-option").each(function(index){
    $(this).parent().show();
    $(this).show();
        });
      }
    });
  
    $(document).off('keydown' ,'#sub_unit_edit-input').on('keydown' ,'#sub_unit_edit-input',function(event) {
      if (event.which == 13 || event.which == 40){
        event.preventDefault();
        $(".sub_unit_edit-option").parent().parent().find("a:visible").first().focus();
    }
    });

  $(".searchabledropdown").on("shown.bs.dropdown", function () {
	let searchinput = $(this).data("input-id");
    document.getElementById(searchinput).focus();
  });

    $("#unit_edit_name").keydown(function(event) {
      if (event.which==13) {
        event.preventDefault();
        $("#unit_edit_desc").focus().select();
      }
      if (event.which==38){
        event.preventDefault();
        $("#unit_edit_list").focus().select();
      }
    });

    $("#unit_edit_list").keydown(function(event) {
	if (event.which==13) {
            event.preventDefault();
	    if(sysuom !=1){
		$("#edit_btn").click();
	    }
  }
  else{
  if (!$("#unit_edit_list").hasClass("open")){
    $("#unit_edit_list").click();
    }
    }
    });

    //Keydown for description of unit.
    $("#unit_edit_desc").keydown(function(event) {
	if (event.which==13) {
            event.preventDefault();
            $("#sub_unit_edit").focus().select();
	}
	if (event.which==38){
            event.preventDefault();
            $("#unit_edit_name").focus().select();
	}
    });

    $("#sub_unit_edit").keydown(function(event) {
      if (event.which==13 && $("#sub_unit_edit").data('value')=='') {
        event.preventDefault();
          $("#unit_edit_save").focus().click();
      }
      else if(event.which==13 && $("#sub_unit_edit").data('value')!='') {
        event.preventDefault();
        $("#unit_edit_conversion_rate").focus().select();

      }
     else if (event.which==38) {
        $("#sub_unit_edit").prop("disabled", true);
        event.preventDefault();
        $("#unit_edit_desc").focus().select();
        setTimeout(function () {
          $("#sub_unit_edit").prop("disabled", false);
          }, 0);
    
      }
      else{
        if (!$("#sub_unit_edit").hasClass("open")){
          $("#sub_unit_edit").click();
          }
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
//click event for reset button so that focus will be shifted to unit_dit_list.
  $("#unit_reset").click(function(event) {
      $("a[href ='#unit_edit']").click();
      event.preventDefault();
      $('#unit_edit_list').focus();
      return false;
  });

  $("#edit_btn").click(function(event) {
    $("#edit_btn").hide();
    $("#unit_edit_save").show();
    $("#unit_edit_name").prop("disabled", false);
    $("#unit_edit_name").focus().select();
    $("#unit_edit_desc").prop("disabled", false);
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
//click event for save button so that the focus will be shifted to unit_edit_list.
    $("#unit_edit_save").click(function(event) {
    if ($.trim($('#unit_edit_name').val())=="") {
      $("#unit-blank-alert").alert();
      $("#unit-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#unit-blank-alert").hide();
      });
      $('#unit_edit_name').focus().select();
      return false;
    }

    if ($("#unit_edit_name").val()==$("#sub_unit_edit").text()){
      $("#sameUnit-alert").alert();
      $("#sameUnit-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#sameUnit-alert").hide();
      });
      $('#sub_unit_edit').focus().select();
      return false;
    }

    if ($("#unit_edit_conversion_rate").val()=='' && $("#sub_unit_edit").data('value')!=''){
      $("#conversion-alert").alert();
      $("#conversion-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#conversion-alert").hide();
      });
      $('#conversion_rate').focus().select();
      return false;
    }

    if ($("#unit_edit_conversion_rate").val()==0 && $("#unit_edit_conversion_rate").val()==0.00 && $("#sub_unit_edit").data('value')!=''){
      $("#conversion-rate-alert").alert();
      $("#conversion-rate-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#conversion-rate-alert").hide();
      });
      $('#conversion_rate').focus().select();
      return false;
    }
	//Store uom description
	if($("#unit_edit_desc").val()!=''){
	    var description = $("#unit_edit_desc").val();
	}else{
	    description = "";
	}
    $.ajax({
      url: '/unitofmeasurements?action=edit',
      type: 'POST',
      dataType: 'json',
      async : false,
	data: {"unitname": $("#unit_edit_name").val(),"conversionrate":$("#unit_edit_conversion_rate").val(),"subunitof":$("#sub_unit_edit").data('value'),"uomid": $("#unit_edit_list").data('value'), "description":description , "sysunit":0},
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
	    event.preventDefault();
	    $("#unit_edit_list").focus().select();
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
    event.stopPropagation();
    });
    //click event for delete button so that to shift the focus on unit_edit_list.
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
          data:{"uomid": $("#unit_edit_list").data('value')},
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
		   event.preventDefault();
		  $("#unit_edit_list").focus().select();
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
