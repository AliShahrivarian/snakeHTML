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
            aboutGame = "snakeHTML V0.9b<br/>Author: Ali Shahrivarian"
                + "<br/>E-Mail:<a href='mailto:ali.shahrivarian@gmail.com'>ali.shahrivarian@gmail.com</a>"
                + "<br/>LinkedIn:<a href='https://ir.linkedin.com/in/ali-shahrivarian-78a29084'>https://ir.linkedin.com/in/ali-shahrivarian-78a29084</a>",
            touchEnabled = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)), //http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
            touchWrapperElm;
        function init() {
            putMenu();
            createGameBoard();
            createGameOverElm();
            createStartCountDownElm();
            setGameBoardSize();
            initTouch();
            bindEvents();
            resetGame();
        }

        function initTouch() {
            if (touchEnabled)
                createTouch();
        }

        function createTouch() {
            touchWrapperElm = document.createElement("div");
            touchWrapperElm.id = "gameTouchWrapper";
            var rightBtn = document.createElement("div");
            rightBtn.id = "rightTouch";
            rightBtn.onclick = touchRightHandler;
            var rightArrow = document.createElement("span");
            rightBtn.appendChild(rightArrow);
            var leftBtn = document.createElement("div");
            leftBtn.id = "leftTouch";
            leftBtn.onclick = touchLeftHandler;
            var leftArrow = document.createElement("span");
            leftBtn.appendChild(leftArrow);
            touchWrapperElm.appendChild(rightBtn);
            touchWrapperElm.appendChild(leftBtn);
            document.body.appendChild(touchWrapperElm);
        }
        function setTouchBtnsSize() {
            if (window.innerHeight > window.innerWidth) {
                touchWrapperElm.style.bottom = "0px";
            } else {
                touchWrapperElm.style.bottom = "10%";
            }
        }
        function touchRightHandler(e) {
            if (snakeDirection == "up") {
                sMoveRight();
            } else if (snakeDirection == "down") {
                sMoveLeft();
            } else if (snakeDirection == "right") {
                sMoveDown();
            } else if (snakeDirection == "left") {
                sMoveUp();
            }
        }
        function touchLeftHandler(e) {
            if (snakeDirection == "up") {
                sMoveLeft();
            } else if (snakeDirection == "down") {
                sMoveRight();
            } else if (snakeDirection == "right") {
                sMoveUp();
            } else if (snakeDirection == "left") {
                sMoveDown();
            }
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
            if (touchEnabled)
                helps.innerHTML += "<table><tbody>" +
                    "<tr><td><span id='helpRightArrow' class='helpsIcon'></span></td><td><span>Turn Snake to its right</span></td></tr>" +
                    "<tr><td><span id='helpLeftArrow' class='helpsIcon'></span></td><td><span>Turn snake to its left</span></td></tr>" +
                    "</tbody></table>";
            else
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
                if (touchEnabled) {
                    setTouchBtnsSize();
                }
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
