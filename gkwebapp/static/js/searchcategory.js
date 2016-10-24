$(document).ready(function() {

$(document).off('keydown', '.catsearch').on('keydown', '.catsearch', function(event) {
  event.preventDefault();
  /* Act on the event */
  var rindex = $(this).index();
  if (event.which==32)
  {
    event.preventDefault();
    $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) button").click();

  }
});

$(document).off('click', '.showcat').on('click', '.showcat', function(event) {
  event.preventDefault();
  /* Act on the event */
  var rindex = $(this).index();
  catid = $("#catsearchtab tbody tr:eq("+rindex+") td:first-child select option:selected").attr('data-value');
  alert($("#catsearchtab tbody tr:eq("+rindex+") td:first-child select option:selected").attr('data-value'));


});

});
