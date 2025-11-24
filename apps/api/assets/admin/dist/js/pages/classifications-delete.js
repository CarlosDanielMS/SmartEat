$().ready(function () {
  $(document).on('click', '.classification-delete', function () {
    var id = $(this).data('classification_id');
    $clicked_btn = $(this);
    if (confirm('confirma a exclusão da classificação?')){
    $.ajax({
      url: BASE_URL + 'Ajax/ClassificationDelete',
      type: 'POST',
      data: {
        'delete': 1,
        'id': id,
        dataType: 'Json',
      },
      success: function (result) {
        // remove the deleted comment
          $clicked_btn.closest("tr").remove();

          alert("Classificação excluida");

      },
      error: function () {
        alert("Não foi possível excluir a classificação");
      }
    });
  }
  });
}); ''