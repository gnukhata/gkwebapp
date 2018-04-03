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
"Rohini Baraskar" <robaraskar@gmail.com>
"Reshma Bhatawadekar" <bhatawadekar1reshma@gmail.com>
"Aditya Shukla" <adityashukla9158.as@gmail.com>
"Pravin Dake" <pravindake24@gmail.com>
*/

// This script is for the add cashmemo page

$(document).ready(function() {
//Events data triggered when the page for creating cashmemo is loaded.
    $('.modal-backdrop').remove(); //Removes backdrop of modal that contains loading spinner.
    $('.invoicedate').autotab('number'); // Focus shift from fields among date field.
    $("#invoice_challanno").focus(); // Focus on the cashmemo no. when the page loads.
    if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
	$(".tinfield").show();
	$(".gstfield").hide();
    } else {
	$(".gstinfield").show();
	$(".vatfield").hide();
    }
  //Function to add leading zeros in date and month fields.
    function pad(str, max) { //to add leading zeros in date
        str = str.toString();
        if (str.length == 1) {
            return str.length < max ? pad("0" + str, max) : str;
        } else {
            return str;
        }
    }
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var invoicedate = "";
    var numbertowords = "";
    var numbertoword = "";
    var invoicedatestring = "";
    var gstdate = Date.parseExact('01072017', "ddMMyyyy");

    //Whenever a new row in a table is to be added html for a row is to be appended to table body. Such html is stored in variables.
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();  //HTML for GST Product Table row.
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html();  //HTML for table displaying totals in GST Product Table.
    var vathtml = $('#invoice_product_table_vat tbody tr:first').html();  //HTML for VAT Product Table row.

    //Function to calculate gst tax amount
    function calculategstaxamt(curindex) {
	//Initialising variables to zero and getting values from various input fileds.
	var rowqty = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').val()).toFixed(2);
	var rowprice = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(4) input').val()).toFixed(2);
	var rowdiscount = parseFloat($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(5) input').val()).toFixed(2);
	var taxamount = 0.00;
	var rowtaxableamount=(rowqty * rowprice) - rowdiscount; //Taxable amount for each row is calculated.
	if ($('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').is(":disabled") && $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').is(":disabled")) {
	    rowtaxableamount = rowprice - rowdiscount;
	}

	//Initialising variables for calculating total of Discount, Taxable Amount, Tax Amounts, and Total Amounts.
	var rowtotal = 0.00;
	var totalamount = 0.00;
	//var numbertowords = "";
	var totalcgst = 0.00;
	var totalsgst = 0.00;
	var totalcess = 0.00;
	var totaldiscount = 0.00;
	var totaltaxable = 0.00;

	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(rowtaxableamount).toFixed(2));
	let sgstrate = $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val();
        let sgstamount = (rowtaxableamount * sgstrate)/100;  //Amount of SGST to be applied is found out.
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(8) input').val(parseFloat(sgstamount).toFixed(2));
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(10) input').val(parseFloat(sgstamount).toFixed(2));

	let cessrate = $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val();
        let cessamount = (rowtaxableamount * cessrate)/100;  //Amount of Cess to be applied is found out.
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(12) input').val(parseFloat(cessamount).toFixed(2));

	rowtotal = rowtaxableamount + 2*sgstamount + cessamount; //Sum of Taxable Amount and Tax Amount is found out.
	$('#invoice_product_table_total tbody tr:eq(' + curindex + ') td:eq(0) input').val(parseFloat(rowtotal).toFixed(2));
	
	//Total of discount, taxable amount, tax amounts and total are found out
	for(var i = 0; i < $("#invoice_product_table_gst tbody tr").length; i++) {
	    totaldiscount = totaldiscount + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(5) input').val());
	    totaltaxable = totaltaxable + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(6) input').val());
	    totalcgst = totalcgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(8) input').val());
	    totalsgst = totalsgst + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(10) input').val());
	    totalcess = totalcess + parseFloat($('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(12) input').val());
	    totalamount = totalamount + parseFloat($('#invoice_product_table_total tbody tr:eq(' + i + ') td:eq(0) input').val());
	    var res = totalamount.toString();
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
	$('#discounttotal_product_gst').text(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_gst').text(parseFloat(totaltaxable).toFixed(2));
	$('#totalcgst_product_gst').text(parseFloat(totalcgst).toFixed(2));
	$('#totalsgst_product_gst').text(parseFloat(totalsgst).toFixed(2));
	$('#totalcess_product_gst').text(parseFloat(totalcess).toFixed(2));
	$('#total_product_gst').text(parseFloat(totalamount).toFixed(2));
	$('#totalinvoicevalue').text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalsgtax").text(parseFloat(totalsgst).toFixed(2));
	$("#totalcgtax").text(parseFloat(totalcgst).toFixed(2));
	$("#totalinvcess").text(parseFloat(totalcess).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
	$("#totalValueInWord").text(numbertowords);
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
	//var numbertowords = "";
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
	    var res = totalamount.toString();
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
	$('#discounttotal_product_vat').val(parseFloat(totaldiscount).toFixed(2));
	$('#taxablevaluetotal_product_vat').val(parseFloat(totaltaxable).toFixed(2));
	$('#totaltax').val(parseFloat(totaltax).toFixed(2));
	$('#total_product_vat').val(parseFloat(totalamount).toFixed(2));
	$("#totalinvoicevalue").text(parseFloat(totalamount).toFixed(2));
	$("#taxableamount").text(parseFloat(totaltaxable).toFixed(2));
	$("#totalinvtax").text(parseFloat(totaltax).toFixed(2));
	$("#totalinvdiscount").text(parseFloat(totaldiscount).toFixed(2));
	$("#totalValueInWord").text(numbertowords);
    }

    $(".invstate").show();
    $(".fixed-table").removeClass('fixed-tablepurchase');
    $(".fixed-table").addClass('fixed-tablesale');


    //Preventing characters in numeric fields.
    $("#invoice_date").numeric();
    $("#invoice_month").numeric();
    $("#invoice_year").numeric();

    $("#invoice_challanno").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_date").focus().select();
        }

    });
    //Function to add leading numbers in year fields.
    function yearpad(str, max) { //to add leading 20 or 200 to the year
        str = str.toString();
        if (str.length == 1) {
            return str.length < max ? pad("200" + str, max) : str;
        } else if (str.length == 2) {
            return str.length < max ? pad("20" + str, max) : str;
        } else {
            return str;
        }
    }
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
          if (invoicedate >= gstdate) {
        $("#taxapplicabletext").text("GST");
        $("#taxapplicable").val("7");
              $("#invoice_product_table_vat").hide();  //Hides VAT Product table and fields for TIN.
	      $("#vathelp").hide();
              $("#gstproducttable").show();  //Shows GST Product table.
	      $(".vatfield").hide();
	      $(".gstfield").show();
          }
          else {
        $("#taxapplicabletext").text("VAT");
        $("#taxapplicable").val("22");
              $("#gstproducttable").hide();
	      $(".gstinfield").hide();
              $("#invoice_product_table_vat").show();
	      $("#vathelp").show();
	      $(".vatfield").show();
	      $(".gstfield").hide();
          }
      }
    });

    //Key Event for Cash Memo Date Field.
    $("#invoice_date").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_month").focus().select(); //Focus shifts to Month field
        }
        if (event.which == 38) {
            event.preventDefault();
            $("#invoice_challanno").focus().select(); //Focus shifts to Cash Memo Number.
        }
    });

    //Key Event for Cash Memo Month field.
    $("#invoice_month").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_year").focus().select(); //Focus shifts to Year field
        }
        if (event.which == 38) {
            event.preventDefault();
            $("#invoice_date").focus().select(); //Focus shifts to Date field
        }
    });

    //Key Event for Cash Memo Year field.
    $("#invoice_year").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#invoice_state").focus(); //Focus shifts to State field
        }
        if (event.which == 38) {
            event.preventDefault();
            $("#invoice_month").focus().select(); //Focus shifts to Month field
        }
    });

    $("#invoice_reset").click(function(event) {
        $("#cashmemo_create").click();

    });

    $("#invoice_state").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
	    if ($("#taxapplicable").val() == 7) {
		$("#gstin_panno").focus();
	    }else {
		$(".product_name_vat:first").focus().select();  //Focus Shift to Tax Applicable field.
            }	    
	}
        if (event.which == 38 && (document.getElementById('#invoice_state').selectedIndex == 0)) {
            event.preventDefault();
            $("#invoice_year").focus();
        }
    });
    
    //Validation for GSTIN fields.
    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    var panno="";
    $("#gstin_panno").keydown(function(event) {
	panno = $(this).val();
        if (event.which == 13 && ($("#taxapplicable").val() == 7)) {
	    event.preventDefault();
	    if ((panno.length != 10 || !panno.match(regExp)) && panno != ""){
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$(this).focus().select();
	    }else {
		$("#gstin").focus();
	    }
	}
	if (event.which == 39) {
	    event.preventDefault();
	    $("#gstin").focus().select();
	}
    });
    $("#gstin").keydown(function(event) {
        if (event.which == 13) {
	    let gstinstring=$("#gstin_panno").val() + $("#gstin").val(); //Concatinating
	    event.preventDefault();
	    if ($("#taxapplicable").val() == 7) {
		if(gstinstring != ''){
  		    if(gstinstring.length !=13){
  			$("#gstin-improper-modal").alert();
			$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
			    $("#gstin-improper-modal").hide();
  			    $("#gstin_panno").focus().select();
			});
  			return false;
		    }
		}
		$(".product_name_gst:first").focus().select();  //Focus Shift to Tax Applicable field.
            }
            else {
		$(".product_name_vat:first").focus().select();  //Focus Shift to Tax Applicable field.
            }
	}
	if (event.which == 37) {
	    event.preventDefault();
	    $("#gstin_panno").focus().select();
	}
	});

    $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
        event.preventDefault();
        /* Act on the event */
        //being a dynamic generated field the numeric property is added on their focus
        $(".numtype").numeric();
    });
    $(document).off('focus', '#accountno').on('focus', '#accountno', function(event) {
        event.preventDefault();
        /* Act on the event */
        $("#accountno").numeric({ negative: false });
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

    // following is a function to fil tax rate depending on the state choosen, against the respective products
    //if state selected is none then zero is added in the tax rate fields of product rows
    // else the tax rate is retrieved from the database with the combination of state and product code
    $(document).off('change', '#invoice_state').on('change', '#invoice_state', function(event) {
        event.preventDefault();
        /* Act on the event */
        $(".product_name_vat").change();
	$("#orggstin").text("");
	var gstinstateid=$("#invoice_state option:selected").attr("stateid");
	$("#gstin_statecode").val(gstinstateid);
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
		var gstincode=resp["gkresult"];
		$("#gstin_panno").val(gstincode.substring(2, 12));
		$("#gstin").val(gstincode.substring(12,15));
         	  }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
    });
    $('#invoice_state').change();


    // if the selected product is changed the tax rate is again retrieved from the database, again using the combination of product code and state
    $(document).off('change', '.product_name_vat').on('change', '.product_name_vat', function(event) {
        event.preventDefault();
        /* Act on the event */
      var sourcestate=$("#invoice_state option:selected").val();
      var destinationstate=$("#invoice_state option:selected").val();
      var taxflag=$("#taxapplicable").val();
        var productcode = $(this).find('option:selected').val();
        var curindex = $(this).closest('tbody tr').index();

        if (sourcestate == "none") {
            $('#invoice_product_table_vat tbody tr:eq(' + curindex + ') td:eq(6) input').val(parseFloat(0).toFixed(2));
        } else {
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
        // the unit of measurement name that is associted with the product is retrieved by pasing the product code and is displayed in the span element against the respective produt
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
	}

	});

    $(document).off("keyup").on("keyup", function(event) {
        if (event.which == 45) {
            event.preventDefault();
            $("#invoice_save").click();
            return false;
        }
    });

    //Key events for GST Product Table
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
            $("#invoice_state").focus();
          }
      } else if (event.which == 188 && event.ctrlKey) {
        event.preventDefault();
        if (curindex == 0) {
          event.preventDefault();
            $("#invoice_state").focus();
          } else {
          $('#invoice_product_table_gst tbody tr:eq(' + previndex + ') td:eq(5) input').focus().select();
        }
      } else if (event.which == 190 && event.ctrlKey) {
  	event.preventDefault();
        $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').focus().select();
      }	else if (event.which == 27) {
	  event.preventDefault();
  	  $("#chkcash").focus().click();
      }
    });

    $(document).off('change', '.product_name_gst').on('change', '.product_name_gst', function(event) {
	event.preventDefault();
        /* Act on the event */
	var productcode = $(this).find('option:selected').val();
	var curindex = $(this).closest('tbody tr').index();
	var sourcestate=$("#invoice_state option:selected").val();
	var taxflag=$("#taxapplicable").val();

	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(7) input').val(parseFloat(0).toFixed(2));
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(9) input').val(parseFloat(0).toFixed(2));
	$('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(0).toFixed(2));
        
        if (productcode != "") {
            $.ajax({
                    url: '/invoice?action=getappliedtax',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: { "productcode": productcode, "source": sourcestate,"destination":sourcestate,"taxflag":taxflag },
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
                             //Loads CESS rate if avaliable.
                             if ('CESS' in resp['tax']) {
                                 $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(11) input').val(parseFloat(resp['tax']['CESS']).toFixed(2));
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

                 $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(1) .invoice_product_hsncode').text(resp["gscode"]);
                 if (resp["gsflag"]==7){
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) span').text(resp["unitname"]);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) span').text(resp["unitname"]);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", false);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", false);

                 }

                 else {
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(2) input').prop("disabled", true);
                   $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').prop("disabled", true);
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
          });

    // navigation using ctrl key and shift key
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
            $("#invoice_state").focus();
        }
      } else if (event.which == 188 && event.ctrlKey) {
        event.preventDefault();
        if (curindex == 0) {
            $("#invoice_state").focus();
        } else {
          $('#invoice_product_table_vat tbody tr:eq(' + previndex + ') td:eq(6) input').focus().select();
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

        calculatevataxamt(curindex);
    });
    $(document).off("keydown", ".invoice_product_quantity_vat").on("keydown", ".invoice_product_quantity_vat", function(event) {
      var curindex = $(this).closest('tr').index();
      var nextindex = curindex + 1;
      var previndex = curindex - 1;

      if (event.which == 13) {
  	event.preventDefault();
  	calculatevataxamt(curindex);
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
          $("#invoice_state").focus();
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


    //.................................................
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
          $("#invoice_state").focus();
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
    //.............................................................
    $(document).off('change', '.invoice_product_discount_vat').on('change', '.invoice_product_discount_vat', function(event) {
      event.preventDefault();
    /* Act on the event */
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
        $("#invoice_state").focus().select();
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
    calculatevataxamt(curindex1);

  });
///
$(document).off('change', '.invoice_product_per_price_vat').on('change', '.invoice_product_per_price_vat', function(event) {
    event.preventDefault();
  /* Act on the event */
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
      $("#invoice_state").focus().select();
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

///

///

$(document).off("keydown", ".invoice_product_tax_rate_vat").on("keydown", ".invoice_product_tax_rate_vat", function(event) {
  var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1 + 1;
  var previndex1 = curindex1 - 1;

  if (event.which == 27) {
    event.preventDefault();
      $("#chkcash").focus().click();
calculatevataxamt(curindex1);
  } else if (event.which == 13) {
event.preventDefault();
calculatevataxamt(curindex1);
    if (curindex1 != ($("#invoice_product_table_vat tbody tr").length - 1)) {//Not a last row.
      $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();
    } else if ( $('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){//Last row along with additional conditions.
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
  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select option:visible').first().prop("selected", true);;
  $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').change();
    }
      else{$("#chkcash").focus().click();}
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
      $("#invoice_state").focus().select();
    }
  } else if (event.which == 190 && event.ctrlKey) {
    $('#invoice_product_table_vat tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
    event.preventDefault();
  } else if (event.ctrlKey && event.which == 188) {
    $('#invoice_product_table_vat tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus();
    event.preventDefault();
  } else if (event.which == 27) {
    event.preventDefault();
    $("#accountno").focus().select();
  }
});

    $(document).off("click", ".product_del").on("click", ".product_del", function(event) {
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

$(document).off("keydown", ".lastfield").on("keydown", ".lastfield", function(event) {
var n = $(".lastfield").length;
var f = $('.lastfield');
if (event.which == 13)
{
  var nextIndex = f.index(this) + 1;
  if(nextIndex < n){
event.preventDefault();
f[nextIndex].focus();
f[nextIndex].select();
  }
  else if (nextIndex == n) {
$("invoice_save").focus();
  }
}
else if (event.which == 38) {
  var previndex = f.index(this) - 1;
  if(previndex > -1) {
if ($(this).is("select")) {
    if ($(this).val() == "Road") {
  f[previndex].focus();
	f[previndex].select();
    }
}
else {
    f[previndex].focus();
    f[previndex].select();
}
  }
  else if (previndex == -1) {
if ($("#taxapplicable").val() == 7) {
    $("#chkcash").focus().select();
}
else {
    $(".invoice_product_discount_vat:last").focus().select();
}
  }
}
});

$(document).off("keyup").on("keyup", function(event) {
  if (event.which == 45) {
    event.preventDefault();
    $("#invoice_save").click();
    return false;
  }
});
    
    $("#invoice_save").click(function(event) {
        // Validations start below
        event.stopPropagation();

        var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
        if ($.trim($('#invoice_challanno').val()) == "") {
            $("#challanno-blank-alert").alert();
            $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#challanno-blank-alert").hide();
            });
            $('#invoice_challanno').focus();
            return false;
        }

        if ($.trim($('#invoice_date').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_date').focus();
            return false;
        }
        if ($.trim($('#invoice_month').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_month').focus();
            return false;
        }
        if ($.trim($('#invoice_year').val()) == "") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#date-blank-alert").hide();
            });
            $('#invoice_year').focus();
            return false;
        }
        if (!Date.parseExact($("#invoice_date").val() + $("#invoice_month").val() + $("#invoice_year").val(), "ddMMyyyy")) {
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

	//Validation for GSTIN on Save Button.
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
	var panno1= $("#gstin_panno").val();
	let gstinstring=$("#gstin_panno").val() + $("#gstin").val();
	 if ($("#taxapplicable").val() == 7) {
	     if((panno1.length != 10 || !panno1.match(regExp)) && panno1 !="" ) {
		 $("#gstin-improper-modal").alert();
		 $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		     $("#gstin-improper-modal").hide();
		     $("#gstin_panno").focus();
		 });
		 return false;
	     }
	else if(panno1 !="" && $("#gstin").val() ==""){
	    $("#gstin-improper-modal").alert();
	    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-modal").hide();
		$("#gstin").focus();
	    });
	    return false;
	}
	else if(gstinstring != ""){
	    if(gstinstring.length != 13){
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		    $("#gstin_panno").focus();
		});
		return false;
	    }
	}
	 }

        var tax = {};
	var cess = {};
        var contents = {};
        var stock = {};
        var freeqty = {};
        var items = {};
        var discount = {};
        var bankdetails = {};
	var invoicetotal;
	//'inoutflag' will sent 9 for 'Record' and 15 for 'Create' cash memo.
	var inoutflag = $("#status").val();
          bankdetails["accountno"] = $("#accountno").val();
          bankdetails["bankname"] = $("#bankname").val();
          bankdetails["ifsc"] = $("#ifsc").val();
          bankdetails["branchname"] = $("#branchname").val();
        if ($("#taxapplicable").val() == 22) {
        for (let i = 0; i < $("#invoice_product_table_vat tbody tr").length; i++) {
            if ($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val() == "") {
                $("#product-blank-alert").alert();
                $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#product-blank-alert").hide();
                });
                $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select").focus();
                return false;
            }
            var quantity = parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val()) + parseFloat($("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val());
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
	    calculatevataxamt(i);
            let obj = {};
            var productcode = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
            // data is saved as dict where key is priceperunit and value is the product quantity so the below two lines of code
            var ppu = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(3) input").val();
            obj[ppu] = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val();
            //tax is stored as a dict with key as productcode and value as the tax rate
            tax[productcode] = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(6) input").val();
            // nested dictionary with key as product code and value is another dict with key as priceperunit and value is the product quantity
            contents[productcode] = obj;
            items[productcode] = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(1) input").val();
            freeqty[productcode] = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(2) input").val();
	    discount[productcode] = $("#invoice_product_table_vat tbody tr:eq(" + i + ") td:eq(4) input").val();
        }
	    stock["items"] = items;


           stock["inout"] = 15;
	    invoicetotal = $('#invoice_product_table_vat tfoot tr:last td:eq(5) input').val();
      }
       if ($("#taxapplicable").val() == 7) {
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
	      if ((parseFloat(parseFloat(quantity).toFixed(2)) > parseFloat(parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(1) input").attr("data")).toFixed(2))) && $('#invoice_product_table_gst tbody tr:eq(' + i + ') td:eq(0) select option:selected').attr("gsflag") == '7') {
          $("#quantity-exceed-alert").alert();
          $("#quantity-exceed-alert").fadeTo(2250, 500).slideUp(500, function() {
              $("#quantity-exceed-alert").hide();
          });
          return false;
	    }
	  }
	      calculategstaxamt(i);
        let obj={};
     	productcode = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(0) select option:selected").val();
             ppu = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(4) input").val();
             obj[ppu] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
             contents[productcode] = obj;
          items[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(2) input").val();
           freeqty[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(3) input").val();
               discount[productcode] = $("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(5) input").val();
	       tax[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(7) input").val()) + parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(9) input").val());
	       cess[productcode] = parseFloat($("#invoice_product_table_gst tbody tr:eq(" + i + ") td:eq(11) input").val());
     	}
     	    invoicetotal = $('#total_product_gst').text();
        stock["items"] = items;


           stock["inout"] = 15;
       }

	var form_data = new FormData();
        form_data.append("invoiceno", $("#invoice_challanno").val());
        form_data.append("invoicedate", $("#invoice_year").val() + '-' + $("#invoice_month").val() + '-' + $("#invoice_date").val());
        form_data.append("contents", JSON.stringify(contents));
        form_data.append("tax", JSON.stringify(tax));
	form_data.append("cess", JSON.stringify(cess));
        form_data.append("stock", JSON.stringify(stock));
        form_data.append("invoicetotal", invoicetotal);
        form_data.append("taxstate", $("#invoice_state option:selected").val());
        form_data.append("sourcestate", $("#invoice_state option:selected").val());
        form_data.append("taxflag",$("#taxapplicable").val() );
	form_data.append("freeqty", JSON.stringify(freeqty));
        form_data.append("discount", JSON.stringify(discount));
	form_data.append("inoutflag",inoutflag);
	form_data.append("invoicetotalword", numbertowords);
	let gstinstr= $("#gstin_panno").val() + $("#gstin").val();
	if(gstinstr != ''){
  	    if(gstinstr.length == 13){
		form_data.append("orgstategstin",$("#gstin_statecode").val() + $("#gstin_panno").val() + $("#gstin").val());
	    }
	}
	//Code for sending data to the database based on which radio button is checked i.e."cash" or "bank".
        if ($("#chkcash").is(":checked")) {
	    //Checking which radio button is clicked. if cash is selected then paymentmode is set to 3 (i.e. cash transaction)
		form_data.append("paymentmode",3);   

        } else {
	    //If bank is selected then append both bankdetails and paymentmode = 2 (i.e. bank transaction).
		form_data.append("bankdetails", JSON.stringify(bankdetails));
		form_data.append("paymentmode",2);
            }
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function(e) {
          $.ajax({
            url: '/cashmemos?action=save',
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
		   if(inoutflag == 15){
		       $("#cashmemo_create").click();
		   }else{ $("#cashmemo_record").click();}
               $("#success-alert").alert();
               $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
		   $("#success-alert").hide();
		   let invid = resp["gkresult"];
		   if (inoutflag == "15") {
		       $.ajax({
			   url: '/cashmemos?action=showcashmemo',
			   type: 'POST',
			   dglobal: false,
			   async: false,
			   data: {"invid": invid},
			   datatype: "text/html",
			   beforeSend: function(xhr) {
                               xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
			   }
                       })
			   .done(function(resp) {
			       $("#cashmemoload").html("");
			       $("#cashmemoload").html(resp);
			       $("#viewcashmemo_div").show();
			       $("#cashmemodiv").hide();
			       $("#editbutton").hide();
			       $("#printbutton").attr("invid",invid); //Sending invid with printbutton; 
			       $("#cashmemo_div").html("");
			   })
			   .fail(function() {
			       console.log("error");
			   })
			   .always(function() {
			       console.log("complete");
			   });
		   }
               });
               return false;
             } else if (resp["gkstatus"] == 1) {
               $("#invoice_challanno").focus();
               $("#duplicate-alert").alert();
               $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                 $("#duplicate-alert").hide();
               });
               return false;
             } else {
               $("#invoice_challanno").focus();
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

          return false;
        });
    });
    $("#confirm_yes").on('shown.bs.modal', function(event) {
        $("#tn_save_no").focus();

    });
    $("#confirm_yes").on('hidden.bs.modal', function(event) {
        $("#invoice_challanno").focus();
    });
    
    $("#confirm_yes_print").on('shown.bs.modal', function(event) {
        $("#tn_save_noprint").focus();

    });
    $("#confirm_yes_print").on('hidden.bs.modal', function(event) {
        $("#invoice_challanno").focus();
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
            $("#invoice_state").focus().select();
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
  	  $("#chkcash").focus().click();
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
            $("#invoice_state").focus().select();
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
        $("#chkcash").focus().click();
      }
    });


    $(document).off('change', '.invoice_product_quantity_gst').on('change', '.invoice_product_quantity_gst', function(event) {
    event.preventDefault();
      /* Act on the event */

	var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
    if ($(this).val() == "") {
      $(this).val(0);
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
        $("#invoice_state").focus();
      }
    } else if (event.which == 188 && event.ctrlKey) {
      event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(0) select').focus().select();

    } else if (event.which == 190 && event.ctrlKey) {
  event.preventDefault();
      $('#invoice_product_table_gst tbody tr:eq(' + curindex + ') td:eq(3) input').focus().select();
    }
    else if (event.which == 27) {
	  $("#chkcash").focus().click();
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
      } else if ($('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(0) select option:visible').length >= 2){//Last row along with additional conditions.
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
	else{$("#chkcash").click().focus();}
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
            $("#invoice_state").focus().select();
          }
        } else if (event.which == 188 && event.ctrlKey) {
          event.preventDefault();
          $('#invoice_product_table_gst tbody tr:eq(' + curindex1 + ') td:eq(4) input').focus().select();

        } else if (event.which == 190 && event.ctrlKey) {
          event.preventDefault();
          $('#invoice_product_table_gst tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus();

        } else if (event.which == 27) {
          event.preventDefault();
          $("#chkcash").focus().click();
        }
    });

      $(document).off('keydown', '#ifsc').on('keydown', '#ifsc', function(event) {
        if(event.which==13){
        $("#invoice_save").focus();
        }
      });
      $(document).off('keydown', '#chkcash').on('keydown', '#chkcash', function(event) {
        if(event.which==13){
        $("#invoice_save").focus();
        }

      });

      $(document).off('keydown', '#chkbank').on('keydown', '#chkbank', function(event) {
        if(event.which==13){
            $("#accountno").focus().select();
        }

      });

    //Code for radio buttons to show and hide "bankdetails fields" and "cash received"
    $("input[name='chkpaymentmode']").click(function () {
	//Checking which radio button is selected.
        if ($("#chkcash").is(":checked")) {
	    //If cash is selected then bankdetails fields are hide and 'CASH RECEIVED' is shown.
                $("#cash").show();
		$("#bank").hide();

        } else {
	    //If bank is selected then bankdetails fields are shown and 'CASH RECEIVED' is hide.
                $("#cash").hide();
		$("#bank").show();
            }
    });
    
    //Printing cashmemo
    $("#printbutton").click(function(event) {
        $.ajax({
                url: '/cashmemos?action=print',
                type: 'POST',
                dataType: 'html',
                data: {"invid":$("#printbutton").attr("invid")},  //Accesing invoiceid sent while showing cashmemo.  
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
		$('#printload').html("");
                $('#printload').html(resp);
		$("#cashmemoload").hide();
		$("#buttondiv").hide();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });

    $("#backbutton").click(function(event) {
    $("#addcashmemo").click();
  });
    
});
