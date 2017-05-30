/*
   Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
   "Rohini Baraskar" <robaraskar@gmail.com>
   "Mohd. Talha Pawaty" <mtalha456@gmail.com>
   "Abhijith Balan" <abhijithb21@openmailbox.org>
   "Bhavesh Bhawadhane" <bbhavesh07@gmail.com>
   "Sachin Patil" <sachin619patil@rediffmail.com>
   "Prajkta Patkar" <prajakta@dff.org.in>
 */
$(document).ready(function() {
  /*
     This is a script for creating transfernote.
     It sends transfernote number, date, details of godowns, products to be transfered and optionally details of transportation and the person creating the note. It also does validations and displays alerts. The note can also be printed soon after it is saved using the save and print button.
   */
  $('.modal-backdrop').remove(); //Removes modal backdrop.
  $('.tndate').autotab('number'); //Autotab in date fields.
  $("#transfernote_no").focus(); //Autofocus on transfernote number.
  //Prevents alphabets in numeric fields.
  $("#tn_date").numeric();
  $("#tn_month").numeric();
  $("#tn_year").numeric();
  $("#no_of_packet").numeric();
  //Formatting date into YYYYMMDD format.
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  $('.transfernote_product_quantity').numeric({ negative: false}); //Prevents negative values in the field.
  //Key events for transfer note. Focus moves forward on pressing 'Enter' key and backward on 'Up' arrow.
  $("#transfernote_no").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_date").focus().select();
    }
  });

  $("#tn_date").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_month").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#transfernote_no").focus().select();
    }
  });

  $("#tn_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_date").focus().select();
    }
  });
  $("#tn_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_from_godown").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_month").focus().select();
    }
  });

  $("#transport_mode").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#name_issuer").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#no_of_packet").focus().select();
    }
  });

  $("#tn_from_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      if ($.trim($('#tn_from_godown').val())=="") {
        $("#godown-blank-alert").alert();
        $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#godown-blank-alert").hide();
        });
        $('#tn_from_godown').focus();
        return false;
      }
      else {
        $("#tn_to_godown").focus().select();
      }
    }
    if (event.which==38 && (document.getElementById('tn_from_godown').selectedIndex==1||document.getElementById('tn_from_godown').selectedIndex==0)) {
      event.preventDefault();
      $("#tn_year").focus().select();
    }
  });

  $("#tn_to_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#transfernote_product_table tbody tr:first td:eq(0) select').focus();
    }
    if (event.which==38 && (document.getElementById('tn_to_godown').selectedIndex==1||document.getElementById('tn_to_godown').selectedIndex==0)) {
      event.preventDefault();
      $("#tn_from_godown").focus().select();
    }
  });

  $("#no_of_packet").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#transport_mode").focus();
    }
  });
  $("#name_issuer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#designation").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#transport_mode").focus().select();
    }
  });

  $("#designation").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_duedate").click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#name_issuer").focus().select();
    }
  });

  $("#tn_duedate").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_duemonth").click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#designation").focus().select();
    }
  });
  
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
  $("#tn_date").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#tn_month").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#tn_year").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#transfernote_save").click();
      event.preventDefault();
      return false;
    }
  });
  //AJAX request to get godown details.
  //Dropdown list for selecting godown is populated with available godowns
  $("#tn_from_godown").change(function(event) {
    $.ajax({
      url: '/transfernotes?action=getgodowns',
      type: 'POST',
      dataType: 'json',
      async : false,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
     .done(function(resp) {
       if (resp["gkstatus"]==0) {
         $("#tn_to_godown").html(''); //Empty the dropdown
	 //Filling the dropdown by appending options. Godown id is set as value of each option and godown name and address are displayed.
         $("#tn_to_godown").append('<option value=""  disabled  hidden selected>Select Godown</option>');
         for (godown of resp["godowns"]) {
           if(godown.goid != $("#tn_from_godown option:selected").val()){
             $("#tn_to_godown").append('<option value="' + godown.goid + '">' +godown.goname+ '('+ godown.goaddr +')' + '</option>');
           }
         }
	 //Getting list of products in selected godown.
	 //ID of selected godown is sent to receive a list of products.
         $.ajax({
           url: '/transfernotes?action=getprod',
           type: 'POST',
           dataType: 'json',
           async : false,
           data: {"godownid":$("#tn_from_godown option:selected").val()},
           beforeSend: function(xhr)
           {
             xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
           }
         })
          .done(function(resp) {
            if (resp["gkstatus"]==0) {
              $('#transfernote_product_table tbody').html(''); //Table with product details is emptied.
	      //A row with a dropdown list of products to choose from and a blank input field for entering quantity is added. In each option tag product code is set as value and produt description is displayed.
              $('#transfernote_product_table tbody').append('' +
							    '<tr>' +
							    '<td class="col-xs-7">' +
							    '<select class="form-control input-sm product_name">' +
							    '<option value="" disabled hidden selected>Select Product</option>' +
							    '</select>' +
							    '</td>' +
							    '<td class="col-xs-4">' +
							    '<div class="input-group">' +
							    '<input type="text" class="transfernote_product_quantity form-control input-sm text-right" value="">' +
							    '<span class="input-group-addon input-sm" id="unitaddon"></span>' +
							    '</div>' +
							    '</td>' +
							    '<td class="col-xs-1">' +
							    '</td>' +
							    '</tr>');
              for (product of resp["products"]) {
		$('#transfernote_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
              }
              $('.transfernote_product_quantity').numeric({ negative: false});
            }
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });
       }
     })
     .fail(function() {
       console.log("error");
     })
     .always(function() {
       console.log("complete");
     });
  });
  //When reset is clicked the page is reloaded.
  $("#transfernote_reset").click(function(event) {
    $("#transfernote_create").click();
  });

  //Key events for transfernote product table are written below. Convention in this project is to use angle brackets along with Ctrl key or Shift key to navigate within tables.
  
  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
    {
      var curindex = $(this).closest('tr').index();
      var nextindex = curindex+1;
      var previndex = curindex-1;
      if (event.which==13) {
	event.preventDefault();
	$('#transfernote_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
      }
      else if(event.which==190 && event.shiftKey)
	{
	  $('#transfernote_product_table tbody tr:eq('+nextindex+') td:eq(0) select').focus();
	}
      else if (event.which==188 && event.shiftKey)
	{
	  if(previndex>-1)
	    {
              event.preventDefault();
              $('#transfernote_product_table tbody tr:eq('+previndex+') td:eq(0) select').focus();
	    }
	  if (curindex==0) {
            event.preventDefault();
            $("#no_of_packet").focus().select();
	  }
	}
      else if (event.which==188 && event.ctrlKey) {
	event.preventDefault();
	if (curindex==0) {
          event.preventDefault();
          $("#no_of_packet").focus().select();
	}
	else {
          $('#transfernote_product_table tbody tr:eq('+previndex+') td:eq(1) input').focus().select();
	}
      }
      else if (event.which==190 && event.ctrlKey) {
	$('#transfernote_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
	event.preventDefault();
      }
    });

  $(document).off("change",".product_name").on("change",".product_name",function(event)
    {
      var productcode = $(this).find('option:selected').val(); //Retreiving product code from selected option.
      var curindex = $(this).closest('tbody tr').index();  //Index value used for checking the current row
      //For each product selected its unit of measurement is displayed in the input field for quantity.
      $.ajax({
	url: '/invoice?action=getproduct',
	type: 'POST',
	dataType: 'json',
	async : false,
	data : {"productcode":productcode},
	beforeSend: function(xhr)
	{
	  xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	}
      })
       .done(function(resp) {
	 console.log("success");
	 if (resp["gkstatus"]==0) {
	   $('#transfernote_product_table tbody tr:eq('+curindex+') td:eq(1) span').text(resp["unitname"]);
	 }

       })
       .fail(function() {
	 console.log("error");
       })
       .always(function() {
	 console.log("complete");
       });
    });
  //Key event for product quantity. Note that here a new row is added when 'Enter' key is pressed.
  $(document).off("keydown",".transfernote_product_quantity").on("keydown",".transfernote_product_quantity",function(event)
    {
      var curindex1 = $(this).closest('tr').index();
      var nextindex1 = curindex1+1;
      var previndex1 = curindex1-1;
      if (event.which==13) {
	event.preventDefault();

	//Alerts to be displayed as a part of validations
	if ($('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(1) input').val()=="") {

  	  $("#quantity-blank-alert").alert();
  	  $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
  	    $("#quantity-blank-alert").hide();


  	  });
	  $('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
	  return false;
	}
	else {
	  $('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(1) input').focus().select();
	}



	if (curindex1 != ($("#transfernote_product_table tbody tr").length-1)) {
          $('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
	}
	else {
          if ($('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
            $("#product-blank-alert").alert();
            $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#product-blank-alert").hide();
            });
            $('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
            return false;
          }

	  //Getting product details to fill the dropdown list in new row.
	  
          $.ajax({
            url: '/transfernotes?action=getprod',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {"godownid":$("#tn_from_godown option:selected").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
          })
           .done(function(resp) {
             if (resp["gkstatus"]==0) {
               $('#transfernote_product_table tbody').append('<tr>'+
							     '<td class="col-xs-7">'+
							     '<select class="form-control input-sm product_name"></select>'+
							     '</td>'+
							     '<td class="col-xs-4">'+
							     '<div class="input-group">'+
							     '<input type="text" class="transfernote_product_quantity form-control input-sm text-right" value="">'+
							     '<span class="input-group-addon input-sm" id="unitaddon"></span>'+
							     '</div>'+
							     '</td>'+
							     '<td class="col-xs-1">'+
							     '<a href="#" class="product_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
							     '</td>'+
							     '</tr>');
               for (product of resp["products"]) {
		 $('#transfernote_product_table tbody tr:last td:eq(0) select').append('<option value="' + product.productcode + '">' +product.productdesc+ '</option>');
               }
               $('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus();
               $('.transfernote_product_quantity').numeric({ negative: false});
               $(".product_name").change();
             }
           })
           .fail(function() {
             console.log("error");
           })
           .always(function() {
             console.log("complete");
           });

	}
      }

      else if(event.which==190 && event.shiftKey)
	{
	  event.preventDefault();
	  $('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(1) input').focus().select();
	}
      else if (event.which==188 && event.shiftKey)
	{
	  if(previndex1>-1)
	    {
              event.preventDefault();
              $('#transfernote_product_table tbody tr:eq('+previndex1+') td:eq(1) input').focus().select();
	    }
	  if (curindex1==0) {
            event.preventDefault();
            $("#no_of_packet").focus().select();
	  }
	}
      else if (event.which==190 && event.ctrlKey) {
	$('#transfernote_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
	event.preventDefault();
      }
      else if (event.ctrlKey && event.which==188) {
	$('#transfernote_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
	event.preventDefault();
      }
      else if (event.which==27) {
	event.preventDefault();
	$('#no_of_packet').focus().select();
      }
    });

  //Deletes a row if.

  $(document).off("click",".product_del").on("click", ".product_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element productified
      $('#transfernote_product_table tbody tr:last td:eq(0) input').focus().select();
    });
    $('#transfernote_product_table tbody tr:last td:eq(0) input').select();
  });

  //Click event for saving transfer note.
  
  $("#transfernote_save").click(function(event) {
    var stock = 0; //Flag to check if quantity entered is less than or equal to available stock.
    //Getting date stored in session storage.
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    month += 1;
    var date = today.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if(date < 10) {
      date = "0" + date;
    }
    var reversedate = year + "-" + month + "-" + date;

    //Alerts that are displayed when when some fields are empty.
    if ($.trim($('#transfernote_no').val())=="") {
      $("#tnno-blank-alert").alert();
      $("#tnno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tnno-blank-alert").hide();
      });
      $('#transfernote_no').focus();
      return false;
    }
    if ($.trim($('#tn_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#tn_date').focus();
      return false;
    }
    if ($.trim($('#tn_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#tn_month').focus();
      return false;
    }
    if ($.trim($('#tn_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-blank-alert").hide();
      });
      $('#tn_year').focus();
      return false;
    }
    if(!Date.parseExact($("#tn_date").val()+$("#tn_month").val()+$("#tn_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#tn_date').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#tn_year").val()+$("#tn_month").val()+$("#tn_date").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#tn_date').focus().select();
      return false;
    }
    if ($.trim($('#tn_from_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-blank-alert").hide();
      });
      $('#tn_from_godown').focus();
      return false;
    }
    if ($.trim($('#tn_to_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-blank-alert").hide();
      });
      $('#tn_to_godown').focus();
      return false;
    }
    if ($.trim($('#tn_from_godown').val())==$('#tn_to_godown').val()) {
      $("#godown-same-alert").alert();
      $("#godown-same-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#godown-same-alert").hide();
      });
      $('#tn_from_godown').focus();
      return false;
    }
    //Validations for product details.
    var products = [];
    for (var i = 0; i < $("#transfernote_product_table tbody tr").length && stock==0; i++) {
      if ($("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
        $("#product-blank-alert").alert();
        $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
        });
        $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
        return false;
      }
      if ($("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
        $("#quantity-blank-alert").alert();
        $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
        });
        $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
        return false;
      }

      //AJAX for checking available stock in godown from which stock is moved.
      //Godown id, current date and product code are sent to receive available quantity of each selected product in the godown.
      
      $.ajax(
        {
          type: "POST",
          url: "/transfernotes?type=stock",
          global: false,
          async: false,
          datatype: "json",
          data: {"endDate": reversedate, "goid": $("#tn_from_godown option:selected").val(), "productcode": $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        })
       .done(function(resp)
         {
	   //Quantity is compared with available stock. Stock flag is set to 1 if it exceeds stock.
           if (parseInt($("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val()) > parseInt(resp["gkresult"])) {
             $("#quantity-excess-alert").alert();
             $("#quantity-excess-alert").fadeTo(2250, 500).slideUp(500, function(){
               $("#quantity-excess-alert").hide();
             });
             $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
             stock = 1;
             return false;
           }
         }
       );

      //A dictionary is made to store product code and quantity in this format - {"productcode":value, "qty":value}
      
      var obj = {};
      obj.productcode = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj); //Each dictioary is added to a list, product.
    }

    if (stock == 0) {
      event.preventDefault();
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');
      //Modal that seeks confirmation from user before saving
      $('#confirm_yes').modal('show').one('click', '#tn_save_yes', function (e)
	{
	  $.ajax({
	    url: '/transfernotes?action=save',
	    type: 'POST',
	    dataType: 'json',
	    async : false,
	    data: {
	      "transfernoteno":$("#transfernote_no").val(),
	      "transfernotedate":$("#tn_year").val()+'-'+$("#tn_month").val()+'-'+$("#tn_date").val(),
	      "fromgodown":$("#tn_from_godown option:selected").val(),

	      "togodown":$("#tn_to_godown option:selected").val(),
	      "transportationmode":$("#transport_mode").val(),
	      "nopkt":$("#no_of_packet").val(),
	      "issuername":$("#name_issuer").val(),
	      "designation":$("#designation").val(),
	      "products":JSON.stringify(products)},
	    beforeSend: function(xhr)
	    {
              xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    },
	    success: function(resp) {
	      console.log(resp["gkstatus"]);
	      if(resp["gkstatus"] == 0){
		$("#transfernote_create").click();
		$("#success-alert").alert();
		$("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#success-alert").hide();
		});
	      }
	      if(resp["gkstatus"] == 1){
		$("#transfernote_no").focus();
		$("#duplicate-alert").alert();
		$("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
		  $("#duplicate-alert").hide();
		});
	      }
	    }

	  });
	});
    }
  });

  //Focus events on opening and closing of modals.
  $("#confirm_yes").on('shown.bs.modal', function(event) {
    $("#tn_save_no").focus();

  });
  $("#confirm_yes").on('hidden.bs.modal', function(event) {
    $("#transfernote_no").focus();
  });

  //Click event for saving and printing. Documentation for saving click event for saving.
  
  $("#tn_saveprint").click(function(event) {
    var stock = 0;
    var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    month += 1;
    var date = today.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if(date < 10) {
      date = "0" + date;
    }
    var reversedate = year + "-" + month + "-" + date;
    if ($.trim($('#transfernote_no').val())=="") {
      $("#tnno-blank-alert").alert();
      $("#tnno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#tnno-blank-alert").hide();
      });
      $('#transfernote_no').focus();
      return false;
    }
    if ($.trim($('#tn_date').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#date-blank-alert").hide();
      });
      $('#tn_date').focus();
      return false;
    }
    if ($.trim($('#tn_month').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#date-blank-alert").hide();
      });
      $('#tn_month').focus();
      return false;
    }
    if ($.trim($('#tn_year').val())=="") {
      $("#date-blank-alert").alert();
      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#date-blank-alert").hide();
      });
      $('#tn_year').focus();
      return false;
    }
    if(!Date.parseExact($("#tn_date").val()+$("#tn_month").val()+$("#tn_year").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#date-alert").hide();
      });
      $('#tn_date').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#tn_year").val()+$("#tn_month").val()+$("#tn_date").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#between-date-alert").hide();
      });
      $('#tn_date').focus().select();
      return false;
    }
    if ($.trim($('#tn_from_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#godown-blank-alert").hide();
      });
      $('#tn_from_godown').focus();
      return false;
    }
    if ($.trim($('#tn_to_godown').val())=="") {
      $("#godown-blank-alert").alert();
      $("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#godown-blank-alert").hide();
      });
      $('#tn_to_godown').focus();
      return false;
    }
    if ($.trim($('#tn_from_godown').val())==$('#tn_to_godown').val()) {
      $("#godown-same-alert").alert();
      $("#godown-same-alert").fadeTo(2250, 500).slideUp(500, function(){
	$("#godown-same-alert").hide();
      });
      $('#tn_from_godown').focus();
      return false;
    }



    var products = [];
    for (var i = 0; i < $("#transfernote_product_table tbody tr").length; i++) {
      if ($("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
	$("#product-blank-alert").alert();
	$("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#product-blank-alert").hide();
	});
	$("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
	return false;
      }
      if ($("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val()=="") {
	$("#quantity-blank-alert").alert();
	$("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#quantity-blank-alert").hide();
	});
	$("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
	return false;
      }
      $.ajax(
        {
          type: "POST",
          url: "/transfernotes?type=stock",
          global: false,
          async: false,
          datatype: "json",
          data: {"endDate": reversedate, "goid": $("#tn_from_godown option:selected").val(), "productcode": $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        })
       .done(function(resp)
         {
           if (parseInt($("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val()) > parseInt(resp["gkresult"])) {
             $("#quantity-excess-alert").alert();
             $("#quantity-excess-alert").fadeTo(2250, 500).slideUp(500, function(){
               $("#quantity-excess-alert").hide();
             });
             $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").focus();
             stock = 1;
             return false;
           }
         }
       );
      var obj = {};
      obj.productcode = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
      obj.qty = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val();
      products.push(obj);
    }
    if (stock == 0) {
      event.preventDefault();
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');
      $('#confirm_yestnprint').modal('show').one('click', '#tn_save_yesprint', function (e)
	{
	  $.ajax({
	    url: '/transfernotes?action=save',
	    type: 'POST',
	    dataType: 'json',
	    async : false,
	    data: {
	      "transfernoteno":$("#transfernote_no").val(),
	      "transfernotedate":$("#tn_year").val()+'-'+$("#tn_month").val()+'-'+$("#tn_date").val(),
	      "fromgodown":$("#tn_from_godown option:selected").val(),
	      "togodown":$("#tn_to_godown option:selected").val(),
	      "transportationmode":$("#transport_mode").val(),
	      "nopkt":$("#no_of_packet").val(),
	      "issuername":$("#name_issuer").val(),
	      "designation":$("#designation").val(),
	      "products":JSON.stringify(products)},
	    beforeSend: function(xhr)
	    {
	      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
	    },
	  })
	   .done(function(resp) {
	     console.log("success");
	     if(resp["gkstatus"] == 0){
	       printset = [];
	       for (var i = 0; i < $("#transfernote_product_table tbody tr").length; i++) {
		 var obj = {};
		 obj.productdesc = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text();
		 obj.qty = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) input").val();
		 obj.unitname = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1) span").text();

		 printset.push(obj);
	       }

	       //AJAX that loads print preview of transfernote.  All data filled in by the user is sent so that it is displayed in the preview.
	       $.ajax({
		 url: '/transfernotes?action=print',
		 type: 'POST',
		 dataType: 'html',
		 data: {
		   "transfernoteno":$("#transfernote_no").val(),
		   "transfernotedate":$("#tn_year").val()+'-'+$("#tn_month").val()+'-'+$("#tn_date").val(),
		   "fromgodown":$("#tn_from_godown option:selected").val(),
		   "togodown":$("#tn_to_godown option:selected").val(),
		   "transportationmode":$("#transport_mode").val(),
		   "receiveddate": "",
		   "nopkt":$("#no_of_packet").val(),
		   "printset":JSON.stringify(printset),
		   "issuername":$("#name_issuer").val(),
		   "designation":$("#designation").val(),
		   "products":JSON.stringify(products)},
		 beforeSend: function(xhr)
		 {
		   xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		 }
	       })
		.done(function(resp) {
		  console.log("success");
		  $('#info').html(resp);
		})
		.fail(function() {
		  console.log("error");
		})
		.always(function() {
		  console.log("complete");
		});

	     }

	     if(resp["gkstatus"] == 1){
	       $("#transfernote_no").focus();
	       $("#duplicate-alert").alert();
	       $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
		 $("#duplicate-alert").hide();
	       });
	     }

	   })
	   .fail(function() {
	     console.log("error");
	   })
	   .always(function() {
	     console.log("complete");
	   });

	});  
    }
  });
  $("#confirm_yestnprint").on('shown.bs.modal', function(event) {
    $("#tn_save_noprint").focus();

  });
  $("#confirm_yestnprint").on('hidden.bs.modal', function(event) {
    $("#transfernote_no").focus();
  });


});
