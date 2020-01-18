import { Component, OnInit } from '@angular/core';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import {FormBuilder,FormGroup,Validators, ValidationErrors, ValidatorFn} from '@angular/forms'
import {formatDate } from '@angular/common';


@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  maxDate : Date = new Date();
  fromDate : Date;
  quotes$ = this.priceQuery.priceQueries$;
  intervals = [
    { key:'1d', value: 1},
    { key:'5d', value: 5},
    { key:'1m', value: 30},
    { key:'3m', value: 90},
    { key:'6m', value: 180},
    {key :'1y' , value : 365},
    {key :'2y' , value : 720},
    {key :'5y' , value : 1825},
    {key: 'max', value : 1826}
    ]

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' },
    { viewValue: 'Custom Range', value: 'custom' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      Fromdate: [null],
      Todate: [null]
    });
   this.stockPickerForm.setValidators(this.dateValidation());
  }

  ngOnInit() {}

  public dateValidation() : ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
    const controlFromdate = this.stockPickerForm.controls["Fromdate"];
    const controlTodate = this.stockPickerForm.controls["Todate"];
   if(controlFromdate.value && controlTodate.value && (controlFromdate.value > controlTodate.value))
   {
    controlFromdate.setValue(controlTodate.value);
   }
   return;
   }
  }
  dropdownchange(){
      this.stockPickerForm.controls["Fromdate"].reset();
      this.stockPickerForm.controls["Todate"].reset();
  }
  fetchQuote() {
    console.log(this.quotes$);
    if (this.stockPickerForm.valid) {
      const { symbol, period, Fromdate, Todate } = this.stockPickerForm.value;
      if(period !== 'custom')
      {
      this.priceQuery.fetchQuote(symbol, period);
      }
      else if(Fromdate && Todate)
        {
          console.log(Fromdate);
           const formatedFormDate= formatDate(Fromdate ,'yyyy-MM-dd','en-us');
           const formatedTODate= formatDate(Todate ,'yyyy-MM-dd','en-us');
           console.log(formatedFormDate);
          const periodrangemax = this.getPeriod(formatedFormDate);
          console.log(periodrangemax);
          const periodrange = "max";
          this.priceQuery.fetchQuote(symbol,periodrangemax,formatedFormDate,formatedTODate)
        }
      }
  }
   getPeriod(fromDate : string){
  let period = 'max';
    const diff = Math.abs(new Date().getTime() - new Date(fromDate).getTime());
    const days = Math.ceil(diff / (1000 * 3600 * 24));

    for (let i =0; i < this.intervals.length; i++) {
        if(this.intervals[i].value - days >= 0){
         period = this.intervals[i].key;
         break;
        }
      }
      return period;
    }
  }
