'use strict';

/**
 * @ngdoc function
 * @name sudokuApp.controller:MainCtrl
 * @description # MainCtrl Controller of the sudokuApp
 */
angular.module('sudokuApp').controller(
		'MainCtrl',
		function($scope, _) {
			var blocks = []; 

			var horizontalLines = {
				0 : [],
				1 : [],
				2 : [],
				3 : [],
				4 : [],
				5 : [],
				6 : [],
				7 : [],
				8 : [],
				9 : []
			}; 

			var verticalLines = {
				0 : [],
				1 : [],
				2 : [],
				3 : [],
				4 : [],
				5 : [],
				6 : [],
				7 : [],
				8 : [],
				9 : []
			};

			$scope.solved = 0;



			function createInitialBlock(blockIndex) {
				var currentCell, result = [];
				for ( var i = 0; i < 9; i++) {
					currentCell = createCell(i, blockIndex);
					pushToLinesArrays(currentCell);
					result.push(currentCell);
				}
				return {
					index : blockIndex,
					values : result
				};
			}

			function pushToLinesArrays(cell) {
				var row = getRow(cell);
				horizontalLines[row].push(cell);

				var column = getColumn(cell);
				verticalLines[column].push(cell);
			}

			function createCell(i, bIndex) {
				return {
					index : i,
					blockIndex : bIndex,
					value : null,
					possibleValues : [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
					class: 'input-small'
				};
			}

			function updateSolvedCount() {
				var count = 0;
				_.forEach(blocks, function(block) {
					_.forEach(block.values, function(cell) {
						if (cell.value) {
							count++;
						}
					});
				});
				$scope.solved = count;
			}

			$scope.valueChanged = function() {
				validateInput();
				updateSolvedCount();
			};

			function validateInput() {
				_.forEach(blocks, function(block) {
					_.forEach(block.values, function(cell, index) {
						if (cell.value && cell.value.length > 1) {
							block[index] = cell.value.substring(0, 1);
						}
					});
				});
			}

			$scope.solveSudoku = function() {
				var beforeTry;
				do {
					beforeTry = $scope.solved;
					solveOneRound();
				}
				while($scope.solved > beforeTry);
			};

			function solveOneRound() {
				updatePossibleValues();
				updateValues();
				updateSolvedCount();
			}

			function updateValues() {
				_.forEach(blocks, function(block) {
					_.forEach(block.values, function(cell) {
						if (!cell.value && cell.possibleValues.length === 1) {
							cell.value = cell.possibleValues[0];
							cell.possibleValues = [];
							cell.class = 'input-small-blue';
						}
					});
				});
			}

			function updatePossibleValues() {
				_.forEach(blocks, function(block) {
					_.forEach(block.values, function(cell) {
						if (cell.value) {
							cell.possibleValues = [];
						} else {
							removeAllValuesFromBlock(block, cell);
							removeAllValuesHorizontal(cell);
							removeAllValuesVertical(cell);
						}
					});
				});
			}

			function removeAllValuesFromBlock(block, thisCell) {
				removeAllValuesFromArray(block.values, thisCell);
			}

			function removeAllValuesHorizontal(cell) {
				var line = horizontalLines[getRow(cell)];
				removeAllValuesFromArray(line, cell);
			}

			function removeAllValuesVertical(cell) {
				var line = verticalLines[getColumn(cell)];
				removeAllValuesFromArray(line, cell);
			}

			function removeAllValuesFromArray(otherCells, thisCell) {
				_.forEach(otherCells, function(otherCell) {
					if (!isSameCell(thisCell, otherCell) && otherCell.value) {
						removeFromPossibleValues(thisCell.possibleValues,
								otherCell.value);
					}
				});
			}

			function isSameCell(left, right) {
				return left.blockIndex === right.blockIndex	&& left.index === right.index;
			}

			function getRow(cell) {
				if (cell.blockIndex < 3) {
					if (cell.index < 3) {
						return 0;
					} else if (cell.index < 6) {
						return 1;
					} else {
						return 2;
					}
				} else if (cell.blockIndex < 6) {
					if (cell.index < 3) {
						return 3;
					} else if (cell.index < 6) {
						return 4;
					} else {
						return 5;
					}
				} else {
					if (cell.index < 3) {
						return 6;
					} else if (cell.index < 6) {
						return 7;
					} else {
						return 8;
					}
				}
			}

			function isCol1(index) {
				return _.includes([ 0, 3, 6 ], index);
			}

			function isCol2(index) {
				return _.includes([ 1, 4, 7 ], index);
			}

			function getColumn(cell) {

				// col 1
				if (isCol1(cell.blockIndex)) {
					if (isCol1(cell.index)) {
						return 0;
					} else if (isCol2(cell.index)) {
						return 1;
					} else {
						return 2;
					}
				}

				// col 2
				else if (isCol2(cell.blockIndex)) {
					if (isCol1(cell.index)) {
						return 3;
					} else if (isCol2(cell.index)) {
						return 4;
					} else {
						return 5;
					}
				}
				// col 3
				else {
					if (isCol1(cell.index)) {
						return 6;
					} else if (isCol2(cell.index)) {
						return 7;
					} else {
						return 8;
					}
				}
			}

			function removeFromPossibleValues(possibleValues, otherValue) {
				_.remove(possibleValues, function(n) {
					return n === otherValue;
				});
			}

						$scope.b11 = createInitialBlock(0);
			$scope.b12 = createInitialBlock(1);
			$scope.b13 = createInitialBlock(2);
			$scope.b21 = createInitialBlock(3);
			$scope.b22 = createInitialBlock(4);
			$scope.b23 = createInitialBlock(5);
			$scope.b31 = createInitialBlock(6);
			$scope.b32 = createInitialBlock(7);
			$scope.b33 = createInitialBlock(8);

			blocks[0] = $scope.b11;
			blocks[1] = $scope.b12;
			blocks[2] = $scope.b13;
			blocks[3] = $scope.b21;
			blocks[4] = $scope.b22;
			blocks[5] = $scope.b23;
			blocks[6] = $scope.b31;
			blocks[7] = $scope.b32;
			blocks[8] = $scope.b33;

			$scope.b11.values[0].value = 5;
			$scope.b11.values[1].value = 3;
			$scope.b11.values[3].value = 6;
			$scope.b11.values[7].value = 9;
			$scope.b11.values[8].value = 8;

			$scope.b12.values[1].value = 7;
			$scope.b12.values[3].value = 1;
			$scope.b12.values[4].value = 9;
			$scope.b12.values[5].value = 5;

			$scope.b13.values[7].value = 6;

			$scope.b21.values[0].value = 8;
			$scope.b21.values[3].value = 4;
			$scope.b21.values[6].value = 7;

			$scope.b22.values[1].value = 6;
			$scope.b22.values[3].value = 8;
			$scope.b22.values[5].value = 3;
			$scope.b22.values[7].value = 2;

			$scope.b23.values[2].value = 3;
			$scope.b23.values[5].value = 1;
			$scope.b23.values[8].value = 6;

			$scope.b31.values[1].value = 6;

			$scope.b32.values[3].value = 4;
			$scope.b32.values[4].value = 1;
			$scope.b32.values[5].value = 9;
			$scope.b32.values[7].value = 8;

			$scope.b33.values[0].value = 2;
			$scope.b33.values[1].value = 8;
			$scope.b33.values[5].value = 5;
			$scope.b33.values[7].value = 7;
			$scope.b33.values[8].value = 9;

			updateSolvedCount();

		});
