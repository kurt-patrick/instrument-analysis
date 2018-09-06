// todo: introduce OR statement
so we can do high[0] >= high[-1] OR low[0] <= low[-1]

// todo: introduce div for error messages using bootstrap error class


// todo: stats to have automatically displayed
All tested against CBA

high[0] >= high[-1] or low[0] <= low[-1]
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


