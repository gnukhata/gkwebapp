$(document).ready(function(){
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    $("#gaflag input:radio:checked").focus().click();

      // for reset Button
    //   $("#addbudget_reset").click(function()
    //    {
    //      $("a[href ='#budget_create']").click();
    //    });

       $("#gaflag input:radio").change(function(event) {
        $("body").css("padding-right", '0px');
           console.log("ddddd");
           var flag = $("#gaflag input:radio:checked").val();
           console.log(flag);
            dataset ={
                "flag": $("#gaflag input:radio:checked").val()
            }
            // $("#msspinmodal").modal("show");
            console.log("group");
            $.ajax({
                    type: "POST",
                    url: "/budget?type=galisttable",
                    global: false,
                    async: false,
                    datatype: "text/html",
                    data: dataset,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    },
                })
                .done(function(resp) {    
                    $("#accounttable").html("");      
                    $("#accounttable").html(resp);
                    $("#gaflag input:radio:checked").focus();
                });  
            
       });
       $("#gaflag input:radio").change();

    });