$(document).ready(function()
{

  $("#groupname").bind("change keyup", function(){
    var gname = $("#groupname option:selected").text();

    if (gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income")
    {
      $("#obal").hide();
      $("#opbal").hide();
    }
    else
    {

      $("#obal").show();
      $("#opbal").show();
    }

    var groups = $("#groupname option:selected").val();
    var grpobj = eval('('+groups+')');

    $.ajax({
      type: "POST",
      url: "/getsubgroup",
      data: grpobj ,
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
      }

    });
  });


  $("#accountform").submit(function(e)
  {
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

          alert(resp["gkstatus"])
        }

      }
    );

    e.preventDefault();
  }
);
});
