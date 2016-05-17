$(document).ready(function()
{
  $("#baltbl").hide();
  $("#groupname").focus();
  $("#accountform").validate();
  $("#groupname").bind("change keyup", function(){
    var gname = $("#groupname option:selected").text();

    if (gname=="Select Group" || gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income")
    {
      $("#obal").hide();
      $("#openbal").hide();
      $("#baltbl").hide();

    }
    else
    {
      $("#baltbl").show();
      $("#obal").show();
      $("#openbal").show();
    }

    var groups = $("#groupname option:selected").val();
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
        $('#subgroupname').empty();
        for (i in subgroups ) {
          $('#subgroupname').append('<option value="' + subgroups[i].subgroupcode + '">' +subgroups[i].subgroupname+ '</option>');
        }
        var grpnam=$("#groupname option:selected").text();
        if (grpnam=="Direct Expense" || grpnam=="Indirect Expense" || grpnam=="Direct Income" || grpnam=="Indirect Income" || grpnam=="Loans(Asset)" || grpnam=="Reserves" || grpnam=="Capital" || grpnam=="Miscellaneous Expenses(Asset)" || grpnam=="Corpus")
        {
            $('#subgroupname').prepend('<option value="None">None</option>');
        }
        $('#subgroupname').append('<option value="New">New Sub-Group</option>');
      }

    });
  });

$("#nsgp").hide();

$(".gsselect").bind("change keyup", function(){
var sgroups = $("#subgroupname option:selected").val();
if (sgroups=="New")
{
  $("#nsgp").show();

}
else
{
  $("#nsgp").hide();
}


});

$("#reset").click(function()
{
  $('#addaccount').click();
}
);



  $("#accountform").submit(function(e)
  {

    if ($.trim($("#accountname").val())=="") {
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#accname").focus().select();
      return false;
    }

    if ($.trim($("#groupname option:selected").val())=="") {
      $("#grpblank-alert").alert();
      $("#grpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#grpblank-alert").hide();
      });
      $("#groupname").focus().select();
      return false;
    }

    if ($.trim($("#subgroupname option:selected").val())=="") {
      $("#sgrpblank-alert").alert();
      $("#sgrpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#sgrpblank-alert").hide();
      });
      $("#subgroupname").focus().select();
      return false;
    }

if ($("#newsubgroup").is(':visible')) {

  if ($.trim($("#newsubgroup").val())=="") {
    $("#nsblank-alert").alert();
    $("#nsblank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#nsblank-alert").hide();
    });
    $("#newsubgroup").focus().select();
    return false;
  }

}

    var ob = $('#openbal').val();
    if(ob=="")
    {
      $('#openbal').val("0.00");
    }





      $.ajax(
        {

          type: "POST",
          url: "/addaccount",
          global: false,
          async: false,
          datatype: "json",
          data: $("#accountform").serialize(),
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if(resp["gkstatus"]==0)
            {
              $("#reset").click();
              $('.modal-backdrop').remove();
              $("#success-alert").alert();
              $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert").hide();
              });
            }
            else if(resp["gkstatus"]==1)
            {
              $("#duplicate-alert").alert();
              $("#duplicate-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#duplicate-alert").hide();
              });
              $("#accname").focus().select();
            }
            else
            {
              $("#failure-alert").alert();
              $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#failure-alert").hide();
              });
              $("#accname").focus().select();
            }
          }

        }
      );




    e.preventDefault();
  }
);


  $('#maccounts').change(function() {
    if ($.trim($("#groupname option:selected").val())=="") {
      $("#grpblank-alert").alert();
      $("#grpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#grpblank-alert").hide();
      });
      $("#groupname").focus().select();
      $('#maccounts').attr('checked', false);
      return false;
    }
    else if($.trim($("#subgroupname option:selected").val())=="") {
      $("#sgrpblank-alert").alert();
      $("#sgrpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#sgrpblank-alert").hide();
      });
      $("#subgroupname").focus().select();
      $('#maccounts').attr('checked', false);
      return false;
    }
    else if ($("#newsubgroup").is(':visible')) {

        if ($.trim($("#newsubgroup").val())=="") {
          $("#nsblank-alert").alert();
          $("#nsblank-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#nsblank-alert").hide();
          });
          $("#newsubgroup").focus().select();
          $('#maccounts').attr('checked', false);
          return false;
        }

    }
    else
    {
      $('#m_multiacc').modal('show');
    }

  });

  $('#m_multiacc').on('show.bs.modal', function (e)
  {
    $('#m_gname').val($('#groupname option:selected').text());

    if ($("#newsubgroup").is(':visible')) {
      $('#m_sgname').val($.trim($("#newsubgroup").val()));
    }
    else {
      $('#m_sgname').val($('#subgroupname option:selected').text());

    }


  });

  $('#m_multiacc').on('hidden.bs.modal', function (e)
  {
    $('#maccounts').attr('checked', false);


  });

});
