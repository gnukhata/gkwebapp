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
    $('#m_confirmdel').modal('show').one('click', '#prjdel', function (e) {
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
            $("#prjname").focus();
          }
        });

    });
    $('#m_confirmdel').on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
    });
  });

  $(document).off("click",".editprj").on("click", ".editprj", function() {
    var prjcode = $(this).closest('tr').attr('value');
    var closesttr = $(this).closest('tr')
    $('#m_editprj').modal('show').one('click',"#m_edit", function(event) {
      if ($.trim($("#m_prjname").val())=="") {
        return false;
      }
      if ($.trim($("#m_prjamount").val())=="") {
        $("#m_prjamount").val("0.00");
      }
      $.ajax(
        {
          type: "POST",
          url: "/editproject",
          global: false,
          async: false,
          datatype: "json",
          data: {"projectcode":prjcode ,"projectname":$.trim($("#m_prjname").val()),"sanctionedamount":$.trim($("#m_prjamount").val())},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              $("#showproject").click();
              $('.modal-backdrop').remove();
              $("#success-alert").alert();
              $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert").hide();
              });
            }
          }
        });
    });;
    $('#m_editprj').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
    {
      $.ajax(
        {
          type: "POST",
          url: "/viewproject",
          global: false,
          datatype: "json",
          data: {"projectcode":prjcode},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              var prj = resp["gkdata"];
              $("#m_prjname").val(prj["projectname"]);
              $("#m_prjamount").val(prj["sanctionedamount"]);
            }
            $("#m_prjname").select();
            $("#m_prjname").focus();
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
