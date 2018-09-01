import { PriceBar } from './../../price-bar';
import { DataService } from './../../shared/data.service';
import { Component, OnInit, Input, Query } from '@angular/core';
import { isNumber } from 'util';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.css']
})
export class CustomQueryComponent implements OnInit {

  debugging: string;
  tradeCount: number;
  trueCount: number;
  falseCount: number;
  @Input()
  query: string;
  failedToParseQuery: boolean;
  failedToParseMessage: string;
  private queryPortions: QueryPortion[] = [];

  constructor(private data: DataService) { }

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
    } else {
      // calculate the formula
      this.performCalculation();
    }
  }

  private performCalculation(): void {

  }

  private parseQuery(): boolean {

    this.trueCount = 0;
    this.falseCount = 0;
    this.tradeCount = 0;
    this.failedToParseMessage = '';
    this.failedToParseQuery = false;
    this.queryPortions = [];

    // const equalityIndicators: string[] = [ '<', '<=', '>=', '>' ];

    if (!this.data || !this.data.priceBars || this.data.priceBars.length === 0) {
      this.failedToParseMessage = 'price data is required';
      return false;
    }

    if (!this.query || this.query.trim().length <= 12) {
      this.failedToParseMessage = 'query must be greater than 12 characters';
      return false;
    }

    let index: number;

    /*
    if (equalityIndex <= -1) {
      this.failedToParseMessage = 'equality indicator not found: <, <=, >=, >';
      return false;
    }
    */

    const portions = this.query.split('and');
    portions.forEach(portion => this.queryPortions.push( QueryPortion.parse(this.query) ));

    let priceBarLhs: PriceBar;
    let priceBarRhs: PriceBar;
    let lhsProperty: string;
    let rhsProperty: string;

    const queryPortion = this.queryPortions[0];

    const priceBars = this.data.priceBars;
    for (index = 0; index < priceBars.length + (queryPortion.rhs.index < 0 ? queryPortion.rhs.index : 0); index++) {
      priceBarLhs = priceBars[index + queryPortion.lhs.index];
      priceBarRhs = priceBars[index + Math.abs(queryPortion.rhs.index)];

      lhsProperty = queryPortion.lhs.source + 'Price';
      rhsProperty = queryPortion.rhs.source + 'Price';
      switch (queryPortion.equalityIndicator) {
        case '<':
          if (priceBarLhs[lhsProperty] < priceBarRhs[rhsProperty]) {
            this.trueCount += 1;
          }
          break;
        case '<=':
          if (priceBarLhs[lhsProperty] <= priceBarRhs[rhsProperty]) {
            this.trueCount += 1;
          }
          break;
        case '>':
          if (priceBarLhs[lhsProperty] > priceBarRhs[rhsProperty]) {
            this.trueCount += 1;
          }
          break;
        case '>=':
          if (priceBarLhs[lhsProperty] >= priceBarRhs[rhsProperty]) {
            this.trueCount += 1;
          }
          break;
      }

      this.tradeCount += 1;

    }

    if (this.tradeCount > 0) {
      this.falseCount = this.tradeCount - this.trueCount;
      if (this.trueCount > 0) {
        this.trueCount = (this.trueCount / this.tradeCount) * 100;
      }
      if (this.falseCount > 0) {
        this.falseCount = (this.falseCount / this.tradeCount) * 100;
      }
    }

    this.debugging =
      'lhs.source: ' + queryPortion.lhs.source +
      ', lhs.index: ' + queryPortion.lhs.index +
      ', lhs.result: ' + queryPortion.lhs.result.success +
      ', rhs.result: ' + queryPortion.rhs.result.success +
      ', rhs.source: ' + queryPortion.rhs.source +
      ', rhs.index: ' + queryPortion.rhs.index;

    return true;
  }

  private parseLHS(): void {

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

