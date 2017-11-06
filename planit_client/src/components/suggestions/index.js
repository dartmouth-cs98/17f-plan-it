import React, { Component } from 'react'
import _ from 'lodash'	
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './index.scss'


const SAMPLE_CARDS = [
	{
		id: 29210,
		lat: 123123.12,
	  long: 121231.12312,
		name: 'Bangkok Museum of Fine Arts',
		address: '13290 Lao Street, Bangkok, Thailand 00191',
		description: 'Exactly what it sounds like'
	},
	{
		id: 119390,
		lat: 123123.12,
	  long: 121231.12312,
		name: 'Thai Dye Apparel',
		address: '1111 Lao Street, Bangkok, Thailand 00191',
		description: 'Yeah'
	},
	{
		id: 22920,
		lat: 123123.12,
	  long: 121231.12312,
		name: 'Thai - mline Family Genealogy Clinic',
		address: '13290 Ma Street, Bangkok, Thailand 1102',
		description: 'Find your true heritage - trace your roots'
	}
]

export default class Suggestions extends Component {
	constructor(props) {
		super(props)

		this.formatCards = this.formatCards.bind(this)
	}

	formatCards() {
		return _.map(this.props.suggestions, (suggestion) => {
			return {
				name: suggestion.name, 
				image_url: suggestion.image_url, 
				yelp_url: suggestion.url,
				price: suggestion.price, 
				lat: suggestion.coordinates.latitude,
				long: suggestion.coordinates.longitude,
				phone: suggestion.phone,
				display_phone: suggestion.display_phone,
				type: suggestion.categories[0].alias, 
				description: suggestion.categories[0].title
			}
		})
	}

	renderHeader() {
		return (
			<div className='suggestions-header'>
				<label className='suggestions-title'>
					Attractions
				</label>
				<FlatButton
					className='suggestions-filter'
					icon={
						<i
							className='fa fa-filter'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
				<FlatButton
					className='suggestions-menu'
					icon={
						<i
							className='fa fa-bars'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
			</div>
		)
	}

	render() {
		const cards = this.formatCards()

		return (
			<div id='suggestions-box'>
				{this.renderHeader()}
				<CardList 
					cards={cards}
					addCard={this.props.addCard}
				/>
			</div>
		)
	}
}

class CardList extends Component {
	renderCards() {
		const suggestions = this.props.cards.map((card) => {
			return (
				<Suggestion
					key={card.id}
					name={card.name}
					address={card.address}
					description={card.description}
					addCard={() => {
						this.props.addCard({
							id: card.id,
							name: card.name,
							description: card.description
						})
					}}
				/>
			)
		})

		return suggestions
	}

	render() {
		return (
			<div className='suggestions-list'>
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
			      actAsExpander={false}
			      showExpandableButton={false}
			    />
			    <CardText expandable={false}>
			      {this.props.description}
			    </CardText>
			    <CardActions>
			    	<FlatButton 
			    		label='Add'
			    		onClick={this.props.addCard}
		    		/>
		    	</CardActions>
			  </Card>
		  </div>
  	)
	}
}
