
const languageLinks = document.querySelectorAll('.nav_links li');
const selectedLangIcon = document.querySelector('#language_icon');
const analyzeButton = document.querySelector('#btn_analyze');
const stopButton = document.querySelector('#btn_stop');
const runButton = document.querySelector('#btn_run');
const output = document.querySelector('.output');
const toggle = document.querySelector('.toggle');
let selectedLanguage = 'python';
let activeMarkers = [];
let editor;

import { findCodeSmells } from './code-smell-finder.js';

const languages = {
    javascript: {cssClass:'fa-js-square', aceMode: 'javascript', id: 'javascript'},
    python: {cssClass:'fa-python', aceMode: 'python', id: 'python'},
    java: {cssClass:'fa-java', aceMode: 'java', id: 'java'},
    php: {cssClass:'fa-php', aceMode: 'php', id: 'php'},
};

window.onload = function() {
    editor = ace.edit('editor');
    editor.setTheme('ace/theme/monokai');
    editor.setShowPrintMargin(false);
    editor.setOptions({fontSize: '16px'});
    editor.getSession().on('change', function() { clearMarkers() });
    selectLanguage(selectedLanguage);
}

function selectLanguage(l) {
    output.innerHTML = 'Output:';
    selectedLanguage = l;
    selectedLangIcon.setAttribute('class', `fab ${languages[l].cssClass} fa-sm`);
    editor.session.setMode(`ace/mode/${languages[l].aceMode}`);
    setLinkSelection(languages[l].id);
    clearMarkers();
}

function setLinkSelection(languageId) {
    languageLinks.forEach(link => {
        if(link.id === languageId)
            link.classList.add('nav_link_selected');
        else
            link.classList.remove('nav_link_selected');
    });
}

languageLinks.forEach(link => 
    link.addEventListener('click', lang => {
        selectLanguage(lang.target.id);
    })
);

toggle.addEventListener('change', e => {
    if(e.target.checked){
        editor.setTheme('ace/theme/chrome');
    } else {
        editor.setTheme('ace/theme/monokai');
    }
});

analyzeButton.addEventListener('click', () => {
    clearMarkers();
    const code = editor.session.getValue();
    let result = findCodeSmells(code, selectedLanguage);
    
    output.innerHTML = result.text;

    if(result.lines.length > 0 )
        markLines(result.lines);    
});

runButton.addEventListener('click', () => {
    output.innerHTML = 'Output:';
    
    clearMarkers();

    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        var data = JSON.parse(this.responseText);
        output.innerHTML = data.result;
    }

    xhr.open('POST', 'http://localhost:3000/compile');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify( { language: selectedLanguage, code: editor.session.getValue() } ));
});

stopButton.addEventListener('click', () => {
    output.innerHTML = 'Execução do código interrompida';
    clearMarkers();
});

function markLines(lines) {
    let Range = ace.require('ace/range').Range;

    lines.forEach(l => {
        let marker = editor.session.addMarker(new Range(l, 0, l, 2000), "warning", "line", true);
        activeMarkers.push(marker);
    });
}

function clearMarkers() {
    activeMarkers.forEach(m => {
        editor.getSession().removeMarker(m);
    });
}