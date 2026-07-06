let fin = document.getElementById("fin-del-modulo");
var questions = [
  {
    // Pregunta 1
    text: `¿Levantar objetos incorrectamente es una causa de lesión en la espalda?`,
    image: `../../assets/images/course/modulo10/lesion-espalda.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    // Pregunta 2
    text: `¿Debes transportar solamente cargas inestables?`,
    image: `../../assets/images/course/modulo10/unidad10_lam4_foto1.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
  {
    // Pregunta 3  
    text: `¿No debes de apilar ladrillos a más de 7 pies (ó 2.13 m) de altura?`,
    image: `../../assets/images/course/modulo10/unidad10_lam35_foto1.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    // Pregunta 4
    text: `¿Nunca debes de sacar los clavos de la madera antes de apilarla?`,
    image: `../../assets/images/course/modulo10/unidad10_lam36_foto1.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
  {
    // Pregunta 5
    text: `¿Debe utilizar un conduto cerrado cuando está haciendo demoliciones?`,
    image: `../../assets/images/course/modulo10/unidad10_lam38_foto1.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    // Pregunta 6
    text: `¿No se debe entrenar a los trabajadores en cómo levantar objetos en una forma segura?`,
    image: `../../assets/images/course/modulo10/unidad10_lam9_foto1.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
];
questions = questions.sort((a, b) => 0.5 - Math.random());

const answersList = function (answers, correctIndex, id) {
  return answers
    .map((ans, i) => {
      let className = correctIndex === i ? "option buena" : "option";
      return `
      <input type="radio" class="custom-control-input ${className}" name="radiobutton${id}" />
      <button type="button" class="btn btn-outline-dark q-option-${id} mrg-btm-25 ${className}" id="U13_Q${id}_A${i}" style="width: 10rem;" onclick="selectOption('${id}', '${i}')">
          ${ans}
      </button>
      `;
    })
    .join("");
};

function selectOption(questionId, optionId) {
  // Desmarcar todos los botones de la misma pregunta
  const buttons = document.querySelectorAll(`.q-option-${questionId}`);
  buttons.forEach(button => {
      button.classList.remove('btn-dark');
      button.classList.add('btn-outline-dark');
      button.classList.remove('selected');
  });

  // Marcar el botón seleccionado
  const selectedButton = document.getElementById(`U13_Q${questionId}_A${optionId}`);
  selectedButton.classList.remove('btn-outline-dark');
  selectedButton.classList.add('btn-dark');
  selectedButton.classList.add('selected');

  // Crear o actualizar el input radio correspondiente
  let radioInput = document.querySelector(`input[name="radiobutton${questionId}"]`);
  if (!radioInput) {
      radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = `radiobutton${questionId}`;
      radioInput.style.display = 'none';
      document.body.appendChild(radioInput);
  }
  radioInput.value = optionId;
  radioInput.checked = true;
}

const question = function (
  i,
  { text, image, incorrectText, correctText, correctIndex, answers }
) {
  const answersHtml = answersList(answers, correctIndex, i);

  return `
        <div class="question quiz-question-card">
            <p class="question-text">
                <strong class="question-num">${i + 1}.</strong> ${text}
            </p>
            <div class="quiz-question-card__feedback">
            <p class="alertWrong mb-2 font-size-14 font-weight-bold" style="display: none; color: red">
                ${incorrectText}
            </p>
            <p class="alertCorrect mb-2 font-size-14 font-weight-bold" style="display: none; color: green">
                ${correctText}
            </p>
            </div>
            <div class="quiz-question-card__options">
              ${answersHtml}
            </div>
            <div class="quiz-question-card__media">
              <img src="${image}" alt="" class="img-fluid rounded">
            </div>
        </div>
        `;
};

const generateQuestions = function () {
  return questions
    .map((q, i) => {
      return question(i, q);
    })
    .join("");
};

const questionsContainer = document.querySelector("#questions");

const modal = document.querySelector("#modal-fs");
const modalMessage = modal.querySelector("#modal-message");
const modalScore = modal.querySelector("#modal-score");
const correctImg = modal.querySelector("#correct-img");
const incorrectImg = modal.querySelector("#incorrect-img");
const btnAdelante = modal.querySelector("#btn-adelante-container");

document.addEventListener("DOMContentLoaded", function (_) {
  const qs = generateQuestions();
  questionsContainer.insertAdjacentHTML("afterbegin", qs);

  incorrectImg.style.display = "none";
  correctImg.style.display = "none";
  if (btnAdelante) btnAdelante.style.display = "none";
});

function checkAll() {
  var correct = 0;
  var count = 0;

  $("div.question").each(function () {
    count++;
    var elem = $(this);
    $(this).find(".alertCorrect").css("display", "none");
    $(this).find(".alertWrong").css("display", "none");
    $(this).removeClass("correct");
    $(this).removeClass("incorrect");
    var isCorrect = true;
    $(this).find("button.option").each(function () {
      if ($(this).hasClass("buena")) {
        if (!$(this).hasClass("selected")) {
          isCorrect = false;
          $(this)[0].classList.remove('btn-dark');
          $(this)[0].classList.add('btn-outline-dark');
          $(this)[0].classList.remove('selected');
        }
      } else {
        if ($(this).hasClass("selected")) {
          isCorrect = false;
          $(this)[0].classList.remove('btn-dark');
          $(this)[0].classList.add('btn-outline-dark');
          $(this)[0].classList.remove('selected');
        }
      }
    });
    if (isCorrect == true) {
      correct++;
      $(this).find(".alertCorrect").css("display", "block");
      $(this).addClass("correct");
    } else {
      $(this).find(".alertWrong").css("display", "block");
      $(this).addClass("incorrect");
    }
  });
  let score = parseInt((correct * 100) / count);
  modalScore.textContent = `${score} / 100`;

  if (score >= 80) {
    fin.setAttribute("style", "display: block");
    modalMessage.textContent = "¡Excelente!";
    incorrectImg.style.display = "none";
    correctImg.style.display = "block";
    if (btnAdelante) btnAdelante.style.display = "block";

  } else {
    modalMessage.textContent = "Vuelve a intentarlo...";
    incorrectImg.style.display = "block";
    correctImg.style.display = "none";
    if (btnAdelante) btnAdelante.style.display = "none";

    if (score < 25) {
      alert(
        "Le recomendamos volver a leer esta sección para tener mayor puntuaje que 25."
      );
    }
  }
}
