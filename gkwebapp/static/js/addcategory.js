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
    $(document).off('keydown').on('keydown', function(event) {
        if (event.altKey && event.shiftKey && event.keyCode == 68) {
            event.preventDefault();
            $("#addcategory").click();
        }
        if (event.which == 36) {
            $("#category_under").focus();
        }
    });
    var parentspecs = [];
    var childspecs = [];
    var parenttaxes = [];
    var taxes = [];
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
      for (var i = 0; i < parenttaxes.length; i++) {
        $("#category_tax_table tbody").append('<tr>'+
           '<td class="col-xs-4">'+
              '<select class="form-control input-sm tax_name">'+
                 '<option value="" selected disabled hidden>Select Tax</option>'+
                 '<option value="VAT">VAT</option>'+
                 '<option value="CVAT">CVAT</option>'+
              '</select>'+
           '</td>'+
           '<td class="col-xs-4">'+
              '<select class="form-control input-sm tax_state" >'+
                 '<option value="">None</option>'+
                 '<option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option>'+
                 '<option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option>'+
                 '<option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option>'+
                 '<option value="Assam" stateid="4">Assam</option>'+
                 '<option value="Bihar" stateid="5">Bihar</option>'+
                 '<option value="Chandigarh" stateid="6">Chandigarh</option>'+
                 '<option value="Chhattisgarh" stateid="7">Chhattisgarh</option>'+
                 '<option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option>'+
                 '<option value="Daman and Diu" stateid="9">Daman and Diu</option>'+
                 '<option value="Delhi" stateid="10">Delhi</option>'+
                 '<option value="Goa" stateid="11">Goa</option>'+
                 '<option value="Gujarat" stateid="12">Gujarat</option>'+
                 '<option value="Haryana" stateid="13">Haryana</option>'+
                 '<option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option>'+
                 '<option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option>'+
                 '<option value="Jharkhand" stateid="16">Jharkhand</option>'+
                 '<option value="Karnataka" stateid="17">Karnataka</option>'+
                 '<option value="Kerala" stateid="19">Kerala</option>'+
                 '<option value="Lakshadweep" stateid="20">Lakshadweep</option>'+
                 '<option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option>'+
                 '<option value="Maharashtra" stateid="22">Maharashtra</option>'+
                 '<option value="Manipur" stateid="23">Manipur</option>'+
                 '<option value="Meghalaya" stateid="24">Meghalaya</option>'+
                 '<option value="Mizoram" stateid="25">Mizoram</option>'+
                 '<option value="Nagaland" stateid="26">Nagaland</option>'+
                 '<option value="Odisha" stateid="29">Odisha</option>'+
                 '<option value="Pondicherry" stateid="31">Pondicherry</option>'+
                 '<option value="Punjab" stateid="32">Punjab</option>'+
                 '<option value="Rajasthan" stateid="33">Rajasthan</option>'+
                 '<option value="Sikkim" stateid="34">Sikkim</option>'+
                 '<option value="Tamil Nadu" stateid="35">Tamil Nadu</option>'+
                 '<option value="Telangana" stateid="36">Telangana</option>'+
                 '<option value="Tripura" stateid="37">Tripura</option>'+
                 '<option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option>'+
                 '<option value="Uttarakhand" stateid="39">Uttarakhand</option>'+
                 '<option value="West Bengal" stateid="41">West Bengal</option>'+
              '</select>'+
           '</td>'+
           '<td class="col-xs-4">'+
              '<input class="form-control input-sm tax_rate text-right numtype"  placeholder="Rate">'+
           '</td>'+
        '</tr>');
        $("#category_tax_table tbody tr:eq("+i+") td:eq(0) select").val(parenttaxes[i].taxname);
        if (parenttaxes[i].state=="null") {
          $("#category_tax_table tbody tr:eq("+i+") td:eq(1) select").val("");
        }
        else {
          $("#category_tax_table tbody tr:eq("+i+") td:eq(1) select").val(parenttaxes[i].state);$(".tax_state", this).val(parenttaxes[i].state);
        }
        $("#category_tax_table tbody tr:eq("+i+") td:eq(2) input").val(parenttaxes[i].taxrate);
        console.log(parenttaxes[i]);
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
                            trs = '<option value="0">Text</option>'
                        } else if (spec["attrtype"] == 1) {
                            trs =
                                '<option value="1">Number</option>'
                        } else if (spec["attrtype"] == 2) {
                            trs = '<option value="2">Date</option>'
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
        if ($('#category_tax_table tbody tr:last td:eq(0) select').val() == "VAT") {
            $('#category_tax_table tbody tr:last td:eq(1) select').prop('disabled', false);
            $('#category_tax_table tbody tr:last td:eq(1) select option[value=""]').prop('disabled', true);
            $('#category_tax_table tbody tr:last td:eq(1) select').val('Andaman and Nicobar Islands');
        } else if ($('#category_tax_table tbody tr:last td:eq(0) select').val() == "CVAT") {
            $('#category_tax_table tbody tr:last td:eq(1) select').val('');
            $('#category_tax_table tbody tr:last td:eq(1) select').prop('disabled', true);
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

                $('#category_tax_table tbody').append('<tr>' +
                    '<td class="col-xs-4">' +
                    '<select class="form-control input-sm tax_name">' +
                    '<option value="" selected disabled hidden>Select Tax</option>' +
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

    //////////////////////////
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
            var obj = {}; // dict for storing tax details
            if ($.trim($("select option:selected", this).val()) != "") {
                obj.taxname = $.trim($("td:eq(0) select option:selected", this).val());
                obj.state = $.trim($("td:eq(1) select option:selected", this).val());
                obj.taxrate = $.trim($("input", this).val());
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
                if ($.trim($("select option:selected", this).val()) != "") {
                    obj.taxname = $.trim($("td:eq(0) select option:selected", this).val());
                    obj.state = $.trim($("td:eq(1) select option:selected", this).val());
                    obj.taxrate = $.trim($("input", this).val());
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
                        $("#success-alert").alert();
                        $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
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
                                trs = '<option value="0">Text</option>'
                            } else if (spec["attrtype"] == 1) {
                                trs =
                                    '<option value="1">Number</option>'
                            } else if (spec["attrtype"] == 2) {
                                trs = '<option value="2">Date</option>'
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
                        trs = '<option value="0">Text</option>'
                    } else if (spec["attrtype"] == 1) {
                        trs =
                            '<option value="1">Number</option>'
                    } else if (spec["attrtype"] == 2) {
                        trs = '<option value="2">Date</option>'
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
