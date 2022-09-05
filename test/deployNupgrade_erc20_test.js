const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
let PROXY;
let Tokendeployed;
let Tokenv1;
let Tokenv2;
let owner;
let addr1;
let addr2;


describe("Deploying Tokenv1...", function () {
  it("Should deploy succesfully", async function () {
    Tokenv1 = await ethers.getContractFactory("Tokenv1");
    console.log("Deploying Tokenv1...");
    Tokendeployed = await upgrades.deployProxy(Tokenv1, {kind:'uups'});
    await Tokendeployed.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("Tokenv1 deployed to:", Tokendeployed.address);
    PROXY=Tokendeployed.address;
  });
  it("Should mint initial supply...", async function () {
    console.log("Consulting Version...");
    const balanceOf = await Tokendeployed.balanceOf(owner.address);
    console.log("balanceOf: "+balanceOf);
  });
  it("Should support ERC165...", async function () {
    console.log("Consulting ERC165 interface...");
    const result = await Tokendeployed.supportsInterface(0x01ffc9a7);
    console.log("result: "+result);
  });
  it("Should support AccessControl...", async function () {
    console.log("Consulting AccessControl interface...");
    const result = await Tokendeployed.supportsInterface(0x7965db0b);
    console.log("result: "+result);
  });
});

describe("Updating to Tokenv2...", function () {
  it("Should update to v2 succesfully", async function () {
    Tokenv2 = await ethers.getContractFactory("Tokenv2");
    console.log("Upgrading Tokenv2...");
    Tokendeployed = await upgrades.upgradeProxy(PROXY, Tokenv2);
    await Tokendeployed.deployed
    console.log("Tokenv2 upgraded");
  });
  it("Should return v2 on version function...", async function () {
    console.log("Consulting Version...");
    const version = await Tokendeployed.version();
    console.log("version: "+version);
  });
  it("Should not support ERC165...", async function () {
    console.log("Consulting ERC165 interface...");
    const result = await Tokendeployed.supportsInterface(0x01ffc9a7);
    console.log("result: "+result);
    expect(!result);
  });
  it("Should not support AccessControl...", async function () {
    console.log("Consulting AccessControl interface...");
    const result = await Tokendeployed.supportsInterface(0x7965db0b);
    console.log("result: "+result);
    expect(!result);
  });
  it("Should add new supported interface ERC165", async function () {
    console.log("adding new interface supported by admin...");
    await Tokendeployed.addNewInterface(0x01ffc9a7);
  });
  it("Should support ERC165...", async function () {
    console.log("Consulting ERC165 interface...");
    const result = await Tokendeployed.supportsInterface(0x01ffc9a7);
    console.log("result: "+result);
    expect(result);
  });
  it("Should add new supported interface AccessControl", async function () {
    console.log("adding new interface supported by admin...");
    await Tokendeployed.addNewInterface(0x7965db0b);
  });
  it("Should support AccessControl...", async function () {
    console.log("Consulting AccessControl interface...");
    const result = await Tokendeployed.supportsInterface(0x7965db0b);
    console.log("result: "+result);
    expect(result);
  });
});
