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
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/

$(document).ready(function()
{
    $("#ledgerdiv").hide();
    $("#addorg").hide();
    $("#createadmin").hide();
    $("#createtorg").show();
  var invflag;
  var invsflag;
  var billflag;
  $("#orgname").focus();
  var sel1 = 0;
  var sel2 = 0;
  var sel3 = 0;
  $("#orgcase").focus(function(){
    sel1 = 1;
  });
  $("#orgcase").blur(function(){
    sel1 = 0;
  });
  $("#orgtype").focus(function(){
    sel2 = 1;
  });
  $("#orgtype").blur(function(){
    sel2 = 0;
  });
  $("#finalyears").focus(function(){
    sel3 = 1;
  });
  $("#finalyears").blur(function(){
    sel3 = 0;
  });
  var forname = "";
  $("#orgname").focusout(function(){
    forname = $("#orgname").val();
  });

  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
    }
  }
  function yearpad (str, max) {
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

  $("#fromday").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#today").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

    $('.vdate').autotab('number');
  $('input:text,select').keydown( function(e) {
    var n = $('input:text,select').length;
    var f = $('input:text,select');
    if (e.which == 13)
    {

      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }

      }

      var s1 = $("#orgcase option:selected").index();
      var s2 = $("#orgtype option:selected").index();
      var s3 = $("#finalyears option:selected").index();
      if ((e.which == 38 && sel1 == 1 && s1 == 0) || (e.which == 38 && sel2 == 1 && s2 == 0) ||(e.which == 38 && sel3 == 1 && s3 == 0) || (e.which == 38 && (sel1 == 0 && sel2==0 && sel3==0)))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
          }
        }
      });


      $("#orgcase").bind("change keyup", function(e){
        var ocase = $("#orgcase option:selected").val();
        var oname = "";
        String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

        if(ocase == "As-Is")
        {

          $("#orgname").val(forname);
        }
        if(ocase == "Upper Case")
        {
          oname = forname.toUpperCase();
          $("#orgname").val(oname);

        }
        if(ocase == "Lower Case")
        {
          oname = forname.toLowerCase();
          $("#orgname").val(oname);

        }
        if(ocase == "Title Case")
        {
          oname = forname.toProperCase();
          $("#orgname").val(oname);

        }
      });

      $("#today").focusin(function(event) {
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = $("#fromday").val()+$("#frommonth").val()+$("#fromyear").val();
        if (!Date.parseExact(startdate, "ddMMyyyy")) {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
      });

      $("#fromyear").blur(function(){
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = startday+startmonth+startyear;
        var enddate = Date.parseExact(startdate, "ddMMyyyy").add({days: -1, years: 1}).toString("ddMMyyyy");
        var endday = enddate[0]+enddate[1];
        var endmonth = enddate[2]+enddate[3];
        var endyear = enddate[4]+enddate[5]+enddate[6]+enddate[7];
        if (startday==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
        if (startmonth==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#frommonth").focus();
          $("#frommonth").select();
          return false;
        }
        if (startyear==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromyear").focus();
          $("#fromyear").select();
          return false;
        }

        $("#today").val(endday);
        $("#tomonth").val(endmonth);
        $("#toyear").val(endyear);
      });
      $("#toyear").keydown(function(event) {
          if (event.which==13) {
	      event.preventDefault();
          $(this).val(yearpad($(this).val(),4));
          $('#onlyaccradio').focus();
        }
      });

     $(".iib").keydown(function(event) {
          if (event.which==13) {
	      event.preventDefault();
          $('#btnsubmit').focus();
        }
     });

     $("#onlyaccradio").keydown(function(event) {
          if (event.which==38) {
	      event.preventDefault();
          $('#toyear').focus();
        }
     });

    
              $(document).off('change', '.iib').on('change', '.iib', function(event) {
                          if ($("#invinvsbillradio").is(":checked")) {
                          //  event.preventDefault();
                              invflag=1;
                              invsflag=1;
                              billflag=1;
                          }
                          if ($("#invsbillradio").is(":checked")) {
                            //event.preventDefault();
                              invflag=0;
                              invsflag=1;
                            billflag=1;
                            
                          }

                            if ($("#onlyinvsradio").is(":checked")) {
                            //  event.preventDefault();
                                invflag=0;
                                invsflag=1;
                              billflag=0;
                            }

                            if ($("#onlyaccradio").is(":checked")) {
                              //event.preventDefault();
                                invflag=0;
                                invsflag=0;
                              billflag=0;
                            }
              });
   
    
      $("#btnsubmit").click(function(event){
        event.preventDefault();
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = startday+startmonth+startyear;
        var endday = $("#today").val();
        var endmonth = $("#tomonth").val();
        var endyear = $("#toyear").val();
        var enddate = endday+endmonth+endyear;
        if ($.trim($("#orgname").val())=="") {
          $("#orgname-blank-alert").alert();
          $("#orgname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#orgname-blank-alert").hide();
          });
          $("#orgname").focus();
          return false;
        }

        if (startday==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
        if (startmonth==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#frommonth").focus();
          $("#frommonth").select();
          return false;
        }
        if (startyear==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromyear").focus();
          $("#fromyear").select();
          return false;
        }
        if (endday==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#today").focus();
          $("#today").select();
          return false;
        }
        if (endmonth==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#tomonth").focus();
          $("#tomonth").select();
          return false;
        }
        if (endyear==0)
        {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#toyear").focus();
          $("#toyear").select();
          return false;
        }

          if ($.trim($("#fromday").val())==""||$.trim($("#frommonth").val())==""||$.trim($("#fromyear").val())==""||$.trim($("#today").val())==""||$.trim($("#tomonth").val())==""||$.trim($("#toyear").val())=="") {
            $("#date-blank-alert").alert();
            $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#date-blank-alert").hide();
            });
            $("#fromday").focus();
            return false;
        }
        if (!Date.parseExact(startdate, "ddMMyyyy")) {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#fromday").focus();
          $("#fromday").select();
          return false;
        }
        if (!Date.parseExact(enddate, "ddMMyyyy")) {
          $("#date-improper-alert").alert();
          $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#date-improper-alert").hide();
          });
          $("#today").focus();
          $("#today").select();
          return false;
        }

        if (Date.parseExact(startdate,"ddMMyyyy").compareTo(Date.parseExact(enddate,"ddMMyyyy"))==1) {
          $("#compare-date-alert").alert();
          $("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#compare-date-alert").hide();
          });
          $('#today').focus().select();
          return false;
        }

        var orgname = $("#orgname").val().replace(/\s/g, "+");
        var orgtype = $("#orgtype option:selected").val().replace(/\s/g, "+");
        var fdate = $("#fromyear").val()+"-"+$("#frommonth").val()+"-"+$("#fromday").val();
        var tdate = $("#toyear").val()+"-"+$("#tomonth").val()+"-"+$("#today").val();
        var financialyears = fdate+tdate;
        var otype = $("#orgtype option:selected").val();
        var fadate = $("#fromday").val()+"-"+$("#frommonth").val()+"-"+$("#fromyear").val();
        var tadate = $("#today").val()+"-"+$("#tomonth").val()+"-"+$("#toyear").val();

	  console.log("csdhcvsdgh");
	   var vatorgstflag;
    var date1 = "2017-07-01";
    
    var gstdate = Date.parse(date1);
    
    var financialStart =Date.parse(fdate);
    var financialEnd = Date.parse(tdate);
    if (gstdate>financialStart && gstdate>financialEnd){
	console.log("22");
	$(".vat").show();
	$(".gst").hide();
	vatorgstflag=22;}
    else if(gstdate>financialStart && gstdate<=financialEnd) {
	console.log("29");
	$(".gst").show();
	$(".vat").show();
	vatorgstflag=29;}
    else if(gstdate<=financialStart && gstdate<=financialEnd){
	console.log("7");
	$(".gst").show();
	$(".vat").hide();
	vatorgstflag=7;}
     
	  if ($("#invinvsbillradio").is(":checked")) {
            invflag=1;
            invsflag=1;
            billflag=1;
        }
        if ($("#invsbillradio").is(":checked")) {
            invflag=0
            invsflag=1;
          billflag=1;
          console.log("rohini");
        }

          if ($("#onlyinvsradio").is(":checked")) {
              invflag=0;
              invsflag=1;
            billflag=0;
          }
          if ($("#onlyaccradio").is(":checked")) {
              invflag=0;
              invsflag=0;
            billflag=0;
          }

        sessionStorage.setItem('orgn', $("#orgname").val());
        sessionStorage.setItem('orgt', otype);
        sessionStorage.setItem('year1', fadate);
        sessionStorage.setItem('year2', tadate);
        sessionStorage.setItem('yyyymmddyear1', fdate );
        sessionStorage.setItem('yyyymmddyear2', tdate );
        sessionStorage.setItem('invflag', invflag );
        sessionStorage.setItem('invsflag', invsflag );
        sessionStorage.setItem('billflag', billflag );
        $.ajax({
          url: '/oexists',
          type: 'POST',
          datatype: 'json',
          data: {orgname:$("#orgname").val(),orgtype:orgtype,finstart:fdate,finend:tdate }
        })
        .done(function(resp) {
          if(resp["gkstatus"]==1)
          {

              $("#orgname-duplicate-alert").alert();
              $("#orgname-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#orgname-duplicate-alert").hide();
              });
              $("#orgname").focus();
              return false;

          }
          else
            {
		$("#createtorg").hide();
		$("#addorg").show();
          //$("#createorg").load("/createadmin?orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate+"&invflag="+invflag+"&invsflag="+invsflag+"&billflag="+billflag);
          }
          console.log("success");
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });



      });
    $("#onlyaccradio").click(function(event){
	$("#ledgerdiv").hide();
    });
    $("#invinvsbillradio").click(function(event) {
	$("#ledgerdiv").show();
    });
    $("#invsbillradio").click(function(event) {
        //event.preventDefault();
	$("#ledgerdiv").show();
    });
    $("#onlyinvsradio").click(function(event){
        //event.preventDefault();
	$("#ledgerdiv").show();
    });
    var otype = $("#orgtype option:selected").val();
    if (otype =="Profit Making"){
	$(".noprofit").hide();
    }

    if ($("#invinvsbillradio").is(":checked")) {
            invflag=1;
            invsflag=1;
            billflag=1;
        }
        if ($("#invsbillradio").is(":checked")) {
            invflag=0;
            invsflag=1;
          billflag=1;
        }
          if ($("#onlyinvsradio").is(":checked")) {
              invflag=0;
              invsflag=1;
            billflag=0;
          }
          if ($("#onlyaccradio").is(":checked")) {
              invflag=0;
              invsflag=0;
            billflag=0;
          }
    
        var orgname = $("#orgname").val().replace(/\s/g, "+");
        var orgtype = $("#orgtype option:selected").val().replace(/\s/g, "+");
        var fdate = $("#fromyear").val()+"-"+$("#frommonth").val()+"-"+$("#fromday").val();
        var tdate = $("#toyear").val()+"-"+$("#tomonth").val()+"-"+$("#today").val();
       
    //start
    
    $(".regdate").autotab('number');
    // '+' Button is attach only last record of gstin. 
    $("#gstintable tbody tr:last td:eq(2)").append('<div style="text-align:center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
    $(".fcradate").autotab('number');
    $('[data-toggle="popover"]').popover({
        html: true,
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-footer"<div class="form-group input-group input-group-sm"><div id="cessratediv"><input class="input-sm form-control cessrate" size="23"></div><span class="glyphicon glyphicon-plus input-group-addon" id="addcessrate"></span></div></div></div>'
    });
    $('[data-toggle="popover"]').on('shown.bs.popover', function(){
        $(".cessrate").eq(0).focus().select();
    });
    var cessrates = [];
    $('[data-toggle="popover"]').on('hide.bs.popover', function(){
        $(".cessrate").each(function(index){
	    cessrates.push($(this).val());
	});
    });
    function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
	return str;
    }
  }
  function yearpad (str, max) { //to add leading 20 or 200 in the year
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("200" + str, max) : str;
    }
    else if (str.length==2) {
      return str.length < max ? pad("20" + str, max) : str;
    }
    else{
	return str;
    }
  }

  $("#regday").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#regmonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#regyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  $("#fcraregday").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#fcraregmonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#fcraregyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

    var curindex = $(this).closest('tr').index();
var gstinstring = ""; // for cocatination of GSTIN.
    	for(var i = 0; i < $("#gstintable tbody tr").length; i++) {
	    var state = $("#gstintable tbody tr:eq("+i+") td:eq(0) select").attr("stateid");
	    $("#gstintable tbody tr:eq("+i+") td:eq(0) select option[stateid="+state+"]").prop("selected", true);
	
	    var gstinstr =$('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(0)').val();
	    $('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(0)').val(gstinstr.substring(0, 2));
	    $('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(1)').val(gstinstr.substring(2, 12));
	    $('#gstintable tbody tr:eq('+i+') td:eq(1) input:eq(2)').val(gstinstr.substring(12, 15));
	    $("#gstintable tbody tr:eq(" + i +") td:last").append('<div style="text-align:center;"><a href="#" class="state_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
	}
    
  if(sessionStorage.vatorgstflag == '22' ){
      $(".gstinfield").hide();
      $(".tinfield").show();
    } else {
      $(".gstinfield").show();
    }
    if($("#state").val() != "" ){
	$("#orgstate").val($("#state").val());}
 // $(".regdate").numeric({negative: false});
  //$(".fcradate").numeric({negative: false});

  if ($("#orgtype").val()=="Not For Profit")
  {
    $("#orgregno").focus().select();
  }
  else
  {
    $("#orgaddr").focus().select();
  }

    // Add GSTIN modal
    $('#addgstinmodal').on('shown.bs.modal', function() {
	$("#gstintable tbody tr:first td:eq(0) select").focus();
    });

    $(document).off("keydown",".gstrate").on("keydown",".gstrate",function(event){
	let curindex = $(".gstrate").index(this);
	if (event.which == 13) {
	    event.preventDefault();
	    $(".gstrate").eq(curindex + 1).focus().select();
	}
	else if (event.which == 38) {
	    event.preventDefault();
	    $(".gstrate").eq(curindex - 1).focus().select();
	}
    });
    // add bankdetails modal
    $('#addbankdel').on('shown.bs.modal', function() {
	//$("#banktable tbody tr:first td:eq(1) select").focus();
	$("#accnum").focus();
    });

$(document).off("keydown",".gstinstate").on("keydown",".gstinstate",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if (event.which==13) {
      event.preventDefault();
      if ($.trim($("#orgpan").val()) !="") {
	 $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:last').focus();
      }
      else {
	   $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').focus();
      }
  }
});

//Change event on GSTIN State
    $(document).off('change', '.gstinstate').on('change', '.gstinstate', function(event) {
	event.preventDefault();
	var curindex = $(this).closest('tr').index();
	var cusstatecode =  $('#gstintable tbody tr:eq('+curindex+') td:eq(0) select option:selected').attr("stateid");
	if (cusstatecode.length == 1){
	    cusstatecode = "0" + cusstatecode; 
	}
	$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val(cusstatecode); //for state code
	if ($('#orgpan').val() != ''){
	    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val($('#orgpan').val()).prop("disabled",true); //for pan
	}
	else {
	    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').prop("disabled",false);
	}
	
    });

    //Keydown event on gstin's panno
    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    var panno="";
    $(document).off("keydown", ".panno").on("keydown", ".panno", function(event) {
	var curindex = $(this).closest('tr').index();
	var previndex = curindex-1;
	panno = $(this).val();
	if (event.which == 13 || event.which ==9) {
	    event.preventDefault();
	    //Validation for PAN inside GSTIN.
	    if ((panno.length != 10 || !panno.match(regExp)) && panno != "") {
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$(this).focus().select();
	    }
	    else{
		$(this).next('input').focus().select();
		return false;
	    }
	}
    });

    $(document).off("change",".gstin").on("change",".gstin",function(event) {
	var curindex = $(this).closest('tr').index();
	gstinstring = $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val();
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#gstin-improper-modal").hide();
  		    $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').focus().select();
		});
  		return false;
            }
  }

    });

    //change event for bank details
    $("#bank_name").change(function(event) {
	event.preventDefault();
        if(event.which==9){
	if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())=="") {
	    $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
            $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
        }}
	else if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())=="") {
	     $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
	    });
	    $("#bank_name").focus();
            return false;
         } else {
	     $("#accnum").focus();
	 }
	});

      $("#branch_name").change(function(event){
      event.preventDefault();
	  if ($.trim($("#accnum").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
          }else if ($.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
            });
            $("#bank_name").focus();
	    return false;
             }
	  else if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())=="" ) {
            $("#branchname-improper-modal").alert();
            $("#branchname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
            $("#branchname-improper-modal").hide();
            });
            $("#branch_name").focus();
            return false;
        }
	  else{
	      $("#ifsc_code").focus();
	  }
	    });

    $("#ifsc_code").change(function(event){
      event.preventDefault();
	 if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())=="" && $.trim($("#ifsc_code").val())!="" ) {
            $("#both1-improper-modal").alert();
            $("#both1-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#both1-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
         }

          if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())!="" && $.trim($("#ifsc_code").val())=="" ) {
            $("#ifsc-improper-modal").alert();
            $("#ifsc-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
            $("#ifsc-improper-modal").hide();
            });
            $("#ifsc_code").focus();
            return false;
          }
	else{
	    $("#bankdel_done").focus();
	}
	    });

    //Click event for '+'(add button) which trigger keydown of 'gstin' field.
    $(document).off("click",".addbtn").on("click",".addbtn",function(event){	
	$(".gstin").trigger({type:"keydown",which:"13"});
    });
    
    $(document).off("keydown",".gstin").on("keydown",".gstin",function(event)
    {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
    var panno = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val();	
    var numberofstates = $('#gstintable tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length-1;
    gstinstring = $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val();	
  if (event.which==13) {
      event.preventDefault();
      if($('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(0)').val()=="" && $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').val()=="" && $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').val()==""){
	  $("#gstin_done").focus();
      }
      else if (curindex1 != ($("#gstintable tbody tr").length-1)) {
      $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else if ((panno.length != 10 || !panno.match(regExp)) && panno != "") {
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		});
		$('.panno').focus().select();
      }
      else {
	if(gstinstring != ''){
  	    if(gstinstring.length !=15){
  		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#gstin-improper-modal").hide();
  		    $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(2)').focus().select();
		});
  		return false;
            }
	}
	if (numberofstates > 0) {
	    $('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	    $('#gstintable tbody tr:eq('+ nextindex1 +') td:eq(1) input:eq(0)').val("");
	    $('#gstintable tbody tr:eq('+ curindex1 +') td:eq(2) span').hide(".addbtn");
	    //selected states are disabled when new row of gstin added.
	    for (let j = 0; j < curindex1 + 1; j++) {
		var selectedstate = $('#gstintable tbody tr:eq('+ j +') td:eq(0) select option:selected').attr("stateid");
                for (let i=j+1; i<=curindex1+1;i++){
                    $('#gstintable tbody tr:eq('+ i +') td:eq(0) select option[stateid='+selectedstate+']').prop('hidden', true).prop('disabled', true);
                }
            }
	    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select option[value=""]').prop('selected', true);
            $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
	}
	else {
            $("#gstin_done").focus();
	}
    }
  }
  else if(event.which==190 && event.shiftKey)
  {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex1>-1)
    {
      event.preventDefault();
      $('#gstintable tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
    }
  }
  else if (event.ctrlKey && event.which==188) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+curindex1+') td:eq(1) input:eq(1)').focus();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#gstintable tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
  }
});

    $(document).off("click",".state_del").on("click", ".state_del", function() {
	$(this).closest('tr').fadeOut(200, function(){
	    $(this).closest('tr').remove();//closest method gives the closest element specified
	    if($('#gstintable tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
		$('#gstintable tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	    }
	    if(!($('.addbtn').is(':visible'))){
		$('#gstintable tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
	    }
	    $('#gstintable tbody tr:last td:eq(0) select').focus().select();
	});
	$('#gstintable tbody tr:last td:eq(0) select').select();
    });
    //Keydown event start here
    $("#orgaddr").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgcity").focus().select();
    }
    });

     $("#orgregno").keydown(function(event) {
     if (event.which==13) {
	 event.preventDefault();
	 $("#orgfcrano").focus().select();
     }
     });

    $("#orgfcrano").keydown(function(event) {
     if (event.which==13) {
	 event.preventDefault();
	 $("#orgaddr").focus().select();
     }
     if (event.which==38) {
	 event.preventDefault();
	 $("#orgregno").focus().select();
     }
    });
    
    $("#orgcountry").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgpincode").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#orgstate").focus().select();
    }
    });
    
    $("#orgstate").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgcountry").focus().select();
    }
     if (event.which==38 && $("#add_state option:selected").index()==0)  {
          event.preventDefault();
          $("#orgcity").focus().select();
        }
  });

    $("#orgcity").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgstate").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgaddr").focus().select();
        }
    });

    $("#regday").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#regmonth").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgtelno").focus().select();
        }
    });

    $("#regmonth").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#regyear").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#regday").focus().select();
        }
    });

    $("#regyear").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#fcraregday").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#regmonth").focus().select();
        }
    });

    $("#fcraregday").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#fcraregmonth").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#regyear").focus().select();
        }
    });

    $("#fcraregmonth").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#fcraregyear").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#fcraregday").focus().select();
        }
    });

     $("#fcraregyear").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgwebsite").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#fcraregmonth").focus().select();
        }
     });

    //validation for done button of bankdetails field.
  //  $("#accnum").numeric();
    $(document).off("click","#bankdel_done").on("click","#bankdel_done",function(event){
	if($("#accnum").val()=="" && $("#branch_name").val()=="" && $("#bank_name").val()=="" && $("#ifsc_code").val()=="" )
	{
	    
	    $("#bankdel_done").click(function(event){		      
		$('#addbankdel').modal('hide');
	    });			      			     
	}
	else if($("#accnum").val()=="" || $("#branch_name").val()=="" || $("#bank_name").val()=="" || $("#ifsc_code").val()=="" ){
	    $("#bankdetails-improper-modal").alert();
		$("#bankdetails-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#bankdetails-improper-modal").hide();
		    $("#accnum").focus();
		});
	}


		if($("#accnum").val()!="" && $("#branch_name").val()!="" && $("#bank_name").val()!="" && $("#ifsc_code").val()!="" )
	{
	    
	    $("#bankdel_done").click(function(event){		      
		$('#addbankdel').modal('hide');
	    });			      			     
	}
	
    });

    // Validation for PAN
    $("#orgpan").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
	var txtpan = $(this).val();
	if ((txtpan.length != 10 || !txtpan.match(regExp)) && $.trim($("#orgpan").val())!="") {
	    $("#pan-incorrect-alert").alert();
	    $("#pan-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#pan-incorrect-alert").hide();
	    });
	    $("#orgpan").focus();
	    return false;
	}
	else {
	    if(sessionStorage.vatorgstflag == '22' || sessionStorage.vatorgstflag == '29' ){
		$("#orgmvat").focus();
	    } else {
		$("#orggstin").focus();
	    }
	}
    }
    if (event.which==38) {
      event.preventDefault();
      $("#orgfax").focus().select();
    }
  });
    var emailExp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //Expression to check proper email.
    var email="";
   $("#orgemail").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	email= $(this).val();
	if((!email.match(emailExp)) && email!=""){
	    $("#email-incorrect-alert").alert();
	    $("#email-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#email-incorrect-alert").hide();
		$("#orgemail").focus().select();
	    });
	}
	else{
	    $("#orgfax").focus().select();
	    return false;
	}
    }
     if (event.which==38)  {
         event.preventDefault();
	 $("#orgwebsite").focus();
        }
   });

    $("#orgtelno").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if ($("#orgtype").val()=="Not For Profit"){
		$("#regday").focus();
		
	} else {
	    $("#orgwebsite").focus().select();
	}
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgpincode").focus().select();
        }
    });

    $("#orgwebsite").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgemail").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
	 if ($("#orgtype").val()=="Not For Profit"){
		$("#fcraregyear").focus();
		
	    }
	    else {
		$("#orgtelno").focus().select();
	    }
        }
    });


    $("#orgpincode").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgtelno").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgcountry").focus().select();
        }
    });

     $("#orgfax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#orgpan").focus().select();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgemail").focus().select();
        }
     });

      //Keydown EVENT for BANK DETAILS

    $("#accnum").keydown(function(event) {
	if (event.which==13) {
	    $("#bank_name").focus().select();
	}
    });  


    $("#bank_name").keydown(function(event) {
	if (event.which==13) {
	    event.preventDefault();
           
         if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())!="") {
            $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
         }

         else if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())=="") {
            $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
            });
            $("#bank_name").focus();
            return false;
          }
	    
      $("#branch_name").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#accnum").focus().select();
	};
    });


    $("#branch_name").keydown(function(event) {
	if (event.which==13) {
	     if ($.trim($("#accnum").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#accno-improper-modal").alert();
            $("#accno-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#accno-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
          }

	     if ( $.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())!="" ) {
            $("#bankname-improper-modal").alert();
            $("#bankname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-improper-modal").hide();
            });
            $("#bank_name").focus();
            return false;
          }


	if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())=="" ) {
            $("#branchname-improper-modal").alert();
            $("#branchname-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#branchname-improper-modal").hide();
            });
            $("#branch_name").focus();
            return false;
          }    
	    
	    event.preventDefault();
      $("#ifsc_code").focus().select();
    }
	if (event.which==38) {
	 event.preventDefault();
	 $("#bank_name").focus().select();
	};
    });
    

    $("#ifsc_code").keydown(function(event) {
	if (event.which==13) {

         if ($.trim($("#accnum").val())=="" && $.trim($("#bank_name").val())=="" && $.trim($("#branch_name").val())=="" && $.trim($("#ifsc_code").val())!="" ) {
            $("#both1-improper-modal").alert();
            $("#both1-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#both1-improper-modal").hide();
            });
            $("#accnum").focus();
            return false;
         }

            if ($.trim($("#accnum").val())!="" && $.trim($("#bank_name").val())!="" && $.trim($("#branch_name").val())!="" && $.trim($("#ifsc_code").val())=="" ) {
            $("#ifsc-improper-modal").alert();
            $("#ifsc-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
              $("#ifsc-improper-modal").hide();
            });
            $("#ifsc_code").focus();
            return false;
            }
      event.preventDefault();
      $("#bankdel_done").focus().select();
    }
    if (event.which==38) {
	 event.preventDefault();
	 $("#branch_name").focus().select();
       };
    });
   
    $("#bankdel_done").keydown(function(event) {
	if (event.which==13) {
	    if($("#accnum").val()=="" && $("#branch_name").val()=="" && $("#bank_name").val()=="" && $("#ifsc_code").val()=="" )
	    {
		$("#bankdel_done").click(function(event){		      
		$('#addbankdel').modal('hide');
		});			      			     
	    }
	    else if($("#accnum").val()=="" || $("#branch_name").val()=="" || $("#bank_name").val()=="" || $("#ifsc_code").val()=="" ){
	    $("#bankdetails-improper-modal").alert();
		$("#bankdetails-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
                    $("#bankdetails-improper-modal").hide();
		    $("#accnum").focus();
		});
	    }
	    if($("#accnum").val()!="" && $("#branch_name").val()!="" && $("#bank_name").val()!="" && $("#ifsc_code").val()!="" )
	    {
		$("#bankdel_done").click(function(event){		      
		    $('#addbankdel').modal('hide');
		});			      			     
	    }
	}

	if (event.which==38) {
	    event.preventDefault();
	    $("#ifsc_code").focus().select();
	}});

    $("#orgmvat").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	$("#orgstax").focus();
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgpan").focus().select();
        }
    });

    $("#orgstax").keydown(function(event) {
    if (event.which==13) {
	event.preventDefault();
	if($("#vatorgstflag").val() == '29'){
	    $("#orggstin").focus();
	} else {
	    $("#submit").focus();
	}
      
    }
     if (event.which==38)  {
          event.preventDefault();
          $("#orgmvat").focus().select();
        }
    });

    // 'Esc' keyevent for shifting focus from GSTIN button to Save button.
    $("#orggstin").keydown(function(event) {
    if (event.which==27) {
	event.preventDefault();
	    $("#submit").focus(); 
    }
   
    });
    
  /**$('input:visible, textarea').keydown(function(event){
    var n =$('input:visible,textarea').length;
    var f= $('input:visible, textarea');
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
  });**/

  $("#reset").click(function()
  {
    $("#showeditorg").click();
  });

    //Validation for GSTIN on Done Button inside Add GSTIN.
    $("#gstin_done").click(function(event) {
	var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
	var curindex1 = $(this).index();
	var panno1= $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val();
	gstinstring = $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(0)').val() +$('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(1)').val() + $('#gstintable tbody tr:eq('+curindex+') td:eq(1) input:eq(2)').val();
	if((panno1.length != 10 || !panno1.match(regExp)) && panno1 !="" ) {
	    $("#gstin-improper-modal").alert();
	    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-modal").hide();
		$(".panno").focus();
	    });
	    return false;
	}
	else if(panno1 !="" && $(".gstin").val() ==""){
	    $("#gstin-improper-modal").alert();
	    $("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		$("#gstin-improper-modal").hide();
		$(".gstin").focus();
	    });
	    return false;
	}
	else if(gstinstring != ""){
	    if(gstinstring.length != 15){
		$("#gstin-improper-modal").alert();
		$("#gstin-improper-modal").fadeTo(2250, 500).slideUp(500, function(){
		    $("#gstin-improper-modal").hide();
		    $(".gstin").focus();
		});
		return false;
	    }
	}
        $('#addgstinmodal').modal('hide');	    
    });
    // Events for popover
    $(document).off("click", "#addcessrate").on("click", "#addcessrate", function(event){
	$("#cessratediv").append('<input class="input-sm form-control cessrate" size="23">');
	$(".cessrate:last").focus();
    });
    $(document).off("focus", ".cessrate").on("focus", ".cessrate", function(event){
	//$(this).numeric({"negative":false});
    });
    $(document).off("keydown", ".cessrate").on("keydown", ".cessrate", function(event){
	if (event.which == 13) {
	    event.preventDefault();
	    $("#cessratediv").append('<input class="input-sm form-control cessrate" size="23">');
	    $(".cessrate:last").focus(); 
	}
	if (event.which == 27) {
	    $('[data-toggle="popover"]').click();
	}
    });
    $(document).off("click", ".popover-content").on("click", ".popover-content", function(event){
	$('[data-toggle="popover"]').click();
    });
  $(document).off("click", "#submit").on("click", "#submit", function(event){
    event.preventDefault();
      $("#createadmin").show();
      $("#addorg").hide();
  });

    $(document).off("keyup").on("keyup", function(event) {
      if (event.which == 45) {
	event.preventDefault();
	    $("#submit").click();
      }
  });

    //end

    //start createuseradmin

    $("#username").focus();
  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";
  var yeardata = "Financial Year : " + styear + " to " + enyear;
  if(orgdata!=""||yeardata!="")
  {
  $("#ticker").show();
  $("#orgdata").html(orgdata);
  $("#yeardata").html(yeardata);
  }
$('input:not(:hidden),select').bind("keydown", function(e) {
  var n = $("input:not(:hidden),select").length;
  var f = $('input:not(:hidden),select');
  if (e.which == 13)
  {
    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      e.preventDefault();
      f[nextIndex].focus();}

    }
  });
  $('input:not(:hidden),select').bind("keydown", function(e) {
    var n = $("input:not(:hidden),select").length;
    var f = $('input:not(:hidden),select');
    if (e.which == 38)
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex > 0){
        e.preventDefault();
        f[prevIndex].focus();}

      }
    });
    $("#confirmpassword").blur(function(event) {
      if ($.trim($("#password").val())!=$.trim($("#confirmpassword").val())) {
        $("#checkpass-blank-alert").alert();
        $("#checkpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#checkpass-blank-alert").hide();
        });
        $("#password").focus();
        return false;
      }
    });

$("#loginform").submit(function(e)
{
  e.preventDefault();
  if ($.trim($("#username").val())=="") {
    $("#usrname-blank-alert").alert();
    $("#usrname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#usrname-blank-alert").hide();
    });
    $("#username").focus();
    return false;
  }
  if ($.trim($("#password").val())=="") {
    $("#pasword-blank-alert").alert();
    $("#pasword-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#pasword-blank-alert").hide();
    });
    $("#password").focus();
    return false;
  }
  if ($.trim($("#confirmpassword").val())=="") {
    $("#confpass-blank-alert").alert();
    $("#confpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#confpass-blank-alert").hide();
    });
    $("#confirmpassword").focus();
    return false;
  }
  if ($.trim($("#password").val())!=$.trim($("#confirmpassword").val())) {
    $("#checkpass-blank-alert").alert();
    $("#checkpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#checkpass-blank-alert").hide();
    });
    $("#confirmpassword").focus();
    return false;
  }
  if ($.trim($("#securityquestion").val())=="") {
    $("#secuque-blank-alert").alert();
    $("#secuque-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#secuque-blank-alert").hide();
    });
    $("#securityquestion").focus();
    return false;
  }
  if ($.trim($("#securityanswer").val())=="") {
    $("#secuans-blank-alert").alert();
    $("#secuans-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#secuans-blank-alert").hide();
    });
    $("#securityanswer").focus();
    return false;
  }
  $("#spinmodal").modal("show");
    $.ajax(
    {
    //alert("starting ajax");
    type: "POST",
    url: "/createorglogin",
    global: false,
    async: false,
    datatype: "json",
    data: $("#loginform").serialize(),
    success: function(resp)
    {
      if (resp['gkstatus']==0) {

        var gt = resp['gktoken'];

        sessionStorage.gktoken = gt;
        sessionStorage.gktheme = 'Default';
        sessionStorage.reload = 1;
        window.location="/showmainshell";
      }
      else if(resp['gkstatus']==3) {

        $("#createnav").click();
        $("#spinmodal").hide();
        $('.modal-backdrop').remove();
        $("#createorg").load("/createorg",setTimeout( function() {
          $("#orgname").focus();
        }, 500 ));
        $("#duplicate-org-alert").alert();
        $("#duplicate-org-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-org-alert").hide();
        });

      }
    }

    }
    );
}
);
    //end
});
