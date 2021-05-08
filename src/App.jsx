import React, { useState } from 'react'
import Web3 from 'web3'
import promisify from 'util.promisify'
import "regenerator-runtime/runtime";
import "../styles/home.scss"

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
            <div className="body">
                <div className="container">
                    <div className="row">
                        <div id="accounts" className="text-block">
                            <div >
                                <h2 >Lista de cuentas disponibles</h2>
                            </div>
                            <ul className="accounts">
                                {this.state.accounts.map((item, index) => (
                                    <li key={index}>
                                        <strong className="address">{item}</strong>  with <strong className="amount">{this.state.balances[item]} </strong> ethers
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div id="network-info">
                            <div className="text-block">
                                <h2>Información de la red</h2>
                                <h4>Precio del gas: <span>{this.state.gasPrice}</span></h4>
                                <h4>ChanID: <span>{this.state.chainId}</span></h4>
                                <h4>BlockNumber: <span>{this.state.blockNumber}</span></h4>
                            </div>
                        </div>
                        <div id="transfer-block">
                            <div className="text-block">
                                <div >
                                <h2>Realizar una transacción</h2>
                                    <form >
                                        <input className = "form-control" type="text" placeholder="Remitente" onChange={event => this.setState({from: event.target.value})}/>
                                        <input className = "form-control" type="text" placeholder="Destino" onChange={event => this.setState({to: event.target.value})}/>
                                        <input className = "form-control" type="number" placeholder="Monto" onChange={event => this.setState({amount: event.target.value})}/>
                                        <button className="transf-button" onClick={this.doAirDrop}>Transferir</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                
               
            </div>
        )
    }
}


