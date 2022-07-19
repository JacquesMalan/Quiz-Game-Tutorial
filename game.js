const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progress_Text = document.getElementById('progress_text');
// const questionCounterText = document.getElementById('questionCounter')
const scoreText = document.getElementById('score');
const progressbarfill = document.getElementById('progressbarfill')
const loader = document.getElementById('loader')
const game = document.getElementById('game')

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
    // fetch("questions.json")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChioces = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChioces.splice(formattedQuestion.answer - 1, 0,
                loadedQuestion.correct_answer);

            answerChioces.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        game.classList.remove('hidden')
        loader.classList.add('hidden')
        startGame();
    })
    .catch(err => {
        console.error(err);
    });

// let questions = [
//     {
//         question: 'Inside which HTML element do we put the JavaScript?',
//         choice1: '<script>',
//         choice2: '<javascript>',
//         choice3: '<js>',
//         choice4: '<scripting>',
//         answer: 1
//     },
//     {
//         question: 'What is the correct syntax for refferring to an extrnal script called "xxx.js"?',
//         choice1: '<script href="xxx.js">',
//         choice2: '<script name="xxx.js">',
//         choice3: '<script src="xxx.js">',
//         choice4: '<script file="xxx.js">',
//         answer: 3
//     },
//     {
//         question: 'How do you write "Hello World" in the alert box',
//         choice1: '<msgBox("Hello World");>',
//         choice2: '<alertBox("Hello World");>',
//         choice3: '<msg("Hello World")>',
//         choice4: '<alert("Hello World")>',
//         answer: 4
//     }
// ];

// constants
const correct_Bonus = 10;
const max_questions = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
};

getNewQuestion = () => {

    if (availableQuestions.length === 0 || questionCounter >= max_questions) {
        localStorage.setItem('mostRecentScore', score);
        // go to end game page
        return window.location.assign('/end_game.html')
    }

    questionCounter++;
    progress_text.innerText = `Question ${questionCounter}/${max_questions}`;
    // Update progress fill
    progressbarfill.style.width = `${(questionCounter / max_questions) * 100
        }%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number]
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        // console.log(selectedAnswer);
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if (classToApply === 'correct') {
            incrementScore(correct_Bonus);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);


    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};