import React, { Component } from 'react';

import Head from '../../views/head';
import Header from '../../views/header';
import Footer from '../../views/footer';

class Pad extends Component {
	static getInitialProps({ query }) {
	 	return { query };
	}

	save() {
		const c = this.quill.getContents(); 
		fetch('../save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ html: c.ops, name: this.props.query })
		})
	}

	componentDidMount() {
		this.quill = new Quill('#khafraEditor', {
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline', 'strike'],
					['code-block', 'blockquote'],
					[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				]
			},
			placeholder: '',
			theme: 'snow'
		});

		document.addEventListener('keydown', (e) => {
			if(e.ctrlKey && e.key.toLowerCase() === 's') {
				e.preventDefault();
				this.save();
			}
		});

		fetch('../get', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 
				name: this.props.query.name
			})
		})
		.then(r => r.json())
		.then(r => this.quill.setContents(JSON.parse(r.data)));
	}

	render() {
	 	return (
			<div className="container">
				<Head pad={true} />
				<main>
					<Header />
					<div id="khafraEditor"></div>
				</main>

				<Footer />
			</div>
		)
	}
}
   
export default Pad;