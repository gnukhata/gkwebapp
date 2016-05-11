$(document).ready(function() {
  $("#prjname").focus();
  if($("#prjtable tbody tr").length==0){
    $("#prjtable").hide();
    $("#prjlist").hide();
  }
  else{
    $("#prjtable").show();
    $("#prjlist").show();
  }
  $('.close').click(function() {

    $(this).parent().hide();

  });

  $(document).off("click",".delprj").on("click", ".delprj", function() {
    var prjcode = $(this).closest('tr').attr('value');
    var closesttr = $(this).closest('tr')
    $('#m_confirmdel').modal({ backdrop: 'static', keyboard: false }).one('click', '#prjdel', function (e) {
      $.ajax(
        {
          type: "POST",
          url: "/delproject",
          global: false,
          async: false,
          datatype: "json",
          data: {"projectcode":prjcode},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              closesttr.fadeOut(200, function(){
                closesttr.remove();   //closest method gives the closest element specified
              });
            }
            else if (resp["gkstatus"]==5) {
              $("#transaction-alert").alert();
              $("#transaction-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#transaction-alert").hide();
              });
            }
          }
        });

    });
  });

  $("#prjform").submit(function(e)
  {
    if ($.trim($("#prjname").val())=="") {
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#prjname").focus();
    }
    if ($.trim($("#prjamount").val())=="") {
      $("#prjamount").val("0.00");
    }

    $.ajax(
      {
        type: "POST",
        url: "/addproject",
        global: false,
        async: false,
        datatype: "json",
        data: $("#prjform").serialize(),
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if(resp["gkstatus"]==0){
            $("#showproject").click();
            $("#success-alert").alert();
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#success-alert").hide();
            });
          }
          else if(resp["gkstatus"]==1) {
            $("#duplicate-alert").alert();
            $("#duplicate-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#duplicate-alert").hide();
            });
            $("#prjname").focus();
          }
          else {
            $("#failure-alert").alert();
            $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#failure-alert").hide();
            });
            $("#prjname").focus();
          }

        }

      }
    );
    e.preventDefault();
  });
});
