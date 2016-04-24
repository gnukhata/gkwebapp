$(document).ready(function()
{
  $("#username").focus(function(){
    $('input').bind("keydown", function(e) {
      if (e.which == 13)
      {
        $("#userpassword").focus();

        }
      });
  });
  $("#userpassword").focus(function(){
    $('input').bind("keydown", function(e) {
      if (e.which == 38)
      {
        $("#username").focus();

        }
      });
  });
  $("#userpassword").focus(function(){
    $('input').bind("keydown", function(e) {
      if (e.which == 13)
      {
        $("#login").click();

        }
      });
  });
  $("#username").focus();
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
