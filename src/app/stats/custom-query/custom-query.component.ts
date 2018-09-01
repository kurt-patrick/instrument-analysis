import { PriceBar } from './../../price-bar';
import { DataService } from './../../shared/data.service';
import { Component, OnInit, Input, Query } from '@angular/core';
import { isNumber } from 'util';
import { setDefaultService } from 'selenium-webdriver/edge';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.css']
})
export class CustomQueryComponent implements OnInit {

  debugging: string;
  @Input()
  query: string;
  failedToParseQuery: boolean;
  failedToParseMessage: string;
  queryProcessor: QueryProcessor;

  constructor(private data: DataService) {
    this.queryProcessor = new QueryProcessor();
  }

  ngOnInit() {
    this.calculate();
    this.query = 'low[0] <= low[-1]';
  }

  onKeyPress(value: string) {
    this.failedToParseQuery = false;
    this.query = value.trim();
    // this.parseQuery();
  }

  calculate(): void {
    this.failedToParseQuery = this.parseQuery();
    if (this.failedToParseQuery === true) {
      this.debugging += 'failedToParseQuery: ' + this.failedToParseQuery;
    }
  }

  private parseQuery(): boolean {

    this.failedToParseMessage = '';
    this.failedToParseQuery = false;

    if (!this.data || !this.data.priceBars || this.data.priceBars.length === 0) {
      this.failedToParseMessage = 'price data is required';
      return false;
    }

    if (!this.query || this.query.trim().length <= 12) {
      this.failedToParseMessage = 'query must be greater than 12 characters';
      return false;
    }

    if (!QueryPortion.getEqualityIndicator(this.query)) {
      this.failedToParseMessage = 'equality indicator not found: <, <=, >=, >';
      return false;
    }

    const portions = this.query.split('and');
    const queryPortions: QueryPortion[] = [];

    portions.forEach(portion => queryPortions.push(QueryPortion.parse(portion.trim())));

    this.queryProcessor.process(queryPortions, this.data.priceBars);

    return true;
  }

  private parseLHS(): void {

  }

}

export class QueryProcessor {

  private falseCount = 0;
  tradeCount = 0;
  private trueCount = 0;
  failedToParseMessage = '';
  failedToParseQuery = false;
  priceBars: PriceBar[] = [];
  queryPortions: QueryPortion[] = [];

  constructor() { }

  private setDefaults(): void {
    this.trueCount = 0;
    this.falseCount = 0;
    this.tradeCount = 0;
    this.failedToParseMessage = '';
    this.failedToParseQuery = false;
    this.priceBars = [];
    this.queryPortions = [];
  }

  private isEqualityCriteriaMet(index: number, queryPortion: QueryPortion): boolean {

    const priceBarLhs = this.priceBars[index + Math.abs(queryPortion.lhs.index)];
    const priceBarRhs = this.priceBars[index + Math.abs(queryPortion.rhs.index)];
    const lhsProperty = queryPortion.lhs.source + 'Price';
    const rhsProperty = queryPortion.rhs.source + 'Price';

    switch (queryPortion.equalityIndicator) {
      case '<':
        return priceBarLhs[lhsProperty] < priceBarRhs[rhsProperty];
      case '<=':
        return priceBarLhs[lhsProperty] <= priceBarRhs[rhsProperty];
      case '>':
        return priceBarLhs[lhsProperty] > priceBarRhs[rhsProperty];
      case '>=':
        return priceBarLhs[lhsProperty] >= priceBarRhs[rhsProperty];
    }

    throw new Error(`case not handled: ${queryPortion.equalityIndicator}`);

  }

  process(queryPortions: QueryPortion[], priceBars: PriceBar[]): void {
    this.setDefaults();
    this.priceBars = priceBars;
    this.queryPortions = queryPortions;

    if (!queryPortions || queryPortions.length === 0) {
      throw new Error('at least 1 query portion is required');
    }

    if (!priceBars || priceBars.length < 2) {
      throw new Error('at least 2 price bars are required');
    }

    const rhsMinIndex = this.queryPortions.reduce((min, qp) => Math.min(min, qp.rhs.index), this.queryPortions[0].rhs.index);

    let index: number;
    if (this.queryPortions.length === 1) {

      // if we have a single query e.g. close > open then trade count will be nearly all bars
      for (index = 0; index < priceBars.length + (rhsMinIndex < 0 ? rhsMinIndex : 0); index++) {
        if (this.queryPortions.every(portion => this.isEqualityCriteriaMet(index, portion))) {
          this.trueCount += 1;
        }
        this.tradeCount += 1;
      }

    } else {

      // if we have multiple query portions then the each successfully match
      // will create smaller and smaller subsets of successful tests
      // as such we need to create a new subset of bars for each query portion based on succesful matches
      let barsSubset: PriceBar[] = [];
      for (index = 0; index < priceBars.length + (rhsMinIndex < 0 ? rhsMinIndex : 0); index++) {
        if (this.queryPortions.every(portion => this.isEqualityCriteriaMet(index, portion))) {
          this.trueCount += 1;
        }
        this.tradeCount += 1;
      }

    }


    if (this.tradeCount) {
      this.falseCount = this.tradeCount - this.trueCount;
    }

  }

  truePercentage(): number {
    if (this.tradeCount && this.trueCount) {
      return (this.trueCount / this.tradeCount) * 100;
    }
    return 0;
  }

  falsePercentage(): number {
    if (this.tradeCount && this.falseCount) {
      return (this.falseCount / this.tradeCount) * 100;
    }
    return 0;
  }

}

/*
 * A query portion refers to a comparsion piece of a query once it is broken down.
 * For example, if we have the query: low[0] < low[-1] and close[0] > open[0]
 * There will be 2 query portions:
 * [1]: low[0] < low[-1]
 * [2]: close[0] > open[0]
 */
export class QueryPortion {
  private equalityIndicators: string[] = [ '<', '<=', '>=', '>' ];

  equalityIndicator: string;
  lhs: PriceColumnAndIndex;
  rhs: PriceColumnAndIndex;
  queryPortion: string;
  result: QueryResult;

  constructor(portion: string) {
    this.queryPortion = portion;

    if (!this.queryPortion || this.queryPortion.trim().length <= 12) {
      this.result = QueryResult.failure('query must be greater than 12 characters');
      return;
    }

    this.equalityIndicator = QueryPortion.getEqualityIndicator(portion);
    if (!this.equalityIndicator || this.equalityIndicator.trim().length === 0) {
      this.result = QueryResult.failure('equality indicator not found: <, <=, >=, >');
      return;
    }

    this.lhs = PriceColumnAndIndex.parse(this.queryPortion.split(' ')[0]);
    if (!this.lhs.result.success) {
      this.result = this.lhs.result;
      return;
    }

    this.rhs = PriceColumnAndIndex.parse(this.queryPortion.split(' ')[2]);
    if (!this.rhs.result.success) {
      this.result = this.rhs.result;
      return;
    }

    this.result = QueryResult.success();
  }

  static getEqualityIndicator(query: string): string {
    const equalityIndicators: string[] = [ '<', '<=', '>=', '>' ];

    let index: number;
    let equalityIndicator: string;

    for (index = 0; index < equalityIndicators.length; index++) {
      equalityIndicator = equalityIndicators[index];
      if (query.indexOf(equalityIndicator) >= 0) {
        return equalityIndicator;
      }
    }

    return '';
  }

  static parse(portion: string): QueryPortion {
    return new QueryPortion(portion);
  }

}

export class PriceColumnAndIndex {

  private validPriceSources: string[] = [ 'low', 'high', 'open', 'close' ];

  index: number;
  source: string;
  result: QueryResult;

  constructor() {
    this.result = QueryResult.success();
  }

  static parse(value: string): PriceColumnAndIndex {
    const retVal = new PriceColumnAndIndex();

    if (!value || value.trim().length <= 3) {
      return retVal.setResult(QueryResult.failure('parse: value: must be at least 4 char long. actual: ' + value));
    }

    value = value.trim();

    // start from the left and work to the right
    const openBracketIndex = value.indexOf('[');
    if (openBracketIndex < 0) {
      return retVal.setResult(QueryResult.failure('opening bracket not found "["'));
    }

    const closeBracketIndex = value.indexOf(']');
    if (openBracketIndex < 0) {
      return retVal.setResult(QueryResult.failure('closing bracket not found "]"'));
    }

    const priceSource = value.substring(0, openBracketIndex);
    const validPriceSources: string[] = [ 'low', 'high', 'open', 'close' ];
    if (!priceSource || -1 === validPriceSources.indexOf(priceSource)) {
      return retVal.setResult(QueryResult.failure('lhs price. expected: low, high, open, close. actual: ' + priceSource));
    }

    const priceIndexStr = value.substring(openBracketIndex + 1, closeBracketIndex);
    const priceIndex: number = Number(priceIndexStr) || 0;

    retVal.index = priceIndex;
    retVal.source = priceSource;

    return retVal;
  }

  private setResult(value: QueryResult): PriceColumnAndIndex {
    this.result = value;
    return this;
  }

  isValidPriceSource(value: string): QueryResult {
    if (!value || -1 === this.validPriceSources.indexOf(value)) {
      return QueryResult.failure('price source: expected: low, high, open, close. actual: ' + value);
    }
    return QueryResult.success();
  }

}

export class QueryResult {

  success: boolean;
  messages: string[] = [];

  constructor() {
    this.success = true;
  }

  static success(): QueryResult {
    const result = new QueryResult();
    result.success = true;
    return result;
  }

  static failure(msg: string): QueryResult {
    const result = new QueryResult();
    result.success = false;
    result.messages = [msg];
    return result;
  }

}

