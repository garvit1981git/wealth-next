"use client";

import getdata from "@/app/actions/getdata";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { defaultCategories } from "../../../data/categary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import GetUserAccounts from "@/app/actions/GetUserAccounts";

const DefAccountRecList = ({ userid, setacc, acc }) => {
  const [dataset, setdata] = useState([]);

  let [allacc, setallacc] = useState([]);
  useEffect(() => {
    let getacc = async () => {
      let res = await GetUserAccounts();
      console.log("acc are ", res);
      let defacc = res.filter((acc) => acc.isDefault == true);
      console.log("deffacc", defacc);
      setallacc(res);
      setacc(defacc[0].accountname);
    };
    getacc();
  }, [userid]);
  useEffect(() => {
    async function load() {
      const res = await getdata(userid, acc);

      let sorteddata = res.sort((a, b) => {
        let avalue = a.date;
        let bvalue = b.date;
        return new Date(bvalue) - new Date(avalue);
      });
      setdata(sorteddata);
    }
    load();
  }, [userid, acc]);

  return (
    <div className="max-w-3xl mx-auto bg-mainBg rounded-xl shadow-sm border">
      {/* Heading */}
      <div className="px-5 py-4 border-b ">
        <h2 className="text-lg font-semibold text-primaryText">
          Recent Transactions
        </h2>
        <Select value={acc} onValueChange={setacc}>
          <SelectTrigger className="w-[200px] capitalize">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="bg-mainBg shadow-sm capitalize">
            {allacc.map((acc) => (
              <SelectItem
                key={acc._id} // or acc.accountname if _id does not exist
                value={acc.accountname}
              >
                {acc.accountname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-separate border-spacing-y-1">
        <tbody>
          {dataset.map((t) => {
            const category = defaultCategories.find((c) => c.id === t.category);
            const Icon = Icons[category?.icon] || Icons.MoreHorizontal;

            return (
              <tr
                key={t._id}
                className="border-b last:border-none transition-all duration-200 hover:bg-mainBg rounded-lg"
              >
                {" "}
                {/* Date */}
                <td className="px-5 py-3 text-primaryText whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                {/* Description */}
                <td className="px-5 py-3 text-primaryText capitalize">
                  {t.description || "—"}
                </td>
                {/* Category */}
                <td className="px-5 py-3">
                  <span
                    className="group inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      backgroundColor: `${category?.color}20`,
                      color: category?.color,
                    }}
                  >
                    <Icon
                      size={14}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    {category?.name || "Other"}
                  </span>
                </td>
                {/* Amount */}
                <td
                  className={`px-5 py-3 text-right font-semibold transition-colors duration-200 ${
                    t.type === "Income"
                      ? "text-green-600 hover:text-green-700"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  {t.type === "Income" ? "+" : "-"}₹{t.amount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Empty state */}
      {dataset.length === 0 && (
        <p className="text-center text-gray-500 py-6">No recent transactions</p>
      )}
    </div>
  );
};

export default DefAccountRecList;
