//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Flat segment - has no height, so rRNA contained in this segment is not wound.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeSegment = require( 'GENE_EXPRESSION_BASICS/common/model/ShapeSegment' );
  var Rectangle = require( 'DOT/Rectangle' );
  var SquareSegment = require( 'GENE_EXPRESSION_BASICS/common/model/SquareSegment' );

  /**
   * @param {Vector2} origin
   * @constructor
   */
  function FlatSegment( origin ) {
    ShapeSegment.call( this );
    this.bounds.set( new Rectangle( origin.x, origin.y, 0, 0 ) );
    this.updateAttachmentSiteLocation();


  }

  return inherit( ShapeSegment, FlatSegment, {

    getContainedLength: function() {
      // For a flat segment, the length of mRNA contained is equal to
      // the width.
      return this.bounds.get().getWidth();
    },

    add: function( length, shapeSegmentList ) {
      var growthAmount = length;
      if ( this.getContainedLength() + length > this.capacity ) {

        // This segment can't hold the specified length.  Add a new
        // square segment to the end of the segment list and put
        // the excess in there.
        var newSquareSegment = new SquareSegment( this.getLowerRightCornerPos() );
        growthAmount = this.capacity - this.getContainedLength(); // Clamp growth at remaining capacity.
        newSquareSegment.add( length - growthAmount, shapeSegmentList );
        shapeSegmentList.insertAfter( this, newSquareSegment );
      }

      // Grow the bounds linearly to the left to accommodate the
      // additional length.
      this.bounds.set( new Rectangle( this.bounds.get().x - growthAmount,
        this.bounds.get().y,
        this.bounds.get().getWidth() + growthAmount,
        0 ) );
      this.updateAttachmentSiteLocation();
    },

    remove: function( length, shapeSegmentList ) {
      this.bounds.set( new Rectangle( this.bounds.get().x, this.bounds.get().y, this.bounds.get().getWidth() - length, 0 ) );

      // If the length has gotten to zero, remove this segment from
      // the list.
      if ( this.getContainedLength() < ShapeSegment.FLOATING_POINT_COMP_FACTOR ) {
        shapeSegmentList.remove( this );
      }
      this.updateAttachmentSiteLocation();
    },

    advance: function( length, shapeSegmentList ) {
      var outputSegment = shapeSegmentList.getPreviousItem( this );
      var inputSegment = shapeSegmentList.getNextItem( this );
      if ( inputSegment === null ) {

        // There is no input segment, meaning that the end of the
        // mRNA strand is contained in THIS segment, so this
        // segment needs to shrink.
        var lengthToAdvance = Math.min( length, this.getContainedLength() );
        this.remove( lengthToAdvance, shapeSegmentList );
        outputSegment.add( lengthToAdvance, shapeSegmentList );
      }
      else if ( inputSegment.getContainedLength() > length ) {

        // The input segment contains enough mRNA length to supply
        // this segment with the needed length.
        if ( this.getContainedLength() + length <= this.capacity ) {

          // The new length isn't enough to fill up this segment,
          // so this segment just needs to grow.
          this.add( length, shapeSegmentList );
        }
        else {
          // This segment is full or close enough to being full
          // that it can't accommodate all of the specified
          // length.  Some or all of that length must go in the
          // output segment.
          var remainingCapacity = this.getRemainingCapacity();
          if ( remainingCapacity > ShapeSegment.FLOATING_POINT_COMP_FACTOR ) {

            // Not quite full yet - fill it up.
            this.maxOutLength();
            // This situation - one in which a segment that is
            // having the mRNA advanced through it but it not
            // yet full - should only occur when this segment
            // is the first one on the shape segment list.  So,
            // add a new one to the front of the segment list,
            // but first, make sure there isn't something there
            // already.
            var newLeaderSegment = new FlatSegment( this.getUpperLeftCornerPos() );
            //{{ //TODO
            //  setCapacity( MessengerRna.LEADER_LENGTH );
            //}};
            shapeSegmentList.insertBefore( this, newLeaderSegment );
            outputSegment = newLeaderSegment;
          }
          // Add some or all of the length to the output segment.
          outputSegment.add( length - remainingCapacity, shapeSegmentList );
        }
        // Remove the length from the input segment.
        inputSegment.remove( length, shapeSegmentList );
      }
      else {

        // The input segment is still around, but doesn't have
        // the specified advancement length within it.  Shrink it
        // to zero, which will remove it, and then shrink the
        // advancing segment by the remaining amount.
        this.remove( length - inputSegment.getContainedLength(), shapeSegmentList );
        inputSegment.remove( inputSegment.getContainedLength(), shapeSegmentList );
        outputSegment.add( length, shapeSegmentList );
      }
      this.updateAttachmentSiteLocation();
    },

    advanceAndRemove: function( length, shapeSegmentList ) {
      var inputSegment = shapeSegmentList.getNextItem( this );
      if ( inputSegment === null ) {

        // There is no input segment, meaning that the end of the mRNA
        // strand is contained in THIS segment, so this segment needs
        // to shrink.
        var lengthToRemove = Math.min( length, this.getContainedLength() );
        this.remove( lengthToRemove, shapeSegmentList );
      }
      else if ( inputSegment.getContainedLength() > length ) {

        // The input segment contains enough mRNA to satisfy this
        // request, so remove the length from there.
        inputSegment.remove( length, shapeSegmentList );
      }
      else {
        // The input segment is still around, but doesn't have
        // enough mRNA within it.  Shrink the input segment to zero
        // and then shrink this segment by the remaining amount.
        this.remove( length - inputSegment.getContainedLength(), shapeSegmentList );
        inputSegment.remove( inputSegment.getContainedLength(), shapeSegmentList );
      }
      this.updateAttachmentSiteLocation();
    },

    // Set size to be exactly the capacity.  Do not create any new
    // segments.
    maxOutLength: function() {
      var growthAmount = this.getRemainingCapacity();
      this.bounds.set( new Rectangle( this.bounds.get().x - growthAmount,
        this.bounds.get().y,
        this.capacity,
        0 ) );
      this.updateAttachmentSiteLocation();
    }


  } );


} );