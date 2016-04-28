$(document).ready(function() {



  $('tbody tr:first-child td:first-child a').focus();
  $('tbody tr:first-child td:first-child a').closest('tr').addClass('selected');


  $(document).on('focus' ,'.vno',function() {
    $('#vtable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).on('blur' ,'.vno',function() {
    $('#vtable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;


  $(document).on('keyup' ,'.vno',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {

      $('tbody tr:eq('+nextindex+') td:eq(0) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('tbody tr:eq('+previndex+') td:eq(0) a').focus();
      }
    }

  });

  var urole = $("#urole").val();

  $("#vtable").on('keyup','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==32)
    {

      if(urole =="-1")
      {
        var stat = $(this).find('td:eq(1)').html();

        if(stat=="*")
        {

          vstatus = "False";

        }
        else
        {

          vstatus = "True";
        }
        $.ajax({
          type: "POST",
          url: "/lockvoucher",
          data: {"id":id,"vstatus":vstatus},
          global: false,
          async: false,
          dataType: "json",
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(jsonObj)
          {
            gkstatus=jsonObj["gkstatus"]
            if(gkstatus)
            {
              if(stat=="*")
              {

                $('tbody tr:eq('+rindex+') td:eq(1)').html(" ");

              }
              else
              {
                $('tbody tr:eq('+rindex+') td:eq(1)').html("*");
              }
            }
          }
        });
      }
      else
      {
        $("#ua-alert").alert();
        $("#ua").focus();
        $("#ua-alert").fadeTo(2000, 500).slideUp(500, function(){
          $("#ua-alert").alert('close');
        });

        return false;

      }
    }
  });


  $(".table").on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#vtable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('tbody tr:eq('+currindex+') a').focus();

  });

  $("#vtable").on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('tbody tr:eq('+rindex+')').dblclick() ;
    }
});

  $(".table").on('dblclick','tr:not(:first)',function(e){
    e.preventDefault();
    var id = $(this).attr('value');

    $.ajax(
      {

        type: "POST",
        url: "/viewvoucher",
        global: false,
        async: false,
        datatype: "text/html",
        data : {"id":id},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          $("#viewvc").html(resp);
          $('#myModal').modal('show');
          $('#myModal').on('shown.bs.modal', function (e)
          {
            $("#edit").focus();

          });
          $('#myModal').on('hidden.bs.modal', function (e)
          {
            $("#viewvc").html("");
            $("#submit").click();


          });


        }
      }
    );



  });





});
