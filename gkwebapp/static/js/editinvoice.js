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
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
"Abhijith Balan" <abhijith@dff.org.in>
"Pravin Dake" <pravindake24@gmail.com>
"Nitesh Chaughule" <nitesh@disroot.org>
"Aditya Shukla" <adityashukla9158.as@gmail.com>
"Rupali Badgujar" <rupalibadgujar1234@gmail.com>

*/

// This script is for the addinvoice.jinja2

$(document).ready(function() {

    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    $("select:first").focus();
    $("#invoice_editprint, #invoice_addproduct").hide();
	$(".uploadclass").hide();	
    var tootltiptitle ="Press 'T' to toggle between Original Price, MRP, Last Selling Price and Selling Price.";
    if($("#status").val() == 9){
	tootltiptitle = "Press 'T' to toggle between Original Price, MRP and Last Purchase Price.";
    }
    $('#firstvatprice, #firstgstprice').tooltip({
	title : tootltiptitle,
	placement : "bottom"
	});
	
	$("#moresmall").on('shown.bs.collapse', function(event) {
		event.preventDefault();
		$("#smalllink").html('Close <span class="glyphicon glyphicon-triangle-top"></span>');
	  });
	  $("#moresmall").on('hidden.bs.collapse', function(event) {
		event.preventDefault();
		$("#smalllink").html('Instructions <span class="glyphicon glyphicon-triangle-bottom"></span>');
	  });

	  $("#moresmallvat").on('shown.bs.collapse', function(event) {
		event.preventDefault();
		$("#smalllinkvat").html('Close <span class="glyphicon glyphicon-triangle-top"></span>');
	  });
	  $("#moresmallvat").on('hidden.bs.collapse', function(event) {
		event.preventDefault();
		$("#smalllinkvat").html('Instructions <span class="glyphicon glyphicon-triangle-bottom"></span>');
	  });
	  $("#moresmallonlyvat").on('shown.bs.collapse', function(event) {
		event.preventDefault();
		$("#smalllinkonlyvat").html('Close <span class="glyphicon glyphicon-triangle-top"></span>');
	  });
	  $("#moresmallonlyvat").on('hidden.bs.collapse', function(event) {
		event.preventDefault();
		$("#smalllinkonlyvat").html('Instructions <span class="glyphicon glyphicon-triangle-bottom"></span>');
	  });

    //to autopopulate the details of consignee same as the details of reciver when checkbox is checked.
      $("#Consignee").change(function() {
          if($(this).prop('checked') == true) {
	      $("#consigneename").val($("#invoice_customer option:selected").text());
	      $("#consigneestate").val($("#invoice_customerstate option:selected").text());
	      $("#statecodeofconsignee").text(pad($("#statecodeofcustomer").text(), 2));
	      $("#gstinconsignee").val($("#gstin").text());
	      $("#tinconsignee").val($("#tin").text());
		  $("#consigneeaddress").val($("#invoice_customeraddr").text());
	      $("#consigneepincode").val($("#invoice_customerpincode").text());
		  
	  } else {
	      $("#consigneename").val("");
	      $("#consigneestate").val("");
	      $("#statecodeofconsignee").text("");
	      $("#gstinconsignee").val("");
	      $("#tinconsignee").val("");
		  $("#consigneeaddress").val("");
	      $("#consigneepincode").val("");
		  
	  }
      });

    //Initialising some variables.
    var taxtype;
	var issuername = "";
	let roundoffvalue;
    var designation = "";
    var numbertowords = "";
    var address = "";
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");  //Start of financial year is saved in a variable.
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");  //End of financial year is saved in a variable.
    var invoicedatestring = "";
    var invoicedate = "";
    var consigneeflag = false;
    var editflag = false;
    var delchalproducts = [];
    var paymentmod;     //Store the paymentmode.
    var gstdate = Date.parseExact('01072017', "ddMMyyyy");
    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html();  //HTML for table displaying totals in GST Product Table.
    var vathtml = $('#invoice_product_table_vat tbody tr:first').html();  //HTML for VAT Product Table row.
    //A dictionary to store GSTINs of a customer.
    var gstins = {};
    var tottaxable;
	var tottax;
	
    //Function to calculate gst tax amount
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowprice = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
	if ($("#discountpercent").val() == 16){
            rowdiscount = (rowqty * rowprice * rowdiscount)/100;
        }
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').attr("gsflag") == 19) {
	    rowtaxableamount = rowprice - rowdiscount;
	}

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

	rowtotal = parseFloat(parseFloat(rowtaxableamount).toFixed(2)) + (2*parseFloat(parseFloat(sgstamount).toFixed(2))) + parseFloat(parseFloat(igstamount).toFixed(2)) + parseFloat(parseFloat(cessamount).toFixed(2)); //Sum of Taxable Amount and Tax Amount is found out.
        $('#invoice_product_table_total tbody tr:eq(' + curindex + ') td:eq(0) input').val(parseFloat(rowtotal).toFixed(2));

	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
	    let looprowdiscount = 0.00;
            if ($("#discountpercent").val() == 16){
                let discountval = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
              let taxableval = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(2) input').val())*parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val());
	      if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled") && $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').is(":disabled")) {
		taxableval = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val());
	      }
              looprowdiscount = (discountval * taxableval)/100;
            }
          else{
            looprowdiscount = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
          }
	  totaldiscount = totaldiscount + looprowdiscount;
	  totaltaxable = totaltaxable + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(6) input').val());
	  tottaxable = totaltaxable;
	  totalcgst = totalcgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(8) input').val());
	  totalsgst = totalsgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(10) input').val());
	  totaligst = totaligst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(12) input').val());
	  totalcess = totalcess + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(14) input').val());
	  totalamount = totalamount + parseFloat($('#invoice_product_table_total tbody tr:eq(' + i + ') td:eq(0) input').val());
	  if ($("#roundvalue").is(":checked")){
	    var res = 	parseFloat(Math.round(totalamount)).toFixed().toString();
	    roundoffvalue = 1;
	  }
	  else{
	    var res = totalamount.toString();
	    
	    roundoffvalue = 0;
	  }
	  var str = res.split(".");
	  var len = str[1];
	  if(totalamount!=0){
	    if(str[1] != undefined){
	      if(len.length == 1){
		str[1] = str[1]+0;
		numbertowords =convertNumberToWords(parseInt(str[0]))+" "+"Rupees"+" "+"and"+" "+ convertNumberToWords(parseInt(str[1]))+"Paise";
	      }else{
		numbertowords =convertNumberToWords(parseInt(str[0]))+" "+"Rupees"+" "+"and"+" "+ convertNumberToWords(parseInt(str[1]))+"Paise";
	      }
	    }else{
	      numbertowords =convertNumberToWords(parseInt(str[0]))+" "+"Rupees";

	    }
	  }else{
	    numbertowords = "Zero"+" "+ "Rupees";
	  }
	}

      //Total of various columns are displayed on the footer.
      if ($("#discountpercent").val() == 1){
	$('#discounttotal_product_gst').text(parseFloat(totaldiscount).toFixed(2));
      }
      else {
	$('#discounttotal_product_gst').text("");
      }
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
      $("#totalinvoicevaluerounded").text(parseFloat(Math.round(totalamount)).toFixed(2));
      $("#totalValueInWord").text(numbertowords);
      if ($("#roundvalue").is(":checked")){
	$("#roundvaluediv").show();
	$("#totalValueInWord").text(numbertowords);
      }
      else{
	$("#roundvaluediv").hide();
	
      }
    }

  //Function to calculate Tax Amount and Total of Discount, Taxable Amount, Tax Amounts and Total Amount.
  //This is similar to the function above.
  function calculatevataxamt(curindex) {
    //Initialising variables to zero and getting values from various input fileds.
    var rowqty = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
    var rowprice = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
    var rowdiscount = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
    var rowtaxrate = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);
    var taxamount = 0.00;
    var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
    var rowtotal = 0.00;
    var totalamount = 0.00;
    var totaltax = 0.00;
    var totaldiscount = 0.00;
    var totaltaxable = 0.00;
    $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.
    taxamount = (rowtaxableamount * rowtaxrate)/100;  //Amount of tax to be applied is found out.
    $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxamount).toFixed(2));
    rowtotal = parseFloat(parseFloat(rowtaxableamount).toFixed(2)) + parseFloat(parseFloat(taxamount).toFixed(2));
    $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));
    //Total of discount, taxable amount, tax amounts and total are found out
    for(var i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
      let looprowdiscount = 0.00;
      if ($("#discountpercent").val() == 16){
        let discountval = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val());
              let taxableval = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(1) input').val())*parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(3) input').val());
              looprowdiscount = (discountval * taxableval)/100;
            }
            else{
                looprowdiscount = parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val());
            }
	    totaldiscount = totaldiscount + looprowdiscount;
	    totaltaxable = totaltaxable + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(5) input').val());
	    tottaxable = totaltaxable;
	    totaltax = totaltax + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(7) input').val());
	    tottax=totaltax;
	    totalamount = totalamount + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(8) input').val());
		if ($("#roundvalue").is(":checked")){
			var res = 	parseFloat(Math.round(totalamount)).toFixed().toString();
			roundoffvalue = 1;
		}
		else{
			var res = totalamount.toString();
			
			roundoffvalue = 0;
		}
	    var str = res.split(".");
	    var len = str[1];
	    if(totalamount!=0){
		if(str[1] != undefined){
		    if(len.length == 1){
			str[1] = str[1]+0;
			numbertowords =convertNumberToWords(parseInt(str[0]))+" "+"Rupees"+" "+"and"+" "+ convertNumberToWords(parseInt(str[1]))+"Paise";
		    }else{
			numbertowords =convertNumberToWords(parseInt(str[0]))+" "+"Rupees"+" "+"and"+" "+ convertNumberToWords(parseInt(str[1]))+"Paise";
		    }
		}else{
		    numbertowords =convertNumberToWords(parseInt(str[0]))+" "+"Rupees";

		}
	    }else{
		numbertowords = "Zero"+" "+ "Rupees";
	    }
	}
	//Total of various columns are displayed on the footer.
	if ($("#discountpercent").val() == 1){
	    $('#discounttotal_product_vat').show().val(parseFloat(totaldiscount).toFixed(2));
	}
	else {
	    $('#discounttotal_product_vat').hide();
	}
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totalinvoicevalue").text(parseFloat(totalamount).toFixed(2));
	$("#totalinvoicevalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
	$("#totalinvoicevaluerounded").text(parseFloat(Math.round(totalamount)).toFixed(2));
		$("#totalValueInWord").text(numbertowords);
		if ($("#roundvalue").is(":checked")){
			$("#roundvaluediv").show();
			$("#totalValueInWord").text(numbertowords);
		}
		else{
			$("#roundvaluediv").hide();
			
		}

}

    $('.invoicedate').autotab('number');  //Focus shifts from fields among date fields.
    $('.supplydate').autotab('number');
    if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
	$(".tinfield").show();
	$(".gstfield").hide();
    } else {
	$(".gstinfield").show();
	$(".vatfield").hide();
    }

    //Delivery Note number select field is hidden when inventory is disabled.
    if(sessionStorage.invflag==0){
	$("#deliverynoterow").hide();
    }

    //Certain fields are hidden in the case of Purchase Invoice. They are shown in Sale Invoice.
    if ($("#status").val() == '15') {  //In/Out flag is saved in a hidden field. 15 is OUT(Sale Invoice) and 9 is IN(Purchase Invoice).
	$(".invoice_issuer").show();  //Issuer Name is shown in Sale Invoice. Purchase Invoice is only recorded, not created by an organisation.	
	$(".fixed-table").removeClass('fixed-tablepurchase');  //CSS class for adjusting style properties.
	$(".fixed-table").addClass('fixed-tablesale');
    }

    if ($("#status").val() == '9') {  
	$(".reversepurchase").show();
    }


    $(".input-sm:visible").first().focus();  //Focus on the first element when the page loads
    //Preventing characters in numeric fields.
    $("#invoice_date").numeric({ negative: false });
    $("#invoice_month").numeric({ negative: false });
    $("#invoice_year").numeric({ negative: false });

    //Key event for select combo of Delivery Note.
    $("#invoice_deliverynote").keydown(function(event) {
	if (event.which == 13) {  //Events triggered when Enter key is pressed down.
	    event.preventDefault();
	    $("#invoice_challanno").focus().select();  //Focus shifts to Invoice Number.
	}
    });

    //Key Event for Invoice Number.
    $("#invoice_challanno").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
		if ($("#status").val()==9){
			$("#invoice_date").focus().select();  //Focus shifts to Invoice Date when Enter key is pressed down.
		}
	    else{
			$("#ewayBill_no").focus().select(); 
		}
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#invoice_deliverynote").focus();  //Focus shifts to Delivery Note field when Up Arrow Key is pressed down.
	}
    });
	// Key event for eway bill no.
	$("#ewayBill_no").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
		$("#invoice_date").focus().select();  //Focus shifts to Invoice Date when Enter key is pressed down.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#invoice_challanno").focus(); 
	}
    });

    //Function to add leading zeros in date and month fields.
    function pad(str, max) { //to add leading zeros in date
	if(str && str!=""){
	    str = str.toString();
	if (str.length == 1) {
	    return str.length < max ? pad("0" + str, max) : str;
	}
	else {
	    return str;
	}
	}
    }

    //Function to add leading numbers in year fields.
    function yearpad(str, max) {
	str = str.toString();
	if (str.length == 1) {
	    return str.length < max ? pad("200" + str, max) : str;
	}
	else if (str.length == 2) {
	    return str.length < max ? pad("20" + str, max) : str;
	}
	else {
	    return str;
	}
    }

    //Padding functions are called on blur events.
    $("#invoice_date").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#invoice_month").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#invoice_year").blur(function(event) {
	$(this).val(yearpad($(this).val(), 4));
	invoicedatestring = $("#invoice_date").val() + $("#invoice_month").val() + $("#invoice_year").val();
	invoicedate = Date.parseExact(invoicedatestring, "ddMMyyyy");
	if (invoicedatestring.length == 0) {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-blank-alert").hide();
	    });
	    $("#invoice_date").focus().select();
	    return false;
	}
	else if (!invoicedate && invoicedatestring.length == 8) {
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-alert").hide();
	    });
	    $("#invoice_date").focus().select();
	    return false;
	}
	else if (invoicedate) {
	    if (!invoicedate.between(financialstart, financialend)) {
		$("#between-date-alert").alert();
		$("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#between-date-alert").hide();
		});
		$('#invoice_date').focus().select();
		return false;
	    }
	    if ($("#invoice_deliverynote option:selected").val() != "") {
		if (Date.parseExact($("#invoice_deliverynote option:selected").attr("dcdate"), "dd-MM-yyyy").compareTo(invoicedate) == 1) {
		    $("#invdc-date-alert").alert();
		    $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#invdc-date-alert").hide();
		    });
		    $('#invoice_date').focus().select();
		    return false;
		}
	    }
	    if (invoicedate >= gstdate) {
		$("#taxapplicabletext").text("GST");
		$("#taxapplicable").val("7");
		$("#invoice_product_table_vat").hide();  //Hides VAT Product table and fields for TIN.
		$("#vathelp").hide();
		$(".tinfield").hide();
		$("#gstproducttable").show();  //Shows GST Product table.
		$(".gstinfield").show();
		$(".gstfield").show();
		$(".vatfield").hide();
	    }
	    else {
		$("#taxapplicabletext").text("VAT");
		$("#taxapplicable").val("22");
		$("#gstproducttable").hide();
		$(".gstinfield").hide();
		$("#invoice_product_table_vat").show();
		$(".tinfield").show();
		$("#vathelp").show();
		$(".gstfield").hide();
		$(".vatfield").show();
	    }
	}
	$("#invoicestate").change();
	});	

    $(document).off("click", '.discflagfield').on("click", '.discflagfield', function(event) {
      let discflag = $(this).data("discflag");
      let disckey;
      if (!$(this).hasClass("active")){
	  $(".discflagfield").toggleClass("active");
      }
      $("#discountpercent").val(discflag);
	if(discflag == 16){
	    disckey = 'discountpercent';
	  $(".discaddon").show();
	  $(".discaddon").siblings().width("80%");
	  $(".discheader").text("Discount %");
      }
	else {
	    disckey = 'discountamount';
	  $(".discaddon").hide();
	  $(".discaddon").siblings().width("100%");
	  $(".discheader").text("Discount Amount");
      }
      let curindex = 0;
	if ($("#taxapplicable").val() == 7) {
	    for (let i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
	      $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) span").data(disckey));
	    }
            curindex = $("#invoice_product_table_gst tbody tr:last").index();
            calculategstaxamt(curindex);
        }
        else {
	    for (let i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
	      $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(4) span").data(disckey));
	    }
            curindex = $("#invoice_product_table_vat tbody tr:last").index();
            calculatevataxamt(curindex);
        }
    });

    //Key Event for Invoice Date Field.
    $("#invoice_date").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#invoice_month").focus().select();  //Focus shifts to Month field
	}
	if (event.which == 38) {
	    event.preventDefault();
		if($("#status").val()==9){
			$("#invoice_challanno").focus().select();  //Focus shifts to Invoice Number.
		}
	    else{
			$("#ewayBill_no").focus().select();  
		}
	}
    });

    //Key Event for Invoice Month field.
    $("#invoice_month").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#invoice_year").focus().select();  //Focus Shifts to Year field.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#invoice_date").focus().select();  //Focus Shifts to Date field.
	}
    });

    //Key Event for Invoice Year field.
    $("#invoice_year").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
		// $("#invoicestate").focus();  //Focus shifts to State of Origin/Delivery.
		if ($("#status").val()  == 15) {
		if ($("#invoice_deliverynote option:selected").val() != '') {			
			if ($("#invoicestate").is(":disabled")){
			if($("#originaddress").is(":disabled")){
				if ($("#originpincode").is(":disabled")){
				$("#invoice_issuer_name").focus().select();
			}
			$("#originpincode").focus().select();
		}
			$("#originaddress").focus().select();
		}
		$("#invoicestate").focus().select();
		}
		else{
		$("#invoicestate").focus().select();
		}
	}
	else{
		if ($("#invoice_deliverynote option:selected").val() != '') {
			if ($("#invoicestate").is(":disabled")){
				if($("#consigneename").is(":disabled")) {
					if ($("#taxapplicable").val() == 7) {
						$(".invoice_product_quantity_gst:first").focus().select();
					}
					else{
						$(".invoice_product_quantity_vat:first").focus().select();
					}
				}
				else{
					$("#consigneename").focus();
				}
		}else{
			$("#invoicestate").focus();
		}
	}else{
		$("#invoicestate").focus();
	}
	}
}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#invoice_month").focus().select();  //Focus shifts to month field.
	}
    });

    //Change Event For State of Origin/Delivery.
    $("#invoicestate").change(function(event) {
	event.preventDefault();
	$("#orggstin").text("");
	$("#statecodeforinvoice").text(pad($("#invoicestate option:selected").attr("stateid"), 2));
	if ($("#taxapplicable").val() == 7){
	    if ($("#invoice_customerstate option:selected").val() == $("#invoicestate option:selected").val()) {
		    $(".igstfield").hide();
		    $(".igstfield").css('border','');
		$(".sgstfield").show();
		taxtype=3;
		} else {
		    $(".sgstfield").hide();
		    $(".sgstfield").css('border','');
		    $(".igstfield").show();
		    taxtype=9;
		}
	    
	}
	$(".product_name_vat, .product_name_gst").change();

	//In create 'sale invoice' if user selected 'state' has address in orgnisation then it will be autopopulated in address field.
	//ajax for autopopulating address for selected state.
	var invstate = $("#invoicestate option:selected").val();
	var invstateid=$("#invoicestate option:selected").attr("stateid");
	if (invstateid && invstateid != "") {
	    $.ajax({
	    url: '/existingorg?type=getaddress',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
	            data : {"invstate" : invstateid},
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
	})
	    .done(function(resp) {
		if (resp["gkstatus"] == 0) {
		    console.log("success");
		    if(invstate == resp["orgdetails"]["orgstate"]){
			$("#originaddress").val(resp["orgdetails"]["orgaddr"]+","+resp["orgdetails"]["orgcity"]+","+resp["orgdetails"]["orgstate"]);
			$("#originaddress").prop("disabled", true);
			}
			else{
				$("#originaddress").prop("disabled", false);
			 }
			 if(invstate == resp["orgdetails"]["orgstate"] && resp["orgdetails"]["orgpincode"] != ""){
				$("#originpincode").val(resp["orgdetails"]["orgpincode"]);
				$("#originpincode").prop("disabled", true);
				 }		
			else{
				$("#originpincode").prop("disabled", false);
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

	//ajax for autopopulating gstin for selected state.
	var gstinstateid=$("#invoicestate option:selected").attr("stateid");
	 if (gstinstateid && gstinstateid != "") {
	     $.ajax({
                    url: '/existingorg?type=getgstin',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
	            data : {"gstinstate" : gstinstateid},
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
         })
	.done(function(resp) {
            if (resp["gkstatus"] == 0) {
		console.log("success");
		$("#orggstin").text(resp["gkresult"]);
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
    $("#invoicestate").change();

    //Key Event for State of Origin/Delivery.

    $("#invoicestate").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#status").val()  == 15) {
		if($("#originaddress").is(":disabled")){
			if ($("#originpincode").is(":disabled")){
		    $("#invoice_issuer_name").focus().select();
		}
		$("#originpincode").focus().select();
	}
		$("#originaddress").focus().select();
	    }
	    else {
		if ($("#invoice_customer").is(":disabled")) {
		    if($("#consigneename").is(":disabled")) {
			if ($("#taxapplicable").val() == 7) {
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    $(".invoice_product_quantity_gst:first").focus().select();
		}
		else {
		    $(".product_name_gst:first").focus().select();  //Focus Shift to Tax Applicable field.
		}
	    }
	    else {
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    $(".invoice_product_quantity_vat:first").focus().select();
		}
		else {
		    $(".product_name_vat:first").focus().select();  //Focus Shift to Tax Applicable field.
		}
	    }
			if(sessionStorage.vatorgstflag == '22' ){
			    $("#tinconsignee").focus();
			}
			else {
			    $("#gstinconsignee").focus(); //Focus shifts to Consignee GSTIN as Consignee Name field is disabled when delivery note is selected. 
			}
		    }
		    else{
			$("#consigneename").focus().select();  //Focus shifts to Consignee Name as Customer's fields are disabled when delivery note is selected.
		    }
		}
		else {
			if($('#custchange.custsupchange').is(':checked')){
				$("#custchange.custsupchange").focus();
			}
			else{
				$("#supchange.custsupchange").focus();
		
			}
		}
	    }
	}
	else if (event.which == 38) {
	    if ($("#invoicestate option:visible").first().is(":selected")) {
		$("#invoice_year").focus();
	    }
	}
    });
    
    // Key Events for Address in sale invoice.
    $("#originaddress").keydown(function(event){
	if(event.which ==13){
	    	    if($("#originaddress").val() == ""){
		$("#address-blank-alert").alert();
		$("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#address-blank-alert").hide();
		});
		$("#originaddress").focus();
		return false;
	    }
	    $("#originpincode").focus().select();
	}
	else if(event.which ==38){
	    $("#invoicestate").focus();
	}
    });


        //Key Event for origin PIN code.
		$("#originpincode").keydown(function(event) {
			if (event.which == 13) {
				event.preventDefault();
				var pincode_val=($("#originpincode").val());
				var reg = /^[0-9]+$/;
				if(pincode_val == ""){
					$("#pin-blank-alert").alert();
					$("#pin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#pin-blank-alert").hide();
					});
					$("#originpincode").focus();
					return false;
				  }

				else if (pincode_val != "") {
		
					 if (!reg.test(pincode_val) || pincode_val.length != 6) {
						$("#pinval-blank-alert").alert();
						$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
						$("#pinval-blank-alert").hide();
						});
						$("#originpincode").focus();
						return false;
						}
				}
					$("#invoice_issuer_name").focus();
			}
			
			else if (event.which == 38) {
				if ($("#originaddress").is(":disabled")){
					$("#invoicestate").focus();
				}
				$("#originaddress").focus().select();  //Focus shifts to TIN of Consignee.
				
		
			}
			});

    //Key Events for Issuer Name.
    $("#invoice_issuer_name").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#invoice_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer.
	}
	else if (event.which == 38) {
	    if($("#originpincode").is(":disabled")){
		$("#invoicestate").focus();
	    }
	    $("#originpincode").focus().select();  //Focus shifts to address.
	}
    });

    //Key Events for Designation of Issuer.
    $("#invoice_issuer_designation").keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#invoice_customer").is(":disabled")) {
		$("#Consignee").focus(); //Focus shifts to Consignee Checkbox when delivernote selected with no consignee details 
	    }
	    if ($("#invoice_customer").is(":disabled")) {
		if($("#consigneename").is(":disabled")){
		    if ($("#taxapplicable").val() == 7) {
			if ($("#invoice_deliverynote option:selected").val() != '') {
			    $(".invoice_product_quantity_gst:first").focus().select();
			}
			else {
			    $(".product_name_gst:first").focus().select();  //Focus Shift to Tax Applicable field.
			}
		    }
		    else {
			if ($("#invoice_deliverynote option:selected").val() != '') {
			    $(".invoice_product_quantity_vat:first").focus().select();
			}
			else {
			    $(".product_name_vat:first").focus().select();  //Focus Shift to Tax Applicable field.
			}
		    }
		}
            }
	    else {
			if($('#custchange.custsupchange').is(':checked')){
				$("#custchange.custsupchange").focus();
			}
			else{
				$("#supchange.custsupchange").focus();
		
			}
	    }
	}
	else if (event.which == 38) {
	    $("#invoice_issuer_name").focus().select();  //Focus shifts to Issuer Name
	}
    });

    //Key Events for Customer fields.
    $("#invoice_customer").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	     if ($.trim($('#invoice_customer option:selected').val()) == "") {
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
		$("#custsup-blank-alert").alert();
		$("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#custsup-blank-alert").hide();
		});
		$('#invoice_customer').focus();
		return false;
	    }
	    $("#invoice_customerstate").focus();  //Focus shifts to Customer State.
	}
	if (event.which == 38) {
	    if ($("#invoice_customer").val() =='-1' || $("#invoice_customer").val()=="") {
		if($('#custchange.custsupchange').is(':checked')){
			$("#custchange.custsupchange").focus();
		}
		else{
			$("#supchange.custsupchange").focus();
	
		}
	    }
	}
	if (event.which == 32) {
	    event.preventDefault();
	    $("#invoice_customer").prop("disabled", true);
	    $('#invoice_addcust').click();  //Hitting space from Customer field opens a popup to add customer.
	}
	});
	$('input:radio[name=csradio]').keydown(function(event) {
			if (event.which == 13) {
				event.preventDefault();
				$("#invoice_customer").focus().select();  //Focus shifts to Designation of Issuer.
			}
			else if (event.which == 38) {
				if ($("#status").val() == 15) {
					$("#invoice_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer.
				}
				else {
					$("#invoicestate").focus();  //Focus Shifts to Invoice State.
				}
			}
			});

    function custSupData(urldata){
		$.ajax({
			type: "POST",
			url: urldata,
			global: false,
			async: false,
			datatype: "json",
			beforeSend: function(xhr) {
			xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			},
		success: function(resp) {
			let custsupdata=resp["customers"]
			var optionsdiv = $("#invoice_customer").closest("div");
			$('#invoice_customer').empty();

			optionsdiv.find('select[style*="display: none"]').empty();
			if($("#status").val()==15){
			$("#invoice_customer").append('<option value="" disabled hidden selected> Select Customer </option>');
			$('#invoice_customer').append("<option value='-1' style='font-family:'FontAwesome','Helvetica Neue', Helvetica, Arial, sans-serif;'>Add Customer </option>");

            optionsdiv.find('select[style*="display: none"]').append('<option value="" disabled hidden selected> Select Customer </option>');
            optionsdiv.find('select[style*="display: none"]').append("<option value='-1' style='font-family:'FontAwesome','Helvetica Neue', Helvetica, Arial, sans-serif;'>Add Customer </option>");

			}
			else{
				$("#invoice_customer").append('<option value="" disabled hidden selected"> Select Supplier</option>');
				$('#invoice_customer').append("<option value='-1' style='font-family:'FontAwesome','Helvetica Neue', Helvetica, Arial, sans-serif;'>Add Supplier </option>");

				optionsdiv.find('select[style*="display: none"]').append("<option value='-1' style='font-family:'FontAwesome','Helvetica Neue', Helvetica, Arial, sans-serif;'>Add Supplier </option>");
				optionsdiv.find('select[style*="display: none"]').append('<option value="" disabled hidden selected> Select Supplier </option>');
			}
			
			for (let i in custsupdata ) {
				$('#invoice_customer').append('<option value="' + custsupdata[i].custid + '">' + custsupdata[i].custname + '</option>');
				optionsdiv.find('select[style*="display: none"]').append('<option value="' + custsupdata[i].custid + '">' + custsupdata[i].custname + '</option>');

			}
		}
		})
		}

		if($("#status").val() == 15){
			$('#custchange.custsupchange').click();
		}
		else{
			$("#supchange.custsupchange").click();
	
		}
	$(document).off("change",".custsupchange").on("change",".custsupchange",function(event) {
		//Checking which radio button is selected.
			if ($("#custchange").is(":checked")) {
				custSupData("/customersuppliers?action=getallcusts");
			
			} else {
				custSupData("/customersuppliers?action=getallsups");

				}
			});

    //Change Event for Customer.
    $("#invoice_customer").change(function(event) {
	$(".product_name_vat, .product_name_gst").change();
	if($("#invoice_customer option:selected").val() != ""){
	if($("#invoice_customer option:selected").val() != "-1"){
	//AJAX to get details of customer.
	$.ajax({
	    url: '/customersuppliers?action=get',
	    type: 'POST',
	    dataType: 'json',
	    async: false,
	    data: { "custid": $("#invoice_customer option:selected").val() },  //Customer ID is sent.
	    beforeSend: function(xhr) {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    }
	})
	    .done(function(resp) {
		console.log("success");
		if (resp["gkstatus"] == 0) {
		    $("#invoice_customerstate").val(resp["gkresult"]["state"]);  //State of Customer is selected automatically.
			$("#invoice_customerstate").change();
			if($("#taxapplicable").val() == "7"){
			$("#invoice_customerstate").empty();
			for (let i in resp["gkresult"]["statelist"]){
				$.each(resp["gkresult"]["statelist"][i], function(k, v) {
				$("#invoice_customerstate").append('<option value="'+v+'" stateid="'+k+'">'+v+'</option>');
				});
				}
			}
			
		    $("#invoice_customeraddr").text(resp["gkresult"]["custaddr"]);  //Adress of Customer is loaded.
		    $("#tin").text(resp["gkresult"]["custtan"]);  //Customer TIN is loaded.
		    $("#accountno").val(resp["gkresult"]["bankdetails"]["accountno"]); //Account Number of supplier loaded
		    $("#branchname").val(resp["gkresult"]["bankdetails"]["branchname"]);   //branchname of supplier is loaded
		    $("#ifsc").val(resp["gkresult"]["bankdetails"]["ifsc"]);           //ifsc code of supplier is loaded
		    $("#bankname").val(resp["gkresult"]["bankdetails"]["bankname"]);   //branchname of supplier is loaded
        //All GSTINs of this customer are
		    gstins = resp["gkresult"]["gstin"];
        if ($("#invoice_customer option:selected").attr("custid") in gstins) {
      	       $("#gstin").text(resp["gkresult"]["gstin"][$("#invoice_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
      	}
      	else {
      	    $("#gstin").text('');  //If GSTIN is not available it is set as blank.
      	}
		    //disable Consignee checkbox when delivery note selected and consignee details present 
		    if($("#invoice_deliverynote option:selected").text()!="" && $("#consigneename").val()!=""){
			$("#Consignee").attr("disabled", true);  }
		    else{
			$("#Consignee").attr("disabled", false); }
		    //GSTIN of customer in default state is selected.
		    $("#gstin").text(resp["gkresult"]["gstin"][$("#invoice_customerstate option:selected").attr("stateid")]);

		    //State Code of Customer State is loaded.
		    $("#statecodeofcustomer").text(pad($("#invoice_customerstate option:selected").attr("stateid"), 2));
		    //Consignee State is synced with Customer State.
		    /*if ($("#status").val() == 15) {
			$("#consigneestate").val(resp["gkresult"]["state"]);
			$("#statecodeofconsignee").text($("#consigneestate option:selected").attr("stateid"));
		    }*/
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
	//Add Supplier or Customer Option
			$(this).prop("disabled", true);
		    $("#invoice_customerstate option:first").prop("selected", true);
			$("#invoice_customerstate").change();
		    $("#accountno").val("");
		    $("#branchname").val("");
		    $("#ifsc").val("");
		    $("#bankname").val("");
		    $("#invoice_customeraddr").text("");
		    $("#tin").text("");
		    $("#gstin").text("");
		//Calling Modal
		$("#invoice_addcust").click();
	}
	}
    });

    //Change event for customer state.
    $("#invoice_customerstate").change(function(event) {
	$("#statecodeofcustomer").text(pad($("#invoice_customerstate option:selected").attr("stateid"), 2));  //State code is loaded.
	if (gstins != null && $("#invoice_customerstate option:selected").attr("stateid") in gstins) {
		$("#gstin").text(gstins[$("#invoice_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
		}
		else {
		$("#gstin").text('');  //If GSTIN is not available it is set as blank.
		}
	if ($("#taxapplicable").val() == 7) {
	    if ($("#invoice_customerstate option:selected").val() == $("#invoicestate option:selected").val()) {
		$(".igstfield").hide();
		$(".sgstfield").show();
	    }
	    else {
		$(".sgstfield").hide();
		$(".igstfield").show();
	    }
	}
	$(".product_name_vat, .product_name_gst").change();
    });
	$("#invoice_customerstate").change();

    //Key down event for Customer State.
    $("#invoice_customerstate").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	     if($("#status").val()==15){
		 $("#Consignee").focus().select();  //Focus Shifts to consignee checkbox when sale invoice
	    }else{
		$("#consigneename").focus();   //Focus Shifts to consigneename when purchase invoice
	    }
	}
	if (event.which == 38) {
	    if ($("#invoice_customerstate option:visible").first.is(":selected")) {
		$("#invoice_customer").select();  //Focus shifts to Customer.
	    }
	}
    });
  //key down event for consignee checkbox
     $("#Consignee").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if($("#Consignee").prop('checked') == true) {
		if ($("#taxapplicable").val() == 7) {
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    $(".invoice_product_quantity_gst:first").focus().select();
		}
		else {
		    $(".product_name_gst:first").focus().select();  //Focus Shift to Tax Applicable field.
		}
	    }
	    else {
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    $(".invoice_product_quantity_vat:first").focus().select();
		}
		else {
		    $(".product_name_vat:first").focus().select();  //Focus Shift to Tax Applicable field.
		}
	    }
		
	    }else{
		$("#consigneename").focus().select();  //Focus Shifts to Consignee Name.
	    }
	}
	if (event.which == 38) {
	    if ($("#invoice_customerstate").is(":disabled")) {
		if ($("#status").val() == 15) {
		    $("#invoice_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer in Sale Invoice if Delivery Note is selected.
		}
		else {
		    $("#invoicestate").focus();  //Focus Shifts to Invoice State in Purchase Invoice if Delivery Note is selected.
		}
	    }
	    else {
		$("#invoice_customerstate").focus();  //Focus shifts to Customer State.
	    }
	}
    });

    //Change event for Consignee State.
    $("#consigneestate").change(function(event) {
	event.preventDefault();
	$("#statecodeofconsignee").text(pad($("#consigneestate option:selected").attr("stateid"), 2));  //State code of consignee is loaded.
	$(".product_name_vat, .product_name_gst").change();
    });
    $("#consigneestate").change();

    //Key down event for Consignee Name.
    $("#consigneename").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#consigneestate").focus();
	}
	else if (event.which == 38) {
	    $("#Consignee").focus();
	}
    });

    //Key Event for Consignee State
    $("#consigneestate").keydown(function(event) {
	if (event.which == 13) {
	    if ($("#tinconsignee").is(":visible")) {
		$("#tinconsignee").focus().select();  //Focus shifts to TIN of Consignee.
	    }
	    else {
		$("#gstinconsignee").focus().select();  //Focus shifts to GSTIN of Consignee.
	    }
	}
	else if (event.which == 38) {
	    if ($("#consigneestate option:visible").first().is(":selected")) {
		$("#consigneename").focus().select();  //Focus Shifts to Consignee Name.
	    }
	}
    });

    //Key Event for Consignee TIN.
    $("#tinconsignee").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    /*if ($("#gstinconsignee").is(":visible")) {
		$("#gstinconsignee").focus().select();  //Focus shifts to GSTIN of Consignee.
		}*/
	    if ($("#taxapplicable").val() == 22) {
		if ($("#consigneename").is(":disabled")){
		   $(".invoice_product_quantity_vat:first").focus().select(); 
		} else {
		    $("#consigneeaddress").focus().select();  //Focus Shift to Address of Consignee.
		}
	    }
	}
	else if (event.which == 38) {
	    if ($("#consigneestate").is(":disabled")){
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    if($("#status").val() == 15){
			 $("#invoice_issuer_designation").focus().select();
		    } else {
			$("#invoicestate").focus().select();
		    }
		} 
	    } else {
		    $("#consigneestate").focus().select();  //Focus shifts to GSTIN of Consignee.
	    }
	}
    });

    //Key Event for Consignee GSTIN.
    $("#gstinconsignee").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#taxapplicable").val() == 7) {
		if ($("#consigneename").is(":disabled")){
		    $(".invoice_product_quantity_gst:first").focus().select();
		} else {
		    $("#consigneeaddress").focus().select();  //Focus Shift to Address of Consignee.
		}
	    }
	}
	else if (event.which == 38) {
	    if ($("#consigneestate").is(":disabled")){
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    if($("#status").val() == 15){
			 $("#invoice_issuer_designation").focus().select();
		    } else {
			$("#invoicestate").focus().select();
		    }
		} 
	    } else {
		    $("#consigneestate").focus().select();  //Focus shifts to GSTIN of Consignee.
	    }
	}
    });


	//Key Event for Consignee State
	$("#consigneeaddress").keydown(function(event) {
		if (event.which == 13) {
			$("#consigneepincode").focus().select();  //Focus shifts to pincode of Consignee.
		}
		else if (event.which == 38) {
			if ($("#tinconsignee").is(":visible")) {
				$("#tinconsignee").focus().select();  //Focus shifts to TIN of Consignee.
				}
				else {
				$("#gstinconsignee").focus().select();  //Focus shifts to GSTIN of Consignee.
				}
		}
		});
    //Key Event for Consignee pincode.
    $("#consigneepincode").keydown(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			var pincode_val=($("#consigneepincode").val());
			var reg = /^[0-9]+$/;
			  if (pincode_val != "") {
	
				 if (!reg.test(pincode_val) || pincode_val.length != 6) {
				$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
					$("#pinval-blank-alert").alert();
					$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#pinval-blank-alert").hide();
					});
					$("#consigneepincode").focus();
					return false;
					}
			}
			if ($("#taxapplicable").val() == 7) {
			if ($("#invoice_deliverynote option:selected").val() != '') {
				$(".invoice_product_quantity_gst:first").focus().select();
			}
			else {
				$(".product_name_gst:first").focus().select();  //Focus Shift to Tax Applicable field.
			}
			}
			else {
			if ($("#invoice_deliverynote option:selected").val() != '') {
				$(".invoice_product_quantity_vat:first").focus().select();
			}
			else {
				$(".product_name_vat:first").focus().select();  //Focus Shift to Tax Applicable field.
			}
			}
			$('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'fast');
		}
		else if (event.which == 38) {
			$("#consigneeaddress").focus();  //Focus shifts to address of Consignee.
		}
		});
    //When focus is on an element which has numtype class entering characters and negative integers is disabled.
    $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
	event.preventDefault();
	/* Act on the event */
	$(".numtype").numeric({ negative: false });
    });


    //When an element of numtype looses focus and is blank it is set to 0.00.
    $(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
	event.preventDefault();
	/* Act on the event */
	if ($(this).val() == "") {
	    $(this).val(parseFloat(0).toFixed(2));
	} else {
	    $(this).val(parseFloat($(this).val()).toFixed(2));
	}
    });
    $(document).off("change",".gstin").on("change",".gstin",function(event) {
        var curindex = $(this).closest('tr').index();
        var gstin = $(this).val();
        var gstnint = parseInt(gstin[0] + gstin[1]);
        if (gstin != ""){
	    if(!($.isNumeric(gstnint)) || gstnint > 37 || gstnint < 0 || gstin.length !=15){
            $("#gstin-improper-alert").alert();
            $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#gstin-improper-alert").hide();
                $('#gstinconsignee').focus().select();
            });
            return false;
        }
	}
    });

    //VAT Table events start here

    //Change event for Product Name.
    $(document).off('change', '.product_name_vat').on('change', '.product_name_vat', function(event) {
	event.preventDefault();
	/* Act on the event */
	$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
	var productcode = $(this).find('option:selected').val();
	var curindex = $(this).closest('tbody tr').index();
    var destinationstate = "";
      var sourcestate = "";
      if ($("#status").val() == 9) {
	  destinationstate = $("#invoicestate option:selected").val();
	  sourcestate = $("#invoice_customerstate").val();
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#invoicestate option:selected").val();
	  destinationstate = $("#invoice_customerstate").val();
      }
	var taxflag=$("#taxapplicable").val();
	if (productcode != "") {
	    $.ajax({
        url: '/invoice?action=getappliedtax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: { "productcode": productcode, "source": sourcestate,"destination":destinationstate,"taxflag":taxflag },
        beforeSend: function(xhr) {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
       .done(function(resp) {
         if (resp["gkstatus"] == 0) {
	     if ('VAT' in resp['tax'] && editflag == false) {
		 $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['VAT']).toFixed(2));
	     }
	     else if ('CVAT' in resp['tax'] && editflag == false) {
                 $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['CVAT']).toFixed(2));
             }
         }
	  else if (resp["gkstatus"] == 1 && editflag == false) {
	      $("#notax-alert").alert();
	      $("#notax-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#notax-alert").hide();
	      });
	  }
       })
       .fail(function() {
           console.log("error");
       })
       .always(function() {
         console.log("complete");
       });
    $.ajax({
      url: '/invoice?action=getproduct',
      type: 'POST',
      dataType: 'json',
      async: false,
      data: { "productcode": productcode , "custid":$("#invoice_customer").val(), "inoutflag":$("#status").val() },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       console.log("success");
       if (resp["gkstatus"] == 0) {
           $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) span').text(resp["unitname"]); //Unit for Quantity
           $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]); //Unit for Free Quantity
	   $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodsp", resp["prodsp"]);
	   $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodmrp", resp["prodmrp"]);
	   $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodlp", resp["prodlp"]);
	   $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) span').data("discountamount", resp["discountamount"]);
	   $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) span').data("discountpercent", resp["discountpercent"]);
	   if(!editflag && $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val() == 0){
	       if ($("#discountpercent").val() == 16){
		   $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val(resp["discountpercent"]);
	       }
	       else {
		   $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val(resp["discountamount"]);
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
	else {
	    $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
	    $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) span').text("");
           $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) span').text("");
	}
    });
    var modalpresent = 0;
    var productmodal = 0;
  $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	event.preventDefault();
	if (modalpresent == 0 && productmodal == 0) {
	      $("#invoice_save").click();
	  }
          else if (productmodal != 0) {
              $("#apsubmit").click();
          }
	  else if (modalpresent != 0) {
	      $("#cussup_save").click();
	  }
      return false;
    }
  });
    $("#invoice_deliverynote").change(function(event) {
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    var deliverydate = $("#invoice_deliverynote option:selected").attr("dcdate");
	    $("#supply_date").val(deliverydate[0] + deliverydate[1]).prop("disabled", true);
	    $("#supply_month").val(deliverydate[3] + deliverydate[4]).prop("disabled", true);
	    $("#supply_year").val(deliverydate[6] + deliverydate[7] + deliverydate[8] + deliverydate[9]).prop("disabled", true);
	    $.ajax({
		url: '/invoice?action=getdeliverynote',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "dcid": $("#invoice_deliverynote option:selected").val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
		.done(function(resp) {
		    if (resp["gkstatus"] == 0) {
				$(".custsupchange").prop("disabled", false);
			if(resp["delchal"]["custSupDetails"]["csflag"]==3){
				$("#custchange.custsupchange").click();
				$(".custsupchange").prop("disabled", true);
			}
			if(resp["delchal"]["custSupDetails"]["csflag"]==19){
				$("#supchange.custsupchange").click();
				$(".custsupchange").prop("disabled", true);
			}
			$("#invoice_customer").val(resp["delchal"]["custSupDetails"]["custid"]);
			$("#invoice_customer").prop("disabled", true);
			$("#invoicestate").prop("disabled", true);
			$("#invoice_customerstate").prop("disabled", true);
			if(resp["delchal"]["delchaldata"]["consignee"]){
			    $("#consigneename").val(resp["delchal"]["delchaldata"]["consignee"]["consigneename"]).prop("disabled", true);
			    $("#consigneestate").val(resp["delchal"]["delchaldata"]["consignee"]["consigneestate"]).prop("disabled", true);
			    $("#consigneepincode").val(resp["delchal"]["delchaldata"]["consignee"]["consigneepincode"]).prop("disabled", true);
			    $("#consigneeaddress").val(resp["delchal"]["delchaldata"]["consignee"]["consigneeaddress"]).prop("disabled", true);
			    $("#gstinconsignee").val(resp["delchal"]["delchaldata"]["consignee"]["gstinconsignee"]).prop("disabled", true);
			    $("#tinconsignee").val(resp["delchal"]["delchaldata"]["consignee"]["tinconsignee"]).prop("disabled", true);	
			} else {
			    $("#consigneename").val("").prop("disabled", false);
			    $("#consigneestate").val("Andaman and Nicobar Islands").prop("disabled", false);
				$("#consigneeaddress").val("").prop("disabled", false);
			    $("#consigneepincode").val("").prop("disabled", false);				
			    $("#gstinconsignee").val("").prop("disabled", false);
			    $("#tinconsignee").val("").prop("disabled", false);
			}
			$("#consigneestate").change();
			$.ajax({
			    url: '/customersuppliers?action=get',
			    type: 'POST',
			    dataType: 'json',
			    async: false,
			    data: { "custid": $("#invoice_customer option:selected").val() },
			    beforeSend: function(xhr) {
				xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			    }
			})
			    .done(function(resp) {
				console.log("success");
				if (resp["gkstatus"] == 0) {
				    $("#invoice_customer").change();
				    $("#invoice_supplierstate").val(resp["gkresult"]["state"]);
				    $("#invoice_customeraddr").val(resp["gkresult"]["custaddr"]);
				    $("#invoice_supplieraddr").val(resp["gkresult"]["custaddr"]);
				    $("#invoice_customertin").val(resp["gkresult"]["custtan"]);
					$("#invoice_suppliertin").val(resp["gkresult"]["custtan"]);
				    //disable Consignee checkbox when delivery note selected and consignee details present 
				    if($("#invoice_deliverynote option:selected").text()!="" && $("#consigneename").val()!=""){
					$("#Consignee").attr("disabled", true);  }
				    else{
					$("#Consignee").attr("disabled", false); }
				}
			    })
			    .fail(function() {
				console.log("error");
			    })
			    .always(function() {
				console.log("complete");
			    });
			$('#invoice_product_table_vat tbody').empty();
			$('#invoice_product_table_gst tbody').empty();
			$('#invoice_product_table_total tbody').empty();

			if(resp["delchal"]["delchaldata"]["inoutflag"] == 15){
			if(sessionStorage.vatorgstflag == '7'){
				$("#invoice_customerstate").append('<option value="'+resp["delchal"]["destinationstate"]+'" stateid="'+resp["delchal"]["taxstatecode"]+'">'+resp["delchal"]["destinationstate"]+'</option>');
			}
				$("#invoice_customerstate").val(resp["delchal"]["destinationstate"]);
				$("#invoice_customerstate").change();
			}
			else{
				if(sessionStorage.vatorgstflag == '7'){
				$("#invoice_customerstate").append('<option value="'+resp["delchal"]["sourcestate"]+'" stateid="'+resp["delchal"]["sourcestatecode"]+'">'+resp["delchal"]["sourcestate"]+'</option>');
				}
				$("#invoice_customerstate").val(resp["delchal"]["sourcestate"]);
				$("#invoice_customerstate").change();
			}
			var totqty = 0;
			$.ajax({
			    url: '/invoice?action=getdelinvprods',
			    type: 'POST',
			    dataType: 'json',
			    async: false,
			    data: {"dcid": $("#invoice_deliverynote option:selected").val()},
			    beforeSend: function(xhr) {
				xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			    }
			})
			    .done(function(resp) {
				console.log("success");
				if (resp["gkstatus"] == 0) {
				    // if($("#invoice_product_table_vat").is(":not(:hidden)")){
				    $.each(resp.items, function(key, value) {
					$('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
					$('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
					$('#invoice_product_table_vat tbody tr:last td:first select').val(key).prop("disabled", true);
					$('#invoice_product_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
					$('#invoice_product_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
					$('#invoice_product_table_vat tbody tr:last td:eq(1) span').text(value.unitname);
					$('#invoice_product_table_vat tbody tr:last td:eq(2) span').text(value.unitname);
				    });
				    var productcode;
				    $.each(resp.items, function(key, value) {
					$('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
					$('#invoice_product_table_gst tbody tr:last td:first select').val(key).prop("disabled", true);
					$('#invoice_product_table_gst tbody tr:last td:eq(1) label').html(value.gscode);
					$('#invoice_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2));
					$('#invoice_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
					$('#invoice_product_table_gst tbody tr:last td:eq(2) span').text(value.unitname);
					$('#invoice_product_table_gst tbody tr:last td:eq(3) span').text(value.unitname);
					$('.invoice_product_quantity_gst').numeric({ negative: false });
					$('.invoice_product_per_price_gst').numeric({ negative: false });
					$("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
					$('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				    });
				    $(".product_name_gst, .product_name_vat, #invoicestate").change();
				}

			    });
		    }
		});
	}
	else {
		$(".custsupchange").prop("disabled", false);
		$("#invoicestate").prop("disabled", false);
	    $('#invoice_product_table_vat tbody').empty();
	    $('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	    $('#invoice_product_table_gst tbody').empty();
	    $('#invoice_product_table_total tbody').empty();
	    $('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
	    $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	    $(".product_name_gst, .product_name_vat, #invoicestate").change();
	    $(".custfield, .consigneefield, .supplydate").prop("disabled", false);
	    $("input.delreset").val("");
	    $("#invoice_customer").val("").change();
	    $("#invoice_customerstate option:first").prop("selected", true).change();
	    $("#consigneestate option:first").prop("selected", true).change();
	}
    });

//VAT events start here
  $(document).off("keydown", ".product_name_vat").on("keydown", ".product_name_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(0) select').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex == 0) {
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      } else {
          $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(6) input').focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();
    }
      else if (event.which == 27) {
	  $("#chkpaymentmode").focus();
      }
      else if (event.which == 32){
          event.preventDefault();
          $(this).prop("disabled", true);
          $("#invoice_addproduct").click();
      }
  });

    $(document).off('change', '.invoice_product_quantity_vat').on('change', '.invoice_product_quantity_vat', function(event) {
		event.preventDefault();
        /* Act on the event */
        var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
        if ($('.invoice_product_quantity_vat:eq(' + curindex + ')').val() == "") {
            $('.invoice_product_quantity_vat:eq(' + curindex + ')').val(0);
        }
        if ($("#invoice_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($(this).attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          $(this).val($(this).attr("data"));
          $(this).focus();
          return false;
	    }
	}
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_quantity_vat").on("keydown", ".invoice_product_quantity_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
	event.preventDefault();
	calculatevataxamt(curindex);
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($(this).attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          $(this).val($(this).attr("data"));
          $(this).focus();
          return false;
	    }
	}
	$('#invoice_product_table_vat tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
	event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(1) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(1) input').focus();
      }
      if (curindex == 0) {
          event.preventDefault();
	  if($("#consigneeaddress").is(":disabled")) {
	      $("#tinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
    }
    else if (event.which == 27) {
	$("#chkpaymentmode").focus();
    }
  });

  $(document).off('change', '.invoice_product_freequantity_vat').on('change', '.invoice_product_freequantity_vat', function(event) {
      event.preventDefault();
      if ($('.invoice_product_freequantity_vat:eq(' + curindex + ')').val() == "") {
          $('.invoice_product_freequantity_vat:eq(' + curindex + ')').val(0);
      }
      var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
      calculatevataxamt(curindex);
      var quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
      if (parseFloat(quantity) === 0.00) {
	  $("#quantity-blank-alert").alert();
	  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $("#quantity-blank-alert").hide();
	  });
	  $("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").focus().select();
	  return false;
      }
      if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
  });


  $(document).off("keydown", ".invoice_product_freequantity_vat").on("keydown", ".invoice_product_freequantity_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").focus().select();
	      return false;
	  }
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
	$("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(2) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(2) input').focus();
      }
      if (curindex == 0) {
          event.preventDefault();
	  if($("#consigneeaddress").is(":disabled")) {
	      $("#tinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	$("#chkpaymentmode").focus();

      }
  });

  $(document).off('change', '.invoice_product_per_price_vat').on('change', '.invoice_product_per_price_vat', function(event) {
      event.preventDefault();
      if ($('.invoice_product_per_price_vat:eq(' + curindex + ')').val() == "") {
          $('.invoice_product_per_price_vat:eq(' + curindex + ')').val(0);
      }
      var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
      if (parseFloat($(this).val()) == 0 && parseFloat($('.invoice_product_quantity_vat:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_vat:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_per_price_vat").on("keydown", ".invoice_product_per_price_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if (parseFloat($(this).val()) == 0 && parseFloat($('.invoice_product_quantity_vat:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_vat:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
	$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(3) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(3) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          if($("#consigneeaddress").is(":disabled")) {
	      $("#tinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
     	      $("#chkpaymentmode").focus();

    }
      else if (event.which == 84) {
	  event.preventDefault();
	  if ($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text() == 'O') {
	      if ($("#status").val() == 15) {
		  $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text('S');
		  $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodsp"));
	      }
	      else {
		  $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text('L');
		  $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodlp"));
	      }
	  }
	  else if ($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text() == 'M') {
	      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text('O');
	      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodop"));
	  }
	  else if ($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text() == 'S') {
	      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text('L');
	      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodlp"));
	  }
	  else if ($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text() == 'L') {
	      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').text('M');
	      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) span').data("prodmrp"));
	  }
      }
  });

    $(document).off('change', '.invoice_product_discount_vat').on('change', '.invoice_product_discount_vat', function(event) {
        event.preventDefault();
        if ($('.invoice_product_discount_vat:eq(' + curindex + ')').val() == "") {
            $('.invoice_product_discount_vat:eq(' + curindex + ')').val(0);
        }
	var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
	if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	}
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_discount_vat").on("keydown", ".invoice_product_discount_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	}
	$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(4) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(4) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          if($("#consigneeaddress").is(":disabled")) {
	      $("#tinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
     	$("#chkpaymentmode").focus();
   }
  });


  $(document).off('change', '.invoice_product_tax_rate_vat').on('change', '.invoice_product_tax_rate_vat', function(event) {
      event.preventDefault();
      var curindex1 = $(this).closest('tr').index();
      if ($('.invoice_product_tax_rate_vat:eq(' + curindex1 + ')').val() == "") {
          $('.invoice_product_tax_rate_vat:eq(' + curindex1 + ')').val(0);
      }
      if ($('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").focus().select();
	      return false;
	  }
      if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	  if (parseFloat($('.invoice_product_per_price_vat').val()) == 0 && parseFloat($('.invoice_product_quantity_vat:eq(' + curindex1 + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	}
    calculatevataxamt(curindex1);

  });

  $(document).off("keydown", ".invoice_product_tax_rate_vat").on("keydown", ".invoice_product_tax_rate_vat", function(event) {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1 + 1;
    var previndex1 = curindex1 - 1;

    if (event.which == 27) {
      event.preventDefault();
	calculatevataxamt(curindex1);
	$("#chkpaymentmode").focus();
    } else if (event.which == 13) {
	event.preventDefault();
	calculatevataxamt(curindex1);
      if (curindex1 != ($("#invoice_product_table_vat tbody tr").length - 1)) {//Not a last row.
        if ($('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').is(":disabled")) {
		$('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(1) input').focus().select();
	    }
	    else{
		$('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
	    }
      } else {//Last row along with additional conditions.
        if ($('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").focus().select();
	      return false;
	  }
	  if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	  }
	  if (parseFloat($('.invoice_product_per_price_vat').val()) == 0 && parseFloat($('.invoice_product_quantity_vat:eq(' + curindex1 + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	  if ($('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){
	      if($("#invoice_deliverynote").val() == ""){
		  $('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
		  if($("#discountpercent").val() == 16){
		      $(".discaddon").show();
		      $(".discaddon").siblings().width("80%");
		  }
		  else {
		      $(".discaddon").hide();
		      $(".discaddon").siblings().width("100%");
		  }
		  $('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
		  for (let i = 0; i <= curindex1; i++) {
		      var selectedproduct = $("#invoice_product_table_vat tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
		      $("#invoice_product_table_vat tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
		  }
		  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
		  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change().removeClass("searchifiedselect").searchify();
		  setTimeout( function() { $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus(); }, 25 );
	      }
	      else {
		  $("#chkpaymentmode").focus();
	      }
	  }
	  else {
              $("#chkpaymentmode").focus();
	  }
      }
    }else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(4) input').focus().select();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex1 > -1) {
        event.preventDefault();
        $('#invoice_product_table_vat tbody tr:eq(' + previndex1 + ') td:eq(4) input').focus().select();
      }
      if (curindex1 == 0) {
        event.preventDefault();
          if($("#consigneeaddress").is(":disabled")) {
	      $("#tinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 190 && event.ctrlKey) {
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
      event.preventDefault();
    } else if (event.ctrlKey && event.which == 188) {
      $('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus();
      event.preventDefault();
    } else if (event.which == 27) {
      event.preventDefault();
      $("#invoice_issuer_name").focus().select();
    }
    else if (event.which == 27) {
	$("#chkpaymentmode").focus();
      }
  });

    //GST events start here
    //Change event for Product Name field.
    $(document).off('change', '.product_name_gst').on('change', '.product_name_gst', function(event) {
	event.preventDefault();
	var productcode = $(this).find('option:selected').val();
	var curindex = $(this).closest('tbody tr').index();
	var destinationstate = "";
	var sourcestate = "";

	if(editflag == false){
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(0).toFixed(2));
	}
	
      if ($("#status").val() == 9) {
	  destinationstate = $("#invoicestate option:selected").val();
	  sourcestate = $("#invoice_customerstate").val();
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#invoicestate option:selected").val();
	  destinationstate = $("#invoice_customerstate").val();
      }
    var taxflag=$("#taxapplicable").val();

    if (productcode != "") {
	$.ajax({
            url: '/invoice?action=getappliedtax',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: { "productcode": productcode, "source": sourcestate,"destination":destinationstate,"taxflag":taxflag },
            beforeSend: function(xhr) {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
           .done(function(resp) {
               if (resp["gkstatus"] == 0) {
		   //Loads SGST rate.
		   if('SGST' in resp['tax']  && editflag == false){
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate if avaliable.
		       if ('CESS' in resp['tax']) {
			   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(resp['tax']['CESS']).toFixed(2));
		       }
		   }
		   //Loads IGST rate.
		   else if('IGST' in resp['tax'] && editflag == false){
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(resp['tax']['IGST']).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate.
		       if ('CESS' in resp['tax']) {
			   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(resp['tax']['CESS']).toFixed(2));
		       }
		   }
	       }
	       else if (resp["gkstatus"] == 1 && editflag == false) {
		   $("#notax-alert").alert();
		   $("#notax-alert").fadeTo(2250, 500).slideUp(500, function() {
		       $("#notax-alert").hide();
		   });
	       }
           })
           .fail(function() {
               console.log("error");
           })
           .always(function() {
             console.log("complete");
           });
    $.ajax({
      url: '/invoice?action=getproduct',
      type: 'POST',
      dataType: 'json',
      async: false,
      data: { "productcode": productcode , "custid":$("#invoice_customer").val(), "inoutflag":$("#status").val() },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       console.log("success");
       if (resp["gkstatus"] == 0) {

           $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(1) .invoice_product_hsncode').text(resp["gscode"]);
	   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodsp", resp["prodsp"]);
	   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodmrp", resp["prodmrp"]);
	   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodlp", resp["prodlp"]);
         if (resp["gsflag"]==7){
           $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]);
             $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text(resp["unitname"]);
	     $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", false);
             $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", false);
         }
	   else {
	       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", true).val("0.00");
               $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", true).val("0.00");
	       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text("");
	       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text("");
	   }
	   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) span').data("discountamount", resp["discountamount"]);
	   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) span').data("discountpercent", resp["discountpercent"]);
	   if(!editflag && $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val() == 0){
	       if ($("#discountpercent").val() == 16){
		   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val(resp["discountpercent"]);
	       }
	       else {
		   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val(resp["discountamount"]);
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
	else {
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", false);
            $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", false);
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text("");
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text("");
	}
  });
  $(document).off("keydown", ".product_name_gst").on("keydown", ".product_name_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled")) {
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
	}
	else {
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
	}
    } else if (event.which == 190 && event.shiftKey) {
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(0) select').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
        }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
        } else {
        $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(5) input').focus().select();
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
    }
    else if (event.which == 27) {
	$("#chkpaymentmode").focus();
    }
      else if (event.which == 32){
          event.preventDefault();
          $(this).prop("disabled", true);
          $("#invoice_addproduct").click();
      }
  });

    $(document).off('change', '.invoice_product_quantity_gst').on('change', '.invoice_product_quantity_gst', function(event) {
        event.preventDefault();
      /* Act on the event */
        var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
        if ($('.invoice_product_quantity_gst:eq(' + curindex + ')').val() == "") {
            $('.invoice_product_quantity_gst:eq(' + curindex + ')').val(0);
        }
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(3) input").val());
	    if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($(this).attr("data")).toFixed(2)))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          $(this).val($(this).attr("data"));
          $(this).focus();
          return false;
	    }
	}
      calculategstaxamt(curindex);
  });

  $("#roundvaluediv").hide();
	$("#roundvalue").change(function(e){
		if($("#taxapplicabletext").text() == "GST"){
			$('.invoice_product_quantity_gst').change();
		}
		else{
			$('.invoice_product_quantity_vat').change();
		}
	});

  $(document).off("keydown", ".invoice_product_quantity_gst").on("keydown", ".invoice_product_quantity_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
	event.preventDefault();
	calculategstaxamt(curindex);
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex + ") td:eq(3) input").val());
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($(this).attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          $(this).val($(this).attr("data"));
          $(this).focus();
          return false;
	    }
	}
	$('#invoice_product_table_gst tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
	event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(2) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(2) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          if($("#consigneeaddress").is(":disabled")) {
	      $("#gstinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
    }
      else if (event.which == 27) {
	  $("#chkpaymentmode").focus();
      }
  });

  $(document).off('change', '.invoice_product_freequantity_gst').on('change', '.invoice_product_freequantity_gst', function(event) {
      event.preventDefault();
      if ($('.invoice_product_freequantity_gst:eq(' + curindex + ')').val() == "") {
          $('.invoice_product_freequantity_gst:eq(' + curindex + ')').val(0);
      }
      var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
      if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").val());
      if (parseFloat(quantity) === 0.00) {
	  $("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      return false;
	  }
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
		$("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
          return false;
	    }
	}
      calculategstaxamt(curindex);
  });


  $(document).off("keydown", ".invoice_product_freequantity_gst").on("keydown", ".invoice_product_freequantity_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	var quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
	      return false;
	  }
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(3) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(3) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          if($("#consigneeaddress").is(":disabled")) {
	      $("#gstinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	$("#chkpaymentmode").focus();
      }
  });

  $(document).off('change', '.invoice_product_per_price_gst').on('change', '.invoice_product_per_price_gst', function(event) {
      event.preventDefault();
      if ($('.invoice_product_per_price_gst:eq(' + curindex + ')').val() == "") {
          $('.invoice_product_per_price_gst:eq(' + curindex + ')').val(0);
      }
      var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
      if (parseFloat($(this).val()) == 0 && parseFloat($('.invoice_product_quantity_gst:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_gst:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
      calculategstaxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_per_price_gst").on("keydown", ".invoice_product_per_price_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if (parseFloat($(this).val()) == 0 && parseFloat($('.invoice_product_quantity_gst:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_gst:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(4) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(4) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          if($("#consigneeaddress").is(":disabled")) {
	      $("#gstinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
	event.preventDefault();
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').is(":disabled")) {
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
	}
	else {
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
	}

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      	$("#chkpaymentmode").focus();
    }
      else if (event.which == 84) {
	  event.preventDefault();
	  if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text() == 'O') {
	      if ($("#status").val() == 15) {
		  $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text('S');
		  $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodsp"));
	      }
	      else {
		  $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text('L');
		  $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodlp"));
	      }
	  }
	  else if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text() == 'M') {
	      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text('O');
	      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodop"));
	  }
	  else if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text() == 'S') {
	      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text('L');
	      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodlp"));
	  }
	  else if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text() == 'L') {
	      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').text('M');
	      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) span').data("prodmrp"));
	  }
      }
  });

    $(document).off("change", ".invoice_product_discount_gst").on("change", ".invoice_product_discount_gst", function(event) {
	var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	else{
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	if (parseFloat($('.invoice_product_per_price_gst:eq(' + curindex + ')').val()) == 0 && parseFloat($('.invoice_product_quantity_gst:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	calculategstaxamt(curindex);
    });

$(document).off("keydown", ".invoice_product_discount_gst").on("keydown", ".invoice_product_discount_gst", function(event) {
//write your code here
var curindex1 = $(this).closest('tr').index();
var nextindex1 = curindex1 + 1;
var previndex1 = curindex1 - 1;
if (event.which == 13) {
    event.preventDefault();
    if (curindex1 != ($("#invoice_product_table_gst tbody tr").length - 1)) {//Not a last row.
	if ($('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').is(":disabled")) {
	    $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(2) input').focus().select();
	}
	else{
	    $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
	}
    } else {//Last row.
	//Validations
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
	    $("#product-blank-alert").alert();
	    $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#product-blank-alert").hide();
	    });
	    $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
	    return false;
	}
	var quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(3) input").val());
	if (parseFloat(quantity) === 0.00 && $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
	    $("#quantity-blank-alert").alert();
	    $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#quantity-blank-alert").hide();
	    });
	    $("#invoice_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(3) input").focus().select();
	    return false;
	}
	if ($("#invoice_deliverynote option:selected").val() != '') {
	    if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2)))  && $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		$("#quantity-exceed-alert").alert();
		$("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#quantity-exceed-alert").hide();
		});
		return false;
	    }
	}
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_vat:eq(" + curindex1 + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	else{
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').val()).toFixed(2))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_vat:eq(" + curindex1 + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	if (parseFloat($('.invoice_product_per_price_gst:eq(' + curindex1 + ')').val()) == 0 && parseFloat($('.invoice_product_quantity_gst:eq(' + curindex1 + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){
	    if ($("#invoice_deliverynote").val() == ""){
		$('#invoice_product_table_gst tbody').append('<tr>' + gsthtml + '</tr>');
		if($("#discountpercent").val() == 16){
		    $(".discaddon").show();
		    $(".discaddon").siblings().width("80%");
		}
		else {
		    $(".discaddon").hide();
		    $(".discaddon").siblings().width("100%");
		}
		$("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
		$('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
		for (let i = 0; i <= curindex1; i++) {
		    var selectedproduct = $("#invoice_product_table_gst tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
		    $("#invoice_product_table_gst tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
		}
		$('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
		$("#invoicestate").change();
		$('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change().removeClass("searchifiedselect").searchify();
		setTimeout( function() { $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus(); }, 25 );
	    }
	    else {
		$("#chkpaymentmode").focus();
	    }
	}
	else {
	    $("#chkpaymentmode").focus();
	}
    }
}
    else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(5) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex1 > -1) {
        event.preventDefault();
        $('#invoice_product_table_gst tbody tr:eq(' + previndex1 + ') td:eq(5) input').focus();
      }
      if (curindex1 == 0) {
        event.preventDefault();
          if($("#consigneeaddress").is(":disabled")) {
	      $("#gstinconsignee").focus().select();
	  } else {
	      $("#consigneeaddress").focus().select();
	  }
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();

    } else if (event.which == 27) {
      event.preventDefault();
     	$("#chkpaymentmode").focus();
    }
});

    //GST events end here

    $(document).off("click", ".product_del").on("click", ".product_del", function(event) {
	event.preventDefault();
	var curindex = $(this).closest('tr').index();
	var nextindex = curindex + 1;
	var previndex = curindex - 1;
	if ($("#invoice_product_table_vat tbody tr").length > 1) {
	    $(this).closest('tr').fadeOut(200, function() {
		$(this).closest('tr').remove(); //closest method gives the closest element productified
		$("#invoice_product_table_vat tbody tr:first td:eq(0) select").focus();
		calculatevataxamt(curindex);
	    });
	    if ($("#invoice_product_table_vat tbody tr").length == 1) {
		$("#invoice_product_table_vat tbody tr:first td:eq(9) a.product_del").remove();
	    }
	}
	if ($("#invoice_product_table_gst tbody tr").length > 1) {
	    $(this).closest('tr').remove();
	    $("#invoice_product_table_gst tbody tr:eq("+curindex+")").remove();
	    $("#invoice_product_table_gst tbody tr:first td:eq(0) select").focus();
	    calculategstaxamt(curindex);
	    if ($("#invoice_product_table_gst tbody tr").length == 1) {
		$("#invoice_product_table_total tbody tr:first td:last a.product_del").remove();
	    }
	}
    });

    //Click event for Plus Button that triggers creation of a new row.
    $(document).off("click", ".product_add").on("click", ".product_add", function(event) {
	event.preventDefault();
	var curindex = $(this).closest('tr').index();
	var jqEvent = jQuery.Event("keydown");
	jqEvent.which = 13; // # Some keycode value
	if ($("#invoice_product_table_gst tbody tr:eq(" + curindex + ")").find("input:not(:disabled)").last().is(":visible")) {
	    $("#invoice_product_table_gst tbody tr:eq(" + curindex + ")").find("input:not(:disabled)").last().trigger(jqEvent);
	}
	else{
	    $("#invoice_product_table_vat tbody tr:eq(" + curindex + ")").find("input:not(:disabled)").last().trigger(jqEvent);
	}
    });

    //Vehicle Number is to be entered only when Transportation Mode is Road.
    $("#transportationmode").change(function(event){
	if ($(this).val() == 'Road') {
	    $("#vehiclenodiv").show();
	}
	else {
	    $("#vehiclenodiv").hide();
	}
    });
    $("#transportationmode").change();

    $("#supply_date").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#supply_month").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#supply_year").blur(function(event) {
	$(this).val(yearpad($(this).val(), 4));
	var supplydatestring = $("#supply_date").val() + $("#supply_month").val() + $("#supply_year").val();
	if ((supplydatestring.length == 8) && (!Date.parseExact(supplydatestring, "ddMMyyyy"))) {
	    $("#supplydate-alert").alert();
	    $("#supplydate-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#supplydate-alert").hide();
	    });
	    $('#supply_date').focus().select();
	    return false;
	}
	var supplydate = Date.parseExact(supplydatestring, "ddMMyyyy");
	if (supplydate) {
	    if (invoicedate) {
		if (supplydate < invoicedate) {
		    $("#supply-date-alert").alert();
		    $("#supply-date-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#supply-date-alert").hide();
		    });
		    $('#supply_date').focus().select();
		    return false;
		}
	    }
	}

    });

    //Events for last fields - Bank Details, Reverse charge etc..
    $(document).off("keydown", ".lastfield:visible").on("keydown", ".lastfield:visible", function(event) {
	var n = $(".lastfield:visible").length;
	var f = $('.lastfield:visible');
	if (event.which == 13)
	{
	    event.preventDefault();
	    var nextIndex = f.index(this) + 1;
	    if($(".lastfield:visible").eq(nextIndex).is(":disabled")) {
		nextIndex = nextIndex + 3;
	    }
	    if(nextIndex < n){
		f[nextIndex].focus();
	    }
	    else if (nextIndex == n) {
		$("#invoice_save").focus().click();
	    }
	}
	else if (event.which == 38) {
	    var previndex = f.index(this) - 1;
	     if($(".lastfield:visible").eq(previndex).is(":disabled")) {
		previndex = previndex - 3;
	    }
	    
	    if(previndex > -1) {
		if ($(this).is("select")) {
		    if ($(this).val() == "Road") {
			f[previndex].focus();
		    }
		}
		else {
		    f[previndex].focus();
		}
	    }
	    else if (previndex == -1) {
		if ($("#taxapplicable").val() == 7) {
		    $(".invoice_product_discount_gst:last").focus().select();
		}
		else {
		    $(".invoice_product_discount_vat:last").focus().select();
		}
	    }
	}
    });

    $("#rev2radio").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#invoice_save").focus();
	}
    });

    var invoicedata = {};
    // Change event for list of invoices.
    $("#invselect").change(function(event) {
        /* Act on the event */
	// Consignee flag is set to false.
	consigneeflag = false;
	editflag = true;
	$("#invoice_save").hide();
	$("#invoice_addcust, #invoice_addproduct").hide();
	$("#img_label").hide();
	$("#attachlabel").hide();
	$("#invoice_edit").show();
        var invid = $("#invselect option:selected").val();
	// If an invoice is selected its details are fetched.
        if (invid != "") {
	    $.ajax(
		{
		    type: "POST",
		    url: "/invoice?action=getinvdetails",
		    global: false,
		    async: false,
		    data: {"invid": invid},
		    datatype: "json",
		    beforeSend: function(xhr)
		    {
			xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		    },
		    success: function(resp)
		    {
			if(resp.gkstatus == 0){
			    // Div that has all fields of invoice is shown.
				$("#invdetailsdiv").show();
			    // All fields are disabled until Edit button is clicked.
			    $('.editdis').val("");
				$(".editdis").prop("disabled", true);
				$(".borderdiv").height($("#maindiveditinv").height());	
			    // Div with buttons is shown.
			    $("#buttonsdiv").show();
			    // Checks if there are any attachments and enables/disables viewattachment function.
			    if(parseInt(resp.invoicedata.attachmentcount) > 0){
				$("#viewattach").show();
			    }
			    else {
				$("#viewattach").hide();
			    }
			    // Hides print button in purchase.
			    if ($("#status").val() == '9') {
				$("#invoice_edtprint").hide();
			    }
			    else {
				$("#invoice_editprint").show();
			    }
			    $("#discountpercent").val(resp.invoicedata.discflag);
			    if(resp.invoicedata.discflag == 16){
				$(".discaddon").show();
				$(".discaddon").siblings().width("80%");
				$(".discheader").text("Discount %");
			    }
			    else {
				$(".discaddon").hide();
				$(".discaddon").siblings().width("100%");
				$(".discheader").text("Discount Amount");
			    }
			    // Loads delivery note data if any.
			    if(resp.invoicedata.dcid){
				delchalproducts = [];
				$.ajax({
				    url: '/invoice?action=getdeliverynote',
				    type: 'POST',
				    dataType: 'json',
				    async: false,
				    data: { "dcid": resp.invoicedata.dcid },
				    beforeSend: function(xhr) {
					xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
				    }
				})
				    .done(function(response) {
					if (response["gkstatus"] == 0) {
					    if (response["delchal"]["stockdata"]){
						delchalproducts = response["delchal"]["stockdata"];
					    }else{
						delchalproducts = response["delchal"]["delchalContents"];
					    }
					    if(response["delchal"]["delchaldata"]["consignee"]){
						consigneeflag = true;
					    } else {
						consigneeflag = false;
					    }
					}
				    })
				    .fail(function() {
					console.log("error");
				    })
				    .always(function() {
					console.log("complete");
				    });
				let delchallist = [];
				$("#invoice_deliverynote option").each(function(){
				    delchallist.push($(this).val());
				});
				// If selected invoice is not in the list it is appended.
				if($.inArray(resp.invoicedata.dcid, delchallist) == -1){
				    $("#invoice_deliverynote").append('<option disabled hidden value="' + resp.invoicedata.dcid + '" dcno = "' + resp.invoicedata.dcno + '" dcdate="' + resp.invoicedata.dcdate + '">' + resp.invoicedata.dcid + ', ' + resp.invoicedata.dcdate + ', ' + resp.invoicedata.custSupDetails.custname + '</option>');
				}
				$("#invoice_deliverynote").val(resp.invoicedata.dcid);
			    }
			    // Loading other details of invoice.
				//Loading consignee details when deliverynote selected
				$("#invid").val(invid);
			    $("#consigneename").val(resp.invoicedata.consignee.consigneename);
			    $("#consigneestate").val(resp.invoicedata.consignee.consigneestate);
			    $("#statecodeofconsignee").val(pad(resp.invoicedata.consignee.consigneestatecode, 2));
			    $("#gstinconsignee").val(resp.invoicedata.consignee.gstinconsignee);
			    $("#tinconsignee").val(resp.invoicedata.consignee.tinconsignee);
				$("#consigneeaddress").val(resp.invoicedata.consignee.consigneeaddress);
			    $("#consigneepincode").val(resp.invoicedata.consignee.consigneepincode);				
			    $("#invoice_challanno").val(resp.invoicedata.invoiceno);
				$("#ewayBill_no").val(resp.invoicedata.ewaybillno);
			    let invoicedate = resp.invoicedata.invoicedate.split('-');
			    $("#invoice_date").val(invoicedate["0"]);
			    $("#invoice_month").val(invoicedate["1"]);
			    $("#invoice_year").val(invoicedate["2"]);
				$("#invoice_year").blur();

				gstins = resp.invoicedata.custSupDetails.custgstinlist;

			    if (resp.invoicedata.orgstategstin) {
				$("#orggstin").text(resp.invoicedata.orgstategstin);
				}

				if(resp.invoicedata.custSupDetails.csflag == 3){

					$('#custchange.custsupchange').prop('checked', true).change();
				}
				else{
					$('#supchange.custsupchange').prop('checked', true).change();
				}
			    $('#invoice_customer option').each(function(index) {
				if ($(this).text() == resp.invoicedata.custSupDetails.custname) {
				    $(this).prop("selected", true);
				}
				});
				$("#invoice_customeraddr").text(resp.invoicedata.custSupDetails.custaddr);
				$("#invoice_customerpincode").text(resp.invoicedata.custSupDetails.pincode);
				
			    $("#taxapplicable").val(resp.invoicedata.taxflag);
			    // Loading tax and product data based on taxflag(VAT or GST)
			    if ($("#taxapplicable").val() == '7') {
				// Loading tax and product details when GST is applied.
				$("#taxapplicabletext").text('GST');
				$('#invoice_product_table_gst tbody').empty();
				$('#invoice_product_table_total tbody').empty();
				let curindex = 0;
				$.each(resp.invoicedata.invcontents, function(key, value) {
				    $('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
				    $('.product_name_gst:eq(' + curindex + ')').searchify();
				    $('.product_name_gst:eq(' + curindex + ')').val(key).prop("disabled", true);
				    $('.invoice_product_hsncode:eq(' + curindex + ')').html(value.gscode);
				    $('.invoice_product_quantity_gst:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
				    $('.invoice_product_freequantity_gst:eq(' + curindex + ')').val(value.freeqty).attr("data", value.freeqty);
				    $('.unitaddonqty_gst:eq(' + curindex + '), .unitaddonfreeqty_gst:eq(' + curindex + ')').text(value.uom);
				    $('.invoice_product_per_price_gst:eq(' + curindex + ')').val(value.priceperunit);
				    $('.pricespan_gst:eq(' + curindex + ')').data("prodop", value.priceperunit);
				    $('.invoice_product_discount_gst:eq(' + curindex + ')').val(value.discount);
				    $('.invoice_product_taxablevalue_gst:eq(' + curindex + ')').val(value.taxableamount);
				    if(resp.invoicedata.taxname == 'IGST'){
					$('.invoice_product_igstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
					$('.invoice_product_igstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
				    }
				    else{
					$('.invoice_product_sgstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
					$('.invoice_product_sgstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
					$('.invoice_product_cgstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
					$('.invoice_product_cgstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
				    }
				    $('.invoice_product_cessrate:eq(' + curindex + ')').val(parseFloat(value.cessrate).toFixed(2));
				    $('.invoice_product_cessamount:eq(' + curindex + ')').val(parseFloat(value.cess).toFixed(2));
				    $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
				    $('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				    $('.invoice_product_total_gst:eq(' + curindex + ')').val(parseFloat(value.totalAmount).toFixed(2));
				    if (delchalproducts[key]) {
					$('.product_name_gst:eq(' + curindex + ')').addClass("delchalfield");
				    }
				    curindex = curindex + 1;
				});
				$('.invoice_product_quantity_gst').numeric({ negative: false });
				$('.invoice_product_per_price_gst').numeric({ negative: false });
				if($("#invoice_deliverynote").val() == ""){
				    $("#invoice_product_table_total tbody tr:first td:last a.product_del").remove();
				}
				else{
				    $(".product_add").hide();
				}
				if (resp.invoicedata.discflag == 1){
				    $('#discounttotal_product_gst').text(parseFloat(resp.invoicedata.totaldiscount).toFixed(2));
				}
				else {
				    $('#discounttotal_product_gst').text("");
				}
				$("#taxablevaluetotal_product_gst").text(parseFloat(resp.invoicedata.totaltaxablevalue).toFixed(2));
				$("#totalcgst_product_gst").text(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
				$("#totalsgst_product_gst").text(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
				$("#totaligst_product_gst").text(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
				$("#totalcess_product_gst").text(parseFloat(resp.invoicedata.totalcessamt).toFixed(2));
				$("#total_product_gst").text(parseFloat(resp.invoicedata.invoicetotal).toFixed(2));
				$("#totalsgtax").text(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
				$("#totalcgtax").text(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
				$("#totaligtax").text(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
			      $("#totalinvcess").text(parseFloat(resp.invoicedata.totalcessamt).toFixed(2));
		              $("#invoice_product_table_vat").hide();  //Hides VAT Product table and fields for TIN.
					  $("#vathelp").hide();
		              $(".tinfield").hide();
		              $("#gstproducttable").show();  //Shows GST Product table.
		              $(".gstinfield").show();
			      $(".vatfied").hide();
				$(".gstfield").show();
			    }
			    else if ($("#taxapplicable").val() ==  '22') {
				// Loading tax and product details when VAT is applied.
				$("#taxapplicabletext").text('VAT');
				$("#tin").text(resp.invoicedata.custSupDetails.custtin);
				$('#invoice_product_table_vat tbody').empty();
				let curindex = 0;
				$.each(resp.invoicedata.invcontents, function(key, value) {
				    $('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
				    $('.product_name_vat:eq(' + curindex + ')').searchify();
				    $('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				    $('.product_name_vat:eq(' + curindex + ')').val(key).prop("disabled", true);
				    $('.invoice_product_quantity_vat:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
				    $('.invoice_product_freequantity_vat:eq(' + curindex + ')').val(value.freeqty).attr("data", value.freeqty);
				    $('.unitaddonqty_vat:eq(' + curindex + '), .unitaddonfreeqty_vat:eq(' + curindex + ')').text(value.uom);
				    $('.invoice_product_per_price_vat:eq(' + curindex + ')').val(value.priceperunit);
				    $('.pricespan_vat:eq(' + curindex + ')').data("prodop", value.priceperunit);
				    $('.invoice_product_discount_vat:eq(' + curindex + ')').val(value.discount);
				    $('.invoice_product_taxablevalue_vat:eq(' + curindex + ')').val(value.taxableamount);
				    $('.invoice_product_tax_rate_vat:eq(' + curindex + ')').val(value.taxrate);
				    $('.invoice_product_tax_amount_vat:eq(' + curindex + ')').val(value.taxamount);
				    $('.invoice_product_total_vat:eq(' + curindex + ')').val(value.totalAmount);
				    if (delchalproducts[key]) {
					$('.product_name_vat:eq(' + curindex + ')').addClass("delchalfield");
				    }
				    curindex = curindex + 1;
				});
				if($("#invoice_deliverynote").val() == ""){
				    $("#invoice_product_table_vat tbody tr:first td:eq(9) a.product_del").remove();
				}
				else{
				    $(".product_add").hide();
				}
				$('.invoice_product_quantity_vat').numeric({ negative: false });
				$('.invoice_product_per_price_vat').numeric({ negative: false });
				if (resp.invoicedata.discflag == 1){
				    $('#discounttotal_product_vat').show().val(parseFloat(resp.invoicedata.totaldiscount).toFixed(2));
				}
				else {
				    $('#discounttotal_product_vat').hide();
				}
				$("#taxablevaluetotal_product_vat").val(parseFloat(resp.invoicedata.totaltaxablevalue).toFixed(2));
				$("#totaltax").val(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
				$("#total_product_vat").val(parseFloat(resp.invoicedata.invoicetotal).toFixed(2));
			      $("#totalinvtax").text(parseFloat(resp.invoicedata.totaltaxamt).toFixed(2));
                              $("#gstproducttable").hide();
		              $(".gstinfield").hide();
		              $("#invoice_product_table_vat").show();
		              $(".tinfield").show();
					  $("#vathelp").show();
			      $(".gstfield").hide();
				$(".vatfield").show();
				}
				if($("#taxapplicable").val() ==  '7'){
					$("#invoice_customerstate").empty();
					for (let i in resp.invoicedata.custSupDetails.statelist){
						$.each(resp.invoicedata.custSupDetails.statelist[i], function(k, v) {
						$("#invoice_customerstate").append('<option value="'+v+'" stateid="'+k+'">'+v+'</option>');
						});
						}
					}
				else if($("#taxapplicable").val() ==  '22'){ 
					$.ajax({
						url: '/invoice?type=getstatelist',
								type: 'POST',
								async: false,
								beforeSend: function(xhr) {
									xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
								}
					})
					.done(function(resp){
						$("#invoice_customerstate").empty();
						for (let i in resp["gkresult"]){
							$.each(resp["gkresult"][i], function(k, v) {
							$("#invoice_customerstate").append('<option value="'+v+'" stateid="'+k+'">'+v+'</option>');
							});
						}	
					});
				}
				if ($("#status").val() == 15) {
					$("#invoicestate").val(resp.invoicedata.sourcestate);
					$("#statecodeforinvoice").text(pad(resp.invoicedata.sourcestatecode, 2));
					$("#originaddress").val(resp.invoicedata.address);
					$("#originpincode").val(resp.invoicedata.pincode);
					$("#invoice_issuer_name").val(resp.invoicedata.issuername);
					$("#invoice_issuer_designation").val(resp.invoicedata.designation);
					//when customer state changed
					$("#invoice_customerstate").val(resp.invoicedata.destinationstate);
					$("#invoice_customerstate").change();
					$("#statecodeofcustomer").text(pad(resp.invoicedata.taxstatecode, 2));
					
					}
					else {
					$("#invoicestate").val(resp.invoicedata.destinationstate);
					$("#statecodeforinvoice").text(pad(resp.invoicedata.taxstatecode, 2));
					//when supplier state changed
					$("#invoice_customerstate").val(resp.invoicedata.sourcestate);
					$("#invoice_customerstate").change();
					$("#statecodeofcustomer").text(pad(resp.invoicedata.sourcestatecode, 2));
					}
			    // Loading consignee ddetails if any.
			    if (resp.invoicedata.consignee.consigneename) {
				$("#consigneename").val(resp.invoicedata.consignee.consigneename);
				if ($("#taxapplicable").val() == '22') {
				    $("#tinconsignee").val(resp.invoicedata.consignee.tinconsignee);
				}
				else if ($("#taxapplicable").val() ==  '7') {
					$("#gstinconsignee").val(resp.invoicedata.consignee.gstinconsignee);
				}
				$("#consigneeaddress").val(resp.invoicedata.consignee.consigneeaddress);
				$("#consigneestate").val(resp.invoicedata.consignee.consigneestate);
				$("#statecodeofconsignee").text(pad(resp.invoicedata.consignee.consigneestatecode, 2));
			    }
			    else{
				$("#consigneename").val("");
				$("#tinconsignee").val("");
				$("#gstinconsignee").val("");
				$("#consigneeaddress").val("");
				$("#consigneestate").val("Andaman and Nicobar Islands");
				$("#statecodeofconsignee").text("35");
				}
				if ($("#taxapplicable").val() == '22') {
					$("#smalllinkvat").show();
					$("#smalllink").hide();
					$("#smalllinkonlyvat").show();
				} else {
					$("#smalllinkvat").hide();
					$("#smalllink").show();
					}
			    $("#invoicestate").change();
			    // Loading bank details and other information.
				$("#totalinvoicevalue").text(resp.invoicedata.invoicetotal);
				if (resp.invoicedata.roundoff == 1){
					$("#roundvalue").prop("checked",true);
					$("#roundvaluediv").show();
					$("#totalinvoicevaluerounded").text(parseFloat(resp.invoicedata.roundoffvalue).toFixed(2))
				}
				else{
					$("#roundvalue").prop("checked",false);
					$("#roundvaluediv").hide();
				}
			    $("#taxableamount").text(parseFloat(resp.invoicedata.totaltaxablevalue).toFixed(2));
			    $("#totalinvdiscount").text(parseFloat(resp.invoicedata.totaldiscount).toFixed(2));
			    if( resp.invoicedata.invoicetotalword != "" && resp.invoicedata.invoicetotalword != null ){
				$("#tviw").show();
				$("#totalValueInWord").text(resp.invoicedata.invoicetotalword);
			    }else{
				$("#tviw").hide();
			    }
			    
			    paymentmod = resp.invoicedata.paymentmode;
			    // If paymentmode is 2(i.e. bank) then load bankdetails.
			    if (resp.invoicedata.paymentmode == "2") {
				$("#accountno").val(resp.invoicedata.bankdetails.accountno);
				$("#bankname").val(resp.invoicedata.bankdetails.bankname);
				$("#branchname").val(resp.invoicedata.bankdetails.branch);
				$("#ifsc").val(resp.invoicedata.bankdetails.ifsc);
				$('#chkpaymentmode option[value=' + paymentmod + ']').prop("selected",true);
				$("#bank").show();
				$("#cash").hide();
				$("#oncredit").hide();
			    }else if(resp.invoicedata.paymentmode == "15"){
				$('#chkpaymentmode option[value=' + paymentmod + ']').prop("selected",true);
				$("#bank").hide();
				$("#cash").hide();
				$("#oncredit").show();
			    }else {
				$('#chkpaymentmode option[value=' + paymentmod + ']').prop("selected",true);
				$("#bank").hide();
				$("#cash").show();
				$("#oncredit").hide();
				}
				$("#invoice_narration").val(resp.invoicedata.narration);
			    //Code for populting organisation's bankdetails in create sale invoice on click event on Bank radio button.
			    if ($("#status").val() == "15" && resp.invoicedata.paymentmode == "3") {      //Checking whether it is sale invoice or not (15 = sale invoice).
				if($("#chkpaymentmode option:selected").val()=="2"){
				    $.ajax({
					url: '/editorganisation?action=orgbankdetails',
					type: 'POST',
					dataType: 'json',
					beforeSend: function(xhr) {
					    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
					}
				    })
					.done(function(resp) {
					    console.log("success");
					    $("#accountno").val(resp["gkbankdata"]["bankdetails"]["accountno"]); //Account Number of organisations is loaded.
					    $("#branchname").val(resp["gkbankdata"]["bankdetails"]["branchname"]);   //Branchname of organisations is loaded.
					    $("#ifsc").val(resp["gkbankdata"]["bankdetails"]["ifsc"]);           //Ifsc code of organisations is loaded.
					    $("#bankname").val(resp["gkbankdata"]["bankdetails"]["bankname"]);   //Branchname of organisations is loaded.

					})
					.fail(function() {
					    console.log("error");
					})
					.always(function() {
					    console.log("complete");
					});
				}

			    }
			    $("#transportationmode").val(resp.invoicedata.transportationmode);
			    if(resp.invoicedata.vehicleno != ""){
				$("#vehiclenodiv").show();
				$("#vehicleno").val(resp.invoicedata.vehicleno);
			    }else{ $("#vehiclenodiv").hide(); }
			    let dateofsupply = resp.invoicedata.dateofsupply.split('-');
			    $("#supply_date").val(dateofsupply["0"]);
			    $("#supply_month").val(dateofsupply["1"]);
			    $("#supply_year").val(dateofsupply["2"]);
			    if (resp.invoicedata.reveresecharge == "1") {
				$("#rev1radio").prop("checked", true);
				$("#rev2radio").prop("checked", false);
			    }
			    else {
				$("#rev2radio").prop("checked", true);
				$("#rev1radio").prop("checked", false);
			    }
			    if(resp.invoicedata.discflag == 1){
				$(".discaddon").hide();
			    }
			    else {
				$(".discaddon").show();
			    }
			    // Disabling all fields again.
			    $('.editdis, .product_del, .product_add').prop("disabled", true);
			}
		    }
		});
	}
	else{
	    $("#invdetailsdiv").hide();
	}
    });
    if ($("#invselect").val()!="") {
        $("#invselect").change();
    }
    // Click event for invoice edit button.
    $("#invoice_edit").click(function(event){
	editflag = false;
	$("#invoice_save").show();
	$("#invoice_addcust, #invoice_addproduct").show();
	$("#img_label").show();
	$("#attachlabel").show();
	$("#tviw").show();
	$("#invoice_edit").hide();
	$("#invoice_editprint").hide();
	$(".uploadclass").show();
	$('input:not(.trate, .tamount, .invoice_product_taxablevalue_vat, .invoice_product_tax_amount_vat, .invoice_product_total, .invoice_product_total_vat, #discounttotal_product_vat, #taxablevaluetotal_product_vat, #totaltax, #total_product_vat, .invoice_product_taxablevalue_gst, .invoice_product_total_gst), #invoice_narration, select, .product_del, .product_add').prop("disabled", false);
	if($("#invoice_deliverynote option:selected").val() != ""){
	    $(".custfield, .delchalfield, .supplydate, .custsupchange, #invoice_deliverynote, #invoicestate, .product_name_gst, .product_name_vat").prop("disabled", true);
	}
	$("#originaddress").prop("disabled",true);
	$("#originpincode").prop("disabled",true);

	if ($("#taxapplicable").val() == 7) {
	    $(".product_name_gst").each(function(index){
		if ($(".product_name_gst:eq(" + index + ") option:selected").attr("gsflag") != 7) {  // If an item is not a product
		    $(".invoice_product_quantity_gst:eq(" + index + "), .invoice_product_freequantity_gst:eq(" + index + ")").prop("disabled", true);
		}
	    });

    //Converting List of Customers/Suppliers into a searchable combo
    $("#invoice_customer").searchify();
    $("#invoice_customer").removeClass("col-sm-8");
    $("#invoice_customer").parent().addClass("col-sm-8 nopadding");
	}
	
	if(consigneeflag == true){
	    $(".consigneefield").prop("disabled", true);
	    $("#Consignee").attr("disabled", true);
	}
	else {
	    $(".consigneefield").prop("disabled", false);
	}
	$(".firstfield:visible").first().focus();
	});
	 
	

    $("#invselect").keydown(function(event){
	if(event.which == 13){
	    event.preventDefault();
	    $("#invoice_edit").click();
	    
	}
    });

  $("#invoice_addcust").click(function() {
    var statusinout;
    if ($("#status").val() == '9') {
      statusinout = "in";
    }
    if ($("#status").val() == '15') {
      statusinout = "out";
    }
    $.ajax({

      type: "POST",
      url: "/customersuppliers?action=showaddpopup",
      global: false,
      async: false,
      data: { "status": statusinout },
      datatype: "text/html",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(resp) {

        $("#viewcustsup").html("");
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $("#viewcustsup").html(resp);
          $('#custsupmodal').modal('show');
        $('#custsupmodal').on('shown.bs.modal', function(e) // shown.bs.modal is an event which fires when the modal is opened
			      {
				  modalpresent = 1;
            if ($("#status").val() == '9') {
              $("#add_cussup").val('19');
            } else {
              $('#add_cussup').val('3');
            }

            $('#add_cussup_name').focus();
          });
        $('#custsupmodal').on('hidden.bs.modal', function(e) // hidden.bs.modal is an event which fires when the modal is closed
			      {
				  modalpresent = 0;
				  $("#invoice_customer").prop("disabled", false);
            var text1 = $('#selectedcustsup').val();
            if (text1 == '') {
              $('#invoice_customer').val("");
              $('#invoice_customer option[value=""]').prop("selected", true);
              $('#invoice_customer').focus().change();
              return false;
            }
            var urlcustsup = "/customersuppliers?action=getallsups";
            var addoption=null;
            if ($("#status").val() == '15') {
		urlcustsup = "/customersuppliers?action=getallcusts";
		addoption="Customer";
            }
	      else {
		  urlcustsup = "/customersuppliers?action=getallsups";
		  addoption="Supplier";
	      }
            $.ajax({
              type: "POST",
              url: urlcustsup,
              global: false,
              async: false,
              datatype: "text/json",
              beforeSend: function(xhr) {
                xhr.setRequestHeader("gktoken", sessionStorage.gktoken);
              }
            })
             .done(function(resp) {
               var custs = resp["customers"];
               $("#invoice_customer").empty();
               $("#invoice_customer").append('<option value="" disabled hidden selected>Select ' +addoption+ '</option>');
               $("#invoice_customer").append('<option value="-1" style=\"font-family:\'FontAwesome\',\'Helvetica Neue\', Helvetica, Arial, sans-serif;\">&#xf067 Add '+addoption+ '</option>');
               for (i in custs) {
                 $("#invoice_customer").append('<option value="' + custs[i].custid + '" >' + custs[i].custname + '</option>');
               }
		 $("#invoice_customer option").filter(function() {
                     return this.text == text1;
                 }).attr('selected', true).trigger('change'); //Selects the latest added customer/supplier.
		 $("#invoice_customer").change();
             });
            $("#selectedcustsup").val("");
              $("#invoice_customer").focus();
	      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
          });
      }
    });
  });

    $("#my-file-selector").change(function(event){
	var files = $("#my-file-selector")[0].files;
	var filelist = [];
	for (let i = 0; i < files.length; i++) {
	    if (files[i].type != 'image/jpeg') {
		$("#image-alert").alert();
		$("#image-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#image-alert").hide();
		});
		$('#my-file-selector').focus();
		return false;
	    }
	}
    });

    $('#firsvatprice, #firstgstprice').focusin(function(){
	$(this).tooltip('show');
    });
    
    $(document).off("click", ".priceaddon").on("click", ".priceaddon", function(event){
	event.preventDefault();
	var togglekey = $.Event('keydown');
	togglekey.which = 84;
	$(this).parent().find("input").trigger(togglekey);
    });

    var allow = 1;
  $("#invoice_save").click(function(event) {
      event.preventDefault();
      event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
      if ($.trim($('#invoice_challanno').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#challanno-blank-alert").hide();
      });
      $('#invoice_challanno').focus();
      return false;
    }

      if ($.trim($('#invoice_date').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#invoice_date').focus();
      return false;
    }
      if ($.trim($('#invoice_month').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#invoice_month').focus();
      return false;
    }
      if ($.trim($('#invoice_year').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#invoice_year').focus();
      return false;
    }
      if (!Date.parseExact($("#invoice_date").val() + $("#invoice_month").val() + $("#invoice_year").val(), "ddMMyyyy")) {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-alert").hide();
      });
      $('#invoice_date').focus().select();
      return false;
    }
      var curdate = Date.parseExact($("#invoice_year").val() + $("#invoice_month").val() + $("#invoice_date").val(), "yyyyMMdd");
    if (!curdate.between(financialstart, financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
      });
      $('#invoice_date').focus().select();
      return false;
    }

    if ($("#invoice_deliverynote option:selected").val() != "") {

	if (Date.parseExact($("#invoice_deliverynote option:selected").attr("dcdate"), "dd-MM-yyyy").compareTo(curdate) == 1) {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
        $("#invdc-date-alert").alert();
        $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#invdc-date-alert").hide();
        });
        $('#invoice_date').focus().select();
        return false;
      }
    }

      if ($.trim($('#invoice_customer option:selected').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#custsup-blank-alert").hide();
      });
      $('#invoice_customer').focus();
      return false;
    }
      if ($.trim($('#consigneename').val()) == "" && ($.trim($("#tinconsignee").val()) != "" || $.trim($("#gstinconsignee").val() != ""))  && $.trim($("#consigneeaddress").val()) != "" && $.trim($("#consigneepincode").val()) != ""){
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
          $("#consignee-blank-alert").alert();
          $("#consignee-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#consignee-blank-alert").hide();
          });
          $('#consigneename').focus();
          return false;
	  }
	  var pincode_val=($("#consigneepincode").val());
	  var reg = /^[0-9]+$/;
		if (pincode_val != "") {

		   if (!reg.test(pincode_val) || pincode_val.length != 6) {
		  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
			  $("#pinval-blank-alert").alert();
			  $("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			  $("#pinval-blank-alert").hide();
			  });
			  $("#consigneepincode").focus();
			  return false;
			  }
	  }

      //validation for bankdetails on save button.  
       if ($("#chkpaymentmode option:selected").val()=="2") {
	  if($("#accountno").val()=="" || $("#branchname").val()=="" || $("#bankname").val()=="" || $("#ifsc").val()=="" ) {
	      $("#bankdetails-blank-alert").alert();
	      $("#bankdetails-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#bankdetails-blank-alert").hide();
	      });
	      $("#accountno").focus();
	      return false;
	  }
      }

      //Validation for Address in sale invoice.
      if ($("#status").val() == 15) {
	  if($("#originaddress").val() == ""){
	      $("#address-blank-alert").alert();
              $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#address-blank-alert").hide();
	      });
	      $("#originaddress").focus();
	      return false;
	  }
      }
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
      $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function(e) {
          var tax = {};
      var cess = {};
      var contents = {};
      var freeqty = {};
      var stock = {};
      var items = {};
      var discount = {};
      var consignee = {};
      var bankdetails = {};
      var invoicetotal = 0.00;
      var productcodes = [];
      var productqtys = [];
      var ppu;
      var av = {};
      var productdata={};
      var proddata = {};
      var prodtax={};
      let pn;
      let gsttype;
      var inoutflag = $("#status").val();
      var pricedetails = [];
      if($("#consigneename").val() != ""){
	  consignee["consigneename"] = $.trim($("#consigneename").val());
          consignee["tinconsignee"] = $.trim($("#tinconsignee").val());
          consignee["gstinconsignee"] = $.trim($("#gstinconsignee").val());
          consignee["consigneeaddress"] = $.trim($("#consigneeaddress").val());
          consignee["consigneestate"] = $.trim($("#consigneestate").val());
		  consignee["consigneestatecode"] = $.trim($("#statecodeofconsignee").text());
          consignee["consigneepincode"] = $.trim($("#consigneepincode").val());
		  
      }
      bankdetails["accountno"] = $.trim($("#accountno").val());
      bankdetails["bankname"] = $.trim($("#bankname").val());
      bankdetails["ifsc"] = $.trim($("#ifsc").val());
      bankdetails["branch"] = $.trim($("#branchname").val());
    if ($("#taxapplicable").val() == 22) {
    for (let i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
	productqtys.push(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
      if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == "") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#product-blank-alert").hide();
        });
        $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
        return false;
      }
      for (productcode of productcodes) {
        if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == productcode) {
          $("#product-duplicate-alert").alert();
          $("#product-duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-duplicate-alert").hide();
          });
          $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
          return false;
        }
      }
	calculatevataxamt(i);
      productcodes.push($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val());

      var productcode = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
      if ($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select').focus();
          return false;
        }
	let quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").focus().select();
	      return false;
	  }
	
      if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
      if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val() == "") {
        $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val(0.00);
      }
	if (parseFloat($('.invoice_product_per_price_vat:eq(' + i + ')').val()) == 0.00 && parseFloat($('.invoice_product_quantity_vat:eq(' + i + ')').val()) > 0) {
	 $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_vat:eq(' + i + ')').focus().select();
          });
	  return false;   
	}
	if (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(1) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(3) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_vat:eq(" + i + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	}
	if (parseFloat(quantity) > 0) {
	    let obj = {};
	    let price= {};
	    price["custid"] = parseInt($("#invoice_customer").val());
	    price["productcode"] = parseInt(productcode);
	    price["inoutflag"] = parseInt($("#status").val());
            ppu = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val())).toFixed(2);
            obj[ppu] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val())).toFixed(2);
	    price["lastprice"] = parseFloat(ppu);
	    pricedetails.push(price);
            tax[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(6) input").val())).toFixed(2);
	    contents[productcode] = obj;
            items[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val())).toFixed(2);
            freeqty[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val())).toFixed(2);
	    discount[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val())).toFixed(2);
	    pn=$("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").text();
	    productdata[pn]=parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(5) input").val()).toFixed(2);
	    proddata[productcode]=parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(5) input").val()).toFixed(2);
	    av["product"]=productdata;
	    av["prodData"]=proddata; 
	}
    }
	av["totaltaxable"]=tottaxable;
	av["taxpayment"]=tottax;
	invoicetotal = parseFloat($.trim($('#invoice_product_table_vat tfoot tr:last td:eq(5) input').val())).toFixed(2);

    }

      else if ($("#taxapplicable").val() == 7) {
	  for (let i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
	      if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').val() == "") {
		  $("#product-blank-alert").alert();
		  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#product-blank-alert").hide();
		  });
		  $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select').focus();
		  return false;
	      }
	      let quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val());
	      if (parseFloat(quantity) === 0.00 && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		  $("#quantity-blank-alert").alert();
		  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#quantity-blank-alert").hide();
		  });
		  $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").focus().select();
		  return false;
	      }
	      if ($("#invoice_deliverynote option:selected").val() != '') {
		  if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").attr("data")).toFixed(2))) && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		      $("#quantity-exceed-alert").alert();
		      $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#quantity-exceed-alert").hide();
		      });
		      return false;
		  }
	      }
	      if (parseFloat($('.invoice_product_per_price_gst:eq(' + i + ')').val()) == 0 && parseFloat($('.invoice_product_quantity_gst:eq(' + i + ')').val()) > 0) {
	 $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.invoice_product_per_price_gst:eq(' + i + ')').focus().select();
          });
	  return false;   
	}
	      if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
		  if (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_gst:eq(" + i + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	else{
	    if (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val()).toFixed(2)) > parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_gst:eq(" + i + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	      calculategstaxamt(i);
	      productqtys.push(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()));
	      let obj = {};
	      let price = {};
	      productcode = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
	      ppu = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val()).toFixed(2);
	      obj[ppu] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()).toFixed(2);
	      price["custid"] = parseInt($("#invoice_customer").val());
	      price["productcode"] = parseInt(productcode);
	      price["inoutflag"] = parseInt($("#status").val());
	      contents[productcode] = obj;
	      price["lastprice"] = parseFloat(ppu);
	      pricedetails.push(price);
	      tax[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(7) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(9) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(11) input").val());
	      cess[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(13) input").val()).toFixed(2);
	      items[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()).toFixed(2);
	      freeqty[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val()).toFixed(2);
	      discount[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val()).toFixed(2);
	      pn=$("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select option:selected").text();
	      productdata[pn]=parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(6) input").val()).toFixed(2);
	      av["product"]=productdata;
	      proddata[productcode]=parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(6) input").val()).toFixed(2);
	      av["prodData"]= proddata;
	  }
	  if (taxtype==3){
		  gsttype="CGST";
	      }else{
		  gsttype="IGST";	          
	      }
	 prodtax["GSTName"]=gsttype;
	  prodtax["CESSName"]="CESS";
	  av["avtax"]=prodtax;
	  av["totaltaxable"]=tottaxable;

	  invoicetotal = $.trim($('#total_product_gst').html());
      }
      stock["items"] = items;
      if ($("#status").val() == '9') {
	  stock["inout"] = 9;
	  issuername = "";
	  designation = "";
      }
      else {
	  stock["inout"] = 15;
	  issuername = $("#invoice_issuer_name").val();
	  designation = $("#invoice_issuer_designation").val();
      }
      //For sales invoice store address.
      if($("#status").val() == 15){
	  address = $("#originaddress").val();
	  }
	  var invoice_narration=$("#invoice_narration").val();
      var form_data = new FormData();
	  form_data.append("dcid", $("#invoice_deliverynote option:selected").val());
	  form_data.append("roundoff",roundoffvalue);
      form_data.append("custid", $("#invoice_customer option:selected").val());
      form_data.append("invoiceno", $("#invoice_challanno").val());
      form_data.append("invid", $("#invselect option:selected").val());
      form_data.append("invoicedate", $.trim($("#invoice_year").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_date").val()));
      form_data.append("contents", JSON.stringify(contents));
      form_data.append("tax", JSON.stringify(tax));
      form_data.append("cess", JSON.stringify(cess));
      form_data.append("stock", JSON.stringify(stock));
      if (pricedetails.length > 0) {
	  form_data.append("pricedetails", JSON.stringify(pricedetails));
      }
      form_data.append("issuername", issuername);
      form_data.append("orgstategstin",$("#orggstin").text() );
      form_data.append("designation", designation);
      form_data.append("invtotal", invoicetotal);
      form_data.append("invtotalword", numbertowords);
	  form_data.append("ewaybillno", $("#ewayBill_no").val());
	  form_data.append("av",JSON.stringify(av));
	  if (invoice_narration.length != 0){
	  form_data.append("invoice_narration",invoice_narration);
	}
      if ($("#status").val() == 9) {
	 /*let destinationstate = $("#invoicestate option:selected").val();
	 let sourcestate = $("#invoice_customerstate").val();
	  if ($("#consigneename").val() != "") {
	      sourcestate = $("#consigneestate option:selected").val();
	  }*/
	  form_data.append("taxstate", $("#invoicestate option:selected").val());
	  form_data.append("sourcestate", $("#invoice_customerstate option:selected").val());
      }
      else if ($("#status").val() ==  15) {
	  /*let sourcestate = $("#invoicestate option:selected").val();
	  let destinationstate = $("#invoice_customerstate").val();
	  if ($("#consigneename").val() != "") {
	      destinationstate = $("#consigneestate option:selected").val();
	      }*/
	  //appending address to the form_data.	  
	  form_data.append("address", address);
	  form_data.append("taxstate", $("#invoice_customerstate option:selected").val());
	  form_data.append("sourcestate", $("#invoicestate option:selected").val());
    }
    form_data.append("freeqty", JSON.stringify(freeqty));
    form_data.append("discount", JSON.stringify(discount));
    form_data.append("consignee", JSON.stringify(consignee));
    //Code for sending data to the database based on which option is selected i.e."cash" or "bank" or "on credit".
      if ($("#chkpaymentmode option:selected").val()=="3"){
	  form_data.append("paymentmode",3);   //If cash is selected then paymentmode is set to 3 (i.e. cash transaction)
      } else if($("#chkpaymentmode option:selected").val()=="2"){  //If bank is selected then append both bankdetails and paymentmode = 2 (i.e. bank transaction).
	  form_data.append("bankdetails", JSON.stringify(bankdetails));
	  form_data.append("paymentmode",2);
      }else{
	  form_data.append("paymentmode",15); //If on credit is selected then paymentmode is set to 15 (i.e. on credit transaction)
      }
      form_data.append("taxflag", $("#taxapplicable").val());
    form_data.append("transportationmode", $("#transportationmode").val());
    form_data.append("vehicleno", $("#vehicleno").val());
    form_data.append("inoutflag",inoutflag);  
      var dateofsupply = $.trim($("#supply_date").val() + $("#supply_month").val() + $("#supply_year").val());
    if (dateofsupply == "") {
	form_data.append("dateofsupply", dateofsupply);
    }
    else {
	form_data.append("dateofsupply", $.trim($("#supply_year").val() + '-' + $("#supply_month").val() + '-' + $("#supply_date").val()));
    }
      if ($("#rev1radio").is(":checked")) {
	  
          form_data.append("reversecharge", 1);
        }
      else if ($("#rev2radio").is(":checked")) {
	  
          form_data.append("reversecharge", 0);
        }

    var files = $("#my-file-selector")[0].files;
    var filelist = [];
      for (var i = 0; i < files.length; i++) {
	  if (files[i].type != 'image/jpeg') {
		$("#image-alert").alert();
		$("#image-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#image-alert").hide();
		});
		$('#my-file-selector').focus();
		return false;
	  }
	  form_data.append("file" + i, files[i]);
    }
	if (allow == 1){
	    $.ajax({
                url: '/invoice?action=update',
                type: 'POST',
                global: false,
                contentType: false,
                cache: false,
                processData: false,
                dataType: 'json',
                async: false,
                data: form_data,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
                .done(function(resp) {
                    if (resp["gkstatus"] == 0) {
			allow = 0;
			let originvid = $("#invselect option:selected").val();
            if ((resp["gkstatus"] == 0) && (sessionStorage.avflag == 0)) {
				$("#success-alert").alert();
				$("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
				    $("#success-alert").hide();
				});
				
            	if ($("#status").val() == '9') {
					$("#invoice_view_purchase").click();
            	} else {
					$("#invoice_view_sale").click();
                }
				$("#invselect").val(originvid).change();
				$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
				return false;
			}
			else if (resp["gkstatus"] == 0 && resp["gkvch"]["status"] == 0) {
				$("#inv-vch-success-alert").append("Invoice saved with corresponding entry no. <a id='link'><u>"+ resp["gkvch"]["vchno"]+"<u></a>");
				$("#inv-vch-success-alert").alert();
				let D = 1;
				$("#link").click(function(e){
					D = 0;
					e.preventDefault();
					var id = resp["gkvch"]["vchid"];
					$("#vouchernumberinput").val(id);
					$.ajax({
						type: "POST",
						url: "/invoice?action=showvoucher",
						global: false,
						async: false,
						datatype: "text/html",
						data: {"invid":$("#invselect option:selected").val()},
						beforeSend: function(xhr) {
							xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
						},
						success: function(resp)
					{
					  $("#viewvc").html("");
					  $('.modal-backdrop').remove();
					  $('.modal').modal('hide');
					  $("#viewvc").html(resp);
					  $('#myModal').modal('show');
					  $('#myModal').on('shown.bs.modal', function (e)
					  {
						$(".btnfocus:enabled:first").focus();
					  });
	
						$('#myModal').on('hidden.bs.modal', function (e)
						{
							if($("#hideinp").val()==0)
							{
							$('.modal-backdrop').remove();
							$("#viewvc").html("");
							}

							if ($("#status").val() == '9') {
								$("#invoice_view_purchase").click();
							} else {
								$("#invoice_view_sale").click();
							}
							$("#invselect").val(originvid).change();
							$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
						});
						}
					}
					);
				});
				$("#inv-vch-success-alert").fadeTo(2250, 500).slideUp(500, function() {
					$("#inv-vch-success-alert").hide();
					if (D == 1){
            			if ($("#status").val() == '9') {
							$("#invoice_view_purchase").click();
            			} else {
							$("#invoice_view_sale").click();
                    	}
						// $("#invselect").val(originvid).change();
						// $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
					}
				});
				return false;
				}
			
		    else if (resp["gkstatus"] == 0 && resp["gkvch"]["status"] == 1) {		
				$("#inv-vch-failed-alert").alert();
				$("#inv-vch-failed-alert").fadeTo(2500, 500).slideUp(500, function() {
					$("#inv-vch-failed-alert").hide();
				});
				if ($("#status").val() == '9') {
					$("#invoice_view_purchase").click();
				} else {
					$("#invoice_view_sale").click();
						}
				$("#invselect").val(originvid).change();
				$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
				return false;
				}
			} 

			else if (resp["gkstatus"] == 1) {
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
                        $("#invoice_challanno").focus();
                        $("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        return false;
                    } else {
                        $("#invoice_deliverynote").focus();
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
                        $("#failure-alert").alert();
                        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
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
        }

      return false;
    });
  });
  $("#confirm_yes").on('shown.bs.modal', function(event) {
    $("#tn_save_no").focus();

  });
  $("#confirm_yes").on('hidden.bs.modal', function(event) {
    $("#invoice_deliverynote").focus();
  });
  $(document).off('click', '#invoice_reset').on('click', '#invoice_reset', function(event) {
    event.preventDefault();
      /* Act on the event */
      if ($("#listdiv").is(":hidden")) {
	  $("#editbutton").click();
      }
      else{
	  if ($("#status").val() == '9') {
	      $("#invoice_view_purchase").click();
	  } else {
	      $("#invoice_view_sale").click();
	  }
      }
  });
    
    $("#viewattach").click(function(event) {
        $.ajax({
                url: '/invoice?action=getattachment',
                type: 'POST',
            datatype: 'json',
	    data: { "invid": $("#invselect option:selected").val() },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                var x = window.open();
                if (x) {
                    //Browser has allowed it to be opened
                    x.focus();
                    x.document.open();
                    x.document.write(resp);
                    x.document.close();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups and retry');
                    x.close();
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
    $("#invoice_date").numeric();
    $("#invoice_month").numeric();
    $("#invoice_year").numeric();
    $('.invoice_product_quantity_gst, .invoice_product_quantity_vat').numeric({ negative: false });
    $('.invoice_product_per_price').numeric({ negative: false });
    $("#invoice_deliverynote").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_challanno").focus().select();
        }
    });

    $("#invoice_editprint").click(function(event) {
        $.ajax({
                url: '/invoice?action=print',
                type: 'POST',
                dataType: 'html',
            data: {"invid":$("#invselect option:selected").val(),"pflag":'0'},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                $('#info').html(resp);
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });

   $(document).off('keydown', '#chkpaymentmode').on('keydown', '#chkpaymentmode', function(event) {
        if(event.which==13){
	    if($("#chkpaymentmode option:selected").val()=="2"){
		$("#accountno").focus();
            }else{
		$("#transportationmode").focus();
    	    }
	}
    });
      
     //Code for radio buttons to show and hide "bankdetails fields" and "cash received"
$("#chkpaymentmode").change(function(event) {
    if ($("#chkpaymentmode option:selected").val()=="2"){ //If cash is selected then bankdetails fields are hide and 'CASH RECEIVED' is shown.
	$("#bank").show();
	$("#cash").hide();
	$("#oncredit").hide();
	if ($("#status").val() == "15" && editflag == 'false') {
	    $('#chkbank').trigger('click');    //trigger click event on bank radio button.
	}
	if (editflag == 'false'){
	    $("#invoice_customer").trigger("change");    //Calling change event on onclick of bank to load bankdetails.
	    }
        
    } else if ($("#chkpaymentmode option:selected").val()=="3"){
	//If bank is selected then bankdetails fields are shown and 'CASH RECEIVED' is hide.
        $("#bank").hide();
	$("#cash").show();
	$("#oncredit").hide();
    }else {
	$("#bank").hide();
	$("#cash").hide();
	$("#oncredit").show();
    }});

      //Keydown event for BANK DETAILS
    $("#accountno").keydown(function(event) {
	if (event.which==13) {
	    $("#bankname").focus().select();
	}
    });  


    $("#bankname").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
          
         if ($.trim($("#accountno").val())=="" && $.trim($("#bankname").val())!="") {
            $("#accountno-blank-alert").alert();
            $("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#accountno-blank-alert").hide();
            });
            $("#accountno").focus();
            return false;
         }

         else if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())=="") {
            $("#bankname-blank-alert").alert();
            $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-blank-alert").hide();
            });
            $("#bankname").focus();
            return false;
          }
	    
      $("#branchname").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#accountno").focus().select();
	};
    });

    $("#branchname").keydown(function(event) {
	if (event.which==13) {
	     if ($.trim($("#accountno").val())=="" && $.trim($("#branchname").val())!="" ) {
            $("#accountno-blank-alert").alert();
            $("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#accountno-blank-alert").hide();
            });
            $("#accountno").focus();
            return false;
          }

	     if ( $.trim($("#bankname").val())=="" && $.trim($("#branchname").val())!="" ) {
            $("#bankname-blank-alert").alert();
            $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-blank-alert").hide();
            });
            $("#bankname").focus();
            return false;
          }


	if ($.trim($("#accountno").val())!="" && $.trim($("#bankname").val())!="" && $.trim($("#branchname").val())=="" ) {
            $("#branch-blank-alert").alert();
            $("#branch-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#branch-blank-alert").hide();
            });
            $("#branchname").focus();
            return false;
          }    
	    
	    event.preventDefault();
      $("#ifsc").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#bankname").focus().select();
	};
    });    

    $("#ifsc").keydown(function(event) {
	if (event.which==13) {

         if ($.trim($("#accountno").val())=="" && $.trim($("#bankname").val())=="" && $.trim($("#branchname").val())=="" && $.trim($("#ifsc").val())!="" ) {
            $("#accountno_bankname_branch-blank-alert").alert();
            $("#accountno_bankname_branch-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#accountno_bankname_branch-blank-alert").hide();
            });
            $("#accountno").focus();
            return false;
         }

	    if ($.trim($("#accountno").val())!="" && $.trim($("#bankname").val())=="" && $.trim($("#branchname").val())=="" && $.trim($("#ifsc").val())!="" ) {
            $("#bankname_branch-blank-alert").alert();
            $("#bankname_branch-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname_branch-blank-alert").hide();
            });
            $("#bankname").focus();
            return false;
         }



            if ($.trim($("#accountno").val())!="" && $.trim($("#bankname").val())!="" && $.trim($("#branchname").val())!="" && $.trim($("#ifsc").val())=="" ) {
            $("#ifsc-blank-alert").alert();
            $("#ifsc-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#ifsc-blank-alert").hide();
            });
            $("#ifsc").focus();
            return false;
            }
	    
      event.preventDefault();
      $("#transportationmode").focus().select();
    }
    if (event.which==38) {
	 event.preventDefault();
	 $("#branchname").focus().select();
       };
    });
    //Click event that opens a modal to add Product from Invoice.
    $("#invoice_addproduct").click(function(event){
	var call;
      if($("#taxapplicable").val() == 7){
	   call = '/product?type=addtab&extrabuttons=0';
      }

      else{
	   call = '/product?type=addtabvat&extrabuttons=0';
      }
      
    /* Tab to load add product page. */
    $.ajax({

        url: call,
      type: 'POST',
      datatype: 'text/html',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      $("#viewproduct").html("");
        $("#viewproduct").html(resp);
        $("#addproductmodal").modal("show");
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    });
    $('#addproductmodal').on('shown.bs.modal', function(e) { // shown.bs.modal is an event which fires when the modal is opened
            productmodal = 1;
        $('#addproductmodal input:not(":hidden"), #addproductmodal select:not(":hidden")').first().focus();
            $(".product_name_gst:disabled, .product_name_vat:disabled").prop("disabled", false);
          });
        $('#addproductmodal').on('hidden.bs.modal', function(e) { // hidden.bs.modal is an event which fires when the modal is opened
            productmodal = 0;
            let productcode = $('#selectedproductid').val();
            if (productcode == '') {
                $('.product_name_gst:visible, .product_name_vat:visible').first().focus();
                $('html,body').animate({scrollTop: ($("#consigneeaddress").offset().top)},'fast');
              return false;
            }
            let vatgst = 'vat';
            let discindex = 4;
            if ($("#taxapplicable").val() == 7) {
                vatgst = 'gst';
                discindex = 5;
            }
            let curindex = $('#invoice_product_table_' + vatgst + ' tbody tr:last').index();
            $("#msspinmodal").modal("show");
            $.ajax({
		url: '/invoice?action=getproduct',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "productcode": productcode, "custid":$("#invoice_customer").val(), "inoutflag":$("#status").val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    }).done(function(resp) {
		console.log("success");
		if (resp["gkstatus"] == 0) {
		    $('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(0) select').append('<option value=' + productcode + ' gsflag="' + resp["gsflag"] +'">' + resp["productdesc"] + '<option>'); //Append a product
                    $('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(0) select').val(productcode).change();
		    $('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(' + discindex  + ') span').data("discountamount", resp["discountamount"]);
		    $('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(' + discindex  + ') span').data("discountpercent", resp["discountpercent"]);
		    if($('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(' + discindex  + ') input').val() == 0){
			if ($("#discountpercent").val() == 16){
			$('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(' + discindex  + ') input').val(resp["discountpercent"]);
		    }
		    else {
			$('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(' + discindex + ') input').val(resp["discountamount"]);
		    }
		    }
                    $('html,body').animate({scrollTop: ($("#consigneeaddress").offset().top)},'fast');
                    $('#invoice_product_table_' + vatgst + ' tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
		}
	    }).fail(function() {
                console.log("error");
            }).always(function() {
                console.log("complete");
            });
            $("#selectedproductid").val("");
            $("#msspinmodal").modal("hide");
            $(".modal-backdrop").remove();
        });
});
