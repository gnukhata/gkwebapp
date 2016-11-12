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
  });
  $("a[href ='#godown_edit']").click(function(event) {
    $("#editgoddet").focus();
  });
  });
