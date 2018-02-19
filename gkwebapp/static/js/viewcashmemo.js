$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    //$("#invoice_all_no").focus();
    $("#recordradio").focus();
    $("#createselectdiv").hide();
    $("#cashmemo_print").hide();

    $(document).off('change', '.cashmemo').on('change', '.cashmemo', function(event) {
	    if($("#recordradio").is(":checked")){
		$("#recordselectdiv").show();
		$("#createselectdiv").hide();
	    }
	    else if ($("#createradio").is(":checked")) {
		$("#recordselectdiv").hide();
		$("#createselectdiv").show();
	    }
    });
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
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        }
  });

  //  
      $("#record_all_no").change(function(event) {
        
        //Getting complete information for the selected cash memo using its id.
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
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        }
    });
//

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
