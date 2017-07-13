$(document).ready(function() {
$(".serviceclass").hide();
$(".productclass").hide();
$(".common").hide();
if (sessionStorage.invflag==0){
    console.log("inv =0 product=yes");
  $(".noinventory").hide();
  $("#nogodownmsg").show();
}
if (sessionStorage.invflag=='1' ){
  console.log("inv =1 product=yes");
  $("#nogodownmsg").hide();

  $("#godownmsg").show();
}
//$("#proservlabel").text("Product Name :");

  var godownflag = 0;
  $('.modal-backdrop').remove();
  var specday;
  var specmonth;
  var specyear;
  var specdate;
  var specspresent = 0;
  var selectedgodown;
  var selectedtaxname;
  var selectedtaxstate = 0;
  $(".numtype").numeric({negative: false});
  $("#moresmall").on('shown.bs.collapse', function(event) {
    event.preventDefault();
    $("#smalllink").html('See less. <span class="glyphicon glyphicon-triangle-top"></span>');
  });
  $("#moresmall").on('hidden.bs.collapse', function(event) {
    event.preventDefault();
    $("#smalllink").html('See more. <span class="glyphicon glyphicon-triangle-bottom"></span>');
  });
  $("#additem").focus().select();
  /*$("#addcatselect").focus();
  if($("#addcatselect").is(':hidden'))
  {
    $("#addproddesc").focus();
  }*/

  $("#additem").change(function(event) {
    if($("#additem option:selected").val() == '7') {

      $(".serviceclass").hide();
      $(".productclass").show();
      $("#proservlabel").text("Product Name :");
      $(".common").show();
    }
    if($("#additem option:selected").val() == '19'){
      $(".productclass").hide();
      $(".serviceclass").show();
      $("#proservlabel").text("Service Name :");
      $(".common").show();
    }
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

/*$(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
  event.preventDefault();
  // Act on the event
  $(".numtype").numeric();
});*/
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

$("#additem").keydown(function(event) {
  if(event.which == 13) {
    if ($.trim($("#additem").val())=="") {
      $("#item-blank-alert").alert();
      $("#item-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#item-blank-alert").hide();
      });
      $("#additem").focus();
      return false;
    }

    if($("#additem option:selected").val() == '19')
    {
        event.preventDefault();
    $("#addproddesc").focus().select();
  }
  else {
    if ($("#catg").val()=='1'){
      $("#addcatselect").focus();
      event.preventDefault();

    }
    else{
      $("#addproddesc").focus();
      event.preventDefault();

    }

    if(!$("#addcatselect").is(':hidden'))
    {

        $("#addcatselect").focus();
        event.preventDefault();

    }
    else{
      $("#addproddesc").focus();
      event.preventDefault();

    }
    if($("#addcatselect").is(':hidden') || sessionStorage.invflag==0){


                  $("#addproddesc").focus();
                  event.preventDefault();

    }


  }

  }
});
$("#addproddesc").keydown(function(event) {
  if (event.which==13) {
    event.preventDefault();
    if ($(this).val()=="") {
      if($("#additem option:selected").val() == '7')
      {
      $("#product-blank-alert").alert();
      $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#product-blank-alert").hide();
      });
    }
    else{

      $("#service-blank-alert").alert();
      $("#service-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#service-blank-alert").hide();
      });
    }
      return false;
    }
    else {
      if($("#additem option:selected").val() == '7')
      {
          $("#hsnno").focus();
      }
      else{
        $("#serviceno").focus();
      }
    }
  }
  if (event.which==38) {
    event.preventDefault();
    $("#addcatselect").focus();
  }
});

$("#hsnno").keydown(function(event) {
  if(event.which==13) {
    event.preventDefault();
    if ($(this).val()=="") {
      $("#hsnno-blank-alert").alert();
      $("#hsnno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#hsnno-blank-alert").hide();
    });
      $("#hsnno").focus();
      return false;
    }
    $("#adduom").focus();
  }
});
$("#serviceno").keydown(function(event) {
  if(event.which==13) {
    event.preventDefault();
    if ($(this).val()=="") {
      $("#serviceno-blank-alert").alert();
      $("#serviceno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#serviceno-blank-alert").hide();
    });
      $("#serviceno").focus();
      return false;
  }
    $("#product_tax_table tbody tr:first td:eq(0) select").focus();
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
  if (event.which == 13) {
    if (specspresent == 1) {
      event.preventDefault();
      $("#spec_table tbody tr:first td:eq(1) input:first").focus();
    }
    else {
      event.preventDefault();
      $("#product_tax_table tbody tr:first td:eq(0) select").focus();
    }
  }
  else if (event.which==32)
  {
    event.preventDefault();
    $(".olduom").hide();
    $(".newuom").show();

    $("#newuom").focus();
  }
  else if (event.which==38 && (document.getElementById('adduom').selectedIndex==1||document.getElementById('adduom').selectedIndex==0)) {
    event.preventDefault();
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
    $("#product_tax_table tbody tr:last td:eq(2) input").focus();
  }
});
$(document).off('keydown', '#addcatselect').on('keydown', '#addcatselect',function(event) {
  if (event.which==13) {
    event.preventDefault();
    $("#addproddesc").focus().select();
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
          $("#product_tax_table tbody tr:first td:eq(0) select").focus();
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
      if (resp["gkresult"].length>0) {
        $('#product_tax_table tbody tr').remove();
        for (tax of resp["gkresult"]) {
          $('#product_tax_table tbody').append('<tr value="'+tax["taxid"]+'">'+
          '<td class="col-xs-4">'+
          '<select class="form-control input-sm product_cat_tax_disable tax_name">'+
          '<option value="" selected>Select Tax</option>'+
          '<option value="VAT">VAT</option>'+
          '<option value="CVAT">CVAT</option>'+
          '<option value="IGST">IGST</option>'+
          '</select>'+
          '</td>'+
          '<td class="col-xs-4">'+
             '<select class="form-control input-sm tax_state" >'+
             '<option value="">None</option>'+
             '<option value="Andaman and Nicobar Islands" stateid="35">Andaman and Nicobar Islands</option>'+
             '<option value="Andhra Pradesh" stateid="28">Andhra Pradesh</option>'+
             '<option value="Andhra Pradesh New" stateid="37">Andhra Pradesh (New)</option>'+
             '<option value="Arunachal Pradesh" stateid="12">Arunachal Pradesh</option>'+
             '<option value="Assam" stateid="18">Assam</option>'+
             '<option value="Bihar" stateid="10">Bihar</option>'+
             '<option value="Chandigarh" stateid="4">Chandigarh</option>'+
             '<option value="Chhattisgarh" stateid="22">Chhattisgarh</option>'+
             '<option value="Dadra and Nagar Haveli" stateid="26">Dadra and Nagar Haveli</option>'+
             '<option value="Daman and Diu" stateid="25">Daman and Diu</option>'+
             '<option value="Delhi" stateid="7">Delhi</option>'+
             '<option value="Goa" stateid="20">Goa</option>'+
             '<option value="Gujarat" stateid="29">Gujarat</option>'+
             '<option value="Haryana" stateid="6">Haryana</option>'+
             '<option value="Himachal Pradesh" stateid="2">Himachal Pradesh</option>'+
             '<option value="Jammu and Kashmir" stateid="1">Jammu and Kashmir</option>'+
             '<option value="Jharkhand" stateid="20">Jharkhand</option>'+
             '<option value="Karnataka" stateid="29">Karnataka</option>'+
             '<option value="Kerala" stateid="32">Kerala</option>'+
             '<option value="Lakshadweep" stateid="31">Lakshadweep</option>'+
             '<option value="Madhya Pradesh" stateid="23">Madhya Pradesh</option>'+
             '<option value="Maharashtra" stateid="27">Maharashtra</option>'+
             '<option value="Manipur" stateid="14">Manipur</option>'+
             '<option value="Meghalaya" stateid="17">Meghalaya</option>'+
             '<option value="Mizoram" stateid="15">Mizoram</option>'+
             '<option value="Nagaland" stateid="13">Nagaland</option>'+
             '<option value="Odisha" stateid="21">Odisha</option>'+
             '<option value="Pondicherry" stateid="34">Pondicherry</option>'+
             '<option value="Punjab" stateid="3">Punjab</option>'+
             '<option value="Rajasthan" stateid="8">Rajasthan</option>'+
             '<option value="Sikkim" stateid="11">Sikkim</option>'+
             '<option value="Tamil Nadu" stateid="33">Tamil Nadu</option>'+
             '<option value="Telangana" stateid="36">Telangana</option>'+
             '<option value="Tripura" stateid="16">Tripura</option>'+
             '<option value="Uttar Pradesh" stateid="9">Uttar Pradesh</option>'+
             '<option value="Uttarakhand" stateid="5">Uttarakhand</option>'+
             '<option value="West Bengal" stateid="19">West Bengal</option>'+
             '</select>'+
          '</td>'+
          '<td class="col-xs-3">'+
          '<input class="form-control product_cat_tax_disable input-sm tax_rate text-right numtype"  placeholder="Rate" value="'+tax["taxrate"]+'">'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
          '</tr>');
          $('#product_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
          $('#product_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
        }

      }
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
    .done(function(resp)   /*This function will return spec name of the product*/
    {
      $("#specdiv").html("");
      $("#specdiv").html(resp);
      if ($("#numberofspecs").val() > 0) {
        $("#specdiv").show();
        $(".specdate").autotab('number');
        $(".specdate").numeric();
        specspresent = 1;
      }
      else {
        specspresent = 0;
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
    $("#specdiv").hide();
    $("#specifications").html("");
    $("#specshelp").show();
    $('#product_tax_table tbody tr').remove();
    $('#product_tax_table tbody').append('<tr value="New">'+
    '<td class="col-xs-4">'+
    '<select class="form-control input-sm tax_name product_new_name">'+
    '<option value="" selected>Select Tax</option>'+
    '<option value="VAT">VAT</option>'+
    '<option value="CVAT">CVAT</option>'+
    '<option value="IGST">IGST</option>'+
    '</select>'+
    '</td>'+
    '<td class="col-xs-4">'+
       '<select class="form-control input-sm tax_state" >'+
       '<option value="">None</option>'+
       '<option value="Andaman and Nicobar Islands" stateid="35">Andaman and Nicobar Islands</option>'+
       '<option value="Andhra Pradesh" stateid="28">Andhra Pradesh</option>'+
       '<option value="Andhra Pradesh New" stateid="37">Andhra Pradesh (New)</option>'+
       '<option value="Arunachal Pradesh" stateid="12">Arunachal Pradesh</option>'+
       '<option value="Assam" stateid="18">Assam</option>'+
       '<option value="Bihar" stateid="10">Bihar</option>'+
       '<option value="Chandigarh" stateid="4">Chandigarh</option>'+
       '<option value="Chhattisgarh" stateid="22">Chhattisgarh</option>'+
       '<option value="Dadra and Nagar Haveli" stateid="26">Dadra and Nagar Haveli</option>'+
       '<option value="Daman and Diu" stateid="25">Daman and Diu</option>'+
       '<option value="Delhi" stateid="7">Delhi</option>'+
       '<option value="Goa" stateid="20">Goa</option>'+
       '<option value="Gujarat" stateid="29">Gujarat</option>'+
       '<option value="Haryana" stateid="6">Haryana</option>'+
       '<option value="Himachal Pradesh" stateid="2">Himachal Pradesh</option>'+
       '<option value="Jammu and Kashmir" stateid="1">Jammu and Kashmir</option>'+
       '<option value="Jharkhand" stateid="20">Jharkhand</option>'+
       '<option value="Karnataka" stateid="29">Karnataka</option>'+
       '<option value="Kerala" stateid="32">Kerala</option>'+
       '<option value="Lakshadweep" stateid="31">Lakshadweep</option>'+
       '<option value="Madhya Pradesh" stateid="23">Madhya Pradesh</option>'+
       '<option value="Maharashtra" stateid="27">Maharashtra</option>'+
       '<option value="Manipur" stateid="14">Manipur</option>'+
       '<option value="Meghalaya" stateid="17">Meghalaya</option>'+
       '<option value="Mizoram" stateid="15">Mizoram</option>'+
       '<option value="Nagaland" stateid="13">Nagaland</option>'+
       '<option value="Odisha" stateid="21">Odisha</option>'+
       '<option value="Pondicherry" stateid="34">Pondicherry</option>'+
       '<option value="Punjab" stateid="3">Punjab</option>'+
       '<option value="Rajasthan" stateid="8">Rajasthan</option>'+
       '<option value="Sikkim" stateid="11">Sikkim</option>'+
       '<option value="Tamil Nadu" stateid="33">Tamil Nadu</option>'+
       '<option value="Telangana" stateid="36">Telangana</option>'+
       '<option value="Tripura" stateid="16">Tripura</option>'+
       '<option value="Uttar Pradesh" stateid="9">Uttar Pradesh</option>'+
       '<option value="Uttarakhand" stateid="5">Uttarakhand</option>'+
       '<option value="West Bengal" stateid="19">West Bengal</option>'+
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
/* -----------------------Spec Key Events---------------------------------------------- */
$(document).off("keydown",".spec").on("keydown",".spec",function(event) {
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  n = $('#spec_table tbody tr').length -1;
  if (event.which==13) {
    event.preventDefault();
      if ($(this).hasClass("specday") || $(this).hasClass("specmonth")) {
        $(this).parent().next().children('.specdate').focus().select();
      }
      else {
        if (curindex == n) {
          $('#product_tax_table tbody tr:eq(0) td:eq(0) select').focus().select();
        }
        else {
          $('#spec_table tbody tr:eq('+nextindex+') td:eq(1) input').focus().select();
        }
      }
  }
  if (event.which==38) {
    event.preventDefault();
      if ($(this).hasClass("specyear") || $(this).hasClass("specmonth")) {
        $(this).parent().prev().children('.specdate').focus().select();
      }
      else {
        if (curindex == 0) {
          $("#adduom").focus();
        }
        else {
          $('#spec_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
        }
      }
  }
});
function pad (str, max) { //to add leading zeros in date
  str = str.toString();
  if (str.length==1) {
    return str.length < max ? pad("0" + str, max) : str;
  }
  else{
    return str;
  }
}
function yearpad (str, max) {
  str = str.toString();
  if (str.length==1) {
    return str.length < max ? pad("200" + str, max) : str;
  }
  else if (str.length==2) {
    return str.length < max ? pad("20" + str, max) : str;
  }
  else{
    return str;
  }
}
$(document).off("blur",".specday").on("blur",".specday",function(event) {
  $(this).val(pad($(this).val(),2));
  specday = $(this).val();
});
$(document).off("blur",".specmonth").on("blur",".specmonth",function(event) {
  $(this).val(pad($(this).val(),2));
  specmonth = $(this).val();
});

$(document).off("blur",".specyear").on("blur",".specyear",function(event) {
  var curindex = $(this).closest('tr').index();
  $(this).val(yearpad($(this).val(),4));
  specyear = $(this).val();
  if(!Date.parseExact(specday+specmonth+specyear, "ddMMyyyy")){ // Validation for date
    $("#date-alert").alert();
    $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
      $('#spec_table tbody tr:eq('+curindex+') td:eq(1) input:first').focus().select();
      $("#date-alert").hide();
    });
  }
  });
/* -----------------------Spec Key Events End------------------------------------------ */
/* -----------------------Tax key events start----------------------------------------- */

$(document).off("keyup",".tax_name").on("keyup",".tax_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if (event.which==188 && event.shiftKey)
  {
    if (curindex==0 && specspresent==0) {
      $("#adduom").focus();
    }
    if (curindex==0 && specspresent==1) {
      $('#spec_table tbody tr:last td:eq(1) input:first').focus().select();
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
  else if (($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='CVAT' || $("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='IGST') && event.which==13 ) {
    event.preventDefault();
    var types = [];
    $('#product_tax_table tbody tr').each(function(){
      if ($(".tax_name",this).val()=='CVAT' || $(".tax_name",this).val()=='IGST' ) {
        types.push($(".tax_name",this).val());
      }
    });
    types.sort();
    var duplicatetypes = [];
    for (var i = 0; i < types.length - 1; i++) {
      if (types[i + 1] == types[i]) {
        duplicatetypes.push(types[i]);
      }
    }
    if (duplicatetypes.length > 0) {
      $("#cvat-alert").alert();
      $("#cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#cvat-alert").hide();
      });
      return false;
    }
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
  }
  else if (event.which==13) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
  }
  else if (event.which==27) {
    event.preventDefault();
    if ($("#additem option:selected").val()=='7'){

      if ($("#godownpresence").val()==0) {
        $("#openingstock").focus().select();
      }
      if ($("#godownpresence").val()==1)
      {
        $("#godownflag").focus().select();
      }
      if(sessionStorage.invflag==0){
        $("#apsubmit").focus();
      }
    }
    else{
      $("#apsubmit").focus();
    }

  }
});

$(document).off("change",".tax_name").on("change",".tax_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var previndex = curindex -1;
  if ($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>'+
      '<option value="Andaman and Nicobar Islands" stateid="35">Andaman and Nicobar Islands</option>'+
    '<option value="Andhra Pradesh" stateid="28">Andhra Pradesh</option>'+
    '<option value="Andhra Pradesh New" stateid="37">Andhra Pradesh (New)</option>'+
    '<option value="Arunachal Pradesh" stateid="12">Arunachal Pradesh</option>'+
    '<option value="Assam" stateid="18">Assam</option>'+
    '<option value="Bihar" stateid="10">Bihar</option>'+
    '<option value="Chandigarh" stateid="4">Chandigarh</option>'+
    '<option value="Chhattisgarh" stateid="22">Chhattisgarh</option>'+
    '<option value="Dadra and Nagar Haveli" stateid="26">Dadra and Nagar Haveli</option>'+
    '<option value="Daman and Diu" stateid="25">Daman and Diu</option>'+
    '<option value="Delhi" stateid="7">Delhi</option>'+
    '<option value="Goa" stateid="20">Goa</option>'+
    '<option value="Gujarat" stateid="29">Gujarat</option>'+
    '<option value="Haryana" stateid="6">Haryana</option>'+
    '<option value="Himachal Pradesh" stateid="2">Himachal Pradesh</option>'+
    '<option value="Jammu and Kashmir" stateid="1">Jammu and Kashmir</option>'+
    '<option value="Jharkhand" stateid="20">Jharkhand</option>'+
    '<option value="Karnataka" stateid="29">Karnataka</option>'+
    '<option value="Kerala" stateid="32">Kerala</option>'+
    '<option value="Lakshadweep" stateid="31">Lakshadweep</option>'+
    '<option value="Madhya Pradesh" stateid="23">Madhya Pradesh</option>'+
    '<option value="Maharashtra" stateid="27">Maharashtra</option>'+
    '<option value="Manipur" stateid="14">Manipur</option>'+
    '<option value="Meghalaya" stateid="17">Meghalaya</option>'+
    '<option value="Mizoram" stateid="15">Mizoram</option>'+
    '<option value="Nagaland" stateid="13">Nagaland</option>'+
    '<option value="Odisha" stateid="21">Odisha</option>'+
    '<option value="Pondicherry" stateid="34">Pondicherry</option>'+
    '<option value="Punjab" stateid="3">Punjab</option>'+
    '<option value="Rajasthan" stateid="8">Rajasthan</option>'+
    '<option value="Sikkim" stateid="11">Sikkim</option>'+
    '<option value="Tamil Nadu" stateid="33">Tamil Nadu</option>'+
    '<option value="Telangana" stateid="36">Telangana</option>'+
    '<option value="Tripura" stateid="16">Tripura</option>'+
    '<option value="Uttar Pradesh" stateid="9">Uttar Pradesh</option>'+
    '<option value="Uttarakhand" stateid="5">Uttarakhand</option>'+
    '<option value="West Bengal" stateid="19">West Bengal</option>').prop('disabled',false);
    if (curindex > 0) {
      for (var i = 1; i < curindex+1; i++) {
        for (var j = 0; j < curindex; j++) {
          if ($("#product_tax_table tbody tr:eq("+i+") td:eq(0) select").val() == "CVAT" || $("#product_tax_table tbody tr:eq("+i+") td:eq(0) select").val() == "IGST" ) {
            i = i + 1;
          }
          selectedtaxstate = $("#product_tax_table tbody tr:eq("+j+") td:eq(1) select option:selected").attr("stateid");
          $('#product_tax_table tbody tr:eq('+i+') td:eq(1) select option[stateid='+selectedtaxstate+']').prop('hidden', true).prop('disabled', true);
        }
      }
    }
  }
  else {
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>').prop('disabled','true');
  }
  selectedtaxname = $("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val();
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
    var states = [];
    $('#product_tax_table tbody tr').each(function(){
      states.push($(".tax_state",this).val());
    });
    states.sort();
    var duplicatestates = [];
    for (var i = 0; i < states.length - 1; i++) {
      if (states[i + 1] == states[i]) {
        duplicatestates.push(states[i]);
      }
    }
    if (duplicatestates.length > 0) {
      $("#tax-same-alert").alert();
      $("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tax-same-alert").hide();
      });
      return false;
    }
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
  }
});

$(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
{
  var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1+1;
  var previndex1 = curindex1-1;
  if (event.which==13) {
    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val(parseFloat($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()).toFixed(2));
    event.preventDefault();
    if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
      $("#tax_state-blank-alert").alert();
      $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tax_state-blank-alert").hide();
      });
      return false;
    }
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
      '<option value="IGST">IGST</option>'+
      '</select>'+
      '</td>'+
      '<td class="col-xs-4">'+
      '<select class="form-control input-sm tax_state product_new_state" >'+
      '<option value="">None</option>'+
      '<option value="Andaman and Nicobar Islands" stateid="35">Andaman and Nicobar Islands</option>'+
      '<option value="Andhra Pradesh" stateid="28">Andhra Pradesh</option>'+
      '<option value="Andhra Pradesh New" stateid="37">Andhra Pradesh (New)</option>'+
      '<option value="Arunachal Pradesh" stateid="12">Arunachal Pradesh</option>'+
      '<option value="Assam" stateid="18">Assam</option>'+
      '<option value="Bihar" stateid="10">Bihar</option>'+
      '<option value="Chandigarh" stateid="4">Chandigarh</option>'+
      '<option value="Chhattisgarh" stateid="22">Chhattisgarh</option>'+
      '<option value="Dadra and Nagar Haveli" stateid="26">Dadra and Nagar Haveli</option>'+
      '<option value="Daman and Diu" stateid="25">Daman and Diu</option>'+
      '<option value="Delhi" stateid="7">Delhi</option>'+
      '<option value="Goa" stateid="20">Goa</option>'+
      '<option value="Gujarat" stateid="29">Gujarat</option>'+
      '<option value="Haryana" stateid="6">Haryana</option>'+
      '<option value="Himachal Pradesh" stateid="2">Himachal Pradesh</option>'+
      '<option value="Jammu and Kashmir" stateid="1">Jammu and Kashmir</option>'+
      '<option value="Jharkhand" stateid="20">Jharkhand</option>'+
      '<option value="Karnataka" stateid="29">Karnataka</option>'+
      '<option value="Kerala" stateid="32">Kerala</option>'+
      '<option value="Lakshadweep" stateid="31">Lakshadweep</option>'+
      '<option value="Madhya Pradesh" stateid="23">Madhya Pradesh</option>'+
      '<option value="Maharashtra" stateid="27">Maharashtra</option>'+
      '<option value="Manipur" stateid="14">Manipur</option>'+
      '<option value="Meghalaya" stateid="17">Meghalaya</option>'+
      '<option value="Mizoram" stateid="15">Mizoram</option>'+
      '<option value="Nagaland" stateid="13">Nagaland</option>'+
      '<option value="Odisha" stateid="21">Odisha</option>'+
      '<option value="Pondicherry" stateid="34">Pondicherry</option>'+
      '<option value="Punjab" stateid="3">Punjab</option>'+
      '<option value="Rajasthan" stateid="8">Rajasthan</option>'+
      '<option value="Sikkim" stateid="11">Sikkim</option>'+
      '<option value="Tamil Nadu" stateid="33">Tamil Nadu</option>'+
      '<option value="Telangana" stateid="36">Telangana</option>'+
      '<option value="Tripura" stateid="16">Tripura</option>'+
      '<option value="Uttar Pradesh" stateid="9">Uttar Pradesh</option>'+
      '<option value="Uttarakhand" stateid="5">Uttarakhand</option>'+
      '<option value="West Bengal" stateid="19">West Bengal</option>'+
      '</select>'+
      '</td>'+
      '<td class="col-xs-3">'+
      '<input class="form-control input-sm tax_rate text-right product_new_rate 3pe"  placeholder="Rate">'+
      '</td>'+
      '<td class="col-xs-1">'+
      '<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
      '</td>'+
      '</tr>');
      $(".tax_rate").numeric();
      if (selectedtaxname == "CVAT" || selectedtaxname == "IGST" ) {
        $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedtaxname+']').prop('hidden', true).prop('disabled', true);
      }
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
    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
  }
  else if (event.which==27) {
    event.preventDefault();

    if($("#additem option:selected").val()=='19'){
    $("#apsubmit").focus();
    }
    else{

      if ($("#godownpresence").val()==0) {
        $("#openingstock").focus().select();
      }
      if ($("#godownpresence").val()==1)
      {
        $("#godownflag").focus().select();
      }
      if(sessionStorage.invflag==0){
        $("#apsubmit").focus();
      }
    }

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
$(document).off('keydown', '#openingstock').on('keydown', '#openingstock', function(event) {
  if (event.which == 13) {
    event.preventDefault();
    $("#apsubmit").click();
  }
  else if (event.which == 38) {
    $("#godownflag").focus().select();
  }
  else if (event.which == 173) {
    event.preventDefault();
  }
});
/* -----------------------Godown Key events start here----------------------------------------- */
$(document).off("change",".godown_name").on("change",".godown_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  selectedgodown = $('#godown_ob_table tbody tr:eq('+curindex+') td:eq(0) select').val();
});

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
  var selectedgodown = $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val();
  var numberofgodowns = $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length-1;
  if (event.which==13) {
    event.preventDefault();
    if (curindex1 != ($("#godown_ob_table tbody tr").length-1)) {
      $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    else {
      if (numberofgodowns > 0) {
        if ($('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
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
        $('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        if (curindex1 == 0) {
          $("#godown_ob_table tbody tr:last td:last").append('<a href="#" class="godown_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
        }
        $(".godown_ob").numeric();
        $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedgodown+']').prop('hidden', true).prop('disabled', true);
	$('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value=""]').prop('selected', true);
        $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        $("#apsubmit").focus();
      }
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
    $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
  }
  else if (event.which==27) {
    event.preventDefault();
    $("#apsubmit").focus();
  }
  else if (event.which==173) {
    event.preventDefault();
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
/*
Adding godown.
*/
$("#addgodown").click(function() {
  $.ajax(
    {
      type: "POST",
      url: "/godown?type=addpopup",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        $("#addgodownpopup").html("");
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $("#addgodownpopup").html(resp);
        $('#addgodownmodal').modal('show');
        $('#addgodownmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
        {
          $("#godownname").focus();
        });
        $('#addgodownmodal').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the modal is opened
        {
          $("#addgodownpopup").html("");
          $(document).off('keyup').on('keyup',function(event)
          {
            /* Act on the event */
            if (event.which == 45)
            {
              event.preventDefault();
              $("#apsubmit").click();
            }
          });
          $.ajax({
            url: 'godown?type=getallgodowns',
            type: 'POST',
            dataType: 'json',
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
          .done(function(resp) {
            var newgodowns = resp["gkresult"];
            if (newgodowns.length > 0) {
              $("#newgodownadded").show();
              $('#godown_ob_table tbody tr').each(function(){
                var curindex2 = $(this).closest('tr').index();
                for (i in newgodowns ) {
                  if (newgodowns[i].godownname == sessionStorage.newgodownname && newgodowns[i].godownaddress == sessionStorage.newgodownaddress) {
                    $('#godown_ob_table tbody tr:eq('+curindex2+') td:eq(0) select').append('<option value="' + newgodowns[i].godownid + '">' + newgodowns[i].godownname + '(' + newgodowns[i].godownaddress + ')</option>');
                  }
                }
              });
	      $('#godown_ob_table tbody tr:last td:eq(0) select option:last').prop("selected", "true");
	      if (godownflag == 0) {
		$("#godownflag").focus().select();
	      }
	      else {
		$('#godown_ob_table tbody tr:last td:eq(1) input').focus().select();
	      }
            }
            console.log("success");
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });

        });
      }
    }
  );
});


$(document).off("click","#apsubmit").on("click", '#apsubmit', function(event) {
  event.preventDefault();
  /* Act on the event */



if($("#additem option:selected").val()=='7'){
  if ($("#addproddesc").val()=="")
  {
    $('.modal-backdrop').remove();
    $("#product-blank-alert").alert();
    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#product-blank-alert").hide();
    });
    $("#addproddesc").focus();
    $("#addproddesc").select();
    return false;
  }
  if ($("#hsnno").val()=="") {
    $("#hsnno-blank-alert").alert();
    $("#hsnno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#hsnno-blank-alert").hide();
  });
    $("#hsnno").focus();
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

}
else{
  if ($("#addproddesc").val()=="")
  {
    $('.modal-backdrop').remove();
    $("#service-blank-alert").alert();
    $("#service-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#service-blank-alert").hide();
    });
    $("#addproddesc").focus();
    $("#addproddesc").select();
    return false;
  }
  if($("#serviceno").val()==""){

      $("#serviceno-blank-alert").alert();
      $("#serviceno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#serviceno-blank-alert").hide();
    });
      $("#serviceno").focus();
      return false;
  }
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
  var allow=true;
  $("#godown_ob_table tbody tr").each(function() {
    var goid = $(".godown_name", this).val();
    var ccount=0;
    $("#godown_ob_table tbody tr").each(function() {
      if(goid==$(".godown_name", this).val()){
        ccount =ccount +1;
      }
    });
    if (ccount>1) {
      allow=false;
    }
    else {
      allow=true;
    }
  });
  if (!allow) {
    $("#godown-same-alert").alert();
    $("#godown-same-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#godown-same-alert").hide();
    });
    return false;
  }

  var specs = {};      /*This is spec dictioary having spcode as a key and specval as its value*/
  $("#spec_table tbody tr").each(function(){
    if ($(".spec_value",this).hasClass('datevalue')) {
      $(".specdate").each(function() {
        if ($(this).hasClass('specday')) {
          specday = $(this).val(); //Storing specday
        }
        if ($(this).hasClass('specmonth')) {
          specmonth = $(this).val(); //SToring specmonth
        }
        if ($(this).hasClass('specyear')) {
          specyear = $(this).val(); //Storing specyear
        }
      });
      specdate = specyear+"-"+specmonth+"-"+specday; //Storing date in yyyyMMdd format
      $(".spec_value",this).val(specdate); // Storing spec date in hdden field
    }
    if ($.trim($(".spec_name",this).val())!=""){
      if ($.trim($(".spec_name",this).val())!="" && $.trim($(".spec_value",this).val())!="" ) {
        specs[$(".spec_name",this).val()] = $(".spec_value",this).val();
      }
    }
  });


  var taxes = []; //Taxes list to store dictionaries created
  $("#product_tax_table tbody tr").each(function(){
    var obj = {}; // dict for storing tax details
    if ($.trim($("select option:selected", this).val()) != "") {
        obj.taxname = $.trim($("td:eq(0) select option:selected", this).val());
        obj.state = $.trim($("td:eq(1) select option:selected", this).val());
        obj.taxrate = $.trim($("input", this).val());
        taxes.push(obj);
    }


  });
  var gobj = {}; // Creating a dictionary for storing godown wise opening stock
  $("#godown_ob_table tbody tr").each(function(){
    if ($.trim($(".godown_name",this).val())!="") {
      if ($.trim($(".godown_ob",this).val())!="" &&  $.trim($(".godown_ob",this).val())!= "0.00") {
        gobj[$(".godown_name",this).val()] = $(".godown_ob",this).val(); //Godown id is key and opening stock is value
      }
    }
  });

  var  addformdata = $("#addprodform").serializeArray();

if ($("#additem option:selected").val() == 7){
  addformdata.push("gscode",$("#hsnno").val());
}
else{
  addformdata.push("gscode",$("#serviceno").val());

}
  addformdata.push("gsflag",$("#additem option:selected").val());
  addformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
  addformdata.push({name: 'specs', value: JSON.stringify(specs)});
  if ($("#godownflag").val() == 1) {
    addformdata.push({name: 'godowns', value: JSON.stringify(gobj)}); //Pushing taxes and specs into addformdata

  }
  console.log(addformdata);
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
        console.log(addformdata);
    }
  })
  .done(function(resp) {
    if (resp["gkstatus"] ==0) {

      //$("#addproduct").click();
      if(sessionStorage.invflag==0){
        $("#product").click();
      }
      else{
        $("#productinmaster").click();
      }
      $('.modal-backdrop').remove();
      $("#addproduct-success-alert").alert();
      $("#addproduct-success-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#addproduct-success-alert").hide();

      });

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
  event.stopPropagation();
});

$(document).on('click', '#apreset', function(event) {
  event.preventDefault();
  /* Act on the event */
  $("#addproduct").click();
});
});
