$(document).ready(function(){
    $("#exportbutton").focus();
    $("#exportbutton").click(function(e){
        // This function serves the client with a spreadsheet file having ledgers.
        var xhr = new XMLHttpRequest();
        var url = '/exportledger?yearstart='+sessionStorage.yyyymmddyear1+'&yearend='+sessionStorage.yyyymmddyear2;
        xhr.open('GET', url, true);
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
          if (this.status == 200) {
        // get binary data as a response
        var blob = this.response;
        var url = window.URL.createObjectURL(blob);
        window.location.assign(url);
          }
        };
        xhr.send();
      });
    
});