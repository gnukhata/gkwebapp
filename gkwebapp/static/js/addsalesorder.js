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
   "Reshma Bhatawadekar" <reshma_b@riseup.net>"
   "Rohini Baraskar" <robaraskar@gmail.com>
   "Pravin Dake" <pravindake24@gmail.com>
   "Nitesh Chaughule" <nitesh@disroot.org>
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
	$(".gstfield").hide();
    } else {
	$(".gstinfield").show();
	$(".vatfield").hide();
    }

    //Initialising some variables.
    var issuername = "";
    var designation = "";
    var address = "";
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");  //Start of financial year is saved in a variable.
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");  //End of financial year is saved in a variable.
    var salesorderdatestring = "";
    var salesorderdate = "";
    var gstdate = Date.parseExact('01072017', "ddMMyyyy");
    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#salesorder_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#salesorder_product_table_total tbody tr:first").html();  //HTML for table displaying totals in GST Product Table.
    var vathtml = $('#salesorder_product_table_vat tbody tr:first').html();  //HTML for VAT Product Table row.
    //A dictionary to store GSTINs of a customer.
    var gstins = {};
    //Function to calculate gst tax amount
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('.salesorder_product_quantity_gst:eq(' + curindex + ')').val()).toFixed(2);
	var rowprice = parseFloat($('.salesorder_product_per_price_gst:eq(' + curindex + ')').val()).toFixed(2);
	var rowdiscount = parseFloat($('.salesorder_product_discount_gst:eq(' + curindex + ')').val()).toFixed(2);
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	if ($('.salesorder_product_quantity_gst:eq(' + curindex + ')').is(":disabled") && $('.salesorder_product_freequantity_gst:eq(' + curindex + ')').is(":disabled")) {
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

	$('.salesorder_product_taxablevalue_gst:eq(' + curindex + ')').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.

	let sgstrate = $('.salesorder_product_sgstrate:eq(' + curindex + ')').val();
	let sgstamount = (rowtaxableamount * sgstrate)/100;  //Amount of SGST to be applied is found out.
	$('.salesorder_product_sgstamount:eq(' + curindex + ')').val(parseFloat(sgstamount).toFixed(2));
	$('.salesorder_product_cgstamount:eq(' + curindex + ')').val(parseFloat(sgstamount).toFixed(2));

	let igstrate = $('.salesorder_product_igstrate:eq(' + curindex + ')').val();
	let igstamount = (rowtaxableamount * igstrate)/100;  //Amount of IGST to be applied is found out.
	$('.salesorder_product_igstamount:eq(' + curindex + ')').val(parseFloat(igstamount).toFixed(2));

	let cessrate = $('.salesorder_product_cessrate:eq(' + curindex + ')').val();
        let cessamount = (rowtaxableamount * cessrate)/100;  //Amount of Cess to be applied is found out.
	$('.salesorder_product_cessamount:eq(' + curindex + ')').val(parseFloat(cessamount).toFixed(2));

	rowtotal = parseFloat(parseFloat(rowtaxableamount).toFixed(2)) + parseFloat(parseFloat(2*sgstamount).toFixed(2)) + parseFloat(parseFloat(igstamount).toFixed(2)) + parseFloat(parseFloat(cessamount).toFixed(2)); //Sum of Taxable Amount and Tax Amount is found out.
        $('.salesorder_product_total_gst:eq(' + curindex + ')').val(parseFloat(rowtotal).toFixed(2));

	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#salesorder_product_table_gst tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat(rowdiscount);
	    totaltaxable = totaltaxable + parseFloat(rowtaxableamount);
	    totalcgst = totalcgst + parseFloat(sgstamount);
	    totalsgst = totalsgst + parseFloat(sgstamount);
	    totaligst = totaligst + parseFloat(igstamount);
	    totalcess = totalcess + parseFloat(cessamount);
	    totalamount = totalamount + parseFloat(rowtotal);
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
	var rowqty = parseFloat($('.salesorder_product_quantity_vat:eq(' + curindex + ')').val()).toFixed(2);
	var rowprice = parseFloat($('.salesorder_product_per_price_vat:eq(' + curindex + ')').val()).toFixed(2);
	var rowdiscount = parseFloat($('.salesorder_product_discount_vat:eq(' + curindex + ')').val()).toFixed(2);
	var rowtaxrate = parseFloat($('.salesorder_product_tax_rate_vat:eq(' + curindex + ')').val()).toFixed(2);
	var taxamount = 0.00;
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totaltax = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;
	$('.salesorder_product_taxablevalue_vat:eq(' + curindex + ')').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.
	taxamount = (rowtaxableamount * rowtaxrate)/100;  //Amount of tax to be applied is found out.
	 $('.salesorder_product_tax_amount_vat:eq(' + curindex + ')').val(parseFloat(taxamount).toFixed(2));
	 rowtotal = rowtaxableamount + taxamount;
	 $('.salesorder_product_total_vat:eq(' + curindex + ')').val(parseFloat(rowtotal).toFixed(2));
	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#salesorder_product_table_vat tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat(rowdiscount);
	    totaltaxable = totaltaxable + parseFloat(rowtaxableamount);
	    totaltax = totaltax + parseFloat(taxamount);
	    totalamount = totalamount + parseFloat(rowtotal);
	}
	//Total of various columns are displayed on the footer.
	$('#discounttotal_product_vat').val(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totalsalesordervalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
    }

    //Delivery Note number select field is hidden when inventory is disabled.
    if(sessionStorage.invflag==0){
	$("#deliverynoterow").hide();
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
	    if ($("#salesorder_challanno").val() == "") {
		$("#challanno-blank-alert").alert();
		$("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#challanno-blank-alert").hide();
		});
		$('#salesorder_challanno').focus();
		return false;
	    }
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
	    if (salesorderdate >= gstdate) {
		$("#taxapplicabletext").text("GST");
		$("#taxapplicable").val("7");
		$("#salesorder_product_table_vat").hide();  //Hides VAT Product table and fields for TIN.
		$("#vathelp").hide();
		$(".tinfield").hide();
		$("#gstproducttable").show();  //Shows GST Product table.
		$(".gstinfield").show();
		$(".vatfield").hide();
		$(".gstfield").show();
	    }
	    else {
		$("#taxapplicabletext").text("VAT");
		$("#taxapplicable").val("22");
		$("#gstproducttable").hide();
		$(".gstinfield").hide();
		$("#salesorder_product_table_vat").show();
		$(".tinfield").show();
		$("#vathelp").show();
		$(".gstfield").hide();
		$(".vatfield").show();
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
	if ($("#taxapplicable").val() == 7){
	    if ($("#salesorder_customerstate option:selected").val() == $("#salesorderstate option:selected").val()) {
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
	
	//In create 'sale salesorder' if user selected 'state' has address in orgnisation then it will be autopopulated in address field.
	//ajax for autopopulating address for selected state.
	var invstate = $("#salesorderstate option:selected").val();
	var invstateid=$("#salesorderstate option:selected").attr("stateid");//statecode
	if($("#status").val() == 16){
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
	}
	//ajax for autopopulating gstin for selected state.
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
	    if ($("#status").val()  == 16) {
		if($("#originaddress").is(":disabled")){
		    $("#salesorder_issuer_name").focus().select();
		}
		$("#originaddress").focus().select();
	    }
	    else {
		$("#payterms").focus();
	    }
	}
	else if (event.which == 38) {
	    if ($("#salesorderstate option:visible").first().is(":selected")) {
		$("#salesorder_year").focus();
	    }
	}
    });

    // Key Events for Address in sale salesorder.
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
	    $("#payterms").focus().select();
	}
	else if(event.which ==38){
	    $("#salesorderstate").focus();
	}
    });
    $("#payterms").keydown(function(event){
	if(event.which ==13){
	    event.preventDefault();
	    $("#creditperiod").focus().select();
	}
	else if(event.which ==38){
	    if ($("#status").val() == 16) {
		$("#originaddress").focus().select();
	    }
	    else{
		$("#salesorderstate").focus().select();
	    }
	}
    });
    $("#creditperiod").keydown(function(event){
	if(event.which ==13){
	    event.preventDefault();
	    $("#togodown").focus();
	}
	else if(event.which ==38){
	    $("#payterms").focus();
	}
    });
    $("#togodown").keydown(function(event){
	if(event.which ==13){
	    event.preventDefault();
	    if ($("#status").val() == 16) {
		$("#purchaseorder_issuer_name").focus().select();
	    }
	    else {
		$("#salesorder_customer").focus();
	    }
	}
	else if(event.which ==38){
	    if ($("#togodown option:selected").val() == 0) {
		$("#creditperiod").focus().select();
	    }
	}
    });
    //Key Events for Issuer Name.
    $("#purchaseorder_issuer_name").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#purchaseorder_issuer_name").val() == "") {
		$("#issuer-blank-alert").alert();
	      $("#issuer-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#issuer-blank-alert").hide();
	      });
	      return false;
	    }
	    $("#purchaseorder_issuer_designation").focus().select();  //Focus shifts to Designation of Issuer.
	}
	else if (event.which == 38) {
	    if($("#originaddress").is(":disabled")){
		$("#salesorderstate").focus();
	    }
	    $("#originaddress").focus();  //Focus shifts to Address of Origin.
	}
    });

    //Key Events for Designation of Issuer.
    $("#purchaseorder_issuer_designation").keydown(function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#purchaseorder_issuer_designation").val() == "") {
		$("#issuer-blank-alert").alert();
	      $("#issuer-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#issuer-blank-alert").hide();
	      });
	      return false;
	    }
	    $("#salesorder_customer").focus();  //Focus shifts to Customer.
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
    //Change Event for Customer.
    $("#salesorder_customer").change(function(event) {
	$(".product_name_vat, .product_name_gst").change();
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
		    $("#salesorder_customerstate").val(resp["gkresult"]["state"]);    //State of Customer is selected automatically.
		    $("#salesorder_customerstate").change();
		    $("#accountno").val(resp["gkresult"]["bankdetails"]["accountno"]); //Account Number of supplier loaded
		    $("#branch").val(resp["gkresult"]["bankdetails"]["branchname"]);   //branchname of supplier is loaded
		    $("#ifsc").val(resp["gkresult"]["bankdetails"]["ifsc"]);           //ifsc code of supplier is loaded
		    $("#bankname").val(resp["gkresult"]["bankdetails"]["bankname"]);   //branchname of supplier is loaded
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
    $("#salesorder_customerstate").change(function(event) {
	$("#statecodeofcustomer").text($("#salesorder_customerstate option:selected").attr("stateid"));  //State code is loaded.
	if ($("#salesorder_customerstate option:selected").attr("stateid") in gstins) {
	       $("#gstin").text(gstins[$("#salesorder_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
	}
	else {
	    $("#gstin").text("");  //If GSTIN is not available it is set as blank.
	}
	if ($("#taxapplicable").val() == 7) {
	    if ($("#salesorder_customerstate option:selected").val() == $("#salesorderstate option:selected").val()) {
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
	    if($("#statecodeofconsignee").text() in gstins) {
		var custgstin = gstins[$("#statecodeofconsignee").text()];
		$("#gstin").text(custgstin); // Customer gstin is synced with state code of consignee.
	    } else {$("#gstin").text("");}
	    if ($("#taxapplicable").val() == 7){
		if ($("#consigneestate option:selected").val() == $("#salesorderstate option:selected").val()) {
		    $(".igstfield").hide();
		    $(".sgstfield").show();
		}
		else {
		    $(".sgstfield").hide();
		    $(".igstfield").show();
		}
	    }
	}
	$(".product_name_vat, .product_name_gst").change();
    });
    $("#consigneestate").change();

    if(sessionStorage.vatorgstflag == '22' ){
	    $(".gstfield").hide();
	} else {
	    $(".vatfield").hide();
	}
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
	    /*if ($("#gstinconsignee").is(":visible")) {
		$("#gstinconsignee").focus().select();  //Focus shifts to GSTIN of Consignee.
		}*/
	    if ($("#taxapplicable").val() == 22) {
		if ($("#consigneename").is(":disabled")){
		   $(".salesorder_product_quantity_vat:first").focus().select(); 
		} else {
		    $("#consigneeaddress").focus().select();  //Focus Shift to Address of Consignee.
		}
	    }
	}
	else if (event.which == 38) {
	    if ($("#consigneestate").is(":disabled")){
		if ($("#salesorder_deliverynote option:selected").val() != '') {
		    if($("#status").val() == 15){
			 $("#salesorder_issuer_designation").focus().select();
		    } else {
			$("#salesorderstate").focus().select();
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
		    $(".salesorder_product_quantity_gst:first").focus().select();
		} else {
		    $("#consigneeaddress").focus().select();  //Focus Shift to Address of Consignee.
		}
	    }
	}
	else if (event.which == 38) {
	    if ($("#consigneestate").is(":disabled")){
		if ($("#salesorder_deliverynote option:selected").val() != '') {
		    if($("#status").val() == 15){
			 $("#salesorder_issuer_designation").focus().select();
		    } else {
			$("#salesorderstate").focus().select();
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
		$(".product_name_gst:first").focus().select();  //Focus Shift to Tax Applicable field.
	    }
	    else {
		$(".product_name_vat:first").focus().select();  //Focus Shift to Tax Applicable field. 
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
	if (!$(this).hasClass("salesorder_product_noofpackages_gst") && !$(this).hasClass("salesorder_product_noofpackages_vat")) {
	    if ($(this).val() == "") {
	    $(this).val(parseFloat(0).toFixed(2));
	} else {
	    $(this).val(parseFloat($(this).val()).toFixed(2));
	}
	}
    });
    $(document).off("change","#gstinconsignee").on("change","#gstinconsignee",function(event) {
        var gstin = $("#gstinconsignee").val();
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
	$('#salesorder_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
	var productcode = $(this).find('option:selected').val();
	var curindex = $(this).closest('tbody tr').index();
    var destinationstate = "";
      var sourcestate = "";
	  sourcestate = $("#salesorderstate option:selected").val();
	  destinationstate = $("#salesorder_customerstate").val();
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
		 $('.salesorder_prduct_tax_rate_vat:eq(' + curindex + ')').val(parseFloat(resp['tax']['VAT']).toFixed(2));
	     }
	     else if ('CVAT' in resp['tax']) {
                 $('.salesorder_prduct_tax_rate_vat:eq(' + curindex + ')').val(parseFloat(resp['tax']['CVAT']).toFixed(2));
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
           $('.unitaddon_quantity_vat:eq(' + curindex + ')').text(resp["unitname"]);
           $('.unitaddon_freequanity_vat:eq(' + curindex + ')').text(resp["unitname"]);
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

    $('#salesorder_product_table_total tbody').on('scroll', function () {
	$('#salesorder_product_table_gst tbody').scrollTop($(this).scrollTop());
    });
    $('#salesorder_product_table_gst tbody').on('scroll', function () {
	$('#salesorder_product_table_total tbody').scrollTop($(this).scrollTop());
    });
    
//VAT events start here
  $(document).off("keydown", ".product_name_vat").on("keydown", ".product_name_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('.product_name_vat:eq(' + curindex + ')').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_vat:eq(' + curindex + ')').focus();
          return false;
        }
      $('.salesorder_product_quantity_vat:eq(' + curindex + ')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('.product_name_vat:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.product_name_vat:eq(' + previndex + ') td:eq(0) select').focus();
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
          $('.salesorder_product_tax_rate_vat:eq(' + previndex + ')').focus().select();
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('.salesorder_product_quantity_vat:eq(' + curindex + ')').focus().select();
    }
      else if (event.which == 27) {
	  $("#chkbank").focus().click();
      }
  });

    $(document).off('change', '.salesorder_product_quantity_vat').on('change', '.salesorder_product_quantity_vat', function(event) {
    event.preventDefault();
      /* Act on the event */
      var curindex = $(this).closest('#salesorder_product_table_vat tbody tr').index();
    if ($(this).val() == "") {
      $(this).val(0);
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
	$('.salesorder_product_freequantity_vat:eq('+curindex+')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
	event.preventDefault();
      $('.salesorder_product_quantity_vat:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_quantity_vat:eq(' + previndex + ')').focus();
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
      $('.product_name_vat:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('.salesorder_product_freequantity_vat:eq(' + curindex + ')').focus().select();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().click();
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
      var quantity = parseFloat($(".salesorder_product_freequantity_vat:eq(" + curindex + ")").val()) + parseFloat($(".salesorder_product_quantity_vat:eq(" + curindex + ")").val());
      if (parseFloat(quantity) === 0.00) {
	  $("#quantity-blank-alert").alert();
	  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	      $("#quantity-blank-alert").hide();
	  });
	  $(".salesorder_product_quantity_vat:eq(" + curindex + ")").focus().select();
	  return false;
      }
  });


  $(document).off("keydown", ".salesorder_product_freequantity_vat").on("keydown", ".salesorder_product_freequantity_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('.product_name_vat:eq(' + curindex + ')').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_vat:eq(' + curindex + ')').focus();
          return false;
        }
	  var quantity = parseFloat($(".salesorder_product_quantity_vat:eq(" + curindex + ")").val()) + parseFloat($(".salesorder_product_freequantity_vat:eq(" + curindex + ")").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $(".salesorder_product_quantity_vat:eq(" + curindex + ")").focus().select();
	      return false;
	  }
	$(".salesorder_product_noofpackages_vat:eq(" + curindex + ")").focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('.salesorder_product_freequantity_vat:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_freequantity_vat:eq(' + previndex + ')').focus();
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
      $('.salesorder_product_quantity_vat:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('.salesorder_product_noofpackages_vat:eq(' + curindex + ')').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().click();
      }
  });

    $(document).off("keydown", ".salesorder_product_noofpackages_vat").on("keydown", ".salesorder_product_noofpackages_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('.product_name_vat:eq(' + curindex + ')').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_vat:eq(' + curindex + ')').focus();
          return false;
        }
	  var quantity = parseFloat($(".salesorder_product_quantity_vat:eq(" + curindex + ")").val()) + parseFloat($(".salesorder_product_freequantity_vat:eq(" + curindex + ")").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $(".salesorder_product_quantity_vat:eq(" + curindex + ")").focus().select();
	      return false;
	  }
	$(".salesorder_product_per_price_vat:eq(" + curindex + ")").focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('.salesorder_product_noofpackages_vat:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_noofpackages_vat:eq(' + previndex + ')').focus();
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
      $('.salesorder_product_freequantity_vat:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('.salesorder_product_per_price_vat:eq(' + curindex + ')').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().click();
      }
  });

  $(document).off('change', '.salesorder_product_per_price_vat').on('change', '.salesorder_product_per_price_vat', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      var curindex = $(this).closest('#salesorder_product_table_vat tbody tr').index();
      if (parseFloat($(this).val()) == 0 && parseFloat($('.salesorder_product_quantity_vat:eq(' + curindex + ')').val()) > 0) {
	  $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.salesorder_product_per_price_vat:eq(' + curindex + ')').focus().select();
          });
	  return false;
      }
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".salesorder_product_per_price_vat").on("keydown", ".salesorder_product_per_price_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if (parseFloat($(this).val()) == 0 && parseFloat($('.salesorder_product_quantity_vat:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	$('.salesorder_product_discount_vat:eq(' + curindex + ')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('.salesorder_product_per_price_vat tbody tr:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_per_price_vat:eq(' + previndex + ')').focus();
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
      $('.salesorder_product_noofpackages_vat:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('.salesorder_product_discount_vat:eq(' + curindex + ')').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#chkbank").focus().click();
    }
  });

    $(document).off('change', '.salesorder_product_discount_vat').on('change', '.salesorder_product_discount_vat', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
	var curindex = $(this).closest('#salesorder_product_table_vat tbody tr').index();
	if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#salesorder_product_quantity_vat tbody tr:eq(' + curindex + ')').val()).toFixed(2)) * parseFloat(parseFloat($('.salesorder_product_per_price_vat:eq(' + curindex + ')').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_vat:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	}
      calculatevataxamt(curindex);
  });

  $(document).off("keydown", ".salesorder_product_discount_vat").on("keydown", ".salesorder_product_discount_vat", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('.salesorder_product_quantity_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2)) * parseFloat(parseFloat($('.salesorder_product_per_price_vat:eq(' + curindex + ')').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_vat:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	}
	$('.salesorder_product_tax_rate_vat:eq(' + curindex + ')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('.salesorder_product_discount_vat:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_discount_vat:eq(' + previndex + ')').focus();
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
      $('.salesorder_product_per_price_vat:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('.salesorder_product_tax_rate_vat:eq(' + curindex + ')').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#chkbank").focus().click();
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
	  if (parseFloat($('.salesorder_product_per_price_vat:eq(' + curindex1 + ')').val()) == 0 && parseFloat($('.salesorder_product_quantity_vat:eq(' + curindex1 + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
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
	$("#chkbank").focus().click();
    } else if (event.which == 13) {
	event.preventDefault();
	calculatevataxamt(curindex1);
	if (curindex1 != ($("#salesorder_product_table_vat tbody tr").length - 1)) {//Not a last row.
	    $('.salesorder_product_tax_rate_vat:eq(' + nextindex1 + ')').focus().select();
      } else {//Last row along with additional conditions.
        if ($('.product_name:eq(' + curindex1 + ')').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_vat:eq(' + curindex1 + ')').focus();
          return false;
        }
	  var quantity = parseFloat($(".salesorder_product_quantity_vat:eq(" + curindex1 + ")").val()) + parseFloat($(".salesorder_product_freequantity_vat:eq(" + curindex1 + ")").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $(".salesorder_product_quantity_vat:eq(" + curindex1 + ")").focus().select();
	      return false;
	  }
	  if (parseFloat($('.salesorder_product_per_price_vat:eq(' + curindex1 + ')').val()) == 0 && parseFloat($('.salesorder_product_quantity_vat:eq(' + curindex1 + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	      return false;
	  }
	  if ($('.product_name_vat:eq(' + curindex1 + ') option:visible').length >= 2){
	$('#salesorder_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	  $('#salesorder_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	  for (let i = 0; i <= curindex1; i++) {
              var selectedproduct = $(".product_name_vat:eq("+ i +") option:selected").val();
	      $(".product_name_vat:eq("+ nextindex1 +") option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
          }
	  $('.product_name_vat:eq('+ nextindex1 +')').focus();
	  $('.product_name_vat:eq('+ nextindex1 +') option:visible').first().prop("selected", true);
	  $('.product_name_vat:eq('+ nextindex1 +')').change();
	  }
      else {
          $("#chkbank").focus().click();
      }
      }
    }else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('.salesorder_product_tax_rate_vat:eq(' + nextindex1 + ')').focus().select();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex1 > -1) {
        event.preventDefault();
        $('.salesorder_product_tax_rate_vat:eq(' + previndex1 + ')').focus().select();
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
      $('.product_name_vat:eq(' + nextindex1 + ')').focus().select();
      event.preventDefault();
    } else if (event.ctrlKey && event.which == 188) {
      $('.salesorder_product_discount_vat:eq(' + curindex1 + ')').focus();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().select();
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

	$('.salesorder_product_sgstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
        $('.salesorder_product_cgstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
        $('.salesorder_product_igstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
	$('.salesorder_product_cessrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
	  sourcestate = $("#salesorderstate option:selected").val();
	  destinationstate = $("#salesorder_customerstate").val();
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
		       $('.salesorder_product_sgstrate:eq(' + curindex + ')').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('.salesorder_product_cgstrate:eq(' + curindex + ')').val(parseFloat(resp['tax']['SGST']).toFixed(2));
		       $('.salesorder_product_igstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate if avaliable.
		       if ('CESS' in resp['tax']) {
			   $('.salesorder_product_cesstrate:eq(' + curindex + ')').val(parseFloat(resp['tax']['CESS']).toFixed(2));
		       }
		   }
		   //Loads IGST rate.
		   else if('IGST' in resp['tax']){
		       $('.salesorder_product_igstrate:eq(' + curindex + ')').val(parseFloat(resp['tax']['IGST']).toFixed(2));
		       $('.salesorder_product_sgstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
		       $('.salesorder_product_cgstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
		       //Loads CESS rate.
		       if ('CESS' in resp['tax']) {
			   $('.salesorder_product_cesstrate:eq(' + curindex + ')').val(parseFloat(resp['tax']['CESS']).toFixed(2));
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

         $('.salesorder_product_hsncode:eq(' + curindex + ')').text(resp["gscode"]);
         if (resp["gsflag"]==7){
           $('.unitaddon_quantity_gst:eq(' + curindex + ')').text(resp["unitname"]);
             $('.unitaddon_freequantity_gst:eq(' + curindex + ')').text(resp["unitname"]);
	     $('.salesorder_product_quantity_gst:eq(' + curindex + ')').prop("disabled", false);
             $('.salesorder_product_freequantity_gst:eq(' + curindex + ')').prop("disabled", false);

         }
	   else {
	       $('.unitaddon_quantity_gst:eq(' + curindex + ')').text("");
               $('.unitaddon_freequantity_gst:eq(' + curindex + ')').text("");
	       $('.salesorder_product_quantity_gst:eq(' + curindex + ')').prop("disabled", true).val(0.00);
               $('.salesorder_product_freequantity_gst:eq(' + curindex + ')').prop("disabled", true).val(0.00);
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
	    $('.unitaddon_quantity_gst:eq(' + curindex + ')').text("");
            $('.unitaddon_freequantity_gst:eq(' + curindex + ')').text("");
	    $('.salesorder_product_quantity_gst:eq(' + curindex + ')').prop("disabled", false).val(0.00);
            $('.salesorder_product_freequantity_gst:eq(' + curindex + ')').prop("disabled", false).val(0.00);
	    $('.salesorder_product_igstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
	    $('.salesorder_product_sgstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
	    $('.salesorder_product_cgstrate:eq(' + curindex + ')').val(parseFloat(0).toFixed(2));
	}
  });
  $(document).off("keydown", ".product_name_gst").on("keydown", ".product_name_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if ($('.product_name_gst:eq(' + curindex + ')').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_gst:eq(' + curindex + ')').focus();
          return false;
        }
	if ($('.salesorder_product_quantity_gst:eq(' + curindex + ')').is(":disabled")) {
	    $('.salesorder_product_noofpackages_gst:eq(' + curindex + ')').focus().select();
	}
	else {
	    $('.salesorder_product_quantity_gst:eq(' + curindex + ')').focus().select();
	}
    } else if (event.which == 190 && event.shiftKey) {
      $('.product_name_gst:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.product_name_gst:eq(' + previndex + ')').focus();
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
        $('.salesorder_product_discount_gst:eq(' + previndex + ')').focus().select();
      }
    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('#salesorder_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().click();
      }
  });

    $(document).off('change', '.salesorder_product_quantity_gst').on('change', '.salesorder_product_quantity_gst', function(event) {
    event.preventDefault();
      /* Act on the event */
      var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
    if ($(this).val() == "") {
      $(this).val(0);
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
	$('.salesorder_product_freequantity_gst:eq('+curindex+')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
	event.preventDefault();
      $('.salesorder_product_quantity_gst:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_quantity_gst:eq(' + previndex + ')').focus();
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
      $('.product_name_gst:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
	event.preventDefault();
      $('.salesorder_product_freequantity_gst:eq(' + curindex + ')').focus().select();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().click();
      }
  });

  $(document).off('change', '.salesorder_product_freequantity_gst').on('change', '.salesorder_product_freequantity_gst', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
      if ($('.product_name_gst:eq(' + curindex + ') option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_gst:eq(' + curindex + ')').focus();
          return false;
        }
	  var quantity = parseFloat($(".salesorder_product_quantity_gst:eq(" + curindex + ")").val()) + parseFloat($(".salesorder_product_freequantity_gst:eq(" + curindex + ")").val());
      if (parseFloat(quantity) === 0.00) {
	  $(".salesorder_product_quanntity_gst:eq(" + curindex + ")").focus().select();
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      return false;
	  }
      calculategstaxamt(curindex);
  });


  $(document).off("keydown", ".salesorder_product_freequantity_gst").on("keydown", ".salesorder_product_freequantity_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('.product_name_gst:eq(' + curindex + ') option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_gst:eq(' + curindex + ')').focus();
          return false;
        }
	  var quantity = parseFloat($(".salesorder_product_quantity_gst:eq(" + curindex + ")").val()) + parseFloat($(".salesorder_product_freequantity_gst:eq(" + curindex + ")").val());
      if (parseFloat(quantity) === 0.00) {
	  $(".salesorder_product_quanntity_gst:eq(" + curindex + ")").focus().select();
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      return false;
	  }
      $('.salesorder_product_noofpackages_gst:eq(' + curindex + ')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('.salesorder_product_freequantity_gst:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_freequantity_gst:eq(' + previndex + ')').focus();
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
      $('.salesorder_product_quantity_gst:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('.salesorder_product_noofpackages_gst:eq(' + curindex + ')').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().click();
      }
  });

    $(document).off("keydown", ".salesorder_product_noofpackages_gst").on("keydown", ".salesorder_product_noofpackages_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;

    if (event.which == 13) {
      event.preventDefault();
      if ($('.product_name_gst:eq(' + curindex + ') option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_gst:eq(' + curindex + ')').focus();
          return false;
        }
	  var quantity = parseFloat($(".salesorder_product_quantity_gst:eq(" + curindex + ")").val()) + parseFloat($(".salesorder_product_freequantity_gst:eq(" + curindex + ")").val());
      if (parseFloat(quantity) === 0.00) {
	  $(".salesorder_product_quanntity_gst:eq(" + curindex + ")").focus().select();
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      return false;
	  }
      $('.salesorder_product_per_price_gst:eq(' + curindex + ')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      $('.salesorder_product_noofpackages_gst:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_noofpackages_gst:eq(' + previndex + ')').focus();
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
      $('.salesorder_product_freequantity_gst:eq(' + curindex + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      $('.salesorder_product_per_price_gst:eq(' + curindex + ')').focus().select();
      event.preventDefault();
    }
    else if (event.which == 27) {
	  $("#chkbank").focus().click();
      }
    });
    
  $(document).off('change', '.salesorder_product_per_price_gst').on('change', '.salesorder_product_per_price_gst', function(event) {
      event.preventDefault();
    /* Act on the event */
    if ($(this).val() == "") {
      $(this).val(0);
    }
      var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
      if (parseFloat($(this).val()) == 0 && parseFloat($('.salesorder_product_quantity_gst:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.salesorder_product_per_price_gst:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
      calculategstaxamt(curindex);
  });

  $(document).off("keydown", ".salesorder_product_per_price_gst").on("keydown", ".salesorder_product_per_price_gst", function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    if (event.which == 13) {
	event.preventDefault();
	if (parseFloat($(this).val()) == 0 && parseFloat($('.salesorder_product_quantity_gst:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.salesorder_product_per_price_gst:eq(' + curindex + ')').focus().select();
          });
	  return false;
    }
	$('.salesorder_product_discount_gst:eq(' + curindex + ')').focus().select();
    } else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('.salesorder_product_per_price_gst:eq(' + nextindex + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('.salesorder_product_per_price_gst:eq(' + previndex + ')').focus();
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
	if ($('.salesorder_product_freequantity_gst:eq(' + curindex + ')').is(":disabled")) {
	    $('.product_name_gst:eq(' + curindex + ')').focus();
	}
	else {
	    $('.salesorder_product_noofpackages_gst:eq(' + curindex + ')').focus().select();
	}

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('.salesorder_product_discount_gst:eq(' + curindex + ')').focus().select();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#chkbank").focus().click();
    }
  });

    $(document).off("change", ".salesorder_product_discount_gst").on("change", ".salesorder_product_discount_gst", function(event) {
	var curindex = $(this).closest('#salesorder_product_table_gst tbody tr').index();
	if ($('.product_name:eq(' + curindex + ') option:selected').attr("gsflag") == 7) {
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('.salesorder_product_quantity_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#salesorder_product_per_price_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_gst:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	else{
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > parseFloat(parseFloat($('.salesorder_product_per_price_gst tbody tr:eq(' + curindex + ')').val()).toFixed(2))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_gst:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	if (parseFloat($('.salesorder_product_per_price_gst:eq(' + curindex + ')').val()) == 0 && parseFloat($('.salesorder_product_quantity_gst:eq(' + curindex + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	calculategstaxamt(curindex);
    });

$(document).off("keydown", ".salesorder_product_discount_gst").on("keydown", ".salesorder_product_discount_gst", function(event) {
//write your code here
var curindex1 = $(this).closest('tr').index();
var nextindex1 = curindex1 + 1;
var previndex1 = curindex1 - 1;
if (event.which == 13) {
    event.preventDefault();
    if (curindex1 != (parseInt($("#salesorder_product_table_gst tbody tr").length) - 1)) {//Not a last row.
	   $('product_name_gst:eq(' + nextindex1 + ')').focus();
    } else {//Last row.
	//Validations
	if ($('.product_name_gst:eq(' + curindex1 + ') option:selected').val() == "") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-blank-alert").hide();
          });
          $('.product_name_gst:eq(' + curindex1 + ')').focus();
          return false;
        }
	  var quantity = parseFloat($(".salesorder_product_quantity_gst:eq(" + curindex1 + ")").val()) + parseFloat($(".salesorder_product_freequantity_gst:eq(" + curindex1 + ")").val());
      if (parseFloat(quantity) === 0.00) {
	  $(".salesorder_product_quanntity_gst:eq(" + curindex1 + ")").focus().select();
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      return false;
	  }
	if ($('.product_name:eq(' + curindex1 + ') option:selected').attr("gsflag") == 7) {
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('.salesorder_product_quantity_gst tbody tr:eq(' + curindex1 + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#salesorder_product_per_price_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_gst:eq(" + curindex1 + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	else{
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > parseFloat(parseFloat($('.salesorder_product_per_price_gst tbody tr:eq(' + curindex1 + ')').val()).toFixed(2))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_gst:eq(" + curindex1 + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	if (parseFloat($('.salesorder_product_per_price_gst:eq(' + curindex1 + ')').val()) == 0 && parseFloat($('.salesorder_product_quantity_gst:eq(' + curindex1 + ')').val()) > 0) {
      $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
          });
	  return false;
    }
	if ($('.product_name_gst:eq(' + curindex1 + ') option:visible').length >= 2){
	    $('#salesorder_product_table_gst tbody').append('<tr>' + gsthtml + '</tr>');
	    $("#salesorder_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	    $('#salesorder_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	    for (let i = 0; i <= curindex1; i++) {
		var selectedproduct = $("#salesorder_product_table_gst tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
		$('.product_name_gst:eq(' + nextindex1 + ') option[value = ' + selectedproduct + ']').prop("disabled", true).prop("hidden", true);
	    }
	    $('.product_name_gst:eq(' + nextindex1 + ')').focus();
	    $('.product_name_gst:eq(' + nextindex1 + ') option:visible').first().prop("selected", true);
	    $("#salesorderstate").change();
	    $('.product_name_gst:eq(' + nextindex1 + ')').change();
	}
	else {
	    $("#accountno").focus().select();
	}
    }
}
    else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('.salesorder_product_discount_gst:eq(' + nextindex1 + ')').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex1 > -1) {
        event.preventDefault();
        $('.salesorder_product_discount_gst:eq(' + previndex1 + ')').focus();
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
      $('.salesorder_product_per_price_gst:eq(' + curindex1 + ')').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
      event.preventDefault();
      $('.product_name_gst:eq(' + nextindex1 + ')').focus();

    } else if (event.which == 27) {
      event.preventDefault();
      $("#chkbank").focus().click();
    }
});

    //GST events end here

    $(document).off("click", ".product_del").on("click", ".product_del", function(event) {
	event.preventDefault();
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
	  $("#salesorder_product_table_vat tbody tr:eq(0) td:eq(10)").empty();
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
    $("#modeoftransport").change(function(event){
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

      //validation for bankdetails on save button.
      if ($("#chkbank").is(":checked")) {
	  if($("#accountno").val()=="" || $("#branch").val()=="" || $("#bankname").val()=="" || $("#ifsc").val()=="" ) {
	      $("#bankdetails-blank-alert").alert();
	      $("#bankdetails-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#bankdetails-blank-alert").hide();
	      });
	      $("#accountno").focus();
	  }
      }
	      
      //Validation for Address in sale salesorder.
	  if($("#originaddress").val() == ""){
	      $("#address-blank-alert").alert();
              $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#address-blank-alert").hide();
	      });
	      $("#originaddress").focus();
	      return false;
	  }
      var tax = {};
      var cess = {};
      var schedule = {};
      var freeqty = {};
      var discount = {};
      var consignee = {};
      var bankdetails = {};
      var salesordertotal = 0.00;
      var productcodes = [];
      var productqtys = [];
      var ppu;
      var psflag = $("#status").val();
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
	productqtys.push(parseFloat($(".salesorder_product_quantity_vat:eq(" + i + ")").val()));
      if ($(".product_name_vat:eq(" + i + ")").val() == "") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#product-blank-alert").hide();
        });
        $(".product_name_vat:eq(" + i + ")").focus();
        return false;
      }
      for (productcode of productcodes) {
        if ($(".product_name_vat:eq(" + i + ")").val() == productcode) {
          $("#product-duplicate-alert").alert();
          $("#product-duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
            $("#product-duplicate-alert").hide();
          });
          $(".product_name_vat:eq(" + i + ")").focus();
          return false;
        }
      }
	calculatevataxamt(i);
      productcodes.push($(".product_name_vat:eq(" + i + ")").val());

      var productcode = $(".product_name_vat:eq(" + i + ")").val();
	let quantity = parseFloat($(".salesorder_product_quantity_vat:eq(" + i + ")").val()) + parseFloat($(".salesorder_product_freequantity_vat:eq(" + i + ")").val());
	  if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $(".salesorder_product_quantity_vat:eq(" + i + ")").focus().select();
	      return false;
	  }
	if (parseFloat($('.salesorder_product_per_price_vat:eq(' + i + ')').val()) == 0.00 && parseFloat($('.salesorder_product_quantity_vat:eq(' + i + ')').val()) > 0) {
	 $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.salesorder_product_per_price_vat:eq(' + i + ')').focus().select();
          });
	  return false;   
	}
	if (parseFloat(parseFloat($('.salesorder_product_discount_vat:eq(" + i + ")').val()).toFixed(2)) > (parseFloat(parseFloat($('.salesorder_product_per_price_vat:eq(" + i + ")').val()).toFixed(2)) * parseFloat(parseFloat($('.salesorder_product_quantity_vat:eq(" + i + ")').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_vat:eq(" + i + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	}
      if ($(".salesorder_product_freequantity_vat:eq(" + i + ")").val() == "") {
        $(".salesorder_product_freequantity_vat:eq(" + i + ")").val(0.00);
      }
	if (parseFloat(quantity) > 0) {
	    let obj = {};
            obj["rateperunit"] = $.trim($(".salesorder_product_per_price_vat:eq(" + i + ")").val());
	    obj["packages"] = $.trim($(".salesorder_product_noofpackages_vat:eq(" + i + ")").val());
            obj["quantity"] = $.trim($(".salesorder_product_quantity_vat:eq(" + i + ")").val());
            tax[productcode] = $.trim($(".product_name_vat:eq(" + i + ")").val());
	    schedule[productcode] = obj;
            freeqty[productcode] = $.trim($(".salesorder_product_freequantity_vat:eq(" + i + ")").val());
	    discount[productcode] = $.trim($(".salesorder_product_discount_vat:eq(" + i + ")").val());
	}
    }
	salesordertotal = $.trim($(".salesorder_product_total_vat:eq(" + i + ")").val());

    }

      else if ($("#taxapplicable").val() == 7) {
	  for (let i = 0; i < $("#salesorder_product_table_gst tbody tr").length; i++) {
	      if ($(".product_name_gst:eq(" + i + ")").val() == "") {
		  $("#product-blank-alert").alert();
		  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#product-blank-alert").hide();
		  });
		  $(".product_name_gst:eq(" + i + ")").focus();
		  return false;
	      }
	      let quantity = parseFloat($(".salesorder_product_quantity_gst:eq(" + i + ")").val()) + parseFloat($(".salesorder_product_freequantity_gst:eq(" + i + ")").val());
	      if (parseFloat(quantity) === 0.00 && $(".product_name_gst:eq(" + i + ")").attr("gsflag") == '7') {
		  $("#quantity-blank-alert").alert();
		  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		      $("#quantity-blank-alert").hide();
		  });
		  $(".salesorder_product_quantity_gst:eq(" + i + ")").focus().select();
		  return false;
	      }
	      if ($(".product_name_gst:eq(" + i + ")").attr("gsflag") == 7) {
	    if (parseFloat(parseFloat($(".salesorder_product_discount_gst:eq(" + i + ")").val()).toFixed(2)) > (parseFloat(parseFloat($(".salesorder_product_quantity_gst:eq(" + i + ")").val()).toFixed(2)) * parseFloat(parseFloat($(".salesorder_product_per_price_gst:eq(" + i + ")").val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_gst:eq(" + i + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	else{
	    if (parseFloat(parseFloat($(".salesorder_product_discount_gst:eq(" + i + ")").val()).toFixed(2)) > parseFloat(parseFloat($(".salesorder_product_per_price_gst:eq(" + i + ")").val()).toFixed(2))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".salesorder_product_discount_vat:eq(" + i + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
	}
	      if (parseFloat($('.salesorder_product_per_price_gst:eq(' + i + ')').val()) == 0 && parseFloat($('.salesorder_product_quantity_gst:eq(' + i + ')').val()) > 0) {
	 $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.salesorder_product_per_price_gst:eq(' + i + ')').focus().select();
          });
	  return false;   
	}
	      calculategstaxamt(i);
	      productqtys.push(parseFloat($(".salesorder_product_quantity_gst:eq(" + i + ")").val()));
	      let obj = {};
	      productcode = $(".product_name_gst:eq(" + i + ")").val();
	      obj["rateperunit"] = $(".salesorder_product_per_price_gst:eq(" + i + ")").val();
	      obj["noofpackages"] = $(".salesorder_product_noofpackages_gst:eq(" + i + ")").val();
	      obj["quantity"] = $(".salesorder_product_quantity_gst:eq(" + i + ")").val();
	      schedule[productcode] = obj;
	      tax[productcode] = parseFloat($(".salesorder_product_sgstamount:eq(" + i + ")").val()) + parseFloat($(".salesorder_product_cgstamount:eq(" + i + ")").val()) + parseFloat($(".salesorder_product_igstamount:eq(" + i + ")").val());
	      cess[productcode] = parseFloat($(".salesorder_product_cessamount:eq(" + i + ")").val());
	      freeqty[productcode] = $(".salesorder_product_freequantity_gst:eq(" + i + ")").val();
	      discount[productcode] = $(".salesorder_product_discount_gst:eq(" + i + ")").val();
	  }
	  salesordertotal = $.trim($('#total_product_gst').html());
      }
      //For sales salesorder store address.
      var address = $("#originaddress").val();
      var form_data = new FormData();
      form_data.append("csid", $("#salesorder_customer option:selected").val());
      if ($("#togodown option:selected").val() > 0) {
	  form_data.append("togodown", $("#togodown option:selected").val());
      }
      form_data.append("orderno", $("#salesorder_challanno").val());
      form_data.append("payterms", $("#payterms").val());
      form_data.append("creditperiod", $("#creditperiod").val());
      form_data.append("orderdate", $.trim($("#salesorder_year").val() + '-' + $("#salesorder_month").val() + '-' + $("#salesorder_date").val()));
      form_data.append("schedule", JSON.stringify(schedule));
      form_data.append("tax", JSON.stringify(tax));
      form_data.append("cess", JSON.stringify(cess));
      form_data.append("issuername", issuername);
      form_data.append("orgstategstin",$("#orggstin").text() );
      form_data.append("designation", designation);
      form_data.append("purchaseordertotal", salesordertotal);
      form_data.append("address", address);
      form_data.append("taxstate", $("#salesorder_customerstate option:selected").val());
      form_data.append("sourcestate", $("#salesorderstate option:selected").val());
      form_data.append("freeqty", JSON.stringify(freeqty));
      form_data.append("discount", JSON.stringify(discount));
      form_data.append("consignee", JSON.stringify(consignee));
      //Code for sending data to the database based on which radio button is checked i.e."cash" or "bank".
        if ($("#chkcash").is(":checked")) {
	    //Checking which radio button is clicked. if cash is selected then paymentmode is set to 3 (i.e. cash transaction)
		form_data.append("paymentmode",3);   

        } else {
	    //If bank is selected then append both bankdetails and paymentmode = 2 (i.e. bank transaction).
		form_data.append("bankdetails", JSON.stringify(bankdetails));
		form_data.append("paymentmode",2);
            }
      form_data.append("taxflag", $("#taxapplicable").val());
      form_data.append("modeoftransport", $("#modeoftransport").val());
      form_data.append("vehicleno", $("#vehicleno").val());
      form_data.append("psflag",psflag);  
      var dateofsupply = $.trim($("#supply_date").val() + $("#supply_month").val() + $("#supply_year").val());
      if (dateofsupply != "") {
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
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function(e) {
	if (allow == 1){
	    $.ajax({
                url: '/purchaseorder?action=save',
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
			$('input:not(#status, #taxapplicable), select:not(#invselect)').val("");
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
                        $("#success-alert").alert();
                        $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
			    /*let orderid = resp.gkresult;
			    $.ajax({
				type: "POST",
				url: "/salesorder?action=showps",
				global: false,
				async: false,
				datatype: "text/html",
				data: {
				    "invid": invid
				},
				beforeSend: function(xhr) {
				    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
				}
			    })
				.done(function(resp) {
				    $("#invload").html("");
				    $("#invload").html(resp);
				    $("#backbutton").attr("psflag", psflag);
				    $("#editbutton").attr("orderid",orderid);
				    $("#printbutton").hide();
				    $("#listdiv").hide();
				    $("#viewinvdiv").show();
				    $('#salesorder_div').html("");
				});*/
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
                        $("#salesorder_challanno").focus();
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
    $("#backbutton").click(function(event){
	$("#invload").html("");
	$("#viewinvdiv").hide();
	$('#listdiv').show();
	$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
	if ($("#backbutton").attr("inoutflag") == '9') {
	    $("#salesorder_record").click();

	} else {
	    $("#salesorder_create").click();
	}
	$(".input-sm:visible").first().focus();  //Focus on the first element when the page loads
    });
    $("#printbutton").click(function(event) {
        $.ajax({
                url: '/salesorder?action=print',
                type: 'POST',
                dataType: 'html',
            data: {"invid":$("#printbutton").attr("invid")},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                $('#printload').html(resp);
		$("#invload").hide();
		$("#buttondiv").hide();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });

    $(document).off('keydown', '#chkbank').on('keydown', '#chkbank', function(event) {
        if(event.which==13){
        $("#accountno").focus();
        }
    });
    $(document).off('keydown', '#chkcash').on('keydown', '#chkcash', function(event) {
        if(event.which==13){
        $("#transportationmode").focus();
        }
    });

     //Code for radio buttons to show and hide "bankdetails fields" and "cash received"
    $("input[name='chkpaymentmode']").click(function () {
	//Checking which radio button is selected.
        if ($("#chkbank").is(":checked")) {
	    //If cash is selected then bankdetails fields are hide and 'CASH RECEIVED' is shown.
                $("#bank").show();
	        $("#cash").hide();
        } else {
	    //If bank is selected then bankdetails fields are shown and 'CASH RECEIVED' is hide.
                $("#bank").hide();
		$("#cash").show();
            }
        });
    //Code for populting organisation's bankdetails in create sale salesorder on click event on Bank radio button.
    if ($("#status").val() == '15') {      //checking whether it is sale salesorder or not (15 = sale salesorder).
	$("#chkbank").click(function(event) {
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
                    $("#accountno").val(resp["gkbankdata"]["bankdetails"]["accountno"]); //Account Number of organisation loaded
		    $("#branch").val(resp["gkbankdata"]["bankdetails"]["branchname"]);   //branchname of organisation is loaded
		    $("#ifsc").val(resp["gkbankdata"]["bankdetails"]["ifsc"]);           //ifsc code of organisation is loaded
		    $("#bankname").val(resp["gkbankdata"]["bankdetails"]["bankname"]);   //branchname of organisation is loaded
		})
		.fail(function() {
                    console.log("error");
		})
		.always(function() {
                    console.log("complete");
		});
	});

    }
      //Keydown EVENT for BANK DETAILS

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
	    
      $("#branch").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#accountno").focus().select();
	};
    });

    $("#branch").keydown(function(event) {
	if (event.which==13) {
	     if ($.trim($("#accountno").val())=="" && $.trim($("#branch").val())!="" ) {
            $("#accountno-blank-alert").alert();
            $("#accountno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#accountno-blank-alert").hide();
            });
            $("#accountno").focus();
            return false;
          }

	     if ( $.trim($("#bankname").val())=="" && $.trim($("#branch").val())!="" ) {
            $("#bankname-blank-alert").alert();
            $("#bankname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-blank-alert").hide();
            });
            $("#bankname").focus();
            return false;
          }


	if ($.trim($("#accountno").val())!="" && $.trim($("#bankname").val())!="" && $.trim($("#branch").val())=="" ) {
            $("#branch-blank-alert").alert();
            $("#branch-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#branch-blank-alert").hide();
            });
            $("#branch").focus();
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

         if ($.trim($("#accountno").val())=="" && $.trim($("#bankname").val())=="" && $.trim($("#branch").val())=="" && $.trim($("#ifsc").val())!="" ) {
            $("#accountno_bankname_branch-blank-alert").alert();
            $("#accountno_bankname_branch-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#accountno_bankname_branch-blank-alert").hide();
            });
            $("#accountno").focus();
            return false;
         }

	    if ($.trim($("#accountno").val())!="" && $.trim($("#bankname").val())=="" && $.trim($("#branch").val())=="" && $.trim($("#ifsc").val())!="" ) {
            $("#bankname_branch-blank-alert").alert();
            $("#bankname_branch-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname_branch-blank-alert").hide();
            });
            $("#bankname").focus();
            return false;
         }

            if ($.trim($("#accountno").val())!="" && $.trim($("#bankname").val())!="" && $.trim($("#branch").val())!="" && $.trim($("#ifsc").val())=="" ) {
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
	 $("#branch").focus().select();
       };
    });
    
});
