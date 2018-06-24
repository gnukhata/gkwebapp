  $(document).ready(function() {
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();


    $("#r1-type").on('change', function() {
      console.log($(this).val())
      if ($(this).val() == "b2b") {
        $("#b2b-container").show();
        $("#b2cl-container").hide();
        $("#b2cs-container").hide();
        $("#cdnr-container").hide();
        $("#cdnur-container").hide();
      }
      if ($(this).val() == "b2cl") {
        $("#b2b-container").hide();
        $("#b2cl-container").show();
        $("#b2cs-container").hide();
        $("#cdnr-container").hide();
        $("#cdnur-container").hide();
      }
      if ($(this).val() == "b2cs") {
        $("#b2b-container").hide();
        $("#b2cl-container").hide();
        $("#b2cs-container").show();
        $("#cdnr-container").hide();
        $("#cdnur-container").hide();
      }
      if ($(this).val() == "cdnr") {
        $("#b2b-container").hide();
        $("#b2cl-container").hide();
        $("#b2cs-container").hide();
        $("#cdnr-container").show();
        $("#cdnur-container").hide();
      }
      if ($(this).val() == "cdnur") {
        $("#b2b-container").hide();
        $("#b2cl-container").hide();
        $("#b2cs-container").hide();
        $("#cdnr-container").hide();
        $("#cdnur-container").show();
      }
    })

    $('#spreadsheet').click(function (event) {
      event.preventDefault();
      var xhr = new XMLHttpRequest();
      xhr.open('GET','/gstreturns?action=spreadsheet'+ '&start='+$("#start").val()+'&end='+$("#end").val(),true);
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      xhr.responseType = 'blob';

      xhr.onload = function(e) {
        if (this.status == 200) {
          var blob = this.response;
          var url = window.URL.createObjectURL(blob);
          window.location.assign(url);
        }
      };
      xhr.send();
    });

  });
