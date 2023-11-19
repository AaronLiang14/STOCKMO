import { useParams } from "react-router-dom";
import FinanceData from "../../data/TWSE.json";

export default function BasicInformation() {
  const { id } = useParams();
  const company = FinanceData.filter((item) => item.公司代號 === id);
  return <p>basic info</p>;
}
