import { CandlestickSeries, Chart } from 'lightweight-charts-react-wrapper';
import React from 'react';

import { useFeedWorker } from '~/hooks/useFeedWorker';

export function CandleStick() {
  const { status, candles } = useFeedWorker();
  if (status === 'loading' || candles === undefined || candles.length === 0) {
    return <p>Feed Connection Loading...</p>;
  }

  const chartContainer = document.getElementById('chart-container');
  const options = {
    width: chartContainer?.offsetWidth,
    height: 500, // "300px", //chartContainerRef.current.clientHeight,
    chart: {
      layout: {
        background: {
          type: 'solid',
          color: '#000',
        },
        lineColor: '#2B2B43',
        textColor: '#D9D9D9',
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0)',
      },
      crosshair: {
        color: '#758696',
      },
      grid: {
        vertLines: {
          color: '#2B2B43',
        },
        horzLines: {
          color: '#363C4E',
        },
      },
    },
    series: {
      topColor: 'rgba(32, 226, 47, 0.56)',
      bottomColor: 'rgba(32, 226, 47, 0.04)',
      lineColor: 'rgba(32, 226, 47, 1)',
    },
  };

  return (
    <Chart {...options}>
      <CandlestickSeries
        data={candles}
        upColor="#41BE64"
        downColor="#41BE64"
        borderDownColor="rgba(255, 144, 0, 1)"
        borderUpColor="rgba(255, 144, 0, 1)"
        wickDownColor="rgba(255, 144, 0, 1)"
        wickUpColor="rgba(255, 144, 0, 1)"
      />
    </Chart>
  );
}
