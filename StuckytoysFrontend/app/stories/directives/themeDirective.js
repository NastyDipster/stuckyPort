(function(){
  'use strict';

  angular
    .module('stuckyToys')
    .directive('selectedThemes', selectedThemes);

    function selectedThemes () {
      var directive = {
        link: link,
        templateUrl: 'app/stories/directives/selectedThemes.html',
        restrict: 'EA'
      };
      return directive;

      function link (scope, element, attrs) {

      };
    };

})();
