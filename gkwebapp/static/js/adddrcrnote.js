$(document).ready(function() {
    console.log("Ready");
    $("#drcrnote_invoice").focus();
    $('.drcrnotedate').autotab('number');  //Focus shifts from fields among date fields.
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
		if (resp["gkstatus"] == 0) {
		    console.log(resp);
		    //Load invoice data
		    //console.log(resp.invdata.sourcestate);
		    $("#drcrnote_custsupp").text(resp.invoicedata.custSupDetails["custname"]);
		    $("#gstin").text(resp.invoicedata.custSupDetails["custgstin"]);
		    $("#tin").text(resp.invoicedata.custSupDetails["custtin"]);
		    $("#drcrnote_custsuppaddr").text(resp.invoicedata.custSupDetails["custaddr"]);
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





