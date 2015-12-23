(function () {
		
    var UserReviewController = function ($scope) {
        this.newReview = {};		
		this.userreviews = [
			{"author": "Mike Stevenson",  "comment": "I'm going to improvise. Listen, there's something you should know about me... about inception. An idea is like a virus, resilient, highly contagious. The smallest seed of an idea can grow. It can grow to define or destroy you", "rating": "5"},
			{"author": "Paul Noreman",  "comment": "I'm going to improvise. Listen, there's something you should know about me... about inception. An idea is like a virus, resilient, highly contagious. The smallest seed of an idea can grow. It can grow to define or destroy you", "rating": "4"},
			{"author": "Justin cyraic",  "comment": "I'm going to improvise. Listen, there's something you should know about me... about inception. An idea is like a virus, resilient, highly contagious. The smallest seed of an idea can grow. It can grow to define or destroy you", "rating": "2"}
		];
		
		
		this.addReview = function(){
			this.userreviews.push(this.newReview);
			this.newReview = {};
		}

	};

    UserReviewController.$inject = ['$scope'];

    angular.module('myStoreApp').controller('UserReviewController', UserReviewController);

}());
