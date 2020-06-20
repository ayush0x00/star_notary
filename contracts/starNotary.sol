pragma solidity 0.6.10;
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract starNotary is ERC721{
  struct Star{
    string _name;
  }
  mapping(uint256=>Star) public _tokenidtoStar;
  mapping(uint256=>uint256) public _tokenidtoPrice;

  function createStar(string memory _name,uint256 _tokenid) public {
    Star memory newStar=Star(_name);
    _tokenidtoStar[_tokenid]=newStar;
    _mint(msg.sender,_tokenid);
  }

  function starforSale(uint256 _tokenid,uint256 _price) public{
    require(ownerOf(_tokenid)==msg.sender);
    _tokenidtoPrice[_tokenid]=_price;
  }

  function buyStar(uint256 _tokenid) public payable{
    require(_tokenidtoPrice[_tokenid]>0,"The star should be for sale");
    address starOwner=_tokenidtoStar[_tokenid];
    uint256 starCost=_tokenidtoPrice[_tokenid];
    require(msg.value>starCost,"The value is not sufficeint to buy the star");
    transferFrom(starOwner,msg.sender,_tokenid);
    address payable payableOwner=payable(starOwner);//we need this conversion to tranfer ether to oringinal owner
    payableOwner.transfer(starCost);
    if(msg.value>starCost){
      msg.sender.transfer(msg.value-starCost);
    }
  }
}
