$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.delchaldate').autotab('number');
  $("#deliverychallan_edit_list").focus();
  $("#deliverychallan_edit_date").numeric();
  $("#deliverychallan_edit_month").numeric();
  $("#deliverychallan_edit_year").numeric();
  $('.deliverychallan_edit_product_quantity').numeric({ negative: false});
  $(".deliverychallan_edit_disable").prop("disabled",true);
  var custsup  =$("#deliverychallan_edit_customer").find('optgroup').clone();

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
      $("#deliverychallan_edit_customer").html(custsup);
      var dcdatearray = resp.delchaldata.delchaldata.dcdate.split(/\s*\-\s*/g);
      $("#deliverychallan_edit_date").val(dcdatearray[0]);
      $("#deliverychallan_edit_month").val(dcdatearray[1]);
      $("#deliverychallan_edit_year").val(dcdatearray[2]);
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
        $('#deliverychallan_edit_issuername').show();
        $('#deliverychallan_edit_designation').show();
        $('#deliverychallan_edit_issuername').val(resp.delchaldata.delchaldata.issuername);
        $('#deliverychallan_edit_designation').val(resp.delchaldata.delchaldata.designation);
      }
      $('#deliverychallan_edit_customer').val(resp.delchaldata.delchaldata.custid);
      $('#deliverychallan_edit_challanno').val(resp.delchaldata.delchaldata.dcno);
      $('#deliverychallan_edit_godown').val(resp.delchaldata.delchaldata.goid);
      $('#deliverychallan_edit_consignment').val(resp.delchaldata.delchaldata.dcflag);
      $('#deliverychallan_edit_product_table tbody').empty();
      $.each(resp.delchaldata.stockdata.items, function(key, value) {
        $('#deliverychallan_edit_product_table tbody').append('<tr>'+
        '<td class="col-xs-9">'+
        '<select class="form-control deliverychallan_edit_disable input-sm product_name">'+
        '<option value="'+key+'">'+value.productdesc+'</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-2">'+
        '<input type="text" class="deliverychallan_edit_product_quantity form-control deliverychallan_edit_disable input-sm text-right" value="'+value.qty+'">'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="product_del deliverychallan_edit_disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
      });

      $(".deliverychallan_edit_div").show();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    $(".deliverychallan_edit_disable").prop("disabled",true);
  });

  $("#deliverychallan_edit_list").keydown(function(event) {
    if (event.which==13) {
      if ($("#deliverychallan_edit_list option:selected").val()!='' && event.which=='13') {
        $("#deliverychallan_edit_product_table > tbody >tr").each(function(i, tr) {
          alert(tr+i);
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
              '<td class="col-xs-9">'+
              '<select class="form-control input-sm product_name"></select>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input type="text" class="deliverychallan_edit_product_quantity form-control input-sm text-right" value="">'+
              '</td>'+
              '<td class="col-xs-1">'+
              '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
              '</td>'+
              '</tr>');
              for (product of resp["products"]) {
                $('#deliverychallan_edit_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
              }
              $('#deliverychallan_edit_product_table tbody tr:last td:eq(0) select').val(key);
              $('#deliverychallan_edit_product_table tbody tr:last td:eq(1) input').val(value.qty);
            }
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });
          $('.deliverychallan_edit_product_quantity').numeric({ negative: false});
        });
      }
      event.preventDefault();
      $("#deliverychallan_edit_challanno").focus().select();
    }
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



  $(document).keydown(function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#deliverychallan_edit_save").click();
      return false;
    }
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
            '<td class="col-xs-9">'+
            '<select class="form-control input-sm product_name"></select>'+
            '</td>'+
            '<td class="col-xs-2">'+
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
    if ($.trim($('#deliverychallan_edit_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#deliverychallan_edit_customer').focus();
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
    if ($.trim($('#deliverychallan_edit_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#deliverychallan_edit_challanno').focus();
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
    if($("#deliverychallan_edit_customer option:selected").parent()[0].id == "custgroup"){
      var inout = 15;
    } else if($("#deliverychallan_edit_customer option:selected").parent()[0].id == "supgroup"){
      var inout = 9;
    }
    $.ajax({
      url: '/deliverychallan?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"orderid": $("#deliverychallan_edit_purchaseorder option:selected").val(),
      "custid":$("#deliverychallan_edit_customer option:selected").val(),
      "dcno":$("#deliverychallan_edit_challanno").val(),
      "dcdate":$("#deliverychallan_edit_year").val()+'-'+$("#deliverychallan_edit_month").val()+'-'+$("#deliverychallan_edit_date").val(),
      "inout":inout,
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
        $("#deliverychallan_edit_create").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      else {
        $("#deliverychallan_edit_purchaseorder").focus();
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
});
