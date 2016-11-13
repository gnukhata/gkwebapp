$(document).ready(function() {
  $("a[href ='#godown_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/godown?type=addtab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#godown_create").html(resp);
      $("#godown_edit").html("");
      $("#godown_list").html("");
    }
    }
  );
  });
  $("a[href ='#godown_list']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/godown?type=list",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#godown_list").html(resp);
      $("#godown_create").html("");
      $("#godown_edit").html("");
    }
    }
  );
  });
  $("a[href ='#godown_edit']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/godown?type=edittab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#godown_edit").html(resp);
      $("#godown_create").html("");
      $("#godown_list").html("");
    }
    }
  );
  });
  $("a[href ='#godown_create']").click();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#godown_create"){
      $("#godownname").focus();
    }
    else if(e.target.attributes.href.value=="#godown_edit"){
      $("#editgoddet").focus();
    }
    else if(e.target.attributes.href.value=="#godown_list"){
      $('#latable tbody tr:first-child td:eq(1) a').focus();
    }
  });
  $("a[href ='#godown_edit']").click(function(event) {
    $("#editgoddet").focus();
  });
  });
