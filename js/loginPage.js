//LOGIN FROM CONTROLLER
myApp.controller('loginForm',function( $scope, sessionService, $location, dataService, $timeout ){
    
    //if any user is logged in..
    if( sessionService.user.name )
        $location.url('/dashboard');
    //otherwise..
    
    
    
    
    $scope.user = {};
    $scope.user.isInDB = function(){
        
        dataService.retrieve( '/passwords/' + $scope.user.name, function(obj){
            console.log( "retrieved user: ", obj );
            if( obj )
                $timeout(function() {
                  // anything you want will safely be run on the next digest.
                    $scope.user.found = true;
                });
        });
        
    };
    $scope.user.auth = function(){
          
        dataService.retrieve( '/passwords/' + $scope.user.name, function(obj){
            console.log( "retrieved user password: " + obj.password );
            if( obj.password = $scope.user.password )
                $timeout(function() {
                  // anything you want will safely be run on the next digest.
                    $scope.user.loggedIn = true;
                    $timeout( function(){
                        sessionService.createSession( $scope.user.name );
                    },1000);
                });
        });
        
    };
    
});