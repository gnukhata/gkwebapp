$(document).ready(function() {

$('tbody tr:first-child td:first-child a').focus();
$('tbody tr:first-child').addClass('selected');


$(document).on('focus' ,'.vno',function() {
        $('#vtable tr').removeClass('selected');
      $(this).closest('tr').addClass('selected');
  });

$(document).on('blur' ,'.vno',function() {
        $('#vtable tr').removeClass('selected');

  });

$(document).on('keyup' ,'.vno',function(event) {
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if (event.which==40)
  {

  $('tr:eq('+nextindex+') a').focus();
  }
  else if (event.which==38)
  {

  $('tr:eq('+previndex+') a').focus();
  }

  });

  var urole = $("#urole").val();

  $(".table").on('keyup','tr:not(:first)',function(e){
      e.preventDefault();
      var id = $(this).attr('value');
      var rindex = $(this).index();
      if(e.which==32)
      {
        if(urole =="-1")
        {
          var stat = $(this).find('td:eq(1)').html();

          if(stat=="")
          {
            vstatus = "True";

          }
          else
          {
            vstatus = "False";
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
                if(stat=="")
                {
                  $('tr:eq('+rindex+') td:eq(1)').html("*");

                }
                else
                {
                  $('tr:eq('+rindex+') td:eq(1)').html("");
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
      var currindex = $(this).parent().parent().index();
      $('#vtable tr').removeClass('selected');
      $(this).toggleClass('selected');
      $('tr:eq('+currindex+') a').focus();

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
          $('#myModal').on('hide.bs.modal', function (e)
          {
            setTimeout( function() { $("#submit").click(); }, 10 );
          });


        }
      }
      );



  });





});
