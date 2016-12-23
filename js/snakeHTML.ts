namespace HTMLGame {
    enum directions {
        right = 39,
        left = 37,
        up = 38,
        down = 40
    }
    export class SnakeHTML {
        private gameBoardElm: HTMLElement;
        private gameMenuElm: HTMLElement;
        private aboutModalElm: HTMLElement;
        private gameInterval: number;
        private startCountDown: number = 3;
        private startCountDownInterval: number;
        private startCountDownElm: HTMLElement;
        private startCountDownWrapperElm: HTMLElement;
        private gameOverElm: HTMLElement;
        private gameSpeed: number = 1;
        private gameIntervalTimer: number = 100;
        private gameBoardSectionsSize: number = 10000;
        private snakeDirection: directions = directions.right;
        private snakeBody: HTMLElement[] = [];
        private newSeedHomeIndex: number;
        private counterToNextLevel: number = 10;
        private gameScore: number = -1;
        private gameScoreElm: HTMLElement;
        private isGamePaused = true;
        private isGameOver = true;
        private aboutGame = "snakeHTML V0.9b<br/>Author: Ali Shahrivarian"
        + "<br/>E-Mail:<a href='mailto:ali.shahrivarian@gmail.com'>ali.shahrivarian@gmail.com</a>"
        + "<br/>LinkedIn:<a href='https://ir.linkedin.com/in/ali-shahrivarian-78a29084'>https://ir.linkedin.com/in/ali-shahrivarian-78a29084</a>";

        constructor() {
        }
        init(): void {
            this.putMenu();
            this.createGameBoard();
            this.createGameOverElm();
            this.createStartCountDownElm();
            this.setGameBoardSize();
            this.bindEvents();
            this.resetGame();
        }
        resetGame(): void {
            this.createSnake();
            this.produceSeed();
            this.run();
            this.togglePauseGame(true, true);
        }
        createGameBoard(): void {
            let newDiv = document.createElement("div");
            newDiv.id = "snakeHTMLGameBoard";
            this.gameBoardElm = newDiv;
            for (let i = 0; i < this.gameBoardSectionsSize; i++) {
                let boardSection = document.createElement("div");
                boardSection.classList.add("gameBoardSections");
                this.buildWalls(i, boardSection);
                boardSection.setAttribute("b_index", i.toString());
                newDiv.appendChild(boardSection);
            }
            document.body.appendChild(newDiv);
        }
        createGameOverElm(): void {
            this.gameOverElm = document.createElement('div');
            this.gameOverElm.id = "snakeGameOver";
            this.gameOverElm.classList.add("hide");
            this.gameOverElm.innerText = "Game Over!";
            document.body.appendChild(this.gameOverElm);
        }
        createStartCountDownElm(): void {
            this.startCountDownWrapperElm = document.createElement("div");
            this.startCountDownWrapperElm.id = "snakeStartCoundDown";
            this.startCountDownWrapperElm.classList.add("hide");
            this.startCountDownElm = document.createElement("span");
            this.startCountDownElm.id = "startCounterSpan";
            this.startCountDownElm.innerHTML = this.startCountDown.toString();
            this.startCountDownWrapperElm.appendChild(this.startCountDownElm);
            let helps = document.createElement("div");
            helps.innerHTML += "<table><tbody>" +
                "<tr><td><span id='helpRightArrow' class='helpsIcon'></span></td><td><span>Turn Right</span></td></tr>" +
                "<tr><td><span id='helpLeftArrow' class='helpsIcon'></span></td><td><span>Turn Left</span></td></tr>" +
                "<tr><td><span id='helpUpArrow' class='helpsIcon'></span></td><td><span>Turn Up</span></td></tr>" +
                "<tr><td><span id='helpDownArrow' class='helpsIcon'></span></td><td><span>Turn Down</span></td></tr>" +
                "<tr><td><span id='helpPause' class='helpsIcon'>P</span></td><td><span>Pause</span></td></tr>" +
                "</tbody></table>";
            this.startCountDownWrapperElm.appendChild(helps);
            document.body.appendChild(this.startCountDownWrapperElm);
        }
        buildWalls(index: number, elm: HTMLElement): void {
            if (index < 100 || index % 100 == 0 || index % 100 == 99 || index > 9900)
                elm.classList.add("wall");
        }
        putMenu(): void {
            let menu = document.createElement("div");
            let btns = ["Pause", "Reset", "About"];
            menu.id = "snakeHTMLMenu";
            let thisClass = this;
            let btnPlace = document.createElement("div");
            for (let i = 0; i < btns.length; i++) {
                let btn = document.createElement("button");
                btn.innerText = btns[i];
                btn.setAttribute("name", btns[i]);
                btn.onclick = (function (type: string) {
                    return function (e: MouseEvent) {
                        thisClass.menuActions(type);
                    };
                })(btns[i]);
                btnPlace.appendChild(btn);
            }
            menu.appendChild(btnPlace);
            let scoreTitle = document.createElement("span");
            scoreTitle.innerText = "Score: ";
            scoreTitle.style.color = "white";
            menu.appendChild(scoreTitle);
            this.gameScoreElm = document.createElement("span");
            this.gameScoreElm.id = "snakeGameScore";
            this.gameScoreElm.style.color = "white";
            this.gameScoreElm.innerText = "0";
            menu.appendChild(this.gameScoreElm);
            document.body.appendChild(menu);
        }
        menuActions(type: string): void {
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
        }

        resetVariables(): void {
            this.gameSpeed = 1;
            this.gameIntervalTimer = 100;
            this.snakeDirection = directions.right;
            this.counterToNextLevel = 10;
            this.gameScore = -1;
            this.isGamePaused = true;
            this.resetScore();
        }

        about(): void {
            if (this.aboutModalElm) {
                this.aboutModalElm.className = this.aboutModalElm.className.replace("hide", '');
                this.setAboutModalPosition();
            } else {
                this.aboutModalElm = document.createElement("div");
                this.aboutModalElm.id = "snakeHTMLAbout";
                let newP = document.createElement("p");
                newP.innerHTML = this.aboutGame;
                this.aboutModalElm.appendChild(newP);
                let backBtn = document.createElement("button");
                backBtn.innerText = "Back";
                let thisClass = this;
                backBtn.onclick = function (e: MouseEvent) {
                    thisClass.aboutModalElm.classList.add("hide");
                };
                this.aboutModalElm.appendChild(backBtn);
                document.body.appendChild(this.aboutModalElm);
                this.setAboutModalPosition();
            }
        }
        addScore(): void {
            this.gameScoreElm.innerText = (++this.gameScore).toString();
        }
        resetScore(): void {
            this.gameScoreElm.innerText = "0";
            this.gameScore = -1;
        }
        setAboutModalPosition(): void {
            this.aboutModalElm.style.left = window.innerWidth < this.aboutModalElm.offsetWidth ?
                "0px" : ((window.innerWidth - this.aboutModalElm.offsetWidth) / 2) + "Px";
        }
        togglePauseGame(justCheckNames?: boolean, forceShowPause?: boolean) {
            let pauseBtn: Element = document.querySelector("#snakeHTMLMenu button[name='Pause']");
            if (justCheckNames) {
                pauseBtn.innerHTML = forceShowPause ? "Pause" : (this.isGamePaused ? "Resume" : "Pause");
                return;
            } else if (this.isGamePaused) {
                this.run();
                pauseBtn.innerHTML = "Pause";
            } else {
                this.stop();
                pauseBtn.innerHTML = "Resume";
            }
        }
        setGameBoardSize() {
            let gameBoardWidthAndHeight = (window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth) * 0.9;
            this.gameBoardElm.style.width = gameBoardWidthAndHeight + "px";
            this.gameBoardElm.style.height = gameBoardWidthAndHeight + "px";
            this.gameBoardElm.style.left = ((window.innerWidth - gameBoardWidthAndHeight) / 2) + "px";
        }
        createSnake() {
            for (let i = 0; i < this.snakeBody.length; i++) {
                this.snakeBody[i].className = this.snakeBody[i].className.replace("snake", "");
            }
            this.snakeBody = [];
            this.snakeBody.push(<HTMLElement>document.querySelector("div[b_index='101']"));
            this.snakeBody.push(<HTMLElement>document.querySelector("div[b_index='102']"));
            this.snakeBody.push(<HTMLElement>document.querySelector("div[b_index='103']"));
            this.snakeBody.push(<HTMLElement>document.querySelector("div[b_index='104']"));
            for (let i = 0; i < this.snakeBody.length; i++) {
                this.snakeBody[i].classList.add("snake");
            }
        }
        bindEvents(): void {
            let thisClass = this;
            document.onkeyup = function (e: any) {
                if (thisClass.isGameOver)
                    return;

                e = e || window.event;


                if (e.keyCode == '80')// p key
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
        }
        canChangeDirection(where: string): boolean {
            let dirHist = "," + this.snakeDirection + where + ",";
            if (",rightleft,rightleft,rightright,leftleft,updown,downup,downdown,upup,".indexOf(dirHist) > -1)
                return false;
            return true;
        }
        run(): void {
            let thisClass = this;
            function s(): void {
                window.clearInterval(this.startCountDownInterval);
                thisClass.startCountDownWrapperElm.classList.add("hide");
                let resumePauseBtn = document.querySelector("button[name='Pause']");
                resumePauseBtn.className = resumePauseBtn.className.replace("hide", "");
                thisClass.gameInterval = window.setInterval(function () {
                    thisClass.isGamePaused = false;
                    if (thisClass.snakeDirection == directions.right) {
                        thisClass.sMoveRight();
                    } else if (thisClass.snakeDirection == directions.left) {
                        thisClass.sMoveLeft();
                    } else if (thisClass.snakeDirection == directions.up) {
                        thisClass.sMoveUp();
                    } else if (thisClass.snakeDirection == directions.down) {
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
            } else {
                s();
            }
        }
        changeLevel(): void {
            this.addSpeed();
            this.stop();
            this.run();
        }
        stop(): void {
            window.clearTimeout(this.gameInterval);
            this.isGamePaused = true;
        }
        sMoveRight(): void {
            let currentIndex: number = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.right);
            let currentHead: HTMLElement = this.getSnakeHead();
            let newHeadIndex: number = currentIndex + 1;
            let newHead = <HTMLElement>document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.right, newHeadIndex);
        }
        sMoveLeft(): void {
            let currentIndex = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.left);
            let currentHead = this.getSnakeHead();
            let newHeadIndex = currentIndex - 1;
            let newHead = <HTMLElement>document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.left, newHeadIndex);
        }
        sMoveUp(): void {
            let currentIndex = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.up);
            let currentHead = this.getSnakeHead();
            let newHeadIndex = currentIndex - 100;
            let newHead = <HTMLElement>document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.up, newHeadIndex);
        }
        sMoveDown(): void {
            let currentIndex = this.getSnakeHeadPlaceIndex();
            this.checkHits(currentIndex, directions.down);
            let currentHead = this.getSnakeHead();
            let newHeadIndex = currentIndex + 100;
            let newHead = <HTMLElement>document.querySelector("div[b_index='" + newHeadIndex + "']");
            newHead.classList.add("snake");
            this.moveSnake(newHead, directions.down, newHeadIndex);
        }
        moveSnake(newHeadElm: HTMLElement, where: directions, headIndex: number): void {
            this.snakeDirection = where;
            this.snakeBody.push(newHeadElm);
            this.snakeBody[0].className = this.snakeBody[0].className.replace("snake", "");
            if (!this.isSeedHome(headIndex)) {
                this.snakeBody.shift();
            } else {
                this.produceSeed();
            }
        }
        isSeedHome(newHeadIndex: number): boolean {
            return newHeadIndex == this.newSeedHomeIndex;
        }
        produceSeed(): void {
            if (this.newSeedHomeIndex > -1) {
                let prevSeed = document.querySelector("div[b_index='" + this.newSeedHomeIndex + "']");
                prevSeed.className = prevSeed.className.replace("seed", "");
            }
            let randomIndex: number = parseInt((Math.random() * 10000).toString());
            let seedHome = document.querySelector("div[b_index='" + randomIndex + "']");
            let classNames = seedHome.className;
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
        }
        addSpeed(): void {
            let newSpeed = this.gameSpeed - 0.02;
            if (newSpeed > 0)
                this.gameSpeed = newSpeed;
        }
        checkHits(index: number, where: directions): void {
            this.checkWallHitByClass(index, where);
            this.checkSelfHit(index, where);
        }
        checkWallHitByClass(placeIndex: number, where: directions): void {
            let newIndex;
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
        }
        checkSelfHit(placeIndex: number, where: directions): void {
            let isHitted = false;
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
        }
        isNewPlaceInSnakeBody(newPlaceIndex: number): boolean {
            return document
                .querySelector("div[b_index='" + newPlaceIndex + "']")
                .className.indexOf("snake") > -1;
        }
        getSnakeHeadPlaceIndex(): number {
            return parseInt(this.snakeBody[this.snakeBody.length - 1].getAttribute("b_index"));
        }
        getSnakeHead(): HTMLElement {
            return this.snakeBody[this.snakeBody.length - 1];
        }
        getSnakeLength(): number {
            return this.snakeBody.length;
        }
        gameOver(): void {
            this.isGameOver = true;
            document.querySelector("button[name='Pause']").classList.add("hide");
            this.stop();
            let gameOverElm = document.getElementById("snakeGameOver");
            gameOverElm.className = gameOverElm.className.replace("hide", "");
        }
    }
}