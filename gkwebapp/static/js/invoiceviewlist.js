$(document).ready(function() {
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    $("#invoiceviewlist input:radio:checked").focus().click();

    $("#invoiceviewlist input:radio").keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#latable tbody tr:first td:eq(1) a').focus();
            $('#latable tbody tr:first').addClass('selected');
        }
    });

    $("#invoiceviewlist input:radio").change(function(event) {
        $("body").css("padding-right", '0px');
        // creating dataset for retrieving report from the server.
        var dataset = {};
        dataset = {
            "flag": $("#invoiceviewlist input:radio:checked").val(),
            "fromdate": sessionStorage.yyyymmddyear1,
            "todate": sessionStorage.yyyymmddyear2
        };
        $("#msspinmodal").modal("show");
        $.ajax({
                type: "POST",
                url: "/invoice?action=showlist",
                global: false,
                async: false,
                datatype: "text/html",
                data: dataset,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
            })
            .done(function(resp) {
                $("#slectedlist").html("");                
                $("#slectedlist").html(resp);
                $("#invoiceviewlist input:radio:checked").focus();
            });    

   
    });
    $("#invoiceviewlist input:radio").change();
});