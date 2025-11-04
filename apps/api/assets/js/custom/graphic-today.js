$(function () {
    let graphic = document.querySelector("#chart"),
        calories = graphic.getAttribute('data-calories'),
        pPercentage = graphic.getAttribute('data-p'),
        cPercentage = graphic.getAttribute('data-c'),
        fPercentage = graphic.getAttribute('data-f')

    let options = {
        series: [calories * pPercentage, calories * fPercentage, calories * cPercentage],
        labels: ['Proteínas', 'Gorduras', 'Carboidratos'],
        chart: {
            type: 'pie',
            height: 300
        },
        colors: ['#17a2b8', '#28a745', '#ffc107'],
        plotOptions: {
            pie: {
                size: 200,
                offsetY: 0,
                offsetX: 50,
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        return opts.w.globals.series[opts.seriesIndex] + "%"
                    },
                    style: {
                        fontSize: '14px',
                        colors: ['#fff']
                    },
                }
            }
        },
        legend: {
            labels: {
                colors: '#000'
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    // Inicializa o gráfico
    let chart = new ApexCharts(graphic, options);
    chart.render();
})