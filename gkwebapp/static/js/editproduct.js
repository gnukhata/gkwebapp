$(document).ready(function() {
  $("#prodselect").focus();

  $("#prodselect").change(function(event) {
    /* Act on the event */
    var prodcode= $("#prodselect option:selected").val();
    if (prodcode!="")
    {

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
        $('#proddetails').find('input, textarea, button, select').prop('disabled','disabled');
        $(".pbutn").show();
        $("#epsubmit").hide();



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

  $("#prodselect").keyup(function(event) {
    /* Act on the event */
    if (event.which == 13)
    {
        var prodcode= $("#prodselect option:selected").val();
        if (prodcode!="")
        {
          $("#epedit").click();
        }

    }
  });

  $(document).on('click', '#epreset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#editproduct").click();
  });
});
