$(document).ready(function() {

  $("#addcatselect").focus();

  $(document).on("keydown",'.addprod input:not(:hidden), .addprod select', function(e) {
     var n = $(".addprod input:not(:hidden),.addprod select").length;
     var f = $('.addprod input:not(:hidden),.addprod select');
    if (e.which == 13)
    {
      e.preventDefault();
      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();}

      }
    });
    $(document).on("keydown",'.addprod input:not(:hidden),.addprod select', function(e) {
       var n = $(".addprod input:not(:hidden),.addprod select").length;
       var f = $('.addprod input:not(:hidden),.addprod select');
      if (e.which == 38)
      {
        var prevIndex = f.index(this) - 1;
        var elementType = $(this).prop('nodeName');
        if(prevIndex > -1)
        {
          if (elementType=="SELECT")
          {
            var sindex= $(".sel option:selected").index();
            if (sindex <=1)
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

  $("#addcatselect").bind("change keyup", function(event) {
    /* Act on the event */

    var catcode= $("#addcatselect option:selected").val();

    if (catcode!="")
    {

      $.ajax({
        url: '/product?type=specs',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"categorycode": catcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        $("#specifications").html("");
        $("#specifications").html(resp);
        $(".pbutn").show();
        $(".pds").show();
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

  $("#addprodform").submit(function(event) {
    /* Act on the event */
    event.preventDefault();
    $.ajax({
      url: '/product?type=save',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
      data: $("#addprodform").serialize(),
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if (resp["gkstatus"] ==0) {

        $("#addproduct").click();
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

  $(document).on('click', '#apreset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#addproduct").click();
  });
});
