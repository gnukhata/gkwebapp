$(document).ready(function()
{
  $("#username").focus();
  $("#loginform").validate({
    rules: {
  username: "required",
  confirmpassword: {
    equalTo: "#password"
  }
  }
});
$('input:not(:hidden),select').bind("keydown", function(e) {
  var n = $("input:not(:hidden),select").length;
  var f = $('input:not(:hidden),select');
  if (e.which == 13)
  {
    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      e.preventDefault();
      f[nextIndex].focus();}

    }
  });
  $('input:not(:hidden),select').bind("keydown", function(e) {
    var n = $("input:not(:hidden),select").length;
    var f = $('input:not(:hidden),select');
    if (e.which == 38)
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex > 0){
        e.preventDefault();
        f[prevIndex].focus();}

      }
    });

$("#securityanswer").focus(function(){
  $('input').bind("keydown", function(e) {
    if (e.which == 13)
    {
      $(".btn").click();
    }
    });
});
$("#loginform").submit(function(e)
{
  var isvalidate=$("#loginform").valid();
  if(isvalidate)
      {
    $.ajax(
    {
    //alert("starting ajax");
    type: "POST",
    url: "/createorglogin",
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
e.preventDefault();
}
);
}
);
