# Run Script File
#!/bin/sh
PS1="$ " ; export PS1
fileNameNoExtension=$1
input=$2
output=$3
result=$4
finalResult=$5
no=$6
b="================================================================="
c=">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
timeLimitraw=$7
ext=$8
flags=$9
timeLimit=`expr $timeLimitraw \* 1000`
java="java"
python="python"
cpp="cpp"
normalc="c"
if [ $no == 1 ] 
then
    echo "Compilation Successful!" > "$finalResult" ; clear ; echo -e "Running Against Test-Cases:\n(Process Will be halted automatically after 1 min to avoid infinte loop)"
fi
eval start=$(date +%N)
if [ $ext = $normalc ] 
then 
./"$fileNameNoExtension" < "$input" > "$result" 2>&1 
elif [ $ext = $cpp ]
then
./"$fileNameNoExtension" < "$input" > "$result" 2>&1  
elif [ $ext = $java ] 
then 
java "$fileNameNoExtension" < "$input" > "$result" 2>&1  
else
python3 $flags "$fileNameNoExtension".py < "$input" > "$result" 2>&1  
fi
eval end=$(date +%N)
interval=`expr $end - $start`
divi="$interval/1000000"
# divf="scale=5; $interval/1000000"
ti=$(bc <<< $divi)
# tf=$(bc <<< $divf)
TLEACTIVE=0
if [ $ti -gt $timeLimit ]
then
    TLEACTIVE=1 
fi
diff -y -B -Z "$result" "$output"
if [ $? == 0 ] 
then
    DIFFACTIVE=0
    if [ $TLEACTIVE != 1 ]
    then
        verdict="AC (Accepted)"
    else    
        verdict="TLE (Time Limit Exceeded)"
    fi
else
    verdict="WA (Wrong Answer)"
    DIFFACTIVE=1
fi
echo  $c >> "$finalResult" && echo "Test Case $no:" >> "$finalResult" && echo $b >> "$finalResult" && echo "Input:" >> "$finalResult" && cat "$input" >> "$finalResult" && echo >> "$finalResult" && echo $b >> "$finalResult" && echo "Expected Output:" >> "$finalResult" && cat "$output" >> "$finalResult" && echo >> "$finalResult" && echo $b >> "$finalResult" && echo "Your Answer:" >> "$finalResult" && cat "$result" >> "$finalResult" && echo >> "$finalResult" && echo $b >> "$finalResult" && echo "Verdict:$verdict" >> "$finalResult" && echo "Process Run Time: $ti ms" >> "$finalResult";
if [ $DIFFACTIVE == 1 ]
then
    echo $b >> "$finalResult" ; echo "Difference (Answer Vs Expected Output)" >> "$finalResult" ; diff -y -B -Z "$result" "$output" >> "$finalResult" ; echo $c >> "$finalResult"
else 
    echo $c >> "$finalResult"
fi