$(document).ready(function() {

  $("a[href ='#unit_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/unitofmeasurements?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#unit_create").html(resp);
      $("#unit_edit").html("");

    }
    }
  );
  });
  $("a[href ='#unit_edit']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/unitofmeasurements?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#unit_edit").html(resp);
      $("#unit_create").html("");
    }
    }
  );
  });
  $("a[href ='#unit_create']").click();

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#unit_create"){
      $("#unit_name").focus();
    }
    else if(e.target.attributes.href.value=="#unit_edit"){
      $("#unit_edit_list").focus();
    }
  });
  $("a[href ='#unit_edit']").click(function(event) {
    $("#unit_edit_list").focus();
  });
});
