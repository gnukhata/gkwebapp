$(document).ready(function() {

  $("a[href ='#category_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/category?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#category_create").html(resp);
      $("#category_edit").html("");
    }
    }
  );
  });
  $("a[href ='#category_edit']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/category?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#category_edit").html(resp);
      $("#category_create").html("");
    }
    }
  );
  });
  $("a[href ='#category_create']").click();

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
