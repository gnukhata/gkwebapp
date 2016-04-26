$(document).ready(function()
{
  $("#m_obal").hide();
  $("#m_openbal").hide();
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

$("#m_reset").click(function()
{
  $('#m_addaccount').click();
}
);



  $("#m_accountform").submit(function(e)
  {
var isvalidate=$("#m_accountform").valid();
if(isvalidate)
{
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
            if(resp["gkstatus"])
            {
            alert("Account Created Successfully");
            $('#m_accmodal').modal('hide')
            }
            else
            {
              alert("Account Could Not Be Created");
            }
          }

        }
      );



}
    e.preventDefault();
  }
);




});
