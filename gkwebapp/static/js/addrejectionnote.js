/* Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation 
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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Nitesh Chaughule "<nitesh@disroot.org>
 */

// This script is for the add addrejectionnote.jinja2
$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.rndate').autotab('number');
    $("#rejectionnote_invoice").focus();
    $("#rejectionnote_date").numeric();
    $("#rejectionnote_month").numeric();
    $("#rejectionnote_year").numeric();
    $(".vatfield").hide();
    if(sessionStorage.vatorgstflag == '22' ){
	$(".gstinfield").hide();
	$(".gstfield").hide();
	$(".vatfield").show();
	$(".tinfield").show();
	$("#invoice_product_table_vat").show();
	$(".gsttable").hide();
    } else {
	$(".gstfield").show();
	$(".vatfield").hide();
	$(".gstinfield").show();
	$(".tinfield").hide();
	$("#invoice_product_table_vat").hide();
	$(".gsttable").show();
    }
    var taxflag;
    var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();
    var vathtml = $('#invoice_product_table_vat tbody tr:first').html();
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html();
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
    $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
	event.preventDefault();
	/* Act on the event */
	$(".numtype").numeric({ negative: false });
    });

    $(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
	event.preventDefault();
	/* Act on the event */
	if ($(this).val() == "") {
	    $(this).val(parseFloat(0).toFixed(2));
	} else {
	    $(this).val(parseFloat($(this).val()).toFixed(2));
	}
    });
    
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
	var rowprice = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowtaxableamount=(rowqty * rowprice); //Taxable amount for each row is calculated.
	//Initialising variables for calculating total of Discount, Taxable Amount, Tax Amounts, and Total Amounts.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totalcgst = 0.00;
	var totalsgst = 0.00;
	var totaligst = 0.00;
	var totalcess = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;

	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.

	let sgstrate = $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val();
	let sgstamount = (rowtaxableamount * sgstrate)/100;  //Amount of SGST to be applied is found out.
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(sgstamount).toFixed(2));
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(10) input').val(parseFloat(sgstamount).toFixed(2));

	let igstrate = $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val();
	let igstamount = (rowtaxableamount * igstrate)/100;  //Amount of IGST to be applied is found out.
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(12) input').val(parseFloat(igstamount).toFixed(2));

	let cessrate = $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val();
        let cessamount = (rowtaxableamount * cessrate)/100;  //Amount of Cess to be applied is found out.
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(14) input').val(parseFloat(cessamount).toFixed(2));

	rowtotal = rowtaxableamount + 2*sgstamount + igstamount + cessamount; //Sum of Taxable Amount and Tax Amount is found out.
        $('#invoice_product_table_total tbody tr:eq(' + curindex + ') td:eq(0) input').val(parseFloat(rowtotal).toFixed(2));

	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(6) input').val());
	    totalcgst = totalcgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(8) input').val());
	    totalsgst = totalsgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(10) input').val());
	    totaligst = totaligst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(12) input').val());
	    totalcess = totalcess + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(14) input').val());
	    totalamount = totalamount + parseFloat($('#invoice_product_table_total tbody tr:eq(' + i + ') td:eq(0) input').val());
	}

	//Total of various columns are displayed on the footer.
	$('#discounttotal_product_gst').text(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_gst').text(parseFloat(totaltaxable).toFixed(2));
	$('#totalcgst_product_gst').text(parseFloat(totalcgst).toFixed(2));
	$('#totalsgst_product_gst').text(parseFloat(totalsgst).toFixed(2));
	$('#totaligst_product_gst').text(parseFloat(totaligst).toFixed(2));
	$('#totalcess_product_gst').text(parseFloat(totalcess).toFixed(2));
	$('#total_product_gst').text(parseFloat(totalamount).toFixed(2));
	$("#totalinvoicevalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalsgtax").text(parseFloat(totalsgst).toFixed(2));
	$("#totalcgtax").text(parseFloat(totalcgst).toFixed(2));
	$("#totaligtax").text(parseFloat(totaligst).toFixed(2));
	$("#totalinvcess").text(parseFloat(totalcess).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
    }

    //Function to calculate Tax Amount and Total of Discount, Taxable Amount, Tax Amounts and Total Amount.
    //This is similar to the function above.
    function calculatevataxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowprice = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
	var rowtaxrate = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);
	var taxamount = 0.00;
	var rowtaxableamount=(rowqty * rowprice); //Taxable amount for each row is calculated.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totaltax = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;
	$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.
	taxamount = (rowtaxableamount * rowtaxrate)/100;  //Amount of tax to be applied is found out.
	 $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxamount).toFixed(2));
	 rowtotal = rowtaxableamount + taxamount;
	 $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));
	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totaltax = totaltax + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(7) input').val());
	    totalamount = totalamount + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(8) input').val());
	}
	//Total of various columns are displayed on the footer.
	$('#discounttotal_product_vat').val(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totalinvoicevalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
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
	if (event.which==13) {
	    event.preventDefault();
	    if ($.trim($('#rejectionnote_noteno').val())=="") {
	    $("#noteno-blank-alert").alert();
	    $("#noteno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#noteno-blank-alert").hide();
	    });
	    $('#rejectionnote_noteno').focus();
	    return false;
	}
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
	    if(sessionStorage.vatorgstflag == '22' ){
		$('#invoice_product_table_vat tbody tr:first td:eq(2) input').focus().select();
	    }else{
		$('#invoice_product_table_gst tbody tr:first td:eq(3) input').focus().select();
	    }
	    $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
	}
	if (event.which==38) {
	    event.preventDefault();
	    $("#rejectionnote_month").focus().select();
	}
    });

    $(document).off('change', '.rejection_product_rejquantity_gst').on('change', '.rejection_product_rejquantity_gst', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
      if (parseFloat($(this).val()) == 0 && parseFloat($('.rejection_product_rejquantity_gst:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_gst:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
      calculategstaxamt(curindex);
    });


    $(document).off("keydown", ".rejection_product_rejquantity_gst").on("keydown", ".rejection_product_rejquantity_gst", function(event) {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1 + 1;
    var previndex1 = curindex1 - 1;

    if (event.which == 27) {
	event.preventDefault();
	if ($("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").val()=="" || $("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").val()=="0.00" || $("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").val()=="0") {
	    $("#product-blank-alert").alert();
	    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#product-blank-alert").hide();
	    });
	    $("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").focus();
		return false;
	}
	var qty = $('#invoice_product_table_gst tbody tr:eq('+$(this).closest("tr").index()+') td:eq(3) input').val();
	if(parseFloat(qty) > parseFloat($('#invoice_product_table_gst tbody tr:eq('+$(this).closest("tr").index()+') td:eq(2) input').val())){
	    $("#quantity-more-alert").alert();
	    $("#quantity-more-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#quantity-more-alert").hide();
	    });
	    return false;
	}
	calculategstaxamt(curindex1);
	$("#rejectionnote_save").focus();
    }
    else if (event.which == 13) {
	event.preventDefault();
	
	if ($("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").val()=="" || $("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").val()=="0.00" || $("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").val()=="0") {
	    $("#product-blank-alert").alert();
	    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#product-blank-alert").hide();
	    });
	    $("#invoice_product_table_gst tbody tr:eq("+ curindex1 +") td:eq(3) input").focus();
	    return false;
	}
	qty = $('#invoice_product_table_gst tbody tr:eq('+$(this).closest("tr").index()+') td:eq(3) input').val();
	if(parseFloat(qty) > parseFloat($('#invoice_product_table_gst tbody tr:eq('+$(this).closest("tr").index()+') td:eq(2) input').val())){
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
	    $('#invoice_product_table_gst tbody tr:eq('+ind+') td:eq(3) input').focus().select();
	}	
	if (curindex1 != ($("#invoice_product_table_gst tbody tr").length - 1)) {//Not a last row.
	    $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(3) input').focus().select();
	}
	calculategstaxamt(curindex1);
    }else{
	if (event.which == 27) {
	    $("#rejectionnote_save").focus();
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

    //rejectionnote_product_quantity
    $(document).off("keydown", ".rejectionnote_product_quantity").on("keydown", ".rejectionnote_product_quantity", function(event) {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1 + 1;
    var previndex1 = curindex1 - 1;

    if (event.which == 27) {
	event.preventDefault();
	calculatevataxamt(curindex1);
	$("#rejectionnote_save").focus();
    }
    else if (event.which == 13) {
	event.preventDefault();
	if ($("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").val()=="" || $("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").val()=="0.00" || $("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").val()=="0") {
	    $("#quantity-blank-alert").alert();
	    $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#quantity-blank-alert").hide();
	    });
	    $("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").focus();
	    return false;
	}
	if (curindex1 != ($("#invoice_product_table_vat tbody tr").length - 1)) {//Not a last row.
	    $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(2) input').focus().select();
	}
	calculatevataxamt(curindex1);
    }else{
	if (event.which == 27) {
	    $("#rejectionnote_save").focus();
	}
    }
  });

    $(document).off('change', '.rejectionnote_product_rejected_quantity').on('change', '.rejectionnote_product_rejected_quantity', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
      if (parseFloat($(this).val()) == 0 && parseFloat($('.rejectionnote_product_rejected_quantity:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_gst:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
      calculatevataxamt(curindex);
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
	var curindex = $(this).closest('tr').index();
	var nextindex = curindex + 1;
	var previndex = curindex - 1;
	if ($("#invoice_product_table_vat tbody tr").length > 1) {
	    $(this).closest('tr').fadeOut(200, function() {
		$(this).closest('tr').remove(); //closest method gives the closest element productified
		$("#invoice_product_table_vat tbody tr:first td:eq(0) select").focus();
		calculatevataxamt(curindex);
	    });
	}
	if ($("#invoice_product_table_vat tbody tr").length == 1) {
	    $("#invoice_product_table_vat tbody tr:eq(0) td:eq(9)").empty();
	}

	if ($("#invoice_product_table_gst tbody tr").length > 1) {
	    $(this).closest('tr').remove();
	    $("#invoice_product_table_gst tbody tr:eq("+curindex+")").remove();
	    $("#invoice_product_table_gst tbody tr:first td:eq(0) select").focus();
	    calculategstaxamt(curindex);
	}
	if ($("#invoice_product_table_gst tbody tr").length == 1) {
	    $("#invoice_product_table_total tbody tr:eq(0) td:eq(1)").empty();
	}

    });

    //Keydown For Rejected Qty for Product Table VAT
    $(document).off("keydown",".rejectionnote_product_rejected_quantity").on("keydown",".rejectionnote_product_rejected_quantity",function(event) {
	var curindex1 = $(this).closest('tr').index();
	var nextindex1 = curindex1 + 1;
	var previndex1 = curindex1 - 1;

	if (event.which == 27) {
	event.preventDefault();
	    if ($("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").val()=="" || $("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").val()=="0.00" || $("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").val()=="0") {
		$("#product-blank-alert").alert();
		$("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#product-blank-alert").hide();
		});
		$("#invoice_product_table_vat tbody tr:eq("+ curindex1 +") td:eq(2) input").focus();
		return false;
	    }
	    var qty = $('#invoice_product_table_vat tbody tr:eq('+$(this).closest("tr").index()+') td:eq(2) input').val();
	    if(parseFloat(qty) > parseFloat($('#invoice_product_table_vat tbody tr:eq('+$(this).closest("tr").index()+') td:eq(1) input').val())){
		$("#quantity-more-alert").alert();
		$("#quantity-more-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#quantity-more-alert").hide();
		});
		return false;
	    }
	    calculategstaxamt(curindex1);
	    $("#rejectionnote_save").focus();
	}
	else if (event.which==13) {
	    event.preventDefault();
	    qty = $('#invoice_product_table_vat tbody tr:eq('+$(this).closest("tr").index()+') td:eq(2) input').val();
	    if(qty == "" || qty == "0.00" || qty == "0"){
		$("#product-blank-alert").alert();
		$("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#product-blank-alert").hide();
		});
		return false;
	    }
	    if(parseFloat(qty) > parseFloat($('#invoice_product_table_vat tbody tr:eq('+$(this).closest("tr").index()+') td:eq(1) input').val())){
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
		$('#invoice_product_table_vat tbody tr:eq('+ind+') td:eq(2) input').focus().select();
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
	$(".delchal").hide();
	$(".inv").show();
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
			taxflag = resp.invDetails.taxflag;
			if(resp.invDetails.taxflag == 7){
			    let curindex = 0;
			    $('#invoice_product_table_gst tbody').empty();
			    $('#invoice_product_table_total tbody').empty();
			    $(".vatfield").hide();
			    $.each(resp.items, function(key, value) {
				$('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
				$('.product_name_gst:eq(' + curindex + ')').val(value.productdesc).attr("data-productcode",key);
				$('.invoice_product_hsncode:eq(' + curindex + ')').html(value.gscode);
				$('.invoice_product_quantity_gst:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
				$('.invoice_product_freequantity_gst:eq(' + curindex + ')').val(value.freeqty).attr("data", value.freeqty);
				$('.unitaddon_qty_gst:eq(' + curindex + '), .unitaddon_freeqty_gst:eq(' + curindex + ')').text(value.uom);
				$('.invoice_product_per_price_gst:eq(' + curindex + ')').val(value.priceperunit);
				$('.invoice_product_discount_gst:eq(' + curindex + ')').val(value.discount);
				$('.invoice_product_taxablevalue_gst:eq(' + curindex + ')').val(value.taxableamount);
				if(value.taxname == 'IGST'){
				    $(".sgstfield").hide();
				    $(".igstfield").show();
				    $('.invoice_product_igstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
				    $('.invoice_product_igstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
				}
				else{
				    $(".igstfield").hide();
				    $(".sgstfield").show();
				    $('.invoice_product_sgstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
				    $('.invoice_product_sgstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
				    $('.invoice_product_cgstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
				    $('.invoice_product_cgstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
				}
				$('.invoice_product_cessrate:eq(' + curindex + ')').val(parseFloat(value.cessrate).toFixed(2));
				$('.invoice_product_cessamount:eq(' + curindex + ')').val(parseFloat(value.cess).toFixed(2));
				$("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
				$('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				$('.invoice_product_total:eq(' + curindex + ')').val(parseFloat(value.totalAmount).toFixed(2));
				curindex = curindex + 1;
			    });
			    $('.invoice_product_quantity_gst').numeric({ negative: false });
			    $('.invoice_product_per_price_gst').numeric({ negative: false });
			    $("#invoice_product_table_total tbody tr:first td:last").empty();
			    $("#discounttotal_product_gst").text(parseFloat(resp.invDetails.totaldiscount).toFixed(2));
			    $("#taxablevaluetotal_product_gst").text(parseFloat(resp.invDetails.totaltaxablevalue).toFixed(2));
			    $("#totalcgst_product_gst").text(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#totalsgst_product_gst").text(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#totaligst_product_gst").text(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#totalcess_product_gst").text(parseFloat(resp.invDetails.totalcessamt).toFixed(2));
			    $("#total_product_gst").text(parseFloat(resp.invDetails.invoicetotal).toFixed(2));
			    $("#taxableamount").text(parseFloat(resp.invDetails.totaltaxablevalue).toFixed(2));
			    $("#totalinvoicevalue").text(parseFloat(resp.invDetails.invoicetotal).toFixed(2));
			    $("#totalsgtax").text(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#totalcgtax").text(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#totaligtax").text(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#totalinvdiscount").text(parseFloat(resp.invDetails.totaldiscount).toFixed(2));
			    $("#totalinvcess").text(parseFloat(resp.invDetails.totalcessamt).toFixed(2));
			    $(".vatfied").hide();
			    $(".gstfield").show();
			}else if(resp.invDetails.taxflag == 22){
			    $("#invoice_product_table_vat").show();
			    let curindex = 0;
			    $(".gsttable").hide();
			    $('#invoice_product_table_vat tbody').empty();
			    $.each(resp.items, function(key, value) {
				$('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
				$('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				$('.product_name:eq(' + curindex + ')').val(value.productdesc).attr("data-productcode",key);
				$('.rejectionnote_product_quantity:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
				$('.rejectionnote_product_rejected_quantity:eq(' + curindex + ')').text(value.freeqty).attr("data", value.freeqty);
				$('#unitaddon_qty_vat:eq(' + curindex + '), #unitaddon_freeqty_vat:eq(' + curindex + ')').text(value.uom);
				$('.rejection_product_per_price_vat:eq(' + curindex + ')').val(value.priceperunit);
				$('.rejection_product_discount_vat:eq(' + curindex + ')').val(value.discount);
				$('.rejection_product_taxablevalue_vat:eq(' + curindex + ')').val(value.taxableamount);
				$('.rejection_product_tax_rate_vat:eq(' + curindex + ')').val(value.taxrate);
				$('.rejection_product_tax_amount_vat:eq(' + curindex + ')').val(value.taxamount);
				$('.rejection_product_total:eq(' + curindex + ')').val(value.totalAmount);
				curindex = curindex + 1;
			    });
			    $("#invoice_product_table_vat tbody tr:first td:eq(9)").empty();
			    $('.invoice_product_quantity_vat').numeric({ negative: false });
			    $('.invoice_product_per_price_vat').numeric({ negative: false });
			    $("#discounttotal_product_vat").val(parseFloat(resp.invDetails.totaldiscount).toFixed(2));
			    $("#taxablevaluetotal_product_vat").val(parseFloat(resp.invDetails.totaltaxablevalue).toFixed(2));
			    $("#totaltax").val(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#total_product_vat").val(parseFloat(resp.invDetails.invoicetotal).toFixed(2));
			    $("#totalinvtax").text(parseFloat(resp.invDetails.totaltaxamt).toFixed(2));
			    $("#totalinvoicevalue").text(parseFloat(resp.invDetails.invoicetotal).toFixed(2));
			    $("#totalinvdiscount").text(parseFloat(resp.invDetails.totaldiscount).toFixed(2));
			    $("#taxableamount").text(parseFloat(resp.invDetails.totaltaxablevalue).toFixed(2));
			    $(".gstfield").hide();
			    $(".vatfield").show();
			}    			    
			if(resp["invDetails"]["taxflag"] == 7){
			    $(".gstinfield").show();
			    $(".tinfield").hide();
			} else {
			    $(".tinfield").show();
			    $(".gstinfield").hide();
			}
			$("#invoice_noteno").val(resp["invDetails"]["invno"]);
			var dcdatearray = resp.invDetails.invdate.split(/\s*\-\s*/g);
			$("#invoice_date").val(dcdatearray[0]);
			$("#invoice_month").val(dcdatearray[1]);
			$("#invoice_year").val(dcdatearray[2]);
			$("#invoice_state").val(resp.invDetails.sourcestate);
			$("#invoice_gstin").val(resp.invDetails.orgstategstin);
			$("#issuer_name").val(resp.invDetails.issuername);
			if(resp.invDetails.inoutflag == 15){
			    $("#invoice_addr").val(resp.invDetails.address);
			    $("#issuer_designation").val(resp.invDetails.designation);
			}else{
			    var dict={"-1":"Admin","0":"Manager","1":"Operator","2":"Auditor","3":"Godown In Charge"};
			    var userrole = dict[resp.invDetails.designation];
			    $("#issuer_designation").val(userrole);
			    $("#invoice_addr").val(resp["orgdata"]["orgaddr"]+","+resp["orgdata"]["orgcity"]+","+resp["orgdata"]["orgstate"]+","+resp["orgdata"]["orgpincode"]);
			}
			$("#cussup_state").val(resp["delchal"]["custstate"]);
			$("#rejectionnote_customer").val(resp["delchal"]["custname"]);
			$("#rejectionnote_customeraddr").val(resp["delchal"]["custaddr"]);
			if(resp["delchal"]["taxflag"] == 7){
			    $("#rejectionnote_customergstin").val(resp["delchal"]["custgstin"]);
			} else {
			    $("#rejectionnote_customertin").val(resp["delchal"]["custtin"]);
			}
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
	$(".delchal").show();
	$(".inv").hide();
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
	if($("#rejectionnote_invoice option:selected").val() != ""){
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
	var productcode=[];
	var rejprods ={};
	// dictionary containing product code with rejected quantity.
	if(taxflag == 7){
	    var i = 0;
	    for (i; i < $("#invoice_product_table_gst tbody tr").length; i++) {         // loop for getting details from each row at a time
		if ($("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(3) input").val()=="" || $("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(3) input").val()=="0.00" || $("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(3) input").val()=="0") {
		    $("#product-blank-alert").alert();
		    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#product-blank-alert").hide();
		    });
		    $("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(3) input").focus();
		    return false;
		}
		var qty = $('#invoice_product_table_gst tbody tr:eq('+i+') td:eq(3) input').val();
		if(parseFloat(qty) > parseFloat($('#invoice_product_table_gst tbody tr:eq('+i+') td:eq(2) input').val())){
		    $("#quantity-more-alert").alert();
		    $("#quantity-more-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#quantity-more-alert").hide();
		    });
		    $("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(3) input").focus();
		    return false;
		}
		productcode.push($("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(0) input").attr("data-productcode"));
		var products = {};
		var productcodes = $("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(0) input").attr("data-productcode");
		var ppu = parseFloat($("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(4) input").val()).toFixed(2);
		products[ppu] = parseFloat($("#invoice_product_table_gst tbody tr:eq("+i+") td:eq(3) input").val()).toFixed(2);
		rejprods[productcodes] = products;
	    }
	    if(i == 0){
		$("#product-blank-alert").alert();
		$("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#product-blank-alert").hide();
		});
		return false;
	    }
	    var rejectedtotal = $.trim($('#total_product_gst').html());
	}else if (taxflag ==22){
	    i = 0;
	    for (i; i < $("#invoice_product_table_vat tbody tr").length; i++) {         // loop for getting details from each row at a time
		if ($("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(2) input").val()=="" || $("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(2) input").val()=="0.00" || $("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(2) input").val()=="0") {
		    $("#product-blank-alert").alert();
		    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#product-blank-alert").hide();
		    });
		    $("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(2) input").focus();
		    return false;
		}
		var qty = $('#invoice_product_table_vat tbody tr:eq('+i+') td:eq(2) input').val();
		if(parseFloat(qty) > parseFloat($('#invoice_product_table_vat tbody tr:eq('+i+') td:eq(1) input').val())){
		    $("#quantity-more-alert").alert();
		    $("#quantity-more-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#quantity-more-alert").hide();
		    });
		    $("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(2) input").focus();
		    return false;
		}
		productcode.push($("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(0) input").attr("data-productcode"));
		products = {};
		productcodes = $("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(0) input").attr("data-productcode");
		ppu = parseFloat($("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(3) input").val()).toFixed(2);
		products[ppu] = parseFloat($("#invoice_product_table_vat tbody tr:eq("+i+") td:eq(2) input").val()).toFixed(2);
		rejprods[productcode] = products;
	    }
	    if(i == 0){
		$("#product-blank-alert").alert();
		$("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#product-blank-alert").hide();
		});
		return false;
	    }
	    rejectedtotal = $.trim($('#invoice_product_table_vat tfoot tr:last td:eq(5) input').val());

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
	form_data.append("products", JSON.stringify(rejprods));
	form_data.append("rejectedtotal",rejectedtotal);
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





