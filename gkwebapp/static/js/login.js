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

  $("#forgotpwdlink").click(function(event){
    var code = $("#orgcode").val();
    $("#selectorg").load("/forgotpassword?orgcode="+ code);
  });

  $("#loginform").submit(function(e)
  {
    if ($.trim($("#username").val())=="") {
      $("#username-blank-alert").alert();
      $("#username-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#username-blank-alert").hide();
      });
      $("#username").focus();
      return false;
    }
      if ($.trim($("#userpassword").val())=="") {
        $("#password-blank-alert").alert();
        $("#password-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
          $("#password-blank-alert").hide();
        });
        $("#userpassword").focus();
        return false;
    }
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
      if(resp["gkstatus"]==0)
      {
        var gt = resp['gktoken'];

        sessionStorage.gktoken = gt;

        window.location= "/showmainshell";
      }
      else if(resp["gkstatus"]==2)
      {
        $("#login-blank-alert").alert();
        $("#login-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
          $("#login-blank-alert").hide();
        });
        $("#username").focus();
        return false;
      }
      }

      }
      );

      e.preventDefault();
  }
  );
});
