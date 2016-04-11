$(document).ready(function(){
  $("#adduser").validate({
    rules: {
      userpassword: "required",
      cnfpassword: {
        equalTo: "#password"
      }
    }

  });
  $("#adduser").submit(function(e)
  {
    var isvalidate=$("#adduser").valid();
    if(isvalidate)
    {
      $.ajax(
        {
          type: "POST",
          url: "/createuser",
          global: false,
          async: false,
          datatype: "json",
          data: $("#adduser").serialize(),
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {

            alert(resp["gkstatus"])
          }

        }
      );

      e.preventDefault();
    }
    e.preventDefault();
  }
);
});
