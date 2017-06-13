$(document).ready(function() {

  $("#rejectionnote_in").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/rejectionnote?action=showadd&status=in",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#rejectionnote_div").html(resp);
    }
    }
  );
  });


});
