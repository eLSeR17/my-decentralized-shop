// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

error Users__NotLevel5(address);
error Users__NotEmbassador(address);
error Users__AlreadyEvaluated(address);
error Users__NotAdmittedGrade();
error Users__OwnerNotAllowed();

contract Users is Ownable{

    event AddressWasSet(address indexed, string indexed);
    event MailWasSet(address indexed, string indexed);
    event TelephoneWasSet(address indexed, string indexed);

    address _owner;
    uint ownerGrade;
    uint ownerVotes;

    mapping(address => uint) userLevel;
    mapping(address => uint) userPoints;
    mapping(address => bool) isEmbassador;
    mapping(address => bool) evaluatedOwner;
    mapping(address => string) private userAddress;
    mapping(address => string) private userMail;
    mapping(address => string) private userTelephone;

    constructor(){
        _owner = msg.sender;
    }

    function givePoints(address _user, uint _points) public virtual{
        userPoints[_user] = userPoints[_user] + _points;
        updateLevel(_user);
    }

    function updateLevel(address _user) internal{
        if(userPoints[_user] < 100) userLevel[_user] = 0;
        else if(userPoints[_user] >= 100 && userPoints[_user] < 200) userLevel[_user] = 1;
        else if(userPoints[_user] >= 200 && userPoints[_user] < 300) userLevel[_user] = 2;
        else if(userPoints[_user] >= 300 && userPoints[_user] < 400) userLevel[_user] = 3;
        else if(userPoints[_user] >= 400 && userPoints[_user] < 500) userLevel[_user] = 4;
        else if(userPoints[_user] >= 500) userLevel[_user] = 5;
    }

    function makeEmbassador(address _user) public onlyOwner(){
        if(userLevel[_user] != 5){
            revert Users__NotLevel5(_user);
        }
        isEmbassador[_user] = true;
    }

    function cancelEmbassador(address _user) public onlyOwner(){
        uint ownerPower = ownerGrade / ownerVotes;
        if(ownerPower < 7){
            revert Users__OwnerNotAllowed();
        }
        if(!isEmbassador[_user]){
            revert Users__NotEmbassador(_user);
        }
        isEmbassador[_user] = false;
    }

    function evaluateOwner(uint _grade) public{
        if(!isEmbassador[msg.sender]){
            revert Users__NotEmbassador(msg.sender);
        }
        if(evaluatedOwner[msg.sender]){
            revert Users__AlreadyEvaluated(msg.sender);
        }
        if(_grade < 0 || _grade > 10){
            revert Users__NotAdmittedGrade();
        }

        evaluatedOwner[msg.sender] = true;
        ownerGrade = ownerGrade + _grade;
        ownerVotes++;
    }

    function setMyAddress(string memory _myAddress) public{
        userAddress[msg.sender] = _myAddress;
        emit AddressWasSet(msg.sender, _myAddress);
    }

    function setMyMail(string memory _myMail) public{
        userMail[msg.sender] = _myMail;
        emit MailWasSet(msg.sender, _myMail);
    }

    function setMyTelephone(string memory _myTelephone) public{
        userTelephone[msg.sender] = _myTelephone;
        emit TelephoneWasSet(msg.sender, _myTelephone);
    }

    function getMyAddress() public view returns (string memory){
        return userAddress[msg.sender];
    }

    function getMyMail() public view returns (string memory){
        return userMail[msg.sender];
    }
    
    function getMyTelephone() public view returns (string memory){
        return userTelephone[msg.sender];
    }

    function getMyLevel() public view returns (uint){
        return userLevel[msg.sender];
    }

    function getOwnerVotes() public view returns (uint){
        return ownerVotes;
    }

    function checkEmbassador(address _user) public view returns (bool){
        return isEmbassador[_user];
    }
}