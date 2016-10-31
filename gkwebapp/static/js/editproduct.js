$(document).ready(function() {
  $("#prodselect").focus();

  $("#prodselect").change(function(event) {
    /* Act on the event */
    var prodcode= $("#prodselect option:selected").val();
    if (prodcode!="")
    {
      alert(prodcode);

      $.ajax({
        url: '/product?type=details',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"productcode": prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        $("#proddetails").html("");
        $("#proddetails").html(resp);
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

    }

  });
});
