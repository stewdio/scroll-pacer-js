
//  Copyright ©️ 2025 Stewart Smith. See LICENSE for details.




import {

	isNotUsefulBoolean,
	isUsefulNumber,
	isNotUsefulNumber,
	isUsefulString,
	normalize

} from 'shoes-js'
import Pacer from 'pacer-js'






function methodToCode( e ){

	return (
		
		''+
		Number( e.beginOnViewportEdge === 'top' ) + 
		Number( e.beginOnElementEdge === 'top' ) +
		Number( e.endOnViewportEdge === 'top' ) +
		Number( e.endOnElementEdge === 'top' )
	)
}
function codeToMethod( e ){

	return {

		beginOnViewportEdge: Number( e[ 0 ]) ? 'top' : 'bottom',
		beginOnElementEdge: Number( e[ 1 ]) ? 'top' : 'bottom',
		endOnViewportEdge: Number( e[ 2 ]) ? 'top' : 'bottom',
		endOnElementEdge: Number( e[ 3 ]) ? 'top' : 'bottom'
	}
}
const inversions = [
	
	'0001',
	'1001',
	'1001',
	'1011',
	'1101'
]




class ScrollPacer extends Pacer {
	
	constructor( 
		
		watchedEl,
		params,
		label ){


		//  Let’s process those primary input arguments.

		if( typeof watchedEl === 'string' ) watchedEl = document.getElementById( watchedEl )
		if( watchedEl instanceof Element !== true ) watchedEl = document.body
		super( label, 'n' )
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
	update( n ){


		//  Perhaps we’d like to force a particular scroll state?
		//  We’re expecting a value in the range 0..1,
		//  though we can handle any useful numeric value.

		if( isUsefulNumber( n )){

			super.update( n )
			return this
		}


		//  Otherwise, let’s figure out where we are scroll-wise.

		const rect = this.watchedEl.getBoundingClientRect()




		const code = methodToCode( this )
		
		let 
		durationIsZero = false,
		requiresInversion = false

		if( code.substring( 0, 2 ) === code.substring( 2, 4 )){

			durationIsZero = true
		}
		else if( inversions.includes( code )){

			requiresInversion = true
		}
		else if( code === '0011' || code === '1100' ){

			if( rect.height === window.innerHeight ){
				
				durationIsZero = true
			}
			else if( 
				( code === '0011' && rect.height > window.innerHeight ) ||
				( code === '1100' && rect.height < window.innerHeight )){
					
				requiresInversion = true
			}
		}
		if( durationIsZero ){

			//++++  Should probably fire an onKey(). Come back to this idea.
			return this
		}
		else if( requiresInversion ){

			const inverted = code.substring( 2, 4 ) + code.substring( 0, 2 )
			Object.assign( this, codeToMethod( inverted ))
		}




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

		n = normalize( 
			
			0, 
			Math.min( beginEdge, endEdge ),
			Math.max( beginEdge, endEdge )
		)
		this.scrollN = n
		super.update( n )
	}


	//   Helpers.

	static stickyEaseBuffer = 200
	static stickyEaseUpdate( e, p ){

		p.targetEl.style.translate = `0 ${ e.y }px`
	}
	static makeStickyEaseStart( containerEl, targetEl, buffer, label ){

		if( isNotUsefulNumber( buffer )){
			
			//  Mirror this value in the CSS: var( --sticky-ease-buffer );
			buffer = ScrollPacer.stickyEaseBuffer
		}
		return new ScrollPacer( 
			
			containerEl,
			{
				targetEl: targetEl,
				beginOnViewportEdge: 'top',
				beginOnElementEdge:  'top',
				endOnViewportEdge:   'top',
				endOnElementEdge:    'bottom',
				// endOffsetAbsolute:    buffer,
			},
			label
		)
		.abs( 0.0, { y: 0 })
		.tween( ScrollPacer.cubic.in )
		.abs( 1.0, { y: buffer })
		.onEveryKey( stickyEaseUpdate )
		.onEveryTween( stickyEaseUpdate )
	}
	static makeStickyEaseStop( containerEl, targetEl, buffer, label ){

		if( isNotUsefulNumber( buffer )){
			
			//  Mirror this value in the CSS: var( --sticky-ease-buffer );
			buffer = ScrollPacer.stickyEaseBuffer
		}
		return new ScrollPacer( 
			
			containerEl,
			{
				targetEl: targetEl,
				beginOnViewportEdge: 'bottom',
				beginOnElementEdge:  'top',
				endOnViewportEdge:   'top',
				endOnElementEdge:    'top'
				// endOffsetAbsolute:    buffer,
			},
			label
		)
		.abs( 0.0, { y: -buffer })
		.tween( ScrollPacer.cubic.in )
		.abs( 1.0, { y: 0 })
		.onEveryKey( stickyEaseUpdate )
		.onEveryTween( stickyEaseUpdate )
	}




	static videoScrubberForce( e, p ){

		ScrollPacer.videoScrubber( e, p, true )
	}
	static videoScrubberBegin( e, p ){

		ScrollPacer.videoScrubber({ n: 0 }, p, true )
	}
	static videoScrubberEnd( e, p ){
		
		ScrollPacer.videoScrubber({ n: 1 }, p, true )
	}
	static videoScrubber( e, p, shouldForce ){
		
		if( p.targetEl instanceof Element !== true ||
			isNotUsefulNumber( p.targetEl.duration ) ||
			isNotUsefulNumber( p.targetEl.currentTime )){

			return
		}
		if( isNotUsefulNumber( p.lastSeekIssuedAt )){

			p.lastSeekIssuedAt = 0
		}
		if( isNotUsefulBoolean( p.targetEl.isSeekReady )){

			p.targetEl.isSeekReady = true
			p.targetEl.addEventListener( 'seeked', function(){

				p.targetEl.isSeekReady = true
			})
		}
		const timeDiff = Date.now() - p.lastSeekIssuedAt
		if( shouldForce || ( timeDiff > 16 && p.targetEl.isSeekReady )){

			p.targetEl.currentTime = ''+ p.targetEl.duration * e.n
			p.lastSeekIssuedAt = Date.now()
			p.targetEl.isSeekReady = false
		}
	}
}




export default ScrollPacer