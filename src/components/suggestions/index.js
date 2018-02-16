import React, { Component } from 'react'
import _ from 'lodash'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Item from '../item/index.js'
import './index.scss'

const TIME_SCALE = 2500
const DURATION = 3600000
const grid = 8
const getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: 'none',
		margin: `0 0 ${grid}px 0`,

		// styles we need to apply on draggables
		...draggableStyle,
})
const getListStyle = isDraggingOver => ({
		background: isDraggingOver ? 'lightblue' : '#F2F2F2',
		padding: grid,
})

export default class Suggestions extends Component {
		renderHeader() {
				return (
						<div className='suggestions-header'>
								<label className='suggestions-title'>
									ATTRACTIONS
									<IconMenu
										className='filter-icon'
										iconButtonElement={<i className='fa fa-filter' style={{color: '#FFFFFF'}} />}
										onChange={this.props.selectCategory}
										value={this.props.category}
										multiple={false}
										style={{float: 'right', paddingRight: '10px', paddingLeft: '10px', cursor: 'pointer'}}
									>
										<MenuItem value="0" primaryText="All" />
										<MenuItem value="1" primaryText="Food" />
										<MenuItem value="2" primaryText="Hotels" />
										<MenuItem value="3" primaryText="Rentals" />
										<MenuItem value="4" primaryText="Fitness & Instruction" />
										<MenuItem value="5" primaryText="Parks" />
									</IconMenu>
									<i
										className='fa fa-plus add-icon'
										style={{color: '#FFFFFF'}}
										onClick={this.props.onModalOpen}
									/>
								</label>
						</div>
				)
		}

		renderList() {
				let index = 0
				const suggestions = _.map(this.props.suggestions, (card) => {
						// keys and id's have a 'sugg' prefix to differentiate from itinerary items
						return (
								<Draggable key={`sugg${index}`} draggableId={`sugg${index}`} index={index++}>
										{(provided, snapshot) => (
												<div>
														<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																style={getItemStyle(
																		snapshot.isDragging,
																		provided.draggableProps.style,
																)}
														>
																<Item
																		key={card.id}
																		name={card.name}
																		description={card.description}
																		timeScale={TIME_SCALE}
																		startTime={card.start_time}
																		endTime={card.end_time}
																		duration={DURATION}
																		buttons={false}
																/>
														</div>
														{provided.placeholder}
												</div>
										)}
								</Draggable>
						)
				})

				return suggestions
		}

		render() {
				return (
						<div id='suggestions-box'>
								{this.renderHeader()}
								<div className='suggestions-container'>
										<div className='suggestions-body'>
												<div className='suggestions-list'>
														<Droppable droppableId='suggestions-droppable'>
														{(provided, snapshot) => (
																<div
																		ref={provided.innerRef}
																		style={getListStyle(snapshot.isDraggingOver)}
																>
																		{this.renderList()}
																		{provided.placeholder}
																</div>
														)}
												</Droppable>
												</div>
										</div>
								</div>
						</div>
				)
		}
}