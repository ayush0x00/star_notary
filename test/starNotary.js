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
  let etherGiven=web3.utils.toWei("0.05","ether");
  await instance.createStar("third star",starID,{from:user1});
  await instance.starforSale(starID,starCost,{from:user1});
  let balanceOfuser1before=await web3.eth.getBalance(user1);
  await instance.buyStar(starID,{from:user2,value:etherGiven});
  let balanceOfuser1after=web3.eth.getBalance(user1);
  let value1=Number(balanceOfuser1before)+Number(starCost);
  let value2=Number(balanceOfuser1after);
  assert.equal(value2,value1);
});

it("lets user2 buy a star, if it is put up for sale",async()=>{
  let instance=await starNotary.deployed();
  let user1=accounts[1];
  let user2=accounts[2];
  let starID=4;
  let starCost=web3.utils.toWei("0.01","ether");
  await instance.createStar("fourth star",starID,{from:user1});
  await instance.starforSale(starID,starCost,{from:user1});
  await instance.buyStar(starID,{from:user2,value:starCost});
  assert.equal(await instance.ownerOf.call(starID),user2);
});