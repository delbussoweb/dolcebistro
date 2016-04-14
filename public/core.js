var dolcebistroCustomer = angular.module('dolcebistroCustomer', []);
var dolcebistroHome = angular.module('dolcebistroHome', []);

function homeMainController($scope, $http){
	$http.get('/api/getUserInfo')
		.success(function(data){
			$scope.userInfo = data;
		});
}

function mainController($scope, $http){
	$scope.formData = {};

	$scope.openTotal = 0;

	// when landing on the page, get all customers and show them
	$http.get('/api/customers')
		.success(function(data){
			$scope.customers = data;
			console.log(data);
		})
		.error(function(data){
			console.log('Error: ' + data);
		});

	// when submmitting the add form, send the text to the node API
	$scope.createCustomer = function() {
        $http.post('/api/customers', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.customers = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

	$scope.getOrders = function(id){	
		$scope.openTotal = 0;	
		$http.get('/api/get_orders/' + id)
			.success(function(data){
				$scope.orders = data;
				$scope.openTotalByCustomer = 0;
				$scope.credits = 0;
				var orders = data[0].orders;
				for(var i=0;i<orders.length;i++){
					if(orders[i].status == 0){
						var order = orders[i];
						for(var p=0;p<order.products.length;p++){
							$scope.openTotalByCustomer += (orders[i].products[p].price * orders[i].products[p].quantity);
						}
					}
				}

				for(var i=0;i<data[0].credits.length;i++){
					$scope.credits += data[0].credits[i].amount;
				}
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
	};

	$scope.getTotalByOrder = function(details){
		var orderTotal = 0;
		for(i=0;i<details.products.length;i++){
			var product = details.products[i];
			orderTotal += product.price * product.quantity;
		}

		if(details.status == 0){
			$scope.openTotal += orderTotal;
		}

		return orderTotal;
	};

	//$scope.invoiceTotal = 0;

	$scope.setTotals = function(item){
		var invoiceTotal = 0;
		if(item){
			for(i=0;i<item.length;i++){
				alert(item[i]);
				var product = item[i];
				invoiceTotal += product.price * product.quantity;
			}	
		}

		return invoiceTotal;
	}
	
}

function cartController($scope, $http){
	$scope.customer = "Leandro";
}