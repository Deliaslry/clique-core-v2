import { run } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const main = async ({
        network,
        deployments,
        ethers,
        getNamedAccounts,
    }: HardhatRuntimeEnvironment) => {
    const { deploy } = deployments;
    const { deployer, admin } = await getNamedAccounts();
    console.log(`04 - Deploying DAOAirdrop Logic on ${network.name}`);

    const daoFactory = await deployments.get('DAOFactoryLogic');

    const daoAirdrop = await deploy('DAOAirdropLogic', {
        contract: 'DAOAirdrop',
        from: deployer,
        args: [daoFactory.address]
    });
    console.log(`DAO Airdrop Logic @ ${daoAirdrop.address}`)

    try {
        await run("verify:verify", {
            address: daoAirdrop.address,
            constructorArguments: [daoFactory.address],
        });
    } catch (error) {
        console.log(error);
    }
};
main.tags = ["DAOAirdropLogic"];

export default main;
