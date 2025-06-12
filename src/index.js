const DEFAULT_CHAR_HEIGHT = 5;
const DEFAULT_COLOR = '#000';

export const initFont = ({ height=DEFAULT_CHAR_HEIGHT, ...chars }={}, ctx) => {
    if (!chars) {
        console.error('No font provided!');
        return
    }
    if (!ctx) {
        console.error('No context provided');
        return
    }

    return (string, x=0, y=0, size=24, color=DEFAULT_COLOR) => {
        const pixelSize = size / height;
        const renderChar = (charX, char) => {
            const fontCode = chars[char.charCodeAt()] || '';
            let bin = Number.isInteger( fontCode ) ? fontCode : fontCode.codePointAt();
            const binary = ( bin || 0 ).toString( 2 );
            const width = Math.ceil( binary.length / height );

            ctx.fillStyle = color;
            for ( let col = width; col > 0; col-- ) {
                for ( let row = height; row > 0 && bin > 0; row-- ) {
                    if ( bin & 1 ) {
                        ctx.fillRect( x + charX + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize );
                    }
                    bin >>= 1
                }
            }

            return charX + ( width + 1 ) * pixelSize;
        };

        console.debug('Rendering string', string);
        [...string].reduce(renderChar, 0);
    };
};
