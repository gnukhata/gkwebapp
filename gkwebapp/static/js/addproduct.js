/*
  Copyright (C) 2013, 2014, 2015, 2016, 2017 Digital Freedom Foundation
  Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


  Contributors:
  "Abhijith Balan" <abhijithb21@openmailbox.org>
  "Bhavesh Bawadhane" <bbhavesh07@gmail.com>
  "Ishan Masdekar" <imasdekar@dff.org.in>
  "Mohd. Talha Pawaty" <mtalha456@gmail.com>
  "Navin Karkera" <navin@openmailbox.org>
  "Ravishankar Purne" <ravismail96@gmail.com>
  "Reshma Bhatawadekar" <bhatawadekar1reshma@gmail.com>
  "Rohini Baraskar" <robaraskar@gmail.com>
  "Sachin Patil" <sachin619patil@rediffmail.com>

*/
     


$(document).ready(function() {
$(".serviceclass").hide();
    $(".productclass").hide();
    var stkhtml;  
    $(".common").hide();
    $(".tax_rate_gst").hide();
  var godownflag = 0;
    var taxfieldhtml = $("#product_tax_table tbody").html();
    var stateshtml = $("#product_tax_table tbody tr:first td:eq(1) select").html();
    var delhtml = '<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>';
    $("#product_tax_table tbody tr:first td:eq(1) select").empty();
    $('#product_tax_table tbody tr:first td:eq(1) select').prop("disabled", true);
    $("#product_tax_table tbody tr:first td:eq(1) select").append('<option value="">None</option>');
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

  /*$("#addcatselect").focus();
  if($("#addcatselect").is(':hidden'))
  {
    $("#addproddesc").focus();
    }*/
    if(sessionStorage.invflag != 0) {
        $("#addgodown").show();
    }
  $("#additem input:radio").change(function(event) {

    if($("#additem input:radio:checked").val() == '7') {

	$(".serviceclass").hide();
	if(sessionStorage.invflag != 0) {
            $(".productclass").show();
        }
	else {
	    $(".productclass").not("#addgodown").show();
	}
      $("#proservlabel").text("Product Name :");
	$("#gscodelabel").text("HSN Code :");
	$("#maximumprice").text("MRP :");
	$("#defaultprice").text("Sale Price :");
      $(".common").show();
    }

    if($("#additem input:radio:checked").val() == '19'){
      $(".productclass").hide();
      $(".serviceclass").show();
      $("#proservlabel").text("Service Name :");
        $("#gscodelabel").text("Accounting Code for Service :");
	$("#maximumprice").text("Maximum Rate :");
	$("#defaultprice").text("Default Rate :");
      $(".common").show();
    }
  });

    $("#additem input:radio").change();

if($("#additem input:radio:checked").is(':visible'))
    {
	$("#additem input:radio:checked").focus();
  }
    else{
	if($("#addcatselect").length == 0){
	    $("#addproddesc").focus();
	}
	else {
	    $("#addcatselect").focus();
	}
    }

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
  // Act on the event
    $(".numtype").numeric({ negative: false });
});
$(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
  event.preventDefault();
  /* Act on the event */
    if ($(this).val()=="" && !$(this).hasClass("hsn"))
  {
    $(this).val(parseFloat(0).toFixed(2));
  }
  else
    {
	if(!$(this).hasClass("hsn")){
	    $(this).val(parseFloat($(this).val()).toFixed(2));
	}
  }
});

    $(document).off('blur', '#addproddesc').on('blur', '#addproddesc',function(event) {
  /* Act on the event */

  $("#addproddesc").val($("#addproddesc").val().trim());

});

$("#addproductpanelboody").off('keyup').on('keyup',function(event)
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

    $("#openingstock").keydown(function(event){
	if(event.which==27){
	    event.preventDefault();
	    $("#apsubmit").focus().select();
	}});
			
    
$("#additem input:radio").keydown(function(event) {
  if(event.which == 13) {
    if ($.trim($("#additem input:radio:checked").val())=="") {
      $("#item-blank-alert").alert();
      $("#item-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#item-blank-alert").hide();
      });
      $("#additem input:radio:checked").focus();
      return false;
    }

    if($("#additem input:radio:checked").val() == '19')
    {
        event.preventDefault();
    $("#addproddesc").focus().select();
  }
      else {
	  if($("#addcatselect").is(':visible'))
    {
        $("#addcatselect").focus();
        event.preventDefault();
    }
    else{
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
      if($("#additem input:radio:checked").val() == '7')
      {
      $("#product-name-blank-alert").alert();
      $("#product-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#product-name-blank-alert").hide();
      });
    }
    else{

      $("#service-name-blank-alert").alert();
      $("#service-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#service-name-blank-alert").hide();
      });
    }
      return false;
    }
    else {

          $("#hsnno").focus();


    }
  }
  if (event.which==38) {
    event.preventDefault();
      if($("#addcatselect").is(":visible")){
	  $("#addcatselect").focus();
      }
      else {
	  $("#additem input:radio:checked").focus();
      }
  }
});
    $("#hsnno").change(function(event){
	if(parseInt($("#hsnno").val()) <= 0)
	    {
	       	$("#hsnno-must-be-positive").alert();
		$("#hsnno-must-be-positive").fadeTo(2250, 500).slideUp(500, function(){
		    $("#hsnno-must-be-positive").hide();
		    $("#hsnno").focus().select();
		});
		return false;
	    }
    });
$("#hsnno").keydown(function(event) {
  if(event.which==13) {
    event.preventDefault();
    if ($(this).val()=="") {
      if($("#additem input:radio:checked").val() == '7') {
      $("#hsnno-blank-alert").alert();
      $("#hsnno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#hsnno-blank-alert").hide();
      });
      }
    else{

      $("#serviceno-blank-alert").alert();
      $("#serviceno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#serviceno-blank-alert").hide();
      });
    }
      return false;
    }
      if(parseInt($("#hsnno").val()) <= 0)
	    {
	       	$("#hsnno-must-be-positive").alert();
		$("#hsnno-must-be-positive").fadeTo(2250, 500).slideUp(500, function(){
		    $("#hsnno-must-be-positive").hide();
		    $("#hsnno").focus().select();
		});
		return false;
	    }
      if ($("#additem input:radio:checked").val()=='7'){
    $("#adduom").focus();
    }
      else {
	  $("#maxprice").focus();
    }

  }
    else if (event.which == 38){
	$("#addproddesc").focus().select();
    }
});
/*$("#serviceno").keydown(function(event) {
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
});*/



$("#adduom").change(function(event) {
  if ($("#adduom option:selected").val()!='') {
    $("#unitaddon").html($("#adduom option:selected").attr('uname'));
  }
});

$("#openingstock").focus(function(event) {
  if ($("#adduom option:selected").val()!='') {
    $("#unitaddon").html($("#adduom option:selected").attr('uname'));
  }
});

// Keydown event for add unit of measurement.
    $(document).off('keydown', '#adduom').on('keydown', '#adduom', function(event) {
	// Event for 'Enter' key.
    if (event.which == 13) {
	if ($("#adduom option:selected").val()==""){
	    $("#uomblank-alert").alert();
	    $("#uomblank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#uomblank-alert").hide();
	    });
	    $("#adduom").focus();
	    return false;
	}
	$("#maxprice").focus();
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
      if($("#hsnno").is(":visible")){
	  $("#hsnno").focus().select();
  }
      else {
	  $("#addproddesc").focus().select();
      }
  }

  /* Act on the event */
    });
    $(document).off('keydown', '#maxprice').on('keydown', '#maxprice', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    $("#saleprice").focus();
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#adduom").focus();
	}
    });
    $(document).off('keydown', '#saleprice').on('keydown', '#saleprice', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    event.preventDefault();
	    if (specspresent == 1) {
		$("#spec_table tbody tr:first td:eq(1) input:first").focus();
	    }
	    else {
	    if ($("#product_tax_table tbody").length > 0) {
		$("#product_tax_table tbody tr:first td:eq(0) select").focus();
	    }
	    else{
		if ($("#additem input:radio:checked").val()=='7'){
		    if ($("#godownpresence").val()==0) {
			$("#openingstock").focus().select();
		    }
		    else
		    {
			//If godownflag is hidden, i.e when user is godownkeeper focus shifts to godown name.
			if ($("#godownflag").is(":hidden")) {
			    $(".godown_name:first").focus();
			}
			else{
			    $("#godownflag").focus().select();
			}
		    }
		    if(sessionStorage.invflag==0){
			$("#apsubmit").focus();
		    }
		}
		else{
		    $("#apsubmit").focus();
		}
	    }
	}
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#maxprice").focus();
	}
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
    else if (event.which == 38 && (document.getElementById('addcatselect').selectedIndex==1||document.getElementById('addcatselect').selectedIndex==0)){
	$("#additem input:radio:checked").focus();
    }

});
    //Events for field to add new unit of measurement.
$(document).off('keydown', '#newuom').on('keydown', '#newuom', function(event) {
    /* Act on the event */
    //Events triggered when Escape key is pressed.
  if (event.which==27)
  {
    event.preventDefault();
    $(".olduom").show();
    $(".newuom").hide();
    $("#adduom").focus();
  }
    // Events triggered when Enter key is pressed.
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

	    //Added uom is selected.
            $("#adduom option").filter(function(i,e){return $(e).text()==unitname;}).prop('selected', true);
	    //If specs are present focus shifts to specs.
	    if (specspresent == 1) {
	    event.preventDefault();
	    $("#spec_table tbody tr:first td:eq(1) input:first").focus();
	}

	    else {
		// If Tax is present focus shifts to Tax.
	    if ($("#product_tax_table tbody").length > 0) {
		$("#product_tax_table tbody tr:first td:eq(0) select").focus();
	    }
		else{
		    //Events triggered in case of Goods.
		if ($("#additem input:radio:checked").val()=='7'){
		    if ($("#godownpresence").val()==0) {
			$("#openingstock").focus().select();
		    }
		    else
		    {
			//If godownflag is hidden, i.e when user is godownkeeper focus shifts to godown name.
			if ($("#godownflag").is(":hidden")) {
			    $(".godown_name:first").focus();
			}
			//Else it shifts to godown flag.
			else{
			    $("#godownflag").focus().select();
			}
		    }
		    //If inventory is not enabled focus 
		    if(sessionStorage.invflag==0){
			$("#apsubmit").focus();
		    }
		}
		    //In case of Service focus shifts to Save button.
		else{
		    $("#apsubmit").focus();
		}
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
	    var gstRate = ["5.00","12.00","18.00","28.00"];
        $('#product_tax_table tbody tr').remove();
          for (tax of resp["gkresult"]) {
            $('#product_tax_table tbody').append(taxfieldhtml);
	    $('#product_tax_table tbody tr:last td:eq(3) span').hide('.glyphicon-plus');
	    $('#product_tax_table tbody tr:last').attr({value: tax["taxid"]});
            $('#product_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
            $('#product_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
	      if(tax["taxname"] == "IGST"){
		  let count = 0;
		    for(let a in gstRate){
			if(tax["taxrate"] == gstRate[a]) {
			    count = count+1;
			}
		    }
		    if(count == 0){
			$("#gstrateEdit").show();
		    }else{
			$("#gstrateEdit").hide();
		    }
		  var new_gst = Math.floor(tax["taxrate"]);//Round up the number
		  $("#product_tax_table tbody tr:last td:eq(2) select").val(new_gst);
	    }else{ 
		$('#product_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);
	    }
        }
	  $('#product_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	  $(".tax_name").change();

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
      $('#product_tax_table tbody').append(taxfieldhtml);
      $('#product_tax_table tbody tr:last').attr({value: "New"});
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
          $("#saleprice").focus();
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
  else if (($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val() =='CVAT' || $("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val() =='CESS') && event.which==13 ) {
      event.preventDefault();
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
  }
  else if (($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val() =='IGST') && event.which==13 ) {
      event.preventDefault();
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) select').focus();
  } 
  else if (event.which==13) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
  }
  else if (event.which==27) {
    event.preventDefault();
    if ($("#additem input:radio:checked").val()=='7'){

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
    $(document).off("change",".tax_name").on("change",".tax_name",function(event){
        var curindex = $(this).closest('tr').index();
	if (!($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='IGST')){
	    $('#product_tax_table tbody tr:eq('+ curindex +') td:eq(2) input').show('.tax_rate_all');
	    $('#product_tax_table tbody tr:eq('+ curindex +') td:eq(2) select').hide('.tax_rate_gst');
	} else if($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='IGST') {
	    $('#product_tax_table tbody tr:eq('+ curindex +') td:eq(2) select').show('.tax_rate_gst');
	    $('#product_tax_table tbody tr:eq('+ curindex +') td:eq(2) input').hide('.tax_rate_all');
	}
        if ($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
            $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
            $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').prop("disabled", false);
            $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append(stateshtml);
            $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select option:visible").first().prop("selected", true);
        }
        else {
            $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
            $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').prop("disabled", true);
            $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
        }
        var previndex = curindex -1;
        for (let j = 0; j < curindex + 1; j++) {
            if ($("#product_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val() == "VAT") {
                var selectedtaxstate = $("#product_tax_table tbody tr:eq("+j+") td:eq(1) select option:selected").attr("stateid");
                for (let i=j+1; i<=curindex+1;i++){
                    $('#product_tax_table tbody tr:eq('+i+') td:eq(1) select option[stateid='+selectedtaxstate+']').remove();
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

    //click event for '+'(add button) in 'Tax' Table. 
    $(document).off("click",".addbtn").on("click", ".addbtn", function(event) {
	var curindex_btn = $(this).closest('tr').index();
	var nextindex_btn = curindex_btn+1;
	var previndex_btn = curindex_btn-1;
	if ($('#product_tax_table tbody tr:eq('+curindex_btn+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
	    $("#tax_state-blank-alert").alert();
	    $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#tax_state-blank-alert").hide();
	    });
	    return false;
	}
	if (curindex_btn != ($("#product_tax_table tbody tr").length-1)) {
	    $('#product_tax_table tbody tr:eq('+nextindex_btn+') td:eq(0) select').focus().select();
	}
	else {
	    if ($('#product_tax_table tbody tr:eq('+curindex_btn+') td:eq(0) select').val()==null) {
		$("#tax-name-blank-alert").alert();
		$("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-name-blank-alert").hide();
		});
		$('#product_tax_table tbody tr:eq('+curindex_btn+') td:eq(0) select').focus();
		return false;
	    }
	    if (!$.isNumeric($('#product_tax_table tbody tr:eq('+curindex_btn+') td:eq(2) input').val())) {
		$("#tax-rate-blank-alert").alert();
		$("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-rate-blank-alert").hide();
		});
		$('#product_tax_table tbody tr:eq('+curindex_btn+') td:eq(2) input').focus();
		return false;
	    }
	}
	if (curindex_btn == ($("#product_tax_table tbody tr").length-1)) {
	    $('#product_tax_table tbody').append(taxfieldhtml);
	    $('#product_tax_table tbody tr:eq('+curindex_btn+') td:eq(3) span').hide('.glyphicon-plus');
	    $('#product_tax_table tbody tr:eq('+nextindex_btn+') td:eq(0) select').focus().select();
	}
	//selected tax name removed from list except 'VAT'.
	for (let j = 0; j < curindex_btn + 1; j++) {
            var selectedtax = $("#product_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
            if (selectedtax != "VAT") {
                for (let i=j+1; i<=curindex_btn+1;i++){
                    $('#product_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
                }
            }
        }
	$(".tax_name:last").change();
    });

//Keydown event for tax_rate select box for "GST" tax name.
    $(document).off("keydown",".tax_rate_gst").on("keydown",".tax_rate_gst",function(event){
	var curindex1 = $(this).closest('tr').index();
	var nextindex1 = curindex1+1;
	var previndex1 = curindex1-1;
	//$(".tax_rate_all").trigger({type:'keydown',which:'13'});
	if (event.which==13) {
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
	    } else {
		if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()==null) {
		    $("#tax-name-blank-alert").alert();
		    $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#tax-name-blank-alert").hide();
		    });
		    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
		    return false;
		}
		if (!$.isNumeric($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val())) {
		    $("#tax-rate-blank-alert").alert();
		    $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#tax-rate-blank-alert").hide();
		    });
		    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
		    return false;
		}
		$('#product_tax_table tbody').append(taxfieldhtml);
		$('#product_tax_table tbody tr:eq('+curindex1+') td:eq(3) span').hide('.glyphicon-plus');
		//$(".tax_rate_all").numeric();
		for (let j = 0; j < curindex1 + 1; j++) {
		    var selectedtax = $("#product_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
		    if (selectedtax != "VAT") {
			for (let i=j+1; i<=curindex1+1;i++){
			    $('#product_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
			}
		    }
		}
		$(".tax_name:last").change();
		$('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
	    }
	}
	else if(event.which==190 && event.shiftKey){
	    event.preventDefault();
	    $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
	}
	else if (event.which==188 && event.shiftKey) {
	    if(previndex1>-1) {
		event.preventDefault();
		$('#product_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus().select();
	    }
	} else if (event.ctrlKey && event.which==188) {
	    event.preventDefault();
	    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
	}
	else if (event.which==190 && event.ctrlKey) {
	    event.preventDefault();
	    $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
	}
	else if (event.which==27) {
	    event.preventDefault();
	    if($("#additem input:radio:checked").val()=='19'){
		$("#apsubmit").focus();
	    }
	    else{
		if ($("#godownpresence").val()==0) {
		    $("#openingstock").focus().select();
		}
		if ($("#godownpresence").val()==1) {
		    $("#godownflag").focus().select();
		}
		if(sessionStorage.invflag==0){
		    $("#apsubmit").focus();
		}
	    }
	}

    });
    
$(document).off("keydown",".tax_rate_all").on("keydown",".tax_rate_all",function(event)
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
	  if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()==null) {
        $("#tax-name-blank-alert").alert();
        $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#tax-name-blank-alert").hide();
        });
        $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
        return false;
	  }
	  if (!$.isNumeric($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val())) {
              $("#tax-rate-blank-alert").alert();
        $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#tax-rate-blank-alert").hide();
        });
        $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
        return false;
      }
	  $('#product_tax_table tbody').append(taxfieldhtml);
	  $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(3) span').hide('.glyphicon-plus');
	$(".tax_rate_all").numeric();
        for (let j = 0; j < curindex1 + 1; j++) {
            var selectedtax = $("#product_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
            if (selectedtax != "VAT") {
                for (let i=j+1; i<=curindex1+1;i++){
                    $('#product_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
                }
            }
        }
	$(".tax_name:last").change();
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

    if($("#additem input:radio:checked").val()=='19'){
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
    if($('#product_tax_table tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
	$('#product_tax_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
    }
    if(!($('.addbtn').is(':visible'))){
	$('#product_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
    }
    $('#product_tax_table tbody tr:last td:eq(0) select').focus().select();
  });
  $('#product_tax_table tbody tr:last td:eq(0) select').select();
});
/*$(document).off('keydown', '#igstrate').on('keydown', '#igstrate',function(event) {
  if (event.which==13) {
      event.preventDefault();
      if($("#additem input:radio:checked").val()=='19'){
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
    else if (event.which == 38) {
	event.preventDefault();
	if($("#additem input:radio:checked").val()=='19'){
    $("#hsnno").focus();
	}
	else {
	    $("#adduom").focus();
	}
    }
}); */
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
  else 	if(event.which==27){
	 event.preventDefault();
	 $("#apsubmit").focus().select();
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

// Key Up event for godown name.
$(document).off("keyup",".godown_name").on("keyup",".godown_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
    var previndex = curindex-1;
    //Events that are triggered when Shift Key and '<' key are triggered.
  if (event.which==188 && event.shiftKey)
  {
      if (curindex==0) {
	  //When godownflag is hidden focus shifts to adduom.
	  if($("#godownflag").is(":hidden")){
	      $("#adduom").focus();
	  }
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

    //click event for '+'(add button) in 'Godown Table'. 
    $(document).off("click",".goaddbtn").on("click", ".goaddbtn", function(event) {
	var curindex_gobtn = $(this).closest('tr').index();
	var nextindex_gobtn = curindex_gobtn+1;
	var selectedgodown = $('#godown_ob_table tbody tr:eq('+curindex_gobtn+') td:eq(0) select option:selected').val();
	var numberofgodowns = $('#godown_ob_table tbody tr:eq('+curindex_gobtn+') td:eq(0) select option:not(:hidden)').length-1 ;
	if (curindex_gobtn != ($("#godown_ob_table tbody tr").length-1)) {
	    $('#godown_ob_table tbody tr:eq('+nextindex_gobtn+') td:eq(0) select').focus().select();
	}
	else {
	    if (numberofgodowns >= 0 ) {
		if ($('#godown_ob_table tbody tr:eq('+curindex_gobtn+') td:eq(0) select option:selected').val()=="") {
		    $("#godown-blank-alert").alert();
		    $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#godown-blank-alert").hide();
		    });
		    $('#godown_ob_table tbody tr:eq('+curindex_gobtn+') td:eq(0) select').focus();
		    return false;
		}
		if ($('#godown_ob_table tbody tr:eq('+curindex_gobtn+') td:eq(1) input').val()=="") {
		    $("#os-blank-alert").alert();
		    $("#os-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#os-blank-alert").hide();
		    });
		    $('#godown_ob_table tbody tr:eq('+curindex_gobtn+') td:eq(1) input').focus();
		    return false;
		}
		if(numberofgodowns > 0){
		    $('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
		    $('#godown_ob_table tbody tr:eq('+curindex_gobtn+') td:eq(2) span').hide('.glyphicon-plus');
		}else{
		    $("#apsubmit").focus();
		}
		$(".godown_ob").numeric();
		//selected godowns are removed from list.
		$('#godown_ob_table tbody tr:eq('+nextindex_gobtn+') td:eq(0) select option[value='+selectedgodown+']').prop('hidden', true).prop('disabled', true);
		$('#godown_ob_table tbody tr:eq('+nextindex_gobtn+') td:eq(0) select option[value=""]').prop('selected', true);
		$('#godown_ob_table tbody tr:eq('+nextindex_gobtn+') td:eq(0) select').focus().select();
	    }
	    else {
		$("#apsubmit").focus();
	    }
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
      if (numberofgodowns >= 0) {
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
	if(numberofgodowns > 0){
            $('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	    $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(2) span').hide('.glyphicon-plus');  
	}else{
	    $("#apsubmit").focus();
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
    if($('#godown_ob_table tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
	$('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
    }
    if(!($('.goaddbtn').is(':visible'))){
	$('#godown_ob_table tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus goaddbtn"></span></div>');
    }
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
	      data: {"gbflag":7},
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
/* -----------------------AddStock Key events start here----------------------------------------- */
    /*For rendering of addstock popup window*/
    $('#addstockmodal').on('shown.bs.modal', function() {
	$.ajax({
	    url: '/product?type=stkmodal&tax=gst',
            type: "POST",
            datatype: 'text/html',
            global: false,
            async: false,
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
	})
	    .done(function(resp) {
		$('#gststkmodal').html(resp);
		stkhtml = $('#stocktable tbody tr:first').html();
		$("#godown_name").focus();/*For shifting focus of addstock button to select godown button of pop up window*/
		$("#godown_name").val("").focus();
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
            });

        $(document).off("change",".prodstock").on("change", '.prodstock', function(event) {
	let curindex= $(this).closest('tr').index();
	$.ajax({
      url: '/product?type=hsnuom',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
	     data: {"productcode": $(this).val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp)   /*This function will return spec name of the product*/
	  {
	      	      
	      $('.unitname:eq('+ curindex +')').text(resp.gkresult.unitname);
	      $('.add_product_hsncode:eq('+ curindex +')').html(resp.gkresult.gscode);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    });

    $(document).off("click","#stock_done").on("click", '#stock_done', function(event) {
	var gobj = {};
	var stockallow = 1;
	 if ($.trim($("#godown_name").val())=="") {
		stockallow = 0;
		$("#emptygodownalert").alert();
  	        $("#emptygodownalert").fadeTo(2250, 500).slideUp(500, function(){
  	          $("#emptygodownalert").hide();
  	        });
  	        $("#godown_name").focus();
  	     return false;
	 }
	$("#stocktable tbody tr").each(function(){
	    if ($.trim($(".prodstock",this).val())=="") {
		stockallow = 0;
		$("#emptyproductalert").alert();
  	        $("#emptyproductalert").fadeTo(2250, 500).slideUp(500, function(){
  	          $("#emptyproductalert").hide();
  	        });
  	        $(".prodstock",this).focus();
  	        return false;
  	    }
	    if ($.trim($(".open_stock",this).val())=="") {
		stockallow = 0;
		$("#emptyopstkalert").alert();
  	        $("#emptyopstkalert").fadeTo(2250, 500).slideUp(500, function(){
  	          $("#emptyopstkalert").hide();
  	        });
  	        $(".open_stock",this).focus();
  	        return false;
  	      }
	    if ($.trim($(".prodstock",this).val())!="") {
		if ($.trim($(".open_stock",this).val())!="" ) {
		    gobj[$(".prodstock",this).val()] = $(".open_stock",this).val(); 
		}
	    }
	    
	});
	var goid=$("#godown_name option:selected").attr("value");
	if (stockallow == 1){
	    $.ajax({
            type: "POST",
            url: "/product?type=stockproduct",
            global: false,
            async: false,
            datatype: "json",
            data: {"goid":goid, "productdetails":JSON.stringify(gobj)},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                $("#stocksuccess").alert();
                $("#stocksuccess").fadeTo(2250, 500).slideUp(500, function(){
                    $("#stocksuccess").hide();
		    $("#gststkmodal").html("");/*To refresh the modal after saving one or more selected products*/
            /*For the rendering of modal after refreshing it*/
		    $.ajax({
			url: '/product?type=stkmodal&tax=gst',
                        type: "POST",
                        datatype: 'text/html',
                        global: false,
                        async: false,
			beforeSend: function(xhr)
			{
			    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			}
		    })
			.done(function(resp) {
	         	$('#gststkmodal').html(resp);
		        stkhtml = $('#stocktable tbody tr:first').html();
		        $("#godown_name").focus();/*For shifting focus of addstock button to select godown button of pop up window*/
		            $("#godown_name").val("").focus();
			})
			.fail(function() {
			    console.log("error");
			})
			.always(function() {
			    console.log("complete");
			});
		});
              }
		else if(resp["gkstatus"]==1)
		{
		        $("#uniquestockalert").alert();
                        $("#uniquestockalert").fadeTo(2250, 500).slideUp(500, function(){
			$("#uniquestockalert").hide();
			});
		    $("#openingstock").focus().select();
		}
              else
              {
                $("#failure-alert").alert();
                $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#failure-alert").hide();
                });
                $("#godownname").focus().select();
              }
            }

          });
	}
    });


/*Event for deleting a particular row*/    
    $(document).off("click",".product_del").on("click", ".product_del", function() {
	$(this).closest('tr').fadeOut(200, function(){
	    $(this).closest('tr').remove();//closest method gives the closest element specified
	    if($('#stocktable tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
		$('#stocktable tbody').append('<tr>'+stkhtml+'</tr>');
	    }
	    $('#stocktable tbody tr:last td:eq(0) select').focus().select();
	});
	$('#stocktable tbody tr:last td:eq(0) select').select();
    });

    $(document).off("keydown", "#godown_name").on("keydown", "#godown_name", function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $(".prodstock:first").focus().select();
        }

    });

    /*Event for validation of shifting focus*/

    $(document).off("keydown", ".prodstock").on("keydown", ".prodstock", function(event) {
    let curindex = $(this).closest('tr').index();
    let nextindex = curindex + 1;
	let previndex = curindex - 1;
	if (event.which == 13) {
	    event.preventDefault();
	    $('.open_stock:eq('+ curindex +')').focus().select();
	}
	return false;
    });

    
    $(document).off("keydown", ".open_stock").on("keydown", ".open_stock", function(event) {
	let curindex = $(this).closest('tr').index();
	var selectedpro = $('#stocktable tbody tr:eq('+curindex+') td:eq(0) select option:selected').val();
	let nextindex = curindex + 1;
	let previndex = curindex - 1;
	if (event.which == 13){
	    event.preventDefault();
	    if (selectedpro==""){
		$("#product-name-blank-alert").alert();
		$("#product-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#product-name-blank-alert").hide();
		});
		return false;
	    }
	    $('#stocktable tbody').append('<tr>' + $(this).closest('tr').html() + '</tr>');
	    	 $('#stocktable tbody tr:eq('+nextindex+') td:eq(0) select option[value='+selectedpro+']').prop('hidden', true).prop('disabled', true);
	    $('#stocktable tbody tr:eq('+nextindex+') td:eq(0) select option[value=""]').prop('selected', true);
	    $('#stocktable tbody tr:eq('+nextindex+') td:eq(1) label').text("");
	    $('.prodstock:eq('+ nextindex +')').focus().select();
	}
  });


    var saveflag = 1;
$(document).off("click","#apsubmit").on("click", '#apsubmit', function(event) {
  event.preventDefault();
    /* Act on the event */
    
if($("#additem input:radio:checked").val()=='7'){
  if ($("#addproddesc").val()=="")
  {
    $("#product-name-blank-alert").alert();
    $("#product-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#product-name-blank-alert").hide();
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
    if(parseInt($("#hsnno").val()) <= 0)
           {
               $("#hsnno-must-be-positive").alert();
               $("#hsnno-must-be-positive").fadeTo(2250, 500).slideUp(500, function(){
                   $("#hsnno-must-be-positive").hide();
                   $("#hsnno").focus().select();
               });
               return false;
           }
    
  if ($("#adduom option:selected").val()=="")
  {
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
    $("#service-name-blank-alert").alert();
    $("#service-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#service-name-blank-alert").hide();
    });
    $("#addproddesc").focus();
    $("#addproddesc").select();
    return false;
  }
  if($("#hsnno").val()==""){

      $("#serviceno-blank-alert").alert();
      $("#serviceno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#serviceno-blank-alert").hide();
    });
      $("#hsnno").focus();
      return false;
  }
}

    if ($("#openingstock").val()=="")
  {
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
	if (specyear!="" && specmonth!="" && specday!="") {
	    $(".spec_value",this).val(specdate); // Storing spec date in hidden filed
	  }
	  else{
	      $(".spec_value",this).val("");
	  }
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
	if($("td:eq(0) select option:selected", this).val() == 'IGST'){
	    obj.taxrate = $.trim($("td:eq(2) select option:selected", this).val());
	} else {
	    obj.taxrate = $.trim($("input", this).val());
	}
        taxes.push(obj);
    }

  });
    if(taxes.length == '0' && $("#product_tax_table").length > 0){
	if($("#additem input:radio:checked").val() == 7){
	    $("#tax-alert").alert();
            $("#tax-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#tax-alert").hide();
            });
            return false;
	}
	else {
	    $("#tax-service-alert").alert();
            $("#tax-service-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#tax-service-alert").hide();
            });
            return false;
	}
    }

  var gobj = {}; // Creating a dictionary for storing godown wise opening stock
  $("#godown_ob_table tbody tr").each(function(){
    if ($.trim($(".godown_name",this).val())!="") {
	if ($.trim($(".godown_ob",this).val())!="" ) {
        gobj[$(".godown_name",this).val()] = $(".godown_ob",this).val(); //Godown id is key and opening stock is value
      }
    }
  });

  var  addformdata = $("#addprodform").serializeArray();


  addformdata.push({name: "gscode", value: $("#hsnno").val()});
  addformdata.push({name:"gsflag", value: $("#additem input:radio:checked").val()});
  addformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
  addformdata.push({name: 'specs', value: JSON.stringify(specs)});
  if ($("#godownflag").val() == 1) {
    addformdata.push({name: 'godowns', value: JSON.stringify(gobj)}); //Pushing taxes and specs into addformdata

  }
  if (saveflag == 1) {
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
      }).done(function(resp) {
          if (resp["gkstatus"] ==0) {
              saveflag = 0;
	if ($("#additem input:radio:checked").val() == 7) {
	    $("#addproduct-success-alert").alert();
	    $("#addproduct-success-alert").fadeTo(2250, 500).slideUp(500, function(){
		if (parseInt($("#extrabuttons").val()) == 1) {
                    $('.modal-backdrop').remove();
                    if(sessionStorage.invflag==1){
		        $("#product").click();
		    }
		    else{
		        $("#productinmaster").click();
		    }
                }
                else{
                    $("#selectedproductid").val(resp.gkresult);
                    $("#addproductmodal").modal("hide");
                    $('.modal-backdrop').remove();
                }
		$("#addproduct-success-alert").hide();
	    });
	}
	else {
	    $("#addservice-success-alert").alert();
	    $("#addservice-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                if (parseInt($("#extrabuttons").val()) == 1) {
                    $('.modal-backdrop').remove();
                    if(sessionStorage.invflag==0){
		    $("#product").click();
		    }
		    else{
		        $("#productinmaster").click();
		    }
                }
                else{
                    $("#selectedproductid").val(resp.gkresult);
                    $("#addproductmodal").modal("hide");
                    $('.modal-backdrop').remove();
                }
		$("#addservice-success-alert").hide();
	    });
	}
    }
    else if (resp["gkstatus"] ==1)
    {   
	if ($("#additem input:radio:checked").val() == 7){
            if (parseInt($("#extrabuttons").val()) == 1) {
                $('.modal-backdrop').remove();
                $("#duplicateproducterror-alert").alert();
                $("#duplicateproducterror-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#duplicateproducterror-alert").hide();
                });
	    }
            else {
                $("#addproductmodal").find("#duplicateproducterror-alert").alert();
                $("#addproductmodal").find("#duplicateproducterror-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#addproductmodal").find("#duplicateproducterror-alert").hide();
                });
            }
            $("#addproddesc").focus();
	    $("#addproddesc").select();
            return false;
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
  }
  event.stopPropagation();
});

$(document).on('click', '#apreset', function(event) {
  event.preventDefault();
  /* Act on the event */
    if ($("#extrabuttons").val() == 1) {
        $("#addproduct").click();
    }
    else {
        $("#addproductmodal").find("input:not(:hidden), select:not(:hidden, #additem)").val("");
    }
});
    /*code for reseting the fields*/
$(document).on('click', '#stockreset', function(event) {
  event.preventDefault();
    $("#stocktable tbody").html("");
    $('#stocktable tbody').append('<tr>'+stkhtml+'</tr>');
    $("#godown_name").val("").focus();
});
});
