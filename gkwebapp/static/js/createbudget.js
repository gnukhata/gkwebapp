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
    $("#flow").hide();
    $("#gaflag").hide();
    $("#bname").focus();
    $("#balance").text("0.00");
    $("#cashavailable").text("0.00");
    $("#budgetbalance").text("0.00");
    var dataset = {};
    // for reset Button
    $("#reset_button").click(function()
     {
        $("a[href ='#budget_create']").click();
     });
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
        if (e.which==13 )
        {
          e.preventDefault();
          if($("#btype option:selected").val() == 3){
              $("#gaflag").hide();
              $("#flow").show();
              $("#inflow").focus();
          }
        }
        if ( e.which==38)
          {
          e.preventDefault();
          $("#budget_toyear").focus();
          }
    });
    
    $("#btype").change(function(e){
        $("#budget_fromday").change();
        if($("#btype option:selected").val() == 3){
            $("#gaflag").hide();
            $("#flow").show();
        }
        if($("#btype option:selected").val() == 5 || $("#btype option:selected").val() == 19){
            $("#flow").hide();
            $("#gaflag").show();
            $("#account").focus().click();
        }
    });
    $("#inflow").change(function(e){
        var b = parseFloat($("#balance").text());
        if(b != 0){
            $("#cashavailable").text(b+parseFloat($("#inflow").val()))
        }
        else{
            $("#cashavailable").text(parseFloat($("#inflow").val()))
        }
        var ca = parseFloat($("#cashavailable").text());
        if(ca != 0){
            $("#budgetbalance").text(ca-parseFloat($("#outflow").val()))
        }
        else{
            $("#budgetbalance").text("-"+parseFloat($("#outflow").val()))
        }
    });
    $("#outflow").change(function(e){
        var b = parseFloat($("#balance").text());
        if(b != 0){
            $("#cashavailable").text(b+parseFloat($("#inflow").val()))
        }
        else{
            $("#cashavailable").text(parseFloat($("#inflow").val()))
        }
        var ca = parseFloat($("#cashavailable").text());
        if(ca != 0){
            $("#budgetbalance").text(ca-parseFloat($("#outflow").val()))
        }
        else{
            $("#budgetbalance").text("-"+parseFloat($("#outflow").val()))
        }
    });
    $("#inflow").keydown(function(e){
        if (e.which==13 )
        {e.preventDefault();
          $("#outflow").focus();
        }
        if (e.which==38)
          {e.preventDefault();
          $("#btype").focus();
          }
    });
    $("#outflow").keydown(function(e){
        if (e.which==13 )
        {e.preventDefault();
          $("#add_button").focus();
        }
        if ( e.which==38)
          {e.preventDefault();
          $("#inflow").focus();
          }
    });
    $("#add_button").keydown(function(e){
        if (e.which==39)
        {
          e.preventDefault();
          $("#reset_button").focus();
        }
        if ( e.which==38)
          {
          e.preventDefault();
          if($("#btype option:selected").val() == 3){
            $("#outflow").focus();
        }
          }
    });
    $("#reset_button").keydown(function(e){
        if (e.which==37 || e.which==38)
          {
          e.preventDefault();
          $("#add_button").focus();
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
            $("#add_button").focus().select();
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
    $(document).off("keydown","#add_button").on("keydown", '#add_button', function(e){
        if (e.which == 38) {
            // e.preventDefault();
            $("#latable tbody tr:eq(0) input").focus();
          }
    });
// ----------------- end keydown ----------------
// ------------------ date validations --------------
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
    $("#budget_fromday").val(fromdatearray[2])
    $("#budget_frommonth").val(fromdatearray[1])
    $("#budget_fromyear").val(fromdatearray[0])
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
    $("#budget_today").val(todatearray[2])
    $("#budget_tomonth").val(todatearray[1])
    $("#budget_toyear").val(todatearray[0])

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
    $("#gaflag input:radio").change(function(event) { // load accounts/groups/subgroups table
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
                    $("#gaflag input:radio:checked").focus();
                });
       });
    //    -------------------------------- date change event ---------
    var financial = sessionStorage.yyyymmddyear1;
    $("#budget_fromday").change(function(event) { 
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
            $("#balance").text(parseFloat(resp["gkresult"])); 
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
            $("#balance").text(parseFloat(resp["gkresult"]));
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
            $("#balance").text(parseFloat(resp["gkresult"]));
        });
    });

// submit button
    $("#addbudget").submit(function(e){
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
        if($("#btype option:selected").val() == 3){  // if Cash budget 
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
            vd=[]
            vd = [{"inflow":$("#inflow").val(),"outflow":$("#outflow").val()}]
            var gaflag = 16;
        }
        else{  // Sales and Expense budget
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
        var gaflag = $("#gaflag input:radio:checked").val();
        }
        if (sessionStorage.goid != ''){ // if login branch wise then branch id.
            var goid = sessionStorage.goid;
            dataset = {"goid":goid,"contents":JSON.stringify(vd),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#btype option:selected").val(),"gaflag": parseInt(gaflag)};
          }
        else{
            dataset = {"contents":JSON.stringify(vd),"budname":$("#bname").val(),"startdate":fromdate,"enddate":todate,"btype":$("#btype option:selected").val(),"gaflag": parseInt(gaflag)};
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
                    $("#success-alert").alert();
                    $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
                        $("#success-alert").hide();
                        $("a[href ='#budget_create']").click();
                    });
                }   
              }
            );
       });
    });