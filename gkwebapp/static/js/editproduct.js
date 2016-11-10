$(document).ready(function() {
$('.modal-backdrop').remove();
  $("#prodselect").focus();
  $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".numtype").numeric();
  });
  var sel1=0;
  var sel2=0;
  var sindex=0;
  var category;
  var existingcatspecs;
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




  $(document).on('keydown', '#edituom', function(event) {
    if (event.which==13)
    {
      event.preventDefault();
      $("#product_edit_tax_table tbody tr:last td:eq(0) input").focus();

    }

    /* Act on the event */
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
    });
    $(document).on("keydown",'.editpr input:not(:hidden),.editpr textarea,.editpr select', function(e) {
       var n = $(".editpr input:not(:hidden),.editpr textarea,.editpr select").length;
       var f = $('.editpr input:not(:hidden),.editpr textarea,.editpr select');
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

            if (sindex ==0)
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
        $(".catsp").remove();

        for (tax of resp["gkresult"]) {
          $('#product_edit_tax_table tbody').append('<tr class="catsp " value="'+tax["taxid"]+'">'+
          '<td class="col-xs-4">'+
          '<input type="text" class="form-control product_cat_tax_disable input-sm tax_name" placeholder="Tax Name" value="'+tax["taxname"]+'">'+
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
          $('#product_edit_tax_table tbody').append('<tr class="rowval" value="'+tax["taxid"]+'">'+
          '<td class="col-xs-4">'+
          '<input type="text" class="form-control product_tax_disable input-sm tax_name" placeholder="Tax Name" value="'+tax["taxname"]+'">'+
          '</td>'+
          '<td class="col-xs-4">'+
          '<select class="form-control product_tax_disable input-sm tax_state" >'+
          '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-3">'+
          '<input class="form-control product_tax_disable input-sm tax_rate text-right"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '</td>'+
          '</tr>');
          $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
        }
        $(".product_tax_disable").prop('disabled',true);
        $('#product_edit_tax_table tbody').append('<tr class="rowval blank" value="New">'+
        '<td class="col-xs-4">'+
        '<input type="text" class="form-control product_new_name input-sm tax_name" placeholder="Tax Name" value="">'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control product_new_state input-sm tax_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control product_new_rate input-sm tax_rate text-right"  placeholder="Rate" value="">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '</td>'+
        '<td class="">'+
        '<input type="hidden" class="form-control product_row_val input-sm tax_name" value="New">'+
        '</td>'+
        '</tr>');

      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
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
      $('#editspecifications').find('input, textarea, button, select').prop('disabled',false);

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
        $(".catsp").remove();

        for (tax of resp["gkresult"]) {
          $('#product_edit_tax_table tbody').prepend('<tr class="catsp" value="'+tax["taxid"]+'">'+
          '<td class="col-xs-4">'+
          '<input type="text" class="form-control product_cat_tax_disable input-sm tax_name" placeholder="Tax Name" value="'+tax["taxname"]+'">'+
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
        }
        $(".product_cat_tax_disable").prop('disabled',true);
        $('#product_edit_tax_table tbody').append('<tr class="rowval blank" value="New">'+
        '<td class="col-xs-4">'+
        '<input type="text" class="form-control product_new_name input-sm tax_name" placeholder="Tax Name" value="">'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control product_new_state input-sm tax_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control product_new_rate input-sm tax_rate text-right"  placeholder="Rate" value="">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '</td>'+
        '<td class="">'+
        '<input type="hidden" class="form-control product_row_val input-sm tax_name" value="New">'+
        '</td>'+
        '</tr>');

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
  $(document).off("keydown",".tax_name").on("keydown",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      if (curindex==0) {
        $("#category_name").focus().select();
      }
      else {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
    }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
      }
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
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) input').focus().select();
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
        $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
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
        $('#product_edit_tax_table tbody').append('<tr class="rowval blank" value="new">'+
        '<td class="col-xs-4">'+
        '<input type="text" class="form-control input-sm tax_name product_new_name" placeholder="Tax Name">'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<select class="form-control input-sm tax_state product_new_state" >'+
        '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<input class="form-control input-sm tax_rate text-right product_new_rate"  placeholder="Rate">'+
        '</td>'+
        '<td class="col-xs-1">'+

        '</td>'+
        '<td class="">'+
        '<input type="hidden" class="form-control product_row_val input-sm tax_name" value="New" >'+
        '</td>'+
        '</tr>');
        $(".tax_rate").numeric();
        $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
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
      $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
    }
    else if (event.which==35) {
      event.preventDefault();
      $('#extsp').find("input:first").focus().select();
    }

  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#product_edit_tax_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#product_edit_tax_table tbody tr:last td:eq(0) input').select();
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
      if ($(".product_new_name",this).val()!="") {
      obj.taxrowid = $(".product_row_val",this).val();
      obj.taxname = $(".product_new_name",this).val();
      obj.state = $(".product_new_state",this).val();
      obj.taxrate = $(".product_new_rate",this).val();
      taxes.push(obj);
    }


    });

    var editformdata = $("#editprodform").serializeArray();
    editformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
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
