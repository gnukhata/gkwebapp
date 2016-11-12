$(document).ready(function() {
  $('.modal-backdrop').remove();
  $('.tndate').autotab('number');
  $("#transfernote_no").focus();
  $("#tn_date").numeric();
  $("#tn_month").numeric();
  $("#tn_year").numeric();
  $("#no_of_packet").numeric();
  $('.transfernote_product_quantity').numeric({ negative: false});
  $("#transfernote_no").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_date").focus().select();
    }
  });

  $("#tn_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#transfernote_no").focus().select();
    }
  });

  $("#tn_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_date").focus().select();
    }
  });
  $("#tn_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#transfernote_product_table tbody tr:first td:eq(0) select').focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_month").focus().select();
    }
  });

  $("#transport_mode").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#name_issuer").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_to_godown").focus().select();
    }
  });

  $("#tn_from_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_to_godown").focus().select();
    }
    if (event.which==38 && (document.getElementById('tn_from_godown').selectedIndex==1||document.getElementById('tn_from_godown').selectedIndex==0)) {
      event.preventDefault();
      $("#no_of_packet").focus().select();
    }
  });

  $("#tn_to_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#transport_mode").focus();
    }
    if (event.which==38 && (document.getElementById('tn_to_godown').selectedIndex==1||document.getElementById('tn_to_godown').selectedIndex==0)) {
      event.preventDefault();
      $("#tn_from_godown").focus().select();
    }
  });

  $("#no_of_packet").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_from_godown").focus().select
    }
  });
  $("#name_issuer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#designation").focus().select
    }
    if (event.which==38) {
      event.preventDefault();
      $("#transport_mode").focus().select();
    }
  });

  $("#designation").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#transfernote_save").click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#name_issuer").focus().select();
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
    $("#tn_date").blur(function(event) {
      $(this).val(pad($(this).val(),2));
    });
    $("#tn_month").blur(function(event) {
      $(this).val(pad($(this).val(),2));
    });

    $("#tn_year").blur(function(event) {
      $(this).val(yearpad($(this).val(),4));
      });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#transfernote_save").click();
      event.preventDefault();
      return false;
    }
  });

  $("#transfernote_reset").click(function(event) {
    $("#transfernote_create").click();
  });

  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==13) {
      event.preventDefault();
      $('#transfernote_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
    else if(event.which==190 && event.shiftKey)
    {
      $('#transfernote_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#transfernote_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        $("#no_of_packet").focus().select();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        $("#no_of_packet").focus().select();
      }
      else {
        $('#transfernote_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#transfernote_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".transfernote_product_quantity").on("keydown",".transfernote_product_quantity",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#transfernote_product_table tbody tr").length-1)) {
        $('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
      }
      else {
        if ($('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
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
            $('#transfernote_product_table tbody').append('<tr>'+
            '<td class="col-xs-9">'+
            '<select class="form-control input-sm product_name"></select>'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<input type="text" class="transfernote_product_quantity form-control input-sm text-right" value="">'+
            '</td>'+
            '<td class="col-xs-1">'+
            '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
            '</tr>');
            for (product of resp["products"]) {
              $('#transfernote_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
            }
            $('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
            $('.transfernote_product_quantity').numeric({ negative: false});
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
      $('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#transfernote_product_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
      if (curindex1==0) {
        event.preventDefault();
        $("#no_of_packet").focus().select();
      }
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      $('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
      event.preventDefault();
    }
    else if (event.which==35) {
      event.preventDefault();
      $('#no_of_packet').focus().select();
    }
  });


  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#transfernote_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#transfernote_product_table tbody tr:last td:eq(0) input').select();
  });

  $("#transfernote_save").click(function(event) {
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#transfernote_no').val())=="") {
      $("#tnno-blank-alert").alert();
      $("#tnno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tnno-blank-alert").hide();
      });
      $('#transfernote_no').focus();
      return false;
    }
    if ($.trim($('#tn_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#tn_date').focus();
      return false;
    }
    if ($.trim($('#tn_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#tn_month').focus();
      return false;
    }
    if ($.trim($('#tn_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#tn_year').focus();
      return false;
    }
    if(!Date.parseExact($("#tn_date").val()+$("#tn_month").val()+$("#tn_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#tn_date').focus().select();
      return false;
    }
    if ($.trim($('#tn_from_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-blank-alert").hide();
      });
      $('#tn_from_godown').focus();
      return false;
    }
    if ($.trim($('#tn_to_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-blank-alert").hide();
      });
      $('#tn_to_godown').focus();
      return false;
    }
    if ($.trim($('#tn_from_godown').val())==$('#tn_to_godown').val()) {
      $("#godown-same-alert").alert();
      $("#godown-same-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-same-alert").hide();
      });
      $('#tn_from_godown').focus();
      return false;
    }



    var products = [];
    for (var i = 0; i < $("#transfernote_product_table tbody tr").length; i++) {
      if ($("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      if ($("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }
      var obj = {};
      obj.productcode = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj);
    }
    $.ajax({
      url: '/transfernotes?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {
      "transfernoteno":$("#transfernote_no").val(),
      "transfernotedate":$("#tn_year").val()+'-'+$("#tn_month").val()+'-'+$("#tn_date").val(),
      "fromgodown":$("#tn_from_godown option:selected").val(),
      "togodown":$("#tn_to_godown option:selected").val(),
      "transportationmode":$("#transport_mode").val(),
      "nopkt":$("#no_of_packet").val(),
      "issuername":$("#name_issuer").val(),
      "designation":$("#designation").val(),
      "products":JSON.stringify(products)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#transfernote_create").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      if(resp["gkstatus"] == 1){
        $("#transfernote_no").focus();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
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
