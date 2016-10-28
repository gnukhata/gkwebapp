$(document).ready(function() {
  $(document).off('focus', '.numtype').on('focus', '.numtype', function(event)
  {
    /* Act on the event */
    $(".numtype").numeric();
  });
  $("#catselect").focus();
  $("#catselect").select();
  $("#catselect").change(function(event) {
    /* Act on the event */
    var catcode= $("#catselect option:selected").val();
    $.ajax({
      url: '/product?type=specs',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'text/html',
      data: {"categorycode": catcode},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp)
    {
      $("#specifications").html("");
      $("#specifications").html(resp);
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });

  $("#addprodform").submit(function(event) {
    /* Act on the event */
    event.preventDefault();
    $.ajax({
      url: '/product?type=save',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
      data: $("#addprodform").serialize(),
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if (resp["gkstatus"] ==0) {

        $("#addproduct").click();
      }
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });
});
