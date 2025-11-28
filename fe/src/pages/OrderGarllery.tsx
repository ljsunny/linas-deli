import PageBanner from "@/components/PageBanner";
import Masonry from "react-masonry-css";

// ✅ 타입 명시: string 배열로 선언
const photos: string[] = [];

for (let i = 1; i <= 6; i++) {
  photos.push(`/image/charcuterie_board/charcuterie${i}.png`);
}

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  640: 2,
};

const OrderGallery = () => {
  return (
    <div>
      <PageBanner title="Gallery" />
      <div className="px-2 m-4">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-2 bg-clip-padding"
        >
          {photos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Charcuterie board ${idx + 1}`}
              className="w-full mb-2 rounded"
            />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default OrderGallery;