import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

// Table for CRC32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const bytesPerPixel = 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.46 : width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: rich dark slate #0f172a to #1e293b
      const t = (x + y) / (width + height);
      let r = Math.round(15 + t * 15);
      let g = Math.round(23 + t * 18);
      let b = Math.round(42 + t * 20);
      let a = 255;

      // Palette accent circle in middle
      if (dist < radius) {
        // Inner art gradient: vibrant indigo (#6366f1) -> pink (#ec4899) -> amber (#f59e0b)
        const artDist = dist / radius;
        const angle = Math.atan2(dy, dx);
        const normAngle = (angle + Math.PI) / (2 * Math.PI); // 0 to 1

        if (dist > radius * 0.25 && dist < radius * 0.9) {
          // Palette body
          if (normAngle < 0.4) {
            r = Math.round(99 + normAngle * 100);
            g = Math.round(102 - normAngle * 60);
            b = Math.round(241 - normAngle * 80);
          } else if (normAngle < 0.75) {
            r = Math.round(236);
            g = Math.round(72 + (normAngle - 0.4) * 150);
            b = Math.round(153 - (normAngle - 0.4) * 300);
          } else {
            r = Math.round(245);
            g = Math.round(158 - (normAngle - 0.75) * 80);
            b = Math.round(11 + (normAngle - 0.75) * 100);
          }
        } else if (dist <= radius * 0.25) {
          // Center core / stylus hole
          r = 15;
          g = 23;
          b = 42;
        }

        // Color dots on palette
        const dots = [
          { x: cx - radius * 0.45, y: cy - radius * 0.4, col: [244, 63, 94] },
          { x: cx, y: cy - radius * 0.55, col: [245, 158, 11] },
          { x: cx + radius * 0.45, y: cy - radius * 0.35, col: [16, 185, 129] },
          { x: cx - radius * 0.5, y: cy + radius * 0.2, col: [59, 130, 246] },
        ];

        for (const dot of dots) {
          const ddx = x - dot.x;
          const ddy = y - dot.y;
          if (Math.sqrt(ddx * ddx + ddy * ddy) < radius * 0.12) {
            r = dot.col[0];
            g = dot.col[1];
            b = dot.col[2];
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT (compressed raw scanlines)
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

console.log('PWA PNG icons generated successfully!');
