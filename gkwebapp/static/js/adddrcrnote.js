$(document).ready(function() {
    console.log("Ready");
    $("#drcrnote_invoice1").hide();
    $("#sale").focus();
    $(".purchasediv").hide();
    $('.drcrnotedate').autotab('number');  //Focus shifts from fields among date fields.
    //Preventing characters in numeric fields.
    $("#drcrnote_date").numeric({ negative: false });
    $("#drcrnote_month").numeric({ negative: false });
    $("#drcrnote_year").numeric({ negative: false });
     $("#drcrnote_date_ref").numeric({ negative: false });
    $("#drcrnote_month_ref").numeric({ negative: false });
    $("#drcrnote_year_ref").numeric({ negative: false });

    //keydown events for drcrnote
    $("input[name='invoice']").click(function () {
	//Checking which radio button is selected.
	if($("#sale").is(":checked"))  {
	    $(".salediv").show();
	    $(".purchasediv").hide();
	    $("#drcrnote_invoice").show();
	    $("#drcrnote_invoice1").hide();
       }
	else{
	    $("#drcrnote_invoice1").show();
	    $("#drcrnote_invoice").hide();
	    $(".salediv").hide();
	    $(".purchasediv").show();
	    
	}
        });

    $("#drcrnote_invoice").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($.trim($('#drcrnote_invoice option:selected').val()) == "") {
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
		$("#invoice-blank-alert").alert();
		$("#invoice-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#invoice-blank-alert").hide();
		});
		$('#drcrnote_invoice').focus();
		return false;
	    } else {
		$("#drcrnote_no").focus();
	    }
	}
    });

    //Key Event for credit/debit Number.
    $("#drcrnote_no").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($.trim($('#drcrnote_no').val()) == "") {
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
		$("#drcrno-blank-alert").alert();
		$("#drcrno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#drcrno-blank-alert").hide();
		});
		$('#drcrnote_no').focus();
		return false;
	    } else {
		$("#drcrnote_date").focus();
	    }
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#drcrnote_invoice").focus(); //Focus shifts to select invoice
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
    $("#drcrnote_date").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_month").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_year").blur(function(event) {
	$(this).val(yearpad($(this).val(), 4));
	drcrdatestring = $("#drcrnote_date").val() + $("#drcrnote_month").val() + $("#drcrnote_year").val();
	drcrdate = Date.parseExact(drcrdatestring, "ddMMyyyy");
	if (drcrdatestring.length == 0) {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-blank-alert").hide();
	    });
	    $("#drcrnote_date").focus().select();
	    return false;
	}
	else if (!drcrdate && drcrdatestring.length == 8) {
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-alert").hide();
	    });
	    $("#drcrnote_date").focus().select();
	    return false;
	}
	else if (drcrdate) {
	    if (!drcrdate.between(financialstart, financialend)) {
		$("#between-date-alert").alert();
		$("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#between-date-alert").hide();
		});
		$('#drcrnote_date').focus().select();
		return false;
	    }
	    if ($("#drcrnote_invoice option:selected").val() != "") {
		console.log($("#drcrnote_invoice option:selected").attr("drcrdate"));
		if (Date.parseExact($("#drcrnote_invoice option:selected").attr("invoicedate"), "dd-MM-yyyy").compareTo(drcrdate) == 1) {
		    $("#prior-date-alert").alert();
		    $("#prior-date-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#prior-date-alert").hide();
		    });
		    $('#drcrnote_date').focus().select();
		    return false;
		}
	    }
	}
    });
    //Key Event for drcr Date Field.
    $("#drcrnote_date").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#drcrnote_month").focus().select();  //Focus shifts to Month field
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#drcrnote_no").focus().select();  //Focus shifts to drcrnote Number.
	}
    });

    //Key Event for drcr Month field.
    $("#drcrnote_month").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#drcrnote_year").focus().select();  //Focus Shifts to Year field.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#drcrnote_date").focus().select();  //Focus Shifts to Date field.
	}
    });

    //Key Event for Invoice Year field.
    $("#drcrnote_year").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#reference").focus();  //Focus shifts to State of Origin/Delivery.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#drcrnote_month").focus().select();  //Focus shifts to month field.
	}
    });
    //reference filed validation
  //to hide and show refernce fields date and number of drcrnote.
      $("#reference").change(function() {
          if($(this).prop('checked') == true) {
	      $(".ref").show();
	     
        } else {
	    $(".ref").hide();
	}
      });
    
     $("#reference").keydown(function(event) {
          if($("#reference").prop('checked') == true) {
	      if (event.which == 13) {
		  event.preventDefault();
		  $("#drcrnote_no_ref").focus();
	      }
	      if (event.which == 38) {
		  event.preventDefault();
		  $("#drcrnote_month").focus().select();  
	      }
	  }
	 else{
	     $(".drcrnote_product_rate_gst:first").focus().select();
	     $(".drcrnote_product_rate_vat:first").focus().select();

	 }
     });

    //Key Event for drcr date field.
    $("#drcrnote_date_ref").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if($("#drcrnote_no_ref").val()!="" && $("#drcrnote_date_ref").val()==""){
		$("#date-alert").alert();
		$("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#date-alert").hide();
		});
	    $('#drcrnote_date_ref').focus();
	    return false;
	    } else {
		$("#drcrnote_month_ref").focus().select();  //Focus shifts to Month field
	    }
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#drcrnote_no_ref").focus().select();  //Focus shifts to drcrnote Number.
	}
    });

     //Key Event for drcr Month field.
    $("#drcrnote_month_ref").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#drcrnote_year_ref").focus().select();  //Focus Shifts to Year field.
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#drcrnote_date_ref").focus().select();  //Focus Shifts to Date field.
	}
    });

    //Key Event for Invoice Year field.
    $("#drcrnote_year_ref").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $(".drcrnote_product_rate_gst:first").focus().select();
	     $(".drcrnote_product_rate_vat:first").focus().select();
	}
	if (event.which == 38) {
	    event.preventDefault();
	    $("#drcrnote_month_ref").focus().select();  //Focus shifts to month field.
	}
    });
    $("#drcrnote_no_ref").keydown(function(event) {	 
	if($("#drcrnote_no_ref").val()!=""){
	     if (event.which == 13) {
		 event.preventDefault();
		 $('#drcrnote_date_ref').focus();
	     }
	}
	else{
	    $("#drcrno-blank-alert").alert();
	    $("#drcrno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#drcrno-blank-alert").hide();
	    });
	    $('#drcrnote_no_ref').focus();
	}
	});
		 
    //date validation for reference
    
    //Padding functions are called on blur events.
    $("#drcrnote_date_ref").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_month_ref").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_year_ref").blur(function(event) {
	$(this).val(yearpad($(this).val(), 4));
	drcrdatestring = $("#drcrnote_date_ref").val() + $("#drcrnote_month_ref").val() + $("#drcrnote_year_ref").val();
	drcrdate = Date.parseExact(drcrdatestring, "ddMMyyyy");
	
	if (drcrdatestring.length == 0) {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-blank-alert").hide();
	    });
	    $("#drcrnote_date_ref").focus().select();
	    return false;
	}
	else if (!drcrdate && drcrdatestring.length == 8) {
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
		$("#date-alert").hide();
	    });
	    $("#drcrnote_date_ref").focus().select();
	    return false;
	}
	else if (drcrdate) {
	    if (!drcrdate.between(financialstart, financialend)) {
		$("#between-date-alert").alert();
		$("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#between-date-alert").hide();
		});
		$('#drcrnote_date_ref').focus().select();
		return false;
	    }
	    if ($("#drcrnote_invoice option:selected").val() != "") {
		if (Date.parseExact($("#drcrnote_invoice option:selected").attr("invoicedate"), "dd-MM-yyyy").compareTo(drcrdate) == 1) {
		    $("#prior-date-alert").alert();
		    $("#prior-date-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#prior-date-alert").hide();
		    });
		    $('#drcrnote_date_ref').focus().select();
		    return false;
		}
	    }
	}
    });
    
    
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
	var rowreductrate = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowtaxrate = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val()).toFixed(2);
	var taxamount = 0.00;
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	var reductprice=rowqty*rowreductrate;
	var newtaxableamnt=rowtaxableamount-reductprice;
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totaltax = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;

	$('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(newtaxableamnt).toFixed(2)); //Taxable amount is displayed.
	taxamount = (newtaxableamnt * rowtaxrate)/100;  //Amount of tax to be applied is found out.
	
	 $('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(taxamount).toFixed(2));
	 rowtotal = newtaxableamnt + taxamount;
	 $('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(rowtotal).toFixed(2));
	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#drcrnote_table_vat tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totaltax = totaltax + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(7) input').val());
	    totalamount = totalamount + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(8) input').val());
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
       	var gsflag=$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) label').attr("data-gsflag");
	console.log("its from cal fun gsflag ans=====",gsflag);
	var rowreductrate = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	console.log("rowreduct",rowreductrate);
	var rowdiscount = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
	var rowtaxableamount=0.00;
	if (gsflag=="19") {
	    console.log("rowprice",rowprice);
	    rowtaxableamount = (rowprice-rowreductrate) - rowdiscount;
	    console.log("rta",rowtaxableamount);
	}
	else{
	    rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	    
	}
	var reductprice=rowqty*rowreductrate;
	console.log("Rp=  ", reductprice);

	var newtaxableamnt=rowtaxableamount-reductprice;
	console.log("newta",newtaxableamnt);
	

	//Initialising variables for calculating total of Discount, Taxable Amount, Tax Amounts, and Total Amounts.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totalcgst = 0.00;
	var totalsgst = 0.00;
	var totaligst = 0.00;
	var totalcess = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;
 
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(newtaxableamnt).toFixed(2)); //Taxable amount is displayed.

	let sgstrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val();
	let sgstamount = (newtaxableamnt * sgstrate)/100;  //Amount of SGST to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(sgstamount).toFixed(2));
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(10) input').val(parseFloat(sgstamount).toFixed(2));

	let igstrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val();
	let igstamount = (newtaxableamnt * igstrate)/100;  //Amount of IGST to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(12) input').val(parseFloat(igstamount).toFixed(2));

	let cessrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val();
        let cessamount = (newtaxableamnt * cessrate)/100;  //Amount of Cess to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(14) input').val(parseFloat(cessamount).toFixed(2));

	rowtotal = newtaxableamnt + 2*sgstamount + igstamount + cessamount; //Sum of Taxable Amount and Tax Amount is found out.
        $('#drcrnote_product_table_total tbody tr:eq(' + curindex + ') td:eq(0) input').val(parseFloat(rowtotal).toFixed(2));

	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#drcrnote_product_table_gst tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(6) input').val());
	    totalcgst = totalcgst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(8) input').val());
	    totalsgst = totalsgst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(10) input').val());
	    totaligst = totaligst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(12) input').val());
	    totalcess = totalcess + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(14) input').val());
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




    //1 start
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
		    $(document).off('change', '.drcrnote_product_rate_vat').on('change', '.drcrnote_product_rate_vat', function(event) {
			event.preventDefault();
			/* Act on the event */
			if ($(this).val() == "") {
			    $(this).val(0);
			}
			var curindex = $(this).closest('#drcrnote_table_vat tbody tr').index();
			if (parseFloat($(this).val()) == 0) {
			    $("#price-blank-alert").alert();
			    $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#price-blank-alert").hide();
				$('.drcrnote_product_rate_vat:eq(' + curindex + ')').focus().select();
			    });
			    return false;
			}
			if($("#status").val()==3)
			{
			    calculatevataxamt(curindex);
			}
		    });
		    
		    // Change event for product price(i.e.Rate) in GST
		    $(document).off('change', '.drcrnote_product_rate_gst').on('change', '.drcrnote_product_rate_gst', function(event) {
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
				$('.drcrnote_product_rate_gst:eq(' + curindex + ')').focus().select();
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
			console.log("key ans",value);
			$('#drcrnote_table_vat tbody tr:last td:first label').text(value.proddesc);
			$('#drcrnote_table_vat tbody tr:last td:first label').attr("data-productcode",key);
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) span').text(value.uom);
			$('#drcrnote_table_vat tbody tr:last td:eq(2) span').text(value.uom);
			$('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2)).attr("data", parseFloat(value.priceperunit).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.discount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.discount).toFixed(2)).attr("data", parseFloat(value.discount).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxableamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxableamount).toFixed(2)).attr("data", parseFloat(value.taxableamount).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.taxamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(8) input').val(parseFloat(value.totalAmount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(8) input').val(parseFloat(value.totalAmount).toFixed(2)).attr("data", parseFloat(value.totalAmount).toFixed(2));
		    });
		    $("#drcrnote_table_vat tbody tr:first td:eq(9)").empty(); //please check eq
		    var productcode;
		    $('#drcrnote_product_table_gst tbody').empty();
		    $('#drcrnote_product_table_total tbody').empty();
		    $.each(resp.invoicedata.invcontents, function(key, value) {
			
			$('#drcrnote_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
			$('#drcrnote_product_table_gst tbody tr:last td:first label').text(value.proddesc);
			$('#drcrnote_product_table_gst tbody tr:last td:first label').attr("data-productcode",key);
			$('#drcrnote_product_table_gst tbody tr:last td:first label').attr("data-gsflag",value.gsflag);
			
			

			$('#drcrnote_product_table_gst tbody tr:last td:eq(1) label').html(value.gscode);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) span').text(value.uom);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) span').text(value.uom);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) input').val(parseFloat(value.priceperunit).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) input').val(parseFloat(value.priceperunit).toFixed(2)).attr("data", parseFloat(value.priceperunit).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(value.discount).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(value.discount).toFixed(2)).attr("data", parseFloat(value.discount).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxableamount).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxableamount).toFixed(2)).attr("data", parseFloat(value.taxableamount).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cessrate).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cessrate).toFixed(2)).attr("data", parseFloat(value.cessrate).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(14) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(value.cess).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(14) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(value.cess).toFixed(2));

			    
			if(resp.invoicedata.taxname=="IGST")
			{
			    $(".sgstfield").hide();
			    $(".igstfield").show();
			    console.log(value.taxrate);
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			}
			else if(resp.invoicedata.taxname=="SGST")
			{
			    $(".igstfield").hide();
			    $(".sgstfield").show();
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(8) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(8) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));			    
			    
			}
			$("#drcrnote_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
			$("#drcrnote_product_table_total tbody tr:last td:eq(1)").append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
			$("#drcrnote_product_table_total tbody tr:last td:first input").val(parseFloat(value.totalAmount).toFixed(2));
		
		    });   

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
		    $(".igstfield").css('border','');
		    $(".vatfield").show();

		}	
 if (resp.invoicedata.taxname=="IGST")
               {
	            $(".igstfield").show();
		    
		    $(".sgstfield").hide();
		}
		else if(resp.invoicedata.taxname=="SGST") 
             {
		    $(".sgstfield").show();
		    $(".igstfield").hide();
		
	    } 
             else {
		
		    $(".igstfield").hide();
		    $(".sgstfield").hide();
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
      $(this).closest('tr').remove(); //closest method gives the closest element productified
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
    //select1 change event start
    $("#drcrnote_invoice1").change(function(event){
	$.ajax({
		url: '/invoice?action=getinvdetails',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "invid": $("#drcrnote_invoice1 option:selected").val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		   
		}
	})
	    .done(function(resp) {
		console.log("success");
		if (resp["gkstatus"] == 0) {
		    console.log("this is from purchase",resp.invoicedata);
		    //Load invoice data
		    $("#drcrnote_custsupp_pur").text(resp.invoicedata.custSupDetails["custname"]);
		    $("#gstin1_pur").text(resp.invoicedata.custSupDetails["custgstin"]);
		    $("#tin_pur").text(resp.invoicedata.custSupDetails["custtin"]);
		    $("#drcrnote_custsuppaddr_pur").text(resp.invoicedata.custSupDetails["custaddr"]);
		    /*
		    if (resp.invoicedata.taxname=="VAT"){
			 $("#taxapplicabletext").text(resp.invoicedata.taxname);
		    }else if ((resp.invoicedata.taxname=="IGST") || (resp.invoicedata.taxname=="SGST")){
			 $("#taxapplicabletext").text("GST");
		   
		    }
		    */
		    if(resp.invoicedata.inoutflag == "15") {
			console.log(resp.invoicedata.sourcestate);
			$("#drcrnote_state_pur").text(resp.invoicedata.sourcestate);
			$("#statecodefordrcrnote_pur").text(resp.invoicedata.sourcestatecode);
			$("#drcrnote_custsuppstate_pur").text(resp.invoicedata.custSupDetails["custsupstate"]);
			$("#statecodeofcustsupp_pur").text(resp.invoicedata.custSupDetails["custsupstatecode"]);
			$("#drcrnote_issuer_name_pur").text(resp.invoicedata.issuername);
			$("#drcrnote_issuer_designation_pur").text(resp.invoicedata.designation);

		    } else {
			$("#drcrnote_state_pur").text(resp.invoicedata.destinationstate);
			$("#statecodefordrcrnote_pur").text(resp.invoicedata.taxstatecode);
			$("#drcrnote_custsuppstate_pur").text(resp.invoicedata.sourcestate);
			$("#statecodeofcustsupp_pur").text(resp.invoicedata.sourcestatecode);
			
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
				console.log(resp.unamerole["username"]);
				$("#drcrnote_issuer_name_pur").text(resp.unamerole["username"]);
				$("#drcrnote_issuer_designation_pur").text(resp.unamerole["userroleName"]);
	
			    });
				
		    }
		    
		    // Change event for product price(i.e.Rate) in VAT
		    $(document).off('change', '.drcrnote_product_rate_vat').on('change', '.drcrnote_product_rate_vat', function(event) {
			event.preventDefault();
			/* Act on the event */
			if ($(this).val() == "") {
			    $(this).val(0);
			}
			var curindex = $(this).closest('#drcrnote_table_vat tbody tr').index();
			if (parseFloat($(this).val()) == 0) {
			    $("#price-blank-alert").alert();
			    $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#price-blank-alert").hide();
				$('.drcrnote_product_rate_vat:eq(' + curindex + ')').focus().select();
			    });
			    return false;
			}
			calculatevataxamt(curindex);
		    });

		    // Change event for product price(i.e.Rate) in GST
		    $(document).off('change', '.drcrnote_product_rate_gst').on('change', '.drcrnote_product_rate_gst', function(event) {
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
				$('.drcrnote_product_rate_gst:eq(' + curindex + ')').focus().select();
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
			console.log("key ans",value);
			$('#drcrnote_table_vat tbody tr:last td:first label').text(value.proddesc);
			$('#drcrnote_table_vat tbody tr:last td:first label').attr("data-productcode",key);
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) span').text(value.uom);
			$('#drcrnote_table_vat tbody tr:last td:eq(2) span').text(value.uom);
			$('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2)).attr("data", parseFloat(value.priceperunit).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.discount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.discount).toFixed(2)).attr("data", parseFloat(value.discount).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxableamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxableamount).toFixed(2)).attr("data", parseFloat(value.taxableamount).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			
			$('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.taxamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(8) input').val(parseFloat(value.totalAmount).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(8) input').val(parseFloat(value.totalAmount).toFixed(2)).attr("data", parseFloat(value.totalAmount).toFixed(2));
		    });
		    $("#drcrnote_table_vat tbody tr:first td:eq(9)").empty(); //please check eq
		    var productcode;
		    $('#drcrnote_product_table_gst tbody').empty();
		    $('#drcrnote_product_table_total tbody').empty();
		    $.each(resp.invoicedata.invcontents, function(key, value) {
			
			$('#drcrnote_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
			$('#drcrnote_product_table_gst tbody tr:last td:first label').text(value.proddesc);
			$('#drcrnote_product_table_gst tbody tr:last td:first label').attr("data-productcode",key);
			$('#drcrnote_product_table_gst tbody tr:last td:first label').attr("data-gsflag",value.gsflag);
			
			

			$('#drcrnote_product_table_gst tbody tr:last td:eq(1) label').html(value.gscode);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) span').text(value.uom);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) span').text(value.uom);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) input').val(parseFloat(value.priceperunit).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) input').val(parseFloat(value.priceperunit).toFixed(2)).attr("data", parseFloat(value.priceperunit).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(value.discount).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(value.discount).toFixed(2)).attr("data", parseFloat(value.discount).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxableamount).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxableamount).toFixed(2)).attr("data", parseFloat(value.taxableamount).toFixed(2));
			
			$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cessrate).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cessrate).toFixed(2)).attr("data", parseFloat(value.cessrate).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(14) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(value.cess).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(14) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(value.cess).toFixed(2));

			    
			if(resp.invoicedata.taxname=="IGST")
			{
			    $(".sgstfield").hide();
			    $(".igstfield").show();
			    console.log(value.taxrate);
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			}
			else if(resp.invoicedata.taxname=="SGST")
			{
			    $(".igstfield").hide();
			    $(".sgstfield").show();
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(8) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(8) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));			    
			    
			}
			$("#drcrnote_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
			$("#drcrnote_product_table_total tbody tr:last td:eq(1)").append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
			$("#drcrnote_product_table_total tbody tr:last td:first input").val(parseFloat(value.totalAmount).toFixed(2));
		
		    });   

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
		    $(".igstfield").css('border','');
		    $(".vatfield").show();

		}	
 if (resp.invoicedata.taxname=="IGST")
               {
	            $(".igstfield").show();
		    
		    $(".sgstfield").hide();
		}
		else if(resp.invoicedata.taxname=="SGST") 
             {
		    $(".sgstfield").show();
		    $(".igstfield").hide();
		
	    } 
             else {
		
		    $(".igstfield").hide();
		    $(".sgstfield").hide();
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
      $(this).closest('tr').remove(); //closest method gives the closest element productified
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


    //footer buttons event

    //click event of save button
var allow = 1;

  $("#drcrnote_save").click(function(event) {
      event.preventDefault();
      event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#drcrnote_invoice').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#challanno-blank-alert").hide();
      });
      $('#drcrnote_invoice').focus();
      return false;
    } 

//note no validation
 if ($.trim($('#drcrnote_no').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#challanno-blank-alert").hide();
      });
      $('#drcrnote_no').focus();
      return false;
    }
//date validation
      if ($.trim($('#drcrnote_date').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#drcrnote_date').focus();
      return false;
    }
//month
      if ($.trim($('#drcrnote_month').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#drcrnote_month').focus();
      return false;
    }
//year
      if ($.trim($('#drcrnote_year').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-blank-alert").hide();
      });
      $('#drcrnote_year').focus();
      return false;
    }
//parsing of date

      if (!Date.parseExact($("#drcrnote_date").val() + $("#drcrnote_month").val() + $("#drcrnote_year").val(), "ddMMyyyy")) {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#date-alert").hide();
      });
      $('#drcrnote_date').focus().select();
      return false;
    }
	//taken current date in curdate variable
      var curdate = Date.parseExact($("#drcrnote_year").val() + $("#drcrnote_month").val() + $("#drcrnote_date").val(), "yyyyMMdd");
    

if (!curdate.between(financialstart, financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
      });
      $('#drcrnote_date').focus().select();
      return false;
    }
//to check date from invoice date

    if ($("#drcrnote_invoice option:selected").val() != "") {

	if (Date.parseExact($("#drcrnote_invoice option:selected").attr("invoicedate"), "dd-MM-yyyy").compareTo(curdate) == 1) {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
        $("#invdc-date-alert").alert();
        $("#invdc-date-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#invdc-date-alert").hide();
        });
        $('#drcrnote_date').focus().select();
        return false;
      }
    }

//reference field validation

      if($("#drcrnote_no_ref").val()!=""){
	  console.log("Hello Motto faltu");
	if($("#drcrnote_date_ref").val()==""){
		 $("#between-date-alert").alert();
      	$("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
      });
	    $('#drcrnote_date_ref').focus();
	    return false;
}
}


      if($("#drcrnote_date_ref").val()!=""){
	  console.log("Hello Motto");
	if($("#drcrnote_no_ref").val()==""){
		 $("#between-date-alert").alert();
      	$("#between-date-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#between-date-alert").hide();
      });
      $('#drcrnote_no_ref').focus();
      return false;
}
}

//GST and VAT table 

      var reference  = {};
      var contents = {};
      var idrate={};   //idrate dict takes key as productcode and value as inc or dec rate 
      var totalreduct = 0.00;
      var productcodes = [];
      var productqtys = [];
      var ppu;
 

    if ($("#taxapplicabletext").text() == "VAT") {

    for (let i = 0; i < $("#drcrnote_table_vat tbody tr").length; i++) {
	productqtys.push(parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
    
	calculatevataxamt(i);
      productcodes.push($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(0) label").attr("data-productcode"));
	
      var productcode = $("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(0) label").attr("data-productcode");

      let quantity =parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
	

	//at time of rejection of product/service	 
	 if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").focus().select();
	      return false;
	  }

	//at time of reduction in price
	if (parseFloat($('.drcrnote_product_per_price_vat:eq(' + i + ')').val()) == 0.00 && parseFloat($('.drcrnote_product_quantity_vat:eq(' + i + ')').val()) > 0) {
	 $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.drcrnote_product_per_price_vat:eq(' + i + ')').focus().select();
          });
	  return false;   
	}

     
	if (parseFloat(quantity) > 0) {
	    let obj = {};
	    
            ppu = $.trim($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val());
            obj[ppu] = $.trim($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
            contents[productcode] = obj;
	    idrate[productcode]=$.trim($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val());
          }
    }
	totreduct= $.trim($('#drcrnote_table_vat tfoot tr:last td:eq(5) input').val());

    }

      else if ($("#taxapplicabletext").text() == "GST") {

	  for (let i = 0; i < $("#drcrnote_product_table_gst tbody tr").length; i++) {
		let quantity = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val());
	/*//at time of rejection of product/service	 
	 if (parseFloat(quantity) === 0.00) {
	      $("#quantity-blank-alert").alert();
	      $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#quantity-blank-alert").hide();
	      });
	      $("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").focus().select();
	      return false;
	  }

	//at time of reduction in price
	if (parseFloat($('.drcrnote_product_per_price_vat:eq(' + i + ')').val()) == 0.00 && parseFloat($('.drcrnote_product_quantity_vat:eq(' + i + ')').val()) > 0) {
	 $("#price-blank-alert").alert();
          $("#price-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#price-blank-alert").hide();
	      $('.drcrnote_product_per_price_vat:eq(' + i + ')').focus().select();
          });
	  return false;   
	}
        */

	      calculategstaxamt(i);
	      productqtys.push(parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()));
	      let obj = {};
	      productcode = $("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(0) label").attr("data-productcode");
	      ppu = $("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val();
	      obj[ppu] = $("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
	      contents[productcode] = obj;
	      idrate[productcode]=$.trim($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val());
	      
	  }
	  totreduct = $.trim($('#total_product_gst').html());
      }


//send data



      var dctypeflag = $("#status").val();
      //var caseflag =$("#case0").val();
      //var caseflag =$("#case1").val();
      //var caseflag =$("#case2").val();
      //var caseflag =$("#case3").val();

      //store reference
         reference["dcref"]=$("#drcrnote_no_ref").val();
	 reference["dcdate"]=$.trim($("#drcrnote_year_ref").val() + '-' + $("#drcrnote_month_ref").val() + '-' + $("#drcrnote_date_ref").val());

//send data invid,drcrno,date,ref,caseflag,dctypeflag,totreduct,contents,userid
      var form_data = new FormData();
      if($("#sale").is(":checked"))  {
      form_data.append("invid", $("#drcrnote_invoice option:selected").val());
      }else{
	   form_data.append("invid", $("#drcrnote_invoice1 option:selected").val());
      }
	  
      form_data.append("drcrno", $("#drcrnote_no").val());
      form_data.append("drcrdate", $.trim($("#drcrnote_year").val() + '-' + $("#drcrnote_month").val() + '-' + $("#drcrnote_date").val()));
      form_data.append("contents", JSON.stringify(contents));
      form_data.append("reference", JSON.stringify(reference));
      form_data.append("dctypeflag",dctypeflag);  
      //sending hardcode values until caseflag not set
      form_data.append("caseflag","0");
      form_data.append("totreduct",totreduct);
      form_data.append("reductionval",JSON.stringify(idrate));
      
//attachment
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
    $('#confirm_yes').modal('show').one('click', '#dc_save_yes', function(e) {
	if (allow == 1){
	    $.ajax({
                url: '/drcrnote?action=save',
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
			/* allow = 0;
			$('input:not(#status, #taxapplicable), select:not(#invselect)').val("");
                        $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
                        $("#success-alert").alert();
                        $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
			    let invid = resp.gkresult;
			    $.ajax({
				type: "POST",
				url: "/drcrnote?action=showdrcrnote",
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
				    $("#backbutton").attr("inoutflag", inoutflag);
				    $("#editbutton").attr("invid",invid);
				    if (inoutflag == '9') {
					$("#printbutton").hide();
				    }
				    else {
					$("#printbutton").show();
					$("#printbutton").attr("invid",invid);
				    }
				    $("#listdiv").hide();
				    $("#viewinvdiv").show();
				    $('#invoice_div').html("");
				});
                        });
                        return false;  */
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




