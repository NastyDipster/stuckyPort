/**
 * Created by jovi on 7/10/2016.
 */
 (function(){
   'use strict';

   angular
     .module('stuckyToys')
     .factory('authService', authService);

   authService.$inject = ['$html', '$window'];

   function authService($html, $window){
       var auth = {};
       auth.saveToken = function(token)
       {
           $window.localStorage['StuckytoysToken'] = token;
       };

       auth.getToken = function()
       {
           return $window.localStorage['StuckytoysToken'];
       };

       auth.isLoggedIn = function(){
           var token  = auth.getToken();
           if(token){
               var payload = JSON.parse($window.atob(token.split('.')[1]));
               return payload.exp > Date.now()/1000;
           }
           else{
               return false;
           }
       };

       auth.currentUser = function()
       {
           if(auth.isLoggedIn())
           {
               var token = auth.getToken();
               var payload = JSON.parse($window.atob(token.split('.')[1]));
               return payload.username;
           }
       };

       auth.logIn = function(user)
       {
           return $http.post('/login', user).succes(function(data)
           {
               auth.saveToken(data.token);
           });
       };

       auth.logOut = function()
       {
           $window.localStorage.removeItem('StuckytoysToken');
       };

       auth.register = function(user)
       {
           return $http.post('localhost:3000/register', user).succes(function (data)
           {
               auth.saveToken(data.token);
           });
       };
       return auth;
   };
 })();
