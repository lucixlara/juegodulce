const screens = document.querySelectorAll('.screen');
const startButton = document.getElementById('start-btn');
const gameNode = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEL = document.getElementById('score');
const message = document.getElementById('message')

const btnContinue = document.getElementById('btn-continue')
const btnStop = document.getElementById('btn-stop')

const game = {
    running: false,
    timer: undefined,
    score: 0,
    seconds: 0,
    selectedSweet: {}
}

const renderSweetsScreen = () => {
    const screen = document.getElementById('sweet-screen');
    //add a title
    const title = document.createElement("h2")
    title.appendChild(document.createTextNode(sweetScreen.title))
    screen.appendChild(title);

    // add UL
    const ul = document.createElement("ul")
    ul.classList += 'sweets-list';
    screen.appendChild(ul)

    sweetScreen.list.forEach(data => {
        const li = document.createElement("li")
        ul.appendChild(li)

        const btn = document.createElement("button")
        btn.setAttribute("type", "button")
        btn.classList += 'choose-sweet-btn'
        li.appendChild(btn)

        const p = document.createElement("p")
        p.appendChild(document.createTextNode(data.buttonLabel))
        btn.appendChild(p)

        const img = document.createElement("img")
        img.setAttribute('src', data.img)
        img.setAttribute('alt', data.buttonLabel)

        btn.appendChild(img)
        btn.addEventListener('click', () => {
            const img = btn.querySelector('img');
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt');

            game.selectedSweet = {src, alt}

            screens[1].classList.remove('visible')
            screens[2].classList.add('visible')

            startGame();
        })
    })
}

startButton.addEventListener('click', () => {
    screens[0].classList.remove('visible')
    screens[1].classList.add('visible')
});


function startGame() {
    game.running = true
    game.timer = setInterval(increaseTime, 1000);
    createSweet();
}

function increaseTime() {
    game.seconds += 1
    timeEl.innerHTML = `Time: ${game.seconds} sec`;
}

function createSweet() {
    const {x, y} = getRandomLocation();

    const sweet = document.createElement('img');
    sweet.classList.add('sweet');
    sweet.src = game.selectedSweet.src;
    sweet.alt = game.selectedSweet.alt;
    sweet.style.display = 'block';
    sweet.style.top = `${y}px`
    sweet.style.left = `${x}px`
    sweet.style.transform = `rotate(${Math.random() * 360}deg)`;
    sweet.addEventListener('click', catchSweet)
    gameNode.appendChild(sweet);
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const x = 100 + Math.random() * (width - 300)
    const y = 100 + Math.random() * (height - 200);

    return {x, y}
}

function playBiteSound() {
    const audio = document.getElementById('bite');
    audio.play();
}

function catchSweet() {
    if (game.running) {
        playBiteSound();
        increaseScore();
        this.remove();

        addSweet();
    }
}

function addSweet() {
    setTimeout(createSweet, 100);
    setTimeout(createSweet, 200);
}

function increaseScore() {
    game.score++;
    if (game.score % 5 === 0) {
        game.running = false
        message.classList.add('visible')
        if (game.timer) {
            clearInterval(game.timer)
            game.timer = null
        }
    }
    scoreEL.innerHTML = `Score: ${game.score}`
}

btnContinue.addEventListener('click', () => {
    game.running = true
    message.classList.remove('visible')

    game.timer = setInterval(increaseTime, 1000);
    createSweet();
})

btnStop.addEventListener('click', () => {
    game.seconds = 0
    game.score = 0
    scoreEL.innerHTML = `Score: ${game.score}`

    document.querySelectorAll(".sweet").forEach(el => {
        el.remove();
    })

    screens[0].classList.add('visible')
    screens[1].classList.remove('visible')
    screens[2].classList.remove('visible')
    message.classList.remove('visible')
})

renderSweetsScreen();app.js