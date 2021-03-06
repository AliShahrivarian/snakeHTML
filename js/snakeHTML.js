var HTMLGame;
(function (HTMLGame) {
    var directions;
    (function (directions) {
        directions[directions["right"] = 39] = "right";
        directions[directions["left"] = 37] = "left";
        directions[directions["up"] = 38] = "up";
        directions[directions["down"] = 40] = "down";
    })(directions || (directions = {}));
    var SnakeHTML = (function () {
        function SnakeHTML() {
            this.startCountDown = 3;
            this.gameSpeed = 1;
            this.gameIntervalTimer = 100;
            this.gameBoardSectionsSize = 10000;
            this.snakeDirection = directions.right;
            this.snakeBody = [];
            this.counterToNextLevel = 10;
            this.gameScore = -1;
            this.isGamePaused = true;
            this.isGameOver = true;
            this.aboutGame = "snakeHTML V0.9b<br/>Author: Ali Shahrivarian"
                + "<br/>E-Mail:<a href='mailto:ali.shahrivarian@gmail.com'>ali.shahrivarian@gmail.com</a>"
                + "<br/>LinkedIn:<a href='https://ir.linkedin.com/in/ali-shahrivarian-78a29084'>https://ir.linkedin.com/in/ali-shahrivarian-78a29084</a>";
        }
        SnakeHTML.prototype.init = function () {
            this.putMenu();
            this.createGameBoard();
            this.createGameOverElm();
            this.createStartCountDownElm();
            this.setGameBoardSize();
            this.bindEvents();
            this.resetGame();
        };
        SnakeHTML.prototype.resetGame = function () {
            this.createSnake();
            this.produceSeed();
            this.run();
            this.togglePauseGame(true, true);
        };
        SnakeHTML.prototype.createGameBoard = function () {
            var newDiv = document.createElement("div");
            newDiv.id = "snakeHTMLGameBoard";
            this.gameBoardElm = newDiv;
            for (var i = 0; i < this.gameBoardSectionsSize; i++) {
                var boardSection = document.createElement("div");
                boardSection.classList.add("gameBoardSections");
                this.buildWalls(i, boardSection);
                boardSection.setAttribute("b_index", i.toString());
                newDiv.appendChild(boardSection);
            }
            document.body.appendChild(newDiv);
        };
        SnakeHTML.prototype.createGameOverElm = function () {
            this.gameOverElm = document.createElement('div');
            this.gameOverElm.id = "snakeGameOver";
            this.gameOverElm.classList.add("hide");
            this.gameOverElm.innerText = "Game Over!";
            document.body.appendChild(this.gameOverElm);
        };
        SnakeHTML.prototype.createStartCountDownElm = function () {
            this.startCountDownWrapperElm = document.createElement("div");
            this.startCountDownWrapperElm.id = "snakeStartCoundDown";
            this.startCountDownWrapperElm.classList.add("hide");
            this.startCountDownElm = document.createElement("span");
            this.startCountDownElm.id = "startCounterSpan";
            this.startCountDownElm.innerHTML = this.startCountDown.toString();
            this.startCountDownWrapperElm.appendChild(this.startCountDownElm);
            var helps = document.createElement("div");
            helps.innerHTML += "<table><tbody>" +
                "<tr><td><span id='helpRightArrow' class='helpsIcon'></span></td><td><span>Turn Right</span></td></tr>" +
                "<tr><td><span id='helpLeftArrow' class='helpsIcon'></span></td><td><span>Turn Left</span></td></tr>" +
                "<tr><td><span id='helpUpArrow' class='helpsIcon'></span></td><td><span>Turn Up</span></td></tr>" +
                "<tr><td><span id='helpDownArrow' class='helpsIcon'></span></td><td><span>Turn Down</span></td></tr>" +
                "<tr><td><span id='helpPause' class='helpsIcon'>P</span></td><td><span>Pause</span></td></tr>" +
                "</tbody></table>";
            this.startCountDownWrapperElm.appendChild(helps);
            document.body.appendChild(this.startCountDownWrapperElm);
        };
        SnakeHTML.prototype.buildWalls = function (index, elm) {
            if (index < 100 || index % 100 == 0 || index % 100 == 99 || index > 9900)
                elm.classList.add("wall");
        };
        SnakeHTML.prototype.putMenu = function () {
            var menu = document.createElement("div");
            var btns = ["Pause", "Reset", "About"];
            menu.id = "snakeHTMLMenu";
            var thisClass = this;
            var btnPlace = document.createElement("div");
            for (var i = 0; i < btns.length; i++) {
                var btn = document.createElement("button");
                btn.innerText = btns[i];
                btn.setAttribute("name", btns[i]);
                btn.onclick = (function (type) {
                    return function (e) {
                        thisClass.menuActions(type);
                    };
                })(btns[i]);
                btnPlace.appendChild(btn);
            }
            menu.appendChild(btnPlace);
            var scoreTitle = document.createElement("span");
            scoreTitle.innerText = "Score: ";
            scoreTitle.style.color = "white";
            menu.appendChild(scoreTitle);
            this.gameScoreElm = document.createElement("span");
            this.gameScoreElm.id = "snakeGameScore";
            this.gameScoreElm.style.color = "white";
            this.gameScoreElm.innerText = "0";
            menu.appendChild(this.gameScoreElm);
            document.body.appendChild(menu);
        };
        SnakeHTML.prototype.menuActions = function (type) {
            switch (type) {
                case "Pause":
                    this.togglePauseGame();
                    break;
                case "Reset":
                    this.stop();
                    this.resetVariables();
                    this.resetGame();
                    break;
                case "About":
                    this.stop();
                    this.togglePauseGame(true);
                    this.about();
                    break;
                case "Contact":
                    break;
            }
        };
        SnakeHTML.prototype.resetVariables = function () {
            this.gameSpeed = 1;
            this.gameIntervalTimer = 100;
            this.snakeDirection = directions.right;
            this.counterToNextLevel = 10;
            this.gameScore = -1;
            this.isGamePaused = true;
            this.resetScore();
        };
        SnakeHTML.prototype.about = function () {
            if (this.aboutModalElm) {
                this.aboutModalElm.className = this.aboutModalElm.className.replace("hide", '');
                this.setAboutModalPosition();
            }
            else {
                this.aboutModalElm = document.createElement("div");
                this.aboutModalElm.id = "snakeHTMLAbout";
                var newP = document.createElement("p");
                newP.innerHTML = this.aboutGame;
                this.aboutModalElm.appendChild(newP);
                var backBtn = document.createElement("button");
                backBtn.innerText = "Back";
                var thisClass_1 = this;
                backBtn.onclick = function (e) {
                    thisClass_1.aboutModalElm.classList.add("hide");
                };
                this.aboutModalElm.appendChild(backBtn);
                document.body.appendChild(this.aboutModalElm);
                this.setAboutModalPosition();
            }
        };
        SnakeHTML.prototype.addScore = function () {
            this.gameScoreElm.innerText = (++this.gameScore).toString();
        };
        SnakeHTML.prototype.resetScore = function () {
            this.gameScoreElm.innerText = "0";
            this.gameScore = -1;
        };
        SnakeHTML.prototype.setAboutModalPosition = function () {
            this.aboutModalElm.style.left = window.innerWidth < this.aboutModalElm.offsetWidth ?
                "0px" : ((window.innerWidth - this.aboutModalElm.offsetWidth) / 2) + "Px";
        };
        SnakeHTML.prototype.togglePauseGame = function (justCheckNames, forceShowPause) {
            var pauseBtn = document.querySelector("#snakeHTMLMenu button[name='Pause']");
            if (justCheckNames) {
                pauseBtn.innerHTML = forceShowPause ? "Pause" : (this.isGamePaused ? "Resume" : "Pause");
                return;
            }
            else if (this.isGamePaused) {
                this.run();
                pauseBtn.innerHTML = "Pause";
            }
            else {
                this.stop();
                pauseBtn.innerHTML = "Resume";
            }
        };
        SnakeHTML.prototype.setGameBoardSize = function () {
            var gameBoardWidthAndHeight = (window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth) * 0.9;
            this.gameBoardElm.style.width = gameBoardWidthAndHeight + "px";
            this.gameBoardElm.style.height = gameBoardWidthAndHeight + "px";
            this.gameBoardElm.style.left = ((window.innerWidth - gameBoardWidthAndHeight) / 2) + "px";
        };
        SnakeHTML.prototype.createSnake = function () {
            for (var i = 0; i < this.snakeBody.length; i++) {
                this.snakeBody[i].className = this.snakeBody[i].className.replace("snake", "");
            }
            this.snakeBody = [];
            this.snakeBody.push(document.querySelector("div[b_index='101']"));
            this.snakeBody.push(document.querySelector("div[b_index='102']"));
            this.snakeBody.push(document.querySelector("div[b_index='103']"));
            this.snakeBody.push(document.querySelector("div[b_index='104']"));
            for (var i = 0; i < this.snakeBody.length; i++) {
                this.snakeBody[i].classList.add("snake");
            }
        };
        SnakeHTML.prototype.bindEvents = function () {
            var thisClass = this;
            document.onkeyup = function (e) {
                if (thisClass.isGameOver)
                    return;
                e = e || window.event;
                if (e.keyCode == '80')
                    thisClass.togglePauseGame();
                if (thisClass.isGamePaused)
                    return;
                if (e.keyCode == directions.up) {
                    // up arrow
                    if (thisClass.canChangeDirection("up"))
                        thisClass.sMoveUp();
                }
                else if (e.keyCode == directions.down) {
                    // down arrow
                    if (thisClass.canChangeDirection("down"))
                        thisClass.sMoveDown();
                }
                else if (e.keyCode == directions.left) {
                    // left arrow
                    if (thisClass.canChangeDirection("left"))
                        thisClass.sMoveLeft();
                }
                else if (e.keyCode == directions.right) {
                    // right arrow
                    if (thisClass.canChangeDirection("left"))
                        thisClass.sMoveRight();
                }
            };
            window.onresize = function () {
                thisClass.setGameBoardSize();
            };
        };
        SnakeHTML.prototype.canChangeDirection = function (where) {
            var dirHist = "," + this.snakeDirection + where + ",";
            if (",rightleft,rightleft,rightright,leftleft,updown,downup,downdown,upup,".indexOf(dirHist) > -1)
                return false;
            return true;
        };
        SnakeHTML.prototype.run = function () {
            var thisClass = this;
            function s() {
                window.clearInterval(this.startCountDownInterval);
                thisClass.startCountDownWrapperElm.classList.add("hide");
                var resumePauseBtn = document.querySelector("button[name='Pause']");
                resumePauseBtn.className = resumePauseBtn.className.replace("hide", "");
                thisClass.gameInterval = window.setInterval(function () {
                    thisClass.isGamePaused = false;
                    if (thisClass.snakeDirection == directions.right) {
                        thisClass.sMoveRight();
                    }
                    else if (thisClass.snakeDirection == directions.left) {
                        thisClass.sMoveLeft();
                    }
                    else if (thisClass.snakeDirection == directions.up) {
                        thisClass.sMoveUp();
                    }
                    else if (thisClass.snakeDirection == directions.down) {
                        thisClass.sMoveDown();
                    }
                }, thisClass.gameSpeed * thisClass.gameIntervalTimer);
            }
            if (this.isGameOver || this.startCountDown > 0) {
                this.isGameOver = false;
                this.startCountDownElm.innerText = (this.startCountDown = 3).toString();
                window.clearInterval(this.startCountDownInterval);
                document.getElementById("snakeGameOver").classList.add("hide");
                this.startCountDownWrapperElm.className = this.startCountDownWrapperElm.className.replace("hide", "");
                this.startCountDownInterval = window.setInterval(function () {
                    if (--thisClass.startCountDown == 0) {
                        s();
                    }
                    thisClass.startCountDownElm.innerText = thisClass.startCountDown.toString();
                }, 1000);
            }
            else {
                s();
            }
        };
        SnakeHTML.prototype.changeLevel = function () {
            this.addSpeed();
            this.stop();
            this.run();
        };
        SnakeHTML.prototype.stop = function () {
            window.clearTimeout(this.gameInterval);
            this.isGamePaused = true;
        };
        SnakeHTML.prototype.sMoveRight = function () {
            var currentIndex = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.right);
            var currentHead = this.getSnakeHead();
            var newHeadIndex = currentIndex + 1;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.right, newHeadIndex);
        };
        SnakeHTML.prototype.sMoveLeft = function () {
            var currentIndex = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.left);
            var currentHead = this.getSnakeHead();
            var newHeadIndex = currentIndex - 1;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.left, newHeadIndex);
        };
        SnakeHTML.prototype.sMoveUp = function () {
            var currentIndex = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.up);
            var currentHead = this.getSnakeHead();
            var newHeadIndex = currentIndex - 100;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.up, newHeadIndex);
        };
        SnakeHTML.prototype.sMoveDown = function () {
            var currentIndex = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.down);
            var currentHead = this.getSnakeHead();
            var newHeadIndex = currentIndex + 100;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.down, newHeadIndex);
        };
        SnakeHTML.prototype.moveSnake = function (newHeadElm, where, headIndex) {
            this.snakeDirection = where;
            this.snakeBody.push(newHeadElm);
            this.snakeBody[0].className = this.snakeBody[0].className.replace("snake", "");
            if (!this.isSeedHome(headIndex)) {
                this.snakeBody.shift();
            }
            else {
                this.produceSeed();
            }
        };
        SnakeHTML.prototype.isSeedHome = function (newHeadIndex) {
            return newHeadIndex == this.newSeedHomeIndex;
        };
        SnakeHTML.prototype.produceSeed = function () {
            if (this.newSeedHomeIndex > -1) {
                var prevSeed = document.querySelector("div[b_index='" + this.newSeedHomeIndex + "']");
                prevSeed.className = prevSeed.className.replace("seed", "");
            }
            var randomIndex = parseInt((Math.random() * 10000).toString());
            var seedHome = document.querySelector("div[b_index='" + randomIndex + "']");
            var classNames = seedHome.className;
            if (classNames.indexOf("snake") > -1 || classNames.indexOf("wall") > -1) {
                return this.produceSeed();
            }
            seedHome.classList.add("seed");
            this.newSeedHomeIndex = randomIndex;
            this.addScore();
            if (--this.counterToNextLevel == 0) {
                this.counterToNextLevel = 10;
                this.changeLevel();
            }
        };
        SnakeHTML.prototype.addSpeed = function () {
            var newSpeed = this.gameSpeed - 0.02;
            if (newSpeed > 0)
                this.gameSpeed = newSpeed;
        };
        SnakeHTML.prototype.checkHits = function (index, where) {
            this.checkWallHitByClass(index, where);
            this.checkSelfHit(index, where);
        };
        SnakeHTML.prototype.checkWallHitByClass = function (placeIndex, where) {
            var newIndex;
            switch (where) {
                case directions.right:
                    newIndex = (placeIndex + 1);
                    break;
                case directions.left:
                    newIndex = (placeIndex - 1);
                    break;
                case directions.up:
                    newIndex = placeIndex - 100;
                    break;
                case directions.down:
                    newIndex = placeIndex + 100;
                    break;
            }
            if (document.querySelector("div[b_index='" + newIndex + "']").className.indexOf("wall") > -1) {
                this.gameOver();
            }
        };
        SnakeHTML.prototype.checkSelfHit = function (placeIndex, where) {
            var isHitted = false;
            switch (where) {
                case directions.right:
                    isHitted = this.isNewPlaceInSnakeBody(placeIndex + 1);
                    break;
                case directions.left:
                    isHitted = this.isNewPlaceInSnakeBody(placeIndex - 1);
                    break;
                case directions.up:
                    isHitted = this.isNewPlaceInSnakeBody(placeIndex - 100);
                    break;
                case directions.down:
                    isHitted = this.isNewPlaceInSnakeBody(placeIndex + 100);
                    break;
            }
            if (isHitted) {
                this.gameOver();
            }
        };
        SnakeHTML.prototype.isNewPlaceInSnakeBody = function (newPlaceIndex) {
            return document
                .querySelector("div[b_index='" + newPlaceIndex + "']")
                .className.indexOf("snake") > -1;
        };
        SnakeHTML.prototype.getSnakeHeadPlaceIndex = function () {
            return parseInt(this.snakeBody[this.snakeBody.length - 1].getAttribute("b_index"));
        };
        SnakeHTML.prototype.getSnakeHead = function () {
            return this.snakeBody[this.snakeBody.length - 1];
        };
        SnakeHTML.prototype.getSnakeLength = function () {
            return this.snakeBody.length;
        };
        SnakeHTML.prototype.gameOver = function () {
            this.isGameOver = true;
            document.querySelector("button[name='Pause']").classList.add("hide");
            this.stop();
            var gameOverElm = document.getElementById("snakeGameOver");
            gameOverElm.className = gameOverElm.className.replace("hide", "");
        };
        return SnakeHTML;
    }());
    HTMLGame.SnakeHTML = SnakeHTML;
})(HTMLGame || (HTMLGame = {}));
