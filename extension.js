// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const pptr=require('puppeteer');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');

let global_infoArr=[],contest,lang,totalTerminals=0;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

 // Returns the number of items in an Object

function countProperties(obj) {
    return Object.keys(obj).length;
}

// Scrapper Code. Works only for CodeForces Currently
async function scrapper(workspace_path,contest,ext){

	let infoArr=[]; // An Array to keep the details of the problem

	const browser= await pptr.launch();
	const page= await browser.newPage();

	await page.tracing.start({
		path:'trace.json',
		categories:['devtools.timeline']
	});

	//Contest Site
	await page.goto(contest);

	// execute standard javascript in the context of the page.
	let questionsObjectList = await page.$$eval('.problems tr td:nth-of-type(1)', problems => { return problems.map(x => (x.textContent).trim())});
	for(var i=0;i<countProperties(questionsObjectList);i++){
		
		// Problem X Page
		let newURL=contest+"/problem/"+questionsObjectList[i];
		await page.goto(newURL);

		let info,start,info_i,timeLimit,memoryLimit,input=[],output=[];

		// Getting the time limit for the problem

		info=await page.$$eval('.time-limit',x => {
			return x.map( y => y.innerText);
		});
		start=info[0].indexOf('test'),info_i;
		start=start+4;
		for(info_i=start;info[0][info_i]!=' ';info_i++);
		timeLimit=Number(info[0].slice(start,info_i));

		// Getting the memory Limit for the problem

		info=await page.$$eval('.memory-limit',x => {
			return x.map( y => y.innerText);
		});
		start=info[0].indexOf('test'),info_i;
		start=start+4;
		for(info_i=start;info[0][info_i]!=' ';info_i++);
		memoryLimit=Number(info[0].slice(start,info_i));

		// Getting Input

		input=await page.$$eval('.input pre',x => {
			return x.map( y => y.innerText);
		});

		// Getting Output

		output=await page.$$eval('.output pre', x => {
			return x.map(y=>y.innerText);
		});

	// Pushing the gathered data about a problem to a Array

		infoArr.push({
			problem:questionsObjectList[i],
			timeLimit:timeLimit,
			memlimit:memoryLimit,
			input:input,
			output:output
		});

		global_infoArr=infoArr;
	}

	await page.tracing.stop();
	await browser.close();

	// Create the input output files of each problem

	for(let i=0;i<infoArr.length;i++){

		// Create solution File in the workspace directory
		if(ext)
			fs.writeFile((workspace_path+"/"+infoArr[i].problem+ext),"// Code Here",err => {console.log(err)});

		// Create Directory inside testcases folder for each problem

		fs.mkdir(workspace_path+'/testcases/'+infoArr[i].problem,err =>{console.log(err)});
		
		// Base Path where to create the files

		let inPath=workspace_path+'/testcases/'+infoArr[i].problem+"/";

		// Creating testcase input (.txt) files for Problem (i+1)

		for(let j=0;j<infoArr[i].input.length;j++){
			fs.writeFile((inPath+infoArr[i].problem+"_input_"+(j+1)+".txt"),(infoArr[i].input)[j],err=>{ console.log(err)});
		}

		// Creating testcase output (.txt) files for Problem (i+1)  
		
		for(let j=0;j<infoArr[i].output.length;j++){
			fs.writeFile((inPath+infoArr[i].problem+"_output_"+(j+1)+".txt"),(infoArr[i].output)[j],err => console.log(err));
		}
	}

	global_infoArr=infoArr;
}

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codetowin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand('codetowin.newContest',async function () {
		// The code you place here will be executed every time your command is executed

		vscode.window.showInformationMessage("Initializing....")

		// Path to my VSCode Opened folder/Workspace in vscode.Uri

		let workspace_uri_path=vscode.workspace.workspaceFolders[0].uri;

		// Converting vscode.Uri to humanreadable path in string

		let workspace_path=workspace_uri_path.fsPath;

		// Create the testcase directory wihin your workspace Folder (Can use either vscode.workspace.fs or generic node fs)
		// Also create the rsult.txt file where your program output will be saved.

		fs.mkdir((workspace_path+"/testcases"),(err)=>{console.log(err)});
		fs.writeFile((workspace_path+"/testcases/result.txt"),"Empty Result File",err => console.log(err));

		// For Now, Extension will work only for CodeForces

		// User input for contest dashboard

		let inputBoxOpt={placeHolder:"Contest URL", prompt:"Enter the Contest Dashboard URL",ignoreFocusOut:true};
		await vscode.window.showInputBox(inputBoxOpt).then(result => { contest=result });

		// Language in which your solution files will be in:

		let arr=["Custom","C","C++","Java","Python"];

		// Quick Pick to select language in which solution files will be written:

		await vscode.window.showQuickPick(arr,{ignoreFocusOut:true, placeHolder:"Select a Language in which your will write your solution",onDidSelectItem: choice =>{ lang = choice}});

		let ext;
		if(lang==="Custom")  ext=undefined;
		else if(lang === "C") ext=".c";
		else if(lang === "C++") ext=".cpp";
		else if(lang === "Python") ext=".py";
		else if(lang === "Java") ext=".java";

		vscode.window.showInformationMessage("Parsing Test-Cases and bulding required files");

		// ----- Scraping & generating I/O files (await is using to introduce delay while it Scraps for data) ------

		await scrapper(workspace_path,contest,ext);

		//console.log(global_infoArr);

		vscode.window.showInformationMessage('All Ready To GO!');
	});

	let disposable_2=vscode.commands.registerCommand('codetowin.compileRun',async ()=>{

		// The code you place here will be executed every time your command is executed

		// Re-initialize totalTerminal to 0

		totalTerminals=1;

		let workspace_uri=vscode.workspace.workspaceFolders[0].uri;

		// Check is no workspace is opened

		if(workspace_uri===undefined){
			vscode.window.showInformationMessage("No Active Workspace! Please open an active workspace!");
			return;
		}

		let workspace_path=workspace_uri.fsPath;

		// Get the current active editor in variable activeSourceCode

		let activeSourceCode=vscode.window.activeTextEditor;

		// If there is a active text editor opened and the variable value is not undefined :

		if(activeSourceCode){

			// Get the extension of the active document

			let fileExt=activeSourceCode.document.languageId;

			// Get the fileNameWithExtension of the active document

			let fileNameWithExtension=activeSourceCode.document.fileName;
			fileNameWithExtension=fileNameWithExtension.slice(workspace_path.length+1);

			// Get the fileNameWithoutExtension of the active document

			let fileNameWithoutExtension=fileNameWithExtension.slice(0,fileNameWithExtension.indexOf('.'));

			// Get the timeLimit associated with this question

			let timeLimit;

			for(let i=0;i<global_infoArr.length;i++){
				if(global_infoArr[i].problem === fileNameWithoutExtension){
					timeLimit=global_infoArr[i].timeLimit;
					break;
				}
			}

			// testcaseDir keeps the path to locationOfOpenedFolder\\testcases\\fileName

			let testcaseDir=(workspace_path+"\\testcases\\"+fileNameWithoutExtension);

			// fileList keeps an array of filenames in testcaseDir

			let fileList=fs.readdirSync((workspace_path+"\\testcases\\"+fileNameWithoutExtension));

			// noFiles = No of files(Input+Output=1 File) in fileList

			let noFiles=fileList.length/2;

			let extDirPath=vscode.extensions.getExtension('Arpan.codetowin').extensionUri.fsPath
			
			// Check what terminal it is: cmd / powershell / bash

			if(vscode.workspace.getConfiguration().get('codetowin').terminal==="cmd"){

				// A central terminal

				let centralTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Central Terminal",shellPath:"C:\\Windows\\System32\\cmd.exe",hideFromUser:true});

				// Create the first background terminal for Compiling the file

				let term=vscode.window.createTerminal({cwd:workspace_path,name:"Compile File",shellPath:"C:\\Windows\\System32\\cmd.exe",hideFromUser:true});

				// extDir stores the uri to scripts folder witin the extension folder

				let extDir=extDirPath+"\\scripts\\windows";

				vscode.window.showInformationMessage("Compiling");

				// Send data to terminal to compile the current active file

				term.sendText(extDir+"\\cmdCompile.bat"+" "+fileExt+" "+fileNameWithExtension+" "+fileNameWithoutExtension+" "+extDir+"\\comm.txt",true);

				// Appropriate event listeners to carry on testcase run tanks and finally display the result and dispose the listener function

				let dis= vscode.window.onDidCloseTerminal(t => {

					totalTerminals+=1;

					if (t.exitStatus.code === 0 && totalTerminals===2) {

						let runTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Run",shellPath:"C:\\Windows\\System32\\cmd.exe",hideFromUser:true});

						runTerminal.show();

						runTerminal.sendText("@echo off",true);

						for(let i=0;i<noFiles;i++){

							runTerminal.sendText(extDir+"\\cmdRun.bat"+" "+fileNameWithoutExtension+" "+testcaseDir+"\\"+fileList[i]+" "+testcaseDir+"\\"+fileList[i+noFiles]+" "+workspace_path+"\\testcases\\result.txt"+" "+extDir+"\\comm.txt"+" "+(i+1)+" "+timeLimit+" && ",false);

						}
						runTerminal.sendText("exit 0",true);
						setTimeout(() => {
							if(runTerminal){

								centralTerminal.sendText("@echo off && type "+workspace_path+"\\testcases\\result.txt"+" >> "+extDir+"\\comm.txt",true);
								// Dispose the terminal and associated Resources
								runTerminal.dispose();
							}
						},60000);

					} else {

						let resultTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Result",shellPath:"C:\\Windows\\System32\\cmd.exe",hideFromUser:true});

						resultTerminal.sendText("CLS && type"+" "+extDir+"\\comm.txt",true);

						resultTerminal.show();

						dis.dispose();

						centralTerminal.dispose();
					} 
				});
			} else if(vscode.workspace.getConfiguration().get('codetowin').terminal==="bash") {
				// A central terminal

				let centralTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Central Terminal",shellPath:"/bin/bash",hideFromUser:true});

				// Create the first background terminal for Compiling the file

				let term=vscode.window.createTerminal({cwd:workspace_path,name:"Compile File",shellPath:"/bin/bash",hideFromUser:true});

				// extDir stores the uri to scripts folder witin the extension folder

				let extDir=extDirPath+"\\scripts\\bashtype";

				vscode.window.showInformationMessage("Compiling");

				// Send data to terminal to compile the current active file

				term.sendText(extDir+"\\cmdCompile.bat"+" "+fileExt+" "+fileNameWithExtension+" "+fileNameWithoutExtension+" "+extDir+"\\comm.txt",true);

				// Appropriate event listeners to carry on testcase run tanks and finally display the result and dispose the listener function

				let dis= vscode.window.onDidCloseTerminal(t => {

					totalTerminals+=1;

					if (t.exitStatus.code === 0 && totalTerminals===2) {

						let runTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Run",shellPath:"C:\\Windows\\System32\\cmd.exe",hideFromUser:true});

						runTerminal.show();

						runTerminal.sendText("@echo off",true);

						for(let i=0;i<noFiles;i++){

							runTerminal.sendText(extDir+"\\cmdRun.bat"+" "+fileNameWithoutExtension+" "+testcaseDir+"\\"+fileList[i]+" "+testcaseDir+"\\"+fileList[i+noFiles]+" "+workspace_path+"\\testcases\\result.txt"+" "+extDir+"\\comm.txt"+" "+(i+1)+" "+timeLimit+" && ",false);

						}
						runTerminal.sendText("exit 0",true);
						setTimeout(() => {
							if(runTerminal){

								centralTerminal.sendText("@echo off && type "+workspace_path+"\\testcases\\result.txt"+" >> "+extDir+"\\comm.txt",true);
								// Dispose the terminal and associated Resources
								runTerminal.dispose();
							}
						},60000);

					} else {

						let resultTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Result",shellPath:"C:\\Windows\\System32\\cmd.exe",hideFromUser:true});

						resultTerminal.sendText("CLS && type"+" "+extDir+"\\comm.txt",true);

						resultTerminal.show();

						dis.dispose();

						centralTerminal.dispose();
					} 
				});
			}
		}
	});

	context.subscriptions.push(disposable,disposable_2);
	// context.subscriptions.push(disposable_2);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
