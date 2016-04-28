/**
 * Created by Kitty on 3/28/16.
 */
'use strict';
angular.module('newScience')

  //factory, what is it if not to separate
  .factory('CellBoardFactory', function () {

    /**
     *
     * @param height number of rows in the matrix
     * @param width number of columns in the matrix
     * @param probSuccess probability that a success object will be set to a given cell
     * @param success if Math.random() <= this, success is placed in cell
     * @param fail if Math.random() > this, fail is placed in cell
     * @returns {Array} of arrays
     */
    function initRandy(height, width, probSuccess, success, fail) {
      var board = [];
      for (var h = 0; h < height; h++) {
        var row = [];
        for (var w = 0; w < width; w++) {
          if (Math.random() <= probSuccess) {
            row.push(success);
          } else {
            row.push(fail);
          }
        }
        board.push(row);
      }
      return board;
    }

    /**
     *
     * @param height number of rows in the matrix
     * @param width number of columns in the matrix
     * @param initVal all cells initialized to this
     * @returns {Array} (of Arrays) all init to
     */
    function initAllBlank(height, width, blankVal) {
      return initRandy(height, width, 1.1, blankVal, blankVal);
    }

    /**
     * @param initVal  a vertical line will be init to this on the board
     *
     */
    function initLiny(height, width, initVal, blankVal) {
      var board = initAllBlank(height, width, blankVal);
      var mid = Math.round(width / 2);
      for (var h = 0; h < height; h++) {
        board[h][mid] = initVal;

      }
      return board;
    }

    /**
     * @param initVal  a vertical AND a Horizontal!!!! line will be init to this on the board
     *
     */
    function initCrossy(height, width, initVal, blankVal) {
      var board = initLiny(height, width, initVal, blankVal);
      var mid = Math.round(height / 2);
      for (var w = 0; w < width; w++) {
        board[mid][w] = initVal;
      }
      return board;
    }

    /**
     *
     * @param height
     * @param width
     * @param initVal
     * @param blankVal
     * @param r radius
     * @param thickness r-this gives the band
     * @returns {*}
     */
    function initCircy(board, height, width, initVal, blankVal, r, thickness, erase) {
      if (erase) {
        board = initAllBlank(height, width, blankVal);
      }
      var centW = Math.round(width / 2);
      var centH = Math.round(height / 2);
      for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
          var rh = Math.pow((h - centH), 2);
          var rw = Math.pow((w - centW), 2);
          var rt = Math.round(Math.sqrt(rw + rh));
          if (rt <= r && rt > (r - thickness)) {
            board[h][w] = initVal;

          }
        }
      }
      return board;
    }

    function getRadials(height, width, num) {
      var radials = [];
      var min = Math.min(height, width) / 2;//since radius
      var chunksSize = min / (num);
      for (var i = 0; i < num; i++) {
        radials.push(Math.round((i + 1) * chunksSize));
      }
      return radials;
    }

    function initCircys(board, height, width, initVal, blankVal, num, thickness, erase) {
      if (erase) {
        board = initAllBlank(height, width, blankVal);
      }
      var rs = getRadials(height, width, num);
      for (var r = 0; r < rs.length; r++) {
        board = initCircy(board, height, width, initVal, blankVal, rs[r], thickness, false);
      }
      return board;
    }

    function initCircysCrossy(board, height, width, initVal, blankVal, num, thickness) {
      board = initCrossy(height, width, initVal, blankVal);
      board = initCircys(board, height, width, initVal, blankVal, num, thickness, false);
      var centW = Math.round(width / 2);
      var centH = Math.round(height / 2);
      for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
          if (Math.abs(h - centH) - Math.abs(w - centW) < 0) {
            board[h][w] = initVal;

          }
        }
      }
      return board;
    }


    function initSiny(board, height, width, initVal, blankVal, freq, erase) {
      if (erase) {
        board = initAllBlank(height, width, blankVal);
      }
      var mid = Math.round(height / 2);
      for (var w = 0; w < width; w++) {
        var hcurr = mid + Math.round(Math.sin(w * freq) * mid);
        for (var it = -10; it < 10; it++) {//make it neato
          var hIt = hcurr + it;
          if (hIt >= 0 && hIt < height - 1) {
            board[hIt][w] = initVal;
          }
        }
      }
      return board;
    }


    function initGun(board, shift, shiftR, active) {
      board[24 + shift][10 + shiftR] = active;
      board[22 + shift][9 + shiftR] = active;
      board[24 + shift][9 + shiftR] = active;
      board[12 + shift][8 + shiftR] = active;
      board[13 + shift][8 + shiftR] = active;
      board[20 + shift][8 + shiftR] = active;
      board[21 + shift][8 + shiftR] = active;
      board[34 + shift][8 + shiftR] = active;
      board[35 + shift][8 + shiftR] = active;
      board[11 + shift][7 + shiftR] = active;
      board[15 + shift][7 + shiftR] = active;
      board[20 + shift][7 + shiftR] = active;
      board[21 + shift][7 + shiftR] = active;
      board[34 + shift][7 + shiftR] = active;
      board[35 + shift][7 + shiftR] = active;
      board[0 + shift][6 + shiftR] = active;
      board[1 + shift][6 + shiftR] = active;
      board[10 + shift][6 + shiftR] = active;
      board[16 + shift][6 + shiftR] = active;
      board[20 + shift][6 + shiftR] = active;
      board[21 + shift][6 + shiftR] = active;
      board[0 + shift][5 + shiftR] = active;
      board[1 + shift][5 + shiftR] = active;
      board[10 + shift][5 + shiftR] = active;
      board[14 + shift][5 + shiftR] = active;
      board[16 + shift][5 + shiftR] = active;
      board[17 + shift][5 + shiftR] = active;
      board[22 + shift][5 + shiftR] = active;
      board[24 + shift][5 + shiftR] = active;
      board[10 + shift][4 + shiftR] = active;
      board[16 + shift][4 + shiftR] = active;
      board[24 + shift][4 + shiftR] = active;
      board[11 + shift][3 + shiftR] = active;
      board[15 + shift][3 + shiftR] = active;
      board[12 + shift][2 + shiftR] = active;
      board[13 + shift][2 + shiftR] = active;

    }





    function getParams(height, width, size, gap) {
      var boardParams = new Object();
      //cell number high
      boardParams.height = height;
      //cell number wide
      boardParams.width = width;
      //whole world in its hands
      boardParams.board = [];
      //pixel size
      boardParams.size = size;                                         //
      /** gap between two cells (in pixels)                        */
      boardParams.gap = gap;
      return boardParams;
    }

    return {
      initAllBlank: initAllBlank,
      initRandy: initRandy,
      initLiny: initLiny,
      initCrossy: initCrossy,
      initGun: initGun,
      initCircys: initCircys,
      initCircysCrossy: initCircysCrossy,
      initSiny: initSiny,
      getParams:getParams

    };

  });

/**
 * Created by Kitty on 4/10/16.
 */
