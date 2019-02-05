$(document).ready(function() {
    $('.modal-backdrop').remove();
    $("#msspinmodal").modal("hide");
    $("#budgetlist").focus();
    var financialstart = sessionStorage.yyyymmddyear1;
    $("#submit").click(function(event) {
       $.ajax({
        type: "POST",
        url: "/budget?type=report",
        global: false,
        async: false,
        datatype: "json",
        data: {"buddetails":$("#budgetlist option:selected").text(),"budid": $("#budgetlist option:selected").val(),"financialstart":financialstart},
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
        success: function(resp) {
            $("#info").html(resp);
        }
    }); 

    });
});