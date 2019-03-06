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
// This js is use in createbudget.jinja2 file
$(document).ready(function(){
    // Retrives organisation details from sessionstorage.
    var orname = sessionStorage.getItem('orgn');
    var ortype = sessionStorage.getItem('orgt');
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    $("#c_flow").hide();
    $("#c_bname").focus();
    $("#c_balance").text("0.00");
    $("#c_cashavailable").text("0.00");
    $("#c_budgetbalance").text("0.00");
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
          $("#c_btype").focus();
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
        if (e.which==13 )
        {
          e.preventDefault();
          if($("#c_btype option:selected").val() == 3){
              $("#c_flow").show();
              $("#c_inflow").focus();
          }
        }
        if ( e.which==38)
          {
          e.preventDefault();
          $("#c_budget_toyear").focus();
          }
    });
    
    $("#c_btype").change(function(e){
        $("#c_budget_fromday").change();
        if($("#c_btype option:selected").val() == 3){
            $("#c_flow").show();
        }
        if($("#c_btype option:selected").val() == 5 || $("#c_btype option:selected").val() == 19){
            $("#c_flow").hide();
        }
    });
    $("#c_inflow").change(function(e){
        var b = parseFloat($("#c_balance").text());
        if(b != 0){
            $("#c_cashavailable").text((b+parseFloat($("#c_inflow").val())).toFixed(2))
        }
        else{
            $("#c_cashavailable").text((parseFloat($("#c_inflow").val())).toFixed(2))
        }
        var ca = parseFloat($("#c_cashavailable").text());
        if(ca != 0){
            $("#c_budgetbalance").text((ca-parseFloat($("#c_outflow").val())).toFixed(2))
        }
        else{
            $("#c_budgetbalance").text(("-"+parseFloat($("#c_outflow").val())).toFixed(2))
        }
    });
    $("#c_outflow").change(function(e){
        var b = parseFloat($("#c_balance").text());
        if(b != 0){
            $("#c_cashavailable").text((b+parseFloat($("#c_inflow").val())).toFixed(2))
        }
        else{
            $("#c_cashavailable").text((parseFloat($("#c_inflow").val())).toFixed(2))
        }
        var ca = parseFloat($("#c_cashavailable").text());
        if(ca != 0){
            $("#c_budgetbalance").text((ca-parseFloat($("#c_outflow").val())).toFixed(2))
        }
        else{
            $("#c_budgetbalance").text(("-"+parseFloat($("#c_outflow").val())).toFixed(2))
        }
    });
    $("#c_inflow").keydown(function(e){
        if (e.which==13 )
        {e.preventDefault();
            if ($.trim($("#c_inflow").val())=="") {
                $("#c_inflow-alert").alert();
                $("#c_inflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#c_inflow-alert").hide();
                });
                $("#c_inflow").focus();
                return false;
            }
            else{
                $("#c_outflow").focus();
            }
        }
        if (e.which==38)
          {e.preventDefault();
          $("#c_btype").focus();
          }
    });
    $("#c_outflow").keydown(function(e){
        if (e.which==13 )
        {e.preventDefault();
            if ($.trim($("#c_outflow").val())=="") {
                $("#c_outflow-alert").alert();
                $("#c_outflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#c_outflow-alert").hide();
                });
                $("#c_outflow").focus();
                return false;
            }
            else{
                $("#c_add_button").focus();
            }
        }
        if ( e.which==38)
          {e.preventDefault();
          $("#c_inflow").focus();
          }
    });
    $("#c_add_button").keydown(function(e){
        if (e.which==39)
        {
          e.preventDefault();
          $("#c_reset_button").focus();
        }
        if ( e.which==38)
          {
          e.preventDefault();
          if($("#c_btype option:selected").val() == 3){
            $("#c_outflow").focus();
        }
          }
    });
    $("#c_reset_button").keydown(function(e){
        if (e.which==37 || e.which==38)
          {
          e.preventDefault();
          $("#c_add_button").focus();
          }
    });
    $(document).off("keydown","#c_btype").on("keydown", '#c_btype', function(e){
        if (e.which == 13) {
            e.preventDefault();
            $("#latable tbody tr:eq(1) input").focus();
          }
    });
    $(document).off("change","#latable tbody tr input").on("change", "#latable tbody tr input", function(e){
        var i = $("#latable tbody tr input").index(this);
        var inputValue = parseFloat($("#latable tbody tr:eq("+i+") input").val());
        var accBalance = parseFloat($("#latable tbody tr:eq("+i+") td:eq(1)").text());
        $("#latable tbody tr:eq("+i+") td:eq(3)").text((inputValue+accBalance).toFixed(2));
        total ();
    });
    $(document).off("keydown","#latable tbody tr input").on("keydown", "#latable tbody tr input", function(e){
        if (e.which == 13) {
            e.preventDefault();
            $("#c_add_button").focus().select();
          }
        if(e.which == 27){
            $("#c_btype").focus().select();
        }
        if(e.which == 40){e.preventDefault();
            var i = $("#latable tbody tr input").index(this)+1;
            $("#latable tbody tr:eq("+i+") input").focus().select();
        }
        if(e.which == 38){e.preventDefault();
            var i = $("#latable tbody tr input").index(this)-1;
            $("#latable tbody tr:eq("+i+") input").focus().select();
        }
    });
    $(document).off("keydown","#c_add_button").on("keydown", '#c_add_button', function(e){
        if (e.which == 38) {
            // e.preventDefault();
            $("#latable tbody tr:eq(1) input").focus();
          }
    });
    // ------------------Expense table row total -------------
    function total () {
        var oTable = document.getElementById('latable');
        //gets rows of table
        var rowLength = oTable.rows.length;
        vd=[];
        var content= {};
        //loops through rows 
        var totalInput = 0.00;
        var totalBalance = 0.00;
        for (i = 1; i < (rowLength-3); i++){
            if($("#latable tbody tr:eq("+i+") input").val() != ''){
                totalInput = totalInput + parseFloat($("#latable tbody tr:eq("+i+") input").val());
                totalBalance = totalBalance + parseFloat($("#latable tbody tr:eq("+i+") td:eq(3)").text());
            }
        }
        $("#latable tbody tr:eq(-1) td:eq(2)").text((totalInput).toFixed(2));
        $("#latable tbody tr:eq(-1) td:eq(3)").text((totalBalance).toFixed(2));
    }
// -----------------end table row total ------------
// ------------------ date validations --------------
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
    $("#c_budget_fromday").val(fromdatearray[2])
    $("#c_budget_frommonth").val(fromdatearray[1])
    $("#c_budget_fromyear").val(fromdatearray[0])
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
    $("#c_budget_today").val(todatearray[2])
    $("#c_budget_tomonth").val(todatearray[1])
    $("#c_budget_toyear").val(todatearray[0])

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
                $("#c_balance").text(parseFloat($("#openingbal").val()).toFixed(2));
                $("#c_cashavailable").text((parseFloat($("#c_inflow").val())+parseFloat($("#openingbal").val())).toFixed(2)) 
                $("#c_budgetbalance").text((parseFloat($("#c_cashavailable").text())-parseFloat($("#c_outflow").val())).toFixed(2)) 
            });
        }
        if ($("#c_btype option:selected").val() == 5){   // Expense budget
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
        if ($("#c_budget_fromyear").val()==0 ||$("#c_budget_frommonth").val()==0 ||$("#c_budget_fromday").val()==0 ) {
            $("#c_date-alert").alert();
            $("#c_date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#c_date-alert").hide();
            });
            $('#c_budget_fromday').focus().select();
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
        if($("#c_btype option:selected").val() == 3){  // if Cash budget 
            if ($.trim($("#c_inflow").val())=="") {
                $("#c_inflow-alert").alert();
                $("#c_inflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#c_inflow-alert").hide();
                });
                $("#c_inflow").focus();
                return false;
            }
            if ($.trim($("#c_outflow").val())=="") {
                $("#c_outflow-alert").alert();
                $("#c_outflow-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#c_outflow-alert").hide();
                });
                $("#c_outflow").focus();
                return false;
            }
            vd=[]
            vd = [{"inflow":$("#c_inflow").val(),"outflow":$("#c_outflow").val()}]
            var gaflag = 19;
        }
        if($("#c_btype option:selected").val() == 5){  // Expense budget
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
                $("#c_content-alert").alert();
                $("#c_content-alert").fadeTo(2250, 400).slideUp(500, function(){
                $("#c_content-alert").hide();
                });
                $("#latable tbody tr:eq(0) input").focus();
                return false;
        }
        var gaflag = 1;
        }
        if (sessionStorage.goid != ''){ // if login branch wise then branch id.
            var goid = sessionStorage.goid;
            dataset = {"goid":goid,"contents":JSON.stringify(vd),"budname":$("#c_bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#c_btype option:selected").val(),"gaflag": parseInt(gaflag)};
          }
        else{
            dataset = {"contents":JSON.stringify(vd),"budname":$("#c_bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#c_btype option:selected").val(),"gaflag": parseInt(gaflag)};
        }
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