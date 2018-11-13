// to better understand my functions - collapse them
let eventsObject = {
    addEvent: function (elem, type, fn) {
        if (typeof addEventListener !== 'undefined') {
            elem.addEventListener(type, fn);
        }
    },
    getTarget: function (event) {
        if (typeof event.target !== 'undefined') return event.target;
    }

};
let pics = [
    "url('img/01.jpg')", "url('img/01.jpg')",
    "url('img/02.jpg')", "url('img/02.jpg')",
    "url('img/03.jpg')", "url('img/03.jpg')",
    "url('img/04.jpg')", "url('img/04.jpg')",
    "url('img/05.jpg')", "url('img/05.jpg')",
    "url('img/06.jpg')", "url('img/06.jpg')",
    "url('img/07.jpg')", "url('img/07.jpg')",
    "url('img/08.jpg')", "url('img/08.jpg')",
    "url('img/09.jpg')", "url('img/09.jpg')",
    "url('img/10.jpg')", "url('img/10.jpg')",
    "url('img/11.jpg')", "url('img/11.jpg')",
    "url('img/12.jpg')", "url('img/12.jpg')"
];
window.onload = function () {

    let flippedCards,
        card = document.getElementsByClassName('card'),
        front_side = document.getElementsByClassName('front-side'),
        timer = document.getElementById("timer-counter"),
        rules = document.getElementById('rules-window'),

        hide_intro = document.getElementById('mask'),
        active_difficulty = document.getElementsByClassName('difficulty'),
        active_skirt = document.getElementsByClassName('skirt-image'),

        results_window = document.getElementById('results'), //results
        results_table = document.getElementsByClassName('result'),
        player_time = document.getElementsByClassName('player-time'),
        current_time_result = document.getElementById('time-result'),


        player_data, //LocalStorage vars
        data_for_LS,
        results_array = [],

        score_counter = 0, // counters
        timer_counter = 0,
        difficulty = 24;


    const mainFunction = function (e) {
        let elem = eventsObject.getTarget(e);
        let id_checker = elem.getAttribute('id'),
            skirt_checker = elem.getAttribute('src');

        //change skirt
        switch (skirt_checker) {
            case 'img/bg1.jpg':
                skirtSwitcher(difficulty, skirt_checker);
                skirtChoice(0);
                break;
            case 'img/bg2.jpg':
                skirtSwitcher(difficulty, skirt_checker);
                skirtChoice(1);
                break;
            case 'img/bg3.jpg':
                skirtSwitcher(difficulty, skirt_checker);
                skirtChoice(2);
                break;
        }

        //get difficulty + hide rules + launch the game
        switch (id_checker) {
            case 'low':
                difficulty = 12;
                difChoice(0);
                break;
            case 'medium':
                difficulty = 18;
                difChoice(1);
                break;
            case 'hard':
                difficulty = 24;
                difChoice(2);
                break;
            case 'rules-button':         //show rules
                hideRules();
                break;
            case 'button-play':
                launchGame();
                if (!rules.classList.contains('hide'))
                    hideRules();
                break;
            case 'play-again':
                location.reload();
                break;
        }

    };

    //functions...
    function launchGame() {
        //get player's information
        player_data = document.getElementsByTagName('input');
        data_for_LS = player_data[0].value + ' ' + player_data[1].value;
        if (player_data[0].value === '' || player_data[1].value === '' || player_data[2].value === '') {
            alert('ATTENTION: To start the game fill the fields!')
        } else {
            let main_window = document.getElementsByClassName('main');
            main_window[0].style.display = 'block';
            hide_intro.style.display = 'block';
            makeField();
        }
    }         //start the game
    function makeField() {
        flippedCards = [];
        let current_arr = [];
        for (let i = 0; i < difficulty; i++) {
            current_arr.push(pics[i]);
        }
        shuffle(current_arr);

        for (let i = 0; i < difficulty; i++) {
            card[i].style.display = 'inline-block';
            card[i].querySelector('.back-side').style.backgroundImage = current_arr[i];
            card[i].addEventListener('click', flip);
        }

        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            return arr;
        }

        startTimer();
    }          //create a field with cards
    function flip() {
        if (!this.classList.contains('flipped') && flippedCards.length < 2) {
            this.classList.toggle('flipped');
            flippedCards.push(this);
            if (flippedCards.length === 2) {
                checkMatch();
            }
        }
    }               //flip and
    function checkMatch() {
        let matchCard_1 = flippedCards[0].querySelector('.back-side').style.backgroundImage,
            matchCard_2 = flippedCards[1].querySelector('.back-side').style.backgroundImage;

        if (matchCard_1 === matchCard_2) {
            setTimeout(hideMatch, 1000);
            score_counter++;
            if (score_counter == difficulty / 2) {
                timer.style.display = 'none';
                finalResults();
            }
        } else {
            setTimeout(flipBack, 1000);
        }
    }         //match check
    function finalResults() {
        results_window.style.display = 'block';
        current_time_result.innerHTML = timer_counter;
        localStorage.setItem(timer_counter, data_for_LS);

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key))
                results_array.push(parseInt(key));
        }
        results_array.sort(compareNumeric);
        for (let i = 0; i < 10; i++) {
            results_table[i].innerText = localStorage.getItem(String(results_array[i]));
            player_time[i].innerText = results_array[i];
        }
    }       //show table of results
    function flipBack() {
        flippedCards[0].classList.toggle('flipped');
        flippedCards[1].classList.toggle('flipped');
        flippedCards = [];
    }           //flipback if didn't match
    function hideMatch() {
        flippedCards[0].classList.toggle('hidden');
        flippedCards[1].classList.toggle('hidden');
        flippedCards = [];
    }          //hide matched
    function startTimer() {
        setInterval(timeIncrementor, 1000);
    }         //just timer
    function timeIncrementor() {
        timer_counter++;
        timer.innerText = timer_counter;
    }    //timer incrementor
    function hideRules() {
        rules.classList.toggle('hide');
    }          //show&hide rules
    function difChoice(index) {
        for (let i = 0; i < active_difficulty.length; i++) {
            active_difficulty[i].className = active_difficulty[i].className.replace(' active', ' ');
        }
        if (!active_difficulty[index].classList.contains('active'))
            active_difficulty[index].className += " active";
    }     //change game difficult
    function skirtChoice(index) {
        for (let i = 0; i < active_skirt.length; i++) {
            active_skirt[i].className = active_skirt[i].className.replace(' active', ' ');
        }
        if (!active_skirt[index].classList.contains('active'))
            active_skirt[index].className += " active";
    }   //change opacity of skirts in menu
    function skirtSwitcher(amount, pattern) {
        for (let i = 0; i < amount; i++) {
            front_side[i].style.backgroundImage = "url(" + pattern + ")";
        }
    } //change skirts
    function compareNumeric(a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
    } //fn for arr sorter

    eventsObject.addEvent(document, 'click', mainFunction);
};
