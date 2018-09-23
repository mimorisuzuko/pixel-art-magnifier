const { createCanvas, loadImage } = require('canvas');

module.exports = async (imagePath, ratio) => {
	const image = await loadImage(imagePath);
	const { width, height } = image;
	const src = createCanvas(width, height);
	const scx = src.getContext('2d');
	scx.drawImage(image, 0, 0, width, height);
	const { data: sdata } = scx.getImageData(0, 0, width, height);
	const dstWidth = width * ratio;
	const dstHeight = height * ratio;
	const dst = createCanvas(dstWidth, dstHeight);
	const dcx = dst.getContext('2d');
	const imageData = dcx.getImageData(0, 0, dstWidth, dstHeight);
	const { data: ddata } = imageData;

	for (let i = 0; i < width; i += 1) {
		for (let j = 0; j < height; j += 1) {
			const index = 4 * (i + j * width);
			const r = sdata[index];
			const g = sdata[index + 1];
			const b = sdata[index + 2];
			const a = sdata[index + 3];

			for (let n = 0; n < ratio; n += 1) {
				for (let m = 0; m < ratio; m += 1) {
					const target = 4 * (i * ratio + n + (j * ratio + m) * dstWidth);

					ddata[target] = r;
					ddata[target + 1] = g;
					ddata[target + 2] = b;
					ddata[target + 3] = a;
				}
			}
		}
	}

	dcx.putImageData(imageData, 0, 0);

	return dst.toBuffer();
};
