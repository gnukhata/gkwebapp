//This script for adddrcrnote.jinja2
$(document).ready(function() {
	$("#drcrnote_invoice_purchase").hide();
    $("#discount").focus();
    $(".purchasediv").hide();
    $('.drcrnotedate').autotab('number');  //Focus shifts from fields among date fields.
    //Preventing characters in numeric fields.
    $("#drcrnote_date").numeric({ negative: false });
    $("#drcrnote_month").numeric({ negative: false });
    $("#drcrnote_year").numeric({ negative: false });
    $("#drcrnote_date_ref").numeric({ negative: false });
    $("#drcrnote_month_ref").numeric({ negative: false });
    $("#drcrnote_year_ref").numeric({ negative: false });
	var usrid = "" ;
	let lastdrcr = $("#drcrnote_no").val();

	if (sessionStorage.vatorgstflag== '22'){
		$("#smalllink").hide();	
		$("#smalllinkvat").show();
	}
	else{
		$("#smalllink").show();	
		$("#smalllinkvat").hide();
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
    
	let roundoffflag = 0;

	$('#roundoff_checkbox').tooltip({
		title : "Round Off Total Amount?",
		placement : "top"
	});

    if($("#sale").is(":checked"))  {
	$("#drcrnote_invoice").searchify();
	$("#drcrnote_invoice").removeClass("col-sm-8");
	$("#drcrnote_invoice").parent().addClass("col-sm-8 nopadding");
	$("#drcrnote_invoice").next().addClass("invoiceselect");
    }
    else{
	$("#drcrnote_invoice_purchase").searchify();
	$("#drcrnote_invoice_purchase").removeClass("col-sm-8");
	$("#drcrnote_invoice_purchase").parent().addClass("col-sm-8 nopadding");
	$("#drcrnote_invoice_purchase").next().addClass("invoiceselect");
    }
    $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
	event.preventDefault();
	/* Act on the event */
	$(".numtype").numeric({ negative: false });
    });
    
    //Show selectbox of invoice type on the basis of which radio button is checked.
    $("input[name='invoice']").click(function () {
	//Checking which radio button is selected.
	if($("#sale").is(":checked"))  {
	    $(".salediv").show();
	    $(".purchasediv").hide();
	    $("#drcrnote_invoice").show();
	    $("#drcrnote_invoice").val("");
	    $("#drcrnote_invoice").change();
	    $("#drcrnote_invoice_purchase").hide();
	    $("#drcrnote_invoice_purchase").val("");
	    $("#drcrnote_invoice").searchify();
	    $("#drcrnote_invoice").removeClass("col-sm-8");
	    $("#drcrnote_invoice").parent().addClass("col-sm-8 nopadding");
		$("#drcrnote_invoice").next().addClass("invoiceselect");
		$("#drcrnote_no").val(lastdrcr);
       }
	else{
	    $("#drcrnote_invoice_purchase").show();
	    $("#drcrnote_invoice_purchase").val("");
	    $("#drcrnote_invoice_purchase").change();
	    $("#drcrnote_invoice").hide();
	    $(".salediv").hide();
	    $(".purchasediv").show();
	    $("#drcrnote_invoice").val("");
	    $("#drcrnote_invoice_purchase").searchify();
	    $("#drcrnote_invoice_purchase").removeClass("col-sm-8");
	    $("#drcrnote_invoice_purchase").parent().addClass("col-sm-8 nopadding");
		$("#drcrnote_invoice_purchase").next().addClass("invoiceselect");
		$("#drcrnote_no").val(lastdrcr);
	}
    });
    //keydown events for drcrnote
    //On the basis of radio buttons selection focus shift to selection of invoice type.
    $("#discount, #return").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $('#sale').focus();
		return false;
	    } 
    });
    $("#discount, #return").change(function(event) {
	if($("#drcrnote_invoice").is(":not(:hidden)")){
	    $("#drcrnote_invoice") .change();
	}
	else {
	    $("#drcrnote_invoice_purchase").change();
	}
	$("#drcrnote_no").val(lastdrcr);
    });
    $("#sale").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $('#drcrnote_invoice').focus();
		return false;
	}
	if (event.which == 38) {
	    $("#discount").focus();
	}
    });
     $("#purchase").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $('#drcrnote_invoice_purchase').focus();
		return false;
	}
	if (event.which == 38) {
	    $("#discount").focus();
	}
    });
    //Key Event for sale invoice select .
    $("#drcrnote_invoice").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#msspinmodal").modal("show");
	    setTimeout( function() {
		if ($('#drcrnote_invoice').filter(function() {return $(this).css('display') == 'none';}).val() == "") {
		    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
		    $("#invoice-blank-alert").alert();
		    $("#invoice-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#invoice-blank-alert").hide();
			$("#msspinmodal").modal("hide");
		    });
		    $('#drcrnote_invoice').focus();
		    return false;
		} else {
		    $("#drcrnote_no").focus();
		    $("#msspinmodal").modal("hide");
		}
	    }, 25 );
	}
    });
    //Key Event for purchase invoice select.
    $("#drcrnote_invoice_purchase").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    $("#msspinmodal").modal("show");
	    setTimeout( function() {
		if ($('#drcrnote_invoice_purchase').filter(function() {return $(this).css('display') == 'none';}).val() == "") {
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
		$("#invoice-blank-alert").alert();
		$("#invoice-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#invoice-blank-alert").hide();
		    $("#msspinmodal").modal("hide");
		});
		    $("#msspinmodal").modal("hide");
		$('#drcrnote_invoice_purchase').focus();
		return false;
		} else {
		    $("#drcrnote_no").focus();
		    $("#msspinmodal").modal("hide");
	    }
	    }, 25 );
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
	if (str && str!="") {
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
    $("#drcrnote_date").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_month").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_year").blur(function(event) {
	$(this).val(yearpad($(this).val(), 4));
	var drcrdatestring = $("#drcrnote_date").val() + $("#drcrnote_month").val() + $("#drcrnote_year").val();
	var drcrdate = Date.parseExact(drcrdatestring, "ddMMyyyy");
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
		if (Date.parseExact($("#drcrnote_invoice option:selected").attr("invoicedate"), "dd-MM-yyyy").compareTo(drcrdate) == 1) {
		    $("#prior-date-alert").alert();
		    $("#prior-date-alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#prior-date-alert").hide();
		    });
		    $('#drcrnote_date').focus().select();
		    return false;
		}
	    }
	    if ($("#drcrnote_invoice_purchase option:selected").val() != "") {
		if (Date.parseExact($("#drcrnote_invoice_purchase option:selected").attr("invoicedate"), "dd-MM-yyyy").compareTo(drcrdate) == 1) {
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
	   if ($('#drcrnote_date').val()!="") {
	    $("#drcrnote_month").focus().select();  //Focus shifts to Month field
     }
       else
        {
	 $("#date-blank-alert").alert();
	 $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $("#date-blank-alert").hide();
	 });
	    $("#drcrnote_date").focus().select();
	}
       }
	else if (event.which == 38) {
	    	$("#drcrnote_no").focus();  //Focus shifts to Customer.
	    }

    });
    //Key Event for ref Month field.
    $("#drcrnote_month").keydown(function(event) {
       if (event.which == 13) {
	   if ($('#drcrnote_month').val()!="") {
	    event.preventDefault();
	    $("#drcrnote_year").focus().select();  //Focus shifts to Month field
     }
       else
        {
	 $("#month-blank-alert").alert();
	 $("#month-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $("#month-blank-alert").hide();
	 });
	    $("#drcrnote_month").focus().select();
	}
       }
    });
    //key event for ref year
    $("#drcrnote_year").keydown(function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($('#drcrnote_year').val()!="") {
	    if ($('#drcrnote_date').val()=="" || $('#drcrnote_month').val()=="" || $('#drcrnote_year').val()==""||$('#drcrnote_date').val()==0 || $('#drcrnote_month').val()==0 || $('#drcrnote_year').val()==0) {
		$("#proper-date-alert").alert();
		$("#proper-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#proper-date-alert").hide();
		});
		$('#drcrnote_date').focus().select();
		return false;
    }	   $('#reference').focus();
       }
       else if($("#drcrnote_year").val()=="")
        {
	 $("#proper-date-alert").alert();
	 $("#proper-date-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $("#proper-date-alert").hide();
	 });
	    $('#drcrnote_date').focus();
	    return false;
	    
	}
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
	if (event.which == 13) {
	    event.preventDefault();
	    if($("#reference").prop('checked') == true) {
		$("#drcrnote_no_ref").focus();
	    }
	    else{
		if ($(".drcrnote_product_quantity_gst:first").is(":not(:hidden)")) {
		    if ($(".drcrnote_product_quantity_gst:first").is(":disabled")) {
			$(".drcrnote_product_rate_gst:first").focus().select();
		    }
		 else {
			$(".drcrnote_product_quantity_gst:first").focus().select();
		    }
		}
		else{
		    if ($(".drcrnote_product_quantity_vat:first").is(":disabled")) {
			$(".drcrnote_product_rate_vat:first").focus().select();
		    }
		    else {
			$(".drcrnote_product_quantity_vat:first").focus().select();
		    }
		}
	    }
	}
	      if (event.which == 38) {
		  event.preventDefault();
		  $("#drcrnote_month").focus().select();  
	      }
     });
    //keydown for reference number.
    $("#drcrnote_no_ref").keydown(function(event) {
	if (event.which == 13) {
	     event.preventDefault();
		if($("#drcrnote_no_ref").val()==""){
		    $("#drcrnoref-blank-alert").alert();
		    $("#drcrnoref-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#drcrnoref-blank-alert").hide();
		});
		    $('#drcrnote_no_ref').focus();
	}
	 else{
		$('#drcrnote_date_ref').focus();
	 }
	   
	}
	if (event.which == 38) {
	    $("#reference").focus();  
	}

    });
    //keydown for reference date
    
   $("#drcrnote_date_ref").keydown(function(event) {
       if (event.which == 13 && $('#drcrnote_date_ref').val()!="") {
	    event.preventDefault();
	    $("#drcrnote_month_ref").focus().select();  //Focus shifts to Month field
     }
       else if(event.which == 13 && $("#drcrnote_date_ref").val()=="")
        {
	 $("#date-blank-alert").alert();
	 $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $("#date-blank-alert").hide();
	 });
	}
       if (event.which == 38) {
	   $("#drcrnote_no_ref").focus();  
       }
    });
    //Key Event for ref Month field.
    $("#drcrnote_month_ref").keydown(function(event) {
       if (event.which == 13 && $('#drcrnote_month_ref').val()!="") {
	    event.preventDefault();
	    $("#drcrnote_year_ref").focus().select();  //Focus shifts to Month field
     }
       else if(event.which == 13 && $("#drcrnote_month_ref").val()=="")
        {
	 $("#month-blank-alert").alert();
	 $("#month-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $("#month-blank-alert").hide();
	 });
	}
    });
    //key event for ref year
    $("#drcrnote_year_ref").keydown(function(event) {
	if (event.which == 13 && $('#drcrnote_year_ref').val()!="") {
	    if ($('#drcrnote_date_ref').val()=="" || $('#drcrnote_month_ref').val()=="" || $('#drcrnote_year_ref').val()==""||$('#drcrnote_date_ref').val()==0 || $('#drcrnote_month_ref').val()==0 || $('#drcrnote_year_ref').val()==0) {
		$("#proper-date-alert").alert();
		$("#proper-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#proper-date-alert").hide();
		});
		$('#drcrnote_date_ref').focus().select();
		return false;
	    }
	     if ($(".drcrnote_product_quantity_gst:first").is(":not(:hidden)")) {
		    if ($(".drcrnote_product_quantity_gst:first").is(":disabled")) {
			$(".drcrnote_product_rate_gst:first").focus().select();
		    }
		 else {
			$(".drcrnote_product_quantity_gst:first").focus().select();
		    }
		}
		else{
		    if ($(".drcrnote_product_quantity_vat:first").is(":disabled")) {
			$(".drcrnote_product_rate_vat:first").focus().select();
		    }
		    else {
			$(".drcrnote_product_quantity_vat:first").focus().select();
		    }
		}
	    
	    event.preventDefault();
       }
       else if(event.which == 13 && $("#drcrnote_year_ref").val()=="")
        {
	 $("#proper-date-alert").alert();
	 $("#proper-date-alert").fadeTo(2250, 500).slideUp(500, function() {
	  $("#proper-date-alert").hide();
	 });
	    $('#drcrnote_date_ref').focus();
	    return false;
	}
    });

    //Padding functions are called on blur events for reference date 
    $("#drcrnote_date_ref").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_month_ref").blur(function(event) {
	$(this).val(pad($(this).val(), 2));
    });
    $("#drcrnote_year_ref").blur(function(event) {
	$(this).val(yearpad($(this).val(), 4));
	var drcrdatestring = $("#drcrnote_date_ref").val() + $("#drcrnote_month_ref").val() + $("#drcrnote_year_ref").val();
	var drcrdate = Date.parseExact(drcrdatestring, "ddMMyyyy");
	
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

    var taxflag = "";
    var taxname = "";
    var inoutflag = 15;
    var destinationstate = "";
    var totaltaxable = 0.00;
    var productdata = {};
    var prodData = {};
    var taxes = {};
    var cess = {};
    
    //Function to calculate Tax Amount and Total of Discount, Taxable Amount, Tax Amounts and Total Amount.Reduction
    function calculatevataxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(1) input').val()).toFixed(2);
	var rowprice = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowreductrate = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
	var rowtaxrate = parseFloat($('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
	var taxamount = 0.00;
	var rowtaxableamount=rowqty * rowprice; //Taxable amount for each row is calculated.
	var reductprice=0.00;
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totaltax = 0.00;
	totaltaxable = 0.00;

	if ($("#discount").is(":checked")) {
	    reductprice=rowqty*rowreductrate;
	}
	else {
	    reductprice=rowreductrate;
	}

	$('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(4) input').val(parseFloat(reductprice).toFixed(2)); //Taxable amount is displayed.
	taxamount = (reductprice * rowtaxrate)/100;  //Amount of tax to be applied is found out.
	
	$('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(taxamount).toFixed(2));
	rowtotal = parseFloat(reductprice) + parseFloat(taxamount);
	$('#drcrnote_table_vat tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(rowtotal).toFixed(2));
	
	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#drcrnote_table_vat tbody tr").length; i++) {
	    totaltaxable = totaltaxable + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(4) input').val());
	    totaltax = totaltax + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(6) input').val());
	    totalamount = totalamount + parseFloat($('#drcrnote_table_vat tbody tr:eq(' + i + ') td:eq(7) input').val());
	}
	//Total of various columns are displayed on the footer.
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totaldrcrnotevalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));	
    }

    //Function to calculate gst tax amount Reduction.
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowprice = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').val()).toFixed(2);
       	var gsflag=$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) label').attr("data-gsflag");
	var rowreductrate = parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowtaxableamount=0.00;
	var reductprice=0.00;
	if (gsflag=="19") {
	    reductprice=rowreductrate;
	}
	else{
	    if ($("#discount").is(":checked")) {
		reductprice=rowqty*rowreductrate;
	    }
	    else {
		reductprice=rowreductrate;
	    }
	}
	
	//Initialising variables for calculating total of Discount, Taxable Amount, Tax Amounts, and Total Amounts.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	var totalcgst = 0.00;
	var totalsgst = 0.00;
	var totaligst = 0.00;
	var totalcess = 0.00;
	totaltaxable = 0.00;
 
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val(parseFloat(reductprice).toFixed(2)); //Taxable amount is displayed.

	let sgstrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val();
	let sgstamount = (reductprice * sgstrate)/100;  //Amount of SGST to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(sgstamount).toFixed(2));
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(sgstamount).toFixed(2));

	let igstrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(10) input').val();
	let igstamount = (reductprice * igstrate)/100;  //Amount of IGST to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(igstamount).toFixed(2));

	let cessrate = $('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(12) input').val();
        let cessamount = (reductprice * cessrate)/100;  //Amount of Cess to be applied is found out.
	$('#drcrnote_product_table_gst tbody tr:eq(' + curindex + ') td:eq(13) input').val(parseFloat(cessamount).toFixed(2));

	rowtotal = parseFloat(reductprice) + (2*parseFloat(sgstamount)) + parseFloat(igstamount) + parseFloat(cessamount); //Sum of Taxable Amount and Tax Amount is found out.
        $('#drcrnote_product_table_total tbody tr:eq(' + curindex + ') td:eq(0) input').val(parseFloat(rowtotal).toFixed(2));

	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#drcrnote_product_table_gst tbody tr").length; i++) {
	    totaltaxable = totaltaxable + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totalcgst = totalcgst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(7) input').val());
	    totalsgst = totalsgst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(9) input').val());
	    totaligst = totaligst + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(11) input').val());
	    totalcess = totalcess + parseFloat($('#drcrnote_product_table_gst tbody tr:eq(' + i + ') td:eq(13) input').val());
	    totalamount = totalamount + parseFloat($('#drcrnote_product_table_total tbody tr:eq(' + i + ') td:eq(0) input').val());
	}

	//Total of various columns are displayed on the footer.
	$('#taxablevaluetotal_product_gst').text(parseFloat(totaltaxable).toFixed(2));
	$('#totalcgst_product_gst').text(parseFloat(totalcgst).toFixed(2));
	$('#totalsgst_product_gst').text(parseFloat(totalsgst).toFixed(2));
	$('#totaligst_product_gst').text(parseFloat(totaligst).toFixed(2));
	$('#totalcess_product_gst').text(parseFloat(totalcess).toFixed(2));
	$('#total_product_gst').text(parseFloat(totalamount).toFixed(2));
	$("#totaldrcrnotevalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalsgtax").text(parseFloat(totalsgst).toFixed(2));
	$("#totalcgtax").text(parseFloat(totalcgst).toFixed(2));
	$("#totaligtax").text(parseFloat(totaligst).toFixed(2));
	$("#totalinvcess").text(parseFloat(totalcess).toFixed(2));
    }
	$("#roundoff_checkbox").change(function(e){
		if ($("#roundoff_checkbox").is(":checked")){
			$("#roundoff_div").show();
			if($("#totaldrcrnotevalue").text() != "" || $("#totaldrcrnotevalue").text() != 0){
				$("#totaldrcrnotevalueroundedoff").text((Math.round(parseFloat($("#totaldrcrnotevalue").text()))).toFixed(2));
			}
			else{
				$("#totaldrcrnotevalueroundedoff").text("");
			}
			
			roundoffflag = 1;
		}
		else{
			$("#roundoff_div").hide();
			roundoffflag = 0;
		}
	});
    //1 start
    $("#drcrnote_invoice, #drcrnote_invoice_purchase").change(function(event){
	$("label.col-sm-8, #taxapplicabletext, .input-group-addon, .summarylabel").text("");
	$('input:not(#status, #taxapplicable), select:not(#drcrnote_invoice, #drcrnote_invoice_purchase, .invoiceselect)').val("");
	if($(this).val()!=""){
	$.ajax({ 
		url: '/invoice?action=getinvdetails',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: { "invid": $(this).val() },
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		   
		}
	})
	    .done(function(resp) {
		console.log("success");
		if (resp["gkstatus"] == 0) {
		    //Load invoice data
		    $("#drcrnote_custsupp").text(resp.invoicedata.custSupDetails["custname"]);
		    $("#gstin").text(resp.invoicedata.custSupDetails["custgstin"]);
		    $("#tin").text(resp.invoicedata.custSupDetails["custtin"]);
		    $("#drcrnote_custsuppaddr").text(resp.invoicedata.custSupDetails["custaddr"]);
		    taxflag = resp.invoicedata.taxflag;
		    taxname = resp.invoicedata.taxname;
		    inoutflag = resp.invoicedata.inoutflag;
		    if(resp.invoicedata.inoutflag == "15") {
			$("#drcrnote_state").text(resp.invoicedata.sourcestate);
			$("#statecodefordrcrnote").text(pad(resp.invoicedata.sourcestatecode, 2));
			$("#drcrnote_custsuppstate").text(resp.invoicedata.custSupDetails["custsupstate"]);
			destinationstate = resp.invoicedata.custSupDetails["custsupstate"];
			$("#statecodeofcustsupp").text(pad(resp.invoicedata.custSupDetails["custsupstatecode"], 2));
			$("#drcrnote_issuer_name").text(resp.invoicedata.issuername);
			$("#drcrnote_issuer_designation").text(resp.invoicedata.designation);
			$('#orggstin').text(resp.invoicedata.orgstategstin);
		    }
		    else {
			$("#drcrnote_custsupp_pur").text(resp.invoicedata.custSupDetails["custname"]);
		    $("#gstin1_pur").text(resp.invoicedata.custSupDetails["custgstin"]);
		    $("#tin_pur").text(resp.invoicedata.custSupDetails["custtin"]);
		    $("#drcrnote_custsuppaddr_pur").text(resp.invoicedata.custSupDetails["custaddr"]);
			$("#drcrnote_state_pur").text(resp.invoicedata.destinationstate);
			destinationstate = resp.invoicedata.destinationstate;
			$("#statecodefordrcrnote_pur").text(pad(resp.invoicedata.taxstatecode, 2));
		    $("#drcrnote_custsuppstate_pur").text(resp.invoicedata.sourcestate);
			$("#statecodeofcustsupp_pur").text(pad(resp.invoicedata.sourcestatecode, 2));
		    $('#orggstin').text(resp.invoicedata.orgstategstin);
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
			    $("#drcrnote_issuer_name_pur").text(resp.unamerole["username"]);
			  $("#drcrnote_issuer_designation_pur").text(resp.unamerole["userroleName"]);
			   usrid = resp.unamerole["userid"];
			});
		    }
		    
		    var productcode;
		    if (resp.invoicedata.taxflag=="7"){
			$('#drcrnote_product_table_gst tbody').empty();
			$('#drcrnote_product_table_total tbody').empty();
			$.each(resp.invoicedata.invcontents, function(key, value) {
			    if ($("#discount").is(":checked") || ($("#return").is(":checked") && value.gsflag == 7)) {
					
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
				$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(0).toFixed(2));
				$('#drcrnote_product_table_gst tbody tr:last td:eq(5) input').val(parseFloat(0).toFixed(2)).attr("data", parseFloat(value.taxableamount).toFixed(2));
			    
				$('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.cessrate).toFixed(2));
				$('#drcrnote_product_table_gst tbody tr:last td:eq(12) input').val(parseFloat(value.cessrate).toFixed(2)).attr("data", parseFloat(value.cessrate).toFixed(2));
				$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(0).toFixed(2));
				$('#drcrnote_product_table_gst tbody tr:last td:eq(13) input').val(parseFloat(value.cess).toFixed(2)).attr("data", parseFloat(0).toFixed(2));
			    
				if(resp.invoicedata.taxname=="IGST")
				{
				    $(".sgstfield").hide().removeClass("hborderdiv");
				    $(".igstfield").show().addClass("hborderdiv");
				    $(".form-inline").removeClass("hborderdiv");
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxrate).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(10) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(0).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(11) input').val(parseFloat(0).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
				}
				else if(resp.invoicedata.taxname=="SGST")
				{
				    $(".igstfield").hide().removeClass("hborderdiv");
				    $(".sgstfield").show().addClass("hborderdiv");
				    $(".form-inline").removeClass("hborderdiv");
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(6) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(0).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(7) input').val(parseFloat(0).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));
				    $('#drcrnote_product_table_gst body tr:last td:eq(8) input').val(parseFloat(value.taxrate).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(8) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(0).toFixed(2));
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(9) input').val(parseFloat(0).toFixed(2)).attr("data", parseFloat(value.taxamount).toFixed(2));			    
			    
				}
				$("#drcrnote_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
				$("#drcrnote_product_table_total tbody tr:last td:eq(1)").append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
				$("#drcrnote_product_table_total tbody tr:last td:first input").val(parseFloat(0).toFixed(2));
				if($("#return").is(":checked")){
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(4) input').prop("disabled", true);
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').prop("disabled", false);
				    $(".creditedvalue").hide();
				    $(".totalwrap").css("width", "42%");
			    
				}
				else {
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(4) input').prop("disabled", false);
				    $('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').prop("disabled", true);
				    $(".creditedvalue").show();
				    $(".totalwrap").css("width", "49%");
				}
			    }
		    });
		    $("#taxablevaluetotal_product_gst").text(0.00);
		    $("#totalcgst_product_gst").text(0.00);
		    $("#totalsgst_product_gst").text(0.00);
		    $("#totalcess_product_gst").text(0.00);
		    $("#total_product_gst").text(0.00);
		    $("#totaligst_product_gst").text(0.00);
	    	    $("#taxapplicabletext").text("GST");
	            $("#drcrnote_table_vat").hide();  //Hides VAT Product table and fields for TIN.
			$("#vathelp").hide();
			$("#smalllink").show();	
			$("#smalllinkvat").hide();
		    $(".tinfield").hide();
		    $("#gstproducttable").show();  //Shows GST Product table.
		    $(".gstinfield").show();
		    $(".vatfield").hide();
			$(".gstfield").show();
		}
		    else {
			//invoicedata contents filled in table
			$('#drcrnote_table_vat tbody').empty();
			$.each(resp.invoicedata.invcontents, function(key, value) {
			    $('#drcrnote_table_vat tbody').append('<tr>' + vathtml + '</tr>');
			    $('#drcrnote_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
			    $('#drcrnote_table_vat tbody tr:last td:first label').text(value.proddesc);
			    $('#drcrnote_table_vat tbody tr:last td:first label').attr("data-productcode",key);
			    $('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(1) span').text(value.uom);
			    $('#drcrnote_table_vat tbody tr:last td:eq(2) span').text(value.uom);
			    $('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(2) input').val(parseFloat(value.priceperunit).toFixed(2)).attr("data", parseFloat(value.priceperunit).toFixed(2));
			    
			    $('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.taxableamount).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(4) input').val(parseFloat(value.taxableamount).toFixed(2)).attr("data", parseFloat(0).toFixed(2));
			    
			    $('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxrate).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(5) input').val(parseFloat(value.taxrate).toFixed(2)).attr("data", parseFloat(value.taxrate).toFixed(2));
			    
			    $('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxamount).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(6) input').val(parseFloat(value.taxamount).toFixed(2)).attr("data", parseFloat(0).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.totalAmount).toFixed(2));
			    $('#drcrnote_table_vat tbody tr:last td:eq(7) input').val(parseFloat(value.totalAmount).toFixed(2)).attr("data", parseFloat(0).toFixed(2));
			});
			$("#drcrnote_table_vat tbody tr:first td:eq(8)").empty();
			$("#taxablevaluetotal_product_vat").val(0);
			$("#totaltax").val(resp.invoicedata.totaltaxamt);
			$("#total_product_vat").val(resp.invoicedata.invoicetotal); 
			$("#taxapplicabletext").text("VAT");
			$("#gstproducttable").hide();
			$(".gstinfield").hide();
			$("#drcrnote_table_vat").show();
			$(".tinfield").show();
			$("#vathelp").show();
			$("#smalllink").hide();	
			$("#smalllinkvat").show();
			$(".gstfield").hide();
			$(".igstfield").css('border','');
			$(".vatfield").show();
			$("#drcrnote_table_vat").show();

			if($("#return").is(":checked")){
			    $('#drcrnote_table_vat tbody tr:last td:eq(3) input').prop("disabled", true);
			    $('.drcrnote_product_quantity_vat').prop("disabled", false);
			    $(".creditedvalue").hide();
			    $('#drcrnote_table_vat tfoot tr:first td:eq(0)').attr("colspan", 3);
			    $(".smvwrap").css("width", "15.75%");
			}
			else {
			    $('#drcrnote_table_vat tbody tr:last td:eq(3) input').prop("disabled", false);
			    $('#drcrnote_table_vat tbody tr:last td:eq(1) input').prop("disabled", true);
			    $(".creditedvalue").show();
			    $('#drcrnote_table_vat tfoot tr:first td:eq(0)').attr("colspan", 3);
			    $(".smvwrap").css("width", "11.75%");
			}
		    }
		}
		
	    });//done end
	}
    });

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
      calculatevataxamt(curindex);
    });
  }
      if ($("#drcrnote_table_vat tbody tr").length == 1) {
	  $("#drcrnote_table_vat tbody tr:eq(0) td:eq(8)").empty();
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


    $(document).off('keydown', '.drcrnote_product_rate_vat').on('keydown', '.drcrnote_product_rate_vat', function(event) {
	var curindex = $(this).closest('#drcrnote_table_vat tbody tr').index();
	var nextindex = curindex + 1;
	var previndex = curindex - 1;
	var lastindex = $('#drcrnote_table_vat tbody tr:last').index();
	if (event.which == 13 ) {
	    event.preventDefault();
	    calculatevataxamt(curindex);

	    if($('#drcrnote_table_vat tbody tr:eq('+ curindex +') td:eq(3) input').val()=="" || $('#drcrnote_table_vat tbody tr:eq('+ curindex +') td:eq(3) input').val() == 0){
		$("#crdrvalblank-alert").alert();
		$("#crdrvalblank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#crdrvalblank-alert").hide();
		});
		$('#drcrnote_table_vat tbody tr:eq('+ curindex +') td:eq(3) input').focus().select();
		return false;
	    }
	    
	    if (curindex == lastindex) {
		$("#drcrnote_save").focus();
	    }
	    else{
		$('.drcrnote_product_rate_vat:eq(' + nextindex + ')').focus().select();
	    }
	}else if (event.which == 190 && event.shiftKey) {
	    $('#drcrnote_table_vat tbody tr:eq('+ nextindex +') td:eq(3) input').select().focus();
	}else if(event.which == 188 && event.shiftKey){
	    $('#drcrnote_table_vat tbody tr:eq('+ previndex +') td:eq(3) input').select().focus();
	}else if (event.which == 27) {
	  $("#drcrnote_save").focus();
	}
    });
    $(document).off('keydown', '.drcrnote_product_rate_gst').on('keydown', '.drcrnote_product_rate_gst', function(event) {
	var curindex = $(this).closest('#drcrnote_product_table_gst tbody tr').index();
	var nextindex = curindex + 1;
	var previndex = curindex - 1;
	var lastindex = $('#drcrnote_product_table_gst tbody tr:last').index();
	if (event.which == 13 ) {
	    event.preventDefault();
	    calculategstaxamt(curindex);

	    if($('#drcrnote_product_table_gst tbody tr:eq('+ curindex +') td:eq(4) input').val()=="" || $('#drcrnote_product_table_gst tbody tr:eq('+ curindex +') td:eq(4) input').val() == 0){
		$("#crdrvalblank-alert").alert();
		$("#crdrvalblank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#crdrvalblank-alert").hide();
		});
		$('#drcrnote_product_table_gst tbody tr:eq('+ curindex +') td:eq(4) input').focus();
		return false;
	    }
	    
	    if (curindex == lastindex) {
		$("#drcrnote_save").focus();
	    }
	    else{
		$('.drcrnote_product_rate_gst:eq(' + nextindex + ')').focus().select();
	    }
	}else if (event.which == 190 && event.shiftKey) {
	    $('#drcrnote_product_table_gst tbody tr:eq('+ nextindex +') td:eq(4) input').select().focus();
	}else if(event.which == 188 && event.shiftKey){
	    $('#drcrnote_product_table_gst tbody tr:eq('+ previndex +') td:eq(4) input').select().focus();
	}else if (event.which == 27) {
	  $("#drcrnote_save").focus();
	} 
    });
    $(document).off('keydown', '.drcrnote_product_quantity_vat').on('keydown', '.drcrnote_product_quantity_vat', function(event) {
	var curindex = $(this).closest('#drcrnote_table_vat tbody tr').index();
	var nextindex = curindex + 1;
	var previndex = curindex - 1;
	var lastindex = $('#drcrnote_table_vat tbody tr:last').index();
	if (event.which == 13 ) {
	    event.preventDefault();
	    calculatevataxamt(curindex);

	    if($('#drcrnote_table_vat tbody tr:eq('+ curindex +') td:eq(1) input').val()=="" || $('#drcrnote_table_vat tbody tr:eq('+ curindex +') td:eq(1) input').val() == 0){
		$("#crdr_qty_blank_alert").alert();
		$("#crdr_qty_blank_alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#crdr_qty_blank_alert").hide();
		});
		$('#drcrnote_product_table_gst tbody tr:eq('+ curindex +') td:eq(1) input').focus();
		return false;
	    }
	    
	    if (curindex == lastindex) {
		$("#drcrnote_save").focus();
	    }
	    else{
		$('.drcrnote_product_quantity_vat:eq(' + nextindex + ')').focus().select();
	    }
	}
	else if (event.which == 190 && event.shiftKey) {
	    $('#drcrnote_table_vat tbody tr:eq('+ nextindex +') td:eq(1) input').select().focus();
	}else if(event.which == 188 && event.shiftKey){
	    $('#drcrnote_table_vat tbody tr:eq('+ previndex +') td:eq(1) input').select().focus();
	}else if (event.which == 27) {
	  $("#drcrnote_save").focus();
	}
    });
    $(document).off('keydown', '.drcrnote_product_quantity_gst').on('keydown', '.drcrnote_product_quantity_gst', function(event) {
	var curindex = $(this).closest('#drcrnote_product_table_gst tbody tr').index();
	var nextindex = curindex + 1;
	var previndex = curindex - 1;
	var lastindex = $('#drcrnote_product_table_gst tbody tr:last').index();
	if (event.which == 13 ) {
	    event.preventDefault();
	    if($('#drcrnote_product_table_gst tbody tr:eq('+ curindex +') td:eq(2) input').val()=="" || $('#drcrnote_product_table_gst tbody tr:eq('+ curindex +') td:eq(2) input').val() == 0){
		$("#crdr_qty_blank_alert").alert();
		$("#crdr_qty_blank_alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#crdr_qty_blank_alert").hide();
		});
		$('#drcrnote_product_table_gst tbody tr:eq('+ curindex +') td:eq(2) input').focus();
		return false;
	    }
	    
	    calculategstaxamt(curindex);
	    if (curindex == lastindex) {
		$("#drcrnote_save").focus();
	    }
	    else{
		$('.drcrnote_product_quantity_gst:eq(' + nextindex + ')').focus().select();
	    }
	}else if (event.which == 190 && event.shiftKey) {
	    $('#drcrnote_product_table_gst tbody tr:eq('+ nextindex +') td:eq(2) input').select().focus();
	}else if(event.which == 188 && event.shiftKey){
	    $('#drcrnote_product_table_gst tbody tr:eq('+ previndex +') td:eq(2) input').select().focus();
	}else if (event.which == 27) {
	  $("#drcrnote_save").focus();
	}
    });
    // Change event for product price(i.e.Rate) in VAT
    $(document).off('change', '.drcrnote_product_rate_vat').on('change', '.drcrnote_product_rate_vat', function(event) {
	// Act on the event
	if ($(this).val() == "") {
	    $(this).val(0);
	}
	$(this).val(parseFloat($(this).val()).toFixed(2));
	var curindex = $(this).closest('#drcrnote_table_vat tbody tr').index();
	calculatevataxamt(curindex);
    });

    //Change event for product price(i.e.Rate) in GST
    $(document).off('change', '.drcrnote_product_rate_gst').on('change', '.drcrnote_product_rate_gst', function(event) {
	/* Act on the event */
	var curindex = $(this).closest('#drcrnote_product_table_gst tbody tr').index();
	if ($(this).val() == "") {
	    $(this).val(0);
	}
	calculategstaxamt(curindex);
    });

    // Change event for product price(i.e.Rate) in VAT
    $(document).off('change', '.drcrnote_product_quantity_vat').on('change', '.drcrnote_product_quantity_vat', function(event) {
	// Act on the event
	if ($(this).val() == "") {
	    $(this).val(0);
	}
	var curindex = $(this).closest('#drcrnote_table_vat tbody tr').index();
	var creditval = parseFloat($('.drcrnote_product_quantity_vat:eq(' + curindex + ')').val()) * parseFloat($('.drcrnote_product_per_price_vat:eq(' + curindex + ')').val());
	$('.drcrnote_product_rate_vat:eq(' + curindex + ')').val(parseFloat(creditval).toFixed(2));
	calculatevataxamt(curindex);
    });

    // Change event for product price(i.e.Rate) in GST
    $(document).off('change', '.drcrnote_product_quantity_gst').on('change', '.drcrnote_product_quantity_gst', function(event) {
	/* Act on the event */
	if ($(this).val() == "") {
	    $(this).val(0);
	}
	var curindex = $(this).closest('#drcrnote_product_table_gst tbody tr').index();
	var creditval = parseFloat($('.drcrnote_product_quantity_gst:eq(' + curindex + ')').val()) * parseFloat($('.drcrnote_product_per_price_gst:eq(' + curindex + ')').val());
	$('.drcrnote_product_rate_gst:eq(' + curindex + ')').val(parseFloat(creditval).toFixed(2));
	calculategstaxamt(curindex);
    });

    //click event of delete product
    $(document).off("click", ".product_del").on("click", ".product_del", function(event) {
	event.preventDefault();
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex + 1;
  var previndex = curindex - 1;
  if ($("#drcrnote_table_vat tbody tr").length > 1) {
    $(this).closest('tr').fadeOut(200, function() {
      $(this).closest('tr').remove(); //closest method gives the closest element productified
	if($("#return").is(":checked")){
	    $("#drcrnote_table_vat tbody tr:first td:eq(1) input").focus();
	}else if($("#discount").is(":checked")){
	    $("#drcrnote_table_vat tbody tr:first td:eq(3) input").focus();
	}
	calculatevataxamt(curindex);
    });
  }
      if ($("#drcrnote_table_vat tbody tr").length == 1) {
	  $("#drcrnote_table_vat tbody tr:eq(0) td:eq(9)").empty();
      }
      if ($("#drcrnote_product_table_gst tbody tr").length > 1) {
	  $(this).closest('tr').remove();
	  $("#drcrnote_product_table_gst tbody tr:eq("+curindex+")").remove();
	  if($("#return").is(":checked")){
	      $("#drcrnote_product_table_gst tbody tr:first td:eq(2) input").focus();
	  }else if($("#discount").is(":checked")){
	      $("#drcrnote_product_table_gst tbody tr:first td:eq(4) input").focus();
	  }
	  calculategstaxamt(curindex);
      }
      if ($("#drcrnote_product_table_gst tbody tr").length == 1) {
	  $("#drcrnote_product_table_total tbody tr:eq(0) td:eq(1)").empty();
      }
  });

 //keydown event for insert key
     var modalpresent = 0;
  $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	  event.preventDefault();
	  if ($("#taxapplicabletext").text() == "VAT") {
	      if ($("#return").is(":checked")) {
			  
		  $(".drcrnote_product_quantity_vat").change();
	      }
	      else{
		  $(".drcrnote_product_rate_vat").change();
	      }
	  }
	  else{
	      if ($("#return").is(":checked")) {
		  $(".drcrnote_product_quantity_gst").change();
	      }
	      else{
		  $(".drcrnote_product_rate_gst").change();
	      }
	  }
	if (modalpresent == 0) {
	    $("#drcrnote_save").click();
	}
      return false;
    }
  });
    //click event of save button
var allow = 1;

  $("#drcrnote_save").click(function(event) {
      event.preventDefault();
      event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
      if($("#sale").is(":checked")){
	   if ($.trim($('#drcrnote_invoice').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	      $("#invoice-blank-alert").alert();
	      $("#invoice-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#invoice-blank-alert").hide();
	      });
	      $('#drcrnote_invoice').focus();
	       return false;
	   }
      }else{
	     if ($.trim($('#drcrnote_invoice_purchase').val()) == "") {
	$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
	      $("#invoice-blank-alert").alert();
	      $("#invoice-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#invoice-blank-alert").hide();
	      });
	      $('#drcrnote_invoice_purchase').focus();
	       return false;
	   }
	}

      //note no validation
      if ($.trim($('#drcrnote_no').val()) == "") {
	  $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
      $("#drcrno-blank-alert").alert();
      $("#drcrno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
        $("#drcrno-blank-alert").hide();
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
        $("#prior-date-alert").alert();
        $("#prior-date-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#prior-date-alert").hide();
        });
        $('#drcrnote_date').focus().select();
        return false;
      }
    }
      if ($("#drcrnote_invoice_purchase option:selected").val() != "") {

	if (Date.parseExact($("#drcrnote_invoice_purchase option:selected").attr("invoicedate"), "dd-MM-yyyy").compareTo(curdate) == 1) {
	    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'fast');
        $("#prior-date-alert").alert();
        $("#prior-date-alert").fadeTo(2250, 500).slideUp(500, function() {
          $("#prior-date-alert").hide();
        });
        $('#drcrnote_date').focus().select();
        return false;
      }
    }
//validation for reference fields
      if($("#reference").prop('checked') == true) {
	  if($("#drcrnote_no_ref").val()=="" && $("#drcrnote_date_ref").val()=="" ){
	      $("#drcrnoref-blank-alert").alert();
	      $("#drcrnoref-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#drcrnoref-blank-alert").hide();
	      });
	      $('#drcrnote_no_ref').focus();
	      return false;
	}
    }
    //reference field validation

      if($("#drcrnote_no_ref").val()!="" && $("#drcrnote_date_ref").val()==""){
	      $("#date-blank-alert").alert();
      	  $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#date-blank-alert").hide();
      });
	    $('#drcrnote_date_ref').focus();
	    return false;

}
      if($("#drcrnote_date_ref").val()!="" && $("#drcrnote_no_ref").val()==""){
	      $("#drcrno-blank-alert").alert();
      	      $("#drcrno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		  $("#drcrno-blank-alert").hide();
	      });
	      $('#drcrnote_no_ref').focus();
	      return false;
}

//GST and VAT table 

      var reference  = {};
      var idrate={};   //idrate dict takes key as productcode and value as inc or dec rate 
      var totalreduct = 0.00;
      var productcodes = [];
      var productqtys = [];
      var ppu;
      var voucherdetails = {};
      var quantities = {};
 

    if ($("#taxapplicabletext").text() == "VAT") {

	for (let i = 0; i < $("#drcrnote_table_vat tbody tr").length; i++) {
            if ($("#discount").is(":checked")) {
		  if($('#drcrnote_table_vat tbody tr:eq('+ i +') td:eq(3) input').val()=="" || $('#drcrnote_table_vat tbody tr:eq('+ i +') td:eq(3) input').val() == 0){
		      $("#crdrvalblank-alert").alert();
		      $("#crdrvalblank-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#crdrvalblank-alert").hide();
		      });
		      $('#drcrnote_table_vat tbody tr:eq('+ i +') td:eq(3) input').focus();
		      return false;
		  }
	    }else if($("#return").is(":checked")){
		if($('#drcrnote_table_vat tbody tr:eq('+ i +') td:eq(1) input').val()=="" || $('#drcrnote_table_vat tbody tr:eq('+ i +') td:eq(1) input').val() == 0){
		    $("#crdr_qty_blank_alert").alert();
		    $("#crdr_qty_blank_alert").fadeTo(2250, 500).slideUp(500, function() {
			$("#crdr_qty_blank_alert").hide();
		    });
		    $('#drcrnote_table_vat tbody tr:eq('+ i +') td:eq(1) input').focus();
		    return false;
		}
	    }

            if ((parseFloat($('.drcrnote_product_rate_vat:eq(' + i + ')').val()) > parseFloat($('.drcrnote_product_per_price_vat:eq(' + i + ')').val())) && $("#status").val()==3 && $("#discount").is(":checked")) {
		$('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
		$("#exceed-blank-alert").alert();
		$("#exceed-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		    $("#exceed-blank-alert").hide();
		    //$('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
		    $('.drcrnote_product_rate_vat:eq(' + i + ')').focus().select();
		});
		return false;   
	    }
	    productqtys.push(parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
    	    //inc and decr calculation of vat
	    calculatevataxamt(i);
	    productcodes.push($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(0) label").attr("data-productcode"));
	    var productcode = $("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(0) label").attr("data-productcode");
	    let productname = $("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(0) label").text();
	    let quantity =parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
	    if (parseFloat(quantity) > 0) {
		let obj = {};
		ppu = parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val()).toFixed(2);
		obj[ppu] = parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()).toFixed(2);
		idrate[productcode]=parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val()).toFixed(2);
		taxes[productcode] = parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(5) input").val()).toFixed(2);
		prodData[productcode] = parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val()).toFixed(2);
		productdata[productname] = parseFloat($("#drcrnote_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val()).toFixed(2);
		if ($("#return").is(":checked")) {
		    quantities[productcode] = parseFloat(quantity).toFixed(2);
		}
	    }
	}
	totreduct= $.trim($('#drcrnote_table_vat tfoot tr:last td:eq(4) input').val());
    }

      else if ($("#taxapplicabletext").text() == "GST") {

	  for (let i = 0; i < $("#drcrnote_product_table_gst tbody tr").length; i++) {
	      if ($("#discount").is(":checked")) {
		  if($('#drcrnote_product_table_gst tbody tr:eq('+ i +') td:eq(4) input').val()=="" || $('#drcrnote_product_table_gst tbody tr:eq('+ i +') td:eq(4) input').val() == 0){
		      $("#crdrvalblank-alert").alert();
		      $("#crdrvalblank-alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#crdrvalblank-alert").hide();
		      });
		      $('#drcrnote_product_table_gst tbody tr:eq('+ i +') td:eq(4) input').focus();
		      return false;
		  }
	      }else if($("#return").is(":checked")){
		  if($('#drcrnote_product_table_gst tbody tr:eq('+ i +') td:eq(2) input').val()=="" || $('#drcrnote_product_table_gst tbody tr:eq('+ i +') td:eq(2) input').val() == 0){
		      $("#crdr_qty_blank_alert").alert();
		      $("#crdr_qty_blank_alert").fadeTo(2250, 500).slideUp(500, function() {
			  $("#crdr_qty_blank_alert").hide();
		      });
		      $('#drcrnote_product_table_gst tbody tr:eq('+ i +') td:eq(2) input').focus();
		      return false;
		  }
	      }
	      
	      if ((parseFloat($('.drcrnote_product_rate_gst:eq(' + i + ')').val()) > parseFloat($('.drcrnote_product_per_price_gst:eq(' + i + ')').val())) && $("#status").val()==3 && $("#discount").is(":checked")) {
			    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
			    $("#exceed-blank-alert").alert();
			    $("#exceed-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#exceed-blank-alert").hide();
				//$('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
				$('.drcrnote_product_rate_gst:eq(' + i + ')').focus().select();
			    });
			    return false;   
			}
		let quantity = parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val());
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
	      let productcode = $("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(0) label").attr("data-productcode");
	      let productname = $("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(0) label").text();
	      ppu = parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val()).toFixed(2);
	      obj[ppu] = parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val()).toFixed(2);
	      idrate[productcode]=parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val()).toFixed(2);
	      taxes[productcode] = parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(6) input").val()) + parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(8) input").val()) + parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(10) input").val());
	      cess[productcode] = parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(12) input").val());
	      prodData[productcode] = parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val());
	      productdata[productname] = parseFloat($("#drcrnote_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val());
	      if ($("#return").is(":checked")) {
		    quantities[productcode] = parseFloat(quantity).toFixed(2);
		}
	  }
	  var totreduct = $.trim($('#total_product_gst').html());
      }


//send data

      if ($("#return").is(":checked")) {
	  idrate["quantities"] = quantities;
      }
      
      var dctypeflag = $("#status").val();

//send data invid,drcrno,date,ref,caseflag,dctypeflag,totreduct,contents,userid
      var form_data = new FormData();
      if($("#sale").is(":checked"))  {
	  form_data.append("invid", $("#drcrnote_invoice option:selected").val());
      }else{
	  form_data.append("invid", $("#drcrnote_invoice_purchase option:selected").val());
	  form_data.append("usr",usrid);
      }
      if($("#discount").is(":checked"))  {
	  form_data.append("drcrmode", 4);
      }else{
	  form_data.append("drcrmode", 18);
      }
	  form_data.append("roundoffflag", roundoffflag);
      form_data.append("drcrno", $("#drcrnote_no").val());
      form_data.append("drcrdate", $.trim($("#drcrnote_year").val() + '-' + $("#drcrnote_month").val() + '-' + $("#drcrnote_date").val()));
      if($("#reference").prop('checked') == true)
      {
	  //store reference    
          reference["dcref"]=$("#drcrnote_no_ref").val();
	  reference["dcdate"]=$.trim($("#drcrnote_year_ref").val() + '-' + $("#drcrnote_month_ref").val() + '-' + $("#drcrnote_date_ref").val());
	  form_data.append("reference", JSON.stringify(reference));
      }
      
      form_data.append("dctypeflag",dctypeflag);  
      //sending hardcode values until caseflag not set
      form_data.append("totreduct",totreduct);
      form_data.append("reductionval",JSON.stringify(idrate));

      voucherdetails["custname"] = $.trim($("#drcrnote_custsupp").text());
      voucherdetails["taxflag"] = taxflag;
      voucherdetails["taxname"] = taxname;
      voucherdetails["inoutflag"] = inoutflag;
      voucherdetails["taxstate"] = destinationstate;
      voucherdetails["totaltaxable"] = totaltaxable;
      voucherdetails["product"] = productdata;
      voucherdetails["prodData"] = prodData;
      voucherdetails["taxes"] = taxes;
      voucherdetails["cess"] = cess;

      form_data.append("vdetails",JSON.stringify(voucherdetails));
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
			if($("#status").val()==3){
			    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
			    if ("vchCode" in  resp && resp["vchCode"]["vflag"] == 1) {
				$("#cr-success-alert").append(" Accounting entry made with voucher no cr" + resp["vchCode"]["vchCode"]);
			    }
			    else if ("vchCode" in  resp && resp["vchCode"]["vflag"] == 0){
				$("#cr-success-alert").append(" Accounting entry could not be made due to mismatch of accounts. Please make the entry yourself.");
				$("#cr-success-alert").removeClass("alert-success");
				$("#cr-success-alert").addClass("alert-warning");
			    }
                            $("#cr-success-alert").alert();
                            $("#cr-success-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#creditnote_create").click();
                            $("#cr-success-alert").hide();
			    });
			}else
			{
			    $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
			    if (resp["vchCode"] != 0) {
				$("#dr-success-alert").append(" Accounting entry made with voucher no dr" + resp["vchCode"]["vchCode"]);
			    }
			    else{
				$("#dr-success-alert").append(" Accounting entry could not be made due to mismatch of accounts. Please make the entry yourself.");
				$("#dr-success-alert").removeClass("alert-success");
				$("#dr-success-alert").addClass("alert-warning");
			    }
                            $("#dr-success-alert").alert();
                            $("#dr-success-alert").fadeTo(2250, 500).slideUp(500, function() {
				$("#debitnote_create").click();
                            $("#dr-success-alert").hide();
			    });
			}
			    /* allow = 0;
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
			
                        $("#drcrnote_invoice").focus();

			$("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        return false;
                    } else {

			$("#drcrnote_invoice").focus();

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
    $("#dc_save_no").focus();

  });
  $("#confirm_yes").on('hidden.bs.modal', function(event) {
    $("#drcrnote_invoice").focus();
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
