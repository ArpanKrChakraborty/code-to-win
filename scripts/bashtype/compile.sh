#SheBang for script to execute in Bourne Again Shell
#!/bin/sh 
PS1="$ " ; export PS1
ext=$1
fileNameWithExtension=$2
fileNameWithoutExtension=$3
commfile=$4
echo "Error: Compile Error (CPE)" > $commfile
if [ $ext = cpp ] 
then
    g++ -g -std=c++14 -w $fileNameWithExtension -o $fileNameWithoutExtension 2>> $commfile
elif [ $ext = c ]
then
    gcc -std=c11 -w $fileNameWithExtension -o $fileNameWithoutExtension 2>> $commfile
elif [ $ext = java ]
then
    javac $fileNameWithExtension 2>> $commfile
else 
    echo "Python"
fi
if [ $? == 0 ]
then 
    exit 0
else
    exit 1
fi
