//  Copyright ©️ 2025 Stewart Smith. See LICENSE for details.




import {

	isUsefulNumber,
	isUsefulString,
	normalize

} from 'shoes-js'
import Pacer from 'pacer-js'




class ScrollPacer extends Pacer {
	
	constructor( 
		
		watchedEl,
		params,
		label ){


		//  Let’s process those primary input arguments.

		if( typeof watchedEl === 'string' ) watchedEl = document.getElementById( watchedEl )
		if( watchedEl instanceof Element !== true ) watchedEl = document.body
		super( label )
		this.watchedEl = watchedEl

		if( typeof params !== 'object' ) params = {}
		if( typeof params.targetEl === 'undefined' ){

			params.targetEl = watchedEl
		}
		if( typeof params.targetEl === 'string' ) params.targetEl = document.getElementById( targetEl )
		if( params.targetEl instanceof Element !== true ) params.targetEl = document.body.firstChild
		this.targetEl = params.targetEl


		//  n = 0 occurs when 
		//  WHICH edge of our target element
		//  crosses WHICH viewport boundary? 

		this.beginOnElementEdge = 
			isUsefulString( params.beginOnElementEdge )
			? params.beginOnElementEdge
			: 'top'
		
		this.beginOnViewportEdge = 
			isUsefulString( params.beginOnViewportEdge )
			? params.beginOnViewportEdge
			: 'bottom'


		//  n = 1 occurs when 
		//  WHICH edge of our target element
		//  crosses WHICH viewport boundary? 

		this.endOnElementEdge = 
			isUsefulString( params.endOnElementEdge )
			? params.endOnElementEdge
			: 'bottom'

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

		const rect = this.watchedEl.getBoundingClientRect()


		//  n = 0 occurs when the top edge of our target element
		//  either hits the top or bottom of our viewport bounds.

		let beginEdge
		if( this.beginOnViewportEdge === 'top' ){

			beginEdge = rect[ this.beginOnElementEdge ]
		}
		else if( this.beginOnViewportEdge === 'bottom' ){

			beginEdge = rect[ this.beginOnElementEdge ] - window.innerHeight
		}
		

		//  n = 1 occurs when the top edge of our target element
		//  either hits the top or bottom of our viewport bounds.

		let endEdge
		if( this.endOnViewportEdge === 'top' ){

			endEdge = rect[ this.endOnElementEdge ]
		}
		else if( this.endOnViewportEdge === 'bottom' ){

			// endEdge = window.innerHeight - rect[ this.endOnElementEdge ]
			endEdge = rect[ this.endOnElementEdge ] - window.innerHeight
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



	//   Helpers.

	static makeStickySoftener( 
		
		containerEl,
		targetEl, 
		softStickyBuffer, 
		label ){

		if( isNotUsefulNumber( softStickyBuffer )){
			
			//  Don’t forget to mirror this value in the CSS: var( --soft-sticky-buffer );
			softStickyBuffer = 200
		}
		targetEl.style.translate = `0 -${ softStickyBuffer }px`
		function softenerUpdater( e, p ){

			p.targetEl.style.translate = `0 ${ e.y }px`
		}
		const p = new ScrollPacer( 
			
			containerEl,
			{
				targetEl: targetEl,
				beginOnElementEdge:  'top',
				beginOnViewportEdge: 'bottom',
				endOnElementEdge:    'top',
				endOnViewportEdge:   'top',
				endOffsetAbsolute:    softStickyBuffer,
			},
			label
		)
		.abs( 0.0, { y: softStickyBuffer * -1 })
		.tween( ScrollPacer.quintic.in )
		.abs( 1.0, { y: 0 })
		.onEveryKey( softenerUpdater )
		.onEveryTween( softenerUpdater )

		return p
	}
	static videoScrubber( e, p ){

		if( p.targetEl instanceof Element !== true ||
			isNotUsefulNumber( p.targetEl.duration ) ||
			isNotUsefulNumber( p.targetEl.currentTime )){

			return
		}
		const targetTime = p.targetEl.duration * e.n
		p.targetEl.currentTime = ''+ targetTime
	}
}




export default ScrollPacer