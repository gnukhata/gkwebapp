/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.and old.stockflag = 's'

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/

$(document).ready(function() {
  $(".fixed-table-loading").remove();
  $("#msspinmodal").modal("hide");
  $('tbody tr:first-child td:first-child a').focus();
  $('tbody tr:first-child td:first-child a').closest('tr').addClass('selected');

  $(document).off('focus' ,'.vno').on('focus' ,'.vno',function() {
    $('#vtable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.vno').on('blur' ,'.vno',function() {
    $('#vtable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;

     //For redirecting to the homepage
    $("#backbutton").click(function(event) {
	location.reload();
    });

  $(document).off('keydown' ,'.vno').on('keydown' ,'.vno',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();

      $('tbody tr:eq('+nextindex+') td:eq(0) a').focus();
    }
    else if (event.which==38)
    {
      event.preventDefault();
      if(previndex>-1)
      {
        $('tbody tr:eq('+previndex+') td:eq(0) a').focus();
      }
    }

  });

  var urole = $("#urole").val();

  $("#vtable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('data-value');
    var rindex = $(this).index();

    if(e.which==13)
    {

      $('tbody tr:eq('+rindex+')').dblclick() ;
    }


    if(e.which==32)
    {
      e.preventDefault();
      var stat = $(this).find('td:eq(1)').html();
      if(urole =="-1" || urole=="0")
      {


        if(stat=="***")
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
              gkstatus=jsonObj["gkstatus"];
            if(gkstatus)
            {
              if(stat=="***")
              {

                $('tbody tr:eq('+rindex+') td:eq(1)').html("&nbsp");

              }
              else
              {
                $('tbody tr:eq('+rindex+') td:eq(1)').html("***");
              }
            }
          }
        });
      }
      else
      {
        $("#ua-alert").alert();
        $("#ua").focus();
        $("#ua-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#ua-alert").alert('close');
        });

        return false;

      }
    }
  });


  $(".table").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('data-value');
    var currindex = $(this).index();
    $('#vtable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('tbody tr:eq('+currindex+') a').focus();

  });

$("#viewprintableversion").click(function(event) {
  $("#msspinmodal").modal("show");
  $.ajax({
    type: "POST",
    url: "/printvouchers",
    data: $("#findvoucher").serialize(),
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    }
  })
   .done(function(resp) {
     $("#fevoucherrow").hide();
     $("#fevoucherhiddenprint").hide();
     $("#vct").html(resp);
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });


});

$('#fvclearfields').click(function(){
  $(".search").children(".form-control").val("");
  $("#fvclearfields").hide();
  $(".search").children(".form-control").focus();
});

$(".search").children(".form-control").keyup(function(event){
  $("#fvclearfields").show();
  if (event.keyCode == 27) {
    $(this).val("");
    $("#fvclearfields").hide();
  }
  else if ($(this).val() == "") {
    $("#fvclearfields").hide();
  }
});

  $("#vtable").off('dblclick','tr').on('dblclick','tr',function(e){
    e.preventDefault();
      var id = $(this).attr('data-value');
      $("#vouchernumberinput").val(id);
    $("#modalindex").val($(this).index());
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
          $("#viewvc").html("");
          $('.modal-backdrop').remove();
          $('.modal').modal('hide');
          $("#viewvc").html(resp);
          $('#myModal').modal('show');
          $('#myModal').on('shown.bs.modal', function (e)
          {
            $(".btnfocus:enabled:first").focus();

          });

          $('#myModal').on('hidden.bs.modal', function (e)
          {
        	  if($("#hideinp").val()==0)
        	  {
            $('.modal-backdrop').remove();
            $("#viewvc").html("");
            $("#submit").click();
        	  }

          });

        }
      }
    );



  });





});
