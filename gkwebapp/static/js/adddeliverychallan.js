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
"Reshma Bhatawadekar <reshma_b@riseup.net>"
"Nitesh Chaughule <nitesh@disroot.org>"
*/

// This script is for the add adddeliverychallan.jinja2


$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.delchaldate').autotab('number');
  $(".supplydate").autotab('number');  
  $("#deliverychallan_challanno").focus().select();
  $("#deliverychallan_date").numeric();
  $("#deliverychallan_month").numeric();
  $("#deliverychallan_year").numeric();
  $('.deliverychallan_product_quantity').numeric({ negative: false});
  $('#deliverychallan_noofpackages').numeric({ negative: false});
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var selectedproduct = "";
    var gstins = {};

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

    if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
	$(".tinfield").show();
	$(".gstfield").hide();
    } else {
	$(".gstinfield").show();
	$(".vatfield").hide();
    }

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
      if (invoicedatestring.length == 0) {
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
	      $("#taxapplicable").val("7");
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
  });


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
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
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
		$("#custsup-blank-alert();ert").hide();
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
	$("#deliverychallan_consignment").focus().select();
    }
    if (event.which==32){
      event.preventDefault();
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

    //Change Event For 'State'.

    $("#invoicestate").change(function(event) {
	$("#statecodeforinvoice").text($("#invoicestate option:selected").attr("stateid"));
	if ($("#taxapplicable").val() == 7){
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
	$('#deliverychallan_customer').focus().select();
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

  //Keyevents for Consignee fields
  $("#consigneename").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	$('#consigneestate').focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_customerstate").focus().select();
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
	if ($("#taxapplicable").val() == 7) {
	    $(".product_name_gst:first").focus().select();
	    
	}else{
	    $(".product_name_vat:first").focus().select();
	}
	$('html,body').animate({scrollTop: ($("#taxapplicablescroll").offset().top + 200)},'slow');
    }
    if (event.which==38) {
	event.preventDefault();
	if ($("#tinconsignee").is(":visible")) {
	    $("#tinconsignee").focus();
	}else{$("#gstinconsignee").focus();}
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
      $('#deliverychallan_noofpackages').focus();
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

    $("#deliverychallan_customer").change(function(event) {
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
	    $("#deliverychallan_customerstate").val(resp["gkresult"]["state"]);  //State of Customer is selected automatically.
	    $("#deliverychallan_customerstate").change();
	    $("#deliverychallan_customeraddr").text(resp["gkresult"]["custaddr"]);  //Adress of Customer is loaded.
	    $("#tin").text(resp["gkresult"]["custtan"]);  //Customer TIN is loaded.
	    //All GSTINs of this customer are
	    gstins = resp["gkresult"]["gstin"];
            if ($("#deliverychallan_customer option:selected").attr("custid") in gstins) {
      		$("#gstin").text(resp["gkresult"]["gstin"][$("#deliverychallan_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
      	    }
      	    else {
      		$("#gstin").text('');  //If GSTIN is not available it is set as blank.
      	    }
	    //GSTIN of customer in default state is selected.
	    $("#gstin").text(resp["gkresult"]["gstin"][$("#deliverychallan_customerstate option:selected").attr("stateid")]);
	    
	    //State Code of Customer State is loaded.
	    $("#statecodeofcustomer").text($("#deliverychallan_customerstate option:selected").attr("stateid"));
	    
	}
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });

    //Change Event for 'Supplier/customer' state.
    $("#deliverychallan_customerstate").change(function(event) {
	$("#statecodeofcustomer").text($("#deliverychallan_customerstate option:selected").attr("stateid"));  //State code is loaded.
	if ($("#deliverychallan_customerstate option:selected").attr("stateid") in gstins) {
	       $("#gstin").text(gstins[$("#deliverychallan_customerstate option:selected").attr("stateid")]);  //GSTIN is loaded if available.
	}
	else {
	    $("#gstin").text("");  //If GSTIN is not available it is set as blank.
	}
	if ($("#taxapplicable").val() == 7) {
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
	    $("#consigneename").focus();
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
	$("#statecodeofconsignee").text($("#consigneestate option:selected").attr("stateid"));  //State code of consignee is loaded.
	if ($("#status").val() == 15) {
	    if($("#statecodeofconsignee").text() in gstins) {
		var custgstin = gstins[$("#statecodeofconsignee").text()];
		$("#gstin").text(custgstin); // Customer gstin is synced with state code of consignee.
	    } else {$("#gstin").text("");}
	    if ($("#taxapplicable").val() == 7){
		if ($("#consigneestate option:selected").val() == $("#invoicestate option:selected").val()) {
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
	  if ($("#consigneename").val() != "") {
	   sourcestate = $("#consigneestate option:selected").val();
	  }
      }
      else if ($("#status").val() ==  15) {
	  sourcestate = $("#invoicestate option:selected").val();
	  destinationstate = $("#deliverychallan_customerstate").val();
	  if ($("#consigneename").val() != "") {
	      destinationstate = $("#consigneestate option:selected").val();
	  }
      }
    var taxflag=$("#taxapplicable").val();

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
	    if ($("#consigneename").val() != "") {
		sourcestate = $("#consigneestate option:selected").val();
	    }
	}
	else if ($("#status").val() ==  15) {
	    sourcestate = $("#invoicestate option:selected").val();
	    destinationstate = $("#deliverychallan_customerstate").val();
	    if ($("#consigneename").val() != "") {
		destinationstate = $("#consigneestate option:selected").val();
	    }
	}
	var taxflag=$("#taxapplicable").val();
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
      $("#accountno").focus().select();
    }
  });

    $(document).off("change", ".invoice_product_discount_gst").on("change", ".invoice_product_discount_gst", function(event) {
	var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
	    if (parseFloat(parseFloat($(this).val()).toFixed(2)) > (parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2)) * parseFloat(parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2)))) {
	    $("#discount-more-alert").alert();
	    $("#discount-more-alert").fadeTo(2250, 500).slideUp(500, function() {
		$(".invoice_product_discount_gst:eq(" + curindex + ")").focus().select();
		  $("#discount-more-alert").hide();
	      });
	    return false;
	    }
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
	  $('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	  for (let i = 0; i <= curindex1; i++) {
              var selectedproduct = $("#invoice_product_table_vat tbody tr:eq("+ i +") td:eq(0) select option:selected").val();
	      $("#invoice_product_table_vat tbody tr:eq("+ nextindex1 +") td:eq(0) select option[value = " + selectedproduct + "]").prop("disabled", true).prop("hidden", true);
          }
	  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
	  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);
	  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change();
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
    


    $(document).off("click", ".product_del").on("click", ".product_del", function(event){
	event.preventDefault();
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
            var text1 = $('#selectedcustsup').val();
           if(text1==''){
             $('#deliverychallan_customer').focus();
             return false;
           }
           if ($("#status").val()=='9') {
               var urlcustsup = "/customersuppliers?action=getallsups";
           }
           if($("#status").val()=='15'){
               var urlcustsup = "/customersuppliers?action=getallcusts";
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
             console.log("inside ajax done.");
             $("#deliverychallan_customer").empty();
             for (i in custs){
               $("#deliverychallan_customer").append('<option value="'+custs[i].custid+'" >'+custs[i].custname+'</option>');
             }
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

    $("#deliverychallan_save").click(function(event) {
	// save event for saving the delivery note
	event.stopPropagation();
	// below are all the validation checks
	var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
	if ($.trim($('#deliverychallan_challanno').val())=="") {
	    $("#challanno-blank-alert").alert();
	    $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#challanno-blank-alert").hide();
	    });
	    $('#deliverychallan_challanno').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_date').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_date').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_month').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_month').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_year').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_year').focus();
	    return false;
	}
	if(!Date.parseExact($("#deliverychallan_date").val()+$("#deliverychallan_month").val()+$("#deliverychallan_year").val(), "ddMMyyyy")){
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-alert").hide();
	    });
	    $('#deliverychallan_date').focus().select();
	    return false;
	}
	var curdate = Date.parseExact($("#deliverychallan_year").val()+$("#deliverychallan_month").val()+$("#deliverychallan_date").val(), "yyyyMMdd");
	if (!curdate.between(financialstart,financialend)) {
	    $("#between-date-alert").alert();
	    $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#between-date-alert").hide();
	    });
	    $('#deliverychallan_date').focus().select();
	    return false;
	}
	if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
	    $("#custsup-blank-alert").alert();
	    $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#custsup-blank-alert").hide();
	    });
	    $('#deliverychallan_customer').focus();
	    return false;
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

	//validation for consignee name and consignee address
	if ($("#consigneename").val() == "" && $("#deliverychallan_consigneeaddr").val() != ""){
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
	    $("#consigneeaddr-blank-alert").alert();
            $("#consigneeaddr-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#consigneeaddr-blank-alert").hide();
            });
	    $("#deliverychallan_consigneeaddr").focus();
	    return false;
	} else {
	    $('#deliverychallan_product_table tbody tr:first td:eq(0) select').focus();
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
      
    if($("#consigneename").val() != ""){
	consignee["consigneename"] = $.trim($("#consigneename").val());
        consignee["consigneeaddress"] = $.trim($("#deliverychallan_consigneeaddr").val());
        consignee["consigneestate"] = $.trim($("#consigneestate").val());
	consignee["consigneestatecode"] = $.trim($("#statecodeofconsignee").text());
	consignee["gstinconsignee"] = $.trim($("#gstinconsignee").val());
    }
      
	//------------VAT Product Values---------------//
      if ($("#taxapplicable").val() == 22) {
	  for (let i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
	      productqtys.push(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val()));
	      if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == "") {
                  $("#product-blank-alert").alert();
                  $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                      $("#product-blank-alert").hide();
                  });
                  $("")("#invoice_product_table tbody tr:eq(" + i + ") td:eq(0) select").focus();
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

	      //Productcode
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
	      if ($("#invoice_deliverynote option:selected").val() != '') {
		  if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").attr("data")).toFixed(2))) {
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
	      if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
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
		      $("#price-blank-alert();ert").hide();
		      $('.invoice_product_per_price_gst:eq(' + i + ')').focus().select();
		  });
		  return false;   
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
	  delchaltotal = $.trim($('#total_product_gst').html());
      }

        var form_data = new FormData();
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
    form_data.append("taxflag", $("#taxapplicable").val());
    form_data.append("inoutflag",$("#status").val());
    form_data.append("contents", JSON.stringify(contents));	
    form_data.append("orgstategstin",$("#orggstin").text());	
    if($("#consigneename").val() != ""){
	form_data.append("consignee", JSON.stringify(consignee));
    }
	form_data.append("modeoftransport", $('#transportationmode').val());
      if ($("#status").val() == 15) {
	  form_data.append("issuername", $("#invoice_issuer_name").val());
	  form_data.append("designation", $("#invoice_issuer_designation").val());
      }
    if ($("#deliverychallan_godown option").length!=0){
    	form_data.append("goid", $("#deliverychallan_godown option:selected").val());
    }

      //Delivery In
      if ($("#status").val() == 9) {
	  form_data.append("taxstate", $("#invoicestate option:selected").val());
	  if ($("#consigneename").val() != "") {
	      form_data.append("sourcestate", $("#consigneestate option:selected").val());
	  } else {
	      form_data.append("sourcestate", $("#deliverychallan_customerstate option:selected").val());
	  }
      }//Delivery Out
      else if ($("#status").val() ==  15) {
	  if ($("#consigneename").val() != "") {
	      form_data.append("taxstate", $("#consigneestate option:selected").val());
	  } else {
	      form_data.append("taxstate", $("#deliverychallan_customerstate option:selected").val());
	  }
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
	event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_yes').modal('show').one('click', '#dc_save_yes', function (e){
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
	console.log(resp["gkstatus"]);
	if(resp["gkstatus"] == 0){
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
            $("#success-alert").alert();
            $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#success-alert").hide();
            });
            return false;
	}
	else if(resp["gkstatus"] == 1) {
            $("#deliverychallan_challanno").focus();
            $("#duplicate-alert").alert();
            $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#duplicate-alert").hide();
            });
            return false;
	}
	else {
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
  });
  $("#confirm_yes").on('shown.bs.modal', function(event) {
      // on opening of modal the focus should be by efault on the no option so this event
    $("#dc_save_no").focus();

  });
  $("#confirm_yes").on('hidden.bs.modal', function(event) {
      // after te modal is closed the focus should be on the delivery note number so this event
    $("#deliverychallan_challanno").focus();
  });

    $("#deliverychallan_saveprint").click(function(event) {
      /* event is same as save event just that the data is collected and
       the delivery note is saved and the same data is passed on
       to a page displaying the print preview ready to be printed */
	event.stopPropagation();
	var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
	if ($.trim($('#deliverychallan_challanno').val())=="") {
	    $("#challanno-blank-alert").alert();
	    $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#challanno-blank-alert").hide();
	    });
	    $('#deliverychallan_challanno').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_date').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_date').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_month').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_month').focus();
	    return false;
	}
	if ($.trim($('#deliverychallan_year').val())=="") {
	    $("#date-blank-alert").alert();
	    $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-blank-alert").hide();
	    });
	    $('#deliverychallan_year').focus();
	    return false;
	}
	if(!Date.parseExact($("#deliverychallan_date").val()+$("#deliverychallan_month").val()+$("#deliverychallan_year").val(), "ddMMyyyy")){
	    $("#date-alert").alert();
	    $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#date-alert").hide();
	    });
	    $('#deliverychallan_date').focus().select();
	    return false;
	}
	var curdate = Date.parseExact($("#deliverychallan_year").val()+$("#deliverychallan_month").val()+$("#deliverychallan_date").val(), "yyyyMMdd");
	if (!curdate.between(financialstart,financialend)) {
	    $("#between-date-alert").alert();
	    $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#between-date-alert").hide();
	    });
	    $('#deliverychallan_date').focus().select();
	    return false;
	}
	if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
	    $("#custsup-blank-alert").alert();
	    $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#custsup-blank-alert").hide();
	    });
	    $('#deliverychallan_customer').focus();
	    return false;
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

	//validation for consignee name and consignee address
	if ($("#consigneename").val() == "" && $("#deliverychallan_consigneeaddr").val() != ""){
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
	    $("#consigneeaddr-blank-alert").alert();
            $("#consigneeaddr-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#consigneeaddr-blank-alert").hide();
            });
	    $("#deliverychallan_consigneeaddr").focus();
	    return false;
	} else {
	    $('#deliverychallan_product_table tbody tr:first td:eq(0) select').focus();
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
      
	if($("#consigneename").val() != ""){
	    consignee["consigneename"] = $.trim($("#consigneename").val());
            consignee["consigneeaddress"] = $.trim($("#deliverychallan_consigneeaddr").val());
            consignee["consigneestate"] = $.trim($("#consigneestate").val());
	    consignee["consigneestatecode"] = $.trim($("#statecodeofconsignee").text());
	    consignee["gstinconsignee"] = $.trim($("#gstinconsignee").val());
	}
      
	//------------VAT Product Values---------------//
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

		//Productcode
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
		if ($("#invoice_deliverynote option:selected").val() != '') {
		    if (parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").attr("data")).toFixed(2))) {
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
		if ($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == 7) {
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
			$("#price-blank-alert();ert").hide();
			$('.invoice_product_per_price_gst:eq(' + i + ')').focus().select();
		    });
		    return false;   
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
	    delchaltotal = $.trim($('#total_product_gst').html());
	}

	var dataset = {};
	dataset = {"custid":$("#deliverychallan_customer option:selected").val(),
		   "dcno":$("#deliverychallan_challanno").val(),
		   "dcdate":$("#deliverychallan_year").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_date").val(),
		   "inout":$("#status").val(),
		   "noofpackages":$('#deliverychallan_noofpackages').val(),
		   "tax":JSON.stringify(tax),
		   "cess":JSON.stringify(cess),
		   "delchaltotal":delchaltotal,
		   "freeqty":JSON.stringify(freeqty),
		   "discount":JSON.stringify(discount),
		   "taxflag":($("#taxapplicable").val()),
		   "inoutflag":$("#status").val(),
		   "contents":JSON.stringify(contents),
		   "orgstategstin":$("#orggstin").text()
		  };
	if($("#consigneename").val() != ""){
	    dataset["consignee"]=JSON.stringify(consignee);
	}
	dataset["modeoftransport"]= $('#transportationmode').val();
	if ($("#status").val() == 15) {
	    dataset["issuername"] = $("#invoice_issuer_name").val();
	    dataset["designation"] = $("#invoice_issuer_designation").val();
	}
	if ($("#deliverychallan_godown option").length!=0){
    	    dataset["goid"] = $("#deliverychallan_godown option:selected").val();
	}

      //Delivery In
	if ($("#status").val() == 9) {
	    dataset["taxstate"] = $("#invoicestate option:selected").val();
	    if ($("#consigneename").val() != "") {
		dataset["sourcestate"] = $("#consigneestate option:selected").val();
	    } else {
		dataset["sourcestate"] = $("#deliverychallan_customerstate option:selected").val();
	    }
	}//Delivery Out
	else if ($("#status").val() ==  15) {
	    if ($("#consigneename").val() != "") {
		dataset["taxstate"] = $("#consigneestate option:selected").val();
	    } else {
		dataset["taxstate"] = $("#deliverychallan_customerstate option:selected").val();
	    }
	    dataset["sourcestate"] = $("#invoicestate option:selected").val();
	}
      
	var dateofsupply = $.trim($("#supply_date").val() + $("#supply_month").val() + $("#supply_year").val());
	if (dateofsupply == "") {
  	    dataset["dateofsupply"] = dateofsupply;
	} 
	else {
	    dataset["dateofsupply"] = $.trim($("#supply_year").val() + '-' + $("#supply_month").val() + '-' + $("#supply_date").val());
	}
	//form_data.append("products", JSON.stringify(products));// a list always needs to be stringified into json before sending it ahead
	dataset["dcflag"] = $("#deliverychallan_consignment option:selected").val();
	/*var files = $("#my-file-selector")[0].files;
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
	    dataset["file"] = "file"+i,files[i];
	}*/
	event.preventDefault();
	$('.modal-backdrop').remove();
	$('.modal').modal('hide');
	$('#confirm_yes').modal('show').one('click', '#dc_save_yes', function (e)
	{
	    $.ajax({ // ajax for saving the delivery note
		url: '/deliverychallan?action=save',
		type: 'POST',
		dataType: 'json',
		async : false,
		data: dataset,
		beforeSend: function(xhr)
		{
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
	    .done(function(resp) {
		if(resp["gkstatus"] == 0){
		    $("#success-alert").alert();
		    $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#success-alert").hide();
		    });
		    if ($("#status").val()=='15') {
			let dcid = resp.gkresult;
			$.ajax({ // passing the delivery note details to a page displaying it as a print preview
			    url: '/deliverychallan?action=print',
			    type: 'POST',
			    dataType: 'html',
			    data: {"dcid":dcid},
			    beforeSend: function(xhr)
			    {
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
		    }
		}
		else if(resp["gkstatus"] == 1) {
		    $("#deliverychallan_challanno").focus();
		    $("#duplicate-alert").alert();
		    $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#duplicate-alert").hide();
		    });
		    return false;
		}
		else {
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
    });
    $("#confirm_yes_dc").on('shown.bs.modal', function(event) {
	$("#dc_save_noprint").focus();
    });
    $("#confirm_yes_dc").on('hidden.bs.modal', function(event) {
	$("#deliverychallan_challanno").focus();
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
});
