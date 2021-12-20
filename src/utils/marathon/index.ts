import axios, { AxiosResponse } from 'axios';
import { env } from '../../env';
import logging from '../logging';

export const marathonGraphql = async <T>(query: string) => {
  try {
    const { data } = (await axios({
      url: `${env.MARATHON_API_GRAPHQL}?apikey=${env.MARATHON_API_GRAPHQL_KEY}`,
      method: 'post',
      data: { query: query }
    })) as AxiosResponse<T>;
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logging.error(err, 'Error fetching Marathon Graphql api');
    return null;
  }
};
