# README

**Code To Win** - *Concentrate on the problem, let the extension do the rest*

## Features

1. Parses Test Cases from Coding websites (codechef and codeforces, as of now, more coming soon).
2. Compile-Run against parsed test cases.
3. Auto verdict results upon running against parsed test cases such, as AC,WA,TLE,CPE,RTE,ILE.
4. If program output doesn't match with expected output, lines where the two outputs differ are shown in the result.
5. Add new test cases easily.
6. Provides interactive Compile-Run support.
7. Supports C/C++,JAVA and Python (for now, more coming soon).
8. Browser Independent. Does not depend on any browser extension, so you can use the browser of your choice.
9. Light weight.

## Requirements

1. **GNU Compiler** for C/C++. (Support for other C/C++ compilers coming soon)
2. **Any** JAVA compiler of your desire.
3. **Any** version of python of your desire.
4. Proper Enviorment Variable declaration for the above compilers.

## Extension Settings
This extension contributes the following settings:

* `Cpp Version`: sets the chosen *-std=* flag while compiling .cpp files.
* `C Version `: sets the chosen *-std=* flag while compiling .c 
files.
* `Flags`: For setting appropriate flags as you desire when you compile your file.
* `Path to Snippets Folder`: A valid URI to the directory containing your template files.
## How to Use:

1. Install the extension from VSCode marketplace.
2. For Parsing Test Cases from contest website you need to have a working directory/workspace. The name of the workspace should not contain any spaces (Replace spaces with underscore) : 
   * Next, you have to select the command `Code To Win:New Contest` from Command Palette or by using keyboard shortcut (Default : `Ctrl+N`).
   * Once you select that, an input box should open where you have to enter the contest dashboard URL.  
   Examples of Valid URLs:    
   https://codeforces.com/contest/1388  
   https://www.codechef.com/LTIME86B  
   Examples of Invalid URLs:  
   https://www.codechef.com/LTIME86
   https://www.codechef.com/BGS12020?itm_campaign=contest_listing  
   The suffix of URL should always end with the **contest code**. 
   The second URL in the context of invalid URLs is wrong because it doesnt mention the division.  
   * After entering the valid URL a dropdown appears from which you can select the langauge in which you want to write your code for the contest. If you dont see the language of your desire in the dropdown or want to do a mix of languages, select the `Custom` option.
   * Wait for a few seconds for the problems to get parsed. Once done, a promt should appear indicating the process of parsing is complete.  
<br>  
3. To Compile & Run against parsed testcases, select the command `Code To Win:Compile And Run Against Parsed Test Cases` from Command Palette or by using keybord shortcut (Default : `F5`).
4. For Interactive Compile & Run, select the command `Code To Win:Compile And Run (Interactive Input)` from Command Palette or by using keybord shortcut (Default : `F6`).
5. To add a Custom New Test Case to a problem, select the command `Code To Win: Add New Test Case` from Command Palette or by using keybord shortcut (Default : `Crtl+T`).
6. To add custom template:  
   * You need to create .txt files with names as languageID. For example for C++ template you need a define `cpp.txt` which contains your desired template.    
   * Next, paste the path to the folder containing your templates
   in `Path to Snippets Folder` setting in extension settings.  
   * Now to Update/Add Template select the command `Code To Win:Add New Test Case` from Command Palette . **Note**: You need to select the command only once every time you add a new template or update an existing one.
   * Press `!cp` in a source file to paste the template matching that source file language ID.


## Release Notes

### 1.0.0

Initial release of Code To Win Extension.

**Enjoy!**

-----------------------------------------------------------------------------------------------------------


