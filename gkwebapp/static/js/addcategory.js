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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Rohini Baraskar"
*/
// This script is for the add category page
$(document).ready(function() {
    $('.modal-backdrop').remove();
    //when home key is pressed parent category selection is focused
    //when alt +shift+ D pressed Done is clicked
    $(document).keydown(function(event) {
      if(event.altKey && event.shiftKey && event.keyCode == 68){
        $("#addcategory").click();
      }
        if(event.which == 36){
          $("#category_under").focus();
        }
    });
    var parentspecs = [];
    var childspecs = [];
    var taxes = [];
    if($("#catcount").val() > 0){
      $("#category_under").focus();
    }
    else{
      $("#new_parent_name").focus();
    }
    var categorycode = "";
    $("#new_parent_name").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#parent_spec").focus();
        }
        else if(event.which == 27){
          event.preventDefault();
          $("#new_parent_div1").hide();
          $("#oldparentdiv").show();
          $("#category_under").focus();
        }
    });

    $(".child_spec_name").keydown(function(event) {
        cosole.log("child spec name");
        if (event.which == 13) {
            event.preventDefault();
            var curindex1 = $(this).closest('tr').index();
            $("#child_category_spec_table tbody tr:eq(" + curindex1 + ") td:eq(1) select").focus();
        }
    });

    $(".parent_spec_name").keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            var curindex1 = $(this).closest('tr').index();
            $(".parent_spec_type tbody tr:eq(" + curindex1 + ")").focus();
        }
    });
    $('#child_addspecmodal').on('shown.bs.modal', function() {
        $("#child_category_spec_table tbody tr:last td:eq(0) input").focus();
    });
    $('#parent_addspecmodal').on('shown.bs.modal', function() {
        $('#parent_category_spec_name').focus();
    });
    $("#category_under").keydown(function(event) {
        if (event.which == 13 && categorycode != "") {
          event.preventDefault();
          $("#spectbl").show();
          $(".childcat").show();
          $("#child_category_name").focus();

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
                '<option value="3">Option</option>' +
                '</select>' +
                '</td>' +
                '</tr>');
            $("#new_parent_name").focus();
        }

    });

    $("#child_category_name").keydown(function(event) {

        if (event.which == 13) {
            event.preventDefault();
            $("#child_spec").focus();
        }
    });


    /* If a parent category is selected then its specs are automatically inhereted by its child category and the specs are displayed */
    $("#category_under").change(function(event) {
        /* when a (parent)category is changed by the user except the last blank row all the other category spec rows are removed
        and replaced with the spec rows of the newly selected (parent)category
        */

        categorycode = $("#category_under option:selected").val();
        if(categorycode != ""){
          $("#doneid").show();
          $("#spectbl").show();
          $("#parent_heading").text($("#category_under option[value=" + categorycode + "]").text());
          $('#spectbl td').remove();
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
                  for (spec of resp["gkresult"].reverse()) {
                      var trs;
                      if (spec["attrtype"] == 0) {
                          trs = '<option value="0">Text</option>'
                      } else if (spec["attrtype"] == 1) {
                          trs =
                              '<option value="1">Number</option>'
                      } else if (spec["attrtype"] == 2) {
                          trs = '<option value="2">Date</option>'
                      } else if (spec["attrtype"] == 3) {
                          trs = '<option value="3">Option</option>'
                      }
                      $('#spectbl tbody').prepend('<tr>' +
                          '<td class="col-xs-8">' + spec["attrname"] + '</td>' +
                          '<td class="col-xs-3">' + trs + '</td>' +
                          '</tr>');

                      $('#child_category_spec_table tbody').prepend('<tr>' +
                          '<td class="col-xs-8">' +
                          '<input type="text" class="form-control input-sm spec_name" value="' + spec["attrname"] + '" placeholder="Spec Name">' +
                          '</td>' +
                          '<td class="col-xs-4">' +
                          '<select id="child_category_spec_type" class="form-control input-sm spec_type">' + trs +
                          '</select>' +
                          '</td>' +
                          '</tr>');

                      var obj = {};

                      //dict for specs
                      obj.attrname = spec["attrname"];
                      obj.attrtype = spec["attrtype"];
                      parentspecs.push(obj);
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
                      '<option value="3">Option</option>' +
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
        }
        else{
          categorycode = "";
          $("#spectbl").hide();
          $(".childcat").hide();
          $("#doneid").hide();
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
                var obj = {};
                //dict for specs
                if ($.trim($("#child_category_spec_table tbody tr:eq(" + curindex1 + ") td:eq(0) input").val()) != "") {
                    obj.attrname = $("#child_category_spec_table tbody tr:eq(" + curindex1 + ") td:eq(0) input").val();
                    obj.attrtype = $.trim($("#child_category_spec_table tbody tr:eq(" + curindex1 + ") td:eq(1) select option:selected").val());
                    childspecs.push(obj);
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
                    '<option value="3">Option</option>' +
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
                var obj = {};
                //dict for specs
                if ($.trim($("#parent_category_spec_table tbody tr:eq(" + curindex1 + ") td:eq(0) input").val()) != "") {
                    obj.attrname = $("#parent_category_spec_table tbody tr:eq(" + curindex1 + ") td:eq(0) input").val();
                    obj.attrtype = $.trim($("#parent_category_spec_table tbody tr:eq(" + curindex1 + ") td:eq(1) select option:selected").val());
                    parentspecs.push(obj);
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
                    '<option value="3">Option</option>' +
                    '</select>' +
                    '</td>' +
                    '</tr>');
                $('#parent_category_spec_table tbody tr:eq(' + nextindex1 + ') td:eq(0) input').focus().select();
            }
        }


    });
    /*-----------------------------Rohini------------------------*/
    $(document).off("keydown", ".tax_rate").on("keydown", ".tax_rate", function(event) {

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
                var obj = {}; // dict for storing tax details
                obj.taxname = $("#category_tax_table tbody tr:eq(" + curindex1 + ") td:eq(0) select").val();
                obj.state = $("#category_tax_table tbody tr:eq(" + curindex1 + ") td:eq(1) select option:selected").val();
                obj.taxrate = $("#category_tax_table tbody tr:eq(" + curindex1 + ") td:eq(2) input").val();
                taxes.push(obj);

                // appending a new row for adding another tax to category

                $('#category_tax_table tbody').append('<tr>' +
                    '<td class="col-xs-4">' +
                    '<select class="form-control input-sm tax_name">' +
                    '<option value="" selected>Select Tax</option>' +
                    '<option value="VAT">VAT</option>' +
                    '<option value="CVAT">CVAT</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="col-xs-4">' +
                    '<select class="form-control input-sm tax_state" >' +
                    '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="col-xs-4">' +
                    '<input class="form-control input-sm tax_rate text-right"  placeholder="Rate">' +
                    '</td>' +
                    '</tr>');
                $(".tax_rate").numeric();
                $('#category_tax_table tbody tr:eq(' + nextindex1 + ') td:eq(0) select').focus().select();

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
    $(document).off("click", ".tax_del").on("click", ".tax_del", function() {
        $(this).closest('tr').fadeOut(200, function() {
            $(this).closest('tr').remove(); //closest method gives the closest element specified
            $('#category_tax_table tbody tr:last td:eq(0) select').focus().select();
        });
        $('#category_tax_table tbody tr:last td:eq(0) select').select();
    });

    //////////////////////////
    $("#parent_save").click(function(event) {
        var parentname = $("#new_parent_name").val();
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
                        $("#success-alert").hide();

                        $("#new_parent_div1").hide();
                        $("#oldparentdiv").show();
                        categorycode = resp.gkresult
                        $("#category_under").append('<option val="' + categorycode + '" selected>' + parentname + '</option>');
                        $(".childcat").show();
                        $("#spectbl").show();
                        $("#parent_heading").text($("#new_parent_name").val());
                        $("#spectbl tbody").html("");
                        $('#child_category_spec_table tbody').html("");
                        for (spec of parentspecs) {
                            var trs;
                            if (spec["attrtype"] == 0) {
                                trs = '<option value="0">Text</option>'
                            } else if (spec["attrtype"] == 1) {
                                trs =
                                    '<option value="1">Number</option>'
                            } else if (spec["attrtype"] == 2) {
                                trs = '<option value="2">Date</option>'
                            } else if (spec["attrtype"] == 3) {
                                trs = '<option value="3">Option</option>'
                            }
                            $('#spectbl tbody').append('<tr>' +
                                '<td class="col-xs-8">' + spec["attrname"] + '</td>' +
                                '<td class="col-xs-3">' + trs + '</td>' +
                                '</tr>');
                            $('#child_category_spec_table tbody').append('<tr>' +
                                '<td class="col-xs-8">' +
                                '<input type="text" class="form-control input-sm spec_name" value="' + spec["attrname"] + '" placeholder="Spec Name">' +
                                '</td>' +
                                '<td class="col-xs-4">' +
                                '<select id="child_category_spec_type" class="form-control input-sm spec_type">' + trs +
                                '</select>' +
                                '</td>' +
                                '</tr>');
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
                                  '<option value="3">Option</option>' +
                                  '</select>' +
                                  '</td>' +
                                  '</tr>');


                    });

                    return false;
                } else if (resp["gkstatus"] == 1) {
                    $("#category_name").focus().select();
                    $("#duplicate-alert").alert();
                    $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#duplicate-alert").hide();
                    });
                    return false;
                } else {
                    $("#category_name").focus();
                    $("#failure-alert").alert();
                    $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#failure-alert").hide();
                    });
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

    $(document).off("keydown", "#child_category_table").on("keydown", "#child_category_table", function(event) {
        //on Insert key press
        if (event.which == 45) {
            event.preventDefault();
            var curindex1 = $(this).closest('tr').index() + 1;
            $.ajax({
                    url: '/category?action=save',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        "categoryname": $('#child_category_table tbody tr:last input').val(),
                        "subcategoryof": categorycode,
                        "specs": JSON.stringify(parentspecs.concat(childspecs)),
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
                        $("#success-alert").alert();
                        $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
                        });
                        $("#child_category_table tbody tr:last td:eq(1) button").attr('id', resp.gkresult);
                        $("#child_category_table tbody tr:last td:eq(2) button").remove();
                        $("#child_category_table tbody tr:last td:eq(0) input").prop('disabled', true);
                        $("#child_category_table tbody tr:last td:eq(1) button").attr('class', "btn form-control btn-primary btn-sm showspecs");
                        $("#child_category_table tbody tr:last td:eq(1) button").attr('data-target', "#child_showspecmodal");
                        // appending a new row for adding another spec to category
                        $('#child_category_spec_table tbody').html("");
                        for (spec of parentspecs) {
                            var trs;
                            if (spec["attrtype"] == 0) {
                                trs = '<option value="0">Text</option>'
                            } else if (spec["attrtype"] == 1) {
                                trs =
                                    '<option value="1">Number</option>'
                            } else if (spec["attrtype"] == 2) {
                                trs = '<option value="2">Date</option>'
                            } else if (spec["attrtype"] == 3) {
                                trs = '<option value="3">Option</option>'
                            }

                            $('#child_category_spec_table tbody').append('<tr>' +
                                '<td class="col-xs-8">' +
                                '<input type="text" class="form-control input-sm spec_name" value="' + spec["attrname"] + '" placeholder="Spec Name">' +
                                '</td>' +
                                '<td class="col-xs-4">' +
                                '<select id="child_category_spec_type" class="form-control input-sm spec_type">' + trs +
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
                            '<option value="3">Option</option>' +
                            '</select>' +
                            '</td>' +
                            '</tr>');

                        $('#child_category_table tbody').append('<tr>' +
                            '<td class="col-xs-6">' +
                            '<input type="text" id="child_category_name" class="form-control input-sm mchild_spec_name" placeholder="Sub Category Name">' +
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
                        $("#category_name").focus().select();
                        $("#duplicate-alert").alert();
                        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#duplicate-alert").hide();
                        });
                        return false;
                    } else {
                        $("#category_name").focus();
                        $("#failure-alert").alert();
                        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#failure-alert").hide();
                        });
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
    $(document).on('click', '.showspecs', function () {
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
                      trs = '<option value="0">Text</option>'
                  } else if (spec["attrtype"] == 1) {
                      trs =
                          '<option value="1">Number</option>'
                  } else if (spec["attrtype"] == 2) {
                      trs = '<option value="2">Date</option>'
                  } else if (spec["attrtype"] == 3) {
                      trs = '<option value="3">Option</option>'
                  }
                  $('#child_showcategory_spec_table tbody').prepend('<tr>' +
                      '<td class="col-xs-8">' +
                      '<input type="text" id="child_showcategory_spec_name" class="form-control input-sm" value="'+spec["attrname"]+'" disabled>' +
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
