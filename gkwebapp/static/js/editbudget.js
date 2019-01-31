$(document).ready(function() {
    // for reset Button
    $("#reset").click(function()
     {
        $("a[href ='#budget_edit']").click();
     });
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var contents;
    var hideshowflag;
    $("#editbud").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
        $("#edit").focus();
        }
    });
    $("#edit").keydown(function(e){
        if (e.which==39)
        {e.preventDefault();
        $("#delete").focus();
        }
        if (e.which==37 || e.which==38)
        {e.preventDefault();
        $("#editbud").focus();
        }
    });$("#delete").keydown(function(e){
        if (e.which==37)
        {e.preventDefault();
        $("#edit").focus();
        }
    });
    $("#editbud").bind("change", function(e) {
        $("#add").hide();
        $("#reset").hide();
        var budid = $("#editbud option:selected").val();
        $.ajax({
            type: "POST",
            url: "/budget?type=getbuddetails",
            data: {
                "budid": budid
            },
            global: false,
            async: false,
            dataType: "json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            success: function(resp) {
                goddetails = resp["gkresult"];
                contents = goddetails[0]["contents"];
                $("#bname").val(goddetails[0]["budname"]);
                $("#bname").prop("disabled", true);
                var fromdatearray = goddetails[0]["startdate"].split(/\s*\-\s*/g)
                $("#budget_fromday").val(fromdatearray[0])
                $("#budget_fromday").prop("disabled", true);
                $("#budget_frommonth").val(fromdatearray[1])
                $("#budget_frommonth").prop("disabled", true);
                $("#budget_fromyear").val(fromdatearray[2])
                $("#budget_fromyear").prop("disabled", true);
                var fromdatearray = goddetails[0]["enddate"].split(/\s*\-\s*/g)
                $("#budget_today").val(fromdatearray[0])
                $("#budget_today").prop("disabled", true);
                $("#budget_tomonth").val(fromdatearray[1])
                $("#budget_tomonth").prop("disabled", true);
                $("#budget_toyear").val(fromdatearray[2])
                $("#budget_toyear").prop("disabled", true);
                $("#btype").val(goddetails[0]["btype"]);
                $("#btype").prop("disabled", true);
                $("#account").prop("disabled", false);
                $("#group").prop("disabled", false);
                $("#subgroup").prop("disabled", false);
                hideshowflag = 0;
                if(goddetails[0]["gaflag"] == 1){
                    $("#gaflag").val(goddetails[0]["gaflag"]);
                    $("#account").click();
                }
                if(goddetails[0]["gaflag"] == 7){
                    $("#gaflag").val(goddetails[0]["gaflag"]);
                    $("#group").click();
                }
                if(goddetails[0]["gaflag"] == 19){
                    $("#gaflag").val(goddetails[0]["gaflag"]);
                    $("#subgroup").click();
                }
                $("#editbudget").show();
                $("#form-footer").show();
                $("#delete").show();
                $("#edit").show();
                $("#account").prop("disabled", true);
                $("#group").prop("disabled", true);
                $("#subgroup").prop("disabled", true);
                
            }
        });
    });
    $("#gaflag ").change(function(event) {
        $("body").css("padding-right", '0px');
        
            var data ={"flag": $("#gaflag input:radio:checked").val()}
            $.ajax({
                    type: "POST",
                    url: "/budget?type=galisttable",
                    global: false,
                    async: false,
                    datatype: "text/html",
                    data: data,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    },
                })
                .done(function(resp) {    
                    $("#accounttable").html("");      
                    $("#accounttable").html(resp);
                    flagg = $("#gaflag input:radio:checked").val();
                    if(flagg == goddetails[0]["gaflag"]){
                    var objects = Object.keys(contents);
                    var objectlength = Object.keys(contents).length;
                    var oTable = document.getElementById('latable');
                    //gets rows of table
                    var rowLength = oTable.rows.length;
                    for (i=0; i<objectlength; i++){
                        for (j=0 ; j<rowLength ; j++){
                            var rowId = (document.getElementsByTagName("tr")[j].id).slice(0,document.getElementsByTagName("tr")[j].id.indexOf('_'));
                            if(rowId == objects[i]){
                                $("#latable tbody tr:eq("+(j-1)+") td input").val(contents[objects[i]]);
                            }
                        }
                    }
                }
                if(hideshowflag == 0){
                    $("#latable tbody tr td input").prop("disabled", true);
                }
                });
       });
// ------------ edit button ------------
    $("#edit").click(function(e){
        hideshowflag = 1;
        $("#bname").prop("disabled", false);
        $("#bname").focus();
        $("#btype").prop("disabled", false);
        $("#account").prop("disabled", false);
        $("#group").prop("disabled", false);
        $("#subgroup").prop("disabled", false);
        $("#budget_fromday").prop("disabled", false);
        $("#budget_frommonth").prop("disabled", false);
        $("#budget_fromyear").prop("disabled", false);
        $("#budget_today").prop("disabled", false);
        $("#budget_tomonth").prop("disabled", false);
        $("#budget_toyear").prop("disabled", false);
        $("#latable tbody tr td input").prop("disabled", false);
        $("#add").show();
        $("#reset").show();
        $("#edit").hide();
           // ----------------  keydown functions -----------
            $("#bname").keydown(function(e){
                if (e.which==13)
                {
                e.preventDefault();
                $("#budget_fromday").focus();
                }
            });
            $("#budget_fromday").keydown(function(e){
                
                if (e.which==13 || e.which==39)
                {e.preventDefault();
                $("#budget_frommonth").focus();
                }
                if (e.which==37 || e.which==38)
                {e.preventDefault();
                $("#bname").focus();
                }
            });
            $("#budget_frommonth").keydown(function(e){
                if (e.which==13 || e.which==39)
                {e.preventDefault();
                $("#budget_fromyear").focus();
                }
                if (e.which==37 || e.which==38)
                {e.preventDefault();
                $("#budget_fromday").focus();
                }
            });
            $("#budget_fromyear").keydown(function(e){
                if (e.which==13 || e.which==39)
                {e.preventDefault();
                $("#budget_today").focus();
                }
                if (e.which==37 || e.which==38)
                {e.preventDefault();
                $("#budget_frommonth").focus();
                }
            });
            $("#budget_today").keydown(function(e){
                if (e.which==13 || e.which==39)
                {e.preventDefault();
                $("#budget_tomonth").focus();
                }
                if (e.which==37 || e.which==38)
                {e.preventDefault();
                $("#budget_fromyear").focus();
                }
            });
            $("#budget_tomonth").keydown(function(e){
                if (e.which==13 || e.which==39)
                {e.preventDefault();
                $("#budget_toyear").focus();
                }
                if (e.which==37 || e.which==38)
                {e.preventDefault();
                $("#budget_today").focus();
                }
            });
            $("#budget_toyear").keydown(function(e){
                if (e.which==13 || e.which==39)
                {e.preventDefault();
                $("#btype").focus();
                }
                if (e.which==37 || e.which==38)
                {e.preventDefault();
                $("#budget_tomonth").focus();
                }
            });
            $("#btype").keydown(function(e){
                if (e.which==13 || e.which==39)
                {
                e.preventDefault();
                $("#account").focus().click();
                }
                if (e.which==37 || e.which==38)
                {
                e.preventDefault();
                $("#budget_toyear").focus();
                }
            });
            $("#add").keydown(function(e){
                if (e.which==39)
                {
                e.preventDefault();
                $("#reset").focus();
                }
                if (e.which==37 || e.which==38)
                {
                e.preventDefault();
                $("#gaflag input:radio:checked").focus().select();
                }
            });
            $("#reset").keydown(function(e){
                if (e.which==37 || e.which==38)
                {
                e.preventDefault();
                $("#add").focus();
                }
            });
            $(document).off("keydown","#account").on("keydown", '#account', function(e){
                if (e.which == 13) {
                    // e.preventDefault();
                    $("#latable tbody tr:eq(0) input").focus();
                }
            });
            $(document).off("keydown","#group").on("keydown", '#group', function(e){
                if (e.which == 13) {
                    // e.preventDefault();
                    $("#latable tbody tr:eq(0) input").focus();
                }
            });
            $(document).off("keydown","#latable tbody tr input").on("keydown", "#latable tbody tr input", function(e){
                if (e.which == 13) {
                    e.preventDefault();
                    $("#add").focus().select();
                }
                if(e.which == 27){
                    $("#gaflag input:radio:checked").focus().select();
                }
                if(e.which == 40){e.preventDefault();
                    var i = $("#latable tbody tr input").index(this) + 1;
                    $("#latable tbody tr:eq("+i+") input").focus().select();
                }
                if(e.which == 38){e.preventDefault();
                    var i = $("#latable tbody tr input").index(this) - 1;
                    $("#latable tbody tr:eq("+i+") input").focus().select();
                }
            });
            $(document).off("keydown","#add").on("keydown", '#add', function(e){
                if (e.which == 38) {
                    // e.preventDefault();
                    $("#latable tbody tr:eq(0) input").focus();
                }
            });
        // ----------------- end keydown ----------------
        // ------------------ date validations --------------
        function pad (str, max) { //to add leading zeros in date
            str = str.toString();
            if (str.length==1) {
            return str.length < max ? pad("0" + str, max) : str;
            }
            else{
            return str
            }
        }
        function yearpad (str, max) { //to add leading 20 or 200 to year
            str = str.toString();
            if (str.length==1) {
            return str.length < max ? pad("200" + str, max) : str;
            }
            else if (str.length==2) {
            return str.length < max ? pad("20" + str, max) : str;
            }
            else{
            return str
            }
        }
        $("#budget_fromday").blur(function(event) {
            $(this).val(pad($(this).val(),2));
        });
        $("#budget_frommonth").blur(function(event) {
            $(this).val(pad($(this).val(),2));
        });
        $("#budget_today").blur(function(event) {
            $(this).val(pad($(this).val(),2));
        });
        $("#budget_tomonth").blur(function(event) {
            $(this).val(pad($(this).val(),2));
        });
        $("#budget_fromyear").blur(function(event) {
            $(this).val(yearpad($(this).val(),4));
        });
        $("#budget_toyear").blur(function(event) {
            $(this).val(yearpad($(this).val(),4));
        });
// ------------------ end date validation -------------
    });
// ----- ------- submit button -------------
    $("#add").click(function(e){
        e.preventDefault();
// ------------ validation  ----------------
        if ($.trim($("#bname").val())=="") {
            $("#blank-name-alert").alert();
            $("#blank-name-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#blank-name-alert").hide();
            });
            $("#bname").focus();
            return false;
        }
        if ($("#budget_fromyear").val()==0 ||$("#budget_frommonth").val()==0 ||$("#budget_fromdate").val()==0 ) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
            });
            $('#budget_fromday').focus().select();
            return false;
        }
        if ($("#budget_toyear").val() ==0||$("#budget_tomonth").val()==0||$("#budget_todate").val()==0) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
            });
            $('#budget_today').focus().select();
            return false;
        }
        // var todate = $("#budget_today").val()+'-'+$("#budget_tomonth").val()+'-'+$("#budget_toyear").val();
        // var fromdate = $("#budget_fromday").val()+'-'+$("#budget_frommonth").val()+'-'+$("#budget_fromyear").val();
        var todate = $("#budget_toyear").val()+$("#budget_tomonth").val()+$("#budget_today").val();
        var fromdate = $("#budget_fromyear").val()+$("#budget_frommonth").val()+$("#budget_fromday").val();        
        if(!Date.parseExact(fromdate,"yyyyMMdd")){
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
            });
            $('#budget_fromday').focus().select();
            return false;
        }
        if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
            $("#between-date-alert").alert();
            $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#between-date-alert").hide();
            });
            $('#budget_fromday').focus().select();
            return false;
        }
        if(!Date.parseExact(todate, "yyyyMMdd")){
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
            });
            $('#budget_today').focus().select();
            return false;
        }
        if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
            $("#between-date-alert").alert();
            $("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#between-date-alert").hide();
            });
            $('#budget_today').focus().select();
            return false;
        }
        if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
            $("#compare-date-alert").alert();
            $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#compare-date-alert").hide();
            });
            $('#budget_today').focus().select();
            return false;
        }
        if ($.trim($("#btype option:selected").val())=="") {
            $("#btype-alert").alert();
            $("#btype-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#btype-alert").hide();
            });
            $("#btype").focus();
            return false;
        }
// ----------- end validation -----------
        //gets table data
        var oTable = document.getElementById('latable');
        //gets rows of table
        var rowLength = oTable.rows.length;
        vd=[];
        var content= {};
        //loops through rows    
        for (i = 0; i < rowLength; i++){
            //gets cells of current row  
            var oCells = oTable.rows.item(i).cells;
            //gets amount of cells of current row
            var cellLength = oCells.length;
            //loops through each cell in current row
            for(var j = 0; j < cellLength; j++){
                // get your cell info here
                var cellId = oCells.item(j).id;
                var id = cellId.slice(0,cellId.indexOf('_'));
                var id_value = id+"_value";
                if(cellId != '') {
                    if(id_value.indexOf('value') > 0) {
                        var contentValue = document.getElementById(id_value).value;
                        var amount = (parseFloat(contentValue));
                        if (amount != 0){
                            content[id]=amount;
                        }
                    }
                }                
            }
        }
        vd.push(content);
        if(Object.keys(content).length == 0){
            $("#content-alert").alert();
            $("#content-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#content-alert").hide();
            });
            $("#latable tbody tr:eq(0) input").focus();
            return false;
        }
        dataset = {"budid":$("#editbud option:selected").val(),"contents":JSON.stringify(vd),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#btype option:selected").val(),"gaflag": $("#gaflag input:radio:checked").val()};
        $("#msspinmodal").modal("show");
        $.ajax(
            {
              type: "POST",
              url: "/budget?type=edit",
              global: false,
              async: false,
              datatype: "text/html",
              data:dataset,  
              beforeSend: function(xhr)
              {
                xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
              },
            })
              .done(function(resp)
              {
                $("#msspinmodal").modal("hide");
                if(resp["gkstatus"] == 0){
                    $("#success-alert").alert();
                    $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
                        $("#success-alert").hide();
                        $("a[href ='#budget_edit']").click();
                    });
                }   
              }
            );
       });
       $(document).off("click", "#delete").on("click", "#delete", function(event) {
        event.preventDefault();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#m_confirmdel').modal('show').on('click', '#goddel', function(e) {
            $.ajax({
                type: "POST",
                url: "/budget?type=delete",
                global: false,
                async: false,
                datatype: "json",
                data: {"budid": $("#editbud option:selected").val(),"budname":$("#bname").val()},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
                success: function(resp) {
                    if (resp["gkstatus"] == 0) {
                        $('.modal-backdrop').remove();
                        $("#delete-alert").alert();
                        $("#delete-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#delete-alert").hide();
                            $("a[href ='#budget_edit']").click();
                        });
                    }
                }
            });
        });
        $('#m_confirmdel').on('shown.bs.modal', function(event) {
            $("#m_cancel").focus();
        });
        $('#m_confirmdel').on('hidden.bs.modal', function(event) {
            $("#editgoddet").focus();
        });
    });
});