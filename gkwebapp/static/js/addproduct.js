$(document).ready(function() {
$('.modal-backdrop').remove();
  $("#addcatselect").focus();
  var addtextareasel=0;
  $(document).off('focus', '#addproddesc').on('focus', '#addproddesc',function(event) {
    /* Act on the event */
    addtextareasel=1;


  });

$(document).off('blur', '#addproddesc').on('blur', '#addproddesc',function(event) {
  /* Act on the event */
  addtextareasel=0;
$("#addproddesc").val($("#addproddesc").val().trim());

});
$(document).keyup(function(event)
{
  /* Act on the event */
  if (event.which == 45)
  {
    event.preventDefault();
    $("#apsubmit").click();
  }
});
var adddelta = 500;
var addlastkeypressTime =0;
  $(document).on("keydown",'.addprod input:not(:hidden),.addprod textarea, .addprod select', function(e) {
     var n = $(".addprod input:not(:hidden),.addprod textarea,.addprod select").length;
     var f = $('.addprod input:not(:hidden),.addprod textarea,.addprod select');
     if (e.which == 13)
     {
       var nextIndex = f.index(this) + 1;
       if (addtextareasel==1)
       {
         var addthiskeypressTime = new Date();
         if (addthiskeypressTime - addlastkeypressTime<=adddelta)
         {
             f[nextIndex].focus();
             f[nextIndex].select();
             addthiskeypressTime = 0;

         }
         addlastkeypressTime = addthiskeypressTime;

       }
       else
       {


         if(nextIndex < n)
         {
           e.preventDefault();
           f[nextIndex].focus();
           f[nextIndex].select();
         }

       }


     }
    });
    $(document).on("keydown",'.addprod input:not(:hidden),.addprod textarea,.addprod select', function(e) {
       var n = $(".addprod input:not(:hidden),.addprod textarea,.addprod select").length;
       var f = $('.addprod input:not(:hidden),.addprod textarea,.addprod select');
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
            f[nextIndex].select();

          }
        }

        }
      });

  $("#addcatselect").change(function(event) {
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

  $(document).on('click', '#apsubmit', function(event) {
    /* Act on the event */
    if ($("#addproddesc").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#addproddesc").focus();
      $("#addproddesc").select();
      return false;
    }
    if ($("#adduom option:selected").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#uomblank-alert").alert();
      $("#uomblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#uomblank-alert").hide();
      });
      $("#adduom").focus();
      $("#adduom").select();
      return false;
    }
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
        $('.modal-backdrop').remove();
        $("#addsuccess-alert").alert();
        $("#addsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#addsuccess-alert").hide();
        });
        return false;
      }
      else if (resp["gkstatus"] ==1)
      {
        $('.modal-backdrop').remove();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        $("#addproddesc").focus();
        $("#addproddesc").select();
        return false;
      }
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
event.stopPropogation();
  });

  $(document).on('click', '#apreset', function(event) {
    event.preventDefault();
    /* Act on the event */
    $("#addproduct").click();
  });
});
