/**
 * Created by Kitty on 3/31/16.
 */
angular.module('starter')

  .factory('TGOLFactory', function () {

    /**
     * Compute the next iteration of life
     */
    function computeNext(board, niceParam) {
      var newBoard = [];
      for (var r = 0; r < board.length; r++) {
        var newRow = [];
        for (var c = 0; c < board[r].length; c++) {
          newRow.push(willLive(board, r, c, niceParam) || newCell(board, r, c));
        }
        newBoard.push(newRow);
      }
      return newBoard;
    }

    function willLive(board, row, cell, niceParam) {
      var n = neighbours(board, row, cell);
      return cellAt(board, row, cell)
        && ((n >= 2
        && n <= 3)
        || Math.random() < niceParam);//random survival chance
    }

    /**
     this cell will be no more
     */
    function willDie(board, row, cell, niceParam) {
      var n = neighbours(board, row, cell);

      return cellAt(board, row, cell)
        && (n < 2
        || n > 3) && Math.random() > niceParam;
    }

    function newCell(board, row, cell) {
      var n = neighbours(board, row, cell);

      return !cellAt(board, row, cell)
        && n == 3;
    }

    function neighbours(board, row, cell) {
      var n = 0;
      n += cellAt(board, row - 1, cell - 1) ? 1 : 0;
      n += cellAt(board, row - 1, cell + 0) ? 1 : 0;
      n += cellAt(board, row - 1, cell + 1) ? 1 : 0;
      n += cellAt(board, row + 0, cell - 1) ? 1 : 0;
      n += cellAt(board, row + 0, cell + 1) ? 1 : 0;
      n += cellAt(board, row + 1, cell - 1) ? 1 : 0;
      n += cellAt(board, row + 1, cell + 0) ? 1 : 0;
      n += cellAt(board, row + 1, cell + 1) ? 1 : 0;
      return n;
    }

    /**
     * A cell is here
     */
    function cellAt(board, row, cell) {
      return (row >= 0 && row < board.length &&
      cell >= 0 && cell < board[row].length &&
      board[row][cell]);
    }

    /**
     *
     * @param board game o life board
     * @param row probs should be in range
     * @param cell also
     * @param colorOfDeath color for will die
     * @param colorOfBirth color for birth
     * @param colorOfLife
     * @param colorOfBoring
     * @param niceParam randomizer
     * @returns {Object} with color and type
     */
    function getCellType(board, row, cell, colorOfDeath, colorOfBirth, colorOfLife, colorOfBoring, niceParam) {
      var cellType = new Object();
      if (willDie(board, row, cell, niceParam)) {//death
        cellType.color = colorOfDeath;
        cellType.type = 0;

        return cellType;
      }
      if (newCell(board, row, cell)) {//birth
        cellType.color = colorOfBirth;
        cellType.type = 1;

        return cellType;
      }
      if (cellAt(board, row, cell)) {//current
        cellType.color = colorOfLife;
        cellType.type = 2;

        return cellType;
      }
      cellType.color = colorOfBoring;
      cellType.type = -1;

      return cellType;
    };


    return {
      computeNext: computeNext,
      getCellType: getCellType,
    };

  });
/**
 * Created by Kitty on 4/10/16.
 */
