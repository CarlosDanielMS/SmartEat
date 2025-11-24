$(document).ready(function () {
    let sidebarCount = 0;

    // Função para abrir sidebars
    function openSidebar(sidebarType) {
        // sidebarCount++; // o side bar não está sendo atualizado quando envio o formulario de add e está causando bug, por isso fixei em 1.
        sidebarCount = 1;
        $.ajax({
            url: `${BASE_URL}/${sidebarType}`,
            method: 'GET',
            success: function (response) {
                const sidebarHtml = `<div id="sidebar${sidebarCount}" class="sidebar bg-light p-4 shadow-lg rounded">${response}</div>`;
                $('#sidebar-container').append(sidebarHtml);

                // Ajuste a posição do sidebar2 se existir
                if (sidebarCount === 2) {
                    $(`#sidebar${sidebarCount}`).css('transform', 'translateX(0)');
                    $('#sidebar1').css('transform', 'translateX(-8%'); // Ajuste para o sidebar1 ficar um pouco mais à esquerda
                } else {
                    $(`#sidebar${sidebarCount}`).addClass('active');
                }

                $('#overlay').addClass('active');
            },
            error: function () {
                alert('Erro ao carregar a sidebar.');
            }
        });
    }

    // Evento para mostrar a primeira sidebar
    $(document).on('click', '.show-sidebar', function () {
   
        openSidebar('planner/storeFood'); // Carrega a primeira sidebar

    });

    // Evento para abrir sidebar a partir do botão dentro do sidebar
    $(document).on('click', '.open-sidebar', function () {
        const sidebarType = $(this).data('sidebar');
        openSidebar(sidebarType); // Carrega a sidebar correspondente
    });

    // Fechar sidebar ao clicar no botão de fechar
    $(document).on('click', '.close-btn', function () {
        const sidebar = $(this).closest('.sidebar');
        sidebar.remove(); // Remove a sidebar do DOM
        sidebarCount--; // Decrementa a contagem

        if ($('#sidebar-container .sidebar').length === 0) {
            $('#overlay').removeClass('active'); // Remove overlay se não houver sidebars
        } else if (sidebarCount === 1) {
            $('#sidebar1').css('transform', 'translateX(0)'); // Restaura a posição do sidebar1
        }
    });

    // Fechar todas as sidebars ao clicar na sobreposição

    const closeSideBar = function() {
        console.log('teste');
        $('.sidebar').remove(); // Remove todas as sidebars
        sidebarCount = 0; // Reseta a contagem
        $('#overlay').removeClass('active'); // Remove overlay
    }

    $(document).on('click', '#overlay', function(){          
        closeSideBar();
    });
});
