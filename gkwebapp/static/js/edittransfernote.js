$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#edit_tn_list").focus();
  $(".hidden-load").hide();
  $(".disable").prop("disabled", true);

  $("#edit_tn_list").change(function(event) {
    var tnid = $("#edit_tn_list option:selected").val();
    if (tnid != "") {

    $.ajax({
      url: '/transfernotes?action=get',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"transfernoteid": tnid },
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      var result = resp["gkresult"];

      $(".hidden-load").show();
      $("#edit_transfernote_no").val(result["transfernoteno"]);

      $("#edit_transport_mode").val(result["transportationmode"]);
      $("#edit_tn_from_godown").val(result["fromgodownid"]);
      $("#edit_tn_to_godown").val(result["togodownid"]);
      $("#edit_no_of_packet").val(result["nopkt"]);
      $("#edit_name_issuer").val(result["issuername"]);
      $("#edit_designation").val(result["designation"]);
      $(".panel-footer").show();
      $("#edit_transfernote_save").hide();
      $("#edit_btn").show();
      var deldatearray = result.transfernotedate.split(/\s*\-\s*/g);
      $("#edit_tn_date").val(deldatearray[0]);
      $("#edit_tn_month").val(deldatearray[1]);
      $("#edit_tn_year").val(deldatearray[2]);
      if ($('#transfernote_product_table tbody tr').length==0) {
        $('#transfernote_product_table tbody tr').remove();
        $.each(result["productdetails"], function(key, value) {
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
              '<select class="form-control input-sm product_name disable"></select>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input type="text" class="transfernote_product_quantity form-control input-sm text-right disable" value="">'+
              '</td>'+
              '<td class="col-xs-1">'+
              '<a href="#" class="product_del disable"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
              '</td>'+
              '</tr>');
              for (product of resp["products"]) {
                $('#transfernote_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
              }
              $('#transfernote_product_table tbody tr:last td:eq(0) select').val(key);
              $('#transfernote_product_table tbody tr:last td:eq(1) input').val(value.qty);
            }
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });
          $('.transfernote_product_quantity').numeric({ negative: false});
        });
      }


    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  }
    $(".disable").prop("disabled", true);

  });
  $("#edit_tn_list").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $(".disable").prop("disabled", false);
      $("#edit_transfernote_no").focus().select();
      $("#edit_btn").hide();
      $("#edit_transfernote_save").show();



    }
  });
  $("#edit_transfernote_no").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_tn_date").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_tn_list").focus().select();
    }
  });
  $("#edit_tn_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_tn_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_transfernote_no").focus().select();
    }
  });

  $("#edit_tn_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_tn_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_tn_date").focus().select();
    }
  });
  $("#edit_tn_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#transfernote_product_table tbody tr:first td:eq(0) select').focus();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_tn_month").focus().select();
    }
  });

  $("#edit_transport_mode").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_name_issuer").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_tn_to_godown").focus().select();
    }
  });

  $("#edit_tn_from_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_tn_to_godown").focus().select();
    }
    if (event.which==38 && (document.getElementById('edit_tn_from_godown').selectedIndex==1||document.getElementById('edit_tn_from_godown').selectedIndex==0)) {
      event.preventDefault();
      $("#edit_no_of_packet").focus().select();
    }
  });

  $("#edit_tn_to_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_transport_mode").focus();
    }
    if (event.which==38 && (document.getElementById('edit_tn_to_godown').selectedIndex==1||document.getElementById('edit_tn_from_godown').selectedIndex==0)) {
      event.preventDefault();
      $("#edit_tn_from_godown").focus().select();
    }
  });

  $("#edit_no_of_packet").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_tn_from_godown").focus().select
    }
  });
  $("#edit_name_issuer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_designation").focus().select
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_transport_mode").focus().select();
    }
  });

  $("#edit_designation").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_transfernote_save").click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_name_issuer").focus().select();
    }
    });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#edit_transfernote_save").click();
      event.preventDefault();
      return false;
    }
  });


  $("#edit_btn").click(function(event) {
      event.preventDefault();
      $(".disable").prop("disabled", false);
      $("#edit_transfernote_no").focus().select();
      $("#edit_btn").hide();
      $("#edit_transfernote_save").show();


  });

  $("#edit_transfernote_reset").click(function(event) {
    $("#transfernote_edit").click();
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
        $("#edit_no_of_packet").focus().select();
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
      $('#edit_no_of_packet').focus().select();
    }
  });
  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#transfernote_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#transfernote_product_table tbody tr:last td:eq(0) input').select();
  });


  $("#edit_transfernote_save").click(function(event) {
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    if ($.trim($('#edit_transfernote_no').val())=="") {
      $("#tnno-blank-alert").alert();
      $("#tnno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tnno-blank-alert").hide();
      });
      $('#edit_transfernote_no').focus();
      return false;
    }
    if ($.trim($('#edit_tn_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#edit_tn_date').focus();
      return false;
    }
    if ($.trim($('#edit_tn_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#edit_tn_month').focus();
      return false;
    }
    if ($.trim($('#edit_tn_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#edit_tn_year').focus();
      return false;
    }
    if(!Date.parseExact($("#edit_tn_date").val()+$("#edit_tn_month").val()+$("#edit_tn_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#edit_tn_date').focus().select();
      return false;
    }
    if ($.trim($('#edit_tn_from_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-blank-alert").hide();
      });
      $('#edit_tn_from_godown').focus();
      return false;
    }
    if ($.trim($('#edit_tn_to_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-blank-alert").hide();
      });
      $('#edit_tn_to_godown').focus();
      return false;
    }
    if ($.trim($('#edit_tn_from_godown').val())==$('#edit_tn_to_godown').val()) {
      $("#godown-same-alert").alert();
      $("#godown-same-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-same-alert").hide();
      });
      $('#edit_tn_from_godown').focus();
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
    var tnid = $("#edit_tn_list option:selected").val();
    if (tnid != "") {
    $.ajax({
      url: '/transfernotes?action=edit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {
      "transfernoteid":tnid,
      "transfernoteno":$("#edit_transfernote_no").val(),
      "transfernotedate":$("#edit_tn_year").val()+'-'+$("#edit_tn_month").val()+'-'+$("#edit_tn_date").val(),
      "fromgodown":$("#edit_tn_from_godown option:selected").val(),
      "togodown":$("#edit_tn_to_godown option:selected").val(),
      "transportationmode":$("#edit_transport_mode").val(),
      "nopkt":$("#edit_no_of_packet").val(),
      "issuername":$("#edit_name_issuer").val(),
      "designation":$("#edit_designation").val(),
      "products":JSON.stringify(products)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("#transfernote_edit").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      if(resp["gkstatus"] == 1){
        $("#edit_transfernote_no").focus();
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
  }

  });
  $("#tn_delete").click(function(event) {
    event.preventDefault();
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#confirm_del').modal('show').one('click', '#accdel', function (e)
    {
      $.ajax(
        {

          type: "POST",
          url: '/transfernotes?action=delete',
          async: false,
          datatype: "json",
          data:{"transfernoteid": $("#edit_tn_list option:selected").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              $("#transfernote_edit").click();
              $('.modal-backdrop').remove();
              $("#delsuccess-alert").alert();
              $("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#delsuccess-alert").hide();

              });
            }



          }

        });

    });
    $("#confirm_del").on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
    });
    $("#confirm_del").on('hidden.bs.modal', function(event) {
      $("#edit_tn_list").focus();
    });
   });



  });
