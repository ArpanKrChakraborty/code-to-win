const vscode = require('vscode');
const { time, info } = require('console');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');
const { FILE } = require('dns');

module.exports=async ()=>{
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
}