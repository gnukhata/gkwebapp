$(document).ready(function() {
  $('.modal-backdrop').remove();
    var curindex = $(this).closest('#invoice_product_table_gst tbody tr').index();
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();
    var vathtml = $('#invoice_product_table_vat tbody tr:first').html();
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html();  
  $("#rejectionnote_view_list").focus();
  $("#rejectionnote_view_list").change(function(event) {
    $.ajax({
      url: '/rejectionnote?action=getrejectionnote',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"rnid":$("#rejectionnote_view_list option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
	$(".viewrejectionnote_div").show();
	if(resp.gkresult.inout==9){
	    $(".inrej").show();
	    $(".outrej").hide();
	}else{ $(".inrej").hide();
	       $(".outrej").show();
	     }
      $("#rejectionnote_noteno").val(resp.gkresult.rnno);
      if(resp.gkresult.invid)
        $("#rejectionnote_invoice").val(resp.gkresult.invno + ", " + resp.gkresult.invdate);
      else
        $("#rejectionnote_invoice").val("None");
      if(resp.gkresult.dcid)
        $("#rejectionnote_deliverynote").val(resp.gkresult.dcno + ", " + resp.gkresult.dcdate);
      else
        $("#rejectionnote_deliverynote").val("None");
      var rndatearray = resp.gkresult.rndate.split(/\s*\-\s*/g);
      $("#rejectionnote_date").val(rndatearray[0]);
      $("#rejectionnote_month").val(rndatearray[1]);
      $("#rejectionnote_year").val(rndatearray[2]);
      if (resp.gkresult.inout==9) {
        $("#ctinlabel").show();
        $("#clabel").show();
        $("#caddr").show();
        $("#dgodown").show();
        $("#stinlabel").hide();
        $("#slabel").hide();
        $("#saddr").hide();
        $("#rgodown").hide();
      }
      else {
        $("#ctinlabel").hide();
        $("#clabel").hide();
        $("#caddr").hide();
        $("#dgodown").hide();
        $("#stinlabel").show();
        $("#slabel").show();
        $("#saddr").show();
        $("#rgodown").show();
      }

	$("#invoice_noteno").val(resp.gkresult.invid);
	var invdatearray = resp.gkresult.rejinvdata.invdate.split(/\s*\-\s*/g);
	$("#invoice_date").val(invdatearray[0]);
	$("#invoice_month").val(invdatearray[1]);
	$("#invoice_year").val(invdatearray[2]);
	//$("#invoice_state").val();
	//$("#invoice_gstin").val();
      if(resp.gkresult.hasOwnProperty("dcno")){
          $("#rejectionnote_consignment").val(resp.gkresult.transactiontype);
      }
      else{
        $("#rejectionnote_consignment").val("None");
      }
      if(resp.gkresult.rejinvdata.hasOwnProperty("custSupDetails")){
        $("#rejectionnote_customer").val(resp.gkresult.rejinvdata.custSupDetails.custname);
        $("#rejectionnote_customeraddr").val(resp.gkresult.rejinvdata.custSupDetails.custaddr);
          $("#rejectionnote_customertin").val(resp.gkresult.rejinvdata.custSupDetails.custtin);
	  $("#rejectionnote_customergstin").val(resp.gkresult.rejinvdata.custSupDetails.custgstin);
	  $("#cussup_state").val(resp.gkresult.rejinvdata.custSupDetails.custsupstate);
      }
      else{
        $("#rejectionnote_customer").val("None");
        $("#rejectionnote_customeraddr").val("None");
        $("#rejectionnote_customertin").val("None");
      }
      if(resp.gkresult.hasOwnProperty("goname")){
        $('#rejectionnote_godown').val(resp.gkresult.goname + "(" + resp.gkresult.gostate + ")");
      }
      else {
        $("#rejectionnote_godown").val("None");
      }
      if(resp.gkresult.rejinvdata.taxflag == 7){
	  let curindex = 0;
	  $('#invoice_product_table_gst tbody').empty();
	  $('#invoice_product_table_total tbody').empty();
	  $(".vatfield").hide();
	  $.each(resp.gkresult.rejcontents, function(key, value) {
	      $('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
	      console.log(value.productdesc);
	      $('.product_name_gst:eq(' + curindex + ')').val(value.proddesc);
	      $('.invoice_product_hsncode:eq(' + curindex + ')').html(value.gscode);
	      $('.rejection_product_rejquantity_gst:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
	      $('.invoice_product_freequantity_gst:eq(' + curindex + ')').val(value.freeqty).attr("data", value.freeqty);
	      $('.unitaddon_qty_gst:eq(' + curindex + '), .unitaddon_freeqty_gst:eq(' + curindex + ')').text(value.uom);
	      $('.invoice_product_per_price_gst:eq(' + curindex + ')').val(value.priceperunit);
				$('.invoice_product_discount_gst:eq(' + curindex + ')').val(value.discount);
	      $('.invoice_product_taxablevalue_gst:eq(' + curindex + ')').val(value.taxableamount);
	      if(value.taxname == 'IGST'){
		  $(".sgstfield").hide();
		  $(".igstfield").show();
		  $('.invoice_product_igstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
		  $('.invoice_product_igstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
	      }
	      else{
		  $(".igstfield").hide();
		  $(".sgstfield").show();
		  $('.invoice_product_sgstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
		  $('.invoice_product_sgstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
		  $('.invoice_product_cgstrate:eq(' + curindex + ')').val(parseFloat(value.taxrate).toFixed(2));
		  $('.invoice_product_cgstamount:eq(' + curindex + ')').val(parseFloat(value.taxamount).toFixed(2));
	      }
	      $('.invoice_product_cessrate:eq(' + curindex + ')').val(parseFloat(value.cessrate).toFixed(2));
	      $('.invoice_product_cessamount:eq(' + curindex + ')').val(parseFloat(value.cess).toFixed(2));
	      $("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
	      $('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	      $('.invoice_product_total:eq(' + curindex + ')').val(parseFloat(value.totalAmount).toFixed(2));
	      curindex = curindex + 1;
	  });
	  $('.invoice_product_quantity_gst').numeric({ negative: false });
	  $('.invoice_product_per_price_gst').numeric({ negative: false });
	  $("#invoice_product_table_total tbody tr:first td:last").empty();
	  $("#taxablevaluetotal_product_gst").text(parseFloat(resp.gkresult.totaltaxablevalue).toFixed(2));
	  $("#totalcgst_product_gst").text(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#totalsgst_product_gst").text(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#totaligst_product_gst").text(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#totalcess_product_gst").text(parseFloat(resp.gkresult.totalcessamt).toFixed(2));
	  $("#total_product_gst").text(parseFloat(resp.gkresult.rejectedtotal).toFixed(2));
	  $("#taxableamount").text(parseFloat(resp.gkresult.totaltaxablevalue).toFixed(2));
	  $("#totalinvoicevalue").text(parseFloat(resp.gkresult.rejectedtotal).toFixed(2));
	  $("#totalsgtax").text(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#totalcgtax").text(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#totaligtax").text(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#totalinvcess").text(parseFloat(resp.gkresult.totalcessamt).toFixed(2));
	  $(".vatfied").hide();
	  $(".gstfield").show();
      }
      $(".leftcolumn").show();
      $("#rejectionnote_product_div").show();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });
});
