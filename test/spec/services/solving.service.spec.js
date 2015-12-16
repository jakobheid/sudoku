'use strict';

describe('Service: SolvingService', function () {

  // load the controller's module
  beforeEach(module('sudokuApp'));

  var SolvingService;

  beforeEach(inject(function (_SolvingService_) {
    SolvingService = _SolvingService_;
  }));

  it('should find naked single', function () {

    // given
    var sudoku = SolvingService.createEmptySudoku();
    sudoku.blocks[1].values[1].value = 1;
    sudoku.blocks[1].values[4].value = 2;
    sudoku.blocks[3].values[2].value = 3;
    sudoku.blocks[4].values[0].value = 4;
    sudoku.blocks[4].values[3].value = 5;
    sudoku.blocks[4].values[7].value = 6;
    sudoku.blocks[5].values[0].value = 8;
    sudoku.blocks[7].values[1].value = 7;

    // when
    SolvingService.findNakedSingle(sudoku);
    
    // then
    console.log(sudoku.blocks[4].values[1].possibleValues); 
    expect(sudoku.blocks[4].values[1].possibleValues.length).toBe(1);
    expect(sudoku.blocks[4].values[1].possibleValues[0]).toBe(9);
  });

});
