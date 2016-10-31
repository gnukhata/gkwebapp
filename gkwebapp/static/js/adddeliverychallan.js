$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#deliverychallan_date").numeric();
  $("#deliverychallan_month").numeric();
  $("#deliverychallan_year").numeric();
  $("#deliverychallan_purchaseorder").focus();

  $("#deliverychallan_name").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_tax_vat").focus().select();
    }
  });

  $("#deliverychallan_tax_vat").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_under").focus().select();
    }
    if (event.which==38) {
      $("#deliverychallan_name").focus().select();
    }
  });

  $("#deliverychallan_under").keydown(function(event) {
    if (event.which==13) {
      $("#deliverychallan_addspecs").click();
    }
    if (event.which==38 && $("#deliverychallan_under option:selected").index()==0) {
      $("#deliverychallan_tax_vat").focus().select();
    }
  });


  $(document).off("keydown",".spec_name").on("keydown",".spec_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#deliverychallan_spec_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      event.preventDefault();
      $('#deliverychallan_spec_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#deliverychallan_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });
  $(document).off("keydown",".spec_type").on("keydown",".spec_type",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#deliverychallan_spec_table tbody tr").length-1)) {
        $('#deliverychallan_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#deliverychallan_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#spec-blank-alert").alert();
          $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#spec-blank-alert").hide();
          });
          $('#deliverychallan_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
          return false;
        }
        $('#deliverychallan_spec_table tbody').append('<tr>'+
          '<td class="col-xs-9">'+
            '<input type="text" class="form-control input-sm spec_name" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-2">'+
            '<select id="deliverychallan_spec_type" class="form-control input-sm spec_type">'+
            '<option value="0">Text</option>'+
            '<option value="1">Number</option>'+
            '<option value="2">Date</option>'+
            '<option value="3">Option</option>'+
            '</select>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
        '</tr>');
          $('#deliverychallan_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
        }
      }
      else if (event.ctrlKey && event.which==188) {
        $('#deliverychallan_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus().select();
        event.preventDefault();
      }
    });


  $("#deliverychallan_addspecs").click(function(event) {
    if ($.trim($('#deliverychallan_name').val())=="") {
      $("#category-blank-alert").alert();
      $("#category-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-blank-alert").hide();
      });
      $("#deliverychallan_savespecs").attr("disabled",true);
      $("#deliverychallan_spec_div").hide();
      $('#deliverychallan_name').focus().select();
      return false;
    }
    if ($('#deliverychallan_spec_table tbody tr').length==0) {
      $('#deliverychallan_spec_table tbody').append('<tr>'+
        '<td class="col-xs-9">'+
          '<input type="text" class="form-control input-sm spec_name" value="" placeholder="Spec Name">'+
        '</td>'+
        '<td class="col-xs-2">'+
          '<select id="deliverychallan_spec_type" class="form-control input-sm spec_type">'+
          '<option value="0">Text</option>'+
          '<option value="1">Number</option>'+
          '<option value="2">Date</option>'+
          '<option value="3">Option</option>'+
          '</select>'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
      '</tr>');
    }
    var deliverychallan_code = $("#deliverychallan_under option:selected").val();
    $("#deliverychallan_spec_table > tbody >tr:not(:last)").remove();
    $("#deliverychallan_spec_table tbody tr:last td:eq(0) input").val("");
    if (deliverychallan_code=='') {
      $("#deliverychallan_savespecs").attr("disabled",false);
      $("#deliverychallan_spec_div").show();
      $("#deliverychallan_spec_table tbody tr:last td:eq(0) input").focus();
    }
    else{$.ajax({
      url: '/category?action=getspecs',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": deliverychallan_code},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
      for (spec of resp["gkresult"]) {
        var trs;
        if (spec["attrtype"]==0) {
          trs ='<option value="0" selected>Text</option>'+
          '<option value="1">Number</option>'+
          '<option value="2">Date</option>'+
          '<option value="3">Option</option>'
        }
        else if (spec["attrtype"]==1) {
          trs ='<option value="0">Text</option>'+
          '<option value="1" selected>Number</option>'+
          '<option value="2">Date</option>'+
          '<option value="3">Option</option>'
        }
        else if (spec["attrtype"]==2) {
          trs ='<option value="0">Text</option>'+
          '<option value="1">Number</option>'+
          '<option value="2" selected>Date</option>'+
          '<option value="3">Option</option>'
        }
        else if (spec["attrtype"]==3) {
          trs ='<option value="0">Text</option>'+
          '<option value="1">Number</option>'+
          '<option value="2">Date</option>'+
          '<option value="3" selected>Option</option>'
        }
        $('#deliverychallan_spec_table tbody').prepend('<tr>'+
          '<td class="col-xs-9">'+
            '<input type="text" class="form-control input-sm spec_name" value="'+spec["attrname"]+'" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-2">'+
            '<select id="deliverychallan_spec_type" class="form-control input-sm spec_type">'+trs+
            '</select>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
        '</tr>');
      }
      $("#deliverychallan_savespecs").attr("disabled",false);
      $("#deliverychallan_spec_div").show();
      $("#deliverychallan_spec_table tbody tr:last td:eq(0) input").focus();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  }
  });
  $("#deliverychallan_under").change(function(event) {
    $("#deliverychallan_savespecs").attr("disabled",true);
    $("#deliverychallan_spec_div").hide();
  });

  $(document).off("click",".spec_del").on("click", ".spec_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#deliverychallan_spec_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#deliverychallan_spec_table tbody tr:last td:eq(0) input').select();
  });
  $("#deliverychallan_savespecs").click(function(event) {
    if ($.trim($('#deliverychallan_name').val())=="") {
      $("#category-blank-alert").alert();
      $("#category-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-blank-alert").hide();
      });
      $('#deliverychallan_name').focus().select();
      return false;
    }
    var specs = [];
    for (var i = 0; i < $("#deliverychallan_spec_table tbody tr").length; i++) {
      if ($.trim($("#deliverychallan_spec_table tbody tr:eq("+i+") td:eq(0) input").val())=="") {
        $("#spec-blank-alert").alert();
        $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#spec-blank-alert").hide();
        });
        $("#deliverychallan_spec_table tbody tr:eq("+i+") td:eq(0) input").focus().select();
        return false;
      }
      var obj = {};
      obj.attrname = $("#deliverychallan_spec_table tbody tr:eq("+i+") td:eq(0) input").val();
      obj.attrtype = $("#deliverychallan_spec_table tbody tr:eq("+i+") td:eq(1) select").val();
      specs.push(obj);
    }
    $.ajax({
      url: '/category?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categoryname": $("#deliverychallan_name").val(),"subcategoryof":$("#deliverychallan_under").val(),"specs":JSON.stringify(specs)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("a[href='#deliverychallan_create']").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      else {
        $("#deliverychallan_name").focus();
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
