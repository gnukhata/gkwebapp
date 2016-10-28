$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#category_tax_vat").numeric();
  $("#category_name").focus();
  var createsel1 = 0;

  $("#category_under").focus(function() {
    createsel1 = 1;
  });
  $("#category_under").blur(function(){
    createsel1 = 0;
  });

  $("#category_name").keydown(function(event) {
    if (event.which==13) {
      $("#category_tax_vat").focus().select();
    }
  });

  $("#category_tax_vat").keydown(function(event) {
    if (event.which==13) {
      $("#category_under").focus().select();
    }
    if (event.which==38) {
      $("#category_name").focus().select();
    }
  });

  $("#category_under").keydown(function(event) {
    if (event.which==13) {
      $("#category_addspecs").click();
    }
    if (event.which==38 && $("#category_under option:selected").index()==0) {
      $("#category_tax_vat").focus().select();
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
      $('#category_spec_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });
  $(document).off("keydown",".spec_type").on("keydown",".spec_type",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#category_spec_table tbody tr").length-1)) {
        $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#spec-blank-alert").alert();
          $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#spec-blank-alert").hide();
          });
          $('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
          return false;
        }
        $('#category_spec_table tbody').append('<tr>'+
          '<td class="col-xs-9">'+
            '<input type="text" class="form-control input-sm spec_name" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-2">'+
            '<select id="category_spec_type" class="form-control input-sm spec_type">'+
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
          $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
        }
      }
      else if (event.ctrlKey && event.which==188) {
        $('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus().select();
        event.preventDefault();
      }
    });


  $("#category_addspecs").click(function(event) {
    if ($.trim($('#category_name').val())=="") {
      $("#category-blank-alert").alert();
      $("#category-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-blank-alert").hide();
      });
      $("#category_savespecs").attr("disabled",true);
      $("#category_spec_div").hide();
      $('#category_name').focus().select();
      return false;
    }
    if ($('#category_spec_table tbody tr').length==0) {
      $('#category_spec_table tbody').append('<tr>'+
        '<td class="col-xs-9">'+
          '<input type="text" class="form-control input-sm spec_name" value="" placeholder="Spec Name">'+
        '</td>'+
        '<td class="col-xs-2">'+
          '<select id="category_spec_type" class="form-control input-sm spec_type">'+
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
    var category_code = $("#category_under option:selected").val();
    $("#category_spec_table > tbody >tr:not(:last)").remove();
    $("#category_spec_table tbody tr:last td:eq(0) input").val("");
    if (category_code=='') {
      $("#category_savespecs").attr("disabled",false);
      $("#category_spec_div").show();
      $("#category_spec_table tbody tr:last td:eq(0) input").focus();
    }
    else{$.ajax({
      url: '/category?action=getspecs',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": category_code},
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
        $('#category_spec_table tbody').prepend('<tr>'+
          '<td class="col-xs-9">'+
            '<input type="text" class="form-control input-sm spec_name" value="'+spec["attrname"]+'" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-2">'+
            '<select id="category_spec_type" class="form-control input-sm spec_type">'+trs+
            '</select>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
        '</tr>');
      }
      $("#category_savespecs").attr("disabled",false);
      $("#category_spec_div").show();
      $("#category_spec_table tbody tr:last td:eq(0) input").focus();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  }
  });
  $("#category_under").change(function(event) {
    $("#category_savespecs").attr("disabled",true);
    $("#category_spec_div").hide();
  });

  $(document).off("click",".spec_del").on("click", ".spec_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#category_spec_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#category_spec_table tbody tr:last td:eq(0) input').select();
  });
  $("#category_savespecs").click(function(event) {
    if ($.trim($('#category_name').val())=="") {
      $("#category-blank-alert").alert();
      $("#category-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-blank-alert").hide();
      });
      $('#category_name').focus().select();
      return false;
    }
    var specs = [];
    for (var i = 0; i < $("#category_spec_table tbody tr").length; i++) {
      if ($.trim($("#category_spec_table tbody tr:eq("+i+") td:eq(0) input").val())=="") {
        $("#spec-blank-alert").alert();
        $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#spec-blank-alert").hide();
        });
        $("#category_spec_table tbody tr:eq("+i+") td:eq(0) input").focus().select();
        return false;
      }
      var obj = {};
      obj.attrname = $("#category_spec_table tbody tr:eq("+i+") td:eq(0) input").val();
      obj.attrtype = $("#category_spec_table tbody tr:eq("+i+") td:eq(1) select").val();
      specs.push(obj);
    }
    $.ajax({
      url: '/category?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categoryname": $("#category_name").val(),"subcategoryof":$("#category_under").val(),"specs":JSON.stringify(specs)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("a[href='#category_create']").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      else {
        $("#category_name").focus();
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
