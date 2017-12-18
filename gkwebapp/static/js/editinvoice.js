/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017 Digital Freedom Foundation & Accion Labs Pvt. Ltd.
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
*/

// This script is for the addinvoice.jinja2

$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    $("select:first").focus();
    $("#invoice_editprint").hide();
     //Initialising some variables.
    var issuername = "";
    var designation = "";
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");  //Start of financial year is saved in a variable.
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");  //End of financial year is saved in a variable.
    var invoicedatestring = "";
    var invoicedate = "";
    var alertflag = false;
    var gstdate = Date.parseExact('01072017', "ddMMyyyy");
    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html();  //HTML for table displaying totals in GST Product Table.
    var vathtml = $('#invoice_product_table_vat tbody tr:first').html();  //HTML for VAT Product Table row.
    //A dictionary to store GSTINs of a customer.
    var gstins = {};
    //Function to calculate gst tax amount
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowprice = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled") && $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').is(":disabled")) {
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
    }
    $("#invselect").change(function(event) {
        /* Act on the event */
        var invid = $("#invselect option:selected").val();
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
			    $("#invdetailsdiv").show();
			    $('input, select:not(#invselect)').prop("disabled", true);
			    $("#buttonsdiv").show();
			    if(parseInt(resp.invoicedata.attachmentcount) > 0){
				$("#viewattach").show();
			    }
			    else {
				$("#viewattach").hide();
			    }
			    if ($("#status").val() == '9') {
				$("#invoice_editprint").hide();
			    }
			    else {
				$("#invoice_editprint").show();
			    }
			    if(resp.invoicedata.dcid){
				let delchallist = [];
				$("#invoice_deliverynote option").each(function(){
				    delchallist.push($(this).val());
				});
				if($.inArray(resp.invoicedata.dcid, delchallist) == -1){
				    $("#invoice_deliverynote").append('<option value="' + resp.invoicedata.dcid + '" dcno = "' + resp.invoicedata.dcno + '" dcdate="' + resp.invoicedata.dcdate + '">' + resp.invoicedata.dcid + ', ' + resp.invoicedata.dcdate + ', ' + resp.invoicedata.custSupDetails.custname + '</option>');
				}
				$("#invoice_deliverynote").val(resp.invoicedata.dcid);
			    }
			    $("#invoice_challanno").val(resp.invoicedata.invoiceno);
			    let invoicedate = resp.invoicedata.invoicedate.split('-');
			    $("#invoice_date").val(invoicedate["0"]);
			    $("#invoice_month").val(invoicedate["1"]);
			    $("#invoice_year").val(invoicedate["2"]);
			    $("#invoice_year").blur();
			    if ($("#status").val() == 15) {
				$("#invoicestate").val(resp.invoicedata.sourcestate);
				$("#statecodeforinvoice").text(resp.invoicedata.sourcestatecode);
				$("#invoice_issuer_name").val(resp.invoicedata.issuername);
				$("#invoice_issuer_designation").val(resp.invoicedata.designation);
			    }
			    else {
				$("#invoicestate").val(resp.invoicedata.destinationstate);
				$("#statecodeforinvoice").text(resp.invoicedata.taxstatecode);
			    }
			    if (resp.invoicedata.orgstategstin) {
				$("#orggstin").text(resp.invoicedata.orgstategstin);
			    }
			    $('#invoice_customer option').each(function(index) {
				if ($(this).text() == resp.invoicedata.custSupDetails.custname) {
				    $(this).prop("selected", true);
				}
			    });
			    $("#invoice_customerstate").val(resp.invoicedata.custSupDetails.custsupstate);
			    $("#statecodeofcustomer").text(resp.invoicedata.custSupDetails.custsupstatecode);
			    $("#invoice_customeraddr").text(resp.invoicedata.custSupDetails.custaddr);
			    $("#taxapplicable").val(resp.invoicedata.taxflag);
			    if ($("#taxapplicable").val() == '7') {
				$("#taxapplicabletext").text('GST');
				$('#invoice_product_table_gst tbody').empty();
				$('#invoice_product_table_total tbody').empty();
				$("#gstin").text(resp.invoicedata.custSupDetails.custgstin);
				let curindex = 0;
				$.each(resp.invoicedata.invcontents, function(key, value) {
				    console.log(value);
				    $('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
				    $('.product_name_gst:eq(' + curindex + ')').val(key).prop("disabled", true);
				    $('.invoice_product_hsncode:eq(' + curindex + ')').html(value.gscode);
				    $('.invoice_product_quantity_gst:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
				    $('.unitaddonqty_gst:eq(' + curindex + '), .unitaddonfreeqty_gst:eq(' + curindex + ')').text(value.uom);
				    $('.invoice_product_discount_gst:eq(' + curindex + ')').val(value.discount);
				    $('.invoice_product_taxablevalue_gst:eq(' + curindex + ')').val(value.taxableamount);
				    //$('.invoice_product_tax_rate_vat:eq(' + curindex + ')').val(value.taxrate);
				    $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
				    $('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				    $('.invoice_product_total_gst:eq(' + curindex + ')').val(value.totalAmount);
				    curindex = curindex + 1;
				});
				$('.invoice_product_quantity_gst').numeric({ negative: false });
				$('.invoice_product_per_price_gst').numeric({ negative: false });
				$("#invoice_product_table_total tbody tr:first td:last").empty();
			    }
			    else if ($("#taxapplicable").val() ==  '22') {
				$("#taxapplicabletext").text('VAT');
				$("#tin").text(resp.invoicedata.custSupDetails.custtin);
				$('#invoice_product_table_vat tbody').empty();
				let curindex = 0;
				$.each(resp.invoicedata.invcontents, function(key, value) {
				    $('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
				    $('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				    $('.product_name_vat:eq(' + curindex + ')').val(key).prop("disabled", true);
				    $('.invoice_product_quantity_vat:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
				    $('.unitaddonqty_vat:eq(' + curindex + '), .unitaddonfreeqty_vat:eq(' + curindex + ')').text(value.uom);
				    $('.invoice_product_per_price_vat:eq(' + curindex + ')').val(value.priceperunit);
				    $('.invoice_product_discount_vat:eq(' + curindex + ')').val(value.discount);
				    $('.invoice_product_taxablevalue_vat:eq(' + curindex + ')').val(value.taxableamount);
				    $('.invoice_product_tax_rate_vat:eq(' + curindex + ')').val(value.taxrate);
				    $('.invoice_product_total_vat:eq(' + curindex + ')').val(value.totalAmount);
				    curindex = curindex + 1;
				});
				$("#invoice_product_table_vat tbody tr:first td:eq(9)").empty();
				$('.invoice_product_quantity_vat').numeric({ negative: false });
				$('.invoice_product_per_price_vat').numeric({ negative: false });
			    }
			    $(".product_name_vat, .product_name_gst").change();
			    $('input, select:not(#invselect)').prop("disabled", true);
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
				$("#statecodeofconsignee").text(resp.invoicedata.consignee.consigneestatecode);
			    }
			    else{
				$("#consigneename").val("");
				$("#tinconsignee").val("");
				$("#gstinconsignee").val("");
				$("#consigneeaddress").val("");
				$("#consigneestate").val("Andaman and Nicobar Islands");
				$("#statecodeofconsignee").text("35");
			    }
			}
		    }
		});
	}
	else{
	    $("#invdetailsdiv").hide();
	}
    });

    $("#invoice_edit").click(function(event){
	$("#invoice_save").show();
	$("#invoice_edit").hide();
	$('input, select:not(#invselect)').prop("disabled", false);
	$(".firstfield:visible").first().focus();
    });

    $("#invselect").keydown(function(event){
	if(event.which == 13){
	    event.preventDefault();
	    $("#invoice_edit").click();
	    
	}
    });

    $('.invoicedate').autotab('number');  //Focus shifts from fields among date fields.
    $('.supplydate').autotab('number');
    if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
      $(".tinfield").show();
    } else {
      $(".gstinfield").show();
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
	    $("#invoice_date").focus().select();  //Focus shifts to Invoice Date when Enter key is pressed down.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#invoice_deliverynote").focus();  //Focus shifts to Delivery Note field when Up Arrow Key is pressed down.
	}
    });

    //Function to add leading zeros in date and month fields.
    function pad(str, max) { //to add leading zeros in date
	str = str.toString();
	if (str.length == 1) {
	    return str.length < max ? pad("0" + str, max) : str;
	}
	else {
	    return str;
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
	    }
	    else {
		$("#taxapplicabletext").text("VAT");
		$("#taxapplicable").val("22");
		$("#gstproducttable").hide();
		$(".gstinfield").hide();
		$("#invoice_product_table_vat").show();
		$(".tinfield").show();
		$("#vathelp").show();
	    }
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
	    $("#invoice_challanno").focus().select();  //Focus shifts to Invoice Number.
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
	    $("#invoicestate").focus();  //Focus shifts to State of Origin/Delivery.
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
	$("#statecodeforinvoice").text($("#invoicestate option:selected").attr("stateid"));
	if($("#consigneename").val() != ""){
	  if ($("#consigneestate option:selected").val() == $("#invoicestate option:selected").val()) {
	    $(".igstfield").hide();
	    $(".igstfield").css('border','');
	    $(".sgstfield").show();
	}
	else {
	    $(".sgstfield").hide();
	    $(".sgstfield").css('border','');
	    $(".igstfield").show();
	}  
	} else {
	    if ($("#invoice_customerstate option:selected").val() == $("#invoicestate option:selected").val()) {
	    $(".igstfield").hide();
	    $(".igstfield").css('border','');
	    $(".sgstfield").show();
	    } else {
		$(".sgstfield").hide();
		$(".sgstfield").css('border','');
		$(".igstfield").show();
	    }
	}
	$(".product_name_vat, .product_name_gst").change();

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
    $("#invoicestate").change();

    //Key Event for State of Origin/Delivery.

    $("#invoicestate").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#status").val()  == 15) {
		$("#invoice_issuer_name").focus().select();  //Focus shifts to Issuer Name.
	    }
	    else {
		if ($("#invoice_customer").is(":disabled")) {
		    if($("#consigneename").is(":disabled")) {
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
		    $("#invoice_customer").focus();  //Focus shifts to Customer.
		}
	    }
	}
	else if (event.which == 38) {
	    if ($("#invoicestate option:visible").first().is(":selected")) {
		$("#invoice_year").focus();
	    }
	}
    });

    //Key Events for Issuer Name.
    $("#invoice_issuer_name").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#invoice_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer.
	}
	else if (event.which == 38) {
	    $("#invoicestate").focus();  //Focus shifts to State of Origin/Delivery.
	}
    });

    //Key Events for Designation of Issuer.
    $("#invoice_issuer_designation").keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#invoice_customer").is(":disabled")) {
		if($("#consigneename").is(":disabled")){
		    if ($("#taxapplicable").val() == 22) {
			$("#tinconsignee").focus();
		    } else {
			$("#gstinconsignee").focus(); //Focus shifts to Consignee GSTIN as Consignee Name field is disabled when delevery note is selected.
		    }
		}
		else {
		    $("#consigneename").focus().select();  //Focus shifts to Consignee Name as Customer's fields are disabled when delivery note is selected.
		}
	    }
	    else {
		$("#invoice_customer").focus();  //Focus shifts to Customer.
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
	    $("#invoice_customerstate").focus();  //Focus shifts to Customer State.
	}
	if (event.which == 38) {
	    if ($("#invoice_customer option:visible").first().is(":selected") || $("#invoice_customer option:first").is(":selected")) {
		if ($("#status").val() == 15) {
		    $("#invoice_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer.
		}
		else {
		    $("#invoicestate").focus();  //Focus Shifts to Invoice State.
		}
	    }
	}
	if (event.which == 32) {
	    event.preventDefault();
	    $('#invoice_addcust').click();  //Hitting space from Customer field opens a popup to add customer.
	}
    });

    //Change Event for Customer.
    $("#invoice_customer").change(function(event) {
	$(".product_name_vat, .product_name_gst").change();
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
		    $("#invoice_customeraddr").text(resp["gkresult"]["custaddr"]);  //Adress of Customer is loaded.
		    $("#tin").text(resp["gkresult"]["custtan"]);  //Customer TIN is loaded.
        //All GSTINs of this customer are
		    gstins = resp["gkresult"]["gstin"];
        if ($("#invoice_customer option:selected").attr("custid") in gstins) {
      	       $("#gstin").text(resp["gkresult"]["gstin"][$("#invoice_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
      	}
      	else {
      	    $("#gstin").text('');  //If GSTIN is not available it is set as blank.
      	}
		    //GSTIN of customer in default state is selected.
		    $("#gstin").text(resp["gkresult"]["gstin"][$("#invoice_customerstate option:selected").attr("stateid")]);

		    //State Code of Customer State is loaded.
		    $("#statecodeofcustomer").text($("#invoice_customerstate option:selected").attr("stateid"));
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
    });

    //Change event for customer state.
    $("#invoice_customerstate").change(function(event) {
	$("#statecodeofcustomer").text($("#invoice_customerstate option:selected").attr("stateid"));  //State code is loaded.
	if ($("#invoice_customerstate option:selected").attr("stateid") in gstins) {
	       $("#gstin").text(gstins[$("#invoice_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
	}
	else {
	    $("#gstin").text('');  //If GSTIN is not available it is set as blank.
	}
/**	if ($("#status").val() == 15) {
	    $("#consigneestate").val($("#invoice_customerstate option:selected").val());  //Consignee State is synced with customer state.
      $("#statecodeofconsignee").text($("#consigneestate option:selected").attr("stateid"));  //State code of consignee is loaded.
	}**/
	if ($("#invoice_customerstate option:selected").val() == $("#invoicestate option:selected").val()) {
	    $(".igstfield").hide();
	    $(".sgstfield").show();
	}
	else {
	    $(".sgstfield").hide();
	    $(".igstfield").show();
	}
	$(".product_name_vat, .product_name_gst").change();
    });
    $("#invoice_customerstate").change();

    //Key down event for Customer State.
    $("#invoice_customerstate").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#consigneename").focus().select();  //Focus Shifts to Consignee Name.
	}
	if (event.which == 38) {
	    if ($("#invoice_customerstate option:visible").first.is(":selected")) {
		$("#invoice_customer").select();  //Focus shifts to Customer.
	    }
	}
    });

    //Change event for Consignee State.
    $("#consigneestate").change(function(event) {
	event.preventDefault();
	$("#statecodeofconsignee").text($("#consigneestate option:selected").attr("stateid"));  //State code of consignee is loaded.
	if ($("#status").val() == 15) {
	    //$("#invoice_customerstate").val($("#consigneestate option:selected").val());  //Customer State is synced with state of consignee.
	    //$("#statecodeofcustomer").text($("#invoice_customerstate option:selected").attr("stateid"));  //State code is loaded.
	    if($("#statecodeofconsignee").text() in gstins) {
		var custgstin = gstins[$("#statecodeofconsignee").text()];
		$("#gstin").text(custgstin); // Customer gstin is synced with state code of consignee.
	    }
	    
	    if ($("#consigneestate option:selected").val() == $("#invoicestate option:selected").val()) {
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
    $("#consigneestate").change();

    //Key down event for Consignee Name.
    $("#consigneename").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#consigneestate").focus();
	}
	else if (event.which == 38) {
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
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    if($("#consigneeaddress").is(":disabled")){
			 $(".invoice_product_quantity_vat:first").focus().select();
		    } else {
			$("#consigneeaddress").focus().select();  //Focus Shift to Address of Consignee.
		    }
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
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    if($("#consigneeaddress").is(":disabled")){
			 $(".invoice_product_quantity_gst:first").focus().select();
		    } else {
			$("#consigneeaddress").focus().select();  //Focus Shift to Address of Consignee.
		    }
		} 
	    }
	}
	else if (event.which == 38) {
	    /*if ($("#tinconsignee").is(":visible")) {
		$("#tinconsignee").focus().select();  //Focus shifts to TIN of Consignee.
		}*/
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

    //Key Event for Consignee Address.
    $("#consigneeaddress").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
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
	    $('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
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

    //When focus is on an element which has numtype class entering characters and negative integers is disabled.
    $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
	event.preventDefault();
	/* Act on the event */
	$(".numtype").numeric({ negative: false });
    });

    $(document).off('focus', '#accountno').on('focus', '#accountno', function(event) {
        event.preventDefault();
        /* Act on the event */
        $("#accountno").numeric({ negative: false });
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
    $(document).off("focusout",".gstin").on("focusout",".gstin",function(event) {
        var curindex = $(this).closest('tr').index();
        var gstin = $(this).val();
        var gstnint = parseInt(gstin[0] + gstin[1]);
        if((!($.isNumeric(gstnint)) || gstnint > 37 || gstnint < 0 || gstin.length !=15)  && gstin != ""){
            $("#gstin-improper-alert").alert();
            $("#gstin-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#gstin-improper-alert").hide();
                $('#gstinconsignee').focus().select();
            });
            return false;
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
	  if ($("#consigneename").val() != "") {
	      sourcestate = $("#consigneestate option:selected").val();
	  }
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#invoicestate option:selected").val();
	  destinationstate = $("#invoice_customerstate").val();
	  if ($("#consigneename").val() != "") {
	      destinationstate = $("#consigneestate option:selected").val();
	  }
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
	     if ('VAT' in resp['tax']) {
		 $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['VAT']).toFixed(2));
	     }
	     else if ('CVAT' in resp['tax']) {
                 $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['CVAT']).toFixed(2));
             }
         }
	  else if (resp["gkstatus"] == 1 && alertflag == true) {
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
  $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	event.preventDefault();
	if (modalpresent == 0) {
	    $("#invoice_save").click();
	}
	  else {
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
			$("#invoice_customer").val(resp["delchal"]["delchaldata"]["custid"]);
			$("#invoice_customer").prop("disabled", true);
			$("#invoice_customerstate").prop("disabled", true);
			$("#consigneename").val(resp["delchal"]["delchaldata"]["consignee"]["consigneename"]);
			if(resp["delchal"]["delchaldata"]["consignee"]["consigneename"]){
			    $("#consigneename").prop("disabled", true);
			} else {
			    $("#consigneename").prop("disabled", false);
			}
			$("#consigneestate").val(resp["delchal"]["delchaldata"]["consignee"]["consigneestate"]);
			if(resp["delchal"]["delchaldata"]["consignee"]["consigneestate"]){
			    $("#consigneestate").prop("disabled", true);
			} else {
			    $("#consigneestate").prop("disabled", false);
			    $("#consigneestate").val("Andaman and Nicobar Islands");
			}		
			$("#consigneeaddress").val(resp["delchal"]["delchaldata"]["consignee"]["consigneeaddress"]);
			if(resp["delchal"]["delchaldata"]["consignee"]["consigneeaddress"]){
			    $("#consigneeaddress").prop("disabled", true);
			} else {
			    $("#consigneeaddress").prop("disabled", false);
			}
			
			$("#invoice_customer").change();
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
				    $("#invoice_customerstate").val(resp["gkresult"]["state"]);
				    $("#invoice_supplierstate").val(resp["gkresult"]["state"]);
				    $("#invoice_customeraddr").val(resp["gkresult"]["custaddr"]);
				    $("#invoice_supplieraddr").val(resp["gkresult"]["custaddr"]);
				    $("#invoice_customertin").val(resp["gkresult"]["custtan"]);
				    $("#invoice_suppliertin").val(resp["gkresult"]["custtan"]);
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
					$('#invoice_product_table_vat tbody tr:last td:eq(1) input').val(value.qty);
					$('#invoice_product_table_vat tbody tr:last td:eq(1) input').val(value.qty).attr("data", value.qty);
					$('#invoice_product_table_vat tbody tr:last td:eq(1) span').text(value.unitname);
					$('#invoice_product_table_vat tbody tr:last td:eq(2) span').text(value.unitname);
				    });
				    $("#invoice_product_table_vat tbody tr:first td:eq(9)").empty();
				    var productcode;
				    $.each(resp.items, function(key, value) {
					$('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
					$('#invoice_product_table_gst tbody tr:last td:first select').val(key).prop("disabled", true);
					$('#invoice_product_table_gst tbody tr:last td:eq(1) label').html(value.gscode);
					$('#invoice_product_table_gst tbody tr:last td:eq(2) input').val(value.qty);
					$('#invoice_product_table_gst tbody tr:last td:eq(2) input').val(value.qty).attr("data", value.qty);
					$('#invoice_product_table_gst tbody tr:last td:eq(2) span').text(value.unitname);
					$('#invoice_product_table_gst tbody tr:last td:eq(3) span').text(value.unitname);
					$('.invoice_product_quantity_gst').numeric({ negative: false });
					$('.invoice_product_per_price_gst').numeric({ negative: false });
					$("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
					$('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				    });
				    $("#invoice_product_table_total tbody tr:first td:last").empty();
				    $(".product_name_gst, .product_name_vat, #invoicestate").change();
				}

			    });
		    }
		});
	}
	else {
	    $('#invoice_product_table_vat tbody').empty();
	    $('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	    $('#invoice_product_table_gst tbody').empty();
	    $('#invoice_product_table_total tbody').empty();
	    $('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
	    $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	    $(".product_name_gst, .product_name_vat, #invoicestate").change();
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
      /* Act on the event */
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
    /* Act on the event */
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
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
    var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_per_price_vat").on("keydown", ".invoice_product_per_price_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
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
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
    var curindex = $(this).closest('#invoice_product_table_vat tbody tr').index();
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_discount_vat").on("keydown", ".invoice_product_discount_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
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
      $("#accountno").focus().select();
    }
  });


  $(document).off('change', '.invoice_product_tax_rate_vat').on('change', '.invoice_product_tax_rate_vat', function(event) {
      event.preventDefault();
      var curindex1 = $(this).closest('tr').index();
    /* Act on the event */
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
    } else if (event.which == 13) {
	event.preventDefault();
	calculatevataxamt(curindex1);
      if (curindex1 != ($("#invoice_product_table_vat tbody tr").length - 1)) {//Not a last row.
        $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
      } else if ($("#invoice_deliverynote option:selected").val() == '' && $('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){//Last row along with additional conditions.
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
	$('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	  $('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	  for (let i = 0; i <= curindex1; i++) {
              var selectedproduct = $("#invoice_product_table_vat tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
	      $("#invoice_product_table_vat tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
          }
	  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
	  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
	  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change();
      }
	else if ($("#invoice_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	    $("#accountno").focus().select();
	}
      else {
          $("#accountno").focus().select();
      }
    } else if (event.which == 190 && event.shiftKey) {
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
	  $("#accountno").focus().select();
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

	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(0).toFixed(2));
	
      if ($("#status").val() == 9) {
	  destinationstate = $("#invoicestate option:selected").val();
	  sourcestate = $("#invoice_customerstate").val();
	  if ($("#consigneename").val() != "") {
	   sourcestate = $("#consigneestate option:selected").val();
	  }
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#invoicestate option:selected").val();
	  destinationstate = $("#invoice_customerstate").val();
	  if ($("#consigneename").val() != "") {
	      destinationstate = $("#consigneestate option:selected").val();
	  }
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
	       else if (resp["gkstatus"] == 1 && alertflag==true) {
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
      console.log(curindex);
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
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
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
      calculategstaxamt(curindex);
  });

  $(document).off("keydown", ".invoice_product_per_price_gst").on("keydown", ".invoice_product_per_price_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
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
      $("#accountno").focus().select();
    }
  });

    $(document).off("change", ".invoice_product_discount_gst").on("change", ".invoice_product_discount_gst", function(event) {
	var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
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
	      $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
  } else if ($("#invoice_deliverynote option:selected").val() == '' && $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){//Last row along with additional conditions.
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
      $('#invoice_product_table_gst tbody').append('<tr>' + gsthtml + '</tr>');
      $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	  $('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	  for (let i = 0; i <= curindex1; i++) {
              var selectedproduct = $("#invoice_product_table_gst tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
	      $("#invoice_product_table_gst tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
          }
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
      $("#invoicestate").change();
      $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change();
  }
    else if ($("#invoice_deliverynote option:selected").val() != '') {
	if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2)))  && $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	$("#accountno").focus().select();
    }
    else {
          $("#accountno").focus().select();
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
      $("#accountno").focus().select();
    }
});

    //GST events end here

  $(document).off("click", ".product_del").on("click", ".product_del", function() {
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex + 1;
  var previndex = curindex - 1;
  if ($("#invoice_product_table_vat tbody tr").length > 1) {
    $(this).closest('tr').fadeOut(200, function() {
      $(this).closest('tr').remove(); //closest method gives the closest element productified
      $("#invoice_product_table_vat tbody tr:first td:eq(0) select").focus();
    });
  }
      if ($("#invoice_product_table_vat tbody tr").length == 1) {
	  $("#invoice_product_table_vat tbody tr:eq(0) td:eq(9)").empty();
      }

      if ($("#invoice_product_table_gst tbody tr").length > 1) {
	  $(this).closest('tr').remove();
	  $("#invoice_product_table_gst tbody tr:eq("+curindex+")").remove();
	  $("#invoice_product_table_gst tbody tr:first td:eq(0) select").focus();
      }
      if ($("#invoice_product_table_gst tbody tr").length == 1) {
	  $("#invoice_product_table_total tbody tr:eq(0) td:eq(1)").empty();
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
	    if (!supplydate.between(financialstart, financialend)) {
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
        $('#custsupmodal').on('hidden.bs.modal', function(e) // hidden.bs.modal is an event which fires when the modal is opened
			      {
				  modalpresent = 0;
            var text1 = $('#selectedcustsup').val();
            if (text1 == '') {
              $('#invoice_customer').focus();
              return false;
            }
            var urlcustsup = "/customersuppliers?action=getallsups";
            if ($("#status").val() == '15') {
		urlcustsup = "/customersuppliers?action=getallcusts";
            }
	      else {
		  urlcustsup = "/customersuppliers?action=getallsups";
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
	      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
          });
      }
    });
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
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
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
      if ($.trim($('#consigneename').val()) == "" && ($.trim($("#tinconsignee").val()) != "" || $.trim($("#gstinconsignee").val() != ""))  && $.trim($("#consigneeaddress").val()) != "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
          $("#consignee-blank-alert").alert();
          $("#consignee-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#consignee-blank-alert").hide();
          });
          $('#consigneename').focus();
          return false;
      }
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
      var quantity;
      var ppu;
      if($("#consigneename").val() != ""){
	  consignee["consigneename"] = $.trim($("#consigneename").val());
          consignee["tinconsignee"] = $.trim($("#tinconsignee").val());
          consignee["gstinconsignee"] = $.trim($("#gstinconsignee").val());
          consignee["consigneeaddress"] = $.trim($("#consigneeaddress").val());
          consignee["consigneestate"] = $.trim($("#consigneestate").val());
          consignee["consigneestatecode"] = $.trim($("#statecodeofconsignee").text());
      }
      bankdetails["accountno"] = $.trim($("#accountno").val());
      bankdetails["bankname"] = $.trim($("#bankname").val());
      bankdetails["ifsc"] = $.trim($("#ifsc").val());
      bankdetails["branch"] = $.trim($("#branch").val());
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
	$.ajax({
        url: '/product?type=prodtax',
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
         if (resp["gkresult"].length == 0) {
             $("#sometax-alert").alert();
           $("#sometax-alert").fadeTo(2250, 500).slideUp(500, function() {
             $("#sometax-alert").hide();
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

      if ($('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#invoice_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select').focus();
          return false;
        }
	quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
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
	invoicetotal = $.trim($('#invoice_product_table_vat tfoot tr:last td:eq(5) input').val());

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
	      quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val());
	      if (parseFloat(quantity) === 0.00 && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		  $("#quantity-blank-alert").alert();
		  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#quantity-blank-alert").hide();
		  });
		  $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").focus().select();
		  return false;
	      }
	      if ($("#invoice_deliverynote option:selected").val() != '') {
		  if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(1) input").attr("data")).toFixed(2))) && $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		      $("#quantity-exceed-alert").alert();
		      $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#quantity-exceed-alert").hide();
		      });
		      return false;
		  }
	      }
	      calculategstaxamt(i);
	      productqtys.push(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()));
	      let obj = {};
	      productcode = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
	      ppu = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val();
	      obj[ppu] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
	      contents[productcode] = obj;
	      tax[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(7) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(9) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(11) input").val());
	      cess[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(13) input").val());
	      items[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
	      freeqty[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val();
	      discount[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val();
	  }
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
	  if (issuername == "") {
	      $("#invoice_issuer_name").focus();
	      $("#issuer-blank-alert").alert();
	      $("#issuer-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#issuer-blank-alert").hide();
	      });
	      return false;
	  }
      }
      var form_data = new FormData();
      form_data.append("dcid", $("#invoice_deliverynote option:selected").val());
      form_data.append("custid", $("#invoice_customer option:selected").val());
      form_data.append("invoiceno", $("#invoice_challanno").val());
      form_data.append("invoicedate", $.trim($("#invoice_year").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_date").val()));
      form_data.append("contents", JSON.stringify(contents));
      form_data.append("tax", JSON.stringify(tax));
      form_data.append("cess", JSON.stringify(cess));
      form_data.append("stock", JSON.stringify(stock));
      form_data.append("issuername", issuername);
      form_data.append("orgstategstin",$("#orggstin").text() );
      form_data.append("designation", designation);
      form_data.append("invtotal", invoicetotal);
      if ($("#status").val() == 9) {
	 /*let destinationstate = $("#invoicestate option:selected").val();
	 let sourcestate = $("#invoice_customerstate").val();
	  if ($("#consigneename").val() != "") {
	      sourcestate = $("#consigneestate option:selected").val();
	  }*/
	  form_data.append("taxstate", $("#invoicestate option:selected").val());
	  if ($("#consigneename").val() != "") {
	      form_data.append("sourcestate", $("#consigneestate option:selected").val());
	  } else {
	      form_data.append("sourcestate", $("#invoice_customerstate option:selected").val());
	  }

      }
      else if ($("#status").val() ==  15) {
	  /*let sourcestate = $("#invoicestate option:selected").val();
	  let destinationstate = $("#invoice_customerstate").val();
	  if ($("#consigneename").val() != "") {
	      destinationstate = $("#consigneestate option:selected").val();
	      }*/
	  if ($("#consigneename").val() != "") {
	      form_data.append("taxstate", $("#consigneestate option:selected").val());
	  } else {
	      form_data.append("taxstate", $("#invoice_customerstate option:selected").val());
	  }
	  form_data.append("sourcestate", $("#invoicestate option:selected").val());
    }
    form_data.append("freeqty", JSON.stringify(freeqty));
    form_data.append("discount", JSON.stringify(discount));
    form_data.append("consignee", JSON.stringify(consignee));
    form_data.append("bankdetails", JSON.stringify(bankdetails));
    form_data.append("taxflag", $("#taxapplicable").val());
    form_data.append("transportationmode", $("#transportationmode").val());
    form_data.append("vehicleno", $("#vehicleno").val());
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
	form_data.append("file" + i, files[i]);
    }
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function(e) {
	if (allow == 1){
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
                    if (resp["gkstatus"] == 0) {
			allow = 0;
                        if ($("#status").val() == '9') {
                            $("#invoice_record").click();
                        } else {
                            $("#invoice_create").click();
                        }
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
                        $("#success-alert").alert();
                        $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
                        });
                        return false;
                    } else if (resp["gkstatus"] == 1) {
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
                        $("#invoice_challanno").focus();
                        $("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        return false;
                    } else {
                        $("#invoice_deliverynote").focus();
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
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
    if ($("#status").val() == '9') {
      $("#invoice_record").click();

    } else {
      $("#invoice_create").click();
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
    $('.invoice_product_quantity').numeric({ negative: false });
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
            data: {"invid":$("#invselect option:selected").val()},
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
});
