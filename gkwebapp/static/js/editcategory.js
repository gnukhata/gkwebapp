$(document).ready(function() {
  $('.modal-backdrop').remove();
    $(".tax_rate").numeric();
    var taxfieldhtml = $("#category_edit_tax_table tbody").html();
    var stateshtml = $("#category_tax_table tbody tr:first td:eq(1) select").html();
  $("#category_edit_savespecs").hide();
  $(".category_edit_disable").prop("disabled",true);
  $("#category_edit_name").focus().select();
  var deletedspecs = [];
    var deletedtaxs = [];
  $(document).keyup(function(event) {
    if(event.which == 45) {
      if ($("#category_edit_savespecs").is(":enabled")) {

        event.preventDefault();
        $("#category_edit_savespecs").click();
        return false;
      }
    }
  });

  $("#category_edit_list").change(function(event) {


          $.ajax({
            url: '/product?by=category',
            type: 'POST',
            dataType: 'json',
            data: {"categorycode": $("#category_edit_list").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
          .done(function(resp) {
            console.log(resp["gkresult"].length);
            if (resp["gkresult"].length>0)
            {
              $("#category_edit_innerdiv").hide();
                $(".panel-footer").hide();

              $("#cant-edit-alert").alert();
              $("#cant-edit-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#cant-edit-alert").hide();
              });

            }
            else {

              $("#category_edit_innerdiv").show();
              $(".panel-footer").show();

            }
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });

    $("#category_edit_spec_table > tbody >tr").remove();
    deletedspecs = [];
    $.ajax({
      url: '/category?action=getCategory',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": $("#category_edit_list").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {


	var result = resp["gkresult"];
      $("#category_edit_name").val(result["categoryname"]);
      $("#category_edit_under").val(result["subcategoryof"]);

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

    $.ajax({
      url: '/category?action=gettax',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": $("#category_edit_list").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
	if (resp["gkresult"].length>0) {
	    $('#category_edit_tax_table tbody').empty();
        for (tax of resp["gkresult"]) {
	    $('#category_edit_tax_table tbody').append(taxfieldhtml);
	    $('#category_edit_tax_table tbody tr:last').attr({value: tax["taxid"]});
	    $('#category_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
	    $('#category_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
	    if(tax["taxname"] == "CVAT" || tax["taxname"] == "IGST"){
		$('#category_edit_tax_table tbody tr:last td:eq(1) select').prop("disabled", true);
	    }
	    $('#category_edit_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);
	}
	}
	else {
	    $('#category_edit_tax_table tbody').empty();
	    $('#category_edit_tax_table tbody').append(taxfieldhtml);
	}
	
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

    $.ajax({
      url: '/category?action=getspecs',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": $("#category_edit_list").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
      if (resp["gkresult"].length>0) {
        $('#category_edit_spec_table tbody tr').remove();
      }
      else {
        $('#category_edit_spec_table tbody tr').remove();
        $('#category_edit_spec_table tbody').append('<tr value="New">'+
          '<td class="col-xs-8">'+
            '<input type="text" class="form-control category_edit_disable input-sm spec_name" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-3">'+
            '<select id="category_edit_spec_type" class="form-control category_edit_disable input-sm spec_type">'+
            '<option value="0">Text</option>'+
            '<option value="1">Number</option>'+
            '<option value="2">Date</option>'+
            '</select>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="spec_del category_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
        '</tr>');
      }
      for (spec of resp["gkresult"].reverse()) {
        var trs;
        if (spec["attrtype"]==0) {
          trs ='<option value="0" selected>Text</option>'+
          '<option value="1">Number</option>'+
		'<option value="2">Date</option>';
          }
        else if (spec["attrtype"]==1) {
          trs ='<option value="0">Text</option>'+
          '<option value="1" selected>Number</option>'+
		'<option value="2">Date</option>';
        }
        else if (spec["attrtype"]==2) {
          trs ='<option value="0">Text</option>'+
          '<option value="1">Number</option>'+
		'<option value="2" selected>Date</option>';
        }
        else if (spec["attrtype"]==3) {
          trs ='<option value="0">Text</option>'+
          '<option value="1">Number</option>'+
		'<option value="2">Date</option>';

        }
        $('#category_edit_spec_table tbody').prepend('<tr value="'+spec["spcode"]+'">'+
          '<td class="col-xs-8">'+
            '<input type="text" class="form-control category_edit_disable input-sm spec_name" value="'+spec["attrname"]+'" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-3">'+
            '<select id="category_edit_spec_type" class="form-control category_edit_disable input-sm spec_type">'+trs+
            '</select>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="spec_del category_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
        '</tr>');
      }
      $("#category_edit_spec_div").show();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    $("#category_edit_edit").show();
    $("#category_edit_savespecs").hide();
    $(".category_edit_disable").prop("disabled",true);
    $(".tax_rate").numeric();
  });

  $("#category_edit_edit").click(function(event) {
    $(".category_edit_disable").prop("disabled",false);
    $("#category_edit_savespecs").show();
    $("#category_edit_edit").hide();
    $("#category_edit_list_lbl").hide();
      $("#category_edit_name").focus().select();
      $("#category_edit_tax_table tbody tr").each(function() {
        if($(".tax_name", this).val() != "VAT"){
            $(".tax_state", this).prop("disabled", true);
        }
      });
  });

  $("#category_edit_list").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
	$("#category_edit_edit").click();
    }
    if (event.which==46) {
      event.preventDefault();
      $("#category_edit_delete").click();
    }
  });

  $("#category_edit_name").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#category_edit_spec_table tbody tr:first td:first input").focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#category_edit_list").focus();
    }
  });

/*  $("#category_edit_under").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#category_edit_name").focus().select();
    }
    if (event.which==38 && $("#category_edit_under option:selected").index()==0) {
      event.preventDefault();
      $("#category_edit_list").focus().select();
    }
  });

  /* -----------------------Tax key events start----------------------------------------- */
  $(document).off("keydown",".tax_name").on("keydown",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if (curindex==0) {
      $("#category_name").focus().select();
      }
      if(previndex>-1)
      {
        event.preventDefault();
        $('#category_edit_tax_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex == 0) {
        $('.spec_name').first().focus().select();
      }
      else {
        $('#category_edit_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (($("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='CVAT' || $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='IGST') && event.which==13 ) {
        event.preventDefault();
        $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').prop("disabled", true);
        $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });

  $(document).off("change",".tax_name").on("change",".tax_name",function(event){
    var curindex = $(this).closest('tr').index();
    if ($("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').prop("disabled", false);
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append(stateshtml);
    }
    else {
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').prop("disabled", true);
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
    }
    var previndex = curindex -1;
    if ($("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select option:selected").val()=='VAT') {
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append(stateshtml);
    }
    else {
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#category_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
    }
      for (let j = 0; j < curindex + 1; j++) {
              if ($("#category_edit_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val() == "VAT") {
		  var selectedtaxstate = $("#category_edit_tax_table tbody tr:eq("+j+") td:eq(1) select option:selected").attr("stateid");
		  for (let i=j+1; i<=curindex+1;i++){
		      $('#category_edit_tax_table tbody tr:eq('+i+') td:eq(1) select option[stateid='+selectedtaxstate+']').prop('hidden', true).prop('disabled', true);
		  }
	      }
          }
  });
  $(document).off("keydown",".tax_state").on("keydown",".tax_state",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      $('#category_edit_tax_table tbody tr:eq('+nextindex+') td:eq(1) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#category_edit_tax_table tbody tr:eq('+previndex+') td:eq(1) select').focus();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
  });

  $(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#category_edit_tax_table tbody tr").length-1)) {
        $('#category_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        if ($('#category_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#category_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#category_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="") {
          $("#tax-rate-blank-alert").alert();
          $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-rate-blank-alert").hide();
          });
          $('#category_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
          return false;
        }
        $('#category_edit_tax_table tbody').append(taxfieldhtml);
        $(".tax_rate").numeric();
          $('#category_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
	  $('#category_edit_tax_table tbody tr:eq('+nextindex1+')').attr("value", "New");
	  for (let j = 0; j < curindex1 + 1; j++) {
	      var selectedtax = $("#category_edit_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
	      if(selectedtax != "VAT"){
		  for(let i=j+1; i <= nextindex1;i++){
		      $('#category_edit_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').prop('hidden', true).prop('disabled', true);
		  }
		  }
	      }
      }
    }

    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(2) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#category_edit_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    if (event.which == 27) {
      event.preventDefault();
      $("#category_edit_savespecs").focus();
    }
  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
      if ($(this).closest('tr').attr('value')!="New") {
    deletedtaxs.push($(this).closest('tr').attr('value'));
  }
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#category_edit_tax_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#category_edit_tax_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */

  $(document).off("keydown",".spec_name").on("keydown",".spec_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#category_edit_spec_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      console.log(curindex);
      if (curindex == 0) {
        event.preventDefault();
        $("#category_edit_name").focus().select();
      }
      else {
        event.preventDefault();
        $('#category_edit_spec_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
      }
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_edit_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
    else if (event.ctrlKey && event.which==190) {
      event.preventDefault();
      $('#category_edit_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      if (previndex>-1) {
        $('#category_edit_spec_table tbody tr:eq('+previndex+') td:eq(1) select').focus().select();
      }
      else {
        $('#category_edit_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus().select();
      }
    }
  });
  $(document).off("keydown",".spec_type").on("keydown",".spec_type",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#category_edit_spec_table tbody tr").length-1)) {
        $('#category_edit_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#category_edit_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          return false;
        }
        $('#category_edit_spec_table tbody').append('<tr value="New">'+
          '<td class="col-xs-8">'+
            '<input type="text" class="form-control category_edit_disable input-sm spec_name" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-3">'+
            '<select id="category_edit_spec_type" class="form-control category_edit_disable input-sm spec_type">'+
            '<option value="0">Text</option>'+
            '<option value="1">Number</option>'+
            '<option value="2">Date</option>'+
            '</select>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="spec_del category_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
        '</tr>');
          $('#category_edit_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
        }
      }
      else if (event.ctrlKey && event.which==188) {
        event.preventDefault();
          $('#category_edit_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus().select();
        }
      else if (event.ctrlKey && event.which==190) {
        event.preventDefault();
        $('#category_edit_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      if (event.which == 27) {
        event.preventDefault();
        $("#category_edit_tax_table tbody tr:first td:first select").focus();
      }
    });

  $(document).off("click",".spec_del").on("click", ".spec_del", function() {
    if ($(this).closest('tr').attr('value')!="New") {
      deletedspecs.push($(this).closest('tr').attr('value'));
    }
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#category_edit_spec_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#category_edit_spec_table tbody tr:last td:eq(0) input').select();
  });
  $("#category_edit_savespecs").click(function(event) {
    if ($.trim($('#category_edit_name').val())=="") {
      $("#category-blank-alert").alert();
      $("#category-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-blank-alert").hide();
      });
      $('#category_edit_name').focus().select();
      return false;
    }
    var specs = [];
    for (var i = 0; i < $("#category_edit_spec_table tbody tr").length; i++) {
      if ($.trim($("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").val())=="") {
        //$("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").focus().select();
        //return false;
        if(i==0)
        {
          console.log("delete clicked");
          $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(2) a").click();

        }
      }
      else {


      var obj = {};
      obj.spcode = $("#category_edit_spec_table tbody tr:eq("+i+")").attr('value');
      obj.attrname = $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").val();
      obj.attrtype = $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(1) select").val();
      specs.push(obj);
         }
     }

      var taxes = [];
    for (let i = 0; i < $("#category_edit_tax_table tbody tr").length; i++) {
      if ($.trim($("#category_edit_tax_table tbody tr:eq("+i+") td:eq(0) select").val())!="" && $.trim($("#category_edit_tax_table tbody tr:eq("+i+") td:eq(2) input").val())!="") {
      let obj = {};
      obj.taxid = $("#category_edit_tax_table tbody tr:eq("+i+")").attr('value');
      obj.taxname = $("#category_edit_tax_table tbody tr:eq("+i+") td:eq(0) select").val();
      obj.state = $("#category_edit_tax_table tbody tr:eq("+i+") td:eq(1) select option:selected").val();
      obj.taxrate = $("#category_edit_tax_table tbody tr:eq("+i+") td:eq(2) input").val();
      taxes.push(obj);
    }
    }
      console.log(taxes);
    $.ajax({
      url: '/category?action=edit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categoryname": $("#category_edit_name").val(),"categorycode": $("#category_edit_list option:selected").val(),"subcategoryof":$("#category_edit_under").val(),"specs":JSON.stringify(specs),"deletedspecs":JSON.stringify(deletedspecs),"taxes":JSON.stringify(taxes),"deletedtaxs":JSON.stringify(deletedtaxs)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("a[href='#category_edit']").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
        return false;
      }
      else {
        $("#category_edit_name").focus().select();
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

  $("#category_edit_delete").click(function(event) {
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_del').modal('show').one('click', '#accdel', function (e)
    {
    $.ajax({
      url: '/category?action=delete',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": $("#category_edit_list option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#success-delete-alert").alert();
        $("#success-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-delete-alert").hide();
          if($("#category_edit_list option").length==2){
            $("#searchcategory").hide();
            $("#addcategory").click();
          }
          else {
            $("a[href='#category_edit']").click();
          }
        });
        return false;
      }
      if(resp["gkstatus"] == 5) {
        $("#category_edit_list").focus();
        $("#failure-delete-alert").alert();
        $("#failure-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-delete-alert").hide();
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
    $("#confirm_del").on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
      });
    $("#confirm_del").on('hidden.bs.modal', function(event) {
      $("#category_edit_list").focus();
});
});

  $("#category_edit_reset").click(function(event) {
    $("a[href='#category_edit']").click();
  });
});
