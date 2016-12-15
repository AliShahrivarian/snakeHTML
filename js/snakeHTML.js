(function () {
    this.snakeHTML = function () {

        var gameBoardElm,
            gameMenuElm,
            aboutModalElm,
            gameInterval,
            startCountDown = 3,
            startCountDownInterval,
            startCountDownElm,
            startCountDownWrapperElm,
            gameOverElm,
            gameSpeed = 1,
            gameIntervalTimer = 100,
            gameBoardSectionsSize = 10000,
            snakeDirection = "right",
            snakeBody = [],
            newSeedHomeIndex,
            counterToNextLevel = 10,
            gameScore = -1,
            gameScoreElm,
            isGamePaused = true,
            isGameOver = true,
            aboutGame = "snakeHTML V0.9b - copyright 2016<br/>Author: Ali Shahrivarian"
                + "<br/>E-Mail:<a href='mailto:ali.shahrivarian@gmail.com'>ali.shahrivarian@gmail.com</a>"
                + "<br/>LinkedIn:<a href='https://ir.linkedin.com/in/ali-shahrivarian-78a29084'>https://ir.linkedin.com/in/ali-shahrivarian-78a29084</a>";

        function init() {
            putMenu();
            createGameBoard();
            createGameOverElm();
            createStartCountDownElm();
            setGameBoardSize();
            bindEvents();
            resetGame();
        }

        function resetVariables() {
            gameSpeed = 1;
            gameIntervalTimer = 100;
            snakeDirection = "right";
            counterToNextLevel = 10;
            gameScore = -1;
            isGamePaused = true;
            resetScore();
        }

        function resetGame() {
            createSnake();
            produceSeed();
            run();
            togglePauseGame(true, true);
        }

        function createGameBoard() {
            var newDiv = document.createElement("div");
            newDiv.id = "snakeHTMLGameBoard";
            gameBoardElm = newDiv;
            for (var i = 0; i < gameBoardSectionsSize; i++) {
                var boardSection = document.createElement("div");
                boardSection.classList.add("gameBoardSections");
                buildWalls(i, boardSection);
                boardSection.setAttribute("b_index", i);
                newDiv.appendChild(boardSection);
            }
            document.body.appendChild(newDiv);
        }
        function createGameOverElm() {
            gameOverElm = document.createElement('div');
            gameOverElm.id = "snakeGameOver";
            gameOverElm.classList.add("hide");
            gameOverElm.innerText = "Game Over!";
            document.body.appendChild(gameOverElm);
        }
        function createStartCountDownElm() {
            startCountDownWrapperElm = document.createElement("div");
            startCountDownWrapperElm.id = "snakeStartCoundDown";
            startCountDownWrapperElm.classList.add("hide");
            startCountDownElm = document.createElement("span");
            startCountDownElm.id = "startCounterSpan";
            startCountDownElm.innerHTML = startCountDown;
            startCountDownWrapperElm.appendChild(startCountDownElm);
            var helps = document.createElement("div");
            helps.innerHTML += "<table><tbody>" +
                "<tr><td><span id='helpRightArrow' class='helpsIcon'></span></td><td><span>Turn Right</span></td></tr>" +
                "<tr><td><span id='helpLeftArrow' class='helpsIcon'></span></td><td><span>Turn Left</span></td></tr>" +
                "<tr><td><span id='helpUpArrow' class='helpsIcon'></span></td><td><span>Turn Up</span></td></tr>" +
                "<tr><td><span id='helpDownArrow' class='helpsIcon'></span></td><td><span>Turn Down</span></td></tr>" +
                "<tr><td><span id='helpPause' class='helpsIcon'>P</span></td><td><span>Pause</span></td></tr>" +
                "</tbody></table>";
            startCountDownWrapperElm.appendChild(helps);
            document.body.appendChild(startCountDownWrapperElm);
        }
        function buildWalls(index, elm) {
            if (index < 100 || index % 100 == 0 || index % 100 == 99 || index > 9900)
                elm.classList.add("wall");
        }
        function putMenu() {
            var menu = document.createElement("div");
            var btns = ["Pause", "Reset", "About"];
            menu.id = "snakeHTMLMenu";
            var btnPlace = document.createElement("div");
            for (var i = 0; i < btns.length; i++) {
                var btn = document.createElement("button");
                btn.innerText = btns[i];
                btn.setAttribute("name", btns[i]);
                btn.onclick = (function (type) {
                    return function (e) {
                        menuActions(type);
                    };
                })(btns[i]);
                btnPlace.appendChild(btn);
            }
            menu.appendChild(btnPlace);
            var scoreTitle = document.createElement("span");
            scoreTitle.innerText = "Score: ";
            scoreTitle.style.color = "white";
            menu.appendChild(scoreTitle);
            gameScoreElm = document.createElement("span");
            gameScoreElm.id = "snakeGameScore";
            gameScoreElm.style.color = "white";
            gameScoreElm.innerText = "0";
            menu.appendChild(gameScoreElm);
            document.body.appendChild(menu);
        }
        function menuActions(type) {
            switch (type) {
                case "Pause":
                    togglePauseGame();
                    break;
                case "Reset":
                    stop();
                    resetVariables();
                    resetGame();
                    break;
                case "About":
                    stop();
                    togglePauseGame(true);
                    about();
                    break;
                case "Contact":
                    break;
            }
        }
        function about() {
            if (aboutModalElm) {
                aboutModalElm.className = aboutModalElm.className.replace("hide", '');
                setAboutModalPosition();
            } else {
                aboutModalElm = document.createElement("div");
                aboutModalElm.id = "snakeHTMLAbout";
                var newP = document.createElement("p");
                newP.innerHTML = aboutGame;
                aboutModalElm.appendChild(newP);
                var backBtn = document.createElement("button");
                backBtn.innerText = "Back";
                backBtn.onclick = function (e) {
                    aboutModalElm.classList.add("hide");
                };
                aboutModalElm.appendChild(backBtn);
                document.body.appendChild(aboutModalElm);
                setAboutModalPosition();
            }
        }
        function addScore() {
            gameScoreElm.innerText = ++gameScore;
        }
        function resetScore() {
            gameScoreElm.innerText = 0;
            gameScore = -1;
        }
        function setAboutModalPosition() {
            var aboutModalWidth = parseInt(aboutModalElm.w)
            aboutModalElm.style.left = window.innerWidth < aboutModalElm.offsetWidth ?
                "0px" : ((window.innerWidth - aboutModalElm.offsetWidth) / 2) + "Px";
        }
        function togglePauseGame(justCheckNames, forceShowPause) {
            var pauseBtn = document.querySelector("#snakeHTMLMenu button[name='Pause']");

            if (justCheckNames) {
                pauseBtn.innerText = forceShowPause ? "Pause" : (isGamePaused ? "Resume" : "Pause");
                return;
            } else if (isGamePaused) {
                run();
                pauseBtn.innerText = "Pause";
            } else {
                stop();
                pauseBtn.innerText = "Resume";
            }
        }
        function setGameBoardSize() {
            var gameBoardWidthAndHeight = (window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth) * 0.9;
            gameBoardElm.style.width = gameBoardWidthAndHeight + "px";
            gameBoardElm.style.height = gameBoardWidthAndHeight + "px";
            gameBoardElm.style.left = ((window.innerWidth - gameBoardWidthAndHeight) / 2) + "px";
        }
        function createSnake() {
            for (var i = 0; i < snakeBody.length; i++) {
                snakeBody[i].className = snakeBody[i].className.replace("snake", "");
            }
            snakeBody = [];
            snakeBody.push(document.querySelector("div[b_index='101']"));
            snakeBody.push(document.querySelector("div[b_index='102']"));
            snakeBody.push(document.querySelector("div[b_index='103']"));
            snakeBody.push(document.querySelector("div[b_index='104']"));
            for (var i = 0; i < snakeBody.length; i++) {
                snakeBody[i].classList.add("snake");
            }
        }
        function bindEvents() {
            document.onkeyup = function (e) {
                if (isGameOver)
                    return;

                e = e || window.event;
                if (e.keyCode == '80')// p key
                    togglePauseGame();

                if (isGamePaused)
                    return;

                if (e.keyCode == '38') {
                    // up arrow
                    if (canChangeDirection("up"))
                        sMoveUp();
                }
                else if (e.keyCode == '40') {
                    // down arrow
                    if (canChangeDirection("down"))
                        sMoveDown();
                }
                else if (e.keyCode == '37') {
                    // left arrow
                    if (canChangeDirection("left"))
                        sMoveLeft();
                }
                else if (e.keyCode == '39') {
                    // right arrow
                    if (canChangeDirection("right"))
                        sMoveRight();
                }
            };
            window.onresize = function () {
                setGameBoardSize();
            };
        }
        function canChangeDirection(where) {
            var dirHist = "," + snakeDirection + where + ",";
            if (",rightleft,rightleft,rightright,leftleft,updown,downup,downdown,upup,".indexOf(dirHist) > -1)
                return false;
            return true;
        }
        function run() {
            function s() {
                window.clearInterval(startCountDownInterval);
                startCountDownWrapperElm.classList.add("hide");
                var resumePauseBtn = document.querySelector("button[name='Pause']");
                resumePauseBtn.className = resumePauseBtn.className.replace("hide", "");
                gameInterval = window.setInterval(function () {
                    isGamePaused = false;
                    if (snakeDirection == "right") {
                        sMoveRight();
                    } else if (snakeDirection == "left") {
                        sMoveLeft();
                    } else if (snakeDirection == "up") {
                        sMoveUp();
                    } else if (snakeDirection == "down") {
                        sMoveDown();
                    }
                }, gameSpeed * gameIntervalTimer);
            }
            if (isGameOver || startCountDown > 0) {
                isGameOver = false;
               startCountDownElm.innerText = startCountDown = 3;
                window.clearInterval(startCountDownInterval);
                document.getElementById("snakeGameOver").classList.add("hide");
                startCountDownWrapperElm.className = startCountDownWrapperElm.className.replace("hide", "");
                startCountDownInterval = window.setInterval(function () {
                    if (--startCountDown == 0) {
                        s();
                    }
                    startCountDownElm.innerText = startCountDown;
                }, 1000);
            } else {
                s();
            }
        }
        function changeLevel() {
            addSpeed();
            stop();
            run();
        }
        function stop() {
            window.clearTimeout(gameInterval);
            isGamePaused = true;
        }
        function sMoveRight() {
            var currentIndex = getSnakeHeadPlaceIndex();
            checkHits(currentIndex, "right");
            var currentHead = getSnakeHead();
            var newHeadIndex = currentIndex + 1;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            moveSnake(newHead, "right", newHeadIndex);
        }
        function sMoveLeft() {
            var currentIndex = getSnakeHeadPlaceIndex();
            checkHits(currentIndex, "left");
            var currentHead = getSnakeHead();
            var newHeadIndex = currentIndex - 1;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            moveSnake(newHead, "left", newHeadIndex);
        }
        function sMoveUp() {
            var currentIndex = getSnakeHeadPlaceIndex();
            checkHits(currentIndex, "up");
            var currentHead = getSnakeHead();
            var newHeadIndex = currentIndex - 100;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            moveSnake(newHead, "up", newHeadIndex);
        }
        function sMoveDown() {
            var currentIndex = getSnakeHeadPlaceIndex();
            checkHits(currentIndex, "down");
            var currentHead = getSnakeHead();
            var newHeadIndex = currentIndex + 100;
            var newHead = document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            moveSnake(newHead, "down", newHeadIndex);
        }
        function moveSnake(newHeadNode, where, headIndex) {
            snakeDirection = where;
            snakeBody.push(newHeadNode);
            snakeBody[0].className = snakeBody[0].className.replace("snake", "");
            if (!isSeedHome(headIndex)) {
                snakeBody.shift();
            } else {
                produceSeed();
            }
        }
        function isSeedHome(newHeadIndex) {
            return newHeadIndex == newSeedHomeIndex;
        }
        function produceSeed() {
            if (newSeedHomeIndex > -1) {
                var prevSeed = document.querySelector("div[b_index='" + newSeedHomeIndex + "']");
                prevSeed.className = prevSeed.className.replace("seed", "");
            }
            var ranSeeder = new Date().getMilliseconds();
            var randomIndex = parseInt(Math.random(ranSeeder) * 10000);
            var seedHome = document.querySelector("div[b_index='" + randomIndex + "']");
            var classNames = seedHome.className;
            if (classNames.indexOf("snake") > -1 || classNames.indexOf("wall") > -1) {
                return produceSeed();
            }
            seedHome.classList.add("seed");
            newSeedHomeIndex = randomIndex;
            addScore();
            if (--counterToNextLevel == 0) {
                counterToNextLevel = 10;
                changeLevel();
            }
        }
        function addSpeed() {
            var newSpeed = gameSpeed - 0.02;
            if (newSpeed > 0)
                gameSpeed = newSpeed;
        }
        function checkHits(index, where) {
            checkWallHitByClass(index, where);
            checkSelfHit(index, where);
        }
        function checkWallHitByClass(placeIndex, where) {
            var newIndex;
            switch (where) {
                case "right":
                    newIndex = (placeIndex + 1);
                    break;
                case "left":
                    newIndex = (placeIndex - 1);
                    break;
                case "up":
                    newIndex = placeIndex - 100;
                    break;
                case "down":
                    newIndex = placeIndex + 100;
                    break;
            }
            if (document.querySelector("div[b_index='" + newIndex + "']").className.indexOf("wall") > -1) {
                gameOver();
            }
        }
        function checkSelfHit(placeIndex, where) {
            var isHitted = false;
            switch (where) {
                case "right":
                    isHitted = isNewPlaceInSnakeBody(placeIndex + 1);
                    break;
                case "left":
                    isHitted = isNewPlaceInSnakeBody(placeIndex - 1);
                    break;
                case "up":
                    isHitted = isNewPlaceInSnakeBody(placeIndex - 100);
                    break;
                case "down":
                    isHitted = isNewPlaceInSnakeBody(placeIndex + 100);
                    break;
            }
            if (isHitted) {
                gameOver();
            }
        }
        function isNewPlaceInSnakeBody(newPlaceIndex) {
            return document
                .querySelector("div[b_index='" + newPlaceIndex + "']")
                .className.indexOf("snake") > -1;
        }
        function getSnakeHeadPlaceIndex() {
            return parseInt(snakeBody[snakeBody.length - 1].getAttribute("b_index"));
        }
        function getSnakeHead() {
            return snakeBody[snakeBody.length - 1];
        }
        function getSnakeTailIndex(snakeLength, snakeCurrentIndex) {
            snakeLength = snakeLength ? snakeLength : getSnakeLength();
            snakeCurrentIndex = snakeCurrentIndex > -1 ? snakeCurrentIndex : getSnakeHeadPlaceIndex;
            return snakeCurrentIndex - snakeLength + 1;
        }
        function getSnakeLength() {
            return snakeBody.length;
        }
        function gameOver() {
            isGameOver = true;
            document.querySelector("button[name='Pause']").classList.add("hide");
            stop();
            var gameOverElm = document.getElementById("snakeGameOver");
            gameOverElm.className = gameOverElm.className.replace("hide", "");
        }
        return {
            init: init
        };
    };
})();
