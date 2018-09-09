// todo: In Statistics, add new common query pages for:
// -> Open greater than close yesterday
// -> Open greater than high yesterday
// -> Open less than close yesterday
// -> Open less than low yesterday
// Add an ngClass for True and False where either is >= 60%

// Sell off page that shows the statistics for days closing lower than open
// Sell off page that shows the statistics for days closing higher than open

1	622	53.39%	53.39%
2	268	23.00%	76.39%
3	146	12.53%	88.93%
4	66	5.67%	94.59%
5	37	3.18%	97.77%
6	20	1.72%	99.48%
7	2	0.17%	99.66%
8	2	0.17%	99.83%
9	0	0.00%	99.83%
10	1	0.09%	99.91%
11	0	0.00%	99.91%
12	1	0.09%	100.00%


// (done) todo: stats to have automatically displayed
All tested against CBA

high[0] > high[-1] or low[0] < low[-1]
True: 89.32%

high[0] < high[-1] or low[0] > low[-1]
True: 90.82%

low[0] > low[-1] and close[0] > open[0]
True: 63.05%

open[0] > close[-1] and close[0] > close[-1]
True: 67.42%

open[0] < close[-1] and close[0] > close[-1]
True: 27.94%

open[0] > close[-1] and high[0] > high[-1]
True: 70.10%
Trades: 709

low[0] < low[-1] and close[0] < close[-1]
True: 79.53%

open[0] < close[-1] and low[0] <= low[-1]
True: 75.53%

open[0] < close[-1] and high[0] >= high[-1]
True: 24.66%

open[0] > high[-1] and close[0] > open[-1]
True: 85.19%

open[0] > high[-1] and close[0] > open[0]
True: 48.62%

open[0] < low[-1] and close[0] < open[0]
True: 47.96%

high[0] >= high[-1]
True: 51.49%

low[0] <= low[-1]
True: 47.96%

close[0] < high[-1]
True: 69.31%
