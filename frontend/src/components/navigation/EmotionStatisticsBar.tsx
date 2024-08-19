import React, { useEffect, useState } from 'react';
import { Emotion, getEmotionImage, emotionImages } from '@/pages/emotiondiary/emotion';
import { DiaryResponse } from '@/hooks/emotionDiary';

interface EmotionStatisticsTableProps {
  diaries: DiaryResponse[];
}

const EmotionStatisticsTable: React.FC<EmotionStatisticsTableProps> = ({ diaries }) => {
  const [emotionCounts, setEmotionCounts] = useState<Record<Emotion, number>>({
    행복해요: 0,
    화나요: 0,
    우울해요: 0,
    짜증나요: 0,
    불안해요: 0,
    슬퍼요: 0,
  });

  useEffect(() => {
    setEmotionCounts({
      행복해요: diaries.filter(diary => diary.emotion === '행복해요').length,
      화나요: diaries.filter(diary => diary.emotion === '화나요').length,
      우울해요: diaries.filter(diary => diary.emotion === '우울해요').length,
      짜증나요: diaries.filter(diary => diary.emotion === '짜증나요').length,
      불안해요: diaries.filter(diary => diary.emotion === '불안해요').length,
      슬퍼요: diaries.filter(diary => diary.emotion === '슬퍼요').length,
    });
  }, [diaries]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">감정 통계</h3>
      <div>
        {Object.keys(emotionCounts).map(emotion => (
          <div key={emotion} className="flex items-center mb-2">
            <img src={getEmotionImage(emotion as Emotion)} alt={emotion} className="w-9 h-8" />
            <div className="flex-grow ml-2">
              <div className="relative pt-1">
                <div className="overflow-hidden h-4 mb-1 text-xs flex rounded bg-gray-100">
                  <div
                    style={{
                      width: `${emotionCounts[emotion as Emotion] ? (emotionCounts[emotion as Emotion] / diaries.length) * 100 : 0}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-300"
                  ></div>
                </div>
              </div>
            </div>
            <span className="ml-2">{emotionCounts[emotion as Emotion]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionStatisticsTable;
