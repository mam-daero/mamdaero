// src/pages/emotiondiary/emotion.ts
export type Emotion = '행복해요' | '화나요' | '우울해요' | '짜증나요' | '불안해요' | '슬퍼요';

import happyFox from '@/assets/happy_fox.png';
import angryFox from '@/assets/angry_fox.png';
import depressedFox from '@/assets/depressed_fox.png';
import annoyingFox from '@/assets/annoying_fox.png';
import unrestFox from '@/assets/unrest_fox.png';
import sadFox from '@/assets/sad_fox.png';

export const emotionImages: Record<Emotion, string> = {
  행복해요: happyFox,
  화나요: angryFox,
  우울해요: depressedFox,
  짜증나요: annoyingFox,
  불안해요: unrestFox,
  슬퍼요: sadFox,
};

export function getEmotionImage(emotion: Emotion): string {
  return emotionImages[emotion];
}
