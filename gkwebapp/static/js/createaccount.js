$(document).ready(function()
{
  $("#accountform").validate();
  $("#groupname").bind("change keyup", function(){
    var gname = $("#groupname option:selected").text();

    if (gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income")
    {
      $("#obal").hide();
      $("#openbal").hide();
    }
    else
    {

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


  $("#accountform").submit(function(e)
  {
var isvalidate=$("#accountform").valid();
if(isvalidate)
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

            alert("Account created successfully!");
          }

        }
      );



}
    e.preventDefault();
  }
);




});
