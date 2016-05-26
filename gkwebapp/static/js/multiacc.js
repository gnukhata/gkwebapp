$(document).ready(function() {


  $(document).off("keyup",".m_accname").on("keyup",".m_accname",function(event)
  {

    if (event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      var accname = $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').val()
      if (accname=="")
      {
        return false;
      }
      else
      {
        var m_grpnm = $("#m_gname").val();
        if(m_grpnm=="Select Group" || m_grpnm=="Direct Expense" || m_grpnm=="Direct Income" || m_grpnm=="Indirect Expense" || m_grpnm=="Indirect Income")
        {
          $(".m_add").click();
        }
        else
        {
          $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input').focus();
        }
      }
    }
  });

  $(document).off("click",".m_add").on("click", ".m_add", function()
  {

    var curindex = $(this).closest('tr').index();
    var accname = $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').val()
    if (accname=="")
    {

      $("#m_blank-alert").alert();
      $("#m_blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#m_blank-alert").hide();
      });
      $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').focus();
      return false;
    }
    $.ajax({
      url: '/accountexists',
      type: 'POST',
      datatype: 'json',
      data: {"accountname": accname}
    })
    .done(function() {
      
    })

  });

});
