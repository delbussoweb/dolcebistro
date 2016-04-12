var dolcebistroCart = angular.module('dolcebistroCart', []);

function mainController($scope, $http){
	$scope.customer = "Leandro";
	$scope.checkout = {};
	$scope.formData = {};

	$http.get('/api/products')
		.success(function(data){
			$scope.products = data;
		})
		.error(function(data){
			console.log('Error: ' + data);
		});

	$http.get('/api/customers')
		.success(function(data){
			$scope.customers = data
		});

	$scope.plusOne = function(index){
		$scope.products[index].quantity += 1;
	};

	$scope.minusOne = function(index){
		$scope.products[index].quantity -= 1;
	};

	$scope.cart = [];
	$scope.totalCart = 0;

	$scope.addToCart = function(index, op){
		var inCart = 0;
		//$scope.totalCart = 0;
		for(var i=0;i<$scope.cart.length;i++){
			if($scope.cart[i].name == $scope.products[index].name){
				if(op == "+"){
					$scope.cart[i].quantity += 1;
					$scope.cart[i].price += $scope.products[index].price
				}
				else{
					$scope.cart[i].quantity -= 1;
					$scope.cart[i].price -= $scope.products[index].price
				}

				inCart = 1;
			}
			
			if($scope.cart[i].quantity < 1){
				$scope.cart.splice(i, 1);
			}
		}

		if(inCart == 0){
			$scope.cart.push({
				name: $scope.products[index].name,
				quantity: 1,
				price: $scope.products[index].price
			});
			$scope.totalCart = $scope.products[index].price;
		}
	};

	$scope.refreshValues = function(){
		$scope.totalCart = 0;
		for(var i=0;i<$scope.cart.length;i++){
			$scope.totalCart += $scope.cart[i].price;
		}
	}

	$scope.checkout = function(customer, status){
		$scope.checkout.customer = customer;
		$scope.checkout.orders.status = status;
		$scope.checkout.orders.products = $scope.cart;

		sendCheckout();
	}

	$scope.sendCheckout = function(customer, status){
		var self = this;
		
		$http.post('/api/checkout', {
				customer: self.txtCustomer.toUpperCase(),
				status: status,
				products: $scope.cart,
				orderTotal: $scope.totalCart
			})
            .success(function(data) {
                $scope.cart = [];
                $scope.totalCart = 0;
                if(data == "success")
                	alert("Pedido incluido com sucesso!");
            })
            .error(function(data) {
                console.log('Error: ' + data);
            }); 
	}

}