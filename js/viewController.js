myApp = angular.module( 'myApp', ['ngRoute', 'ngCookies'] );




myApp.service('sessionService', function( $cookies, $location ){
    
    this.user = {};
    this.user.name = $cookies.get( 'userName' );
    this.createSession = function( name ){
        this.user.name = name;
        $cookies.put( 'userName', this.user.name );
        $location.url('/dashboard');
    }
    
});




myApp.service('dataService', function( ){
    
    this.retrieve = function( path, callback ){
        //connecting DB
        var ref = new Firebase( "usersdb-ng.firebaseio.com" + path );
        ref.on("value", function(snapshot) {
            callback( snapshot.val() );
        });
    };
    
    this.add = function( path, data ){
        //connecting DB
        var ref = new Firebase( "usersdb-ng.firebaseio.com" + path );
        ref.push( data );
    };
    
});




myApp.config( function( $routeProvider ) {
    
    $routeProvider
    
    .when( '/' , {
        templateUrl : 'pages/login-page.html',
        controller : "loginForm"
    })
    
    .when( '/dashboard' , {
        templateUrl : 'pages/dashboard-page.html',
        controller : "globalDash"
    })
    
});