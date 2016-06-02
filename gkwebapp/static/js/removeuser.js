$(document).ready(function() {
  $('.modal-backdrop').remove();

  $("#username").focus();
  var username = $("#username option:selected").val();

  $.ajax({
    type: "POST",
    url: "/removeuser",
    data: {"user":username},
    global: false,
    async: false,
    dataType: "json",
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    },
    success: function(jsonObj)
    {
      if (jsonObj["gkstatus"]==2)
      {
        $("#removeUserform").hide();
        $("#unauthorizedaccess").show();
      }
      else if(jsonObj["gkstatus"]==3){
        $("#removeUserform").hide();
        $("#connectionFailed").show();
      }
    }

  });

  $(document).off("click","#remove").on("click", "#remove", function(event)
  {
    event.preventDefault();
    if ($.trim($("#username").val())=="") {
      $("#remove-blank-alert").alert();
      $("#remove-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#remove-blank-alert").hide();
      });
      $("#username").focus();
      return false;
    }
    $('#m_confirmdel').modal('show').one('click', '#m_yes', function (e)
    {

        var code = $("#username option:selected").val();
        $.ajax({
          type: "POST",
          url: "/deleteuser",
          global: false,
          async: false,
          datatype: "json",
          data: {"username":code},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0){
              $("#REMOVEuser").click();
              $("#remsuccess-alert").alert();
              $("#remsuccess-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#remsuccess-alert").hide();
              });
              $('.modal-backdrop').remove();
          }
          else if (resp["gkstatus"]==4) {
            $("#accessdenied-alert").alert();
            $("#accessdenied-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#accessdenied-alert").hide();
            });
            $("#username").focus();
          }
          else if (resp["gkstatus"]==5) {
            $("#actiondisallowed-alert").alert();
            $("#actiondisallowed-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#actiondisallowed-alert").hide();
            });
            $("#username").focus();
          }
          else if (resp["gkstatus"]==3) {
            $("#connectionfailed-alert").alert();
            $("#connectionfailed-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#connectionfailed-alert").hide();
            });
            $("#username").focus();
          }
          }
        });

      });
      $('#m_confirmdel').on('shown.bs.modal', function(event) {
        $("#m_no").focus();
      });
  }
);
});
