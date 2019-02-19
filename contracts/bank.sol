pragma solidity ^0.5.1;  // solhint-disable-line compiler-fixed, compiler-gt-0_4
//solium-disable linebreak-style
contract Bank{
    
    address owner;
    
    constructor()public{
        owner = msg.sender;
    }
    
    modifier restricted(){
        require(msg.sender == owner);
        _;
    }
    
    //actual deeds mapped to their serial#
    mapping(string => Deed) property;
    
    //addresses of deployed deeds
    address[] public properties;
    
    function getOwner(string memory serial) public view returns(Deed){
        return property[serial];
    }
    
    function newDeed(address _owner,string memory _id, string memory _serial,uint _size) restricted public{
        Deed deed = new Deed(
             _owner,
            _id,
            _serial,
            _size
        );
        property[_serial] = deed; 
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
    
    constructor(address _owner,string memory _id, string memory _serial,uint _size) public{
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