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


  $('input:text,select').keydown( function(event) {
    var n = $("input:text:visible,select").length;
    var f = $('input:text:visible,select');

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
            '<input type="text" class="form-control input-sm spec_name" value="'+spec["attrname"]+'" placeholder="Account Name">'+
          '</td>'+
          '<td class="col-xs-3">'+
            '<select id="category_spec_type" class="form-control input-sm" name="">'+trs+
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
});
