import { useEffect, useState, Fragment } from "react";
import Axios from "axios";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

import PolicyDetailsCard from "./PolicyDetailsCard";
import Loader from "./Loader";

const Landing = () => {
  const [id, setId] = useState(null);
  const [searchBy, setSearchBy] = useState("");
  const [policyData, setPolicyData] = useState([]);
  const [region, setRegion] = useState("all");
  const [chartData, setChartData] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Axios.get(`http://localhost:8000/api/policy/all/`)
      .then((res) => {
        if (res.data.length > 0) {
          let filteredData,
            month,
            temp,
            temp2 = [];

          if (region === "all") filteredData = res.data;
          else
            filteredData = res.data.filter(
              (policy) => policy.customer_region.toLowerCase() === region
            );

          temp = filteredData.reduce((prevVal, curVal) => {
            const monthName = (date) => {
              let mlist = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
              ];

              return mlist[date.getMonth()];
            };

            month = monthName(new Date(curVal.date_of_purchase));

            if (prevVal[month]) prevVal[month]++;
            else prevVal[month] = 1;

            return prevVal;
          }, {});

          Object.keys(temp).map((key) => {
            temp2.push({
              name: key,
              totalPolicies: temp[key],
            });
          });

          setChartData([...temp2]);
          setIsLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, [region]);

  const renderCustomBarLabel = ({ x, y, width, value }) => {
    return (
      <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
        {value}
      </text>
    );
  };

  const handleSearch = () => {
    let data = {
      searchBy,
      id,
    };

    setIsLoading(true);

    Axios.post(`http://localhost:8000/api/policy/`, data)
      .then((res) => {
        if (!!res.data) {
          setPolicyData([...res.data]);
          setErrorMessage("");
        }
      })
      .catch(() =>
        setErrorMessage(
          `There is no policy with the ${searchBy} id of ${id}, please check and try again.`
        )
      );

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex min-w-full min-h-screen justify-center items-center">
          <Loader />
        </div>
      ) : (
        <Fragment>
          <div className="flex flex-row w-2/4 ml-80 mt-16 px-5 items-center text-xl font-semibold">
            <h3 className="mr-8 ml-3">Search By:</h3>
            <div className="block p-1 items-center mr-6">
              <input
                type="radio"
                checked={searchBy && searchBy === "policy"}
                className="cursor-pointer"
                onChange={() => setSearchBy("policy")}
              />
              <label htmlFor="html" className="ml-2 cursor-pointer">
                Policy Id
              </label>
            </div>
            <div className="flex flex-grow p-1 items-center">
              <input
                type="radio"
                checked={searchBy && searchBy === "customer"}
                className="cursor-pointer text-2xl"
                onChange={() => setSearchBy("customer")}
              />
              <label htmlFor="html" className="ml-2 cursor-pointer">
                Customer Id
              </label>
            </div>
          </div>
          <div className="flex flex-row justify-center min-w-full mt-4">
            <input
              className="flex w-2/4 border-2 border-black px-4 mr-4 rounded-md outline-none"
              type="text"
              onKeyUp={(e) => setId(e.target.value.trim())}
              placeholder="Enter id here ..."
            />
            <button
              className={
                searchBy === "" || !id
                  ? "bg-gray-400 font-semibold p-3 text-xl text-white rounded-md cursor-not-allowed"
                  : "bg-green-800 font-semibold p-3 text-xl text-white rounded-md"
              }
              disabled={searchBy === "" || !id}
              onClick={() => handleSearch()}
              title={
                searchBy === "" || !id ? "Please select id type and number" : ""
              }
            >
              Search
            </button>
          </div>
          {errorMessage && <p className="p-2 text-red-500">{errorMessage}</p>}
          {policyData.length > 0 && (
            <span
              className="flex justify-center -ml-4 mt-8 text-2xl font-bold"
              style={{ width: "900px" }}
            >
              Policy Details:
            </span>
          )}
          {policyData.length > 0 &&
            policyData.map((policy) => (
              <PolicyDetailsCard key={policy.policy_id} data={policy} />
            ))}
          {policyData.length > 0 && (
            <div className="flex flex-col items-center p-4">
              <div
                className="flex justify-end p-4 m-4"
                style={{ width: "900px" }}
              >
                <label className="mr-4 font-semibold text-lg underline">
                  Filter by region:{" "}
                </label>
                <select
                  className="cursor-pointer outline-none border-2 border-black rounded-md px-1 w-1/5"
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                </select>
              </div>
              <BarChart width={900} height={450} data={chartData}>
                <Bar
                  dataKey="totalPolicies"
                  barSize={40}
                  fill="#8884d8"
                  label={renderCustomBarLabel}
                />
                <XAxis dataKey="name" />
                <YAxis />
              </BarChart>
              <span className="font-semibold text-lg mt-4">
                Graphical representation of number of policies purchased(month
                wise).
              </span>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Landing;
