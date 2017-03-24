$(document).ready(function() {
  console.log("debug");
  $("#purchaseorder_create").click(function() {
    console.log("create");
    $.ajax(
    {
    type: "POST",
    url: "/purchaseorder?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
        $("#purchaseorder_div").html("");
        $("#purchaseorder_div").html(resp);

    }
    }
  );
  });

  $("#salesorder_create").click(function() {
    console.log("create");
    $.ajax(
    {
    type: "POST",
    url: "/salesorder?action=showsalesadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
          $("#purchaseorder_div").html("");
          $("#purchaseorder_div").html(resp);
    }
    }
  );
  });
  $("#purchaseorder_view").click(function() {
    console.log("view");
    $.ajax(
    {
    type: "POST",
    url: "/purchaseorder?type=showview",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
          $("#purchaseorder_div").html("");
          $("#purchaseorder_div").html(resp);
    }
    }
  );
  });
  $("#salesorder_view").click(function() {
    console.log("view");
    $.ajax(
    {
    type: "POST",
    url: "/salesorder?type=showview",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
          $("#purchaseorder_div").html("");
          $("#purchaseorder_div").html(resp);
    }
    }
  );
  });
  $("#purchaseorder_create").click();
  });
