//solium-disable linebreak-style
pragma solidity ^0.4.17;

contract Bank{
    
    address public owner;
    
    function Bank()public{
        owner = msg.sender;
    }
    
    modifier restricted(){
        require(msg.sender == owner);
        _;
    }
    
    //actual deeds mapped to their serial#
    mapping(string => string) property;
    
    //addresses of deployed deeds
    address[] public properties;
    
    function getOwner(string memory serial) public view returns(string){
        return property[serial];
    }
    
    function newDeed(address _owner,string memory _id, string memory _serial,uint _size) public{
       
        Deed deed = new Deed(
             _owner,
            _id,
            _serial,
            _size
        );
        
        property[_serial] = _id; 
        properties.push(address(deed));
    }
    
    
}

contract Deed{
    
    address public owner;
    string public id;
    string public serial;
    uint size;
    bool public forSale;
    uint public price;
    
    modifier restricted(){
        require(msg.sender == owner);
        _;
    }
    
    function Deed(address _owner,string memory _id, string memory _serial,uint _size) public{
        owner = _owner;
        id = _id;
        serial = _serial;
        size = _size;
    }
    
    function listProperty(uint _price) public restricted{
        forSale = true;
        price = _price;
    }
    
    function buyProperty(string memory _id) payable public{
        require(forSale == true);
        require(msg.value == price);
        forSale = false;
        owner = msg.sender;
        id = _id;
        price = address(this).balance;
    }
    
}