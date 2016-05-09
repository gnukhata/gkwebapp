$(document).ready(function() {
  $("#prjname").focus();
  $("#prjform").submit(function(e)
  {
    $.ajax(
      {
        type: "POST",
        url: "/addproject",
        global: false,
        async: false,
        datatype: "json",
        data: $("#prjform").serialize(),
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          alert(resp["gkstatus"]);
          $("#project").click();
        }

      }
    );
    e.preventDefault();
  });
});
