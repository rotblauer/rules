'use strict';

//Sauce has morphed
//http://jsfiddle.net/tchatel/H2y5r/
angular.module('starter')
  .controller('CAutotCtrl', function ($scope, $timeout,$window, CellBoardFactory, TGOLFactory) {

    //http://codepen.io/d_panayotov/pen/jwJGF
    $scope.liney = function () {
      $scope.type ="Liny";

      tGOL = initInit();
      tGOL.board = CellBoardFactory.initLiny(tGOL.height, tGOL.width, true, false);
    };

    $scope.crossy = function () {
      $scope.type ="crossy";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initCrossy(tGOL.height, tGOL.width, true, false);
    };

    $scope.randy = function () {
      $scope.type ="randy";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initRandy(tGOL.height, tGOL.width, .15, true, false);
    };

    $scope.randrandy = function () {
      $scope.type ="randRandy";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initRandy(tGOL.height, tGOL.width, .15, true, false);
      tGOL.niceParam = .0001;

    };

    $scope.randLiny = function () {
      $scope.type ="randLiny";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initLiny(tGOL.height, tGOL.width, true, false);
      tGOL.niceParam = .0001;
    };

    $scope.circys = function () {
      $scope.type ="circys";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initCircys(tGOL.board, tGOL.height, tGOL.width, true, false, Math.min(tGOL.height, tGOL.width, 25), 1, true);
    };

    $scope.circysCrossy = function () {
      $scope.type ="circysCrossy";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initCircysCrossy(tGOL.board, tGOL.height, tGOL.width, true, false, Math.min(tGOL.height, tGOL.width, 25), 1);
    };

    $scope.siny = function () {
      $scope.type ="siny";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initSiny(tGOL.board, tGOL.height, tGOL.width, true, false, (1 / 15), true);
    };
    $scope.rsiny = function () {
      $scope.type ="rsiny";
      tGOL = initInit();
      tGOL.board = CellBoardFactory.initSiny(tGOL.board, tGOL.height, tGOL.width, true, false, Math.random() * 1000, true);
    };


    $scope.gunny = function () {
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
    };


    function nextify() {
      tGOL.board = TGOLFactory.computeNext(tGOL.board, tGOL.niceParam);

      tGOL.bufferLabels.push($scope.countable + "");

      for (i = 0; i < tGOL.bufferData.length; i++) {
        tGOL.bufferData[i].push(0);
      }
      for (var i = 0; i < tGOL.board.length; i++) {
        var row = tGOL.board[i];
        for (var j = 0; j < row.length; j++) {
          var cellType = TGOLFactory.getCellType(tGOL.board, i, j, colorOfDeath, colorOfBirth, colorOfLife, colorOfBoring, tGOL.niceParam);
          $scope.context.fillStyle = cellType.color;

          if (cellType.type >= 0) {//its not boring, so count it
            tGOL.bufferData[cellType.type][tGOL.bufferLabels.length - 1]++;
          }
          $scope.context.fillRect(tGOL.gap + j * (tGOL.size + 2 * tGOL.gap), tGOL.gap + i * (tGOL.size + 2 * tGOL.gap), tGOL.size, tGOL.size);
        }


      }
      for (var i = 0; i < tGOL.bufferData.length; i++) {
        $scope.piData[i] = tGOL.bufferData[i][tGOL.bufferLabels.length - 1];//update pi chart every cycle since it is quick
      }
      if ($scope.countable % $scope.generationPlot == 0) {//only update liner every once in a while

        for (var i = 0; i < tGOL.bufferData.length; i++) {

          for (var j = 0; j < tGOL.bufferData[i].length; j++) {
            $scope.labels [j] = tGOL.bufferLabels[j];
            $scope.data [i][j] = tGOL.bufferData[i][j];
          }
        }
        if ($scope.countable / $scope.generationPlot > 3) {//can get slow
          $scope.generationPlot = $scope.generationPlot + $scope.generationPlot;
        }
      }
      $scope.countable++;
    }

    function initInit() {

      $scope.canvas = document.getElementById('board');
      $window.innerHeight
      var square =Math.min($window.innerHeight,  $window.innerWidth)-100;
      square =square+square%2 +1;
      tGOL = CellBoardFactory.getParams(square, square, 1, 0)
      tGOL.niceParam = 0;//random live and no die
      //line chart labels
      tGOL.bufferLabels = [];
      //counts for each cell type
      tGOL.bufferData = [
        [],
        [],
        []
      ];

      $scope.canvas.width = tGOL.width * (tGOL.size + 2 * tGOL.gap);
      $scope.canvas.height = tGOL.height * (tGOL.size + 2 * tGOL.gap);
      $scope.context = $scope.canvas.getContext("2d");
      $scope.context.fillStyle = colorOfBoring;
      $scope.context.fillRect(0, 0, $scope.context.width, $scope.context.height);


      $scope.height = tGOL.height;
      $scope.width = tGOL.width;
      $scope.generationPlot = 25;
      $scope.countable = 0;

      $scope.labels = [];
      $scope.series = ['About to Die', 'Born', 'Still Alive'];
      $scope.data = [
        [],
        [],
        []
      ];
      $scope.piData = [0, 0, 0];

      $scope.colors = [colorOfDeath, colorOfBirth, colorOfLife];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      return tGOL;

    }

    var colorOfDeath = "#c7254e";
    var colorOfLife = "#2e6da4";
    var colorOfBirth = "#3e8f3e";
    var colorOfBoring = "white";

    $scope.clocky = 350;

    var tGOL =new Object();
    $scope.type ="Siny";
    $scope.randy();

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


/**
 * Created by Kitty on 4/10/16.
 */
