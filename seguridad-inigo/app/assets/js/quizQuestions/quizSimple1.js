let fin = document.getElementById("fin-del-modulo");
var questions = [
  {
    text: `Los  malos hábitos de trabajo son la causa principal de accidentes en el sitio de trabajo.`,
    image: `../../assets/images/course/modulo1/5-malos.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `No es necesario inspeccionar la herramienta antes de usarla.`,
    image: `../../assets/images/course/modulo1/3-EPP.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `El mantenernos seguros y mantener a los compañeros seguros en el trabajo es muy importante.`,
    image: `../../assets/images/course/modulo1/3-proteccion.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `Si miras un señalamiento de seguridad en el sitio de trabajo lo debes destruir.`,
    image: `../../assets/images/course/modulo1/6-falta.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `Para operar un monta cargas se requiere entrenamiento.`,
    image: `../../assets/images/course/modulo1/3-maquinaria.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `Se usan los colores rojo, negro y blanco para los señalamientos de seguridad.`,
    image: `../../assets/images/course/modulo1/6-seguridad.jpg`,
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

  /* for (let i = 0; i <= 5; i++) {
    const buttons = document.querySelectorAll(`.q-option-${i}`);
    buttons.forEach(button => {
        button.classList.remove('btn-dark');
        button.classList.add('btn-outline-dark');
        button.classList.remove('selected');
    });
  } */

  if (score >= 80) {
    fin.setAttribute("style", "display: block");
    modalMessage.textContent = "¡Felicidades!";
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
