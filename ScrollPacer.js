
//  ScrollPacer.js is ©️ Stewart Smith, 2025. All Rights Reserved.


import {

	isUsefulNumber,
	isUsefulString,
	normalize

} from 'shoes-js'
import Pacer from 'pacer-js'




class ScrollPacer extends Pacer {
	
	constructor( 
		
		el,
		params,
		label ){


		//  Let’s process those primary input arguments.

		if( typeof el === 'string' ) el = document.getElementById( el )
		if( el instanceof HTMLElement !== true ) el = document.body
		if( typeof params !== 'object' ) params = {}
		super( label )
		this.el = el


		//  n = 0 occurs when the top of our target element
		//  crosses what viewport boundary? 

		this.beginOnViewportEdge = 
			isUsefulString( params.beginOnViewportEdge )
			? params.beginOnViewportEdge
			: 'bottom'
		

		//  n = 1 occurs when the bottom of our target element
		//  crosses what viewport boundary? 

		this.endOnViewportEdge = 
			isUsefulString( params.endOnViewportEdge )
			? params.endOnViewportEdge
			: 'top'

		
		//  Perhaps you have a specific 
		//  absolute or relative offset
		//  that you’d like to add to the
		//  top or bottom edge of your element.

		this.beginOffsetAbsolute = 
			isUsefulNumber( params.beginOffsetAbsolute )
			? params.beginOffsetAbsolute
			: 0

		this.beginOffsetRelative = 
			isUsefulNumber( params.beginOffsetRelative )
			? params.beginOffsetRelative
			: 0

		this.endOffsetAbsolute = 
			isUsefulNumber( params.endOffsetAbsolute )
			? params.endOffsetAbsolute
			: 0

		this.endOffsetRelative = 
			isUsefulNumber( params.endOffsetRelative )
			? params.endOffsetRelative
			: 0
	}
	update(){

		const rect = this.el.getBoundingClientRect()


		//  n = 0 occurs when the top edge of our target element
		//  either hits the top or bottom of our viewport bounds.

		let beginEdge
		if( this.beginOnViewportEdge === 'top' ){

			beginEdge = rect.top
		}
		else if( this.beginOnViewportEdge === 'bottom' ){

			beginEdge = rect.top - window.innerHeight
		}
		

		//  n = 1 occurs when the top edge of our target element
		//  either hits the top or bottom of our viewport bounds.

		let endEdge
		if( this.endOnViewportEdge === 'top' ){

			endEdge = rect.bottom
		}
		else if( this.endOnViewportEdge === 'bottom' ){

			endEdge = window.innerHeight - rect.bottom
		}


		//  Let’s honor any offset requests.

		const 
		beginOffset = 
			this.beginOffsetAbsolute + 
			window.innerHeight * this.beginOffsetRelative,
		endOffset = 
			this.endOffsetAbsolute + 
			window.innerHeight * this.endOffsetRelative

		beginEdge += beginOffset
		endEdge += endOffset


		//  Mark it zero.
		// (Its a league game, Smokey.)

		const n = normalize( 
			
			0, 
			beginEdge,
			endEdge
		)
		super.update( n )
	}
}
export default ScrollPacer