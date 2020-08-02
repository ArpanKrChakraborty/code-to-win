const vscode = require('vscode');
const pptr=require('puppeteer');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

module.exports = async function (workspace_path,contest,ext){
	const browser= await pptr.launch();
	const page= await browser.newPage();

	await page.tracing.start({
		path:'trace.json',
		categories:['devtools.timeline']
	});

	//Contest Site
	await page.goto(contest,{ waitUntil: 'networkidle0' });

	// execute standard javascript in the context of the page.

	let questionList; 
	await page.$$eval('.problem-table .dataTable tbody tr td:nth-of-type(2)', problems => { return problems.map(x => (x.textContent).trim())}).then(
		result=>{ questionList=result}
	);
	// console.log(questionList);
	// @ts-ignore
	for(var i=0;i<questionList.length;i++){
		
		// Problem  Page
		// @ts-ignore
		let newURL=contest+"/problems/"+questionList[i];
		await page.goto(newURL,{ waitUntil: 'networkidle0' });

		let info,info_i,timeLimit,input,output;

		// Getting the time limit for the problem

		let info1=await page.$$eval('.problem-info p:nth-of-type(5) span',x => {
			return x.map( y => (y.innerText).trim());
		});
		let info2=await page.$$eval('.problem-info p:nth-of-type(4) span',x => {
			return x.map( y => (y.innerText).trim());
		});
		if(info1[0]!=undefined && info1[0].indexOf('secs') !== -1){
			info=info1[0];
		} else {
			info=info2[0];
		}
		if(info!=undefined){
			for(info_i=0;info[info_i]!=' ';info_i++);
			timeLimit=Number(info.slice(0,info_i));
		}

		// Getting the memory Limit for the problem

		// info=await page.$$eval('.memory-limit',x => {
		// 	return x.map( y => y.innerText);
		// });
		// start=info[0].indexOf('test'),info_i;
		// start=start+4;
		// for(info_i=start;info[0][info_i]!=' ';info_i++);
		// memoryLimit=Number(info[0].slice(start,info_i));

		// Getting Input

		await page.$$eval('.problem-statement pre:nth-of-type(1)',x => {
			return x.map( y => y.innerText);
		}).then(result => {input=result});

		// Getting Output

		await page.$$eval('.problem-statement pre:nth-of-type(2)', x => {
			return x.map(y=>y.innerText);
		}).then(result => {output=result});

		// Create solution File in the workspace directory
		if(ext){
			// @ts-ignore
			fs.writeFile(path.join(workspace_path,questionList[i]+ext),"// Code Here",err => {console.log(err)});
		}

		// Create Directory inside testcases folder for each problem
		// @ts-ignore
		fs.mkdir(path.join(workspace_path,'testcases',questionList[i]),err =>{console.log(err)});
		
		// Base Path where to create the files
		// @ts-ignore
		let inPath=path.join(workspace_path,'testcases',questionList[i]);
		let conPath=path.join(workspace_path,'testcases','constraints');

		// Creating constraint files
		// @ts-ignore
		fs.writeFile(path.join(conPath,questionList[i]+".txt"),timeLimit,err => { console.log(err); });

		// Creating testcase input (.txt) files for Problem (i+1)

		// @ts-ignore
		for(let j=0;j<input.length;j++){
			// @ts-ignore
			fs.writeFile(path.join(inPath,questionList[i]+"_input_"+(j+1)+".txt"),input[j],err=>{ console.log(err)});
		}

		// Creating testcase output (.txt) files for Problem (i+1)  
		// @ts-ignore
		for(let j=0;j<output.length;j++){
			// @ts-ignore
			fs.writeFile(path.join(inPath,questionList[i]+"_output_"+(j+1)+".txt"),output[j],err => console.log(err));
		}
	}
	await page.tracing.stop();
	await browser.close();
}