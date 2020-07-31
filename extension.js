// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const pptr=require('puppeteer');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

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
async function ccscraper(workspace_path,contest,ext){
	let infoArr=[]; // An Array to keep the details of the problems

	const browser= await pptr.launch();
	const page= await browser.newPage();

	await page.tracing.start({
		path:'trace.json',
		categories:['devtools.timeline']
	});

	//Contest Site
	await page.goto(contest);

	// execute standard javascript in the context of the page.

	let questionsObjectList = await page.$$eval('.problem-table .dataTable tbody tr td:nth-of-type(2)', problems => { return problems.map(x => (x.textContent).trim())});
	for(var i=0;i<countProperties(questionsObjectList);i++){
		
		// Problem X Page
		let newURL=contest+"/problems/"+questionsObjectList[i];
		await page.goto(newURL);

		let info,start,info_i,timeLimit,memoryLimit,input=[],output=[];

		// Getting the time limit for the problem
		
		let problem_info=info=await page.$$eval('.problem-info p',x => {
			return x.map( y => (y.innerText).trim());
		});

		let problem_info_l=countProperties(problem_info);

		if(problem_info_l===7){
			info=await page.$$eval('.problem-info p:nth-of-type(5) span',x => {
				return x.map( y => (y.innerText).trim());
			});
		} else {
			info=await page.$$eval('.problem-info p:nth-of-type(4) span',x => {
				return x.map( y => (y.innerText).trim());
			});
		}

		for(info_i=0;info[0][info_i]!=' ';info_i++);
		timeLimit=Number(info[0].slice(0,info_i));

		// Getting the memory Limit for the problem

		// info=await page.$$eval('.memory-limit',x => {
		// 	return x.map( y => y.innerText);
		// });
		// start=info[0].indexOf('test'),info_i;
		// start=start+4;
		// for(info_i=start;info[0][info_i]!=' ';info_i++);
		// memoryLimit=Number(info[0].slice(start,info_i));

		// Getting Input

		input=await page.$$eval('.problem-statement pre:nth-of-type(1)',x => {
			return x.map( y => y.innerText);
		});

		// Getting Output

		output=await page.$$eval('.problem-statement pre:nth-of-type(2)', x => {
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

	for(let i=0;i<infoArr.length;i++){

		// Create solution File in the workspace directory
		if(ext)
			fs.writeFile(path.join(workspace_path,infoArr[i].problem+ext),"// Code Here",err => {console.log(err)});

		// Create Directory inside testcases folder for each problem

		fs.mkdir(path.join(workspace_path,'testcases',infoArr[i].problem),err =>{console.log(err)});
		
		// Base Path where to create the files

		let inPath=path.join(workspace_path,'testcases',infoArr[i].problem);
		let conPath=path.join(workspace_path,'testcases','constraints');

		// Creating constraint files

		fs.writeFile(path.join(conPath,infoArr[i].problem+".txt"),infoArr[i].timeLimit,err => { console.log(err); });

		// Creating testcase input (.txt) files for Problem (i+1)

		for(let j=0;j<infoArr[i].input.length;j++){
			fs.writeFile(path.join(inPath,infoArr[i].problem+"_input_"+(j+1)+".txt"),(infoArr[i].input)[j],err=>{ console.log(err)});
		}

		// Creating testcase output (.txt) files for Problem (i+1)  
		
		for(let j=0;j<infoArr[i].output.length;j++){
			fs.writeFile(path.join(inPath,infoArr[i].problem+"_output_"+(j+1)+".txt"),(infoArr[i].output)[j],err => console.log(err));
		}
	}

	global_infoArr=infoArr;

	// console.log(global_infoArr);

}

async function cfscrapper(workspace_path,contest,ext){

	let infoArr=[]; // An Array to keep the details of the problems

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
			fs.writeFile(path.join(workspace_path,infoArr[i].problem+ext),"// Code Here",err => {console.log(err)});

		// Create Directory inside testcases folder for each problem

		fs.mkdir(path.join(workspace_path,'testcases',infoArr[i].problem),err =>{console.log(err)});
		
		// Base Path where to create the files

		let inPath=path.join(workspace_path,'testcases',infoArr[i].problem);
		let conPath=path.join(workspace_path,'testcases','constraints');

		// Creating constraint files

		fs.writeFile(path.join(conPath,infoArr[i].problem+".txt"),infoArr[i].timeLimit,err => { console.log(err); });

		// Creating testcase input (.txt) files for Problem (i+1)

		for(let j=0;j<infoArr[i].input.length;j++){
			fs.writeFile(path.join(inPath,infoArr[i].problem+"_input_"+(j+1)+".txt"),(infoArr[i].input)[j],err=>{ console.log(err)});
		}

		// Creating testcase output (.txt) files for Problem (i+1)  
		
		for(let j=0;j<infoArr[i].output.length;j++){
			fs.writeFile(path.join(inPath,infoArr[i].problem+"_output_"+(j+1)+".txt"),(infoArr[i].output)[j],err => console.log(err));
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

		// Path to my VSCode Opened folder/Workspace in vscode.Uri

		let workspace_uri_path=vscode.workspace.workspaceFolders[0].uri;

		// Converting vscode.Uri to humanreadable path in string

		if(workspace_uri_path == undefined){
			vscode.window.showErrorMessage("No Active Workspace/Folder");
			return;
		}

		let workspace_path=workspace_uri_path.fsPath;

		// Create the testcase directory wihin your workspace Folder (Can use either vscode.workspace.fs or generic node fs)
		// Also create the rsult.txt file where your program output will be saved.

		fs.mkdir(path.join(workspace_path,"testcases"),(err)=>{console.log(err)});
		fs.mkdir(path.join(workspace_path,"testcases","constraints"),err => {console.log(err)});
		fs.writeFile(path.join(workspace_path,"testcases","result.txt"),"Empty Result File",err => console.log(err));

		// For Now, Extension will work only for CodeForces

		// User input for contest dashboard

		let inputBoxOpt={placeHolder:"Contest URL", prompt:"Enter the Contest Dashboard URL",ignoreFocusOut:true};
		await vscode.window.showInputBox(inputBoxOpt).then(result => { contest=result });

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
		//console.log(global_infoArr);

		vscode.window.showInformationMessage('All Ready To GO!');
	});

	let disposable_2=vscode.commands.registerCommand('codetowin.compileRun',async ()=>{

		// The code you place here will be executed every time your command is executed

		// Re-initialize totalTerminal to 1

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

				term.sendText(path.join(extDir,"cmdCompile.bat")+" "+fileExt+" "+fileNameWithExtension+" "+fileNameWithoutExtension+" "+path.join(extDir,"/comm.txt")+" "+cpp_version+" "+c_version,true);

				// Appropriate event listeners to carry on testcase run tasks and finally display the result and dispose the listener function

				let dis= vscode.window.onDidCloseTerminal(async t => {

					totalTerminals+=1;

					if (t.exitStatus.code === 0 && totalTerminals===2) {

						vscode.window.showInformationMessage("Compilation Successful! Running against parsed Test Cases");

						let runTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Run",shellPath:cmdLocation,hideFromUser:true});

						// runTerminal.show();

						runTerminal.sendText("@echo off",true);
						
						for(let i=0;i<noFiles;i++){

							runTerminal.sendText(path.join(extDir,"/cmdRun.bat")+" "+fileNameWithoutExtension+" "+path.join(testcaseDir,fileList[i])+" "+path.join(testcaseDir,fileList[i+noFiles])+" "+path.join(workspace_path,"/testcases/result.txt")+" "+path.join(extDir,"/comm.txt")+" "+(i+1)+" "+timeLimit+" "+fileExt+" & ",false);

						}
						runTerminal.sendText("exit 0",true);
						setTimeout(() => {
							if(runTerminal){

								centralTerminal.sendText("@echo off && type "+path.join(workspace_path,"testcases","result.txt")+" >> "+path.join(extDir,"/comm.txt"),true);
								// Dispose the terminal and associated Resources
								runTerminal.dispose();
							}
						},60000);

					} else {

						// let resultTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Result",shellPath:cmdLocation,hideFromUser:true});

						// resultTerminal.sendText("CLS & type "+path.join(extDir+"/comm.txt"),true);

						// resultTerminal.show();

						centralTerminal.sendText("type "+path.join(extDir,"comm.txt")+" > "+path.join(workspace_path,"testcases","result.txt"),true);
						let path1=vscode.Uri.file(path.join(workspace_path,'testcases','result.txt'));
						await vscode.window.showTextDocument(path1,{preserveFocus:true,viewColumn:vscode.ViewColumn.Beside});

						dis.dispose();

						centralTerminal.dispose();
					} 
				});
			} else  {

				let bashLocation=path.normalize("/bin/bash");

				let centralTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Central Terminal",shellPath:bashLocation,hideFromUser:true});

				// Create the first background terminal for Compiling the file

				let term=vscode.window.createTerminal({cwd:workspace_path,name:"Compile File",shellPath:bashLocation,hideFromUser:true});

				term.show(true);

				// extDir stores the uri to scripts folder witin the extension folder

				let extDir=path.join(extDirPath,"/scripts/bashtype");

				vscode.window.showInformationMessage("Compiling");

				// Send data to terminal to compile the current active file

				term.sendText("source "+path.join(extDir,"/compile.sh")+" "+fileExt+" "+fileNameWithExtension+" "+fileNameWithoutExtension+" "+path.join(extDir,"/comm.txt")+" "+cpp_version+" "+c_version,true);

				// Appropriate event listeners to carry on testcase run tanks and finally display the result and dispose the listener function

				let dis= vscode.window.onDidCloseTerminal(async t => {

					totalTerminals+=1;

					if (t.exitStatus.code === 0 && totalTerminals===2) {

						vscode.window.showInformationMessage("Compilation Successful! Running against parsed Test Cases");

						let runTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Run",shellPath:bashLocation,hideFromUser:true});

						// runTerminal.show();

						// runTerminal.sendText("@echo off",true);

						for(let i=0;i<noFiles;i++){

							runTerminal.sendText("source "+path.join(extDir,"/run.sh")+" "+fileNameWithoutExtension+" "+path.join(testcaseDir,fileList[i])+" "+path.join(testcaseDir,fileList[i+noFiles])+" "+path.join(workspace_path,"/testcases/result.txt")+" "+path.join(extDir,"/comm.txt")+" "+(i+1)+" "+timeLimit+" "+fileExt+" ; ",false);

						}
						runTerminal.sendText("exit 0",true);
						// runTerminal.sendText("echo 'done'",true);
						setTimeout(() => {
							if(runTerminal){

								centralTerminal.sendText("cat "+path.join(workspace_path,"/testcases/result.txt")+" >> "+path.join(extDir,"/comm.txt"),true);
								// Dispose the terminal and associated Resources
								runTerminal.dispose();
							}
						},60000);

					} else {

						// let resultTerminal=vscode.window.createTerminal({cwd:workspace_path,name:"Result",shellPath:bashLocation,hideFromUser:true});

						// resultTerminal.sendText("clear ; cat"+" "+path.join(extDir,"comm.txt"),true);

						// resultTerminal.show();
						centralTerminal.sendText("cp "+path.join(extDirPath,'scripts','bashtype','comm.txt')+" "+path.join(workspace_path,'testcases','result.txt'),true);
						let path1=vscode.Uri.file(path.join(workspace_path,'testcases','result.txt'));
						await vscode.window.showTextDocument(path1,{preserveFocus:true,viewColumn:vscode.ViewColumn.Beside});

						dis.dispose();

						centralTerminal.dispose();
					} 
				});
			}
		}
	});

	let disposable_3=vscode.commands.registerCommand('codetowin.compileAndRun',()=>{


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
						let compileText='javac '+fileNameWithExtension+" && java ./"+fileNameWithoutExtension;
						terminal.sendText(compileText,true);
					} else if (fileExt==='python'){
						let compileText='py ' +fileNameWithExtension;
						terminal.sendText(compileText,true);
					} else {
						vscode.window.showErrorMessage("Source Code Language not yet added in codetowin extension! Sorry!");
						return;
					}
				}
			}
		}
	});

	let disposable_4=vscode.commands.registerCommand('codetowin.addCustomTestCase',async ()=>{
		let workspace_uri=vscode.workspace.workspaceFolders[0].uri;
		if(workspace_uri){
			let workspace_path=workspace_uri.fsPath;
			let activeSourceCode=vscode.window.activeTextEditor;
			if(activeSourceCode){
				let file_obj=path.parse(activeSourceCode.document.fileName);
				let fileNameWithoutExtension=file_obj.name;
				let fileList;
				if(fs.existsSync(path.join(workspace_path,'testcases',fileNameWithoutExtension))){
					fileList=fs.readdirSync(path.join(workspace_path,'testcases',fileNameWithoutExtension));
				} else {
					vscode.window.showErrorMessage("File Not Found !");
					return;
				}
				let noFiles=fileList.length;
				noFiles=noFiles/2; noFiles++;
				fs.writeFileSync(path.join(workspace_path,'testcases',fileNameWithoutExtension,fileNameWithoutExtension+"_input_"+noFiles+".txt"),"Enter Input...");
				fs.writeFileSync(path.join(workspace_path,'testcases',fileNameWithoutExtension,fileNameWithoutExtension+"_output_"+noFiles+".txt"),"Enter Output...");
				let path1=vscode.Uri.file(path.join(workspace_path,'testcases',fileNameWithoutExtension,fileNameWithoutExtension+"_input_"+noFiles+".txt"));
				let path2=vscode.Uri.file(path.join(workspace_path,'testcases',fileNameWithoutExtension,fileNameWithoutExtension+"_output_"+noFiles+".txt"));
				await vscode.window.showTextDocument(path1,{preserveFocus:false,viewColumn:vscode.ViewColumn.Beside});
				await vscode.window.showTextDocument(path2,{preserveFocus:false,viewColumn:vscode.ViewColumn.Beside});
				vscode.window.showInformationMessage("Enter New Test Case");
			}
		}
	});

	context.subscriptions.push(disposable,disposable_2,disposable_3,disposable_4);
	// context.subscriptions.push(disposable_2);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
