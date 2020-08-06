const vscode = require('vscode');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

module.exports=async ()=>{
    var isWin=process.platform === "win32";
    let cpp_version=vscode.workspace.getConfiguration().get('codetowin').CppVersion;
    let c_version=vscode.workspace.getConfiguration().get('codetowin').cVersion;
    let workspace_uri=vscode.workspace.workspaceFolders[0].uri;
    if(workspace_uri){
        let workspace_path=workspace_uri.fsPath;
        let activeSourceCode=vscode.window.activeTextEditor;
        if(activeSourceCode){
            if(activeSourceCode.document.isDirty){
                let r = await activeSourceCode.document.save();
                if(r == false){
                    vscode.window.showErrorMessage("File Could Not Be Saved");
                    return;
                }
            }
            let fileExt=activeSourceCode.document.languageId;
            let file_obj=path.parse(activeSourceCode.document.fileName);
            let fileNameWithExtension=file_obj.base;
            let fileNameWithoutExtension=file_obj.name;
            let flags="";
            if(fileExt==="c"){
                flags=vscode.workspace.getConfiguration('codetowin').flags.c;
            } else if (fileExt==="cpp"){
                flags=vscode.workspace.getConfiguration('codetowin').flags.cpp;
            } else if (fileExt==="java"){
                flags=vscode.workspace.getConfiguration('codetowin').flags.java;
            } else if (fileExt==="python"){
                flags=vscode.workspace.getConfiguration('codetowin').flags.python;
            } else {
                vscode.window.showErrorMessage("Source Code Language not yet added in Code To Win extension! Sorry!");
                return;
            }
            // make a new terminal
            if(isWin){
                let cmdLocation=path.normalize("C://Windows//System32//cmd.exe");
                let terminal=vscode.window.createTerminal({
                    cwd:workspace_path,
                    name:"Compile And Run",
                    shellPath:cmdLocation
                });
                let compileText="";
                terminal.show(true);
                if(fileExt==='cpp'){
                    if(flags.length!=0){
                        compileText=`g++ "${flags}" -std=${cpp_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  "${fileNameWithoutExtension}"  && echo.`;
                    } else {
                        compileText=`g++ -std=${cpp_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  "${fileNameWithoutExtension}"  && echo.`;
                    }
                    terminal.sendText(compileText,true);
                } else if (fileExt==='c') {
                    if(flags.length!=0){
                        compileText=`gcc "${flags}" -std=${c_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  "${fileNameWithoutExtension}"  && echo.`;
                    } else {
                        compileText=`gcc -std=${c_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  "${fileNameWithoutExtension}"  && echo.`;
                    }   
                    terminal.sendText(compileText,true);
                } else if (fileExt==='java'){
                    if(flags.length!=0){
                        compileText=`javac "${flags}" "${fileNameWithExtension}"  && java "${fileNameWithoutExtension}"`;
                    } else {
                        compileText=`javac "${fileNameWithExtension}"  && java "${fileNameWithoutExtension}"`;
                    }
                    terminal.sendText(compileText,true);
                } else if (fileExt==='python'){
                    if(flags.length!=0){
                        compileText=`py "${flags}" "${fileNameWithExtension}"`;
                    } else {
                        compileText=`py "${fileNameWithExtension}"`;
                    }
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
                let compileText="";
                terminal.show(true);
                if(fileExt==='cpp'){
                    if(flags.length!=0){
                        compileText=`g++ "${flags}" -std=${cpp_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  ./"${fileNameWithoutExtension}"  && echo`;
                    } else {
                        compileText=`g++ -std=${cpp_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  ./"${fileNameWithoutExtension}"  && echo`;
                    }
                    terminal.sendText(compileText,true);
                } else if (fileExt==='c') {
                    if(flags.length!=0){
                        compileText=`gcc "${flags}" -std=${c_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  ./"${fileNameWithoutExtension}"  && echo`;
                    } else {
                        compileText=`gcc -std=${c_version} "${fileNameWithExtension}" -o "${fileNameWithoutExtension}"  &&  ./"${fileNameWithoutExtension}"  && echo`;
                    }   
                    terminal.sendText(compileText,true);
                } else if (fileExt==='java'){
                    if(flags.length!=0){
                        compileText=`javac "${flags}" "${fileNameWithExtension}"  && java "${fileNameWithoutExtension}"`;
                    } else {
                        compileText=`javac "${fileNameWithExtension}"  && java "${fileNameWithoutExtension}"`;
                    }
                    terminal.sendText(compileText,true);
                } else if (fileExt==='python'){
                    if(flags.length!=0){
                        compileText=`python3 "${flags}" "${fileNameWithExtension}"`;
                    } else {
                        compileText=`python3 "${fileNameWithExtension}"`;
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