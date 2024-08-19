import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@/components/button/Button';
import ProductCard from '@/components/card/mypage/ProductCard';
import MyCounselBar from '@/components/navigation/MyCounselBar';
import ProductModal from '@/components/modal/ProductModal';
import ProductEditModal from '@/components/modal/ProductEditModal';
import {
  useCounselorItems,
  useCreateCounselorItem,
  useUpdateCounselorItem,
  useDeleteCounselorItem,
} from '@/hooks/useCounselorItem';
import { CounselorItem } from '@/api/counselorItem';
import useAuthStore from '@/stores/authStore';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';

const CounselorManageProductPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { getEmail } = useAuthStore();
  const [selectedProduct, setSelectedProduct] = useState<CounselorItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading } = useCounselorItems();
  const createMutation = useCreateCounselorItem();
  const updateMutation = useUpdateCounselorItem();
  const deleteMutation = useDeleteCounselorItem();

  // memberId가 없는 경우 현재 로그인한 사용자의 이메일에서 추출
  const currentMemberId = memberId || getEmail()?.split('@')[0] || 'unknown';

  const handleAddProduct = (newProduct: Omit<CounselorItem, 'counselorItemId'>) => {
    createMutation.mutate(newProduct);
  };

  const openModal = (product: CounselorItem) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditProduct = (editedProduct: CounselorItem) => {
    updateMutation.mutate(editedProduct);
    setSelectedProduct(editedProduct);
    closeEditModal();
    setIsModalOpen(true);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct && window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      deleteMutation.mutate(selectedProduct.counselorItemId);
      closeModal();
    }
  };

  const filteredProducts =
    products?.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    [];

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-blue-50 border-b-2 mb-12">
        <MyCounselBar
          title1="상담"
          title2="상품 관리"
          subtitle="상담 상품을 손쉽게 관리하고 업데이트 하세요!"
          buttonLabel="뒤로가기"
          user="counselor"
          buttonPath={`/mypage/${currentMemberId}`}
          size="md"
        />
      </div>
      <div className="flex justify-around px-4">
        <div className="w-1/2 pr-4">
          <ProductCard onAddProduct={handleAddProduct} />
        </div>
        <div className="w-1/2 pl-4 ">
          <div className="bg-white p-5 rounded-xl border-4 mb-4">
            <h1 className="text-xl font-bold mb-4 text-center">내 상품 모음</h1>
            <input
              type="text"
              placeholder="상품 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <div
                  key={product.counselorItemId}
                  className="flex items-center p-3 bg-gray-100 rounded-lg"
                >
                  <span className="font-semibold w-1/2 truncate" title={product.name}>
                    {product.name}
                  </span>
                  <span className="text-gray-600 w-1/4 text-right">
                    {product.fee.toLocaleString()}원
                  </span>
                  <div className="w-1/4 min-w-[80px] flex justify-end">
                    <Button
                      label="상세보기"
                      shape="rounded"
                      color="blue"
                      onClick={() => openModal(product)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
          onEdit={openEditModal}
          onDelete={handleDeleteProduct}
        />
      )}
      {selectedProduct && (
        <ProductEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          product={selectedProduct}
          onSave={handleEditProduct}
        />
      )}
    </div>
  );
};

export default CounselorManageProductPage;
