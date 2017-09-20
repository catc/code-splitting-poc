import React, { Component } from 'react';

let Comp;
export default class RouteA extends Component {
	state = {doneLoading: false}
	constructor(){
		super()

		console.log( 'Route A constructor' )

		// works - splits chunk into separate file on build
		/*require.ensure('./comp-abc.jsx', (comp) => {
			Comp = require('./comp-abc.jsx').default;
			this.setState({doneLoading: true})
		})*/

		// doesn't work - chunk is not a separate file on build
		import('./comp-abc.jsx').then(comp => {
			Comp = comp.default
			this.setState({doneLoading: true})
		})

		// works - splits chunk into separate file on build
		/*require.ensure('./comp-abc.jsx', () => {
			import('./comp-abc.jsx').then(comp => {
				Comp = comp.default
				this.setState({doneLoading: true})
			})
		})*/
	}

	render(){
		return (
			<div>this is <strong>Route A</strong>
			{this.state.doneLoading ? <Comp/>: 'still loading...'}
			</div>
		)
	}
}