$(document).ready(function() {

  $("#invoice_record").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/invoice?action=showadd&status=in",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#invoice_div").html(resp);
    }
    }
  );
  });
  $("#invoice_create").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/invoice?action=showadd&status=out",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#invoice_div").html(resp);
    }
    }
  );
  });
  $("#invoice_view").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/invoice?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#invoice_div").html(resp);
    }
    }
  );
  });
  $("#invoice_record").click();
return false;
});
