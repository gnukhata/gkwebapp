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
        $("#tgolabel").show();
        $("#solabel").hide();
        $("#clabel").hide();
        $("#fgolabel").hide();
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
        $("#tgolabel").hide();
        $("#solabel").show();
        $("#clabel").show();
        $("#fgolabel").show();
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
      data: {"dcid": $("#deliverychallan_edit_list option:selected").val()},
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

  $("#deliverychallan_edit_list").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_editprint").focus();
      event.preventDefault();
    }
  });
  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
    }
  }
  function yearpad (str, max) {
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("200" + str, max) : str;
    }
    else if (str.length==2) {
      return str.length < max ? pad("20" + str, max) : str;
    }
    else{
      return str
    }
  }
  $("#deliverychallan_edit_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#deliverychallan_edit_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#deliverychallan_edit_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#deliverychallan_edit_customer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_edit_godown").focus().select();
    }
    if (event.which==38 && document.getElementById('deliverychallan_edit_customer').selectedIndex==0) {
      event.preventDefault();
      $("#deliverychallan_edit_year").focus().select();
    }
  });

  $("#deliverychallan_edit_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_edit_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_edit_challanno").focus().select();
    }
  });
  $("#deliverychallan_edit_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_edit_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_edit_date").focus().select();
    }
  });

  $("#deliverychallan_edit_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_edit_customer").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_edit_month").focus().select();
    }
  });

  $("#deliverychallan_edit_challanno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_edit_date").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_edit_list").focus().select();
    }
  });

  $("#deliverychallan_edit_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_edit_consignment').focus();
    }
    if (event.which==38 && $("#deliverychallan_edit_godown option:selected").index()==0) {
      event.preventDefault();
      $("#deliverychallan_edit_customer").focus().select();
    }
  });

  $("#deliverychallan_edit_consignment").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_edit_product_table tbody tr:first td:eq(0) select').focus();
    }
    if (event.which==38 && document.getElementById('deliverychallan_edit_consignment').selectedIndex==0) {
      event.preventDefault();
      $("#deliverychallan_edit_godown").focus().select();
    }
  });



  $(document).off("keyup").on("keyup",function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#deliverychallan_edit_save").click();
      return false;
    }
  });

  $("#deliverychallan_edit_edit").click(function(event) {
    $(".deliverychallan_edit_disable").prop("disabled",false);
    $("#deliverychallan_edit_challanno").focus().select();
    $("#deliverychallan_edit_save").show();
    $("#deliverychallan_edit_edit").hide();
  });

  $("#deliverychallan_edit_reset").click(function(event) {
    $("#deliverychallan_edit").click();
  });


  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_edit_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#deliverychallan_edit_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#deliverychallan_edit_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_edit_schedule").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_edit_schedule").focus().select();
      }
      else {
        $('#deliverychallan_edit_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_edit_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".deliverychallan_edit_product_quantity").on("keydown",".deliverychallan_edit_product_quantity",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#deliverychallan_edit_product_table tbody tr").length-1)) {
        $('#deliverychallan_edit_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
      }
      else {
        if ($('#deliverychallan_edit_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#deliverychallan_edit_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
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
            $('#deliverychallan_edit_product_table tbody').append('<tr>'+
            '<td class="col-xs-7">'+
            '<select class="form-control input-sm product_name"></select>'+
            '</td>'+
            '<td class="col-xs-4">'+
            '<input type="text" class="deliverychallan_edit_product_quantity form-control input-sm text-right" value="">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
            '</tr>');
            for (product of resp["products"]) {
              $('#deliverychallan_edit_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
            }
            $('#deliverychallan_edit_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
            $('.deliverychallan_edit_product_quantity').numeric({ negative: false});
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

    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#deliverychallan_edit_product_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#deliverychallan_edit_product_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
      if (curindex1==0) {
        event.preventDefault();
        $("#deliverychallan_edit_schedule").focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_edit_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      $('#deliverychallan_edit_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
      event.preventDefault();
    }
  });


  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#deliverychallan_edit_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#deliverychallan_edit_product_table tbody tr:last td:eq(0) input').select();
  });
  $("#deliverychallan_edit_save").click(function(event) {
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#deliverychallan_edit_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#deliverychallan_edit_challanno').focus();
      return false;
    }

    if ($.trim($('#deliverychallan_edit_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_edit_date').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_edit_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_edit_month').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_edit_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_edit_year').focus();
      return false;
    }
    if(!Date.parseExact($("#deliverychallan_edit_date").val()+$("#deliverychallan_edit_month").val()+$("#deliverychallan_edit_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#deliverychallan_edit_date').focus().select();
      return false;
    }
    if ($.trim($('#deliverychallan_edit_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#deliverychallan_edit_customer').focus();
      return false;
    }
    var products = [];
    for (var i = 0; i < $("#deliverychallan_edit_product_table tbody tr").length; i++) {
      if ($("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      if ($("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      var obj = {};
      obj.productcode = $("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#deliverychallan_edit_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj);
    }

    if ($.trim($('#deliverychallan_issuername').val())=="" && inout=='15') {
      $("#issuername-blank-alert").alert();
      $("#issuername-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#issuername-blank-alert").hide();
      });
      $('#deliverychallan_issuername').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_designation').val())=="" && inout=='15') {
      $("#designation-blank-alert").alert();
      $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#designation-blank-alert").hide();
      });
      $('#deliverychallan_designation').focus();
      return false;
    }

    $.ajax({
      url: '/deliverychallan?action=edit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {
      "custid":$("#deliverychallan_edit_customer option:selected").val(),
      "dcno":$("#deliverychallan_edit_challanno").val(),
      "dcdate":$("#deliverychallan_edit_year").val()+'-'+$("#deliverychallan_edit_month").val()+'-'+$("#deliverychallan_edit_date").val(),
      "inout":inout,
      "dcid":$("#deliverychallan_edit_list option:selected").val(),
      "goid":$("#deliverychallan_edit_godown option:selected").val(),
      "products":JSON.stringify(products),
      "dcflag":$("#deliverychallan_edit_consignment option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#deliverychallan_edit").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      else {
        $("#deliverychallan_edit_challanno").focus();
        $("#failure-alert").alert();
        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert").hide();
        });
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    event.stopPropogation();
  });

  $("#deliverychallan_edit_delete").click(function(event) {
    event.preventDefault();
    if ($("#deliverychallan_edit_list option:selected").val()!='') {
      $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_del').modal('show').one('click', '#deldel', function (e)
    {
    $.ajax({
      url: '/deliverychallan?action=delete',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"dcid": $("#deliverychallan_edit_list option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#deliverychallan_edit").click();
        $("#success-delete-alert").alert();
        $("#success-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-delete-alert").hide();
        });
        return false;
      }
      if(resp["gkstatus"] == 5) {
        $("#deliverychallan_edit_list").focus();
        $("#failure-delete-alert").alert();
        $("#failure-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-delete-alert").hide();
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
  });
    $("#confirm_del").on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
      });
    $("#confirm_del").on('hidden.bs.modal', function(event) {
      $("#deliverychallan_edit_list").focus();
});
}
});

$("#deliverychallan_editprint").click(function(event) {
  printset = [];
  qtytotal =0;
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
    "issuername":$("#deliverychallan_edit_issuername").val(),
    "designation":$("#deliverychallan_edit_designation").val(),
    "goid":$("#deliverychallan_edit_godown option:selected").val(),
    "notetype":$("#deliverychallan_edit_consignment option:selected").text(),
    "qtytotal":qtytotal,
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
