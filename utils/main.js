function includeHTML() {
    let z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status === 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

includeHTML();

const logout = document.getElementById('logout');

// console.log(logout)

logout.onclick = () => {
    // socket.emit('stop_cameras', true);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/logout')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({s: true}))
    xhr.onload = (e) => {
        // console.log(e)
        console.log(e.target.responseText)
        if (e.target.responseText) window.location = '/signin'
    }
    xhr.onerror = (e) => {
        console.log(e)
    }

}


function searchtoobject() {
    var search = window.location.search;
    var params = search.replace("\?", "");
    var paramsobj = {};
    params.split("&&").forEach(function (p) {
        paramsobj[p.split("=")[0]] = p.split("=")[1];
    });
    return paramsobj;
}
