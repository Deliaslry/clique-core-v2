import { run } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {SIGNER} from "../../constants/constants";


const main = async ({
    network,
    ethers,
    deployments,
    getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log(`02 - Deploying DAOFactory Logic on ${network.name}`);

    const daoFactory = await deploy("DAOFactoryLogic", {
        contract: "DAOFactory",
        from: deployer,
    });
    console.log(`DAOFactory @ ${daoFactory.address}`);
    const logicDAOBase = await deployments.get('DAOBaseLogic');
    const logicERC20Base = await deployments.get('ERC20BaseLogic');
    // const logicDaoFactory = await deployments.get('DAOFactoryLogic');

    const DAOFactory = await ethers.getContractAt('DAOFactory', daoFactory.address);
    const initArgs = [
        logicDAOBase.address,
        logicERC20Base.address
    ];
    await DAOFactory.initialize(logicDAOBase.address,logicERC20Base.address)
    const tx = await DAOFactory.setSigner(SIGNER, true)

    try {
        await run("verify:verify", {
            address: daoFactory.address,
            constructorArguments: [],
        });
    } catch (error) {
        console.log(error);
    }
};
main.tags = ["FactoryLogic"];

export default main;
