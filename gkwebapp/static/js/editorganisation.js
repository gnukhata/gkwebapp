$(document).ready(function(){

  if ($("#orgtype").val()=="Not For Profit")
  {
    $("#orgregno").focus().select();
  }
  else
  {
    $("#orgaddr").focus().select();
  }

  $('input:text, textarea').keydown(function(event){
    var n =$('input:text,textarea').length;

    var f= $('input:text, textarea');

    if (event.which == 13)
    {

      var nextIndex = f.index(this)+1;
      if(nextIndex < n){
        event.preventDefault();
        f[nextIndex].focus().select();
      }
    }
    if(event.which == 38){
      var prevIndex = f.index(this)-1;
      if(prevIndex < n){
        event.preventDefault();
        f[prevIndex].focus().select();
      }
    }
  });

  $("#reset").click(function()
  {
    $("#showeditorg").click();
  });

  $("#editorganisationform").submit(function(event){

    var regdate=""
    var fcraregdate=""
    var regno=""
    var fcrano=""

    if($("#orgtype").val()=="Not for Profit")
    {
      regdate= $("#regyear").val() + "-" + $("#regmonth").val() + "-" + $("#regday");
      fcraregdate= $("#fcraregyear").val() + "-" + $("#fcraregmonth").val() + "-" + $("#fcraregday");
      regno = $("#orgregno").val();
      fcrano = $("#orgfcrano").val();
    }

    $.ajax({
      type: 'POST',
      url: '/editorganisation',
      global: false,
      async: false,
      dataType: 'json',
      data: {"orgcity":$("#orgcity").val(),"orgaddr":$("#orgaddr").val(),"orgpincode":$("#orgpincode").val(),"orgstate":$("#orgstate").val(), "orgcountry":$("#orgcountry").val(),"orgtelno":$("#orgtelno").val(), "orgfax":$("#orgfax").val(),"orgwebsite":$("#orgwebsite").val(),"orgemail":$("#orgemail").val(),"orgpan":$("#orgpan").val(),"orgmvat":$("#orgmvat").val(),"orgstax":$("#orgstax").val(),"orgregno":regno,"orgregdate":regdate, "orgfcrano":fcrano,"orgfcradate":fcraregdate},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(jsonObj)
      {
        if(jsonObj["gkstatus"]==0)
        {
          $("#reset").click();
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert").hide();
          });
        }
        else
        {
          $("#connectionfailed").alert();
          $("#connectionfailed").fadeTo(2000, 500).slideUp(500, function(){
            $("#connectionfailed").hide();
          });
        }
      }
    });


  });
});
