$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.delchaldate').autotab('number');
  $("#deliverychallan_challanno").focus();
  $("#deliverychallan_date").numeric();
  $("#deliverychallan_month").numeric();
  $("#deliverychallan_year").numeric();
  $('.deliverychallan_product_quantity').numeric({ negative: false});

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
  $("#deliverychallan_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#deliverychallan_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#deliverychallan_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  $("#deliverychallan_purchaseorder").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_challanno").focus().select();
    }
  });

  $("#deliverychallan_customer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_godown").focus().select();
    }
    if (event.which==38 && (document.getElementById('deliverychallan_customer').selectedIndex==1||document.getElementById('deliverychallan_customer').selectedIndex==0)) {
      event.preventDefault();
      $("#deliverychallan_year").focus().select();
    }
  });

  $("#deliverychallan_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_challanno").focus().select();
    }
  });
  $("#deliverychallan_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_date").focus().select();
    }
  });

  $("#deliverychallan_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_customer").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_month").focus().select();
    }
  });

  $("#deliverychallan_challanno").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#deliverychallan_date").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_purchaseorder").focus().select();
    }
  });

  $("#deliverychallan_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_consignment').focus();
    }
    if (event.which==38 && $("#deliverychallan_godown option:selected").index()==0) {
      event.preventDefault();
      $("#deliverychallan_customer").focus().select();
    }
  });

  $("#deliverychallan_consignment").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:first td:eq(0) select').focus();
    }
    if (event.which==38 && document.getElementById('deliverychallan_consignment').selectedIndex==0) {
      event.preventDefault();
      $("#deliverychallan_godown").focus().select();
    }
  });
  $("#deliverychallan_issuername").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_designation').focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $('#deliverychallan_product_table tbody tr:last td:eq(0) select').focus();
    }
  });
  $("#deliverychallan_designation").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_save').click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#deliverychallan_issuername").focus().select();
    }
  });



  $(document).off("keyup").on("keyup",function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#deliverychallan_save").click();
      return false;
    }
  });


  $("#deliverychallan_purchaseorder").change(function(event) {
    if ($("#deliverychallan_purchaseorder option:selected").val()!='') {
      $.ajax({
        url: '/deliverychallan?action=getpurchaseorder',
        type: 'POST',
        dataType: 'json',
        async : false,
        data : {"orderid":$("#deliverychallan_purchaseorder option:selected").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        if (resp["gkstatus"]==0) {
          var podata = resp["podata"];
          $("#deliverychallan_customer").val(podata.csid);
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
                  $('#deliverychallan_product_table tbody tr:last td:eq(1) input').val(value.qty);
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
        $("#deliverychallan_schedule").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        $("#deliverychallan_schedule").focus().select();
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
        $("#deliverychallan_schedule").focus().select();
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
    else if (event.which==35) {
      event.preventDefault();
      $("#deliverychallan_issuername").focus().select();
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
    event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#deliverychallan_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#deliverychallan_challanno').focus();
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
    if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#deliverychallan_customer').focus();
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
      if ($("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      var obj = {};
      obj.productcode = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj);
    }
    if ($.trim($('#deliverychallan_issuername').val())=="" && $("#status").val()=='15') {
      $("#issuername-blank-alert").alert();
      $("#issuername-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#issuername-blank-alert").hide();
      });
      $('#deliverychallan_issuername').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_designation').val())=="" && $("#status").val()=='15') {
      $("#designation-blank-alert").alert();
      $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#designation-blank-alert").hide();
      });
      $('#deliverychallan_designation').focus();
      return false;
    }
    $.ajax({
      url: '/deliverychallan?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid":$("#deliverychallan_customer option:selected").val(),
      "dcno":$("#deliverychallan_challanno").val(),
      "dcdate":$("#deliverychallan_year").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_date").val(),
      "inout":$("#status").val(),
      "issuername":$("#deliverychallan_issuername").val(),
      "designation":$("#deliverychallan_designation").val(),
      "goid":$("#deliverychallan_godown option:selected").val(),
      "products":JSON.stringify(products),
      "dcflag":$("#deliverychallan_consignment option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        if ($("#status").val()=='9') {
          $("#deliverychallan_record").click();
        }
        else {
          $("#deliverychallan_create").click();
        }
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
        return false;
      }
      else if(resp["gkstatus"]==1) {
        $("#deliverychallan_challanno").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#deliverychallan_purchaseorder").focus();
        $("#failure-alert").alert();
        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert").hide();
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

    return false;
  });

  $("#deliverychallan_saveprint").click(function(event) {
    event.stopPropagation();
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#deliverychallan_challanno').val())=="") {
      $("#challanno-blank-alert").alert();
      $("#challanno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#challanno-blank-alert").hide();
      });
      $('#deliverychallan_challanno').focus();
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
    if ($.trim($('#deliverychallan_customer option:selected').val())=="") {
      $("#custsup-blank-alert").alert();
      $("#custsup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#custsup-blank-alert").hide();
      });
      $('#deliverychallan_customer').focus();
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
      if ($("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      var obj = {};
      obj.productcode = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj);
    }
    if ($.trim($('#deliverychallan_issuername').val())=="" && $("#status").val()=='15') {
      $("#issuername-blank-alert").alert();
      $("#issuername-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#issuername-blank-alert").hide();
      });
      $('#deliverychallan_issuername').focus();
      return false;
    }
    if ($.trim($('#deliverychallan_designation').val())=="" && $("#status").val()=='15') {
      $("#designation-blank-alert").alert();
      $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#designation-blank-alert").hide();
      });
      $('#deliverychallan_designation').focus();
      return false;
    }
    $.ajax({
      url: '/deliverychallan?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custid":$("#deliverychallan_customer option:selected").val(),
      "dcno":$("#deliverychallan_challanno").val(),
      "dcdate":$("#deliverychallan_year").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_date").val(),
      "inout":$("#status").val(),
      "issuername":$("#deliverychallan_issuername").val(),
      "designation":$("#deliverychallan_designation").val(),
      "goid":$("#deliverychallan_godown option:selected").val(),
      "products":JSON.stringify(products),
      "dcflag":$("#deliverychallan_consignment option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        if ($("#status").val()=='15') {
          printset = [];
          qtytotal =0;
          for (var i = 0; i < $("#deliverychallan_product_table tbody tr").length; i++) {
            var obj = {};

            obj.productdesc = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text();
            obj.qty = $("#deliverychallan_product_table tbody tr:eq("+i+") td:eq(1) input").val();
            qtytotal += +obj.qty;
            printset.push(obj);
          }
          $.ajax({
            url: '/deliverychallan?action=print',
            type: 'POST',
            dataType: 'html',
            data: {"dcno": $("#deliverychallan_challanno").val(),
            "custid":$("#deliverychallan_customer option:selected").val(),
            "dcdate":$("#deliverychallan_month").val()+'-'+$("#deliverychallan_month").val()+'-'+$("#deliverychallan_year").val(),
            "printset":JSON.stringify(printset),
            "issuername":$("#deliverychallan_issuername").val(),
            "designation":$("#deliverychallan_designation").val(),
            "goid":$("#deliverychallan_godown option:selected").val(),
            "notetype":$("#deliverychallan_consignment option:selected").text(),
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
      }
    }
      else if(resp["gkstatus"]==1) {
        $("#deliverychallan_challanno").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#deliverychallan_purchaseorder").focus();
        $("#failure-alert").alert();
        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert").hide();
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

    return false;
  });

  $("#deliverychallan_reset").click(function(event) {
    if ($("#status").val()=='9') {
      $("#deliverychallan_record").click();
    }
    else {
      $("#deliverychallan_create").click();
    }
  });
});
