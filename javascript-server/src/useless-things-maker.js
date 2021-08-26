const sharp = require('sharp');

const makeUselessImageStream =
	(seedString) => {
		const width = 400;
		const height = 200;

		const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${height} ${height + 2}">
  <!--this rect should have rounded corners-->
  <rect x="0" y="0" width="100%" height="100%" fill="#fff"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.25em" font-size="3em" fill="#000">${seedString}</text>
</svg>
`;
	const svg_buffer = Buffer.from(svg);
	return sharp({
    	create: {
        	width: width,
			height: height,
			channels: 4,
			background: { r: 255, g: 255, b: 255, alpha: 1 },
    	}
	})
  	.composite([
		  {
			  input: svg_buffer,
			  top: 0,
			  left: 0,
		}
	])
	.png();
};

module.exports = {
	makeUselessImageStream
};
