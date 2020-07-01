# Run Script File
#!/bin/sh
PS1="$ " ; export PS1
fileNameNoExtension=$1
input=$2
output=$3
result=$4
finalResult=$5
no=$6
verdict="WA (Wrong Answer)"
timeLimit=$7
if [ $no == 1 ] 
then
    echo "Compilation Successful!" > $finalResult ; clear ; echo -e "Running Against Test-Cases:\n(Process Will be halted automatically after 1 min to avoid infinte loop execution)"
fi
t=/usr/bin/time -f "%E" $fileNameNoExtension < $input > $result 2>&1
if [ $t -gt $timeLimit ]
then
    verdict="TLE (Time Limit Exceeded)"
fi
diff $4 $3
if [ $? == 0 ] 
then
    echo -e "Test Case $no:\nInput:\n" >> $finalResult ; cat $input >> $finalResult  ; echo "Output:" >> $finalResult ; cat $output >> $finalResult ; echo "Answer:" >> $finalResult ; cat $result >> $finalResult ; echo "Verdict:AC (Accepted)" >> $finalResult ; echo "Process Run Time: $time secs" >> $finalResult ; echo -e "\n" >> $finalResult
else
    echo -e "Test Case $no:\nInput:\n" >> $finalResult ; cat $input >> $finalResult  ; echo "Output:" >> $finalResult ; cat $output >> $finalResult ; echo "Answer:" >> $finalResult ; cat $result >> $finalResult ; echo "Verdict:$verdict" >> $finalResult ; echo "Process Run Time: $time secs" >> $finalResult ; echo -e "\n" >> $finalResult






