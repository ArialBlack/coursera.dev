angular.module('confusionApp')
    .constant("baseURL", "http://localhost:3000/")

.service('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    
    this.getPromotions = function () {
        return $resource(baseURL + "promotions/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    };

    this.getDishes = function () {
        return $resource(baseURL + "dishes/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    };
    
}])

.factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    
    var feedbackfac = {};
    
    feedbackfac.getFeedback = function () {
        return $resource(baseURL + "feedback", null, {
            'save': {
                method: 'POST'
            }
        });
    };
    return feedbackfac;
}])

.factory('corporateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    var corpfac = {};

    corpfac.getLeaders = function () {
        return $resource(baseURL + "leadership/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    };
    return corpfac;

}]);
