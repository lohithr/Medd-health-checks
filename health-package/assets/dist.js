'use strict';

var meddApp = angular.module('meddApp', ['ui.router', 'ngCookies', 'angucomplete-alt', 'ngSanitize', 'ui.select']);

meddApp.config(function ($stateProvider,$urlRouterProvider, $locationProvider) {
	$urlRouterProvider.when('/login/','/login');
	$urlRouterProvider.when('/signup/','/signup');
	$urlRouterProvider.when('/logout/','/logout');
	$urlRouterProvider.when('/adminmedd/','/adminmedd');
	$urlRouterProvider.when('/labpanel/','/labpanel');
	$urlRouterProvider.when('/pharmacy/','/pharmacy');
	$urlRouterProvider.when('/health-packages/','/health-packages');
	// $urlRouterProvider.when('/logoutAdmin','/logoutAdmin');
	// $urlRouterProvider.otherwise('/');
	$locationProvider.html5Mode(true);

	$stateProvider

// ********************DIAGNOSTICS***************************
//NAV
		.state('nav', {
			url: '/nav',
			templateUrl: '/views/home/nav.html',
			controller: 'HomeCtrl'
		})
//Home
		.state('home', {
			url: '/',
			templateUrl: '/views/home/index.html',
			controller: 'HomeCtrl'
		})

//Confirmation
		.state('confirmation', {
			url: '/confirmation',
			templateUrl: '/views/confirmation/index.html',
			controller: 'ConfirmationCtrl'
		})
//Labs Search
		.state('testsearch', {
			url: '/diagnostics/:city/:testgroups',
			templateUrl: '/views/testsearch/results.html',
			controller: 'TestSearchCtrl'
		})
//Checkout-new
		.state('checkout', {
			url: '/checkout',
			templateUrl: '/views/checkout/index.html',
			controller: 'CheckoutCtrl'
		})



// **********Health Packages**********************
//HealthPackages
		.state('healthPackages', {
			url: '/health-packages',
			templateUrl: '/views/healthPackages/index.html',
			controller: 'HealthPackagesCtrl'
		})

		.state('health-package-static', {
			url: '/full-body-checkup-by-thyrocare',
			templateUrl: '/views/healthPackages/full-body-checkup-by-thyrocare.html',
			controller: 'HealthPackageCtrl'
		})
		.state('health-package', {
			url: '/health-packages/:hpid',
			templateUrl: '/views/healthPackages/health-package.html',
			controller: 'HealthPackageCtrl'
		})

// LabPanel
		.state('labpanel-login', {
			url: '/labpanellogin',
			templateUrl: '/views/labpanel/login.html',
			controller: 'LabpanelLoginCtrl'
		})
		.state('labpanel', {
			url: '/labpanel',
			templateUrl: '/views/labpanel/index.html',
			controller: 'LabpanelCtrl'
		})
		.state('labpanel-appointments', {
			url: '/labpanel/appointments',
			templateUrl: '/views/labpanel/appointments.html',
			controller: 'LabpanelAppointmentsCtrl'
		})
		.state('labpanel-fillreport', {
			url: '/labpanel/appointments/fill/:transaction_id',
			templateUrl: '/views/labpanel/fillreport.html',
			controller: 'LabpanelFillReportCtrl'
		})
//sessions
		.state('signup', {
			url: '/signup',
			templateUrl: '/views/session/signup.html',
			controller: 'SignupCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: '/views/session/login.html',
			controller: 'LoginCtrl'
		})

//AboutWhole
		.state('team', {
			url: '/team',
			templateUrl: '/views/about/team.html',
			controller: 'TeamCtrl'
		})
		.state('privacy', {
			url: '/privacy',
			templateUrl: '/views/about/privacy.html',
			controller: 'PrivacyCtrl'
		})
		.state('careers', {
			url: '/careers',
			templateUrl: '/views/about/careers.html'
		})

//Email
		.state('email', {
			url: '/email',
			templateUrl: '/views/emailer/email.html',
			// controller: 'LoginCtrl'
		})
//Encyclopedia
		.state('encyclopedia', {
			url: '/encyclopedia/:test',
			templateUrl: '/views/encyclopedia/test.html',
			controller: 'EncyclopediaCtrl'
		})
})





'use strict';

angular.module('meddApp')
.controller('AboutCtrl',['$scope', 'customHttp', function ($scope, customHttp){
	loadBlogs();
	function loadBlogs() {
		customHttp.request('','/api/blogs/getall','POST',function (data) {
			console.log(data.status);
			if(data.status){
				console.log(data);
				$scope.blogs = data.data;
			}
			else{
				console.log('Some error occurred!');
			}
		})
	}
}])


.controller('TeamCtrl',['$scope', 'customHttp', '$stateParams', function ($scope, customHttp, $stateParams){
	jQuery('html,body').animate({scrollTop:0},500);
}])

.controller('PrivacyCtrl',['$scope', 'customHttp', '$stateParams', function ($scope, customHttp, $stateParams){
	jQuery('html,body').animate({scrollTop:0},500);

	console.log('Privacy Policy')

	loadTnc();
	function loadTnc () {
		customHttp.request('','/api/others/getall','GET',function (data) {
			console.log(data);
			if(data.status && data.data){
				if (data.data.length>0) {
					$scope.others = data.data[0];
					console.log($scope.others)
				} else {
					// $scope.version = data.data[0];
					// console.log(data.data[0]);
					console.log('Create some')
				}

			}
			else{
				$scope.error.push({
					type : 'fail',
					message: data.message
				})
				console.log($scope.error.length);
				console.log($scope.error[0]);
				$scope.toBeAdded = true;
			}
		})
	}
}])








'use strict';

angular.module('meddApp')
.controller('CheckoutCtrl',['$scope', '$rootScope', 'customHttp', '$location', '$stateParams', '$window', '$cookies', function ($scope, $root, customHttp, $location, $stateParams, $window, $cookies){
	jQuery('html,body').animate({scrollTop:0},500);
	$scope.txnDone = false;
	$scope.loading = false;
	$scope.transactions = [];
	$scope.testgroups = $root.testgroups;
	if ($root.cartLabs) {
		$scope.cartLabs = $root.cartLabs;
	} else {
		$scope.cartLabs = JSON.parse($cookies.cartLabs);
	}
	if (!$scope.cartLabs) {
		$location.path('/');
	} else{
		getGrandPrices();
	};

	function getGrandPrices () {
		$scope.grandPrice = {
			list : 0,
			medd : 0,
			discount : 0
		}
		if ($scope.cartLabs.length > 0) {
			$scope.emptyCart = false;
			for (var i = 0; i < $scope.cartLabs.length; i++) {
				$scope.grandPrice.list += $scope.cartLabs[i].price.list;
				$scope.grandPrice.medd += $scope.cartLabs[i].price.medd;
			};
			$scope.grandPrice.discount = (($scope.grandPrice.list - $scope.grandPrice.medd)/$scope.grandPrice.list*100).toFixed();
		} else {
			$scope.emptyCart = true;
		}
	}

	$scope.bookAppointment = function () {
		$scope.loading = true;
		if ($scope.patient.name && $scope.patient.phone) {
			var impParams = 'patient='+JSON.stringify($scope.patient);
			customHttp.request(impParams,'/api/patients/create','POST',function (data) {
				// console.log('data');
				// console.log(data);
				if(data.status){
					var cartLabs = $scope.cartLabs;

					newTransaction();
					function newTransaction() {
						var lab = cartLabs.shift(); //removes the first from the array, and stores in variable 'testgroup'
						lab = JSON.parse(JSON.stringify(lab));

						var txn = {
							app_version : 12,
							source : {
								type : 'web',
								_id : '',
								geolocation : ''
							},
							timestamp : {
								booking: new Date
							},
							type : 'diagnostics',
							user : data.patient._id, //user id
							patient : {
								_id : data.patient._id,
								name : $scope.patient.name,
								email : $scope.patient.email,
								phone : $scope.patient.phone
							},
							diagnostics : {
								_id : lab._id,
								name : lab.name,
								email : lab.email,
								phone : lab.phone,
								address : lab.address,
								tests : lab.testgroups,
								price : {
									mrp : lab.price.list,
									user : lab.price.medd
								}
							},
							home_service : {
								required : $scope.home_collection,
								address : $scope.patient.address
							}
						};
						// var impParams = 'transaction=' + JSON.stringify(txn) + '&testing=' + true;
						var impParams = 'transaction=' + JSON.stringify(txn);
						customHttp.request(impParams,'/api/transactions/create','POST',function (txnData) {
							if(txnData.status){
								var transaction = txnData.transaction
								// $scope.cartLabs[i].tid = txnData.transaction;
								$scope.transactions.push(txnData.data);

								if (cartLabs.length>0) {
									newTransaction();
								} else {
									$scope.txnDone = true;
									$scope.loading = false;
									$cookies.transactions = JSON.stringify($scope.transactions);
									$location.path('/confirmation');
								}
							}
							else{
								Materialize.toast('Sorry! Some Error Occurred!', 2000);
							}
						})
					};
				}
				else{
					Materialize.toast('Sorry! Some Error Occurred!', 2000);
				}
			})
		} else {
			Materialize.toast('Please fill in required fields!', 2000);
		}
	}
}]);






'use strict';

angular.module('meddApp')
.controller('ConfirmationCtrl',['$scope', 'customHttp', '$location', '$stateParams', '$cookies', function ($scope, customHttp, $location, $stateParams, $cookies){
	jQuery('html,body').animate({scrollTop:0},500);
	if ($cookies.transactions) {
		$scope.transactions = JSON.parse($cookies.transactions);
		$scope.patient = $scope.transactions[0].patient;
		console.log($scope.transactions);
		delete $cookies.cartLabs;
		delete $cookies.transactions;
	} else {
		$location.path('/');
	}
}]);





'use strict';

angular.module('meddApp')
.controller('LabpanelHeaderCtrl',['$scope', 'customHttp', 'docReady', '$location', '$cookies', function ($scope, customHttp, docReady, $location, $cookies){
	var url = window.location.pathname;
	console.log(url.match("/labpanel")==null);
	console.log($cookies);
	$scope.labpanelLoggedIn = false;

	// $cookies.remove('loggedIn');
	delete $cookies.loggedIn;
	console.log($cookies);
	if (url.match("/labpanellogin")==null) {

		if ($cookies.labpanelLoggedIn != '1') {
			console.log('wrong')
			$location.path('/labpanel');
			localStorage.removeItem('labpanelSession');
		} else {
			$scope.labpanelLoggedIn = $cookies.labpanelLoggedIn;
			docReady.run();
		    $scope.$watch('url', function(){
		    	$( ".navTab" ).removeClass( "active" )
				if(url.match("/labs")!=null){
					$scope.activeTab = 'labs';
					$( ".labsTab" ).addClass( "active" );
				}
				else if(url.match("/testgroups")!=null){
					$scope.activeTab = 'testgroups';
					$( ".testgroupsTab" ).addClass( "active" );
				}
				else if(url.match("/transactions")!=null){
					$scope.activeTab = 'testgroups';
					$( ".transactionsTab" ).addClass( "active" );
				}
				else if(url.match("/pharmacies")!=null){
					$scope.activeTab = 'testgroups';
					$( ".pharmaciesTab" ).addClass( "active" );
				}
				else if(url.match("/deals")!=null){
					$scope.activeTab = 'deals';
					$( ".dealsTab" ).addClass( "active" );
				}
		    });
		}
	};
	
	$scope.labpanelLogout = function () {
		console.log($cookies.labpanelLoggedIn);
		// $cookies.remove('labpanelLoggedIn');
		$cookies.labpanelLoggedIn = 0;
		$cookies.labpanelSession = null;
		console.log($cookies.labpanelLoggedIn);
		localStorage.removeItem('labpanelSession');
		customHttp.request('','/labpanelLogout','GET',function(){
			window.location.href = '/labpanellogin';
		})
	}
}])





'use strict';

angular.module('meddApp')
.controller('HealthPackagesCtrl',['$scope', 'customHttp', '$location', function ($scope, customHttp, $location){
	$scope.healthPackages = [];
	loadHealthPackages();
	function loadHealthPackages() {
		$scope.loading = true;
		var impParams = 'publish=' + true + '&city=' + 'mumbai';
		customHttp.request(impParams,'/api/healthPackages/get','GET',function (data) {
			if(data.status){
				$scope.healthPackages = data.data;
				if ($scope.healthPackages == null) {
					$scope.healthPackages = [];
				}
				console.log($scope.healthPackages);
				$scope.loading = false;
			}
			else{
				console.log('Some Error Occurred!');
			}
		})
	}

	$scope.goToHP = function (hpid) {
		if (hpid) {
			var path = '/health-packages/' + hpid;
			$location.path(path);
		};
	}
}])

.controller('HealthPackageCtrl',['$scope', 'customHttp', '$stateParams', function ($scope, customHttp, $stateParams){
	var hpid = $stateParams.hpid;
	if (hpid) {
		console.log(hpid);
		loadHealthPackage();
	} else {
		console.log('hpid not defined');
	}
	function loadHealthPackage() {
		$scope.loading = true;
		var impParams = '_id='+hpid;
		customHttp.request(impParams,'/api/healthPackages/get','GET',function (data) {
			console.log(data);
			if(data.status){
				$scope.hp = data.data[0];
				console.log($scope.hp.cover != undefined && $scope.hp.cover != null)
				if ($scope.hp.cover != undefined && $scope.hp.cover != null) {
					if ($scope.hp.cover.image) {
						$scope.hp.image = $scope.hp.cover.image;
					} else {
						$scope.hp.image = 'images/healthPackages/full-body.jpg';
					}
				} else {
					$scope.hp.image = 'images/healthPackages/full-body.jpg';
				}
				$scope.loading = false;
			}
			else{
				console.log('Some Error Occurred!');
			}
		})
	}
	console.log('yo-full-body');
}])





'use strict';
var app = angular.module('meddApp');
app.controller('HeaderCtrl', ['$scope', '$rootScope', 'customHttp', '$location', '$cookies', function ($scope, $root, customHttp, $location, $cookies){
	if ($cookies.selectedCity) {
		$root.selectedCity = $cookies.selectedCity;
	} else {
		$root.selectedCity = 'mumbai';
	}

	loadCities();
	function loadCities() {
		customHttp.request('','/api/cities/getall','GET',function (data) {
			if(data.status){
				$scope.cities = data.data;
			} else{
				console.log('Some Error occurred while fetching cities');
			}
		})
	}

	$scope.selectCity = function () {
		$('#selectCityModal').openModal();
	}

	$scope.changeCity = function (city) {
		$root.selectedCity = city;
		$('#selectCityModal').closeModal();
	}

	$root.$watch('selectedCity', function () {
		$cookies.selectedCity = $root.selectedCity;
	})
}])

app.controller('FooterCtrl', ['$scope', 'customHttp', '$location', '$cookies', function ($scope, customHttp, $location, $cookies){
	$scope.subscribed = false;
	$scope.email = '';
	$scope.subscribe = function () {
		console.log('clicked!!!');
		if ($scope.email != '' && $scope.email != null && $scope.email != undefined) {
			var emailParams = 'email='+$scope.email;
			console.log(emailParams);
			customHttp.request(emailParams, '/api/subscriptions/create', 'POST', function (data) {
				console.log(data);
				console.log(data.status);
				if(data.status){
					console.log(data);
					$scope.email = '';
					$scope.subscribed = true;
					Materialize.toast('Thanks for the subscription!', 2000);
					jQuery('html,body').animate({scrollTop:0},500);
				}
				else{
					$scope.error.push({
						type : 'fail',
						message: data.message
					})
				}
			})
		} else {
			Materialize.toast('Please enter a valid Email ID', 2000);
		}
	}
}])

app.controller('HomeCtrl',['$scope', '$rootScope', 'customHttp', '$location', '$filter', function ($scope, $root , customHttp, $location, $filter){
	jQuery('html,body').animate({scrollTop:0},500);
	$scope.page = 'home';
	$scope.booking = {
		selectedCity : 'mumbai',
		selectedTestgroups : []
	}

	$root.$watch('selectedCity', function () {
		$scope.booking.selectedCity = $root.selectedCity;
	})

	loadCities();
	function loadCities() {
		customHttp.request('','/api/cities/getall','GET',function (data) {
			if(data.status){
				$scope.cities = data.data;
				for (var i = 0; i < $scope.cities.length; i++) {
					var city = $scope.cities[i].name;
					$scope.cities[i].name = city.charAt(0).toUpperCase() + city.slice(1);
				};
			} else{
				console.log('Some Error occurred while fetching cities');
			}
		})
	}

	loadTestgroups();
	function loadTestgroups() {
		$scope.error = [];
		customHttp.request('','/api/testgroups/getall','GET',function (data) {
			if(data.status){
				$scope.testgroups = data.data;
				$scope.testgroups = $filter('orderBy')($scope.testgroups, 'frequency');
				for (var i = 0; i < $scope.testgroups.length; i++) {
					if ($scope.testgroups[i].aliases) {
						if ($scope.testgroups[i].aliases.length > 0) {
							$scope.testgroups[i].aliases_string = '';
							for (var j = 0; j < $scope.testgroups[i].aliases.length; j++) {
								$scope.testgroups[i].aliases_string += $scope.testgroups[i].aliases[j];
								if (j+1 < $scope.testgroups[i].aliases.length) {
									$scope.testgroups[i].aliases_string += ', '
								};
							};
						};
					};
				};
			}
			else{
				$scope.error.push({
					type : 'fail',
					message: data.message
				})
			}
		})
	}


	$scope.searchLabs = function (selectedcity) {

		if ($scope.booking.selectedTestgroups.length > 1) {
			var selectedTestgroupsId = {
				radiology : [],
				pathology : []
			}
			// selectedTestgroupsId.push
			for (var i = 0; i < $scope.booking.selectedTestgroups.length; i++) {
				if ($scope.booking.selectedTestgroups[i].type == 'radiology') {
					selectedTestgroupsId.radiology.push($scope.booking.selectedTestgroups[i].url_name);
				} else if ($scope.booking.selectedTestgroups[i].type == 'pathology') {
					selectedTestgroupsId.pathology.push($scope.booking.selectedTestgroups[i].url_name);
				};
			};
			var finalTestgroupString = '';
			// if (selectedTestgroupsId.radiology.length > 0) {
				finalTestgroupString += 'r=';
				finalTestgroupString += selectedTestgroupsId.radiology.join(',')
			// };
			// if (selectedTestgroupsId.pathology.length > 0) {
				if (finalTestgroupString != '') {
					finalTestgroupString += '+';
				};
				finalTestgroupString += 'p=';
				finalTestgroupString += selectedTestgroupsId.pathology.join(',')
			// };
			var path = '/diagnostics/'+ $scope.booking.selectedCity.toLowerCase() +'/'+ finalTestgroupString;
			$location.path(path);
		} else if ($scope.booking.selectedTestgroups.length == 1) {
			var path = '/diagnostics/'+ $scope.booking.selectedCity.toLowerCase() +'/'+ $scope.booking.selectedTestgroups[0].url_name;
			$location.path(path);
		} else {
			Materialize.toast('Type the test names in the box!', 2000);
		}
	}
}]);





'use strict';

angular.module('meddApp')

// LOGIN CONTROLLER
.controller('LoginCtrl', function ($scope){	
	$scope.tagline = 'Happy to help you!';
})

// SIGNUP CONTROLLER
.controller('SignupCtrl', ['$scope', 'customHttp', '$location', '$cookies', function ($scope, customHttp, $location, $cookies){
	if ($cookies.userLoggedIn == '1') {
		$location.path('/');
	};
	$scope.error = "";
	$scope.Signup = function(){
		if($scope.signup.$valid){
			var name = $scope.name;
			var email = $scope.email;
			var phone = $scope.phone;
			var password = $scope.password;
			console.log(name,email,password);
			var userParams = 'name='+name+'&email='+email+'&phone='+phone+'&password='+password;
			customHttp.request(userParams,'/api/users/signup','POST',function(data){
				console.log(data);
 				if(data.status){
 					document.getElementById("signup").reset();
 					console.log('Succesful signup');
					$cookies.userLoggedIn = 1;
					$cookies.userCsrf = data.session.csrf;
					$cookies.userSession = data.session._id;
 					$location.path('/');
 				}
 				else{
 					$scope.error = data.message;
 					console.log($scope.error);
 				}
 			})
		}
		else{
			console.log('error',$scope.signup.$error);
		}
	};
}])

.controller('LoginCtrl', ['$scope', 'customHttp', '$location', '$cookies', function ($scope, customHttp, $location, $cookies){
	if ($cookies.userLoggedIn == '1') {
		$location.path('/');
	} else {
		console.log('on login page');
	  	$scope.error = [];

	    $scope.Login = function(){
	    	var email = $scope.email;
	    	var password = $scope.password;

			var userParams = 'email='+email+'&password='+password;
			console.log(userParams);
			customHttp.request(userParams,'/api/users/login','POST',function(data){			
				console.log(data);
				if(data.status){
					// $window.localStorage.setItem('log', password);
					// $window.localStorage.setItem('session', data.data._id);
					// $window.localStorage.setItem('csrf', data.data.csrf);
					// $window.location.href = '/';
 					$cookies.userLoggedIn = 1;
 					$cookies.userCsrf = data.session.csrf;
 					$cookies.userSession = data.session._id;
 					$location.path('/');
				}
				else{
					//TODO show the error gracefully;
					$scope.error.push({
						type : 'fail',
						message : data.message
					});
					//alert('login failed');
				}
			})
	    	// var email = angular.element('#loginuser')[0].value;
	    	// var password = angular.element('#loginpswd')[0].value;
	    // 	function validate(email, password){
	    // 		var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
	    // 		if(pattern.test(email)){
					// if(password) { return true; }
					// else {$scope.err = {type : 'fail',message : 'Invalid Password'}; return false;}
	    // 		}else{   
					// $scope.err = {type : 'fail',message : 'invalid email'}	
					// return false;
	    // 		}
	    // 	}

			// if(validate(email, password)){
			// 	console.log(validate(email, password));
			// 	var userParams = 'email='+email+'&password='+password;
			// 	console.log(userParams);
			// 	customHttp.request(userParams,'/api/users/login','POST',function(data){			
			// 		if(data.status){
			// 			// $window.localStorage.setItem('log', password);
			// 			// $window.localStorage.setItem('session', data.data._id);
			// 			// $window.localStorage.setItem('csrf', data.data.csrf);
			// 			// $window.location.href = '/';
	 	// 				$cookies.userLoggedIn = 1;
	 	// 				$cookies.userCsrf = data.session.csrf;
	 	// 				$cookies.userSession = data.session._id;
	 	// 				$location.path('/');
			// 		}
			// 		else{
			// 			//TODO show the error gracefully;
			// 			$scope.error.push({
			// 				type : 'fail',
			// 				message : data.message
			// 			});
			// 			//alert('login failed');
			// 		}
			// 	})			
			// }
			// else{
			// 	$scope.error.push($scope.err);
			// }	
	    }

		$scope.hideAlert = function(){
	      $scope.error = [];
	    };
	}
}]);





'use strict';

var app = angular.module('meddApp');

app.controller('TestSearchCtrl',['$scope', '$rootScope', '$window', 'customHttp', '$location', '$stateParams', '$cookies', function ($scope, $root, $window, customHttp, $location, $stateParams, $cookies){
	jQuery('html,body').animate({scrollTop:0},500);
	$root.selectedCity = $stateParams.city;
	$scope.page = 'labResults';

	$root.$watch('selectedCity', function () {
		$scope.selectedCity = $root.selectedCity;
	})

	$scope.$watch('selectedCity', function () {
		var path = '/diagnostics/'+ $scope.selectedCity.toLowerCase() +'/'+ $stateParams.testgroups;
		$location.path(path);
	})

	$scope.cartLabs = [];
	$scope.emptyCart = true;
	$scope.steps = 1;
	$scope.currentStep = 1;

	$scope.loading=true;
	loadTestgroups();
	function loadTestgroups() {
		customHttp.request('','/api/testgroups/get','GET',function (data) {
			if(data.status){
				$scope.testgroups = data.data;
				loadLabResults();
			}
			else{
				console.log('Some Error Occurred!');
			}
		})
	}

	function loadLabResults () {

		if ($stateParams.testgroups.indexOf("r=") > -1) {
			$scope.urlType="complexUrl";

			var testgroupUrls = $stateParams.testgroups.split('+');

			var radiologyUrls = testgroupUrls[0].split('r=');
			radiologyUrls.splice(0,1);
			radiologyUrls = radiologyUrls[0].split(',');
			for (var i = 0; i < radiologyUrls.length; i++) {
				if (radiologyUrls[i] == null || radiologyUrls[i] == undefined || radiologyUrls[i] == "") {
					radiologyUrls.splice(i, 1);
				};
			};


			var pathologyUrls = testgroupUrls[1].split('p=');
			pathologyUrls.splice(0,1);
			pathologyUrls = pathologyUrls[0].split(',');
			for (var i = 0; i < pathologyUrls.length; i++) {
				if (pathologyUrls[i] == null || pathologyUrls[i] == undefined || pathologyUrls[i] == "") {
					pathologyUrls.splice(i, 1);
				};
			};

			var selectedTestgroupIds = radiologyUrls.concat(pathologyUrls);

			$scope.selectedTestgroups = [];
			$scope.radiologyTestgroups = [];
			$scope.pathologyTestgroups = [];
			for (var i = 0; i < selectedTestgroupIds.length; i++) {
				for (var j = 0; j < $scope.testgroups.length; j++) {
					if (selectedTestgroupIds[i] == $scope.testgroups[j].url_name) {
						$scope.selectedTestgroups.push($scope.testgroups[j]);
						if ($scope.testgroups[j].type == 'radiology') {
							$scope.radiologyTestgroups.push($scope.testgroups[j]);
						} else {
							$scope.pathologyTestgroups.push($scope.testgroups[j]);
						}
					};
				};
			};


			var impParams = 'radiology='+JSON.stringify(radiologyUrls) + '&pathology='+JSON.stringify(pathologyUrls) +'&city='+$scope.selectedCity + '&publish=' + true;
			getLabsByTestgroups(impParams);
		} else {
			$scope.urlType="plainUrl";
			var testgroupArray = [];
			testgroupArray.push($stateParams.testgroups);
			var impParams = 'testgroups='+JSON.stringify(testgroupArray)+'&city='+$scope.selectedCity + '&publish=' + true;
			for (var i = 0; i < $scope.testgroups.length; i++) {
				// $scope.testgroups[i]
				if ($scope.testgroups[i].url_name == $stateParams.testgroups) {
					$scope.testgroup = $scope.testgroups[i];
					$scope.selectedTestgroups = [];
					$scope.selectedTestgroups.push($scope.testgroup);
					$scope.testgroupsType = $scope.testgroup.type;
					getLabsByTestgroups(impParams);
					break;
				};
			};
			
		}

		function getLabsByTestgroups (impParams) {
			customHttp.request(impParams,'/api/labs/getbytestgroupsurl','GET',function (data) {
				if (data.data.radiology == null || data.data.radiology == undefined || data.data.radiology == '') {
					data.data.radiology = [];
				} else if (data.data.pathology == null || data.data.pathology == undefined || data.data.pathology == '') {
					data.data.pathology = [];
				};
				if(data.status){
					$scope.labsData = data.data;
					// labsInit();

					if ($scope.urlType == 'complexUrl') {
						$scope.testgroupsType = 'pathology';
						if (radiologyUrls.length > 0 && pathologyUrls.length > 0) {
							$scope.testgroupsType = 'both';
							$scope.steps = 2;
							$scope.labsData = data.data;
							$scope.labs = data.data.radiology;
							Materialize.toast('First select radiology lab!', 2000);
						} else {
							if (radiologyUrls.length > 0 && pathologyUrls.length == 0) {
								$scope.testgroupsType = 'radiology';
								$scope.labs = data.data.radiology;
							} else if (radiologyUrls.length == 0 && pathologyUrls.length > 0) {
								$scope.testgroupsType = 'pathology';
								$scope.labs = data.data.pathology;
							};
						}
					} else {
						$scope.labs = data.data;
					}

					labsInit();
				}
				else{
					Materialize.toast('Sorry! Some error occurred', 2000);
				}
			});
		}

	}

	function labsInit () {
		$scope.loading = false;
		$scope.cartLabs = [];
		if (!$scope.labs) {
			$scope.labs = [];
		} else {
			getLabPrices();
		}
	}

	function getLabPrices () {

		for (var i = 0; i < $scope.labs.length; i++) {
			var price = {
				list : 0,
				medd : 0,
				discount : 0
			}
			for (var j = 0; j < $scope.labs[i].testgroups.length; j++) {
				price.list += $scope.labs[i].testgroups[j].mrp;
				price.medd += $scope.labs[i].testgroups[j].user;
			};
			price.discount = ((price.list - price.medd)/price.list*100).toFixed();
			$scope.labs[i].price = price;
			$scope.labs[i].disabled = false;
		};
	}


	function getGrandPrices () {
		$scope.grandPrice = {
			list : 0,
			medd : 0,
			discount : 0
		}
		if ($scope.cartLabs.length > 0) {
			$scope.emptyCart = false;
			for (var i = 0; i < $scope.cartLabs.length; i++) {
				$scope.grandPrice.list += $scope.cartLabs[i].price.list;
				$scope.grandPrice.medd += $scope.cartLabs[i].price.medd;
			};
			$scope.grandPrice.discount = (($scope.grandPrice.list - $scope.grandPrice.medd)/$scope.grandPrice.list*100).toFixed();
		} else {
			$scope.emptyCart = true;
		}
	}

	$scope.selectLab = function (lab) {
		jQuery('html,body').animate({scrollTop:0},500);
		var duplicate = false;
		for (var i = 0; i < $scope.cartLabs.length; i++) {
			if ($scope.cartLabs[i]._id == lab._id) {
				duplicate = true;
				break;
			};
		};

		if (!duplicate) {
			if ($scope.cartLabs.length<$scope.steps) {
				$scope.cartLabs.push(lab);
			};
		};
		getGrandPrices();
		if ($scope.steps == $scope.currentStep) {
			goToCheckoutPage();
		};
		nextStep();
	}

	function nextStep () {
		if ($scope.testgroupsType == 'both' && $scope.steps > $scope.currentStep) {
			$scope.currentStep += 1;
			$scope.labs = $scope.labsData.pathology;
			Materialize.toast('Now choose the pathology lab!', 2000);
		};
		getLabPrices();
	}

	$scope.goToCheckoutPage = function () {
		goToCheckoutPage();
	}

	function goToCheckoutPage () {
		if ($scope.cartLabs.length > 0) {
			$root.cartLabs = $scope.cartLabs;
			$cookies.cartLabs = JSON.stringify($scope.cartLabs);
		} else {
			Materialize.toast('Please choose the lab first!', 2000);
		}
		var path = '/checkout';
		$location.path(path);
	}
}]);





/*
 * Modified by @akigupta131
 * angucomplete-alt
 * Autocomplete directive for AngularJS
 * This is a fork of Daryl Rowland's angucomplete with some extra features.
 * By Hidenari Nozaki
 *
 *Reforked by Akash Deep Singhal (@akigupta131)
 * Modified to limit number of results
 */

/*! Copyright (c) 2014 Hidenari Nozaki and contributors | Licensed under the MIT license */

'use strict';

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory(require('angular'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else {
    // Global Variables
    factory(root.angular);
  }
}(window, function (angular) {

  angular.module('angucomplete-alt', [] )
    .directive('angucompleteAlt', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', function ($q, $parse, $http, $sce, $timeout, $templateCache) {
    // keyboard events
    var KEY_DW  = 40;
    var KEY_RT  = 39;
    var KEY_UP  = 38;
    var KEY_LF  = 37;
    var KEY_ES  = 27;
    var KEY_EN  = 13;
    var KEY_BS  =  8;
    var KEY_DEL = 46;
    var KEY_TAB =  9;

    var MIN_LENGTH = 3;
    var MAX_LENGTH = 524288;  // the default max length per the html maxlength attribute
    var PAUSE = 500;
    var BLUR_TIMEOUT = 200;
    var ORDER_BY = 'name';

    // string constants
    var REQUIRED_CLASS = 'autocomplete-required';
    var TEXT_SEARCHING = 'Searching...';
    var TEXT_NORESULTS = 'No results found';
    var TEMPLATE_URL = '/angucomplete-alt/index.html';

    // Set the default template for this directive
    $templateCache.put(TEMPLATE_URL,
        '<div class="angucomplete-holder" ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">' +
        '  <input id="{{id}}_value" ng-model="searchStr" ng-disabled="disableInput" type="{{type}}" placeholder="{{placeholder}}" maxlength="{{maxlength}}" ng-focus="onFocusHandler()" class="{{inputClass}}" ng-focus="resetHideResults()" ng-blur="hideResults($event)" autocapitalize="off" autocorrect="off" autocomplete="off" ng-change="inputChangeHandler(searchStr)"/>' +
        '  <div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-show="showDropdown">' +
        '    <div class="angucomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
        '    <div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
        '    <div class="angucomplete-row" ng-repeat="result in results | orderBy : orderBy " ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}">' +
        '      <div ng-if="imageField" class="angucomplete-image-holder">' +
        '        <img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/>' +
        '        <div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div>' +
        '      </div>' +
        '      <div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div>' +
        '      <div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div>' +
        '      <div ng-if="matchClass && result.description && result.description != \'\'" class="angucomplete-description" ng-bind-html="result.description"></div>' +
        '      <div ng-if="!matchClass && result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );

    return {
      restrict: 'EA',
      require: '^?form',
      scope: {
        selectedObject: '=',
        disableInput: '=',
        initialValue: '@',
        localData: '=',
        remoteUrlRequestFormatter: '=',
        remoteUrlRequestWithCredentials: '@',
        remoteUrlResponseFormatter: '=',
        remoteUrlErrorCallback: '=',
        id: '@',
        type: '@',
        placeholder: '@',
        remoteUrl: '@',
        remoteUrlDataField: '@',
        titleField: '@',
        descriptionField: '@',
        imageField: '@',
        inputClass: '@',
        pause: '@',
        searchFields: '@',
        minlength: '@',
        matchClass: '@',
        clearSelected: '@',
        overrideSuggestions: '@',
        fieldRequired: '@',
        fieldRequiredClass: '@',
        inputChanged: '=',
        autoMatch: '@',
        focusOut: '&',
        focusIn: '&',
        limitTo: '@',
        orderBy: '@'
      },
      templateUrl: function(element, attrs) {
        return attrs.templateUrl || TEMPLATE_URL;
      },
      link: function(scope, elem, attrs, ctrl) {
        console.log('scope.orderBy');
        console.log(scope.orderBy);
        console.log('scope.limitTo');
        console.log(scope.limitTo);
        var inputField = elem.find('input');
        var minlength = MIN_LENGTH;
        var searchTimer = null;
        var hideTimer;
        var requiredClassName = REQUIRED_CLASS;
        var responseFormatter;
        var validState = null;
        var httpCanceller = null;
        var dd = elem[0].querySelector('.angucomplete-dropdown');
        var isScrollOn = false;
        var mousedownOn = null;
        var unbindInitialValue;

        elem.on('mousedown', function(event) {
          mousedownOn = event.target.id;
        });

        scope.currentIndex = null;
        scope.searching = false;
        scope.searchStr = scope.initialValue;
        unbindInitialValue = scope.$watch('initialValue', function(newval, oldval){
          if (newval && newval.length > 0) {
            scope.searchStr = scope.initialValue;
            handleRequired(true);
            unbindInitialValue();
          }
        });

        scope.$on('angucomplete-alt:clearInput', function (event, elementId) {
          if (!elementId) {
            scope.searchStr = null;
            clearResults();
          }
          else { // id is given
            if (scope.id === elementId) {
              scope.searchStr = null;
              clearResults();
            }
          }
        });

        // for IE8 quirkiness about event.which
        function ie8EventNormalizer(event) {
          return event.which ? event.which : event.keyCode;
        }

        function callOrAssign(value) {
          if (typeof scope.selectedObject === 'function') {
            scope.selectedObject(value);
          }
          else {
            scope.selectedObject = value;
          }

          if (value) {
            handleRequired(true);
          }
          else {
            handleRequired(false);
          }
        }

        function callFunctionOrIdentity(fn) {
          return function(data) {
            return scope[fn] ? scope[fn](data) : data;
          };
        }

        function setInputString(str) {
          callOrAssign({originalObject: str});

          if (scope.clearSelected) {
            scope.searchStr = null;
          }
          clearResults();
        }

        function extractTitle(data) {
          // split title fields and run extractValue for each and join with ' '
          return scope.titleField.split(',')
            .map(function(field) {
              return extractValue(data, field);
            })
            .join(' ');
        }

        function extractValue(obj, key) {
          var keys, result;
          if (key) {
            keys= key.split('.');
            result = obj;
            keys.forEach(function(k) { result = result[k]; });
          }
          else {
            result = obj;
          }
          return result;
        }

        function findMatchString(target, str) {
          var result, matches, re;
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
          // Escape user input to be treated as a literal string within a regular expression
          re = new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          if (!target) { return; }
          matches = target.match(re);
          if (matches) {
            result = target.replace(re,
                '<span class="'+ scope.matchClass +'">'+ matches[0] +'</span>');
          }
          else {
            result = target;
          }
          return $sce.trustAsHtml(result);
        }

        function handleRequired(valid) {
          validState = scope.searchStr;
          if (scope.fieldRequired && ctrl) {
            ctrl.$setValidity(requiredClassName, valid);
          }
        }

        function keyupHandler(event) {
          var which = ie8EventNormalizer(event);
          if (which === KEY_LF || which === KEY_RT) {
            // do nothing
            return;
          }

          if (which === KEY_UP || which === KEY_EN) {
            event.preventDefault();
          }
          else if (which === KEY_DW) {
            event.preventDefault();
            if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength) {
              initResults();
              scope.searching = true;
              searchTimerComplete(scope.searchStr);
            }
          }
          else if (which === KEY_ES) {
            clearResults();
            scope.$apply(function() {
              inputField.val(scope.searchStr);
            });
          }
          else {
            if (minlength === 0 && !scope.searchStr) {
              return;
            }

            if (!scope.searchStr || scope.searchStr === '') {
              scope.showDropdown = false;
            } else if (scope.searchStr.length >= minlength) {
              initResults();

              if (searchTimer) {
                $timeout.cancel(searchTimer);
              }

              scope.searching = true;

              searchTimer = $timeout(function() {
                searchTimerComplete(scope.searchStr);
              }, scope.pause);
            }

            if (validState && validState !== scope.searchStr && !scope.clearSelected) {
              callOrAssign(undefined);
            }
          }
        }

        function handleOverrideSuggestions(event) {
          if (scope.overrideSuggestions &&
              !(scope.selectedObject && scope.selectedObject.originalObject === scope.searchStr)) {
            if (event) {
              event.preventDefault();
            }
            setInputString(scope.searchStr);
          }
        }

        function dropdownRowOffsetHeight(row) {
          var css = getComputedStyle(row);
          return row.offsetHeight +
            parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
        }

        function dropdownHeight() {
          return dd.getBoundingClientRect().top +
            parseInt(getComputedStyle(dd).maxHeight, 10);
        }

        function dropdownRow() {
          return elem[0].querySelectorAll('.angucomplete-row')[scope.currentIndex];
        }

        function dropdownRowTop() {
          return dropdownRow().getBoundingClientRect().top -
            (dd.getBoundingClientRect().top +
             parseInt(getComputedStyle(dd).paddingTop, 10));
        }

        function dropdownScrollTopTo(offset) {
          dd.scrollTop = dd.scrollTop + offset;
        }

        function updateInputField(){
          var current = scope.results[scope.currentIndex];
          if (scope.matchClass) {
            inputField.val(extractTitle(current.originalObject));
          }
          else {
            inputField.val(current.title);
          }
        }

        function keydownHandler(event) {
          var which = ie8EventNormalizer(event);
          var row = null;
          var rowTop = null;

          if (which === KEY_EN && scope.results) {
            if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
              event.preventDefault();
              scope.selectResult(scope.results[scope.currentIndex]);
            } else {
              handleOverrideSuggestions(event);
              clearResults();
            }
            scope.$apply();
          } else if (which === KEY_DW && scope.results) {
            event.preventDefault();
            if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
              scope.$apply(function() {
                scope.currentIndex ++;
                updateInputField();
              });

              if (isScrollOn) {
                row = dropdownRow();
                if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                  dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                }
              }
            }
          } else if (which === KEY_UP && scope.results) {
            event.preventDefault();
            if (scope.currentIndex >= 1) {
              scope.$apply(function() {
                scope.currentIndex --;
                updateInputField();
              });

              if (isScrollOn) {
                rowTop = dropdownRowTop();
                if (rowTop < 0) {
                  dropdownScrollTopTo(rowTop - 1);
                }
              }
            }
            else if (scope.currentIndex === 0) {
              scope.$apply(function() {
                scope.currentIndex = -1;
                inputField.val(scope.searchStr);
              });
            }
          } else if (which === KEY_TAB) {
            if (scope.results && scope.results.length > 0 && scope.showDropdown) {
              if (scope.currentIndex === -1 && scope.overrideSuggestions) {
                // intentionally not sending event so that it does not
                // prevent default tab behavior
                handleOverrideSuggestions();
              }
              else {
                if (scope.currentIndex === -1) {
                  scope.currentIndex = 0;
                }
                scope.selectResult(scope.results[scope.currentIndex]);
                scope.$digest();
              }
            }
            else {
              // no results
              // intentionally not sending event so that it does not
              // prevent default tab behavior
              if (scope.searchStr && scope.searchStr.length > 0) {
                handleOverrideSuggestions();
              }
            }
          }
        }

        function httpSuccessCallbackGen(str) {
          return function(responseData, status, headers, config) {
            scope.searching = false;
            processResults(
              extractValue(responseFormatter(responseData), scope.remoteUrlDataField),
              str);
          };
        }

        function httpErrorCallback(errorRes, status, headers, config) {
          if (status !== 0) {
            if (scope.remoteUrlErrorCallback) {
              scope.remoteUrlErrorCallback(errorRes, status, headers, config);
            }
            else {
              if (console && console.error) {
                console.error('http error');
              }
            }
          }
        }

        function cancelHttpRequest() {
          if (httpCanceller) {
            httpCanceller.resolve();
          }
        }

        function getRemoteResults(str) {
          var params = {},
              url = scope.remoteUrl + encodeURIComponent(str);
          if (scope.remoteUrlRequestFormatter) {
            params = {params: scope.remoteUrlRequestFormatter(str)};
            url = scope.remoteUrl;
          }
          if (!!scope.remoteUrlRequestWithCredentials) {
            params.withCredentials = true;
          }
          cancelHttpRequest();
          httpCanceller = $q.defer();
          params.timeout = httpCanceller.promise;
          $http.get(url, params)
            .success(httpSuccessCallbackGen(str))
            .error(httpErrorCallback);
        }

        function clearResults() {
          scope.showDropdown = false;
          scope.results = [];
          if (dd) {
            dd.scrollTop = 0;
          }
        }

        function initResults() {
          scope.showDropdown = true;
          scope.currentIndex = -1;
          scope.results = [];
        }

        function getLocalResults(str) {
          console.log(scope.localData);
          var i, match, s, value,
              searchFields = scope.searchFields.split(','),
              matches = [];

          for (i = 0; i < scope.localData.length; i++) {
            match = false;

            for (s = 0; s < searchFields.length; s++) {
              value = extractValue(scope.localData[i], searchFields[s]) || '';
              match = match || (value.toLowerCase().indexOf(str.toLowerCase()) >= 0);
            }

            if (match) {
              matches[matches.length] = scope.localData[i];
            }
          }

          scope.searching = false;
          processResults(matches, str);
        }

        function checkExactMatch(result, obj, str){
          for(var key in obj){
            if(obj[key].toLowerCase() === str.toLowerCase()){
              scope.selectResult(result);
              return;
            }
          }
        }

        function searchTimerComplete(str) {
          // Begin the search
          if (!str || str.length < minlength) {
            return;
          }
          if (scope.localData) {
            scope.$apply(function() {
              getLocalResults(str);
            });
          }
          else {
            getRemoteResults(str);
          }
        }

        function processResults(responseData, str) {
          var i, description, image, text, formattedText, formattedDesc;

          if (responseData && responseData.length > 0) {
            scope.results = [];

            for (i = 0; i < responseData.length; i++) {
              if (scope.titleField && scope.titleField !== '') {
                text = formattedText = extractTitle(responseData[i]);
              }

              description = '';
              if (scope.descriptionField) {
                description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
              }

              image = '';
              if (scope.imageField) {
                image = extractValue(responseData[i], scope.imageField);
              }

              if (scope.matchClass) {
                formattedText = findMatchString(text, str);
                formattedDesc = findMatchString(description, str);
              }

              scope.results[scope.results.length] = {
                title: formattedText,
                description: formattedDesc,
                image: image,
                originalObject: responseData[i]
              };

              if (scope.autoMatch) {
                checkExactMatch(scope.results[scope.results.length-1],
                    {title: text, desc: description || ''}, scope.searchStr);
              }
            }

          } else {
            scope.results = [];
          }
        }

        // function showAll() {
        //   var focusData = [];
        //   // var i, j, k;
        //   // var idData = ['552687a71f0bb8121ee730f3', '552687a71f0bb8121ee7310c', '552687a71f0bb8121ee73147', '552687a81f0bb8121ee73180', '552687a81f0bb8121ee73189', '552687a81f0bb8121ee7318d'];
        //   // for (i=0,k=0, j=0;i<scope.localData.length;i++){
        //   //   for(j=0; j<6; j++){
        //   //     if(idData[j] === extractValue(scope.localData[i], scope.descriptionField)._id){
        //   //       focusData[k] = scope.localData[i];
        //   //       k++;
        //   //     }
        //   //     else{
        //   //       continue;
        //   //     }
        //   //   }
        //   // }
        //   if (scope.localData) {
        //     processResults(focusData, '');
        //   }
        //   else {
        //     getRemoteResults('');
        //   }
        // }

      function showAll() {
        if (scope.localData) {
          processResults(scope.localData, '');
        }
        else if (scope.remoteApiHandler) {
          getRemoteResultsWithCustomHandler('');
        }
        else {
          getRemoteResults('');
        }
      }


        scope.onFocusHandler = function() {
          if (scope.focusIn) {
            scope.focusIn();
          }
          if (minlength === 0 && (!scope.searchStr || scope.searchStr.length === 0)) {
            scope.showDropdown = true;
            showAll();
          }
        };

        scope.hideResults = function(event) {
          if (mousedownOn === scope.id + '_dropdown') {
            mousedownOn = null;
          }
          else {
            hideTimer = $timeout(function() {
              clearResults();
              scope.$apply(function() {
                if (scope.searchStr && scope.searchStr.length > 0) {
                  inputField.val(scope.searchStr);
                }
              });
            }, BLUR_TIMEOUT);
            cancelHttpRequest();

            if (scope.focusOut) {
              scope.focusOut();
            }

            if (scope.overrideSuggestions) {
              if (scope.searchStr && scope.searchStr.length > 0 && scope.currentIndex === -1) {
                handleOverrideSuggestions();
              }
            }
          }
        };

        scope.resetHideResults = function() {
          if (hideTimer) {
            $timeout.cancel(hideTimer);
          }
        };

        scope.hoverRow = function(index) {
          scope.currentIndex = index;
        };

        scope.selectResult = function(result) {
          // Restore original values
          if (scope.matchClass) {
            result.title = extractTitle(result.originalObject);
            result.description = extractValue(result.originalObject, scope.descriptionField);
          }

          if (scope.clearSelected) {
            scope.searchStr = null;
          }
          else {
            scope.searchStr = result.title;
          }
          callOrAssign(result);
          clearResults();
        };

        scope.inputChangeHandler = function(str) {
          if (str.length < minlength) {
            clearResults();
          }
          else if (str.length === 0 && minlength === 0) {
            scope.searching = false;
            showAll();
          }

          if (scope.inputChanged) {
            str = scope.inputChanged(str);
          }
          return str;
        };

        // check required
        if (scope.fieldRequiredClass && scope.fieldRequiredClass !== '') {
          requiredClassName = scope.fieldRequiredClass;
        }

        // check min length
        if (scope.minlength && scope.minlength !== '') {
          minlength = parseInt(scope.minlength, 10);
        }

        // check pause time
        if (!scope.pause) {
          scope.pause = PAUSE;
        }

        // check result-numbers-limit
        if (!scope.limitTo) {
          scope.limitTo = 5;
        }

        // check clearSelected
        if (!scope.clearSelected) {
          scope.clearSelected = false;
        }

        // check override suggestions
        if (!scope.overrideSuggestions) {
          scope.overrideSuggestions = false;
        }

        // check required field
        if (scope.fieldRequired && ctrl) {
          // check initial value, if given, set validitity to true
          if (scope.initialValue) {
            handleRequired(true);
          }
          else {
            handleRequired(false);
          }
        }

        // set strings for "Searching..." and "No results"
        scope.textSearching = attrs.textSearching ? attrs.textSearching : TEXT_SEARCHING;
        scope.textNoResults = attrs.textNoResults ? attrs.textNoResults : TEXT_NORESULTS;
        
        // set max length (default to maxlength deault from html
        scope.maxlength = attrs.maxlength ? attrs.maxlength : MAX_LENGTH;

        // register events
        inputField.on('keydown', keydownHandler);
        inputField.on('keyup', keyupHandler);

        // set response formatter
        responseFormatter = callFunctionOrIdentity('remoteUrlResponseFormatter');

        scope.$on('$destroy', function() {
          // take care of required validity when it gets destroyed
          handleRequired(true);
        });

        // set isScrollOn
        $timeout(function() {
          var css = getComputedStyle(dd);
          isScrollOn = css.maxHeight && css.overflowY === 'auto';
        });
      }
    };
  }]);

}));






/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.13.2 - 2015-10-09T15:34:24.040Z
 * License: MIT
 */


(function () { 
"use strict";

var KEY = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46,
    COMMAND: 91,

    MAP: { 91 : "COMMAND", 8 : "BACKSPACE" , 9 : "TAB" , 13 : "ENTER" , 16 : "SHIFT" , 17 : "CTRL" , 18 : "ALT" , 19 : "PAUSEBREAK" , 20 : "CAPSLOCK" , 27 : "ESC" , 32 : "SPACE" , 33 : "PAGE_UP", 34 : "PAGE_DOWN" , 35 : "END" , 36 : "HOME" , 37 : "LEFT" , 38 : "UP" , 39 : "RIGHT" , 40 : "DOWN" , 43 : "+" , 44 : "PRINTSCREEN" , 45 : "INSERT" , 46 : "DELETE", 48 : "0" , 49 : "1" , 50 : "2" , 51 : "3" , 52 : "4" , 53 : "5" , 54 : "6" , 55 : "7" , 56 : "8" , 57 : "9" , 59 : ";", 61 : "=" , 65 : "A" , 66 : "B" , 67 : "C" , 68 : "D" , 69 : "E" , 70 : "F" , 71 : "G" , 72 : "H" , 73 : "I" , 74 : "J" , 75 : "K" , 76 : "L", 77 : "M" , 78 : "N" , 79 : "O" , 80 : "P" , 81 : "Q" , 82 : "R" , 83 : "S" , 84 : "T" , 85 : "U" , 86 : "V" , 87 : "W" , 88 : "X" , 89 : "Y" , 90 : "Z", 96 : "0" , 97 : "1" , 98 : "2" , 99 : "3" , 100 : "4" , 101 : "5" , 102 : "6" , 103 : "7" , 104 : "8" , 105 : "9", 106 : "*" , 107 : "+" , 109 : "-" , 110 : "." , 111 : "/", 112 : "F1" , 113 : "F2" , 114 : "F3" , 115 : "F4" , 116 : "F5" , 117 : "F6" , 118 : "F7" , 119 : "F8" , 120 : "F9" , 121 : "F10" , 122 : "F11" , 123 : "F12", 144 : "NUMLOCK" , 145 : "SCROLLLOCK" , 186 : ";" , 187 : "=" , 188 : "," , 189 : "-" , 190 : "." , 191 : "/" , 192 : "`" , 219 : "[" , 220 : "\\" , 221 : "]" , 222 : "'"
    },

    isControl: function (e) {
        var k = e.which;
        switch (k) {
        case KEY.COMMAND:
        case KEY.SHIFT:
        case KEY.CTRL:
        case KEY.ALT:
            return true;
        }

        if (e.metaKey) return true;

        return false;
    },
    isFunctionKey: function (k) {
        k = k.which ? k.which : k;
        return k >= 112 && k <= 123;
    },
    isVerticalMovement: function (k){
      return ~[KEY.UP, KEY.DOWN].indexOf(k);
    },
    isHorizontalMovement: function (k){
      return ~[KEY.LEFT,KEY.RIGHT,KEY.BACKSPACE,KEY.DELETE].indexOf(k);
    }
  };

/**
 * Add querySelectorAll() to jqLite.
 *
 * jqLite find() is limited to lookups by tag name.
 * TODO This will change with future versions of AngularJS, to be removed when this happens
 *
 * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
 * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
 */
if (angular.element.prototype.querySelectorAll === undefined) {
  angular.element.prototype.querySelectorAll = function(selector) {
    return angular.element(this[0].querySelectorAll(selector));
  };
}

/**
 * Add closest() to jqLite.
 */
if (angular.element.prototype.closest === undefined) {
  angular.element.prototype.closest = function( selector) {
    var elem = this[0];
    var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

    while (elem) {
      if (matchesSelector.bind(elem)(selector)) {
        return elem;
      } else {
        elem = elem.parentElement;
      }
    }
    return false;
  };
}

var latestId = 0;

var uis = angular.module('ui.select', [])

.constant('uiSelectConfig', {
  theme: 'bootstrap',
  searchEnabled: true,
  sortable: false,
  placeholder: '', // Empty by default, like HTML tag <select>
  refreshDelay: 1000, // In milliseconds
  closeOnSelect: true,
  dropdownPosition: 'auto',
  generateId: function() {
    return latestId++;
  },
  appendToBody: false
})

// See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
.service('uiSelectMinErr', function() {
  var minErr = angular.$$minErr('ui.select');
  return function() {
    var error = minErr.apply(this, arguments);
    var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
    return new Error(message);
  };
})

// Recreates old behavior of ng-transclude. Used internally.
.directive('uisTranscludeAppend', function () {
  return {
    link: function (scope, element, attrs, ctrl, transclude) {
        transclude(scope, function (clone) {
          element.append(clone);
        });
      }
    };
})

/**
 * Highlights text that matches $select.search.
 *
 * Taken from AngularUI Bootstrap Typeahead
 * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
 */
.filter('highlight', function() {
  function escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  return function(matchItem, query) {
    return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
  };
})

/**
 * A read-only equivalent of jQuery's offset function: http://api.jquery.com/offset/
 *
 * Taken from AngularUI Bootstrap Position:
 * See https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js#L70
 */
.factory('uisOffset',
  ['$document', '$window',
  function ($document, $window) {

  return function(element) {
    var boundingClientRect = element[0].getBoundingClientRect();
    return {
      width: boundingClientRect.width || element.prop('offsetWidth'),
      height: boundingClientRect.height || element.prop('offsetHeight'),
      top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
      left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
    };
  };
}]);

uis.directive('uiSelectChoices',
  ['uiSelectConfig', 'uisRepeatParser', 'uiSelectMinErr', '$compile',
  function(uiSelectConfig, RepeatParser, uiSelectMinErr, $compile) {

  return {
    restrict: 'EA',
    require: '^uiSelect',
    replace: true,
    transclude: true,
    templateUrl: function(tElement) {
      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      return theme + '/choices.tpl.html';
    },

    compile: function(tElement, tAttrs) {

      if (!tAttrs.repeat) throw uiSelectMinErr('repeat', "Expected 'repeat' expression.");

      return function link(scope, element, attrs, $select, transcludeFn) {

        // var repeat = RepeatParser.parse(attrs.repeat);
        var groupByExp = attrs.groupBy;
        var groupFilterExp = attrs.groupFilter;

        $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult

        $select.disableChoiceExpression = attrs.uiDisableChoice;
        $select.onHighlightCallback = attrs.onHighlight;

        $select.dropdownPosition = attrs.position ? attrs.position.toLowerCase() : uiSelectConfig.dropdownPosition;

        if(groupByExp) {
          var groups = element.querySelectorAll('.ui-select-choices-group');
          if (groups.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-group but got '{0}'.", groups.length);
          groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
        }

        var choices = element.querySelectorAll('.ui-select-choices-row');
        if (choices.length !== 1) {
          throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row but got '{0}'.", choices.length);
        }

        choices.attr('ng-repeat', $select.parserResult.repeatExpression(groupByExp))
            .attr('ng-if', '$select.open') //Prevent unnecessary watches when dropdown is closed
            .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');

        var rowsInner = element.querySelectorAll('.ui-select-choices-row-inner');
        if (rowsInner.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row-inner but got '{0}'.", rowsInner.length);
        rowsInner.attr('uis-transclude-append', ''); //Adding uisTranscludeAppend directive to row element after choices element has ngRepeat

        $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uisTranscludeAppend

        scope.$watch('$select.search', function(newValue) {
          if(newValue && !$select.open && $select.multiple) $select.activate(false, true);
          $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
          $select.refresh(attrs.refresh);
        });

        attrs.$observe('refreshDelay', function() {
          // $eval() is needed otherwise we get a string instead of a number
          var refreshDelay = scope.$eval(attrs.refreshDelay);
          $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : uiSelectConfig.refreshDelay;
        });
      };
    }
  };
}]);

/**
 * Contains ui-select "intelligence".
 *
 * The goal is to limit dependency on the DOM whenever possible and
 * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
 */
uis.controller('uiSelectCtrl',
  ['$scope', '$element', '$timeout', '$filter', 'uisRepeatParser', 'uiSelectMinErr', 'uiSelectConfig', '$parse',
  function($scope, $element, $timeout, $filter, RepeatParser, uiSelectMinErr, uiSelectConfig, $parse) {

  var ctrl = this;

  var EMPTY_SEARCH = '';

  ctrl.placeholder = uiSelectConfig.placeholder;
  ctrl.searchEnabled = uiSelectConfig.searchEnabled;
  ctrl.sortable = uiSelectConfig.sortable;
  ctrl.refreshDelay = uiSelectConfig.refreshDelay;

  ctrl.removeSelected = false; //If selected item(s) should be removed from dropdown list
  ctrl.closeOnSelect = true; //Initialized inside uiSelect directive link function
  ctrl.search = EMPTY_SEARCH;

  ctrl.activeIndex = 0; //Dropdown of choices
  ctrl.items = []; //All available choices

  ctrl.open = false;
  ctrl.focus = false;
  ctrl.disabled = false;
  ctrl.selected = undefined;

  ctrl.dropdownPosition = 'auto';

  ctrl.focusser = undefined; //Reference to input element used to handle focus events
  ctrl.resetSearchInput = true;
  ctrl.multiple = undefined; // Initialized inside uiSelect directive link function
  ctrl.disableChoiceExpression = undefined; // Initialized inside uiSelectChoices directive link function
  ctrl.tagging = {isActivated: false, fct: undefined};
  ctrl.taggingTokens = {isActivated: false, tokens: undefined};
  ctrl.lockChoiceExpression = undefined; // Initialized inside uiSelectMatch directive link function
  ctrl.clickTriggeredSelect = false;
  ctrl.$filter = $filter;

  ctrl.searchInput = $element.querySelectorAll('input.ui-select-search');
  if (ctrl.searchInput.length !== 1) {
    throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", ctrl.searchInput.length);
  }
  
  ctrl.isEmpty = function() {
    return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
  };

  // Most of the time the user does not want to empty the search input when in typeahead mode
  function _resetSearchInput() {
    if (ctrl.resetSearchInput || (ctrl.resetSearchInput === undefined && uiSelectConfig.resetSearchInput)) {
      ctrl.search = EMPTY_SEARCH;
      //reset activeIndex
      if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
        ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
      }
    }
  }

    function _groupsFilter(groups, groupNames) {
      var i, j, result = [];
      for(i = 0; i < groupNames.length ;i++){
        for(j = 0; j < groups.length ;j++){
          if(groups[j].name == [groupNames[i]]){
            result.push(groups[j]);
          }
        }
      }
      return result;
    }

  // When the user clicks on ui-select, displays the dropdown list
  ctrl.activate = function(initSearchValue, avoidReset) {
    if (!ctrl.disabled  && !ctrl.open) {
      if(!avoidReset) _resetSearchInput();

      $scope.$broadcast('uis:activate');

      ctrl.open = true;

      ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

      // ensure that the index is set to zero for tagging variants
      // that where first option is auto-selected
      if ( ctrl.activeIndex === -1 && ctrl.taggingLabel !== false ) {
        ctrl.activeIndex = 0;
      }

      // Give it time to appear before focus
      $timeout(function() {
        ctrl.search = initSearchValue || ctrl.search;
        ctrl.searchInput[0].focus();
        if(!ctrl.tagging.isActivated && ctrl.items.length > 1) {
          _ensureHighlightVisible();
        }
      });
    }
  };

  ctrl.findGroupByName = function(name) {
    return ctrl.groups && ctrl.groups.filter(function(group) {
      return group.name === name;
    })[0];
  };

  ctrl.parseRepeatAttr = function(repeatAttr, groupByExp, groupFilterExp) {
    function updateGroups(items) {
      var groupFn = $scope.$eval(groupByExp);
      ctrl.groups = [];
      angular.forEach(items, function(item) {
        var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
        var group = ctrl.findGroupByName(groupName);
        if(group) {
          group.items.push(item);
        }
        else {
          ctrl.groups.push({name: groupName, items: [item]});
        }
      });
      if(groupFilterExp){
        var groupFilterFn = $scope.$eval(groupFilterExp);
        if( angular.isFunction(groupFilterFn)){
          ctrl.groups = groupFilterFn(ctrl.groups);
        } else if(angular.isArray(groupFilterFn)){
          ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
        }
      }
      ctrl.items = [];
      ctrl.groups.forEach(function(group) {
        ctrl.items = ctrl.items.concat(group.items);
      });
    }

    function setPlainItems(items) {
      ctrl.items = items;
    }

    ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;

    ctrl.parserResult = RepeatParser.parse(repeatAttr);

    ctrl.isGrouped = !!groupByExp;
    ctrl.itemProperty = ctrl.parserResult.itemName;

    //If collection is an Object, convert it to Array

    var originalSource = ctrl.parserResult.source;
    
    //When an object is used as source, we better create an array and use it as 'source'
    var createArrayFromObject = function(){
      var origSrc = originalSource($scope);
      $scope.$uisSource = Object.keys(origSrc).map(function(v){
        var result = {};
        result[ctrl.parserResult.keyName] = v;
        result.value = origSrc[v];
        return result;
      });
    };

    if (ctrl.parserResult.keyName){ // Check for (key,value) syntax
      createArrayFromObject();
      ctrl.parserResult.source = $parse('$uisSource' + ctrl.parserResult.filters);
      $scope.$watch(originalSource, function(newVal, oldVal){
        if (newVal !== oldVal) createArrayFromObject();
      }, true);
    }

    ctrl.refreshItems = function (data){
      data = data || ctrl.parserResult.source($scope);
      var selectedItems = ctrl.selected;
      //TODO should implement for single mode removeSelected
      if (ctrl.isEmpty() || (angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.removeSelected) {
        ctrl.setItemsFn(data);
      }else{
        if ( data !== undefined ) {
          var filteredItems = data.filter(function(i) {return selectedItems && selectedItems.indexOf(i) < 0;});
          ctrl.setItemsFn(filteredItems);
        }
      }
      if (ctrl.dropdownPosition === 'auto' || ctrl.dropdownPosition === 'up'){
        $scope.calculateDropdownPos();
      }
    };

    // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
    $scope.$watchCollection(ctrl.parserResult.source, function(items) {
      if (items === undefined || items === null) {
        // If the user specifies undefined or null => reset the collection
        // Special case: items can be undefined if the user did not initialized the collection on the scope
        // i.e $scope.addresses = [] is missing
        ctrl.items = [];
      } else {
        if (!angular.isArray(items)) {
          throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);          
        } else {
          //Remove already selected items (ex: while searching)
          //TODO Should add a test
          ctrl.refreshItems(items);
          ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
        }
      }
    });

  };

  var _refreshDelayPromise;

  /**
   * Typeahead mode: lets the user refresh the collection using his own function.
   *
   * See Expose $select.search for external / remote filtering https://github.com/angular-ui/ui-select/pull/31
   */
  ctrl.refresh = function(refreshAttr) {
    if (refreshAttr !== undefined) {

      // Debounce
      // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
      // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
      if (_refreshDelayPromise) {
        $timeout.cancel(_refreshDelayPromise);
      }
      _refreshDelayPromise = $timeout(function() {
        $scope.$eval(refreshAttr);
      }, ctrl.refreshDelay);
    }
  };

  ctrl.isActive = function(itemScope) {
    if ( !ctrl.open ) {
      return false;
    }
    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isActive =  itemIndex === ctrl.activeIndex;

    if ( !isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) ||( itemIndex < 0 && ctrl.taggingLabel === false) ) {
      return false;
    }

    if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
      itemScope.$eval(ctrl.onHighlightCallback);
    }

    return isActive;
  };

  ctrl.isDisabled = function(itemScope) {

    if (!ctrl.open) return;

    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isDisabled = false;
    var item;

    if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
      item = ctrl.items[itemIndex];
      isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
      item._uiSelectChoiceDisabled = isDisabled; // store this for later reference
    }

    return isDisabled;
  };


  // When the user selects an item with ENTER or clicks the dropdown
  ctrl.select = function(item, skipFocusser, $event) {
    if (item === undefined || !item._uiSelectChoiceDisabled) {

      if ( ! ctrl.items && ! ctrl.search ) return;

      if (!item || !item._uiSelectChoiceDisabled) {
        if(ctrl.tagging.isActivated) {
          // if taggingLabel is disabled, we pull from ctrl.search val
          if ( ctrl.taggingLabel === false ) {
            if ( ctrl.activeIndex < 0 ) {
              item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
              if (!item || angular.equals( ctrl.items[0], item ) ) {
                return;
              }
            } else {
              // keyboard nav happened first, user selected from dropdown
              item = ctrl.items[ctrl.activeIndex];
            }
          } else {
            // tagging always operates at index zero, taggingLabel === false pushes
            // the ctrl.search value without having it injected
            if ( ctrl.activeIndex === 0 ) {
              // ctrl.tagging pushes items to ctrl.items, so we only have empty val
              // for `item` if it is a detected duplicate
              if ( item === undefined ) return;

              // create new item on the fly if we don't already have one;
              // use tagging function if we have one
              if ( ctrl.tagging.fct !== undefined && typeof item === 'string' ) {
                item = ctrl.tagging.fct(ctrl.search);
                if (!item) return;
              // if item type is 'string', apply the tagging label
              } else if ( typeof item === 'string' ) {
                // trim the trailing space
                item = item.replace(ctrl.taggingLabel,'').trim();
              }
            }
          }
          // search ctrl.selected for dupes potentially caused by tagging and return early if found
          if ( ctrl.selected && angular.isArray(ctrl.selected) && ctrl.selected.filter( function (selection) { return angular.equals(selection, item); }).length > 0 ) {
            ctrl.close(skipFocusser);
            return;
          }
        }

        $scope.$broadcast('uis:select', item);

        var locals = {};
        locals[ctrl.parserResult.itemName] = item;

        $timeout(function(){
          ctrl.onSelectCallback($scope, {
            $item: item,
            $model: ctrl.parserResult.modelMapper($scope, locals)
          });
        });

        if (ctrl.closeOnSelect) {
          ctrl.close(skipFocusser);
        }
        if ($event && $event.type === 'click') {
          ctrl.clickTriggeredSelect = true;
        }
      }
    }
  };

  // Closes the dropdown
  ctrl.close = function(skipFocusser) {
    if (!ctrl.open) return;
    if (ctrl.ngModel && ctrl.ngModel.$setTouched) ctrl.ngModel.$setTouched();
    _resetSearchInput();
    ctrl.open = false;

    $scope.$broadcast('uis:close', skipFocusser);

  };

  ctrl.setFocus = function(){
    if (!ctrl.focus) ctrl.focusInput[0].focus();
  };

  ctrl.clear = function($event) {
    ctrl.select(undefined);
    $event.stopPropagation();
    $timeout(function() {
      ctrl.focusser[0].focus();
    }, 0, false);
  };

  // Toggle dropdown
  ctrl.toggle = function(e) {
    if (ctrl.open) {
      ctrl.close();
      e.preventDefault();
      e.stopPropagation();
    } else {
      ctrl.activate();
    }
  };

  ctrl.isLocked = function(itemScope, itemIndex) {
      var isLocked, item = ctrl.selected[itemIndex];

      if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
          isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
          item._uiSelectChoiceLocked = isLocked; // store this for later reference
      }

      return isLocked;
  };

  var sizeWatch = null;
  ctrl.sizeSearchInput = function() {

    var input = ctrl.searchInput[0],
        container = ctrl.searchInput.parent().parent()[0],
        calculateContainerWidth = function() {
          // Return the container width only if the search input is visible
          return container.clientWidth * !!input.offsetParent;
        },
        updateIfVisible = function(containerWidth) {
          if (containerWidth === 0) {
            return false;
          }
          var inputWidth = containerWidth - input.offsetLeft - 10;
          if (inputWidth < 50) inputWidth = containerWidth;
          ctrl.searchInput.css('width', inputWidth+'px');
          return true;
        };

    ctrl.searchInput.css('width', '10px');
    $timeout(function() { //Give tags time to render correctly
      if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
        sizeWatch = $scope.$watch(calculateContainerWidth, function(containerWidth) {
          if (updateIfVisible(containerWidth)) {
            sizeWatch();
            sizeWatch = null;
          }
        });
      }
    });
  };

  function _handleDropDownSelection(key) {
    var processed = true;
    switch (key) {
      case KEY.DOWN:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
        break;
      case KEY.UP:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)) { ctrl.activeIndex--; }
        break;
      case KEY.TAB:
        if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
        break;
      case KEY.ENTER:
        if(ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)){
          ctrl.select(ctrl.items[ctrl.activeIndex]); // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
        } else {
          ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        }
        break;
      case KEY.ESC:
        ctrl.close();
        break;
      default:
        processed = false;
    }
    return processed;
  }

  // Bind to keyboard shortcuts
  ctrl.searchInput.on('keydown', function(e) {

    var key = e.which;

    // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
    //   //TODO: SEGURO?
    //   ctrl.close();
    // }

    $scope.$apply(function() {

      var tagged = false;

      if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
        _handleDropDownSelection(key);
        if ( ctrl.taggingTokens.isActivated ) {
          for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
            if ( ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode] ) {
              // make sure there is a new value to push via tagging
              if ( ctrl.search.length > 0 ) {
                tagged = true;
              }
            }
          }
          if ( tagged ) {
            $timeout(function() {
              ctrl.searchInput.triggerHandler('tagged');
              var newItem = ctrl.search.replace(KEY.MAP[e.keyCode],'').trim();
              if ( ctrl.tagging.fct ) {
                newItem = ctrl.tagging.fct( newItem );
              }
              if (newItem) ctrl.select(newItem, true);
            });
          }
        }
      }

    });

    if(KEY.isVerticalMovement(key) && ctrl.items.length > 0){
      _ensureHighlightVisible();
    }

    if (key === KEY.ENTER || key === KEY.ESC) {
      e.preventDefault();
      e.stopPropagation();
    }

  });

  // If tagging try to split by tokens and add items
  ctrl.searchInput.on('paste', function (e) {
    var data = e.originalEvent.clipboardData.getData('text/plain');
    if (data && data.length > 0 && ctrl.taggingTokens.isActivated && ctrl.tagging.fct) {
      var items = data.split(ctrl.taggingTokens.tokens[0]); // split by first token only
      if (items && items.length > 0) {
        angular.forEach(items, function (item) {
          var newItem = ctrl.tagging.fct(item);
          if (newItem) {
            ctrl.select(newItem, true);
          }
        });
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  ctrl.searchInput.on('tagged', function() {
    $timeout(function() {
      _resetSearchInput();
    });
  });

  // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
  function _ensureHighlightVisible() {
    var container = $element.querySelectorAll('.ui-select-choices-content');
    var choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
    }

    if (ctrl.activeIndex < 0) {
      return;
    }

    var highlighted = choices[ctrl.activeIndex];
    var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
    var height = container[0].offsetHeight;

    if (posY > height) {
      container[0].scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      if (ctrl.isGrouped && ctrl.activeIndex === 0)
        container[0].scrollTop = 0; //To make group header visible when going all the way up
      else
        container[0].scrollTop -= highlighted.clientHeight - posY;
    }
  }

  $scope.$on('$destroy', function() {
    ctrl.searchInput.off('keyup keydown tagged blur paste');
  });

}]);

uis.directive('uiSelect',
  ['$document', 'uiSelectConfig', 'uiSelectMinErr', 'uisOffset', '$compile', '$parse', '$timeout',
  function($document, uiSelectConfig, uiSelectMinErr, uisOffset, $compile, $parse, $timeout) {

  return {
    restrict: 'EA',
    templateUrl: function(tElement, tAttrs) {
      var theme = tAttrs.theme || uiSelectConfig.theme;
      return theme + (angular.isDefined(tAttrs.multiple) ? '/select-multiple.tpl.html' : '/select.tpl.html');
    },
    replace: true,
    transclude: true,
    require: ['uiSelect', '^ngModel'],
    scope: true,

    controller: 'uiSelectCtrl',
    controllerAs: '$select',
    compile: function(tElement, tAttrs) {

      //Multiple or Single depending if multiple attribute presence
      if (angular.isDefined(tAttrs.multiple))
        tElement.append('<ui-select-multiple/>').removeAttr('multiple');
      else
        tElement.append('<ui-select-single/>');

      if (tAttrs.inputId)
        tElement.querySelectorAll('input.ui-select-search')[0].id = tAttrs.inputId;

      return function(scope, element, attrs, ctrls, transcludeFn) {

        var $select = ctrls[0];
        var ngModel = ctrls[1];

        $select.generatedId = uiSelectConfig.generateId();
        $select.baseTitle = attrs.title || 'Select box';
        $select.focusserTitle = $select.baseTitle + ' focus';
        $select.focusserId = 'focusser-' + $select.generatedId;

        $select.closeOnSelect = function() {
          if (angular.isDefined(attrs.closeOnSelect)) {
            return $parse(attrs.closeOnSelect)();
          } else {
            return uiSelectConfig.closeOnSelect;
          }
        }();

        $select.onSelectCallback = $parse(attrs.onSelect);
        $select.onRemoveCallback = $parse(attrs.onRemove);

        //Limit the number of selections allowed
        $select.limit = (angular.isDefined(attrs.limit)) ? parseInt(attrs.limit, 10) : undefined;

        //Set reference to ngModel from uiSelectCtrl
        $select.ngModel = ngModel;

        $select.choiceGrouped = function(group){
          return $select.isGrouped && group && group.name;
        };

        if(attrs.tabindex){
          attrs.$observe('tabindex', function(value) {
            $select.focusInput.attr('tabindex', value);
            element.removeAttr('tabindex');
          });
        }

        scope.$watch('searchEnabled', function() {
            var searchEnabled = scope.$eval(attrs.searchEnabled);
            $select.searchEnabled = searchEnabled !== undefined ? searchEnabled : uiSelectConfig.searchEnabled;
        });

        scope.$watch('sortable', function() {
            var sortable = scope.$eval(attrs.sortable);
            $select.sortable = sortable !== undefined ? sortable : uiSelectConfig.sortable;
        });

        attrs.$observe('disabled', function() {
          // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
          $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
        });

        attrs.$observe('resetSearchInput', function() {
          // $eval() is needed otherwise we get a string instead of a boolean
          var resetSearchInput = scope.$eval(attrs.resetSearchInput);
          $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
        });

        attrs.$observe('tagging', function() {
          if(attrs.tagging !== undefined)
          {
            // $eval() is needed otherwise we get a string instead of a boolean
            var taggingEval = scope.$eval(attrs.tagging);
            $select.tagging = {isActivated: true, fct: taggingEval !== true ? taggingEval : undefined};
          }
          else
          {
            $select.tagging = {isActivated: false, fct: undefined};
          }
        });

        attrs.$observe('taggingLabel', function() {
          if(attrs.tagging !== undefined )
          {
            // check eval for FALSE, in this case, we disable the labels
            // associated with tagging
            if ( attrs.taggingLabel === 'false' ) {
              $select.taggingLabel = false;
            }
            else
            {
              $select.taggingLabel = attrs.taggingLabel !== undefined ? attrs.taggingLabel : '(new)';
            }
          }
        });

        attrs.$observe('taggingTokens', function() {
          if (attrs.tagging !== undefined) {
            var tokens = attrs.taggingTokens !== undefined ? attrs.taggingTokens.split('|') : [',','ENTER'];
            $select.taggingTokens = {isActivated: true, tokens: tokens };
          }
        });

        //Automatically gets focus when loaded
        if (angular.isDefined(attrs.autofocus)){
          $timeout(function(){
            $select.setFocus();
          });
        }

        //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
        if (angular.isDefined(attrs.focusOn)){
          scope.$on(attrs.focusOn, function() {
              $timeout(function(){
                $select.setFocus();
              });
          });
        }

        function onDocumentClick(e) {
          if (!$select.open) return; //Skip it if dropdown is close

          var contains = false;

          if (window.jQuery) {
            // Firefox 3.6 does not support element.contains()
            // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
            contains = window.jQuery.contains(element[0], e.target);
          } else {
            contains = element[0].contains(e.target);
          }

          if (!contains && !$select.clickTriggeredSelect) {
            //Will lose focus only with certain targets
            var focusableControls = ['input','button','textarea'];
            var targetController = angular.element(e.target).controller('uiSelect'); //To check if target is other ui-select
            var skipFocusser = targetController && targetController !== $select; //To check if target is other ui-select
            if (!skipFocusser) skipFocusser =  ~focusableControls.indexOf(e.target.tagName.toLowerCase()); //Check if target is input, button or textarea
            $select.close(skipFocusser);
            scope.$digest();
          }
          $select.clickTriggeredSelect = false;
        }

        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
        $document.on('click', onDocumentClick);

        scope.$on('$destroy', function() {
          $document.off('click', onDocumentClick);
        });

        // Move transcluded elements to their correct position in main template
        transcludeFn(scope, function(clone) {
          // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

          // One day jqLite will be replaced by jQuery and we will be able to write:
          // var transcludedElement = clone.filter('.my-class')
          // instead of creating a hackish DOM element:
          var transcluded = angular.element('<div>').append(clone);

          var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
          transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
          transcludedMatch.removeAttr('data-ui-select-match'); // Properly handle HTML5 data-attributes
          if (transcludedMatch.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
          }
          element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

          var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
          transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
          transcludedChoices.removeAttr('data-ui-select-choices'); // Properly handle HTML5 data-attributes
          if (transcludedChoices.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
          }
          element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);
        });

        // Support for appending the select field to the body when its open
        var appendToBody = scope.$eval(attrs.appendToBody);
        if (appendToBody !== undefined ? appendToBody : uiSelectConfig.appendToBody) {
          scope.$watch('$select.open', function(isOpen) {
            if (isOpen) {
              positionDropdown();
            } else {
              resetDropdown();
            }
          });

          // Move the dropdown back to its original location when the scope is destroyed. Otherwise
          // it might stick around when the user routes away or the select field is otherwise removed
          scope.$on('$destroy', function() {
            resetDropdown();
          });
        }

        // Hold on to a reference to the .ui-select-container element for appendToBody support
        var placeholder = null,
            originalWidth = '';

        function positionDropdown() {
          // Remember the absolute position of the element
          var offset = uisOffset(element);

          // Clone the element into a placeholder element to take its original place in the DOM
          placeholder = angular.element('<div class="ui-select-placeholder"></div>');
          placeholder[0].style.width = offset.width + 'px';
          placeholder[0].style.height = offset.height + 'px';
          element.after(placeholder);

          // Remember the original value of the element width inline style, so it can be restored
          // when the dropdown is closed
          originalWidth = element[0].style.width;

          // Now move the actual dropdown element to the end of the body
          $document.find('body').append(element);

          element[0].style.position = 'absolute';
          element[0].style.left = offset.left + 'px';
          element[0].style.top = offset.top + 'px';
          element[0].style.width = offset.width + 'px';
        }

        function resetDropdown() {
          if (placeholder === null) {
            // The dropdown has not actually been display yet, so there's nothing to reset
            return;
          }

          // Move the dropdown element back to its original location in the DOM
          placeholder.replaceWith(element);
          placeholder = null;

          element[0].style.position = '';
          element[0].style.left = '';
          element[0].style.top = '';
          element[0].style.width = originalWidth;
        }

        // Hold on to a reference to the .ui-select-dropdown element for direction support.
        var dropdown = null,
            directionUpClassName = 'direction-up';

        // Support changing the direction of the dropdown if there isn't enough space to render it.
        scope.$watch('$select.open', function() {

          if ($select.dropdownPosition === 'auto' || $select.dropdownPosition === 'up'){
            scope.calculateDropdownPos();
          }

        });

        var setDropdownPosUp = function(offset, offsetDropdown){

          offset = offset || uisOffset(element);
          offsetDropdown = offsetDropdown || uisOffset(dropdown);

          dropdown[0].style.position = 'absolute';
          dropdown[0].style.top = (offsetDropdown.height * -1) + 'px';
          element.addClass(directionUpClassName);

        };

        var setDropdownPosDown = function(offset, offsetDropdown){

          element.removeClass(directionUpClassName);

          offset = offset || uisOffset(element);
          offsetDropdown = offsetDropdown || uisOffset(dropdown);

          dropdown[0].style.position = '';
          dropdown[0].style.top = '';

        };

        scope.calculateDropdownPos = function(){

          if ($select.open) {
            dropdown = angular.element(element).querySelectorAll('.ui-select-dropdown');
            if (dropdown.length === 0) {
              return;
            }

            // Hide the dropdown so there is no flicker until $timeout is done executing.
            dropdown[0].style.opacity = 0;

            // Delay positioning the dropdown until all choices have been added so its height is correct.
            $timeout(function(){

              if ($select.dropdownPosition === 'up'){
                  //Go UP
                  setDropdownPosUp(offset, offsetDropdown);

              }else{ //AUTO

                element.removeClass(directionUpClassName);

                var offset = uisOffset(element);
                var offsetDropdown = uisOffset(dropdown);

                //https://code.google.com/p/chromium/issues/detail?id=342307#c4
                var scrollTop = $document[0].documentElement.scrollTop || $document[0].body.scrollTop; //To make it cross browser (blink, webkit, IE, Firefox).

                // Determine if the direction of the dropdown needs to be changed.
                if (offset.top + offset.height + offsetDropdown.height > scrollTop + $document[0].documentElement.clientHeight) {
                  //Go UP
                  setDropdownPosUp(offset, offsetDropdown);
                }else{
                  //Go DOWN
                  setDropdownPosDown(offset, offsetDropdown);
                }

              }

              // Display the dropdown once it has been positioned.
              dropdown[0].style.opacity = 1;
            });
          } else {
              if (dropdown === null || dropdown.length === 0) {
                return;
              }

              // Reset the position of the dropdown.
              dropdown[0].style.position = '';
              dropdown[0].style.top = '';
              element.removeClass(directionUpClassName);
          }
        };
      };
    }
  };
}]);

uis.directive('uiSelectMatch', ['uiSelectConfig', function(uiSelectConfig) {
  return {
    restrict: 'EA',
    require: '^uiSelect',
    replace: true,
    transclude: true,
    templateUrl: function(tElement) {
      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      var multi = tElement.parent().attr('multiple');
      return theme + (multi ? '/match-multiple.tpl.html' : '/match.tpl.html');
    },
    link: function(scope, element, attrs, $select) {
      $select.lockChoiceExpression = attrs.uiLockChoice;
      attrs.$observe('placeholder', function(placeholder) {
        $select.placeholder = placeholder !== undefined ? placeholder : uiSelectConfig.placeholder;
      });

      function setAllowClear(allow) {
        $select.allowClear = (angular.isDefined(allow)) ? (allow === '') ? true : (allow.toLowerCase() === 'true') : false;
      }

      attrs.$observe('allowClear', setAllowClear);
      setAllowClear(attrs.allowClear);

      if($select.multiple){
        $select.sizeSearchInput();
      }

    }
  };
}]);

uis.directive('uiSelectMultiple', ['uiSelectMinErr','$timeout', function(uiSelectMinErr, $timeout) {
  return {
    restrict: 'EA',
    require: ['^uiSelect', '^ngModel'],

    controller: ['$scope','$timeout', function($scope, $timeout){

      var ctrl = this,
          $select = $scope.$select,
          ngModel;

      //Wait for link fn to inject it 
      $scope.$evalAsync(function(){ ngModel = $scope.ngModel; });

      ctrl.activeMatchIndex = -1;

      ctrl.updateModel = function(){
        ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
        ctrl.refreshComponent();
      };

      ctrl.refreshComponent = function(){
        //Remove already selected items
        //e.g. When user clicks on a selection, the selected array changes and 
        //the dropdown should remove that item
        $select.refreshItems();
        $select.sizeSearchInput();
      };

      // Remove item from multiple select
      ctrl.removeChoice = function(index){

        var removedChoice = $select.selected[index];

        // if the choice is locked, can't remove it
        if(removedChoice._uiSelectChoiceLocked) return;

        var locals = {};
        locals[$select.parserResult.itemName] = removedChoice;

        $select.selected.splice(index, 1);
        ctrl.activeMatchIndex = -1;
        $select.sizeSearchInput();

        // Give some time for scope propagation.
        $timeout(function(){
          $select.onRemoveCallback($scope, {
            $item: removedChoice,
            $model: $select.parserResult.modelMapper($scope, locals)
          });
        });

        ctrl.updateModel();

      };

      ctrl.getPlaceholder = function(){
        //Refactor single?
        if($select.selected && $select.selected.length) return;
        return $select.placeholder;
      };


    }],
    controllerAs: '$selectMultiple',

    link: function(scope, element, attrs, ctrls) {

      var $select = ctrls[0];
      var ngModel = scope.ngModel = ctrls[1];
      var $selectMultiple = scope.$selectMultiple;

      //$select.selected = raw selected objects (ignoring any property binding)

      $select.multiple = true;
      $select.removeSelected = true;

      //Input that will handle focus
      $select.focusInput = $select.searchInput;

      //From view --> model
      ngModel.$parsers.unshift(function () {
        var locals = {},
            result,
            resultMultiple = [];
        for (var j = $select.selected.length - 1; j >= 0; j--) {
          locals = {};
          locals[$select.parserResult.itemName] = $select.selected[j];
          result = $select.parserResult.modelMapper(scope, locals);
          resultMultiple.unshift(result);
        }
        return resultMultiple;
      });

      // From model --> view
      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
            locals = {},
            result;
        if (!data) return inputValue;
        var resultMultiple = [];
        var checkFnMultiple = function(list, value){
          if (!list || !list.length) return;
          for (var p = list.length - 1; p >= 0; p--) {
            locals[$select.parserResult.itemName] = list[p];
            result = $select.parserResult.modelMapper(scope, locals);
            if($select.parserResult.trackByExp){
                var matches = /\.(.+)/.exec($select.parserResult.trackByExp);
                if(matches.length>0 && result[matches[1]] == value[matches[1]]){
                    resultMultiple.unshift(list[p]);
                    return true;
                }
            }
            if (angular.equals(result,value)){
              resultMultiple.unshift(list[p]);
              return true;
            }
          }
          return false;
        };
        if (!inputValue) return resultMultiple; //If ngModel was undefined
        for (var k = inputValue.length - 1; k >= 0; k--) {
          //Check model array of currently selected items 
          if (!checkFnMultiple($select.selected, inputValue[k])){
            //Check model array of all items available
            if (!checkFnMultiple(data, inputValue[k])){
              //If not found on previous lists, just add it directly to resultMultiple
              resultMultiple.unshift(inputValue[k]);
            }
          }
        }
        return resultMultiple;
      });
      
      //Watch for external model changes 
      scope.$watchCollection(function(){ return ngModel.$modelValue; }, function(newValue, oldValue) {
        if (oldValue != newValue){
          ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
          $selectMultiple.refreshComponent();
        }
      });

      ngModel.$render = function() {
        // Make sure that model value is array
        if(!angular.isArray(ngModel.$viewValue)){
          // Have tolerance for null or undefined values
          if(angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null){
            $select.selected = [];
          } else {
            throw uiSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
          }
        }
        $select.selected = ngModel.$viewValue;
        scope.$evalAsync(); //To force $digest
      };

      scope.$on('uis:select', function (event, item) {
        if($select.selected.length >= $select.limit) {
          return;
        }
        $select.selected.push(item);
        $selectMultiple.updateModel();
      });

      scope.$on('uis:activate', function () {
        $selectMultiple.activeMatchIndex = -1;
      });

      scope.$watch('$select.disabled', function(newValue, oldValue) {
        // As the search input field may now become visible, it may be necessary to recompute its size
        if (oldValue && !newValue) $select.sizeSearchInput();
      });

      $select.searchInput.on('keydown', function(e) {
        var key = e.which;
        scope.$apply(function() {
          var processed = false;
          // var tagged = false; //Checkme
          if(KEY.isHorizontalMovement(key)){
            processed = _handleMatchSelection(key);
          }
          if (processed  && key != KEY.TAB) {
            //TODO Check si el tab selecciona aun correctamente
            //Crear test
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
      function _getCaretPosition(el) {
        if(angular.isNumber(el.selectionStart)) return el.selectionStart;
        // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
        else return el.value.length;
      }
      // Handles selected options in "multiple" mode
      function _handleMatchSelection(key){
        var caretPosition = _getCaretPosition($select.searchInput[0]),
            length = $select.selected.length,
            // none  = -1,
            first = 0,
            last  = length-1,
            curr  = $selectMultiple.activeMatchIndex,
            next  = $selectMultiple.activeMatchIndex+1,
            prev  = $selectMultiple.activeMatchIndex-1,
            newIndex = curr;

        if(caretPosition > 0 || ($select.search.length && key == KEY.RIGHT)) return false;

        $select.close();

        function getNewActiveMatchIndex(){
          switch(key){
            case KEY.LEFT:
              // Select previous/first item
              if(~$selectMultiple.activeMatchIndex) return prev;
              // Select last item
              else return last;
              break;
            case KEY.RIGHT:
              // Open drop-down
              if(!~$selectMultiple.activeMatchIndex || curr === last){
                $select.activate();
                return false;
              }
              // Select next/last item
              else return next;
              break;
            case KEY.BACKSPACE:
              // Remove selected item and select previous/first
              if(~$selectMultiple.activeMatchIndex){
                $selectMultiple.removeChoice(curr);
                return prev;
              }
              // Select last item
              else return last;
              break;
            case KEY.DELETE:
              // Remove selected item and select next item
              if(~$selectMultiple.activeMatchIndex){
                $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                return curr;
              }
              else return false;
          }
        }

        newIndex = getNewActiveMatchIndex();

        if(!$select.selected.length || newIndex === false) $selectMultiple.activeMatchIndex = -1;
        else $selectMultiple.activeMatchIndex = Math.min(last,Math.max(first,newIndex));

        return true;
      }

      $select.searchInput.on('keyup', function(e) {

        if ( ! KEY.isVerticalMovement(e.which) ) {
          scope.$evalAsync( function () {
            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
          });
        }
        // Push a "create new" item into array if there is a search string
        if ( $select.tagging.isActivated && $select.search.length > 0 ) {

          // return early with these keys
          if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which) ) {
            return;
          }
          // always reset the activeIndex to the first item when tagging
          $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
          // taggingLabel === false bypasses all of this
          if ($select.taggingLabel === false) return;

          var items = angular.copy( $select.items );
          var stashArr = angular.copy( $select.items );
          var newItem;
          var item;
          var hasTag = false;
          var dupeIndex = -1;
          var tagItems;
          var tagItem;

          // case for object tagging via transform `$select.tagging.fct` function
          if ( $select.tagging.fct !== undefined) {
            tagItems = $select.$filter('filter')(items,{'isTag': true});
            if ( tagItems.length > 0 ) {
              tagItem = tagItems[0];
            }
            // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
            if ( items.length > 0 && tagItem ) {
              hasTag = true;
              items = items.slice(1,items.length);
              stashArr = stashArr.slice(1,stashArr.length);
            }
            newItem = $select.tagging.fct($select.search);
            newItem.isTag = true;
            // verify the the tag doesn't match the value of an existing item
            if ( stashArr.filter( function (origItem) { return angular.equals( origItem, $select.tagging.fct($select.search) ); } ).length > 0 ) {
              return;
            }
            newItem.isTag = true;
          // handle newItem string and stripping dupes in tagging string context
          } else {
            // find any tagging items already in the $select.items array and store them
            tagItems = $select.$filter('filter')(items,function (item) {
              return item.match($select.taggingLabel);
            });
            if ( tagItems.length > 0 ) {
              tagItem = tagItems[0];
            }
            item = items[0];
            // remove existing tag item if found (should only ever be one tag item)
            if ( item !== undefined && items.length > 0 && tagItem ) {
              hasTag = true;
              items = items.slice(1,items.length);
              stashArr = stashArr.slice(1,stashArr.length);
            }
            newItem = $select.search+' '+$select.taggingLabel;
            if ( _findApproxDupe($select.selected, $select.search) > -1 ) {
              return;
            }
            // verify the the tag doesn't match the value of an existing item from
            // the searched data set or the items already selected
            if ( _findCaseInsensitiveDupe(stashArr.concat($select.selected)) ) {
              // if there is a tag from prev iteration, strip it / queue the change
              // and return early
              if ( hasTag ) {
                items = stashArr;
                scope.$evalAsync( function () {
                  $select.activeIndex = 0;
                  $select.items = items;
                });
              }
              return;
            }
            if ( _findCaseInsensitiveDupe(stashArr) ) {
              // if there is a tag from prev iteration, strip it
              if ( hasTag ) {
                $select.items = stashArr.slice(1,stashArr.length);
              }
              return;
            }
          }
          if ( hasTag ) dupeIndex = _findApproxDupe($select.selected, newItem);
          // dupe found, shave the first item
          if ( dupeIndex > -1 ) {
            items = items.slice(dupeIndex+1,items.length-1);
          } else {
            items = [];
            items.push(newItem);
            items = items.concat(stashArr);
          }
          scope.$evalAsync( function () {
            $select.activeIndex = 0;
            $select.items = items;
          });
        }
      });
      function _findCaseInsensitiveDupe(arr) {
        if ( arr === undefined || $select.search === undefined ) {
          return false;
        }
        var hasDupe = arr.filter( function (origItem) {
          if ( $select.search.toUpperCase() === undefined || origItem === undefined ) {
            return false;
          }
          return origItem.toUpperCase() === $select.search.toUpperCase();
        }).length > 0;

        return hasDupe;
      }
      function _findApproxDupe(haystack, needle) {
        var dupeIndex = -1;
        if(angular.isArray(haystack)) {
          var tempArr = angular.copy(haystack);
          for (var i = 0; i <tempArr.length; i++) {
            // handle the simple string version of tagging
            if ( $select.tagging.fct === undefined ) {
              // search the array for the match
              if ( tempArr[i]+' '+$select.taggingLabel === needle ) {
              dupeIndex = i;
              }
            // handle the object tagging implementation
            } else {
              var mockObj = tempArr[i];
              mockObj.isTag = true;
              if ( angular.equals(mockObj, needle) ) {
              dupeIndex = i;
              }
            }
          }
        }
        return dupeIndex;
      }

      $select.searchInput.on('blur', function() {
        $timeout(function() {
          $selectMultiple.activeMatchIndex = -1;
        });
      });

    }
  };
}]);

uis.directive('uiSelectSingle', ['$timeout','$compile', function($timeout, $compile) {
  return {
    restrict: 'EA',
    require: ['^uiSelect', '^ngModel'],
    link: function(scope, element, attrs, ctrls) {

      var $select = ctrls[0];
      var ngModel = ctrls[1];

      //From view --> model
      ngModel.$parsers.unshift(function (inputValue) {
        var locals = {},
            result;
        locals[$select.parserResult.itemName] = inputValue;
        result = $select.parserResult.modelMapper(scope, locals);
        return result;
      });

      //From model --> view
      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
            locals = {},
            result;
        if (data){
          var checkFnSingle = function(d){
            locals[$select.parserResult.itemName] = d;
            result = $select.parserResult.modelMapper(scope, locals);
            return result == inputValue;
          };
          //If possible pass same object stored in $select.selected
          if ($select.selected && checkFnSingle($select.selected)) {
            return $select.selected;
          }
          for (var i = data.length - 1; i >= 0; i--) {
            if (checkFnSingle(data[i])) return data[i];
          }
        }
        return inputValue;
      });

      //Update viewValue if model change
      scope.$watch('$select.selected', function(newValue) {
        if (ngModel.$viewValue !== newValue) {
          ngModel.$setViewValue(newValue);
        }
      });

      ngModel.$render = function() {
        $select.selected = ngModel.$viewValue;
      };

      scope.$on('uis:select', function (event, item) {
        $select.selected = item;
      });

      scope.$on('uis:close', function (event, skipFocusser) {
        $timeout(function(){
          $select.focusser.prop('disabled', false);
          if (!skipFocusser) $select.focusser[0].focus();
        },0,false);
      });

      scope.$on('uis:activate', function () {
        focusser.prop('disabled', true); //Will reactivate it on .close()
      });

      //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
      var focusser = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");
      $compile(focusser)(scope);
      $select.focusser = focusser;

      //Input that will handle focus
      $select.focusInput = focusser;

      element.parent().append(focusser);
      focusser.bind("focus", function(){
        scope.$evalAsync(function(){
          $select.focus = true;
        });
      });
      focusser.bind("blur", function(){
        scope.$evalAsync(function(){
          $select.focus = false;
        });
      });
      focusser.bind("keydown", function(e){

        if (e.which === KEY.BACKSPACE) {
          e.preventDefault();
          e.stopPropagation();
          $select.select(undefined);
          scope.$apply();
          return;
        }

        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
          return;
        }

        if (e.which == KEY.DOWN  || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE){
          e.preventDefault();
          e.stopPropagation();
          $select.activate();
        }

        scope.$digest();
      });

      focusser.bind("keyup input", function(e){

        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
          return;
        }

        $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
        focusser.val('');
        scope.$digest();

      });


    }
  };
}]);
// Make multiple matches sortable
uis.directive('uiSelectSort', ['$timeout', 'uiSelectConfig', 'uiSelectMinErr', function($timeout, uiSelectConfig, uiSelectMinErr) {
  return {
    require: '^uiSelect',
    link: function(scope, element, attrs, $select) {
      if (scope[attrs.uiSelectSort] === null) {
        throw uiSelectMinErr('sort', "Expected a list to sort");
      }

      var options = angular.extend({
          axis: 'horizontal'
        },
        scope.$eval(attrs.uiSelectSortOptions));

      var axis = options.axis,
        draggingClassName = 'dragging',
        droppingClassName = 'dropping',
        droppingBeforeClassName = 'dropping-before',
        droppingAfterClassName = 'dropping-after';

      scope.$watch(function(){
        return $select.sortable;
      }, function(n){
        if (n) {
          element.attr('draggable', true);
        } else {
          element.removeAttr('draggable');
        }
      });

      element.on('dragstart', function(e) {
        element.addClass(draggingClassName);

        (e.dataTransfer || e.originalEvent.dataTransfer).setData('text/plain', scope.$index);
      });

      element.on('dragend', function() {
        element.removeClass(draggingClassName);
      });

      var move = function(from, to) {
        /*jshint validthis: true */
        this.splice(to, 0, this.splice(from, 1)[0]);
      };

      var dragOverHandler = function(e) {
        e.preventDefault();

        var offset = axis === 'vertical' ? e.offsetY || e.layerY || (e.originalEvent ? e.originalEvent.offsetY : 0) : e.offsetX || e.layerX || (e.originalEvent ? e.originalEvent.offsetX : 0);

        if (offset < (this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2)) {
          element.removeClass(droppingAfterClassName);
          element.addClass(droppingBeforeClassName);

        } else {
          element.removeClass(droppingBeforeClassName);
          element.addClass(droppingAfterClassName);
        }
      };

      var dropTimeout;

      var dropHandler = function(e) {
        e.preventDefault();

        var droppedItemIndex = parseInt((e.dataTransfer || e.originalEvent.dataTransfer).getData('text/plain'), 10);

        // prevent event firing multiple times in firefox
        $timeout.cancel(dropTimeout);
        dropTimeout = $timeout(function() {
          _dropHandler(droppedItemIndex);
        }, 20);
      };

      var _dropHandler = function(droppedItemIndex) {
        var theList = scope.$eval(attrs.uiSelectSort),
          itemToMove = theList[droppedItemIndex],
          newIndex = null;

        if (element.hasClass(droppingBeforeClassName)) {
          if (droppedItemIndex < scope.$index) {
            newIndex = scope.$index - 1;
          } else {
            newIndex = scope.$index;
          }
        } else {
          if (droppedItemIndex < scope.$index) {
            newIndex = scope.$index;
          } else {
            newIndex = scope.$index + 1;
          }
        }

        move.apply(theList, [droppedItemIndex, newIndex]);

        scope.$apply(function() {
          scope.$emit('uiSelectSort:change', {
            array: theList,
            item: itemToMove,
            from: droppedItemIndex,
            to: newIndex
          });
        });

        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);

        element.off('drop', dropHandler);
      };

      element.on('dragenter', function() {
        if (element.hasClass(draggingClassName)) {
          return;
        }

        element.addClass(droppingClassName);

        element.on('dragover', dragOverHandler);
        element.on('drop', dropHandler);
      });

      element.on('dragleave', function(e) {
        if (e.target != element) {
          return;
        }
        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);

        element.off('dragover', dragOverHandler);
        element.off('drop', dropHandler);
      });
    }
  };
}]);

/**
 * Parses "repeat" attribute.
 *
 * Taken from AngularJS ngRepeat source code
 * See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L211
 *
 * Original discussion about parsing "repeat" attribute instead of fully relying on ng-repeat:
 * https://github.com/angular-ui/ui-select/commit/5dd63ad#commitcomment-5504697
 */

uis.service('uisRepeatParser', ['uiSelectMinErr','$parse', function(uiSelectMinErr, $parse) {
  var self = this;

  /**
   * Example:
   * expression = "address in addresses | filter: {street: $select.search} track by $index"
   * itemName = "address",
   * source = "addresses | filter: {street: $select.search}",
   * trackByExp = "$index",
   */
  self.parse = function(expression) {


    var match;
    var isObjectCollection = /\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)/.test(expression);
    // If an array is used as collection

    // if (isObjectCollection){
      //00000000000000000000000000000111111111000000000000000222222222222220033333333333333333333330000444444444444444444000000000000000556666660000077777777777755000000000000000000000088888880000000
    match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(([\w\.]+)?\s*(|\s*[\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);      

    // 1 Alias
    // 2 Item
    // 3 Key on (key,value)
    // 4 Value on (key,value)
    // 5 Collection expresion (only used when using an array collection)
    // 6 Object that will be converted to Array when using (key,value) syntax
    // 7 Filters that will be applied to #6 when using (key,value) syntax
    // 8 Track by

    if (!match) {
      throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
              expression);
    }
    if (!match[6] && isObjectCollection) {
      throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ as (_key_, _item_) in _ObjCollection_ [ track by _id_]' but got '{0}'.",
              expression);
    }

    return {
      itemName: match[4] || match[2], // (lhs) Left-hand side,
      keyName: match[3], //for (key, value) syntax
      source: $parse(!match[3] ? match[5] : match[6]),
      sourceName: match[6],
      filters: match[7],
      trackByExp: match[8],
      modelMapper: $parse(match[1] || match[4] || match[2]),
      repeatExpression: function (grouped) {
        var expression = this.itemName + ' in ' + (grouped ? '$group.items' : '$select.items');
        if (this.trackByExp) {
          expression += ' track by ' + this.trackByExp;
        }
        return expression;
      } 
    };

  };

  self.getGroupNgRepeatExpression = function() {
    return '$group in $select.groups';
  };

}]);

}());
angular.module("ui.select").run(["$templateCache", function($templateCache) {$templateCache.put("bootstrap/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\" role=\"listbox\" ng-show=\"$select.items.length > 0\"><li class=\"ui-select-choices-group\" id=\"ui-select-choices-{{ $select.generatedId }}\"><div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div><div id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\"><a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\"></a></div></li></ul>");
$templateCache.put("bootstrap/match-multiple.tpl.html","<span class=\"ui-select-match\"><span ng-repeat=\"$item in $select.selected\"><span class=\"ui-select-match-item btn btn-default btn-xs\" tabindex=\"-1\" type=\"button\" ng-disabled=\"$select.disabled\" ng-click=\"$selectMultiple.activeMatchIndex = $index;\" ng-class=\"{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span class=\"close ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span> <span uis-transclude-append=\"\"></span></span></span></span>");
$templateCache.put("bootstrap/match.tpl.html","<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" aria-label=\"{{ $select.baseTitle }} activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span> <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i> <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"btn btn-xs btn-link pull-right\"><i class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></i></a></span></div>");
$templateCache.put("bootstrap/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control\" ng-class=\"{open: $select.open}\"><div><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search input-xs\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-click=\"$select.activate()\" ng-model=\"$select.search\" role=\"combobox\" aria-label=\"{{ $select.baseTitle }}\" ondrop=\"return false;\"></div><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("bootstrap/select.tpl.html","<div class=\"ui-select-container ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" tabindex=\"-1\" aria-expanded=\"true\" aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"form-control ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.searchEnabled && $select.open\"><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("selectize/choices.tpl.html","<div ng-show=\"$select.open\" class=\"ui-select-choices ui-select-dropdown selectize-dropdown single\"><div class=\"ui-select-choices-content selectize-dropdown-content\"><div class=\"ui-select-choices-group optgroup\" role=\"listbox\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label optgroup-header\" ng-bind=\"$group.name\"></div><div role=\"option\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\"><div class=\"option ui-select-choices-row-inner\" data-selectable=\"\"></div></div></div></div></div>");
$templateCache.put("selectize/match.tpl.html","<div ng-hide=\"($select.open || $select.isEmpty())\" class=\"ui-select-match\" ng-transclude=\"\"></div>");
$templateCache.put("selectize/select.tpl.html","<div class=\"ui-select-container selectize-control single\" ng-class=\"{\'open\': $select.open}\"><div class=\"selectize-input\" ng-class=\"{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}\" ng-click=\"$select.activate()\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" tabindex=\"-1\" class=\"ui-select-search ui-select-toggle\" ng-click=\"$select.toggle($event)\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-hide=\"!$select.searchEnabled || ($select.selected && !$select.open)\" ng-disabled=\"$select.disabled\" aria-label=\"{{ $select.baseTitle }}\"></div><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("select2/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content select2-results\"><li class=\"ui-select-choices-group\" ng-class=\"{\'select2-result-with-children\': $select.choiceGrouped($group) }\"><div ng-show=\"$select.choiceGrouped($group)\" class=\"ui-select-choices-group-label select2-result-label\" ng-bind=\"$group.name\"></div><ul role=\"listbox\" id=\"ui-select-choices-{{ $select.generatedId }}\" ng-class=\"{\'select2-result-sub\': $select.choiceGrouped($group), \'select2-result-single\': !$select.choiceGrouped($group) }\"><li role=\"option\" id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}\"><div class=\"select2-result-label ui-select-choices-row-inner\"></div></li></ul></li></ul>");
$templateCache.put("select2/match-multiple.tpl.html","<span class=\"ui-select-match\"><li class=\"ui-select-match-item select2-search-choice\" ng-repeat=\"$item in $select.selected\" ng-class=\"{\'select2-search-choice-focus\':$selectMultiple.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span uis-transclude-append=\"\" class='testgroup-text'></span> <a href=\"javascript:;\" class=\"ui-select-match-close select2-search-choice-close\" ng-click=\"$selectMultiple.removeChoice($index)\" tabindex=\"-1\"><i class='material-icons font-16 close-icon'>close</i></a></li></span>");
$templateCache.put("select2/match.tpl.html","<a class=\"select2-choice ui-select-match\" ng-class=\"{\'select2-default\': $select.isEmpty()}\" ng-click=\"$select.toggle($event)\" aria-label=\"{{ $select.baseTitle }} select\"><span ng-show=\"$select.isEmpty()\" class=\"select2-chosen\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"select2-chosen\" ng-transclude=\"\"></span> <abbr ng-if=\"$select.allowClear && !$select.isEmpty()\" class=\"select2-search-choice-close\" ng-click=\"$select.clear($event)\"></abbr> <span class=\"select2-arrow ui-select-toggle\"><b></b></span></a>");
$templateCache.put("select2/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple select2 select2-container select2-container-multi\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled}\"><ul class=\"select2-choices\"><span class=\"ui-select-match\"></span><li class=\"select2-search-field\"><input type=\"text\" autocomplete=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"select2-input ui-select-search\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-model=\"$select.search\" ng-click=\"$select.activate()\" style=\"width: 34px;\" ondrop=\"return false;\"></li></ul><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"ui-select-choices\"></div></div></div>");
$templateCache.put("select2/select.tpl.html","<div class=\"ui-select-container select2 select2-container\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled, \'select2-container-active\': $select.focus, \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}\"><div class=\"ui-select-match\"></div><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"select2-search\" ng-show=\"$select.searchEnabled\"><input type=\"text\" autocomplete=\"false\" autocorrect=\"false\" autocapitalize=\"off\" spellcheck=\"false\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"ui-select-search select2-input\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div></div></div>");}]);





'use strict';

angular.module('meddApp')
.service('customHttp', ['$http', function ($http) {

    this.request = function(impParams, requestLink, type, callback){
    	if(type == 'GET'){
    		requestLink = requestLink+'?'+impParams; //To search using the important parameters by $stateParams
    		impParams = '';
    	}
    	else{
    		//As it is
    	}
        $http({
	        method : type,
	        url : requestLink,
	        data : impParams,
	        headers : {
	        	"Content-Type": 'application/x-www-form-urlencoded'
	    	}
	    })
	    .success(function(data, status, headers, config){ 	
	        callback(data);
	    })
	    .error(function(data, status, headers, config) {
	    	console.log('HTTP request failed!');
	    	// Materialize.toast('Sorry! There occurred some error', 2000);
  		});
    }    
}])





'use strict';

angular.module('meddApp')
.service('fileUpload', ['$http', function ($http) {
    this.upload = function(file, uploadUrl, lab_id, pharmacy_id, callback){
        if(file == undefined){
            console.log('File undefined');
        }
        var formdata = new FormData();
        formdata.append('file', file);
        if(lab_id){formdata.append('lab_id', lab_id);}
        if(pharmacy_id){formdata.append('pharmacy_id', pharmacy_id);}
        console.log(file);
        console.log(formdata);

        $http.post(uploadUrl, formdata, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
        .success(function(data){
            callback(data);
        })
        .error(function(){
            var content = {'header':'Error','message':'Error in Connection.'};
        });
    }
}])





'use strict';

angular.module('meddApp')
.factory('Page', function() {
	var title = 'default';
	return {
		title: function() { return title; },
		setTitle: function(newTitle) {
			title = newTitle
		}
	};
});