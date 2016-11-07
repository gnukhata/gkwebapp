$(document).ready(function() {
  $("#prodselect").focus();
  var sel1=0;
  var sel2=0;
  var sindex=0;
  var category;
  var existingcatspecs;
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
      if(nextIndex < n)
      {
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }
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
            f[nextIndex].select();

          }
        }

        }
      });
  $("#prodselect").change(function(event) {
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
        category = $("#editcatselect option:selected").val();
        existingcatspecs = $("#editspecifications").clone();


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

  $(document).on("change","#editcatselect",function(event) {
    /* Act on the event */

    var catcode= $("#editcatselect option:selected").val();
    if (catcode == category)
    {
      $("#editspecifications").html(existingcatspecs);
      $('#editspecifications').find('input, textarea, button, select').prop('disabled',false);
      return false;
    }
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
        $("#editspecifications").html("");
        $("#editspecifications").html(resp);
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



  $("#editprodform").submit(function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#proddesc").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#proddesc").focus();
      $("#proddesc").select();
      return false;
    }

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
        $('.modal-backdrop').remove();
        $("#editsuccess-alert").alert();
        $("#editsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#editsuccess-alert").hide();
        });
        $("#editproduct").click();
      }
      else if (resp["gkstatus"] ==1)
      {

        $('.modal-backdrop').remove();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        $("#proddesc").focus();
        $("#proddesc").select();
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


  $(document).on('click', '#epdelete', function(event) {
    event.preventDefault();
    /* Act on the event */
    var prodcode= $("#prodselect option:selected").val();
    $('#m_confirmdel').modal('show').one('click', '#proddel', function (e)
    {
    $.ajax({
      url: '/product?type=delete',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
      data: {"productcode":prodcode},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if (resp["gkstatus"] ==0) {
        $("#editproduct").click();
        $('.modal-backdrop').remove();
        $("#deletesuccess-alert").alert();
        $("#deletesuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#deletesuccess-alert").hide();
        });
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
});
$('#m_confirmdel').on('shown.bs.modal', function(event) {
  $("#m_cancel").focus();
});
$('#m_confirmdel').on('hidden.bs.modal', function(event) {
  $("#prodselect").focus();
});

  });

  $(document).on('click', '#epreset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#editproduct").click();
  });
});
