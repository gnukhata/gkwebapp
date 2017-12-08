/*
  Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
 Copyright (C) 2017 Digital Freedom Foundation & Accion Labs Pvt. Ltd.
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
        $("#viewattach").show();
      }
      else{
        $("#viewattach").hide();
      }
      $("#deliverychallan_edit_customer").html(custsup);
      var dcdatearray = resp.delchaldata.delchaldata.dcdate.split(/\s*\-\s*/g);
      $("#deliverychallan_edit_date").val(dcdatearray[0]);
      $("#deliverychallan_edit_month").val(dcdatearray[1]);
      $("#deliverychallan_edit_year").val(dcdatearray[2]);
      inout = resp.delchaldata.stockdata.inout;
      if (resp.delchaldata.stockdata.inout==9) {
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
      $('#deliverychallan_edit_customer').val(resp.delchaldata.delchaldata.custid);
      $.ajax({
        url: '/customersuppliers?action=get',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"custid":resp.delchaldata.delchaldata.custid},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        if (resp["gkstatus"]==0) {
          $("#deliverychallan_customeraddr").val(resp["gkresult"]["custaddr"]);
          if (resp.gkresult.csflag == 3) {
            $('#deliverychallan_edit_challtype').val("OUT");
          }
          else {
            $('#deliverychallan_edit_challtype').val("IN");
          }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      $('#deliverychallan_edit_challanno').val(resp.delchaldata.delchaldata.dcno);
      $('#deliverychallan_edit_godown').val(resp.delchaldata.delchaldata.goid);
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
      $('#deliverychallan_edit_modeoftransport').val(resp.delchaldata.delchaldata.modeoftransport);
      $('#deliverychallan_edit_product_table tbody').empty();
      $.each(resp.delchaldata.stockdata.items, function(key, value) {
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

      $(".deliverychallan_edit_div").show();
      $(".panel-footer").show();
      $("#deliverychallan_edit_edit").show();
      $("#deliverychallan_edit_save").hide();
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
 let printset = [];
    let qtytotal =0;
    var consignee = {};
    if($("#deliverychallan_edit_consigneename").val() != ""){
	  consignee["consigneename"] = $.trim($("#deliverychallan_edit_consigneename").val());
          consignee["consigneeaddress"] = $.trim($("#deliverychallan_edit_consigneeaddr").val());
          consignee["consigneestate"] = $.trim($("#deliverychallan_edit_consigneestate").val());
      }
  for (var i = 0; i < $("#deliverychallan_edit_product_table tbody tr").length; i++) {
    var obj = {};

    obj.productdesc = $("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text();
    obj.qty = $("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(1) input").val();
    obj.unitname = $("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(1) span").text();
    qtytotal += +obj.qty;
    printset.push(obj);
  }
  $.ajax({
    url: '/deliverychallan?action=print',
    type: 'POST',
    dataType: 'html',
    data: {"dcno": $("#deliverychallan_edit_challanno").val(),
    "custid":$("#deliverychallan_edit_customer option:selected").val(),
    "dcdate":$("#deliverychallan_edit_date").val()+'-'+$("#deliverychallan_edit_month").val()+'-'+$("#deliverychallan_edit_year").val(),
    "printset":JSON.stringify(printset),
    "consignee":JSON.stringify(consignee),
    "issuername":$("#deliverychallan_edit_issuername").val(),
    "designation":$("#deliverychallan_edit_designation").val(),
    "goid":$("#deliverychallan_edit_godown option:selected").val(),
    "notetype":$("#deliverychallan_edit_consignment option:selected").text(),
    "qtytotal":qtytotal
    },
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
