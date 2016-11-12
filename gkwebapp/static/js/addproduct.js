$(document).ready(function() {
$('.modal-backdrop').remove();
  $("#addcatselect").focus();
  $('.proddate').autotab('number');

  $(document).off('focus', '.proddate').on('focus', '.proddate', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".proddate").numeric();
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


$(document).keyup(function(event)
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

$(document).off('blur', '#newuom').on('blur', '#newuom', function(event) {
  event.preventDefault();
  /* Act on the event */
  newuom =0;
});



$(document).off('keydown', '#adduom').on('keydown', '#adduom', function(event) {
  if (event.which==13)
  {
    event.preventDefault();
    $("#product_tax_table tbody tr:last td:eq(0) input").focus();

  }
  if (event.which==32)
  {
    event.preventDefault();
    $(".olduom").hide();
    $(".newuom").show();
    $("#newuom").focus();
  }

  /* Act on the event */
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




  }

});


  $(document).on("keydown",'.addprod input:not(:hidden),.addprod textarea, .addprod select', function(e) {
     var n = $(".addprod input:not(:hidden),.addprod textarea,.addprod select").length;
     var f = $('.addprod input:not(:hidden),.addprod textarea,.addprod select');


     if (e.which == 13 && newuom!=1)
     {
       var nextIndex = f.index(this) + 1;

         if(nextIndex < n)
         {
           e.preventDefault();
           f[nextIndex].focus();
           f[nextIndex].select();
         }
      }
      if (e.which ==13 && newuom==1)
      {
        var unitname = $.trim($("#newuom").val());
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
            $('#product_tax_table tbody tr:last td:eq(0) input').focus();
            $('#product_tax_table tbody tr:last td:eq(0) input').select();

            $("#adduom option").filter(function(i,e){return $(e).text()==unitname}).prop('selected', true);
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
    $(document).on("keydown",'.addprod input:not(:hidden),.addprod textarea,.addprod select', function(e) {
       var n = $(".addprod input:not(:hidden),.addprod textarea,.addprod select").length;
       var f = $('.addprod input:not(:hidden),.addprod textarea,.addprod select');
      if (e.which == 38)
      {
        var prevIndex = f.index(this) - 1;
        var elementType = $(this).prop('nodeName');
        if(prevIndex > -1)
        {
          if (elementType=="SELECT")
          {
            var sindex= $(".sel option:selected").index();
            if (sindex <=1)
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
                '<input type="text" class="form-control product_cat_tax_disable input-sm tax_name" placeholder="Tax Name" value="'+tax["taxname"]+'">'+
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
              }
              $('#product_tax_table tbody').append('<tr value="New">'+
              '<td class="col-xs-4">'+
              '<input type="text" class="form-control  input-sm tax_name product_new_name" placeholder="Tax Name" value="">'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control  input-sm tax_state product_new_state" >'+
              '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control  input-sm tax_rate text-right product_new_rate numtype"  placeholder="Rate" value="">'+
              '</td>'+
              '<td class="col-xs-1">'+
              '</td>'+
              '</tr>');
            }
            else {
              $('#product_tax_table tbody').append('<tr value="New">'+
              '<td class="col-xs-4">'+
              '<input type="text" class="form-control input-sm tax_name product_new_name" placeholder="Tax Name" value="">'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control  input-sm tax_state product_new_state" >'+
              '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control  input-sm tax_rate text-right product_new_rate numtype"  placeholder="Rate" value="">'+
              '</td>'+
              '<td class="col-xs-1">'+
              '</td>'+
              '</tr>');
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
      '<input type="text" class="form-control product_new_name input-sm tax_name" placeholder="Tax Name" value="">'+
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
  $(document).off("keydown",".tax_name").on("keydown",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      if (curindex==0) {
        $("#category_name").focus().select();
      }
      else {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
    }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#product_tax_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
      }
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
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(0) input').focus().select();
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
        $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
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
        '<input type="text" class="form-control input-sm tax_name product_new_name" placeholder="Tax Name">'+
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
        $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(2) input').focus().select();
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
      $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
    }
    else if (event.which==35) {
      event.preventDefault();
      $('#specifications').find("input:first").focus().select();
    }

  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#product_tax_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#product_tax_table tbody tr:last td:eq(0) input').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */

  $(document).on('click', '#apsubmit', function(event) {
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
    event.preventDefault();
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
    var addformdata = $("#addprodform").serializeArray();

    addformdata.push({name: 'taxes', value: JSON.stringify(taxes)});

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
