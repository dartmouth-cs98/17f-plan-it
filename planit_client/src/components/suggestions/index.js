import React, { Component } from 'react'
import './index.css'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const SAMPLE_CARDS = [
	{
		name: 'Bangkok Museum of Fine Arts', 
		address: '13290 Lao Street, Bangkok, Thailand 00191',
		description: 'Exactly what it sounds like'
	},
	{
		name: 'Thai Dye Apparel', 
		address: '1111 Lao Street, Bangkok, Thailand 00191',
		description: 'Yeah'
	},
	{
		name: 'Thai - mline Family Genealogy Clinic', 
		address: '13290 Ma Street, Bangkok, Thailand 1102',
		description: 'Find your true heritage - trace your roots'
	}
]

export default class Suggestions extends Component {
	renderHeader() {
		return (
			<div className='suggestions-header'>
				<label className='suggestions-title'>
					Attractions
				</label>
			</div>
		)
	}

	render() {
		return (
			<div id='suggestions-box'>
				{this.renderHeader()}
				<CardList cards={SAMPLE_CARDS} />
			</div>
		)
	}
}

class CardList extends Component {
	renderCards() {
		let suggestions = []
		let id = 0

		console.log(this.props.cards)

		for (const card in this.props.cards) {
			suggestions.push(
				<Suggestion 
					key={id}
					name={this.props.cards[card].name}
					address={this.props.cards[card].address}
					description={this.props.cards[card].description}
				/>
			)

			id++
		}

		return suggestions
	}

	render() {
		return (
			<div>
				{this.renderCards()}
			</div>
		)
	}
}

class Suggestion extends Component {
	render() {
		return (
			<div className='card-wrapper'>
				<Card>
			    <CardHeader
			      title={this.props.name}
			      subtitle={this.props.address}
			      actAsExpander={true}
			      showExpandableButton={true}
			    />
			    <CardText expandable={true}>
			      {this.props.description}
			    </CardText>
			  </Card>
		  </div>
  	)
	}
}