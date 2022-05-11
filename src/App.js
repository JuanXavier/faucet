import React, {useEffect, useState, useCallback} from 'react'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from './utils/load-contract'
import './App.css'

function App() {
	const [web3Api, setWeb3Api] = useState({
		provider: null,
		isProviderLoaded: false,
		web3: null,
		contract: null,
	})

	/*---------------------CREATION OF STATES AND RELOAD EFFECT---------------------------*/

	const [account, setAccount] = useState(null)
	const [balance, setBalance] = useState(null)
	const [shouldReload, reload] = useState(false)
	const canConnectToContract = account && web3Api.contract
	const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

	const setAccountListener = (provider) => {
		window.ethereum.on('accountsChanged', (_) => window.location.reload())
		window.ethereum.on('chainChanged', (_) => window.location.reload())
	}

	/*-------------------------LOAD WEB3 AND SET IT AS PROVIDER-------------------------*/

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider()

			if (provider) {
				const contract = await loadContract('Faucet', provider)

				setAccountListener(provider)

				setWeb3Api({
					web3: new Web3(provider),
					provider,
					contract,
					isProviderLoaded: true,
				})
			} else {
				setWeb3Api((api) => ({...api, isProviderLoaded: true}))
				console.error('Please install Metamask')
			}
		}

		loadProvider()
	}, [])

	/*-----------------------------GET ACCOUNT FROM METAMASK---------------------------------*/

	useEffect(() => {
		const getAccount = async () => {
			const accounts = await web3Api.web3.eth.getAccounts()
			setAccount(accounts[0])
		}

		web3Api.web3 && getAccount() // only when we have web3Api.web3 the getAccounts will be executed
	}, [web3Api.web3]) // when the web3 is assigned or reassigned this will run

	/*-----------------------------SET THE BALANCE OF CONTRACT ACCOUNT------------------------*/

	useEffect(() => {
		const loadBalance = async () => {
			const {contract, web3} = web3Api
			const balance = await web3.eth.getBalance(contract.address)
			setBalance(web3.utils.fromWei(balance, 'ether'))
		}

		web3Api.contract && loadBalance() // Need to have a contract for displaying its balance
	}, [web3Api, shouldReload])

	/*-----------------------------------ADD FUNDS-------------------------------------------*/

	const addFunds = useCallback(async () => {
		const {contract, web3} = web3Api

		await contract.addFunds({
			from: account,
			value: web3.utils.toWei('0.1', 'ether'),
		})

		reloadEffect()
	}, [web3Api, account, reloadEffect])

	/*---------------------------------WITHDRAW----------------------------------------------*/

	const withdraw = async () => {
		const {contract, web3} = web3Api
		const withdrawAmount = web3.utils.toWei('0.01', 'ether')
		await contract.withdraw(withdrawAmount, {
			from: account,
		})

		setAccountListener()
		reloadEffect()
	}

	/*---------------------------------------------RETURN-----------------------------------*/

	return (
		<>
			<div className='faucet-wrapper'>
				<div className='faucet'>
					{web3Api.isProviderLoaded ? (
						<div className='is-flex is-align-items-center'>
							<span>
								<strong className='mr-2 black'>Connected account: </strong>
							</span>
							{account ? (
								<div> {account} </div>
							) : !web3Api.provider ? (
								<>
									<div className='notification is-warning is-size-6 is-small'>
										Wallet is not detected!
										<a target='_blank' rel='noreferrer' href='https://docs.metamask.io'>
											Try installing Metamask
										</a>
									</div>
								</>
							) : (
								<button
									className='button is-small is-rounded is-dark mr-2 ml-3'
									onClick={() =>
										web3Api.provider.request({method: 'eth_requestAccounts'})
									}>
									CONNECT TO METAMASK
								</button>
							)}
						</div>
					) : (
						<span>Loading wallet...</span>
					)}
					{/*---------------------------------------------------------------------*/}
					<div className='has-text-centered balance-view is-size-2 mb-5 my-4'>
						Faucet Balance:
						<strong className='black'> {balance} </strong> ETH.
					</div>
					{/*---------------------------------------------------------------------*/}
					<div className='has-text-centered'>
						<button
							onClick={addFunds}
							style={{color: 'black'}}
							className='button is-info is-focused mr-2 p-5'
							disabled={!canConnectToContract}>
							DONATE <br />
							(0.1 ETH){' '}
						</button>
						{/*---------------------------------------------------------------------*/}
						<button
							onClick={withdraw}
							className='button is-success is-focused mr-2 p-5'
							style={{color: 'black'}}
							disabled={!canConnectToContract}>
							WITHDRAW
							<br />
							(0.01 ETH){' '}
						</button>{' '}
						<br />
						<br />
						{/*---------------------------------------------------------------------*/}
						{!canConnectToContract && account && (
							<i className='is-block has-text-centered mb-2'>
								Please connect to Rinkeby Test Network to interact with faucet.
							</i>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default App
