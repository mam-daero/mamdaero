import React from 'react';
import ModalWrapper from '@/components/modal/ModalWrapper';
import Button from '@/components/button/Button';
import { CounselorItem } from '@/api/counselorItem';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CounselorItem;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col gap-5">
        <h2 className="font-bold text-2xl">상품 상세 정보</h2>
        <p>
          <span className="font-bold">상담 이름:</span> {product.name}
        </p>
        <p>
          <span className="font-bold">상담 가격:</span> {product.fee}원
        </p>
        <p>
          <span className="font-bold">상담 설명:</span> {product.description || '설명 없음'}
        </p>
        <div className="flex justify-end space-x-4 mt-4">
          <Button label="수정하기" onClick={onEdit} color="blue" shape="rounded" />
          <Button label="삭제하기" onClick={onDelete} color="red" shape="rounded" />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProductModal;
