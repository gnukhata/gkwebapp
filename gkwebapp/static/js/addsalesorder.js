/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
   "Krishnakant Mane" <kk@gmail.com>
   "Ishan Masdekar " <imasdekar@dff.org.in>
   "Navin Karkera" <navin@dff.org.in>
   "Prajkta Patkar"<prajakta@dff.org.in>
   "Vaibhav Kurhe" <vaibhav.kurhe@gmail.com>
   "Abhijith Balan" <abhijith@dff.org.in>
   "Rohini Baraskar" <robaraskar@gmail.com>
 */

// This script is for the addsalesorder.jinja2

$(document).ready(function() {
    //Events that are triggered when the page for creating an salesorder is loaded.
    $('.modal-backdrop').remove();  //Removed backdrop of modal that contains loading spinner.
    $('.salesorderdate').autotab('number');  //Focus shifts from fields among date fields.
    $('.supplydate').autotab('number');
    if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
      $(".tinfield").show();
    } else {
      $(".gstinfield").show();
    }

    //Initialising some variables.
    var issuername = "";
    var designation = "";
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");  //Start of financial year is saved in a variable.
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");  //End of financial year is saved in a variable.
    var salesorderdatestring = "";
    var salesorderdate = "";
    var gstdate = Date.parseExact('01072017', "ddMMyyyy");
    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#salesorder_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#salesorder_product_table_total tbody tr:first").html();  //HTML for table displaying totals in GST Product Table.
    var vathtml = $('#salesorder_product_table_vat tbody tr:first').html();  //HTML for VAT Product Table row.

    //Function to calculate gst tax amount
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowprice = parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	if ($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled") && $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').is(":disabled")) {
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

	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.

	let sgstrate = $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val();
	let sgstamount = (rowtaxableamount * sgstrate)/100;  //Amount of SGST to be applied is found out.
	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(sgstamount).toFixed(2));
	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(10) input').val(parseFloat(sgstamount).toFixed(2));

	let igstrate = $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val();
	let igstamount = (rowtaxableamount * igstrate)/100;  //Amount of IGST to be applied is found out.
	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(12) input').val(parseFloat(igstamount).toFixed(2));

	let cessrate = $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val();
        let cessamount = (rowtaxableamount * cessrate)/100;  //Amount of Cess to be applied is found out.
	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(14) input').val(parseFloat(cessamount).toFixed(2));

	rowtotal = rowtaxableamount + 2*sgstamount + igstamount + cessamount; //Sum of Taxable Amount and Tax Amount is found out.
        $('#salesorder_product_table_total tbody tr:eq(' + curindex + ') td:eq(0) input').val(parseFloat(rowtotal).toFixed(2));

	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#salesorder_product_table_gst tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(6) input').val());
	    totalcgst = totalcgst + parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(8) input').val());
	    totalsgst = totalsgst + parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(10) input').val());
	    totaligst = totaligst + parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(12) input').val());
	    totalcess = totalcess + parseFloat($('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(14) input').val());
	    totalamount = totalamount + parseFloat($('#salesorder_product_table_total tbody tr:eq(' + i + ') td:eq(0) input').val());
	}

	//Total of various columns are displayed on the footer.
	$('#discounttotal_product_gst').text(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_gst').text(parseFloat(totaltaxable).toFixed(2));
	$('#totalcgst_product_gst').text(parseFloat(totalcgst).toFixed(2));
	$('#totalsgst_product_gst').text(parseFloat(totalsgst).toFixed(2));
	$('#totaligst_product_gst').text(parseFloat(totaligst).toFixed(2));
	$('#totalcess_product_gst').text(parseFloat(totalcess).toFixed(2));
	$('#total_product_gst').text(parseFloat(totalamount).toFixed(2));
	$("#totalsalesordervalue").text(parseFloat(totalamount).toFixed(2));
    }

    //Function to calculate Tax Amount and Total of Discount, Taxable Amount, Tax Amounts and Total Amount.
    //This is similar to the function above.
    function calculatevataxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
	var rowprice = parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowtaxrate = parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);
	var taxamount = 0.00;
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totaltax = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;
	$('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.
	taxamount = (rowtaxableamount * rowtaxrate)/100;  //Amount of tax to be applied is found out.
	 $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxamount).toFixed(2));
	 rowtotal = rowtaxableamount + taxamount;
	 $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));
	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#salesorder_product_table_vat tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totaltax = totaltax + parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + i + ') td:eq(7) input').val());
	    totalamount = totalamount + parseFloat($('#salesorder_product_table_vat tbody tr:eq(' + i + ') td:eq(8) input').val());
	}
	//Total of various columns are displayed on the footer.
	$('#discounttotal_product_vat').val(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totalsalesordervalue").text(parseFloat(totalamount).toFixed(2));
    }

    //Delivery Note number select field is hidden when inventory is disabled.
    if(sessionStorage.invflag==0){
	$("#deliverynoterow").hide();
    }

    //Certain fields are hidden in the case of Purchase Salesorder. They are shown in Sale Salesorder.
    if ($("#status").val() == '15') {  //In/Out flag is saved in a hidden field. 15 is OUT(Sale Salesorder) and 9 is IN(Purchase Salesorder).
	$(".salesorder_issuer").show();  //Issuer Name is shown in Sale Salesorder. Purchase Salesorder is only recorded, not created by an organisation.	
	$(".fixed-table").removeClass('fixed-tablepurchase');  //CSS class for adjusting style properties.
	$(".fixed-table").addClass('fixed-tablesale');
    }

    if ($("#status").val() == '9') {  
	$(".reversepurchase").show();
    }


    $(".input-sm:visible").first().focus();  //Focus on the first element when the page loads
    //Preventing characters in numeric fields.
    $("#salesorder_date").numeric({ negative: false });
    $("#salesorder_month").numeric({ negative: false });
    $("#salesorder_year").numeric({ negative: false });

    //Key event for select combo of Delivery Note.
    $("#salesorder_deliverynote").keydown(function(event) {
	if (event.which == 13) {  //Events triggered when Enter key is pressed down.
	    event.preventDefault();
	    $("#salesorder_challanno").focus().select();  //Focus shifts to Salesorder Number.
	}
    });

    //Key Event for Salesorder Number.
    $("#salesorder_challanno").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#salesorder_date").focus().select();  //Focus shifts to Salesorder Date when Enter key is pressed down.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#salesorder_deliverynote").focus();  //Focus shifts to Delivery Note field when Up Arrow Key is pressed down.
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
    $("#salesorder_date").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#salesorder_month").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#salesorder_year").blur(function(event) {
	$(this).val(yearpad($(this).val(), 4));
	salesorderdatestring = $("#salesorder_date").val() + $("#salesorder_month").val() + $("#salesorder_year").val();
	salesorderdate = Date.parseExact(salesorderdatestring, "ddMMyyyy");
	if (salesorderdatestring.length == 0) {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-blank-alert").hide();
	    });
	    $("#salesorder_date").focus().select();
	    return false;
	}
	else if (!salesorderdate && salesorderdatestring.length == 8) {
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-alert").hide();
	    });
	    $("#salesorder_date").focus().select();
	    return false;
	}
	else if (salesorderdate) {
	    if (!salesorderdate.between(financialstart, financialend)) {
		$("#between-date-alert").alert();
		$("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#between-date-alert").hide();
		});
		$('#salesorder_date').focus().select();
		return false;
	    }
	    if ($("#salesorder_deliverynote option:selected").val() != "") {
		if (Date.parseExact($("#salesorder_deliverynote option:selected").attr("dcdate"), "dd-MM-yyyy").compareTo(salesorderdate) == 1) {
		    $("#invdc-date-alert").alert();
		    $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#invdc-date-alert").hide();
		    });
		    $('#salesorder_date').focus().select();
		    return false;
		}
	    }
	    if (salesorderdate >= gstdate) {
		$("#taxapplicabletext").text("GST");
		$("#taxapplicable").val("7");
		$("#salesorder_product_table_vat").hide();  //Hides VAT Product table and fields for TIN.
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
		$("#salesorder_product_table_vat").show();
		$(".tinfield").show();
		$("#vathelp").show();
	    }
	}
    });

    //Key Event for Salesorder Date Field.
    $("#salesorder_date").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#salesorder_month").focus().select();  //Focus shifts to Month field
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#salesorder_challanno").focus().select();  //Focus shifts to Salesorder Number.
	}
    });

    //Key Event for Salesorder Month field.
    $("#salesorder_month").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#salesorder_year").focus().select();  //Focus Shifts to Year field.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#salesorder_date").focus().select();  //Focus Shifts to Date field.
	}
    });

    //Key Event for Salesorder Year field.
    $("#salesorder_year").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#salesorderstate").focus();  //Focus shifts to State of Origin/Delivery.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#salesorder_month").focus().select();  //Focus shifts to month field.
	}
    });

    //Change Event For State of Origin/Delivery.
    $("#salesorderstate").change(function(event) {
	event.preventDefault();
	$("#orggstin").text("");
	$("#statecodeforsalesorder").text($("#salesorderstate option:selected").attr("stateid"));
	if ($("#salesorder_customerstate option:selected").val() == $("#salesorderstate option:selected").val()) {
	    $(".igstfield").hide();
	    $(".igstfield").css('border','');
	    $(".sgstfield").show();
	}
	else {
	    $(".sgstfield").hide();
	    $(".sgstfield").css('border','');
	    $(".igstfield").show();
	}
	$(".product_name_vat, .product_name_gst").change();

	var gstinstateid=$("#salesorderstate option:selected").attr("stateid");
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
    $("#salesorderstate").change();

    //Key Event for State of Origin/Delivery.

    $("#salesorderstate").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#status").val()  == 15) {
		$("#salesorder_issuer_name").focus().select();  //Focus shifts to Issuer Name.
	    }
	    else {
		if ($("#salesorder_customer").is(":disabled")) {
		    $("#consigneename").focus().select();  //Focus shifts to Consignee Name as Customer's fields are disabled when delivery note is selected.
		}
		else {
		    $("#salesorder_customer").focus();  //Focus shifts to Customer.
		}
	    }
	}
	else if (event.which == 38) {
	    if ($("#salesorderstate option:visible").first().is(":selected")) {
		$("#salesorder_year").focus();
	    }
	}
    });

    //Key Events for Issuer Name.
    $("#salesorder_issuer_name").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#salesorder_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer.
	}
	else if (event.which == 38) {
	    $("#salesorderstate").focus();  //Focus shifts to State of Origin/Delivery.
	}
    });

    //Key Events for Designation of Issuer.
    $("#salesorder_issuer_designation").keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#salesorder_customer").is(":disabled")) {
		$("#consigneename").focus().select();  //Focus shifts to Consignee Name as Customer's fields are disabled when delivery note is selected.
	    }
	    else {
		$("#salesorder_customer").focus();  //Focus shifts to Customer.
	    }
	}
	else if (event.which == 38) {
	    $("#salesorder_issuer_name").focus().select();  //Focus shifts to Issuer Name
	}
    });

    //Key Events for Customer fields.
    $("#salesorder_customer").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#salesorder_customerstate").focus();  //Focus shifts to Customer State.
	}
	if (event.which == 38) {
	    if ($("#salesorder_customer option:visible").first().is(":selected") || $("#salesorder_customer option:first").is(":selected")) {
		if ($("#status").val() == 15) {
		    $("#salesorder_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer.
		}
		else {
		    $("#salesorderstate").focus();  //Focus Shifts to Salesorder State.
		}
	    }
	}
	if (event.which == 32) {
	    event.preventDefault();
	    $('#salesorder_addcust').click();  //Hitting space from Customer field opens a popup to add customer.
	}
    });

    //A dictionary to store GSTINs of a customer.
    var gstins = {};
    //Change Event for Customer.
    $("#salesorder_customer").change(function(event) {
	//AJAX to get details of customer.
	$.ajax({
	    url: '/customersuppliers?action=get',
	    type: 'POST',
	    dataType: 'json',
	    async: false,
	    data: { "custid": $("#salesorder_customer option:selected").val() },  //Customer ID is sent.
	    beforeSend: function(xhr) {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    }
	})
	    .done(function(resp) {
		console.log("success");
		if (resp["gkstatus"] == 0) {
		    $("#salesorder_customerstate").val(resp["gkresult"]["state"]);  //State of Customer is selected automatically.
		    $("#salesorder_customeraddr").text(resp["gkresult"]["custaddr"]);  //Adress of Customer is loaded.
		    $("#tin").text(resp["gkresult"]["custtan"]);  //Customer TIN is loaded.
        //All GSTINs of this customer are
		    gstins = resp["gkresult"]["gstin"];
        if ($("#salesorder_customer option:selected").attr("custid") in gstins) {
      	       $("#gstin").text(resp["gkresult"]["gstin"][$("#salesorder_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
      	}
      	else {
      	    $("#gstin").text('');  //If GSTIN is not available it is set as blank.
      	}
		    //GSTIN of customer in default state is selected.
		    $("#gstin").text(resp["gkresult"]["gstin"][$("#salesorder_customerstate option:selected").attr("stateid")]);

		    //State Code of Customer State is loaded.
		    $("#statecodeofcustomer").text($("#salesorder_customerstate option:selected").attr("stateid"));
		    //Consignee State is synced with Customer State.
		    if ($("#status").val() == 15) {
			$("#consigneestate").val(resp["gkresult"]["state"]);
			$("#statecodeofconsignee").text($("#consigneestate option:selected").attr("stateid"));
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

    //Change event for customer state.
    $("#salesorder_customerstate").change(function(event) {
	$("#statecodeofcustomer").text($("#salesorder_customerstate option:selected").attr("stateid"));  //State code is loaded.
	if ($("#salesorder_customerstate option:selected").attr("stateid") in gstins) {
	       $("#gstin").text(gstins[$("#salesorder_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
	}
	else {
	    $("#gstin").text('');  //If GSTIN is not available it is set as blank.
	}
	if ($("#status").val() == 15) {
	    $("#consigneestate").val($("#salesorder_customerstate option:selected").val());  //Consignee State is synced with customer state.
      $("#statecodeofconsignee").text($("#consigneestate option:selected").attr("stateid"));  //State code of consignee is loaded.
	}
	if ($("#salesorder_customerstate option:selected").val() == $("#salesorderstate option:selected").val()) {
	    $(".igstfield").hide();
	    $(".sgstfield").show();
	}
	else {
	    $(".sgstfield").hide();
	    $(".igstfield").show();
	}
	$(".product_name_vat, .product_name_gst").change();
    });
    $("#salesorder_customerstate").change();

    //Key down event for Customer State.
    $("#salesorder_customerstate").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#consigneename").focus().select();  //Focus Shifts to Consignee Name.
	}
	if (event.which == 38) {
	    if ($("#salesorder_customerstate option:visible").first.is(":selected")) {
		$("#salesorder_customer").select();  //Focus shifts to Customer.
	    }
	}
    });

    //Change event for Consignee State.
    $("#consigneestate").change(function(event) {
	event.preventDefault();
	$("#statecodeofconsignee").text($("#consigneestate option:selected").attr("stateid"));  //State code of consignee is loaded.
	if ($("#status").val() == 15) {
	    $("#salesorder_customerstate").val($("#consigneestate option:selected").val());  //Customer State is synced with state of consignee.
      $("#statecodeofcustomer").text($("#salesorder_customerstate option:selected").attr("stateid"));  //State code is loaded.
	    if ($("#consigneestate option:selected").val() == $("#salesorderstate option:selected").val()) {
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
	    if ($("#salesorder_customerstate").is(":disabled")) {
		if ($("#status").val() == 15) {
		    $("#salesorder_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer in Sale Salesorder if Delivery Note is selected.
		}
		else {
		    $("#salesorderstate").focus();  //Focus Shifts to Salesorder State in Purchase Salesorder if Delivery Note is selected.
		}
	    }
	    else {
		$("#salesorder_customerstate").focus();  //Focus shifts to Customer State.
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
	    if ($("#gstinconsignee").is(":visible")) {
		$("#gstinconsignee").focus().select();  //Focus shifts to GSTIN of Consignee.
	    }
	    else {
		$("#consigneeaddress").focus().select();  //Focus shifts to Address of Consignee.
	    }
	}
	else if (event.which == 38) {
	    $("#consigneestate").focus();  //Focus Shifts to State of Consignee.
	}
    });

    //Key Event for Consignee GSTIN.
    $("#gstinconsignee").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#consigneeaddress").focus().select();  //Focus Shift to Address of Consignee.
	}
	else if (event.which == 38) {
	    if ($("#tinconsignee").is(":visible")) {
		$("#tinconsignee").focus().select();  //Focus shifts to TIN of Consignee.
	    }
	    else {
		$("#consigneestate").focus().select();  //Focus shifts to GSTIN of Consignee.
	    }
	}
    });

    //Key Event for Consignee Address.
    $("#consigneeaddress").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#taxapplicable").val() == 7) {
		if ($("#salesorder_deliverynote option:selected").val() != '') {
		    $(".salesorder_product_quantity_gst:first").focus().select();
		}
		else {
		    $(".product_name_gst:first").focus().select();  //Focus Shift to Tax Applicable field.
		}
	    }
	    else {
		if ($("#salesorder_deliverynote option:selected").val() != '') {
		    $(".salesorder_product_quantity_vat:first").focus().select();
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
	$('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
	var productcode = $(this).find('option:selected').val();
	var curindex = $(this).closest('tbody tr').index();
    var destinationstate = "";
      var sourcestate = "";
      if ($("#status").val() == 9) {
	  destinationstate = $("#salesorderstate option:selected").val();
	  sourcestate = $("#salesorder_customerstate").val();
	  if ($("#gstinconsignee").val() != "") {
	   sourcestate = $("#consigneestate option:selected").val();
	  }
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#salesorderstate option:selected").val();
	  destinationstate = $("#salesorder_customerstate").val();
	  if ($("#gstinconsignee").val() != "") {
	   destinationstate = $("#consigneestate option:selected").val();
	  }
      }
	var taxflag=$("#taxapplicable").val();
	if (productcode != "") {
	    $.ajax({
        url: '/salesorder?action=getappliedtax',
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
		 $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['VAT']).toFixed(2));
	     }
	     else if ('CVAT' in resp['tax']) {
                 $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(resp['tax']['CVAT']).toFixed(2));
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
      url: '/salesorder?action=getproduct',
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
           $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) span').text(resp["unitname"]);
           $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]);
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
	    $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
	    $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) span').text("");
           $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) span').text("");
	}
    });
    var modalpresent = 0;
  $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	event.preventDefault();
	if (modalpresent == 0) {
	    $("#salesorder_save").click();
	}
	  else {
	      $("#cussup_save").click();
	  }
      return false;
    }
  });
    $("#salesorder_deliverynote").change(function(event) {
	if ($("#salesorder_deliverynote option:selected").val() != '') {
	    var deliverydate = $("#salesorder_deliverynote option:selected").attr("dcdate");
	    $("#supply_date").val(deliverydate[0] + deliverydate[1]).prop("disabled", true);
	    $("#supply_month").val(deliverydate[3] + deliverydate[4]).prop("disabled", true);
	    $("#supply_year").val(deliverydate[6] + deliverydate[7] + deliverydate[8] + deliverydate[9]).prop("disabled", true);
	    $.ajax({
		url: '/salesorder?action=getdeliverynote',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "dcid": $("#salesorder_deliverynote option:selected").val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
		.done(function(resp) {
		    if (resp["gkstatus"] == 0) {
			$("#salesorder_customer").val(resp["delchal"]["delchaldata"]["custid"]);
			$("#salesorder_customer").prop("disabled", true);
			$("#salesorder_customerstate").prop("disabled", true);
			$("#salesorder_customer").change();
			$.ajax({
			    url: '/customersuppliers?action=get',
			    type: 'POST',
			    dataType: 'json',
			    async: false,
			    data: { "custid": $("#salesorder_customer option:selected").val() },
			    beforeSend: function(xhr) {
				xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			    }
			})
			    .done(function(resp) {
				console.log("success");
				if (resp["gkstatus"] == 0) {
				    $("#salesorder_customerstate").val(resp["gkresult"]["state"]);
				    $("#salesorder_supplierstate").val(resp["gkresult"]["state"]);
				    $("#salesorder_customeraddr").val(resp["gkresult"]["custaddr"]);
				    $("#salesorder_supplieraddr").val(resp["gkresult"]["custaddr"]);
				    $("#salesorder_customertin").val(resp["gkresult"]["custtan"]);
				    $("#salesorder_suppliertin").val(resp["gkresult"]["custtan"]);
				}
			    })
			    .fail(function() {
				console.log("error");
			    })
			    .always(function() {
				console.log("complete");
			    });
			$('#salesorder_product_table_vat tbody').empty();
			$('#salesorder_product_table_gst tbody').empty();
			$('#salesorder_product_table_total tbody').empty();
			var totqty = 0;
			$.ajax({
			    url: '/salesorder?action=getdelinvprods',
			    type: 'POST',
			    dataType: 'json',
			    async: false,
			    data: {"dcid": $("#salesorder_deliverynote option:selected").val()},
			    beforeSend: function(xhr) {
				xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			    }
			})
			    .done(function(resp) {
				console.log("success");
				if (resp["gkstatus"] == 0) {
				    // if($("#salesorder_product_table_vat").is(":not(:hidden)")){
				    $.each(resp.items, function(key, value) {
					$('#salesorder_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
					$('#salesorder_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
					$('#salesorder_product_table_vat tbody tr:last td:first select').val(key).prop("disabled", true);
					$('#salesorder_product_table_vat tbody tr:last td:eq(1) input').val(value.qty);
					$('#salesorder_product_table_vat tbody tr:last td:eq(1) input').val(value.qty).attr("data", value.qty);
					$('#salesorder_product_table_vat tbody tr:last td:eq(1) span').text(value.unitname);
					$('#salesorder_product_table_vat tbody tr:last td:eq(2) span').text(value.unitname);
				    });
				    $("#salesorder_product_table_vat tbody tr:first td:eq(9)").empty();
				    var productcode;
				    $.each(resp.items, function(key, value) {
					$('#salesorder_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
					$('#salesorder_product_table_gst tbody tr:last td:first select').val(key).prop("disabled", true);
					$('#salesorder_product_table_gst tbody tr:last td:eq(1) label').html(value.gscode);
					$('#salesorder_product_table_gst tbody tr:last td:eq(2) input').val(value.qty);
					$('#salesorder_product_table_gst tbody tr:last td:eq(2) input').val(value.qty).attr("data", value.qty);
					$('#salesorder_product_table_gst tbody tr:last td:eq(2) span').text(value.unitname);
					$('#salesorder_product_table_gst tbody tr:last td:eq(3) span').text(value.unitname);
					$('.salesorder_product_quantity_gst').numeric({ negative: false });
					$('.salesorder_product_per_price_gst').numeric({ negative: false });
					$("#salesorder_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
					$('#salesorder_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				    });
				    $("#salesorder_product_table_total tbody tr:first td:last").empty();
				    $(".product_name_gst, .product_name_vat, #salesorderstate").change();
				}

			    });
		    }
		});
	}
	else {
	    $('#salesorder_product_table_vat tbody').empty();
	    $('#salesorder_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	    $('#salesorder_product_table_gst tbody').empty();
	    $('#salesorder_product_table_total tbody').empty();
	    $('#salesorder_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
	    $("#salesorder_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	    $(".product_name_gst, .product_name_vat, #salesorderstate").change();
	}
    });

//VAT events start here
  $(document).off("keydown", ".product_name_vat").on("keydown", ".product_name_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('#salesorder_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_vat tbody tr:eq(' + previndex + ') td:eq(0) select').focus();
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
          $('#salesorder_product_table_vat tbody tr:eq(' + previndex + ') td:eq(6) input').focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();
    }
      else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

    $(document).off('change', '.salesorder_product_quantity_vat').on('change', '.salesorder_product_quantity_vat', function(event) {
    event.preventDefault();
      /* Act on the event */
      var curindex = $(this).closest('#salesorder_product_table_vat tbody tr').index();
    if ($(this).val() == "") {
      $(this).val(0);
    }
      if ($("#salesorder_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
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

  $(document).off("keydown", ".salesorder_product_quantity_vat").on("keydown", ".salesorder_product_quantity_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
	event.preventDefault();
	calculatevataxamt(curindex);
	if ($("#salesorder_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
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
	$('#salesorder_product_table_vat tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
	event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(1) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_vat tbody tr:eq(' + previndex + ') td:eq(1) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

  $(document).off('change', '.salesorder_product_freequantity_vat').on('change', '.salesorder_product_freequantity_vat', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      var curindex = $(this).closest('#salesorder_product_table_vat tbody tr').index();
      calculatevataxamt(curindex);
      var quantity = parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
      if (parseFloat(quantity) === 0.00) {
	  $("#quantity-blank-alert").alert();
	  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $("#quantity-blank-alert").hide();
	  });
	  $("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").focus().select();
	  return false;
      }
      if ($("#salesorder_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
  });


  $(document).off("keydown", ".salesorder_product_freequantity_vat").on("keydown", ".salesorder_product_freequantity_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(2) input").focus().select();
	      return false;
	  }
	if ($("#salesorder_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
	$("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('#salesorder_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(2) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_vat tbody tr:eq(' + previndex + ') td:eq(2) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

  $(document).off('change', '.salesorder_product_per_price_vat').on('change', '.salesorder_product_per_price_vat', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
    var curindex = $(this).closest('#salesorder_product_table_vat tbody tr').index();
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".salesorder_product_per_price_vat").on("keydown", ".salesorder_product_per_price_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	$('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(3) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_vat tbody tr:eq(' + previndex + ') td:eq(3) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#accountno").focus().select();
    }
  });

    $(document).off('change', '.salesorder_product_discount_vat').on('change', '.salesorder_product_discount_vat', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
    var curindex = $(this).closest('#salesorder_product_table_vat tbody tr').index();
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".salesorder_product_discount_vat").on("keydown", ".salesorder_product_discount_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	$('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + nextindex + ') td:eq(4) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_vat tbody tr:eq(' + previndex + ') td:eq(4) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#accountno").focus().select();
    }
  });


  $(document).off('change', '.salesorder_product_tax_rate_vat').on('change', '.salesorder_product_tax_rate_vat', function(event) {
      event.preventDefault();
      var curindex1 = $(this).closest('tr').index();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      if ($('#salesorder_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").focus().select();
	      return false;
	  }
      if ($("#salesorder_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
    calculatevataxamt(curindex1);

  });

  $(document).off("keydown", ".salesorder_product_tax_rate_vat").on("keydown", ".salesorder_product_tax_rate_vat", function(event) {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1 + 1;
    var previndex1 = curindex1 - 1;

    if (event.which == 27) {
      event.preventDefault();
	calculatevataxamt(curindex1);
    } else if (event.which == 13) {
	event.preventDefault();
	calculatevataxamt(curindex1);
      if (curindex1 != ($("#salesorder_product_table_vat tbody tr").length - 1)) {//Not a last row.
        $('#salesorder_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
      } else if ($("#salesorder_deliverynote option:selected").val() == '' && $('#salesorder_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){//Last row along with additional conditions.
        if ($('#salesorder_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").focus().select();
	      return false;
	  }
	$('#salesorder_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	  $('#salesorder_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	  for (let i = 0; i <= curindex1; i++) {
              var selectedproduct = $("#salesorder_product_table_vat tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
	      $("#salesorder_product_table_vat tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
          }
	  $('#salesorder_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
	  $('#salesorder_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
	  $('#salesorder_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change();
      }
	else if ($("#salesorder_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2))) {
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
      $('#salesorder_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(4) input').focus().select();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex1 > -1) {
        event.preventDefault();
        $('#salesorder_product_table_vat tbody tr:eq(' + previndex1 + ') td:eq(4) input').focus().select();
      }
      if (curindex1 == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 190 && event.ctrlKey) {
      $('#salesorder_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
      event.preventDefault();
    } else if (event.ctrlKey && event.which == 188) {
      $('#salesorder_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus();
      event.preventDefault();
    } else if (event.which == 27) {
      event.preventDefault();
      $("#salesorder_issuer_name").focus().select();
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

	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
        $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
        $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(0).toFixed(2));
	
      if ($("#status").val() == 9) {
	  destinationstate = $("#salesorderstate option:selected").val();
	  sourcestate = $("#salesorder_customerstate").val();
	  if ($("#gstinconsignee").val() != "") {
	   sourcestate = $("#consigneestate option:selected").val();
	  }
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#salesorderstate option:selected").val();
	  destinationstate = $("#salesorder_customerstate").val();
	  if ($("#gstinconsignee").val() != "") {
	   destinationstate = $("#consigneestate option:selected").val();
	  }
      }
    var taxflag=$("#taxapplicable").val();

    if (productcode != "") {
	$.ajax({
            url: '/salesorder?action=getappliedtax',
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
		       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate if avaliable.
		       if ('CESS' in resp['tax']) {
			   $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(resp['tax']['CESS']).toFixed(2));
		       }
		   }
		   //Loads IGST rate.
		   else if('IGST' in resp['tax']){
		       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(resp['tax']['IGST']).toFixed(2));
		       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
		       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate.
		       if ('CESS' in resp['tax']) {
			   $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(resp['tax']['CESS']).toFixed(2));
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
      url: '/salesorder?action=getproduct',
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

         $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(1) .salesorder_product_hsncode').text(resp["gscode"]);
         if (resp["gsflag"]==7){
           $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]);
             $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text(resp["unitname"]);
	     $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", false);
               $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", false);

         }
	   else {
	       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", true).val("0.00");
               $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", true).val("0.00");
	       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text("");
	       $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text("");
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
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", false);
            $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", false);
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text("");
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text("");
	}
  });
  $(document).off("keydown", ".product_name_gst").on("keydown", ".product_name_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	if ($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled")) {
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
	}
	else {
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
	}
    } else if (event.which == 190 && event.shiftKey) {
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_gst tbody tr:eq(' + previndex + ') td:eq(0) select').focus();
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
        $('#salesorder_product_table_gst tbody tr:eq(' + previndex + ') td:eq(5) input').focus().select();
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

    $(document).off('change', '.salesorder_product_quantity_gst').on('change', '.salesorder_product_quantity_gst', function(event) {
    event.preventDefault();
      /* Act on the event */
      var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
      console.log(curindex);
    if ($(this).val() == "") {
      $(this).val(0);
    }
	if ($("#salesorder_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(3) input").val());
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

  $(document).off("keydown", ".salesorder_product_quantity_gst").on("keydown", ".salesorder_product_quantity_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
	event.preventDefault();
	calculategstaxamt(curindex);
	if ($("#salesorder_deliverynote option:selected").val() != '') {
	    var quantity = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + curindex + ") td:eq(3) input").val());
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
	$('#salesorder_product_table_gst tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
	event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(2) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_gst tbody tr:eq(' + previndex + ') td:eq(2) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

  $(document).off('change', '.salesorder_product_freequantity_gst').on('change', '.salesorder_product_freequantity_gst', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
      if ($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	  var quantity = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").val());
      if (parseFloat(quantity) === 0.00) {
	  $("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      return false;
	  }
	if ($("#salesorder_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
		$("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
          return false;
	    }
	}
      calculategstaxamt(curindex);
  });


  $(document).off("keydown", ".salesorder_product_freequantity_gst").on("keydown", ".salesorder_product_freequantity_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
          return false;
        }
	var quantity = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(3) input").focus().select();
	      return false;
	  }
	if ($("#salesorder_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(3) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_gst tbody tr:eq(' + previndex + ') td:eq(3) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#accountno").focus().select();
      }
  });

  $(document).off('change', '.salesorder_product_per_price_gst').on('change', '.salesorder_product_per_price_gst', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
    var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
      calculategstaxamt(curindex);
  });

  $(document).off("keydown", ".salesorder_product_per_price_gst").on("keydown", ".salesorder_product_per_price_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	$('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex + ') td:eq(4) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#salesorder_product_table_gst tbody tr:eq(' + previndex + ') td:eq(4) input').focus();
      }
      if (curindex == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
	event.preventDefault();
	if ($('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').is(":disabled")) {
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus();
	}
	else {
	    $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
	}

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#accountno").focus().select();
    }
  });

    $(document).off("change", ".salesorder_product_discount_gst").on("change", ".salesorder_product_discount_gst", function(event) {
	var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
	calculategstaxamt(curindex);
    });

$(document).off("keydown", ".salesorder_product_discount_gst").on("keydown", ".salesorder_product_discount_gst", function(event) {
//write your code here
var curindex1 = $(this).closest('tr').index();
var nextindex1 = curindex1 + 1;
var previndex1 = curindex1 - 1;
if (event.which == 13) {
  event.preventDefault();

	  if (curindex1 != ($("#salesorder_product_table_gst tbody tr").length - 1)) {//Not a last row.
	      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
  } else if ($("#salesorder_deliverynote option:selected").val() == '' && $('#salesorder_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){//Last row along with additional conditions.
    if ($('#salesorder_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').val() == "") {
      $("#product-blank-alert").alert();
      $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#product-blank-alert").hide();
      });
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
      return false;
    }
      var quantity = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(3) input").val());
	  if (parseFloat(quantity) === 0.00 && $('#salesorder_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#salesorder_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(3) input").focus().select();
	      return false;
	  }
      $('#salesorder_product_table_gst tbody').append('<tr>' + gsthtml + '</tr>');
      $("#salesorder_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	  $('#salesorder_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	  for (let i = 0; i <= curindex1; i++) {
              var selectedproduct = $("#salesorder_product_table_gst tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
	      $("#salesorder_product_table_gst tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
          }
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
      $("#salesorderstate").change();
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change();
  }
    else if ($("#salesorder_deliverynote option:selected").val() != '') {
	if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + curindex1 + ") td:eq(1) input").attr("data")).toFixed(2)))  && $('#salesorder_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
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
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(5) input').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex1 > -1) {
        event.preventDefault();
        $('#salesorder_product_table_gst tbody tr:eq(' + previndex1 + ') td:eq(5) input').focus();
      }
      if (curindex1 == 0) {
        event.preventDefault();
          $("#consigneeaddress").focus().select();
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();

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
  if ($("#salesorder_product_table_vat tbody tr").length > 1) {
    $(this).closest('tr').fadeOut(200, function() {
      $(this).closest('tr').remove(); //closest method gives the closest element productified
      $("#salesorder_product_table_vat tbody tr:first td:eq(0) select").focus();
    });
  }
      if ($("#salesorder_product_table_vat tbody tr").length == 1) {
	  $("#salesorder_product_table_vat tbody tr:eq(0) td:eq(9)").empty();
      }

      if ($("#salesorder_product_table_gst tbody tr").length > 1) {
	  $(this).closest('tr').remove();
	  $("#salesorder_product_table_gst tbody tr:eq("+curindex+")").remove();
	  $("#salesorder_product_table_gst tbody tr:first td:eq(0) select").focus();
      }
      if ($("#salesorder_product_table_gst tbody tr").length == 1) {
	  $("#salesorder_product_table_total tbody tr:eq(0) td:eq(1)").empty();
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
	    if (salesorderdate) {
		if (supplydate < salesorderdate) {
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
		$("#salesorder_save").focus().click();
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
		    $(".salesorder_product_discount_gst:last").focus().select();
		}
		else {
		    $(".salesorder_product_discount_vat:last").focus().select();
		}
	    }
	}
    });

    $("#rev2radio").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#salesorder_save").focus();
	}
    });

  $("#salesorder_addcust").click(function() {
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
              $('#salesorder_customer').focus();
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
               $("#salesorder_customer").empty();

               for (i in custs) {
                 $("#salesorder_customer").append('<option value="' + custs[i].custid + '" >' + custs[i].custname + '</option>');
               }
		 $("#salesorder_customer option").filter(function() {
                     return this.text == text1;
                 }).attr('selected', true).trigger('change'); //Selects the latest added customer/supplier.
		 $("#salesorder_customer").change();
             });
            $("#selectedcustsup").val("");
              $("#salesorder_customer").focus();
	      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
          });
      }
    });
  });

    var allow = 1;
  $("#salesorder_save").click(function(event) {
      event.preventDefault();
      event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
      if ($.trim($('#salesorder_challanno').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#challanno-blank-alert").hide();
      });
      $('#salesorder_challanno').focus();
      return false;
    }

      if ($.trim($('#salesorder_date').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#salesorder_date').focus();
      return false;
    }
      if ($.trim($('#salesorder_month').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#salesorder_month').focus();
      return false;
    }
      if ($.trim($('#salesorder_year').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#salesorder_year').focus();
      return false;
    }
      if (!Date.parseExact($("#salesorder_date").val() + $("#salesorder_month").val() + $("#salesorder_year").val(), "ddMMyyyy")) {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-alert").hide();
      });
      $('#salesorder_date').focus().select();
      return false;
    }
      var curdate = Date.parseExact($("#salesorder_year").val() + $("#salesorder_month").val() + $("#salesorder_date").val(), "yyyyMMdd");
    if (!curdate.between(financialstart, financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
      });
      $('#salesorder_date').focus().select();
      return false;
    }

    if ($("#salesorder_deliverynote option:selected").val() != "") {

	if (Date.parseExact($("#salesorder_deliverynote option:selected").attr("dcdate"), "dd-MM-yyyy").compareTo(curdate) == 1) {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
        $("#invdc-date-alert").alert();
        $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#invdc-date-alert").hide();
        });
        $('#salesorder_date').focus().select();
        return false;
      }
    }

      if ($.trim($('#salesorder_customer option:selected').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#custsup-blank-alert").hide();
      });
      $('#salesorder_customer').focus();
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
      var salesordertotal = 0.00;
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
    for (let i = 0; i < $("#salesorder_product_table_vat tbody tr").length; i++) {
	productqtys.push(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
      if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == "") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#product-blank-alert").hide();
        });
        $("#salesorder_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
        return false;
      }
      for (productcode of productcodes) {
        if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == productcode) {
          $("#product-duplicate-alert").alert();
          $("#product-duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-duplicate-alert").hide();
          });
          $("#salesorder_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
          return false;
        }
      }
	calculatevataxamt(i);
      productcodes.push($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val());

      var productcode = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
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

      if ($('#salesorder_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('#salesorder_product_table_vat tbody tr:eq(' + i + ') td:eq(0) select').focus();
          return false;
        }
	quantity = parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").focus().select();
	      return false;
	  }
      if ($("#salesorder_deliverynote option:selected").val() != '') {
	    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	}
      if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val() == "") {
        $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val(0.00);
      }
	if (parseFloat(quantity) > 0) {
	    let obj = {};
            ppu = $.trim($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val());
            obj[ppu] = $.trim($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
            tax[productcode] = $.trim($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(6) input").val());
	    contents[productcode] = obj;
            items[productcode] = $.trim($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
            freeqty[productcode] = $.trim($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val());
	    discount[productcode] = $.trim($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val());
	}
    }
	salesordertotal = $.trim($('#salesorder_product_table_vat tfoot tr:last td:eq(5) input').val());

    }

      else if ($("#taxapplicable").val() == 7) {
	  for (let i = 0; i < $("#salesorder_product_table_gst tbody tr").length; i++) {
	      if ($('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').val() == "") {
		  $("#product-blank-alert").alert();
		  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#product-blank-alert").hide();
		  });
		  $('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select').focus();
		  return false;
	      }
	      quantity = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val());
	      if (parseFloat(quantity) === 0.00 && $('#salesorder_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		  $("#quantity-blank-alert").alert();
		  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#quantity-blank-alert").hide();
		  });
		  $("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").focus().select();
		  return false;
	      }
	      if ($("#salesorder_deliverynote option:selected").val() != '') {
		  if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(1) input").attr("data")).toFixed(2))) && $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
		      $("#quantity-exceed-alert").alert();
		      $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#quantity-exceed-alert").hide();
		      });
		      return false;
		  }
	      }
	      calculategstaxamt(i);
	      productqtys.push(parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()));
	      let obj = {};
	      productcode = $("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
	      ppu = $("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val();
	      obj[ppu] = $("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
	      contents[productcode] = obj;
	      tax[productcode] = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(7) input").val()) + parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(9) input").val()) + parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(11) input").val());
	      cess[productcode] = parseFloat($("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(13) input").val());
	      items[productcode] = $("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
	      freeqty[productcode] = $("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val();
	      discount[productcode] = $("#salesorder_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val();
	  }
	  salesordertotal = $.trim($('#total_product_gst').html());
      }
      stock["items"] = items;
      if ($("#status").val() == '9') {
	  stock["inout"] = 9;
	  issuername = "";
	  designation = "";
      }
      else {
	  stock["inout"] = 15;
	  issuername = $("#salesorder_issuer_name").val();
	  designation = $("#salesorder_issuer_designation").val();
	  if (issuername == "") {
	      $("#salesorder_issuer_name").focus();
	      $("#issuer-blank-alert").alert();
	      $("#issuer-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#issuer-blank-alert").hide();
	      });
	      return false;
	  }
      }
      var form_data = new FormData();
      form_data.append("dcid", $("#salesorder_deliverynote option:selected").val());
      form_data.append("custid", $("#salesorder_customer option:selected").val());
      form_data.append("salesorderno", $("#salesorder_challanno").val());
      form_data.append("salesorderdate", $.trim($("#salesorder_year").val() + '-' + $("#salesorder_month").val() + '-' + $("#salesorder_date").val()));
      form_data.append("contents", JSON.stringify(contents));
      form_data.append("tax", JSON.stringify(tax));
      form_data.append("cess", JSON.stringify(cess));
      form_data.append("stock", JSON.stringify(stock));
      form_data.append("issuername", issuername);
      form_data.append("orgstategstin",$("#orggstin").text() );
      form_data.append("designation", designation);
      form_data.append("invtotal", salesordertotal);
      if ($("#status").val() == 9) {
	  form_data.append("taxstate", $("#salesorderstate option:selected").val());
	  form_data.append("sourcestate", $("#salesorder_customerstate option:selected").val());
      }
      else if ($("#status").val() ==  15) {
	  form_data.append("taxstate", $("#salesorder_customerstate option:selected").val());
	  form_data.append("sourcestate", $("#salesorderstate option:selected").val());
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
                url: '/salesorder?action=save',
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
                            $("#salesorder_record").click();
                        } else {
                            $("#salesorder_create").click();
                        }
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
                        $("#success-alert").alert();
                        $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
                        });
                        return false;
                    } else if (resp["gkstatus"] == 1) {
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
                        $("#salesorder_challanno").focus();
                        $("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        return false;
                    } else {
                        $("#salesorder_deliverynote").focus();
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
    $("#salesorder_deliverynote").focus();
  });
  $(document).off('click', '#salesorder_reset').on('click', '#salesorder_reset', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#status").val() == '9') {
      $("#salesorder_record").click();

    } else {
      $("#salesorder_create").click();
    }
  });
/*
  $("#salesorder_saveprint").click(function(event) {
    event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#salesorder_challanno').val()) == "") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#challanno-blank-alert").hide();
      });
      $('#salesorder_challanno').focus();
      return false;
    }

    if ($.trim($('#salesorder_date').val()) == "") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#salesorder_date').focus();
      return false;
    }
    if ($.trim($('#salesorder_month').val()) == "") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#salesorder_month').focus();
      return false;
    }
    if ($.trim($('#salesorder_year').val()) == "") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#salesorder_year').focus();
      return false;
    }
    if (!Date.parseExact($("#salesorder_date").val() + $("#salesorder_month").val() + $("#salesorder_year").val(), "ddMMyyyy")) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-alert").hide();
      });
      $('#salesorder_date').focus().select();
      return false;
    }
      var curdate = Date.parseExact($("#salesorder_year").val() + $("#salesorder_month").val() + $("#salesorder_date").val(), "yyyyMMdd");
    if (!curdate.between(financialstart, financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
      });
      $('#salesorder_date').focus().select();
      return false;
    }

    if ($("#salesorder_deliverynote option:selected").val() != "") {

      if (Date.parseExact($("#salesorder_deliverynote option:selected").attr("dcdate"), "dd-MM-yyyy").compareTo(curdate) == 1) {
        $("#invdc-date-alert").alert();
        $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#invdc-date-alert").hide();
        });
        $('#salesorder_date').focus().select();
        return false;
      }
    }

    if ($.trim($('#salesorder_customer option:selected').val()) == "") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#custsup-blank-alert").hide();
      });
      $('#salesorder_customer').focus();
      return false;
    }
    var tax = {};
    var contents = {};
    var freeqty = {};
    var stock = {};
    var items = {};
    var productcodes = [];
    var productqtys = [];
    for (var i = 0; i < $("#salesorder_product_table_vat tbody tr").length; i++) {
      productqtys.push(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
      if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == "") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#product-blank-alert").hide();
        });
        $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").focus();
        return false;
      }
      for (productcode of productcodes) {
        if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == productcode) {
          $("#product-duplicate-alert").alert();
          $("#product-duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-duplicate-alert").hide();
          });
          $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").focus();
          return false;
        }
      }
      productcodes.push($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val());

      var productcode = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
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


      if ($("#salesorder_deliverynote option:selected").val() == '')  {
        if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val() == "" || $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val() <= 0) {
          $("#quantity-blank-alert").alert();
          $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#quantity-blank-alert").hide();
          });
          $("#salesorder_product_table tbody tr:eq(" + i + ") td:eq(1) input").focus();
          return false;
        }
      }
      if (parseFloat(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()).toFixed(2)) > parseFloat(parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").attr("data")).toFixed(2))) {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val($("#salesorder_product_table tbody tr:eq(" + i + ") td:eq(1) input").attr("data"));
          $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").focus();
          return false;
      }

      if (parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val()) > parseFloat($("#salesorder_product_table tbody tr:eq(" + i + ") td:eq(1) input").val())) {
        $("#quantity-freeqty-alert").alert();
        $("#quantity-freeqty-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#quantity-freeqty-alert").hide();
        });
        $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").focus();
        return false;
      }
      if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val() == "") {
        $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val(0.00);
      }

      if ($("#salesorder_deliverynote option:selected").val() == '' || $("#salesorder_deliverynote option:selected").val() != '' && parseFloat($("#salesorder_product_table tbody tr:eq(" + i + ") td:eq(1) input").val()) != 0) {
        if ($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val() == "" || $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val() <= 0) {
          $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#price-blank-alert").hide();
          });
          $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").focus().select();
          return false;
        }
      }
      var obj = {};
      if (parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()) > 0) {
        var productcode = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
        var ppu = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val();
        obj[ppu] = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val();
        tax[productcode] = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val();
        contents[productcode] = obj;
        items[productcode] = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val();
        freeqty[productcode] = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val();
      }
    }
    //if all product quantities are zero, ask user, why are you creating an salesorder?
    var zeroflag = 1;
    for (qty of productqtys) {
      if (qty != 0) {
        zeroflag = 0;
        break;
      }
    }
    if (zeroflag == 1) {
      $("#allquantities-blank-alert").alert();
      $("#allquantities-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#allquantities-blank-alert").hide();
      });
      $("#salesorder_product_table_vat tbody tr:eq(0) td:eq(1) input").focus().select();
      return false;
    }


    stock["items"] = items;

    if ($("#status").val() == '9') {
      stock["inout"] = 9;
      issuername = "";
      designation = "";
    } else {
      stock["inout"] = 15;
      issuername = $("#salesorder_issuer_name").val();
      designation = $("#salesorder_issuer_designation").val();
      if (issuername == "") {
        $("#salesorder_issuer_name").focus();
        $("#issuer-blank-alert").alert();
        $("#issuer-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#issuer-blank-alert").hide();
        });
        return false;
      }
    }
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes_print').modal('show').one('click', '#tn_save_yesprint', function(e) {
      $.ajax({
        url: '/salesorder?action=save',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
          "dcid": $("#salesorder_deliverynote option:selected").val(),
          "custid": $("#salesorder_customer option:selected").val(),
          "salesorderno": $("#salesorder_challanno").val(),
          "salesorderdate": $("#salesorder_year").val() + '-' + $("#salesorder_month").val() + '-' + $("#salesorder_date").val(),
          "contents": JSON.stringify(contents),
          "tax": JSON.stringify(tax),
          "stock": JSON.stringify(stock),
          "issuername": issuername,
          "designation": designation,
          "invtotal": $('#salesorder_product_table tfoot tr:last td:eq(5) input').val(),
          "taxstate": $("#salesorder_state option:selected").val(),
          "freeqty": JSON.stringify(freeqty)
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
       .done(function(resp) {
         if (resp["gkstatus"] == 0) {
           printset = [];
           subtotal = 0;
           for (var i = 0; i < $("#salesorder_product_table tbody tr").length; i++) {
            var obj = {};
            if (parseFloat($("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()) > 0) {
              obj.productdesc = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").text();
              obj.qty = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val();
              obj.freeqty = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val();
              obj.unitname = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(1) span").text();
              obj.ppu = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val();
              subtotal += +((obj.qty - obj.freeqty) * obj.ppu);
              console.log(subtotal);
              obj.taxrate = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val();
              obj.taxamt = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(5) input").val();
              obj.rowtotal = $("#salesorder_product_table_vat tbody tr:eq(" + i + ") td:eq(6) input").val();
              printset.push(obj);
            }
           }
           $.ajax({
             url: '/salesorder?action=print',
             type: 'POST',
             dataType: 'html',
             data: {
               "dc": $("#salesorder_deliverynote option:selected").attr("dcno"),
               "custid": $("#salesorder_customer option:selected").val(),
               "salesorderno": $("#salesorder_challanno").val(),
               "salesorderdate": $("#salesorder_date").val() + '-' + $("#salesorder_month").val() + '-' + $("#salesorder_year").val(),
               "printset": JSON.stringify(printset),
               "issuername": $("#salesorder_issuer_name").val(),
               "designation": $("#salesorder_issuer_designation").val(),
               "subtotal": parseFloat(subtotal).toFixed(2),
               "taxtotal": $("#salesorder_product_table tfoot tr:first td:eq(4) input").val(),
		 "gtotal": $("#salesorder_product_table tfoot tr:first td:eq(5) input").val()
             },
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
         } else if (resp["gkstatus"] == 1) {
           $("#salesorder_challanno").focus();
           $("#duplicate-alert").alert();
           $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
             $("#duplicate-alert").hide();
           });
           return false;
         } else {
           $("#salesorder_deliverynote").focus();
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
    });



  });
  $("#confirm_yes_print").on('shown.bs.modal', function(event) {
        $("#tn_save_noprint").focus();

    });
    $("#confirm_yes_print").on('hidden.bs.modal', function(event) {
        $("#salesorder_challanno").focus();
    });
	*/	    });
