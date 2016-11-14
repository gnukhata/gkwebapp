$(document).ready(function() {

  $("#cashmemo_create").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/cashmemos?action=showadd&status=out",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#cashmemo_div").html(resp);
    }
    }
  );
  });
  $("#cashmemo_view").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/cashmemos?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#cashmemo_div").html(resp);
    }
    }
  );
  });

  $("#cashmemo_create").click();

return false;
});
