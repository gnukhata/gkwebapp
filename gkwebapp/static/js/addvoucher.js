/*
   Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
   Copyright (C) 2017 Digital Freedom Foundation & Accion Labs
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
   "Abhijith Balan" <abhijithb21@openmailbox.org.in>
   "Rohini Baraskar" <robaraskar@gmail.com>
   "Bhavesh Bhawadhane" <bbhavesh07@gmail.com>
   "Prajkta Patkar" <prajkta.patkar007@gmail.com>
   "Navin Karkera" <navin@openmailbox.org>
   "Sachin Patil" <sachin619patil@rediffmail.com>
   "Ishan Masdekar" <imasdekar@dff.org.in>
 */

/*
   Events are mostly associated with the classes.
   List of classes that we have used.
   1. dramt and cramt are for the dr and cr amount boxes respectively.
   2. accs is for the accounts select boxes.
   3. crdr for the cr dr select box, i.e for the first select box in the row
   4. vdate for the date input boxes.
   Events which have a selector which starts with a . are associated to a class, For eg. $(".crdr")
   Events which have a selector which starts with a # are associated to an id, For eg. $("#vno")

   Events are attached to dynamically created elements using document on method.
   Document off is used to remove an already attached event to an element, so as to make sure that an event is fired only once.
 */
$(document).ready(function() {
  $("#msspinmodal").modal("hide");  //Hides a spinner used to indicate that the page is getting loaded.
  $(".modal-backdrop").remove();  //Removes any backdrop of the spinner.
  if (sessionStorage.invsflag==0)
  {
    $(".invhide").hide(); //Hides list of invoices in Receipt, Payment, Sale and Purchase vouchers when invoice flag is set to zero.
  }
  else
  {
    $(".invhide").show(); //Hides list of invoices in Receipt, Payment, Sale and Purchase vouchers when invoice flag is set to zero.
  }
  if (sessionStorage.orgt=="Profit Making") {
    $("label[for='project']").html("C<u>o</u>st Center:");  //Label for select combo of projects is set as Cost Center
  }
  $("#vno").focus().select();
  $('.vdate').autotab('number');    //autotab is a library for automatically switching the focus to next input when max allowed characters are filled.
  $('.dramt').numeric({ negative: false });   //numeric is a library used for restricting the user to input only numbers and decimal inside a text box
  $('.cramt').numeric({ negative: false });
  var drsum = 0;    //drsum and crsum will have the total cr and dr amount
  var crsum = 0;
  var diff = 0;     //diff containns the difference of drsum and crsum
  var outfocus = false;
  var curfocusrow = -1;
  var accpopupindex = -1;
  var curselectlength = -1;
  var percentwid = 100*(($("table").width()-12)/$("table").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  $('.table-fixedheader tfoot').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-300)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g);
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");

  function getBalance( accountcode, calculateTo ){
      var bal = '';
      $.ajax({
        url: '/showvoucher?type=getclosingbal',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"accountcode": accountcode, "calculateto" : calculateTo, "financialstart" : sessionStorage.yyyymmddyear1},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        if (resp["gkstatus"]==0) {
          bal= resp["gkresult"];
        }
        else {
          bal= '';
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      return bal;
  };
    
$(document).off("focusout",".accs, .cramt, .dramt").on("focusout", ".accs, .cramt, .dramt", function() {
    curfocusrow = $(this).closest('tr').index();
});
$(document).off("change","#invsel").on('change', '#invsel', function(event) {
  event.preventDefault();
    /* Act on the event */
    var inv = $("#invsel option:selected").attr("total");
    var invbalance = $("#invsel option:selected").attr("balance");
  if ($.trim(inv)!="")
  {
      $("#invtotal").val(parseFloat(inv).toFixed(2));
      $("#invbalance").val(parseFloat(invbalance).toFixed(2));
  }
  else
  {
      $("#invtotal").val(parseFloat(0).toFixed(2));
      $("#invbalance").val(parseFloat(0).toFixed(2));
      inv = 0;
      invbalance = 0;
  }
  var value = $('#invsel option:selected').attr("customername");
  $(".dramt:first").val(parseFloat(inv).toFixed(2));
    $(".cramt:eq(1)").val(parseFloat(inv).toFixed(2));
    if(value){
	if (($('#vtype').val()=="sales" || $('#vtype').val()=="payment") && sessionStorage.invsflag ==1)
	{
	    $('.accs:first option').each(function(index) {
		if ($(this).text() == value) {
		    $(this).prop("selected", true);
		}
	    });
	}
	if (($('#vtype').val()=="purchase" || $('#vtype').val()=="receipt") && sessionStorage.invsflag ==1)
	{
	    $('.accs:eq(1) option').each(function(index) {
		if ($(this).text() == value) {
		    $(this).prop("selected", true);
		}
	    });
  }
    }

});

  var putcr = true;
  //Calculates the total dr and cr amout when a change event is fired.
  $(document).off("change",".dramt").on("change", ".dramt", function() {
    drsum=0;
    // each function loops the widgets that have dramt class in it
    $(".dramt").each(function(){
      drsum += +$(this).val();
      // jquery enables us to select specific elements inside a table easily like below.
      $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });
    if(putcr){
      $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(drsum).toFixed(2));
      putcr = false;
    }
  });
  $(document).off("change",".cramt").on("change", ".cramt", function() {
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });


  //Deletes a row from the table and recalculates the total cr and dr amount
  $(document).off("click",".del").on("click", ".del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();   //closest method gives the closest element specified
      drsum=0;
      crsum=0;
      $(".dramt").each(function(){
        drsum += +$(this).val();
        $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
      });
      $(".cramt").each(function(){
        crsum += +$(this).val();
        $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
      });
      $('tbody tr:last input:enabled').focus().select();
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
  function yearpad (str, max) {
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
  //Formats the number on focusout
  $(document).off("focusout",".dramt").on("focusout",".dramt",function(event)
  {
    if ($.trim($(this).val())=="" || $.trim($(this).val())==".") {
      $(this).val("0.00");
    }
    else{
      $(this).val((parseFloat($(this).val()).toFixed(2)));
    }
  });
  $("#vdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#vmonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#vyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
    if(!Date.parseExact($("#vdate").val()+$("#vmonth").val()+$("#vyear").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $("#postdate-alert").hide();
      $('#vdate').focus().select();
      return false;
    }
      var curdate = Date.parseExact($("#vyear").val()+$("#vmonth").val()+$("#vdate").val(), "yyyyMMdd");
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $("#postdate-alert").hide();
      $('#vdate').focus().select();
      return false;
    }
    if (Date.today().compareTo(curdate)==-1) {

      $("#postdate-alert").alert();
      $("#postdate-alert").show();
    }
    else {
      $("#postdate-alert").hide();
    }

          if (details.invid!="")
    	     {

              if (Date.parseExact($("#invsel option:selected").attr("invdate"), "dd-MM-yyyy").compareTo(curdate)==1) {
                $("#inv-date-alert").alert();
                $("#inv-date-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#inv-date-alert").hide();
                });
                $('#vdate').focus().select();
                return false;
              }
            }

  });

  $(document).off("focusout",".cramt").on("focusout",".cramt",function(event)
  {
    if ($(this).val()=="" || $.trim($(this).val())==".") {
      $(this).val("0.00");
    }
    else{
      $(this).val((parseFloat($(this).val()).toFixed(2)));
    }
  });
  var navflag;

  $('#vno').keydown(function(event) {
    if(event.which==13 && $('#vno').val()!=""){
	navflag =1;
	event.preventDefault();
      if ($("#invsel").length > 0)
      {
        $("#invsel").focus();
      }
      else
      {
        $('#vdate').focus().select();
      }

    }
    if (event.which==190 && event.ctrlKey) {
      $("#vdate").focus().select();
      event.preventDefault();
    }
  });

  $('#vdate').keyup(function(event) {
    if (navflag==1) {
      navflag=0;
      return false;

    }
    else{
    if(event.which==13 && $('#vdate').val()!=""){
      $('#vmonth').select().focus();
    }
  }
    if (event.which==38) {
      $("#vno").select().focus();
    }
  });
  $('#vdate').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vno').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vmonth').focus().select();
      event.preventDefault();
    }
  });

  $('#vmonth').keyup(function(event) {
    if(event.which==13 && $('#vmonth').val()!=""){
      event.preventDefault();
      $('#vyear').focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#vdate").select().focus();
    }
  });
  $('#vmonth').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vdate').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vyear').focus();
      event.preventDefault();
    }
  });

  $("#invsel").keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vno').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vdate').focus().select();
      event.preventDefault();
    }
    if (event.which==13) {
      event.preventDefault();
      $('#vdate').focus().select();
    }
  });



  $('#vyear').keyup(function(event) {
    if(event.which==13 && $('#vyear').val()!=""){
      $('#vtable tbody tr:first select:enabled').focus();
      event.preventDefault();

    }
    if (event.which==38) {
      $("#vmonth").select().focus();
    }
    if (event.which==40) {
      $("#vtable tbody tr:first select:enabled)").select().focus();
    }
  });
  $('#vyear').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vmonth').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {

  event.preventDefault();
        $('#vtable tbody tr:first select:enabled').focus();

    }
  });


  $('#project').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#narration').focus().select();

      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#save').focus().select();
      event.preventDefault();
    }
    if (event.which==13) {
      event.preventDefault();
    }
  });
  $('#narration').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vtable tbody tr:last input:enabled').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#project').focus();
      event.preventDefault();
    }
    if (event.which==38) {
      $('#vtable tbody tr:last input:enabled').focus().select();
      event.preventDefault();
    }
    if (event.which==13 && $('#project').val()== undefined){
        if($("#instrumentbtn").is(":hidden"))
        {
          event.preventDefault();
          $('#save').click();
        }
        else {
          event.preventDefault();
          $("#instrumentbtn").focus();
        }

      }
  });
    var details = {};
  $('#narration').keyup(function(event) {
    if (details.projectcode!="" && event.which==13) {

        $('#project').focus();
      event.preventDefault();
    }

  });


  $('#save').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#project').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#reset').focus();
      event.preventDefault();
    }
  });
  $('#reset').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#save').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#popup').focus();
      event.preventDefault();
    }
  });
  $('#popup').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#reset').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vno').focus();
      event.preventDefault();
    }
  });
  $('#save').keyup(function(event) {
    if (event.which==39 ) {
      $('#reset').focus();
      event.preventDefault();
    }
    if (event.which==37 || event.which==38) {
      $('#narration').focus().select();
      event.preventDefault();
    }
  });
  $('#reset').keyup(function(event) {
    if (event.which==39 ) {
      $('#popup').focus();
      event.preventDefault();
    }
    if (event.which==37 || event.which==38) {
      $('#save').focus().select();
      event.preventDefault();
    }
  });
  $('#popup').keyup(function(event) {
    if (event.which==39 ) {
      $('#vno').focus().select();
      event.preventDefault();
    }
    if (event.which==37 || event.which==38) {
      $('#reset').focus();
      event.preventDefault();
    }
  });


  $('#project').keyup(function(event) {
    if(event.which==13){
      if ($('#drtotal').val()!=$('#crtotal').val()) {
        outfocus = true;
      }
      var allow = true;
      $("#vtable tbody tr").each(function() {
        var accountcode = $(".accs", this).val();
        var ccount=0;
        $("#vtable tbody tr").each(function() {
          if(accountcode==$(".accs", this).val()){
            ccount =ccount +1;
            if (ccount==2) {
              let accountindex = $(this).index();
            }
          }
        });
        if (ccount>1) {
          allow= false;
          return false;
        }
      });

      if(!allow){
        outfocus= true;
      }
      $('#save').click();
      event.preventDefault();
    }
    if (event.which==38) {
      $("#narration").select().focus();
      event.preventDefault();
    }
  });
  //This event fires when the crdr select box option is changed
  $(document).off("change",".crdr").on("change",".crdr",function(event)
  {
    var curindex = $(this).closest('tr').index(); // gets the current index of the row

    var crdrchgamt = $('#vtable tbody tr:eq('+curindex+') input:enabled').val();
    $('#vtable tbody tr:eq('+curindex+') input:enabled').val(""); // blanks out the text box which is enabled in the current row.
    $('#vtable tbody tr:eq('+curindex+') input:disabled').val(crdrchgamt); // sets the text of the text box to 0.00 which is disabled in the current row.
    $('#vtable tbody tr:eq('+curindex+') input').prop('disabled', function(i, v) { return !v; }); // toggles the property of the input boxes, i.e if the the box is enabled, it will be changed to disabled and vice versa.

    // the following lines will get the accounts depending on the type of the voucher and the current value of the crdr select box.
    if($(this).val()=="Cr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#vtype').val(),"side":"Cr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty(); // emptying the accounts select box.
          for (i in accs ) {
            $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>'); // add the accounts to the select box
          }
        }
      });
    }
    if($(this).val()=="Dr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#vtype').val(),"side":"Dr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
          }
        }
      });
    }
    // When the crdr select box value is changed, the amount of that row also changes so its necessary to recalculate the total cr dr amounts
    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
    });
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });

    //Everytime an account is selected its balance is checked and displayed.
    $(document).off("change",".accs").on("change",".accs",function(event){
    let curindex = $(this).closest('tr').index();
    let curacccode = $('#vtable tbody tr:eq('+curindex+') td:eq(1) select option:selected').val();
    let caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
    $('#vtable tbody tr:eq('+curindex+') td:eq(2) input').val(getBalance(curacccode, caldata)); // Function that returns balance is called.
    });
    $(".accs").change(); //Change event is triggered so that balance is displayed when the page is loaded.
    
    $(document).off("keyup",".accs").on("keyup",".accs",function(event){
    var curindex = $(this).closest('tr').index();
    if(event.which==13 && !outfocus)
    {
      if ($(this).val()==null) {
        return false;
      }
      curindex = $(this).closest('tr').index();
      $('#vtable tbody tr:eq('+curindex+') input:enabled').select().focus(); // focus shifts to the enabled amount box when one hits enter on the accounts select box.
    }
    if (event.which==32) {
      accpopupindex = $(this).closest('tr').index();
	curselectlength = $(this).length;
      $("#popup").click();
    }
   if (event.which==13 && outfocus) {
      outfocus = false;
    }
  });
  $(document).off("keyup",".crdr").on("keyup",".crdr",function(event){
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').focus(); // focus shifts to the enabled amount box when one hits enter on the accounts select box.
    }
  });
  $(document).off("keydown",".accs").on("keydown",".accs",function(event){
    let curindex = $(this).closest('tr').index();
    let nextindex = curindex+1;
    let previndex = curindex-1;
    if (event.which==32 || event.which==13) {
      event.preventDefault();
    }
    if(event.which==190 && event.shiftKey)
    {
      $('#vtable tbody tr:eq('+nextindex+') td:eq(1) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vtable tbody tr:eq('+previndex+') td:eq(1) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        if (($('#vtype').val()=="sales" || $('#vtype').val()=="purchase") && sessionStorage.invsflag ==1)
        {
          $("#invsel").focus();
        }
        else
        {
          $("#vyear").focus();

        }
      }
    }
    if (event.which==188 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+curindex+') td:eq(0) select').focus();
      event.preventDefault();
      if (curindex==0) {
        event.preventDefault();
        if (($('#vtype').val()=="sales" || $('#vtype').val()=="purchase") && sessionStorage.invsflag ==1)
        {
          $("#invsel").focus();
        }
        else
        {
          $("#vyear").focus();

        }
      }
      if(curindex==1)
      {
        event.preventDefault();
        $('#vtable tbody tr:eq('+previndex+') input:enabled').focus().select();
      }
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+curindex+') input:enabled').focus().select();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".crdr").on("keydown",".crdr",function(event){
    let curindex = $(this).closest('tr').index();
    let nextindex = curindex+1;
    let previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      $('#vtable tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vtable tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
    }
    if (event.which==13) {
      event.preventDefault();
    }
    if (event.which==188 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+previndex+') input:enabled').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".cramt").on("keydown",".cramt",function(event){
    let curindex = $(this).closest('tr').index();
    let lastindex = $("#vtable tbody tr:last").index();
    let nextindex = curindex+1;
    let previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#vtable tbody tr:eq('+nextindex+') input:enabled').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vtable tbody tr:eq('+previndex+') input:enabled').focus().select();
      }
    }
    if (event.which==188 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+nextindex+') select:enabled:first').focus();
      event.preventDefault();
      if (curindex==lastindex) {
        $("#narration").focus();
      }
    }
  });
  $(document).off("keydown",".dramt").on("keydown",".dramt",function(event){
    let curindex = $(this).closest('tr').index();
    let nextindex = curindex+1;
    let previndex = curindex-1;
    //


    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#vtable tbody tr:eq('+nextindex+') input:enabled').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vtable tbody tr:eq('+previndex+') input:enabled').focus().select();
      }
    }
    if (event.which==188 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vtable tbody tr:eq('+nextindex+') select:enabled:first').focus();
      event.preventDefault();
      /*if (curindex==lastindex) {
        $("#narration").focus();
      }*/
    }
  });

  /*
  The following events are the backbone of the voucher functionality.
  When one hits enter on an dr or cr amount text box,
  the following code checks whether this row is the last row or not.
  If it is not the last row, it will check next row's amount box.
  If the amount box in the next row is empty or 0 then the diff will be inserted into the text box.
  If the amount box already has a value then only the focus is shifted to it.
  If it is the last row then a new row is added depending on the diff, if dr greater than cr than a cr row is added and vice versa.
  If the total cr dr amounts tally then the focus is shifted to project select box.
  */
  $(document).off("keyup",".dramt").on("keyup",".dramt",function(event)
  {
    if(event.which==13 && !outfocus)
    {
      event.preventDefault();
      drsum=0;
      $(".dramt").each(function(){
        drsum += +$(this).val();
        $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
      });
      crsum=0;
      $(".cramt").each(function(){
        crsum += +$(this).val();
        $('#vtable tfoot tr:last td:eq(3) input').val(parseFloat(crsum).toFixed(2));
      });
      var curindex = $(this).closest('tr').index();
      if($('#vtable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()==0){
        return false;
      }
	var lastindex = $('#vtable tbody tr:last').index();
	var nxtindex = curindex+1;
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('#vtable tfoot tr:last td:eq(3) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#narration").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td class="col-xs-1">'+
              '<td><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(4) input:enabled').val(parseFloat(diff).toFixed(2));
              var curacccode = $('#vtable tbody tr:last td:eq(1) select option:selected').val();
              var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
              $('#vtable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
              crsum=0; // cr total is recalculated since a cr row is added.
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
            }
          });

        }

      }
      else if(drsum < crsum)
      {
        diff=crsum-drsum;
        if(curindex<lastindex)
        {
            let nxtindex = curindex+1;
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#narration").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              var curacccode = $('#vtable tbody tr:last td:eq(1) select option:selected').val();
              var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
              $('#vtable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
              });
            }
          });

        }

      }
      else {
        var index = 0;
        var allow = true;
        $(".accs").each(function() {
          if ($(this).val()==null) {
            allow = false;
            index = $(this).closest('tr').index();
          }
        });
        if (!allow) {
          $("#vtable tbody tr:eq("+index+") td:eq(1) select").focus();
          $("#account-blank-alert").alert();
          $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#account-blank-alert").hide();
          });
          return false;
        }
        $("#narration").focus();
      }
      curindex=null;
      lastindex=null;
       $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
    }
    if (event.which==13 && outfocus) {
      outfocus=false;
    }
  });

  $(document).off("keyup",".cramt").on("keyup",".cramt",function(event)
  {
    if(event.which==13 && !outfocus)
    {
      drsum=0;
      $(".dramt").each(function(){
        drsum += +$(this).val();
        $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
      });
      crsum=0;
      $(".cramt").each(function(){
        crsum += +$(this).val();
        $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
      });
	var curindex = $(this).closest('tr').index();
	var nxtindex = curindex+1;
      if($('#vtable tbody tr:eq('+curindex+') td:eq(4) input:enabled').val()=="" || $('#vtable tbody tr:eq('+curindex+') td:eq(4) input:enabled').val()==0){
        return false;
      }
      var lastindex = $('#vtable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()==0){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#narration").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(4) input:enabled').val(parseFloat(diff).toFixed(2));
              var curacccode = $('#vtable tbody tr:last td:eq(1) select option:selected').val();
              var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
              $('#vtable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
              crsum=0;
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('#vtable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
              });
            }
          });

        }

      }
      else if(drsum < crsum)
      {
        diff=crsum-drsum;
        if(curindex<lastindex)
        {
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(diff.toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#narration").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              var curacccode = $('#vtable tbody tr:last td:eq(1) select option:selected').val();
              var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
              $('#vtable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('#vtable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
              });
            }
          });
        }

      }
      else {
        var index = 0;
        var allow = true;
        $(".accs").each(function() {
          if ($(this).val()==null) {
            allow = false;
            index = $(this).closest('tr').index();
          }
        });
        if (!allow) {
          $("#vtable tbody tr:eq("+index+") td:eq(1) select").focus();
          $("#account-blank-alert").alert();
          $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#account-blank-alert").hide();
          });
          return false;
        }
        $("#narration").focus();
      }
    }
    if (event.which==13 && outfocus) {
      outfocus=false;
    }
  });
  /*
  In this voucher form we are not using the form submit functionality since there is no need.
  When one clicks on the save button the validations are done and the voucher is saved.
  */
  $("#save").keypress(function(event) {
    if (event.which==13) {
      if ($('#drtotal').val()!=$('#crtotal').val()) {
        outfocus = true;
      }
      var allow = true;
      $("#vtable tbody tr").each(function() {
        var accountcode = $(".accs", this).val();
        var ccount=0;
        $("#vtable tbody tr").each(function() {
          if(accountcode==$(".accs", this).val()){
            ccount =ccount +1;
            if (ccount==2) {
              let accountindex = $(this).index();
            }
          }
        });
        if (ccount>1) {
          allow= false;
          return false;
        }
      });

      if(!allow){
        outfocus= true;
      }
    }
  });
  //Actions that happen after 'Save' button is clicked.
  /*
     Once Receipt/Payment voucher is saved the user is prompted with a popup asking if he wants to continue to bill wise accounting.
     When they choose yes the account code of Customer/Supplier is sent to retrieve details about outstanding bills.
  */
  $('#save').click(function(event) {
    var allow = true;
    var amountindex = 0;
    var accallow = true;
    var accountindex=0;
    var customername = "";
    var customercode = "";
    var numberofcustomers = 0;
      $(".crdr").each(function() {
	  var curindex = $(this).closest('tr').index(); //Index helps in identifying the rows.
      //Each row with Credit/Debit entry is scanned
	if ($(this).val()=="Cr") {
	//This block is for Credit entries.
	if ($("#vouchertype").val() == "receipt") {
	  //This block is for Receipt voucher.
	  //In the AJAX request below, account details are fetched by sending account code.
	  $.ajax({
	    url: '/getaccdetails',
	    type: 'POST',
	    async: false,
	    dataType: 'json',
	    data: {"accountcode": $("#vtable tbody tr:eq("+curindex+") td:eq(1) select option:selected").val()},
	    beforeSend: function(xhr)
	    {
	      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	    },
	    success: function(jsonObj) {
	      var accountdetails = jsonObj["gkresult"];
	      //The block below checks if an account involved in a Credit entry is a customer and number of customers is incremented if yes.
	      if (accountdetails["groupname"] == "Current Assets" && accountdetails["subgroupname"] == "Sundry Debtors") {
		customername = accountdetails["accountname"];
		customercode = accountdetails["accountcode"];
		numberofcustomers = numberofcustomers + 1;
		sessionStorage.customeramount = $("#vtable tbody tr:eq("+curindex+") td:eq(4) input").val(); //Credit amount is saved in session storage.
		sessionStorage.amounttitle = "Amount Received: ";
	      }
	    }
	  });
	}
      }
      if ($(this).val()=="Dr") {
	//This block is for Debit entries. Refer above block for Credit entries for documentation.
	if ($("#vouchertype").val() == "payment") {
	  $.ajax({
	    url: '/getaccdetails',
	    type: 'POST',
	    async: false,
	    dataType: 'json',
	    data: {"accountcode": $("#vtable tbody tr:eq("+curindex+") td:eq(1) select option:selected").val()},
	    beforeSend: function(xhr)
	    {
	      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	    },
	    success: function(jsonObj) {
	      var accountdetails = jsonObj["gkresult"];
	      //The block below checks if an account involved in a Debit entry is a supplier and number of suppliers is incremented if yes.
	      if (accountdetails["groupname"] == "Current Liabilities" && accountdetails["subgroupname"] == "Sundry Creditors for Purchase") {
		customername = accountdetails["accountname"];
		customercode = accountdetails["accountcode"];
		numberofcustomers = numberofcustomers + 1;
		sessionStorage.customeramount = $("#vtable tbody tr:eq("+curindex+") td:eq(3) input").val();
		sessionStorage.amounttitle = "Amount Paid: ";
	      }
	    }
	  });
	}
      }
    });
    //There should be only one customer/supplier in a Receipt/Payment voucher .
    if (numberofcustomers == 1) {
      sessionStorage.voucherdate = $("#vdate").val()+$("#vmonth").val()+$("#vyear").val();
      sessionStorage.customeraccname = customername;
      sessionStorage.customeracccode = customercode;
    }
    //Alert is displayed when there are more than one customer/supplier.
    if (numberofcustomers > 1) {
      $("#vtable tbody tr:last td:eq(1) select").focus();
      $("#customer-more-alert").alert();
      $("#customer-more-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#customer-more-alert").hide();
      });
      return false;
    }
    // Check if voucher no. is blank and if it is then show an alert
    if ($('#vno').val()=="") {
      $("#vno-alert").alert();
      $("#vno-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vno-alert").hide();
      });
      $('#vno').focus().select();
      return false;
    }
    // Check if date fields are blank and if it is then show an alert
    if ($('#vdate').val()=="" || $('#vmonth').val()=="" || $('#vyear').val()==""||$('#vdate').val()==0 || $('#vmonth').val()==0 || $('#vyear').val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#vdate').focus().select();
      return false;
    }
    if(!Date.parseExact($("#vdate").val()+$("#vmonth").val()+$("#vyear").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#vdate').focus().select();
      return false;
    }
      var curdate = Date.parseExact($("#vyear").val()+$("#vmonth").val()+$("#vdate").val(), "yyyyMMdd");
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#vdate').focus().select();
      return false;
    }
    $("#vtable tbody tr").each(function() { //loop for the rows of the table body
      if ($(".cramt", this).val()==0 && $(".dramt", this).val()=="" || $(".cramt", this).val()=="" && $(".dramt", this).val()==0 ) { //checking whether a row has no amount.
        allow= false;
        amountindex = $(this).closest('tr').index();
      }
      if ($(".accs", this).val()==null) {
        accallow = false;
        accountindex = $(this).closest('tr').index();
      }
    });
    if (!accallow) {
      $("#vtable tbody tr:eq("+accountindex+") td:eq(1) select").focus();
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      return false;
    }
    if(!allow){
      $("#vtable tbody tr:eq("+amountindex+") input:enabled").focus().select();
      $("#vtable tbody tr:eq("+amountindex+") input:enabled").select();
      $("#zerorow-alert").alert();
      $("#zerorow-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#zerorow-alert").hide();
      });
      return false;
    }
    // Check if the total cr dr amounts tally, if it doesn't then show an alert.
    if ($('#drtotal').val()!=$('#crtotal').val()) {
      $("#balance-alert").alert();
      $("#balance-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#balance-alert").hide();
      });
      $('#vtable tbody tr:last input:enabled').focus().select();
      return false;
    }
    // Check if voucher amount is zero and if it is then show an alert.
    if ($('#drtotal').val()==0) {
      $("#zero-alert").alert();
      $("#zero-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#zero-alert").hide();
      });
      $("#vtable tbody tr:first input:enabled").focus().select();
      return false;
    }
    // Check whether an account is repeated, and if it does then set the allow flag to false.
    $("#vtable tbody tr").each(function() {
      var accountcode = $(".accs", this).val();
      var ccount=0;
      $("#vtable tbody tr").each(function() {
        if(accountcode==$(".accs", this).val()){
          ccount =ccount +1;
          if (ccount==2) {
            accountindex = $(this).index();
          }
        }
      });
      if (ccount>1) {
        allow= false;
        return false;
      }
    });

    if(!allow){
      $("#accs-alert").alert();
      $("#accs-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#accs-alert").hide();
      });
      $("#vtable tbody tr:eq("+accountindex+") td:eq(1) select").focus();
      return false;
    }

    var output = [];  // This is an array which will contain dictionaries representing rows of the table.
    $("#vtable tbody tr").each(function() { //loop for the rows of the table body
      var obj = {};
      obj.side=$('.crdr',this).val();
      obj.accountcode = $(".accs", this).val();
      obj.cramount = $(".cramt", this).val();
      obj.dramount = $(".dramt", this).val();
      output.push(obj);
    });
      var vtotal=0;
	$(".cramt").each(function(){
          vtotal += +$(this).val();
	});
      var details = {}; // dictionay containing details other than the table values.
    details.vno=$('#vno').val();
    details.vdate=$('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
    details.projectcode=$('#project').val();

      if ($('#project').length) {
        details.projectcode=$('#project').val();
      } // returns 1
      else {
          details.projectcode="";
      }

    details.narration=$.trim($('#narration').val());
    details.vtype=$('#vtype').val();
    var form_data = new FormData();
      var files = $("#my-file-selector")[0].files;
    var filelist = [];
    for (var i = 0; i < files.length; i++) {
	form_data.append("file"+i,files[i]);
    }
    if (($('#vtype').val()=="sales" || $('#vtype').val()=="purchase"))
      {
	if ($("#invsel").length > 0) {
	  details.invid = $("#invsel option:selected").val();
	  var invoicetotal= $("#invsel option:selected").attr("total");
      }
      else {
	details.invid = "";
      }

      if (details.invid!="")
	     {

          if (Date.parseExact($("#invsel option:selected").attr("invdate"), "dd-MM-yyyy").compareTo(curdate)==1) {
            $("#inv-date-alert").alert();
            $("#inv-date-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#inv-date-alert").hide();
            });
            $('#vdate').focus().select();
            return false;
          }

	  if (vtotal>invoicetotal)
	    {
              $('#vtable tbody tr:first td:eq(1) input').focus();
              $('#vtable tbody tr:first td:eq(1) input').select();
              $("#invoicebalance-alert").alert();
              $("#invoicebalance-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#invoicebalance-alert").hide();
              });
              $('#vtable tbody tr:first input:enabled').focus().select();
              return false;
	    }
	}
    }
    else
      {
	details.invid="" ;
      }

      details.instrumentno="";
      //details.instrumentdate="";
      if($("#instrumentno").val())
      {
        details.instrumentno=$("#instrumentno").val();
        if(!$("#bankname").val()){
          $("#bankdetails-alert").show();
          $("#bankdetails-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bankdetails-alert").hide();
          });
          $('#instrumentbtn').focus().select();
          return false;

        }
        if(!$("#branchname").val()){
          $("#bankdetails-alert").show();
          $("#bankdetails-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bankdetails-alert").hide();
          });
          $('#instrumentbtn').focus().select();
          return false;

        }
        let instrumentdate1=Date.parseExact($("#instrument_date").val()+$("#instrument_month").val()+$("#instrument_year").val(), "ddMMyyyy");

        if(!instrumentdate1){
          $("#bankdetails-alert").show();
          $("#bankdetails-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#bankdetails-alert").hide();
          });

          $('#instrumentbtn').focus().select();
          return false;
        }
        details.bankname=$("#bankname").val();
        details.branchname=$("#branchname").val();
        let instrdate=$("#instrument_year").val()+'-'+$("#instrument_month").val()+'-'+$("#instrument_date").val();
        details.instrumentdate=instrdate;
      }
    form_data.append("vdetails",JSON.stringify(details));
      form_data.append("transactions",JSON.stringify(output));
      //In case of Receipt/Payment vouchers when an invoice is selected Amount Paid is automatically adjusted.
      if (($("#vouchertype").val() == "receipt" || $("#vouchertype").val() == "payment") && sessionStorage.invsflag == 1 && numberofcustomers == 1 && $("#invsel option:selected").val() != '') {
	  let billamount = $("#invbalance").val();  // Amount to be adjusted is set to balance of invoice selected.
	  if(billamount > vtotal) {
	      billamount = vtotal;  // If balance of invoice is more than voucher amount then amount to be adjusted is set to voucher amount.
	  }
	  //A dictionary with invoice id and amount to be adjusted is created.
	  let billdetails = {};
	  billdetails["invid"] = parseInt($("#invsel option:selected").val());
	  billdetails["adjamount"] = billamount;
	  form_data.append("billdetails",JSON.stringify(billdetails));
      }

    $("#msspinmodal").modal("show");
    $.ajax({
      type: "POST",
      url: "/addvoucher",
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      datatype: "json",
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
	{
        if(resp.gkstatus){ // if the voucher is saved show an alert and then reset the voucher form and clear all variables.
          $("#reset").click();
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#success-alert").hide();
            //Modal asking the user if he wants to do bill wise accounting or not?
              if (($("#vouchertype").val() == "receipt" || $("#vouchertype").val() == "payment") && sessionStorage.billflag == 1 && numberofcustomers == 1 && $("#invsel option:selected").val() == '') {
              $("#confirm_yes_billwise").modal("show");
              $("#bwno").focus(); //Focus is on "No" when the model opens.
              $(document).off('click', '#bwyes').on('click', '#bwyes', function(event) {
                event.preventDefault();
                $.ajax(
                  {
                    type: "POST",
                    url: "/billwise?type=vchbillwise",
                    global: false,
                    async: false,
                      data:{"accountcode":sessionStorage.customeracccode, "voucherdate":sessionStorage.voucherdate,"vouchercode":resp["vouchercode"]},
                    datatype: "text/html",
                    beforeSend: function(xhr)
                    {
                      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
                    },
                    success: function(resp)
                    {
                      $("#bwtableload").html(resp);
                      $(".modal-backdrop").hide();
                      $("#confirm_yes_billwise").modal("hide");  //Confirm modal is hidden
                      $("#bwtabletitle").append('<b>'+sessionStorage.customeraccname+'</b>'+'<span class="pull-right">'+sessionStorage.amounttitle+'<b>'+sessionStorage.customeramount+'</b><span>'); //Setting title for modal.
                      $("#bwtable").modal("show");  //Modal for bill wise accounting is shown
                      $(".fixed-table-loading").remove(); //Removes loading message in table.
                    }
                  }
                );
              });
            }
          });
        }
        else {
          $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#failure-alert").hide();
	    $("#msspinmodal").modal("hide");
          });
        }
        $('#vno').focus().select();
      }
    });
  });
  // to close alerts
  $('.close').click(function() {

    $(this).parent().hide();

  })

  /*
  following function opens up a popup to add accounts
  This popup is created using bootstrap modals.
  */
  $('#popup').click(function (e) {
    $.ajax(
      {
        type: "POST",
        url: "/accountpopup",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          var prevmaxacc = 0;
          $('#vtable tbody tr:eq('+curfocusrow+') td:eq(1) select option').each(function(){
            if(this.value > prevmaxacc){
              prevmaxacc = this.value;
            }
          });
          $("#viewacc").html("");
          $('.modal-backdrop').remove();
          $('.modal').modal('hide');
          $("#viewacc").html(resp);
          $('#m_accmodal').modal('show');
          $('#m_accmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
          {
            $('#m_groupname').focus();
          });
          $('#m_accmodal').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the model is closed
          {
            /*
            following lines will refresh only the accounts select boxes.
            so if a new account is added, it will be available in the select box for the users.
            */
            var maxcracccode = 0;
            var maxdracccode = 0;
            $('#viewacc').html(""); // clears the modal
            $(".accs").each(function(){
              var curindex = $(this).closest('tr').index();
              var tmp = $("#vtable tbody tr:eq("+curindex+") td:eq(1) select").val();
              if($("#vtable tbody tr:eq("+curindex+") td:eq(0) select").val()==="Cr"){
                $.ajax({
                  url: '/getcjaccounts',
                  type: 'POST',
                  async: false,
                  dataType: 'json',
                  data: {"type": $('#vtype').val(),"side":"Cr"},
                  beforeSend: function(xhr)
                  {
                    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
                  },
                  success: function(jsonObj) {
                    var accs = jsonObj["accounts"];
                    maxcracccode = accs[0].accountcode;
                    $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
                    for (i in accs ) {
                      if(accs[i].accountcode > maxcracccode){
                        maxcracccode = accs[i].accountcode;
                      }
                      if(accs[i].accountcode==tmp){
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '" selected>' +accs[i].accountname+ '</option>');
                      }
                      else {
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
                      }
                    }
                  }
                });
              }
              else if($("#vtable tbody tr:eq("+curindex+") td:eq(0) select").val()==="Dr"){
                $.ajax({
                  url: '/getcjaccounts',
                  type: 'POST',
                  async: false,
                  dataType: 'json',
                  data: {"type": $('#vtype').val(),"side":"Dr"},
                  beforeSend: function(xhr)
                  {
                    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
                  },
                  success: function(jsonObj) {
                    var accs = jsonObj["accounts"];
                    maxdracccode = accs[0].accountcode;
                    $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
                    for (i in accs ) {
                      if(accs[i].accountcode > maxdracccode){
                        maxdracccode = accs[i].accountcode;
                      }
                      if(accs[i].accountcode==tmp){
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '" selected>' +accs[i].accountname+ '</option>');
                      }
                      else {
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
                      }
                    }
                  }
                });
              }
            });
            if (accpopupindex!=-1) {
              var text1 = $("#selpopupaccount").val();
              if (text1!="" && curselectlength!=$("#vtable tbody tr:eq("+accpopupindex+") td:eq(1) select").length) {
                $("#vtable tbody tr:eq("+accpopupindex+") td:eq(1) select option").filter(function() {
                  return this.text != text1;
                }).removeAttr('selected');
              }
              $("#vtable tbody tr:eq("+accpopupindex+") td:eq(1) select option").filter(function() {
                return this.text == text1;
              }).attr('selected', true);
              $("#selpopupaccount").val("");
              $("#vtable tbody tr:eq("+accpopupindex+") td:eq(1) select").focus();
              accpopupindex = -1;
              curselectlength = -1;
            }
            else {
              $("#popup").focus();
              accpopupindex = -1;
            }
            if(curfocusrow == -1){
              $('#vtable tbody tr:eq(0) td:eq(1) select').focus();
            }
            else{
              if($("#vtable tbody tr:eq("+curfocusrow+") td:eq(0) select").val()==="Dr"){
                if(maxdracccode != prevmaxacc){
                  $('#vtable tbody tr:eq('+curfocusrow+') td:eq(1) select').val(maxdracccode);
                  $('#vtable tbody tr:eq('+curfocusrow+') td:eq(1) select').trigger('change');
                }
                $('#vtable tbody tr:eq('+curfocusrow+') td:eq(3) input').focus().select();
              }
              else{
                if(maxcracccode != prevmaxacc){
                  $('#vtable tbody tr:eq('+curfocusrow+') td:eq(1) select').val(maxcracccode);
                  $('#vtable tbody tr:eq('+curfocusrow+') td:eq(1) select').trigger('change');
                }
                $('#vtable tbody tr:eq('+curfocusrow+') td:eq(4) input').focus().select();
              }
            }
          });
        }
      }
    );
  });

  $('#reset').click(function(event) {
$("#show"+$("#vtype").val()).click();
  });
  $('#confirm_yes_billwise, #bwtable').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the modal is closed
  {
    $("#vno").focus().select();
    $("#bwtableload").html("");
  });
  $('#bwtable').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
  {
    $(".amountpaid:first").focus().select();
  });
  $('#bwtable').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the modal is closed
    {
      $("#vno").focus().select();
    });

    $(document).off("click","#instrumentbtn").on("click","#instrumentbtn",function(event)
    {
      event.preventDefault();
$("#instrumentmodal").modal("show");
    });

      $("#instrumentmodal").on('shown.bs.modal', function(event) {
        $("#instrumentno").focus();
      });
      $("#instrumentmodal").on('hidden.bs.modal', function(event) {
        $("#save").focus();
        event.preventDefault();
      });
      $("#instrumentno").keydown(function(event) {
        if (event.which==13) {
          event.preventDefault();
          if(!$("#instrumentno").val()){

          $("#instrumentno-alert").show();
          $("#instrumentno-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#instrumentno-alert").hide();
          });
          $("#instrumentno").focus();

          }
          else{
          $("#bankname").focus().select();
          }

        }

      });
      $("#bankname").keydown(function(event) {
        if (event.which==13) {
          event.preventDefault();
          if(!$("#bankname").val())
          {
            $("#bankname-alert").show();
            $("#bankname-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#bankname-alert").hide();
            });
            $("#bankname").focus();

          }
          else{
          $("#branchname").focus().select();
          }

        }
        if (event.which==38) {
          event.preventDefault();
          $("#instrumentno").focus().select();
        }
      });
      $("#branchname").keydown(function(event) {
        if (event.which==13) {
          event.preventDefault();
          if(!$("#branchname").val())
          {

              $("#branchname-alert").show();
              $("#branchname-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#branchname-alert").hide();
              });
              $("#branchname").focus();

          }
          else{
          $("#instrument_date").focus().select();
          }

        }
        if (event.which==38) {
          event.preventDefault();
          $("#bankname").focus().select();
        }
      });
      $("#instrument_date").numeric();
      $("#instrument_month").numeric();
      $("#instrument_year").numeric();
      $("#instrument_date").keydown(function(event) {
        if (event.which==13) {
          event.preventDefault();
          $("#instrument_month").focus().select();
        }
        if (event.which==38) {
          event.preventDefault();
          $("#transfernote_no").focus().select();
        }
      });

      $("#instrument_month").keydown(function(event) {
        if (event.which==13) {
          event.preventDefault();
          $("#instrument_year").focus().select();
        }
        if (event.which==38) {
          event.preventDefault();
          $("#instrument_date").focus().select();
        }
      });
      $("#instrument_year").keydown(function(event) {
        if (event.which==13) {
          event.preventDefault();
                                    //
                                    let instrumentdate1=Date.parseExact($("#instrument_date").val()+$("#instrument_month").val()+$("#instrument_year").val(), "ddMMyyyy");

                                    if(!instrumentdate1){
                                      $("#instrdate-alert").show();
                                      $("#instrdate-alert").fadeTo(2250, 500).slideUp(500, function(){
                                        $("#instrdate-alert").hide();
                                      });

                                      $('#instrument_date').focus().select();
                                      //return false;
                                    }
                                    else{
                                          $("#donebutton").focus().select();
                                    }

                                    //

        }
        if (event.which==38) {
          event.preventDefault();
          $("#instrument_month").focus().select();
        }
      });


if (!($("#vouchertype").val() == "receipt" || $("#vouchertype").val() == "payment")){
  $("#instrumentbtn").hide();
}
  $('.instrdate').autotab('number');

  function pad (str, max) { //to add leading zeros in date when single number is entered
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str;
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
      return str;
    }
  }
  //Leading zeroes are added on loss of focus from date fields
  $("#instrument_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#instrument_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#instrument_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
});
