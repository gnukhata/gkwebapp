$(document).ready(function() {
  $("a[href ='#godown_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/godown?type=addtab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#godown_create").html(resp);
      $("#godown_edit").html("");
    }
    }
  );
  });
  $("a[href ='#godown_edit']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/godown?type=edittab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#godown_edit").html(resp);
      $("#godown_create").html("");
      $("#godown_list").html("");
    }
    }
  );
  });


  $("a[href ='#godown_create']").click();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#godown_create"){
      $("#godownname").focus();
    }
    else if(e.target.attributes.href.value=="#godown_edit"){
      $("#editgoddet").focus();
    }
  });
  $("a[href ='#godown_edit']").click(function(event) {
    $("#editgoddet").focus();
  });
  $("#my-file-selector").change(function(event) {
    $('#upload-file-info').html($(this).val());
    if ($("#my-file-selector").val()=='') {
      $("#import-blank-alert").alert("");
      $("#import-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#import-blank-alert").hide();
      });
      return false;
    }
    $('#confirm_yes_print').modal('show').one('click', '#tn_save_yesprint', function (e)
    {
    var form_data = new FormData();
    var file = $("#my-file-selector")[0].files[0];
    form_data.append("xlsxfile",file);
    $("#msspinmodal").modal("show");
    $.ajax({
      type: "POST",
      url: "/import?action=gdnimport",
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      datatype: "json",
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
      },
    })
    .done(function(resp) {
      if (resp["gkstatus"]==0) {
        $("#filename").html($("#my-file-selector").val());
        $("#my-file-selector").val("");
        $("#upload-file-info").html("");
        $("#msspinmodal").modal("hide");
        $("#import-success-alert").alert();
        $("#import-success-alert").fadeTo(2250, 400).slideUp(500, function(){
          $("#import-success-alert").hide();
        });
        return false;
      }
      else if(resp["gkstatus"]==1){
        $("#msspinmodal").modal("hide");
        $("#import-duplicate-alert").alert();
        $("#import-duplicate-alert").fadeTo(2250, 400).slideUp(500, function(){
          $("#import-duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#msspinmodal").modal("hide");
        $("#import-failure-alert").alert();
        $("#import-failure-alert").fadeTo(2250, 400).slideUp(500, function(){
          $("#import-failure-alert").hide();
        });
        return false;
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
});
