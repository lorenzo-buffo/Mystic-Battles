// import { EN_US, ES_AR } from '../enums/languages';
const ES_AR = 'es-AR';
const EN_US = 'en-US';

const PROJECT_ID = 'cm22m0m9k0002ewmloapfvv3n';
let translations = null;
let language = ES_AR;


export async function getTranslations(lang, callback) {//Esta función obtiene las traducciones desde la API y las almacena en localStorage.
    localStorage.clear();//borra cualquier traduccion almacenada en el navegador
    translations = null; //resetea la variable translations eliminando traducciones previas
    language = lang; //cambia el idioma actual al que se paso como argumento
    if (language === ES_AR) {
        return callback ? callback() : false;
    }
    
   

    return await fetch(`https://traducila.vercel.app/api/translations/${PROJECT_ID}/${language}`)// si el idioma no es español hace la solicitud a la api
    .then(response => response.json())//  la respuesta se convierte en formato json
    .then(data => {
        localStorage.setItem('translations', JSON.stringify(data));// guarda las traducciones en en el almacenamiento local del navegador
        translations = data;//Guarda las traducciones en la variable
        if(callback) callback()//Si se proporcionó un callback, lo ejecuta una vez que las traducciones han sido obtenidas
    });
}




export function getPhrase(key) { // funcion devuelve la traduccion correspondiente a una clave de terxto
    if (!translations) {
        const locals = localStorage.getItem('translations');
        translations = locals ? JSON.parse(locals) : null;
    }

    let phrase = key;
    if (translations && translations[key]) {
        phrase = translations[key];
    }

    return phrase;
}






function isAllowedLanguge(language) {
    const allowedLanguages = [ES_AR, EN_US, PT_BR, DE_DE];
    return allowedLanguages.includes(language);
}


export function getLanguageConfig() {//Esta función intenta determinar qué idioma debe usarse
    let languageConfig;

    // Obtener desde la URL el idioma
    console.log(window.location.href)

    const path = window.location.pathname !== '/' ? window.location.pathname : null;// Obtiene la parte de la URL que indica la ruta de la página
    const params = new URL(window.location.href).searchParams;//Obtiene los parámetros de la URL
    const queryLang = params.get('lang');//Busca el valor del parámetro lang en la URL.
 
    

    languageConfig = path ?? queryLang;

    if (languageConfig) {
        if (isAllowedLanguge(languageConfig)) {
            return languageConfig;
        }
    }
    //Si languageConfig tiene un valor y está en la lista de idiomas permitidos, lo devuelve como idioma seleccionado.
    const browserLanguage = window.navigator.language;//Obtiene el idioma del navegador del usuario
    if (isAllowedLanguge(browserLanguage)) {
        return browserLanguage;
    }

    return ES_AR;
    //Si no se encontró un idioma válido en la URL ni en el navegador, usa ES_AR
}