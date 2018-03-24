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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Nitesh Chaughule" <nitesh@disroot.org>
*/

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
	    $(".panel-footer").hide();
	}else{ $(".inrej").hide();
	       $(".outrej").show();
	       $(".panel-footer").show();
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
	$("#invoice_state").val(resp.gkresult.rejinvdata.sourcestate);
	$("#invoice_addr").val(resp.gkresult.rejinvdata.address);
	$("#invoice_gstin").val(resp.gkresult.rejinvdata.orgstategstin);
	$("#invoice_tin").val(resp.gkresult.rejinvdata.custtin);
	$("#issuer_name").val(resp.gkresult.rejinvdata.issuername);
	console.log(resp.gkresult.rejinvdata.inotflag);
	if(resp.gkresult.rejinvdata.inoutflag == 15){
	    $("#issuer_designation").val(resp.gkresult.rejinvdata.designation);
	}else{
	    var dict={"-1":"Admin","0":"Manager","1":"Operator","2":"Auditor","3":"Godown In Charge"};
	    var userrole = dict[resp.gkresult.rejinvdata.designation];
	    $("#issuer_designation").val(userrole);
	}
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
	//For GST Table values are taken
      if(resp.gkresult.rejinvdata.taxflag == 7){
	  let curindex = 0;
	  $('#invoice_product_table_gst tbody').empty();
	  $('#invoice_product_table_total tbody').empty();
	  $(".vatfield").hide();
	  $(".gstinfield").show();
	  $(".tinfield").hide();
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
      }else if(resp.gkresult.rejinvdata.taxflag == 22){ //For VAT Table values are taken.
	  $("#invoice_product_table_vat").show();
	  let curindex = 0;
	  $(".gsttable").hide();
	  $(".gstinfield").hide();
	  $(".tinfield").show();
	  $("#vathelp").show();
	  $('#invoice_product_table_vat tbody').empty();
	  $.each(resp.gkresult.rejcontents, function(key, value) {
	      $('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
	      $('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	      $('.product_name:eq(' + curindex + ')').val(value.proddesc);
	      $('.rejectionnote_product_rejected_quantity:eq(' + curindex + ')').val(value.qty).attr("data", value.qty);
	      $('#unitaddon_qty_vat:eq(' + curindex + '), #unitaddon_freeqty_vat:eq(' + curindex + ')').text(value.uom);
	      $('.rejection_product_per_price_vat:eq(' + curindex + ')').val(value.priceperunit);
	      $('.rejection_product_discount_vat:eq(' + curindex + ')').val(value.discount);
	      $('.rejection_product_taxablevalue_vat:eq(' + curindex + ')').val(value.taxableamount);
	      $('.rejection_product_tax_rate_vat:eq(' + curindex + ')').val(value.taxrate);
	      $('.rejection_product_tax_amount_vat:eq(' + curindex + ')').val(value.taxamount);
	      $('.rejection_product_total:eq(' + curindex + ')').val(value.totalAmount);
	      curindex = curindex + 1;
	  });
	  $("#invoice_product_table_vat tbody tr:first td:eq(9)").empty();
	  $('.invoice_product_quantity_vat').numeric({ negative: false });
	  $('.invoice_product_per_price_vat').numeric({ negative: false });
	  $("#taxablevaluetotal_product_vat").val(parseFloat(resp.gkresult.totaltaxablevalue).toFixed(2));
	  $("#totaltax").val(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#total_product_vat").val(parseFloat(resp.gkresult.rejectedtotal).toFixed(2));
	  $("#totalinvtax").text(parseFloat(resp.gkresult.totaltaxamt).toFixed(2));
	  $("#totalinvoicevalue").text(parseFloat(resp.gkresult.rejectedtotal).toFixed(2));
	  $("#taxableamount").text(parseFloat(resp.gkresult.totaltaxablevalue).toFixed(2));
	  $(".gstfield").hide();
	  $(".vatfield").show();
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

    //Click event for 'Print'
    $("#rejectionnote_viewprint").click(function(event) {
        $.ajax({
            url: '/rejectionnote?action=getprint',
            type: 'POST',
            dataType: 'html',
            data: {"rnid":$("#rejectionnote_view_list option:selected").val()},
            beforeSend: function(xhr) {
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
    });
});
