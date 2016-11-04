$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.delchaldate').autotab('number');
  $("#deliverychallan_purchaseorder").focus();
  $("#deliverychallan_date").numeric();
  $("#deliverychallan_month").numeric();
  $("#deliverychallan_year").numeric();
  $('.deliverychallan_product_quantity').numeric({ negative: false});
  $("#deliverychallan_purchaseorder").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_customer").focus().select();
    }
  });

  $("#deliverychallan_customer").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_date").focus().select();
    }
    if (event.which==38 && document.getElementById('deliverychallan_customer').selectedIndex==1) {
      $("#deliverychallan_purchaseorder").focus().select();
    }
  });

  $("#deliverychallan_date").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_month").focus().select();
    }
    if (event.which==38) {
      $("#deliverychallan_customer").focus().select();
    }
  });
  $("#deliverychallan_month").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_year").focus().select();
    }
    if (event.which==38) {
      $("#deliverychallan_date").focus().select();
    }
  });

  $("#deliverychallan_year").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_challanno").focus().select();
    }
    if (event.which==38) {
      $("#deliverychallan_month").focus().select();
    }
  });

  $("#deliverychallan_challanno").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_inout").focus().select();
    }
    if (event.which==38) {
      $("#deliverychallan_year").focus().select();
    }
  });

  $("#deliverychallan_inout").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_godown").focus().select();
    }
    if (event.which==38 && $("#deliverychallan_inout option:selected").index()==0) {
      $("#deliverychallan_challanno").focus().select();
    }
  });

  $("#deliverychallan_godown").keydown(function(event) {
    if (event.which==13) {
      $('#deliverychallan_product_table tbody tr:eq(0) td:eq(0) select').focus().select();
    }
    if (event.which==38 && $("#deliverychallan_godown option:selected").index()==0) {
      $("#deliverychallan_inout").focus().select();
    }
  });

  $("#deliverychallan_purchaseorder").change(function(event) {
    if ($("#deliverychallan_purchaseorder option:selected").val()!='') {
      $.ajax({
        url: '/deliverychallan?action=getpurchaseorder',
        type: 'POST',
        dataType: 'json',
        async : false,
        data : {"orderno":$("#deliverychallan_purchaseorder option:selected").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        if (resp["gkstatus"]==0) {
          var podata = resp["podata"];
          $("#deliverychallan_customer").val(podata.csid);
          var deldatearray = podata.datedelivery.split(/\s*\-\s*/g);
          $("#deliverychallan_date").val(deldatearray[0]);
          $("#deliverychallan_month").val(deldatearray[1]);
          $("#deliverychallan_year").val(deldatearray[2]);
          if ($('#deliverychallan_product_table tbody tr').length==1) {
            $('#deliverychallan_product_table tbody tr').remove();
            $.each(podata["productdetails"], function(key, value) {
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
                  $('#deliverychallan_product_table tbody').append('<tr>'+
                  '<td class="col-xs-9">'+
                  '<select class="form-control input-sm product_name"></select>'+
                  '</td>'+
                  '<td class="col-xs-2">'+
                  '<input type="text" class="deliverychallan_product_quantity form-control input-sm text-right" value="">'+
                  '</td>'+
                  '<td class="col-xs-1">'+
                  '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
                  '</td>'+
                  '</tr>');
                  for (product of resp["products"]) {
                    $('#deliverychallan_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
                  }
                  $('#deliverychallan_product_table tbody tr:last td:eq(0) select').val(key);
                  $('#deliverychallan_product_table tbody tr:last td:eq(1) input').val(value);
                }
              })
              .fail(function() {
                console.log("error");
              })
              .always(function() {
                console.log("complete");
              });
              $('.deliverychallan_product_quantity').numeric({ negative: false});
            });
          }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

    }
  });

  $("#deliverychallan_customer").change(function(){
    var selected = $("option:selected", this);
    if(selected.parent()[0].id == "custgroup"){
        $("#deliverychallan_inout").val("15");
    } else if(selected.parent()[0].id == "supgroup"){
        $("#deliverychallan_inout").val("9");
    }
  });

  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#deliverychallan_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#deliverychallan_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_godown").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_godown").focus().select();
      }
      else {
        $('#deliverychallan_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".deliverychallan_product_quantity").on("keydown",".deliverychallan_product_quantity",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#deliverychallan_product_table tbody tr").length-1)) {
        $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
      }
      else {
        if ($('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
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
            $('#deliverychallan_product_table tbody').append('<tr>'+
            '<td class="col-xs-9">'+
            '<select class="form-control input-sm product_name"></select>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="deliverychallan_product_quantity form-control input-sm text-right" value="">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
            '</tr>');
            for (product of resp["products"]) {
              $('#deliverychallan_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
            }
            $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
            $('.deliverychallan_product_quantity').numeric({ negative: false});
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
      $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#deliverychallan_product_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
      if (curindex1==0) {
        event.preventDefault();
        $("#deliverychallan_godown").focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#deliverychallan_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      $('#deliverychallan_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
      event.preventDefault();
    }
  });


  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#deliverychallan_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#deliverychallan_product_table tbody tr:last td:eq(0) input').select();
  });
  $("#deliverychallan_save").click(function(event) {
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#deliverychallan_customer').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_date').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_month').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#deliverychallan_year').focus();
      return false;
    }
    if(!Date.parseExact($("#deliverychallan_date").val()+$("#deliverychallan_month").val()+$("#deliverychallan_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#deliverychallan_date').focus().select();
      return false;
    }
    if ($.trim($('#deliverychallan_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#deliverychallan_challanno').focus();
      return false;
    }
    var products = [];
    for (var i = 0; i < $("#deliverychallan_product_table tbody tr").length; i++) {
      if ($("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      var obj = {};
      obj.productcode = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj);
    }
    $.ajax({
      url: '/deliverychallan?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"orderno": $("#deliverychallan_purchaseorder option:selected").val(),
      "custid":$("#deliverychallan_customer option:selected").val(),
      "dcno":$("#deliverychallan_challanno").val(),
      "dcdate":$("#deliverychallan_year").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_date").val(),
      "inout":$("#deliverychallan_inout option:selected").val(),
      "goid":$("#deliverychallan_godown option:selected").val(),
      "products":JSON.stringify(products)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#deliverychallan_create").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      else {
        $("#deliverychallan_purchaseorder").focus();
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

  });
});
