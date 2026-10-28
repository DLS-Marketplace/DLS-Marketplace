export const MAX_PHOTOS = 5;
const PHOTO_MAX_DIM = 1200;
const PHOTO_QUALITY = 0.75;

export function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) return readRawFile(file);
  return compressImage(file).catch(() => readRawFile(file));
}

function readRawFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImage(file: File): Promise<string> {
  return readRawFile(file).then(compressDataUrl);
}

function compressDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      const scale = Math.min(1, PHOTO_MAX_DIM / Math.max(w, h));
      w = Math.round(w * scale);
      h = Math.round(h * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unavailable"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", PHOTO_QUALITY));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
