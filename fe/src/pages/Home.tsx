import { useEffect, useState } from "react";

import Hero from "@/sections/home/Hero";
import About from "@/sections/home/About";
import BestMenu from "@/sections/home/BestMenu";
import Order from "@/sections/home/OrderSection";
import Instagram from "@/sections/home/Instagram";
import PromoPopupModal from "@/components/PromoPopupModal";
import { Promotion } from "@/type";
import api from "@/api/axios";

const Home = () => {
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.get("/api/promotions/active")
      .then((res) => {
        if (res.data?.length > 0) {
          setActivePromotions(res.data);
          setIsModalOpen(true);
        }
      })
      .catch((err) => console.error("Failed to fetch active promotions", err));
  }, []);

  const handleNext = () => {
    if (currentIndex < activePromotions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      {isModalOpen && activePromotions.length > 0 && (
        <PromoPopupModal
          promotions={activePromotions}
          currentIndex={currentIndex}
          onNext={handleNext}
          // onClose={() => setIsModalOpen(false)} // 옵션: 즉시 닫기용
        />
      )}

      <Hero />
      <BestMenu />
      <About />
      <Order />
      <Instagram />
    </div>
  );
};

export default Home;