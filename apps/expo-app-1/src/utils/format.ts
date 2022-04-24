import { default as dayjs } from 'dayjs';

export const formatDate = (date: number) => dayjs(date).format('MMMM D, YYYY h:mm A');
export const formatDateShort = (date: number) => dayjs(date).format('YYYY-MM-DD, h:mm');
