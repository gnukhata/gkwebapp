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
        $("#purchaseorder_div").html(resp);
  /*    $("#purchaseorder_create").html(resp);
    $("#salesorder_create").html("");
      $("#purchaseorder_view").html("");
        $("#salesorder_view").html("");*/
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
          $("#purchaseorder_div").html(resp);
      /*$("#salesorder_create").html(resp);
      $("#purchaseorder_view").html("");
      $("#purchaseorder_create").html("");
        $("#salesorder_view").html("");*/
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
          $("#purchaseorder_div").html(resp);
      /*$("#purchaseorder_view").html(resp);
      $("#purchaseorder_create").html("");
      $("#salesorder_create").html("");
        $("#salesorder_view").html("");*/
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
          $("#purchaseorder_div").html(resp);
      /*$("#salesorder_view").html(resp);
      $("#purchaseorder_create").html("");
      $("#salesorder_create").html("");
      $("#purchaseorder_view").html("");*/
    }
    }
  );
  });
  $("#purchaseorder_create").click();
  $("#purchaseorder_orderno").focus();
  /*
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#purchaseorder_create"){
      $("#purchaseorder_orderno").focus();
    }
  });
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#salesorder_create"){
      $("#salesorder_orderno").focus();
    }
  });
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#purchaseorder_view"){
      $("#purchaseorder_select").focus();
    }
  });
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#salesorder_view"){
      $("#salesorder_select").focus();
    }
  });
*/

  });
