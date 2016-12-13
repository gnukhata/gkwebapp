$(document).ready(function() {
  var godownflag = 0;
  $('.modal-backdrop').remove();
  $("#addcatselect").focus();
  $('.proddate').autotab('number');
  $("#openingstock").numeric();
  $(document).off('focus', '.proddate').on('focus', '.proddate', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".proddate").numeric();
  });
  $("#godownflag").click(function(e){
    if ($(this).is(":checked")) {
      godownflag = 1;
      $("#godownflag").val(1);
      $("#nogodown").hide();
      $("#openingstockdiv").show();
    }
    else {
      godownflag = 0;
      $("#godownflag").val(0);
      $("#openingstockdiv").hide();
      $("#nogodown").show();
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

  $(document).off('blur', '#addproddesc').on('blur', '#addproddesc',function(event) {
    /* Act on the event */

    $("#addproddesc").val($("#addproddesc").val().trim());

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


  $(document).off('keyup').on('keyup',function(event)
  {
    /* Act on the event */
    if (event.which == 45)
    {
      event.preventDefault();
      $("#apsubmit").click();
    }
  });
  var newuom=0;
  $(document).off('focus', '#newuom').on('focus', '#newuom', function(event) {
    event.preventDefault();
    /* Act on the event */
    newuom =1;
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

  $(document).off('blur', '#newuom').on('blur', '#newuom', function(event) {
    event.preventDefault();
    /* Act on the event */
    newuom =0;
  });
  $("#addcatselect").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#addproddesc").focus().select();
    }
  });

  $("#addproddesc").keydown(function(event) {
    if (event.which==38) {
      event.preventDefault();
      $("#addcatselect").focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $("#adduom").focus();
    }
  });


  $("#adduom").change(function(event) {
    if ($("#adduom option:selected").val()!='') {
      $("#unitaddon").html($("#adduom option:selected").text());
    }
  });

  $("#openingstock").focus(function(event) {
    if ($("#adduom option:selected").val()!='') {
      $("#unitaddon").html($("#adduom option:selected").text());
    }
  });

  $(document).off('keydown', '#adduom').on('keydown', '#adduom', function(event) {
    if (event.which == 13 && $("#godownpresence").val()==0) {
      $("#openingstock").focus().select();
    }
    if (event.which==13 && $("#godownpresence").val()==1)
    {
      event.preventDefault();

      $("#godownflag").focus().select();

    }
    else if (event.which==32)
    {
      event.preventDefault();
      $(".olduom").hide();
      $(".newuom").show();

      $("#newuom").focus();
    }
    else if (event.which==38 && (document.getElementById('adduom').selectedIndex==1||document.getElementById('adduom').selectedIndex==0)) {
      $("#addproddesc").focus().select();
    }

    /* Act on the event */
  });
  $("#godownflag").keydown(function(event){
    if (event.which == 13 && godownflag == 0) {
      event.preventDefault();
      $("#openingstock").focus().select();
    }
    if (event.which == 13 && godownflag == 1) {
      event.preventDefault();
      $(".godown_name").first().focus().select();
    }
    if (event.which == 38) {
      $("#adduom").focus();
    }
  });
  $("#openingstock").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($("#product_tax_table tbody tr:first td:eq(0) select").is(":disabled")||$("#product_tax_table tbody tr").length==0) {
        $('#specifications').find("input:first").focus().select();
      }
      else {
        $("#product_tax_table tbody tr:first td:eq(0) select").focus();
      }
    }
    else if (event.which==38 && $("#godownpresence").val()==1) {
      $("#godownflag").focus().select();
    }
    else if (event.which==38 && $("#godownpresence").val()==0) {
      $("#adduom").focus().select();
    }
  });
  $(document).off('keydown', '#newuom').on('keydown', '#newuom', function(event) {
    /* Act on the event */
    if (event.which==27)
    {
      event.preventDefault();
      $(".olduom").show();
      $(".newuom").hide();
      $("#adduom").focus();
    }
    if (event.which==13)
    {

      event.preventDefault();
      var unitname = $.trim($("#newuom").val());
      $("#adduom > option").each(function() {
        if (unitname.toLowerCase() == $.trim($(this).text()).toLowerCase()) {
          $("#duplicate-unit-alert").alert();
          $("#duplicate-unit-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#duplicate-unit-alert").hide();
          });
          unitname = "";
        }
      });
      if (unitname!="") {


        $.ajax({
          url: '/product?type=uom',
          type: 'POST',
          dataType: 'json',
          async : false,
          data: {"unitname": unitname},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp) {
          if (resp["gkstatus"]==0)
          {
            $(".olduom").show();
            $(".newuom").hide();
            $('#adduom').empty();
            for (uom of resp["gkresult"])
            {
              $('#adduom').append($('<option value='+uom["uomid"]+'>'+uom["unitname"]+'</option>'));
            }

            $("#adduom option").filter(function(i,e){return $(e).text()==unitname}).prop('selected', true);
            $('#openingstock').focus().select();
          }
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
      }
      else
      {
        $(".olduom").show();
        $(".newuom").hide();
        $("#adduom").focus();
      }
    }

  });


  $(document).on("keydown",'#specifications input:not(:hidden),#specifications textarea, #specifications select', function(e) {
    var n = $("#specifications input:not(:hidden),#specifications textarea,#specifications select").length;
    var f = $('#specifications input:not(:hidden),#specifications textarea,#specifications select');

    if (e.which == 13)
    {
      var nextIndex = f.index(this) + 1;

      if(nextIndex < n)
      {
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }
      else {
        e.preventDefault();
        $("#apsubmit").click();
      }
    }
    if (e.which == 38)
    {
      var sindex=0;
      var prevIndex = f.index(this) - 1;
      if(prevIndex > -1)
      {


        e.preventDefault();
        f[prevIndex].focus();
        f[nextIndex].select();

      }

    }

  });

  $("#addcatselect").change(function(event) {
    /* Act on the event */

    var catcode= $("#addcatselect option:selected").val();


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
        $('#product_tax_table tbody tr').remove();
        if (resp["gkresult"].length>0) {
          for (tax of resp["gkresult"]) {
            $('#product_tax_table tbody').append('<tr value="'+tax["taxid"]+'">'+
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
            '<input class="form-control product_cat_tax_disable input-sm tax_rate text-right numtype"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '</td>'+
            '</tr>');
            $('#product_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
            $('#product_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
          }

        }

        $(".product_cat_tax_disable").prop('disabled',true);

      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

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
        $("#specifications").html("");
        $("#specifications").html(resp);
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

    }
    else
    {
      $("#specifications").html("");

      $('#product_tax_table tbody tr').remove();
      $('#product_tax_table tbody').append('<tr value="New">'+
      '<td class="col-xs-4">'+
      '<select class="form-control input-sm tax_name product_new_name">'+
      '<option value="" selected>Select Tax</option>'+
      '<option value="VAT">VAT</option>'+
      '<option value="CVAT">CVAT</option>'+
      '</select>'+
      '</td>'+
      '<td class="col-xs-4">'+
      '<select class="form-control product_new_state input-sm tax_state" >'+
      '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
      '</select>'+
      '</td>'+
      '<td class="col-xs-3">'+
      '<input class="form-control product_new_rate input-sm tax_rate text-right numtype"  placeholder="Rate" value="">'+
      '</td>'+
      '<td class="col-xs-1">'+
      '</td>'+
      '</tr>');

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
      if (curindex==0 && $("#godownflag").val()==0) {
      $("#openingstock").focus().select();
      }
      if (curindex==0 && $("#godownflag").val()==1) {
      $(".godown_ob:last").focus().select();
      }
      if(previndex>-1 && curindex != 0)
      {
        event.preventDefault();
        $('#product_tax_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
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
      $('#product_tax_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });

  $(document).off("change",".tax_name").on("change",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    if ($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
      $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>');
    }
    else {
      $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
    }
  });

  $(document).off("keydown",".tax_state").on("keydown",".tax_state",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      $('#product_tax_table tbody tr:eq('+nextindex+') td:eq(1) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#product_tax_table tbody tr:eq('+previndex+') td:eq(1) select').focus();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
  });

  $(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#product_tax_table tbody tr").length-1)) {
        $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="") {
          $("#tax-rate-blank-alert").alert();
          $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-rate-blank-alert").hide();
          });
          $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
          return false;
        }
        $('#product_tax_table tbody').append('<tr>'+
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
        $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#product_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    else if (event.which==35) {
      event.preventDefault();
      $('#specifications').find("input:first").focus().select();
    }

  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#product_tax_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#product_tax_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */

  /* -----------------------Godown Key events start here----------------------------------------- */

  $(document).off("keyup",".godown_name").on("keyup",".godown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==188 && event.shiftKey)
    {
      if (curindex==0) {
      $("#godownflag").focus().select();
      }
      if(previndex>-1 && curindex != 0)
      {
        event.preventDefault();
        $('#godown_ob_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
  });

  $(document).off("keydown",".godown_name").on("keydown",".godown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#godown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
  });

  $(document).off("keydown",".godown_ob").on("keydown",".godown_ob",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var selectindex = $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').index();
    var numberofgodowns = $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option').length-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#godown_ob_table tbody tr").length-1)) {
        $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        if ($('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
          $("#godown-blank-alert").alert();
          $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#godown-blank-alert").hide();
          });
          $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').val()=="") {
          $("#os-blank-alert").alert();
          $("#os-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#os-blank-alert").hide();
          });
          $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
          return false;
        }
        if ($("#godown_ob_table tbody tr").length == numberofgodowns || $("#godown_ob_table tbody tr").length > numberofgodowns) {
          var taxdisabled = $('#product_tax_table tbody tr:first td:eq(0) select').is(":disabled");
          if (taxdisabled) {
            $("#specifications").contents("div").children("input").first().focus();
          }
          else {
            $('#product_tax_table tbody tr:first td:eq(0) select').focus().select();
          }
          return false;
        }
        $('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        $(".godown_ob").numeric();
        $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
        $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select option').eq(selectindex).attr('disabled','disabled');
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#godown_ob_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==40 && event.shiftKey) {
      var taxdisabled = $('#product_tax_table tbody tr:first td:eq(0) select').is(":disabled");
      if (taxdisabled) {
        $("#specifications").contents("div").children("input").first().focus();
      }
      else {
        $('#product_tax_table tbody tr:first td:eq(0) select').focus().select();
      }
    }
  });
  $(document).off("click",".godown_del").on("click", ".godown_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#godown_ob_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#godown_ob_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Godown Key events end here----------------------------------------- */

  $(document).on('click', '#apsubmit', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#addproddesc").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#addproddesc").focus();
      $("#addproddesc").select();
      return false;
    }
    if ($("#adduom option:selected").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#uomblank-alert").alert();
      $("#uomblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#uomblank-alert").hide();
      });
      $("#adduom").focus();
      $("#adduom").select();
      return false;
    }
    if ($("#openingstock").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#openingstock").val("0.00");
      return false;
    }
    if ($(".godown_ob").val()=="") {
      $('.modal-backdrop').remove();
      $(this).val("0.00");
    }
    var taxes = [];
    $("#product_tax_table tbody tr").each(function(){
      var obj = {};
      if ($.trim($(".product_new_name",this).val())!="" || $.trim($(".product_new_rate",this).val())!="" ) {

        obj.taxname = $(".product_new_name",this).val();
        obj.state = $(".product_new_state",this).val();
        obj.taxrate = $(".product_new_rate",this).val();
        taxes.push(obj);
      }


    });
    var gobj = {};
    $("#godown_ob_table tbody tr").each(function(){
      if ($.trim($(".godown_name",this).val())!="") {
        if ($.trim($(".godown_ob",this).val())!="" &&  $.trim($(".godown_ob",this).val())!= "0.00") {
          gobj[$(".godown_name",this).val()] = $(".godown_ob",this).val();
        }
      }
    });
    var addformdata = $("#addprodform").serializeArray();

    addformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
    if ($("#godownflag").val() == 1) {
      addformdata.push({name: 'godowns', value: JSON.stringify(gobj)});
    }
      $.ajax({
        url: '/product?type=save',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'json',
        data: addformdata,
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log(resp["gkstatus"]);
        if (resp["gkstatus"] ==0) {

          $("#addproduct").click();
          $('.modal-backdrop').remove();
          $("#addsuccess-alert").alert();
          $("#addsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#addsuccess-alert").hide();
          });
          return false;
        }
        else if (resp["gkstatus"] ==1)
        {
          $('.modal-backdrop').remove();
          $("#duplicate-alert").alert();
          $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#duplicate-alert").hide();
          });
          $("#addproddesc").focus();
          $("#addproddesc").select();
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

  $(document).on('click', '#apreset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#addproduct").click();
  });
});
