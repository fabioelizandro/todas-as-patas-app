'use strict';

/**
 * @ngdoc function
 * @name todasAsPatasApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the todasAsPatasApp
 */
angular.module('todasAsPatasApp')
        .controller('MainCtrl', ['$scope', 'Pet', 'Breed', 'Enum', '$location', function ($scope, Pet, Breed, Enum, $location) {
                $scope.loader = false;
                $scope.page = $location.search().page || 1;
                $scope.limit = $location.search().limit || 10;
                $scope.enums = Enum.get();
                $scope.filters = [];
                $scope.pets = {};
                $scope.breed = null;
                $scope.sorting = ($location.search().sorting) ? Enum.getItem('sorting', $location.search().sorting) : null;
                $scope.type = ($location.search().type) ? Enum.getItem('type', $location.search().type) : null;
                $scope.size = Enum.getItem('size', $location.search().size) || null;
                $scope.gender = Enum.getItem('gender', $location.search().gender) || null;
                $scope.age = Enum.getItem('age', $location.search().age) || null;
                $scope.query = $location.search().query || null;
                
                /**
                 * Limpa todos os filtros
                 */
                $scope.clearFilters = function () {
                    $scope.filters = [];
                    $scope.breed = null;
                    $scope.type = null;
                    $scope.size = null;
                    $scope.gender = null;
                    $scope.age = null;
                    $scope.sorting = null;
                    $location.search('breed', null);
                    $scope.updatePets();
                };

                /**
                 * Realiza os filtros para a listagem principal
                 */
                $scope.filter = function () {
                    $scope.updatePets();
                };

                /**
                 * Troca de página
                 */
                $scope.pageChange = function () {
                    $scope.updatePets();
                };

                /**
                 * Atualiza a lista de pets
                 */
                $scope.updatePets = function () {

                    var params = {
                        'page': $scope.page,
                        'limit': $scope.limit,
                        'criteria[typeId]': ($scope.type !== null) ? $scope.type.id : null,
                        'criteria[genderId]': ($scope.gender !== null) ? $scope.gender.id : null,
                        'criteria[ageId]': ($scope.age !== null) ? $scope.age.id : null,
                        'criteria[sizeId]': ($scope.size !== null) ? $scope.size.id : null,
                        'breeds[0]': ($scope.breed !== null) ? $scope.breed.id : null,
                        'query' : $scope.query
                    };

                    if ($scope.sorting !== null) {
                        params['sorting[' + $scope.sorting.key + ']'] = $scope.sorting.direction;
                    }

                    $scope.loader = true;
                    $scope.pets = Pet.query(params, function () {
                        $scope.loader = false;
                    });
                };

                /**
                 * Atualiza a lista de raças
                 */
                $scope.updateBreeds = function () {

                    $scope.breed = null;
                    $scope.breeds = [];
                    $location.search('breed', null);

                    if ($scope.type === null) {
                        return;
                    }

                    Breed.query({id: $scope.type.id}, function (data) {
                        if ($scope.breed === null && $location.search().breed !== undefined) {
                            $scope.breed = _.find(data, {id: $location.search().breed * 1});
                        }
                        $scope.breeds = data;
                    });
                };

                /**
                 * Inicializa os dados de raça
                 */
                $scope.initBreeds = function () {
                    if ($scope.type === null) {
                        return;
                    }

                    Breed.query({id: $scope.type.id}, function (data) {
                        if ($scope.breed === null && $location.search().breed !== undefined) {
                            $scope.breed = _.find(data, {id: $location.search().breed * 1});
                        }
                        $scope.breeds = data;
                    });
                };

                /**
                 * Atualiza a lista de pets sempre que o tipo de pet 
                 * é alterado
                 */
                $scope.$watch('type', function (newValue) {
                    $location.search('type', (newValue !== null) ? newValue.id : null);
                });

                /**
                 * Atualiza $location.search()
                 */
                $scope.$watch('size', function (newValue) {
                    $location.search('size', (newValue !== null) ? newValue.id : null);
                });

                /**
                 * Atualiza $location.search()
                 */
                $scope.$watch('age', function (newValue) {
                    $location.search('age', (newValue !== null) ? newValue.id : null);
                });

                /**
                 * Atualiza $location.search()
                 */
                $scope.$watch('gender', function (newValue) {
                    $location.search('gender', (newValue !== null) ? newValue.id : null);
                });

                /**
                 * Atualiza $location.search()
                 */
                $scope.$watch('sorting', function (newValue) {
                    $location.search('sorting', (newValue !== null) ? newValue.id : null);
                });

                /**
                 * Atualiza $location.search()
                 */
                $scope.onChangeBreed = function () {
                    $location.search('breed', ($scope.breed !== null) ? $scope.breed.id : null);
                };

                /**
                 * Inicializa a página
                 */
                $scope.updatePets();
                $scope.initBreeds();

            }]);
