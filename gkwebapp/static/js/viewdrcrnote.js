$(document).ready(function() {
    console.log("view drcrnote ");
    $("#sel_creditnote").change(function(event) {
	console.log("Hello");
	$.ajax({
	    url: '/drcrnote?action=getdrcrnotedetails',
	    type: 'POST',
	    dataType: 'json',
	    async : false,
	    data: {"drcrid": $("#sel_creditnote option:selected").val()},
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    }
	})
	    .done(function(resp) {
		console.log("Credit DATA");
		
	    })
	.fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
	
    }); // ends sel_creditnote change
   
    
});
