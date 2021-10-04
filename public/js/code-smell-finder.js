
export function findCodeSmells(code, language) {
    const lines = code.split('\n');
    let codeSmellCount = 0;
    let codeSmellTxtLines = '';
    const result = {text: '', lines: []};

    lines.forEach((line, i) => { 
        if(findLongListParamSmell(line , language)){
            codeSmellCount ++;
            result.lines.push(i);
            codeSmellTxtLines += `<br>&emsp;&emsp;Tipo: Lista de parâmetros longa | Linha: ${i+1}`;
        }
        if(findLongLineSmell(line)){
            codeSmellCount ++;
            result.lines.push(i);
            codeSmellTxtLines += `<br>&emsp;&emsp;Tipo: Linha longa | Linha: ${i+1}`;
        }
    });

    result.text = `<p>Code smells detectados [${codeSmellCount}]: ${codeSmellTxtLines}</p>`;

    return result;
}

function findLongListParamSmell(line, language){
    if(language === 'python')
        return findLongListParamSmellPython(line);
    if(language === 'javascript')
        return findLongListParamSmellJavascript(line);
    if(language === 'php')
        return findLongListParamSmellPHP(line);
    if(language === 'java')
        return findLongListParamSmellJava(line);
    else
        return false;
}

function findLongListParamSmellPython(line) {
    if(line.includes('def') && line.includes('(') && line.split(",").length >= 5) {
        return true;
    }
}

function findLongListParamSmellJavascript(line) {
    if(line.includes('function') && line.includes('(') && line.split(",").length >= 5) {
        return true;
    }
}

function findLongListParamSmellPHP(line) {
    if(line.includes('function') && line.includes('(') && line.split(",").length >= 5) {
        return true;
    }
}

function findLongListParamSmellJava(line) {
    if((line.includes('public') || line.includes('private')) && line.includes('(') && line.split(",").length >= 5) {
        return true;
    }
}

function findLongLineSmell(line) { 
    if(line.length >= 80){
        return true;
    }
}