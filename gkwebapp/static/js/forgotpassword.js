$(document).ready(function()
{
  $("#btnsubmit").click(function(event){
    event.preventDefault();
    if ($.trim($("#username").val())=="") {
      $("#username-blank-alert").alert();
      $("#username-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#username-blank-alert").hide();
      });
      $("#username").focus();
      return false;
    }

    if ($.trim($("#securityquestion").val())=="") {
      $("#securityquestion-blank-alert").alert();
      $("#securityquestion-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#securityquestion-blank-alert").hide();
      });
      $("#securityquestion").focus();
      return false;
    }

    if ($.trim($("#securityanswer").val())=="") {
      $("#securityanswer-blank-alert").alert();
      $("#securityanswer-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#securityanswer-blank-alert").hide();
      });
      $("#securityanswer").focus();
      return false;
    }

    if ($.trim($("#newpassword").val())=="") {
      $("#newpassword-blank-alert").alert();
      $("#newpassword-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#newpassword-blank-alert").hide();
      });
      $("#newpassword").focus();
      return false;
    }

    if ( ($.trim($("#confirmpassword").val())=="") || ( $.trim($("#newpassword").val())!==$.trim($("#confirmpassword").val()) ) ) {
      $("#passwords-dont-match-alert").alert();
      $("#passwords-dont-match-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#passwords-dont-match-alert").hide();
      });
      $("#confirmpassword").focus();
      return false;
    }
  })

  $("#back").click(function(event){
    var code = $("#orgcode").val();
    $("#selectorg").load("/login?orgcode="+code);
  })
});
