
const days = 7;

// Funzione per impostare un cookie
function setCookie(name, value) {
    // Crea una data di scadenza per il cookie
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // Imposta il cookie nel browser
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Funzione per ottenere il valore di un cookie
function getCookie(name) {
    // Ottiene tutti i cookie presenti nel documento
    const cookieArray = document.cookie.split(';');

    // Itera attraverso i cookie per trovare quello con il nome specificato
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        // Se trova un cookie con il nome specificato, restituisce il suo valore
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }

    // Se non trova il cookie, restituisce null
    return null;
}



export default { setCookie, getCookie };