$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#category_edit_tax_vat").numeric();
  $("#category_edit_name").focus();
  var sel1 = 0;
  var sel2 = 0;
  var deletedspecs = [];

  $("#category_edit_under").focus(function() {
    sel1 = 1;
  });
  $("#category_edit_under").blur(function(){
    sel1 = 0;
  });

  $("#category_edit_list").change(function(event) {
    $("#category_edit_spec_table > tbody >tr").remove();
    deletedspecs = [];
    $.ajax({
      url: '/category?action=getCategory',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": $("#category_edit_list").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      var result = resp["gkresult"]
      $("#category_edit_name").val(result["categoryname"]);
      $("#category_edit_under").val(result["subcategoryof"]);
      $("#category_edit_addspecs").attr('disabled',false);
      $(".panel-footer").show();
      $("#category_edit_innerdiv").show();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    $.ajax({
      url: '/category?action=getspecs',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": $("#category_edit_list").val()},
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
        $('#category_edit_spec_table tbody').prepend('<tr value="'+spec["spcode"]+'">'+
          '<td class="col-xs-9">'+
            '<input type="text" class="form-control input-sm spec_name" value="'+spec["attrname"]+'" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-2">'+
            '<select id="category_edit_spec_type" class="form-control input-sm spec_type">'+trs+
            '</select>'+
          '</td>'+
          '<td class="col-xs-1">'+
          '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
          '</td>'+
        '</tr>');
      }
      $("#category_edit_savespecs").attr("disabled",false);
      $("#category_edit_spec_div").show();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });

  $('.category_edit_panel input:text,select:visible').keydown( function(event) {
    var n = $(".category_edit_panel input:text:visible,select:visible").length;
    var f = $('.category_edit_panel input:text:visible,select:visible');

    if (event.which == 13)
    {


      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        event.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }

    }


    var s1 = $("#category_edit_under option:selected").index();
    if ((event.which == 38 && sel1 == 1 && s1 == 0) || (event.which == 38 && sel1 == 0))
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex < n){
        event.preventDefault();
        f[prevIndex].focus();
        f[prevIndex].select();
      }
    }
  });
  $("#category_edit_under").keydown(function(event) {
    if (event.which==13) {
      $("#category_edit_addspecs").click();
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
      $('#category_edit_spec_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      event.preventDefault();
      $('#category_edit_spec_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_edit_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });
  $(document).off("keydown",".spec_type").on("keydown",".spec_type",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#category_edit_spec_table tbody tr").length-1)) {
        $('#category_edit_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#category_edit_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#spec-blank-alert").alert();
          $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#spec-blank-alert").hide();
          });
          $('#category_edit_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
          return false;
        }
        $('#category_edit_spec_table tbody').append('<tr value="New">'+
          '<td class="col-xs-9">'+
            '<input type="text" class="form-control input-sm spec_name" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-2">'+
            '<select id="category_edit_spec_type" class="form-control input-sm spec_type">'+
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
          $('#category_edit_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
        }
      }
      else if (event.ctrlKey && event.which==188) {
        $('#category_edit_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus().select();
        event.preventDefault();
      }
    });

  $(document).off("click",".spec_del").on("click", ".spec_del", function() {
    deletedspecs.push($(this).closest('tr').attr('value'));
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#category_edit_spec_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#category_edit_spec_table tbody tr:last td:eq(0) input').select();
  });
  $("#category_edit_savespecs").click(function(event) {
    if ($.trim($('#category_edit_name').val())=="") {
      $("#category-blank-alert").alert();
      $("#category-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#category-blank-alert").hide();
      });
      $('#category_edit_name').focus().select();
      return false;
    }
    var specs = [];
    for (var i = 0; i < $("#category_edit_spec_table tbody tr").length; i++) {
      if ($.trim($("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").val())=="") {
        $("#spec-blank-alert").alert();
        $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#spec-blank-alert").hide();
        });
        $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").focus().select();
        return false;
      }
      var obj = {};
      obj.spcode = $("#category_edit_spec_table tbody tr:eq("+i+")").attr('value');
      obj.attrname = $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(0) input").val();
      obj.attrtype = $("#category_edit_spec_table tbody tr:eq("+i+") td:eq(1) select").val();
      specs.push(obj);
    }
    $.ajax({
      url: '/category?action=edit',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categoryname": $("#category_edit_name").val(),"categorycode": $("#category_edit_list option:selected").val(),"subcategoryof":$("#category_edit_under").val(),"specs":JSON.stringify(specs),"deletedspecs":JSON.stringify(deletedspecs)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("a[href='#category_edit']").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      else {
        $("#category_edit_name").focus();
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
