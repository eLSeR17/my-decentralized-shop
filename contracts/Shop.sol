// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./Users.sol";

error Shop__NotEnoughMoney(uint requiredPrice);
error Shop__NotListed(uint notExistingId);
error Shop__AlreadyOwner(uint ownedItemId);
error Shop__NotOwner(uint notOwnedItemId);

contract Shop is Ownable, Users{
    
    Item[] public itemList;
    uint public itemAmount;

    
    struct Item{
        string name;
        string description;
        string picture; // You can upload your photo to IPFS and set the link to the variable 'picture'
        uint id;
        address owner;
        uint price; // The price in wei
    }


    constructor(){
       _owner = msg.sender; 
    }

    event ItemListed(string indexed name, address indexed seller, uint indexed id, uint price);

    event ItemBought(string indexed name, address indexed buyer, uint indexed id);
    
    event ItemCancelled(string indexed name, uint indexed id);

    modifier isListed(uint _id){
        if(_id >= itemList.length){
            revert Shop__NotListed(_id);
        }
        _;
    }

    function listItem(string memory _name, string memory _description, string memory _picture, uint _price) public{
        itemList.push(Item(_name, _description, _picture, itemList.length, msg.sender, _price));
        itemAmount++;
        emit ItemListed(_name, msg.sender, itemList.length - 1, _price);
    }

    function buyItem(uint _id) public payable isListed(_id){
        uint price = itemList[_id].price;
        uint discount = price * userLevel[msg.sender] * 5 / 100;
        uint finalPrice = price - discount;
        if(msg.value < finalPrice){
            revert Shop__NotEnoughMoney(itemList[_id].price);
        }
        if(msg.sender == itemList[_id].owner){
            revert Shop__AlreadyOwner(_id);
        }
        givePoints(itemList[_id].owner, price / 50);
        itemList[_id].owner = msg.sender;
        givePoints(msg.sender, finalPrice / 50);
        itemAmount--;
        emit ItemBought(itemList[_id].name, msg.sender, _id);
        delete itemList[_id];
    }

    function cancelItem(uint _id) public isListed(_id){
        if(itemList[_id].owner != msg.sender){
            revert Shop__NotOwner(_id);
        }
        itemAmount--;
        emit ItemCancelled(itemList[_id].name, _id);
        delete itemList[_id];
    }

    function getListedItem(uint _position) public view returns (string memory){
        return itemList[itemList.length - _position - 1].name;
    }

    function getItemAmount() public view returns (uint){
        return itemAmount;
    }
    
    function givePoints() pure internal{
        super.givePoints;
    }
    
}
