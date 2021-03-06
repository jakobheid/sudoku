'use strict';

/**
 * @ngdoc function
 * @name sudokuApp.controller:MainCtrl
 * @description # MainCtrl Controller of the sudokuApp
 */
 angular.module('sudokuApp').controller(
 	'MainCtrl',
 	function($scope, _, $timeout, SolvingService) {

 		var sudoku = SolvingService.createEmptySudoku();
 		var blocks = sudoku.blocks;
 		var horizontalLines = sudoku.horizontalLines;
 		var verticalLines = sudoku.verticalLines;

 		var guessing = false;
 		$scope.solved = 0;

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
 				_.forEach(block.values, function(cell) {
 					if (cell.value && cell.value.length > 1) {
 						cell.value = cell.value.substring(0, 1);
 					}
 				});
 			});
 		}

 		$scope.solveSudokuFast = function() {
 			var beforeTry = $scope.solved;
 			solveOneRound();
 			var afterTry = $scope.solved;
 			validateModel();
 			if (afterTry === beforeTry && afterTry < 81) {
 				guessOne();
 				$timeout($scope.solveSudokuFast, 1);
 			}
 			if(afterTry < 81) {
 				$timeout($scope.solveSudokuFast, 1);
 			}
 		};

 		$scope.solveSudoku = function() {
 			var beforeTry = $scope.solved;
 			solveOneRound();
 			var afterTry = $scope.solved;
 			validateModel();
 			if (afterTry === beforeTry && afterTry < 81) {
 				guessOne();
 			}
 		};

 		function guessOne() {
 			var cell = getBestCellToGuessValue();
 			cell.value = cell.possibleValues[0];
 			cell.firstGuess = true;
 			cell.possibleValuesBackup = cell.possibleValues;
 			cell.possibleValues = [];
 			cell.class = 'input-small-blue';
 			guessing = true;
 		}

 		function getBestCellToGuessValue() {
 			return _.reduce(blocks, function(left, right) {
 				return chooseBetterCell(getBestCell(left), getBestCell(right));
 			});
 		}

 		function getBestCell(input) {
 			if(input.values) {
 				return _.reduce(input.values, function(left, right) {
 					return chooseBetterCell(left, right);
 				});
				// the values are allready reduced to one cell	
			} else {
				return input;
			}
		}

		function chooseBetterCell(left, right) {
			if(left.possibleValues.length === 0){
				return right;
			} else if(right.possibleValues.length === 0) {
				return left;
			} else if(left.possibleValues.length <= right.possibleValues.length) {
				return left;
			} else {
				return right;
			}
			
		}

		function solveOneRound() {
			SolvingService.findNakedSingle(sudoku);
			SolvingService.findHiddenSingle(sudoku);
			SolvingService.updateValues(blocks);
			updateSolvedCount();
		}

		function validateModel() {
			_.forEach(blocks, function(block) {
				_.forEach(block.values, function(cell) {
					if(cell.value) {
						validateBlock(block, cell);
						validateHorizontal(cell);
						validateVertical(cell);
					}
				});
			});
		}

		function validateBlock(block, cell) {
			validate(block.values, cell);
		}

		

		function validateHorizontal(cell) {
			var line = horizontalLines[SolvingService.getRow(cell)];
			validate(line, cell);
		}


		function validateVertical(cell) {
			var line = verticalLines[SolvingService.getColumn(cell)];
			validate(line, cell);
		}


		function validate(otherCells, thisCell) {
			_.forEach(otherCells, function(otherCell) {
				if (!SolvingService.isSameCell(thisCell, otherCell) && otherCell.value) {
					if(otherCell.value === thisCell.value) {
						revertGuess();
					}
				}
			});
		}

		function revertGuess() {
			_.forEach(blocks, function(block) {
				_.forEach(block.values, function(cell) {
					var guessedValue = cell.value;
					if(cell.isGuessed) {
						cell.value = null;
						cell.possibleValues = cell.possibleValuesBackup;
						cell.isGuessed = false;
						cell.possibleValuesBackup = null;
					}
					if(cell.firstGuess) {
						_.remove(cell.possibleValues, function(value) {
							return value === guessedValue;
						});
					}
				});
			});
		}

		$scope.b11 = sudoku.blocks[0];
		$scope.b12 = sudoku.blocks[1];
		$scope.b13 = sudoku.blocks[2];
		$scope.b21 = sudoku.blocks[3];
		$scope.b22 = sudoku.blocks[4];
		$scope.b23 = sudoku.blocks[5];
		$scope.b31 = sudoku.blocks[6];
		$scope.b32 = sudoku.blocks[7];
		$scope.b33 = sudoku.blocks[8];

		$scope.b11.values[0].value = 5;
		$scope.b11.values[3].value = 6;
		$scope.b11.values[8].value = 8;

		$scope.b12.values[1].value = 7;
		$scope.b12.values[4].value = 9;

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
