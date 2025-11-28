import { useEffect, useState } from "react";
import api from "@/api/axios";
import StaffPageBanner from "@/components/staff/StaffPageBanner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProductFormResponseDTO, SupplierDTO, CategoryDTO, AnimalDTO, CountryDTO } from "@/type";
import CropModal from '../../../components/staff/CropModal';
import { base64ToBlob } from "../../../components/staff/utils/base64ToBlob";
import heic2any from "heic2any";
import { resizeImage } from "../../../components/staff/utils/resizeImage";

const StaffAddMenuForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const [uploadedIngredientsImage, setUploadedIngredientsImage] = useState<string | null>(null);
  const [showIngredientsCropModal, setShowIngredientsCropModal] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormResponseDTO | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [animals, setAnimals] = useState<AnimalDTO[]>([]);
  const [countries, setCountries] = useState<CountryDTO[]>([]);

  const [productName, setProductName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  const [priceType, setPriceType] = useState<"W" | "U">("W");
  const [supplierPrice, setSupplierPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [plu, setPlu] = useState("");
  const [pasteurized, setPasteurized] = useState(false);

  const [glutenFreeChecked, setGlutenFreeChecked] = useState(false);
  const [lactoseFreeChecked, setLactoseFreeChecked] = useState(false);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  // const [productImageFile, setProductImageFile] = useState<File | null>(null);

  const [previewIngredientsImageUrl, setPreviewIngredientsImageUrl] = useState<string | null>(null);
  const [_ingredientsImageFile, setIngredientsImageFile] = useState<File | null>(null);

  const [description, setDescription] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // 예: 카테고리 이름 기준으로 분기 (categoryId -> categoryName 매핑이 가능할 때)
  const selectedCategory = categories.find(c => c.categoryId === selectedCategoryId);
  const isMeat = selectedCategory?.categoryName === "Meat";
  const isOther = selectedCategory?.categoryName === "Others";
  const isBulk = selectedCategory?.categoryName === "Bulk";

  const handleCheckboxChange = (type: "glutenFree" | "lactoseFree") => {
    if (type === "glutenFree") {
      setGlutenFreeChecked((prev) => !prev);
    } else if (type === "lactoseFree") {
      setLactoseFreeChecked((prev) => !prev);
    }
  };

  useEffect(() => {
    if (id) fetchProductForm(Number(id));
  }, [id]);

  useEffect(() => {
    if (formData) {
      setProductName(formData.productName);
      setSelectedCategoryId(formData.categoryId);
      setSelectedSupplierId(formData.supplierId);
      setSelectedAnimalId(formData.animalId);
      setSelectedCountryId(formData.originId);
      setPriceType(formData.priceType as "W" | "U");
      setSupplierPrice(formData.supplierPrice.toString());
      setSalePrice(formData.salePrice.toString());
      setPlu(formData.plu.toString());
      setPasteurized(formData.pasteurized);
      setGlutenFreeChecked(formData.allergies.includes("G"));
      setLactoseFreeChecked(formData.allergies.includes("L"));
      setPreviewImageUrl(formData.productImageUrl);
      setPreviewIngredientsImageUrl(formData.ingredientsImageUrl);
      setDescription(formData.description);
      setSuggestion(formData.suggestion);
    }
  }, [formData]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchProductForm = async (productId: number) => {
    try {
      const res = await api.get(`/api/staff/products/${productId}`);
      setFormData(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [supplierRes, categoryRes, animalRes, countryRes] = await Promise.all([
        api.get("/api/staff/products/suppliers"),
        api.get("/api/staff/products/categories"),
        api.get("/api/staff/products/animals"),
        api.get("/api/staff/products/origins"),
      ]);
      setSuppliers(supplierRes.data);
      setCategories(categoryRes.data);
      setAnimals(animalRes.data);
      setCountries(countryRes.data);
    } catch (err) {
      console.error("❌ Failed to fetch init data:", err);
    }
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: boolean } = {};


    if (!productName.trim()) newErrors.productName = true;
    if (!selectedCategoryId) newErrors.categoryId = true;
    if (!selectedSupplierId) newErrors.supplierId = true;
    if (!isOther && !selectedAnimalId) newErrors.animalId = true;
    if (!isOther && !selectedCountryId) newErrors.countryId = true;

    if (!supplierPrice.trim()) newErrors.supplierPrice = true;
    if (!salePrice.trim()) newErrors.salePrice = true;
    if (priceType === "W" && !plu.trim()) newErrors.plu = true;

    if (!description.trim()) newErrors.description = true;
    if (!suggestion.trim()) newErrors.suggestion = true;

    // if (!productImageFile && !previewImageUrl) newErrors.productImage = true;
    // if (!ingredientsImageFile && !previewIngredientsImageUrl) newErrors.ingredientsImage = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // 🚫 저장 중단

    const form = new FormData();
    // ✅ form 기본 값
    form.append("categoryId", String(selectedCategoryId!));
    form.append("productName", productName);
    form.append("supplierId", String(selectedSupplierId!));
    form.append("priceType", priceType);
    form.append("supplierPrice", supplierPrice);
    form.append("salePrice", salePrice);
    form.append("plu", plu);
    form.append("description", description);
    form.append("suggestion", suggestion);

    // ✅ allergy 추가
    const allergyList = [];
    if (glutenFreeChecked) allergyList.push("G");
    if (lactoseFreeChecked) allergyList.push("L");
    allergyList.forEach((a) => form.append("allergies", a));

    // ✅ animal / origin / pasteurized는 Others가 아닐 때만 추가
    if (!isOther) {
      if (selectedAnimalId !== null) {
        form.append("animalId", String(selectedAnimalId));
      }
      if (selectedCountryId !== null) {
        form.append("originId", String(selectedCountryId));
      }
      form.append("pasteurized", String(pasteurized));
    }

    // ✅ 크롭된 메인 이미지 (리사이즈 적용)
    if (previewImageUrl) {
      const blob = base64ToBlob(previewImageUrl);
      const tempFile = new File([blob], "temp.jpg", { type: "image/jpeg" });
      const resizedBlob = await resizeImage(tempFile, 800);
      const resizedFile = new File([resizedBlob], "cropped.jpg", { type: "image/jpeg" });
      form.append("productImage", resizedFile);
    }

    // ✅ 크롭된 재료 이미지 (리사이즈 적용)
    if (previewIngredientsImageUrl) {
      const blob = base64ToBlob(previewIngredientsImageUrl);
      const tempFile = new File([blob], "temp.jpg", { type: "image/jpeg" });
      const resizedBlob = await resizeImage(tempFile, 800);
      const file = new File([resizedBlob], "ingredients.jpg", { type: "image/jpeg" });
      form.append("ingredientsImage", file);
    }

    setIsLoading(true);
    try {
      if (id) {
        form.append("pid", id);
        await api.put(`/api/staff/products/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product updated successfully!");
      } else {
        await api.post("/api/staff/products", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product added successfully!");
      }
      navigate("/staff/menu");
    } catch (err) {
      console.error("❌ Failed to save product:", err);
    }finally{
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true); // ✅ 로딩 시작

    let imageFile = file;

    if (file.name.endsWith(".heic") || file.type === "image/heic") {
      const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
      imageFile = new File([convertedBlob as BlobPart], file.name + ".jpg", {
        type: "image/jpeg",
      });
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setShowCropModal(true);
      setIsLoading(false); // ✅ 로딩 끝
    };
    reader.readAsDataURL(imageFile);
  };

  const handleIngredientsImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true); // 로딩 시작 (선택사항)

    let imageFile = file;

    // ✅ HEIC → JPEG 변환
    if (file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic") {
      try {
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
        imageFile = new File([convertedBlob as BlobPart], file.name + ".jpg", {
          type: "image/jpeg",
        });
      } catch (error) {
        console.error("HEIC 변환 실패:", error);
        alert("HEIC 이미지를 변환할 수 없습니다.");
        setIsLoading(false);
        return;
      }
    }

    // ✅ 최종 파일 저장 (크롭 후 업로드용으로 사용)
    setIngredientsImageFile(imageFile);

    // ✅ base64 → 미리보기 및 크롭 모달
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedIngredientsImage(reader.result as string);  // base64 저장
      setShowIngredientsCropModal(true);                     // 크롭 모달 열기
      setIsLoading(false);                              // 로딩 끝
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <>
      <StaffPageBanner title="Menu" />
      <form className="bg-[#C3E2C6] min-h-screen py-10 px-4 flex justify-center">
        <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-md">
          <div className="flex mb-10">
            <h1 className="text-2xl font-bold mr-3">Create Post</h1>
            <div className="flex">

              <select
                className={`w-full px-2 py-1 rounded-md text-sm border ${errors.categoryId ? "border-red-500" : "border-gray-300"
                  }`}
                value={selectedCategoryId !== null ? String(selectedCategoryId) : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCategoryId(value === "" ? null : Number(value));
                }}
              >
                <option value="" disabled hidden>
                  -- Select Category --
                </option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={String(category.categoryId)}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 1: Image, Product Name, Supplier */}
          <div className="flex flex-col lg:flex-row gap-6 mb-4">
            {/* Image Section */}
            <div className="w-36 h-36 rounded flex flex-col items-start justify-center mx-auto lg:mx-0">
              {previewImageUrl ? (
                <img
                  src={previewImageUrl}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded mb-1"
                />
              ) : (
                <div className="w-full h-full flex items-center bg-gray-300 justify-center text-gray-500 text-sm">
                  No image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer px-2 py-1 text-xs bg-gray-300 rounded mt-1"
              >
                image upload
              </label>
              {showCropModal && uploadedImage && (
                <CropModal
                  imageSrc={uploadedImage}
                  onClose={() => setShowCropModal(false)}
                  onCropDone={(croppedImage) => {
                    setPreviewImageUrl(croppedImage);
                  }}
                />
              )}
            </div>

            {/* Product Name + Supplier Section */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              {/* ✅ Product Name */}
              <div>
                <label className="block text-sm font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  className={`w-full px-2 py-1 rounded-md text-sm border ${errors.productName ? "border-red-500" : "border-gray-300"
                    }`}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Supplier</label>
                <select
                  className={`w-full px-2 py-1 rounded-md text-sm border ${errors.supplierId ? "border-red-500" : "border-gray-300"
                    }`}
                  value={selectedSupplierId !== null ? String(selectedSupplierId) : ""}
                  onChange={(e) => {
                    const id = e.target.value === "" ? null : Number(e.target.value);
                    setSelectedSupplierId(id);
                  }}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.sid} value={String(supplier.sid)}>
                      {supplier.supplierName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Price Type */}
          <div className="flex mb-4 items-center">
            <label className="block text-sm font-semibold mb-1 mr-3">Price Type</label>
            <div className="flex gap-3">
              <label>
                <input
                  type="radio"
                  name="priceType"
                  value="W"
                  checked={priceType === "W"}
                  onChange={() => setPriceType("W")}
                />
                Whole Unit
              </label>

              <label>
                <input
                  type="radio"
                  name="priceType"
                  value="U"
                  checked={priceType === "U"}
                  onChange={() => setPriceType("U")}
                />
                Pre-Pack
              </label>
            </div>
          </div>

          {/* Row 3: Detailed Information */}
          <div className="mb-4 flex flex-col lg:flex-row">
            <div className="flex-1 mr-4">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                <label className="text-sm mr-3 w-[110px]">Cost price / kg</label>
                <input
                  type="text"
                  className={`w-full lg:w-[200px] px-2 py-1 rounded-md text-sm border ${errors.supplierPrice ? "border-red-500" : "border-gray-300"
                    }`}
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(e.target.value)}
                />
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                <label className="text-sm mr-3 w-[110px]">Selling price</label>
                <input
                  type="text"
                  className={`w-full lg:w-[200px] px-2 py-1 rounded-md text-sm border ${errors.salePrice ? "border-red-500" : "border-gray-300"
                    }`}
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>

              {priceType === "W" && (
                <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                  <label className="text-sm mr-3 w-[110px]">PLU</label>
                  <input
                    type="text"
                    className={`w-full lg:w-[200px] px-2 py-1 rounded-md text-sm border ${errors.plu ? "border-red-500" : "border-gray-300"
                      }`}
                    value={plu}
                    onChange={(e) => setPlu(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">
              {!isOther && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Source Animal</label>
                  <select
                    className={`w-full px-2 py-1 rounded-md text-sm border ${errors.animalId ? "border-red-500" : "border-gray-300"}`}
                    value={selectedAnimalId !== null ? String(selectedAnimalId) : ""}
                    onChange={(e) => {
                      const id = e.target.value === "" ? null : Number(e.target.value);
                      setSelectedAnimalId(id);
                    }}
                  >
                    <option value="">Select Animal</option>
                    {(isBulk ? animals : animals.filter((animal) => {
                      if (selectedCategoryId === 2) {
                        return animal.animalId >= 1 && animal.animalId <= 5;
                      } else {
                        return animal.animalId >= 6 || animal.animalId === 4;
                      }
                    })).map((animal) => (
                      <option key={animal.animalId} value={String(animal.animalId)}>
                        {animal.animalName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!isMeat && !isOther && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold">Pasteurized</label>
                  <input
                    type="checkbox"
                    checked={pasteurized}
                    onChange={() => setPasteurized(!pasteurized)}
                    className="w-4 h-4"
                  />
                </div>
              )}

              {!isOther && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Country of Origin</label>
                  <select
                    className={`w-full px-2 py-1 rounded-md text-sm border ${errors.countryId ? "border-red-500" : "border-gray-300"}`}
                    value={selectedCountryId !== null ? String(selectedCountryId) : ""}
                    onChange={(e) => {
                      const id = e.target.value === "" ? null : Number(e.target.value);
                      setSelectedCountryId(id);
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.countryId} value={String(country.countryId)}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>


          {/* Row 4: Ingredients and Allergy Mark */}
          <div className="flex gap-6 mb-6 items-start justify-between">
            {/* Ingredients 이미지 업로드 */}
            <div>
              <label className="block text-sm font-semibold mb-1">Ingredients</label>
              <div className={`w-36 h-36 rounded mb-2 flex items-center justify-center ${errors.ingredientsImage ? "border-2 border-red-500" : "bg-gray-200"}`}>
                {previewIngredientsImageUrl ? (
                  <img
                    src={previewIngredientsImageUrl}
                    alt="ingredients"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="ingredients-image-upload"
                onChange={handleIngredientsImageUpload}
              />
              <label
                htmlFor="ingredients-image-upload"
                className="cursor-pointer px-2 py-1 text-xs bg-gray-300 rounded"
              >
                image upload
              </label>
              {/* ✅ 여기에 크롭 모달 삽입 */}
              {/* ✅ 여기에 ingredients용 모달 삽입 */}
              {showIngredientsCropModal && uploadedIngredientsImage && (
                <CropModal
                  imageSrc={uploadedIngredientsImage}
                  onClose={() => setShowIngredientsCropModal(false)}
                  onCropDone={(croppedImage) => {
                    setPreviewIngredientsImageUrl(croppedImage); // 미리보기용
                    const blob = base64ToBlob(croppedImage);     // 네 함수로 Blob 생성
                    const file = new File([blob], "ingredients.jpg", { type: "image/jpeg" });
                    setIngredientsImageFile(file);               // 전송용 파일로 저장
                  }}
                />
              )}
            </div>

            {/* 알러지 체크박스 */}
            <div className="flex flex-col gap-2 items-end">
              <p className="font-semibold text-sm">Allergy Mark (Option)</p>
              <div className="flex gap-3 items-center">
                <label className="flex items-center">
                  <img
                    src="/Icon/allergy/icon_glutenfree.png"
                    alt="Gluten Free"
                    className="w-6 h-6 mr-2"
                  />
                  <input
                    type="checkbox"
                    className="form-checkbox rounded-full h-5 w-5 text-green-500"
                    id="glutenFree"
                    checked={glutenFreeChecked}
                    value="G" // ✅ 추가
                    onChange={() => handleCheckboxChange("glutenFree")}
                  />
                </label>
                <label className="flex items-center">
                  <img
                    src="/Icon/allergy/icon_lactosefree.png"
                    alt="Lactose Free"
                    className="w-6 h-6 mr-2"
                  />
                  <input
                    type="checkbox"
                    className="form-checkbox rounded-full h-5 w-5 text-purple-500"
                    id="lactoseFree"
                    checked={lactoseFreeChecked}
                    value="L" // ✅ 추가
                    onChange={() => handleCheckboxChange("lactoseFree")}
                  />
                </label>
              </div>
            </div>
          </div>


          {/* Row 5: Product Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Product Description</label>
            <textarea
              className={`w-full border px-2 py-1 rounded-md text-sm ${errors.description ? "border-red-500" : "border-gray-300"}`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Row 6: Serving Suggestion */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Serving suggestion</label>
            <textarea
              className={`w-full border px-2 py-1 rounded-md text-sm ${errors.suggestion ? "border-red-500" : "border-gray-300"}`}
              rows={2}
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              type="button"
              className="bg-[#AD343E] text-white px-4 py-2 rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
        {isLoading && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <span className="text-white text-xl font-semibold animate-pulse">Loading...</span>
  </div>
        )}

      </form >
    </>
  );
};

export default StaffAddMenuForm;