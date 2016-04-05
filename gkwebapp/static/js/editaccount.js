$(document).ready(function()
{
  $("#editaccountform").validate();
  $("#editaccountname")..bind("change keyup", function()
  {
    var acccode = $("#editaccountname option:selected").val();
    $.ajax({
      type: "POST",
      url: "/getaccdetails",
      data: {"accountcode":acccode},
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
}
);
