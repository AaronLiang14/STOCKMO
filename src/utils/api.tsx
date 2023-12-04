const api = {
  hostName: "https://api.finmindtrade.com/api/v4/data?",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjoiMjAyMy0xMS0yMiAxMDo0MDo1NiIsInVzZXJfaWQiOiJBYXJvbkxJYW5nIiwiaXAiOiI1OS4xMjAuMTEuMTI1In0.RJuFpbVur-YtQ2QyLTWoydAASQ2gKwQH8DEQta5yLFQ",
  async getStocksNews(stockID: string, startDate: string) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockNews&data_id=${stockID}&start_date=${startDate}&token=${this.token}`,
    );
    return res.json();
  },
  async getStockPrice(stockID: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockPrice&start_date=${startDate}&end_date=${endDate}&token=${this.token}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getPER(stockID: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockPER&start_date=${startDate}&end_date=${endDate}&token=${this.token}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getTaiwanStockPriceTick(stockID: string) {
    const res = await fetch(
      `https://api.finmindtrade.com/api/v4/taiwan_stock_tick_snapshot?data_id=${stockID}&token=${this.token}`,
    );
    return res.json();
  },
  async getHistoryStockPrice(
    stockID: string,
    startDate: string,
    endDate: string,
  ) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockPrice&start_date=${startDate}&end_date=${endDate}&token=${this.token}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getIncomeStatements(
    stockID: string,
    startDate: string,
    endDate: string,
  ) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockFinancialStatements&start_date=${startDate}&end_date=${endDate}&token=${this.token}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getTradingDailyReport(stockID: string, startDate: string) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockTradingDailyReport&start_date=${startDate}&token=${this.token}&data_id=${stockID}`,
    );
    return res.json();
  },
  async getStockRevenue(stockID: string, startDate: string, endDate: string) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockMonthRevenue&start_date=${startDate}&end_date=${endDate}&token=${this.token}&data_id=${stockID}`,
    );
    return res.json();
  },
};

export default api;
