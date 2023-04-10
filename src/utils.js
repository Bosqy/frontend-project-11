import axios from 'axios';
import { object, string } from 'yup';

export const isValidUrl = (feed) => {
  const schema = object({ feed: string().url() });
  return schema.isValid({ feed });
};

export const getRss = (url) => axios.get(url);
