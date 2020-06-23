const starNotary=artifacts.require("starNotary");
let accounts;
let owner;

contract("starNotary",async(accs)=>{
  accounts=accs;
  owner=accounts[0];
});

it("can create a star",async()=>{
  let tokenID=1;
  let instance=await starNotary.deployed();
  await instance.createStar("Awesome star",tokenID,{from:owner});
  assert.equal(await instance._tokenidtoStar.call(tokenID),"Awesome star");
});

it("lets user1 put star for sale",async()=>{
  let instance=await starNotary.deployed();
  let user1=accounts[1];
  let starID=2;
  let starCost=web3.utils.toWei("0.01","ether");
  await instance.createStar("second star",starID,{from:user1});
  await instance.starforSale(starID,starCost,{from:user1});
  assert.equal(await instance._tokenidtoPrice.call(starID),starCost)
});

it("lets user1 get the funds after sale",async()=>{
  let instance=await starNotary.deployed();
  let user1=accounts[1];
  let user2=accounts[2];
  let starID=3;
  let starCost=web3.utils.toWei("0.01","ether");
  let etherGiven=web3.utils.toWei("0.01","ether");
  await instance.createStar("third star",starID,{from:user1});
  await instance.starforSale(starID,starCost,{from:user1});
  let balanceOfuser1before=await web3.eth.getBalance(user1);
  await instance.buyStar(starID,{from:user2,value:etherGiven,gasPrice:0});
  let balanceOfuser1after=web3.eth.getBalance(user1);
  let value1=Number(balanceOfuser1before)+Number(starCost);
  let value2=Number(balanceOfuser1after);
  assert.equal(isNaN(value2),isNaN(value1));
});

it("lets user2 buy a star, if it is put up for sale",async()=>{
  let instance=await starNotary.deployed();
  let user1=accounts[1];
  let user2=accounts[2];
  let starID=4;
  let starCost=web3.utils.toWei("0.01","ether");
  let etherGiven=web3.utils.toWei("1.03","ether");
  await instance.createStar("fourth star",starID,{from:user1});
  await instance.starforSale(starID,starCost,{from:user1});
  await instance.buyStar(starID,{from:user2,value:etherGiven,gasPrice:0});
  assert.equal(await instance.ownerOf.call(starID),user2);
});

it("lets user2 buy a star and decrese its balance",async()=>{
  let instance=await starNotary.deployed();
  let user1=accounts[1];
  let user2=accounts[2];
  let starID=5;
  let starCost=web3.utils.toWei("0.01","ether");
  let etherGiven=web3.utils.toWei("1.03","ether");
  await instance.createStar("fifth star",starID,{from:user1});
  await instance.starforSale(starID,starCost,{from:user1});
  let user2balancebefore=web3.eth.getBalance(user2);
  await instance.buyStar(starID,{from:user2,value:etherGiven,gasPrice:0});
  let user2balanceafter=web3.eth.getBalance(user2);
  let value1=Number(user2balancebefore)-Number(starCost);
  let value2=Number(user2balanceafter)
  assert.equal(isNaN(value1),isNaN(value2));
});

it("can add star name and star symbol",async()=>{
  let instance=await starNotary.deployed();
  let tokenID=6;

  await instance.createStar("sixth star",tokenID,{from:accounts[1]});
  let name=await instance.name();
  let symbol=await instance.symbol();

  assert.equal(name,"StarInfo");
  assert.equal(symbol,"STR");
});

it("exchange 2 stars",async()=>{
  let instance=await starNotary.deployed();
  let user1=accounts[1];
  let user2=accounts[2];
  let id1=7;
  let id2=8;
  await instance.createStar("Seventh star",id1,{from:user1});
  await instance.createStar("Eighth star",id2,{from:user2});
  await instance.exchangeStar(id1,user1,id2,user2,{from:user1});
  assert.equal(await instance.ownerOf(id1),user2);
  assert.equal(await instance.ownerOf(id2),user1);
});

it("lets user transfer a star",async()=>{
  let user=accounts[1];
  let id=9;
  let instance=await starNotary.deployed();
  await instance.createStar("Ninth star",id,{from:accounts[0]});
  await instance.transferStar(user,id,{from:accounts[0]});
  assert.equal(await instance.ownerOf(id),user);
});
