$(document).ready(function() {
  $('.modal-backdrop').remove();
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
      if(resp.gkresult.hasOwnProperty("dcno")){
          $("#rejectionnote_consignment").val(resp.gkresult.transactiontype);
      }
      else{
        $("#rejectionnote_consignment").val("None");
      }
      if(resp.gkresult.hasOwnProperty("custname")){
        $("#rejectionnote_customer").val(resp.gkresult.custname);
        $("#rejectionnote_customeraddr").val(resp.gkresult.custaddr);
        $("#rejectionnote_customertin").val(resp.gkresult.custtin);
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
      $('#rejectionnote_product_table tbody').empty();
      $.each(resp.gkresult.rejected, function(key, value) {
        $('#rejectionnote_product_table tbody').append('<tr>'+
        '<td class="col-xs-6">' +
        '<input class="form-control input-sm product_name" data-productcode="' + key + '" value="' + value.productdesc + '" disabled>' +
        '</td>' +
        '<td class="col-xs-5">' +
        '<div class="input-group">' +
        '<input type="text" class="rejectionnote_product_rejected_quantity numtype form-control input-sm text-right" data="' + value.qty + '" value="' + value.qty + '" disabled>' +
        '<span class="input-group-addon input-sm" id="unitaddon">' + value.unitname + '</span>' +
        '</div>' +
        '</td>' +
        '<td class="col-xs-1">' +
        '</td>' +
        '</tr>');
      });

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
