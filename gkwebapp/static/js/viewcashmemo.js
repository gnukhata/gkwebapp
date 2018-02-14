$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    //$("#invoice_all_no").focus();
    $("#all").focus();
    $("#cashmemo_print").hide();

    $(document).off('keydown', '.iib').on('keydown', '.iib', function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if($("#all").is(":checked")){
		$("#invoice_all_no").focus();
	    }
	    else if ($("#reccashmemo").is(":checked")) {
		$("#invoice_all_no").focus();
	    }
	    else if ($("#createcashmemo").is(":checked")) {
		$("#invoice_all_no").focus();
	    }
	}
    });

    
  $("#invoice_all_no").change(function(event) {
        /*
        Getting complete information for the selected cash memo using its id.
        Display details in the corresponding fields.
*/
        var invid = $("#invoice_all_no option:selected").val();
        console.log("inv selected"+invid);
        if (invid != "") {


            $.ajax({
                    url: '/cashmemos?action=showcashmemo',
                    type: 'POST',
                    dglobal: false,
                    async: false,
                    data: {"invid": invid},
                    datatype: "text/html",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                      $("#viewcashmemodiv").html(resp);
                    console.log("success");
		    $("#viewinvfooter").show();
		    if($("#invoice_all_no option:selected").attr("inout") == 15){
			$("#cashmemo_print").show();
		    }else{ $("#cashmemo_print").hide(); }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        }




    });

    $("#cashmemo_print").click(function(event) {
        $.ajax({
                url: '/cashmemos?action=print',
                type: 'POST',
                dataType: 'html',
            data: {"invid":$("#invoice_all_no option:selected").val()},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                $('#info').html(resp);
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });
});
