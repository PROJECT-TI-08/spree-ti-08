app = angular.module('angularRails');
app.factory('orders', ['$http',function($http){
   var o = {
    orders: []
  };

  o.getAll = function() {
    return $http.get('/orders.json',{ interceptAuth: true}).success(function(data){
      angular.copy(data, o.orders);
    });
  };

  o.get = function(id) {
    return $http.get('/orders/' + id + '.json').then(function(res){
      return res.data;
    });
  };

  return o;
}]);


app.controller('OrdersCtrl', [
'$scope',
'orders',
'$http',
function($scope, orders, $http){
console.log(orders.orders);
$('#table').bootstrapTable({
    data: orders.orders,
    onExpandRow:function (index, row, $detail) {
            console.log(row);
            var factura = (row.factura)? row.factura._id: '-';
            var idtrx   = (row.factura)? row.factura.idtrx: '-';
            $detail.html("<p><b>Proveedor:</b> "+row.proveedor+"</p>"+
                         "<p><b>Cliente:</b> "+row.cliente+"</p>"+
                         "<p><b>Cantidad:</b> "+row.cantidad+"</p>"+
                         "<p><b>Factura:</b> "+factura+"</p>"+
                         "<p><b>Transacción:</b> "+idtrx+"</p>");
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
	//$scope.orders = orders.orders;

}]);