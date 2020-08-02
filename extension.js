// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

/*--------------------------------------------- Require Statements ----------------------------------------------*/

const vscode = require('vscode');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

const newContest=require('./src/commands/newContest.js');
const compileRun=require('./src/commands/compileRun.js');
const interactiveCR=require('./src/commands/interactiveCR.js');
const addCustomTestCase = require('./src/commands/addCustomTestCase.js');
const readSnippets = require('./src/commands/readSnippets.js');
/*--------------------------------------------------------------------------------------------------------------*/

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codetowin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable_1 = vscode.commands.registerCommand('codetowin.newContest',newContest);

	let disposable_2=vscode.commands.registerCommand('codetowin.compileRun',compileRun);

	let disposable_3=vscode.commands.registerCommand('codetowin.compileAndRun',interactiveCR);

	let disposable_4=vscode.commands.registerCommand('codetowin.addCustomTestCase',addCustomTestCase);

	let disposable_5=vscode.commands.registerCommand('codetowin.readSnippets',readSnippets);

	context.subscriptions.push(disposable_1,disposable_2,disposable_3,disposable_4,disposable_5);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
