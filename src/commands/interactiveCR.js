const vscode = require('vscode');
const pptr=require('puppeteer');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

module.exports=()=>{
    var isWin=process.platform === "win32";
    let cpp_version=vscode.workspace.getConfiguration().get('codetowin').CppVersion;
    let c_version=vscode.workspace.getConfiguration().get('codetowin').cVersion;
    let workspace_uri=vscode.workspace.workspaceFolders[0].uri;
    if(workspace_uri){
        let workspace_path=workspace_uri.fsPath;
        let activeSourceCode=vscode.window.activeTextEditor;
        if(activeSourceCode){
            let fileExt=activeSourceCode.document.languageId;
            let file_obj=path.parse(activeSourceCode.document.fileName);
            let fileNameWithExtension=file_obj.base;
            let fileNameWithoutExtension=file_obj.name;

            // make a new terminal
            let platform=vscode.workspace.getConfiguration().get('codetowin').terminal;
            if(isWin){
                let cmdLocation=path.normalize("C://Windows//System32//cmd.exe");
                let terminal=vscode.window.createTerminal({
                    cwd:workspace_path,
                    name:"Compile And Run",
                    shellPath:cmdLocation
                });
                terminal.show(true);
                if(fileExt==='cpp'){
                    let compileText='g++ -g -w -std='+cpp_version+' '+fileNameWithExtension+" -o "+fileNameWithoutExtension+" && "+fileNameWithoutExtension+" && "+"echo.";
                    terminal.sendText(compileText,true);
                } else if (fileExt==='c') {
                    let compileText='gcc -w -std='+c_version+" "+fileNameWithExtension+" -o "+fileNameWithoutExtension+" && "+fileNameWithoutExtension+" && "+"echo.";
                    terminal.sendText(compileText,true);
                } else if (fileExt==='java'){
                    let compileText='javac '+fileNameWithExtension+" && java "+fileNameWithoutExtension;
                    terminal.sendText(compileText,true);
                } else if (fileExt==='python'){
                    let compileText='py ' +fileNameWithExtension;
                    terminal.sendText(compileText,true);
                } else {
                    vscode.window.showErrorMessage("Source Code Language not yet added in codetowin extension! Sorry!");
                    return;
                }
            } else {
                let bashLocation=path.normalize("/bin/bash");
                let terminal=vscode.window.createTerminal({
                    cwd:workspace_path,
                    name:"Compile And Run",
                    shellPath:bashLocation
                });
                terminal.show(true);
                if(fileExt==='cpp'){
                    let compileText='g++ -g -w -std='+cpp_version+" "+fileNameWithExtension+" -o "+fileNameWithoutExtension+" && "+"./"+fileNameWithoutExtension+" && "+"echo";
                    terminal.sendText(compileText,true);
                } else if (fileExt==='c') {
                    let compileText='gcc -w -std='+c_version+" "+fileNameWithExtension+" -o "+fileNameWithoutExtension+" && "+"./"+fileNameWithoutExtension+" && "+"echo";
                    terminal.sendText(compileText,true);
                } else if (fileExt==='java'){
                    let compileText='javac '+fileNameWithExtension+" && java "+fileNameWithoutExtension;
                    terminal.sendText(compileText,true);
                } else if (fileExt==='python'){
                    let compileText;
                    if(isWin){
                        compileText='py ' +fileNameWithExtension;
                    } else {
                        compileText='python3 ' +fileNameWithExtension;
                    }
                    terminal.sendText(compileText,true);
                } else {
                    vscode.window.showErrorMessage("Source Code Language not yet added in codetowin extension! Sorry!");
                    return;
                }
            }
        }
    }
}