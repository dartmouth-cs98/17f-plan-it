import React, { Component } from 'react'
import _ from 'lodash'	
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './index.scss'

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
		const buttons = [
			<FlatButton
				className='suggestions-filter'
				icon={
					<i
						className='fa fa-filter'
						style={{color: '#FFFFFF'}}
					/>
				}
			/>,
			<FlatButton
				className='suggestions-menu'
				icon={
					<i
						className='fa fa-bars'
						style={{color: '#FFFFFF'}}
					/>
				}
			/>
		]

		return (
			<div className='suggestions-header'>
				<label className='suggestions-title'>
					Attractions
				</label>
			</div>
		)
	}

	render() {
		const cards = this.formatCards()
		console.log(cards)

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
						this.props.addCard(card)
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
