/* Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation 
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

Contributors: "Bhavesh Bawadhane" <bbhavesh07@gmail.com> */

// This script is for the add addrejectionnote.jinja2
$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.rndate').autotab('number');
    $("#rejectionnote_invoice").focus();
    $("#rejectionnote_date").numeric();
    $("#rejectionnote_month").numeric();
    $("#rejectionnote_year").numeric();
    $('.rejectionnote_product_rejected_quantity').numeric({ negative: false});
    $('.numtype').numeric({ negative: false});
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var todaysdate = new Date();
    var dd = todaysdate.getDate();//yields day
    var mm = pad(todaysdate.getMonth()+1, 2); //yields month
    var yyyy = todaysdate.getFullYear(); //yields year
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g);
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g);
    var fromd = new Date(fromdatearray[0], fromdatearray[1] - 1, fromdatearray[2]);
    var tod = new Date(todatearray[0], todatearray[1] - 1, todatearray[2]);
    if (fromd <= todaysdate && tod >= todaysdate) {
	$("#rejectionnote_date").val(dd);
	$("#rejectionnote_month").val(mm);
	$("#rejectionnote_year").val(yyyy);
    } else{
	$("#rejectionnote_date").val(todatearray[2]);
	$("#rejectionnote_month").val(todatearray[1]);
	$("#rejectionnote_year").val(todatearray[0]);
    }
    function pad (str, max) { //to add leading zeros in date
	str = str.toString();
	if (str.length==1) {
	    return str.length < max ? pad("0" + str, max) : str;
	} else {
	    return str;
	}
    }
    function yearpad (str, max) { //to add leading 20 or 200 in the year
	str = str.toString();
	if (str.length==1) {
	    return str.length < max ? pad("200" + str, max) : str;
	}     else if (str.length==2) {
	    return str.length < max ? pad("20" + str, max) : str;
	} else {
	    return str;
	}
    }
    $("#rejectionnote_date").blur(function(event) {
	$(this).val(pad($(this).val(),2));
    });
    $("#rejectionnote_month").blur(function(event) {
	$(this).val(pad($(this).val(),2));
    });
    $("#rejectionnote_year").blur(function(event) {
	$(this).val(yearpad($(this).val(),4));
    });
    // events for shifting focus. Enter shifts to next element and up arrow shifts to previous
    $("#rejectionnote_invoice").keydown(function(event) {
	if (event.which==13 && $("#rejectionnote_invoice option:selected").val() == "") {
	    event.preventDefault();
	    $("#rejectionnote_deliverynote").focus();
	}
	else if(event.which==13){
	    event.preventDefault();
	    $("#rejectionnote_noteno").focus();
	}
	/*if (event.which==38 && document.getElementById('rejectionnote_invoice').selectedIndex==0) {       
	  event.preventDefault();       
	  $('#rejectionnote_year').focus().select();     
	  }*/
    });
    $("#rejectionnote_deliverynote").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    $('#rejectionnote_noteno').focus().select();
	}
	if (event.which==38 && (document.getElementById('rejectionnote_deliverynote').selectedIndex==0 || document.getElementById('rejectionnote_deliverynote').selectedIndex==1)) {
	    event.preventDefault();
	    $("#rejectionnote_invoice").focus();
	}
    });
    
    $("#rejectionnote_noteno").keydown(function(event) {
	if (event.which==13 && $("#rejectionnote_noteno").val()) {
	    event.preventDefault();
	    $("#rejectionnote_date").focus().select();
	}
	if (event.which==38) {
	    event.preventDefault();
	    $("#rejectionnote_deliverynote").focus().select();
	}
    });
    
    $("#rejectionnote_date").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    $("#rejectionnote_month").focus().select();
	}
	if (event.which==38) {
	    event.preventDefault();
	    $("#rejectionnote_noteno").focus().select();
	}
    });
    
    $("#rejectionnote_month").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    $("#rejectionnote_year").focus().select();
	}
	if (event.which==38) {
	    event.preventDefault();
	    $("#rejectionnote_date").focus().select();
	}
    });

    $("#rejectionnote_year").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    $('#rejectionnote_product_table tbody tr:first td:eq(2) input').focus().select();
	}
	if (event.which==38) {
	    event.preventDefault();
	    $("#rejectionnote_month").focus().select();
	}
    });

    $(document).off('blur', '.rejectionnote_product_rejected_quantity').on('blur', '.rejectionnote_product_rejected_quantity', function(event) {
	event.preventDefault();
	/* Act on the event */
	if ($(this).val() == "") {
	    $(this).val(parseFloat(0).toFixed(2));
	} else {
	    $(this).val(parseFloat($(this).val()).toFixed(2));
	}
    });
    //insert key press event
    $(document).off("keyup").on("keyup",function(event) {
	if(event.which == 45) {
	    event.preventDefault();
	    $("#rejectionnote_save").click();
	    return false;
	}
    });
    
    $(document).off("click", ".product_del").on("click", ".product_del", function() {
	$(this).closest('tr').remove();
	$('#rejectionnote_product_table tbody tr:eq('+$(this).closest("tr").index()+') td:eq(2) input').focus().select();
    });

    $(document).off("keydown",".rejectionnote_product_rejected_quantity").on("keydown",".rejectionnote_product_rejected_quantity",function(event) {
	if (event.which==13) {
	    event.preventDefault();
	    var qty = $('#rejectionnote_product_table tbody tr:eq('+$(this).closest("tr").index()+') td:eq(2) input').val();
	    if(qty == "" || qty == "0.00" || qty == "0"){
		$("#quantity-blank-alert").alert();
		$("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#quantity-blank-alert").hide();
		});
		return false;
	    }
	    if(parseFloat(qty) > parseFloat($('#rejectionnote_product_table tbody tr:eq('+$(this).closest("tr").index()+') td:eq(1) input').val())){
		$("#quantity-more-alert").alert();
		$("#quantity-more-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#quantity-more-alert").hide();
		});
		return false;
	    }
	    if($(this).closest("tr").is(":last-child")){
		$("#rejectionnote_save").focus();
	    }
	    else{
		var ind = $(this).closest("tr").index() + 1;
		$('#rejectionnote_product_table tbody tr:eq('+ind+') td:eq(2) input').focus().select();
	    }
	}
	if (event.which==38) {
	    event.preventDefault();
	    if($(this).closest("tr").is(":first-child")){
		$("#rejectionnote_year").focus();
	    }
	    else{
		var ind = $(this).closest("tr").index() - 1;
		$('#rejectionnote_product_table tbody tr:eq('+ind+') td:eq(2) input').focus().select();
	    }
	}
    });

    $(document).off("change", "#rejectionnote_invoice").on("change", "#rejectionnote_invoice", function(event) {
	$('#rejectionnote_product_table tbody').empty();
	$('#rejectionnote_product_table tbody').append('<tr>' +
						       '<td class="col-xs-5">' +
						       '<input class="form-control input-sm product_name" placeholder="None" disabled>' +
						       '</td>' +
						       '<td class="col-xs-3">' +
						       '<div class="input-group">' +
						       '<input type="text" class="rejectionnote_product_quantity form-control input-sm text-right" placeholder="0.00" disabled>' +
						       '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
						       '</div>' +
						       '</td>' +
						       '<td class="col-xs-3">' +
						       '<div class="input-group">' +
						       '<input type="text" class="rejectionnote_product_rejected_quantity numtype form-control input-sm text-right" value="0.00">' +
						       '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
						       '</div>' +
						       '</td>' +
						       '<td class="col-xs-1">' +
						       '</td>' +
						       '</tr>');
	if ($("#rejectionnote_invoice option:selected").val() != '') {
	    $("#rejectionnote_deliverynote option[value='']").prop("selected", true);
	    $.ajax({
		url: '/rejectionnote?action=nonrejectedinvprods',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "invid": $("#rejectionnote_invoice option:selected").val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
		.done(function(resp) {
		    if (resp["gkstatus"] == 0) {
			$('#rejectionnote_product_table tbody').empty();
			$.each(resp.items, function(key, value) {
			    $('#rejectionnote_product_table tbody').append('<tr>' +
									   '<td class="col-xs-5">' +
									   '<input class="form-control input-sm product_name" data-productcode="' + key + '" value="' + value.productdesc + '" disabled>' +
									   '</td>' +
									   '<td class="col-xs-3">' +
									   '<div class="input-group">' +
									   '<input type="text" class="rejectionnote_product_quantity form-control input-sm text-right" data="' + value.qty + '" value="' + value.qty + '" disabled>' +
									   '<span class="input-group-addon input-sm" id="unitaddon">' + value.unitname + '</span>' +
									   '</div>' +
									   '</td>' +
									   '<td class="col-xs-3">' +
									   '<div class="input-group">' +
									   '<input type="text" class="rejectionnote_product_rejected_quantity numtype form-control input-sm text-right" value="0.00">' +
									   '<span class="input-group-addon input-sm" id="unitaddon">' + value.unitname + '</span>' +
									   '</div>' +
									   '</td>' +
									   '<td class="col-xs-1">' +
									   '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
									   '</td>' +
									   '</tr>');
			    $('#rejectionnote_product_table tbody tr:eq(' + $(this).closest("tr").index() + ') td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
			});
			$("#rejectionnote_customer").val(resp["delchal"]["custname"]);
			$("#rejectionnote_customeraddr").val(resp["delchal"]["custaddr"]);
			$("#rejectionnote_customertin").val(resp["delchal"]["custtin"]);
			$("#rejectionnote_customergstin").val(resp["delchal"]["gstin"]);
			if(resp["delchal"]["dcflag"] == 1){
			    $("#rejectionnote_consignment").val("Approval");
			}
			else if(resp["delchal"]["dcflag"] == 3){
			    $("#rejectionnote_consignment").val("Consignment");
			}
			else if(resp["delchal"]["dcflag"] == 4){
			    $("#rejectionnote_consignment").val("Sale");
			}
			else if(resp["delchal"]["dcflag"] == 5){
			    $("#rejectionnote_consignment").val("Free Replacement");
			}
			else if(resp["delchal"]["dcflag"] == 19){
			    $("#rejectionnote_consignment").val("Sample");
			}
			if(resp["delchal"]["goid"]){
			    $("#rejectionnote_godown").attr("data-goid", resp["delchal"]["goid"]);
			    $("#rejectionnote_godown").val(resp["delchal"]["goname"] + "("+ resp["delchal"]["gostate"] +")");
			}
			else{
			    $("#rejectionnote_godown").attr("data-goid", "");
			    $("#rejectionnote_godown").val("None");
			    $("#rejectionnote_consignment").val("None");
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
    });

    $(document).off("change", "#rejectionnote_deliverynote").on("change", "#rejectionnote_deliverynote", function(event) {
	if ($("#rejectionnote_deliverynote option:selected").val() != '') {
	    $("#rejectionnote_invoice option[value='']").prop("selected", true);
	    $.ajax({
		url: '/invoice?action=getdeliverynote',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "dcid": $("#rejectionnote_deliverynote option:selected").val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
		.done(function(resp) {
		    if(resp["delchal"]["delchaldata"]["dcflag"] == 1){
			$("#rejectionnote_consignment").val("Approval");
		    }
		    else if(resp["delchal"]["delchaldata"]["dcflag"] == 3){
			$("#rejectionnote_consignment").val("Consignment");
		    }
		    else if(resp["delchal"]["delchaldata"]["dcflag"] == 4){
			$("#rejectionnote_consignment").val("Sale");
		    }
		    else if(resp["delchal"]["delchaldata"]["dcflag"] == 5){
			$("#rejectionnote_consignment").val("Free Replacement");
		    }
		    else if(resp["delchal"]["delchaldata"]["dcflag"] == 19){
			$("#rejectionnote_consignment").val("Sample");
		    }
		    $("#rejectionnote_godown").attr("data-goid", resp["delchal"]["delchaldata"]["goid"]);
		    $("#rejectionnote_godown").val(resp["delchal"]["delchaldata"]["goname"] + "("+ resp["delchal"]["delchaldata"]["gostate"] +")");
		    if (resp["gkstatus"] == 0) {
			$.ajax({
			    url: '/customersuppliers?action=get',
			    type: 'POST',
			    dataType: 'json',
			    async: false,
			    data: { "custid": resp["delchal"]["delchaldata"]["custid"] },
			    beforeSend: function(xhr) {
				xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			    }
			})
			    .done(function(resp) {
				console.log("success");
				if (resp["gkstatus"] == 0) {
				    $("#rejectionnote_customer").val(resp["gkresult"]["custname"]);
				    $("#rejectionnote_customeraddr").val(resp["gkresult"]["custaddr"]);
				    $("#rejectionnote_customertin").val(resp["gkresult"]["custtan"]);
				    $("#rejectionnote_customergstin").val(resp["gkresult"]["custgstin"]);
				}
			    })
			    .fail(function() {
				console.log("error");
			    })
			    .always(function() {
				console.log("complete");
			    });
			$('#rejectionnote_product_table tbody').empty();
			$.ajax({
			    url: '/invoice?action=getdelinvprods',
			    type: 'POST',
			    dataType: 'json',
			    async: false,
			    data: {"dcid": $("#rejectionnote_deliverynote option:selected").val()},
			    beforeSend: function(xhr) {
				xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			    }
			})
			    .done(function(resp) {
				console.log("success");
				if (resp["gkstatus"] == 0) {
				    $.each(resp.items, function(key, value) {
					$('#rejectionnote_product_table tbody').append('<tr>' +
										       '<td class="col-xs-5">' +
										       '<input class="form-control input-sm product_name" data-productcode="' + key + '" value="' + value.productdesc + '" disabled>' +
										       '</td>' +
										       '<td class="col-xs-3">' +
										       '<div class="input-group">' +
										       '<input type="text" class="rejectionnote_product_quantity form-control input-sm text-right" data="' + value.qty + '" value="' + value.qty + '" disabled>' +
										       '<span class="input-group-addon input-sm" id="unitaddon">' + value.unitname + '</span>' +
										       '</div>' +
										       '</td>' +
										       '<td class="col-xs-3">' +
										       '<div class="input-group">' +
										       '<input type="text" class="rejectionnote_product_rejected_quantity numtype form-control input-sm text-right" value="0.00">' +
										       '<span class="input-group-addon input-sm" id="unitaddon">' + value.unitname + '</span>' +
										       '</div>' +
										       '</td>' +
										       '<td class="col-xs-1">' +
										       '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
										       '</td>' +
										       '</tr>');
					$('#rejectionnote_product_table tbody tr:eq(' + $(this).closest("tr").index() + ') td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
				    });
				}
			    })
			    .fail(function() {
				console.log("error");
			    })
			    .always(function() {
				console.log("complete");
			    });
		    }
		})
		.fail(function() {
		    console.log("error");
		})
		.always(function() {
		    console.log("complete");
		});
	}
	else{
	    $("#rejectionnote_godown").attr("data-goid", "");
	    $('#rejectionnote_product_table tbody').empty();
	    $('#rejectionnote_product_table tbody').append('<tr>' +
							   '<td class="col-xs-5">' +
							   '<input class="form-control input-sm product_name" placeholder="None" disabled>' +
							   '</td>' +
							   '<td class="col-xs-3">' +
							   '<div class="input-group">' +
							   '<input type="text" class="rejectionnote_product_quantity form-control input-sm text-right" placeholder="0.00" disabled>' +
							   '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
							   '</div>' +
							   '</td>' +
							   '<td class="col-xs-3">' +
							   '<div class="input-group">' +
							   '<input type="text" class="rejectionnote_product_rejected_quantity numtype form-control input-sm text-right" value="0.00">' +
							   '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
							   '</div>' +
							   '</td>' +
							   '<td class="col-xs-1">' +
							   '</td>' +
							   '</tr>');
	}
    });

    $("#rejectionnote_save").click(function(event) {       // save event to save rejection note.
	event.stopPropagation();
	// below are all the validation checks
	if (!($("#rejectionnote_invoice").val()) && !($("#rejectionnote_deliverynote").val())) {
	    $("#dcinv-blank-alert").alert();
	    $("#dcinv-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#dcinv-blank-alert").hide();
	    });
	    $('#rejectionnote_invoice').focus().select();
	    return false;
	}
	if ($.trim($('#rejectionnote_noteno').val())=="") {
	    $("#noteno-blank-alert").alert();
	    $("#noteno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#noteno-blank-alert").hide();
	    });
	    $('#rejectionnote_noteno').focus();
	    return false;
	}
	if ($.trim($('#rejectionnote_date').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#rejectionnote_date').focus();
	    return false;
	}
	if ($.trim($('#rejectionnote_month').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#rejectionnote_month').focus();
	    return false;
	}
	if ($.trim($('#rejectionnote_year').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#rejectionnote_year').focus();
	    return false;
	}
	if(!Date.parseExact($("#rejectionnote_date").val()+$("#rejectionnote_month").val()+$("#rejectionnote_year").val(), "ddMMyyyy")){
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-alert").hide();
	    });
	    $('#rejectionnote_date').focus().select();
	    return false;
	}
	var curdate = Date.parseExact($("#rejectionnote_year").val()+$("#rejectionnote_month").val()+$("#rejectionnote_date").val(), "yyyyMMdd");
	if (!curdate.between(financialstart,financialend)) {
	    $("#between-date-alert").alert();
	    $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#between-date-alert").hide();
	    });
	    $('#rejectionnote_date').focus().select();
	    return false;
	}
	var curdate1= new Date($("#rejectionnote_year").val(), $("#rejectionnote_month").val()-1, $("#rejectionnote_date").val());
	if($("#rejectionnote_invoice option:selected")){
	    var invdatearray = $("#rejectionnote_invoice option:selected").data("invoicedate").split(/\s*\-\s*/g);
	    var invdate = new Date(invdatearray[2], invdatearray[1]-1, invdatearray[0]);
	    if (curdate1 < invdate) {
		$("#between-inv-date-alert").alert();
		$("#between-inv-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#between-inv-date-alert").hide();
		});
		$('#rejectionnote_date').focus().select();
		return false;
	    }
	}
	else{
	    var dcdatearray = $("#rejectionnote_deliverynote option:selected").data("dcdate").split(/\s*\-\s*/g);
	    var dcdate = new Date(dcdatearray[2], dcdatearray[1]-1, dcdatearray[0]);
	    if (curdate1 < dcdate) {
		$("#between-dc-date-alert").alert();
		$("#between-dc-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#between-dc-date-alert").hide();
		});
		$('#rejectionnote_date').focus().select();
		return false;
	    }
	}
	
	var products = {}; // dictionary containing product code with rejected quantity.
	var i = 0;
	for (i; i < $("#rejectionnote_product_table tbody tr").length; i++) {         // loop for getting details from each row at a time
	    if ($("#rejectionnote_product_table tbody tr:eq("+i+") td:eq(2) input").val()=="" || $("#rejectionnote_product_table tbody tr:eq("+i+") td:eq(2) input").val()=="0.00" || $("#rejectionnote_product_table tbody tr:eq("+i+") td:eq(2) input").val()=="0") {
		$("#quantity-blank-alert").alert();
		$("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#quantity-blank-alert").hide();
		});
		$("#rejectionnote_product_table tbody tr:eq("+i+") td:eq(2) input").focus();
		return false;
	    }
	    var productcode = $("#rejectionnote_product_table tbody tr:eq("+i+") td:eq(0) input").data("productcode");
	    products[productcode] = parseFloat($("#rejectionnote_product_table tbody tr:eq("+i+") td:eq(2) input").val()).toFixed(2);
	}
	if(i == 0){
	    $("#product-blank-alert").alert();
	    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#product-blank-alert").hide();
	    });
	    return false;
	}
	var form_data = new FormData();
	form_data.append("rnno", $("#rejectionnote_noteno").val());
	form_data.append("rndate", $("#rejectionnote_year").val()+'-'+$("#rejectionnote_month").val()+'-'+$("#rejectionnote_date").val());
	form_data.append("inout", $("#rejectionnote_gkstatus").val());
	if($('#rejectionnote_deliverynote').val()){
	    form_data.append("dcid", $('#rejectionnote_deliverynote').val());
	}
	if($('#rejectionnote_invoice').val()){
	    form_data.append("invid", $('#rejectionnote_invoice').val());
	}
	if($("#rejectionnote_godown").attr("data-goid")){
	    form_data.append("goid", $("#rejectionnote_godown").attr("data-goid"));
	}
	form_data.append("products", JSON.stringify(products));
	event.preventDefault();
	$('.modal-backdrop').remove();
	$('.modal').modal('hide');
	$('#confirm_yes').modal('show').one('click', '#rn_save_yes', function (e)     {
	    $.ajax({
		url: '/rejectionnote?action=save',
		type: 'POST',
		global: false,
		contentType: false,
		cache: false,
		processData: false,
		dataType: 'json',
		async : false,
		data: form_data,
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
		.done(function(resp) {
		    if(resp["gkstatus"] == 0){
			$("#success-alert").alert();
			$("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
			    $("#success-alert").hide();
			    if ($("#rejectionnote_view").length == 0) {
				$("#rejectionnote").click();
			    }
			    if ($("#rejectionnote_gkstatus").val()=='9') {
				$("#rejectionnote_in").click();
			    }
			    else {
				$("#rejectionnote_out").click();
			    }
			    return false;
			});
		    }
		    else if(resp["gkstatus"]==1) {
			$("#rejectionnote_noteno").focus();
			$("#duplicate-alert").alert();
			$("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
			    $("#duplicate-alert").hide();
			});
			return false;
		    }
		    else {
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
	    return false;
	});
    });
    
    $("#confirm_yes").on('shown.bs.modal', function(event) {
	// on opening of modal the focus should be by efault on the no option so this event
	$("#rn_save_no").focus();
    });
    
    $("#confirm_yes").on('hidden.bs.modal', function(event) {
	// after te modal is closed the focus should be on the rejection note number so this event
	$("#rejectionnote_noteno").focus();
    });

    $("#rejectionnote_reset").click(function(event) {
	// function for resetting the entered delivery note details
	if ($("#rejectionnote_gkstatus").val()=='9') {
	    $("#rejectionnote_in").click();
	}
	else {
	    $("#rejectionnote_out").click();
	}
    });
});





