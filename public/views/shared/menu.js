var dolcebistroMenu = angular.module('dolcebistroMenu', []);

function menuController($scope, $http){
	$http.get('/api/getUserInfo')
		.success(function(data){
			$scope.userInfo = data;
		});
}
