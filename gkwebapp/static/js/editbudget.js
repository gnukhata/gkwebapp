/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc.,51 Franklin Street, 
  Fifth Floor, Boston, MA 02110, United States


   Contributors:
   "Krishnakant Mane" <kk@gmail.com>
   "Karan Kamdar" <kamdar.karan@gmail.com>
   "Prajkta Patkar" <prajkta@riseup.com>
   "Abhijith Balan" <abhijith@dff.org.in>
   "rohan khairnar" <rohankhairnar@gmail.com>
 */
// This js is use in editbudget.jinja2 file

$(document).ready(function() {

    // for reset Button
    $("#reset").click(function()
     {
        $("a[href ='#budget_edit']").click();
     });
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    var financial = sessionStorage.yyyymmddyear1;
    var contents;
    var hideshowflag;
    $("#editbud").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
        $("#edit").focus().click();
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
    
    $("#editbud").change(function(e) {
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
            success: function(resp) { // load all value return from api to show selected budget values. 
                goddetails = resp["gkresult"];
                contents = goddetails["contents"];
                $("#budget_fromday").change();
                $("#bal").prop("disabled", true);
                $("#bname").val(goddetails["budname"]);
                $("#bname").prop("disabled", true);
                var fromdatearray = goddetails["startdate"].split(/\s*\-\s*/g)
                $("#budget_fromday").val(fromdatearray[0])
                $("#budget_fromday").prop("disabled", true);
                $("#budget_frommonth").val(fromdatearray[1])
                $("#budget_frommonth").prop("disabled", true);
                $("#budget_fromyear").val(fromdatearray[2])
                $("#budget_fromyear").prop("disabled", true);
                var fromdatearray = goddetails["enddate"].split(/\s*\-\s*/g)
                $("#budget_today").val(fromdatearray[0])
                $("#budget_today").prop("disabled", true);
                $("#budget_tomonth").val(fromdatearray[1])
                $("#budget_tomonth").prop("disabled", true);
                $("#budget_toyear").val(fromdatearray[2])
                $("#budget_toyear").prop("disabled", true);
                $("#btype").val(goddetails["btype"]);
                $("#btype").prop("disabled", true);
                if(goddetails["btype"] == 3){
                    $("#gaflag").hide();
                    $("#flow").show();
                    $("#outflow").val(parseFloat(goddetails["contents"]["outflow"]).toFixed(2));
                    $("#outflow").prop("disabled", true);
                    $("#inflow").val(parseFloat(goddetails["contents"]["inflow"]).toFixed(2));
                    $("#inflow").prop("disabled", true);
                    var fromdate = $("#budget_fromyear").val()+"-"+$("#budget_frommonth").val()+"-"+$("#budget_fromday").val();
                    $.ajax({
                        type: "POST",
                        url: "/budget?type=balance",
                        global: false,
                        async: false,
                        datatype: "text/html",
                        data: {"financialstart":financial,"uptodate":fromdate},
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                        },
                    })
                    .done(function(resp) { 
                        $("#balance").text((parseFloat(resp["gkresult"])).toFixed(2));
                        $("#cashavailable").text((parseFloat($("#inflow").val())+parseFloat(resp["gkresult"])).toFixed(2)) ;
                        $("#budgetbalance").text((parseFloat($("#cashavailable").text())-parseFloat($("#outflow").val())).toFixed(2));
                    });
                }
                else{
                    $("#flow").hide();
                    $("#gaflag").show();
                    $("#account").prop("disabled", false);
                    $("#group").prop("disabled", false);
                    $("#subgroup").prop("disabled", false);
                    hideshowflag = 0;
                    if(goddetails["gaflag"] == 1){
                        $("#gaflag").val(goddetails["gaflag"]);
                        $("#account").click();
                    }
                    if(goddetails["gaflag"] == 7){
                        $("#gaflag").val(goddetails["gaflag"]);
                        $("#group").click();
                    }
                    if(goddetails["gaflag"] == 19){
                        $("#gaflag").val(goddetails["gaflag"]);
                        $("#subgroup").click();
                    }
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
    $("#gaflag ").change(function(event) { // load accounts/groups/subgroups table 
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
                    if(flagg == goddetails["gaflag"]){
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
        e.preventDefault();
        hideshowflag = 1;
        $("#bname").prop("disabled", false);
        $("#bname").focus();
        if($("#btype").val() == 3){
            $("#btype").prop("disabled", true);
        }
        else{
            $("#btype").prop("disabled", false);
        }
        $("#outflow").prop("disabled", false);
        $("#bal").prop("disabled", false);
        $("#inflow").prop("disabled", false);
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
        $("#delete").hide();
           // ----------------  keydown functions -----------
            $("#bname").keydown(function(e){
                if (e.which==13)
                {
                e.preventDefault();
                if ($.trim($("#bname").val())=="") {
                    $("#blank-name-alert").alert();
                    $("#blank-name-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#blank-name-alert").hide();
                    });
                    $("#bname").focus();
                    return false;
                }
                else{
                    $("#budget_fromday").focus();
                }
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
                $("#budget_frommonth").change();
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
                  $("#inflow").focus();
                  if ($("#budget_toyear").val()==0 ||$("#budget_tomonth").val()==0 ||$("#budget_todate").val()==0 ) {
                    $("#date-valid-alert").alert();
                    $("#date-valid-alert").fadeTo(2250, 400).slideUp(500, function(){
                    $("#date-valid-alert").hide();
                    });
                    $('#budget_today').focus().select();
                    return false;
                }
                var todate = $("#budget_toyear").val()+$("#budget_tomonth").val()+$("#budget_today").val();        
                if(!Date.parseExact(todate,"yyyyMMdd")){
                    $("#date-valid-alert").alert();
                    $("#date-valid-alert").fadeTo(2250, 400).slideUp(500, function(){
                    $("#date-valid-alert").hide();
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
                }
                if (e.which==37 || e.which==38)
                  {e.preventDefault();
                  $("#budget_tomonth").focus();
                  }
            });
            $("#inflow").keydown(function(e){
                if (e.which==13 )
                {e.preventDefault();
                    if ($.trim($("#inflow").val())=="") {
                        $("#inflow-alert").alert();
                        $("#inflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                        $("#inflow-alert").hide();
                        });
                        $("#inflow").focus();
                        return false;
                    }
                    else{
                        $("#outflow").focus();
                    }
                }
                if (e.which==38)
                  {e.preventDefault();
                  $("#budget_toyear").focus();
                  }
            });
            $("#outflow").keydown(function(e){
                if (e.which==13 )
                {e.preventDefault();
                    if ($.trim($("#outflow").val())=="") {
                        $("#outflow-alert").alert();
                        $("#outflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                        $("#outflow-alert").hide();
                        });
                        $("#outflow").focus();
                        return false;
                    }
                    else{
                        $("#add").focus();
                    }
                }
                if ( e.which==38)
                  {e.preventDefault();
                  $("#inflow").focus();
                  }
            });
            $("#add").keydown(function(e){
                if (e.which==39)
                {
                e.preventDefault();
                $("#reset").focus();
                }
                if ( e.which==38)
                {
                e.preventDefault();
                if($("#btype option:selected").val() == 3)
                {
                    $("#outflow").focus();
                }
                else{
                    $("#gaflag input:radio:checked").focus().select();
                }
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
        // ------------------- balance by date -------------
        
        $("#budget_fromday").change(function(event) { 
            if($("#btype").val()==null){
                return false;
            }
        $(this).val(pad($(this).val(),2));
        if ($("#budget_fromyear").val()==0 ||$("#budget_frommonth").val()==0 ||$("#budget_fromdate").val()==0 ) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
            });
            $('#budget_fromday').focus().select();
            return false;
        }
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
        var fromdate = $("#budget_fromyear").val()+"-"+$("#budget_frommonth").val()+"-"+$("#budget_fromday").val();
        $.ajax({
            type: "POST",
            url: "/budget?type=balance",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"financialstart":financial,"uptodate":fromdate},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
        })
        .done(function(resp) { 
            $("#balance").text((parseFloat(resp["gkresult"])).toFixed(2)); 
            $("#cashavailable").text((parseFloat($("#inflow").val())+parseFloat(resp["gkresult"])).toFixed(2)); 
            $("#budgetbalance").text((parseFloat($("#cashavailable").text())-parseFloat($("#outflow").val())).toFixed(2));
        });
    });
    $("#budget_frommonth").change(function(event) {
        $(this).val(pad($(this).val(),2));
        if ($("#budget_fromyear").val()==0 ||$("#budget_frommonth").val()==0 ||$("#budget_fromdate").val()==0 ) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
            });
            $('#budget_fromday').focus().select();
            return false;
        }
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
        var fromdate = $("#budget_fromyear").val()+"-"+$("#budget_frommonth").val()+"-"+$("#budget_fromday").val();
        $.ajax({
            type: "POST",
            url: "/budget?type=balance",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"financialstart":financial,"uptodate":fromdate},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
        })
        .done(function(resp) { 
            $("#balance").text((parseFloat(resp["gkresult"])).toFixed(2)); 
            $("#cashavailable").text((parseFloat($("#inflow").val())+parseFloat(resp["gkresult"])).toFixed(2)); 
            $("#budgetbalance").text((parseFloat($("#cashavailable").text())-parseFloat($("#outflow").val())).toFixed(2));
        });
    });
    $("#budget_fromyear").change(function(event) { 
        $(this).val(yearpad($(this).val(),4));
        if ($("#budget_fromyear").val()==0 ||$("#budget_frommonth").val()==0 ||$("#budget_fromdate").val()==0 ) {
            $("#date-alert").alert();
            $("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#date-alert").hide();
            });
            $('#budget_fromday').focus().select();
            return false;
        }
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
        var fromdate = $("#budget_fromyear").val()+"-"+$("#budget_frommonth").val()+"-"+$("#budget_fromday").val();
        $.ajax({
            type: "POST",
            url: "/budget?type=balance",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"financialstart":financial,"uptodate":fromdate},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
        })
        .done(function(resp) {
            $("#balance").text((parseFloat(resp["gkresult"])).toFixed(2)); 
            $("#cashavailable").text((parseFloat($("#inflow").val())+parseFloat(resp["gkresult"])).toFixed(2)); 
            $("#budgetbalance").text((parseFloat($("#cashavailable").text())-parseFloat($("#outflow").val())).toFixed(2));
        });
    });
    $("#inflow").change(function(e){
        var b = parseFloat($("#balance").text());
        if(b != 0){
            $("#cashavailable").text((b+parseFloat($("#inflow").val())).toFixed(2));
        }
        else{
            $("#cashavailable").text((parseFloat($("#inflow").val())).toFixed(2));
        }
        var ca = parseFloat($("#cashavailable").text());
        if(ca != 0){
            $("#budgetbalance").text((ca-parseFloat($("#outflow").val())).toFixed(2));
        }
        else{
            $("#budgetbalance").text(("-"+parseFloat($("#outflow").val())).toFixed(2));
        }
    });
    $("#outflow").change(function(e){
        var b = parseFloat($("#balance").text());
        if(b != 0){
            $("#cashavailable").text((b+parseFloat($("#inflow").val())).toFixed(2));
        }
        else{
            $("#cashavailable").text((parseFloat($("#inflow").val())).toFixed(2));
        }
        var ca = parseFloat($("#cashavailable").text());
        if(ca != 0){
            $("#budgetbalance").text((ca-parseFloat($("#outflow").val())).toFixed(2));
        }
        else{
            $("#budgetbalance").text(("-"+parseFloat($("#outflow").val())).toFixed(2));
        }
    });
    });
    // ------------------ end date validation -------------
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
        if($("#btype").val() == 3){ // when Cash Budget
            if ($.trim($("#inflow").val())=="") {
                $("#inflow-alert").alert();
                $("#inflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#inflow-alert").hide();
                });
                $("#inflow").focus();
                return false;
            }
            if ($.trim($("#outflow").val())=="") {
                $("#outflow-alert").alert();
                $("#outflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#outflow-alert").hide();
                });
                $("#outflow").focus();
                return false;
            }
            vd =[]
            vd = [{"inflow":$("#inflow").val(),"outflow":$("#outflow").val()}]
            dataset = {"budid":$("#editbud option:selected").val(),"contents":JSON.stringify(vd),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#btype option:selected").val(),"gaflag": 19};
        }
        else{   // when sale or wxpense budget
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
        }
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
        $("#goddel").keydown(function(e){
            if (e.which==37 || e.which==38)
            {
            e.preventDefault();
            $("#m_cancel").focus();
            }
        });
        $("#m_cancel").keydown(function(e){
            if (e.which==39)
            {
            e.preventDefault();
            $("#goddel").focus();
            }
        });
        $('#m_confirmdel').on('shown.bs.modal', function(event) {
            $("#m_cancel").focus();
        });
        $('#m_confirmdel').on('hidden.bs.modal', function(event) {
            $("#editgoddet").focus();
        });
    });
});