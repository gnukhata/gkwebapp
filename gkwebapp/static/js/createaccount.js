$(document).ready(function()
{
  $('.modal-backdrop').remove();
  $("#openbal").numeric();
  $("#obal").hide();
  $("#openbal").hide();
  $("#baltbl").hide();

  var sel1 = 0;
  var sel2 = 0;

  $("#groupname").focus(function() {
    sel1 = 1;
  });
  $("#groupname").blur(function(){
    sel1 = 0;
  });
  $("#subgroupname").focus(function() {
    sel2 = 1;
  });
  $("#subgroupname").blur(function(){
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
        f[nextIndex].focus();
        f[nextIndex].select();
      }

    }


    var s2 = $("#subgroupname option:selected").index();
    if ((event.which == 38 && sel2 == 1 && s2 == 0) || (event.which == 38 && (sel1 == 0 && sel2==0)))
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex < n){
        event.preventDefault();
        f[prevIndex].focus();
        f[prevIndex].select();
      }
    }
  });

  $("#baltbl").hide();
  $("#groupname").focus().select();
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


  $.ajax({
    type: "POST",
    url: "/showmultiacc",
    data: {"groupcode":$("#groupname option:selected").val(),"groupname":$("#groupname option:selected").text(),"subgroupcode":$("#subgroupname option:selected").val(),"subgroupname":$("#subgroupname option:selected").text(),"newsubgroup":$("#newsubgroup").val()},
    global: false,
    async: false,
    datatype: "text/html"

  })
  .done(function(resp) {

    $("#multiaccount_modal").html(resp);
    $("#m_multiacc").modal('show');
    $('#m_multiacc').on('shown.bs.modal', function (e)
    {
      $(".m_accname:enabled:first").focus().select();

    });
    $('#m_multiacc').on('hidden.bs.modal', function (e)
    {
      $('#maccounts').attr('checked', false);
      $("#multiaccount_modal").html("");
      $("#reset").click();


    });

  })
  .fail(function() {
    alert("failed");
  });




});


});
