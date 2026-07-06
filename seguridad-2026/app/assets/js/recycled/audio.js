/**
 * Lecciones que aún tienen solo .audio-player: envuelve en .course-audio-hint
 * (texto «Reproduce el siguiente audio») como en módulos 1–2.
 * No toca overlays, tienda, cuestionarios ni bloques ya marcados en HTML.
 */
function ensureCourseAudioHints(root) {
    var base = root && root.nodeType === Node.ELEMENT_NODE ? root : document;
    base.querySelectorAll(".audio-player").forEach(function (ap) {
        if (!ap.closest(".main-content")) {
            return;
        }
        if (ap.closest(".course-audio-hint")) {
            return;
        }
        if (ap.closest(".store")) {
            return;
        }
        if (ap.closest("#questions")) {
            return;
        }
        if (ap.closest(".modal")) {
            return;
        }
        if (ap.classList.contains("audio-overlay")) {
            return;
        }
        if (ap.getAttribute("data-no-course-audio-hint") === "1") {
            return;
        }

        var parent = ap.parentNode;
        if (!parent) {
            return;
        }

        var wrap = document.createElement("div");
        wrap.className = "course-audio-hint";
        wrap.setAttribute("role", "group");
        wrap.setAttribute("aria-label", "Audio de la lección");

        var prev = ap.previousElementSibling;
        if (prev && (prev.tagName === "UL" || prev.tagName === "OL")) {
            wrap.classList.add("course-audio-hint--tight-after-ul", "course-audio-hint--flush-list");
        }
        if (
            prev &&
            (prev.classList.contains("course-lesson-split-row") ||
                prev.classList.contains("course-lesson-figures-row"))
        ) {
            wrap.classList.add("course-audio-hint--flush-after-media");
        }

        var flexParent = ap.parentElement;
        var jcCenter =
            flexParent &&
            (flexParent.classList.contains("justify-content-center") ||
                flexParent.classList.contains("justify-content-around"));
        var inLessonColumn =
            ap.closest(".course-lesson-split__text") ||
            (ap.closest('[class*="pdd-"]') &&
                !ap.closest(".ending-card") &&
                !ap.closest(".imagen-intro"));
        var useStacked =
            flexParent &&
            jcCenter &&
            !inLessonColumn &&
            (flexParent.classList.contains("d-flex") || flexParent.classList.contains("row"));

        var label = document.createElement("p");
        label.className = "course-audio-hint__label";
        label.textContent = "Reproduce el siguiente audio";

        var arrow = document.createElement("span");
        arrow.className = "course-audio-hint__arrow";
        arrow.setAttribute("aria-hidden", "true");

        if (useStacked) {
            wrap.classList.add("course-audio-hint--stacked-center");
            arrow.classList.add("course-audio-hint__arrow--down");
            arrow.innerHTML = '<i class="ti-angle-down"></i>';
            parent.insertBefore(wrap, ap);
            wrap.appendChild(label);
            wrap.appendChild(arrow);
            wrap.appendChild(ap);
        } else {
            arrow.innerHTML = '<i class="ti-angle-left"></i>';
            parent.insertBefore(wrap, ap);
            wrap.appendChild(ap);
            wrap.appendChild(arrow);
            wrap.appendChild(label);
        }
    });
}

// Compact circular audio player
function initCompactAudioPlayers(root) {
    var base = root && root.nodeType === Node.ELEMENT_NODE ? root : document;
    ensureCourseAudioHints(base);
    base.querySelectorAll(".audio-player").forEach(function (audioPlayer) {
        if (audioPlayer.closest(".store")) {
            return;
        }

        var audio = audioPlayer.querySelector("audio");
        if (!audio) return;

        var freshAudio = audio.cloneNode(true);
        audio.parentNode.replaceChild(freshAudio, audio);
        audio = freshAudio;

        audioPlayer
            .querySelectorAll(".progress-ring, .player-button")
            .forEach(function (el) {
                el.remove();
            });

        var SIZE = 44;
        var STROKE = 3;
        var RADIUS = (SIZE - STROKE) / 2;
        var CIRC = 2 * Math.PI * RADIUS;

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "progress-ring");
        svg.setAttribute("viewBox", "0 0 " + SIZE + " " + SIZE);

        var track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        track.setAttribute("class", "progress-ring__track");
        track.setAttribute("cx", String(SIZE / 2));
        track.setAttribute("cy", String(SIZE / 2));
        track.setAttribute("r", String(RADIUS));

        var fillCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        fillCircle.setAttribute("class", "progress-ring__fill");
        fillCircle.setAttribute("cx", String(SIZE / 2));
        fillCircle.setAttribute("cy", String(SIZE / 2));
        fillCircle.setAttribute("r", String(RADIUS));
        fillCircle.style.strokeDasharray = String(CIRC);
        fillCircle.style.strokeDashoffset = String(CIRC);

        svg.appendChild(track);
        svg.appendChild(fillCircle);
        audioPlayer.insertBefore(svg, audioPlayer.firstChild);

        var playerButton = document.createElement("button");
        playerButton.className = "player-button";
        playerButton.type = "button";
        audioPlayer.appendChild(playerButton);

        var playIcon =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">' +
            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />' +
            "</svg>";
        var pauseIcon =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#3D3132">' +
            '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />' +
            "</svg>";

        playerButton.innerHTML = playIcon;

        function toggleAudio() {
            if (audio.paused) {
                document.querySelectorAll(".audio-player audio").forEach(function (a) {
                    if (a !== audio && !a.paused) {
                        a.pause();
                        var wrap = a.closest(".audio-player");
                        var btn = wrap && wrap.querySelector(".player-button");
                        if (btn) btn.innerHTML = playIcon;
                    }
                });
                audio.play();
                playerButton.innerHTML = pauseIcon;
            } else {
                audio.pause();
                playerButton.innerHTML = playIcon;
            }
        }

        playerButton.addEventListener("click", toggleAudio);

        audio.addEventListener("timeupdate", function () {
            if (!audio.duration) return;
            var pct = audio.currentTime / audio.duration;
            fillCircle.style.strokeDashoffset = String(CIRC * (1 - pct));
        });

        audio.addEventListener("ended", function () {
            playerButton.innerHTML = playIcon;
            fillCircle.style.strokeDashoffset = String(CIRC);
        });
    });
}

window.initCompactAudioPlayers = initCompactAudioPlayers;
window.ensureCourseAudioHints = ensureCourseAudioHints;

initCompactAudioPlayers(document);
