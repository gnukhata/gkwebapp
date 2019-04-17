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
    let financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    let financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    let financial = sessionStorage.yyyymmddyear1;
    let hideshowflag;
    let btype = 3;
    $("#noeditbudget").hide();
    $("#flow").hide();
    $("#e_pnldiv").hide();
    $("#e_cash").select();
    $("#footer").hide();
    $("#flow").hide();
    $("#e_pnldiv").hide();
    $("#e_expense").text((0.00).toFixed(2));
    $("#e_income").text((0.00).toFixed(2));
    $("#e_netprofit").text((0.00).toFixed(2));
    
    $("#budgetlist").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
            if($("#budgetlist").val()==""){
                return false;
            }
        $("#edit").focus().click();
        }
        if (e.which==38){
            $("#e_budgettype").focus();
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
    $("#e_cash").keydown(function(e){
        if (e.which==13)
        {e.preventDefault();
        $("#budgetlist").focus();
        }
    });
    $("#e_pnl").keydown(function(e){
        
        if (e.which==13)
        {e.preventDefault();
        $("#budgetlist").focus();
        }
    });
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
    function tablecall() {
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
                data: {"financialstart":financial,"uptodate":fromdate,"budgettype":btype},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
            })
            .done(function(resp) { 
                $("#accounttable").html("");      
                $("#accounttable").html(resp);
                if (btype == 3){
                    $("#flow").show();
                    $("#e_pnldiv").hide();
                }
                else{
                    $("#flow").hide();
                    $("#e_pnldiv").show();
                }
                $("#balance").text((parseFloat($("#op").val())).toFixed(2)); 
                
                if(hideshowflag == 1){
                    $("#cash_latable tbody tr td input").prop("disabled", false);
                }
                else{
                    $("#cash_latable tbody tr td input").prop("disabled", true);
                    
                }
                var keys=[];
                    var budgetAmount=0;
                    budgetedBalance=0;
                    keys = Object.keys(goddetails["contents"]);   //all acountcode 
                    for (i = 0; i < (keys.length); i++){
                        $("#"+keys[i]+"_value").val((goddetails["contents"][keys[i]]).toFixed(2));
                        $("#"+keys[i]+"_bal").text((goddetails["contents"][keys[i]] + parseFloat($("#"+keys[i]+"_id").text())).toFixed(2));
                        budgetAmount = budgetAmount + goddetails["contents"][keys[i]] ;
                        $("#budgetamount").text((budgetAmount).toFixed(2));
                }

                let a = parseInt($("#inflowaccount").val())+2;
                let b = parseInt($("#inflowaccount").val())+1+parseInt($("#outflowaccount").val());
                outflowtotal = 0;
                for (let j=a ;j<=b ; j++ ){
                    outflowtotal = outflowtotal + parseFloat($("#cash_latable tbody tr:eq("+j+") input").val());
                }
                if (btype == 3){
                    $("#outflow").text(outflowtotal.toFixed(2));
                }
                else{
                    $("#e_expense").text(outflowtotal.toFixed(2));
                }

                inflowtotal = 0;
                for(let j=1 ; j <= $("#inflowaccount").val(); j++){
                    inflowtotal = inflowtotal + parseFloat($("#cash_latable tbody tr:eq("+j+") input").val());
                }
                if (btype == 3){
                    $("#inflow").text(inflowtotal.toFixed(2));
                    $("#cashavailable").text((parseFloat($("#inflow").text())+parseFloat($("#balance").text())).toFixed(2)); 
                    $("#budgetbalance").text((parseFloat($("#cashavailable").text())-parseFloat($("#outflow").text())).toFixed(2));
                }
                else{
                    $("#e_income").text(inflowtotal.toFixed(2));
                    $("#e_netprofit").text((parseFloat($("#e_income").text())-parseFloat($("#e_expense").text())).toFixed(2));
                }
                
            });
    }
    $("#e_budgettype").change(function(e){    // radio buttons Cash and pnl
        if($("#e_cash").is(":checked")) {
             var val = 3;
         }
         if($("#e_pnl").is(":checked")) {
             var val = 16;
         }
         $.ajax(
             {
             type: "POST",
             url: "/budget?type=bdg_list",
             global: false,
             async: false,
             datatype: "json",
             data: {"btype":val},
             beforeSend: function(xhr) {
               xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
           },
             success: function(jsonObj){
               
               len = jsonObj["numberofbudget"]
               // if their are more than zero branches, only that time it will show branch selection option.
               $('#budgetlist').html("");
               if (len > 0){
                   $("#noeditbudget").hide();
                   $("#list").show();
               }
               else{
                   $("#noeditbudget").show();
                   $("#list").hide();
               }
               var br = jsonObj["gkresult"];
               $('#budgetlist').append('<option value="" disabled selected hidden >' + "Select Budget" +' </option>');                  
               for (let i in br ){
                 $('#budgetlist').append('<option value="' + br[i].budid + '">' + br[i].budname+' ('+br[i].startdate+' To '+br[i].enddate+')'+' </option>');                  
               }
             }
             });
     });
    $("#e_budgettype").change();     // on change list cash will be load
    $("#budgetlist").change(function(e) {      // Budget list change
        $("#e_budgettype").hide();
        $("#add").hide();
        var budid = $("#budgetlist option:selected").val();
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
                
                $("#btype").prop("disabled", true);
                if(goddetails["btype"] == 3){
                    $("#btype").text("Cash Budget");
                    btype = 3;
                    $("#flow").show();
                    tablecall();
                }
                if(goddetails["btype"] == 16){
                    $("#btype").text("Profit & Loss Budget");
                    btype = 16;
                    $("#flow").hide();
                    tablecall();
                    hideshowflag = 0;
                }
                $("#editbudget").show();
                $("#form-footer").show();
                $("#delete").show();
                $("#edit").show();
                
            }
        });
    });
// ------------ edit button ------------
    $("#edit").click(function(e){
        e.preventDefault();
        hideshowflag = 1;
        $("#bname").prop("disabled", false);
        $("#bname").focus();
        
        $("#budget_fromday").prop("disabled", false);
        $("#budget_frommonth").prop("disabled", false);
        $("#budget_fromyear").prop("disabled", false);
        $("#budget_today").prop("disabled", false);
        $("#budget_tomonth").prop("disabled", false);
        $("#budget_toyear").prop("disabled", false);
        $("#cash_latable tbody tr td input").prop("disabled", false);
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
            })
            $("#add").keydown(function(e){
                if (e.which==39)
                {
                e.preventDefault();
                $("#reset").focus();
                }
            });
            $("#reset").keydown(function(e){
                if (e.which==37 || e.which==38)
                {
                e.preventDefault();
                $("#add").focus();
                }
            });
            $(document).off("keydown","#budget_toyear").on("keydown", '#budget_toyear', function(e){
                if (e.which == 13) {
                    e.preventDefault();
                        $("#cash_latable tbody:eq(1) tr:eq(0) input").focus();
                  }
            });
            $(document).off("keydown","#add").on("keydown", '#add', function(e){
                if (e.which == 38) {
                    $("#budget_toyear").focus();
                }
            });
        
            $(document).off("keydown","#cash_latable tbody tr input").on("keydown", "#cash_latable tbody tr input", function(e){
                
                if(e.which == 27 ){
                    $("#add").focus();
                }
                if(e.which == 40){e.preventDefault();
                    var i = $("#cash_latable tbody tr input").index(this)+1;
                    $("#cash_latable tbody tr:eq("+i+") input").focus().select();
                }
                if(e.which == 38){e.preventDefault();
                    var i = $("#cash_latable tbody tr input").index(this)-1;
                    $("#cash_latable tbody tr:eq("+i+") input").focus().select();
                }
            });
            $(document).off("change","#cash_latable tbody tr input").on("change", "#cash_latable tbody tr input", function(e){
                var i = $("#cash_latable tbody tr input").index(this);
                var inputValue = parseFloat($("#cash_latable tbody tr:eq("+i+") input").val());
                var accBalance = parseFloat($("#cash_latable tbody tr:eq("+i+") td:eq(1)").text());
                $("#cash_latable tbody tr:eq("+i+") td:eq(3)").text((inputValue+accBalance).toFixed(2));
                let inflowtotal = 0;
                let outflowtotal =0;
                if (i > $("#inflowaccount").val()){
        
                    let a = parseInt($("#inflowaccount").val())+2;
                    let b = parseInt($("#inflowaccount").val())+1+parseInt($("#outflowaccount").val());
                    
                    for (let j=a ;j<=b ; j++ ){
                        if ($("#cash_latable tbody tr:eq("+j+") input").val() == "" || isNaN($("#cash_latable tbody tr:eq("+j+") input").val())){
                            $("#cash_latable tbody tr:eq("+j+") input").val(0.00)
                        }
                        else{
                            outflowtotal = outflowtotal + parseFloat($("#cash_latable tbody tr:eq("+j+") input").val());
                        }
                    }
                    if (btype == 3){
                        $("#outflow").text(outflowtotal.toFixed(2));
                    }
                    else{
                        $("#e_expense").text(outflowtotal.toFixed(2));
                    }
                }
                else{
                    for(let j=1 ; j <= $("#inflowaccount").val(); j++){
                        if($("#cash_latable tbody tr:eq("+j+") input").val() == "" || isNaN($("#cash_latable tbody tr:eq("+j+") input").val())){
                            $("#cash_latable tbody tr:eq("+j+") input").val(0.00)
                        }
                        else{
                            inflowtotal = inflowtotal + parseFloat($("#cash_latable tbody tr:eq("+j+") input").val());
                        }
                    }
                    if (btype == 3){
                        $("#inflow").text(inflowtotal.toFixed(2));
                    }
                    else{
                        $("#e_income").text(inflowtotal.toFixed(2));
                    }
                }
                if (btype == 3){
                    $("#cashavailable").text((parseFloat($("#inflow").text())+parseFloat($("#balance").text())).toFixed(2)) 
                    $("#budgetbalance").text((parseFloat($("#cashavailable").text())-parseFloat($("#outflow").text())).toFixed(2))
                }
                else{
                    $("#e_netprofit").text((parseFloat($("#e_income").text())-parseFloat($("#e_expense").text())).toFixed(2));
                }
            });
        // ----------------- end keydown ----------------
        
        $("#budget_fromday").change(function(event) { 
            if(btype==null){
                return false;
            }
            $(this).val(pad($(this).val(),2));
            tablecall();
        });
        $("#budget_frommonth").change(function(event) {
            if(btype==null){
                return false;
            }
            $(this).val(pad($(this).val(),2));
            tablecall();
        });
        $("#budget_fromyear").change(function(event) { 
            if(btype==null){
                return false;
            }
            $(this).val(pad($(this).val(),4));
            tablecall();
        });
    
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
// ----------- end validation -----------

        let content={};
        let rowcount = $("#inflowaccount").val();
        let countinflowaccounts=0;
        for(i=0;i<rowcount;i++){
            let value = parseFloat($("#cash_latable tbody:eq(1) tr:eq("+i+") input").val());
            if (value != 0 ){
                let code = $("#cash_latable tbody:eq(1) tr:eq("+i+")").attr('data-value');
                content[code]=value;
                countinflowaccounts = countinflowaccounts +1;
            }
        }
        if(countinflowaccounts == 0){
            if (btype==3){
                $("#inflow-account-alert").alert();
            $("#inflow-account-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#inflow-account-alert").hide();
            });
            }
            else{
                $("#income-account-alert").alert();
            $("#income-account-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#income-account-alert").hide();
            });
            }
            $("#cash_latable tbody:eq(1) tr:eq(0) input").focus();
            return false;
        }
       
        rowcount = $("#outflowaccount").val();
        let countoutflowaccounts=0;
        for(i=0;i<rowcount;i++){
            let value = parseFloat($("#cash_latable tbody:eq(3) tr:eq("+i+") input").val());
            if (value != 0 ){
                let code = $("#cash_latable tbody:eq(3) tr:eq("+i+")").attr('data-value');
                content[code]=value;
                countoutflowaccounts = countoutflowaccounts +1;
            }
        }
        if(countoutflowaccounts == 0){
            if (btype==3){
                $("#outflow-account-alert").alert();
            $("#outflow-account-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#outflow-account-alert").hide();
            });
            }
            else{
                $("#expense-account-alert").alert();
            $("#expense-account-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#expense-account-alert").hide();
            });
            }
            $("#cash_latable tbody:eq(3) tr:eq(0) input").focus();
            return false;
        }
        dataset = {"budid":$("#budgetlist option:selected").val(),"contents":JSON.stringify(content),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":btype,"gaflag":1};
        
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
                data: {"budid": $("#budgetlist option:selected").val(),"budname":$("#bname").val()},
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