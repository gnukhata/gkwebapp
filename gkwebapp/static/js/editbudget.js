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
    var hideshowflag;
    $("#noeditbudget").hide();
    $("#flow").hide();
    $("#e_cash").select();
    $("#footer").hide();
    $("#budgetlist").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
            if($("#budgetlist").val()==""){
                return false;
            }
        $("#edit").focus().click();
        }
        if (e.which==38){
            $("#budgettype").focus();
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
    $("#expense").keydown(function(e){
        
        if (e.which==13)
        {e.preventDefault();
        $("#budgetlist").focus();
        }
    });
    $("#sales").keydown(function(e){
        
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
        
        if($("#btype").val() == 3){   // Cash budget
            $.ajax({
                type: "POST",
                url: "/budget?type=balance",
                global: false,
                async: false,
                datatype: "text/html",
                data: {"financialstart":financial,"uptodate":fromdate,"budgettype":3},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
            })
            .done(function(resp) { 
                $("#accounttable").html("");      
                $("#accounttable").html(resp);
                $("#balance").text((parseFloat($("#openingbal").val())).toFixed(2)); 
                $("#cashavailable").text((parseFloat($("#inflow").val())+parseFloat($("#openingbal").val())).toFixed(2)); 
                $("#budgetbalance").text((parseFloat($("#cashavailable").text())-parseFloat($("#outflow").val())).toFixed(2));
            });
        }
        if($("#btype").val() == 19){   // Cash budget
            $.ajax({
                type: "POST",
                url: "/budget?type=balance",
                global: false,
                async: false,
                datatype: "text/html",
                data: {"financialstart":financial,"uptodate":fromdate,"budgettype":19},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
            })
            .done(function(resp) { 
                $("#accounttable").html("");      
                $("#accounttable").html(resp);
                if(hideshowflag == 1){
                    $("#sales_latable tbody tr td input").prop("disabled", false);
                }
                else{
                    $("#sales_latable tbody tr td input").prop("disabled", true);
                }
                keys =(goddetails["contents"]["accounts"]);
                for (var i = 0;i<keys.length;i++){
                    $('#'+keys[i]+'_in').prop("checked", true);
                }
            });
        }
        if($("#btype").val() == 5){  //expense budget
            $.ajax({
                type: "POST",
                url: "/budget?type=balance",
                global: false,
                async: false,
                datatype: "text/html",
                data: {"financialstart":financial,"uptodate":fromdate,"budgettype":5},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
            })
            .done(function(resp) {    
                $("#accounttable").html("");      
                $("#accounttable").html(resp);
                if(hideshowflag == 1){
                    $("#latable tbody tr td input").prop("disabled", false);
                }
                else{
                    $("#latable tbody tr td input").prop("disabled", true);
                    
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
                        budgetedBalance = budgetedBalance + parseFloat($("#"+keys[i]+"_bal").text());
                        $("#budgetedbalance").text((budgetedBalance).toFixed(2));
                }
        });
        }
    }
    $("#budgettype").change(function(e){    // radio buttons Cash and Expense
        if($("#e_cash").is(":checked")) {
             var val = 3;
         }
         if($("#expense").is(":checked")) {
             var val = 5;
         }
         if($("#sales").is(":checked")) {
            var val = 19;
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
    $("#budgettype").change();     // on change list cash will be load
    $("#budgetlist").change(function(e) {      // Budget list change
        $("#budgettype").hide();
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
                $("#btype").val(goddetails["btype"]);
                $("#btype").prop("disabled", true);
                if(goddetails["btype"] == 3){
                    $("#salesdiv").hide();
                    $("#flow").show();
                    $("#outflow").val(parseFloat(goddetails["contents"]["outflow"]).toFixed(2));
                    $("#outflow").prop("disabled", true);
                    $("#inflow").val(parseFloat(goddetails["contents"]["inflow"]).toFixed(2));
                    $("#inflow").prop("disabled", true);
                    tablecall();
                }
                if(goddetails["btype"] == 5){
                    $("#flow").hide();
                    $("#salesdiv").hide();
                    tablecall();
                    hideshowflag = 0;
                }
                if(goddetails["btype"] == 19){
                    $("#flow").hide();
                    $("#salesdiv").show();
                    $("#expenseedit").val(parseFloat(goddetails["contents"]["expense"]).toFixed(2));
                    $("#expenseedit").prop("disabled", true);
                    $("#income").val(parseFloat(goddetails["contents"]["income"]).toFixed(2));
                    $("#income").prop("disabled", true);
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
        $("#btype").prop("disabled", true);
        $("#outflow").prop("disabled", false);
        $("#bal").prop("disabled", false);
        $("#inflow").prop("disabled", false);
        $("#income").prop("disabled", false);
        $("#expenseedit").prop("disabled", false);
        $("#budget_fromday").prop("disabled", false);
        $("#budget_frommonth").prop("disabled", false);
        $("#budget_fromyear").prop("disabled", false);
        $("#budget_today").prop("disabled", false);
        $("#budget_tomonth").prop("disabled", false);
        $("#budget_toyear").prop("disabled", false);
        $("#latable tbody tr td input").prop("disabled", false);
        $("#sales_latable tbody tr td input").prop("disabled", false);
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
                if($("#btype").val() == 3){
                  $("#inflow").focus();
                  if ($("#budget_toyear").val()==0 ||$("#budget_tomonth").val()==0 ||$("#budget_todate").val()==0 ) {
                    $("#date-valid-alert").alert();
                    $("#date-valid-alert").fadeTo(2250, 400).slideUp(500, function(){
                    $("#date-valid-alert").hide();
                    });
                    $('#budget_today').focus().select();
                    return false;
                } 
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
                }
            });
            $("#reset").keydown(function(e){
                if (e.which==37 || e.which==38)
                {
                e.preventDefault();
                $("#add").focus();
                }
            });
            $("#expenseedit").keydown(function(e){
                if (e.which==13)
                {
                e.preventDefault();
                if ($.trim($("#expenseedit").val())=="" ) {
                    $("#expenseedit-alert").alert();
                    $("#expenseedit-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#expenseedit-alert").hide();
                    });
                    $("#expenseedit").focus();
                    return false;
                }
                $("#income").focus();
                }
                if (e.which==38)
                {
                e.preventDefault();
                $("#budget_toyear").focus();
                }
            });
            $("#income").keydown(function(e){
                if (e.which==13)
                {
                e.preventDefault();
                if ($.trim($("#income").val())=="" ) {
                    $("#income-alert").alert();
                    $("#income-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#income-alert").hide();
                    });
                    $("#income").focus();
                    return false;
                }
                $("#add").focus();
                }
                if (e.which==38)
                {
                e.preventDefault();
                $("#expenseedit").focus();
                }
            });
            $(document).off("keydown","#budget_toyear").on("keydown", '#budget_toyear', function(e){
                if (e.which == 13) {
                    if($("#btype").val() == 5){
                        $("#latable tbody tr:eq(1) input").focus();
                    }
                    else{
                        $("#sales_latable tbody tr:eq(1) input").focus();
                    }
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
                    $("#budget_toyear").focus();
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
            $(document).off("keydown","#sales_latable tbody:eq(1) tr input").on("keydown", "#sales_latable tbody:eq(1) tr input", function(e){
        
                if(e.which == 27){
                    $("#expenseedit").focus();
                }
                if(e.which == 40){e.preventDefault();
                    var i = $("#sales_latable tbody:eq(1) tr input").index(this)+1;
                    $("#sales_latable tbody:eq(1) tr:eq("+i+") input").focus().select();
                }
                if(e.which == 38){e.preventDefault();
                    var i = $("#sales_latable tbody:eq(1) tr input").index(this)-1;;
                    $("#sales_latable tbody:eq(1) tr:eq("+i+") input").focus().select();
                }
            });
            $(document).off("keydown","#sales_latable tbody:eq(3) tr input").on("keydown", "#sales_latable tbody:eq(3) tr input", function(e){
                
                if(e.which == 27){
                    $("#expenseedit").focus();
                }
                if(e.which == 40){e.preventDefault();
                    var i = $("#sales_latable tbody:eq(3) tr input").index(this)+1;
                    $("#sales_latable tbody:eq(3) tr:eq("+i+") input").focus().select();
                }
                if(e.which == 38){e.preventDefault();
                    var i = $("#sales_latable tbody:eq(3) tr input").index(this)-1;
                    $("#sales_latable tbody:eq(3) tr:eq("+i+") input").focus().select();
                }
            });
            $(document).off("keydown","#add").on("keydown", '#add', function(e){
                if (e.which == 38) {
                    if($("#btype").val() == 5){
                        $("#latable tbody tr:eq(1) input").focus();
                    }
                    else{
                        $("#income").focus();
                    }
                }
            });
            
        // ----------------- end keydown ----------------
        
        $("#budget_fromday").change(function(event) { 
            if($("#btype").val()==null){
                return false;
            }
            $(this).val(pad($(this).val(),2));
            tablecall();
        });
        $("#budget_frommonth").change(function(event) {
            if($("#btype").val()==null){
                return false;
            }
            $(this).val(pad($(this).val(),2));
            tablecall();
        });
        $("#budget_fromyear").change(function(event) { 
            if($("#btype").val()==null){
                return false;
            }
            $(this).val(pad($(this).val(),4));
            tablecall();
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
            dataset = {"budid":$("#budgetlist option:selected").val(),"contents":JSON.stringify(vd),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#btype option:selected").val(),"gaflag": 19};
        }
        if($("#btype").val() == 5){   // when sale or wxpense budget
            //gets table data
        var oTable = document.getElementById('latable');
        //gets rows of table
        var rowLength = oTable.rows.length;
        vd=[];
        var content= {};
        //loops through rows    
        for (i = 0; i < (rowLength-1); i++){
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
        dataset = {"budid":$("#budgetlist option:selected").val(),"contents":JSON.stringify(vd),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#btype option:selected").val(),"gaflag":1};
        }
        if($("#btype option:selected").val() == 19){
            var s1 = [];
            var s2 = [];
            $('#sales_latable tbody:eq(1) tr').each(function(){
                if ($(".user_role",this).is(":checked")) {
                s1.push($(this).attr("value"));
                }
            });
                if(s1.length < 1){
                    $("#account-alert").alert();
                    $("#account-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#account-alert").hide();
                    });
                    $("#sales_latable tbody:eq(1) tr:eq(0) input").focus();
                    return false;
                }
            $('#sales_latable tbody:eq(3) tr').each(function(){
                if ($(".user_role",this).is(":checked")) {
                s2.push($(this).attr("value"));
                }
            });
                if(s2.length < 1){
                    $("#account-alert").alert();
                    $("#account-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#account-alert").hide();
                    });
                    $("#sales_latable tbody:eq(3) tr:eq(0) input").focus();
                    return false;
                }
            if ($.trim($("#income").val())=="") {
                $("#income-alert").alert();
                $("#income-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#income-alert").hide();
                });
                $("#income").focus();
                return false;
            }
            if ($.trim($("#expenseedit").val())=="" ) {
                $("#expenseedit-alert").alert();
                $("#expenseedit-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#expenseedit-alert").hide();
                });
                $("#expenseedit").focus();
                return false;
            }
            var selectedaccounts = [];
            vd=[];
            $('#sales_latable tbody tr').each(function(){
            if ($(".user_role",this).is(":checked")) {
            selectedaccounts.push($(this).attr("value"));
            }
            });
            if (selectedaccounts.length < 1) {
                $("#account-alert").alert();
                $("#account-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#account-alert").hide();
                });
                $("#sales_latable tbody:eq(1) tr:eq(0) input").focus().select();
                return false;
              }
            vd.push({"expense":$("#expenseedit").val(),"income":$("#income").val(),"accounts":selectedaccounts});
        
            dataset = {"budid":$("#budgetlist option:selected").val(),"contents":JSON.stringify(vd),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#btype option:selected").val(),"gaflag":1};
         
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