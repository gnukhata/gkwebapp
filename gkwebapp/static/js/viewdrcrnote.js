$(document).ready(function() {
    $("#sel_creditnote").focus();
    $("#sel_creditnote").change(function(event) {
	var drcrid = $("#sel_creditnote option:selected").val();
        /*
        Getting complete information for the selected 'create cash memo' using its id.
        Display details in the corresponding fields.
	Only 'create cash memos' can 'Print'. 
	*/
            $.ajax({
                    url: '/drcrnote?action=getdrcrnotedetail',
                    type: 'POST',
                    dglobal: false,
                    async: false,
                    data: {"drcrid":drcrid },
                    datatype: "text/html",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    $("#viewsingledrcr").show();
		    $("#viewsingledrcr").html(resp);
                    console.log("success");
		    $("#viewinvfooter").show();
		    //$("#cashmemo_print").show();
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
    });
    $("#sel_creditnote").keydown(function(event){
	if(event.which == 13){
	    $("#drcr_print").focus();
	}
    });
     $("#drcr_print").click(function(event) {
        $.ajax({
                url: '/drcrnote?action=print',
                type: 'POST',
                dataType: 'html',
            data: {"drcrid":$("#sel_creditnote option:selected").val()},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                $('#printdiv').html(resp);
		$('#printdiv').show();
		$('#tabdiv').hide();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });
});
