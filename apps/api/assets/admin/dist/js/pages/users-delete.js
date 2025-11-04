$().ready(function () {
  $(document).on('click', '.user-delete', function () {
    var id = $(this).data('user_id');
    $clicked_btn = $(this);
    if (confirm('confirma a exclusão deste usuário?')){
    $.ajax({
      url: BASE_URL + 'Ajax/userDelete',
      type: 'POST',
      data: {
        'delete': 1,
        'id': id,
        dataType: 'Json',
      },
      success: function (result) {
        // remove the deleted comment
          $clicked_btn.closest("tr").remove();

          alert("Usuário excluido");

      },
      error: function () {
        alert("Não foi possível excluir o usuário");
      }
    });
  }
  });
}); ''