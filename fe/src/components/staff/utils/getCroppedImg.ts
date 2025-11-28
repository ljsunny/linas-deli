import { Area } from "react-easy-crop";

// 이미지 객체 생성
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // CORS 에러 방지
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

// 각도 → 라디안 변환
const getRadianAngle = (degree: number): number => (degree * Math.PI) / 180;

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number = 0
): Promise<string> {
  const image = await createImage(imageSrc);

  // 회전 라디안
  const rotRad = getRadianAngle(rotation);

  // 회전 후 이미지가 전부 들어갈 수 있도록 캔버스 크기 계산
  const sin = Math.abs(Math.sin(rotRad));
  const cos = Math.abs(Math.cos(rotRad));
  const newWidth = image.width * cos + image.height * sin;
  const newHeight = image.width * sin + image.height * cos;

  // 회전된 이미지 그릴 캔버스
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext("2d")!;

  // 이미지 회전 중심을 캔버스 중심으로 옮기고 회전 적용
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // 회전된 이미지 그리기
  ctx.drawImage(image, 0, 0);

  // crop 영역만큼 자를 새로운 캔버스
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;
  const croppedCtx = croppedCanvas.getContext("2d")!;

  // crop 영역 복사
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // 최종 base64 이미지 반환
  return croppedCanvas.toDataURL("image/jpeg");
}