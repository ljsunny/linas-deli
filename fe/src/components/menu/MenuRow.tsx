import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { MenuItem } from "@/type";

interface Props {
  item: MenuItem;
  handleOpen: (item: MenuItem) => void;
  index: number;
}

// 이미지 로딩 컴포넌트
const OptimizedImage = memo(({ src, alt, className, onError }: {
  src: string;
  alt: string;
  className: string;
  onError: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    onError();
  }, [onError]);

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl" />
      )}
      <img
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
});

// 알레르기 아이콘 컴포넌트
const AllergyIcon = memo(({ src, alt, title }: {
  src: string;
  alt: string;
  title: string;
}) => (
  <img
    src={src}
    alt={alt}
    className="w-6 h-6 transition-transform hover:scale-110"
    title={title}
    loading="lazy"
  />
));

// 국가 플래그 컴포넌트
const CountryFlag = memo(({ countryName, flagUrl }: {
  countryName: string;
  flagUrl: string;
}) => (
  <img
    src={flagUrl}
    alt={`${countryName} flag`}
    className="w-6 h-4 rounded-sm transition-transform hover:scale-110"
    title={countryName}
    loading="lazy"
  />
));

const MenuRow = memo(({ item, handleOpen, index }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 애니메이션 최적화 - requestAnimationFrame 사용
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, Math.min(index * 100, 500)); // 최대 500ms 지연

    return () => clearTimeout(timeout);
  }, [index]);

  // 이미지 URL 메모이제이션
  const imageUrl = useMemo(() => {
    if (imageError) return "/fallback.png";
    
    return item.imageUrl?.startsWith("http")
      ? item.imageUrl
      : `${import.meta.env.VITE_API_BASE_URL}${item.imageUrl}`;
  }, [item.imageUrl, imageError]);

  // 플래그 URL 메모이제이션
  const flagUrl = useMemo(() => {
    return item.countryName
      ? `/Icon/flag/flag_${item.countryName}.png`
      : null;
  }, [item.countryName]);

  // 알레르기 정보 메모이제이션
  const allergyMarks = useMemo(() => {
    return item.allergies ?? [];
  }, [item.allergies]);

  // 제품명 메모이제이션
  const productName = useMemo(() => {
    return item.productName ?? item.product?.productName ?? "No Name";
  }, [item.productName, item.product?.productName]);

  // 설명 메모이제이션 (80자 제한)
  const description = useMemo(() => {
    const desc = item.description ?? item.product?.description ?? "No description available.";
    return desc.length > 80 ? `${desc.slice(0, 80)}...` : desc;
  }, [item.description, item.product?.description]);

  // 클릭 핸들러 최적화
  const handleClick = useCallback(() => {
    handleOpen(item);
  }, [handleOpen, item]);

  // 이미지 에러 핸들러
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // 알레르기 아이콘 렌더링 최적화
  const allergyIcons = useMemo(() => {
    const icons = [];
    
    if (allergyMarks.includes("G")) {
      icons.push(
        <AllergyIcon
          key="gluten"
          src="/Icon/allergy/icon_glutenfree.png"
          alt="Gluten Free"
          title="Gluten Free"
        />
      );
    }
    
    if (allergyMarks.includes("L")) {
      icons.push(
        <AllergyIcon
          key="lactose"
          src="/Icon/allergy/icon_lactosefree.png"
          alt="Lactose Free"
          title="Lactose Free"
        />
      );
    }
    
    return icons;
  }, [allergyMarks]);

  return (
    <article
      className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      }`}
    >
      {/* 이미지 영역 */}
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={productName}
          className="w-full aspect-square object-cover"
          onError={handleImageError}
        />
        
        {/* 국가 플래그 오버레이 */}
        {flagUrl && (
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1">
            <CountryFlag countryName={item.countryName!} flagUrl={flagUrl} />
          </div>
        )}

        {/* 알레르기 정보 오버레이 */}
        {allergyIcons.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {allergyIcons.map((icon, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-full p-1">
                {icon}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 overflow-hidden">
            <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
              {productName}
            </span>
          </h2>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed overflow-hidden">
            <span className="block">
              {description}
            </span>
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end">
        <button
          onClick={handleClick}
          className="group border border-black text-black bg-transparent px-6 py-2 rounded-full hover:bg-black transition-all duration-300"
          aria-label={`Read more about ${productName}`}
        >
          <span className="relative z-10 group-hover:text-white">Read More</span>
        </button>
        </div>
      </div>
    </article>
  );
});

// 디스플레이 네임 설정
MenuRow.displayName = "MenuRow";
OptimizedImage.displayName = "OptimizedImage";
AllergyIcon.displayName = "AllergyIcon";
CountryFlag.displayName = "CountryFlag";

export default MenuRow;