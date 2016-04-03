angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $ionicListDelegate, $timeout) {

    $scope.loginData = {};
    $reservationData = {};
    $commentData = {};


    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });


    $scope.closeLogin = function () {
        $scope.modal.hide();
    };


    $scope.login = function () {
        $scope.modal.show();
    };


    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);


        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };

    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.reserveform = modal;
    });

    $scope.reserve = function () {
        $scope.reserveform.show();
    };

    $scope.closeReserve = function () {
        $scope.reserveform.hide();
    };

    $scope.doReserve = function () {
        console.log('Doing reserve', $scope.reservationData);

        $timeout(function () {
            $scope.closeReserve();
        }, 1000);
    };


})

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate',
    function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {
        $scope.baseURL = baseURL;
        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;
        $scope.showMenu = false;
        $scope.message = "Loading ...";

        menuFactory.getDishes().query(
            function (response) {
                $scope.dishes = response;
                $scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });


        $scope.select = function (setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            } else if (setTab === 3) {
                $scope.filtText = "mains";
            } else if (setTab === 4) {
                $scope.filtText = "dessert";
            } else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };

        $scope.addFavorite = function (index) {
            console.log("index is " + index);
            favoriteFactory.addToFavorites(index);
            $ionicListDelegate.closeOptionButtons();
        }

    }
])

.controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicModal', '$ionicPopover', '$timeout',
    function ($scope, $stateParams, menuFactory, favoriteFactory, baseURL, $ionicModal, $ionicPopover, $timeout) {
        $scope.baseURL = baseURL;
        $scope.dish = {};
        $scope.showDish = false;
        $scope.message = "Loading ...";

        $scope.dish = menuFactory.getDishes().get({
                id: parseInt($stateParams.id, 10)
            })
            .$promise.then(
                function (response) {
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

        $scope.addFavorite = function () {
            console.log('adding to favorites ' + $scope.dish.id);
            favoriteFactory.addToFavorites($scope.dish.id);
            $scope.closePopover();
        };

        $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });

        $scope.$on('popover.hidden', function () {

        });

        $scope.$on('popover.removed', function () {

        });


        $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.commentform = modal;
        });

        $scope.showFormComment = function () {
            $scope.commentform.show();
        };

        $scope.closeFormComment = function () {
            $scope.commentform.hide();
        };

        $scope.doComment = function () {
            console.log('Doing comment');
            $scope.submitComment();

        };

        $scope.mycomment = {
            rating: 5,
            comment: "",
            author: "",
            date: ""
        };

        $scope.submitComment = function () {

            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);
            $scope.dish.comments.push($scope.mycomment);
            menuFactory.getDishes().update({
                id: $scope.dish.id
            }, $scope.dish);


            $scope.mycomment = {
                rating: 5,
                comment: "",
                author: "",
                date: ""
            };

            $timeout(function () {
                $scope.closeFormComment();
                $scope.closePopover();
            }, 500);
        };


    }
])

.controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.mycomment = {
        rating: 5,
        comment: "",
        author: "",
        date: ""
    };

    $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);
        $scope.dish.comments.push($scope.mycomment);
        menuFactory.getDishes().update({
            id: $scope.dish.id
        }, $scope.dish);

        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: "",
            author: "",
            date: ""
        };
    }
}])



.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({
        id: 3
    });
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.dish = menuFactory.getDishes().get({
            id: 0
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    $scope.promotion = menuFactory.getPromotion().get({
        id: 0
    });

}])

.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL',
    function ($scope, corporateFactory, baseURL) {
        $scope.baseURL = baseURL;
        $scope.leaders = corporateFactory.query();
        console.log($scope.leaders);

    }
])

.controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
    function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

        $scope.baseURL = baseURL;
        $scope.shouldShowDelete = false;

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading...'
        });

        $scope.favorites = favoriteFactory.getFavorites();

        $scope.dishes = menuFactory.getDishes().query(
            function (response) {
                $scope.dishes = response;
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            });
        console.log($scope.dishes, $scope.favorites);

        $scope.toggleDelete = function () {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
            console.log($scope.shouldShowDelete);
        }

        $scope.deleteFavorite = function (index) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete this item?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Ok to delete');
                    favoriteFactory.deleteFromFavorites(index);
                } else {
                    console.log('Canceled delete');
                }
            });

            $scope.shouldShowDelete = false;
        }
    }
])

.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

    }
});