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
			console.log("Source State");
			console.log(resp.invoicedata.sourcestate);
			$("#drcrnote_state").text(resp.invoicedata.sourcestate);
			console.log("SOURCE CODE");
			console.log(resp.invoicedata.sourcestatecode);
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
		  //  $(".product_name_gst, .product_name_vat, #drcrnote_state").change();
		    
		    
		}





		
		//code for hide and show VAT and GST table on the basis of taxflag which is from invoicedata
	console.log(resp.invoicedata.taxflag);
	if (resp.invoicedata.taxflag=="7"){
	    
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
    
}); // ready func end





