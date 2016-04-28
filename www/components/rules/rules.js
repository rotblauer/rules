/**
 * Created by Kitty on 4/2/16.
 */



angular.module('newScience')
  .controller('RuleCtrl', function ($scope, $timeout,$window, CellBoardFactory) {


      function computeNext() {
        var next = [];
        next.push(0);
        var last = sGol.board[sGol.board.length - 1];
        for (var w = 1; w < sGol.width - 1; w++) {
          var i = ruleNext(sGol.currentRule.ruleset, last[w - 1], last[w], last[w + 1]);
          next.push(i);
        }
        next.push(0);
        sGol.board.push(next);
      }

      function ruleNext(ruleset, a, b, c) {
        if (a == 1 && b == 1 && c == 1) return ruleset[0];
        else if (a == 1 && b == 1 && c == 0) return ruleset[1];
        else if (a == 1 && b == 0 && c == 1) return ruleset[2];
        else if (a == 1 && b == 0 && c == 0) return ruleset[3];
        else if (a == 0 && b == 1 && c == 1) return ruleset[4];
        else if (a == 0 && b == 1 && c == 0) return ruleset[5];
        else if (a == 0 && b == 0 && c == 1) return ruleset[6];
        else if (a == 0 && b == 0 && c == 0) return ruleset[7];
        return 0;
      }

      function initBoard() {
        sGol.board = [];
        var row = [];
        for (var w = 0; w < sGol.width; w++) {
          row[w] = 0;
        }
        var q = Math.round(sGol.width / 4);
        row[q * 2] = 1;
        sGol.board.push(row);
      }

      function drawOnCanvas() {
        for (var i = sGol.lastDrawn; i < sGol.board.length; i++) {
          var row = sGol.board[i];
          for (var j = 0; j < row.length; j++) {
            if (sGol.board[i][j] == 1) {
              $scope.context.fillStyle = "black";
            } else {
              $scope.context.fillStyle = "white";
            }
            $scope.context.fillRect(sGol.gap + j * (sGol.size + 2 * sGol.gap), sGol.gap + i * (sGol.size + 2 * sGol.gap), sGol.size, sGol.size);
          }
          if (i < sGol.board.length - 1) {
            sGol.board[i] = [];
          }
        }
        sGol.lastDrawn = sGol.board.length - 1;
      }

      function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }

      function nextify() {
        if ($scope.currentRule != sGol.currentRule || !arraysEqual($scope.currentRule.ruleset, sGol.currentRule.ruleset)) {
          $scope.currentRule = sGol.currentRule;
        }

        computeNext();
        if (sGol.iter < 20 || sGol.iter % sGol.drawAt == 0) {
          drawOnCanvas();
        }
        sGol.iter++;
      }


      $scope.rule90 = function () {
        sGol = initInit();
        initBoard();
        sGol.currentRule = RULES.RULE90;
      };
      $scope.rule30 = function () {
        sGol = initInit();
        initBoard();
        sGol.currentRule = RULES.RULE30;
      };

      $scope.rule184 = function () {
        sGol = initInit();
        initBoard();
        sGol.currentRule = RULES.RULE184;
      };
      $scope.rule150 = function () {
        sGol = initInit();
        initBoard();
        sGol.currentRule = RULES.RULE150;
      };
      $scope.ruleNeat = function () {
        sGol = initInit();
        initBoard();
        sGol.currentRule = RULES.RULENEAT;
      };

    $scope.ruleWow = function () {
      sGol = initInit();
      initBoard();
      sGol.currentRule = RULES.RULEWOW;
    };
      $scope.ruleRandy = function () {
        sGol = initInit();
        initBoard();
        for (var i = 0; i < RULES.RULERANDY.ruleset.length; i++) {
          if (Math.random() < .5) {
            RULES.RULERANDY.ruleset[i] = 0;
          } else {
            RULES.RULERANDY.ruleset[i] = 1;
          }
        }
        sGol.currentRule = RULES.RULERANDY;


      };

      function initInit() {

        $window.resize;
      $scope.canvas = document.getElementById('board');
      var pix=1;
      var height = ($window.innerHeight-($window.innerHeight*0))/pix;//how to buffer naver bars?d
      height = height + (height % 2) + 1;
      // height =canvas.height;
      var width = $window.innerWidth/pix;
      width = width + (width % 2) + 1;
      sGol = CellBoardFactory.getParams(height, width, pix, 0);

      $scope.canvas.width = sGol.width * (sGol.size + 2 * sGol.gap);
      $scope.canvas.height = sGol.height * (sGol.size + 2 * sGol.gap);
      $scope.context = $scope.canvas.getContext("2d");
      $scope.context.fillStyle = "white";
      $scope.context.fillRect(0, 0, $scope.context.width, $scope.context.height);
      $scope.height = sGol.height;
      $scope.width = sGol.width;
      $scope.countable = 0;

        sGol.iter = 0;
        sGol.lastDrawn = 0;

        sGol.drawAt = 1;
        $scope.height = sGol.height;
        $scope.width = sGol.width;

        return sGol;

      }

      var RULES = {//auto buttonate these

        RULE90: {ruleset: [0, 1, 0, 1, 1, 0, 1, 0], name: "RULE90", code: "90"},
        RULE30: {ruleset: [0, 0, 0, 1, 1, 1, 1, 0], name: "RULE30", code: "30"},
        RULE184: {ruleset: [1, 0, 1, 1, 1, 0, 0, 0], name: "RULE184", code: "184"},
        RULE150: {ruleset: [1, 0, 0, 1, 0, 1, 1, 0], name: "RULE150", code: "150"},
        RULENEAT: {ruleset: [1, 0, 1, 0, 0, 1, 0, 1], name: "RULENEAT", code: "huh"},//auto to binary convert
        RULEWOW: {ruleset: [0, 1, 0, 0, 1, 0, 1, 1], name: "RULEWOW", code: "huh"},//auto to binary convert
        RULERANDY: {ruleset: [1, 0, 0, 1, 0, 1, 1, 0], name: "RULERANDY", code: "150"}


      };
      var sGol = new Object();
        sGol = initInit();

      $scope.rule90();
      $scope.currentRule = sGol.currentRule;
      $scope.clocky = 100;
      var clockIt = function () {
        var start = new Date().getTime();
        nextify();
        var end = new Date().getTime();
        var time = end - start;

        //auto optimize it
        if (time - $scope.clocky > 10) {
          $scope.clocky += 5;
        } else if ($scope.clocky - time > 10) {
          $scope.clocky -= 5;
        }
        $timeout(clockIt, $scope.clocky);

      };

      $timeout(clockIt, $scope.clocky);
    }
  )
;
