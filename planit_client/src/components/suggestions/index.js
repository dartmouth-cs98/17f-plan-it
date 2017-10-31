import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './index.scss'


const SAMPLE_CARDS = [
	{
		id: 29210,
		name: 'Bangkok Museum of Fine Arts',
		address: '13290 Lao Street, Bangkok, Thailand 00191',
		description: 'Exactly what it sounds like'
	},
	{
		id: 119390,
		name: 'Thai Dye Apparel',
		address: '1111 Lao Street, Bangkok, Thailand 00191',
		description: 'Yeah'
	},
	{
		id: 22920,
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
				<FlatButton
					className='suggestions-filter'
					icon={
						<i
							class='fa fa-filter'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
				<FlatButton
					className='suggestions-menu'
					icon={
						<i
							class='fa fa-bars'
							style={{color: '#FFFFFF'}}
						/>
					}
				/>
			</div>
		)
	}

	render() {
		return (
			<div id='suggestions-box'>
				{this.renderHeader()}
				<CardList 
					cards={SAMPLE_CARDS}
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
