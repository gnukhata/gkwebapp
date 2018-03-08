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
		    //console.log(resp.invdata.sourcestate);
		    $("#drcrnote_custsupp").text(resp.invoicedata.custSupDetails["custname"]);
		    $("#gstin").text(resp.invoicedata.custSupDetails["custgstin"]);
		    $("#tin").text(resp.invoicedata.custSupDetails["custtin"]);
		    $("#drcrnote_custsuppaddr").text(resp.invoicedata.custSupDetails["custaddr"]);
		    $("#taxapplicable").text(resp.invoicedata.taxname);
		    $.each(resp.items, function(key, value) {
			$('#drcrnote_table_vat tbody').append('<tr>' + vathtml + '</tr>');
			$('#drcrnote_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
			$('#drcrnote_table_vat tbody tr:last td:first select').val(key).prop("disabled", true);
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_table_vat tbody tr:last td:eq(1) span').text(value.unitname);
			$('#drcrnote_table_vat tbody tr:last td:eq(2) span').text(value.unitname);
		    });
		    $("#drcrnote_table_vat tbody tr:first td:eq(9)").empty();
		    var productcode;
		    $.each(resp.items, function(key, value) {
			$('#drcrnote_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
			$('#drcrnote_product_table_gst tbody tr:last td:first select').val(key).prop("disabled", true);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(1) label').html(value.gscode);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) input').val(parseFloat(value.qty).toFixed(2)).attr("data", parseFloat(value.qty).toFixed(2));
			$('#drcrnote_product_table_gst tbody tr:last td:eq(2) span').text(value.unitname);
			$('#drcrnote_product_table_gst tbody tr:last td:eq(3) span').text(value.unitname);
			$('.drcrnote_product_quantity_gst').numeric({ negative: false });
			$('.drcrnote_product_per_price_gst').numeric({ negative: false });
			$("#drcrnote_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
			$('#drcrnote_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
		    });
		    $("#invoice_product_table_total tbody tr:first td:last").empty();
		    $(".product_name_gst, .product_name_vat, #invoicestate").change();
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
			$("#statecodefordrcrnote").text(resp.invoicedata.destinationstatecode);
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
		    
		}
	       });
	
    });
}); // ready func end





