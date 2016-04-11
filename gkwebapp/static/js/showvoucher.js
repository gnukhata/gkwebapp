$(document).ready(function(){
  $('#showcontra').click(function (e) {
    $.ajax(
    {
    type: "POST",
    url: "/showvoucher",
    global: false,
    async: false,
    datatype: "json",
    data : {"type":"contra"},
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#info").html(resp);
    }
    }
  );
  });
});
