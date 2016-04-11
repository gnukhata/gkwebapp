$(document).ready(function()
{
  $("#username").focus();
  $("#adminform").validate({
    rules: {
      userpassword: "required",
      confirmpassword: {
        equalTo: "#password"
      }
    }

  });
  $("#adminform").submit(function(e)
  {
    var isvalidate=$("#adminform").valid();
    if(isvalidate)
    {
      $.ajax(
        {
          type: "POST",
          url: "/createorglogin",
          global: false,
          async: false,
          datatype: "json",
          data: $("#adminform").serialize(),
          success: function(resp)
          {
            var gt = resp['gktoken'];

            sessionStorage.gktoken = gt;

            window.location= "/showmainshell";
          }

        }
      );

      e.preventDefault();
    }
    e.preventDefault();
  }

);
}
);
