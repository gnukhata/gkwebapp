$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#category_tax_vat").numeric();
  $("#category_name").focus();
  var sel1 = 0;
  var sel2 = 0;

  $("#category_under").focus(function() {
    sel1 = 1;
  });
  $("#category_under").blur(function(){
    sel1 = 0;
  });

  $('.category_panel input:text,select:visible').keydown( function(event) {
    var n = $(".category_panel input:text:visible,select:visible").length;
    var f = $('.category_panel input:text:visible,select:visible');

    if (event.which == 13)
    {


      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        event.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }

    }


    var s1 = $("#category_under option:selected").index();
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
        $('#category_spec_table tbody').append('<tr>'+
          '<td class="col-xs-7">'+
            '<input type="text" class="form-control input-sm spec_name" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-3">'+
            '<select id="category_spec_type" class="form-control input-sm spec_type">'+
            '<option value="0">Text</option>'+
            '<option value="1">Number</option>'+
            '<option value="2">Date</option>'+
            '<option value="3">Option</option>'+
            '</select>'+
          '</td>'+
          '<td class="col-xs-2">'+
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
    var category_code = $("#category_under option:selected").val();
    $("#category_spec_table > tbody >tr:not(:last)").remove();
    $.ajax({
      url: '/category?action=getspecs',
      type: 'POST',
      dataType: 'json',
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
          '<td class="col-xs-7">'+
            '<input type="text" class="form-control input-sm spec_name" value="'+spec["attrname"]+'" placeholder="Spec Name">'+
          '</td>'+
          '<td class="col-xs-3">'+
            '<select id="category_spec_type" class="form-control input-sm spec_type">'+trs+
            '</select>'+
          '</td>'+
          '<td class="col-xs-2">'+
          '</td>'+
        '</tr>');
      }
      $("#category_spec_div").show();
      $("#category_spec_table tbody tr:last td:eq(0) input").focus();
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });

  $("#category_savespecs").click(function(event) {
    var specs = [];
    for (var i = 0; i < $("#category_spec_table tbody tr").length; i++) {
      var obj = {};
      obj.attrname = $("#category_spec_table tbody tr:eq("+i+") td:eq(0) input").val();
      obj.attrtype = $("#category_spec_table tbody tr:eq("+i+") td:eq(1) select").val();
      specs.push(obj);
    }
    $.ajax({
      url: '/category?action=save',
      type: 'POST',
      dataType: 'json',
      data: {"categoryname": $("#category_name").val(),"subcategoryof":$("#category_under").val(),"specs":JSON.stringify(specs)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
      console.log(resp["gkstatus"]);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });
});
