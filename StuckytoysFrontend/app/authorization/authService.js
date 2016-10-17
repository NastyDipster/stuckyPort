/**
 * Created by jovi on 7/10/2016.
 */
 (function(){
   'use strict';

   angular
     .module('stuckyToys')
     .factory('authService', authService);

   authService.$inject = ['$http', '$window'];

   function authService($http, $window){
       var auth =
       {
           registerUser: register,
           loginUser : logIn,
           saveToken: saveToken,
           getToken : getToken,
           isLoggedIn : isLoggedIn,
           currentUser : currentUser,
           logOut : logOut,
           hasMembers : hasMembers
       };

       function saveToken(token)
       {
           $window.localStorage['StuckytoysToken'] = token;
       };

       function getToken()
       {
           return $window.localStorage['StuckytoysToken'];
       };

       function isLoggedIn(){
           var token  = auth.getToken();
           if(token){
               var payload = JSON.parse($window.atob(token.split('.')[1]));
               return payload.exp > Date.now()/1000;
           }
           else{
               return false;
           }
       };

       function currentUser()
       {
           if(auth.isLoggedIn())
           {
               var token = auth.getToken();
               var payload = JSON.parse($window.atob(token.split('.')[1]));
               return payload.username;
           }
       };

       function hasMembers(user)
       {
             return $http.get('/profile/getAllMembers').succes(function(data)
             {

             });
       };

       function logIn(user)
       {
           return $http.post('/login', user).succes(function(data)
           {
               auth.saveToken(data.token);
           });
       };

       function logOut()
       {
           $window.localStorage.removeItem('StuckytoysToken');
       };

       function register(user)
       {
           return $http.post('localhost:3000/register', user).succes(function (data)
           {
               auth.saveToken(data.token);
           });
       };
       return auth;
   };
 })();
