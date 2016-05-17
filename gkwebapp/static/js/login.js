$(document).ready(function()
{
  $('#username').keydown(function(e){
      if (e.which == 13)
      {
        e.preventDefault();
        $("#userpassword").focus();

        }
      });
  $("#userpassword").keydown(function(e) {
      if (e.which == 38)
      {
        e.preventDefault();
        $("#username").focus();

        }
  });
  $("#back").click(function(event){
    event.preventDefault();
    $("#selectorg").load("/existingorg" );

  });

  $("#loginform").submit(function(e)
  {

      $.ajax(
      {
      //alert("starting ajax");
      type: "POST",
      url: "/userlogin",
      global: false,
      async: false,
      datatype: "json",
      data: $("#loginform").serialize(),
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
  );
});
