import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import Button from '@/components/button/Button';
import PasswordChangeModal from '@/components/modal/PasswordChangeModal';
import defaultImage from '@/assets/DefaultProfile.jpg';
import useCounselorStore from '@/stores/couselorStore';
import { LoadingIndicator, ErrorMessage } from '@/components/StatusIndicators';
import axiosInstance from '@/api/axiosInstance';
import useAuthStore from '@/stores/authStore';
type Gender = 'M' | 'F' | null;

interface EditedCounselor {
  nickname: string | null;
  birth: string | null;
  tel: string | null;
  gender: string | null;
  intro: string | null;
  introDetail: string | null;
}

interface EditedCounselorWithFile extends EditedCounselor {
  imgFile: File | null;
}

type FieldConfig = {
  name: string;
  type: string;
  key: keyof EditedCounselor | 'name' | 'email' | 'license' | 'level';
  maxLength?: number;
  readOnly?: boolean;
  value?: string;
  extraSpace?: boolean;
};

const CounselorMyPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    name,
    email,
    nickname,
    birth,
    tel,
    gender,
    level,
    license,
    intro,
    introDetail,
    img,
    fetchCounselorInfo,
    updateCounselorInfo,
    updateIntro,
    updateIntroDetail,
    updateImg,
    isLoading,
    error,
  } = useCounselorStore();
  const { logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [editedCounselor, setEditedCounselor] = useState<EditedCounselorWithFile>({
    nickname,
    birth,
    tel,
    gender,
    intro,
    introDetail,
    imgFile: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchCounselorInfo();
  }, [fetchCounselorInfo]);

  useEffect(() => {
    setEditedCounselor({
      nickname,
      birth,
      tel,
      gender,
      intro,
      introDetail,
      imgFile: null,
    });
  }, [nickname, birth, tel, gender, intro, introDetail]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setEditedCounselor({
      nickname,
      birth,
      tel,
      gender,
      intro,
      introDetail,
      imgFile: null,
    });
  };

  const validateBirth = (birth: string): boolean => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(birth)) return false;

    const [year, month, day] = birth.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const validateTel = (tel: string): boolean => {
    const regex = /^010-\d{4}-\d{4}$/;
    return regex.test(tel);
  };

  const formatTelNumber = (value: string) => {
    const telNumber = value.replace(/[^\d]/g, '');
    const telNumberLength = telNumber.length;
    if (telNumberLength <= 3) return telNumber;
    if (telNumberLength <= 7) return `${telNumber.slice(0, 3)}-${telNumber.slice(3)}`;
    return `${telNumber.slice(0, 3)}-${telNumber.slice(3, 7)}-${telNumber.slice(7, 11)}`;
  };
  const getGenderDisplay = (genderValue: Gender) => {
    if (genderValue === 'M') return '남';
    if (genderValue === 'F') return '여';
    return '';
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'tel') {
      const formattedNumber = formatTelNumber(value);
      setEditedCounselor(prev => ({ ...prev, [name]: formattedNumber }));
      if (!validateTel(formattedNumber)) {
        setErrors(prev => ({ ...prev, tel: '올바른 전화번호 형식이 아닙니다 (010-1234-5678).' }));
      } else {
        setErrors(prev => ({ ...prev, tel: '' }));
      }
    } else if (name === 'birth') {
      setEditedCounselor(prev => ({ ...prev, [name]: value }));
      if (!validateBirth(value)) {
        setErrors(prev => ({ ...prev, birth: '올바른 생년월일 형식이 아닙니다 (YYYY-MM-DD).' }));
      } else {
        setErrors(prev => ({ ...prev, birth: '' }));
      }
    } else {
      setEditedCounselor(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedCounselor(prev => ({
        ...prev,
        imgFile: file,
      }));
    }
  };

  const handleImageDelete = () => {
    setEditedCounselor(prev => ({ ...prev, imgFile: null }));
  };

  const handleSave = async () => {
    if (Object.values(errors).some(error => error !== '')) {
      alert('입력 정보를 확인해주세요.');
      return;
    }
    try {
      const { imgFile, intro, introDetail, ...updateData } = editedCounselor;
      await updateCounselorInfo(updateData);

      if (intro !== null) {
        await updateIntro(intro);
      }

      if (introDetail !== null) {
        await updateIntroDetail(introDetail);
      }

      if (imgFile) {
        await updateImg(imgFile);
      }

      setIsEditing(false);
      setAlertMessage('프로필이 성공적으로 업데이트되었습니다.');
      setShowAlert(true);
      fetchCounselorInfo(); // 업데이트 후 최신 정보를 가져옵니다.
    } catch (error) {
      setAlertMessage('프로필 업데이트에 실패했습니다.');
      setShowAlert(true);
    }
  };

  const handleGenderChange = (selectedGender: string) => {
    setEditedCounselor(prev => ({ ...prev, gender: selectedGender }));
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message="FAILED TO LOAD" />;
  }

  const fieldConfigs: FieldConfig[] = [
    { name: '이름', type: 'text', key: 'name', readOnly: true, extraSpace: true },
    { name: '자격번호', type: 'text', key: 'license', readOnly: true, extraSpace: true },
    { name: '이메일', type: 'email', key: 'email', readOnly: true, extraSpace: true },
    { name: '전화번호', type: 'tel', key: 'tel', maxLength: 13, extraSpace: true },
    { name: '생년월일', type: 'date', key: 'birth', extraSpace: true },
    { name: '성별', type: 'gender', key: 'gender' },
  ];

  const getFieldValue = (field: FieldConfig): string => {
    if (field.value !== undefined) {
      return field.value;
    }

    switch (field.key) {
      case 'name':
        return name ?? '';
      case 'email':
        return email ?? '';
      case 'license':
        return license ?? '';
      case 'birth':
        return birth ?? '';
      case 'gender':
        return getGenderDisplay(gender as Gender) ?? '';
      case 'level':
        return `${level}급`;
      default:
        return field.key in editedCounselor
          ? (editedCounselor[field.key as keyof EditedCounselor] ?? '')
          : '';
    }
  };
  // 회원 탈퇴
  const handleDeleteMember = async () => {
    const isConfirmed = window.confirm(
      '정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    );
    if (isConfirmed) {
      try {
        await axiosInstance({
          method: 'patch',
          url: 'cm/member/del',
          data: { email },
        });
        alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
        localStorage.clear();
        logout();
        navigate('/');
      } catch (error) {
        alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <>
      <header className="sticky bg-blue-50 top-0 z-10 border-b-2 mb-5">
        <div className="flex justify-between items-end ms-7 mb-2 w-full">
          <div className="flex-grow">
            {showAlert && (
              <div role="alert" className="alert shadow-lg max-w-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-bold">프로필이 저장되었습니다.</h3>
              </div>
            )}
          </div>
          <div className="flex flex-col my-6 mx-16 justify-end">
            <div className="flex justify-between items-center">
              <div className="flex flex-col text-right text-gray-500 flex-grow">
                <div>상담사님의 정보를 관리해주세요!</div>
              </div>
              <div className="text-4xl font-bold ms-8 flex-shrink-0">
                <span className="text-blue-500">상담사 </span>마이페이지
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex justify-around">
        <div className="flex flex-col items-center w-full md:w-1/4 px-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <img
                src={
                  editedCounselor.imgFile
                    ? URL.createObjectURL(editedCounselor.imgFile)
                    : img || defaultImage
                }
                alt="프로필 사진"
                className="w-48 h-48 rounded-full mx-auto"
              />
              {!isEditing ? (
                <div className="mt-8">
                  <Button
                    label={
                      <span className="flex items-center mx-6">
                        <FiEdit />
                        <div className="ms-2 mt-0.5">프로필 수정하기</div>
                      </span>
                    }
                    onClick={handleEdit}
                    size="lg"
                    textSize="sm"
                    shape="rounded"
                    color="blue"
                  />
                </div>
              ) : null}
              {isEditing && (
                <div className="mt-8">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profileImage"
                  />
                  <label htmlFor="profileImage" className="btn btn-blue btn-sm mr-2">
                    사진 변경
                  </label>
                  <button onClick={handleImageDelete} className="btn btn-red btn-sm">
                    삭제
                  </button>
                </div>
              )}
              {isEditing && (
                <div className="flex flex-col items-center mt-8 space-y-4">
                  <div className="flex justify-center space-x-5">
                    <Button label="저장" onClick={handleSave} shape="rounded" color="blue" />
                    <Button label="취소" onClick={handleCancel} shape="rounded" color="gray" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/4 px-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="flex flex-col h-full space-y-4">
              <form onSubmit={e => e.preventDefault()}>
                {fieldConfigs.map(field => (
                  <li key={field.key} className={`flex flex-col ${field.extraSpace ? 'mb-6' : ''}`}>
                    <div className="flex items-center">
                      <label className="min-w-32 inline-block font-bold text-md">
                        {field.name} :
                      </label>
                      {isEditing ? (
                        field.type === 'gender' ? (
                          <div className="space-x-5 flex justify-center w-full">
                            <Button
                              label="남"
                              onClick={() => handleGenderChange('M')}
                              color={editedCounselor.gender === 'M' ? 'blue' : 'gray'}
                              shape="rounded"
                            />
                            <Button
                              label="여"
                              onClick={() => handleGenderChange('F')}
                              color={editedCounselor.gender === 'F' ? 'blue' : 'gray'}
                              shape="rounded"
                            />
                          </div>
                        ) : field.readOnly ? (
                          <span className="mx-auto font-bold text-md break-keep whitespace-nowrap">
                            {getFieldValue(field)}
                          </span>
                        ) : (
                          <div className="flex flex-col w-full max-w-xs mx-auto">
                            <input
                              type={field.type}
                              name={field.key}
                              className="input input-bordered w-full"
                              value={getFieldValue(field)}
                              onChange={handleChange}
                              readOnly={field.readOnly}
                              maxLength={field.maxLength}
                            />
                            {errors[field.key] && (
                              <span className="text-red-500 text-sm mt-1">{errors[field.key]}</span>
                            )}
                          </div>
                        )
                      ) : (
                        <span className="mx-auto font-bold text-md break-keep whitespace-nowrap">
                          {getFieldValue(field)}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </form>
            </ul>
          </div>
        </div>
        <div className="px-2 w-full md:w-1/4">
          {!isEditing && (
            <div className="flex flex-col mt-8 items-center gap-4 w-full ">
              <Link to={'product'}>
                <Button
                  label="내 상품 관리"
                  onClick={() => {}}
                  size="lg"
                  textSize="md"
                  color="blue"
                  shape="rounded"
                />
              </Link>
              <Link to={'time'}>
                <Button
                  label="상담 일정 관리"
                  onClick={() => {}}
                  size="lg"
                  textSize="md"
                  color="blue"
                  shape="rounded"
                />
              </Link>
              <Link to={'exclude'}>
                <Button
                  label="근무 예외 시간 관리"
                  onClick={() => {}}
                  size="lg"
                  textSize="md"
                  color="blue"
                  shape="rounded"
                />
              </Link>
              <PasswordChangeModal user="counselor" />
              <div className="align-middle">
                <Button
                  label="회원 탈퇴"
                  onClick={handleDeleteMember}
                  color="red"
                  shape="rounded"
                  size="sm"
                  textSize="sm"
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="bg-white w-full p-6 mx-4 mt-6 rounded-lg shadow-md">
        <div className="h-full border-b-gray-200 border-b-4 pb-2 mb-2">
          <label className="block text-gray-700 text-lg font-bold mb-2">한 줄 소개</label>
          {isEditing ? (
            <div className="relative">
              <textarea
                name="intro"
                value={editedCounselor.intro || ''}
                onChange={handleChange}
                className="w-full px-2 border rounded"
                maxLength={30}
              />
              <span className="absolute right-2 bottom-2 text-xs text-gray-500">
                {(editedCounselor.intro || '').length}/100
              </span>
            </div>
          ) : (
            <p>{intro}</p>
          )}
        </div>
        <label className="block text-gray-700 font-bold text-lg mb-2">상세 소개</label>
        {isEditing ? (
          <div className="relative">
            <textarea
              name="introDetail"
              value={editedCounselor.introDetail || ''}
              onChange={handleChange}
              className="w-full  h-full p-2 border rounded"
              rows={6}
              maxLength={2000}
            />
            <span className="absolute right-2 bottom-2 text-xs text-gray-500">
              {(editedCounselor.introDetail || '').length}/2000
            </span>
          </div>
        ) : (
          <p>{introDetail}</p>
        )}
      </div>
    </>
  );
};

export default CounselorMyPage;
