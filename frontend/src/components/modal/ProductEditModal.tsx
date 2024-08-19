import React, { useState } from 'react';
import ModalWrapper from '@/components/modal/ModalWrapper';
import Button from '@/components/button/Button';
import { CounselorItem } from '@/api/counselorItem';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CounselorItem;
  onSave: (editedProduct: CounselorItem) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [editedProduct, setEditedProduct] = useState<CounselorItem>(product);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: name === 'fee' ? Number(value) : value }));
  };

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl">상품 수정</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">상품명</label>
          <input
            type="text"
            name="name"
            value={editedProduct.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">가격</label>
          <input
            type="number"
            name="fee"
            value={editedProduct.fee}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">설명</label>
          <textarea
            name="description"
            value={editedProduct.description || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <Button label="저장" onClick={handleSave} color="blue" shape="rounded" />
          <Button label="취소" onClick={onClose} color="gray" shape="rounded" />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProductEditModal;
