const api = {
  hostName: "https://api.finmindtrade.com/api/v4/data?",
  async getStocksNews(stockID: string, startDate: string) {
    const res = await fetch(
      `${this.hostName}dataset=TaiwanStockNews&data_id=${stockID}&start_date=${startDate}`,
    );
    return res.json();
  },
};

export default api;
