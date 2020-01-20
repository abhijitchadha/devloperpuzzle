import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map, filter } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';
import { Observable } from 'rxjs';


  @Injectable()
  export class PriceQueryEffects {
    @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
      PriceQueryActionTypes.FetchPriceQuery,
      {
        run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
          const result: Observable<PriceQueryResponse[]> = this.httpClient
            .get<PriceQueryResponse[]>(
              `${this.env.apiURL}/beta/stock/${action.symbol}/chart/${
                action.period
              }?token=${this.env.apiKey}`
            );

            if(action.Fromdate && action.Todate){
              return result.pipe(
                map((a: PriceQueryResponse[]) =>
                a.filter( r => (new Date(r.date) >= new Date(action.Fromdate) && new Date(r.date)  <= new Date(action.Todate)))),
                map(resp => new PriceQueryFetched(resp as PriceQueryResponse[])));
            }
            else
            {
           return result.pipe(
              map(resp => new PriceQueryFetched(resp as PriceQueryResponse[]))
            );
           }
        },

        onError: (action: FetchPriceQuery, error) => {
          return new PriceQueryFetchError(error);
        }
      }
    );
  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {}
}
