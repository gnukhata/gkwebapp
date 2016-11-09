$(document).ready(function() {

  $("#customersupplier_create").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/customersuppliers?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#customersupplier_div").html(resp);
    }
    }
  );
  });
  $("#customersupplier_edit").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/customersuppliers?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#customersupplier_div").html(resp);
    }
    }
  );
  });
  $("#customersupplier_create").click();

});
