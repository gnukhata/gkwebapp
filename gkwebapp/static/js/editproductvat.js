/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.
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
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Prajkta Patkar" <prajkta@riseup.net>
"Aditya Shukla" <adityashukla9158.as@gmail.com>
*/

$(document).ready(function() {
    
    $('.modal-backdrop').remove();
    var specday;
    var specmonth;
    var specyear;
    var specdate;
    var selectedgodown;
    var selectedtaxname;
    var selectedtaxstate;
    var taxhtml = $('#product_edit_tax_table tbody tr:first').html();
    $("#prodselect").focus();
    var oldtaxes;
    //Function to check duplicate 'CVAT' tax.
    function duplicatecvat(curindex){
	var types = [];
	$('#product_edit_tax_table tbody tr').each(function(){
	    if ($(".tax_name",this).val()=='CVAT') {
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
	return duplicatetypes;
    }
    
    //Function to check duplicate 'states' addded for 'VAT' tax.
    function duplicatestate(curindex){
	var edittaxstates = [];
	$('#product_edit_tax_table tbody tr').each(function(){
	    var c_index = $(this).closest('tr').index();
	    if($('#product_edit_tax_table tbody tr:eq('+c_index+') td:eq(1) option:selected').val() != ""){
		edittaxstates.push($('#product_edit_tax_table tbody tr:eq('+c_index+') td:eq(1) option:selected').val());
	    }
	});
	if (edittaxstates.length>0) {
            edittaxstates.sort();
            var duplicatestates = [];
            for (var i = 0; i < edittaxstates.length - 1; i++) {
		if (edittaxstates[i+1] == edittaxstates[i]) {
		    duplicatestates.push(edittaxstates[i]);
		}
            }
	}
	return duplicatestates;
    }
    
    $("#prodselect").keydown(function(e){
    if (e.which == 13) {
	e.preventDefault();
	if ($.trim($("#prodselect").val())=="") {
            $("#blank-alert").alert();
            $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
		$("#blank-alert").hide();
            });
            $("#prodselect").focus();
            return false;
        }
	else {
	    $(".product_tax_disable").prop('disabled',true);
	    $(".product_cat_tax_disable").prop('disabled',true);
    
	    $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
		event.preventDefault();
		/* Act on the event */
		$(".numtype").numeric();
	    });
	}
    }
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

  $(document).off('keydown', '#edituom').on('keydown', '#edituom', function(e){
    if (e.which == 13) {
      e.preventDefault();
      $("#maxprice").focus();
    }
    if (e.which == 38) {
	e.preventDefault();
	if ($("#editcatselect").length < 1 || ($("#editcatselect").is(':disabled'))) {
          $("#editproddesc").focus();
      }
      else {
        $("#editcatselect").focus();
      }
    }
  
    
  });
    $(document).off('keydown', '#maxprice').on('keydown', '#maxprice', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    $("#saleprice").focus();
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#edituom").focus();
	}
    });
    $(document).off('keydown', '#saleprice').on('keydown', '#saleprice', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    event.preventDefault();
	    $("#amountdiscount").focus();
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#maxprice").focus();
	}
    });
  
  $(document).off('keydown', '#amountdiscount').on('keydown', '#amountdiscount', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    event.preventDefault();
	    $("#percentdiscount").focus();
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#saleprice").focus();
	}
    });
  
    $(document).off('keydown', '#percentdiscount').on('keydown', '#percentdiscount', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#numberofspecs").val() > 0) {
		$("#spec_table tbody tr:first td:eq(1) input:first").focus();
	    }
	    else {
		if ($('#product_edit_tax_table').length > 0) {
		    $('#product_edit_tax_table tbody tr:first td:eq(0) select').focus();
		}
		else {
		    $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus();  
		}
	    }
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#maxprice").focus();
	}
    });
  $(document).off('keydown', '#editgodownflag').on('keydown', '#editgodownflag', function(e){
    if (e.which == 13) {
	e.preventDefault();
	if ($(this).is(":checked")) {
	    $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus();
	}else{
	    $('#editopeningstock').focus();
	}
    }
    if (e.which == 38) {
      $('#product_edit_tax_table tbody tr:last td:eq(2) input').focus();
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

  $("#prodselect").keydown(function(event) {
    if (event.which==13) {
      $("#editproddesc").focus().select();
          }
  });
  $(document).on('keydown', '#editproddesc', function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($("#editproddesc").val()=="") {
	    $("#pro-blank-alert").alert();
	    $("#pro-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		      $("#pro-blank-alert").hide();
		  });
	    $("#editproddesc").focus();
	}
	else{
	    if ($("#editcatselect").length < 1) {
		$("#edituom").focus();
	    }
	    else if ($("#editcatselect").is(':disabled')) {
		$("#edituom").focus();
	    }
	    else {
		$("#editcatselect").focus();
	    }
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#prodselect").focus();
    }
  });

  $(document).on('keydown', '#editopeningstock', function(event) {
    if (event.which==13)
    {
      event.preventDefault();
      $('#epsubmit').click();

    }
    else if (event.which==173) {
      event.preventDefault();
    }
    else if (event.which==27) {
	event.preventDefault();
	$("#epsubmit").focus().select();
    }else if(event.which == 38){
	event.preventDefault();
	$("#editgodownflag").focus();
    }
    /* Act on the event */
  });

  $(document).on('keydown', '.editgodown_ob', function(event){
    if (event.which == 13) {
      var n = $(".editgodown_ob").index(this);
      var m = n+1;
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

  $("#prodselect").change(function(event) {
    /* Act on the event */
    prodcode= $("#prodselect option:selected").val();
      $.ajax({
        url: '/product?type=detailsvat',
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
        $("#unitaddon").html($("#edituom option:selected").attr('uname'));
        $(".pbutn").show();
        $("#epsubmit").hide();
        $("#addgodown").hide();
        $("#epedit").show();
        $('#proddetails').find('input, textarea, button, select').prop('disabled',true);
        $(".product_tax_disable").prop('disabled',true);
        $(".product_cat_tax_disable").prop('disabled',true);
        catcode= $("#editcatselect option:selected").val();
        $(".specdate").autotab('number');
        $(".specdate").numeric();
    if(sessionStorage.invflag==0){
  $("#noinventory").hide();
    $("#taxhelp3").hide();
    $("#taxhelp4").show();
  
  }
	  
	  console.log("success");
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
          if (resp["gkresult"].length > 0) {
	      oldtaxes = resp["gkresult"]; 
	      taxhtml = $('#product_edit_tax_table tbody tr:first').html();
	      var stateshtml = $('#product_edit_tax_table tbody tr:first td:eq(1) select').html();
              $('#product_edit_tax_table tbody tr:first').remove();
              for (tax of resp["gkresult"]) {
              $('#product_edit_tax_table tbody').append('<tr value="'+tax["taxid"]+'">'+ taxhtml + '</tr>');
	      $(".product_tax_disable").prop('disabled',true);
	      $(".tax_del").prop('disabled',true);
              $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
              $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
	      $('#product_edit_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);
              }
	      $('#product_edit_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	      $('#editgodown_ob_table tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus goaddbtn"></span></div>');
	      $('.addbtn').prop('disabled',true);
	      $('.goaddbtn').prop('disabled',true);
      }
        existingnonetax = resp["gkresult"];
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      category = $("#editcatselect option:selected").val();
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

  $(document).off("shown.bs.collapse","#moresmall").on("shown.bs.collapse","#moresmall",function(event) {
    event.preventDefault();
    $("#smalllink").html('See less. <span class="glyphicon glyphicon-triangle-top"></span>');
  });
  $(document).off("hidden.bs.collapse","#moresmall").on("hidden.bs.collapse","#moresmall",function(event) {
    event.preventDefault();
    $("#smalllink").html('See more. <span class="glyphicon glyphicon-triangle-bottom"></span>');
  });

  $(document).on("change","#editcatselect",function(event) {
    /* Act on the event */

     catcode= $("#editcatselect option:selected").val();

     if (catcode!=""){
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
              $('#product_edit_tax_table tbody tr').remove();
              for (tax of resp["gkresult"]) {
		  $('#product_edit_tax_table tbody').append('<tr value="new">'+ taxhtml + '</tr>');
		  $('#product_edit_tax_table tbody tr:last td:eq(3) span').hide('.glyphicon-plus');  
		  $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
		  $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
		  if(tax["taxname"] == 'CVAT'){
		      $('.tax_name, .tax_rate').prop('disabled',false);
		  }else{
		      $('.tax_name, .tax_rate, .tax_state').prop('disabled',false);
		  }
		  $('#product_edit_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);  
              }
	      $('#product_edit_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	  }else{
	      $('#product_edit_tax_table tbody tr').remove();
              for (tax of oldtaxes) {
		  $('#product_edit_tax_table tbody').append('<tr value="'+tax["taxid"]+'">'+ taxhtml + '</tr>');
		  $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
		  $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
		  $('#product_edit_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);
		  if(tax["taxname"] == 'CVAT'){
		      $('.tax_name, .tax_rate').prop('disabled',false);
		  }else{
		      $('.product_tax_disable').prop('disabled',false);
		  }
              }
	      $('#product_edit_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	      $('#editgodown_ob_table tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus goaddbtn"></span></div>');
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
      .done(function(resp)
      {
        $('#extsp').show();
        $('#extsp').html(resp);
        $(".specdate").autotab('number');
        $(".specdate").numeric();
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    }
    else {
      $('#extsp').hide();
      $("#numberofspecs").val("0");
      $("#nocategory-alert").alert();
      $("#nocategory-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#nocategory-alert").hide();
      });

	$('#product_edit_tax_table tbody tr').remove();
        for (tax of oldtaxes) {
            $('#product_edit_tax_table tbody').append('<tr value="'+tax["taxid"]+'">'+ taxhtml + '</tr>');
            $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
            $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
	    $('#product_edit_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);
	    if(tax["taxname"] == 'CVAT'){
		$('.tax_name, .tax_rate').prop('disabled',false);
	    }else{
		$('.product_tax_disable').prop('disabled',false);
	    }
        }
	$('#product_edit_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	$('#editgodown_ob_table tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus goaddbtn"></span></div>');
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
      $("#unitaddon").html($("#edituom option:selected").attr('uname'));
    }
  });

  $(document).on('focus', '#editopeningstock',function(event) {
    if ($("#edituom option:selected").val()!='') {
      $("#unitaddon").html($("#edituom option:selected").attr('uname'));
    }
  });
  $(document).on('click', '#epedit', function(event) {
    event.preventDefault();
    /* Act on the event */
    $('#proddetails').find('input, textarea, button, select').prop('disabled',false);
    $("#epsubmit").show();
    $("#epedit").hide();
      if (sessionStorage.invflag=='1' ){
          $("#addgodown").show();
      }
    $("#editproddesc").focus();
    $("#editproddesc").select();
    
    $(".godownflag").show();
    catcode= $("#editcatselect option:selected").val();
    $(".product_cat_tax_disable").prop('disabled',false);
    $(".product_tax_disable").prop('disabled',false);
      $(".tax_del").prop('disabled',false);
      $('.addbtn').prop('disabled',false);
      $('.goaddbtn').prop('disabled',false);
      $("#product_edit_tax_table tbody tr").each(function() {
      if($('td:eq(0) select option:selected', this).val() == 'CVAT'){
        $('td:eq(1) select', this).prop('disabled', true);
      }
    });
    if ($("#editcatselect").val()!="") {
      $("#editcatselect").prop('disabled',true);
    }
    else {
      $("#editcatselectlabel").text('Select Category');
    }
  });

  $(document).off("keydown","#editcatselect").on("keydown","#editcatselect",function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($("#editcatselect option:selected").val() == "") {
        $("#nocategory-alert").alert();
        $("#nocategory-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#nocategory-alert").hide();
        });
      }
      $("#edituom").focus();
    }
    if (event.which == 38) {
      event.preventDefault();
      if($("#editcatselect option:selected").val() == ""){
        $("#editproddesc").focus().select();
      }
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
            $('#product_edit_tax_table tbody tr:eq(0) td:eq(0) select').focus();
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
            $("#edituom").focus();
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
      if (curindex==0) {
        if ($("#numberofspecs").val() > 0) {
          $('#spec_table tbody tr:last td:eq(1) input:first').focus().select();
        }
        else {
          $("#saleprice").focus();
        }
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
	  var cvat = duplicatecvat(curindex);
	  if (cvat.length > 0) {
              $("#edit_cvat-alert").alert();
              $("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#edit_cvat-alert").hide();
              });
              return false;
	  }
	  
	if ($('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) select').val()=="") {
          $("#tax-name-blank-alert").alert();
          $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-name-blank-alert").hide();
          });
          $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus();
          return false;
        }
        $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
      else if (event.which==13) {
	  event.preventDefault();
	  $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      }
      else if (event.which==27) {
	  event.preventDefault();
	  if ($("#editgodownpresence").val() == 0) {
              $("#editopeningstock").focus().select();
	  }
	  else {
              if ($("#editgodownflag").val() == 1) {
		  $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus().select();
              }
              else if ($("#editgodownflag").val() == 0) {
		  $("#editgodownflag").focus().select();
              }
	  }
      }
  });

  $(document).off("change",".tax_name").on("change",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var previndex = curindex -1;
    if ($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="" stateid="0" selected hidden disabled>Select State</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>').prop('disabled', false);
      if (curindex > 0) {
        for (var i = 1; i < curindex+1; i++) {
          for (var j = 0; j < curindex; j++) {
            if ($("#product_edit_tax_table tbody tr:eq("+i+") td:eq(0) select").val() == "CVAT") {
              i = i + 1;
            }
            selectedtaxstate = $("#product_edit_tax_table tbody tr:eq("+j+") td:eq(1) select option:selected").attr("stateid");
            $('#product_edit_tax_table tbody tr:eq('+i+') td:eq(1) select option[stateid='+selectedtaxstate+']').prop('hidden', true).prop('disabled', true);
          }
        }
      }
    }
    else {
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
      $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
    }
    selectedtaxname = $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val();
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
        var c_index = $(this).closest('tr').index();
	if($('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select option:selected').val()!=""){
	var states = duplicatestate(c_index);
	if (states.length > 0) {
	    $("#tax-same-alert").alert();
	    $("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#tax-same-alert").hide();
	    });
	    return false;
	}
	}
	$('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
  });

    //click event for '+' button in tax table.
    $(document).off("click",".addbtn").on("click",".addbtn",function(event){
	var curindex_addbtn = $(this).closest('tr').index();
	var nextindex_addbtn = curindex_addbtn+1;
	var previndex_addbtn = curindex_addbtn-1;

	if ($('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
	    $("#tax_state-blank-alert").alert();
	    $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#tax_state-blank-alert").hide();
	    });
	    $('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select').focus();
	    return false;
	}
	
	if (curindex_addbtn != ($("#product_edit_tax_table tbody tr").length-1)) {
            $('#product_edit_tax_table tbody tr:eq('+nextindex_addbtn+') td:eq(0) select').focus().select();
	}
	else {
	    var cvat = duplicatecvat(curindex_addbtn);
	    if (cvat.length > 0) {
		$("#edit_cvat-alert").alert();
		$("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#edit_cvat-alert").hide();
		});
		$('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(0) select').focus().select();
		return false;
	    }

	    if($('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select option:selected').val()!=""){
	    var states = duplicatestate(curindex_addbtn);
	    if (states.length > 0) {
		$("#tax-same-alert").alert();
		$("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-same-alert").hide();
		});
		$('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select').focus().select();
		return false;
            }
	    }
	    
	    if ($('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(0) select').val()=="") {
		$("#tax-name-blank-alert").alert();
		$("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-name-blank-alert").hide();
		});
		$('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(0) select').focus();
		return false;
            }
            if ($('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(2) input').val()=="") {
		$("#tax-rate-blank-alert").alert();
		$("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-rate-blank-alert").hide();
		});
		$('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(2) input').focus();
		return false;
            }

	    $('#product_edit_tax_table tbody').append('<tr value="new">'+ taxhtml + '</tr>');
	    $('#product_edit_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(3) span').hide('.glyphicon-plus');
	    $('#product_edit_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	    $(".product_tax_disable").prop('disabled',false);
            $(".tax_rate").numeric();
	    //selected tax name removed from list except 'VAT'. 
	    for (let j = 0; j < curindex_addbtn + 1; j++) {
                var selectedtax = $("#product_edit_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
                if (selectedtax != "VAT") {
                    for (let i=j+1; i<=curindex_addbtn+1;i++){
                        $('#product_edit_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
                    }
                }
            }
            $(".tax_name:last").change();
	    $('#product_edit_tax_table tbody tr:eq('+nextindex_addbtn+') td:eq(0) select').focus().select();
	}
    });

  $(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
	event.preventDefault();
	if($(this).val()==""){
	    $(this).val(0);
	}
      if($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()!=""){
      if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
        $("#tax_state-blank-alert").alert();
        $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#tax_state-blank-alert").hide();
        });
	  $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
          return false;
      }
      }
	
	var cvat = duplicatecvat(curindex1);
	if (cvat.length > 0) {
            $("#edit_cvat-alert").alert();
            $("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#edit_cvat-alert").hide();
            });
            return false;
	}

	if($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) select option:selected').val()!=""){
	var states = duplicatestate(curindex1);
	if (states.length > 0) {
	    $("#tax-same-alert").alert();
	    $("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#tax-same-alert").hide();
	    });
	    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus().select();
	    return false;
	}
	}
	if($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) option:selected').val()=="" && $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) option:selected').val()=="" && $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()==0.00){
	    if($("#editgodown_ob_table").is(":visible")){
		$('#editgodown_ob_table tbody tr:first td:eq(0) select').focus().select();
	    }
	    else if($("#editgodownflag").is(":visible")){
		$("#editgodownflag").focus().select();
	    }else{
		$("#editopeningstock").focus();
	    }
	}	
	else if (curindex1 != ($("#product_edit_tax_table tbody tr").length-1)) {
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
        if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="" || $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val() == 0.00) {
          $("#tax-rate-blank-alert").alert();
          $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax-rate-blank-alert").hide();
          });
          $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
          return false;
        }
          $('#product_edit_tax_table tbody').append('<tr value="new">'+ taxhtml + '</tr>');
	  $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(3) span').hide('.glyphicon-plus');
	  $('#product_edit_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	  $(".product_tax_disable").prop('disabled',false);
          $(".tax_rate").numeric();
	  for (let j = 0; j < curindex1 + 1; j++) {
              var selectedtax = $("#product_edit_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
              if (selectedtax != "VAT") {
                  for (let i=j+1; i<=curindex1+1; i++){
                      $('#product_edit_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
                  }
              }
          }
	  $(".tax_name:last").change();
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
        $('#product_edit_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus();
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
    else if (event.which==27) {
      event.preventDefault();
      if ($("#editgodownpresence").val() == 0) {
        $("#editopeningstock").focus().select();
      }
      else {
        if ($("#editgodownflag").val() == 1) {
          $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus().select();
        }
        else if ($("#editgodownflag").val() == 0) {
          $("#editgodownflag").focus().select();
        }
      }
    }

  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
	$(this).closest('tr').remove();	 //closest method gives the closest element specified
	if($('#product_edit_tax_table tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
	    $('#product_edit_tax_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	}
	if(!($('.addbtn').is(':visible'))){
	    $('#product_edit_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	}
	$('#product_edit_tax_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#product_edit_tax_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */
  /* -----------------------Godown Key events start here----------------------------------------- */

  $(document).off("change",".editgodown_name").on("change",".editgodown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    selectedgodown = $('#editgodown_ob_table tbody tr:eq('+curindex+') td:eq(0) select').val();
  });

  $(document).off("keyup",".editgodown_name").on("keyup",".editgodown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==188 && event.shiftKey)
    {
      if (curindex==0) {
        if ($("#editgodownflag").is(':visible')) {
            $("#editgodownflag").focus().select();
        }
	  else {
	      if ($('#product_edit_tax_table').length > 0) {
		  $('#product_edit_tax_table tbody tr:last td:eq(2) input').focus().select();
	      }
	      else {
		  $("#edituom").focus();
	      }
	  }
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

    //click event for '+' button in godown table.
    $(document).off("click",".goaddbtn").on("click",".goaddbtn",function(event){
	var curindex_goaddbtn = $(this).closest('tr').index();
	var nextindex_goaddbtn = curindex_goaddbtn+1;
	var previndex_goaddbtn = curindex_goaddbtn-1;
	var numberofgodowns = $('#editgodown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(0) select option:not(:hidden)').length-1;

	if (curindex_goaddbtn != ($("#editgodown_ob_table tbody tr").length-1)) {
            $('#editgodown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select').focus().select();
	}
	else {
	    if (numberofgodowns >= 0 ) {
		if ($('#editgodown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(0) select').val()==null) {
		    $("#godown-blank-alert").alert();
		    $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#godown-blank-alert").hide();
		    });
		    $('#editgodown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(0) select').focus();
		    return false;
		}
		if ($('#editgodown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(1) input').val()=="") {
		    $("#os-blank-alert").alert();
		    $("#os-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#os-blank-alert").hide();
		    });
		    $('#editgodown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(1) input').focus();
		    return false;
		}
		if (numberofgodowns > 0 ) {
		$('#editgodown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
		$('#editgodown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(2) span').hide('.glyphicon-plus');
		}else{
		    $('#epsubmit').focus();
		}
		//selected godowns name are removed from list.
		for (let j = 0; j < curindex_goaddbtn+1; j++) {
		    var selectedgodown = $('#editgodown_ob_table tbody tr:eq('+j+') td:eq(0) select option:selected').val();
		    $('#editgodown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select option[value='+selectedgodown+']').prop('hidden', true).prop('disabled', true);
		}
		$('#editgodown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select').prepend('<option value="" disabled hidden selected>Select Godown</option>');
		if(numberofgodowns > curindex_goaddbtn) {
		    $('#editgodown_ob_table tbody tr:last td:last').append('<div style="text-align: center;"><a href="#" class="editgodown_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
		}
		$(".editgodown_ob").numeric();
		$('#editgodown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select').focus().select();
	    }else{
		$('#epsubmit').focus();
	    }
	}
    });
    
  $(document).off("keydown",".editgodown_ob").on("keydown",".editgodown_ob",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var selectedgodown = $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val();
    var numberofgodowns = $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#editgodown_ob_table tbody tr").length-1)) {
        $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
	  if(numberofgodowns >= 0){
	if ($('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) option:selected').val()=="") {
          $("#godown-blank-alert").alert();
          $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#godown-blank-alert").hide();
          });
          $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
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
	if(numberofgodowns > 0){
            $('#editgodown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	    $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(2) span').hide('.glyphicon-plus');
	}else{
	    $("#epsubmit").focus();
	}
	for (let j = 0; j < curindex1+1; j++) {
	    selectedgodown = $('#editgodown_ob_table tbody tr:eq('+j+') td:eq(0) select option:selected').val();
	    $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedgodown+']').prop('hidden', true).prop('disabled', true);
	}
	$('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').prepend('<option value="" disabled hidden selected>Select Godown</option>');
        if (numberofgodowns > curindex1) {
          $("#editgodown_ob_table tbody tr:last td:last").append('<div style="text-align: center;"><a href="#" class="editgodown_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
        }
        $(".editgodown_ob").numeric();
        $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
	  }else{
	      $("#epsubmit").focus();
	  }
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
      $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
    }
    else if (event.which==27) {
      event.preventDefault();
      $('#epsubmit').focus();    }
    else if (event.which==173) {
      event.preventDefault();
    }
  });
  $(document).off("click",".editgodown_del").on("click", ".editgodown_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      if($('#editgodown_ob_table tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
	  $('#editgodown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
      }
      if(!($('.goaddbtn').is(':visible'))){
	  $('#editgodown_ob_table tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus goaddbtn"></span></div>');
      }
      $('#editgodown_ob_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#editgodown_ob_table tbody tr:last td:eq(0) select').focus().select();
  });
  /* -----------------------Godown Key events end here----------------------------------------- */

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
                $("#epsubmit").click();
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
                $("#beforeaddingfirstgodown").hide();
                $("#newgodownadded").show();
                $('#editgodown_ob_table tbody tr').each(function(){
                  var curindex2 = $(this).closest('tr').index();
                for (i in newgodowns ) {
                  if (newgodowns[i].godownname == sessionStorage.newgodownname && newgodowns[i].godownaddress == sessionStorage.newgodownaddress) {
                    $('#editgodown_ob_table tbody tr:eq('+curindex2+') td:eq(0) select').append('<option value="' + newgodowns[i].godownid + '">' + newgodowns[i].godownname + '(' + newgodowns[i].godownaddress + ')</option>');
                  }
                }
                });
                if ($("#editgodownflag").val()==0) {
                  $("#editgodownflag").focus().select();
                }
                else if ($("#editgodownflag").val()==1) {
                  $('#editgodown_ob_table tbody tr:last td:eq(0) select').focus().select();
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

  $(document).off("click","#epsubmit").on("click", "#epsubmit", function(event) {
    event.preventDefault();
    var allow = 0;
    /* Act on the event */
    $("input[name=openingstock]:hidden").remove();
    if ($("#editproddesc").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#pro-blank-alert").alert();
      $("#pro-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#pro-blank-alert").hide();
      });
      $("#editproddesc").focus();
      $("#editproddesc").select();
      return false;
    }
    var specs = {};      /*This is spec dictionary having spcode as a key and specval as its value*/
    $("#spec_table tbody tr").each(function(){
      if ($(".spec_value",this).hasClass('datevalue')) {
        $(".specdate").each(function() {
          if ($(this).hasClass('specday')) {
            specday = $(this).val(); //Storing specday
          }
          if ($(this).hasClass('specmonth')) {
            specmonth = $(this).val(); //Storing specmonth
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
    var taxes = [];
    $("#product_edit_tax_table tbody tr").each(function(){
      let obj = {};
      let curindex = $(this).index();
      if($('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) select option:selected').val()!=""){	
      if ($('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
	  $("#tax_state-blank-alert").alert();
          $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#tax_state-blank-alert").hide();
          });
	  $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
	  allow = 1;
      }
	  else if ($('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').val()=="" || $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').val() == 0.00) {
              $("#tax-rate-blank-alert").alert();
              $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#tax-rate-blank-alert").hide();
              });
              $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus();
              allow = 1;
          }
      }
	var cvat = duplicatecvat(curindex);
	if (cvat.length > 0) {
	    $("#edit_cvat-alert").alert();
	    $("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#edit_cvat-alert").hide();
	    });
	    $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
	    allow = 1;
	}

	if($('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) option:selected').val()!="" && $('#product_edit_tax_table tbody tr:eq('+ curindex +') td:eq(1) select option:selected').attr("stateid") != 0){
	    var savestates = duplicatestate(curindex);
	    if (savestates.length > 0) {
		$("#tax-same-alert").alert();
		$("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-same-alert").hide();
		});
		$('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus().select();
		allow = 1;
	    }
	}
	
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
          if ($.trim($(".editgodown_ob",this).val())!="") {
          obj[$(".editgodown_name",this).val()] = $(".editgodown_ob",this).val();
        }
      }
    });
    var editformdata = $("#editprodform").serializeArray();
    editformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
    editformdata.push({name: 'specs', value: JSON.stringify(specs)});
    if ($("#editgodownflag").val() == 1) {
      editformdata.push({name: 'godowns', value: JSON.stringify(obj)});
    }
    if(allow == 0){
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
        $("#editproduct-success-alert").alert();
        $("#editproduct-success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#editproduct-success-alert").hide();
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
    }
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
		    $("#deleteproduct-success-alert").alert();
		    $("#deleteproduct-success-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#deleteproduct-success-alert").hide();
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
