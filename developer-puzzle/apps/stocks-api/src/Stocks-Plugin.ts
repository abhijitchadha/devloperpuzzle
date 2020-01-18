import * as NodeCache from 'node-cache';
import axios from 'axios';
import { environment } from './environments/environment';
import {IStockResponse} from './IStockRespons';

const pluginName = 'stocksPlugin';
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
let cachekey: string;
export const stocksPlugin = {
  name: pluginName,
  version: '1.0.0',
  register: async function(server) {
    server.route({
      method: 'GET',
      path: '/beta/stock/{symbol}/chart/{period}',
      options: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
        cache: {
          expiresIn: 30 * 1000,
          privacy: 'private'
      }
    },
      handler: (request, h) => {
        cachekey =  request.params.symbol + request.params.period;
        if(myCache.get(cachekey))
        {
          console.log(myCache.get(cachekey));
          return myCache.get(cachekey);
        }
        else
        {
      return stocksData(request,h)
        }
    }
  });
  }
};
async function stocksData(request, h) : Promise<IStockResponse>
{
  return axios.get(environment.apiURL+'/beta/stock/'+request.params.symbol+'/chart/'+request.params.period+'?token='+environment.apiKey).then((response) => {
    myCache.set(cachekey,response.data);
    console.log(response.data);
    return h.response(response.data);
  }).catch(err=> {
    if(err)
    {
      return {
      };
    }
    console.error(err)});
}
