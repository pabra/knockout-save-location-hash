/* global ko */
(function(){
    "use strict";
    var ready = function readyFn(fn) {
        if (document.readyState !== 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    ready(function() {
        var Model, model;

        Model = function() {
            var self = this;

            self.pets = ko.observableArray(['cat', 'dog', 'pig']).extend({hashSync: 'pets'});
            self.favorite = ko.observable('dog').extend({hashSync: 'favorite'});
            self.currentLocation = ko.pureComputed(function() {
                var pets = self.pets(),
                    favorite = self.favorite();

                return location.href;
            });

            self.addPet = function() {
                var el = document.querySelectorAll('#new_pet')[0],
                    pet = String(el.value);

                if (pet) {
                    window.console.log('add pet:', pet);
                    el.value = '';
                    self.pets.push(pet);
                    self.pets.sort();
                }
            };

            self.deletePet = function(pet) {
                window.console.log('delete pet:', pet);
                self.pets.remove(pet);
                if (pet === self.favorite()) {
                    self.favorite(undefined);
                }
            };

            self.setFavorite = function(pet, ev) {
                window.console.log('set fav pet:', pet);
                if (ev.target.checked) {
                    self.favorite(pet);
                } else {
                    self.favorite(undefined);
                }
                return true;
            };

            self.resetLink = function() {
                return window.location.href.split('#')[0];
            };
        };

        model = new Model();
        window.debug_model = model;
        ko.applyBindings(model);
    });
})();
