/**
 * Created by Kitty on 4/2/16.
 */



angular.module('newScience')
    .controller('RuleCtrl', function($scope, $timeout, $window, $ionicPopover, CellBoardFactory) {

        $ionicPopover.fromTemplateUrl('popall.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });


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
            else if (a == 1 && b == 1 && c === 0) return ruleset[1];
            else if (a == 1 && b === 0 && c == 1) return ruleset[2];
            else if (a == 1 && b === 0 && c === 0) return ruleset[3];
            else if (a === 0 && b == 1 && c == 1) return ruleset[4];
            else if (a === 0 && b == 1 && c === 0) return ruleset[5];
            else if (a === 0 && b === 0 && c == 1) return ruleset[6];
            else if (a === 0 && b === 0 && c === 0) return ruleset[7];
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
            if (a === null || b === null) return false;
            if (a.length != b.length) return false;
            for (var i = 0; i < a.length; ++i) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        }

        function nextify() {
            if ($scope.currentRule.code != $scope.ruleIndex) {
                sGol = initInit();
                initBoard();
                sGol.currentRule = $scope.rules[$scope.ruleIndex];
                $scope.currentRule = sGol.currentRule;

            }

            computeNext();
            if (sGol.iter < 20 || sGol.iter % sGol.drawAt === 0) {
                drawOnCanvas();
            }
            sGol.iter++;
        }

        function getRules() {
            var bitshifts = [];
            for (var i = 0; i < 256; i++) { //8 bit max
                var b = [];
                for (var j = 0; j < 8; j++) {
                    b[7 - j] = (i >> j) & 1;   // what does this do? ? (something about 01011101)...?
                  // http://www.c-point.com/javascript_tutorial/jsoprrshift.htm
                  // http://stackoverflow.com/questions/7310109/whats-the-difference-between-and-in-javascript
                }
                bitshifts.push(b);
                // console.log(b + "\t" + i)
            }
            return bitshifts;
        }

        $scope.toggleIter = function() {
            if ($scope.iterate) {
                $scope.iterate = false;
            } else {
                $scope.iterate = true;
                $timeout(clockIt, $scope.clocky);
            }
        };
        $scope.isIterate = function() {
            return $scope.iterate;
        };

        $scope.setIndex = function(ruleIndex) {
            $scope.ruleIndex = ruleIndex;
            $timeout(clockIt, $scope.clocky);
        };
        $scope.setFavRules =function(){
            $scope.currentRules = $scope.favRules;
            $scope.ruleHeader ="Some Favorites";
        };
        $scope.setAllRules =function(){
            $scope.currentRules = $scope.rules;
            $scope.ruleHeader ="More";
        };


        function initInit() {

            // $window.resize();
            $scope.canvas = document.getElementById('board');
            var pix = 1;
            var height = ($window.innerHeight - ($window.innerHeight * 0)) / pix; //how to buffer naver bars?d
            var width = 2 * $window.innerWidth / pix;
            height = width;
            height = Math.min(height, width) / 2;
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
        $scope.rules = [];
        $scope.favRules =[];

        var bitshit = getRules();

        for (var i = 0; i < bitshit.length; i++) {
            var rule = new Object();
            rule.ruleset = bitshit[i];
            rule.name = "Rule " + i;
            rule.code = i;
            $scope.rules.push(rule);
            if(i==30||i==45||i==90||i==73||i==105||i==110||i==126||i==149){
               $scope.favRules.push(rule); 
            }
        }
        $scope.currentRules = $scope.rules;
        $scope.ruleHeader ="More";
        $scope.ruleIndex = 30;
        $scope.iterate = false;
        var sGol = new Object();
        sGol = initInit();
        initBoard();
        sGol.currentRule = $scope.rules[$scope.ruleIndex];
        $scope.currentRule = sGol.currentRule;
        $scope.clocky = 0;
        var clockIt = function() {
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

            if (sGol.iter <= sGol.height) {
                $timeout(clockIt, $scope.clocky);

            } else {
                if (!$scope.iterate) {
                    $timeout.cancel(clockIt);
                } else {
                    if ($scope.ruleIndex < 254) {
                        $scope.ruleIndex++;
                    } else {
                        $scope.ruleIndex = 0;
                    }
                    $timeout(clockIt, $scope.clocky);

                }
            }
        };
        var mon = $timeout(clockIt, $scope.clocky);
    });
