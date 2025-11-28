import Cropper from "react-easy-crop";
import { useState } from "react";
import getCroppedImg from "./utils/getCroppedImg";
import Modal from "react-modal";
import { Area } from "react-easy-crop";

interface Props {
  imageSrc: string;
  onClose: () => void;
  onCropDone: (croppedImage: string) => void;
}

// 모달 루트 설정 (index.tsx or App.tsx에서 해도 됨)
Modal.setAppElement("#root");

export default function CropModal({ imageSrc, onClose, onCropDone }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

 const handleCrop = async () => {
  if (!croppedAreaPixels) return;
  const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
  onCropDone(croppedImage); // base64 결과 전달
  onClose();
  };

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Crop Profile Photo</h2>

      <div className="relative w-full aspect-square bg-black rounded mb-4 overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={(croppedArea, croppedAreaPixels) => {
            console.log("🚨 crop area", croppedArea);
            console.log("✅ final crop", croppedAreaPixels);
            setCroppedAreaPixels(croppedAreaPixels); // 바로 이 croppedAreaPixels이 위 코드의 pixelCrop이야
          }}
        />
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Zoom: {Math.round(zoom * 100)}%</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Rotation: {rotation}°</label>
          <input
            type="range"
            min={0}
            max={360}
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleCrop}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Crop
        </button>
      </div>
    </Modal>
  );
}