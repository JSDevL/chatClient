myApp = angular.module( 'myApp' );
myApp.controller( 'globalDash', function( $scope, $location, sessionService, dataService ){
    
    //if any user is not loggedIn
    if( !sessionService.user.name )
        $location.url('/');
    
    $scope.user = {};
    $scope.user.name = sessionService.user.name;
    $scope.currentContact = '';

});
myApp.directive( 'userContact', function() {
    
    return {
        
        restrict : "E",
        templateUrl : "../pages/dashboard-directives/user-contact.html",
        replace : true,
        scope : {
            contact : "=",
            contactDetails : "="
        },
        link : function( scope, elements ){
        }
        
    }
    
});
myApp.controller( 'dashContacts', function( $scope, sessionService, dataService, $timeout ){
    
    $scope.user = {};
    $scope.user.name = sessionService.user.name;
    
    dataService.retrieve( '/basicDetails', function( obj ){
        
        console.log( "user contacts :", obj[$scope.user.name].uContacts );
        $timeout(function() {
            // anything you want will safely be run on the next digest.
            $scope.user.contacts = obj[$scope.user.name].uContacts;
            $scope.allContactDetails = obj;
        });
        
    });
    
});
myApp.directive( 'userChat', function() {
    
    return{
        
        restrict : "E",
        templateUrl : "../pages/dashboard-directives/user-chat.html",
        replace : true,
        scope: {
            chat : "=",
            currentContact : "=",
            lastMsg : "&"
        },
        link : function( scope, elements ){
        }
        
    }
    
});
myApp.controller( 'dashChats', function( $scope, sessionService, dataService, $timeout ){
    
    $scope.user = {};
    $scope.user.name = sessionService.user.name;
    $scope.lastMsg = function( Msgs ) {
        var msgKeys = Object.keys(Msgs);
        var lastKey = msgKeys[ Object.keys(Msgs).length-1 ];
        if( Msgs[lastKey].sent )
            return Msgs[lastKey].sent;
        else
            return Msgs[lastKey].received;
    };
    
    dataService.retrieve( '/chats/' + $scope.user.name, function( obj ){
        
        console.log( "user chats : ", obj );
        $timeout(function() {
        // anything you want will safely be run on the next digest.
            $scope.user.chats = obj;
        });
        
    });
    
});
myApp.directive( 'chatMessage', function() {
    
    return{
        
        restrict : "E",
        templateUrl : "../pages/dashboard-directives/user-messages.html",
        replace : true,
        scope : {
            key : "=",
            msgType : "&",
            user : "=",
            contact : "=",
            msg : "="
        },
        link : function( scope, elements ){
        }
        
    }
    
});
myApp.controller( 'dashMsgs', function( $scope, sessionService, dataService, $timeout ){
    
    
    $scope.user = {};
    $scope.user.name = sessionService.user.name;
    $scope.msgType = function( msg ){
        if( Object.keys(msg)[0] == 'sent' )
            return "sent";
        else
            return "received";
    };
    
    $scope.$watch( 'currentContact', function( newValue ) {
        
        if( newValue )
            dataService.retrieve( '/chats/' + $scope.user.name + '/' + newValue, function( obj ){
                console.log( obj );
                $timeout(function() {
                // anything you want will safely be run on the next digest.
                    $scope.msgs = obj.messages;
                });
            });
        
    });
    
});
myApp.controller( 'dashMsgForm', function( $scope, sessionService, dataService, $timeout ){
    
    $scope.user = {};
    $scope.user.name = sessionService.user.name;
    $scope.newMsg = "";
    $scope.send = function() {
        if( $scope.newMsg )
        {
            var dataAsSent = {};
            dataAsSent["sent"] = $scope.newMsg;
            dataService.add( '/chats/' + $scope.user.name + '/' + $scope.currentContact + "/messages", dataAsSent );
            
            var dataAsReceived = {};
            dataAsReceived["received"] = $scope.newMsg;
            dataService.add( '/chats/' + $scope.currentContact + '/' + $scope.user.name + "/messages", dataAsReceived );
        }
    };
    
});