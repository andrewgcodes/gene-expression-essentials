//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Class with one x position and two y positions, used for defining the
 * two strands that comprise the backbone of one DNA molecule.

 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} xPos
   * @param {number} strand1YPos
   * @param {number} strand2YPos
   * @constructor
   */
  function DnaStrandPoint( xPos, strand1YPos, strand2YPos ) {
    if ( !_.isFinite( strand1YPos ) ) { // use isFinite otherwise the condition fails at zero (Ashraf)
      var strandPoint = xPos;
      this.xPos = strandPoint.xPos;
      this.strand1YPos = strandPoint.strand1YPos;
      this.strand2YPos = strandPoint.strand2YPos;
    }
    else {
      this.xPos = xPos;
      this.strand1YPos = strand1YPos;
      this.strand2YPos = strand2YPos;
    }
  }

  return inherit( Object, DnaStrandPoint,
    {
      /**
       * @param {DnaStrandPoint} dnaStrandPoint
       */
      set: function( dnaStrandPoint ) {
        this.xPos = dnaStrandPoint.xPos;
        this.strand1YPos = dnaStrandPoint.strand1YPos;
        this.strand2YPos = dnaStrandPoint.strand2YPos;
      },

      equals: function( o ) {
        if ( this === o ) { return true; }
        if ( o === null || o.constructor.name !== this.constructor.name ) { return false; }
        var that = o;
        if ( that.strand1YPos !== this.strand1YPos ) {
          return false;
        }
        if ( that.strand2YPos !== this.strand2YPos ) {
          return false;
        }
        return that.xPos === this.xPos;
      }

    } );

} );