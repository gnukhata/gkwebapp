$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#prodselect").focus();
  var editgodownflag = 0;
  $(document).off('click', '#editgodownflag').on('click', '#editgodownflag', function(e){
    if ($(this).is(":checked")) {
      editgodownflag = 1;
      $("#editgodownflag").val(1);
      $("#editopeningstockdiv").show();
      $("#editnogodown").hide();
    }
    else {
      editgodownflag = 0;
      $("#editgodownflag").val(0);
      $("#editopeningstockdiv").hide();
      $("#editnogodown").show();
    }
  });
  $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".numtype").numeric();
  });
  $(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()=="")
    {
    $(this).val(parseFloat(0).toFixed(2));
    }
    else
    {
      $(this).val(parseFloat($(this).val()).toFixed(2));
    }
  });

  var sel1=0;
  var sel2=0;
  var sindex=0;
  var category;
  var existingcatspecs;
  var existingnonetax;
  var prodcode;
  var catcode;
  $(document).on("focus",'#edituom',function() {
    sel1 = 1;
  });
  $(document).on("blur",'#edituom',function(){
    sel1 = 0;
  });
  $(document).on("focus",'#editcatselect',function(){
    sel2 = 1;
  });
  $(document).on("blur",'#editcatselect',function(){
    sel2 = 0;
  });
  var edittextareasel;
  $(document).on('focus', '#editproddesc',function(event) {
    /* Act on the event */
    edittextareasel=1;

  });
  $(document).on('blur', '#editproddesc',function(event) {
    /* Act on the event */
    edittextareasel=0;
    $("#editproddesc").val($("#editproddesc").val().trim());

  });
  $(document).keydown(function(event)
  {
    /* Act on the event */
    if (event.which == 45)
    {
      event.preventDefault();
      $("#epsubmit").click();
    }
  });


  $(document).off('keyup', '.specdate').on('keyup', '.specdate',function (e) {
    var textSoFar = $(this).val();
    if (e.keyCode != 173 && e.keyCode != 109) {
      if (e.keyCode != 8) {
        if (textSoFar.length == 2 || textSoFar.length == 5) {
          $(this).val(textSoFar + "-");
        }
        //to handle copy & paste of 8 digit
        else if (e.keyCode == 86 && textSoFar.length == 8) {
          $(this).val(textSoFar.substr(0, 2) + "-" + textSoFar.substr(2, 2) + "-" + textSoFar.substr(4, 4));
        }
      }
      else {
        //backspace would skip the slashes and just remove the numbers
        if (textSoFar.length == 5) {
          $(this).val(textSoFar.substring(0, 4));
        }
        else if (textSoFar.length == 2) {
          $(this).val(textSoFar.substring(0, 1));
        }
      }
    }
    else {
      //remove slashes to avoid 12//01/2014
      $(this).val(textSoFar.substring(0, textSoFar.length - 1));
    }
  });

  $("#prodselect").keydown(function(event) {
    if (event.which==13) {
      $("#editproddesc").focus().select();
    }
  });


  $(document).on('keydown', '#editopeningstock', function(event) {
    if (event.which==13)
    {
      event.preventDefault();
      if ($("#product_edit_tax_table tbody tr:first td:eq(0) select").is(":disabled")) {
        $("#editspecifications").find('input:first').focus().select();
      }
      else {

        $("#product_edit_tax_table tbody tr:first td:eq(0) select").focus();
      }

    }

    /* Act on the event */
  });

  $(document).on('keydown', '.editgodown_ob', function(event){
    if (event.which == 13) {
      var n = $(".editgodown_ob").index(this);
      var m = n+1;
      console.log(n+','+m);
      if (m < $(".editgodown_ob").length) {
        $(".editgodown_ob").eq(m).focus().select();
      }
      else {
        event.preventDefault();
        if ($("#product_edit_tax_table tbody tr:first td:eq(0) select").is(":disabled")||$("#product_edit_tax_table tbody tr").length==0) {
          $('#editspecifications').find("input:first").focus().select();
        }
        else {
          $("#product_edit_tax_table tbody tr:first td:eq(0) select").focus();
        }
      }
    }
    if (event.which == 38) {
      var n = $(".editgodown_ob").index(this);
      if (n == 0) {
        $("#editgodownflag").focus().select();
      }
      else {
        $(".editgodown_ob").eq(n-1).focus().select();
      }
    }
  });

  var txst=0;
  $(document).off('focus', '.tax_state').on('focus', '.tax_state', function(event) {
    event.preventDefault();
    /* Act on the event */
    txst =1;
  });

  $(document).off('blur', '.tax_state').on('blur', '.tax_state', function(event) {
    event.preventDefault();
    /* Act on the event */
    txst =0;
  });
  $(document).on("keydown",'.editpr input:not(:hidden),.editpr textarea,.editpr select', function(e) {
    var n = $(".editpr input:not(:hidden),.editpr textarea,.editpr select").length;
    var f = $('.editpr input:not(:hidden),.editpr textarea,.editpr select');
    if (e.which == 13)
    {
      var nextIndex = f.index(this) + 1;

      if(nextIndex < n)
      {
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }

    }
    if (e.which == 38)
    {
      var prevIndex = f.index(this) - 1;
      var elementType = $(this).prop('nodeName');
      if(prevIndex > -1)
      {
        if (elementType=="SELECT")
        {
          if (sel1 == 1 && sel2 == 0)
          {

            sindex= $("#edituom option:selected").index();
          }
          else if (sel1 == 0 && sel2 == 1)
          {

            sindex= $("#editcatselect option:selected").index();
          }

          if (sindex ==0 && txst ==0)
          {
            e.preventDefault();
            f[prevIndex].focus();
          }
        }
        else
        {
          e.preventDefault();
          f[prevIndex].focus();
          f[nextIndex].select();

        }
      }

    }
  });
  $("#prodselect").change(function(event) {
    /* Act on the event */
    prodcode= $("#prodselect option:selected").val();

    {

      $.ajax({
        url: '/product?type=details',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"productcode": prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        $("#proddetails").html("");
        $("#proddetails").html(resp);
        $("#unitaddon").html($("#edituom option:selected").text());
        $(".pbutn").show();
        $("#epsubmit").hide();
        $("#epedit").show();
        $('#proddetails').find('input, textarea, button, select').prop('disabled',true);
        catcode= $("#editcatselect option:selected").val();
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      if(catcode!="")
      {
        $.ajax({
          url: '/product?type=cattax',
          type: 'POST',
          dataType: 'json',
          async : false,
          data: {"categorycode": catcode},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp) {
          console.log("success");
          $(".blank").remove();
          $('#product_edit_tax_table tbody tr').remove();

          for (tax of resp["gkresult"]) {
            $('#product_edit_tax_table tbody').append('<tr class="catsp" value="'+tax["taxid"]+'">'+
            '<td class="col-xs-4">'+
            '<select class="form-control input-sm product_cat_tax_disable tax_name">'+
              '<option value="" selected>Select Tax</option>'+
              '<option value="VAT">VAT</option>'+
              '<option value="CVAT">CVAT</option>'+
            '</select>'+
            '</td>'+
            '<td class="col-xs-4">'+
            '<select class="form-control product_cat_tax_disable input-sm tax_state" >'+
            '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
            '</select>'+
            '</td>'+
            '<td class="col-xs-3">'+
            '<input class="form-control product_cat_tax_disable input-sm tax_rate text-right"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '</td>'+
            '</tr>');
            $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
            $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
          }
          $(".product_cat_tax_disable").prop('disabled',true);

        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
      }
      else
      {$.ajax({
        url: '/product?type=prodtax',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"productcode": prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        for (tax of resp["gkresult"]) {
          $('#product_edit_tax_table tbody').append('<tr class="product_row_val" value="'+tax["taxid"]+'">'+
          '<td class="col-xs-4">'+
          '<select class="form-control input-sm product_tax_disable tax_name">'+
            '<option value="" selected>Select Tax</option>'+
            '<option value="VAT">VAT</option>'+
            '<option value="CVAT">CVAT</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-4">'+
          '<select class="form-control product_tax_disable input-sm tax_state" >'+
          '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-3">'+
          '<input class="form-control product_tax_disable input-sm tax_rate text-right numtype"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '</td>'+
          '</tr>');
          $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
          $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
        }
        $(".product_tax_disable").prop('disabled',true);
        existingnonetax = resp["gkresult"];
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });}
      category = $("#editcatselect option:selected").val();
      existingcatspecs = $("#extsp").clone();


    }




  });

  $("#prodselect").keyup(function(event) {
    /* Act on the event */
    if (event.which == 13)
    {
      event.preventDefault();
      prodcode= $("#prodselect option:selected").val();
      if (prodcode!="")
      {
        $("#epedit").click();
      }

    }
    if (event.which==46)
    {
      event.preventDefault();
      prodcode= $("#prodselect option:selected").val();
      if (prodcode!="")
      {
        $('#epdelete').click();
      }
    }
  });

  $(document).on('change', '#edituom',function(event) {
    if ($("#edituom option:selected").val()!='') {
      $("#unitaddon").html($("#edituom option:selected").text());
    }
  });

  $(document).on('focus', '#editopeningstock',function(event) {
    if ($("#edituom option:selected").val()!='') {
      $("#unitaddon").html($("#edituom option:selected").text());
    }
  });
  $(document).on('click', '#epedit', function(event) {
    event.preventDefault();
    /* Act on the event */
    $('#proddetails').find('input, textarea, button, select').prop('disabled',false);
    $("#epsubmit").show();
    $("#epedit").hide();
    $("#editproddesc").focus();
    $("#editproddesc").select();
    catcode= $("#editcatselect option:selected").val();
    $(".product_cat_tax_disable").prop('disabled',true);
    $(".product_tax_disable").prop('disabled',false);
  });

  $(document).on("change","#editcatselect",function(event) {
    /* Act on the event */

    catcode= $("#editcatselect option:selected").val();
    if (catcode == category)
    {
      $("#extsp").html(existingcatspecs);
      existingcatspecs = $("#extsp").clone();
      $('#editspecifications').find('input, textarea, button, select').prop('disabled',false);

    }
    if (catcode=='') {
      $('#product_edit_tax_table tbody').empty();
      for (tax of existingnonetax) {
        $('#product_edit_tax_table tbody').append('<tr class="product_row_val" value="'+tax["taxid"]+'">'+
        '<td class="col-xs-4">'+
        '<select class="form-control input-sm product_tax_disable tax_name">'+
          '<option value="" selected>Select Tax</option>'+
          '<option value="VAT">VAT</option>'+
          '<option value="CVAT">CVAT</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control product_tax_disable input-sm tax_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control product_tax_disable input-sm tax_rate text-right numtype"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '</td>'+
        '</tr>');
        $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
        $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
      }
    }
    else {

      $.ajax({
        url: '/product?type=specs',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"categorycode": catcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        $("#editspecifications").html("");
        $("#editspecifications").html(resp);
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    }

    if (catcode!="")
    {

      $.ajax({
        url: '/product?type=cattax',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"categorycode": catcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        $(".blank").remove();
        $('#product_edit_tax_table tbody tr').remove();

        for (tax of resp["gkresult"]) {
          $('#product_edit_tax_table tbody').append('<tr class="catsp" value="'+tax["taxid"]+'">'+
          '<td class="col-xs-4">'+
          '<select class="form-control input-sm product_cat_tax_disable tax_name">'+
            '<option value="" selected>Select Tax</option>'+
            '<option value="VAT">VAT</option>'+
            '<option value="CVAT">CVAT</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-4">'+
          '<select class="form-control product_cat_tax_disable input-sm tax_state" >'+
          '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-3">'+
          '<input class="form-control product_cat_tax_disable input-sm tax_rate text-right"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '</td>'+
          '</tr>');
          $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
          $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
        }
        $(".product_cat_tax_disable").prop('disabled',true);

      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });




    }

  });

  /* -----------------------Tax key events start----------------------------------------- */
  $(document).off("keyup",".tax_name").on("keyup",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==188 && event.shiftKey)
    {
      if (curindex==0 && $("#editgodownflag").val()==0) {
      $("#editopeningstock").focus().select();
      }
      if (curindex==0 && $("#editgodownflag").val()==1) {
      $(".editgodown_ob:last").focus().select();
      }
      if(previndex>-1 && curindex != 0)
      {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
  });

  $(document).off("keydown",".tax_name").on("keydown",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });

  $(document).off("change",".tax_name").on("change",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    if ($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>');
    }
    else {
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
    }
  });

  $(document).off("keydown",".tax_state").on("keydown",".tax_state",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      $('#product_edit_tax_table tbody tr:eq('+nextindex+') td:eq(1) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(1) select').focus();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
  });

  $(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#product_edit_tax_table tbody tr").length-1)) {
        $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="") {
          $("#tax-rate-blank-alert").alert();
          $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-rate-blank-alert").hide();
          });
          $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
          return false;
        }
        $('#product_edit_tax_table tbody').append('<tr>'+
        '<td class="col-xs-4">'+
        '<select class="form-control input-sm tax_name product_new_name">'+
          '<option value="" selected>Select Tax</option>'+
          '<option value="VAT">VAT</option>'+
          '<option value="CVAT">CVAT</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control input-sm tax_state product_new_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control input-sm tax_rate text-right product_new_rate numtype"  placeholder="Rate">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
        $(".tax_rate").numeric();
        $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(2) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    else if (event.which==35) {
      event.preventDefault();
      $('#specifications').find("input:first").focus().select();
    }

  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#product_edit_tax_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#product_edit_tax_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */

  $(document).on('click', '#epsubmit', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#editproddesc").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#editproddesc").focus();
      $("#editproddesc").select();
      return false;
    }
    var taxes = [];
    $("#product_edit_tax_table tbody tr").each(function(){
      var obj = {};
      curindex = $(this).index();
      if ($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()!="") {
        obj.taxrowid = $("#product_edit_tax_table tbody tr:eq("+curindex+")").attr('value');
        obj.taxname = $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val();
        obj.state = $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select option:selected").val();
        obj.taxrate = parseFloat($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(2) input").val()).toFixed(2);
        taxes.push(obj);
      }


    });
    var obj = {};
    $("#editgodown_ob_table tbody tr").each(function(){
      if ($.trim($(".editgodownid",this).val())!="") {


        if ($.trim($(".editgodown_ob",this).val())=="") {
          obj[$(".editgodownid",this).val()] = "0.00"
        }
        else {
          obj[$(".editgodownid",this).val()] = $(".editgodown_ob",this).val();
        }
      }


    });
    var editformdata = $("#editprodform").serializeArray();
    editformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
    if ($("#editgodownflag").val() == 1) {
      addformdata.push({name: 'godowns', value: JSON.stringify(obj)});
    }
    $.ajax({
      url: '/product?type=edit',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
      data: editformdata,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if (resp["gkstatus"] ==0) {
        $('.modal-backdrop').remove();
        $("#editsuccess-alert").alert();
        $("#editsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#editsuccess-alert").hide();
        });
        $("#editproduct").click();
        return false;
      }
      else if (resp["gkstatus"] ==1)
      {

        $('.modal-backdrop').remove();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        $("#editproddesc").focus();
        $("#editproddesc").select();
        return false;
      }
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    event.stopPropogation();
  });


  $('#epdelete').click(function(event) {
    event.preventDefault();
    /* Act on the event */
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    prodcode= $("#prodselect option:selected").val();
    $('#m_confirmdel').modal('show').one('click', '#proddel', function (e)
    {
      $.ajax({
        url: '/product?type=delete',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'json',
        data: {"productcode":prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        if (resp["gkstatus"] ==0) {
          $('.modal-backdrop').remove();
          $("#editproduct").click();
          $("#deletesuccess-alert").alert();
          $("#deletesuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#deletesuccess-alert").hide();
          });
        }
        else if(resp["gkstatus"] == 5) {
          $("#prodselect").focus();
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
    });
    $('#m_confirmdel').on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
    });
    $('#m_confirmdel').on('hidden.bs.modal', function(event) {
      $("#prodselect").focus();
    });

  });

  $(document).on('click', '#epreset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#editproduct").click();
  });
});
