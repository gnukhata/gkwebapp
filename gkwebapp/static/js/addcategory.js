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
   Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
   Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


   Contributors:
   "Abhijith Balan" <abhijithb21@openmailbox.org>
   "Bhavesh Bawadhane" <bbhavesh07@gmail.com>
   "Ishan Masdekar" <imasdekar@dff.org.in>
   "Mohd. Talha Pawaty" <mtalha456@gmail.com>
   "Navin Karkera" <navin@openmailbox.org>
   "Pornima Kolte" <pornima@openmailbox.org>
   "Rohini Baraskar" <robaraskar@gmail.com>
   "Reshma Bhatawadekar" <reshma_b@riseup.net>
   "Sachin Patil" <sachin619patil@rediffmail.com>
   "Vaibhav Kurhe" <vaibspidy@openmailbox.org>

 */
// This script is for the add category page
$(document).ready(function() {
    $('.modal-backdrop').remove();
    var parentspecs = [];
    var childspecs = [];
    var parenttaxes = [];
    var taxes = [];
    $(".tax_rate_gst").hide();
    var taxfieldhtml = $("#category_tax_table tbody").html();
    var stateshtml = $("#category_tax_table tbody tr:first td:eq(1) select").html();
    if ($("#catcount").val() > 0) {
        $("#category_under").focus();
    } else {
        $("#new_parent_name").focus();
    }

    if (sessionStorage.latestcategory) {
        $("#category_under").val(sessionStorage.latestcategory);
        $("#category_under").focus();
        sessionStorage.latestcategory = "";
    }
    var categorycode = "";
    $("#new_parent_div1").keydown(function(event) {
        //when esc key is pressed
        if (event.which == 27) {
            $("#addcategory").click();
        }
    });
    $("#new_parent_name").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#navigation-alert").alert();
            $("#navigation-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#navigation-alert").hide();
            });
            $("#new_parent_name").focus();
            return false;
        }
    });
    $(".mchild_spec_name").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#child-navigation-alert").alert();
            $("#child-navigation-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#child-navigation-alert").hide();
            });
            $(".mchild_spec_name", this).focus();
            return false;
        }
    });

    $('#child_addspecmodal').on('shown.bs.modal', function() {
        $("#child_category_spec_table tbody tr:last td:eq(0) input").focus();
    });
    $('#child_showspecmodal').on('shown.bs.modal', function() {
        $("#child_showcategory_spec_table tbody tr:first td:eq(0) input").focus();
    });
    $('#parent_addspecmodal').on('shown.bs.modal', function() {
        $('#parent_category_spec_name').focus();
    });
    $('#addtaxmodal').on('shown.bs.modal', function() {
	$("#category_tax_table tbody").empty();
	var gstRate = ["5.00","12.00","18.00","28.00"];
      for (let i = 0; i < parenttaxes.length; i++) {
        $("#category_tax_table tbody").append(taxfieldhtml);
        $("#category_tax_table tbody tr:eq("+i+") td:eq(0) select").val(parenttaxes[i].taxname);
        if (parenttaxes[i].state == null) {
          $("#category_tax_table tbody tr:eq("+i+") td:eq(1) select").val("").prop('disabled', true);
        }
        else {
          $("#category_tax_table tbody tr:eq("+i+") td:eq(1) select").val(parenttaxes[i].state);
        }
	  if (parenttaxes[i].taxname == "IGST"){
	      let count = 0;
		    for(let a in gstRate){
			if(parenttaxes[i].taxrate == gstRate[a]) {
			    count = count+1;
			}
		    }
		    if(count == 0){
			$("#gstrateEdit").show();
		    }else{
			$("#gstrateEdit").hide();
		    }
	      $("#category_tax_table tbody tr:eq("+i+") td:eq(2) input").hide();
	      $("#category_tax_table tbody tr:eq("+i+") td:eq(2) select").show();
	      $("#category_tax_table tbody tr:eq("+i+") td:eq(2) select").val(Math.floor(parenttaxes[i].taxrate));
	  } else {
	      $("#category_tax_table tbody tr:eq("+i+") td:eq(2) input").val(parenttaxes[i].taxrate);
	  }
      }
	$("#category_tax_table tbody").append(taxfieldhtml);
	if($("#category_tax_table tbody tr").length > 1){
	    $("#category_tax_table tbody tr").each(function(){
	    let curindex = $(this).index();
	    let nextindex = curindex + 1;
	    for (let j = 0; j < curindex + 1; j++) {
	        var selectedtax = $("#category_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
                if (selectedtax != ""){
	      if(selectedtax != "VAT"){
		  for(let i=j+1; i <= nextindex;i++){
		      $('#category_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').prop('hidden', true).prop('disabled', true);
		  }
	      }
	        }
            }
	});
	}
	$("#category_tax_table tbody tr:last td:eq(0) select").focus();
    });
    $(document).off("keydown", "#category_under").on("keydown", "#category_under", function(event) {
        categorycode = $("#category_under option:selected").val();
        if (event.which == 13 && categorycode != "") {
            event.preventDefault();
            if ($('.childcat').is(':visible') == false) {
                $("#category_under").trigger('change');
            }
            $(".mchild_spec_name:last").focus();
        }
        //when spacebar is pressed
        if (event.which == 32) {
            parentspecs = [];
            taxes = [];
            $("#category_tax_table tbody tr").not(":last").remove();
            event.preventDefault();
            $("#oldparentdiv").hide();
            $("#new_parent_div1").show();
            $("#doneid").hide();
            $("#spectbl").hide();
            $(".childcat").hide();
            $("#new_parent_name").val("");
            $('#parent_category_spec_table tbody').html("");
            $('#parent_category_spec_table tbody').append('<tr>' +
                '<td class="col-xs-8">' +
                '<input type="text" id="parent_category_spec_name" class="form-control input-sm parent_spec_name" placeholder="Spec Name">' +
                '</td>' +
                '<td class="col-xs-4">' +
                '<select id="parent_category_spec_type" class="form-control input-sm parent_spec_type" name="">' +
                '<option value="0">Text</option>' +
                '<option value="1">Number</option>' +
                '<option value="2">Date</option>' +
                '</select>' +
                '</td>' +
                '</tr>');
            $("#new_parent_name").focus();
        }

    });

    /* If a parent category is selected then its specs are automatically inhereted by its child category and the specs are displayed */
    $("#category_under").change(function(event) {
        /* when a (parent)category is changed by the user except the last blank row all the other category spec rows are removed
        and replaced with the spec rows of the newly selected (parent)category
        */

        categorycode = $("#category_under option:selected").val();
        if (categorycode != "") {
            $("#doneid").show();
            $("#parent_heading").text($("#category_under option[value=" + categorycode + "]").text());
            $('#spectbl td').remove();
            $('#child_category_table td').remove();
            $.ajax({
                    url: '/category?action=treechildren',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        "categorycode": categorycode
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    for (category of resp["gkresult"]) {
                        $('#child_category_table tbody').append('<tr>' +
                            '<td class="col-xs-6">' +
                            '<input type="text" class="form-control input-sm mchild_spec_name" placeholder="Sub Category Name" value="' + category["categoryname"] + '" disabled>' +
                            '</td>' +
                            '<td class="col-xs-3">' +
                            '<button class="btn form-control btn-primary btn-sm showspecs" id="' + category["categorycode"] + '" data-toggle="modal" data-target="#child_showspecmodal" >View Specs</button>' +
                            '</td>' +
                            '<td class="col-xs-3">' +
                            '<td>' +
                            '</tr>');
                    }
                    $('#child_category_table tbody').append('<tr>' +
                        '<td class="col-xs-6">' +
                        '<input type="text" class="form-control input-sm mchild_spec_name" placeholder="Sub Category Name">' +
                        '</td>' +
                        '<td class="col-xs-3">' +
                        '<button class="btn form-control btn-primary btn-sm child_spec_class" id="child_spec" data-toggle="modal" data-target="#child_addspecmodal" >Specs</button>' +

                        '</td>' +
                        '<td class="col-xs-3">' +
                        '<button class="btn form-control btn-primary btn-sm child_tax_class" id="child_tax" data-toggle="modal" data-target="#addtaxmodal"   >Tax</button>' +
                        '</td>' +
                        '</tr>');

                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
            $(".childcat").show();
            parentspecs = [];
            // ajax for getting the specs of the newly selected (parent)category
            $.ajax({
                    url: '/category?action=getspecs',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        "categorycode": categorycode
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    $('#child_category_spec_table tbody').html("");
                    var noofspecs = 0;
                    for (spec of resp["gkresult"].reverse()) {
                        var trs;
                        noofspecs++;
                        if (spec["attrtype"] == 0) {
                            trs = '<option value="0">Text</option>';
                        } else if (spec["attrtype"] == 1) {
                            trs =
                                '<option value="1">Number</option>';
                        } else if (spec["attrtype"] == 2) {
                            trs = '<option value="2">Date</option>';
                        }
                        $('#spectbl tbody').prepend('<tr>' +
                            '<td class="col-xs-6">' + spec["attrname"] + '</td>' +
                            '<td class="col-xs-6">' + trs + '</td>' +
                            '</tr>');

                        $('#child_category_spec_table tbody').prepend('<tr>' +
                            '<td class="col-xs-8">' +
                            '<input type="text" class="form-control input-sm spec_name" value="' + spec["attrname"] + '" placeholder="Spec Name" disabled>' +
                            '</td>' +
                            '<td class="col-xs-4">' +
                            '<select id="child_category_spec_type" class="form-control input-sm spec_type" disabled>' + trs +
                            '</select>' +
                            '</td>' +
                            '</tr>');

                        var obj = {};

                        //dict for specs
                        obj.attrname = spec["attrname"];
                        obj.attrtype = spec["attrtype"];
                        parentspecs.push(obj);
                    }
                    if (noofspecs == 0) {
                        $("#spectbl").hide();
                    } else {
                        $("#spectbl").show();
                    }
                    $('#child_category_spec_table tbody').append('<tr>' +
                        '<td class="col-xs-8">' +
                        '<input type="text" class="form-control input-sm spec_name" value="" placeholder="Spec Name">' +
                        '</td>' +
                        '<td class="col-xs-4">' +
                        '<select id="child_category_spec_type" class="form-control input-sm spec_type">' +
                        '<option value="0">Text</option>' +
                        '<option value="1">Number</option>' +
                        '<option value="2">Date</option>' +
                        '</select>' +
                        '</td>' +
                        '</tr>');

                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

                parenttaxes = [];
                // ajax for getting the taxes of the newly selected (parent)category
                $.ajax({
                        url: '/category?action=gettax',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        data: {
                            "categorycode": categorycode
                        },
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                        }
                    })
                    .done(function(resp) {
                      parenttaxes = resp["gkresult"];
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        console.log("complete");
                    });

        }
    });
    $(document).off("keydown", "#child_category_spec_type").on("keydown", "#child_category_spec_type", function(event) {
        var curindex1 = $(this).closest('tr').index();
        var nextindex1 = curindex1 + 1;
        var previndex1 = curindex1 - 1;
        if (event.which == 13) {
            event.preventDefault();

            if (curindex1 != ($("#child_category_spec_table tbody tr").length - 1)) {
                $('#child_category_spec_table tbody tr:eq(' + nextindex1 + ') td:eq(0) input').focus().select();
            } else {
                if ($('#child_category_spec_table tbody tr:eq(' + curindex1 + ') td:eq(0) input').val() == "") {
                    $("#child_spec-blank-alert").alert();
                    $("#child_spec-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#child_spec-blank-alert").hide();
                    });
                    $('#child_category_spec_table tbody tr:eq(' + curindex1 + ') td:eq(0) input').focus();
                    return false;
                }
                // appending a new row for adding another spec to category
                $('#child_category_spec_table tbody').append('<tr>' +
                    '<td class="col-xs-8">' +
                    '<input type="text" id="child_category_spec_name" class="form-control input-sm spec_name" placeholder="Spec Name">' +
                    '</td>' +
                    '<td class="col-xs-4">' +
                    '<select id="child_category_spec_type" class="form-control input-sm spec_type">' +
                    '<option value="0">Text</option>' +
                    '<option value="1">Number</option>' +
                    '<option value="2">Date</option>' +
                    '</select>' +
                    '</td>' +
                    '</tr>');
                $('#child_category_spec_table tbody tr:last td:eq(0) input').focus().select();
            }
        }


    });
    $(document).off("keydown", "#parent_category_spec_type").on("keydown", "#parent_category_spec_type", function(event) {
        var curindex1 = $(this).closest('tr').index();
        var nextindex1 = curindex1 + 1;
        var previndex1 = curindex1 - 1;
        if (event.which == 13) {
            event.preventDefault();

            if (curindex1 != ($("#parent_category_spec_table tbody tr").length - 1)) {
                $('#parent_category_spec_table tbody tr:eq(' + nextindex1 + ') td:eq(0) input').focus().select();
            } else {
                if ($('#parent_category_spec_table tbody tr:eq(' + curindex1 + ') td:eq(0) input').val() == "") {
                    $("#parent_spec-blank-alert").alert();
                    $("#parent_spec-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#parent_spec-blank-alert").hide();
                    });
                    $('#parent_category_spec_table tbody tr:eq(' + curindex1 + ') td:eq(0) input').focus();
                    return false;
                }
                // appending a new row for adding another spec to category
                $('#parent_category_spec_table tbody').append('<tr>' +
                    '<td class="col-xs-8">' +
                    '<input type="text" id="parent_category_spec_name" class="form-control input-sm spec_name" placeholder="Spec Name">' +
                    '</td>' +
                    '<td class="col-xs-4">' +
                    '<select id="parent_category_spec_type" class="form-control input-sm spec_type">' +
                    '<option value="0">Text</option>' +
                    '<option value="1">Number</option>' +
                    '<option value="2">Date</option>' +
                    '</select>' +
                    '</td>' +
                    '</tr>');
                $('#parent_category_spec_table tbody tr:eq(' + nextindex1 + ') td:eq(0) input').focus().select();
            }
        }


    });

    $(document).off("change", ".tax_name").on("change", ".tax_name", function(event) {
	//If taxname will be 'IGST' select box shown otherwise input field shown.
	if (!($("#category_tax_table tbody tr:last td:eq(0) select").val()=='IGST')){
	    $('#category_tax_table tbody tr:last td:eq(2) input').show('.tax_rate');
	    $('#category_tax_table tbody tr:last td:eq(2) select').hide('.tax_rate_gst');
	} else if($("#category_tax_table tbody tr:last td:eq(0) select").val()=='IGST') {
	    $('#category_tax_table tbody tr:last td:eq(2) select').show('.tax_rate_gst');
	    $('#category_tax_table tbody tr:last td:eq(2) input').hide('.tax_rate');
	}
        if ($('#category_tax_table tbody tr:last td:eq(0) select').val() == "VAT") {
            $('#category_tax_table tbody tr:last td:eq(1) select').prop('disabled', false);
            $('#category_tax_table tbody tr:last td:eq(1) select option[value=""]').prop('disabled', true);
            $('#category_tax_table tbody tr:last td:eq(1) select').val('Andaman and Nicobar Islands');
        } else if ($('#category_tax_table tbody tr:last td:eq(0) select').val() != "") {
            $('#category_tax_table tbody tr:last td:eq(1) select').val('');
            $('#category_tax_table tbody tr:last td:eq(1) select').prop('disabled', true);
        }
        var curindex = $(this).closest('tr').index();
        var previndex = curindex -1;
        if ($("#category_tax_table tbody tr:eq("+curindex+") td:eq(0) select").val()=='VAT') {
          $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
            $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append(stateshtml);
	    $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select option:visible").first().prop("selected",true);
          $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").prop('disabled', false);
        }
        else {
          $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").empty();
          $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").append('<option value="">None</option>');
          $("#category_tax_table tbody tr:eq("+curindex+") td:eq(1) select").prop('disabled', true);
        }
	for (let j = 0; j < curindex + 1; j++) {
              if ($("#category_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val() == "VAT") {
		  var selectedtaxstate = $("#category_tax_table tbody tr:eq("+j+") td:eq(1) select option:selected").attr("stateid");
		  for (let i=j+1; i<=curindex+1;i++){
		      $('#category_tax_table tbody tr:eq('+i+') td:eq(1) select option[stateid='+selectedtaxstate+']').remove();
		  }
	      }
          }

    });

    //Keydown event for tax_rate select box for "GST" tax name.
    $(document).off("keydown", ".tax_rate_gst").on("keydown", ".tax_rate_gst", function(event) {
        $(".tax_rate").numeric();
        $(".tax_rate").numeric({negative:false});
        var curindex1 = $(this).closest('tr').index();
        var nextindex1 = curindex1 + 1;
        var previndex1 = curindex1 - 1;
        if (event.which == 13) {
            event.preventDefault();
            if (curindex1 != ($("#category_tax_table tbody tr").length - 1)) {
                $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
            }
                // appending a new row for adding another tax to category

                $('#category_tax_table tbody').append(taxfieldhtml);


                $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
		for (let j = 0; j < curindex1 + 1; j++) {
		    var selectedtax = $("#category_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
                   
		    if(selectedtax != "VAT"){
			for(let i=j+1; i <= nextindex1;i++){
			    $('#category_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').prop('hidden', true).prop('disabled', true);
			}
		    }
		}

        } else if (event.which == 190 && event.shiftKey) {
            event.preventDefault();
            $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(2) input').focus().select();
        } else if (event.which == 188 && event.shiftKey) {
            if (previndex1 > -1) {
                event.preventDefault();
                $('#category_tax_table tbody tr:eq(' + previndex1 + ') td:eq(2) input').focus().select();
            }
        } else if (event.ctrlKey && event.which == 188) {
            event.preventDefault();
            $('#category_tax_table tbody tr:eq(' + curindex1 + ') td:eq(1) select').focus();
        } else if (event.which == 190 && event.ctrlKey) {
            event.preventDefault();
            $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
        }


    });
    
    $(document).off("keydown", ".tax_rate").on("keydown", ".tax_rate", function(event) {
        $(".tax_rate").numeric();
        $(".tax_rate").numeric({negative:false});
        var curindex1 = $(this).closest('tr').index();
        var nextindex1 = curindex1 + 1;
        var previndex1 = curindex1 - 1;
        if (event.which == 13) {
            event.preventDefault();
            if (curindex1 != ($("#category_tax_table tbody tr").length - 1)) {
                $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
            } else {
                //validations for blank tax(CVAT or VAT) and and blank tax rate
                if ($('#category_tax_table tbody tr:eq(' + curindex1 + ') td:eq(0) select').val() == "") {
                    $("#tax-name-blank-alert").alert();
                    $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#tax-name-blank-alert").hide();
                    });
                    $('#category_tax_table tbody tr:eq(' + curindex1 + ') td:eq(0) select').focus();
                    return false;
                }
                if ($('#category_tax_table tbody tr:eq(' + curindex1 + ') td:eq(2) input').val() == "") {
                    $("#tax-rate-blank-alert").alert();
                    $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#tax-rate-blank-alert").hide();
                    });
                    $('#category_tax_table tbody tr:eq(' + curindex1 + ') td:eq(2) input').focus();
                    return false;
                }
                // appending a new row for adding another tax to category

                $('#category_tax_table tbody').append(taxfieldhtml);


                $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
		for (let j = 0; j < curindex1 + 1; j++) {
		    var selectedtax = $("#category_tax_table tbody tr:eq("+j+") td:eq(0) select option:selected").val();
		    if(selectedtax != "VAT"){
			for(let i=j+1; i <= nextindex1;i++){
			    $('#category_tax_table tbody tr:eq('+i+') td:eq(0) select option[value='+selectedtax+']').prop('hidden', true).prop('disabled', true);
			}
		    }
		}

            }
        } else if (event.which == 190 && event.shiftKey) {
            event.preventDefault();
            $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(2) input').focus().select();
        } else if (event.which == 188 && event.shiftKey) {
            if (previndex1 > -1) {
                event.preventDefault();
                $('#category_tax_table tbody tr:eq(' + previndex1 + ') td:eq(2) input').focus().select();
            }
        } else if (event.ctrlKey && event.which == 188) {
            event.preventDefault();
            $('#category_tax_table tbody tr:eq(' + curindex1 + ') td:eq(1) select').focus();
        } else if (event.which == 190 && event.ctrlKey) {
            event.preventDefault();
            $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();
        }


    });


    $("#parent_save").click(function(event) {
        var parentname = $("#new_parent_name").val();
        if (parentname == "") {
            $("#blank-alert").alert();
            $("#blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#blank-alert").hide();
            });
            $('#new_parent_name').focus();
            return false;
        }
        parentspecs = [];
        $("#parent_category_spec_table tbody tr").each(function() {
            var obj = {};
            //dict for specs
            if ($.trim($("input", this).val()) != "") {
                obj.attrname = $.trim($("input", this).val());
                obj.attrtype = $.trim($("select option:selected", this).val());
                parentspecs.push(obj);
            }
        });
        taxes = [];
        $("#category_tax_table tbody tr").each(function() {
	    var curindex = $(this).closest('tr').index();
            if ($.trim($("input", this).val()) != "" || $.trim($("select", this).val()) != "") {
		var obj = {}; // dict for storing tax details
		obj.taxname = $.trim($("td:eq(0) select option:selected", this).val());
		obj.state = $.trim($("td:eq(1) select option:selected", this).val());
		if($("td:eq(0) select option:selected", this).val() == 'IGST'){
		    obj.taxrate = $.trim($("td:eq(2) select option:selected", this).val());
		} else {
		    obj.taxrate = $.trim($("input", this).val());
		}
		taxes.push(obj);
	    }
        });
        $.ajax({
                url: '/category?action=save',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    "categoryname": $("#new_parent_name").val(),
                    "subcategoryof": "",
                    "specs": JSON.stringify(parentspecs),
                    "taxes": JSON.stringify(taxes)
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                if (resp["gkstatus"] == 0) {
                    taxes = [];
                    $("#category_tax_table tbody tr").not(":last").remove();
                    $("#success-alert").alert();
                    $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                        sessionStorage.latestcategory = resp["gkresult"];
                        $("#addcategory").click();
                        $("#success-alert").hide();
                    });
                } else if (resp["gkstatus"] == 1) {
                    $("#duplicate-alert").alert();
                    $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#duplicate-alert").hide();
                    });
                    $("#new_parent_name").focus().select();
                    return false;
                } else {
                    $("#failure-alert").alert();
                    $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#failure-alert").hide();
                    });
                    $("#new_parent_name").focus();
                    return false;
                }
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    });

    $(document).off("keydown", "#new_parent_div1").on("keydown", "#new_parent_div1", function(event) {
	if (event.which == 45) {
            event.preventDefault();
	    $("#parent_save").click();
	}
    });

    $(document).off("keydown", "#child_category_table").on("keydown", "#child_category_table", function(event) {
        //on Insert key press
        if (event.which == 45) {
            event.preventDefault();
            var curindex1 = $(this).closest('tr').index() + 1;
            var catname = $('#child_category_table tbody tr:last input').val();
            if (catname == "") {
                $("#child-cat-blank-alert").alert();
                $("#child-cat-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                    $("#child-cat-blank-alert").hide();
                });
                $('#child_category_table tbody tr:last td:eq(0) input').focus();
                return false;
            }
            childspecs = [];
            $("#child_category_spec_table tbody tr").each(function() {
                var obj = {};
                if ($.trim($("input", this).val()) != "") {
                    obj.attrname = $.trim($("input", this).val());
                    obj.attrtype = $.trim($("select option:selected", this).val());
                    childspecs.push(obj);
                }
            });
            taxes = [];
            $("#category_tax_table tbody tr").each(function() {
		var obj = {}; // dict for storing tax details
		if($("td:eq(0) select option:selected", this).val() != ""){
		    obj.taxname = $.trim($("td:eq(0) select option:selected", this).val());
                    obj.state = $.trim($("td:eq(1) select option:selected", this).val());
		    if($("td:eq(0) select option:selected", this).val() == "IGST"){
			obj.taxrate = $.trim($("td:eq(2) select option:selected", this).val());
		    } else {
			obj.taxrate = $.trim($("input", this).val());
		    }
                    //obj.taxrate = $.trim($("input", this).val());
                    taxes.push(obj);
		}
        });
            $.ajax({
                    url: '/category?action=save',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        "categoryname": catname,
                        "subcategoryof": categorycode,
                        "specs": JSON.stringify(childspecs),
                        "taxes": JSON.stringify(taxes)
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                    if (resp["gkstatus"] == 0) {
                        taxes = [];
                        $("#category_tax_table tbody tr").not(":last").remove();
                        childspecs = [];
                        $("#success-alert-child").alert();
                        $("#success-alert-child").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert-child").hide();
                        });
                        $("#child_category_table tbody tr:last td:eq(1) button").attr('id', resp.gkresult);
                        $("#child_category_table tbody tr:last td:eq(1) button").text("View Specs");
                        $("#child_category_table tbody tr:last td:eq(2) button").remove();
                        $("#child_category_table tbody tr:last td:eq(0) input").prop('disabled', true);
                        $("#child_category_table tbody tr:last td:eq(1) button").attr('class', "btn form-control btn-primary btn-sm showspecs");
                        $("#child_category_table tbody tr:last td:eq(1) button").attr('data-target', "#child_showspecmodal");
                        // appending a new row for adding another spec to category
                        $('#child_category_spec_table tbody').html("");
                        for (spec of parentspecs) {
                            var trs;
                            if (spec["attrtype"] == 0) {
                                trs = '<option value="0">Text</option>';
                            } else if (spec["attrtype"] == 1) {
                                trs =
                                    '<option value="1">Number</option>';
                            } else if (spec["attrtype"] == 2) {
                                trs = '<option value="2">Date</option>';
                            }

                            $('#child_category_spec_table tbody').append('<tr>' +
                                '<td class="col-xs-8">' +
                                '<input type="text" class="form-control input-sm spec_name" value="' + spec["attrname"] + '" placeholder="Spec Name" disabled>' +
                                '</td>' +
                                '<td class="col-xs-4">' +
                                '<select id="child_category_spec_type" class="form-control input-sm spec_type" disabled>' + trs +
                                '</select>' +
                                '</td>' +
                                '</tr>');
                        }
                        $('#child_category_spec_table tbody').append('<tr>' +
                            '<td class="col-xs-8">' +
                            '<input type="text" id="child_category_spec_name" class="form-control input-sm child_spec_name" placeholder="Spec Name">' +
                            '</td>' +
                            '<td class="col-xs-4">' +
                            '<select id="child_category_spec_type" class="form-control input-sm child_spec_type" name="">' +
                            '<option value="0">Text</option>' +
                            '<option value="1">Number</option>' +
                            '<option value="2">Date</option>' +
                            '</select>' +
                            '</td>' +
                            '</tr>');

                        $('#child_category_table tbody').append('<tr>' +
                            '<td class="col-xs-6">' +
                            '<input type="text" class="form-control input-sm mchild_spec_name" placeholder="Sub Category Name">' +
                            '</td>' +
                            '<td class="col-xs-3">' +
                            '<button class="btn form-control btn-primary btn-sm child_spec_class" id="child_spec" data-toggle="modal" data-target="#child_addspecmodal" >Specs</button>' +

                            '</td>' +
                            '<td class="col-xs-3">' +
                            '<button class="btn form-control btn-primary btn-sm child_tax_class" id="child_tax" data-toggle="modal" data-target="#addtaxmodal"   >Tax</button>' +
                            '</td>' +
                            '</tr>');
                        $('#child_category_table tbody tr:last td:eq(0) input').focus();
                        return false;
                    } else if (resp["gkstatus"] == 1) {
                        $("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        $('#child_category_table tbody tr:last td:eq(0) input').focus();
                        return false;
                    } else {
                        $("#failure-alert").alert();
                        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#failure-alert").hide();
                        });
                        $('#child_category_table tbody tr:last td:eq(0) input').focus();
                        return false;
                    }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });

        }

    });
    $(document).on('click', '.showspecs', function() {
        var curindex1 = $(this).closest('tr').index();
        var ccode = $("#child_category_table tbody tr:eq(" + curindex1 + ") td:eq(1) button").attr('id');
        $.ajax({
                url: '/category?action=getspecs',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    "categorycode": ccode
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                $('#child_showcategory_spec_table tbody').html("");
                for (spec of resp["gkresult"].reverse()) {
                    var trs;
                    if (spec["attrtype"] == 0) {
                        trs = '<option value="0">Text</option>';
                    } else if (spec["attrtype"] == 1) {
                        trs =
                            '<option value="1">Number</option>';
                    } else if (spec["attrtype"] == 2) {
                        trs = '<option value="2">Date</option>';
                    }
                    $('#child_showcategory_spec_table tbody').prepend('<tr>' +
                        '<td class="col-xs-8">' +
                        '<input type="text" id="child_showcategory_spec_name" class="form-control input-sm" value="' + spec["attrname"] + '" disabled>' +
                        '</td>' +
                        '<td class="col-xs-4">' +
                        '<select id="child_showcategory_spec_type" class="form-control input-sm" name="" disabled>' + trs +
                        '</select>' +
                        '</td>' +
                        '</tr>');
                }
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

    });
    $("#parent_done").click(function(event) {
        $('#parent_addspecmodal').modal('hide');
    });
    $("#child_done").click(function(event) {
        $('#child_addspecmodal').modal('hide');
    });
    $("#tax_done").click(function(event) {
        $('#addtaxmodal').modal('hide');
    });
    $("#child_showdone").click(function(event) {
        $('#child_showspecmodal').modal('hide');
    });
    $("#done").click(function(event) {
        $("#addcategory").click();
    });

});
