import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { CounselorItem } from '@/api/counselorItem';

interface ProductCardProps {
  onAddProduct: (product: Omit<CounselorItem, 'counselorItemId'>) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ onAddProduct }) => {
  const productLabel = 'ml-2 text-md font-bold flex';
  const productContent = 'text-start py-2 pl-3 w-full bg-white border border-blue-300 rounded-xl';

  const [productName, setName] = useState<string>('');
  const [productPrice, setPrice] = useState<string>('');
  const [productDescription, setDescription] = useState<string>('');

  const maxDescriptionLength = 80;

  const handleAddProduct = () => {
    onAddProduct({
      name: productName,
      fee: Number(productPrice),
      description: productDescription || '',
    });
    setName('');
    setPrice('');
    setDescription('');
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length <= maxDescriptionLength) {
      setDescription(input);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1 space-y-4 bg-blue-50 border-blue-200 border-4 rounded-xl">
      <div>
        <h1 className={productLabel}>상담 이름</h1>
        <input
          className={productContent}
          value={productName}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <h1 className={productLabel}>
          상담 가격 <p className="text-xs text-gray-500 mt-1 ml-2">숫자만 입력 가능합니다</p>
        </h1>
        <div className="relative">
          <input
            className={`${productContent} pr-8`}
            type="number"
            value={productPrice}
            onChange={e => setPrice(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            원
          </span>
        </div>
      </div>
      <div>
        <h1 className={productLabel}>상담 설명</h1>
        <textarea
          className={`${productContent} min-h-32`}
          value={productDescription}
          onChange={handleDescriptionChange}
          maxLength={maxDescriptionLength}
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {productDescription.length}/{maxDescriptionLength} 자
        </p>
      </div>
      <button
        onClick={handleAddProduct}
        className="bg-transparent mx-auto block font-bold mt-4"
        disabled={!productName || !productPrice}
      >
        <FiPlusCircle className="inline mr-1" />
        상품 추가
      </button>
    </div>
  );
};

export default ProductCard;
