$(document).ready(function() {

  $('.modal-backdrop').remove();
  var specday;
  var specmonth;
  var specyear;
  var specdate;
  var selectedgodown;
  var selectedtaxname;
    var selectedtaxstate;
    var taxhtml;
    var stateshtml;
  $("#prodselect").focus();
    $(".product_tax_disable").prop('disabled',true);
  $(".product_cat_tax_disable").prop('disabled',true);
  $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".numtype").numeric();
  });


    if(sessionStorage.invflag==0){
  $(".noinventory").hide();
    $("#taxhelp3").hide();
    $("#taxhelp4").show();

  }

    $(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
      if ($(this).val()=="" && !$(this).hasClass("hsn"))
    {
    $(this).val(parseFloat(0).toFixed(2));
    }
    else
    {
	if(!$(this).hasClass("hsn")){
            $(this).val(parseFloat($(this).val()).toFixed(2));
        }
    }
  });

    $(document).off('click', '#editgodownflag').on('click', '#editgodownflag', function(e){
    if ($(this).is(":checked")) {
      $("#editgodownflag").val(1);
      $("#editnogodown").hide();
      $("#editopeningstockdiv").show();
    }
    else {
	$("#editgodownflag").val(0);
	$("#editopeningstockdiv").hide();
      $("#editnogodown").show();
    }
  });

  $(document).off('keydown', '#edituom').on('keydown', '#edituom', function(e){
    if (e.which == 13) {
      e.preventDefault();
      if ($("#numberofspecs").val() > 0) {
        $("#spec_table tbody tr:first td:eq(1) input:first").focus();
      }
	else {
	    if ($('#product_edit_tax_table').length > 0){
		$('#product_edit_tax_table tbody tr:first td:eq(0) select').focus();
	    }
	    else {
		if($('#gsflag').val() == '7') {
        if ($("#editgodownpresence").val() == 0) {
          $("#editopeningstock").focus().select();
        }
        else {
          if ($("#editgodownflag").val() == 1) {
            $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus().select();
          }
          else if ($("#editgodownflag").val() == 0) {
            $("#editgodownflag").focus().select();
          }
      }

      }
      else {
        $("#epsubmit").focus();
      }
	    }
      }
    }
    if (e.which == 38) {
      e.preventDefault();
      if ($("#editcatselect").is(':disabled') || $("#editcatselect").length < 1) {
        $("#editproddesc").focus().select();
      }
      else {
        $("#gscode").focus();
      }
    }
  });
  $(document).off('keydown', '#editgodownflag').on('keydown', '#editgodownflag', function(e){
    if (e.which == 13) {
      e.preventDefault();
      $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus();
    }
    if (e.which == 38) {
      $('#product_edit_tax_table tbody tr:last td:eq(2) input').focus();
    }
  });

  var sel1=0;
  var sel2=0;
  var sindex=0;
  var category;
  var existingcatspecs;
  var existingnonetax;
  var prodcode;
  var catcode;
  $(document).on("focus",'#edituom',function() {
    sel1 = 1;
  });
  $(document).on("blur",'#edituom',function(){
    sel1 = 0;
  });
  $(document).on("focus",'#editcatselect',function(){
    sel2 = 1;
  });
  $(document).on("blur",'#editcatselect',function(){
    sel2 = 0;
  });
  var edittextareasel;
  $(document).on('focus', '#editproddesc',function(event) {
    /* Act on the event */
    edittextareasel=1;

  });
  $(document).on('blur', '#editproddesc',function(event) {
    /* Act on the event */
    edittextareasel=0;
    $("#editproddesc").val($("#editproddesc").val().trim());

  });
  $(document).keyup(function(event)
  {
    /* Act on the event */
    if (event.which == 45)
    {
      event.preventDefault();
      $("#epsubmit").click();
    }
  });

  $("#prodselect").keydown(function(event) {

    if (event.which==13) {
      event.preventDefault();
        if ($("#catg").val()){
          $("#editcatselect").focus();
        }
        else {
          $("#editproddesc").focus().select();

        }


          }

  });
  $(document).on('keydown', '#editproddesc', function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#gscode").focus();

     /*if ($("#editcatselect").is(':disabled')) {
        $("#gscode").focus();
      }
        else {
          $("#editcatselect").focus();
        }*/
    }
    if (event.which==38) {
      event.preventDefault();
      $("#prodselect").focus();
    }
  });
    $(document).on('keydown', '#gscode', function(event) {
    if (event.which==13) {
      event.preventDefault();
      if($("#gsflag").val()=='7'){
   $("#edituom").focus();
}

        else{
	    if ($("#product_edit_tax_table").length > 0) {
		$("#product_edit_tax_table tbody tr:first td:eq(0) select").focus();
	    }
	    else{
		$("#epsubmit").focus();
	    }
         }
    }
  });

  $(document).on('keydown', '#editopeningstock', function(event) {
    if (event.which==13)
    {
      event.preventDefault();
      $('#epsubmit').click();

    }
    else if (event.which==173) {
      event.preventDefault();
    }
    /* Act on the event */
  });

  $(document).on('keydown', '.editgodown_ob', function(event){
    if (event.which == 13) {
      var n = $(".editgodown_ob").index(this);
      var m = n+1;
      if (m < $(".editgodown_ob").length) {
        $(".editgodown_ob").eq(m).focus().select();
      }
      else {
        event.preventDefault();
        if ($("#product_edit_tax_table tbody tr:first td:eq(0) select").is(":disabled")||$("#product_edit_tax_table tbody tr").length==0) {
          $('#editspecifications').contents(".form-group:first").find("input:first").focus();
        }
        else {
          $("#product_edit_tax_table tbody tr:first td:eq(0) select").focus();
        }
      }
    }
    if (event.which == 38) {
	var n = $(".editgodown_ob").index(this);
      if (n == 0) {
        $("#editgodownflag").focus().select();
      }
      else {
          $(".editgodown_ob").eq(n-1).focus().select();
      }
    }
    else if (event.which==173) {
      event.preventDefault();
    }
  });

  $("#prodselect").change(function(event) {
      /* Act on the event */
      var call;
       if(sessionStorage.vatorgstflag == '7' || sessionStorage.vatorgstflag == '29'){
	   call = '/product?type=details';
      }

      else{
	   call = '/product?type=detailsvat';
      }
    prodcode= $("#prodselect option:selected").val();
      $.ajax({
        url: call,
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"productcode": prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        $("#proddetails").html("");
        $("#proddetails").html(resp);
        if(sessionStorage.invflag==0){
        //$("#categorydiv").hide();
        $(".noinventory").hide();
            $("#invflag").val("0");
          $("#taxhelp3").hide();
          $("#taxhelp5").show();

        }
        $("#unitaddon").html($("#edituom option:selected").text());
        $(".pbutn").show();
        $("#epsubmit").hide();
        $("#addgodown").hide();
        $("#epedit").show();
        $('#proddetails').find('input, textarea, button, select').prop('disabled',true);
        $(".product_tax_disable").prop('disabled',true);
        $(".product_cat_tax_disable").prop('disabled',true);
          catcode= $("#editcatselect option:selected").val();
	  if(catcode!=""){
	      $("#txtareahelp").hide();
	  }
        $(".specdate").autotab('number');
        $(".specdate").numeric();
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      $.ajax({
        url: '/product?type=prodtax',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"productcode": prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        if (resp["gkresult"].length > 0) {
            taxhtml = $('#product_edit_tax_table tbody tr:first').html();
	    stateshtml = $('#product_edit_tax_table tbody tr:first td:eq(1) select').html();
          $('#product_edit_tax_table tbody tr:first').remove();


        for (tax of resp["gkresult"]) {
            $('#product_edit_tax_table tbody').append('<tr value="'+tax["taxid"]+'">'+ taxhtml + '</tr>');
          $('#product_edit_tax_table tbody tr:last td:last').append('<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
          $(".product_tax_disable").prop('disabled',true);
            $('#product_edit_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
          $('#product_edit_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
          $('#product_edit_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);
        }
	    $(".tax_del:first").hide();
      }
          existingnonetax = resp["gkresult"];
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
      category = $("#editcatselect option:selected").val();
      var indexgp = $(".editgodownid").index(this);
      $.ajax({
        url: '/product?by=godown',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"productcode":$("#prodselect option:selected").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        var goopeningstock=resp["gkresult"];
        var editgoopeningstock = 0;
        var goid = 0;
        if (resp["gkstatus"]==0)
        {
          if (goopeningstock.length == 0) {
            editgoopeningstock = "0.00";
          }
          else {
            for (i in goopeningstock) {
              editgoopeningstock=goopeningstock[i].goopeningstock;
              goid=goopeningstock[i].goid;
              $(".editgodown_ob").eq(i).val(editgoopeningstock);
              $(".editgodown_name").eq(i).val(goid);
            }
          }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
  });

  $(document).off("shown.bs.collapse","#moresmall").on("shown.bs.collapse","#moresmall",function(event) {
    event.preventDefault();
    $("#smalllink").html('See less. <span class="glyphicon glyphicon-triangle-top"></span>');
  });
  $(document).off("hidden.bs.collapse","#moresmall").on("hidden.bs.collapse","#moresmall",function(event) {
    event.preventDefault();
    $("#smalllink").html('See more. <span class="glyphicon glyphicon-triangle-bottom"></span>');
  });

  $(document).on("change","#editcatselect",function(event) {
    /* Act on the event */

    catcode= $("#editcatselect option:selected").val();
    if (catcode!="")
    {
      $.ajax({
        url: '/product?type=specs',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"categorycode": catcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        $('#extsp').show();
        $('#extsp').html(resp);
        $(".specdate").autotab('number');
        $(".specdate").numeric();
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    }
    else {
      $('#extsp').hide();
      $("#numberofspecs").val("0");
      $("#nocategory-alert").alert();
      $("#nocategory-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#nocategory-alert").hide();
      });
    }

  });

  $("#prodselect").keyup(function(event) {
    /* Act on the event */
    if (event.which == 13)
    {
      event.preventDefault();
      prodcode= $("#prodselect option:selected").val();
      if (prodcode!="")
      {
        $("#epedit").click();

      }

    }
    if (event.which==46)
    {
      event.preventDefault();
      prodcode= $("#prodselect option:selected").val();
      if (prodcode!="")
      {
        $('#epdelete').click();
      }
    }
  });

  $(document).on("keydown",'.spec', function(e) {
    var n = $(".spec").length;
    var f = $('.spec');
    if (e.which == 13)
    {
      var nextIndex = f.index(this) + 1;

      if(nextIndex < n)
      {
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }
      else {
        $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus().select();
      }

    }
    if (e.which == 38)
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex > -1)
      {
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();

        }
        else {
          $('#product_edit_tax_table tbody tr:last td:eq(2) input').focus().select();
        }
      }
  });
  $(document).on('change', '#edituom',function(event) {
    if ($("#edituom option:selected").val()!='') {
      $("#unitaddon").html($("#edituom option:selected").text());
    }
  });

  $(document).on('focus', '#editopeningstock',function(event) {
    if ($("#edituom option:selected").val()!='') {
      $("#unitaddon").html($("#edituom option:selected").text());
    }
  });
  $(document).on('click', '#epedit', function(event) {
    event.preventDefault();
    /* Act on the event */
    $('#proddetails').find('input, textarea, button, select').prop('disabled',false);
    $("#epsubmit").show();

    $("#epedit").hide();

    if($("#gsflag").val()=='7' && sessionStorage.invflag == 1){
    $("#addgodown").show();
  }

    event.preventDefault();
    if ($("#catg").val()){
      $("#editcatselect").focus();

    }
    else {
      $("#editproddesc").focus().select();

    }

    $(".godownflag").show();
    catcode= $("#editcatselect option:selected").val();
    $(".product_cat_tax_disable").prop('disabled',false);
    $(".product_tax_disable").prop('disabled',false);
    $("#product_edit_tax_table tbody tr").each(function() {
      if($('td:eq(0) select option:selected', this).val() == 'CVAT' || $('td:eq(0) select option:selected', this).val() =='IGST' || $('td:eq(0) select option:selected', this).val() =='CESS' ){
        $('td:eq(1) select', this).prop('disabled', true);
      }
    });
    if ($("#editcatselect").val()!="") {
      $("#editcatselect").prop('disabled',true);
    }
    else {
      $("#editcatselectlabel").text('Select Category');
    }
  });

  $(document).off("keydown","#editcatselect").on("keydown","#editcatselect",function(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($("#editcatselect option:selected").val() == "") {
        $("#nocategory-alert").alert();
        $("#nocategory-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#nocategory-alert").hide();
        });
      }
      $("#editproddesc").focus().select();
    }
    if (event.which == 38) {
      event.preventDefault();
      if($("#editcatselect option:selected").val() == ""){
        $("#editproddesc").focus().select();
      }
    }
  });

  /* -----------------------Spec Key Events---------------------------------------------- */
  $(document).off("keydown",".spec").on("keydown",".spec",function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    n = $('#spec_table tbody tr').length -1;
    if (event.which==13) {
      event.preventDefault();
        if ($(this).hasClass("specday") || $(this).hasClass("specmonth")) {
          $(this).parent().next().children('.specdate').focus().select();
        }
        else {
          if (curindex == n) {
            $('#product_edit_tax_table tbody tr:eq(0) td:eq(0) select').focus();
          }
          else {
            $('#spec_table tbody tr:eq('+nextindex+') td:eq(1) input').focus().select();
          }
        }
    }
    if (event.which==38) {
      event.preventDefault();
        if ($(this).hasClass("specyear") || $(this).hasClass("specmonth")) {
          $(this).parent().prev().children('.specdate').focus().select();
        }
        else {
          if (curindex == 0) {
            $("#edituom").focus();
          }
          else {
            $('#spec_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
          }
        }
    }
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
  $(document).off("blur",".specday").on("blur",".specday",function(event) {
    $(this).val(pad($(this).val(),2));
    specday = $(this).val();
  });
  $(document).off("blur",".specmonth").on("blur",".specmonth",function(event) {
    $(this).val(pad($(this).val(),2));
    specmonth = $(this).val();
  });

  $(document).off("blur",".specyear").on("blur",".specyear",function(event) {
    var curindex = $(this).closest('tr').index();
    $(this).val(yearpad($(this).val(),4));
    specyear = $(this).val();
    if(!Date.parseExact(specday+specmonth+specyear, "ddMMyyyy")){ // Validation for date
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $('#spec_table tbody tr:eq('+curindex+') td:eq(1) input:first').focus().select();
        $("#date-alert").hide();
      });
    }
    });
  /* -----------------------Spec Key Events End------------------------------------------ */

  /* -----------------------Tax key events start----------------------------------------- */
  $(document).off("keyup",".tax_name").on("keyup",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==188 && event.shiftKey)
    {
      if (curindex==0) {
        if ($("#numberofspecs").val() > 0) {
          $('#spec_table tbody tr:last td:eq(1) input:first').focus().select();
        }
        else {
          $("#edituom").focus();
        }
      }
      if(previndex>-1 && curindex != 0)
      {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
  });

  $(document).off("keydown",".tax_name").on("keydown",".tax_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()!='VAT') && event.which==13 ) {
        event.preventDefault();
        var types = [];
        $('#product_edit_tax_table tbody tr').each(function(){
          if($(".tax_name",this).val()=='IGST') {
          types.push($(".tax_name",this).val());
        }
        if($(".tax_name",this).val()=='CESS') {
        types.push($(".tax_name",this).val());
      }
          if ($(".tax_name",this).val()=='CVAT') {
          types.push($(".tax_name",this).val());
          }
        });
        types.sort();
        var duplicatetypes = [];
        for (var i = 0; i < types.length - 1; i++) {
          if (types[i + 1] == types[i]) {
            duplicatetypes.push(types[i]);
          }
        }
        if (duplicatetypes.length > 0) {
          $("#cvat-alert").alert();
          $("#cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#cvat-alert").hide();
          });
          return false;
        }
        $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
    else if (event.which==27) {
      event.preventDefault();
      if ($("#invflag").val()==0){
          $("#epsubmit").focus();
      }
      if($("#gsflag").val()=='7'){
        if ($("#editgodownpresence").val() == 0) {
          $("#editopeningstock").focus().select();
        }
        else {
          if ($("#editgodownflag").val() == 1) {
            $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus().select();
          }
          else if ($("#editgodownflag").val() == 0) {
            $("#editgodownflag").focus().select();
          }
        }
      }
      else{
        $("#epsubmit").focus();
      }

    }
  });

  $(document).off("change",".tax_name").on("change",".tax_name",function(event)
  {
      var curindex = $(this).closest('tr').index();
      if ($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
          $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
          $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').prop("disabled", false);
          $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append(stateshtml);
          $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select option:visible").first().prop("selected", true);
      }
      else {
          $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
          $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(1) select').prop("disabled", true);
          $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
      }
      var previndex = curindex -1;
      for (let j = 0; j < curindex + 1; j++) {
          if ($("#product_edit_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val() == "VAT") {
              var selectedtaxstate = $("#product_edit_tax_table tbody tr:eq("+j+") td:eq(1) select option:selected").attr("stateid");
              for (let i=j+1; i<=curindex+1;i++){
                  $('#product_edit_tax_table tbody tr:eq('+i+') td:eq(1) select option[stateid='+selectedtaxstate+']').remove();
              }
          }
      }
  });

  $(document).off("keydown",".tax_state").on("keydown",".tax_state",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      $('#product_edit_tax_table tbody tr:eq('+nextindex+') td:eq(1) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+previndex+') td:eq(1) select').focus();
      }
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
  });

  $(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
        if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
          $("#tax_state-blank-alert").alert();
          $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#tax_state-blank-alert").hide();
          });
          return false;
        }
        if (curindex1 != ($("#product_edit_tax_table tbody tr").length-1)) {
          $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
        }
        else {
          if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
            $("#tax-name-blank-alert").alert();
            $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#tax-name-blank-alert").hide();
            });
            $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
            return false;
          }
          if ($('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="") {
            $("#tax-rate-blank-alert").alert();
            $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#tax-rate-blank-alert").hide();
            });
            $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
            return false;
          }
            $('#product_edit_tax_table tbody').append('<tr value="new">'+ taxhtml + '</tr>');
            $('#product_edit_tax_table tbody tr:last td:last').append('<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
	    $(".product_tax_disable").prop('disabled',false);
            $(".tax_rate").numeric();
	    for (let j = 0; j < curindex1 + 1; j++) {
                var selectedtax = $("#product_edit_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
                if (selectedtax != "VAT") {
                    for (let i=j+1; i<=curindex1+1;i++){
                        $('#product_edit_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
                    }
                }
            }
            $(".tax_name:last").change();
          $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
        }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(2) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#product_edit_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#product_edit_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    else if (event.which==27) {
      event.preventDefault();
      if ($("#invflag").val()==0){
          $("#epsubmit").focus();
      }
      if($('#gsflag').val() == '7') {
        if ($("#editgodownpresence").val() == 0) {
          $("#editopeningstock").focus().select();
        }
        else {
          if ($("#editgodownflag").val() == 1) {
            $('#editgodown_ob_table tbody tr:first td:eq(0) select').focus().select();
          }
          else if ($("#editgodownflag").val() == 0) {
            $("#editgodownflag").focus().select();
          }
      }

      }
      else {
        $("#epsubmit").focus();
      }
    }

  });
  $(document).off("click",".tax_del").on("click", ".tax_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#product_edit_tax_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#product_edit_tax_table tbody tr:last td:eq(0) select').select();
  });
  /* -----------------------Tax key events end----------------------------------------- */
  /* -----------------------Godown Key events start here----------------------------------------- */

  $(document).off("change",".editgodown_name").on("change",".editgodown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    selectedgodown = $('#editgodown_ob_table tbody tr:eq('+curindex+') td:eq(0) select').val();
  });

  $(document).off("keyup",".editgodown_name").on("keyup",".editgodown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==188 && event.shiftKey)
    {
      if (curindex==0) {
        if ($("#editgodownflag").is(':visible')) {
            $("#editgodownflag").focus().select();
        }
      else {
        $('#product_edit_tax_table tbody tr:last td:eq(2) input').focus().select();
      }
      }
      if(previndex>-1 && curindex != 0)
      {
        event.preventDefault();
        $('#editgodown_ob_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
      }
    }
  });

  $(document).off("keydown",".editgodown_name").on("keydown",".editgodown_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
    }
    else if (event.which==188 && event.ctrlKey) {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
    }
    else if (event.which==190 && event.ctrlKey) {
      $('#editgodown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      event.preventDefault();
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }
  });

  $(document).off("keydown",".editgodown_ob").on("keydown",".editgodown_ob",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var selectedgodown = $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val();
    var numberofgodowns = $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length;
    selectedgodown = $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').val();
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#editgodown_ob_table tbody tr").length-1)) {
        $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        if ($('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
          $("#godown-blank-alert").alert();
          $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#godown-blank-alert").hide();
          });
          $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').val()=="") {
          $("#os-blank-alert").alert();
          $("#os-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#os-blank-alert").hide();
          });
          $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
          return false;
        }
        if (numberofgodowns == 1) {
          $('#epsubmit').click();
          return false;
        }
        $('#editgodown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
        $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedgodown+']').prop('hidden', true).prop('disabled', true);
	$('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').prepend('<option value="" disabled hidden selected>Select Godown</option>');
        if (curindex1 == 0) {
          $("#editgodown_ob_table tbody tr:last td:last").append('<a href="#" class="editgodown_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
        }
        $(".editgodown_ob").numeric();
        $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
    }
    else if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex1>-1)
      {
        event.preventDefault();
        $('#editgodown_ob_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
    }
    else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#editgodown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
    }
    else if (event.which==27) {
      event.preventDefault();
      $('#epsubmit').focus();    }
    else if (event.which==173) {
      event.preventDefault();
    }
  });
  $(document).off("click",".editgodown_del").on("click", ".editgodown_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#editgodown_ob_table tbody tr:last td:eq(0) select').focus().select();
    });
    $('#editgodown_ob_table tbody tr:last td:eq(0) select').focus().select();
  });
  /* -----------------------Godown Key events end here----------------------------------------- */

  $("#addgodown").click(function() {
     $.ajax(
     {
     type: "POST",
     url: "/godown?type=addpopup",
     global: false,
     async: false,
     datatype: "text/html",
     beforeSend: function(xhr)
       {
         xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
       },
     success: function(resp)
     {
           $("#addgodownpopup").html("");
           $('.modal-backdrop').remove();
           $('.modal').modal('hide');
           $("#addgodownpopup").html(resp);
           $('#addgodownmodal').modal('show');
           $('#addgodownmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
           {
             $("#godownname").focus();
           });
           $('#addgodownmodal').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the modal is opened
           {
            $("#addgodownpopup").html("");
            $(document).off('keyup').on('keyup',function(event)
            {
              /* Act on the event */
              if (event.which == 45)
              {
                event.preventDefault();
                $("#epsubmit").click();
              }
            });
            $.ajax({
              url: 'godown?type=getallgodowns',
              type: 'POST',
              dataType: 'json',
              beforeSend: function(xhr)
              {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
              }
            })
            .done(function(resp) {
              var newgodowns = resp["gkresult"];
              if (newgodowns.length > 0) {
                $("#beforeaddingfirstgodown").hide();
                $("#newgodownadded").show();
                $('#editgodown_ob_table tbody tr').each(function(){
                  var curindex2 = $(this).closest('tr').index();
                for (i in newgodowns ) {
                  if (newgodowns[i].godownname == sessionStorage.newgodownname && newgodowns[i].godownaddress == sessionStorage.newgodownaddress) {
                    $('#editgodown_ob_table tbody tr:eq('+curindex2+') td:eq(0) select').append('<option value="' + newgodowns[i].godownid + '">' + newgodowns[i].godownname + '(' + newgodowns[i].godownaddress + ')</option>');
                  }
                }
                });
                if ($("#editgodownflag").val()==0) {
                  $("#editgodownflag").focus().select();
                }
                else if ($("#editgodownflag").val()==1) {
                  $('#editgodown_ob_table tbody tr:last td:eq(0) select').focus().select();
                }
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
     }
  }
   );
   });

  $(document).off("click","#epsubmit").on("click", "#epsubmit", function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($("#editproddesc").val()=="")
    {
      $('.modal-backdrop').remove();
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#editproddesc").focus();
      $("#editproddesc").select();
      return false;
    }
    var igstflag=0;
    var taxflag=0;
  $("#product_edit_tax_table tbody tr").each(function(index){
        if ($.trim($('#product_edit_tax_table tbody tr:eq('+index+') td:eq(0) select option:selected').val())=="") {
      taxflag=1;

      }

  if ($.trim($('#product_edit_tax_table tbody tr:eq('+index+') td:eq(0) select option:selected').val())=="IGST") {
  igstflag=1;
  }

  if ($.trim($('#product_edit_tax_table tbody tr:eq('+index+') td:eq(0) select option:selected').val())=="CESS") {
  igstflag=1;
  }

  });

  if(taxflag){
    $("#tax-alert").alert();
    $("#tax-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#tax-alert").hide();
  });
    $("#product_edit_tax_table tbody tr:eq(0) td:eq(0) select").focus();
    return false;
  }
  /*if(!igstflag){
    $("#igst-alert").alert();
    $("#igst-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#igst-alert").hide();
  });
    $("#product_edit_tax_table tbody tr:eq(0) td:eq(0) select").focus();
    return false;
  }*/
  ///
    var specs = {};      /*This is spec dictionary having spcode as a key and specval as its value*/
    $("#spec_table tbody tr").each(function(){
      if ($(".spec_value",this).hasClass('datevalue')) {
        $(".specdate").each(function() {
          if ($(this).hasClass('specday')) {
            specday = $(this).val(); //Storing specday
          }
          if ($(this).hasClass('specmonth')) {
            specmonth = $(this).val(); //Storing specmonth
          }
          if ($(this).hasClass('specyear')) {
            specyear = $(this).val(); //Storing specyear
          }
        });
        specdate = specyear+"-"+specmonth+"-"+specday; //Storing date in yyyyMMdd format
        if (specyear!="" && specmonth!="" && specday!="") {
	    $(".spec_value",this).val(specdate); // Storing spec date in hidden filed
	  }
	  else{
	      $(".spec_value",this).val("");
	  }
      }
      if ($.trim($(".spec_name",this).val())!=""){
        if ($.trim($(".spec_name",this).val())!="" && $.trim($(".spec_value",this).val())!="" ) {
          specs[$(".spec_name",this).val()] = $(".spec_value",this).val();
        }
      }
    });
    var taxes = [];
    $("#product_edit_tax_table tbody tr").each(function(){
      var obj = {};
      let curindex = $(this).index();
      if ($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()!="") {
        obj.taxrowid = $("#product_edit_tax_table tbody tr:eq("+curindex+")").attr('value');
        obj.taxname = $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(0) select option:selected").val();
        obj.state = $("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(1) select option:selected").val();
        obj.taxrate = parseFloat($("#product_edit_tax_table tbody tr:eq("+curindex+") td:eq(2) input").val()).toFixed(2);
        taxes.push(obj);
      }
    });
    
    var obj = {};
    $("#editgodown_ob_table tbody tr").each(function(){
      if ($.trim($(".editgodown_name",this).val())!="") {
        if ($.trim($(".editgodown_ob",this).val())!="" && $.trim($(".editgodown_ob",this).val())!= "0.00") {
          obj[$(".editgodown_name",this).val()] = $(".editgodown_ob",this).val();
        }
      }
    });
    var editformdata = $("#editprodform").serializeArray();
    editformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
    editformdata.push({name: 'specs', value: JSON.stringify(specs)});
    if ($("#editgodownflag").val() == 1) {
      editformdata.push({name: 'godowns', value: JSON.stringify(obj)});
    }
    $.ajax({
      url: '/product?type=edit',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
      data: editformdata,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if (resp["gkstatus"] ==0) {
        $('.modal-backdrop').remove();
        $("#editproduct-success-alert").alert();
        $("#editproduct-success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#editproduct-success-alert").hide();
        });
        $("#editproduct").click();
        return false;
      }
      else if (resp["gkstatus"] ==1)
      {

        $('.modal-backdrop').remove();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
        $("#editproddesc").focus();
        $("#editproddesc").select();
        return false;
      }
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    event.stopPropagation();
  });


  $('#epdelete').click(function(event) {
      event.preventDefault();
      var gsflag = $("#gsflag").val();
    /* Act on the event */
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    prodcode= $("#prodselect option:selected").val();
    $('#m_confirmdel').modal('show').one('click', '#proddel', function (e)
    {
      $.ajax({
        url: '/product?type=delete',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'json',
        data: {"productcode":prodcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        if (resp["gkstatus"] ==0) {
          $('.modal-backdrop').remove();
          if ($("#prodselect option").length < 3) {
          $("#product").click();
          }
          else {
            $("#editproduct").click();
          }
	    if(gsflag == '7'){
		$("#deleteproduct-success-alert").alert();
		$("#deleteproduct-success-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#deleteproduct-success-alert").hide();
          });
	    }
	    else {
		$("#deleteservice-success-alert").alert();
                $("#deleteservice-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#deleteservice-success-alert").hide();
                });
                return false;
	    }
        }
        else if(resp["gkstatus"] == 5) {
          $("#prodselect").focus();
            if(gsflag == '7'){
		$("#failure-delete-alert").alert();
                $("#failure-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#failure-delete-alert").hide();
                });
                return false;
            }
	    else {
		$("#failure-service-delete-alert").alert();
                $("#failure-service-delete-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#failure-service-delete-alert").hide();
                });
                return false;
	    }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    });
    $('#m_confirmdel').on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
    });
    $('#m_confirmdel').on('hidden.bs.modal', function(event) {
      $("#prodselect").focus();
    });

  });

  $("#epreset").unbind().click(function() {
  $("#editproduct").click();
});
});
