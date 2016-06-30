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

  o.getOrdersData = function(inicio,fin,type) {
     var data = $.param({
         inicio: inicio,
         fin:fin,
         type:type
    });
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    return $http.post('api/ordersdata.json', data, config).success(function(data){
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

        var ctx_bodegas = document.getElementById("bodegas");
        var bodegas_chart = new Chart(ctx_bodegas,{
        type: 'pie',
        data: {
          labels:labels_stocks,
          datasets:[{
            data: values_stocks,
            backgroundColor: [
                "rgba(215, 40, 40, 0.5)",
                "rgba(215, 182, 44, 0.5)",
                "rgba(243, 117, 35, 0.5)",
                "rgba(61, 162, 8, 0.5)",
                "rgba(215, 44, 213, 0.5)"
            ],
            hoverBackgroundColor: [
                "rgba(215, 40, 40, 0.2)",
                "rgba(215, 182, 44, 0.2)",
                "rgba(243, 117, 35, 0.2)",
                "rgba(61, 162, 8, 0.2)",
                "rgba(215, 44, 213, 0.2)"
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
                "rgba(255, 33, 5, 0.5)",
                "rgba(26, 33, 78, 0.5)"
            ],
            hoverBackgroundColor: [
                "rgba(255, 33, 5, 0.2)",
                "rgba(26, 33, 78, 0.2)"
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
                "rgba(28, 33, 55, 0.5)",
                "rgba(128, 33, 155, 0.5)"
            ],
            hoverBackgroundColor: [
                "rgba(28, 33, 55, 0.2)",
                "rgba(128, 33, 155, 0.2)"
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
                "rgba(156, 255, 40, 0.5)",
                "rgba(233, 88, 40, 0.5)"
            ],
            hoverBackgroundColor: [
                "rgba(156, 255, 40, 0.2)",
                "rgba(233, 88, 40, 0.2)"
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
                "rgba(4, 255, 140, 0.5)",
                "rgba(77, 88, 110, 0.5)"
            ],
            hoverBackgroundColor: [
                "rgba(4, 255, 140, 0.2)",
                "rgba(77, 88, 110, 0.2)"
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
        var result = response.data.values;
        var labels_stocks = response.data.labels;
        var product_18    = result['18'];
        var product_24    = result['24'];
        var product_26    = result['26'];
        var product_37    = result['37'];
        var ctx_stocks = document.getElementById("stocks").getContext("2d");
        var chart_stocks = new Chart(ctx_stocks, {
          type: 'bar',
          data: {
            labels: labels_stocks,
              datasets: [{
                  label: 'Pastel (18)',
                  data: product_18,
                  backgroundColor: 'rgba(255, 99, 132, 0.5)'
              },{
                  label: 'Tela de seda (24)',
                  data: product_24,
                  backgroundColor: 'rgba(255, 99, 0, 0.5)'
              },
              {
                  label: 'Sal (24)',
                  data: product_26,
                  backgroundColor: 'rgba(0, 99, 111, 0.5)'
              },
              {
                  label: 'Lino (37)',
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
          
          //571262c3a980ba030058ab5e
          if(result[i]['origen'] == '572aac69bdb6d403005fb056')
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
    var ctx_trans = document.getElementById("transacciones");
    var chart_trans = new Chart(ctx_trans, {
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

$( "#from" ).datepicker({
      dateFormat: "yy-mm-dd",
      minDate: -90, 
      maxDate: "+0D",
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $( "#to" ).datepicker({
      dateFormat: "yy-mm-dd",
      minDate: -90, 
      maxDate: "+0D",
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
  });

    $('#ver').on('click',function(){
        var inicio = $('#from').val();
        var fin = $('#to').val();
        if(inicio == ''){ inicio = 0; }
        if(fin == ''){ fin = 0; }
        charts.getOrdersData(inicio,fin,0).then(function(response){
          $scope.facturacion(response);
        });

    });

    $('#ver_1').on('click',function(){
        var inicio = $('#from').val();
        var fin = $('#to').val();
        if(inicio == ''){ inicio = 0; }
        if(fin == ''){ fin = 0; }
        charts.getOrdersData(inicio,fin,1).then(function(response){
          $scope.facturacion(response);
        });

    });

    $('#ver_2').on('click',function(){
        var inicio = $('#from').val();
        var fin = $('#to').val();
        if(inicio == ''){ inicio = 0; }
        if(fin == ''){ fin = 0; }
        charts.getOrdersData(inicio,fin,2).then(function(response){
          $scope.facturacion(response);
        });

    });

    $('#ver_3').on('click',function(){
        var inicio = $('#from').val();
        var fin = $('#to').val();
        if(inicio == ''){ inicio = 0; }
        if(fin == ''){ fin = 0; }
        charts.getOrdersData(inicio,fin,3).then(function(response){
          $scope.facturacion(response);
        });

    });

    $("#info_fac").accordion({
      collapsible: true
    });

  $scope.facturacion = function(response)
  {
    console.log(response.data.result);
     $('#table').bootstrapTable('destroy');
              $('#table').bootstrapTable({
    data: response.data.result,
    onExpandRow:function (index, row, $detail) {
            console.log(row);
            var factura = (row.factura)? row.factura._id: '-';
            var idtrx   = (row.factura)? row.factura.idtrx: '-';
            $detail.html("<p><b>Proveedor:</b> "+row.proveedor+"</p>"+
                         "<p><b>Cliente:</b> "+row.cliente+"</p>"+
                         "<p><b>Cantidad:</b> "+row.cantidad+"</p>"+
                         "<p><b>Factura:</b> "+factura+"</p>"+
                         "<p><b>Transacción:</b> "+idtrx+"</p>"+
                         "<p><b>Fecha:</b>"+row.created_at+"</p>");
            //compExtInfo($detail, row);
          },
    columns: [{
        field: '_id',
        title: 'OC'
    }, { 
        field: 'tipo',
        title: 'Tipo',
        formatter:function(value,row,index)
        {
          if(value == 1)
          {
            return '<span class="glyphicon glyphicon-shopping-cart"></span>';
          }else
          {
            return '<span class="glyphicon glyphicon-check"></span>';
          }
        } 
    }, {
        field: 'canal',
        title: 'Canal'
    }, {
        field: 'sku',
        title: 'SKU'
    }, {
        field: 'estado',
        title: 'Estado'
    }]
});

    $('#special_2').html('');
    $('#special_2').html("<canvas id='facturacion'></canvas>");
    var ctx_facturacion = document.getElementById("facturacion").getContext("2d");;
    var chart_facturacion = new Chart(ctx_facturacion, {
      type: 'line',
      data: {
        labels: response.data.dates,
          datasets:[{
          label: 'Monto',
          data: response.data.values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
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
                      callback: function(value, index, values) {
                          return value;
                      }
                  }
              }]
              /*xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }]*/
          }
      }
    });

  }  
  charts.getOrdersData(0,0,0).then(function(response){
    $scope.facturacion(response);
  });

  charts.getTransacciones('0').then(function(response){
    $scope.transacciones(response);
  });

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
      var ctx_saldos = document.getElementById("saldos").getContext("2d");
      var chart_saldos = new Chart(ctx_saldos, {
        type: 'bar',
        data: {
          labels: saldo_fechas,
            datasets: [{
                label: 'Saldos',
                data: saldos,
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
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
                "#EE5522",
                "#DD2166",
                "#CC3422"
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
                "#EE5522",
                "#DD2166",
                "#CC3422"
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