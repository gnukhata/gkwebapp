$(document).ready(function() {
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
        if (sessionStorage.inv_type == 1){
            $("#viewsaleinvoices").click().focus();
        }
        else if(sessionStorage.inv_type == 2){
            $("#viewpurchesinvoices").click().focus();
        }
        else{
            $("#viewallinvoice").click().focus();
        }
    
    sessionStorage.rtflag = 0;

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
        sessionStorage.inv_type = $("#invoiceviewlist input:radio:checked").val();
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
                $("#viewanotherlist").hide();
            });    
    });
    $("#invoiceviewlist input:radio").change();
});