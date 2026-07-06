function getPath(){
    var str=window.location.href;
    var str_array=str.split('/');
    var construct=false;
    var res="";
    str_array.forEach(element => {
        if(construct ){
            res+="../";
            return;
        }
        element=element.toLowerCase();
        if(element=="html" || element=="src"){
            construct=true;
        }
    });
    return res;
}

/**
 * Barra superior «Módulo anterior / Módulo siguiente» en páginas bajo html/moduloN/.
 * Solo se muestra en la presentación del módulo (moduloN-2, N≥2) y en la pantalla
 * de cierre (moduloN-final). En la primera unidad no aparece al inicio (modulo1-1);
 * en el módulo 1 solo al finalizar (modulo1-final). Elimina bloques .flechas estáticos.
 */
function moduleCrossNavFilename() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop() || "";
    return file.split("?")[0].toLowerCase();
}

function shouldShowModuleCrossNav(filename) {
    if (/^modulo\d+-final\.html$/.test(filename)) {
        return true;
    }
    if (/^modulo(?:10|[2-9])-2\.html$/.test(filename)) {
        return true;
    }
    return false;
}

function highlightSideNavCurrent() {
    $("#sideNav a.nav-modulos-current").removeClass("nav-modulos-current").removeAttr("aria-current");
    var pathRaw = (window.location.pathname || "").replace(/\\/g, "/").toLowerCase();
    var currentFile = pathRaw.split("/").pop() || "";
    currentFile = currentFile.split("?")[0].split("#")[0];
    if (!currentFile) {
        return;
    }

    var isModulosSection =
        currentFile === "temario.html" ||
        /\/modulo\d+\//.test(pathRaw) ||
        /^quiz-m\d+\.html$/.test(currentFile) ||
        currentFile === "actividad-final.html";

    if (isModulosSection) {
        $("#sideNav a.nav-modulos-link")
            .addClass("nav-modulos-current")
            .attr("aria-current", "page");
        return;
    }

    $("#sideNav a[href]").each(function () {
        var raw = this.getAttribute("href");
        if (!raw || raw.indexOf("javascript:") === 0 || raw === "#") {
            return;
        }
        var pathname;
        try {
            pathname = new URL(this.href).pathname.replace(/\\/g, "/").toLowerCase();
        } catch (e) {
            return;
        }
        var file = (pathname.split("/").pop() || "").split("?")[0].split("#")[0];
        if (file === currentFile) {
            $(this).addClass("nav-modulos-current").attr("aria-current", "page");
        }
    });
}

function injectModuleCrossNav() {
    var path = window.location.pathname || "";
    var match = path.match(/modulo(\d+)/i);
    if (!match) {
        return;
    }
    var num = parseInt(match[1], 10);
    if (num < 1 || num > 10) {
        return;
    }
    var $cf = $(".main-content > .container-fluid").first();
    if (!$cf.length) {
        return;
    }
    $cf.children(".flechas").remove();

    if (!shouldShowModuleCrossNav(moduleCrossNavFilename())) {
        return;
    }

    var prevHref = null;
    if (num > 1) {
        prevHref =
            num - 1 === 1
                ? "../modulo1/modulo1-1.html"
                : "../modulo" +
                  (num - 1) +
                  "/modulo" +
                  (num - 1) +
                  "-2.html";
    }
    var nextHref = null;
    if (num < 10) {
        nextHref =
            "../modulo" +
            (num + 1) +
            "/modulo" +
            (num + 1) +
            "-2.html";
    }

    var parts = [];
    if (prevHref) {
        parts.push(
            '<div class="flecha-izquierda"><a href="' +
                prevHref +
                '" class="modulo-anterior"><span aria-hidden="true">← </span>Módulo Anterior</a></div>'
        );
    }
    if (nextHref) {
        parts.push(
            '<div class="flecha-derecha"><a href="' +
                nextHref +
                '" class="modulo-siguiente">Módulo Siguiente <span aria-hidden="true">→</span></a></div>'
        );
    }
    if (!parts.length) {
        return;
    }

    var wrapClass = "flechas modulo-cross-nav";
    if (prevHref && !nextHref) {
        wrapClass += " flechas-solo-anterior";
    } else if (!prevHref && nextHref) {
        wrapClass += " flechas-solo-siguiente";
    }

    var html =
        '<div class="' +
        wrapClass +
        '" id="modulo-cross-nav" role="navigation" aria-label="Navegación entre módulos">' +
        parts.join("") +
        "</div>";
    $cf.prepend(html);
}

$(document).ready(function(){
    //file with relative path to index outside html folder
    $.get(getPath()+"assets/js/recycled/NavBar.html", function(html_string){
        $("#sideNav").html(html_string); 
        $("#sideNav a").each(function() {
            
            var _href = this.getAttribute("href"); 
            if( typeof(_href) != 'undefined' && _href!="" && _href.search(".html")!=-1){
                $(this).prop("href", getPath()+_href);
            }
        });
        highlightSideNavCurrent();
        $("div#sideNav > div > div.side-nav-logo > a > div.logo").each(function(){
            $(this).css("background-image","url("+getPath()+"assets/images/logo/logo.png)");
        });
    });
    $.get(getPath()+"assets/js/recycled/footer.html", function(html_string){
        $("footer.content-footer").html(html_string); 
        $("footer.content-footer a").each(function() {
            
            var _href = this.getAttribute("href"); 
            if( typeof(_href) != 'undefined' && _href!="" && _href.search(".html")!=-1){
                $(this).prop("href", getPath()+_href);
            }
        });
    });
    $.get(getPath()+"assets/js/recycled/headerstart.html", function(html_string){
        $("div.header.navbar").html(html_string); 
        $("div.header.navbar a").each(function() {
            
            var _href = this.getAttribute("href"); 
            if( typeof(_href) != 'undefined' && _href!="" && _href.search(".html")!=-1){
                $(this).prop("href", getPath()+_href);
            }
        });
        $("div.header.navbar img").each(function() {
            var _href = this.getAttribute("src"); 
            if( typeof(_href) != 'undefined' && _href!="" && _href.search("assets/images/")!=-1){
                $(this).prop("src", getPath()+_href);
            }
        });
    });

    injectModuleCrossNav();
});
