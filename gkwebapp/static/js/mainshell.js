shortcut.add("f1",function() {
document.getElementById("toolbar").click();
})
shortcut.add("Alt+G",function() {
document.getElementById("gnukhata").click();
})
shortcut.add("Alt+M",function() {
document.getElementById("master").click();
})
shortcut.add("Alt+T",function() {
document.getElementById("transaction").click();
})
shortcut.add("Alt+R",function() {
document.getElementById("report").click();
})
shortcut.add("Alt+A",function() {
document.getElementById("administration").click();
})
shortcut.add("Alt+H",function() {
document.getElementById("help").click();
})
$(document).ready(function(){
  $('#editaccount').click(function (e) {
    alert("editttt");
      $.ajax(
      {

      type: "POST",
      url: "/showeditaccount",
      global: false,
      async: false,
      datatype: "text/html",
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

  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";
  var yeardata = "Financial year : " + styear + "-" + enyear;
  $("#orgdata").html(orgdata);
  $("#yeardata").html(yeardata);
  $('#addaccount').click(function (e) {
    $.ajax(
    {

    type: "POST",
    url: "/showaccount",
    global: false,
    async: false,
    datatype: "text/html",
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
  $('#addaccounttb').click(function(){
    $('#addaccount').click();
  });

});
