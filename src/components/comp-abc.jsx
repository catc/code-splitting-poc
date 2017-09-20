import React, { Component } from 'react';

export default class ABC extends Component {
	constructor(){
		super()
		console.log('Component ABC has loaded!')
	}
	render(){
		return (
			<div>This is <strong>component abc</strong></div>
		)
	}
}