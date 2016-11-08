$(document).ready(function() {
  $('.modal-backdrop').remove();
  $(".tax_rate").numeric();
  $("#category_edit_savespecs").hide();
  $(".category_edit_disable").prop("disabled",true);
  $("#category_edit_name").focus();
  var deletedspecs = [];

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
      var result = resp["gkresult"]
      $("#category_edit_name").val(result["categoryname"]);
      $("#category_edit_under").val(result["subcategoryof"]);
      $("#category_edit_addspecs").attr('disabled',false);
      $(".panel-footer").show();
      $("#category_edit_innerdiv").show();
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
        $('#category_edit_tax_table tbody tr').remove();
      }
      else {
        $('#category_edit_tax_table tbody tr').remove();
        $('#category_edit_tax_table tbody').append('<tr value="New">'+
        '<td class="col-xs-4">'+
        '<input type="text" class="form-control category_edit_disable input-sm tax_name" placeholder="Tax Name" value="">'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control category_edit_disable input-sm tax_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control category_edit_disable input-sm tax_rate text-right"  placeholder="Rate" value="">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '</td>'+
        '</tr>');
      }
      for (tax of resp["gkresult"]) {
        $('#category_edit_tax_table tbody').append('<tr value="'+tax["taxid"]+'">'+
        '<td class="col-xs-4">'+
        '<input type="text" class="form-control category_edit_disable input-sm tax_name" placeholder="Tax Name" value="'+tax["taxname"]+'">'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control category_edit_disable input-sm tax_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control category_edit_disable input-sm tax_rate text-right"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="tax_del category_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
        $('#category_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
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
            '<option value="3">Option</option>'+
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
          '<option value="2">Date</option>'+
          '<option value="3">Option</option>'
        }
        else if (spec["attrtype"]==1) {
          trs ='<option value="0">Text</option>'+
          '<option value="1" selected>Number</option>'+
          '<option value="2">Date</option>'+
          '<option value="3">Option</option>'
        }
        else if (spec["attrtype"]==2) {
          trs ='<option value="0">Text</option>'+
          '<option value="1">Number</option>'+
          '<option value="2" selected>Date</option>'+
          '<option value="3">Option</option>'
        }
        else if (spec["attrtype"]==3) {
          trs ='<option value="0">Text</option>'+
          '<option value="1">Number</option>'+
          '<option value="2">Date</option>'+
          '<option value="3" selected>Option</option>'
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
      $("#category_edit_savespecs").attr("disabled",false);
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

  $("#category_edit_list").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $(".category_edit_disable").prop("disabled",false);
      $("#category_edit_savespecs").show();
      $("#category_edit_edit").hide();
      $("#category_edit_name").focus().select();
    }
    if (event.which==46) {
      event.preventDefault();
      $("#category_edit_delete").click();
    }
  });

  $("#category_edit_name").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#category_edit_tax_table tbody tr:first td:first input").focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#category_edit_list").focus();
    }
  });

  $("#category_edit_under").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#category_edit_spec_table tbody tr:first td:first input").focus();
    }
    if (event.which==38 && $("#category_edit_under option:selected").index()==0) {
      event.preventDefault();
      $("#category_edit_tax_table tbody tr:first td:first input").focus();
    }
  });

  /* -----------------------Tax key events start----------------------------------------- */
  $(document).off("keydown",".tax_name").on("keydown",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      if (curindex==0) {
        $("#category_edit_name").focus().select();
      }
      else {
        event.preventDefault();
        $('#category_edit_tax_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#category_edit_tax_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
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
      $('#category_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) input').focus().select();
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
        $('#category_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#category_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#category_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
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
        $('#category_edit_tax_table tbody').append('<tr value="New">'+
        '<td class="col-xs-4">'+
        '<input type="text" class="form-control category_edit_disable input-sm tax_name" placeholder="Tax Name">'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control category_edit_disable input-sm tax_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control category_edit_disable input-sm tax_rate text-right"  placeholder="Rate">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="tax_del category_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
        $(".tax_rate").numeric();
        $('#category_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
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
      $('#category_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
    }
    else if (event.which==35) {
      event.preventDefault();
      $('#category_edit_under').focus().select();
    }

  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#category_edit_tax_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#category_edit_tax_table tbody tr:last td:eq(0) input').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */

  $("#category_edit_edit").click(function(event) {
    $(".category_edit_disable").prop("disabled",false);
    $("#category_edit_savespecs").show();
    $("#category_edit_edit").hide();
    $("#category_edit_name").focus().select();
  });

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
      event.preventDefault();
      $('#category_edit_spec_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_edit_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
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
          $("#spec-blank-alert").alert();
          $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#spec-blank-alert").hide();
          });
          $('#category_edit_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
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
            '<option value="3">Option</option>'+
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
        $('#category_edit_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus().select();
        event.preventDefault();
      }
    });

  $(document).off("click",".spec_del").on("click", ".spec_del", function() {
    deletedspecs.push($(this).closest('tr').attr('value'));
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
        $("#spec-blank-alert").alert();
        $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#spec-blank-alert").hide();
        });
        $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").focus().select();
        return false;
      }
      var obj = {};
      obj.spcode = $("#category_edit_spec_table tbody tr:eq("+i+")").attr('value');
      obj.attrname = $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").val();
      obj.attrtype = $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(1) select").val();
      specs.push(obj);
    }
    $.ajax({
      url: '/category?action=edit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categoryname": $("#category_edit_name").val(),"categorycode": $("#category_edit_list option:selected").val(),"subcategoryof":$("#category_edit_under").val(),"specs":JSON.stringify(specs),"deletedspecs":JSON.stringify(deletedspecs)},
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
        $("#category_edit_name").focus();
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
        $("a[href='#category_edit']").click();
        $("#success-delete-alert").alert();
        $("#success-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-delete-alert").hide();
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

  $("#category_edit_reset").click(function(event) {
    $("a[href='#category_edit']").click();
  });
});
