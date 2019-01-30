$(document).ready(function() {
    // $('.modal-backdrop').remove();
    $("#submit").hide();
    $("#editbud").bind("change", function(e) {
        $("#submit").hide();
        var budid = $("#editgoddet option:selected").val();
        // var goname = $("#editgoddet option:selected").text();
        $.ajax({
            type: "POST",
            url: "/budget?type=getbuddetails",
            data: {
                "budid": budid
            },
            global: false,
            async: false,
            dataType: "json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            success: function(resp) {
                goddetails = resp["gkresult"];
                $("#budname").val(goddetails["budname"]);
                $("#budname").prop("disabled", true);
                $("#startdate").val(goddetails["startdate"]);
                $("#startdate").prop("disabled", true);
                $("#enddate").val(goddetails["enddate"]);
                $("#enddate").prop("disabled", true);
                $("#btype").val(goddetails["btype"]);
                $("#btype").prop("disabled", true);
                $("#gaflag").val(goddetails["gaflag"]);
                $("#gaflag").prop("disabled", true);
                $(".editgodownform").show();
                $("#form-footer").show();
                $("#delete").show();
                $("#edit").show();
            }
        });
    });
});