const DAILY_LIMIT = 10;
const STORAGE_KEY = 'daily_usage_count';
const STORAGE_DATE_KEY = 'usage_date';

export interface UsageInfo {
  count: number;
  date: string;
  remaining: number;
}

export const getUsageInfo = (): UsageInfo => {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
  const storedCount = localStorage.getItem(STORAGE_KEY);

  // 날짜가 바뀌었으면 카운트 리셋
  if (storedDate !== today) {
    localStorage.setItem(STORAGE_DATE_KEY, today);
    localStorage.setItem(STORAGE_KEY, '0');
    return {
      count: 0,
      date: today,
      remaining: DAILY_LIMIT
    };
  }

  const count = parseInt(storedCount || '0', 10);
  return {
    count,
    date: today,
    remaining: Math.max(0, DAILY_LIMIT - count)
  };
};

export const incrementUsage = (): boolean => {
  const usageInfo = getUsageInfo();
  
  if (usageInfo.remaining <= 0) {
    return false; // 제한 초과
  }

  const newCount = usageInfo.count + 1;
  localStorage.setItem(STORAGE_KEY, newCount.toString());
  
  return true;
};

export const canUse = (): boolean => {
  const usageInfo = getUsageInfo();
  return usageInfo.remaining > 0;
};
