import EPS from "@/components/Graph/Finance/EPS";
import PER from "@/components/Graph/Finance/PER";
import Revenue from "@/components/Graph/Finance/Revenue";
import FinanceData from "@/data/StockDetail.json";
import { useParams } from "react-router-dom";

const financialReports = (
  stockID: string,
  quarter: string,
  year: string,
  category: string,
) => {
  return `https://doc.twse.com.tw/server-java/t57sb01?co_id=${stockID}&colorchg=1&kind=A&step=9&filename=${year}0${quarter}_${stockID}_AI${category}.pdf
  `;
};

const financeYears = [
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
];

const tableHead = [
  "年度",
  "第一季",
  "第二季",
  "第三季",
  "第四季",
  "第四季個體",
];

export default function BasicInformation() {
  const { id } = useParams();
  const company = FinanceData.filter(
    (item) => item.SecuritiesCompanyCode === id,
  );

  const basicInfo: { [key: string]: { display: string; value: string } } = {
    establishDate: {
      display: "成立日期",
      value:
        company[0].DateOfIncorporation.substring(0, 4) +
        "/" +
        company[0].DateOfIncorporation.substring(4, 6) +
        "/" +
        company[0].DateOfIncorporation.substring(6, 8),
    },
    listingDate: {
      display: "上市日期",
      value:
        company[0].DateOfListing.substring(0, 4) +
        "/" +
        company[0].DateOfListing.substring(4, 6) +
        "/" +
        company[0].DateOfListing.substring(6, 8),
    },
    issuedShares: {
      display: "已發行股數",
      value:
        company[0].IssuedShares.toString().replace(
          /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
          ",",
        ) + "股",
    },
    paidInCapital: {
      display: "實收資本額",
      value: company[0].PaidinCapitalNTDollars.replace(
        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
        ",",
      ),
    },
    chairman: {
      display: "董事長",
      value: company[0].Chairman,
    },
    generalManager: {
      display: "總經理",
      value: company[0].GeneralManager,
    },
    accountingFirm: {
      display: "簽證會計師事務所",
      value: company[0].AccountingFirm,
    },
    CPA: {
      display: "簽證會計師",
      value: company[0].CPAFirst + "、" + company[0].CPASecond,
    },
    address: {
      display: "公司地址",
      value: company[0].Address,
    },
    website: {
      display: "公司網址",
      value:
        company[0].WebAddress.substring(0, 1) === "w"
          ? `https://${company[0].WebAddress}`
          : `${company[0].WebAddress}`,
    },
  };

  return (
    <div>
      <div className="mx-auto mt-12">
        <div className="my-12">
          <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
            公司基本資料
          </p>
        </div>
        <table className="w-full divide-y divide-gray-300 border border-gray-400 ">
          {Object.keys(basicInfo).map((item) => (
            <tr className="divide-x divide-gray-200 ">
              <th
                scope="col"
                className="text-left text-sm  font-semibold text-gray-900 sm:pl-6 sm:text-xl"
              >
                {basicInfo[item].display}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 sm:text-xl"
              >
                {item === "website" ? (
                  <a href={basicInfo[item].value}>{basicInfo[item].value}</a>
                ) : (
                  basicInfo[item].value
                )}
              </th>
            </tr>
          ))}
        </table>
      </div>
      <div className="my-12">
        <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
          最新財務資訊
        </p>
      </div>
      <div className="mt-12 flex w-full flex-col gap-4 sm:flex-row">
        <EPS id={id!.toString()} />
        <PER id={id!.toString()} />
      </div>
      <div className="mt-12 flex w-full flex-col gap-4  sm:flex-row">
        <Revenue id={id!.toString()} />
      </div>
      <div className="mt-12">
        <div className="sm:flex sm:items-center">
          <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
            歷年財務報表
          </p>
        </div>
        <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {tableHead.map((item) => {
                  return (
                    <th
                      scope="col"
                      className="py-3 text-center text-sm font-semibold text-gray-900 sm:text-base "
                    >
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {financeYears.map((year) => {
                if (typeof id !== "string") {
                  return null;
                }
                return (
                  <tr>
                    <td className="-translate-x-unit-xs whitespace-nowrap py-4 pl-4 pr-3 text-center font-medium text-gray-900 sm:pl-6 sm:text-sm">
                      {year}
                    </td>
                    {["1", "2", "3", "4", "個體"].map((item) => {
                      return (
                        <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 sm:table-cell">
                          <a
                            href={financialReports(id, item, year, "1")}
                            target="_blank"
                          >
                            <span className="hidden sm:inline">{year}</span>
                            {!isNaN(parseInt(item)) && "Q"}
                            {item}
                          </a>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
