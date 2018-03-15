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
"Ishan Masdekar" <imasdekar@dff.org.in>
"Navin Karkera" <navin@openmailbox.org>
"Abhijith Balan" <abhijithb21@openmailbox.org.in>
"Bhavesh Bhawadhane" <bbhavesh07@gmail.com>
"Prajkta Patkar" <prajkta.patkar007@gmail.com>
"Reshma Bhatawadekar <reshma_b@riseup.net>"
*/
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.delchaldate').autotab('number');
  $("#deliverychallan_edit_list").focus();
  $("#deliverychallan_edit_save").hide();
  $("#deliverychallan_edit_date").numeric();
  $("#deliverychallan_edit_month").numeric();
  $("#deliverychallan_edit_year").numeric();
  $('.deliverychallan_edit_product_quantity').numeric({ negative: false});
  $(".deliverychallan_edit_disable").prop("disabled",true);
  $("#deliverychallan_editprint").hide();
  var custsup  =$("#deliverychallan_edit_customer").find('optgroup').clone();
    var inout ;
    var inoutflag;
    if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
	$(".tinfield").show();
	$(".gstfield").hide();
    } else {
	$(".gstinfield").show();
	$(".vatfield").hide();
    }
    var gsthtml = $('#invoice_product_table_gst tbody tr:first').html();
    var totaltablehtml = $("#invoice_product_table_total tbody tr:first").html(); 
    var vathtml = $('#invoice_product_table_vat tbody tr:first').html();  
    $("#deliverychallan_edit_list").change(function(event) {
    $.ajax({
      url: '/deliverychallan?action=getdelchal',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"dcid":$("#deliverychallan_edit_list option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
	console.log("success");
	$(".panel-footer").hide();
	if(resp.delchaldata.delchalContents){
	    $(".deliverychallan_OLD_div").hide();
	    $("#deliverychallan_OLD_product_div").hide();
	    $(".deliverychallan_edit_div").show();
	
      if (resp.delchaldata.delchaldata.cancelflag==1)
      {
        $("#cancelmsg").show();
        $("#alertstrong").html("Delivery Note cancelled on "+resp.delchaldata.delchaldata.canceldate);
        $("#deliverychallan_edit_delete").prop("disabled",true);
        $("#deliverychallan_edit_delete").hide();
      }
      else
      {
        $("#cancelmsg").hide();
        $("#deliverychallan_edit_delete").prop("disabled",false);
        $("#deliverychallan_edit_delete").show();
      }
      if(resp.delchaldata.delchaldata.attachmentcount > 0){
	  $(".panel-footer").show();
          $("#viewattach").show();
      }
      else{
          $("#viewattach").hide();
      }
	$("#deliverychallan_edit_customer").html(custsup);
	inout = resp.delchaldata.delchaldata.inout;
	inoutflag = resp.delchaldata.delchaldata.inoutflag;
	if(inoutflag == 9){
	    $("#detailsIN").show();
	    $("#detailsOUT").hide();
	    $("#statedest").show();
	    $("#stateorigin").hide();
	    $(".infield").show();
	    $(".outfield").hide();
	    $(".panel-footer").hide();
	    $("#deliverychallan_editprint").hide();
	}
	else if(inoutflag == 15){
	    $("#detailsOUT").show();
	    $("#detailsIN").hide();
	    $("#statedest").hide();
	    $("#stateorigin").show();
	    $(".infield").hide();
	    $(".outfield").show();
	    $(".panel-footer").show();
	    $("#deliverychallan_editprint").show();
	}

	var dict={"16":"Purchase","4":"sale","1":"Approval","3":"Consignment","19":"Sample","6":"Free Replacement"};
	var typeoftrans = dict[resp.delchaldata.delchaldata.dcflag];
 	
	if (resp.delchaldata.delchaldata.taxflag == '7'){
	    if(resp.delchaldata.delchaldata.consignee.consigneename != ""){
		if (resp.delchaldata.delchaldata.consignee.consigneestate == resp.delchaldata.sourcestate) {
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
		if (resp.delchaldata.custSupDetails.custsupstate == resp.delchaldata.delchaldata.sourcestate) {
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
	else if(resp.delchaldata.delchaldata.taxflag == '22'){
	    $(".gstinfield").hide();
	    $("#invoice_product_table_vat").show();
	    $(".tinfield").show();
	    $("#vathelp").show();
	    $(".gstfield").hide();
	    $(".vatfield").show();
	}
	
	if (inoutflag == 9) {
            $("#polabel").show();
            $("#slabel").show();
            $("#tgolabel").hide();
            $("#solabel").hide();
            $("#clabel").hide();
            $("#fgolabel").show();
            $("#customersgroup").remove();
            $("label[for='deliverychallan_edit_issuername']").hide();
            $("label[for='deliverychallan_edit_designation']").hide();
            $('#deliverychallan_edit_issuername').hide();
            $('#deliverychallan_edit_designation').hide();
            $("#deliverychallan_editprint").hide();
	    $(".invoice_issuer").hide();
	}
	else {
            $("#polabel").hide();
            $("#slabel").hide();
            $("#tgolabel").show();
            $("#solabel").show();
            $("#clabel").show();
            $("#fgolabel").hide();
            $("#suppliersgroup").remove();
            $("label[for='deliverychallan_edit_issuername']").show();
            $("label[for='deliverychallan_edit_designation']").show();
            $("#deliverychallan_editprint").show();
            $('#deliverychallan_edit_issuername').show();
            $('#deliverychallan_edit_designation').show();
            $('#deliverychallan_edit_issuername').val(resp.delchaldata.delchaldata.issuername);
            $('#deliverychallan_edit_designation').val(resp.delchaldata.delchaldata.designation);
	    $(".invoice_issuer").show();
	}
	$('#deliverychallan_edit_challanno').text(resp.delchaldata.delchaldata.dcno);
	$("#deliverychallan_edit_date").text(resp.delchaldata.delchaldata.dcdate);
	//Sourcestate and Destinationstate.
	if (inoutflag == 15) {
	    $("#invoicestate").text(resp.delchaldata.sourcestate);
	    $("#statecodeforinvoice").text(resp.delchaldata.sourcestatecode);
	    $(".invoice_issuer").show();
	    $("#delchal_issuer_name").text(resp.delchaldata.delchaldata.issuername);
	    $("#delchal_issuer_designation").text(resp.delchaldata.delchaldata.designation);
	}
	else {
	    $("#invoicestate").text(resp.delchaldata.delchaldata.destinationstate);
	    $("#statecodeforinvoice").text(resp.delchaldata.delchaldata.taxstatecode);
	}
	$('#orggstin').text(resp.delchaldata.delchaldata.orggstin);
	$("#deliverychallan_customer").text(resp.delchaldata.custSupDetails.custname);
	$("#deliverychallan_customerstate").text(resp.delchaldata.custSupDetails.custsupstate);
	$("#statecodeofcustomer").text(resp.delchaldata.custSupDetails.custsupstatecode);
	if ((resp.delchaldata.delchaldata.taxflag) == '22') {
	    $("#tin").text(resp.delchaldata.custSupDetails.custtin);
	}else{
	    $("#gstin").text(resp.delchaldata.custSupDetails.custgstin);
	}
	$("#deliverychallan_customeraddr").text(resp.delchaldata.custSupDetails.custaddr);
	if ((resp.delchaldata.delchaldata.taxflag) == '22') {
	    $("#taxapplicabletext").text("VAT");
	}else{ $("#taxapplicabletext").text("GST"); }
	$('#deliverychallan_edit_godown').text(resp.delchaldata.delchaldata.goname +","+resp.delchaldata.delchaldata.goaddr);
	$('#deliverychallan_edit_consignment').text(typeoftrans);
	if(resp.delchaldata.delchaldata.consignee) {
	    $('#delchal_consigneename').text(resp.delchaldata.delchaldata.consignee.consigneename);
            $('#delchal_consigneestate').text(resp.delchaldata.delchaldata.consignee.consigneestate);
	    $('#delchal_statecodeofconsignee').text(resp.delchaldata.delchaldata.consignee.consigneestatecode);
            $('#delchal_consigneeaddr').text(resp.delchaldata.delchaldata.consignee.consigneeaddress);
	    if ((resp.delchaldata.delchaldata.taxflag) == '22') {
		$("#delchal_tinconsignee").text(resp.delchaldata.delchaldata.consignee.tinconsignee);
	    }
	    else if ((resp.delchaldata.delchaldata.taxflag) ==  '7') {
		$("#delchal_gstinconsignee").text(resp.delchaldata.delchaldata.consignee.gstinconsignee);
	    }
	} else {
	    $('#delchal_consigneename').text("");
            $('#delchal_consigneestate').text("");
            $('#delchal_consigneeaddr').text("");
	    $("#delchal_tinconsignee").text("");
	    $("#delchal_gstinconsignee").text("");
	    $("#delchal_statecodeofconsignee").text("");
	}
      
      $('#deliverychallan_noofpackages').text(resp.delchaldata.delchaldata.noofpackages);
      $('#deliverychallan_edit_modeoftransport').text(resp.delchaldata.delchaldata.modeoftransport);
	var vehicleno = resp.delchaldata.delchaldata.vehicleno;
	if(vehicleno!=""){
	    $("#vehicleno").text(vehicleno);
	}
	$("#supply_date").text(resp.delchaldata.dateofsupply);
	$('#deliverychallan_edit_product_table tbody').empty();
	if(resp.delchaldata.delchaldata.taxflag == 7){
	    $('#invoice_product_table_gst tbody').empty();
	    $('#invoice_product_table_total tbody').empty();
	    let curindex = 0;
	    $.each(resp.delchaldata.delchalContents, function(key, value) {
		$('#invoice_product_table_gst tbody').append('<tr>'+ gsthtml + '</tr>');
		$('.product_name_gst:eq(' + curindex + ')').text(value.proddesc).prop("disabled", true);
		$('.invoice_product_hsncode:eq(' + curindex + ')').html(value.gscode);
		$('.invoice_product_quantity_gst:eq(' + curindex + ')').text(value.qty).attr("data", value.qty);
		$('.invoice_product_freequantity_gst:eq(' + curindex + ')').text(value.freeqty).attr("data", value.freeqty);
		$('.unitaddon_qty_gst:eq(' + curindex + '), .unitaddon_freeqty_gst:eq(' + curindex + ')').text(value.uom);
		$('.invoice_product_per_price_gst:eq(' + curindex + ')').text(value.priceperunit);
		$('.invoice_product_discount_gst:eq(' + curindex + ')').text(value.discount);
		$('.invoice_product_taxablevalue_gst:eq(' + curindex + ')').text(value.taxableamount);
		if(resp.delchaldata.taxname == 'IGST'){
		    $(".sgstfield").hide();
		    $('.invoice_product_igstrate:eq(' + curindex + ')').text(parseFloat(value.taxrate).toFixed(2));
		    $('.invoice_product_igstamount:eq(' + curindex + ')').text(parseFloat(value.taxamount).toFixed(2));
		}
		else{
		    $(".igstfield").hide();
		    $('.invoice_product_sgstrate:eq(' + curindex + ')').text(parseFloat(value.taxrate).toFixed(2));
		    $('.invoice_product_sgstamount:eq(' + curindex + ')').text(parseFloat(value.taxamount).toFixed(2));
		    $('.invoice_product_cgstrate:eq(' + curindex + ')').text(parseFloat(value.taxrate).toFixed(2));
		    $('.invoice_product_cgstamount:eq(' + curindex + ')').text(parseFloat(value.taxamount).toFixed(2));
		}
		$('.invoice_product_cessrate:eq(' + curindex + ')').text(parseFloat(value.cessrate).toFixed(2));
		$('.invoice_product_cessamount:eq(' + curindex + ')').text(parseFloat(value.cess).toFixed(2));
		$("#invoice_product_table_total tbody").append('<tr>'+ totaltablehtml + '</tr>');
		$('#invoice_product_table_total tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
		$('.invoice_product_total_gst:eq(' + curindex + ')').val(parseFloat(value.totalAmount).toFixed(2));
		curindex = curindex + 1;
	    });
	    $('.invoice_product_quantity_gst').numeric({ negative: false });
	    $('.invoice_product_per_price_gst').numeric({ negative: false });
	    $("#invoice_product_table_total tbody tr:first td:last").empty();
	    $("#discounttotal_product_gst").text(parseFloat(resp.delchaldata.totaldiscount).toFixed(2));
	    $("#taxablevaluetotal_product_gst").text(parseFloat(resp.delchaldata.totaltaxablevalue).toFixed(2));
	    $("#totalcgst_product_gst").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#totalsgst_product_gst").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#totaligst_product_gst").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#totalcess_product_gst").text(parseFloat(resp.delchaldata.totalcessamt).toFixed(2));
	    $("#total_product_gst").text(parseFloat(resp.delchaldata.delchaldata.delchaltotal).toFixed(2));
	    $("#taxableamount").text(parseFloat(resp.delchaldata.totaltaxablevalue).toFixed(2));
	    $("#totalinvoicevalue").text(parseFloat(resp.delchaldata.delchaldata.delchaltotal).toFixed(2));
	    $("#totalsgtax").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#totalcgtax").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#totaligtax").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#totalinvdiscount").text(parseFloat(resp.delchaldata.totaldiscount).toFixed(2));
	    $("#totalinvcess").text(parseFloat(resp.delchaldata.totalcessamt).toFixed(2));
	    $(".vatfied").hide();
	    $(".gstfield").show();
	}
	else if (resp.delchaldata.delchaldata.taxflag == 22) {
	    // Loading tax and product details when VAT is applied.
	    $("#taxapplicabletext").text('VAT');
	    $("#tin").text(resp.delchaldata.custSupDetails.custtin);
	    $('#invoice_product_table_vat tbody').empty();
	    let curindex = 0;
	    $.each(resp.delchaldata.delchalContents, function(key, value) {
		$('#invoice_product_table_vat tbody').append('<tr>' + vathtml + '</tr>');
		$('#invoice_product_table_vat tbody tr:last td:last').append('<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
		$('.product_name_vat:eq(' + curindex + ')').text(value.proddesc).prop("disabled", true);
		$('.invoice_product_quantity_vat:eq(' + curindex + ')').text(value.qty).attr("data", value.qty);
		$('.invoice_product_freequantity_vat:eq(' + curindex + ')').text(value.freeqty).attr("data", value.freeqty);
		$('.unitaddon_qty_vat:eq(' + curindex + '), .unitaddon_freeqty_vat:eq(' + curindex + ')').text(value.uom);
		$('.invoice_product_per_price_vat:eq(' + curindex + ')').text(value.priceperunit);
		$('.invoice_product_discount_vat:eq(' + curindex + ')').text(value.discount);
		$('.invoice_product_taxablevalue_vat:eq(' + curindex + ')').text(value.taxableamount);
		$('.invoice_product_tax_rate_vat:eq(' + curindex + ')').text(value.taxrate);
		$('.invoice_product_tax_amount_vat:eq(' + curindex + ')').text(value.taxamount);
		$('.invoice_product_total:eq(' + curindex + ')').text(value.totalAmount);
		curindex = curindex + 1;
	    });
	    $("#invoice_product_table_vat tbody tr:first td:eq(9)").empty();
	    $('.invoice_product_quantity_vat').numeric({ negative: false });
	    $('.invoice_product_per_price_vat').numeric({ negative: false });
	    $("#discounttotal_product_vat").text(parseFloat(resp.delchaldata.totaldiscount).toFixed(2));
	    $("#taxablevaluetotal_product_vat").text(parseFloat(resp.delchaldata.totaltaxablevalue).toFixed(2));
	    $("#totaltax").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#total_product_vat").text(parseFloat(resp.delchaldata.delchaldata.delchaltotal).toFixed(2));
	    $("#totalinvtax").text(parseFloat(resp.delchaldata.totaltaxamt).toFixed(2));
	    $("#totalinvoicevalue").text(parseFloat(resp.delchaldata.delchaldata.delchaltotal).toFixed(2));
	    $("#totalinvdiscount").text(parseFloat(resp.delchaldata.totaldiscount).toFixed(2));
	    $("#taxableamount").text(parseFloat(resp.delchaldata.totaltaxablevalue).toFixed(2));
	    $(".gstfield").hide();
	    $(".vatfield").show();
	}
	    $(".deliverychallan_edit_div").show();
	    $("#deliverychallan_edit_edit").show();
	    $("#deliverychallan_edit_save").hide();
	}else if(resp.delchaldata.stockdata){
	    $(".deliverychallan_OLD_div").show();
	    $("#deliverychallan_OLD_product_div").show();
	    $(".deliverychallan_edit_div").hide();
	    $("#deliverychallan_edit_customer").html(custsup);
	    var dcdatearray = resp.delchaldata.delchaldata.dcdate.split(/\s*\-\s*/g);
	    $("#deliverychallan_edit_date_old").val(dcdatearray[0]);
	    $("#deliverychallan_edit_month").val(dcdatearray[1]);
      $("#deliverychallan_edit_year").val(dcdatearray[2]);
      inout = resp.delchaldata.stockdata.inout;
      if (resp.delchaldata.delchaldata.inoutflag==9) {
        $("#polabel").show();
        $("#slabel").show();
        $("#tgolabel").hide();
        $("#solabel").hide();
        $("#clabel").hide();
        $("#fgolabel").show();
        $("#customersgroup").remove();
        $("label[for='deliverychallan_edit_issuername']").hide();
        $("label[for='deliverychallan_edit_designation']").hide();
        $('#deliverychallan_edit_issuername').hide();
        $('#deliverychallan_edit_designation').hide();
        $("#deliverychallan_editprint").hide();
      }
      else {
        $("#polabel").hide();
        $("#slabel").hide();
        $("#tgolabel").show();
        $("#solabel").show();
        $("#clabel").show();
        $("#fgolabel").hide();
        $("#suppliersgroup").remove();
        $("label[for='deliverychallan_edit_issuername']").show();
        $("label[for='deliverychallan_edit_designation']").show();
        $("#deliverychallan_editprint").show();
        $('#deliverychallan_edit_issuername').show();
        $('#deliverychallan_edit_designation').show();
        $('#deliverychallan_edit_issuername').val(resp.delchaldata.delchaldata.issuername);
        $('#deliverychallan_edit_designation').val(resp.delchaldata.delchaldata.designation);
      }
      $('#deliverychallan_edit_customer_old').val(resp.delchaldata.custSupDetails.custid);
      $("#deliverychallan_customeraddr_old").val(resp.delchaldata.custSupDetails.custaddr);	    
      $.ajax({
        url: '/customersuppliers?action=get',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"custid":resp.delchaldata.custSupDetails.custid},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        if (resp["gkstatus"]==0) {
          if (resp.gkresult.csflag == 3) {
              $('#deliverychallan_edit_challtype').val("OUT");
	      $(".panel-footer").show();
	      $("#deliverychallan_editprint").show();
          }
          else {
              $('#deliverychallan_edit_challtype').val("IN");
	      $("#deliverychallan_editprint").hide();
          }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      $('#deliverychallan_edit_challanno_old').val(resp.delchaldata.delchaldata.dcno);
      $('#deliverychallan_edit_godown_old').val(resp.delchaldata.delchaldata.goid);
	$('#deliverychallan_edit_consignment').val(resp.delchaldata.delchaldata.dcflag);
	if(resp.delchaldata.delchaldata.consignee) {
	   $('#deliverychallan_edit_consigneename').val(resp.delchaldata.delchaldata.consignee.consigneename);
           $('#deliverychallan_edit_consigneestate').val(resp.delchaldata.delchaldata.consignee.consigneestate);
           $('#deliverychallan_edit_consigneeaddr').val(resp.delchaldata.delchaldata.consignee.consigneeaddress); 
	} else {
	   $('#deliverychallan_edit_consigneename').val("");
           $('#deliverychallan_edit_consigneestate').val("");
           $('#deliverychallan_edit_consigneeaddr').val(""); 
	}
      
	    $('#deliverychallan_edit_noofpackages').val(resp.delchaldata.delchaldata.noofpackages);
      $('#deliverychallan_edit_modeoftransport_old').val(resp.delchaldata.delchaldata.modeoftransport);
      $('#deliverychallan_edit_product_table tbody').empty();
      $.each(resp.delchaldata.stockdata, function(key, value) {
        $('#deliverychallan_edit_product_table tbody').append('<tr>'+
        '<td class="col-xs-7">'+
        '<select class="form-control deliverychallan_edit_disable input-sm product_name">'+
        '<option value="'+key+'">'+value.productdesc+'</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-4">'+
        '<div class="input-group">'+
        '<input type="text" class="deliverychallan_edit_product_quantity form-control deliverychallan_edit_disable input-sm text-right" value="'+value.qty+'">'+
          '<span class="input-group-addon input-sm" id="unitaddon">'+value.unitname+'</span>'+
        '</div>'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="product_del deliverychallan_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
      });

      $("#deliverychallan_edit_edit").show();
      $("#deliverychallan_edit_save").hide();

	}
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    $(".deliverychallan_edit_disable").prop("disabled",true);
  });

  $(document).off("keydown", "#deliverychallan_edit_list").on("keydown", "#deliverychallan_edit_list", function(event) {
if(event.which==13)
{

      event.preventDefault();
      $(".btn:first").focus();  
}
  });

  $("#viewattach").click(function(event)
  {
    $.ajax({
      url: '/deliverychallan?action=getattachment',
      type: 'POST',
      datatype: 'json',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      data: {"dcid": $("#deliverychallan_edit_list option:selected").val()}
    })
    .done(function(resp) {
      var x=window.open();
      if (x) {
        //Browser has allowed it to be opened
        x.focus();
        x.document.open();
        x.document.write(resp);
        x.document.close();
      } else {
        //Browser has blocked it
        alert('Please allow popups and retry');
        x.close();
      }

      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });



    $("#deliverychallan_editprint").click(function(event) {
	var dcid = $("#deliverychallan_edit_list option:selected").val();
	$.ajax({
	    url: '/deliverychallan?action=print',
	    type: 'POST',
	    dataType: 'html',
	    data: {"dcid": dcid},
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
    });
});
