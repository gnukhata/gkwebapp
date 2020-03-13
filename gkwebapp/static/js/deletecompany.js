   
      $(document).ready(function(){
    $("#orgdel").focus();
    $("#orgdel").click(function(e){
      $("#deletebutton").show();
      $("#userpassword").focus().select();
    });
      $("#confdel").click(function(e){
      event.preventDefault();

        $.ajax({
          url: '/getorgcode',
          type: 'POST',
          datatype: 'json',
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          },
          success: function(resp)
          {
            
            $.ajax({  //used to authenticate the selected subsidiary organisation.
              type: "POST",
              url: "/userlogin",
              global: false,
              async: false,
              datatype: "json",
              data: {"username":sessionStorage.username, "userpassword":$("#userpassword").val(), "orgcode":resp['gkdata']},
              success: function(resp)
              {
                if(resp["gkstatus"]==0)
                {
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
                }
                else
                {
                    $("#paswd-alert").alert();
                    $("#paswd-alert").fadeTo(1000, 500).slideUp(100, function(){
                    $("#paswd-alert").hide();
                    $("#userpassword").focus().select();
                  });
                }
              }
              });

          
          }
        });


      });

         $("#userpassword").keydown(function(e){
      if(e.which==13){    
          $("#confdel").focus();
    }
    });
    
});