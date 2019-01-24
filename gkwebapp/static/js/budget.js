$(document).ready(function() {
    $("a[href ='#budget_create']").click(function() {
      $.ajax(
      {
      type: "POST",
      url: "/budget?type=addtab",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#budget_create").html(resp);
        $("#budget_edit").html("");
      }
      }
    );
    });
    $("a[href ='#budget_edit']").click(function() {
      $.ajax(
      {
  
      type: "POST",
      url: "/budget?type=edittab",
      global: false,
      async: false,
      datatype: "text/html", 
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#budget_edit").html(resp);
        $("#budget_create").html("");
        $("#budget_list").html("");
      }
      }
    );
    });
  
  
    $("a[href ='#budget_create']").click();
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      if(e.target.attributes.href.value=="#budget_create"){
        $("#godownname").focus();
      }
      else if(e.target.attributes.href.value=="#godown_edit"){
        $("#editgoddet").focus();
      }
    });
    $("a[href ='#budget_edit']").click(function(event) {
      $("#editgoddet").focus();
    });
    });
  