$().ready(function () {
  $(document).on('click', '.allergen-delete', function () {
    var id = $(this).data('allergen_id');
    $clicked_btn = $(this);
    if (confirm('confirma a exclusão do alérgeno?')){
    $.ajax({
      url: BASE_URL + 'Ajax/allergenDelete',
      type: 'POST',
      data: {
        'delete': 1,
        'id': id,
        dataType: 'Json',
      },
      success: function (result) {
        // remove the deleted comment
          $clicked_btn.closest("tr").remove();

          alert("Alérgeno excluido");

      },
      error: function () {
        alert("Não foi possível excluir o alérgeno");
      }
    });
  }
  });
}); ''