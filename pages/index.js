import React, { Component } from 'react';

import Head from './views/head';
import Header from './views/header';
import Footer from './views/footer';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'Name'
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(e) {
		this.setState({ value: e.target.value });
	}
	  
	handleSubmit(e) {
		e.preventDefault();

		fetch('create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 
				name: this.state.value === document.querySelector('[name="name"]').value
					? this.state.value
					: document.querySelector('[name="name"]').value 
			})
		})
		.then(r => r.json())
		.then(r => r && typeof r.name === 'string' 
			? window.location.href = window.location.origin + '/pad/' + r.name
			: window.location.reload()
		);
	}

	componentDidMount() {
		document.querySelector('.input-group-text').textContent = window.location.origin + '/pad/';
	}

	render() {
		return (
			<div className="container">
				<Head pad={false}/>

				<main>
					<Header />
					<div className="jumbotron">
						<h1>Bit-Pad</h1>
						<p>Welcome to Bit-Pad</p>
						<form onSubmit={this.handleSubmit}>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text" id="basic-addon3"></span>
								</div>
								<input 
									type="text" 
									value={this.state.value} 
									onChange={this.handleChange} 
									className="form-control" 
									name="name" 
									aria-describedby="basic-addon3"
									placeholder={this.state.value} 
								/>
								<button className="btn btn-outline-secondary" type="submit">Create Pad</button>
							</div>
						</form>
					</div>
				</main>

				<Footer />
			</div>
		)
	}
}

export default Main;
