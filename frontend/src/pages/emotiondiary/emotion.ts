export type Emotion = '행복해요' | '화나요' | '우울해요' | '짜증나요' | '불안해요' | '슬퍼요';

export const emotionEmojis: Record<Emotion, string> = {
  행복해요: '😊',
  화나요: '😡',
  우울해요: '😢',
  짜증나요: '😤',
  불안해요: '😰',
  슬퍼요: '😔',
};

export function getEmoji(emotion: Emotion): string {
  return emotionEmojis[emotion];
}
