    $(document).ready(function(){
    // console.log("dfdfsfdf");
    $("#orgdel").focus();
    $("#orgdel").click(function(e){
    //   event.preventDefault();

        $.ajax({
            url: '/deleteorg',
            type: 'POST',
            datatype: 'json',
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
          })
           .done(function(resp) {
             if (resp["gkstatus"]==0) {
               sessionStorage.clear();
               window.location.replace("/");
             }
           })
           .fail(function() {
             console.log("error");
           })
           .always(function() {
             console.log("complete");
           });
      });
    
});