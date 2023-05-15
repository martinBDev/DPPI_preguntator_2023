document.addEventListener("DOMContentLoaded", () => {
    // Cargar preguntas
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            populateTopics(data);
            createMockExam(data);
            loadQuestions(data[0].topic);
			loadTraversal(data[0].topic);
        });

    // Escuchar evento de cambio en el selector de temas
    const topicSelector = document.getElementById("topic-selector");
    topicSelector.addEventListener("change", (event) => {
        loadQuestions(event.target.value);
		// al cambiar de topic, asegurarse que el botón cambie de estado si se ha usado
		hideAnswers();
        loadTraversal(event.target.value);
    });

    // Escuchar evento de click en el botón de enviar
    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", () => {
        // Aquí va la lógica para validar las respuestas
    });

    const viewAnswersButton = document.getElementById("view-answers-button");
    viewAnswersButton.addEventListener("click", () => {
        viewAnswers();
    });


    
});


let instantFeedback = false;
const switchButton = document.getElementById('switch');
const switchInput = document.getElementById('instant-feedback-switch');
switchButton.onclick = function() {
    if (switchInput.checked === false) {
        console.log('checked');
        document.documentElement.setAttribute('data-theme', 'dark');
        switchInput.checked = true;
        updateInstantFeedback(true);
    } else {
        console.log('not checked');
        document.documentElement.setAttribute('data-theme', 'light');
        switchInput.checked = false;
        updateInstantFeedback(false);
    }
} 
function calculateScore() {
    const selectedTopic = questionsData.find(q => q.topic === document.getElementById("topic-selector").value);
    const totalQuestions = selectedTopic.questions.length;
    const pointsPerQuestion = 10 / totalQuestions;
    let score = 0;

    selectedTopic.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);

        if (selectedOption) {
            const selectedIndex = parseInt(selectedOption.value);

            if (selectedIndex === question.answer) {
                score += pointsPerQuestion;
            } else {
                score -= pointsPerQuestion / totalQuestions;
            }
        }
    });

    // Asegurarse de que la nota esté en el rango de 0 a 10
    score = Math.min(Math.max(score, 0), 10);
    alert(`Tu nota es: ${score.toFixed(2)}`);
}

// Escuchar evento de click en el botón de enviar
const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {
    calculateScore();
    displayResults();
});

let questionsData = [];

function populateTopics(questions) {
    questionsData = questions;
    const topicSelector = document.getElementById("topic-selector");
    questions.forEach(questionSet => {
        const option = document.createElement("option");
        option.value = questionSet.topic;
        option.textContent = questionSet.topic;
        topicSelector.appendChild(option);
    });
}

function displayResults() {
    const selectedTopic = questionsData.find(q => q.topic === document.getElementById("topic-selector").value);

    selectedTopic.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        const questionDiv = document.querySelector(`.question[data-index="${index}"]`);
		const traversalElement = document.querySelector(`.traversal-element[data-index="${index}"]`)
        if (selectedOption) {
            const selectedIndex = parseInt(selectedOption.value);
            const optionItem = selectedOption.parentElement;

            if (selectedIndex === question.answer) {
                optionItem.style.backgroundColor = "var(--c-correct)";
				traversalElement.className = 'traversal-element correct'
            } else {
                optionItem.style.backgroundColor = "var(--c-incorrect)";
				traversalElement.className = 'traversal-element incorrect'
            }
        }

        const explanation = document.createElement("p");
        explanation.className = "explanation";
        explanation.textContent = question.explanation;
        //check if the explanation is already displayed
        if(questionDiv.lastChild.className != "explanation"){

            questionDiv.appendChild(explanation);
        }
    });
}


function loadTraversal(topic) {
	// obtener los contenedores
	const traversalContainer = document.getElementById('traversal-container')
	// Vaciar los contenedores
	traversalContainer.innerHTML = ''; 

	const selectedTopic = questionsData.find(q => q.topic === topic)
	selectedTopic.questions.forEach((question, index) => {
		// populate traversal
		const traversalDiv = document.createElement('div')
		const traversalA = document.createElement('a')
		const traversalText = document.createElement('span')

		traversalDiv.className = 'traversal-element'
		traversalDiv.dataset.index = index

		traversalA.className = 'traversal-button'
		traversalA.href = `#q_${index}`

		traversalText.textContent = index+1
		traversalText.classList = 'traversal-text'

		traversalA.appendChild(traversalText)
		traversalDiv.appendChild(traversalA)
		traversalContainer.appendChild(traversalDiv)
	})
}

function loadQuestions(topic) {
	// obtener los contenedores
    const questionContainer = document.getElementById("question-container");
	// Vaciar los contenedores
    questionContainer.innerHTML = ""; 

    const selectedTopic = questionsData.find(q => q.topic === topic);
    selectedTopic.questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
		// add unique index per question
		questionDiv.id = `q_${index}`
        questionDiv.dataset.index = index;

        const questionLabel = document.createElement("label");
        questionLabel.textContent = `${index + 1}. ${question.question}`;
        questionDiv.appendChild(questionLabel);
		

        const optionList = document.createElement("ul");
        question.options.forEach((option, optionIndex) => {
            const optionItem = document.createElement("li");
			optionItem.className = "answer"


            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = `question-${index}`;
            optionInput.value = optionIndex;
			optionInput.id = `question-${index}-${optionIndex}`;

            const optionLabel = document.createElement("label");
            optionLabel.textContent = option;
			optionLabel.htmlFor = `question-${index}-${optionIndex}`;

            optionItem.appendChild(optionInput);
            optionItem.appendChild(optionLabel);
            optionList.appendChild(optionItem);

            optionItem.addEventListener("click", (event) => {
                if(event.target !== optionInput) {
                    optionInput.click();
                    if(!switchInput.checked) {
				    	document.querySelector(`.traversal-element[data-index="${index}"]`).classList.add('answered')
                    }
                }
            });

        });
		questionDiv.appendChild(optionList);
		questionContainer.appendChild(questionDiv);
    });
}

//Marks the correct answers and displays the explanation
function viewAnswers(){
    const selectedTopic = questionsData.find(q => q.topic === document.getElementById("topic-selector").value);

    selectedTopic.questions.forEach((question, index) => {
        const questionDiv = document.querySelector(`.question[data-index="${index}"]`);
        const explanation = document.createElement("p");
        explanation.className = "explanation";

        explanation.textContent = question.explanation;
        if(questionDiv.lastChild.className != "explanation"){
            questionDiv.appendChild(explanation);
        }

        //Marks the correct answer
        const correctOption = document.getElementById(`question-${index}-${question.answer}`);
        const correctOptionItem = correctOption.parentElement; 
        correctOptionItem.style.backgroundColor = "var(--c-correct)";
        correctOption.checked = true;

    });

    //change the button to hide answers
    const viewAnswersButton = document.getElementById("view-answers-button");
    viewAnswersButton.textContent = "Ocultar respuestas";
    viewAnswersButton.removeEventListener("click", viewAnswers);
    viewAnswersButton.addEventListener("click", hideAnswers);
}

function hideAnswers() {
    const explanationList = document.querySelectorAll(".explanation");
    explanationList.forEach(explanation => {
		explanation.remove();
    });
	// reset traversal
	const traversalList = document.querySelectorAll('.traversal-element')
	traversalList.forEach(traversal => {
		traversal.className = 'traversal-element'
	})

    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.checked = false;
    });

    const optionItems = document.querySelectorAll(".answer");
    optionItems.forEach(optionItem => {
        optionItem.style.backgroundColor = "#a1d5f8";
        optionItem.style.color = "black";
    });

    //change the button to view answers
    const viewAnswersButton = document.getElementById("view-answers-button");
    viewAnswersButton.textContent = "Ver respuestas";
    viewAnswersButton.removeEventListener("click", hideAnswers);
    viewAnswersButton.addEventListener("click", viewAnswers);

}

function createMockExam(data) {
    let mockExamQuestions = [];
    const numOfQuestionsPerTopic = 5;

    data.forEach(topic => {
        const questions = topic.questions;
        for(let i = 0; i < numOfQuestionsPerTopic; i++) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            mockExamQuestions.push(questions[randomIndex]);
            questions.splice(randomIndex, 1); // Removemos la pregunta seleccionada para evitar duplicados
        }
    });

    shuffleArray(mockExamQuestions); // Mezcla las preguntas del simulacro de examen

    // Añadimos el nuevo tema de "Simulacro de examen" a los datos de las preguntas
    questionsData.push({
        topic: "Simulacro de examen",
        questions: mockExamQuestions
    });

    // Añadimos la opción de "Simulacro de examen" al selector de temas
    const topicSelector = document.getElementById("topic-selector");
    const option = document.createElement("option");
    option.value = "Simulacro de examen";
    option.textContent = "Simulacro de examen";
    topicSelector.appendChild(option);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
    }
}


const scrollToTopButton = document.getElementById('scroll-to-top-button')
scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
})

// Show or hide the button depending on the scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 1) {
        scrollToTopButton.style.display = 'block'
    } else {
        scrollToTopButton.style.display = 'none'
    }
}
)


function updateInstantFeedback(enabled) {
    const allOptionInputs = document.querySelectorAll("input[type='radio']");
    allOptionInputs.forEach((input) => {
        if (enabled) {
            input.addEventListener("change", instantFeedbackHandler);
        } else {
            input.removeEventListener("change", instantFeedbackHandler);
        }
    });
}

function instantFeedbackHandler(event) {
    const input = event.target;
    const questionIndex = parseInt(input.name.split("-")[1]);
    const selectedOptionIndex = parseInt(input.value);

    const selectedTopic = questionsData.find(q => q.topic === document.getElementById("topic-selector").value);
    const question = selectedTopic.questions[questionIndex];

    const optionItem = input.parentElement;

    if (selectedOptionIndex === question.answer) {
        optionItem.style.backgroundColor = "var(--c-correct)";
		document.querySelector(`.traversal-element[data-index="${questionIndex}"]`).classList.add('correct')
    } else {
        optionItem.style.backgroundColor = "var(--c-incorrect)";
		document.querySelector(`.traversal-element[data-index="${questionIndex}"]`).classList.add('incorrect')
    }

    //explination
    const explanation = document.createElement("p");
    explanation.className = "explanation";
    explanation.textContent = question.explanation;
    let questionDiv = document.querySelector(`.question[data-index="${questionIndex}"]`);
    if(questionDiv.lastChild.className != "explanation"){
        questionDiv.appendChild(explanation);
    }


}