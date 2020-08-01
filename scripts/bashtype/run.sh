# Run Script File
#!/bin/sh
PS1="$ " ; export PS1
fileNameNoExtension=$1
input=$2
output=$3
result=$4
finalResult=$5
no=$6
b="\n=================================================================\n"
c="\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n"
timeLimit=$7
ext=$8
flags=$9
java="java"
python="python"
cpp="cpp"
normalc="c"
if [ $no == 1 ] 
then
    echo "Compilation Successful!" > $finalResult ; clear ; echo -e "Running Against Test-Cases:\n(Process Will be halted automatically after 1 min to avoid infinte loop)"
fi
if [ $ext = $c ] 
then 
start=$(date +%N) && ./$fileNameNoExtension < $input > $result && end=$(date +%N)
elif [ $ext = $cpp ]
then
start=$(date +%N) && ./$fileNameNoExtension < $input > $result && end=$(date +%N)
elif [ $ext = $java ] 
then 
start=$(date +%N) && java ./$fileNameNoExtension < $input > $result && end=$(date +%N)
else
start=$(date +%N) && py $flags ./$fileNameNoExtension < $input > $result && end=$(date +%N)
fi
interval=`expr $end - $start`
divi="scale=0; $interval/1000000000"
divf="scale=5; $interval/1000000000"
ti=$(bc <<< $divi)
tf=$(bc <<< $divf)
TLEACTIVE=0
if [ $ti -gt $timeLimit ]
then
    TLEACTIVE=1 
else
    if [ $ti == 0 ] 
    then
        if [ $tf != 0 ]
        then 
            t="$ti$tf"
        else
            t="$ti"
        fi
    else
        t="$tf"
    fi
fi
diff -y -B -Z $result $output
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
echo -e $c >> $finalResult && echo "Test Case $no:" >> $finalResult && echo -e $b >> $finalResult && echo "Input:" >> $finalResult && cat $input >> $finalResult && echo -e $b >> $finalResult && echo "Expected Output:" >> $finalResult && cat $output >> $finalResult && echo -e $b >> $finalResult && echo "Your Answer:" >> $finalResult && cat $result >> $finalResult && echo -e $b >> $finalResult && echo "Verdict:$verdict" >> $finalResult && echo "Process Run Time: $t secs" >> $finalResult;
if [ $DIFFACTIVE == 1 ]
then
    echo -e $b >> $finalResult ; echo "Difference (Answer Vs Expected Output)" >> $finalResult ; diff -y -b $result $output >> $finalResult ; echo -e $c >> $finalResult
else 
    echo -e $c >> $finalResult
fi