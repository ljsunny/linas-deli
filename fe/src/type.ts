// src/types.ts
export interface Product {
  id: number;
  productName: string;
  description: string;
  allergy: string[];
  price: number;
  glutenFree: boolean;
  servingSuggestion: string;
  pasteurized: boolean;
  imageUrl?: string;
  ingredientImageUrl?: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface Animal {
  id: number;
  name: string;
}

export interface MenuItem {
  productDetailId: number;
  product: Product;
  productName: string;
  countryName: string;
  description:string;
  servingSuggestion:string;
  pasteurized:string;
  animalName:string;
  ingredientsImageUrl:string;
  pid:number;
  imageUrl:string;
  country: Country;
  animal: Animal;
  allergies?: string[];
  categoryId: number;
  categoryName: string; 
}
// src/types.ts
export interface Promotion {
  promotionId: number;
  promotionTitle: string;
  promotionImageName: string;
  promotionImageUrl: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export interface User {
  sessionId: string;
}

export interface Order {
  oid: number;
  status: string;
  date: string;
  time: string;
  platterName: string;
  customerName?: string;  // 주문자 이름
  phone?: string;         // 전화번호
  email?: string;         // 이메일
  allergy?: string;       // 알레르기 정보
  message?: string;       // 메시지
}


export interface ProductListDTO {
  pid: number;
  productName: string;
  productImageUrl: string;
  priceType: "W" | "U"; 
  inStock: boolean;
  plu: string;
  categoryId: number; 
}

export interface ProductFormResponseDTO {
  pid: number;
  categoryId: number;
  productName: string;
  supplierId: number;
  priceType: string;
  supplierPrice: number;
  salePrice: number;
  plu: number;
  animalId: number;
  pasteurized: boolean;
  originId: number;
  allergies: ("G" | "L")[]; // AllergyType은 "G" | "L" enum으로 가정
  productImageName: string;
  productImageUrl: string;
  ingredientsImageName: string;
  ingredientsImageUrl: string;
  description: string;
  suggestion: string;
}

export interface SupplierDTO {
  sid: number;
  supplierName: string;
}

export interface CategoryDTO {
  categoryId: number; // categoryId ❌
  categoryName: string;
}

export interface AnimalDTO {
  animalId: number;        // ⛔ 'id'가 아니라 'animalId'
  animalName: string;
}

export interface CountryDTO {
  countryId: number;      // ✅ 'id' ❌ → 'countryId' ⭕
  countryName: string;
}

export interface Supplier {
  sid: number;
  contactName: string;
  supplierName: string;
  sEmail: string;
  sPhone: string;
}