$(document).ready(function()
{
  $("#username").focus();
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
    $("#confirmpassword").blur(function(event) {
      if ($.trim($("#password").val())!=$.trim($("#confirmpassword").val())) {
        $("#checkpass-blank-alert").alert();
        $("#checkpass-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
          $("#checkpass-blank-alert").hide();
        });
        $("#password").focus();
        return false;
      }
    });


$("#loginform").submit(function(e)
{
  if ($.trim($("#username").val())=="") {
    $("#usrname-blank-alert").alert();
    $("#usrname-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#usrname-blank-alert").hide();
    });
    $("#username").focus();
    return false;
  }
  if ($.trim($("#password").val())=="") {
    $("#pasword-blank-alert").alert();
    $("#pasword-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#pasword-blank-alert").hide();
    });
    $("#password").focus();
    return false;
  }
  if ($.trim($("#confirmpassword").val())=="") {
    $("#confpass-blank-alert").alert();
    $("#confpass-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#confpass-blank-alert").hide();
    });
    $("#confirmpassword").focus();
    return false;
  }
  if ($.trim($("#password").val())!=$.trim($("#confirmpassword").val())) {
    $("#checkpass-blank-alert").alert();
    $("#checkpass-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#checkpass-blank-alert").hide();
    });
    $("#confirmpassword").focus();
    return false;
  }
  if ($.trim($("#securityquestion").val())=="") {
    $("#secuque-blank-alert").alert();
    $("#secuque-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#secuque-blank-alert").hide();
    });
    $("#securityquestion").focus();
    return false;
  }
  if ($.trim($("#securityanswer").val())=="") {
    $("#secuans-blank-alert").alert();
    $("#secuans-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#secuans-blank-alert").hide();
    });
    $("#securityanswer").focus();
    return false;
  }
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

    $.ajax({
      url: '/showmainshell',
      type: 'POST',
      dataType: 'html',
      })
    .done(function(resp) {
      $("body").html(resp);
    });
    }

    }
    );

    e.preventDefault();

}
);
}
);
