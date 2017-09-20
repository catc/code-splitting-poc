import React, { Component } from 'react';

let Comp;
export default class RouteA extends Component {
	state = {doneLoading: false}
	constructor(){
		super()

		console.log( 'Route A constructor' )

		import(
			/* webpackChunkName: "comp-abc" */
			/* webpackMode: "lazy" */
			'./comp-abc.jsx'
		).then(comp => {
			Comp = comp;
			this.setState({doneLoading: true})
		}).catch(err => {
			console.log( 'error importing', err )
		})
	}

	render(){
		return (
			<div>this is <strong>Route A</strong>
			{this.state.doneLoading ? <Comp.default/>: 'still loading...'}
			</div>
		)
	}
}