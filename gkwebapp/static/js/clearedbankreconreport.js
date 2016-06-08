$(document).ready(function() {

  var percentwid = 100*(($(".table-fixedheader").width()-12)/$(".table-fixedheader").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-420)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  $(' #clrbankrecontable tbody tr:first-child td:eq(5) input').focus().select();

  $("input[type=text].clrdate").keyup(function (e) {
        var textSoFar = $(this).val();
        if (e.keyCode != 173 && e.keyCode != 109) {
            if (e.keyCode != 8) {
                if (textSoFar.length == 2 || textSoFar.length == 5) {
                    $(this).val(textSoFar + "-");
                }
                    //to handle copy & paste of 8 digit
                else if (e.keyCode == 86 && textSoFar.length == 8) {
                    $(this).val(textSoFar.substr(0, 2) + "-" + textSoFar.substr(2, 2) + "-" + textSoFar.substr(4, 4));
                }
            }
            else {
                //backspace would skip the slashes and just remove the numbers
                if (textSoFar.length == 5) {
                    $(this).val(textSoFar.substring(0, 4));
                }
                else if (textSoFar.length == 2) {
                    $(this).val(textSoFar.substring(0, 1));
                }
            }
        }
        else {
            //remove slashes to avoid 12//01/2014
            $(this).val(textSoFar.substring(0, textSoFar.length - 1));
        }
    });

  $("input[type=text].clrdate").keydown(function (event) {
    if (event.which==13) {
      curindex = $(this).closest('tr').index();
      $("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(6) input").focus().select();
    }
    if (event.which==38) {
      curindex = $(this).closest('tr').index();
      previndex = curindex-1
      $("#clrbankrecontable tbody tr:eq("+previndex+") td:eq(6) input").focus().select();
    }
  });

  $("input[type=text].memo").keydown(function (event) {
    if (event.which==13) {
      curindex = $(this).closest('tr').index();
      var curclrdate = $("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(5) input").val()
      var calculatefromdata = $("#calculatefrom").val().split("-");
      var calculatefrom = calculatefromdata[2]+"-"+calculatefromdata[1]+"-"+calculatefromdata[0]
      var calculatetodata = $("#calculateto").val().split("-");
      var calculateto = calculatetodata[2]+"-"+calculatetodata[1]+"-"+calculatetodata[0]
      var datecalculateto = Date.parseExact(calculateto,"yyyy-MM-dd")
      var curvdate = Date.parseExact($.trim($("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(0)").html()),"dd-MM-yyyy");
      var memo = $("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(6) input").val();
      if (curclrdate=="") {
        var curid = $(this).closest('tr').attr('value');
        $.ajax(
          {
            type: "POST",
            url: "/updaterecon",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"reconcode":curid,"clearancedate":null,"memo":memo,"calculateto":calculateto,"calculatefrom":calculatefrom,"accountcode":$("#accountcode").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
          })
            .done(function(resp)
            {
              $("#clrbankrecontable tbody tr:eq("+curindex+")").fadeOut(200, function(){
                $("#clrbankrecontable tbody tr:eq("+curindex+")").remove();
              });
              $("#recostmtdiv").html(resp);
            }
          );
      }
      else {
        var curclrdate2 = $("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(5) input").val().split("-");
        var newcurclrdate = curclrdate2[2]+"-"+curclrdate2[1]+"-"+curclrdate2[0]
        if(!Date.parseExact(curclrdate,"dd-MM-yyyy")){
          $("#date-alert").alert();
          $("#date-alert").fadeTo(2000, 400).slideUp(500, function(){
            $("#date-alert").hide();
          });
          $("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(5) input").focus().select();
          return false;
        }
        if (!Date.parseExact(curclrdate,"dd-MM-yyyy").between(curvdate,financialend)) {
          $("#between-date-alert").alert();
          $("#between-date-alert").fadeTo(2000, 400).slideUp(500, function(){
            $("#between-date-alert").hide();
          });
          $("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(5) input").focus().select();
          return false;
        }
        var curid = $(this).closest('tr').attr('value');
        $.ajax(
          {
            type: "POST",
            url: "/updaterecon",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"reconcode":curid,"clearancedate":newcurclrdate,"memo":memo,"calculateto":calculateto,"calculatefrom":calculatefrom,"accountcode":$("#accountcode").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
          })
            .done(function(resp)
            {
              if (Date.parseExact(curclrdate,"dd-MM-yyyy").compareTo(datecalculateto)==1) {
                $("#clrbankrecontable tbody tr:eq("+curindex+")").fadeOut(200, function(){
                  $("#clrbankrecontable tbody tr:eq("+curindex+")").remove();
                });
              }
              $("#recostmtdiv").html(resp);

            }
          );
      }
      nextindex = curindex+1
      $("#clrbankrecontable tbody tr:eq("+nextindex+") td:eq(5) input").focus().select();
    }
    if (event.which==38) {
      curindex = $(this).closest('tr').index();
      $("#clrbankrecontable tbody tr:eq("+curindex+") td:eq(5) input").focus().select();
    }
  });


  $("#bankrecon_back").click(function(event) {
    $("#BRS").click();
  });

  $("#unclrditems").click(function(event) {
    var calculatefromdata = $("#calculatefrom").val().split("-");
    var calculatefrom = calculatefromdata[2]+"-"+calculatefromdata[1]+"-"+calculatefromdata[0]
    var calculatetodata = $("#calculateto").val().split("-");
    var calculateto = calculatetodata[2]+"-"+calculatetodata[1]+"-"+calculatetodata[0]
    $.ajax(
      {
        type: "POST",
        url: "/showunclearedbankrecon",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"accountcode":$("#accountcode").val(),"accountname":$("#accountname").val(),"calculatefrom":calculatefrom,"calculateto":calculateto,"narrationflag":$("#narrationflag").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          $("#info").html(resp);
        }
      );
  });


});
