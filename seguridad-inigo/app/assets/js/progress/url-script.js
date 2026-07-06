

function getstr(str) {
    return str.substring(str.search("html"));
}
function isValid() {
    var href = normalizeHref(String(window.location.href || ""));
    if (href.toLowerCase().indexOf("html") !== -1) {
        return true;
    }
    if (/\/modulo\d+\//i.test(href)) {
        return true;
    }
    try {
        if (/\/modulo\d+\//i.test(new URL(window.location.href).pathname)) {
            return true;
        }
    } catch (e0) {
        /* ignorar */
    }
    return false;
}

function normalizeHref(u) {
    return String(u || "").replace(/\\/g, "/");
}

function parsePathSegments(pathname) {
    return String(pathname || "")
        .split("/")
        .filter(function (p) {
            return p && p.length;
        });
}

/** Pathname solo (funciona con http(s), file:, y distintos hosts / subcarpetas) */
function getCoursePathname() {
    try {
        return new URL(window.location.href).pathname || "";
    } catch (err) {
        var href = normalizeHref(window.location.href);
        var proto = href.indexOf("://");
        if (proto === -1) {
            return href.charAt(0) === "/" ? href : "/" + href;
        }
        var rest = href.substring(proto + 3);
        var slash = rest.indexOf("/");
        if (slash === -1) {
            return "/";
        }
        return rest.substring(slash);
    }
}

function stripQueryHash(name) {
    var s = String(name || "");
    var q = s.indexOf("?");
    if (q !== -1) {
        s = s.substring(0, q);
    }
    var h = s.indexOf("#");
    if (h !== -1) {
        s = s.substring(0, h);
    }
    return s;
}

function getfilename() {
    var pathname = normalizeHref(getCoursePathname());
    try {
        pathname = decodeURIComponent(pathname);
    } catch (e) {
        /* secuencias % inválidas */
    }
    var segs = parsePathSegments(pathname);
    var last = segs.length ? segs[segs.length - 1] : "";
    if (!last) {
        return "index.html";
    }
    return stripQueryHash(last);
}

/**
 * Segmentos desde la carpeta del módulo (p. ej. ["modulo2","modulo2-14.html"]).
 * Sirve para Mac, Windows, móvil y URLs sin "html/" en el pathname.
 */
function getCourseRelativeSegments(files) {
    var pathname = normalizeHref(getCoursePathname());
    try {
        pathname = decodeURIComponent(pathname);
    } catch (e2) {
        /* ignorar */
    }
    var segs = parsePathSegments(pathname);
    var j;
    for (j = 0; j < segs.length; j++) {
        var seg = segs[j];
        for (var k in files) {
            if (k.toLowerCase() === String(seg).toLowerCase()) {
                var out = segs.slice(j);
                out[0] = k;
                return out;
            }
        }
    }
    var href = normalizeHref(window.location.href);
    try {
        href = decodeURIComponent(href);
    } catch (e3) {
        /* ignorar */
    }
    var idx = href.toLowerCase().indexOf("html/");
    if (idx === -1) {
        return [];
    }
    var tail = href.substring(idx).split("/").filter(function (p) {
        return p && p.length;
    });
    if (tail.length && tail[0].toLowerCase() === "html") {
        tail.shift();
    }
    if (tail.length) {
        var t0 = tail[0];
        for (var kNorm in files) {
            if (kNorm.toLowerCase() === String(t0).toLowerCase()) {
                tail[0] = kNorm;
                break;
            }
        }
    }
    return tail;
}

/** Nombre del HTML actual, comparable con getFiles() */
function coursePageFileName() {
    return String(getfilename() || "").trim().toLowerCase();
}

/**
 * Localiza la página actual solo por nombre de archivo en getFiles()
 * (sin depender de cómo esté montada la URL en cada dispositivo).
 */
function findCurrentPageInCourse(files) {
    var want = coursePageFileName();
    if (!want) {
        return null;
    }
    var m;
    for (m in files) {
        if (!Object.prototype.hasOwnProperty.call(files, m)) {
            continue;
        }
        var mod = files[m];
        var p;
        for (p in mod) {
            if (!Object.prototype.hasOwnProperty.call(mod, p)) {
                continue;
            }
            if (String(mod[p] || "").trim().toLowerCase() === want) {
                return { mod: m, pageKey: parseInt(p, 10) };
            }
        }
    }
    return null;
}

/** Para getLast: mantiene el esquema .../html/modulo/... aunque html no esté en pathname */
function getLastUrlSegments() {
    var files = getFiles();
    var pathname = normalizeHref(getCoursePathname());
    var segs = parsePathSegments(pathname);
    var hi = -1;
    var i;
    for (i = 0; i < segs.length; i++) {
        if (String(segs[i]).toLowerCase() === "html") {
            hi = i;
            break;
        }
    }
    if (hi >= 0) {
        return segs.slice(hi);
    }
    var rel = getCourseRelativeSegments(files);
    if (rel.length) {
        return ["html"].concat(rel);
    }
    return ["html"];
}

function getModuloPercentage(){
    var files = getFiles();
    var hit = findCurrentPageInCourse(files);
    if (!hit || !files[hit.mod] || !isFinite(hit.pageKey) || hit.pageKey < 1) {
        return "0";
    }
    var jsonTmp = files[hit.mod];
    var totalLevel = 100 / Object.keys(jsonTmp).length;
    return (totalLevel * hit.pageKey).toFixed(0);
}

function getTotalPercentage(){
    var files = getFiles();
    var want = coursePageFileName();
    if (!want) {
        return 0;
    }
    var flat = [];
    var m;
    for (m in files) {
        if (!Object.prototype.hasOwnProperty.call(files, m)) {
            continue;
        }
        var mod = files[m];
        var keys = Object.keys(mod).sort(function (a, b) {
            return parseInt(a, 10) - parseInt(b, 10);
        });
        var ki;
        for (ki = 0; ki < keys.length; ki++) {
            flat.push(String(mod[keys[ki]] || "").trim().toLowerCase());
        }
    }
    var total = flat.length;
    if (total < 1) {
        return 0;
    }
    var idx = -1;
    var fi;
    for (fi = 0; fi < flat.length; fi++) {
        if (flat[fi] === want) {
            idx = fi + 1;
            break;
        }
    }
    if (idx < 1) {
        return 0;
    }
    var frac = idx / total;
    if (!isFinite(frac)) {
        return 0;
    }
    return Math.min(1, Math.max(0, frac));
}

function generatePage(name,count){
    var html="";
    if(name=="temario") {
        html += '<a class="btn btn-default" role="button" href="../temario/temario.html"';
    }
    if(name=="index.html"){name="";}
    if(count=="Atrás" || count== "Siguiente"){
        html+='<a class="btn btn-default" role="button" href="./'+name+'">';
    }else{
        html+='<a class="btn btn-default" role="button" id="'+(name==""?"index.html":name)+'" href="./'+name+'">';
    }
    html+='<span>'+count+'</span>';
    html+='</a>';
    return html;
}

function getLast(){
    var url_split = getLastUrlSegments();
    if (!url_split.length) {
        return "temario/";
    }
    url_split.pop();
    url_split.pop();
    var res = "";
    var flag = false;
    var i;
    for (i = url_split.length - 1; i >= 0; i--) {
        if (url_split[i].indexOf("modulo") !== -1) {
            flag = true;
            res += "../";
            break;
        }
        res += "../";
    }
    if (!flag) {
        res += "temario/";
    }
    return res;
}
function getMovementBar(){
    var res=0;

    var files=getFiles();
    var url_split = getCourseRelativeSegments(files);
    if (!url_split.length) {
        return "";
    }
    var jsonTmp=files;
    var idtmp;
    
    //Get Id
    for(var i=0;i<url_split.length;i++){
        if(!jsonTmp.hasOwnProperty(url_split[i])){
            if(i!=url_split.length-1){break;}
            if(url_split[i]==""){url_split[i]="index.html";}
            for(idtmp in jsonTmp){
                if(jsonTmp[idtmp]==url_split[i]){
                    break;
                }
            }
        }else{
            jsonTmp=jsonTmp[url_split[i]];
        }
    }
    
    // Filtrar páginas de Quiz y final para la navegación
    var filteredFiles = {};
    var filteredCount = 0;
    var originalToFiltered = {}; // Mapeo de índice original a filtrado
    var filteredToOriginal = {}; // Mapeo de índice filtrado a original
    
    for (var key in jsonTmp) {
        var pageName = jsonTmp[key];
        if (pageName.indexOf("Quiz") === -1 && pageName.indexOf("final") === -1) {
            filteredCount++;
            filteredFiles[filteredCount] = pageName;
            originalToFiltered[key] = filteredCount;
            filteredToOriginal[filteredCount] = key;
        }
    }
    
    // Si estamos en Quiz o final, no mostrar la barra de navegación numérica
    var currentPage = jsonTmp[idtmp];
    if (currentPage && (currentPage.indexOf("Quiz") !== -1 || currentPage.indexOf("final") !== -1)) {
        return ""; // No mostrar barra en Quiz o final
    }
    
    var filescount = filteredCount;
    var filteredId = originalToFiltered[idtmp];
    
    var html="";var html_back="";
    var count=0;

    //before button
    if(parseInt(filteredId)>1){
        html_back+=generatePage(filteredFiles[parseInt(filteredId)-1],"Atrás");
    }else{
        html_back+=generatePage("temario","Atrás");
    }
    
    // hay 4 archivos
    var rightmax=filescount-parseInt(filteredId);
    var leftmax=parseInt(filteredId) - 1;
    leftmax = leftmax>=2 ? 2 : leftmax;
    leftmax=rightmax>=2?leftmax:4-rightmax;
    

    //before overall max 5
    for(var left=parseInt(filteredId) - 1; left > 0 && count<leftmax;left--){
        html=generatePage(filteredFiles[left],left)+html;
        count++;
    }
    html=html_back+html;

    html=html+generatePage(filteredFiles[filteredId],parseInt(filteredId));count++;
    //after overall max 5
    for(var right=parseInt(filteredId) + 1;right<=filescount && count<5;right++){
        html=html+generatePage(filteredFiles[right],right);
        count++;
    }
    //after button: siguiente página dentro del contenido (sin Quiz/final en la barra numérica)
    if(parseInt(filteredId)+1<=filescount){
        html+=generatePage(filteredFiles[parseInt(filteredId)+1],"Siguiente");
    } else {
        // Última pantalla de contenido: la siguiente en el módulo es el Quiz, que no está en filteredFiles
        var origKey = parseInt(idtmp, 10);
        var nextKey = origKey + 1;
        if (jsonTmp[nextKey] && jsonTmp[nextKey].indexOf("Quiz") !== -1) {
            html += generatePage(jsonTmp[nextKey], "Siguiente");
        }
    }

    return html;
}

//Control de index en el navigation bar 
function getFiles() {
    var files = {
        
        modulo1: {
            1: "modulo1-1.html",
            2: "modulo1-2-1.html",
            3: "modulo1-2.html",
            4: "modulo1-2-2.html",
            5: "modulo1-3.html",
            6: "modulo1-4.html",
            7: "modulo1-5.html",
            8: "modulo1-6.html",
            9: "modulo1-7.html",
            10: "modulo1-7-2.html",
            11: "Quiz-m1.html",
            12: "modulo1-final.html",

        },
        modulo2: {
            1: "modulo2-2.html",
            2: "modulo2-3.html",
            3: "modulo2-4.html",
            4: "modulo2-5.html",
            5: "modulo2-6.html",
            6: "modulo2-7.html",
            7: "modulo2-8.html",
            8: "modulo2-9.html",
            9: "modulo2-10.html",
            10: "modulo2-11.html",
            11: "modulo2-11_1.html",
            12: "modulo2-11_2.html",
            13: "modulo2-11_3.html",
            14: "modulo2-12.html",
            15: "modulo2-13.html",
            16: "modulo2-14.html",
            17: "Quiz-m2.html",
            18: "modulo2-final.html",
        },
        modulo3: {

            1: "modulo3-2.html",
            2: "modulo3-3.html",
            3: "modulo3-4.html",
            4: "modulo3-5.html",
            5: "modulo3-5-1.html",
            6: "modulo3-5-2.html",
            7: "modulo3-6.html",
            8: "modulo3-7.html",
            9: "modulo3-7-1.html",
            10: "modulo3-7-2.html",
            11: "modulo3-8.html",
            12: "modulo3-8-1.html",
            13: "modulo3-8-2.html",
            14: "modulo3-8-3.html",
            15: "modulo3-9.html",
            16: "Quiz-m3.html",
            17: "modulo3-final.html",

        },
        modulo4: {
            1: "modulo4-2.html",
            2: "modulo4-3.html",
            3: "modulo4-4.html",
            4: "modulo4-5.html",
            5: "modulo4-6.html",
            6: "modulo4-7.html",
            7: "modulo4-8.html",
            8: "modulo4-9.html",
            9: "modulo4-10.html",
            10: "modulo4-11.html",
            11: "modulo4-12.html",
            12: "modulo4-13.html",
            13: "modulo4-14.html",
            14: "modulo4-14-3.html",
            15: "modulo4-14-4.html",
            16: "modulo4-14-1.html",
            17: "modulo4-14-2.html",
            18: "modulo4-15.html",
            19: "modulo4-15-1.html",
            20: "modulo4-16.html",
            21: "modulo4-16-1.html",
            22: "Quiz-m4.html",
            23: "modulo4-final.html",
            
        },
        modulo5: {
            1: "modulo5-2.html",
            2: "modulo5-3.html",
            3: "modulo5-4.html",
            4: "modulo5-5.html",
            5: "modulo5-5-1.html",
            6: "modulo5-6.html",
            7: "modulo5-6-1.html",
            8: "modulo5-7.html",
            9: "modulo5-8.html",
            10: "modulo5-9.html",
            11: "modulo5-10.html",
            12: "modulo5-10-1.html",
            13: "modulo5-10-2.html",
            14: "modulo5-11.html",
            15: "modulo5-12.html",
            16: "modulo5-12-1.html",
            17: "modulo5-13.html",
            18: "modulo5-14.html",
            19: "modulo5-15.html",
            20: "modulo5-16.html",
            21: "Quiz-m5.html",
            22: "modulo5-final.html",
            
        },
        modulo6: {
            1: "modulo6-2.html",
            2: "modulo6-3.html",
            3: "modulo6-4.html",
            4: "modulo6-5.html",
            5: "modulo6-6.html",
            6: "modulo6-7.html",
            7: "modulo6-7-1.html",
            8: "modulo6-7-2.html",
            9: "modulo6-8.html",
            10: "modulo6-9.html",
            11: "modulo6-9-1.html",
            12: "modulo6-9-1-1.html",
            13: "modulo6-9-2.html",
            14: "modulo6-10.html",
            15: "Quiz-m6.html",
            16: "modulo6-final.html",
            
        },
        modulo7: {
            1: "modulo7-2.html",
            2: "modulo7-3.html",
            3: "modulo7-4.html",
            4: "modulo7-4-1.html",
            5: "modulo7-5.html",
            6: "modulo7-6.html",
            7: "modulo7-6-1.html",
            8: "modulo7-7.html",
            9: "modulo7-8.html",
            10: "Quiz-m7.html",
            11: "modulo7-final.html",
            
        },
        modulo8: {
            1: "modulo8-2.html",
            2: "modulo8-3.html",
            3: "modulo8-4.html",
            4: "modulo8-5.html",
            5: "modulo8-5-1.html",
            6: "modulo8-5-1-1.html",
            7: "modulo8-6.html",
            8: "modulo8-7.html",
            9: "modulo8-7-4.html",
            10: "modulo8-7-1.html",
            11: "modulo8-7-2.html",
            12: "modulo8-7-2-1.html",
            13: "modulo8-7-3.html",
            14: "modulo8-7-3-1.html",
            15: "modulo8-8.html",
            16: "modulo8-8-2.html",
            17: "modulo8-8-3.html",
            18: "modulo8-8-1.html",
            19: "modulo8-8-4.html",
            20: "modulo8-8-5.html",
            21: "modulo8-8-6.html",
            22: "modulo8-9.html",
            23: "Quiz-m8.html",
            24: "modulo8-final.html",
        },
        modulo9: {
            1:"modulo9-2.html",
            2:"modulo9-3.html",
            3:"modulo9-4.html",
            4:"modulo9-5.html",
            5:"modulo9-5-1.html",
            6:"modulo9-6.html",
            7:"modulo9-6-2.html",
            8:"modulo9-6-1.html",
            9:"modulo9-6-1-1.html",
            10:"modulo9-7.html",
            11:"modulo9-8.html",
            12:"modulo9-8-1.html",
            13:"modulo9-8-1-1.html",
            14:"modulo9-8-2.html",
            15:"modulo9-8-2-1.html",
            16:"modulo9-9.html",
            17:"modulo9-10.html",
            18: "Quiz-m9.html",
            19: "modulo9-final.html",
        },
        modulo10: {
            1: "modulo10-2.html",
            2: "modulo10-3.html",
            3: "modulo10-4.html",
            4: "modulo10-5.html",
            5: "modulo10-5-1.html",
            6: "modulo10-6.html",
            7: "modulo10-7.html",
            8: "modulo10-7-1.html",
            9: "modulo10-7-2.html",
            10: "modulo10-8.html",
            11: "modulo10-9.html",
            12: "modulo10-10.html",
            13: "modulo10-10-2.html",
            14: "modulo10-10-1.html",
            15: "modulo10-11.html",
            16: "modulo10-11-2.html",
            17: "modulo10-11-1.html",
            18: "modulo10-11-1-2.html",
            19: "modulo10-12.html",
            20: "modulo10-12-2.html",
            21: "modulo10-12-1.html",
            22: "modulo10-13.html",
            23: "modulo10-13-1.html",
            24: "modulo10-13-2.html",
            25: "modulo10-14.html",
            26: "Quiz-m10.html",
            27: "actividad-final.html",
            28: "modulo10-final.html",
            
        },

    };
    
    return files;
}


$(document).ready(function(){
    if(isValid()){
        
        $(".btn-group").html(getMovementBar()); 
        setTimeout(function(){
            var cur = document.getElementById(getfilename());
            if (cur) {
                cur.classList.remove("btn-default");
                cur.classList.add("btn-actual-page");
            }
        },250);
    
        show(Number(getTotalPercentage()));
        let modulePercentage = getModuloPercentage();
        document.getElementsByClassName("progress-bar")[0].innerHTML = modulePercentage + "%";
        document.getElementsByClassName("progress-bar")[0].style.maxWidth = "" + modulePercentage + "%";
        document.getElementsByClassName("progress-bar")[0].style.minWidth = "" + 5 + "%";

    }

});