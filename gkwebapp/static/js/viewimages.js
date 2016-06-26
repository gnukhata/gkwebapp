$(document).ready(function() {
  var deletedids = []
  if ($("#userrole").val()=="1")
  {
    if ($("#lockflag").val()=="True")
    {
      $(".imgremove").remove();
    }

  }
  $(document).off("click",".delimg").on("click", ".delimg", function(e) {
    deletedids.push($(this).attr('value'));
    $(this).parent().parent().fadeOut(200, function(){
      $(this).parent().parent().remove();   //closest method gives the closest element specified
    });
    e.preventDefault();
    return false;
  });

  $("#saveimg").click(function(event) {
    var form_data = new FormData();
    var files = $("#addimg")[0].files
    var filelist = [];
    for (var i = 0; i < files.length; i++) {
      form_data.append("file"+i,files[i])
    }
    form_data.append("deletedids",deletedids);
    form_data.append("vouchercode",$("#vouchercode").val());
    form_data.append("vno",$("#vno").val());
    form_data.append("vtype",$("#vtype").val());
    $.ajax({
      url: '/updateattachment',
      type: 'POST',
      dataType: 'html',
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      }
    })
    .done(function(resp) {
      $("html").html(resp);
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });
});
