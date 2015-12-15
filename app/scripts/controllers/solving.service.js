'use strict';

angular.module('sudokuApp').factory('SolvingService', function(_) {

	function findNakedSingle(blocks, horizontalLines, verticalLines) {
		_.forEach(blocks, function(block) {
			_.forEach(block.values, function(cell) {
				if (cell.value) {
					cell.possibleValues = [];
				} else {
					removeAllValuesFromBlock(block, cell);
					removeAllValuesHorizontal(cell, horizontalLines);
					removeAllValuesVertical(cell, verticalLines);
				}
			});
		});
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



	return {
		findNakedSingle:findNakedSingle,
		getRow:getRow,
		getColumn:getColumn,
		isSameCell:isSameCell
	};
});

