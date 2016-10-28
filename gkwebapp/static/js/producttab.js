$(document).ready(function() {
  $("#addproduct").click(function(event)
  {
    /* Act on the event */
    $.ajax({
      url: '/product?type=add',
      type: 'POST',
      datatype: 'text/html',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      $("#productdiv").html("");
      $("#productdiv").html(resp);
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });

  $("#editproduct").click(function(event)
  {
    /* Act on the event */
    $.ajax({
      url: '/product?type=edit',
      type: 'POST',
      datatype: 'text/html',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      $("#productdiv").html("");
      $("#productdiv").html(resp);
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });

  $("#addproduct").click();
});
