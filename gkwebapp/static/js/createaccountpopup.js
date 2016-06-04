$(document).ready(function()
{

  var sel1 = 0;
  var sel2 = 0;

  $("#m_groupname").focus(function() {
    sel1 = 1;
  });
  $("#m_groupname").blur(function(){
    sel1 = 0;
  });
  $("#m_subgroupname").focus(function() {
    sel2 = 1;
  });
  $("#m_subgroupname").blur(function(){
    sel2 = 0;
  });


  $('input:text,select, input:checkbox').keydown( function(event) {
    var n = $("input:text:visible,select, input:checkbox").length;
    var f = $('input:text:visible,select, input:checkbox');

    if (event.which == 13)
    {


      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        event.preventDefault();
        f[nextIndex].focus();}

      }


      var s2 = $("#m_subgroupname option:selected").index();
      if ((event.which == 38 && sel2 == 1 && s2 == 0) || (event.which == 38 && (sel1 == 0 && sel2==0)))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          event.preventDefault();
          f[prevIndex].focus();}
        }
      });

  $("#m_baltbl").hide();
  $("#m_groupname").focus();
  $("#m_accountform").validate();
  $("#m_groupname").bind("change keyup", function(){
    var gname = $("#m_groupname option:selected").text();

    if (gname=="Select Group" || gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income")
    {
      $("#m_obal").hide();
      $("#m_openbal").hide();
      $("#m_baltbl").hide();

    }
    else
    {
      $("#m_baltbl").show();
      $("#m_obal").show();
      $("#m_openbal").show();
    }

    var groups = $("#m_groupname option:selected").val();
    $.ajax({
      type: "POST",
      url: "/getsubgroup",
      data: {"groupcode":groups},
      global: false,
      async: false,
      dataType: "json",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(jsonObj) {
        subgroups = jsonObj["gkresult"],
        $('#m_subgroupname').empty();
        for (i in subgroups ) {
          $('#m_subgroupname').append('<option value="' + subgroups[i].subgroupcode + '">' +subgroups[i].subgroupname+ '</option>');
        }
        var grpnam=$("#m_groupname option:selected").text();
        if (grpnam=="Direct Expense" || grpnam=="Indirect Expense" || grpnam=="Direct Income" || grpnam=="Indirect Income" || grpnam=="Loans(Asset)" || grpnam=="Reserves" || grpnam=="Capital" || grpnam=="Miscellaneous Expenses(Asset)" || grpnam=="Corpus")
        {
            $('#m_subgroupname').prepend('<option value="None">None</option>');
        }
        $('#m_subgroupname').append('<option value="New">New Sub-Group</option>');
      }

    });
  });

$("#m_nsgp").hide();

$(".gsselect").bind("change keyup", function(){
var sgroups = $("#m_subgroupname option:selected").val();
if (sgroups=="New")
{
  $("#m_nsgp").show();

}
else
{
  $("#m_nsgp").hide();
}


});





  $("#m_accountform").submit(function(e)
  {

    if ($.trim($("#m_accountname").val())=="") {
      $("#m_blank-alert").alert();
      $("#m_blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#m_blank-alert").hide();
      });
      $("#m_accname").focus().select();
      return false;
    }

    if ($.trim($("#m_groupname option:selected").val())=="") {
      $("#m_grpblank-alert").alert();
      $("#m_grpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#m_grpblank-alert").hide();
      });
      $("#m_groupname").focus().select();
      return false;
    }

    if ($.trim($("#m_subgroupname option:selected").val())=="") {
      $("#m_sgrpblank-alert").alert();
      $("#m_sgrpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#m_sgrpblank-alert").hide();
      });
      $("#m_subgroupname").focus().select();
      return false;
    }

if ($("#m_newsubgroup").is(':visible')) {

  if ($.trim($("#m_newsubgroup").val())=="") {
    $("#m_nsblank-alert").alert();
    $("#m_nsblank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#m_nsblank-alert").hide();
    });
    $("#m_newsubgroup").focus().select();
    return false;
  }

}

    var ob = $('#m_openbal').val();
    if(ob=="")
    {
      $('#m_openbal').val("0.00");
    }

      $.ajax(
        {

          type: "POST",
          url: "/addaccount",
          global: false,
          async: false,
          datatype: "json",
          data: $("#m_accountform").serialize(),
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if(resp["gkstatus"]==0)
            {
              $("#selpopupaccount").val($("#m_accountname").val());
              $("#m_success-alert").alert();
              $("#m_success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#m_success-alert").hide();
              });
              $('#m_accmodal').modal('hide');
              $('.modal-backdrop').remove();
            }
            else if(resp["gkstatus"]==1)
            {
              $("#m_duplicate-alert").alert();
              $("#m_duplicate-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#m_duplicate-alert").hide();
              });
              $("#m_accname").focus().select();
            }
            else
            {
              $("#m_failure-alert").alert();
              $("#m_failure-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#m_failure-alert").hide();
              });
              $("#m_accname").focus().select();
            }
          }

        }
      );




    e.preventDefault();
  }
);
});
