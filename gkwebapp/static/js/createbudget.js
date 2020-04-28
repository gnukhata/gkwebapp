/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
// This js is use in createbudget.jinja2 file
$(document).ready(function(){
    // Retrives organisation details from sessionstorage.
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    if (sessionStorage.orgt=="Not For Profit") {
        // If orgtype is Not for Profit than some heading and menu items text is changed.
        $('#c_btype').append('<option value=16 >' + "Income and Expenditure budget" +' </option>');    
        $('#c_btype').append('<option value=3 >' + "Cash budget" +' </option>'); 
    }
    else{
        $('#c_btype').append('<option value=16 >' + "Profit and Loss budget" +' </option>');    
        $('#c_btype').append('<option value=3 >' + "Cash budget" +' </option>'); 
    }
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    $("#c_flow").hide();
    $("#c_pnldiv").hide();
    $("#c_btype").focus();
    $("#c_balance").text("0.00");
    $("#c_cashavailable").text("0.00");
    $("#c_opening").text((0.00).toFixed(2));
    $("#c_outflow").text((0.00).toFixed(2));
    $("#c_inflow").text((0.00).toFixed(2));
    $("#c_expense").text((0.00).toFixed(2));
    $("#c_income").text((0.00).toFixed(2));
    $("#c_netprofit").text((0.00).toFixed(2));
    var dataset = {};
    // for reset Button
    $("#c_reset_button").click(function()
     {
        $("a[href ='#budget_create']").click();
     });
// ----------------  keydown functions -----------
    $("#c_bname").keydown(function(e){
        if (e.which==13)
          {
          e.preventDefault();
          if ($.trim($("#c_bname").val())=="") {
            $("#c_blank-name-alert").alert();
            $("#c_blank-name-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#c_blank-name-alert").hide();
            });
            $("#c_bname").focus();
            return false;
        }
        else{
          $("#c_budget_fromday").focus();
        }
          }
        if(e.which==38){
            $("#c_btype").focus();
        }
      });
    $("#c_budget_fromday").keydown(function(e){
        
        if (e.which==13 || e.which==39)
          {e.preventDefault();
            $("#c_budget_frommonth").focus();
          }
        if (e.which==37 || e.which==38)
          {e.preventDefault();
          $("#c_bname").focus();
          }
      });
    $("#c_budget_frommonth").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
        $("#c_budget_fromyear").focus();
        }
        if (e.which==37 || e.which==38)
          {e.preventDefault();
          $("#c_budget_fromday").focus();
          }
    });
    $("#c_budget_fromyear").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
        $("#c_budget_today").focus();
        if ($("#c_budget_fromyear").val()==0 ||$("#c_budget_frommonth").val()==0 ||$("#c_budget_fromday").val()==0 ) {
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        var fromdate = $("#c_budget_fromyear").val()+$("#c_budget_frommonth").val()+$("#c_budget_fromday").val();        
        if(!Date.parseExact(fromdate,"yyyyMMdd")){
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
            $("#c_between-date-alert").alert();
            $("#c_between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_between-date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        }
        if (e.which==37 || e.which==38)
          {e.preventDefault();
          $("#c_budget_frommonth").focus();
          }
    });
    $("#c_budget_today").keydown(function(e){
        if (e.which==13 || e.which==39)
          {e.preventDefault();
          $("#c_budget_tomonth").focus();
          }
        if (e.which==37 || e.which==38)
          {e.preventDefault();
          $("#c_budget_fromyear").focus();
          }
      });
    $("#c_budget_tomonth").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
          $("#c_budget_toyear").focus();
        }
        if (e.which==37 || e.which==38)
          {e.preventDefault();
          $("#c_budget_today").focus();
          }
    });
    $("#c_budget_toyear").keydown(function(e){
        if (e.which==13 || e.which==39)
        {e.preventDefault();
          $("#c_inflow").focus();
          if ($("#c_budget_toyear").val()==0 ||$("#c_budget_tomonth").val()==0 ||$("#c_budget_today").val()==0 ) {
            $("#c_date-valid-alert").alert();
            $("#c_date-valid-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-valid-alert").hide();
            });
            $('#c_budget_today').focus().select();
            return false;
        }
        var todate = $("#c_budget_toyear").val()+$("#c_budget_tomonth").val()+$("#c_budget_today").val();        
        if(!Date.parseExact(todate,"yyyyMMdd")){
            $("#c_date-valid-alert").alert();
            $("#c_date-valid-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-valid-alert").hide();
            });
            $('#c_budget_today').focus().select();
            return false;
        }
        if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
            $("#c_between-date-alert").alert();
            $("#c_between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_between-date-alert").hide();
            });
            $('#c_budget_today').focus().select();
            return false;
        }
        }
        if (e.which==37 || e.which==38)
          {e.preventDefault();
          $("#c_budget_tomonth").focus();
          }
    });
    $("#c_btype").keydown(function(e){
        if (e.which==13){
            if($("#c_btype").val() == "" || $("#c_btype").val() == null){
                $("#c_btype-alert").alert();
            $("#c_btype-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#c_btype-alert").hide();
            });
            $("#c_btype").focus();
            return false;
            }
            $("#c_bname").focus();
        }
    });
    $("#c_btype").change(function(e){
        $("#c_budget_fromday").change();
        if($("#c_btype option:selected").val() == 3){
            $("#c_flow").show();
            $("#c_pnldiv").hide();
        }
        if($("#c_btype option:selected").val() == 16){
            $("#c_flow").hide();
            $("#c_pnldiv").show();
        }
    });
    
    $("#c_add_button").keydown(function(e){
        if (e.which==39)
        {
          e.preventDefault();
          $("#c_reset_button").focus();
        }
    });
    $("#c_reset_button").keydown(function(e){
        if (e.which==37 || e.which==38)
          {
          e.preventDefault();
          $("#c_add_button").focus();
          }
    });
    $(document).off("keydown","#c_budget_toyear").on("keydown", '#c_budget_toyear', function(e){
        if (e.which == 13) {
            e.preventDefault();
                $("#cash_latable tbody:eq(1) tr:eq(0) input").focus();
          }
    });
    $(document).off("keydown","#c_add_button").on("keydown", '#c_add_button', function(e){
        if (e.which == 38) {
            $("#c_budget_toyear").focus();
        }
    });

    $(document).off("keydown","#cash_latable tbody tr input").on("keydown", "#cash_latable tbody tr input", function(e){
        
        if(e.which == 27 ){
            $("#c_add_button").focus();
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
            if($("#c_btype").val() == '3'){
                $("#c_outflow").text(outflowtotal.toFixed(2));
            }
            else{
                $("#c_expense").text(outflowtotal.toFixed(2));
            }
        }
        else{
            for(let j=1 ; j <= $("#inflowaccount").val(); j++){
                if($("#cash_latable tbody tr:eq("+j+") input").val() == "" || isNaN($("#cash_latable tbody tr:eq("+j+") input").val())){
                    $("#cash_latable tbody tr:eq("+j+") input").val(0.00);
                }
                else{
                    inflowtotal = inflowtotal + parseFloat($("#cash_latable tbody tr:eq("+j+") input").val());
                }
                
            }
            if($("#c_btype").val() == '3'){
                $("#c_inflow").text(inflowtotal.toFixed(2));
            }
            else{
                $("#c_income").text(inflowtotal.toFixed(2));
            }
        }
        if ($("#c_btype").val() == '3'){
            $("#c_cashavailable").text((parseFloat($("#c_inflow").text())+parseFloat($("#c_opening").text())).toFixed(2)); 
            $("#c_budgetbalance").text((parseFloat($("#c_cashavailable").text())-parseFloat($("#c_outflow").text())).toFixed(2)); 
        }
        else{
            $("#c_netprofit").text((parseFloat($("#c_income").text())-parseFloat($("#c_expense").text())).toFixed(2));
        }
    });
// ------------------ date validations --------------
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g);
    console.log(fromdatearray[2]);
    $("#c_budget_fromday").val(fromdatearray[2]);
    $("#c_budget_frommonth").val(fromdatearray[1]);
    $("#c_budget_fromyear").val(fromdatearray[0]);
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g);
    $("#c_budget_today").val(todatearray[2]);
    $("#c_budget_tomonth").val(todatearray[1]);
    $("#c_budget_toyear").val(todatearray[0]);

    function pad (str, max) { //to add leading zeros in date
        str = str.toString();
        if (str.length==1) {
          return str.length < max ? pad("0" + str, max) : str;
        }
        else{
            return str;
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
    $("#c_budget_fromday").blur(function(event) {
        $(this).val(pad($(this).val(),2));
    });
    $("#c_budget_frommonth").blur(function(event) {
        $(this).val(pad($(this).val(),2));
    });
    $("#c_budget_today").blur(function(event) {
        $(this).val(pad($(this).val(),2));
    });
    $("#c_budget_tomonth").blur(function(event) {
        $(this).val(pad($(this).val(),2));
    });
    $("#c_budget_fromyear").blur(function(event) {
        $(this).val(yearpad($(this).val(),4));
    });
    $("#c_budget_toyear").blur(function(event) {
        $(this).val(yearpad($(this).val(),4));
    });
// ------------------ end date validation -------------
    //    -------------------------------- date change event ---------
    var financial = sessionStorage.yyyymmddyear1;
    $("#c_budget_fromday").change(function(event) { 
        if($("#c_btype").val()==null){
            return false;
        }
        $(this).val(pad($(this).val(),2));
        if ($("#c_budget_fromyear").val()==0 ||$("#c_budget_frommonth").val()==0 ||$("#c_budget_fromday").val()==0 ) {
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        var fromdate = $("#c_budget_fromyear").val()+$("#c_budget_frommonth").val()+$("#c_budget_fromday").val();        
        if(!Date.parseExact(fromdate,"yyyyMMdd")){
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
            $("#c_between-date-alert").alert();
            $("#c_between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_between-date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        var fromdate = $("#c_budget_fromyear").val()+"-"+$("#c_budget_frommonth").val()+"-"+$("#c_budget_fromday").val();
        if($("#c_btype option:selected").val() == 3) {   // Cash budget
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
                $("#c_accounttable").html("");      
                $("#c_accounttable").html(resp);
                $("#c_opening").text(($("#op").val()));
                $("#c_inflow").text((0.00).toFixed(2));
                $("#c_outflow").text((0.00).toFixed(2));
                $("#c_cashavailable").text((parseFloat($("#c_inflow").text())+parseFloat($("#c_opening").text())).toFixed(2)) 
                $("#c_budgetbalance").text((parseFloat($("#c_cashavailable").text())-parseFloat($("#c_outflow").text())).toFixed(2)) 
            });
        }
        if ($("#c_btype option:selected").val() == 16){   // pnl budget
            $.ajax({
                type: "POST",
                url: "/budget?type=balance",
                global: false,
                async: false,
                datatype: "text/html",
                data: {"financialstart":financial,"uptodate":fromdate,"budgettype":16},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
            })
            .done(function(resp) {    
                $("#c_accounttable").html("");      
                $("#c_accounttable").html(resp);
            });
        }
    });
    $("#c_budget_frommonth").change(function(event) {
        $(this).val(pad($(this).val(),2));
        $("#c_budget_fromday").change();
    });
    $("#c_budget_fromyear").change(function(event) { 
        $(this).val(yearpad($(this).val(),4));
        $("#c_budget_fromday").change();
    });

// submit button
    $("#c_add_button").click(function(e){
        e.preventDefault();
// ------------ validation  ----------------
        if ($.trim($("#c_bname").val())=="") {
            $("#c_blank-name-alert").alert();
            $("#c_blank-name-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#c_blank-name-alert").hide();
            });
            $("#c_bname").focus();
            return false;
        }
        if ($("#c_budget_toyear").val() ==0||$("#c_budget_tomonth").val()==0||$("#c_budget_today").val()==0) {
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_today').focus().select();
            return false;
        }
        var todate = $("#c_budget_toyear").val()+$("#c_budget_tomonth").val()+$("#c_budget_today").val();
        var fromdate = $("#c_budget_fromyear").val()+$("#c_budget_frommonth").val()+$("#c_budget_fromday").val();        
        if(!Date.parseExact(fromdate,"yyyyMMdd")){
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
            $("#c_between-date-alert").alert();
            $("#c_between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_between-date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
            return false;
        }
        if(!Date.parseExact(todate, "yyyyMMdd")){
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_today').focus().select();
            return false;
        }
        if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
            $("#c_between-date-alert").alert();
            $("#c_between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_between-date-alert").hide();
            });
            $('#c_budget_today').focus().select();
            return false;
        }
        if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
            $("#compare-date-alert").alert();
            $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#compare-date-alert").hide();
            });
            $('#c_budget_today').focus().select();
            return false;
        }
        if ($.trim($("#c_btype option:selected").val())=="") {
            $("#c_btype-alert").alert();
            $("#c_btype-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#c_btype-alert").hide();
            });
            $("#c_btype").focus();
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
            if ($("#c_btype").val()=='3'){
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
            if ($("#c_btype").val()=='3'){
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
        var gaflag = 1;
            dataset = {"contents":JSON.stringify(content),"budname":$("#c_bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#c_btype option:selected").val(),"gaflag": parseInt(gaflag)};
        
        $("#msspinmodal").modal("show");
        $.ajax(
            {
              type: "POST",
              url: "/budget?type=add",
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
                    $("#c_success-alert").alert();
                    $("#c_success-alert").fadeTo(2250, 500).slideUp(500, function(){
                        $("#success-alert").hide();
                        $("a[href ='#budget_create']").click();
                    });
                }   
              }
            );
       });
    });
