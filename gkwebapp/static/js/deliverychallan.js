$(document).ready(function() {

  $("#deliverychallan_create").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/deliverychallan?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#deliverychallan_div").html(resp);
    }
    }
  );
  });
  $("#deliverychallan_edit").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/deliverychallan?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#deliverychallan_div").html(resp);
    }
    }
  );
  });
  $("#deliverychallan_create").click();

});
