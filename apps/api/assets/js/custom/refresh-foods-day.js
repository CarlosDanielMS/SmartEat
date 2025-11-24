$(document).ready(function () {
    $('.btn-refresh-meals').on('click', function () {
        
        let day = $(this).data('day_id');

        $.ajax({
            url: BASE_URL + 'Ajax/refresh_meals',
            type: 'POST',
            data: {
                'day': day,
                dataTtype: 'json'
            },
            success: function (response) {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Erro na requisição:', error);
            }
        });
    });

    // $('.btn-refresh-food').on('click', function () {
        
    //     let day = $(this).data('day_id');

    //     $.ajax({
    //         url: BASE_URL + 'Ajax/refresh_single_food',
    //         type: 'POST',
    //         data: {
    //             'day': day,
    //             dataTtype: 'json'
    //         },
    //         success: function (response) {
    //             alert('Funcionou!');
    //         }
    //     });
    // });
});