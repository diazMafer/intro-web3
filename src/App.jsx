import React, { useState } from 'react'
import Web3 from 'web3'
import promisify from 'util.promisify'
import "regenerator-runtime/runtime";
import "./style.css"

export default class App extends React.Component {

    constructor (props) {
        super(props)
        this.web3 = null

        this.state = {
            accounts: [],
            balances:{},
            to: '',
            from: '',
            amount: 0,
            transaction: 'n/a',
            gasPrice: 0,
            chainId: 0,
            blockNumber: 0
        }
    }

    componentWillMount() {
        this.loadBlockchainData()
    }

    async loadBlockchainData() {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8721'))
        const accounts = await this.web3.eth.getAccounts()
        console.log(accounts)
        this.setState({ accounts: accounts })

        this.getBalances()
    }
    
    async getBalances() {
        const balances = {}
        const accounts = this.state.accounts
    
        await Promise.all(
            accounts.map(async (account) => {
                const balance = this.web3.utils.fromWei(
                    await this.web3.eth.getBalance(account),
                    'ether'
                );
                balances[account] = balance
            })
        )
        this.setState({
            balances: balances
        })

        let gasPrice = await this.web3.eth.getGasPrice() 
    
        let chainId = await this.web3.eth.getChainId()
        let blockNumber = await this.web3.eth.getBlockNumber()
        
        this.setState({
            gasPrice: gasPrice,
            chainId: chainId,
            blockNumber: blockNumber
        })  
    }


    doAirDrop = async () => {
        const to = this.state.to
        const address = await this.web3.eth.sendTransaction({
          from: this.state.from,
          to,
          value: this.state.amount
        }).catch(console.error)
    
        this.setState({ transaction: address })
        console.log(to)
        console.log(address)
      }


    render () {
        return (
            <div >
                <div >
                    <div >
                        <h2 >Lista de cuentas disponibles</h2>
                    </div>
                    <div>
                    <ul className="accounts">
                        {this.state.accounts.map((item, index) => (
                            <li key={index}>
                                {item}  with {this.state.balances[item]} ethers
                            </li>
                        ))}
                    </ul>

                    <h3>Precio del gas: <span>{this.state.gasPrice}</span></h3>
                    <h3>ChanID: <span>{this.state.chainId}</span></h3>
                    <h3>BlockNumber: <span>{this.state.blockNumber}</span></h3>

                    <div className="login-page">
                        <div className="form">
                            <form className="login-form">
                                <input type="text" placeholder="Remitente" onChange={event => this.setState({from: event.target.value})}/>
                                <input type="text" placeholder="Destino" onChange={event => this.setState({to: event.target.value})}/>
                                <input type="number" placeholder="Monto" onChange={event => this.setState({amount: event.target.value})}/>
                                <button onClick={this.doAirDrop}>Transferir</button>
                            </form>
                        </div>
                    </div>

                    </div>

                </div>

                
               
            </div>
        )
    }
}


