import React, { Component } from 'react'
import _ from 'lodash'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
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
				description: suggestion.categories[0].title,
				isInfoOpen: false
			}
		})
	}

	renderHeader() {
		return (
			<div className='suggestions-header'>
				<label className='suggestions-title'>
					ATTRACTIONS
				</label>
				<IconMenu
					iconButtonElement={<i className='fa fa-filter' style={{color: '#FFFFFF'}} />}
					onChange={this.props.selectCategory}
					value={this.props.category}
					multiple={false}
					style={{float: 'right', marginRight: '10px', cursor: 'pointer'}}
				>
			  	<MenuItem value="0" primaryText="All" />
          <MenuItem value="1" primaryText="Food" />
          <MenuItem value="2" primaryText="Hotels" />
          <MenuItem value="3" primaryText="Rentals" />
          <MenuItem value="4" primaryText="Fitness & Instruction" />
          <MenuItem value="5" primaryText="Parks" />
        </IconMenu>
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
						this.props.addCard(card)
					}}
				/>
			)
		})

		if (suggestions.length > 0) {
			return suggestions
		} else {
			return (
				<div className='empty-suggestions'>
					<label>Select a free time block to find nearby suggestions</label>
				</div>
			)
		}
	}

	render() {
		return (
			<div className='suggestions-list'>
				<div className='list-container'>
					{this.renderCards()}
				</div>
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
