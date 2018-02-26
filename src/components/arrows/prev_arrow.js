import React from 'react'
import './index.scss'

export default function PrevArrow(props) {
  const { onClick } = props
  let classes = props.disabled? 'btn-floating btn-small waves-effect waves-light prev_arrow disabled': 
		'btn-floating btn-small waves-effect waves-light prev_arrow'
  return (
   	<div
      className={classes}
      onClick={onClick}>
      <i className='fa fa-chevron-left fa-3x vertical_center_prev'></i>
   </div>
  );
}