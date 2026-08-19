const api = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  async getStocksNews(stockID: string, startDate: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/fin_mind?dataset=TaiwanStockNews&data_id=${stockID}&start_date=${startDate}`,
    );
    return res.json();
  },
  async getStockPrice(stockID: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/stock_prices?start_date=${startDate}&end_date=${endDate}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getPER(stockID: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/stock_pers?start_date=${startDate}&end_date=${endDate}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getTaiwanStockPriceTick(stockID: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/intraday_quotes/latest?data_id=${stockID}`,
    );
    return res.json();
  },
  async getHistoryStockPrice(
    stockID: string,
    startDate: string,
    endDate: string,
  ) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/stock_prices?start_date=${startDate}&end_date=${endDate}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getIncomeStatements(
    stockID: string,
    startDate: string,
    endDate: string,
  ) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/fin_mind?dataset=TaiwanStockFinancialStatements&start_date=${startDate}&end_date=${endDate}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getTradingDailyReport(stockID: string, startDate: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/fin_mind?dataset=TaiwanStockTradingDailyReport&start_date=${startDate}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getStockRevenue(stockID: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/fin_mind?dataset=TaiwanStockMonthRevenue&start_date=${startDate}&end_date=${endDate}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getTaiwanStockKBar(stockID: string, startDate: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/intraday_quotes?date=${startDate}&data_id=${stockID}`,
    );
    return res.json();
  },

  async getTaiwanVariousIndicators5Seconds(startDate: string) {
    const res = await fetch(
      `${this.baseUrl}/api/v1/fin_mind?dataset=TaiwanVariousIndicators5Seconds&start_date=${startDate}`,
    );
    return res.json();
  },
};

export default api;
