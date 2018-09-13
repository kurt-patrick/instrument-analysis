import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-risk-reward',
  templateUrl: './risk-reward.component.html',
  styleUrls: ['./risk-reward.component.css']
})
export class RiskRewardComponent implements OnInit {

  entryPrice: number;
  stopPrice: number;
  profitPrice: number;
  maxTradeRisk: number;
  brokerageIn: number;
  brokerageOut: number;
  contractSizePerPoint: number;
  riskReward: string;
  contractsToTrade: number;

  constructor() {
    this.maxTradeRisk = 250;
    this.brokerageIn = 10;
    this.brokerageOut = 10;
    this.contractSizePerPoint = 5;
  }

  ngOnInit() {
  }

  calculate(): void {
    this.contractsToTrade = 0;
    this.riskReward = '';
    if (this.entryPrice && this.stopPrice && this.maxTradeRisk && this.brokerageIn && this.brokerageOut) {
      const capitalAvailableAfterBrokerage = Math.abs(this.maxTradeRisk) - Math.abs(this.brokerageIn) - Math.abs(this.brokerageOut);
      const stopDistance = Math.abs(this.entryPrice - this.stopPrice);
      if (capitalAvailableAfterBrokerage <= 0) {
        return;
      }

      if (this.contractSizePerPoint < 1) {
        this.contractSizePerPoint = 1;
      }

      const capitalRequiredBasedOnStop = stopDistance * this.contractSizePerPoint;
      const totalRiskIncludingBrokerage = capitalRequiredBasedOnStop + this.brokerageIn + this.brokerageOut;
      if (capitalRequiredBasedOnStop > capitalAvailableAfterBrokerage) {
        this.riskReward = `Trade risk is $${totalRiskIncludingBrokerage}. This exceeds your max of $${this.maxTradeRisk}.`;
        return;
      }

      this.contractsToTrade = Math.floor(capitalAvailableAfterBrokerage / capitalRequiredBasedOnStop);
      const tradeRisk = this.contractsToTrade * capitalRequiredBasedOnStop;
      this.riskReward = `Risk: $${tradeRisk}`;

      const profitDistance = Math.abs(this.entryPrice - this.profitPrice);
      const tradeReward = this.contractsToTrade * profitDistance * this.contractSizePerPoint;
      const tradeRatio = tradeReward / tradeRisk;
      this.riskReward += `, Reward: $${tradeReward}, Ratio: ${tradeRatio}`;

    }
  }

}
