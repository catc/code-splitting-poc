import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import RouteA from 'components/route-a';

export default class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<Link to="/">Home</Link>&nbsp;
					<Link to="/a">Route A</Link>&nbsp;
					
					<hr/>
						<Route
							path="/a"
							render={() => {
								return <RouteA/>
							}}
						/>

						{/*<Route
							path="/other"
							render={() => {
								return <Bundle load={loadSomething}>
									{Comp =>
										Comp ?
											<Comp/>
											:
											<span>Loading....</span>
									}
								</Bundle>
							}}
						/>
						<Route
							path="/one"
							render={() => {
								return <One/>
							}}
						/>
						<Route
							path="/two"
							component={TwoLoader}
						/>*/}
				</div>
			</Router>
		);
	}
}
