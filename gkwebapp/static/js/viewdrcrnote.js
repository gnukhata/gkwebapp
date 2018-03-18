$(document).ready(function() {
    $("#sel_creditnote").focus();
    $("#sel_debitnote").focus();
    $("#sel_creditnote").change(function(event) {
	var drcrid = $("#sel_creditnote option:selected").val();
	console.log("cool "+drcrid);
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
		    //$("#viewinvfooter").show();
		    //$("#cashmemo_print").show();
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

	/*$.ajax({
	    url: '/drcrnote?action=getdrcrnotedetail',
	    type: 'POST',
	    dglobal: false,
	    async : false,
	    data: {"drcrid": $("#sel_creditnote option:selected").val() },
	    dataType: "text/html",
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    }
	   })
	    .done(function(resp) {
		if(resp.gkstatus==0){
		    console.log();
		
		console.log("Credit DATA");
		//console.log("resp");
		$("#viewsingledrcrdiv").show();
		}
	    })
	    .fail(function() {
		console.log("error");
	    })
	    .always(function() {
		console.log("complete");
	    });
	
    }); // ends sel_creditnote change
  */ 
    });
});
