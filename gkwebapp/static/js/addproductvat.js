/*
  Copyright (C) 2013, 2014, 2015, 2016, 2017 Digital Freedom Foundation
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
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,

  Contributors:
  "Abhijith Balan" <abhijithb21@openmailbox.org>
  "Bhavesh Bawadhane" <bbhavesh07@gmail.com>
  "Ishan Masdekar" <imasdekar@dff.org.in>
  "Mohd. Talha Pawaty" <mtalha456@gmail.com>
  "Navin Karkera" <navin@openmailbox.org>
  "Ravishankar Purne" <ravismail96@gmail.com>
  "Reshma Bhatawadekar" <bhatawadekar1reshma@gmail.com>
  "Rohini Baraskar" <robaraskar@gmail.com>
  "Sachin Patil" <sachin619patil@rediffmail.com>

*/

$(document).ready(function() {
    var stkhtml = $('#stocktable tbody tr:first').html();  


if (sessionStorage.invflag==0){
  $(".noinventory").hide();
  $("#nogodownmsg").show();
}
if (sessionStorage.invflag=='1' ){
    $("#nogodownmsg").hide();
    $("#addgodown").show();
  $("#godownmsg").show();
}

  var taxfieldhtml = $("#product_tax_table tbody").html();
  var delhtml = '<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>';

  var godownflag = 0;
  $('.modal-backdrop').remove();
  var specday;
  var specmonth;
  var specyear;
  var specdate;
  var specspresent = 0;
  var selectedgodown;
  var selectedtaxname;
  var selectedtaxstate = 0;

    //Function to check duplicate 'CVAT' tax.
    function duplicatecvat(curindex){
	var types = [];
	$('#product_tax_table tbody tr').each(function(){
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
	return duplicatetypes;
    }
    
    //Function to check duplicate 'states' addded for 'VAT' tax.
    function duplicatestate(curindex){
	var edittaxstates = [];
	$('#product_tax_table tbody tr').each(function(){
	    var c_index = $(this).closest('tr').index();
	    if($('#product_tax_table tbody tr:eq('+c_index+') td:eq(1) option:selected').val() !=""){
		edittaxstates.push($('#product_tax_table tbody tr:eq('+c_index+') td:eq(1) option:selected').val());
	    }
	});
	if (edittaxstates.length>0) {
            edittaxstates.sort();
            var duplicatestates = [];
            for (var i = 0; i < edittaxstates.length - 1; i++) {
		if (edittaxstates[i+1] == edittaxstates[i]) {
		    duplicatestates.push(edittaxstates[i]);
		}
            }
	}
	return duplicatestates;
    }
    
  $("#moresmall").on('shown.bs.collapse', function(event) {
    event.preventDefault();
    $("#smalllink").html('See less. <span class="glyphicon glyphicon-triangle-top"></span>');
  });
  $("#moresmall").on('hidden.bs.collapse', function(event) {
    event.preventDefault();
    $("#smalllink").html('See more. <span class="glyphicon glyphicon-triangle-bottom"></span>');
  });
    if($("#addcatselect").length == 0)
  {
    $("#addproddesc").focus();
  }
    else{
	$("#addcatselect").focus();
    }
  $("#openingstock").numeric();
  $("#godownflag").click(function(e){
    if ($(this).is(":checked")) {
      godownflag = 1;
      $("#godownflag").val(1);
      $("#nogodown").hide();
      $("#openingstockdiv").show();
    }
    else {
      godownflag = 0;
      $("#godownflag").val(0);
      $("#openingstockdiv").hide();
      $("#nogodown").show();
    }
  });

$(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
  event.preventDefault();
  /* Act on the event */
  $(".numtype").numeric();
});
$(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
  event.preventDefault();
  /* Act on the event */
  if ($(this).val()=="")
  {
    $(this).val(parseFloat(0).toFixed(2));
  }
  else
  {
    $(this).val(parseFloat($(this).val()).toFixed(2));
  }
});

$(document).off('blur', '#addproddesc').on('blur', '#addproddesc',function(event) {
  /* Act on the event */

  $("#addproddesc").val($("#addproddesc").val().trim());

});

    $("#adduom").change(function(event) {
  if ($("#adduom option:selected").val()!='') {
    $("#unitaddon").html($("#adduom option:selected").attr('uname'));
  }
});

$("#openingstock").focus(function(event) {
  if ($("#adduom option:selected").val()!='') {
    $("#unitaddon").html($("#adduom option:selected").attr('uname'));
  }
});
    

$(document).off('keyup').on('keyup',function(event)
{
  /* Act on the event */
  if (event.which == 45)
  {
    event.preventDefault();
    $("#apsubmit").click();
  }
});
var newuom=0;
$(document).off('focus', '#newuom').on('focus', '#newuom', function(event) {
  event.preventDefault();
  /* Act on the event */
  newuom =1;
});
var txst=0;
$(document).off('focus', '.tax_state').on('focus', '.tax_state', function(event) {
  event.preventDefault();
  /* Act on the event */
  txst =1;
});

$(document).off('blur', '.tax_state').on('blur', '.tax_state', function(event) {
  event.preventDefault();
  /* Act on the event */
  txst =0;
});

$(document).off('blur', '#newuom').on('blur', '#newuom', function(event) {
  event.preventDefault();
  /* Act on the event */
  newuom =0;
});

$("#addproddesc").keydown(function(event) {
  if (event.which==13 || event.which==9) {
    event.preventDefault();
    if ($(this).val()=="") {
      $("#product-name-blank-alert").alert();
      $("#product-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#product-name-blank-alert").hide();
      });
      return false;
    }
      $("#adduom").focus();
    }
  
  if (event.which==38) {
    event.preventDefault();
    $("#addcatselect").focus();
  }
});

/*opening stock events in addstock popup*/
$("#adduom").change(function(event) {
  if ($("#adduom option:selected").val()!='') {
    $("#unitaddon").html($("#adduom option:selected").attr('uname'));
  }
});

$("#openingstock").focus(function(event) {
  if ($("#adduom option:selected").val()!='') {
    $("#unitaddon").html($("#adduom option:selected").attr('uname'));
  }
});

 // Events for Unit of Measurement field.
    $(document).off('keydown', '#adduom').on('keydown', '#adduom', function(event) {
	// Events that happen when Enter key is pressed.
	if (event.which == 13 || event.which==9) {
	    event.preventDefault();
	    if ($("#adduom option:selected").val()==""){
		$("#uomblank-alert").alert();
		$("#uomblank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#uomblank-alert").hide();
		});
		$("#adduom").focus();
		return false;
	    }
	    $("#maxprice").focus();
	}
  else if (event.which==32)
  {
    event.preventDefault();
    $(".olduom").hide();
    $(".newuom").show();

    $("#newuom").focus();
  }
  else if (event.which==38 && (document.getElementById('adduom').selectedIndex==1||document.getElementById('adduom').selectedIndex==0)) {
    $("#addproddesc").focus().select();
  }

  /* Act on the event */
    });
    $(document).off('keydown', '#maxprice').on('keydown', '#maxprice', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    $("#saleprice").focus();
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#adduom").focus();
	}
    });
    $(document).off('keydown', '#saleprice').on('keydown', '#saleprice', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    $("#amountdiscount").focus();
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#maxprice").focus();
	}
    });
    $(document).off('keydown', '#amountdiscount').on('keydown', '#amountdiscount', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    $("#percentdiscount").focus();
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#saleprice").focus();
	}
    });
    $(document).off('keydown', '#percentdiscount').on('keydown', '#percentdiscount', function(event) {
	// Event for 'Enter' key.
	if (event.which == 13) {
	    event.preventDefault();
	    // When specs are present focus shifts to specs table.
	    if (!$("#specdiv").is(":hidden")) {
		$("#spec_table tbody tr:first td:eq(1) input:first").focus();
	    }
	    else {
		// If Tax is present focus shifts to Tax table.
		if ($("#product_tax_table").length > 0) {
		    $("#product_tax_table tbody tr:first td:eq(0) select").focus();
		}
		else{
		    // For godown keeper Tax table is not visible. Focus shifts to godown name.
		    $(".godown_name:first").focus();
		}
	    }
	}
	else if (event.which==38) {
	    event.preventDefault();
	    $("#amountdiscount").focus();
	}
    });
$("#godownflag").keydown(function(event){
  if (event.which == 13 && godownflag == 0) {
    event.preventDefault();
    $("#openingstock").focus().select();
  }
  if (event.which == 13 && godownflag == 1) {
    event.preventDefault();
    $(".godown_name").first().focus().select();
  }
  if (event.which == 38) {
    $("#product_tax_table tbody tr:last td:eq(2) input").focus();
  }
});
    
$(document).off('keydown', '#addcatselect').on('keydown', '#addcatselect',function(event) {
  if (event.which==13) {
    event.preventDefault();
    $("#addproddesc").focus().select();
    if ($(this).val()=="") {
      $("#nocategory-alert").alert();
      $("#nocategory-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#nocategory-alert").hide();
      });
    }
  }
});
$(document).off('keydown', '#newuom').on('keydown', '#newuom', function(event) {
  /* Act on the event */
  if (event.which==27)
  {
    event.preventDefault();
    $(".olduom").show();
    $(".newuom").hide();
    $("#adduom").focus();
  }
  if (event.which==13)
  {

    event.preventDefault();
    var unitname = $.trim($("#newuom").val());
    $("#adduom > option").each(function() {
      if (unitname.toLowerCase() == $.trim($(this).text()).toLowerCase()) {
        $("#duplicate-unit-alert").alert();
        $("#duplicate-unit-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-unit-alert").hide();
        });
        unitname = "";
      }
    });
    if (unitname!="") {


      $.ajax({
        url: '/product?type=uom',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"unitname": unitname},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        if (resp["gkstatus"]==0)
        {
          $(".olduom").show();
          $(".newuom").hide();
          $('#adduom').empty();
          for (uom of resp["gkresult"])
          {
            $('#adduom').append($('<option value='+uom["uomid"]+'>'+uom["unitname"]+'</option>'));
          }

            $("#adduom option").filter(function(i,e){return $(e).text()==unitname;}).prop('selected', true);
          if (!$("#specdiv").is(":hidden")) {
      $("#spec_table tbody tr:first td:eq(1) input:first").focus();
    }
	    else {
		// If Tax is present focus shifts to Tax table.
	if ($("#product_tax_table").length > 0) {
	  $("#product_tax_table tbody tr:first td:eq(0) select").focus();
	}
		else{
		    // For godown keeper Tax table is not visible. Focus shifts to godown name.
	    $(".godown_name:first").focus();
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
    }
    else
    {
      $(".olduom").show();
      $(".newuom").hide();
      $("#adduom").focus();
    }
  }

});
/*-------------------------------------Add Stock key events starts here -------------------------------------------------*/

if (sessionStorage.userrole==3){
  $("#showonlygodown").show();
}
//For shifting focus of addstock button to select godown button of pop up window

    $('#addstockmodal').on('shown.bs.modal', function() {

	$.ajax({
	    url: '/product?type=stkmodal&tax=vat',
            type: "POST",
            datatype: 'text/html',
            global: false,
            async: false,
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
	})
	    .done(function(resp) {
		$('#vatstkmodal').html(resp);
		stkhtml = $('#stocktable tbody tr:first').html();
	 $("#godown_name").focus();
         $("#godown_name").val("").focus();

     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
            });

  $(document).off("change","#godown_name").on("change", '#godown_name', function(event) {
      let selectgoid = $("#godown_name").val();
        $.ajax({
          url: '/product?type=prodlistdata',
                type: "POST",
                datatype: 'json',
                global: false,
                async: false,
                data: {"goid": selectgoid},
                beforeSend: function(xhr)
          {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
          })
          .done(function(resp) {
            proddata=resp["products"]
            $("#stocktable tbody").html("");
            $('#stocktable tbody').append('<tr>'+stkhtml+'</tr>');
            
  				  $("#prodstockid").append('<option value="" disabled hidden selected> Select Product </option>');          
            for (let i in proddata){
            $('#prodstockid').append('<option value="' + proddata[i].productcode + '">' + proddata[i].productdesc + '</option>');
           }
           });
          });

     $(document).off("change",".prodstock").on("change", '.prodstock', function(event) {
	let curindex= $(this).closest('tr').index();
	$.ajax({
      url: '/product?type=hsnuom',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'json',
	     data: {"productcode": $(this).val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp)   /*This function will return spec name of the product*/
	  {
	      	      
	      $('.unitname:eq('+ curindex +')').text(resp.gkresult.unitname);
	      $('.add_product_hsncode:eq('+ curindex +')').html(resp.gkresult.gscode);
	      
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    });
  
    $(document).off("click","#stock_done").on("click", '#stock_done', function(event) {
	var gobj = {};
	var stockallow = 1;
	 if ($.trim($("#godown_name").val())=="") {
		stockallow = 0;
		$("#emptygodownalert").alert();
  	        $("#emptygodownalert").fadeTo(2250, 500).slideUp(500, function(){
  	          $("#emptygodownalert").hide();
  	        });
  	        $("#godown_name").focus();
  	        return false;
  	    }
	$("#stocktable tbody tr").each(function(){
	    if ($.trim($(".prodstock",this).val())=="") {
		stockallow = 0;
		$("#emptyproductalert").alert();
  	        $("#emptyproductalert").fadeTo(2250, 500).slideUp(500, function(){
  	          $("#emptyproductalert").hide();
  	        });
  	        $(".prodstock",this).focus();
  	        return false;
  	    }
	    if ($.trim($(".open_stock",this).val())=="") {
		stockallow = 0;
		$("#emptyopstkalert").alert();
  	        $("#emptyopstkalert").fadeTo(2250, 500).slideUp(500, function(){
  	          $("#emptyopstkalert").hide();
  	        });
  	        $(".open_stock",this).focus();
  	        return false;
  	      }
	    if ($.trim($(".prodstock",this).val())!="") {
		if ($.trim($(".open_stock",this).val())!="" ) {
		    gobj[$(".prodstock",this).val()] = $(".open_stock",this).val(); 
		}
	    }
	});
	var goid=$("#godown_name option:selected").attr("value");
	if (stockallow == 1){
	    $.ajax({
            type: "POST",
            url: "/product?type=stockproduct",
            global: false,
            async: false,
            datatype: "json",
            data: {"goid":goid, "productdetails":JSON.stringify(gobj)},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                $("#stocksuccess").alert();
                $("#stocksuccess").fadeTo(2250, 500).slideUp(500, function(){
                    $("#stocksuccess").hide();
		    $("#vatstkmodal").html("");/*To refresh the modal after saving one or more selected products*/
		    /*For the rendering of modal after refreshing it*/
            $.ajax({
	    url: '/product?type=stkmodal&tax=vat',
            type: "POST",
            datatype: 'text/html',
            global: false,
            async: false,
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
	})
	    .done(function(resp) {
		$('#vatstkmodal').html(resp);
		stkhtml = $('#stocktable tbody tr:first').html();
	       $("#godown_name").focus();
               $("#godown_name").val("").focus();

     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
            });


              }
              else if(resp["gkstatus"]==1)
              {
                $("#uniquestockalert").alert();
                $("#uniquestockalert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#uniquestockalert").hide();
                });
                $("#openingstock").focus().select();
              }
              else
              {
                $("#failure-alert").alert();
                $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#failure-alert").hide();
                });
                $("#godownname").focus().select();
              }
            }

          });
	}
    });


//click event for '+'(add button) in 'stock Table'. 
$(document).off("click", ".stockaddbtn").on("click", ".stockaddbtn", function(event) {
  var curindex_stbtn = $(this).closest('tr').index();
  var nextindex_stbtn = curindex_stbtn + 1;
  var selecteprod = $('#stocktable tbody tr:eq(' + curindex_stbtn + ') td:eq(0) select option:selected').val();
  var numberofprod = $('#stocktable tbody tr:eq(' + curindex_stbtn + ') td:eq(0) select option:not(:hidden)').length - 1;
  if (curindex_stbtn != ($("#stocktable tbody tr").length - 1)) {
      $('#stocktable tbody tr:eq(' + nextindex_stbtn + ') td:eq(0) select').focus().select();
  } else {
      if (numberofprod >= 0) {
          if ($('#stocktable tbody tr:eq(' + curindex_stbtn + ') td:eq(0) select option:selected').val() == "") {
              $("#emptyproductalert").alert();
              $("#emptyproductalert").fadeTo(2250, 500).slideUp(500, function() {
                  $("#emptyproductalert").hide();
              });
              $('#stocktable tbody tr:eq(' + curindex_stbtn + ') td:eq(0) select').focus();
              return false;
          }
          if (numberofprod > 0) {
              $('#stocktable tbody').append('<tr>' + $(this).closest('tr').html() + '</tr>');
              $('#stocktable tbody tr:eq(' + curindex_stbtn + ') td:eq(2) span').hide('.glyphicon-plus');
            $('.unitname:eq(' + curindex_stbtn + ')').text("");

          } else {
              $("#stock_done").focus();
          }
          $(".open_stock").numeric();
          //selected product are removed from list.
          $('#stocktable tbody tr:eq(' + nextindex_stbtn + ') td:eq(0) select option[value=' + selecteprod + ']').prop('hidden', true).prop('disabled', true);
          $('#stocktable tbody tr:eq(' + nextindex_stbtn + ') td:eq(0) select option[value=""]').prop('selected', true);
          $('#stocktable tbody tr:eq(' + nextindex_stbtn + ') td:eq(0) select').focus().select();
      } else {
          $("#stock_done").focus();
      }
  }
});

/*Event for deleting a particular row*/    
    $(document).off("click",".product_del").on("click", ".product_del", function() {
	$(this).closest('tr').fadeOut(200, function(){
	    $(this).closest('tr').remove();//closest method gives the closest element specified
	    if($('#stocktable tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
		$('#stocktable tbody').append('<tr>'+stkhtml+'</tr>');
      }
      if (!($('.stockaddbtn').is(':visible'))) {
        $('#stocktable tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus stockaddbtn"></span></div>');
    }
	    $('#stocktable tbody tr:last td:eq(0) select').focus().select();
	});
	$('#stocktable tbody tr:last td:eq(0) select').select();
    });

    $(document).off("keydown", "#godown_name").on("keydown", "#godown_name", function(event){
        if (event.which == 13) {
            event.preventDefault();
            $(".prodstock:first").focus().select();
        }

    });


    $(document).off("click",".prodstock").on("click", '.prodstock', function(event) {
      if($("#prodstockid > option").length==1){
        $("#emptygodownalert").alert();
        $("#emptygodownalert").fadeTo(2250, 500).slideUp(500, function(){
          $("#emptygodownalert").hide();
        });
        $("#godown_name").focus();
     return false;
    }
    });
    
    $(document).off("keydown", ".prodstock").on("keydown", ".prodstock", function(event) {
      let curindex = $(this).closest('tr').index();
      let nextindex = curindex + 1;
    let previndex = curindex - 1;
    var selectedpro = $('#stocktable tbody tr:eq('+curindex+') td:eq(0) select option:selected').val();  
    if (event.which == 13) {
        event.preventDefault();
        if($("#prodstockid > option").length==1){
          $("#emptygodownalert").alert();
          $("#emptygodownalert").fadeTo(2250, 500).slideUp(500, function(){
            $("#emptygodownalert").hide();
          });
          $("#godown_name").focus();
       return false;
      }
        else{
          $('.open_stock:eq('+ curindex +')').focus().select();
        }
    }
    else if (event.which == 190 && event.shiftKey) {
      event.preventDefault();
      $('#stocktable tbody tr:eq(' + nextindex + ') td:eq(0) select').focus();
    } else if (event.which == 188 && event.shiftKey) {
      if (previndex > -1) {
        event.preventDefault();
        $('#stocktable tbody tr:eq(' + previndex + ') td:eq(0) select').focus();
      }
      else if (curindex == 0){
        $("#godown_name").focus();
      }
    }else if (event.which==190 && event.ctrlKey) {
      event.preventDefault();
      $('#stocktable tbody tr:eq('+ curindex +') td:eq(1) input').focus();
    }
    return false;
      });

      $(document).off("keydown", ".open_stock").on("keydown", ".open_stock", function(event) {
        let curindex = $(this).closest('tr').index();
        var selectedpro = $('#stocktable tbody tr:eq('+curindex+') td:eq(0) select option:selected').val();
        let nextindex = curindex + 1;
        let previndex = curindex - 1;
        if (event.which == 13){
            event.preventDefault();
            if (selectedpro==""){
          $("#emptyproductalert").alert();
          $("#emptyproductalert").fadeTo(2250, 500).slideUp(500, function(){
              $("#emptyproductalert").hide();
          });
          return false;
            }
            $('#stocktable tbody').append('<tr>' + $(this).closest('tr').html() + '</tr>');
               $('#stocktable tbody tr:eq('+nextindex+') td:eq(0) select option[value='+selectedpro+']').prop('hidden', true).prop('disabled', true);
            $('#stocktable tbody tr:eq('+nextindex+') td:eq(0) select option[value=""]').prop('selected', true);
            $('#stocktable tbody tr:eq(' + curindex + ') td:eq(2) span').hide('.glyphicon-plus');
            $('.unitname:eq(' + nextindex + ')').text("");
            $('.prodstock:eq('+ nextindex +')').focus().select();
        }
        else if (event.which == 190 && event.shiftKey) {
          event.preventDefault();
          $('#stocktable tbody tr:eq(' + nextindex + ') td:eq(1) input').focus();
        } else if (event.which == 188 && event.shiftKey) {
          if (previndex > -1) {
            event.preventDefault();
            $('#stocktable tbody tr:eq(' + previndex + ') td:eq(1) input').focus();
          }
        }else if (event.which==188 && event.ctrlKey) {
          event.preventDefault();
          $('#stocktable tbody tr:eq('+ curindex +') td:eq(0) select').focus();
        }
        });


  $(document).off("keyup").on("keyup", function(event) {
     if (event.which == 45) {
        event.preventDefault();
          $("#stock_done").focus();
          return false;
          }
      });
      
$("#addcatselect").change(function(event) {
  /* Act on the event */

  var catcode= $("#addcatselect option:selected").val();


  if (catcode!="")
  {

    $.ajax({
      url: '/product?type=cattax',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": catcode},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success");
      if (resp["gkresult"].length>0) {
        $('#product_tax_table tbody tr').remove();
        for (tax of resp["gkresult"]) {
          $('#product_tax_table tbody').append(taxfieldhtml);
	  $('#product_tax_table tbody tr:last td:eq(3) span').hide('.glyphicon-plus');  
          $('#product_tax_table tbody tr:last td:eq(1) select').val(tax["state"]);
          $('#product_tax_table tbody tr:last td:eq(0) select').val(tax["taxname"]);
	    if(tax["taxname"] == 'CVAT'){
	      $('#product_tax_table tbody tr:last td:eq(1) select').prop('disabled',true);
	    }  
	  $('#product_tax_table tbody tr:last td:eq(2) input').val(tax["taxrate"]);  
        }
	  $('#product_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
      }else{
	  $('#product_tax_table tbody tr').remove();
	  $('#product_tax_table tbody').append(taxfieldhtml);
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

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
    .done(function(resp)   /*This function will return spec name of the product*/
    {
      $("#specdiv").html("");
      $("#specdiv").html(resp);
      if ($("#numberofspecs").val() > 0) {
        $("#specdiv").show();
        $(".specdate").autotab('number');
        $(".specdate").numeric();
        specspresent = 1;
      }
      else {
        specspresent = 0;
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  }
  else
  {
    $("#specdiv").hide();
    $("#specifications").html("");
    $("#specshelp").show();
    $('#product_tax_table tbody tr').remove();
    $('#product_tax_table tbody').append(taxfieldhtml);

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
          $('#product_tax_table tbody tr:eq(0) td:eq(0) select').focus().select();
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
          $("#saleprice").focus();
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
    if (curindex==0 && specspresent==0) {
      $("#percentdiscount").focus();
    }
    if (curindex==0 && specspresent==1) {
      $('#spec_table tbody tr:last td:eq(1) input:first').focus().select();
    }
    if(previndex>-1 && curindex != 0)
    {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
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
    $('#product_tax_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
  }
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+previndex+') td:eq(2) input').focus().select();
  }
  else if (event.which==190 && event.ctrlKey) {
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    event.preventDefault();
  }
  else if (($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='CVAT') && event.which==13 ) {
      event.preventDefault();
      var cvat = duplicatecvat(curindex);
      if (cvat.length > 0) {
	    $("#edit_cvat-alert").alert();
	    $("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#edit_cvat-alert").hide();
	    });
	    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
	    return false;
	}
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
  }
  else if (event.which==13) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
  }
  else if (event.which==27) {
    event.preventDefault();
      if ($("#godownpresence").val()==0) {
        $("#openingstock").focus().select();
      }
      if ($("#godownpresence").val()==1)
      {
        $("#godownflag").focus().select();
      }
  }
});

$(document).off("change",".tax_name").on("change",".tax_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var previndex = curindex -1;
  if ($("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="" stateid="0" hidden disabled selected>Select State</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>').prop('disabled',false);
    if (curindex > 0) {
      for (var i = 1; i < curindex+1; i++) {
        for (var j = 0; j < curindex; j++) {
          if ($("#product_tax_table tbody tr:eq("+i+") td:eq(0) select").val() == "CVAT") {
            i = i + 1;
          }
          selectedtaxstate = $("#product_tax_table tbody tr:eq("+j+") td:eq(1) select option:selected").attr("stateid");
          $('#product_tax_table tbody tr:eq('+i+') td:eq(1) select option[stateid='+selectedtaxstate+']').prop('hidden', true).prop('disabled', true);
        }
      }
    }
  }
  else {
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
    $("#product_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>').prop('disabled','true');
  }
  selectedtaxname = $("#product_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val();
});


$(document).off("keydown",".tax_state").on("keydown",".tax_state",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if(event.which==190 && event.shiftKey)
  {
    $('#product_tax_table tbody tr:eq('+nextindex+') td:eq(1) select').focus();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex>-1)
    {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+previndex+') td:eq(1) select').focus();
    }
  }
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
  }
  else if (event.which==190 && event.ctrlKey) {
    $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    event.preventDefault();
  }
  else if (event.which==13) {
      event.preventDefault();
      var c_index = $(this).closest('tr').index();
      if($('#product_tax_table tbody tr:eq('+c_index+') td:eq(1) select option:selected').val()!= ""){
      var states = duplicatestate(c_index);
      if (states.length > 0) {
	  $("#tax-same-alert").alert();
	  $("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#tax-same-alert").hide();
	  });
	  return false;
      }
      }
      $('#product_tax_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
  }
});

    //Click event for '+' button in tax table.
    $(document).off("click",".addbtn").on("click",".addbtn",function(event){
	var curindex_addbtn = $(this).closest('tr').index();
	var nextindex_addbtn = curindex_addbtn+1;
	var previndex_addbtn = curindex_addbtn-1;
	
	if ($('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
	    $("#tax_state-blank-alert").alert();
	    $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#tax_state-blank-alert").hide();
	    });
	    $('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select').focus();
	    return false;
	}
	if (curindex_addbtn != ($("#product_tax_table tbody tr").length-1)) {
	    $('#product_tax_table tbody tr:eq('+nextindex_addbtn+') td:eq(0) select').focus().select();
	}
	else {
	    //Check duplicate "CVAT" tax.
	    var btncvat = duplicatecvat(curindex_addbtn);
	    if (btncvat.length > 0) {
		$("#edit_cvat-alert").alert();
		$("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#edit_cvat-alert").hide();
		});
		$('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(0) select').focus().select();
		return false;
	    }
	    if($('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select option:selected').val()!= ""){
	    var states = duplicatestate(curindex_addbtn);
	    if (states.length > 0) {
		$("#tax-same-alert").alert();
		$("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-same-alert").hide();
		});
		$('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(1) select').focus().select();
		return false;
            }
	    }
	    if ($('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(0) select').val()==null) {
		$("#tax-name-blank-alert").alert();
		$("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-name-blank-alert").hide();
		});
		$('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(0) select').focus();
		return false;
	    }
	    if ($('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(2) input').val()=="") {
		$("#tax-rate-blank-alert").alert();
		$("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-rate-blank-alert").hide();
		});
		$('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(2) input').focus();
		return false;
	    }
	    if (curindex_addbtn == ($("#product_tax_table tbody tr").length-1)) {
		$('#product_tax_table tbody').append(taxfieldhtml);
		$('#product_tax_table tbody tr:eq('+curindex_addbtn+') td:eq(3) span').hide('.glyphicon-plus');
		$('#product_tax_table tbody tr:eq('+nextindex_addbtn+') td:eq(0) select').focus().select();
	    }
	    
	    $(".tax_rate").numeric();
	    for (let j = 0; j < curindex_addbtn + 1; j++) {
            var selectedtax = $("#product_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
            if (selectedtax != "VAT") {
                for (let i=j+1; i<=curindex_addbtn+1;i++){
                    $('#product_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
                }
            }
        }
	    $('#product_tax_table tbody tr:eq('+nextindex_addbtn+') td:eq(0) select').focus().select();
	}
	
    });

$(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
{
  var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1+1;
  var previndex1 = curindex1-1;
  if (event.which==13) {
      if($(this).val() == ""){
	  $(this).val(0);
      }
    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val(parseFloat($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()).toFixed(2));
      event.preventDefault();
    if($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()!=""){
    if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT") {
      $("#tax_state-blank-alert").alert();
      $("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tax_state-blank-alert").hide();
      });
      $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
      return false;
    }
    }
      
    var btncvat = duplicatecvat(curindex1);
      if (btncvat.length > 0) {
	  $("#edit_cvat-alert").alert();
	  $("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#edit_cvat-alert").hide();
	  });
	  $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus().select();
	  return false;
      }
      if($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select option:selected').val()!= ""){
      var states = duplicatestate(curindex1);
      if (states.length > 0) {
	  $("#tax-same-alert").alert();
	  $("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#tax-same-alert").hide();
	  });
	  $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus().select();
	  return false;
      }
      }

      if($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) option:selected').val()=="" && $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) option:selected').val()=="" && $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()==0.00){
	  if($("#godownflag").is(":visible")){
	      $("#godownflag").focus().select();
	  }else{
	      $("#openingstock").focus();
	  }
      }
      else if (curindex1 != ($("#product_tax_table tbody tr").length-1)) {
	  $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
      if ($('#product_tax_table tbody tr:eq('+curindex1+') option:selected').val()=="") {
        $("#tax-name-blank-alert").alert();
        $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#tax-name-blank-alert").hide();
        });
        $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
        return false;
      }
	if ($('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="" || $('#product_tax_table tbody tr:eq('+ curindex1 +') td:eq(2) input').val() == 0.00) {
        $("#tax-rate-blank-alert").alert();
        $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#tax-rate-blank-alert").hide();
        });
        $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
        return false;
      }

	$('#product_tax_table tbody').append(taxfieldhtml);
	$('#product_tax_table tbody tr:eq('+curindex1+') td:eq(3) span').hide('.glyphicon-plus');
	$('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
	$(".tax_rate").numeric();
	for (let j = 0; j < curindex1 + 1; j++) {
            var selectedtax = $("#product_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
            if (selectedtax != "VAT") {
                for (let i=j+1; i<=curindex1+1;i++){
                    $('#product_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').remove();
                }
            }
        }
	
	$('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();	
    }
  }
  else if(event.which==190 && event.shiftKey)
  {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex1>-1)
    {
      event.preventDefault();
      $('#product_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus().select();
    }
  }
  else if (event.ctrlKey && event.which==188) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#product_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
  }
  else if (event.which==27) {
    event.preventDefault();
      if ($("#godownpresence").val()==0) {
        $("#openingstock").focus().select();
      }
      if ($("#godownpresence").val()==1)
      {
        $("#godownflag").focus().select();
      }
  }

});
$(document).off("click",".tax_del").on("click", ".tax_del", function() {
  $(this).closest('tr').fadeOut(200, function(){
    $(this).closest('tr').remove();	 //closest method gives the closest element specified
    if($('#product_tax_table tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
	$('#product_tax_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	$(".tax_state").prop('disabled',false);
    }
    if(!($('.addbtn').is(':visible'))){
	$('#product_tax_table tbody tr:last td:eq(3)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus addbtn"></span></div>');
    }
    $('#product_tax_table tbody tr:last td:eq(0) select').focus().select();
  });
  $('#product_tax_table tbody tr:last td:eq(0) select').select();
});


    
/* -----------------------Tax key events end----------------------------------------- */
$(document).off('keydown', '#openingstock').on('keydown', '#openingstock', function(event) {
  if (event.which == 13) {
    event.preventDefault();
    $("#apsubmit").click();
  }
  else if (event.which == 38) {
    $("#godownflag").focus().select();
  }
  else if (event.which == 173) {
    event.preventDefault();
  }
   else if(event.which==27){
	event.preventDefault();
	$("#apsubmit").focus().select();
       } 
});    
/* -----------------------Godown Key events start here----------------------------------------- */
$(document).off("change",".godown_name").on("change",".godown_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  selectedgodown = $('#godown_ob_table tbody tr:eq('+curindex+') td:eq(0) select').val();
});

$(document).off("keyup",".godown_name").on("keyup",".godown_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if (event.which==188 && event.shiftKey)
  {
    if (curindex==0) {
      if($("#godownflag").is(":hidden")){
	      $("#adduom").focus();
	  }
	else{
	    $("#godownflag").focus().select();
    }
    }
    if(previndex>-1 && curindex != 0)
    {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+previndex+') td:eq(0) select').focus().select();
    }
  }
});

$(document).off("keydown",".godown_name").on("keydown",".godown_name",function(event)
{
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if(event.which==190 && event.shiftKey)
  {
    event.preventDefault();
    $('#godown_ob_table tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
  }
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    $('#godown_ob_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
  }
  else if (event.which==190 && event.ctrlKey) {
    $('#godown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    event.preventDefault();
  }
  else if (event.which==13) {
    event.preventDefault();
    $('#godown_ob_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
  }
});

    //click event for '+' button in godown table.
    $(document).off("click",".goaddbtn").on("click",".goaddbtn",function(event){
	var curindex_goaddbtn = $(this).closest('tr').index();
	var nextindex_goaddbtn = curindex_goaddbtn+1;
	var previndex_goaddbtn = curindex_goaddbtn-1;
	var selectedgodown = $('#godown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(0) select option:selected').val();
	var numberofgodowns = $('#godown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(0) select option:not(:hidden)').length-1;

	if (curindex_goaddbtn != ($("#godown_ob_table tbody tr").length-1)) {
	    $('#godown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select').focus().select();
	}
	else {
	    if (numberofgodowns >= 0) {
		if ($('#godown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(0) select option:selected').val()=="") {
		    $("#godown-blank-alert").alert();
		    $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#godown-blank-alert").hide();
		    });
		    $('#godown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(0) select').focus();
		    return false;
		}
		if ($('#godown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(1) input').val()=="") {
		    $("#os-blank-alert").alert();
		    $("#os-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#os-blank-alert").hide();
		    });
		    $('#godown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(1) input').focus();
		    return false;
		}
		if (numberofgodowns > 0) {
		    $('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
		    $('#godown_ob_table tbody tr:eq('+curindex_goaddbtn+') td:eq(2) span').hide('.glyphicon-plus');
		}else{
		    $("#apsubmit").focus();
		}
		$(".godown_ob").numeric();
		$('#godown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select option[value='+selectedgodown+']').prop('hidden', true).prop('disabled', true);
		$('#godown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select option[value=""]').prop('selected', true);
		$('#godown_ob_table tbody tr:eq('+nextindex_goaddbtn+') td:eq(0) select').focus().select();
	    }else{
		$("#apsubmit").focus();
	    }
	}
    });
    

$(document).off("keydown",".godown_ob").on("keydown",".godown_ob",function(event)
{
  var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1+1;
  var previndex1 = curindex1-1;
  var selectedgodown = $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val();
  var numberofgodowns = $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:not(:hidden)').length-1;
  if (event.which==13) {
    event.preventDefault();
    if (curindex1 != ($("#godown_ob_table tbody tr").length-1)) {
      $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
    }
    else {
      if (numberofgodowns >= 0) {
        if ($('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#godown-blank-alert").alert();
          $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#godown-blank-alert").hide();
          });
          $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }
        if ($('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').val()=="") {
          $("#os-blank-alert").alert();
          $("#os-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#os-blank-alert").hide();
          });
          $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
          return false;
        }
	if (numberofgodowns > 0) {
            $('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
	    $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(2) span').hide('.glyphicon-plus');  
	}else{
	    $("#apsubmit").focus();
	}
	$(".godown_ob").numeric();
        $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedgodown+']').prop('hidden', true).prop('disabled', true);
	$('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value=""]').prop('selected', true);
        $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {
        $("#apsubmit").focus();
      }
    }
  }
  else if(event.which==190 && event.shiftKey)
  {
    event.preventDefault();
    $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex1>-1)
    {
      event.preventDefault();
      $('#godown_ob_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
    }
  }
  else if (event.ctrlKey && event.which==188) {
    event.preventDefault();
    $('#godown_ob_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#godown_ob_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
  }
  else if (event.which==27) {
    event.preventDefault();
    $("#apsubmit").focus();
  }
  else if (event.which==173) {
    event.preventDefault();
  }
});
$(document).off("click",".godown_del").on("click", ".godown_del", function() {
  $(this).closest('tr').fadeOut(200, function(){
    $(this).closest('tr').remove();	 //closest method gives the closest element specified
    if($('#godown_ob_table tbody tr').length == 0){// After deleting 0th row gives field to adding new gstin.
	$('#godown_ob_table tbody').append('<tr>'+$(this).closest('tr').html()+'</tr>');
    }
    if(!($('.goaddbtn').is(':visible'))){
	$('#godown_ob_table tbody tr:last td:eq(2)').append('<div style="text-align: center;"><span class="glyphicon glyphicon glyphicon-plus goaddbtn"></span></div>');
    }
    $('#godown_ob_table tbody tr:last td:eq(0) select').focus().select();
  });
  $('#godown_ob_table tbody tr:last td:eq(0) select').select();
});
/* -----------------------Godown Key events end here----------------------------------------- */
/*
Adding godown.
*/
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
              $("#apsubmit").click();
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
              $("#newgodownadded").show();
              $('#godown_ob_table tbody tr').each(function(){
                var curindex2 = $(this).closest('tr').index();
                for (i in newgodowns ) {
                  if (newgodowns[i].godownname == sessionStorage.newgodownname && newgodowns[i].godownaddress == sessionStorage.newgodownaddress) {
                    $('#godown_ob_table tbody tr:eq('+curindex2+') td:eq(0) select').append('<option value="' + newgodowns[i].godownid + '">' + newgodowns[i].godownname + '(' + newgodowns[i].godownaddress + ')</option>');
                  }
                }
              });
	      $('#godown_ob_table tbody tr:last td:eq(0) select option:last').prop("selected", "true");
	      if (godownflag == 0) {
		$("#godownflag").focus().select();
	      }
	      else {
		$('#godown_ob_table tbody tr:last td:eq(1) input').focus().select();
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

    

$(document).off("click","#apsubmit").on("click", '#apsubmit', function(event) {
  event.preventDefault();
  /* Act on the event */
  if ($("#addproddesc").val()=="")
  {
    $('.modal-backdrop').remove();
    $("#product-name-blank-alert").alert();
    $("#product-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#product-name-blank-alert").hide();
    });
    $("#addproddesc").focus();
    $("#addproddesc").select();
    return false;
  }
  if ($("#adduom option:selected").val()=="")
  {
    $('.modal-backdrop').remove();
    $("#uomblank-alert").alert();
    $("#uomblank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#uomblank-alert").hide();
    });
    $("#adduom").focus();
    $("#adduom").select();
    return false;
  }
  if ($("#openingstock").val()=="")
  {
    $('.modal-backdrop').remove();
    $("#openingstock").val("0.00");
    return false;
  }
  if ($(".godown_ob").val()=="") {
    $('.modal-backdrop').remove();
    $(this).val("0.00");
  }
  var allow=true;
  $("#godown_ob_table tbody tr").each(function() {
    var goid = $(".godown_name", this).val();
    var ccount=0;
    $("#godown_ob_table tbody tr").each(function() {
      if(goid==$(".godown_name", this).val()){
        ccount =ccount +1;
      }
    });
    if (ccount>1) {
      allow=false;
    }
    else {
      allow=true;
    }
  });
  if (!allow) {
    $("#godown-same-alert").alert();
    $("#godown-same-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#godown-same-alert").hide();
    });
    return false;
  }

  var specs = {};      /*This is spec dictioary having spcode as a key and specval as its value*/
  $("#spec_table tbody tr").each(function(){
    if ($(".spec_value",this).hasClass('datevalue')) {
      $(".specdate").each(function() {
        if ($(this).hasClass('specday')) {
          specday = $(this).val(); //Storing specday
        }
        if ($(this).hasClass('specmonth')) {
          specmonth = $(this).val(); //SToring specmonth
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


    var taxes = []; //Taxes list to store dictionaries created
    var edittaxstates = [];
    $("#product_tax_table tbody tr").each(function(){
	var cur_index = $(this).closest('tr').index();
	var savecvat = duplicatecvat(cur_index);
	if (savecvat.length > 0) {
	    $("#edit_cvat-alert").alert();
	    $("#edit_cvat-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#cvat-alert").hide();
	    });
	    $('#product_tax_table tbody tr:eq('+cur_index+') td:eq(0) select').focus();
	    allow = false;
	}
	if($('#product_tax_table tbody tr:eq('+cur_index+') td:eq(1) option:selected').val()!="" && $('#product_tax_table tbody tr:eq('+ cur_index +') td:eq(1) select option:selected').attr("stateid") > 1){
	    var savestates = duplicatestate(cur_index);
	    if (savestates.length > 0) {
		$("#tax-same-alert").alert();
		$("#tax-same-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#tax-same-alert").hide();
		});
		$('#product_tax_table tbody tr:eq('+cur_index+') td:eq(1) select').focus();
		allow = false;
	    }
	}

	if($('#product_tax_table tbody tr:eq('+ cur_index +') td:eq(0) select option:selected').val()!=""){
    if($('#product_tax_table tbody tr:eq('+ cur_index +') td:eq(1) select option:selected').attr("stateid") < 1 && selectedtaxname == "VAT"){
	$("#tax_state-blank-alert").alert();
	$("#tax_state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	    $("#tax_state-blank-alert").hide();
	});
	$('#product_tax_table tbody tr:eq('+cur_index+') td:eq(1) select').focus();
	allow = false;
    }
	    else if ($('#product_tax_table tbody tr:eq('+cur_index+') td:eq(2) input').val()=="" || $('#product_tax_table tbody tr:eq('+ cur_index +') td:eq(2) input').val() == 0.00) {
            $("#tax-rate-blank-alert").alert();
            $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#tax-rate-blank-alert").hide();
            });
            $('#product_tax_table tbody tr:eq('+cur_index+') td:eq(2) input').focus();
            allow = false;
      }
    }
    var obj = {}; //A dictionary created
    if ($.trim($(".tax_name",this).val())!="" && $.trim($(".tax_rate",this).val())!="" ) {
      //For each tax its details are being stored in a dictionary
	obj.taxname =$.trim($("td:eq(0) select option:selected", this).val());
	obj.state = $.trim($("td:eq(1) select option:selected", this).val());
	obj.taxrate =$.trim($("input", this).val());
	taxes.push(obj);

	/**obj.taxname = $(".tax_name",this).val();
      obj.state = $(".tax_state",this).val();
      obj.taxrate = $(".tax_rate",this).val();
      taxes.push(obj);**/
    }
  });
    
  var gobj = {}; // Creating a dictionary for storing godown wise opening stock
  $("#godown_ob_table tbody tr").each(function(){
    if ($.trim($(".godown_name",this).val())!="") {
	if ($.trim($(".godown_ob",this).val())!="" ) {
        gobj[$(".godown_name",this).val()] = $(".godown_ob",this).val(); //Godown id is key and opening stock is value
      }
    }
  });
  var addformdata = $("#addprodform").serializeArray();

  addformdata.push({name: 'taxes', value: JSON.stringify(taxes)});
  addformdata.push({name: 'specs', value: JSON.stringify(specs)});
  if ($("#godownflag").val() == 1) {
    addformdata.push({name: 'godowns', value: JSON.stringify(gobj)}); //Pushing taxes and specs into addformdata

  }
  if(allow == true){
  $.ajax({
    url: '/product?type=save',
    type: 'POST',
    global: false,
    async: false,
    datatype: 'json',
    data: addformdata,
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
      if (resp["gkstatus"] ==0) {
      $("#addproduct-success-alert").alert();
          $("#addproduct-success-alert").fadeTo(2250, 500).slideUp(500, function(){
              if (parseInt($("#extrabuttons").val()) == 1) {
              $('.modal-backdrop').remove();
              if(sessionStorage.invflag==1){
		  $("#product").click();
	      }
	      else{
		  $("#productinmaster").click();
	      }
          }
          else{
              $("#selectedproductid").val(resp.gkresult);
              $("#addproductmodal").modal("hide");
              $('.modal-backdrop').remove();
          }
        $("#addproduct-success-alert").hide();
      });
      return false;
    }
    else if (resp["gkstatus"] ==1)
    {
      $('.modal-backdrop').remove();
      $("#duplicateproducterror-alert").alert();
      $("#duplicateproducterror-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#duplicateproducterror-alert").hide();
      });
      $("#addproddesc").focus();
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
  }
});

$(document).on('click', '#apreset', function(event) {
  event.preventDefault();
  /* Act on the event */
  $("#addproduct").click();
});
    
$(document).on('click', '#stockreset', function(event) {
  event.preventDefault();
    $("#stocktable tbody").html("");
    $('#stocktable tbody').append('<tr>'+stkhtml+'</tr>');
    $("#godown_name").val("").focus();
});

});


