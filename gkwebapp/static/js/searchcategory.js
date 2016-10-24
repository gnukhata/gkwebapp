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
    $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) button").click();

  }
});

$(document).off('click', '.showcat').on('click', '.showcat', function(event) {
  event.preventDefault();
  /* Act on the event */
  var rindex = $(this).closest('tr').index();
  var nextindex = rindex+1;
  var lastindex = $('#catsearchtab tbody tr:last-child').index();
  catid = $("#catsearchtab tbody tr:eq("+rindex+") td:first-child select option:selected").attr('data-value');

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
        alert("blank");
        $("#catsearchtab tbody tr:last-child td:first-child select").focus();
        return false;

      }
      $("#catsearchtab tbody").append('<tr>'+
      '<td class = "cols-md-6">'+
        '<select class = "form-control input-sm catsearch"  name = "categoryname" >'+
        '</select>'+
      '</td>'+
      '<td class = "cols-md-3">'+
      '<button id="sub-cat" class="btn-primary btn-sm showcat">Show Category</button>'+
      '</td>'+
      '<td class = "cols-md-3">'+
      '<button id="catproduct" class="btn-primary btn-sm showprod">Show Product</button>'+
      '</td>'+
      '</tr>');
      for (child of resp["gkresult"]) {
        $("#catsearchtab tbody tr:eq("+nextindex+") td:first-child select").append('<option data-value="'+child['categorycode']+'">'+child["categoryname"]+'('+child["subcount"]+')</option>')
      }
    };
    $("#catsearchtab tbody tr:last-child td:first-child select").focus();
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });



});

});
