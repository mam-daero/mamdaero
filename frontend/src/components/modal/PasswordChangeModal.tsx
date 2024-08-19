import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Button from '@/components/button/Button';
import { changePassword } from '@/api/password';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    message: string;
  };
}

interface PasswordChangeModalProps {
  user: 'client' | 'counselor';
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    const modal = document.getElementById('changePwdModal');
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const changePasswordMutation = useMutation<ApiResponse, Error, PasswordChangeData>({
    mutationFn: changePassword,
    onSuccess: data => {
      if (data.result.message === '변경 실패') {
        setError('현재 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
      } else {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        resetForm();
        const modal = document.getElementById('changePwdModal');
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      }
    },
    onError: () => {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const buttonColor = user === 'counselor' ? 'blue' : 'orange';

  return (
    <>
      <Button
        label="비밀번호 변경하기"
        onClick={openModal}
        size="lg"
        shape="rounded"
        color="gray"
        textSize="sm"
      />
      <dialog className="modal" id="changePwdModal">
        <div className="modal-box">
          <form onSubmit={handleSubmit} className="flex flex-col pt-16 pb-5 px-10 space-y-5">
            <div className="flex flex-col space-y-2">
              {error && (
                <div role="alert" className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 28 28"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}
              <label htmlFor="currentPwd" className="w-full">
                현재 비밀번호
              </label>
              <input
                type="password"
                id="currentPwd"
                className="border w-full p-2"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="newPwd" className="w-full">
                새 비밀번호
              </label>
              <input
                type="password"
                id="newPwd"
                className="border w-full p-2"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="reNewPwd" className="w-full">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                id="reNewPwd"
                className="border w-full p-2"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="modal-action justify-center">
              <Button
                type="submit"
                label="비밀번호 변경"
                shape="rounded"
                color={buttonColor}
                size="lg"
                disabled={changePasswordMutation.isPending}
              />
            </div>
          </form>
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={resetForm}
            >
              ✕
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={resetForm}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default PasswordChangeModal;
