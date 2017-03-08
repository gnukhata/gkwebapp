/* -----------------------Tax key events start----------------------------------------- */
  // Focus events with shit key and ctrl key
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
      if(previndex>-1)
      {
        event.preventDefault();
        $('#category_tax_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
      $('.spec_name').first().focus().select();
      }
      else {
        $('#category_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#category_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (($("#category_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='CVAT') && event.which==13 ) {
        event.preventDefault();
        $('#category_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }

    else if (event.which==13) {
      event.preventDefault();
      $('#category_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
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
/* on presing enter key in tax rate field if the either CVAT or VAT is selected and depending on that
 the respective State is selected and also the tax rate is specified
 then a new row is displayed to the user to add another tax to the category*/

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
          //validations for blank tax(CVAT or VAT) and and blank tax rate
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
        // appending a new row for adding another tax to category

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
