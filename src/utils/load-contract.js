// USEFUL FOR WRAPPING ARTIFACT INTO A CONTRACT FOR USING CONTRACT FUNCTIONS
import contract from '@truffle/contract';

/*-------------------------LOADS CONTRACT BY NAME---------------------------------*/

export const loadContract = async (name, provider) => {
	const res = await fetch(`/contracts/${name}.json`); // Fetch contract by name

	const Artifact = await res.json(); // Get the json file representation

	const _contract = contract(Artifact); // THE JSON FILES ARE CALLED ARTIFACTS

	_contract.setProvider(provider);

	let deployedContract = null;

	try {
		deployedContract = await _contract.deployed();
	} catch {
		console.error('Smart contract is not deployed to this network');
	}

	return deployedContract;
};
