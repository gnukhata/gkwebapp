$(document).ready(function() {
  $("#prodselect").focus();
  var sel1=0;
  var sel2=0;
  var sindex=0;
  $(document).on("focus",'#edituom',function() {
    sel1 = 1;
  });
  $(document).on("blur",'#edituom',function(){
    sel1 = 0;
  });
  $(document).on("focus",'#editcatselect',function(){
    sel2 = 1;
  });
  $(document).on("blur",'#editcatselect',function(){
    sel2 = 0;
  });

  $(document).on("keydown",'.editpr input:not(:hidden),.editpr select', function(e) {
     var n = $(".editpr input:not(:hidden),.editpr select").length;
     var f = $('.editpr input:not(:hidden),.editpr select');
    if (e.which == 13)
    {
      e.preventDefault();
      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();}

      }
    });
    $(document).on("keydown",'.editpr input:not(:hidden),.editpr select', function(e) {
       var n = $(".editpr input:not(:hidden),.editpr select").length;
       var f = $('.editpr input:not(:hidden),.editpr select');
      if (e.which == 38)
      {
        var prevIndex = f.index(this) - 1;
        var elementType = $(this).prop('nodeName');
        if(prevIndex > -1)
        {
          if (elementType=="SELECT")
          {
            if (sel1 == 1 && sel2 == 0)
            {

              sindex= $("#edituom option:selected").index();
            }
            else if (sel1 == 0 && sel2 == 1)
            {

              sindex= $("#editcatselect option:selected").index();
            }

            if (sindex ==0)
            {
              e.preventDefault();
              f[prevIndex].focus();
            }
          }
          else
          {
            e.preventDefault();
            f[prevIndex].focus();

          }
        }

        }
      });

  $("#prodselect").bind("change keyup", function(event) {
    /* Act on the event */
    var prodcode= $("#prodselect option:selected").val();
    if (prodcode!="")
    {

      $.ajax({
        url: '/product?type=details',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"productcode": prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        $("#proddetails").html("");
        $("#proddetails").html(resp);
        $('#proddetails').find('input, textarea, button, select').prop('disabled',true);
        $(".pbutn").show();
        $("#epsubmit").hide();
        $("#epedit").show();



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

  $("#prodselect").keyup(function(event) {
    /* Act on the event */
    if (event.which == 13)
    {
        var prodcode= $("#prodselect option:selected").val();
        if (prodcode!="")
        {
          $("#epedit").click();
        }

    }
  });

  $(document).on('click', '#epedit', function(event) {
    event.preventDefault();
    /* Act on the event */
    $('#proddetails').find('input, textarea, button, select').prop('disabled',false);
    $("#epsubmit").show();
    $("#epedit").hide();
    $("#proddesc").focus();
    $("#proddesc").select();

  });

  $("#editprodform").submit(function(event) {
    /* Act on the event */
    event.preventDefault();
    $.ajax({
      url: '/product?type=edit',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
      data: $("#editprodform").serialize(),
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if (resp["gkstatus"] ==0) {

        $("#editproduct").click();
      }
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });




  $(document).on('click', '#epreset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#editproduct").click();
  });
});
