import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
require('./index.scss')

// fake data generator
const getItems = (count, num) =>
	Array.from({ length: count }, (v, k) => k).map(k => ({
		id: `item-${num}-${k}`,
		content: `item ${k}`,
	}))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

const add = (list, item, index) => {
	const result = Array.from(list)
	result.splice(index, 0, item)

	return result
}

// using some little inline style helpers to make the app look okay
const grid = 8
const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? 'lightgreen' : 'grey',

	// styles we need to apply on draggables
	...draggableStyle,
})
const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? 'lightblue' : 'lightgrey',
	padding: grid,
	width: 250,
})

class Dragger extends Component {
	constructor(props) {
		super(props)
		this.state = {
			suggestions: getItems(10, 1),
			itinerary: getItems(10, 2)
		}
		this.onDragEnd = this.onDragEnd.bind(this)
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return
		} else if (result.destination.droppableId !== result.source.droppableId) {
			if (result.destination.droppableId === 'suggestions-droppable') {
				const itinerary = Array.from(this.state.itinerary)
				const [item] = itinerary.splice(result.source.index, 1)
				const suggestions = add(
					this.state.suggestions,
					item, 
					result.destination.index
				)

				this.setState({
					itinerary,
					suggestions
				})
			} else {
				const suggestions = Array.from(this.state.suggestions)
				const [item] = suggestions.splice(result.source.index, 1)
				const itinerary = add(
					this.state.itinerary,
					item,
					result.destination.index
				)

				this.setState({
					itinerary,
					suggestions
				})
			}
		} else if (result.destination.droppableId === 'suggestions-droppable') {
			const suggestions = reorder(
				this.state.suggestions,
				result.source.index,
				result.destination.index
			)

			this.setState({	suggestions	})
		} else {
			const itinerary = reorder(
				this.state.itinerary,
				result.source.index, 
				result.destination.index
			)

			this.setState({ itinerary	})
		}
	}

	renderSuggestions() {
		return (
			<div className='suggestions'>
				<Droppable droppableId="suggestions-droppable">
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							style={getListStyle(snapshot.isDraggingOver)}
						>
							{this.state.suggestions.map((item, index) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>
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
												{item.content}
											</div>
											{provided.placeholder}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		)
	}

	renderItinerary() {
		return (
			<div className='itinerary'>
				<Droppable droppableId="itinerary-droppable">
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							style={getListStyle(snapshot.isDraggingOver)}
						>
							{this.state.itinerary.map((item, index) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>
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
												{item.content}
											</div>
											{provided.placeholder}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		)
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className='workspace'>
					{ this.renderSuggestions() }
					{ this.renderItinerary() }	
				</div>			
			</DragDropContext>
		)
	}
}

// Put the thing into the DOM!
export default Dragger