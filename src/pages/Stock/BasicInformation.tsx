import { useParams } from "react-router-dom";
import FinanceData from "../../TWSE.json";

export default function BasicInformation() {
  const { id } = useParams();
  const company = FinanceData.filter((item) => item.公司代號 === id);
  console.log(company);
  return <p>basic info</p>;
}
