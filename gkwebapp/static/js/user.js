$(document).ready(function() {
  $("a[href ='#user_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/showuser?type=addtab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#user_create").html(resp);
      $("#user_edit").html("");
    }
    }
  );
  });

   $("a[href ='#user_edit']").click(function() {
    $.ajax(
    {
    type: "POST",
    url: "/showuser?type=edittab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#user_edit").html(resp);
      $("#user_create").html("");
    }
    }
  );
  });
    
  $("a[href ='#user_create']").click();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#user_create"){
      $("#name").focus();
    }
    else if(e.target.attributes.href.value=="#user_edit"){
      $("#editname").focus();
    } 
  });
});
