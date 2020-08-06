const vscode = require('vscode');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

module.exports=async ()=>{

    // The code you place here will be executed every time your command is executed

    // Re-initialize totalTerminal to 1

    let totalTerminals=1;

    let workspace_uri=vscode.workspace.workspaceFolders[0].uri;

    // Check is no workspace is opened

    if(workspace_uri===undefined){
        vscode.window.showErrorMessage("No Active Workspace! Please open an active workspace!");
        return;
    }

    let workspace_path=workspace_uri.fsPath;

    // Get the current active editor in variable activeSourceCode

    let activeSourceCode=vscode.window.activeTextEditor;

    // If there is a active text editor opened and the variable value is not undefined :

    if(activeSourceCode){

        if(activeSourceCode.document.isDirty){
            let r = await activeSourceCode.document.save();
            if(r == false){
                vscode.window.showErrorMessage("File Could Not Be Saved");
                return;
            }
        }

        // Current Operating System
        var isWin=process.platform === "win32";

        // Get the extension of the active document

        let fileExt=activeSourceCode.document.languageId;

        // Get the file obj

        let file_obj=path.parse(activeSourceCode.document.fileName);

        // Get the fileNameWithExtension of the active document

        let fileNameWithExtension=file_obj.base;

        // Get the fileNameWithoutExtension of the active document

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
        // Get the timeLimit associated with this question

        let timeLimit=Number(fs.readFileSync(path.join(workspace_path,'testcases','constraints',fileNameWithoutExtension+'.txt')));

        // testcaseDir keeps the path to locationOfOpenedFolder/testcases/fileName (Platform Specific)

        let testcaseDir=path.join(workspace_path,"testcases",fileNameWithoutExtension);

        // fileList keeps an array of filenames in testcaseDir

        let fileList=fs.readdirSync(testcaseDir);

        // noFiles = No of files(Input+Output=1 File) in fileList

        let noFiles=fileList.length/2;

        let extDirPath=vscode.extensions.getExtension('Arpan.codetowin').extensionUri.fsPath;

        let cpp_version=vscode.workspace.getConfiguration().get('codetowin').CppVersion;
        let c_version=vscode.workspace.getConfiguration().get('codetowin').cVersion;

        // Check what terminal it is: cmd / powershell / bash

        await vscode.window.withProgress({location:vscode.ProgressLocation.Notification,title:"Parsing Test-Cases and bulding required files"},async () =>{
            if(isWin){

                //Location of cmd.exe

                let cmdLocation=path.normalize("C://Windows//System32//cmd.exe");

                // A central terminal

                let centralTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Central Terminal",shellPath:cmdLocation,hideFromUser:true});

                // Create the first background terminal for Compiling the file

                let term=vscode.window.createTerminal({cwd:workspace_path,name:"Compile File",shellPath:cmdLocation,hideFromUser:true});

                // extDir stores the uri to scripts folder witin the extension folder

                let extDir=path.join(extDirPath,"/scripts/windows");

                vscode.window.showInformationMessage("Compiling");

                // Send data to terminal to compile the current active file

                if(flags.length!=0){
                    term.sendText(`"${path.join(extDir,"cmdCompile.bat")}" ${fileExt} "${fileNameWithExtension}" "${fileNameWithoutExtension}" "${path.join(extDir,"/comm.txt")}" ${cpp_version} ${c_version} "${flags}"`,true);
                } else {
                    term.sendText(`"${path.join(extDir,"cmdCompile.bat")}" ${fileExt} "${fileNameWithExtension}" "${fileNameWithoutExtension}" "${path.join(extDir,"/comm.txt")}" ${cpp_version} ${c_version}`,true);
                }
                // Appropriate event listeners to carry on testcase run tasks and finally display the result and dispose the listener function

                let dis= vscode.window.onDidCloseTerminal(async t => {

                    totalTerminals+=1;

                    if (t.exitStatus.code === 0 && totalTerminals===2) {

                        vscode.window.showInformationMessage("Compilation Successful! Running against parsed Test Cases");

                        let runTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Run",shellPath:cmdLocation,hideFromUser:true});

                        // runTerminal.show();

                        runTerminal.sendText("@echo off",true);
                        
                        for(let i=0;i<noFiles;i++){
                            if(i===noFiles-1){
                                if(flags.length!=0){
                                    runTerminal.sendText(`"${path.join(extDir,"/cmdRun.bat")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt} "${flags}"`,true);
                                } else {
                                    runTerminal.sendText(`"${path.join(extDir,"/cmdRun.bat")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt}`,true);
                                }
                            } else {
                                if(flags.length!=0){
                                    runTerminal.sendText(`"${path.join(extDir,"/cmdRun.bat")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt} "${flags}" & `,false);
                                } else {
                                    runTerminal.sendText(`"${path.join(extDir,"/cmdRun.bat")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt}  & `,false);
                                }
                            }
                        }
                        runTerminal.sendText("exit 0",true);
                        setTimeout(() => {
                            if(runTerminal.exitStatus===undefined){
                                fs.copyFile(path.join(workspace_path,"testcases","result.txt"),path.join(extDir,"/comm.txt"),(err)=>{
                                    if(err) console.log(err);
                                });
                                // centralTerminal.sendText("@echo off && type "+path.join(workspace_path,"testcases","result.txt")+" >> "+path.join(extDir,"/comm.txt"),true);
                                // Dispose the terminal and associated Resources
                                vscode.window.showInformationMessage("ILE ! Process force exited !");
                                runTerminal.dispose();
                            }
                        },60000);

                    } else {

                        // let resultTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Result",shellPath:cmdLocation,hideFromUser:true});

                        // resultTerminal.sendText("CLS & type "+path.join(extDir+"/comm.txt"),true);

                        // resultTerminal.show();
                        fs.copyFile(path.join(extDir,"comm.txt"),path.join(workspace_path,"testcases","result.txt"),(err)=>{
                            if(err) console.log(err);
                        });
                        // centralTerminal.sendText("type "+path.join(extDir,"comm.txt")+" > "+path.join(workspace_path,"testcases","result.txt"),true);
                        let path1=vscode.Uri.file(path.join(workspace_path,'testcases','result.txt'));
                        await vscode.window.showTextDocument(path1,{preserveFocus:true,viewColumn:vscode.ViewColumn.Beside});

                        dis.dispose();

                        centralTerminal.sendText("exit",true);
                        return;
                    } 
                });
            } else  {

                let bashLocation=path.normalize("/bin/bash");

                let centralTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Central Terminal",shellPath:bashLocation,hideFromUser:true});

                // Create the first background terminal for Compiling the file

                let term=vscode.window.createTerminal({cwd:workspace_path,name:"Compile File",shellPath:bashLocation,hideFromUser:true});

                // term.show(true);

                // extDir stores the uri to scripts folder witin the extension folder

                let extDir=path.join(extDirPath,"/scripts/bashtype");

                vscode.window.showInformationMessage("Compiling");

                // Send data to terminal to compile the current active file

                if(flags.length!=0){
                    term.sendText(`source "${path.join(extDir,"/bashCompile.sh")}" ${fileExt} "${fileNameWithExtension}" "${fileNameWithoutExtension}" "${path.join(extDir,"/comm.txt")}" ${cpp_version} ${c_version} "${flags}"`,true);
                } else {
                    term.sendText(`source "${path.join(extDir,"/bashCompile.sh")}" ${fileExt} "${fileNameWithExtension}" "${fileNameWithoutExtension}" "${path.join(extDir,"/comm.txt")}" ${cpp_version} ${c_version}`,true);
                }
                // Appropriate event listeners to carry on testcase run tanks and finally display the result and dispose the listener function

                let dis= vscode.window.onDidCloseTerminal(async t => {

                    totalTerminals+=1;

                    if (t.exitStatus.code === 0 && totalTerminals===2) {

                        vscode.window.showInformationMessage("Compilation Successful! Running against parsed Test Cases");

                        let runTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Run",shellPath:bashLocation,hideFromUser:true});

                        // runTerminal.show();

                        // runTerminal.sendText("@echo off",true);

                        for(let i=0;i<noFiles;i++){
                            if(i===noFiles-1){
                                if(flags.length!=0){
                                    runTerminal.sendText(`source "${path.join(extDir,"/bashRun.sh")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt} "${flags}"`,true);
                                } else {
                                    runTerminal.sendText(`source "${path.join(extDir,"/bashRun.sh")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt}`,true);
                                }
                            } else {
                                if(flags.length!=0){
                                    runTerminal.sendText(`source "${path.join(extDir,"/bashRun.sh")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt} "${flags}" ; `,false);
                                } else {
                                    runTerminal.sendText(`source "${path.join(extDir,"/bashRun.sh")}" "${fileNameWithoutExtension}" "${path.join(testcaseDir,fileList[i])}" "${path.join(testcaseDir,fileList[i+noFiles])}" "${path.join(workspace_path,"/testcases/result.txt")}" "${path.join(extDir,"/comm.txt")}" ${(i+1)} ${timeLimit} ${fileExt} ; `,false);
                                }
                            }
                        }
                        runTerminal.sendText("exit 0",true);
                        // runTerminal.sendText("echo 'done'",true);
                        setTimeout(() => {
                            if(runTerminal.exitStatus===undefined){
                                fs.copyFile(path.join(workspace_path,"/testcases/result.txt"),path.join(extDir,"/comm.txt"),(err)=>{
                                    if(err) console.log(err);
                                });
                                // centralTerminal.sendText("cat "+path.join(workspace_path,"/testcases/result.txt")+" >> "+path.join(extDir,"/comm.txt"),true);
                                // Dispose the terminal and associated Resources
                                runTerminal.dispose();
                                vscode.window.showInformationMessage("ILE ! Process force exited !");
                            }
                        },60000);

                    } else {

                        // let resultTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Result",shellPath:bashLocation,hideFromUser:true});

                        // resultTerminal.sendText("clear ; cat"+" "+path.join(extDir,"comm.txt"),true);

                        // resultTerminal.show();
                        fs.copyFile(path.join(extDirPath,'scripts','bashtype','comm.txt'),path.join(workspace_path,'testcases','result.txt'),(err)=>{
                            if(err) console.log(err);
                        });
                        // centralTerminal.sendText("cp "+path.join(extDirPath,'scripts','bashtype','comm.txt')+" "+path.join(workspace_path,'testcases','result.txt'),true);
                        let path1=vscode.Uri.file(path.join(workspace_path,'testcases','result.txt'));
                        await vscode.window.showTextDocument(path1,{preserveFocus:true,viewColumn:vscode.ViewColumn.Beside});

                        dis.dispose();

                        centralTerminal.sendText("exit",true);
                        return;
                    } 
                });
            }
        });
    }
}