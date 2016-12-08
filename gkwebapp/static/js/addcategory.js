$(document).ready(function() {
  $('.modal-backdrop').remove();
  $(".tax_rate").numeric();
  if ($("#catcount").val()==0)
  {
      $("#category_name").focus();
  }
  else
  {
      $("#category_under").focus();
  }
  $("#category_name").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();

      $("#category_spec_table tbody tr:first td:first input").focus();
    }
    if (event.which==38 ) {
      event.preventDefault();
      $("#category_under").focus();
    }
  });

  $("#category_under").keydown(function(event) {

    if (event.which==13) {
        event.preventDefault();
        $("#category_name").focus();
        $("#category_name").select();
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
      $('#category_tax_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if (curindex==0) {
      $("#category_name").focus().select();
      }
      if(previndex>-1)
      {
        event.preventDefault();
        $('#category_tax_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#category_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
    else if(event.which==37){
       event.preventDefault();
       $('.spec_name').focus();
    }
  });

  $(document).off("change",".tax_name").on("change",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    if ($("#category_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
      $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>');
    }
    else {
      $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
    }
  });

  $(document).off("keydown",".tax_state").on("keydown",".tax_state",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      $('#category_tax_table tbody tr:eq('+nextindex+') td:eq(1) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#category_tax_table tbody tr:eq('+previndex+') td:eq(1) select').focus();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#category_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
  });

  $(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#category_tax_table tbody tr").length-1)) {
        $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        if ($('#category_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#category_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#category_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="") {
          $("#tax-rate-blank-alert").alert();
          $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-rate-blank-alert").hide();
          });
          $('#category_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
          return false;
        }
        $('#category_tax_table tbody').append('<tr>'+
        '<td class="col-xs-4">'+
        '<select class="form-control input-sm tax_name">'+
          '<option value="" selected>Select Tax</option>'+
          '<option value="VAT">VAT</option>'+
          '<option value="CVAT">CVAT</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control input-sm tax_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control input-sm tax_rate text-right"  placeholder="Rate">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
        $(".tax_rate").numeric();
        $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(2) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#category_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }


  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#category_tax_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#category_tax_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */

  /* -----------------------Spec key events start----------------------------------------- */
  $(document).off("keydown",".spec_name").on("keydown",".spec_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
    else if (event.ctrlKey && event.which==190) {
      $('.spec_type').focus();
      event.preventDefault();
    }
  });




  $(document).off("keydown",".spec_type").on("keydown",".spec_type",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#category_spec_table tbody tr").length-1)) {
        $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#spec-blank-alert").alert();
          $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#spec-blank-alert").hide();
          });
          $('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
          return false;
        }
        $('#category_spec_table tbody').append('<tr>'+
        '<td class="col-xs-8">'+
        '<input type="text" class="form-control input-sm spec_name" placeholder="Spec Name">'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<select id="category_spec_type" class="form-control input-sm spec_type">'+
        '<option value="0">Text</option>'+
        '<option value="1">Number</option>'+
        '<option value="2">Date</option>'+
        '<option value="3">Option</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
        $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      $('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==35) {
      event.preventDefault();
      $(".tax_name:first").focus();
    }
  });
  /* -----------------------Spec key events end----------------------------------------- */
  $(document).keyup(function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#category_savespecs").click();
      return false;
    }
  });

  $("#category_under").change(function(event) {

    if ($('#category_spec_table tbody tr').length==0) {
      $('#category_spec_table tbody').append('<tr>'+
      '<td class="col-xs-8">'+
      '<input type="text" class="form-control input-sm spec_name" value="" placeholder="Spec Name">'+
      '</td>'+
      '<td class="col-xs-3">'+
      '<select id="category_spec_type" class="form-control input-sm spec_type">'+
      '<option value="0">Text</option>'+
      '<option value="1">Number</option>'+
      '<option value="2">Date</option>'+
      '<option value="3">Option</option>'+
      '</select>'+
      '</td>'+
      '<td class="col-xs-1">'+
      '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
      '</td>'+
      '</tr>');
    }
    var category_code = $("#category_under option:selected").val();
    $("#category_spec_table > tbody >tr:not(:last)").remove();
    $("#category_spec_table tbody tr:last td:eq(0) input").val("");
    $.ajax({
      url: '/category?action=getspecs',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": category_code},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
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
        $('#category_spec_table tbody').prepend('<tr>'+
        '<td class="col-xs-8">'+
        '<input type="text" class="form-control input-sm spec_name" value="'+spec["attrname"]+'" placeholder="Spec Name">'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<select id="category_spec_type" class="form-control input-sm spec_type">'+trs+
        '</select>'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });

  $(document).off("click",".spec_del").on("click", ".spec_del", function() {
    if($('#category_spec_table tbody tr').length>1){
      $(this).closest('tr').fadeOut(200, function(){
        $(this).closest('tr').remove();	 //closest method gives the closest element specified
        $('#category_spec_table tbody tr:last td:eq(0) input').focus().select();
      });
    }
    else {
      $("#category-lastspec-alert").alert();
      $("#category-lastspec-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-lastspec-alert").hide();
      });
    }
    $('#category_spec_table tbody tr:last td:eq(0) input').select();
  });
  $("#category_savespecs").click(function(event) {
    if ($.trim($('#category_name').val())=="") {
      $("#category-blank-alert").alert();
      $("#category-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-blank-alert").hide();
      });
      $('#category_name').focus().select();
      return false;
    }
    var specs = [];
    for (var i = 0; i < $("#category_spec_table tbody tr").length; i++) {
      if ($.trim($("#category_spec_table tbody tr:eq("+i+") td:eq(0) input").val())=="") {
        $("#spec-blank-alert").alert();
        $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#spec-blank-alert").hide();
        });
        $("#category_spec_table tbody tr:eq("+i+") td:eq(0) input").focus().select();
        return false;
      }
      var obj = {};
      obj.attrname = $("#category_spec_table tbody tr:eq("+i+") td:eq(0) input").val();
      obj.attrtype = $("#category_spec_table tbody tr:eq("+i+") td:eq(1) select").val();
      specs.push(obj);
    }
    var taxes = [];
    var allow = true;
    $("#category_tax_table tbody tr").each(function() {
      var taxname = $(".tax_name", this).val();
      var taxstate = $(".tax_state", this).val();
      var ccount=0;
      $("#category_tax_table tbody tr").each(function() {
        if(taxname==$(".tax_name", this).val() && taxstate==$(".tax_state", this).val()){
          ccount =ccount +1;
        }
      });
      if (ccount>1) {
        allow= false;
        return false;
      }
    });

    if(!allow){
      $("#tax-duplicate-alert").alert();
      $("#tax-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tax-duplicate-alert").hide();
      });
      $("#category_tax_table tbody tr:first td:eq(0) select").focus();
      return false;
    }
    for (var i = 0; i < $("#category_tax_table tbody tr").length; i++) {
      if ($.trim($("#category_tax_table tbody tr:eq("+i+") td:eq(0) select").val())!="" && $.trim($("#category_tax_table tbody tr:eq("+i+") td:eq(2) input").val())!="") {
      var obj = {};
      obj.taxname = $("#category_tax_table tbody tr:eq("+i+") td:eq(0) select").val();
      obj.state = $("#category_tax_table tbody tr:eq("+i+") td:eq(1) select option:selected").val();
      obj.taxrate = $("#category_tax_table tbody tr:eq("+i+") td:eq(2) input").val();
      taxes.push(obj);
    }
    }
    $.ajax({
      url: '/category?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categoryname": $("#category_name").val(),"subcategoryof":$("#category_under").val(),"specs":JSON.stringify(specs),"taxes":JSON.stringify(taxes)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("a[href='#category_create']").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
        return false;
      }
      else if(resp["gkstatus"] == 1){
        $("#category_name").focus().select();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#category_name").focus();
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

  $("#category_reset").click(function(event) {
    $("a[href='#category_create']").click();
  });
});
