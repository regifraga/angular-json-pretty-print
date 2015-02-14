var jsonPrettyPrint = angular.module('JsonPrettyPrint', []);
angular.module('JsonPrettyPrint').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('component/templates/jsonPrettyPrint.html',
    "<code>\n" +
    "    <div class=\"json-treeview\" data-ng:repeat=\"line in jsonPretty\" data-ng:include=\"'component/templates/line.html'\">\n" +
    "    </div>\n" +
    "</code>"
  );


  $templateCache.put('component/templates/line.html',
    "<i data-ng:repeat=\"object in line.elements\" class=\"fa fa-minus-square-o {{object.class}}\" id=\"{{object.id}}\" class=\"fa fa-minus-square-o plus-icon\" data-ng:if=\"object.isPlusIcon\"></i>\n" +
    "<span data-ng:repeat=\"object in line.elements\" class=\"{{object.class}}\" data-ng:if=\"object.isPlusIcon == false\">{{object.element}}</span>\n" +
    "<div class=\"json-new-line\" data-ng:repeat=\"line in line.lines\" data-ng:include=\"'component/templates/line.html'\" data-id=\"{{line.plusId}}\">\n" +
    "</div>"
  );

}]);

(function() {
    jsonPrettyPrint.directive('rmJsonPrettyPrint',
    [rmJsonPrettyPrintDirective]);

    function rmJsonPrettyPrintDirective() {

        var _createBlank = function(){
            var jsonObject = {};

            jsonObject.id = '';
            jsonObject.isPlusIcon = false;
            jsonObject.isBlank = true;
            jsonObject.element = '  ';
            jsonObject.style = '';
            jsonObject.class = 'json-blank';
            
            return jsonObject;
        };

        var _createKey = function(key){
            var jsonObject = {};

            jsonObject.id = '';
            jsonObject.isPlusIcon = false;
            jsonObject.isBlank = false;
            jsonObject.element = key;
            jsonObject.style = '';
            jsonObject.class = 'json-key';
            
            return jsonObject;
        };

        var _createTwoPoints = function(){
            var jsonObject = {};

            jsonObject.id = '';
            jsonObject.isPlusIcon = false;
            jsonObject.isBlank = false;
            jsonObject.element = ':';
            jsonObject.style = '';
            jsonObject.class = 'json-two-points';
            
            return jsonObject;
        };

        var _createValue = function(value){
            var jsonObject = {};

            if(typeof value === 'string'){
                return _createString(value);
            }
            else{
                jsonObject.id = '';
                jsonObject.isPlusIcon = false;
                jsonObject.isBlank = false;
                jsonObject.element = value;
                jsonObject.style = '';
                jsonObject.class = 'json-value';
                
                return jsonObject;
            }
        };

        var _createString = function(value){
            var jsonObject = {};

            jsonObject.id = '';
            jsonObject.isPlusIcon = false;
            jsonObject.isBlank = false;
            jsonObject.element = '\"' + value + '\"';
            jsonObject.style = '';
            jsonObject.class = 'json-string';
            
            return jsonObject;
        };

        var _createObject = function(json, blanks, plusId){
            var jsonLines = [],
                jsonLine = {
                    elements: [],
                    lines: []
                },
                jsonObject = {};

            jsonObject.id = 'plus_' + plusId;
            jsonObject.isPlusIcon = true;
            jsonObject.isBlank = false;
            jsonObject.element = '';
            jsonObject.style = '';
            jsonObject.class = 'plus-icon';
            jsonLine.elements.push(jsonObject);
            
            jsonObject = {};
            jsonObject.id = '';
            jsonObject.isPlusIcon = false;
            jsonObject.isBlank = false;
            jsonObject.element = '{';
            jsonObject.style = '';
            jsonObject.class = 'json-brace';
            jsonLine.elements.push(jsonObject);

            blanks = blanks + 1;
            Object.keys(json).forEach(function(key){
                var internalLine = {
                    elements: [],
                    lines: [],
                    plusId: 'plus_' + plusId
                };

                for(var counter = 0; counter < blanks; counter = counter + 1){
                    internalLine.elements.push(_createBlank());
                }

                internalLine.elements.push(_createKey(key));

                internalLine.elements.push(_createTwoPoints());

                internalLine.elements.push(_createValue(json[key]));

                jsonLine.lines.push(internalLine);
            });

            jsonLines.push(jsonLine);

            jsonLine = {
                elements: [],
                lines: []
            };
            jsonObject = {};
            jsonObject.id = '';
            jsonObject.isPlusIcon = false;
            jsonObject.isBlank = false;
            jsonObject.element = '}';
            jsonObject.style = '';
            jsonObject.class = 'json-brace';
            jsonLine.elements.push(jsonObject);
            jsonLines.push(jsonLine);        

            return jsonLines;
        };

        var _prettifyJson = function(json){
            var jsonObject = JSON.parse(json),
                jsonLines = [],
                blanks = 0,
                plusId = 0;

            if(Array.isArray(jsonObject)){

            }
            else{
                var _jsonLines = _createObject(jsonObject, blanks, plusId);
                jsonLines = jsonLines.concat(_jsonLines);
            }

            return jsonLines;
        };

        var html = 'component/templates/jsonPrettyPrint.html';

        return {
            restrict: 'E',
            templateUrl: html,
            replace: true,
            link: function (scope, element, attrs, controller) {
                attrs.$observe("json", function (newValue) {
                    scope.jsonPretty = _prettifyJson(newValue);
                });
            }
        };

    }
})();