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
"Reshma Bhatawadekar <reshma_b@riseup.net>"
"Nitesh Chaughule <nitesh@disroot.org>"
*/

// This script is for the add adddeliverychallan.jinja2


$(document).ready(function() {
	sessionStorage.setItem("invoicesave",0);
	var dcid=0;
    $('.modal-backdrop').remove();
    $('.delchaldate').autotab('number');
    $(".supplydate").autotab('number');  
    $("#deliverychallan_challanno").focus().select();
    $("#deliverychallan_date").numeric();
    $("#deliverychallan_month").numeric();
    $("#deliverychallan_year").numeric();
    $('.deliverychallan_product_quantity').numeric({ negative: false});
	$('#deliverychallan_noofpackages').numeric({ negative: false});
    $(".borderdiv").height($("#maindivdc").height());
    $(".discaddon").hide();
    $(".discaddon").siblings().width("100%");
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var selectedproduct = "";
	var gstins = {};
	// for round of feature
	let roundoffflag = 0;  

    //Initialising some variables.
    var issuername = "";
    var designation = "";
    var invoicedatestring = "";
    var invoicedate = "";
    var gstdate = Date.parseExact('01072017', "ddMMyyyy");
    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html();  //HTML for table displaying totals in GST Product Table.
    var vathtml = $('#invoice_product_table_vat tbody tr:first').html();  //HTML for VAT Product Table row.

	$('#roundoff_checkbox').tooltip({
		title : "Round Off Grand Total Value?",
		placement : "top"
	});

    var vatorgstflag = sessionStorage.vatorgstflag;
    if(sessionStorage.vatorgstflag == '22' ){
	$(".gstinfield").hide();
	$(".tinfield").show();
	$(".gstfield").hide();
	$("#smalllink").hide();
	$(".onlyvat").show();
	$(".gstvat").hide();
	$(".product_name_vat").searchify();
    } else {
	$(".gstinfield").show();
	$(".vatfield").hide();
	$(".gstvat").show();
	$("#smalllinkvat").hide();
	$(".onlyvat").hide();
        $(".product_name_gst").searchify();
    }


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
    
  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
	return str;
    }
  }
  function yearpad (str, max) { //to add leading 20 or 200 in the year
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
  $("#deliverychallan_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#deliverychallan_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#deliverychallan_year").blur(function(event) {
      $(this).val(yearpad($(this).val(), 4));
      invoicedatestring = $("#deliverychallan_date").val() + $("#deliverychallan_month").val() + $("#deliverychallan_year").val();
      invoicedate = Date.parseExact(invoicedatestring, "ddMMyyyy");
      if (invoicedatestring.length == 0 && $("#deliverychallan_challanno").val() != "") {
	  $("#date-blank-alert").alert();
	  $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $("#date-blank-alert").hide();
	  });
	  $("#deliverychallan_date").focus().select();
	  return false;
      }
      else if (!invoicedate && invoicedatestring.length == 8) {
	  $("#date-alert").alert();
	  $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $("#date-alert").hide();
	  });
	  $("#deliverychallan_date").focus().select();
	  return false;
      }
      else if (invoicedate) {
	  if (!invoicedate.between(financialstart, financialend)) {
	      $("#between-date-alert").alert();
	      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#between-date-alert").hide();
	      });
	      $('#deliverychallan_date').focus().select();
	      return false;
	  }
	  if (invoicedate >= gstdate) {
	      $("#taxapplicabletext").text("GST");
	      $(".taxapplicable").val("7");
	      $("#gst").click();
	      $(".taxapplicable").change();
	      $("#invoice_product_table_vat").hide();  //Hides VAT Product table and fields for TIN.
	      $("#vathelp").hide();
	      $(".tinfield").hide();
	      $("#gstproducttable").show();  //Shows GST Product table.
	      $(".gstinfield").show();
	      $(".vatfield").hide();
	      $(".gstfield").show();
	  }
	  else {
	      $("#taxapplicabletext").text("VAT");
	      $(".taxapplicable").val("22");
	      $("#vat").click();
	      $("#gstproducttable").hide();
	      $(".gstinfield").hide();
	      $("#invoice_product_table_vat").show();
	      $(".tinfield").show();
	      $("#vathelp").show();
	      $(".gstfield").hide();
	      $(".vatfield").show();
	      $(".product_name_vat").searchify();
	  }
      }
  });
    $("#deliverychallan_year").blur();


    //Converting List of Customers/Suppliers into a searchable combo
    $("#deliverychallan_customer").searchify();
    $("#deliverychallan_customer").removeClass("col-sm-8");
    $("#deliverychallan_customer").parent().addClass("col-sm-8 nopadding");

	$(".input-sm:visible").first().focus();  //Focus on the first element when the page loads
    //Preventing characters in numeric fields.
    $("#invoice_date").numeric({ negative: false });
    $("#invoice_month").numeric({ negative: false });
    $("#invoice_year").numeric({ negative: false });
	$('.invoicedate').autotab('number');  //Focus shifts from fields among date fields.
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
	else
	{
		$("#inv_invoicestate").focus();
	}
});
$("#invoice_date").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#invoice_month").focus().select();  //Focus shifts to Month field
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#invoice_number").focus().select();  //Focus shifts to Invoice Number.
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
//Initialising some variables.
	var taxtype;
	let roundoffvalue;
    var address = "";
     financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");  //Start of financial year is saved in a variable.
     financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");  //End of financial year is saved in a variable.
     invoicedatestring = "";
    var numbertowords="";
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
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled") && $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').is(":disabled")) {
	    if ($("#discountpercent").val() == 16){
		rowdiscount = (rowprice * rowdiscount)/100;
		rowtaxableamount = rowprice - rowdiscount;
	    }
	    else {
		rowtaxableamount = rowprice - rowdiscount;
	    }
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
	    totalcgst = totalcgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(8) input').val());
	    totalsgst = totalsgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(10) input').val());
	    totaligst = totaligst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(12) input').val());
	    totalcess = totalcess + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(14) input').val());
	    totalamount = totalamount + parseFloat($('#invoice_product_table_total tbody tr:eq(' + i + ') td:eq(0) input').val());
	}

	//Total of various columns are displayed on the footer.
	if ($("#discountpercent").val() == 1){
	    $('#discounttotal_product_gst').text(parseFloat(totaldiscount).toFixed(2));
	}
	else {
	    $('#discounttotal_product_gst').text("");
	}

	if ($("#roundoff_checkbox").is(":checked")){
		var res = 	parseFloat(Math.round(totalamount)).toFixed().toString();
		roundoffflag = 1;
	}
	else{
		var res = totalamount.toString();
		roundoffflag = 0;
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
	$("#totalValueInWord").text(numbertowords);
	$("#totalinvoicevalueroundedoff").text(parseFloat(Math.round(totalamount)).toFixed(2));
	tottaxable=totaltaxable;
	tottax=totaltax;
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
        if ($("#discountpercent").val() == 16){
            rowdiscount = (rowqty * rowprice * rowdiscount)/100;
        }
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
	    totaltax = totaltax + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(7) input').val());
	    totalamount = totalamount + parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(8) input').val());
	}
	//Total of various columns are displayed on the footer.
	if ($("#discountpercent").val() == 1){
	    $('#discounttotal_product_vat').show().val(parseFloat(totaldiscount).toFixed(2));
	}
	else {
	    $('#discounttotal_product_vat').hide();
	}
	if ($("#roundoff_checkbox").is(":checked")){
		var res = 	parseFloat(Math.round(totalamount)).toFixed().toString();
		roundoffflag = 1;
	}
	else{
		var res = totalamount.toString();
		roundoffflag = 0;
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
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totalinvoicevalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
	$("#totalinvoicevalueroundedoff").text(parseFloat(Math.round(totalamount)).toFixed(2));
	$("#totalValueInWord").text(numbertowords);
	tottaxable=totaltaxable;
	tottax=totaltax;
    }

    
  // events for shifting focus. Enter shifts to next element and up arrow shifts to previous
  $("#deliverychallan_purchaseorder").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_challanno").focus().select();
    }
  });

    //Certain fields are hidden in the case of Delivery In. They are shown in Delivery Out.
    if ($("#status").val() == '15') {  //In/Out flag is saved in a hidden field. 15 is OUT(Delivery Out) and 9 is IN(Delivery In).
	$(".invoice_issuer").show();  //Issuer Name is shown in Delivery Out. Delivery In is only recorded.	
	$(".fixed-table").removeClass('fixed-tablepurchase');  //CSS class for adjusting style properties.
	$(".fixed-table").addClass('fixed-tablesale');
    }

    if ($("#status").val() == '9') {  
	$(".reversepurchase").show();
    }

  $("#deliverychallan_customer").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
            $("#custsup-blank-alert").alert();
            $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#custsup-blank-alert").hide();
            });
            $('#deliverychallan_customer').focus();
            return false;
	}
      else {
        $("#deliverychallan_customerstate").focus().select();
      }
    }
    if (event.which==38 && (document.getElementById('deliverychallan_customer').selectedIndex==1||document.getElementById('deliverychallan_customer').selectedIndex==0)) {
	event.preventDefault();
	if($('#custchange.custsupchange').is(':checked')){
		$("#custchange.custsupchange").focus();
	}
	else{
		$("#supchange.custsupchange").focus();

	}

    }
    if (event.which==32){
      event.preventDefault();
      $("#deliverychallan_customer").prop("disabled", true);
      $('#deliverychallan_addcust').click();
    }
  });

  $("#deliverychallan_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($('#deliverychallan_date').val()=="") {
        $("#date-blank-alert").alert();
        $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#date-blank-alert").hide();
        });
        $('#deliverychallan_date').focus();
        return false;
      }
      else {
        $("#deliverychallan_month").focus().select();
      }
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_challanno").focus().select();
    }
  });
    
  $("#deliverychallan_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($('#deliverychallan_month').val()=="") {
        $("#date-blank-alert").alert();
        $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#date-blank-alert").hide();
        });
        $('#deliverychallan_month').focus();
        return false;
      }
      else {
        $("#deliverychallan_year").focus().select();
      }
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_date").focus().select();
    }
  });

  $("#deliverychallan_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($('#deliverychallan_year').val()=="") {
        $("#date-blank-alert").alert();
        $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#date-blank-alert").hide();
        });
        $('#deliverychallan_year').focus();
        return false;
      }
      else {
          $("#invoicestate").focus().select();
      }
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_month").focus().select();
    }
  });

  $("#deliverychallan_challanno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($("#deliverychallan_challanno").val()=="") {
        $("#challanno-blank-alert").alert();
        $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#challanno-blank-alert").hide();
        });
        $('#deliverychallan_challanno').focus();
        return false;
      }
      else {
        $("#deliverychallan_date").focus().select();
      }
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_purchaseorder").focus().select();
    }
  });

    /*If Billing Details same as Shipping Details then autopopulate them in Shipping Details.*/
    $("#consigneedetails").change(function(){
	if($(this).prop('checked') == true){
	    $("#consigneename").val($("#deliverychallan_customer option:selected").attr("name"));
	    $("#consigneestate").val($("#deliverychallan_customerstate option:selected").val());
	    $("#statecodeofconsignee").text(pad($("#statecodeofcustomer").text(), 2));
		$("#deliverychallan_consigneeaddr").val($("#deliverychallan_customeraddr").text());
	    $("#deliverychallan_consigneepincode").val($("#deliverychallan_customerpincode").text());
		
	    if(invoicedate >= gstdate){
		$("#gstinconsignee").val($("#gstin").text());
	    }else{
		$("#tinconsignee").val($("#tin").text());
	    }
	}
	else{
	    $("#consigneename").val("");
	    $("#consigneestate").val("");
	    $("#statecodeofconsignee").text("");
	    $("#deliverychallan_consigneeaddr").val("");
	    if(vatorgstflag == 7){
		$("#gstinconsignee").val("");
	    }else{
		$("#tinconsignee").val("");
	    }
	}
    });

    //Keydown event for 'Consignee Details'.
    $("#consigneedetails").keydown(function(event) {
	if (event.which == 13) {
	    $("#consigneename").focus();
	}
	if(event.which == 38){
	    $("#deliverychallan_customerstate").focus();
	}
    });

    //Change Event For 'State'.
    //invoice_customerstate
    $("#invoicestate").change(function(event) {
	$("#statecodeforinvoice").text(pad($("#invoicestate option:selected").attr("stateid"), 2));
	if ($(".taxapplicable").val() == 7){
	    if ($("#deliverychallan_customerstate option:selected").val() == $("#invoicestate option:selected").val()) {
		    $(".igstfield").hide();
		    $(".igstfield").css('border','');
		    $(".sgstfield").show();
	    } else {
		    $(".sgstfield").hide();
		    $(".sgstfield").css('border','');
		    $(".igstfield").show();
		}
	  }
	$ (".product_name_vat, .product_name_gst").change();

	var gstinstateid=$("#invoicestate option:selected").attr("stateid");
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
	
	});
	$("#inv_invoicestate").change(function(event) {
		$("#inv_statecodeforinvoice").text(pad($("#inv_invoicestate option:selected").attr("stateid"), 2));
		$("#originaddress").val('');
		var gstinstateid=$("#inv_invoicestate option:selected").attr("stateid");
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
			$("#inv_orggstin").text(resp["gkresult"]);
				   }
					})
					.fail(function() {
						console.log("error");
					})
					.always(function() {
						console.log("complete");
					});
					var invstate = $("#inv_invoicestate option:selected").val();
					var invstateid=$("#inv_invoicestate option:selected").attr("stateid");//statecode
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
							$("#originaddress").val(resp["orgdetails"]["orgaddr"]+","+resp["orgdetails"]["orgcity"]+","+resp["orgdetails"]["orgstate"]+","+resp["orgdetails"]["orgpincode"]);
							$("#originaddress").prop("disabled", true);
							}else{$("#originaddress").prop("disabled", false);}
							 }
							})
							.fail(function() {
								console.log("error");
							})
							.always(function() {
								console.log("complete");
							});
				
		
		});
    $("#invoicestate").change();

    //Keydown For 'State'.
    $("#invoicestate").keydown(function(event) {
	if (event.which == 13) {
	    if ($("#deliverychallan_godown").is(":visible")) {
		$("#deliverychallan_godown").focus().select();
	    }else{
		$("#deliverychallan_consignment").focus();
	    }
	}
	else if (event.which == 38) {
	    if ($("#invoicestate option:visible").first().is(":selected")) {
		$("#deliverychallan_year").focus();
	    }
	}
    });

  $("#deliverychallan_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_consignment').focus();
    }
    if (event.which==38 && $("#deliverychallan_godown option:selected").index()==0) {
      event.preventDefault();
      $("#invoicestate").focus().select();
    }
  });

  $("#deliverychallan_consignment").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if($('#custchange.custsupchange').is(':checked')){
		$("#custchange.custsupchange").focus();
	}
	else{
		$("#supchange.custsupchange").focus();

	}
    }
    if (event.which==38 && document.getElementById('deliverychallan_consignment').selectedIndex==0) {
	event.preventDefault();
	if ($("#deliverychallan_godown").is(":visible")) {
		$("#deliverychallan_godown").focus().select();
	    }else{
		$("#invoicestate").focus();
	    }
    }
  });

  $('input:radio[name=csradio]').keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();

	$('#deliverychallan_customer').focus().select();
	}
    if (event.which==38) {
		event.preventDefault();

		$("#deliverychallan_consignment").focus();
	    
    }
  });

  //Keyevents for Consignee fields
  $("#consigneename").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	$('#consigneestate').focus();
    }
    if (event.which==38) {
	event.preventDefault();
	if ($("#consigneedetails").is(":visible")){
	    $("#consigneedetails").focus();
	}else{
	$("#deliverychallan_customerstate").focus().select();
	}
    }
  });
  $("#consigneestate").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($("#tinconsignee").is(":visible")) {
	    $("#tinconsignee").focus();
	}else{$('#gstinconsignee').focus();}
    }
    if (event.which==38 && document.getElementById('consigneestate').selectedIndex==0) {
      event.preventDefault();
      $("#consigneename").focus().select();
    }
  });

    $("#gstinconsignee").keydown(function(event) {
	if(event.which==13){
	    var gstinstring = $("#gstinconsignee").val();
	    if(gstinstring != ""){
		var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
		var alfhanum = /^[0-9a-zA-Z]+$/;
  		if(gstinstring.length !=15){
  		    $("#gstin-improper-modal").alert();
		    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
			$("#gstin-improper-modal").hide();
		    });
		    $("#gstinconsignee").focus();
  		    return false;
		}else if(gstinstring.substring(0, 2) != $("#statecodeofconsignee").text() || !gstinstring.substring(2, 12).match(regExp)  || !gstinstring.substring(12, 15).match(alfhanum)){
		    $("#gstin-improper-modal").alert();
		    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
			$("#gstin-improper-modal").hide();
		    });
		    $("#gstinconsignee").focus();
		    return false;
		}
	    }
	    $("#deliverychallan_consigneeaddr").focus();
	}
	if(event.which==38){
	    $('#consigneestate').focus();
	}
    });

    

    $("#tinconsignee").keydown(function(event) {
	if(event.which==13){
	    $("#deliverychallan_consigneeaddr").focus();
	}
	if(event.which==38){
	    $('#consigneestate').focus();
	}
    });
    
  $("#deliverychallan_consigneeaddr").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($("#consigneename").val() == "" && $("#deliverychallan_consigneeaddr").val() != ""){
	    $("#consigneename-blank-alert").alert();
            $("#consigneename-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#consigneename-blank-alert").hide();
            });
	    $("#consigneename").focus();
	    return false;
	}
	
	if ($("#consigneename").val() != "" && $("#deliverychallan_consigneeaddr").val() == ""){
	    $("#consigneeaddr-blank-alert").alert();
            $("#consigneeaddr-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#consigneeaddr-blank-alert").hide();
            });
	    $("#deliverychallan_consigneeaddr").focus();
	    return false;
	}

	var gstinstring = $("#gstinconsignee").val();
	if(gstinstring != ""){
	    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
	    var alfhanum = /^[0-9a-zA-Z]+$/;
  	    if(gstinstring.length !=15){
  		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$("#gstinconsignee").focus();
  		return false;
	    }else if(gstinstring.substring(0, 2) != $("#statecodeofconsignee").text() || !gstinstring.substring(2, 12).match(regExp)  || !gstinstring.substring(12, 15).match(alfhanum)){
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$("#gstinconsignee").focus();
		return false;
	    }
	}

		$("#deliverychallan_consigneepincode").focus();
	    
	
	$('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
    }
    if (event.which==38) {
	event.preventDefault();
	if ($("#tinconsignee").is(":visible")) {
	    $("#tinconsignee").focus();
	}else{$("#gstinconsignee").focus();}
    }
  });

  $("#deliverychallan_consigneepincode").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
		if ($("#consigneename").val() == "" && $("#deliverychallan_consigneepincode").val() != ""){
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
			$("#consigneename-blank-alert").alert();
				$("#consigneename-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#consigneename-blank-alert").hide();
				});
			$("#consigneename").focus();
			return false;
		}
		
		if ($("#consigneename").val() != "" && $("#deliverychallan_consigneepincode").val() == ""){
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
			$("#pin-blank-alert").alert();
				$("#pin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pin-blank-alert").hide();
				});
			$("#deliverychallan_consigneepincode").focus();
			return false;
		}
		var pincode_val=($("#deliverychallan_consigneepincode").val());
		var reg = /^[0-9]+$/;
		  if (pincode_val != "") {
	
			 if (!reg.test(pincode_val) || pincode_val.length != 6) {
			$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
				$("#pinval-blank-alert").alert();
				$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#pinval-blank-alert").hide();
				});
				$("#deliverychallan_consigneepincode").focus();
				return false;
				}
		}
		if($("#gst").is(":not(':visible')")){
			$(".product_name_vat:first").focus().select();
		}else{
			if($(".taxapplicable").val() == 22){
			$("#vat").focus().select();
			}else{
			$("#gst").focus().select();
			}
		}
	}
	if (event.which==38) {
		event.preventDefault();
		$("#deliverychallan_consigneeaddr").focus();
	}
	});
    
    $("#deliverychallan_noofpackages").keydown(function(event){
	if(event.which==13){
	    event.preventDefault();
	    if ($('#deliverychallan_noofpackages').val() == ""){
		$("#noofpackages-blank-alert").alert();
		$("#noofpackages-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#noofpackages-blank-alert").hide();
		});
		$('#deliverychallan_noofpackages').focus();
		return false;
	    }    
	    $("#transportationmode").focus().select();
	}
	else if(event.which==38){
	    $('.invoice_product_discount_gst').focus();
	}
    });
    
  $("#transportationmode").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($("#vehicleno").is(":visible")) {
	    $("#vehicleno").focus();
	}
	else if($("#status").val() == 15){
            $('#invoice_issuer_name').focus();
	}else{ $("#supply_date").focus(); }
    }
    if (event.which==38) {
	event.preventDefault();
	if ($("#transportationmode option:visible").first().is(":selected")) {
	    $('#deliverychallan_noofpackages').focus();
	}
    }
  });

    $("#vehicleno").keydown(function(event){
	if(event.which == 13){
	    event.preventDefault();
	    if($("#invoice_issuer_name").is(":visible")){
		$("#invoice_issuer_name").focus();
	    }else{
		$("#supply_date").focus();
	    }
	}
	else if(event.which ==38){
	    $("#transportationmode").focus().select();
	}
    });
    
  $("#invoice_issuer_name").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($.trim($('#invoice_issuer_name').val())=="" && $("#status").val()=='15') {
	    $("#issuername-blank-alert").alert();
	    $("#issuername-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#issuername-blank-alert").hide();
	    });
	    $('#invoice_issuer_name').focus();
	    return false;
	}
	$('#invoice_issuer_designation').focus();
    }
    if (event.which==38) {
	event.preventDefault();
	if ($("#vehicleno").is(":visible")) {
	    $("#vehicleno").focus();
	}else{ $("#transportationmode").focus().select(); }
    }
  });
    
  $("#invoice_issuer_designation").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($.trim($('#invoice_issuer_designation').val())=="" && $("#status").val()=='15') {
	    $("#designation-blank-alert").alert();
	    $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#designation-blank-alert").hide();
	    });
	    $('#invoice_issuer_designation').focus();
	    return false;
	}
	$('#supply_date').focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#invoice_issuer_name").focus();
    }
  });

    $('#supply_date').keydown(function(event){
	if(event.which == 13){
	event.preventDefault();
	    $("#supply_month").focus();
	}
	if(event.which ==38){
	    if($("#status").val() == 15){
		$("#invoice_issuer_designation").focus();
	    }
	    else if($("#vehicleno").is(":visible")){
		$("#vehicleno").focus();
	    }else{ $("#transportationmode").focus().select(); }
	}
    });

    $("#supply_month").keydown(function(event){
	if(event.which==13){
	    event.preventDefault();
	    $("#supply_year").focus();
	}
	else if(event.which==38){
	    $("#supply_date").focus();
	}
    });

    $("#supply_year").keydown(function(event){
	if(event.which==13){
	    event.preventDefault();
	    $("#deliverychallan_save").focus().click();
	}
	else if(event.which==38){
	    $("#supply_month").focus();
	}
    });

    var modalpresent = 0;
    $(document).off("keyup").on("keyup", function(event) {
        if (event.which == 45) {
            event.preventDefault();
            if (modalpresent == 0) {
                $("#deliverychallan_save").click();
            }
            else {
                $("#cussup_save").click();
            }
            return false;
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
		    let custsupdata=resp["customers"];
                    let n = (Object.keys(custsupdata).length);
			var optionsdiv = $("#deliverychallan_customer").closest("div");
			$('#deliverychallan_customer').empty();

		    optionsdiv.find('select[style*="display: none"]').empty();
                    	for (let i in custsupdata ) {

				$('#deliverychallan_customer').append('<option value="' + custsupdata[i].custid + '" name="'+ custsupdata[i].custname +'">' + custsupdata[i].custname + '</option>');
				optionsdiv.find('select[style*="display: none"]').append('<option value="' + custsupdata[i].custid + '">' + custsupdata[i].custname + '</option>');

			}
		    if($("#status").val()==15){

                             $("#deliverychallan_customer").append('<option value="-1" style="font-family:\'FontAwesome\',\'Helvetica Neue\', Helvetica, Arial, sans-serif;\">&#xf067 Add Customer</option>');
			    $("#deliverychallan_customer").append('<option value="" disabled hidden selected> Select Customer </option>');

                            optionsdiv.find('select[style*="display: none"]').append("<option value='-1' style='font-family:'FontAwesome','Helvetica Neue', Helvetica, Arial, sans-serif;'>&#xf067 Add Customer </option>");
                            optionsdiv.find('select[style*="display: none"]').append('<option value="" disabled hidden selected> Select Customer </option>');

			}
		    else{
                        $('<option value="6">Java Script</option>').appendTo("#ddlList");

				$("#deliverychallan_customer").append('<option value="" disabled hidden selected> Select Supplier</option>');
                             $("#deliverychallan_customer").append('<option value="-1" style="font-family:\'FontAwesome\',\'Helvetica Neue\', Helvetica, Arial, sans-serif;\">&#xf067 Add Supplier</option>');

				optionsdiv.find('select[style*="display: none"]').append("<option value='-1' style='font-family:'FontAwesome','Helvetica Neue', Helvetica, Arial, sans-serif;'>Add Supplier </option>");
				optionsdiv.find('select[style*="display: none"]').append('<option value="" disabled hidden selected> Select Supplier </option>');
			}
			
		
		}
		});
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


    $("#deliverychallan_customer").change(function(event) {
    if($("#deliverychallan_customer option:selected").val() != ""){
	if($("#deliverychallan_customer option:selected").val() != "-1"){
    $.ajax({
      url: '/customersuppliers?action=get',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid":$("#deliverychallan_customer option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
	console.log("success");
	if (resp["gkstatus"]==0) {
		$("#accountno").val(resp["gkresult"]["bankdetails"]["accountno"]); //Account Number of supplier loaded
		$("#branchname").val(resp["gkresult"]["bankdetails"]["branchname"]);   //branchname of supplier is loaded
		$("#ifsc").val(resp["gkresult"]["bankdetails"]["ifsc"]);           //ifsc code of supplier is loaded
		$("#bankname").val(resp["gkresult"]["bankdetails"]["bankname"]);   //branchname of supplier is loaded
	    $("#deliverychallan_customerstate").val(resp["gkresult"]["state"]);  //State of Customer is selected automatically.
	    $("#deliverychallan_customerstate").change();
		$("#deliverychallan_customeraddr").text(resp["gkresult"]["custaddr"]);  //Adress of Customer is loaded.
	    $("#deliverychallan_customerpincode").text(resp["gkresult"]["pincode"]);  //pincode of Customer is loaded.		
	    $("#tin").text(resp["gkresult"]["custtan"]);  //Customer TIN is loaded.
	    //All GSTINs of this customer are
	    gstins = resp["gkresult"]["gstin"];
            if (gstins != null && $("#deliverychallan_customerstate option:selected").attr("stateid") in gstins) {
      		$("#gstin").text(resp["gkresult"]["gstin"][$("#deliverychallan_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
      	    }
      	    else {
      		$("#gstin").text('');  //If GSTIN is not available it is set as blank.
      	    }

	    //State Code of Customer State is loaded.
	    $("#statecodeofcustomer").text(pad($("#deliverychallan_customerstate option:selected").attr("stateid"), 2));
	    
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
		$("#deliverychallan_customerstate option:first").prop("selected", true);
		$("#deliverychallan_customerstate").change();
		$("#deliverychallan_customeraddr").text("");
		$("#tin").text("");
		$("#gstin").text("");
		//Calling Modal
		$('#deliverychallan_addcust').click();
	}
	}
  });

    //Change Event for 'Supplier/customer' state.
    $("#deliverychallan_customerstate").change(function(event) {
	$("#statecodeofcustomer").text(pad($("#deliverychallan_customerstate option:selected").attr("stateid"), 2));  //State code is loaded.
	if (gstins != null && $("#deliverychallan_customerstate option:selected").attr("stateid") in gstins) {
	       $("#gstin").text(gstins[$("#deliverychallan_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
	}
	else {
	    $("#gstin").text("");  //If GSTIN is not available it is set as blank.
	}
	if ($(".taxapplicable").val() == 7) {
	    if ($("#deliverychallan_customerstate option:selected").val() == $("#invoicestate option:selected").val()) {
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
    $("#deliverychallan_customerstate").change();

    //Keydown for customer and supplier state.
    $("#deliverychallan_customerstate").keydown(function(event) {
	if (event.which == 13) {
	    if ($("#consigneedetails").is(":visible")){
		$("#consigneedetails").focus();
	    }else{
		$("#consigneename").focus();
	    }
	}
	if(event.which == 38){
	    if ($("#deliverychallan_customerstate option:visible").first().is(":selected") || $("#deliverychallan_customerstate option:first").is(":selected")) {
		$("#deliverychallan_customer").focus().select();  //Focus shifts to Customer.
	    }
	}
    });

    //Change event for 'consignee state'.
    $("#consigneestate").change(function(event) {
	event.preventDefault();
	$("#statecodeofconsignee").text(pad($("#consigneestate option:selected").attr("stateid"), 2));  //State code of consignee is loaded.
	$(".product_name_vat, .product_name_gst").change();
    });
    $("#consigneestate").change();

    //Change event for 'GST' and 'VAT' radio button.
    $(document).off("change", '.taxapplicable').on("change", '.taxapplicable', function(event) {
	if($("#gst").is(":checked")){
	    $("#taxapplicabletext").text("GST");
	    $(".taxapplicable").val("7");
	    $("#invoice_product_table_vat").hide();  //Hides VAT Product table and fields for TIN.
		$("#vathelp").hide();
		$("#smalllink").show();	
	    $("#smalllinkvat").hide();
	    $(".tinfield").hide();
	    $("#gstproducttable").show();  //Shows GST Product table.
	    $(".gstinfield").show();
	    $(".vatfield").hide();
	    $(".gstfield").show();
	    /**On changing 'gst' or 'vat' radio button on the basis of 'source state' and 'destination state', 'igst' and 'sgst' fields are hide and show.**/
	    if ($("#invoice_customerstate option:selected").val() == $("#invoicestate option:selected").val()) {
		$(".igstfield").hide();
		$(".sgstfield").show();
	    }
	    else {
		$(".sgstfield").hide();
		$(".igstfield").show();
	    }
	    $(".product_name_gst").searchify(); //Converting to searcheable combo.
	}else if($("#vat").is(":checked")){  
	    $("#taxapplicabletext").text("VAT");
	    $(".taxapplicable").val("22");
	    $("#gstproducttable").hide();
	    $(".gstinfield").hide();
	    $("#invoice_product_table_vat").show();
	    $(".tinfield").show();
		$("#vathelp").show();
		$("#smalllink").hide();	
	    $("#smalllinkvat").show();
	    $(".gstfield").hide();
	    $(".vatfield").show();
	    $(".product_name_vat").searchify();
	}
    });
     //Keydown event for 'VAT' and 'GST' radio button.
    $(document).off("keydown", '.taxapplicable').on("keydown", '.taxapplicable ', function(event) {
	if (event.which == 13) {
	    if ($(".taxapplicable").val() == 7) {
		$(".product_name_gst:first").focus().select();
	    }
	    else {
		$(".product_name_vat:first").focus().select();
	    }
	}
    });

  $(document).off("click", '.discflagfield').on("click", '.discflagfield', function(event) {
    let discflag = $(this).data("discflag");
    let disckey;
    $(".discflagfield").toggleClass("active");
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
      if ($(".taxapplicable").val() == 7) {
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

  $(document).off("change",".product_name").on("change",".product_name",function(event)
  { // depending on the productcode its unit of measurement is retrieved from te database and displayed to the user
    var productcode = $(this).find('option:selected').val();
    var curindex = $(this).closest('tbody tr').index();
    if (curindex > 0) {
      for (var i = 1; i < curindex+1; i++) {
        for (var j = 0; j < curindex; j++) {
          selectedproduct = $("#deliverychallan_product_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
          $('#deliverychallan_product_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedproduct+']').prop('hidden', true).prop('disabled', true);
        }
      }
    }
  if (productcode != "") {    
  $.ajax({
    url: '/invoice?action=getproduct',
    type: 'POST',
    dataType: 'json',
    async : false,
    data : {"productcode":productcode},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
    console.log("success");
    if (resp["gkstatus"]==0) {
        // retrieved unit name is displayed as a span element
      $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) span').text(resp["unitname"]);
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

    //Change event for Product Name field.
    $(document).off('change', '.product_name_gst').on('change', '.product_name_gst', function(event) {
	event.preventDefault();
	var productcode = $(this).find('option:selected').val();
	var curindex = $(this).closest('tbody tr').index();
	var destinationstate = "";
	var sourcestate = "";

	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(0).toFixed(2));
	
      if ($("#status").val() == 9) {
	  destinationstate = $("#invoicestate option:selected").val();
	  sourcestate = $("#deliverychallan_customerstate").val();
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#invoicestate option:selected").val();
	  destinationstate = $("#deliverychallan_customerstate").val();
      }
    var taxflag=$(".taxapplicable").val();

    if (productcode != "") {
	$.ajax({
            url: '/deliverychallan?action=getappliedtax',
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
		   if('SGST' in resp['tax']){
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate if avaliable.
		       if ('CESS' in resp['tax']) {
			   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(resp['tax']['CESS']).toFixed(2));
		       }
		   }
		   //Loads IGST rate.
		   else if('IGST' in resp['tax']){
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(resp['tax']['IGST']).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
		       $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate.
		       if ('CESS' in resp['tax']) {
			   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(resp['tax']['CESS']).toFixed(2));
		       }
		   }
	       }
	       else if (resp["gkstatus"] == 1) {
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
      url: '/deliverychallan?action=getproduct',
      type: 'POST',
      dataType: 'json',
      async: false,
      data: { "productcode": productcode },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       console.log("success");
       if (resp["gkstatus"] == 0) {

         $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(1) .invoice_product_hsncode').text(resp["gscode"]);
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
	   if($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val() == 0){
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
	    sourcestate = $("#deliverychallan_customerstate").val();
	}
	else if ($("#status").val() ==  15) {
	    sourcestate = $("#invoicestate option:selected").val();
	    destinationstate = $("#deliverychallan_customerstate").val();
	}
	var taxflag=$(".taxapplicable").val();
	if (productcode != "") {
	    $.ajax({
		url: '/deliverychallan?action=getappliedtax',
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
			if ('VAT' in resp['tax']) {
			    $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['VAT']).toFixed(2));
			}
			else if ('CVAT' in resp['tax']) {
			    $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['CVAT']).toFixed(2));
			}
		    }
		    else if (resp["gkstatus"] == 1) {
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
	  url: '/deliverychallan?action=getproduct',
	  type: 'POST',
	  dataType: 'json',
	  async: false,
	  data: { "productcode": productcode },
	  beforeSend: function(xhr) {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	  }
      })
		.done(function(resp) {
		    console.log("success");
		    if (resp["gkstatus"] == 0) {
			$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) span').text(resp["unitname"]);
			$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]);
			$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) span').data("discountamount", resp["discountamount"]);
			$('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) span').data("discountpercent", resp["discountpercent"]);
			if($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val() == 0){
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

    $(document).off("keydown", ".product_name_gst").on("keydown", ".product_name_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').filter(function() {return $(this).css('display') == 'none';}).val() == "") {
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
        }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
        } else {
        $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(5) input').focus().select();
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

    $(document).off('change', '.invoice_product_quantity_gst').on('change', '.invoice_product_quantity_gst', function(event) {
    event.preventDefault();
      /* Act on the event */
      var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
    if ($(this).val() == "") {
      $(this).val(0);
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });    
    //

    //---------PPU-discount-rate----------//
    $(document).off('change', '.invoice_product_freequantity_gst').on('change', '.invoice_product_freequantity_gst', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
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
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

  $(document).off('change', '.invoice_product_per_price_gst').on('change', '.invoice_product_per_price_gst', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
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
      $("#deliverychallan_noofpackages").focus();
    }
  });

    $(document).off("change", ".invoice_product_discount_gst").on("change", ".invoice_product_discount_gst", function(event) {
	var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
      if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
	//For goods, price is product of rate and quantity.
	if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($(this).val()).toFixed(2)) > 100){
	  $("#discount-more-alert").alert();
	  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	    $(".invoice_product_discount_gst:eq(" + curindex + ")").focus().select();
	    $("#discount-more-alert").hide();
	  });
	  return false;
	}
	else{
	  if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $(".invoice_product_discount_gst:eq(" + curindex + ")").focus().select();
	      $("#discount-more-alert").hide();
	    });
	    return false;
	  }
	}
      }
      else{
	//For services, price is rate itself.
	if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($(this).val()).toFixed(2)) > 100){
	  $("#discount-more-alert").alert();
	  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	    $(".invoice_product_discount_gst:eq(" + curindex + ")").focus().select();
	    $("#discount-more-alert").hide();
	  });
	  return false;
	}
	else{
	  if (parseFloat(parseFloat($(this).val()).toFixed(2)) > parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $(".invoice_product_discount_gst:eq(" + curindex + ")").focus().select();
	      $("#discount-more-alert").hide();
	    });
	    return false;
	  }
	}
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
      if (curindex1 != (parseInt($("#invoice_product_table_gst tbody tr").length) - 1)) {//Not a last row.
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
	  //For goods, price is product of rate and quantity.
	  if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($(this).val()).toFixed(2)) > 100){
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $(".invoice_product_discount_gst:eq(" + curindex1 + ")").focus().select();
	      $("#discount-more-alert").hide();
	    });
	    return false;
	  }
	  else{
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').val()).toFixed(2)))) {
	      $("#discount-more-alert").alert();
	      $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_gst:eq(" + curindex1 + ")").focus().select();
		$("#discount-more-alert").hide();
	      });
	      return false;
	    }
	  }
	}
	else{
	  //For services, price is rate itself.
	  if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($(this).val()).toFixed(2)) > 100){
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $(".invoice_product_discount_gst:eq(" + curindex1 + ")").focus().select();
	      $("#discount-more-alert").hide();
	    });
	    return false;
	  }
	  else{
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').val()).toFixed(2))) {
	      $("#discount-more-alert").alert();
	      $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_gst:eq(" + curindex1 + ")").focus().select();
		$("#discount-more-alert").hide();
	      });
	      return false;
	    }
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
	    $('#invoice_product_table_gst tbody').append('<tr>' + gsthtml + '</tr>');
            if ($("#discountpercent").val() == 1){
		$(".discaddon").hide();
	    }
	    else {
		$(".discaddon").show();
	    }
	    $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	    $('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	    for (let i = 0; i <= curindex1; i++) {
		var selectedproduct = $("#invoice_product_table_gst tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
		$("#invoice_product_table_gst tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
	    }
	    $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
	    $("#invoicestate").change();
	    $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change().removeClass("searchifiedselect");
            $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').searchify();
            $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
	}
	else {
	    $("#deliverychallan_noofpackages").focus().select();
	}
    }
    //$("#transportationmode").focus().select();
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#deliverychallan_noofpackages").focus();
    }
});

    //VAT Validation and Calculation of tax
    $(document).off("keydown", ".product_name_vat").on("keydown", ".product_name_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').filter(function() {return $(this).css('display') == 'none';}).val() == "") {
            $("#product-blank-alert").alert();
            $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#product-blank-alert").hide();
            });
            $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
            return false;
        }
	setTimeout( function() { $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select(); }, 25 );
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex == 0) {
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      } else {
          $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(6) input').focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();
    }
      else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

    $(document).off('change', '.invoice_product_quantity_vat').on('change', '.invoice_product_quantity_vat', function(event) {
    event.preventDefault();
      var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
    if ($(this).val() == "") {
      $(this).val(0);
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

  $(document).off('change', '.invoice_product_freequantity_vat').on('change', '.invoice_product_freequantity_vat', function(event) {
    event.preventDefault();
    if ($(this).val() == "") {
      $(this).val(0);
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

  $(document).off('change', '.invoice_product_per_price_vat').on('change', '.invoice_product_per_price_vat', function(event) {
      event.preventDefault();
    if ($(this).val() == "") {
      $(this).val(0);
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#accountno").focus().select();
    }
  });

    $(document).off('change', '.invoice_product_discount_vat').on('change', '.invoice_product_discount_vat', function(event) {
      event.preventDefault();
    if ($(this).val() == "") {
      $(this).val(0);
    }
	var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
      if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($(this).val()).toFixed(2)) > 100){
	$("#discount-more-alert").alert();
	$("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
	  $("#discount-more-alert").hide();
	});
	return false;
      }
      else{
	if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2)))) {
	  $("#discount-more-alert").alert();
	  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	    $(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
	    $("#discount-more-alert").hide();
	  });
	  return false;
	}
      }
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_discount_vat").on("keydown", ".invoice_product_discount_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
      if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($(this).val()).toFixed(2)) > 100){
	$("#discount-more-alert").alert();
	$("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
	  $("#discount-more-alert").hide();
	});
	return false;
      }
      else{
	if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2)))) {
	  $("#discount-more-alert").alert();
	  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
	    $(".invoice_product_discount_vat:eq(" + curindex + ")").focus().select();
	    $("#discount-more-alert").hide();
	  });
	  return false;
	}
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#deliverychallan_noofpackages").focus().select();
    }
  });


  $(document).off('change', '.invoice_product_tax_rate_vat').on('change', '.invoice_product_tax_rate_vat', function(event) {
      event.preventDefault();
      var curindex1 = $(this).closest('tr').index();
    if ($(this).val() == "") {
      $(this).val(0);
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
	  if (parseFloat($('.invoice_product_per_price_vat:eq(' + curindex1 + ')').val()) == 0 && parseFloat($('.invoice_product_quantity_vat:eq(' + curindex1 + ')').val()) > 0) {
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
	$("#deliverychallan_noofpackages").focus();
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
	  if (parseFloat($('.invoice_product_per_price_vat:eq(' + curindex1 + ')').val()) == 0 && parseFloat($('.invoice_product_quantity_vat:eq(' + curindex1 + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	  if ($('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){
	      $('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	      if ($("#discountpercent").val() == 1){
		  $(".discaddon").hide();
	      }
	      else {
		$(".discaddon").show();
	      }
	  $('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	  for (let i = 0; i <= curindex1; i++) {
              var selectedproduct = $("#invoice_product_table_vat tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
	      $("#invoice_product_table_vat tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
          }
	  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
	      $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change().removeClass("searchifiedselect");
              $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').searchify();
              $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
	  }
      else {
          $("#deliverychallan_noofpackages").focus();
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
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
	  $("#deliverychallan_noofpackages").focus();
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

    //Date
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
	    if (supplydate < financialstart) {
		$("#supbetween-date-alert").alert();
		$("#supbetween-date-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#supbetween-date-alert").hide();
		});
		$('#supply_date').focus().select();
		return false;
	    }
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

  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
  {
      // focus shifting events based on ctrl and shift keys
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;

    if (event.which==13 || event.which==9) {
      event.preventDefault();

      if ($('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(0) select option:selected').val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(0) select').focus();
        return false;
      }

      else {
        $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      }



    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#deliverychallan_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#deliverychallan_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_consignment").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_consigneeaddr").focus().select();
      }
      else {
        $('#deliverychallan_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".deliverychallan_product_quantity").on("keydown",".deliverychallan_product_quantity",function(event)
  {
      /* enter key event. If enter key is pressed on product quaantity and
      all the details f this and all the details of previous rows of product table and the current row are filled
      then a new row is added aong with the availbable products filled in the product name select box*/
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if ($('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(1) input').val()=="") {

  	    	 $("#quantity-blank-alert").alert();
  	         $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
  	         $("#quantity-blank-alert").hide();


  	    });
$('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
      return false;
      }
else {
      $('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(1) input').focus().select();
    }



      if (curindex1 != ($("#deliverychallan_product_table tbody tr").length-1)) {
        $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
      }
      else if ($('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select option').length==2)
      {
          $("#deliverychallan_noofpackages").focus().select();
      }
      else {
        if ($('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:visible').length < 2) {
          $("#deliverychallan_noofpackages").focus().select();
        }
        else {
          //ajax call for getting all the available products in the database
          $.ajax({
            url: '/deliverychallan?action=getproducts',
            type: 'POST',
            dataType: 'json',
            async : false,
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
          .done(function(resp) {
            console.log("success");
            if (resp["gkstatus"]==0) {
                // new row is appended to the product table and the product name select box is populated with the retrieved products
              $('#deliverychallan_product_table tbody').append('<tr>'+
              '<td class="col-xs-7">'+
              '<select class="form-control input-sm product_name">'+
              '<option value="" disabled hidden selected>Select Product</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<div class="input-group">'+
              '<input type="text" class="deliverychallan_product_quantity form-control input-sm text-right" value="">'+
                '<span class="input-group-addon input-sm" id="unitaddon"></span>'+
              '</div>'+
              '</td>'+
              '<td class="col-xs-1">'+
              '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
              '</td>'+
              '</tr>');
              for (product of resp["products"]) {
                  // for loop to populate product in product name select box
                $('#deliverychallan_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
              }
              $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
              $('.deliverychallan_product_quantity').numeric({ negative: false});
              $(".product_name").change();
            }
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });
        }
      }
    }

    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#deliverychallan_product_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
      if (curindex1==0) {
        event.preventDefault();
        $("#deliverychallan_consignment").focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      $('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
      event.preventDefault();
    }
    else if (event.which==27) {
      event.preventDefault();
      $("#deliverychallan_noofpackages").focus().select();
    }

  });
$("#roundoff_checkbox").change(function(e){
	if ($("#roundoff_checkbox").is(":checked")){
		$("#roundoff_div").show();
		if($("#totalinvoicevalue").text() != "" || $("#totalinvoicevalue").text() != 0){
			$("#totalinvoicevalueroundedoff").text((Math.round(parseFloat($("#totalinvoicevalue").text()))).toFixed(2));
		}
		else{
			$("#totalinvoicevalueroundedoff").text("");
		}
		roundoffflag = 1;
	}
	else{
		$("#roundoff_div").hide();
		roundoffflag = 0;
	}

	if($(".taxapplicable").val() == 7){
		$('.invoice_product_quantity_gst').change();
	}
	else{
		$('.invoice_product_quantity_vat').change();
	}
});




    $(document).off("click", ".product_del").on("click", ".product_del", function(event){
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
	}
	if ($("#invoice_product_table_vat tbody tr").length == 1) {
	  $("#invoice_product_table_vat tbody tr:first td:eq(9) a.product_del").remove();
	}
      
	if ($("#invoice_product_table_gst tbody tr").length > 1) {
	    $(this).closest('tr').remove();
	    $("#invoice_product_table_gst tbody tr:eq("+curindex+")").remove();
	    $("#invoice_product_table_gst tbody tr:first td:eq(0) select").focus();
	    calculategstaxamt(curindex);
	}
	if ($("#invoice_product_table_gst tbody tr").length == 1) {
	    $("#invoice_product_table_total tbody tr:first td:last a.product_del").remove();
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

  $("#deliverychallan_addcust").click(function() {
      var custsup = "";
        if ($("#deliverychallan_gkstatus").val()=='out') {
            custsup = "/customersuppliers?action=showaddpopup&status=out";
        }
        if($("#deliverychallan_gkstatus").val()=='in'){
            custsup = "/customersuppliers?action=showaddpopup&status=in";
        }

     $.ajax(
     {

     type: "POST",
     url: custsup,
     global: false,
     async: false,
     datatype: "text/html",
     beforeSend: function(xhr)
       {
         xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
       },
     success: function(resp)
     {

           $("#viewcustsup").html("");
           $('.modal-backdrop').remove();
           $('.modal').modal('hide');
           $("#viewcustsup").html(resp);
           $('#custsupmodal').modal('show');
           $('#custsupmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
           {
               $('#add_cussup_name').focus();
	       modalpresent = 1;
           });
           $('#custsupmodal').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the modal is closed
				 {
				     modalpresent = 0;
				  $("#deliverychallan_customer").prop("disabled", false);
            var text1 = $('#selectedcustsup').val();
           if(text1==''){
              $('#deliverychallan_customer').val("");
              $('#deliverychallan_customer option[value=""]').prop("selected", true);
              $('#deliverychallan_customer').focus().change();
             return false;
           }
            var addoption=null;
           if ($("#status").val()=='9') {
               var urlcustsup = "/customersuppliers?action=getallsups";
            var addoption="Supplier";
           }
           if($("#status").val()=='15'){
               var urlcustsup = "/customersuppliers?action=getallcusts";
		addoption="Customer";
           }
           $.ajax({
             type:"POST",
             url: urlcustsup,
             global:false,
             async:false,
             datatype: "text/json",
             beforeSend: function(xhr){
             xhr.setRequestHeader("gktoken",sessionStorage.gktoken);
             },
           })
           .done(function(resp) {
             var custs = resp["customers"];
            $("#deliverychallan_customer").empty();
            $("#deliverychallan_customer").append('<option value="" disabled hidden selected>Select ' +addoption+ '</option>');
            
             for (i in custs){
               $("#deliverychallan_customer").append('<option value="'+custs[i].custid+'" >'+custs[i].custname+'</option>');
             }
               $("#deliverychallan_customer").append('<option value="-1" style=\"font-family:\'FontAwesome\',\'Helvetica Neue\', Helvetica, Arial, sans-serif;\">&#xf067 Add ' +addoption+ '</option>');
           });

            $("#deliverychallan_customer option").filter(function() {
                 return this.text == text1;
               }).attr('selected', true).trigger('change');
             $("#selectedcustsup").val("");
             $("#deliverychallan_customer").focus();
           });
     }
     }
     );
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
   $("#viewpurchaseorder").click(function(event) {
     /* Act on the event */
     event.stopPropagation();
     $("#dcmain").toggle();
     $("#purchaseordercollapsediv").toggle();
     $.ajax({
       url: '/purchaseorder?type=showview',
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
       $('#purchaseorderdiv').html(resp);
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
   });
   $("#backtodcin").click(function(event) {
     /* Act on the event */
     $("#dcmain").toggle();
     $("#purchaseordercollapsediv").toggle();
     $("#deliverychallan_challanno").focus();
     $('#purchaseorderdiv').html("");
   });

   $("#viewsalesorder").click(function(event) {
     /* Act on the event */
     event.stopPropagation();
     $("#dcmain").toggle();
     $("#salesordercollapsediv").toggle();
     $.ajax({
       url: '/salesorder?type=showview',
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
       $('#salesorderdiv').html(resp);
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
   });
   $("#backtodcout").click(function(event) {
     /* Act on the event */
     $("#dcmain").toggle();
     $("#salesordercollapsediv").toggle();
     $("#deliverychallan_challanno").focus();
     $('#salesorderdiv').html("");
   });
   $("#chkpaymentmode").change(function(event) {
    if ($("#chkpaymentmode option:selected").val()=="2"){ //If cash is selected then bankdetails fields are hide and 'CASH RECEIVED' is shown.
	$("#bank").show();
	$("#cash").hide();
	$("#oncredit").hide();
    } else if ($("#chkpaymentmode option:selected").val()=="3"){
	//If bank is selected then bankdetails fields are shown and 'CASH RECEIVED' is hide.
        $("#bank").hide();
	$("#cash").show();
	$("#oncredit").hide();
    }else {
	$("#bank").hide();
	$("#cash").hide();
	$("#oncredit").show();$("#chkpaymentmode").change(function(event) {
		if ($("#chkpaymentmode option:selected").val()=="2"){ //If cash is selected then bankdetails fields are hide and 'CASH RECEIVED' is shown.
		$("#bank").show();
		$("#cash").hide();
		$("#oncredit").hide();
		} else if ($("#chkpaymentmode option:selected").val()=="3"){
		//If bank is selected then bankdetails fields are shown and 'CASH RECEIVED' is hide.
			$("#bank").hide();
		}else {
		$("#bank").hide();
		}});
    }});
    var tax = {};
    var cess = {};
    var contents = {};
    var freeqty = {};
    var stock = {};
    var items = {};
    var discount = {};
    var delchaltotal = 0.00;
    var productcodes = [];
    var productqtys = [];
    var ppu;  
	var consignee = {};
	var curdate;
    $("#deliverychallan_save").click(function(event) {
	// save event for saving the delivery note
	event.stopPropagation();
	// below are all the validation checks
	var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
	if ($.trim($('#deliverychallan_challanno').val())=="") {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#challanno-blank-alert").alert();
	    $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#challanno-blank-alert").hide();
	    });
	    $('#deliverychallan_challanno').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_date').val())=="") {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_date').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_month').val())=="") {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_month').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_year').val())=="") {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_year').focus();
	    return false;
	}
	if(!Date.parseExact($("#deliverychallan_date").val()+$("#deliverychallan_month").val()+$("#deliverychallan_year").val(), "ddMMyyyy")){
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-alert").hide();
	    });
	    $('#deliverychallan_date').focus().select();
	    return false;
	}
	 curdate = Date.parseExact($("#deliverychallan_year").val()+$("#deliverychallan_month").val()+$("#deliverychallan_date").val(), "yyyyMMdd");
	if (!curdate.between(financialstart,financialend)) {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#between-date-alert").alert();
	    $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#between-date-alert").hide();
	    });
	    $('#deliverychallan_date').focus().select();
	    return false;
	}
	if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#custsup-blank-alert").alert();
	    $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#custsup-blank-alert").hide();
	    });
	    $('#deliverychallan_customer').focus();
	    return false;
	}

	//validation for consignee name and consignee address
	if ($("#consigneename").val() == "" && $("#deliverychallan_consigneeaddr").val() != ""){
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#consigneename-blank-alert").alert();
            $("#consigneename-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#consigneename-blank-alert").hide();
            });
	    $("#consigneename").focus();
	    return false;
	} else {
	    $('#deliverychallan_product_table tbody tr:first td:eq(0) select').focus();
	}
	
	if ($("#consigneename").val() != "" && $("#deliverychallan_consigneeaddr").val() == ""){
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	    $("#consigneeaddr-blank-alert").alert();
            $("#consigneeaddr-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#consigneeaddr-blank-alert").hide();
            });
	    $("#deliverychallan_consigneeaddr").focus();
	    return false;
	} else {
	    $('#deliverychallan_product_table tbody tr:first td:eq(0) select').focus();
	}

	var gstinstring = $("#gstinconsignee").val();
	if(gstinstring != ""){
	    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
	    var alfhanum = /^[0-9a-zA-Z]+$/;
  	    if(gstinstring.length !=15){
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
  		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$("#gstinconsignee").focus();
  		return false;
	    }else if(gstinstring.substring(0, 2) != $("#statecodeofconsignee").text() || !gstinstring.substring(2, 12).match(regExp)  || !gstinstring.substring(12, 15).match(alfhanum)){
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$("#gstinconsignee").focus();
		return false;
	    }
	}
	var pincode_val=($("#deliverychallan_consigneepincode").val());
	var reg = /^[0-9]+$/;
	  if (pincode_val != "") {

		 if (!reg.test(pincode_val) || pincode_val.length != 6) {
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
			$("#pinval-blank-alert").alert();
			$("#pinval-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#pinval-blank-alert").hide();
			});
			$("#deliverychallan_consigneepincode").focus();
			return false;
			}
	}
      
    if($("#consigneename").val() != ""){
	consignee["consigneename"] = $.trim($("#consigneename").val());
        consignee["consigneeaddress"] = $.trim($("#deliverychallan_consigneeaddr").val());
        consignee["consigneestate"] = $.trim($("#consigneestate").val());
	consignee["consigneestatecode"] = $.trim($("#statecodeofconsignee").text());
	consignee["gstinconsignee"] = $.trim($("#gstinconsignee").val());
	consignee["tinconsignee"] = $.trim($("#tinconsignee").val());
	consignee["consigneepincode"] = $.trim($("#deliverychallan_consigneepincode").val());

    }
      
	//------------VAT Product Values---------------//
	if ($(".taxapplicable").val() == 22) {
	  productcodes = [];
	  for (let i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
	      productqtys.push(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
	      if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").val() == "") {
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
                  $("#product-blank-alert").alert();
                  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                      $("#product-blank-alert").hide();
                  });
                  $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
                  return false;
	      }
	      for (productcode of productcodes) {
                  if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").val() == productcode) {
		      $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
                      $("#product-duplicate-alert").alert();
                      $("#product-duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                          $("#product-duplicate-alert").hide();
                      });
                      $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
                      return false;
                  }
	      }
	      calculatevataxamt(i);
	      productcodes.push($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").val());

	      //Productcode
	      var productcode = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").val();

	      if ($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select option:selected').val() == "") {
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		  $("#product-blank-alert").alert();
		  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#product-blank-alert").hide();
		  });
		  $('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select').focus();
		  return false;
              }

	      let quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
	      if (parseFloat(quantity) === 0.00) {
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		  $("#quantity-blank-alert").alert();
		  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#quantity-blank-alert").hide();
		  });
		  $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").focus().select();
		  return false;
	      }
	      if (parseFloat($('.invoice_product_per_price_vat:eq(' + i + ')').val()) == 0.00 && parseFloat($('.invoice_product_quantity_vat:eq(' + i + ')').val()) > 0) {
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		  $("#price-blank-alert").alert();
		  $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#price-blank-alert").hide();
		      $('.invoice_product_per_price_vat:eq(' + i + ')').focus().select();
		  });
		  return false;   
	      }
	      if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2)) > 100){
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		  $("#discount-more-alert").alert();
		  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $(".invoice_product_discount_vat:eq(" + i + ")").focus().select();
		      $("#discount-more-alert").hide();
		  });
		  return false;
	      }
	      else{
		  if (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(1) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(3) input').val()).toFixed(2)))) {
		      $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		      $("#discount-more-alert").alert();
		      $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $(".invoice_product_discount_vat:eq(" + i + ")").focus().select();
			  $("#discount-more-alert").hide();
		      });
		      return false;
		  }
	      }
	      if ($("#invoice_deliverynote option:selected").val() != '') {
		  if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").attr("data")).toFixed(2))) {
		      $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
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
	      if (parseFloat(quantity) > 0) {
		  let obj = {};
		  ppu = $.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val());
		  obj[ppu] = $.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
		  tax[productcode] = $.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(6) input").val());
		  contents[productcode] = obj;
		  items[productcode] = $.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
		  freeqty[productcode] = $.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val());
		  discount[productcode] = $.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val());
	      }
	  }
	  delchaltotal = $.trim($('#invoice_product_table_vat tfoot tr:last td:eq(5) input').val());
    }
      else if ($(".taxapplicable").val() == 7) {
	  for (let i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
	      if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').val() == "") {
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		  $("#product-blank-alert").alert();
		  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#product-blank-alert").hide();
		  });
		  $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select').focus();
		  return false;
	      }
	      let quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val());
	      if (parseFloat(quantity) === 0.00 && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		  $("#quantity-blank-alert").alert();
		  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#quantity-blank-alert").hide();
		  });
		  $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").focus().select();
		  return false;
	      }
	      if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
		  //For goods, price is product of rate and quantity.
		  if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val()).toFixed(2)) > 100){
		      $("#discount-more-alert").alert();
		      $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $(".invoice_product_discount_gst:eq(" + i + ")").focus().select();
			  $("#discount-more-alert").hide();
		      });
		      return false;
		  }
		  else{
		      if (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2)))) {
			  $("#discount-more-alert").alert();
			  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
			      $(".invoice_product_discount_gst:eq(" + i + ")").focus().select();
			      $("#discount-more-alert").hide();
			  });
			  return false;
		      }
		  }
	      }
	      else{
		  //For services, price is rate itself.
		  if ($("#discountpercent").val() == 16 && parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val()).toFixed(2)) > 100){
		      $("#discount-more-alert").alert();
		      $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $(".invoice_product_discount_gst:eq(" + i + ")").focus().select();
			  $("#discount-more-alert").hide();
		      });
		      return false;
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
	      }
	  if ($("#invoice_deliverynote option:selected").val() != '') {
	      if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(1) input").attr("data")).toFixed(2))) && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	  }
	      if ($("#invoice_deliverynote option:selected").val() != '') {
		  if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").attr("data")).toFixed(2))) && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		      $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		      $("#quantity-exceed-alert").alert();
		      $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#quantity-exceed-alert").hide();
		      });
		      return false;
		  }
	      }
	      if (parseFloat($('.invoice_product_per_price_gst:eq(' + i + ')').val()) == 0 && parseFloat($('.invoice_product_quantity_gst:eq(' + i + ')').val()) > 0) {
		  $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		  $("#price-blank-alert").alert();
		  $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#price-blank-alert()").hide();
		      $('.invoice_product_per_price_gst:eq(' + i + ')').focus().select();
		  });
		  return false;   
	      }
	      calculategstaxamt(i);
	      productqtys.push(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()));
	      let obj = {};
	      productcode = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select").val();
	      ppu = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val();
	      obj[ppu] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
	      contents[productcode] = obj;
	      tax[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(7) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(9) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(11) input").val());
	      cess[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(13) input").val());
	      items[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
	      freeqty[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val();
	      discount[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val();
	  }
	  delchaltotal = $.trim($('#total_product_gst').html());
      }

	if($.trim($('#deliverychallan_noofpackages').val())=="") {
	    $("#noofpackages-blank-alert").alert();
	    $("#noofpackages-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#noofpackages-blank-alert").hide();
	    });
	    $('#deliverychallan_noofpackages').focus();
	    return false;
	}
	
	if ($.trim($('#invoice_issuer_name').val())=="" && $("#status").val()=='15') {
	    $("#issuername-blank-alert").alert();
	    $("#issuername-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#issuername-blank-alert").hide();
	    });
	    $('#invoice_issuer_name').focus();
	    return false;
	}
	
	if ($.trim($('#invoice_issuer_designation').val())=="" && $("#status").val()=='15') {
	    $("#designation-blank-alert").alert();
	    $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#designation-blank-alert").hide();
	    });
	    $('#invoice_issuer_designation').focus();
	    return false;
	}

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
	    if (supplydate < financialstart) {
		$("#supbetween-date-alert").alert();
		$("#supbetween-date-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#supbetween-date-alert").hide();
		});
		$('#supply_date').focus().select();
		return false;
	    }
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
	
	$('.modal-backdrop').remove();
	$('.modal').modal('hide');
	$('#confirm_yes').modal('show');
	});
	
    $('#dc_save_yes').click(function (e){
	$('.modal').modal('hide');
	$('.modal-backdrop').remove();
	$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
    	if (sessionStorage.invoicesave==1)
    	{
			var files = $("#inv_my-file-selector")[0].files;
			var filelist = [];
			  for (var i = 0; i < files.length; i++) {
			  if (files[i].type != 'image/jpeg') {
				$("#confirm_yes .modal-body").animate({scrollTop: 0},'slow');
				$("#invoice-number-alert").html("Please upload image in JPG/JPEG format!");
    			$("#invoice-number-alert").alert();
    			$("#invoice-number-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#invoice-number-alert").hide();
					$("#invoice-number-alert").html("Invoice no. should not be empty");
				});
				  $('#inv_my-file-selector').focus();
				return false;
				}
			}
    		if($("#invoice_number").val()=='')
    		{
				$("#confirm_yes .modal-body").animate({scrollTop: 0},'slow');
    			$("#invoice-number-alert").alert();
    			$("#invoice-number-alert").fadeTo(2250, 500).slideUp(500, function(){
    				$("#invoice-number-alert").hide();
				});
				$("#invoice_number").focus();
    			return false;
			}
			if($("#chkpaymentmode option:selected").val()=="2")
    		{
				if(($("#accountno").val()==0) ||($("#bankname").val()=='') ||($("#ifsc").val()=='') ||($("#branchname").val()==''))
				{
				$("#invoice-number-alert").html("bank details cannot be blank");
				$("#confirm_yes .modal-body").animate({scrollTop: 0},'slow');
				$("#invoice-number-alert").alert();
    			$("#invoice-number-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#invoice-number-alert").hide();
					$("#invoice-number-alert").html("Invoice no. should not be empty");
    			});
				return false;
				}
    		}		 	
    		if (!Date.parseExact($("#invoice_date").val() + $("#invoice_month").val() + $("#invoice_year").val(), "ddMMyyyy")) {
				$("#confirm_yes .modal-body").animate({scrollTop: 0},'slow');
    			$("#invoice-date-alert").alert();
    			$("#invoice-date-alert").fadeTo(2250, 500).slideUp(500, function() {
    				$("#invoice-date-alert").hide();
    			});
    			$('#invoice_date').focus().select();
    			return false;
    		}
    		var inv_curdate = Date.parseExact($("#invoice_year").val() + $("#invoice_month").val() + $("#invoice_date").val(), "yyyyMMdd");
    		if (!inv_curdate.between(financialstart, financialend)) {    
				$("#confirm_yes .modal-body").animate({scrollTop: 0},'slow');			
    			$("#invoice-between-date-alert").alert();
    			$("#invoice-between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
    				$("#invoice-between-date-alert").hide();
    			});
    			$('#invoice_date').focus().select();
    			return false;
			}
			if (curdate.compareTo(inv_curdate) == 1) {
				$("#confirm_yes .modal-body").animate({scrollTop: 0},'slow');
				$("#invdc-date-alert").alert();
				$("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#invdc-date-alert").hide();
				});
				$('#invoice_date').focus().select();
				return false;
			}
			if(($("#originaddress").val()=='') && $("#delivery_out").is(":visible")==true)
    		{
				$("#confirm_yes .modal-body").animate({scrollTop: 0},'slow');
				$("#invoice-number-alert").html("Address should not be empty!");
    			$("#invoice-number-alert").alert();
    			$("#invoice-number-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#invoice-number-alert").hide();
					$("#invoice-number-alert").html("Invoice no. should not be empty");
				});
				$("#originaddress").focus();
    			return false;
    		}
    	}		
			
			$("#invoice_number_input").hide();
			$("#failure-alert").html("Something went wrong!");
	dc_narration=$("#dc_narration").val();
	
	var form_data = new FormData();
	form_data.append("roundoffflag", roundoffflag);
        form_data.append("discflag", parseInt($("#discountpercent").val()));
	form_data.append("custid", $("#deliverychallan_customer option:selected").val());
	form_data.append("dcno", $("#deliverychallan_challanno").val());
	form_data.append("dcdate", $("#deliverychallan_year").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_date").val());
	form_data.append("inout", $("#status").val());
	form_data.append("noofpackages", $('#deliverychallan_noofpackages').val());
	form_data.append("tax", JSON.stringify(tax));
	form_data.append("cess", JSON.stringify(cess));
	form_data.append("delchaltotal",delchaltotal);
	form_data.append("freeqty", JSON.stringify(freeqty));
	form_data.append("discount", JSON.stringify(discount));
	form_data.append("taxflag", $(".taxapplicable").val());
	form_data.append("inoutflag",$("#status").val());
	form_data.append("contents", JSON.stringify(contents));	
	form_data.append("orgstategstin",$("#orggstin").text());	
	form_data.append("deltotalword", numbertowords);
	if($("#consigneename").val() != ""){
	    form_data.append("consignee", JSON.stringify(consignee));
	}
	form_data.append("modeoftransport", $('#transportationmode').val());
	form_data.append("vehicleno", $("#vehicleno").val());
	if ($("#status").val() == 15) {
	    form_data.append("issuername", $("#invoice_issuer_name").val());
	    form_data.append("designation", $("#invoice_issuer_designation").val());
	}
	if ($("#deliverychallan_godown option").length!=0){
    	    form_data.append("goid", $("#deliverychallan_godown option:selected").val());
	}
	if (dc_narration.length !=0 ){
		form_data.append("dc_narration",dc_narration);
		}
	//Delivery In
	if ($("#status").val() == 9) {
	    form_data.append("taxstate", $("#invoicestate option:selected").val());
	    form_data.append("sourcestate", $("#deliverychallan_customerstate option:selected").val());
	}//Delivery Out
	else if ($("#status").val() ==  15) {
	    form_data.append("taxstate", $("#deliverychallan_customerstate option:selected").val());
	    form_data.append("sourcestate", $("#invoicestate option:selected").val());
	}

	var dateofsupply = $.trim($("#supply_date").val() + $("#supply_month").val() + $("#supply_year").val());
	if (dateofsupply == "") {
  	    form_data.append("dateofsupply", dateofsupply);
	} 
	else {
	    form_data.append("dateofsupply", $.trim($("#supply_year").val() + '-' + $("#supply_month").val() + '-' + $("#supply_date").val()));
	}
	//form_data.append("products", JSON.stringify(products));// a list always needs to be stringified into json before sending it ahead
	form_data.append("dcflag", $("#deliverychallan_consignment option:selected").val());
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
	    form_data.append("file"+i,files[i]);
	}
        // modal opened for save confirmation as delivery note once created cannot be edited later
    $.ajax({ //ajax call for saving the delivery note
      url: '/deliverychallan?action=save',
      type: 'POST',
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      dataType: 'json',
      async : false,
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
	if(resp["gkstatus"] == 0){
		if (sessionStorage.invoicesave==1)
		{
			dcid=resp["gkresult"];
			$('.modal-backdrop').remove();
			$('.modal').modal('hide');
			$("#invoice_save_deliverynote").click();
			return false;
		}
		else
		{
		    $("#success-alert").alert();
		    $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#success-alert").hide();
			let dcid = resp["gkresult"];
			let inoutflag = $("#status").val();
			viewdelchal(dcid,inoutflag);
		    });
		    return false;
	}}
	else if(resp["gkstatus"] == 1) {
	    $('.modal-backdrop').remove();
	    $('.modal').modal('hide');
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
            $("#deliverychallan_challanno").focus();
            $("#duplicate-alert").alert();
            $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#duplicate-alert").hide();
            });
            return false;
	}
	else {
	    $('.modal-backdrop').remove();
	    $('.modal').modal('hide');
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
            $("#deliverychallan_purchaseorder").focus();
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
  $("#confirm_yes").on('shown.bs.modal', function(event) {
      // on opening of modal the focus should be by efault on the no option so this event
    
    if(sessionStorage.invoicesave==1)
		{
		    $("#invoice_number_input, #invnavmessage").show();
			$("#invoice_number").val($("#deliverychallan_challanno").val());
			$("#invoice_number").focus().select();
			$("#invoice_date").val($("#deliverychallan_date").val());
			$("#invoice_month").val($("#deliverychallan_month").val());
			$("#invoice_year").val($("#deliverychallan_year").val());				
		$("#inv_invoicestate option[value='"+$("#invoicestate option:selected").val()+"']").prop("selected", true);
		$("#inv_invoicestate").change();
		$("#confirm_yes .modal-content").attr("style","width:500px"); 
		$("#confirm_yes .modal-body").attr("style","height:400px;overflow-y:auto;"); 
		$("#confirm_yes .modal-body").animate({scrollTop: 0},'fast');
			if($("#status").val()==15)
			{
				$("#confirm_yes .modal-body").attr("style","height:500px;overflow-y:auto;"); 
				$("#reverse_charge").hide();
				$("#inv_issuer").val($("#invoice_issuer_name").val());
				$("#inv_designation").val($("#invoice_issuer_designation").val());
				$("#delivery_out").show();	
			}
			else
			{
				$("#delivery_out").hide();	
			}
		}
      else{
	  $("#invoice_number_input, #invnavmessage").hide();
		$("#dc_save_no").focus();
	}

  });

  $("#confirm_yes").on('hidden.bs.modal', function(event) {
      // after te modal is closed the focus should be on the delivery note number so this event
	$("#deliverychallan_challanno").focus();
		$("#invoice_number_input").hide();
		$("#confirm_yes .modal-content").attr("style",""); 
		$("#confirm_yes .modal-body").attr("style",""); 
  });

    function viewdelchal(dcid,inoutflag){
	$.ajax({
	    type: "POST",
	    url: "/deliverychallan?action=showeditpopup",
	    global: false,
	    async: false,
	    datatype: "text/html",
	    data: {
		"dcid": dcid
	    },
	    beforeSend: function(xhr) {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    }
	}).done(function(resp) {
	    $("#delist").hide();
	    $("#deliverychallan_div").hide();
	    $("#viewdeldiv").show();
	    $("#backbutton").attr("inoutflag", inoutflag);
	    if (inoutflag == '9') {
		$("#printbutton").hide();
	    }
	    else {
		$("#printbutton").show();
		$("#printbutton").attr("dcid",dcid);
	    }
	    $("#viewdc").html("");
	    $("#viewdc").html(resp);
	    if ($("#attachmentcount").val() > 0) {
		$("#view_del_attachment").show();
		$("#view_del_attachment").attr("dcid",dcid);
	    }
	    else {
		$("#view_del_attachment").hide();
	    }
	});
	return false;
    }

    //Click event for 'Back Button' of Preview delivery challan.
    $("#backbutton").click(function(event){
	$("#viewdc").html("");
	$("#viewdeldiv").hide();
	$('#delist, #deliverychallan_div').show();
	$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	let delopenurl = "";
	if ($("#backbutton").attr("inoutflag") == '9') {
	    delopenurl = "/deliverychallan?action=showadd&status=in";
	} else if($("#backbutton").attr("inoutflag") == '15') {
	    delopenurl = "/deliverychallan?action=showadd&status=out";
	}
	$.ajax({
	    type: "POST",
	    url: delopenurl,
	    global: false,
	    async: false,
	    datatype: "text/html",
	    beforeSend: function(xhr){
		xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	    },
	    success: function(resp){
		$("#deliverychallan_div").html(resp);
	    }
	});
	return false;
    });

    //Click event for 'Print button' of Preview delivery challan.
    $("#printbutton").click(function(event) {
	$.ajax({
            url: '/deliverychallan?action=print',
            type: 'POST',
            dataType: 'html',
            data: {"dcid":$("#printbutton").attr("dcid")},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
        })
        .done(function(resp) {
			sessionStorage.editprintdelfalg = 0;
            console.log("success");
            $('#printdc').html(resp);
	    $("#viewdc").hide();
		$("#buttondiv").hide();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });
    
    //Click event for 'View Attachment' of Preview delivery challan.
    $(document).off("click", "#view_del_attachment").on("click", "#view_del_attachment", function(event){
        $.ajax({
            url: '/deliverychallan?action=getattachment',
            type: 'POST',
            datatype: 'json',
	    data: { "dcid": $("#view_del_attachment").attr("dcid") },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
        })
        .done(function(resp) {
	    var x = window.open();
            if (x) {
                x.focus();
                x.document.open();
                x.document.write(resp);
                x.document.close();
            } else {
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
    
    $("#deliverychallan_reset").click(function(event) {
	// function for resetting the entered delivery note details
	if ($("#status").val()=='9') {
	    $("#deliverychallan_record").click();
	}
	else {
	    $("#deliverychallan_create").click();
	}
	});



	$("#invoice_save_deliverynote").click(function(event) {
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
		event.preventDefault();
		event.stopPropagation();
		if (dcid==0)
		{
			$("#invoice_number_input").show();
		sessionStorage.setItem("invoicesave",1);		
		$("#deliverychallan_save").click();
		}				
		if (dcid!=0)
		{			
		sessionStorage.setItem("invoicesave",0);
		$("#invoice_number_input").hide();		
	  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
		
	var gstinstring = $("#gstinconsignee").val();	  		
	  $('.modal-backdrop').remove();
	  $('.modal').modal('hide');
		  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
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
			consignee["consigneeaddress"] = $.trim($("#deliverychallan_consigneeaddr").val());
			consignee["consigneestate"] = $.trim($("#consigneestate").val());
		    consignee["consigneestatecode"] = $.trim($("#statecodeofconsignee").text());
		    consignee["consigneepincode"] = $.trim($("#deliverychallan_consigneepincode").val());
		}
		bankdetails["accountno"] = $.trim($("#accountno").val());
		bankdetails["bankname"] = $.trim($("#bankname").val());
		bankdetails["ifsc"] = $.trim($("#ifsc").val());
		bankdetails["branch"] = $.trim($("#branchname").val());
	  if ($(".taxapplicable").val() == 22) {
	  for (let i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
	  productqtys.push(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
		if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").filter(function() {return $(this).css('display') == 'none';}).val() == "") {
		  $("#product-blank-alert").alert();
		  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#product-blank-alert").hide();
		  });
		  $("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
		  return false;
		}
		for (productcode of productcodes) {
		  if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").filter(function() {return $(this).css('display') == 'none';}).val() == productcode) {
			$("#product-duplicate-alert").alert();
			$("#product-duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#product-duplicate-alert").hide();
			});
			$("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
			return false;
		  }
		}
	  calculatevataxamt(i);
		productcodes.push($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").val());
  
		var productcode = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").val();
		if ($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select').filter(function() {return $(this).css('display') == 'none';}).val() == "") {
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
		
		if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val() == "") {
		  $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val(0.00);
		}
	  if (parseFloat(quantity) > 0) {
		  let obj = {};
		  let price= {};
		  price["custid"] = parseInt($("#deliverychallan_customer").val());
		  price["productcode"] = parseInt(productcode);
		  price["inoutflag"] = parseInt($("#status").val());
			  ppu = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val())).toFixed(2);
		  price["lastprice"] = parseFloat(ppu);
		  pricedetails.push(price);
			  obj[ppu] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val())).toFixed(2);
			  tax[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(6) input").val())).toFixed(2);
		  contents[productcode] = obj;
			  items[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val())).toFixed(2);
			  freeqty[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val())).toFixed(2);
		  discount[productcode] = parseFloat($.trim($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val())).toFixed(2);
		  pn=$("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select:first option[value='" + productcode + "']").text();
		  productdata[pn]=parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(5) input").val()).toFixed(2);
		  proddata[productcode]=parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(5) input").val()).toFixed(2);
		  av["product"]=productdata;
		  av["prodData"]=proddata;  
	  }
	  
	  }
	  av["totaltaxable"]=tottaxable;
	  av["taxpayment"]=tottax;
	  invoicetotal = $.trim($('#invoice_product_table_vat tfoot tr:last td:eq(5) input').val());
	  }
  
		else if ($(".taxapplicable").val() == 7) {
		for (let i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
			if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select').filter(function() {return $(this).css('display') == 'none';}).val() == "") {
			$("#product-blank-alert").alert();
			$("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#product-blank-alert").hide();
			});
			$('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select').focus();
			return false;
			}
			let quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val());
			let productCode = $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select').filter(function() {return $(this).css('display') == 'none';}).val();
			if (parseFloat(quantity) === 0.00 && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option[value=' + productCode + ']').attr("gsflag") == '7') {
			$("#quantity-blank-alert").alert();
			$("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#quantity-blank-alert").hide();
			});
			$("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").focus().select();
			return false;
			}
			if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option[value=' + productCode + ']').attr("gsflag") == 7) {
		  if (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2)))) {
		  $("#discount-more-alert").alert();
		  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $(".invoice_product_discount_vat:eq(" + i + ")").focus().select();
			$("#discount-more-alert").hide();
			});
		  return false;
		  }
	  }
	  else{
		  if (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val()).toFixed(2)) > parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val()).toFixed(2))) {
		  $("#discount-more-alert").alert();
		  $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $(".invoice_product_discount_vat:eq(" + i + ")").focus().select();
			$("#discount-more-alert").hide();
			});
		  return false;
		  }
	  }
			if ($("#invoice_deliverynote option:selected").val() != '') {
			if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").attr("data")).toFixed(2))) && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option[value=' + productCode + ']').attr("gsflag") == '7') {
				$("#quantity-exceed-alert").alert();
				$("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#quantity-exceed-alert").hide();
				});
				return false;
			}
			}
			if($('.invoice_product_quantity_gst:eq(' + i + ')').is(":disabled")){
			if (parseFloat($('.invoice_product_per_price_gst:eq(' + i + ')').val()) == 0){
				$("#price-blank-alert").alert();
				$("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#price-blank-alert").hide();
				$('.invoice_product_per_price_gst:eq(' + i + ')').focus().select();
				});
				return false;
			}
			}
			else if (parseFloat($('.invoice_product_per_price_gst:eq(' + i + ')').val()) == 0 && parseFloat($('.invoice_product_quantity_gst:eq(' + i + ')').val()) > 0) {
			$("#price-blank-alert").alert();
			$("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#price-blank-alert").hide();
				$('.invoice_product_per_price_gst:eq(' + i + ')').focus().select();
			});
			return false;   
			}
			calculategstaxamt(i);
			productqtys.push(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()));
			let obj = {};
			let price = {};
			productcode = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select").val();
			price["custid"] = parseInt($("#deliverychallan_customer").val());
			price["productcode"] = parseInt(productcode);
			price["inoutflag"] = parseInt($("#status").val());
			ppu = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val()).toFixed(2);
			price["lastprice"] = parseFloat(ppu);
			pricedetails.push(price);
			obj[ppu] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()).toFixed(2);
			contents[productcode] = obj;
			tax[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(7) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(9) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(11) input").val());
			cess[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(13) input").val()).toFixed(2);
			items[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()).toFixed(2);
			freeqty[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val()).toFixed(2);
			discount[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val()).toFixed(2);
			pn=$("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select:first option[value='" + productcode + "']").text();
			productdata[pn]=parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(6) input").val()).toFixed(2);
			av["product"]=productdata;
			proddata[productcode]=parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(6) input").val()).toFixed(2);
			av["prodData"]= proddata;
		}
		var taxtype;
		if ($(".taxapplicable").val() == 7){
			if ($("#deliverychallan_customerstate option:selected").val() == $("#inv_invoicestate option:selected").val()) {
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
		issuername = $("#inv_issuer").val();
		designation = $("#inv_designation").val();
		}
		//For sales invoice store address.
		if($("#status").val() == 15){
		address = $("#originaddress").val();
		}
	  
		var form_data = new FormData();
		form_data.append("roundoff",roundoffflag);
		form_data.append("custid", $("#deliverychallan_customer option:selected").val());
		form_data.append("dcid",dcid);
		form_data.append("invoiceno", $("#invoice_number").val());
		form_data.append("ewaybillno", $("#ewayBill_no").val());    
		form_data.append("invoicedate", $.trim($("#invoice_year").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_date").val()));
		form_data.append("contents", JSON.stringify(contents));
		form_data.append("tax", JSON.stringify(tax));
		form_data.append("cess", JSON.stringify(cess));
		form_data.append("stock", JSON.stringify(stock));
		if (pricedetails.length > 0) {
		form_data.append("pricedetails", JSON.stringify(pricedetails));
		}
		form_data.append("issuername", issuername);
		form_data.append("orgstategstin",$("#inv_orggstin").text() );
		form_data.append("designation", designation);
		form_data.append("invtotal", parseFloat(invoicetotal).toFixed(2));
		form_data.append("invtotalword", numbertowords);
		form_data.append("deltotalword", numbertowords);
		form_data.append("av",JSON.stringify(av));
		if ($("#status").val() == 9) {
	   /*let destinationstate = $("#invoicestate option:selected").val();
	   let sourcestate = $("#invoice_customerstate").val();
		if ($("#consigneename").val() != "") {
			sourcestate = $("#consigneestate option:selected").val();
			}*/
		form_data.append("taxstate", $("#inv_invoicestate option:selected").val());
		form_data.append("sourcestate", $("#deliverychallan_customerstate option:selected").val());
		}
		else if ($("#status").val() ==  15) {
		/*let sourcestate = $("#invoicestate option:selected").val();
		let destinationstate = $("#invoice_customerstate").val();
		if ($("#consigneename").val() != "") {
			destinationstate = $("#consigneestate option:selected").val();
			}*/
		//appending address to the form_data.
		    form_data.append("address", address);
		form_data.append("taxstate", $("#deliverychallan_customerstate option:selected").val());
		form_data.append("sourcestate", $("#inv_invoicestate option:selected").val());
	  }
	  form_data.append("freeqty", JSON.stringify(freeqty));
	  form_data.append("discount", JSON.stringify(discount));
	  form_data.append("consignee", JSON.stringify(consignee));
		//Code for sending data to the database based on which option is selected i.e."cash" or "bank" or "on credit".
		if ($("#chkpaymentmode option:selected").val()=="3"){
		//Checking which radio button is clicked. if cash is selected then paymentmode is set to 3 (i.e. cash transaction)
		  form_data.append("paymentmode",3);   
		} else if($("#chkpaymentmode option:selected").val()=="2"){
		//If bank is selected then append both bankdetails and paymentmode = 2 (i.e. bank transaction).
		  form_data.append("bankdetails", JSON.stringify(bankdetails));
		  form_data.append("paymentmode",2);
			  }
		else{
		form_data.append("paymentmode",15);
		}
		form_data.append("taxflag", $(".taxapplicable").val());
		    form_data.append("transportationmode", $("#transportationmode").val());
		    form_data.append("discflag", parseInt($("#discountpercent").val()));
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
  
	  var files = $("#inv_my-file-selector")[0].files;
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
		  $.ajax({
				  url: '/invoice?action=save',
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
				if(resp["gkstatus"] == 0){
				    if(resp["gkvch"]["status"] == 0)
				    {
	    				$("#success-alert").html("Delivery Note <b>"+$("#deliverychallan_challanno").val()+ "</b>, Invoice <b>" + $("#invoice_number").val() + "</b> and a Voucher <b>" +resp["gkvch"]["vchid"] + "</b> has been created.");	
				    }
				    else if (resp["gkstatus"] == 0 && resp["gkvch"]["status"] == 1) {	
					$("#success-alert").html("Delivery Note <b>"+$("#deliverychallan_challanno").val()+ "</b> and Invoice <b>" + $("#invoice_number").val() + "</b> has been created.<br/>Invoice saved without an accounting entry due to missmatch of accounts. Please make the accounting entry manually.");	
				    }
				    $("#success-alert").alert();
				    $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#success-alert").hide();
					$("#success-alert").html("Note created!");
					let inoutflag = $("#status").val();
					
					viewdelchal(dcid,inoutflag);
				    });
				    return false;
				}
				else if(resp["gkstatus"] == 1) {
					$('.modal-backdrop').remove();
					$('.modal').modal('hide');
						$("#deliverychallan_challanno").focus();
				    $("#duplicate-alert").html("Delivery Note created but Invoice could not be created due to duplicate invoice number.");
						$("#duplicate-alert").alert();
						$("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#duplicate-alert").hide();
					$("#duplicate-alert").html("Duplicate Note no.!");						
					if ($("#deliverychallan_edit").length == 0) {
						$("#deliverychallan").click();
							}
							if ($("#status").val()=='9') {
						//9 is for delivery in
						$("#deliverychallan_record").click();
							}
							else {
						$("#deliverychallan_create").click();
							}
						let inoutflag = $("#status").val();							
						viewdelchal(dcid,inoutflag);
						});
						return false;
				}
				else {
					$('.modal-backdrop').remove();
					$('.modal').modal('hide');
					$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
						$("#deliverychallan_purchaseorder").focus();
						$("#failure-alert").html("Delivery Note created but Invoice could not be created.");
						$("#failure-alert").alert();
						$("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
						$("#failure-alert").hide();
						$("#failure-alert").html("Something went wrong!");
						if ($("#deliverychallan_edit").length == 0) {
							$("#deliverychallan").click();
								}
								if ($("#status").val()=='9') {
							//9 is for delivery in
							$("#deliverychallan_record").click();
								}
								else {
							$("#deliverychallan_create").click();
								}
						let inoutflag = $("#status").val();
						viewdelchal(dcid,inoutflag);
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
	});
	$.ajax({
		url: '/showuser?action=getuser',
		type: 'POST',
		dataType: 'json',
		async : false,
		beforeSend: function(xhr) {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	})
	.done(function(resp){
		$("#invoice_issuer_name").val(resp.unamerole["username"]);
	  $("#invoice_issuer_designation").val(resp.unamerole["userroleName"]);
	});

	$.ajax({
		url: '/invoice?type=getstatess',
					  type: 'POST',
			async: false,
			beforeSend: function(xhr) {
						  xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
					  }
	})
	.done(function(resp){
	  if(resp["gkresult"] != 'null'){
	  $("#invoicestate").val(resp["gkresult"]);  
	  $("#invoicestate").change();}
	});

	var delta = 500;
	var lastKeypressTime = 0;
	$("#dc_narration").keydown(function(event) {
	  if (event.which==13){
	  var thisKeypressTime = new Date();
	  if ( thisKeypressTime - lastKeypressTime <= delta )
	  {
		  $("#deliverychallan_save").focus();
		  thisKeypressTime = 0;
	  }
	  lastKeypressTime = thisKeypressTime;
	  }
  });
});
