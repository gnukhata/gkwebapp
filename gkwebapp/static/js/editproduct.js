$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#prodselect").focus();
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

  $(document).off('click', '#editgodownflag').on('click', '#editgodownflag', function(e){
    if ($(this).is(":checked")) {
      $("#editgodownflag").val(1);
      $("#editnogodown").hide();
      $("#editopeningstockdiv").show();
    }
    else {
      $("#editgodownflag").val(0);
      $("#editopeningstockdiv").hide();
      $("#editnogodown").show();
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
  $(document).keyup(function(event)
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
  $(document).on('keydown', '#editproddesc', function(event) {
    if (event.which==38) {
      event.preventDefault();
      $("#prodselect").focus();
    }
  });

  $(document).on('keydown', '#editopeningstock', function(event) {
    if (event.which==13)
    {
      event.preventDefault();
      var taxdisabled = $('#product_edit_tax_table tbody tr:first td:eq(0) select').is(":disabled");
      var taxcount = $('#product_edit_tax_table tbody tr').length;
      if (taxdisabled || taxcount<1) {
        if ($("#editspecifications").contents(".form-group").length == 0) {
          $('#epsubmit').click();
        }
        else {
          $("#editspecifications").contents(".form-group:first").find("input:first").focus().select();
        }
      }
      else {
        $('#product_edit_tax_table tbody tr:first td:eq(0) select').focus().select();
      }

    }
    else if (event.which==173) {
      event.preventDefault();
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
          $('#editspecifications').contents(".form-group:first").find("input:first").focus();
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
    else if (event.which==173) {
      event.preventDefault();
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
          if (resp["gkresult"].length > 0) {
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
        if (resp["gkresult"].length > 0) {
          $('#product_edit_tax_table tbody tr').remove();
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
      }
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
      var indexgp = $(".editgodownid").index(this);
      $.ajax({
        url: '/product?by=godown',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"productcode":$("#prodselect option:selected").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        var goopeningstock=resp["gkresult"];
        var editgoopeningstock = 0;
        var goid = 0;
        if (resp["gkstatus"]==0)
        {
          if (goopeningstock.length == 0) {
            editgoopeningstock = "0.00";
          }
          else {
            for (i in goopeningstock) {
              editgoopeningstock=goopeningstock[i].goopeningstock;
              goid=goopeningstock[i].goid;
              $(".editgodown_ob").eq(i).val(editgoopeningstock);
              $(".editgodown_name").eq(i).val(goid);
            }
          }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
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
    $(".godownflag").show();
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
    if (catcode!="")
    {
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
    else {
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
    else if (($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='CVAT') && event.which==13 ) {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
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
        $('#product_edit_tax_table tbody').append('<tr value="new">'+
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
      $('#specifications').contents(".form-group:first").find("input:first").focus().select();
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
  /* -----------------------Godown Key events start here----------------------------------------- */

  $(document).off("keyup",".editgodown_name").on("keyup",".editgodown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==188 && event.shiftKey)
    {
      console.log(previndex+', '+curindex+', '+nextindex);
      if (curindex==0) {
      $("#edituom").focus().select();
      }
      if(previndex>-1 && curindex != 0)
      {
        event.preventDefault();
        $('#editgodown_ob_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
  });

  $(document).off("keydown",".editgodown_name").on("keydown",".editgodown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#editgodown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
  });

  $(document).off("keydown",".editgodown_ob").on("keydown",".editgodown_ob",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var selectindex = $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').index();
    var numberofgodowns = $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#editgodown_ob_table tbody tr").length-1)) {
        $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        if ($('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
          $("#godown-blank-alert").alert();
          $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#godown-blank-alert").hide();
          });
          $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').val()=="") {
          $("#os-blank-alert").alert();
          $("#os-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#os-blank-alert").hide();
          });
          $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
          return false;
        }
        if ($("#editgodown_ob_table tbody tr").length == numberofgodowns) {
          var taxdisabled = $('#product_edit_tax_table tbody tr:first td:eq(0) select').is(":disabled");
          var taxcount = $('#product_edit_tax_table tbody tr').length;
          if (taxdisabled || taxcount<1) {
            if ($("#editspecifications").contents(".form-group").length == 0) {
              $('#epsubmit').click();
            }
            else {
              $("#editspecifications").contents(".form-group:first").find("input:first").focus().select();
            }
          }
          else {
            $('#product_edit_tax_table tbody tr:first td:eq(0) select').focus().select();
          }
          return false;
        }
        $('#editgodown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        $("#editgodown_ob_table tbody tr:last td:last").append('<a href="#" class="editgodown_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
        $(".editgodown_ob").numeric();
        $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#editgodown_ob_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==35) {
      event.preventDefault();
      var taxdisabled = $('#product_edit_tax_table tbody tr:first td:eq(0) select').is(":disabled");
      var taxcount = $('#product_edit_tax_table tbody tr').length;
      if (taxdisabled || taxcount<1) {
        if ($("#editspecifications").contents(".form-group").length == 0) {
          $('#epsubmit').focus();
        }
        else {
          $("#editspecifications").contents(".form-group:first").find("input:first").focus().select();
        }
      }
      else {
        $('#product_edit_tax_table tbody tr:first td:eq(0) select').focus().select();
      }
    }
    else if (event.which==173) {
      event.preventDefault();
    }
  });
  $(document).off("click",".editgodown_del").on("click", ".editgodown_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#editgodown_ob_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#editgodown_ob_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Godown Key events end here----------------------------------------- */

$(document).off("keyup", ".spec").on("keyup", ".spec", function(event) {
if (event.which ==13) {
  event.preventDefault();
  if ($(".spec").index(this)==$(".spec").length - 1) {
    $("#epsubmit").click();
  }
}
});

  $(document).off("click","#epsubmit").on("click", "#epsubmit", function(event) {
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
      if ($.trim($(".editgodown_name",this).val())!="") {
        if ($.trim($(".editgodown_ob",this).val())!="" && $.trim($(".editgodown_ob",this).val())!= "0.00") {
          obj[$(".editgodown_name",this).val()] = $(".editgodown_ob",this).val();
        }
      }
    });
    var editformdata = $("#editprodform").serializeArray();
    editformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
    if ($("#editgodownflag").val() == 1) {
      editformdata.push({name: 'godowns', value: JSON.stringify(obj)});
    }
    console.log(editformdata);
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
    event.stopPropagation();
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
          if ($("#prodselect option").length < 3) {
          $("#product").click();
          }
          else {
            $("#editproduct").click();
          }
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
