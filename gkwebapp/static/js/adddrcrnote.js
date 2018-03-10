$(document).ready(function() {
    console.log("Ready");
    $("#drcrnote_invoice").focus();
    $('.drcrnotedate').autotab('number');  //Focus shifts from fields among date fields.
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");  //Start of financial year is saved in a variable.
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");  //End of financial year is saved in a variable.
    
    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#drcrnote_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#drcrnote_product_table_total tbody tr:first").html(); //HTML for table displaying totals in GST Product Table.
    var vathtml = $('#drcrnote_table_vat tbody tr:first').html();  //HTML for VAT Product Table row.
    
    //Function to calculate Tax Amount and Total of Discount, Taxable Amount, Tax Amounts and Total Amount.
    function calculatevataxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
	var rowprice = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
	var rowtaxrate = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
	var taxamount = 0.00;
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totaltax = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;
	$('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.
	taxamount = (rowtaxableamount * rowtaxrate)/100;  //Amount of tax to be applied is found out.
	 $('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(taxamount).toFixed(2));
	 rowtotal = rowtaxableamount + taxamount;
	 $('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(rowtotal).toFixed(2));
	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#drcrnote_table_vat tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(3) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val());
	    totaltax = totaltax + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(6) input').val());
	    totalamount = totalamount + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(7) input').val());
	}
	
	//Total of various columns are displayed on the footer.
	$('#discounttotal_product_vat').val(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totaldrcrnotvalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));	
    }

    //Function to calculate gst tax amount
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowprice = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	if ($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled")) {
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

	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(rowtaxableamount).toFixed(2)); //Taxable amount is displayed.

	let sgstrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val();
	let sgstamount = (rowtaxableamount * sgstrate)/100;  //Amount of SGST to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(sgstamount).toFixed(2));
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(sgstamount).toFixed(2));

	let igstrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(10) input').val();
	let igstamount = (rowtaxableamount * igstrate)/100;  //Amount of IGST to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(igstamount).toFixed(2));

	let cessrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(12) input').val();
        let cessamount = (rowtaxableamount * cessrate)/100;  //Amount of Cess to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(cessamount).toFixed(2));

	rowtotal = rowtaxableamount + 2*sgstamount + igstamount + cessamount; //Sum of Taxable Amount and Tax Amount is found out.
        $('#drcrnote_product_table_total tbody tr:eq(' + curindex + ') td:eq(0) input').val(parseFloat(rowtotal).toFixed(2));

	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#drcrnote_product_table_gst tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(4) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totalcgst = totalcgst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(7) input').val());
	    totalsgst = totalsgst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(9) input').val());
	    totaligst = totaligst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(11) input').val());
	    totalcess = totalcess + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(13) input').val());
	    totalamount = totalamount + parseFloat($('#drcrnote_product_table_total tbody tr:eq(' + i + ') td:eq(0) input').val());
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
    
    $("#drcrnote_invoice").change(function(event){
	$.ajax({
		url: '/invoice?action=getinvdetails',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "invid": $("#drcrnote_invoice option:selected").val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		   
		}
	})
	    .done(function(resp) {
		console.log("success");
		if (resp["gkstatus"] == 0) {
		    console.log(resp);
		    //Load invoice data
		    $("#drcrnote_custsupp").text(resp.invoicedata.custSupDetails["custname"]);
		    $("#gstin").text(resp.invoicedata.custSupDetails["custgstin"]);
		    $("#tin").text(resp.invoicedata.custSupDetails["custtin"]);
		    $("#drcrnote_custsuppaddr").text(resp.invoicedata.custSupDetails["custaddr"]);
		    /*
		    if (resp.invoicedata.taxname=="VAT"){
			 $("#taxapplicabletext").text(resp.invoicedata.taxname);
		    }else if ((resp.invoicedata.taxname=="IGST") || (resp.invoicedata.taxname=="SGST")){
			 $("#taxapplicabletext").text("GST");
		   
		    }
		    */
		    if(resp.invoicedata.inoutflag == "15") {
			console.log(resp.invoicedata.sourcestate);
			$("#drcrnote_state").text(resp.invoicedata.sourcestate);
			$("#statecodefordrcrnote").text(resp.invoicedata.sourcestatecode);
			$("#drcrnote_custsuppstate").text(resp.invoicedata.custSupDetails["custsupstate"]);
			$("#statecodeofcustsupp").text(resp.invoicedata.custSupDetails["custsupstatecode"]);
			$("#drcrnote_issuer_name").text(resp.invoicedata.issuername);
			$("#drcrnote_issuer_designation").text(resp.invoicedata.designation);

		    } else {
			$("#drcrnote_state").text(resp.invoicedata.destinationstate);
			$("#statecodefordrcrnote").text(resp.invoicedata.taxstatecode);
			$("#drcrnote_custsuppstate").text(resp.invoicedata.sourcestate);
			$("#statecodeofcustsupp").text(resp.invoicedata.sourcestatecode);
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
				$("#drcrnote_issuer_name").text(resp.unamerole["username"]);
				$("#drcrnote_issuer_designation").text(resp.unamerole["userroleName"]);
	
			    });
				
		    }
		    
		    // Change event for product price(i.e.Rate) in VAT
		    $(document).off('change', '.drcrnote_product_per_price_vat').on('change', '.drcrnote_product_per_price_vat', function(event) {
			event.preventDefault();
			/* Act on the event */
			if ($(this).val() == "") {
			    $(this).val(0);
			}
			var curindex = $(this).closest('#drcrnote_table_vat tbody tr').index();
			console.log("CUR",curindex);
			if (parseFloat($(this).val()) == 0) {
			    $("#price-blank-alert").alert();
			    $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#price-blank-alert").hide();
				$('.drcrnote_product_per_price_vat:eq(' + curindex + ')').focus().select();
			    });
			    return false;
			}
			calculatevataxamt(curindex);
		    });

		    // Change event for product price(i.e.Rate) in GST
		    $(document).off('change', '.drcrnote_product_per_price_gst').on('change', '.drcrnote_product_per_price_gst', function(event) {
			event.preventDefault();
			/* Act on the event */
			if ($(this).val() == "") {
			    $(this).val(0);
			}
			var curindex = $(this).closest('#drcrnote_product_table_gst tbody tr').index();
			if (parseFloat($(this).val()) == 0) {
			    $("#price-blank-alert").alert();
			    $("#price-blank-alert();ert").fadeTo(2250, 500).slideUp(500, function() {
				$("#price-blank-alert").hide();
				$('.drcrnote_product_per_price_gst:eq(' + curindex + ')').focus().select();
			    });
			    return false;
			}
			calculategstaxamt(curindex);
		    });
		    
		    //invoicedata contents filled in table
		    console.log("invoice contents which gives details of product to fill table ",resp.invoicedata.invcontents);
		    $('#drcrnote_table_vat tbody').empty();
		    $.each(resp.invoicedata.invcontents, function(key, value) {
			$('#drcrnote_table_vat tbody').append('<tr>' + vathtml + '</tr>');
			$('#drcrnote_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
			console.log("key ans",value.proddesc);
			$('#drcrnote_table_vat tbody tr:last td:first label').text(value.proddesc);
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) span').text(value.unitname);
			$('#drcrnote_table_vat tbody tr:last td:eq(2) span').text(value.unitname);
			$('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2)).attr("data", parseFloat(value.priceperunit).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(3) input').val(parseFloat(value.discount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(3) input').val(parseFloat(value.discount).toFixed(2)).attr("data", parseFloat(value.discount).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.taxableamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.taxableamount).toFixed(2)).attr("data", parseFloat(value.taxableamount).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxrate).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.totalAmount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.totalAmount).toFixed(2)).attr("data", parseFloat(value.totalAmount).toFixed(2));
		    });
		    $("#drcrnote_table_vat tbody tr:first td:eq(9)").empty();
		    var productcode;
		    $('#drcrnote_product_table_gst tbody').empty();
		    $('#drcrnote_product_table_total tbody').empty();
		    $.each(resp.invoicedata.invcontents, function(key, value) {
			$('#drcrnote_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
			
			$('#drcrnote_product_table_gst tbody tr:last td:first label').text(value.proddesc);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(1) label').html(value.gscode);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) span').text(value.unitname);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) span').text(value.unitname);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) input').val(parseFloat(value.priceperunit).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) input').val(parseFloat(value.priceperunit).toFixed(2)).attr("data", parseFloat(value.priceperunit).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(4) input').val(parseFloat(value.discount).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(4) input').val(parseFloat(value.discount).toFixed(2)).attr("data", parseFloat(value.discount).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(value.taxableamount).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(value.taxableamount).toFixed(2)).attr("data", parseFloat(value.taxableamount).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.cessrate).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.cessrate).toFixed(2)).attr("data", parseFloat(value.cessrate).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(value.cess).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(value.cess).toFixed(2));

			    
			if(resp.invoicedata.taxname=="IGST")
			{
			    $(".sgstfield").hide();
			    $(".igstfield").show();
			    console.log(value.taxrate);
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			}
			else if(resp.invoicedata.taxname=="SGST")
			{
			    $(".igstfield").hide();
			    $(".sgstfield").show();
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(8) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(8) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));			    
			    
			}
			$("#drcrnote_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
		    });
		  
		    $("#drcrnote_product_table_total tbody tr:first td:last").empty();   
		}
		
		//code for hide and show VAT and GST table on the basis of taxflag which is from invoicedata
		if (resp.invoicedata.taxflag=="7"){
		    $("#discounttotal_product_gst").text(resp.invoicedata.totaldiscount);
		    $("#taxablevaluetotal_product_gst").text(resp.invoicedata.totaltaxablevalue);
		    $("#totalcgst_product_gst").text(resp.invoicedata.totaltaxamt);
		    $("#totalsgst_product_gst").text(resp.invoicedata.totaltaxamt);
		    $("#totalcess_product_gst").text(resp.invoicedata.totalcessamt);
		    $("#total_product_gst").text(resp.invoicedata.invoicetotal);
		    $("#totaligst_product_gst").text(resp.invoicedata.totaltaxamt);
	    	    $("#taxapplicabletext").text("GST");
	            $("#drcrnote_table_vat").hide();  //Hides VAT Product table and fields for TIN.
		    $("#vathelp").hide();
		    $(".tinfield").hide();
		    $("#gstproducttable").show();  //Shows GST Product table.
		    $(".gstinfield").show();
		    $(".vatfield").hide();
		    $(".gstfield").show();
		    
		}
		else {
		    $("#discounttotal_product_vat").val(resp.invoicedata.totaldiscount);
		    $("#taxablevaluetotal_product_vat").val(resp.invoicedata.totaltaxablevalue);
		    $("#totaltax").val(resp.invoicedata.totaltaxamt);
		    $("#total_product_vat").val(resp.invoicedata.invoicetotal); 
		    $("#taxapplicabletext").text("VAT");
		    $("#gstproducttable").hide();
		    $(".gstinfield").hide();
		    $("#drcrnote_table_vat").show();
		    $(".tinfield").show();
		    $("#vathelp").show();
		    $(".gstfield").hide();
		    $(".vatfield").show();
		}	
	    });//done end

	

	//click event of delete product
	$(document).off("click", ".product_del").on("click", ".product_del", function(event) {
	    event.preventDefault();
	    var curindex = $(this).closest('tr').index();
	    var nextindex = curindex + 1;
	    var previndex = curindex - 1;
	    if ($("#drcrnote_table_vat tbody tr").length > 1) {
		$(this).closest('tr').fadeOut(200, function() {
		    $(this).closest('tr').remove(); //closest method gives triggerHandler()e closest element productified
		    //$("#drcrnote_table_vat tbody tr:first td:eq(0) label").focus();
		});
	    }
	    if ($("#drcrnote_table_vat tbody tr").length == 1) {
		$("#drcrnote_table_vat tbody tr:eq(0) td:eq(9)").empty();
	    }
	    if ($("#drcrnote_product_table_gst tbody tr").length > 1) {
		$(this).closest('tr').remove();
		$("#drcrnote_product_table_gst tbody tr:eq("+curindex+")").remove();
		$("#drcrnote_product_table_gst tbody tr:first td:eq(0) select").focus();
	    }
	    if ($("#drcrnote_product_table_gst tbody tr").length == 1) {
		$("#drcrnote_product_table_total tbody tr:eq(0) td:eq(1)").empty();
	    }
	});

	
    });//invoice change event end

    //click event for reset button
    $(document).off('click', '#drcrnote_reset').on('click', '#drcrnote_reset', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#status").val() == '3') {
      $("#creditnote_create").click();

    } else {
      $("#debitnote_create").click();
    }
  });
    
}); // ready func end





