const vscode = require('vscode');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

const cfscrapper= require('../parser/codeforces.js');
const ccscraper=require('../parser/codechef.js');

module.exports=async function () {
    // The code you place here will be executed every time your command is executed

    // Path to my VSCode Opened folder/Workspace in vscode.Uri

    let workspace_uri_path=vscode.workspace.workspaceFolders[0].uri;

    if(workspace_uri_path == undefined){
        vscode.window.showErrorMessage("No Active Workspace/Folder");
        return;
    }

    // Converting vscode.Uri to humanreadable path in string

    let workspace_path=workspace_uri_path.fsPath;

    // Create the testcase directory wihin your workspace Folder (Can use either vscode.workspace.fs or generic node fs)
    // Also create the rsult.txt file where your program output will be saved.

    fs.mkdir(path.join(workspace_path,"testcases"),(err)=>{console.log(err)});
    fs.mkdir(path.join(workspace_path,"testcases","constraints"),err => {console.log(err)});
    fs.writeFile(path.join(workspace_path,"testcases","result.txt"),"Empty Result File",err => console.log(err));

    // User input for contest dashboard

    let contest,lang;

    let inputBoxOpt={placeHolder:"Contest URL", prompt:"Enter the Contest Dashboard URL",ignoreFocusOut:true};
    await vscode.window.showInputBox(inputBoxOpt).then(result => { contest=result });
    // @ts-ignore
    if(contest===undefined || contest.length===0 ){
        return;
    }

    // Language in which your solution files will be in:

    let arr=["Custom","C","C++","Java","Python"];

    // Quick Pick to select language in which solution files will be written:

    await vscode.window.showQuickPick(arr,{ignoreFocusOut:true, placeHolder:"Select a Language in which your will write your solution",onDidSelectItem: choice =>{ lang = choice}});

    if(lang===undefined){
        lang="Custom";
    }

    let ext;
    if(lang==="Custom")  ext=undefined;
    else if(lang === "C") ext=".c";
    else if(lang === "C++") ext=".cpp";
    else if(lang === "Python") ext=".py";
    else if(lang === "Java") ext=".java";

    // vscode.window.showInformationMessage("Parsing Test-Cases and bulding required files");

    // ----- Scraping & generating I/O files (await is using to introduce delay while it Scraps for data) ------

    // Progress notification
    await vscode.window.withProgress({location:vscode.ProgressLocation.Notification,title:"Parsing Test-Cases and bulding required files"},async () =>{
        if(contest.indexOf("codechef.com")==-1){
            await cfscrapper(workspace_path,contest,ext);
        } else {
            await ccscraper(workspace_path,contest,ext);
        }
    });

    vscode.window.showInformationMessage('All Ready To GO!');
}