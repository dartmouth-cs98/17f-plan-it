import React from 'react'
import './index.scss'

export default function NextArrow(props) {
  const { onClick } = props
  return (
   	<div
      className='btn-floating btn-small waves-effect waves-light next_arrow'
      onClick={onClick}>
      <i className='fa fa-chevron-right fa-3x vertical_center_next'></i>
   </div>
  );
}