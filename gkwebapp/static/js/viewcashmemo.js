$(document).ready(function() {
    $('.modal-backdrop').remove();
    $('.invoicedate').autotab('number');
    $("#invoice_all_no").focus();
  $("#invoice_all_no").change(function(event) {
        /*
        Getting complete information for the selected cash memo using its id.
        Display details in the corresponding fields.
*/

        var invid = $("#invoice_all_no option:selected").val();
        console.log("inv selected"+invid);
        if (invid != "") {


            $.ajax({
                    url: '/cashmemos?action=showcashmemo',
                    type: 'POST',
                    dglobal: false,
                    async: false,
                    data: {"invid": invid},
                    datatype: "text/html",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                    }
                })
                .done(function(resp) {
                      $("#viewcashmemodiv").html(resp);
                    console.log("success");
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        }




    });

});
