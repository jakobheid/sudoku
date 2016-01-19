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

   it('should find hidden single', function () {

    // given
    var sudoku = SolvingService.createEmptySudoku();
    sudoku.blocks[1].values[6].value = 1;
    sudoku.blocks[4].values[4].value = 2;
    sudoku.blocks[4].values[7].value = 3;
    sudoku.blocks[7].values[5].value = 1;
    SolvingService.findNakedSingle(sudoku);
    SolvingService.updateValues(sudoku.blocks);

    // when
    SolvingService.findHiddenSingle(sudoku);
    
    // then
    console.log(sudoku.blocks[4].values[1].possibleValues); 
    expect(sudoku.blocks[4].values[1].possibleValues.length).toBe(1);
    expect(sudoku.blocks[4].values[1].possibleValues[0]).toBe(1);
  });

 it('should find hidden double in block', function () {

    // given
    var sudoku = SolvingService.createEmptySudoku();
    sudoku.blocks[4].values[0].possibleValues = [2, 3, 5, 8];
    sudoku.blocks[4].values[1].possibleValues = [1, 4, 7, 8];
    sudoku.blocks[4].values[2].possibleValues = [3, 8, 9];
    sudoku.blocks[4].values[3].possibleValues = [3, 6, 7, 8, 9];
    sudoku.blocks[4].values[4].possibleValues = [2, 3, 5, 6, 7, 9];
    sudoku.blocks[4].values[5].possibleValues = [2, 5, 6, 7, 9];
    sudoku.blocks[4].values[6].possibleValues = [2, 3, 9];
    sudoku.blocks[4].values[7].possibleValues = [2, 3, 5, 7];
    sudoku.blocks[4].values[8].possibleValues = [1, 2, 3, 4, 5, 6, 8];
    SolvingService.findNakedSingle(sudoku);
    SolvingService.updateValues(sudoku.blocks);

    // when
    SolvingService.findHiddenDouble(sudoku);
    
    // then
    expect(sudoku.blocks[4].values[0].possibleValues).toEqual([2, 3, 5, 8]);
    expect(sudoku.blocks[4].values[1].possibleValues).toEqual([1, 4]);
    expect(sudoku.blocks[4].values[2].possibleValues).toEqual([3, 8, 9]);
    expect(sudoku.blocks[4].values[3].possibleValues).toEqual([3, 6, 7, 8, 9]);
    expect(sudoku.blocks[4].values[4].possibleValues).toEqual([2, 3, 5, 6, 7, 9]);
    expect(sudoku.blocks[4].values[5].possibleValues).toEqual([2, 5, 6, 7, 9]);
    expect(sudoku.blocks[4].values[6].possibleValues).toEqual([2, 3, 9]);
    expect(sudoku.blocks[4].values[7].possibleValues).toEqual([2, 3, 5, 7]);
    expect(sudoku.blocks[4].values[8].possibleValues).toEqual([1, 4]);
  });

 it('should find hidden double horizontal', function () {

    // given
    var sudoku = SolvingService.createEmptySudoku();
    sudoku.blocks[0].values[0].possibleValues = [2, 3, 5, 8];
    sudoku.blocks[0].values[1].possibleValues = [1, 4, 7, 8];
    sudoku.blocks[0].values[2].possibleValues = [3, 8, 9];
    sudoku.blocks[1].values[0].possibleValues = [3, 6, 7, 8, 9];
    sudoku.blocks[1].values[1].possibleValues = [2, 3, 5, 6, 7, 9];
    sudoku.blocks[1].values[2].possibleValues = [2, 5, 6, 7, 9];
    sudoku.blocks[2].values[0].possibleValues = [2, 3, 9];
    sudoku.blocks[2].values[1].possibleValues = [2, 3, 5, 7];
    sudoku.blocks[2].values[2].possibleValues = [1, 2, 3, 4, 5, 6, 8];
    SolvingService.findNakedSingle(sudoku);
    SolvingService.updateValues(sudoku.blocks);

    // when
    SolvingService.findHiddenDouble(sudoku);
    
    // then
    expect(sudoku.blocks[0].values[0].possibleValues).toEqual([2, 3, 5, 8]);
    expect(sudoku.blocks[0].values[1].possibleValues).toEqual([1, 4]);
    expect(sudoku.blocks[0].values[2].possibleValues).toEqual([3, 8, 9]);
    expect(sudoku.blocks[1].values[0].possibleValues).toEqual([3, 6, 7, 8, 9]);
    expect(sudoku.blocks[1].values[1].possibleValues).toEqual([2, 3, 5, 6, 7, 9]);
    expect(sudoku.blocks[1].values[2].possibleValues).toEqual([2, 5, 6, 7, 9]);
    expect(sudoku.blocks[2].values[0].possibleValues).toEqual([2, 3, 9]);
    expect(sudoku.blocks[2].values[1].possibleValues).toEqual([2, 3, 5, 7]);
    expect(sudoku.blocks[2].values[2].possibleValues).toEqual([1, 4]);
  });

it('should find hidden double vertical', function () {

    // given
    var sudoku = SolvingService.createEmptySudoku();
    sudoku.blocks[0].values[0].possibleValues = [2, 3, 5, 8];
    sudoku.blocks[0].values[3].possibleValues = [1, 4, 7, 8];
    sudoku.blocks[0].values[6].possibleValues = [3, 8, 9];
    sudoku.blocks[3].values[0].possibleValues = [3, 6, 7, 8, 9];
    sudoku.blocks[3].values[3].possibleValues = [2, 3, 5, 6, 7, 9];
    sudoku.blocks[3].values[6].possibleValues = [2, 5, 6, 7, 9];
    sudoku.blocks[6].values[0].possibleValues = [2, 3, 9];
    sudoku.blocks[6].values[3].possibleValues = [2, 3, 5, 7];
    sudoku.blocks[6].values[6].possibleValues = [1, 2, 3, 4, 5, 6, 8];
    SolvingService.findNakedSingle(sudoku);
    SolvingService.updateValues(sudoku.blocks);

    // when
    SolvingService.findHiddenDouble(sudoku);
    
    // then
    expect(sudoku.blocks[0].values[0].possibleValues).toEqual([2, 3, 5, 8]);
    expect(sudoku.blocks[0].values[3].possibleValues).toEqual([1, 4]);
    expect(sudoku.blocks[0].values[6].possibleValues).toEqual([3, 8, 9]);
    expect(sudoku.blocks[3].values[0].possibleValues).toEqual([3, 6, 7, 8, 9]);
    expect(sudoku.blocks[3].values[3].possibleValues).toEqual([2, 3, 5, 6, 7, 9]);
    expect(sudoku.blocks[3].values[6].possibleValues).toEqual([2, 5, 6, 7, 9]);
    expect(sudoku.blocks[6].values[0].possibleValues).toEqual([2, 3, 9]);
    expect(sudoku.blocks[6].values[3].possibleValues).toEqual([2, 3, 5, 7]);
    expect(sudoku.blocks[6].values[6].possibleValues).toEqual([1, 4]);
  });

});
