$(document).ready(function() {

  $("#transfernote_create").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/transfernotes?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#transfernote_div").html(resp);
    }
    }
  );
  });
  $("#transfernote_edit").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/transfernotes?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#transfernote_div").html(resp);
    }
    }
  );
  });
  $("#transfernote_create").click();

});
