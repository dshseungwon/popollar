pragma solidity ^0.4.15;
contract PollContract {
    struct Answer{
        uint8 poll;
        string answer;
        uint8 answerNumber; 
    }
    struct Poll{
        string content;
        uint blockNumber;
        string poller;
        uint8 ansNumber;
        bool canceled;
    }
    
    event AnswerFor(string _content);
    event PollAdded(string _content, string _poller);
    event PollCanceled(string _content, string _poller);
    
    bool ended;
    uint8 totalPolls;
    uint8 totalAnswers;
    Poll[] polls;
    Answer[] answers;
    
    modifier notEnded() {
        // check if the poll is already ended
        require(!ended);
        _;
    }
    
    function PollContract() public {
        // Constructor
        totalPolls = 0;
        ended = false;
    }
    function addNewPoll(string newPoll, string Poller) notEnded public {
        polls.push(Poll({
            // add to polls array
            content: newPoll,
            blockNumber: block.number,
            poller: Poller,
            ansNumber: 0,
            canceled: false
        }));
        totalPolls = totalPolls + 1;
        PollAdded(newPoll, Poller);
    }
    function cancelPoll(uint8 pollIndex, string Poller) public {
        assert(pollIndex >= 0 && pollIndex < totalPolls && keccak256(polls[pollIndex].poller) == keccak256(Poller));
        polls[pollIndex].canceled = true;
        PollCanceled(polls[pollIndex].content, Poller);
    }
    function answerFor(uint8 pollIndex, string content) notEnded public {
        assert(pollIndex >= 0 && pollIndex < totalPolls && polls[pollIndex].canceled == false);
        polls[pollIndex].ansNumber += 1;
        answers.push(Answer({
            poll: pollIndex,
            answer: content, 
            answerNumber: polls[pollIndex].ansNumber
        }));
        totalAnswers = totalAnswers + 1;
        AnswerFor(polls[pollIndex].content);
    }
    function getPoll(uint8 pollIndex) public constant returns (string, uint, string) {
        assert(pollIndex >= 0 && pollIndex < totalPolls);
        Poll storage p = polls[pollIndex];
        return (p.content, p.blockNumber, p.poller);
    }
    function getAnswer(uint8 pollIndex, uint8 answerIndex) public constant returns (string) {
        assert(pollIndex >= 0 && pollIndex < totalPolls);
        for (uint8 i = 0; i < totalAnswers; i++){
            if (answers[i].poll == pollIndex && answers[i].answerNumber == answerIndex){
                return answers[i].answer;
            }
        }
        return "Answer does not exist";
    }
    function getTotalPolls() public constant returns (uint8){
        return totalPolls;
    }
}