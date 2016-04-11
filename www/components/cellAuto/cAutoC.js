'use strict';

//Sauce has morphed
//http://jsfiddle.net/tchatel/H2y5r/
angular.module('starter')
  .controller('CAutotCtrl', function ($scope, $timeout, $window,$ionicPopover, CellBoardFactory, TGOLFactory) {

    $scope.openMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.displays = {
      makers: [{
        name: 'Liny',
        getFunc: function () {
          $scope.type = "Liny";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initLiny(tGOL.height, tGOL.width, true, false);
        }
      }, {
        name: 'Crossy',
        getFunc: function () {
          $scope.type = "Crossy";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initCrossy(tGOL.height, tGOL.width, true, false);
        }
      }, {
        name: 'Randy',
        getFunc: function () {
          $scope.type = "Randy";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initRandy(tGOL.height, tGOL.width, .15, true, false);
        }
      }, {
        name: 'RandRandy',
        getFunc: function () {
          $scope.type = "RandRandy";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initRandy(tGOL.height, tGOL.width, .15, true, false);
          tGOL.niceParam = .0001;
        }
      }, {
        name: 'RandLiny',
        getFunc: function () {
          $scope.type = "RandLiny";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initLiny(tGOL.height, tGOL.width, true, false);
          tGOL.niceParam = .0001;
        }
      }, {
        name: 'Circys',
        getFunc: function () {
          $scope.type = "Circys";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initCircys(tGOL.board, tGOL.height, tGOL.width, true, false, Math.min(tGOL.height, tGOL.width, 25), 1, true);
        }
      }, {
        name: 'CircysCrossy',
        getFunc: function () {
          $scope.type = "CircysCrossy";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initCircysCrossy(tGOL.board, tGOL.height, tGOL.width, true, false, Math.min(tGOL.height, tGOL.width, 25), 1);

        }
      }, {
        name: 'Gunny',
        getFunc: function () {
          $scope.type = "Gunny";

          tGOL = initInit();
          tGOL.board = CellBoardFactory.initAllBlank(tGOL.height, tGOL.width, false);


          //https://github.com/jeffomatic/life/blob/master/patterns.py with some salt
          CellBoardFactory.initGun(tGOL.board, 0, Math.round(tGOL.height / 2), true);
          CellBoardFactory.initGun(tGOL.board, Math.round(tGOL.width / 3), Math.round(tGOL.height / 2), true);
          CellBoardFactory.initGun(tGOL.board, 2 * Math.round(tGOL.width / 3), Math.round(tGOL.height / 2), true);

          CellBoardFactory.initGun(tGOL.board, 0, Math.round(tGOL.height / 2), true);
          CellBoardFactory.initGun(tGOL.board, Math.round(tGOL.width / 4), Math.round(tGOL.height / 3), true);
          CellBoardFactory.initGun(tGOL.board, 3 * Math.round(tGOL.width / 4), Math.round(tGOL.height / 3), true);

          var flipper = CellBoardFactory.initAllBlank(tGOL.height, tGOL.width, false);
          for (var h = 0; h < tGOL.height; h++) {
            for (var w = 0; w < tGOL.width; w++) {
              flipper[h][w] = tGOL.board[w][h];
            }
          }
          tGOL.board = flipper;
        }
      }, {
        name: 'Siny',
        getFunc: function () {
          $scope.type = "Siny";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initSiny(tGOL.board, tGOL.height, tGOL.width, true, false, (1 / 15), true);
        }
      }, {
        name: 'Rsiny',
        getFunc: function () {
          $scope.type = "Rsiny";
          tGOL = initInit();
          tGOL.board = CellBoardFactory.initSiny(tGOL.board, tGOL.height, tGOL.width, true, false, Math.random() * 1000, true);

        }
      }]
    };

    function nextify() {
      tGOL.board = TGOLFactory.computeNext(tGOL.board, tGOL.niceParam);
      for (var i = 0; i < tGOL.board.length; i++) {
        var row = tGOL.board[i];
        for (var j = 0; j < row.length; j++) {
          var cellType = TGOLFactory.getCellType(tGOL.board, i, j, colorOfDeath, colorOfBirth, colorOfLife, colorOfBoring, tGOL.niceParam);
          $scope.context.fillStyle = cellType.color;
          $scope.context.fillRect(tGOL.gap + j * (tGOL.size + 2 * tGOL.gap), tGOL.gap + i * (tGOL.size + 2 * tGOL.gap), tGOL.size, tGOL.size);
        }
      }
      $scope.countable++;
    }

    function initInit() {

      $scope.canvas = document.getElementById('board');
      var height = $window.innerHeight;
      height = height + height % 2 + 1;
      var width = $window.innerWidth;
      width = width + width % 2 + 1;


      tGOL = CellBoardFactory.getParams(height, width, 1, 0);
      tGOL.niceParam = 0;//random live and no die
      $scope.canvas.width = tGOL.width * (tGOL.size + 2 * tGOL.gap);
      $scope.canvas.height = tGOL.height * (tGOL.size + 2 * tGOL.gap);
      $scope.context = $scope.canvas.getContext("2d");
      $scope.context.fillStyle = colorOfBoring;
      $scope.context.fillRect(0, 0, $scope.context.width, $scope.context.height);
      $scope.height = tGOL.height;
      $scope.width = tGOL.width;
      $scope.countable = 0;
      return tGOL;

    }

    var colorOfDeath = "#c7254e";
    var colorOfLife = "#2e6da4";
    var colorOfBirth = "#3e8f3e";
    var colorOfBoring = "white";

    $scope.clocky = 350;

    var tGOL = new Object();
    $scope.displays.makers[$scope.displays.makers.length-1].getFunc();

    var clockIt = function () {
      var start = new Date().getTime();
      nextify();
      var end = new Date().getTime();
      var time = end - start;

      //auto optimize it
      if (time - $scope.clocky > 20) {
        $scope.clocky += 5;
      } else if ($scope.clocky - time > 20) {
        $scope.clocky -= 5;
      }
      $timeout(clockIt, $scope.clocky);

    };

    $timeout(clockIt, $scope.clocky);
  });
