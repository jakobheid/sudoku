'use strict';

angular.module('sudokuApp').factory('SolvingService', function(_) {

	function findHiddenSubset(sudoku) {
		findHiddenSubsetInBlock(sudoku);
		findHiddenSubsetVertical(sudoku);
		findHiddenSubsetHorizontal(sudoku);
	} 

	function findHiddenSubsetVertical(sudoku) {
		_.forEach(sudoku.verticalLines, function(line) {
			findHiddenSubsetInCells(line);
		});
	}	

	function findHiddenSubsetHorizontal(sudoku) {
		_.forEach(sudoku.horizontalLines, function(line) {
			findHiddenSubsetInCells(line);
		});
	}

	function findHiddenSubsetInBlock(sudoku) {
		_.forEach(sudoku.blocks, function(block) {
			findHiddenSubsetInCells(block.values);
		});
	}

	function findHiddenSubsetInCells(cellArray) { 
			var countByValue = {}, cellsByValue = {};
			_.forEach(cellArray, function(cell) {
				if (!cell.value) {
					_.forEach(cell.possibleValues, function(possibleValue) {
						incrementCountOfValue(possibleValue, countByValue, cellsByValue, cell);
					});
				}
			});
			var valuesByCount = revertObject(countByValue);

			// double
			findHiddenSubsetForCount(valuesByCount, cellsByValue, 2);

			// tripple
			findHiddenSubsetForCount(valuesByCount, cellsByValue, 3);

			// quadrupple
			findHiddenSubsetForCount(valuesByCount, cellsByValue, 3);
	}

	function findHiddenSubsetForCount(valuesByCount, cellsByValue, count) {
			findHiddenSubsetCells(valuesByCount[count], cellsByValue, count);
	}

    function findHiddenSubsetCells(hiddenSubsetValues, cellsByValue, count) {
    	var hiddenCellsByKey = {};
    	_.forEach(hiddenSubsetValues, function(hiddenValue){
    		var cellsOfHiddenValue = cellsByValue[hiddenValue];
    		var key = createCellsKey(cellsOfHiddenValue);
    		var hiddenObjects = hiddenCellsByKey[key];
    		if(!hiddenObjects) {
    			hiddenObjects = [];
    			hiddenCellsByKey[key] = hiddenObjects;
    		}
    		hiddenObjects.push({
    				cells: cellsOfHiddenValue,
    				value:hiddenValue
    			});
    	});
    	_.forOwn(hiddenCellsByKey, function(hiddenObjects){
    		if(hiddenObjects.length === count) {
    			var hiddenSubset = _.pluck(hiddenObjects, 'value');
    			_.forEach(hiddenObjects[0].cells, function(cell){
    				if(cell.possibleValues.length > count) {
							console.log("removing hidden subset " + count+ " for cell "+ cell.blockIndex + ":" + cell.index);
							_.remove(cell.possibleValues, function(possibleValue) {
								return !_.includes(hiddenSubset, possibleValue.toString());
							});
						}
    			});
    		}
    	});
    }
	
	function createCellsKey(cells) {
		var result = "";
		_.forEach(cells, function(cell){
			result += cell.blockIndex + ":"+ cell.index+";";
		});
		return result;
	}

	function revertObject(original) {
		var reverted = {};
		_.forOwn(original, function(theCount, theValue) {
			var valueArray = reverted[theCount];
  			if(!valueArray) {
  				valueArray = [];
  				reverted[theCount] = valueArray;
  			}
  			valueArray.push(theValue);
		});
		return reverted;
	}

	function incrementCountOfValue(possibleValue, countByValue, cellsByValue, cell) {
		var actualCount = countByValue[possibleValue];
		if(!actualCount) {
			countByValue[possibleValue] = 1;
		} else {
			countByValue[possibleValue]++;
		}

		var actualCellsForValue = cellsByValue[possibleValue];
		if(!actualCellsForValue) {
			actualCellsForValue = [];
			cellsByValue[possibleValue] = actualCellsForValue;
		}
		actualCellsForValue.push(cell);
	}


	function findNakedSingle(sudoku) { 
		_.forEach(sudoku.blocks, function(block) {
			_.forEach(block.values, function(cell) {
				if (!cell.value) {
					removeAllValuesFromBlock(block, cell);
					removeAllValuesHorizontal(cell, sudoku.horizontalLines);
					removeAllValuesVertical(cell, sudoku.verticalLines);
				}
			});
		});
	}

	function findHiddenSingle(sudoku) { 
		_.forEach(sudoku.blocks, function(block) {
			_.forEach(block.values, function(cell) {
				if (!cell.value) {
					reduceToSinglePossibleValue(block, cell);
				}
			});
		});
	}

	function reduceToSinglePossibleValue(block, cell) {
		var uniquePossibleValue;
		_.forEach(cell.possibleValues, function(possibleValue) {
			var unique = true;
			_.forEach(block.values, function(otherCell) {
				if(!isSameCell(cell, otherCell)) {
					unique = unique && ! _.includes(otherCell.possibleValues, possibleValue);
				}
			});
			if(unique) {
				uniquePossibleValue = possibleValue;
			}
		});
		if(uniquePossibleValue) {
			cell.possibleValues = [uniquePossibleValue];
		}
	}

	function removeAllValuesFromBlock(block, thisCell) {
		removeAllValuesFromArray(block.values, thisCell);
	}
	function removeAllValuesHorizontal(cell, horizontalLines) {
		var line = horizontalLines[getRow(cell)];
		removeAllValuesFromArray(line, cell);
	}
	function removeAllValuesVertical(cell, verticalLines) {
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

	function removeFromPossibleValues(possibleValues, otherValue) {
		_.remove(possibleValues, function(n) {
			return n === otherValue;
		});
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

	function getColumn(cell) {
		if (isCol1(cell.blockIndex)) {
			if (isCol1(cell.index)) {
				return 0;
			} else if (isCol2(cell.index)) {
				return 1;
			} else {
				return 2;
			}
		}
		else if (isCol2(cell.blockIndex)) {
			if (isCol1(cell.index)) {
				return 3;
			} else if (isCol2(cell.index)) {
				return 4;
			} else {
				return 5;
			}
		}
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

	function isSameCell(left, right) {
		return left.blockIndex === right.blockIndex	&& left.index === right.index;
	}


	function isCol1(index) {
		return _.includes([ 0, 3, 6 ], index);
	}

	function isCol2(index) {
		return _.includes([ 1, 4, 7 ], index);
	}

	function createEmptySudoku() {
		var result = {
			blocks: [],
			horizontalLines: {
				0 : [],
				1 : [],
				2 : [],
				3 : [],
				4 : [],
				5 : [],
				6 : [],
				7 : [],
				8 : [],
				9 : []},
				verticalLines: {
					0 : [],
					1 : [],
					2 : [],
					3 : [],
					4 : [],
					5 : [],
					6 : [],
					7 : [],
					8 : [],
					9 : []}
				};

				function createInitialBlock(blockIndex) {
					var currentCell, result = [];
					for ( var i = 0; i < 9; i++) {
						currentCell = new Cell(i, blockIndex);
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
					result.horizontalLines[row].push(cell);

					var column = getColumn(cell);
					result.verticalLines[column].push(cell);
				}

				
				result.blocks[0] = createInitialBlock(0);
				result.blocks[1] = createInitialBlock(1);
				result.blocks[2] = createInitialBlock(2);
				result.blocks[3] = createInitialBlock(3);
				result.blocks[4] = createInitialBlock(4);
				result.blocks[5] = createInitialBlock(5);
				result.blocks[6] = createInitialBlock(6);
				result.blocks[7] = createInitialBlock(7);
				result.blocks[8] = createInitialBlock(8);

				return result;
			}

			function Cell(i, bIndex) {
  				this.index = i;
  				this.blockIndex = bIndex;
  				this.value = null;
  				this.possibleValues = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  				this.class = 'input-small';
			}

			Cell.prototype.equals = function(other) {
  				return other !== null && 
  					this.index === other.index && 
  					this.blockIndex === other.blockIndex;
			};

			Cell.prototype.isInCellArray = function(cellArray) {
				return _.includes(cellArray, this);
			}

			function updateValues(blocks) {
				_.forEach(blocks, function(block) {
					_.forEach(block.values, function(cell) {
						if (!cell.value && cell.possibleValues.length === 1) {
							cell.value = cell.possibleValues[0];
							cell.possibleValues = [];
							cell.class = 'input-small';
						}
						if(cell.value && cell.possibleValues.length !== 0) {
							cell.possibleValues = [];
						}
					});
				});
			}


			return {
				findHiddenSubset:findHiddenSubset,
				findNakedSingle:findNakedSingle,
				findHiddenSingle:findHiddenSingle,
				getRow:getRow,
				getColumn:getColumn,
				isSameCell:isSameCell,
				createEmptySudoku:createEmptySudoku,
				updateValues:updateValues
			};
		});

