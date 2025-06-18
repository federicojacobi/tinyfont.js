'use strict';

const DEFAULT_CHAR_HEIGHT = 5;
const DEFAULT_COLOR = '#000';

const initFont = ({ height=DEFAULT_CHAR_HEIGHT, ...chars }={}, ctx) => {
    if (!chars) {
        console.error('No font provided!');
        return
    }
    if (!ctx) {
        console.error('No context provided');
        return
    }

    const keys = Object.keys( chars ).map( i => parseInt( i ) );
    const len = Math.max( ... keys ) + 1;
    const widths = new Uint8Array( len );
    const bins = new Uint32Array( len );

    // Pre-compute the binary values for each char.
    keys.forEach( ( key ) => { 
        const char = chars[ key ];
        if ( char != undefined ) {
            const bin = Number.isInteger( char ) ? char : char.codePointAt();
            const binary = bin.toString( 2 );
            const width = Math.ceil( binary.length / height );
            // console.log( key );
            // chars[ key ] = {
            //     data: bin | 0,
            //     width: width,
            // };
            bins[ key ] = bin;
            widths[ key ] = width;
        }
    } );

    const mask = ( 1 << height ) - 1;

    return ( string, x = 0, y = 0, size = 24, color = DEFAULT_COLOR ) => {
        const pixelSize = size / height;
        ctx.fillStyle = color;
        for ( let i = 0, pad = 0; i < string.length; i++ ) {
            let char = bins[ string.charCodeAt( i ) ];
            let bin = ( char ) ? bins[ string.charCodeAt( i ) ] : 0;
            const width = ( char ) ? widths[ string.charCodeAt( i ) ] : 0;

            for ( let col = width; col > 0; col-- ) {
                let rowPos = height - 1;
                for ( let row = bin & mask; row > 0; row >>= 1 ) {
                    if ( row & 1 ) {
                        let y1 = y + rowPos * pixelSize, h = pixelSize;

                        // This while loop greatly reduces the amount of draw calls.
                        // If you need a few more bytes, you could remove this.
                        while ( ( row >> 1 ) & 1 ) {
                            y1 -= pixelSize;
                            h += pixelSize;
                            row >>= 1;
                            rowPos--;
                        }

                        ctx.fillRect( x + pad + col * pixelSize, y1, pixelSize, h );
                    }
                    rowPos--;
                }
                bin >>= height;
            }

            pad += ( width + 1 ) * pixelSize;
        }    };
};

exports.initFont = initFont;
