$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    $("#createselectdiv").hide();
    $("#cashmemo_print").hide();
    $("#recordradio").click().focus();
    
    //click event for Record and Create radio buttons.
    $(document).off("change", '.cashmemo').on("change", '.cashmemo', function(event) {
	if($("#recordradio").is(":checked")){
	    $("#recordselectdiv").show();
	    $("#createselectdiv").hide();

	}else if ($("#createradio").is(":checked")) {
	    $("#recordselectdiv").hide();
	    $("#createselectdiv").show();
	}
    });

    //Focus in event for 'Record' radio button.
    $(document).off('focusin', '#recordradio').on('focusin', '#recordradio', function(event) {
	event.preventDefault();
	$("#viewcashmemodiv").html("");
	$("#record_all_no option:first").prop("selected",true);
	$("#record_no_all").change();
	$("#viewinvfooter").hide(); 
    });

    //Focus in event for 'Create' radio button.
    $(document).off('focusin', '#createradio').on('focusin', '#createradio', function(event) {
	event.preventDefault();
	$("#viewcashmemodiv").html("");
	$("#cashmemo_print").hide();
	$("#viewinvfooter").hide(); 
	$("#invoice_all_no option:first").prop("selected",true);
	$("#invoice_no_all").change();
    });
    
    //Keydown event for 'record' and 'create' radio button.
    $(document).off('keydown', '.cashmemo').on('keydown', '.cashmemo', function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if ($("#recordradio").is(":checked")) {
		$("#record_all_no").focus();
	    }
	    else if ($("#createradio").is(":checked")) {
		$("#invoice_all_no").focus();
	    }
	}
    });

    
  $("#invoice_all_no").change(function(event) {
        /*
        Getting complete information for the selected 'create cash memo' using its id.
        Display details in the corresponding fields.
	Only 'create cash memos' can 'Print'. 
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
		    $("#cashmemo_print").show();
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        }
  });

      $("#record_all_no").change(function(event) {
        
        //Getting complete information for the selected 'Record cash memo' using its id.
        //Display details in the corresponding fields.
        var invid = $("#record_all_no option:selected").val();
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
		    $("#viewinvfooter").hide();
		    $("#cashmemo_print").hide();
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
