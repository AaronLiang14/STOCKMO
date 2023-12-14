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

  const companyWebsite =
    company[0].WebAddress.substring(0, 1) === "w"
      ? `https://${company[0].WebAddress}`
      : `${company[0].WebAddress}`;

  return (
    <div>
      <div className=" mx-auto mt-16 flex flex-col">
        <div className=" rounded-lg shadow ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-300 border border-gray-400 ">
            <tr className="divide-x divide-gray-200 ">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pl-6"
              >
                成立日期
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                {company[0].DateOfIncorporation.substring(0, 4)}/
                {company[0].DateOfIncorporation.substring(4, 6)}/
                {company[0].DateOfIncorporation.substring(6, 8)}
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                上市日期
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pr-6"
              >
                {company[0].DateOfListing.substring(0, 4)}/
                {company[0].DateOfListing.substring(4, 6)}/
                {company[0].DateOfListing.substring(6, 8)}
              </th>
            </tr>
            <tr className="divide-x divide-gray-200">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pl-6"
              >
                已發行股數
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                {company[0].IssuedShares.toString().replace(
                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                  ",",
                )}
                股
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                實收資本額
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pr-6"
              >
                {company[0].PaidinCapitalNTDollars.replace(
                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                  ",",
                )}
              </th>
            </tr>
            <tr className="divide-x divide-gray-200">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pl-6"
              >
                董事長
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                {company[0].Chairman}
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                總經理
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pr-6"
              >
                {company[0].GeneralManager}
              </th>
            </tr>
            <tr className="divide-x divide-gray-200">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pl-6"
              >
                簽證會計師事務所
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                {company[0].AccountingFirm}
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                簽證會計師
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pr-6"
              >
                {company[0].CPAFirst}、{company[0].CPASecond}
              </th>
            </tr>
            <tr className="divide-x divide-gray-200">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pl-6"
              >
                公司地址
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                {company[0].Address}
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xl font-semibold text-gray-900"
              >
                公司網址
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-left text-xl font-semibold text-gray-900 sm:pr-6"
              >
                <a href={companyWebsite}>{companyWebsite}</a>
              </th>
            </tr>
          </table>
        </div>
      </div>
      <div className="my-12">
        <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
          最新財務資訊
        </p>
      </div>
      <div className="mt-12 flex w-full flex-row gap-4">
        <EPS id={id!.toString()} />
        <PER id={id!.toString()} />
      </div>
      <div className="mt-12 flex w-full flex-row  gap-4">
        <Revenue id={id!.toString()} />
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
                      className="py-3.5 text-center text-base font-semibold text-gray-900 "
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
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-6">
                      {year}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 sm:table-cell">
                      <a
                        href={financialReports(id, "1", year, "1")}
                        target="_blank"
                      >
                        {year}Q1
                      </a>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 lg:table-cell">
                      <a
                        href={financialReports(id, "2", year, "1")}
                        target="_blank"
                      >
                        {year}Q2
                      </a>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 lg:table-cell">
                      <a
                        href={financialReports(id, "3", year, "1")}
                        target="_blank"
                      >
                        {year}Q3
                      </a>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 lg:table-cell">
                      <a
                        href={financialReports(id, "4", year, "1")}
                        target="_blank"
                      >
                        {year}Q4
                      </a>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500 lg:table-cell">
                      <a
                        href={financialReports(id, "4", year, "3")}
                        target="_blank"
                      >
                        {year}Q4個體
                      </a>
                    </td>
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
