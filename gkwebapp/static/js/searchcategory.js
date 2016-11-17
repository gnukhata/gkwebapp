$(document).ready(function() {

  $(document).off('keydown', '.catsearch').on('keydown', '.catsearch', function(event) {
    /* Act on the event */
    if (event.which==32)
    {
      event.preventDefault();

    }
  });

$(document).off('keyup', '.catsearch').on('keyup', '.catsearch', function(event) {

  /* Act on the event */
  var rindex = $(this).closest('tr').index();
  if (event.which==32)
  {
    event.preventDefault();
    $("#catsearchtab tbody tr:eq("+rindex+") td:eq(2) button").click();

  }
});

$(document).off('change', '.catsearch').on('change', '.catsearch', function(event) {
  event.preventDefault();
  var rindex = $(this).closest('tr').index();
  catid = $("#catsearchtab tbody tr:eq("+rindex+") td:first-child select option:selected").attr('data-value');
  /* Act on the event */
  $.ajax({
    url: '/product?by=category',
    type: 'POST',
    dataType: 'json',
    data: {"categorycode": catid},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
    console.log("success");
    if (resp["gkstatus"]==0)
    {
      $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) select").empty();
      if (resp["gkresult"]==0)
      {
        $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) select").append('<option data-value="">No Products</option>');
      }
      else {

        for (prod of resp["gkresult"]) {
          $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) select").append('<option data-value="'+prod['productcode']+'">'+prod["productdesc"]+'</option>');
        }

      }
    }

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

});

$(document).off('keydown', '.catsearch').on('keydown', '.catsearch', function(event) {
  event.preventDefault();
  /* Act on the event */
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if (event.which==13)
  {

  }
  else if(event.which==190 && event.shiftKey)
  {
    $('#catsearchtab tbody tr:eq('+nextindex+') td:eq(0) select').focus();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex>-1)
    {
      event.preventDefault();
      $('#catsearchtab tbody tr:eq('+previndex+') td:eq(0) select').focus();
    }

  }
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    if (curindex==0) {
      event.preventDefault();
      $("#invoice_schedule").focus().select();
    }
    else {
      $('#catsearchtab tbody tr:eq('+previndex+') td:eq(1) select').focus().select();

    }


  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#catsearchtab tbody tr:eq('+curindex+') td:eq(1) select').focus().select();


  }
});

$(document).off('keydown', '.catprod').on('keydown', '.catprod', function(event) {
  event.preventDefault();
  /* Act on the event */
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if (event.which==13)
  {

  }
  else if(event.which==190 && event.shiftKey)
  {
    $('#catsearchtab tbody tr:eq('+nextindex+') td:eq(1) select').focus();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex>-1)
    {
      event.preventDefault();
      $('#catsearchtab tbody tr:eq('+previndex+') td:eq(1) select').focus();
    }

  }
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    $('#catsearchtab tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
    
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#catsearchtab tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();


  }
});

$(document).off('click', '.showcat').on('click', '.showcat', function(event) {
  event.preventDefault();
  /* Act on the event */
  var rindex = $(this).closest('tr').index();
  var nextindex = rindex+1;
  var lastindex = $('#catsearchtab tbody tr:last-child').index();
  catid = $("#catsearchtab tbody tr:eq("+rindex+") td:first-child select option:selected").attr('data-value');
  if (catid =="")
  {
    $("#cat-blank-alert").alert();
    $("#cat-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#cat-blank-alert").hide();
    });
    $("#catsearchtab tbody tr:last-child td:first-child select").focus();
    return false;
  }
  $.ajax({
    url: '/catsearch?type=children',
    type: 'POST',
    datatype: 'json',
    data: {categorycode: catid},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {

    if (resp["gkstatus"] == 0)
    {
      for (var i = nextindex; i < lastindex+1; i++)
      {
        $("#catsearchtab tbody tr:eq("+nextindex+")").remove();
      };
      if (resp["gkresult"]=="")
      {
        $("#cat-blank-alert").alert();
        $("#cat-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#cat-blank-alert").hide();
        });
        $("#catsearchtab tbody tr:last-child td:first-child select").focus();
        return false;

      }
      $("#catsearchtab tbody").append('<tr>'+
      '<td class = "cols-md-6">'+
        '<select class = "form-control input-sm catsearch"  name = "categoryname" >'+
        '</select>'+
      '</td>'+
      '<td class = "cols-md-3">'+
      '<select class = "form-control input-sm catprod"  name = "categoryproduct" >'+
      '</select>'+
      '</td>'+
      '<td class = "cols-md-3">'+
      '<button id="sub-cat" class="btn-primary btn-sm showcat">Show Sub-Category</button>'+
      '</td>'+
      '</tr>');
      for (child of resp["gkresult"]) {
        $("#catsearchtab tbody tr:eq("+nextindex+") td:first-child select").append('<option data-value="'+child['categorycode']+'">'+child["categoryname"]+'('+child["subcount"]+')</option>')
      }
    };
    $("#catsearchtab tbody tr:last-child td:first-child select").focus();
    $("#catsearchtab tbody tr:last-child td:first-child select").change();
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });



});

});
