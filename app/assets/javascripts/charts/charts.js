app = angular.module('angularRails');
app.factory('charts', ['$http',function($http){
   var o = {
    saldo: [],
    stocks:[],
    trans: []
  };

  o.getSaldos = function() {
    return $http.get('api/saldos.json').success(function(data){
      return data;
    });
  };

  o.getStocks = function() {
    return $http.get('api/stocks.json').success(function(data){
      return data;
    });
  };

  o.getOrdersCount = function() {
    return $http.get('api/orderschart.json').success(function(data){
      return data;
    });
  };

  o.getTransacciones = function(fecha) {
     var data = $.param({
         fecha: fecha
    });
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    return $http.post('api/transacciones.json', data, config).success(function(data){
      return data;
    });
  };

  return o;
}]);

app.controller("ChartCtrl",['$scope','charts','stores','products', function ($scope,charts,stores,products) {
  /*$scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.series = ['Series A', 'Series B'];*/
 $( "#tabs" ).tabs({
  activate: function( event, ui ) {
    if(event.currentTarget.innerHTML == 'Logistica')
    {
      stores.getAll().then(function(response){
        console.log(response);
        var result_stocks = response.data;
        var labels_stocks = [];
        var values_stocks = [];
        var central_arr = [];
        var pulmon_arr  = [];
        var despacho_arr = [];
        var recepcion_arr = [];
        var t = 1;
        var total_usado = 0;
        var total_spacio = 0;
        for(var i = 0; i < result_stocks.length;i++){
          if(result_stocks[i].despacho && !result_stocks[i].pulmon && !result_stocks[i].recepcion)
          {
            labels_stocks.push('despacho');
            despacho_arr.push(result_stocks[i].usedSpace);
            despacho_arr.push(result_stocks[i].totalSpace - result_stocks[i].usedSpace);
          }
          if(!result_stocks[i].despacho && result_stocks[i].pulmon && !result_stocks[i].recepcion)
          {
            labels_stocks.push('pulmon');
            pulmon_arr.push(result_stocks[i].usedSpace);
            pulmon_arr.push(result_stocks[i].totalSpace - result_stocks[i].usedSpace);
          }
          if(!result_stocks[i].despacho && !result_stocks[i].pulmon && result_stocks[i].recepcion)
          {
            labels_stocks.push('recepcion');
            recepcion_arr.push(result_stocks[i].usedSpace);
            recepcion_arr.push(result_stocks[i].totalSpace - result_stocks[i].usedSpace);
          }
          if(!result_stocks[i].despacho && !result_stocks[i].pulmon && !result_stocks[i].recepcion)
          {
            labels_stocks.push('central '+t);
            total_usado = total_usado + result_stocks[i].usedSpace;
            total_spacio = total_spacio + result_stocks[i].totalSpace;
            if(t==2)
            {
              central_arr.push(total_usado);
              central_arr.push(total_spacio - total_usado);
            }
            t = t + 1;
          }
          values_stocks.push(result_stocks[i].usedSpace);
        }

        var ctx = document.getElementById("bodegas");
        var bodegas_chart = new Chart(ctx,{
        type: 'pie',
        data: {
          labels:labels_stocks,
          datasets:[{
            data: values_stocks,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#A3DE11",
                "#532DD8"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#A3DE11",
                "#532DD8"
            ]
          }
          ]
        },
          options:{
            legend:{
                display:true
             }   
        }
      });

        var ctx_central = document.getElementById("central");
        var central_chart = new Chart(ctx_central,{
        type: 'pie',
        data: {
          labels:['Usado','Disponible'],
          datasets:[{
            data: central_arr,
            backgroundColor: [
                "#FF6384",
                "#36A2EB"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
            ]
          }
          ]
        },
          options:{
            legend:{
                display:true
             }   
        }
      });

         var ctx_pulmon = document.getElementById("pulmon");
        var pulmon_chart = new Chart(ctx_pulmon,{
        type: 'pie',
        data: {
          labels:['Usado','Disponible'],
          datasets:[{
            data: pulmon_arr,
            backgroundColor: [
                "#FF6384",
                "#36A2EB"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
            ]
          }
          ]
        },
          options:{
            legend:{
                display:true
             }   
        }
      });

         var ctx_despacho = document.getElementById("despacho");
        var despacho_chart = new Chart(ctx_despacho,{
        type: 'pie',
        data: {
          labels:['Usado','Disponible'],
          datasets:[{
            data: despacho_arr,
            backgroundColor: [
                "#FF6384",
                "#36A2EB"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
            ]
          }
          ]
        },
          options:{
            legend:{
                display:true
             }   
        }
      });

         var ctx_recepcion = document.getElementById("recepcion");
        var recepcion_chart = new Chart(ctx_recepcion,{
        type: 'pie',
        data: {
          labels:['Usado','Disponible'],
          datasets:[{
            data: recepcion_arr,
            backgroundColor: [
                "#FF6384",
                "#36A2EB"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
            ]
          }
          ]
        },
          options:{
            legend:{
                display:true
             }   
        }
      });

      });

      charts.getStocks().then(function(response){
        console.log('stocks');
        console.log(response);
        var result = response.data;
        var labels_stocks = [];
        var product_18 = [];
        var product_24 = [];
        var product_26 = [];
        var product_37 = [];
        //var product_37 = [];
        for(var i = 0; i < result.length;i++)
        {
          labels_stocks.push(result[i].created_at);
          if(result[i].sku == '18')
          {
             product_18.push(result[i].qty);
          }
          if(result[i].sku == '24')
          {
            product_24.push(result[i].qty); 
          }
          if(result[i].sku == '26')
          {
            product_26.push(result[i].qty);
          }
          if(result[i].sku == '37')
          {
            product_37.push(result[i].qty);
          }
        }

        var ctx_stocks = document.getElementById("stocks").getContext("2d");
        var chart_stocks = new Chart(ctx_stocks, {
          type: 'bar',
          data: {
            labels: labels_stocks,
              datasets: [{
                  label: '18',
                  data: product_18,
                  backgroundColor: 'rgba(255, 99, 132, 0.5)'
              },{
                  label: '24',
                  data: product_24,
                  backgroundColor: 'rgba(255, 99, 0, 0.5)'
              },
              {
                  label: '26',
                  data: product_26,
                  backgroundColor: 'rgba(0, 99, 111, 0.5)'
              },
              {
                  label: '37',
                  data: product_37,
                  backgroundColor: 'rgba(45, 0, 111, 0.5)'
              }]
          },
          options:
          {
            legend:{
                display:true
             },
             scales: {
                  yAxes: [{
                      ticks: {
                          // Create scientific notation labels
                          callback: function(value, index, values) {
                              return value;
                          }
                      }
                  }]
              }
          }
        });       


      });

      products.getAll().then(function(response){
        console.log('productos')
        console.log(response);
      });
    }  
  }
});
 $('#dates_picker').datepicker({ 
  onSelect: function(date){
    charts.getTransacciones(date).then(function(response){
      $scope.transacciones(response);
    });
  },
  dateFormat: "yy-mm-dd",
  minDate: -90, 
  maxDate: "+0D" });
 $scope.transacciones = function(response)
 {
    var is_grouped = $('#is_grouped').is(':checked');
    $('#special').html('');
    var result = response.data.result.result.data;
    var dates = [];
    if(is_grouped)
    {
        for (var i = 0; i < result.length; i++)
        {
          var aux_date = new Date(result[i].created_at);
          var day   = aux_date.getDate();
          var month = aux_date.getMonth() + 1;
          var year  = aux_date.getFullYear();
          if(dates[day+'-'+month+'-'+year] == null)
          {
            dates[day+'-'+month+'-'+year] = [];
            dates[day+'-'+month+'-'+year]['compras'] = 0;
            dates[day+'-'+month+'-'+year]['ventas'] = 0;
          }
          if(result[i]['origen'] == '571262c3a980ba030058ab5e')
          {
            dates[day+'-'+month+'-'+year]['compras'] = dates[day+'-'+month+'-'+year]['compras'] + result[i]['monto'];
          }else
          {
            dates[day+'-'+month+'-'+year]['ventas'] = dates[day+'-'+month+'-'+year]['ventas'] + result[i]['monto'];
          }
        }
        var dates_keys   = Object.keys(dates);
        var dates_length = dates_keys.length;
        var compras = [];
        var ventas  = [];
        for(var j = 0; j < dates_length; j++)
        {
          compras.push(dates[dates_keys[j]].compras);
          ventas.push(dates[dates_keys[j]].ventas);
        }
        var label = 'Compras';
    }else
    {
      var compras = [];
      for (var i = 0; i < result.length; i++)
      {
        dates.push(result[i].created_at);
        compras.push(result[i].monto);
      }
      var dates_keys = dates;
      var ventas = null;
    }

    if(ventas != null)
    {
        var data_json = [{
          label: 'Compras',
          data: compras,
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },{
          label:'Ventas',
          data: ventas,
          backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }];
    }else
    {
      var data_json = [{
          label: 'Transacciones',
          data: compras,
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }];
    }

    $('#special').html("<canvas id='transacciones'></canvas>");
    var ctx = document.getElementById("transacciones");
    var scatterChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates_keys,
          datasets: data_json
      },
      options:
      {
        title: {
          display: false,
          text: 'Transacciones'
        },
        legend:{
            display:true
         },
         scales: {
              yAxes: [{
                  ticks: {
                      // Create scientific notation labels
                      callback: function(value, index, values) {
                          return '$'+value;
                      }
                  }
              }]
          }
      }
    });
 }
  /*charts.getTransacciones('0').then(function(response){
    $scope.transacciones(response);
  });*/

  $("#general").on('click',function(){
      charts.getTransacciones('0').then(function(response){
        $scope.transacciones(response);
      });
  });

  $("#dates").on('change',function(e){
    console.log(this.value);
    charts.getTransacciones(this.value).then(function(response){
      $scope.transacciones(response);
    });
  });

  charts.getSaldos().then(function(response){
      length_saldo = response.data.length
      var saldos       = [];
      var saldo_fechas = [];
      for(var i = 0; i < length_saldo;i++)
      {
        saldos.push(response.data[i].valor);
        saldo_fechas.push(response.data[i].date);
      }
      var ctx = document.getElementById("saldos").getContext("2d");
      var scatterChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: saldo_fechas,
            datasets: [{
                label: 'Saldos',
                data: saldos,
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }]
        },
        options:
        {
          title: {
            display: false,
            text: 'Saldos'
          },
          legend:{
              display:true
           },
           scales: {
                yAxes: [{
                    ticks: {
                        // Create scientific notation labels
                        callback: function(value, index, values) {
                            return '$'+value;
                        }
                    }
                }]
            }
        }
      });
    });

  charts.getOrdersCount().then(function(response){
    var result = response.data;
    var number_keys = Object.keys(result.bynumber);
    var number_length = number_keys.length;
    var numbers = [];
    for(var i= 0;i < number_length;i++)
    {
        numbers.push(result.bynumber[number_keys[i]]);
    }

    var price_keys = Object.keys(result.byprice);
    var price_length = price_keys.length;
    var prices = [];
    for(var i= 0;i < price_length;i++)
    {
        prices.push(result.byprice[price_keys[i]]);
    }
    var ctx = document.getElementById("bynumbers");
    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: {
          labels:number_keys,
          datasets:[{
            data: numbers,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
          }]
        },
        options:{
          defaultFontSize:30,
           title: {
              display: false,
              text: 'Numero de transacciones'
          },
          legend:{
              display:true
           }   
      }
    });
    var ctx2 = document.getElementById("byprices");
    var myDoughnutChart = new Chart(ctx2,{
        type: 'doughnut',
        data: {
          labels:price_keys,
          datasets:[{
            data: prices,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ] 
          }]
        },
        options:{
          defaultFontSize:30,
           title: {
              display: false,
              text: 'Monto de transacciones'
          },
          legend:{
              display:true
           }   
      }
    });

  });

  /*$scope.labels_line = dates_keys;
  $scope.series_line = ['Compras', 'Ventas'];
  $scope.data_line = [compras,ventas];
  $scope.onClick = function (points, evt) {
    console.log(points, evt); 
  };
  $scope.options_line = {
      title: {
        display: true,
        text: 'Transacciones'
      },
      legend:{
        display:true
       },
      scales: {
          yAxes: [{
              ticks: {
                  // Create scientific notation labels
                  callback: function(value, index, values) {
                      return '$'+value;
                  }
              }
          }]
      }
    };
  });*/
      
}]);