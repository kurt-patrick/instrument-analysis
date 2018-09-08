import { PriceBar } from './../../price-bar';
import { DataService } from './../../shared/data.service';
import { Component, OnInit, Input, Query } from '@angular/core';
import { isNumber } from 'util';
import { setDefaultService } from 'selenium-webdriver/edge';
import { and, forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.css']
})
export class CustomQueryComponent implements OnInit {

  @Input()
  query: string;
  @Input()
  title: string;
  failedToParseQuery: boolean;
  failedToParseMessage: string;
  queryProcessor: QueryProcessor;

  constructor(private data: DataService) {
    this.queryProcessor = new QueryProcessor();
  }

  ngOnInit() {
    if (this.query) {
      this.calculate();
    }
  }

  onKeyPress(value: string) {
    this.failedToParseQuery = false;
    this.query = value.trim();
    // this.parseQuery();
  }

  calculate(): void {
    this.failedToParseQuery = this.parseQuery();
  }

  private parseQuery(): boolean {

    this.failedToParseMessage = '';
    this.failedToParseQuery = false;

    if (!this.data || !this.data.priceBars || this.data.priceBars.length === 0) {
      this.failedToParseMessage = 'price data is required';
      return false;
    }

    if (!this.query || this.query.trim().length <= 6) {
      this.failedToParseMessage = 'query must be at least 7 characters. example query is close[0] > open[0]';
      return false;
    }

    if (!QueryPortion.getEqualityIndicator(this.query)) {
      this.failedToParseMessage = 'equality indicator not found: <, <=, >=, >';
      return false;
    }

    const andStatement = 'and';
    const orStatement = 'or';
    const hasAnd = this.query.indexOf(andStatement) >= 0;
    const hasOr = this.query.indexOf(orStatement) >= 0;
    if (hasAnd && hasOr) {
      this.failedToParseMessage = 'queries that contain [or] statements currently do not support [and] statements also';
      return false;
    }

    const portions = this.query.split( hasOr ? orStatement : andStatement );
    const queryPortions: QueryPortion[] = [];

    for (let index = 0; index < portions.length; index++) {
      const portion = portions[index];
      const queryPortion = QueryPortion.parse(portion);
      if (!queryPortion.result.success) {
        this.failedToParseMessage = '';
        queryPortion.result.messages.forEach(msg => this.failedToParseMessage += msg);
        return false;
      }
      queryPortions.push(queryPortion);
    }

    if (hasOr) {
      this.queryProcessor.processOr(queryPortions, this.data.priceBars);
    } else {
      this.queryProcessor.process(queryPortions, this.data.priceBars);
    }

    return true;
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

  private static processQueryPortion(queryPortion: QueryPortion, subset: PriceBar[], all: PriceBar[]): QueryPortionProcessingResult {
    let criteriaMet: boolean;
    const indexStart = 0 + Math.abs(queryPortion.lhs.index);
    const indexFinish = subset.length + (queryPortion.rhs.index < 0 ? queryPortion.rhs.index : 0);
    const  result = new QueryPortionProcessingResult();
    for (let index = indexStart; index < indexFinish; index++) {
      criteriaMet = QueryProcessor.isEqualityCriteriaMet(index, queryPortion, subset, all);
      if (criteriaMet === true) {
        result.priceBars.push(subset[index]);
      }
      result.incrementCount(criteriaMet);
    }
    return result;
  }

  private static processOrQueryPortions(queryPortions: QueryPortion[], priceBars: PriceBar[]): QueryPortionProcessingResult {

    if (!queryPortions || queryPortions.length !== 2) {
      throw new Error('at least 2 query portions is required to perform an [or] query');
    }

    let criteriaMet: boolean;
    const lhsPortion = queryPortions[0];
    const rhsPortion = queryPortions[1];
    const indexStart = Math.max( 0 + Math.abs(lhsPortion.lhs.index), 0 + Math.abs(rhsPortion.lhs.index) );
    const indexFinish = Math.min(
      priceBars.length + (lhsPortion.rhs.index < 0 ? lhsPortion.rhs.index : 0),
      priceBars.length + (rhsPortion.rhs.index < 0 ? rhsPortion.rhs.index : 0)
    );
    const result = new QueryPortionProcessingResult();

    for (let index = indexStart; index < indexFinish; index++) {
      criteriaMet =
        QueryProcessor.isEqualityCriteriaMet(index, lhsPortion, priceBars, priceBars) ||
        QueryProcessor.isEqualityCriteriaMet(index, rhsPortion, priceBars, priceBars);
      if (criteriaMet === true) {
        result.priceBars.push(priceBars[index]);
      }
      result.incrementCount(criteriaMet);
    }

    return result;
  }

  private static processQueryPortions(queryPortions: QueryPortion[], priceBars: PriceBar[]): QueryPortionProcessingResult {

    if (!queryPortions || queryPortions.length < 1) {
      throw new Error('at least 1 query portion is required');
    }

    let processingResult = QueryProcessor.processQueryPortion(queryPortions[0], priceBars, priceBars);
    if (queryPortions.length >= 2) {

      for (let index = 1; index < queryPortions.length; index++) {
        const subset = processingResult.priceBars;
        processingResult = QueryProcessor.processQueryPortion(queryPortions[index], subset, priceBars);
        if (!processingResult.priceBars || processingResult.priceBars.length < 2) {
          break;
        }
      }

    }

    return processingResult;
  }

  private static isEqualityCriteriaMet(index: number, queryPortion: QueryPortion, subset: PriceBar[], all: PriceBar[]): boolean {

    // the lhs bar should come from [subset] which we are iterating over
    const priceBarLhs = subset[index + Math.abs(queryPortion.lhs.index)];

    // the rhs bar should come from [all] based on the index of lhs +/- queryPortion.rhs.index
    // this is because the bars held in [subset] are just that, a subset of [all],
    // as the equality checks are performed, any that dont meet the criteria are removed
    // and therefore the bar at subset[2] may now actually be the bar from all[5] ...
    const priceBarRhs = all[priceBarLhs.index + Math.abs(queryPortion.rhs.index)];
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

  process(queryPortions: QueryPortion[], priceBars: PriceBar[]): void {
    this.validateProcessParams(queryPortions, priceBars);
    const processingResult = QueryProcessor.processQueryPortions(this.queryPortions, priceBars);
    this.setCountsFromProcessingResult(processingResult);
  }

  processOr(queryPortions: QueryPortion[], priceBars: PriceBar[]): void {
    this.validateProcessParams(queryPortions, priceBars);
    const processingResult = QueryProcessor.processOrQueryPortions(this.queryPortions, priceBars);
    this.setCountsFromProcessingResult(processingResult);
  }

  private validateProcessParams(queryPortions: QueryPortion[], priceBars: PriceBar[]): void {
    this.setDefaults();
    this.priceBars = priceBars;
    this.queryPortions = queryPortions;

    if (!queryPortions || queryPortions.length === 0) {
      throw new Error('at least 1 query portion is required');
    }

    if (!priceBars || priceBars.length < 2) {
      throw new Error('at least 2 price bars are required');
    }
  }

  private setCountsFromProcessingResult(result: QueryPortionProcessingResult) {

    if (!result) {
      throw new Error('QueryPortionProcessingResult cannot be null');
    }

    this.trueCount = result.trueCount;
    this.falseCount = result.falseCount;
    this.tradeCount = result.tradeCount;

    if (this.trueCount + this.falseCount !== this.tradeCount) {
      throw new Error(`${this.trueCount} + ${this.falseCount} should equal ${this.tradeCount}`);
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

export class QueryPortionProcessingResult {

  falseCount = 0;
  tradeCount = 0;
  trueCount = 0;
  priceBars: PriceBar[] = [];
  constructor() { }

  incrementCount(criteriaMet: boolean) {
    if (criteriaMet === true) {
      this.trueCount += 1;
    } else {
      this.falseCount += 1;
    }
    this.tradeCount += 1;
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

    if (!portion || portion.trim().length <= 6) {
      this.result = QueryResult.failure('query must be at least 7 characters');
      return;
    }

    this.queryPortion = portion.trim();
    this.equalityIndicator = QueryPortion.getEqualityIndicator(portion);
    if (!this.equalityIndicator || this.equalityIndicator.trim().length === 0) {
      this.result = QueryResult.failure('equality indicator not found: <, <=, >=, >');
      return;
    }

    const partsArr = this.queryPortion.split(this.equalityIndicator);
    if (!partsArr || partsArr.length !== 2) {
      this.result = QueryResult.failure('query must have 3 parts: [lhs] [comparer] [rhs] e.g. open[0] > close[0]');
      return;
    }

    this.lhs = PriceColumnAndIndex.parse(partsArr[0].trim());
    if (!this.lhs.result.success) {
      this.result = this.lhs.result;
      return;
    }

    this.rhs = PriceColumnAndIndex.parse(partsArr[1].trim());
    if (!this.rhs.result.success) {
      this.result = this.rhs.result;
      return;
    }

    this.result = QueryResult.success();
  }

  static getEqualityIndicator(query: string): string {

    // NOTE: the order of the array is important!
    // '<=' and '>=' must be first otherwise
    // '<' will be found for '<=' and same for '>' giving a false match
    const equalityIndicators: string[] = [ '<=', '>=', '<', '>' ];

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

    if (!value || value.trim().length <= 2) {
      return retVal.setResult(QueryResult.failure('parse: value: must be at least 3 chars long e.g. [low]. actual: ' + value));
    }

    value = value.trim();

    let priceSource: string;
    const validPriceSources: string[] = [ 'low', 'high', 'open', 'close' ];
    for (let index = 0; index < validPriceSources.length; index++) {
      if (value.startsWith(validPriceSources[index])) {
        priceSource = validPriceSources[index];
      }
    }

    if (!priceSource) {
      return retVal.setResult(QueryResult.failure('unknown price source: must be of type low, high, open, close. actual'));
    }

    // if the user has entered just open etc ... instead of open[0] thats fine. default to index 0 and return;
    retVal.index = 0;
    if (value.length === priceSource.length) {
      retVal.source = priceSource;
      return retVal;
    }

    // convert open[0] into [0]
    value = value.replace(priceSource, '').trim();

    // start from the left and work to the right
    const openBracketIndex = value.indexOf('[');
    if (openBracketIndex === -1) {
      return retVal.setResult(QueryResult.failure('opening bracket not found "["'));
    }

    if (openBracketIndex !== 0) {
      return retVal.setResult(QueryResult.failure('opening bracket "[" is in incorrect location'));
    }

    const closeBracketIndex = value.indexOf(']');
    if (closeBracketIndex === -1) {
      return retVal.setResult(QueryResult.failure('closing bracket not found "]"'));
    }

    const priceIndexStr = value.substring(openBracketIndex + 1, closeBracketIndex);
    if (!priceIndexStr || priceIndexStr === '') {
      return retVal.setResult(QueryResult.failure(`no index has been set: expected something like ${priceSource}[0]`));
    }

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

