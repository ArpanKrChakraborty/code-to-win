const vscode = require('vscode');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

module.exports = async ()=>{
    // console.log(vscode.workspace.getConfiguration('codetowin'));
    let extDir=vscode.extensions.getExtension('Arpan.codetowin').extensionUri.fsPath;
    let snippetDir=vscode.workspace.getConfiguration('codetowin').snippets;
    snippetDir=path.normalize(snippetDir);
    let snippetContent;
    if(fs.existsSync(snippetDir)){
        snippetContent=fs.readdirSync(snippetDir);
    } else {
        vscode.window.showErrorMessage("No Such File Or Directory found!");
        return;
    }
    await vscode.window.withProgress({location:vscode.ProgressLocation.Notification,title:"Adding/Updating Snippets"},async () =>{
        for(let i=0;i<snippetContent.length;i++){
            if(snippetContent[i].indexOf('.txt')!=-1 && (snippetContent[i] === "cpp.txt" || snippetContent[i] === "c.txt" || snippetContent[i] === "python.txt" || snippetContent[i] === "java.txt")){
                let snippetName=snippetContent[i].slice(0,snippetContent[i].indexOf('.txt'));
                let rawSnippet=fs.readFileSync(path.join(snippetDir,snippetContent[i])).toString();
                console.log(rawSnippet);
                // escape " with \"
                // split lines by line-break
                  
                let sepSnippet=rawSnippet.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r/g,"").split("\n");
                const separatedSnippetLength=sepSnippet.length;

                // add double quotes around each line apart from the last one

                const newSnippet = sepSnippet.map((line, index) => {
                    return index === separatedSnippetLength - 1 ? `\"${line}\"` : `\"${line}\",`;
                });

                let jsonSnip=`{"${snippetName}":{"prefix": "!cp","body": [ ${newSnippet.join("\n")} ],"description": "Competitive Coding Snippet"}}`;
                //jsonSnip.replace(/\n/g,jsonSnip);
                let jsonobj=JSON.parse(jsonSnip)
                fs.writeFileSync(path.join(extDir,'snippets',snippetName+".json"),JSON.stringify(jsonobj,null,4));
            }
        }
        return
    });
    vscode.window.showInformationMessage("Please restart VSCode for changes to take effect");
}