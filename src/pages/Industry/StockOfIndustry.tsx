import { useNavigate } from "react-router-dom";
import StockCode from "../../data/StockCode.json";

interface StockOfIndustryProps {
  industry: string;
}

export default function StockOfIndustry({ industry }: StockOfIndustryProps) {
  const stockDependOnIndustry = StockCode.filter(
    (stock) => stock.產業別 === industry,
  );
  const navigate = useNavigate();

  return (
    <ul
      role="list"
      className="grid cursor-pointer grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4"
    >
      {stockDependOnIndustry.map((stock) => (
        <li
          key={stock.證券代號}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-gray-100 text-center shadow"
          onClick={() => navigate(`/stock/${stock.證券代號}`)}
        >
          <div className="flex flex-1 flex-col p-8">
            <img
              className="mx-auto  flex-shrink-0 rounded-full"
              src="https://firebasestorage.googleapis.com/v0/b/stock-mo2.appspot.com/o/images%2F2330.png?alt=media&token=00c119d5-de58-47cd-b5a4-251fa4582810"
              alt=""
            />
            <h3 className="mt-6 text-sm font-medium text-gray-900">
              {stock.證券名稱}
              {stock.證券代號}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-sm text-gray-500">{stock.市場別}</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  收盤價
                </span>
              </dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
