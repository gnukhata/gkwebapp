$(document).ready(function() {
  $("a[href ='#godown_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/showgodown",
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
    url: "/showeditgodown",
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
    if(e.target.attributes.href.value=="#category_create"){
      $("#category_name").focus();
    }
    else if(e.target.attributes.href.value=="#category_edit"){
      $("#category_edit_list").focus();
    }
  });
  $("a[href ='#category_edit']").click(function(event) {
    $("#category_edit_list").focus();
  });
});
