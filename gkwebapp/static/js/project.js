$(document).ready(function() {
  $("#prjform").submit(function(e)
  {
    $.ajax(
      {
        type: "POST",
        url: "/addaccount",
        global: false,
        async: false,
        datatype: "json",
        data: $("#accountform").serialize(),
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if(resp["gkstatus"])
          {
          alert("Account Created Successfully");
          $("#reset").click();
          }
          else
          {
            alert("Account Could Not Be Created");
          }
        }

      }
    );
    e.preventDefault();
  });
});
