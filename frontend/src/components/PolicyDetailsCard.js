import { useEffect, useState } from "react";
import Axios from "axios";

const PolicyDetailsCard = ({ data }) => {
  const [policyData, setPolicyData] = useState({});
  const [premiumUpdate, setPremiumUpdate] = useState(false);
  const [newPremium, setNewPremium] = useState(null);

  useEffect(() => {
    setPolicyData(data);
  }, []);

  const handleUpdate = () => {
    const updatedData = {
      searchBy: "policy",
      id: policyData.policy_id,
      premium: newPremium,
    };

    Axios.put(`http://localhost:8000/api/policy/update`, updatedData)
      .then((res) => {
        if (res.data) {
          setPolicyData(res.data[0]);
          setPremiumUpdate(false);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="flex flex-col mx-auto text-left mt-4 p-6 bg-indigo-400 rounded-md"
      style={{ width: "900px" }}
    >
      <div className="grid grid-cols-2 text-left text-xl">
        <div className="flex flex-col justify-around px-4">
          <div className="py-1">
            <span className="font-semibold">Policy Id: </span>
            {policyData.policy_id}
          </div>
          <div className="py-1">
            <span className="font-semibold">Customer Id: </span>
            {policyData.customer_id}
          </div>
          <div className="py-1">
            <span className="font-semibold">Purchase Date: </span>
            {policyData.date_of_purchase}
          </div>
          <div className="py-1">
            <span className="font-semibold">Vehicle Segment: </span>
            {policyData.vehicle_segment}
          </div>
          <div className="py-1">
            <span className="font-semibold">Personal Injury Protection: </span>
            {policyData.personal_injury_protection}
          </div>
          <div className="py-1">
            <span className="font-semibold">Bodily Injury Liability: </span>
            {policyData.bodily_injury_liability}
          </div>
          <div className="py-1">
            <span className="font-semibold">Property Damage Liability: </span>
            {policyData.property_damage_liability}
          </div>
        </div>
        <div className="flex flex-col justify-around px-4">
          <div>
            <span className="font-semibold">Gender: </span>
            {policyData.customer_gender}
          </div>
          <div>
            <span className="font-semibold">Martial Status: </span>
            {policyData.customer_marital_status === 0 ? "Single" : "Married"}
          </div>
          <div>
            <span className="font-semibold">Region: </span>
            {policyData.customer_region}
          </div>
          <div>
            <span className="font-semibold">Fuel Type: </span>
            {policyData.fuel}
          </div>
          <div>
            <span className="font-semibold">Income: </span>
            {policyData.customer_income_group}
          </div>
          <div>
            <span className="font-semibold">Collision: </span>
            {policyData.collision}
          </div>
          <div>
            <span className="font-semibold">Comprehensive: </span>
            {policyData.comprehensive}
          </div>
        </div>
      </div>
      <div className="text-right mr-10 mt-6 text-2xl font-semibold">
        <span>Total Premium: </span>
        {policyData.premium}
        <span
          className="text-sm underline ml-4 cursor-pointer hover:text-red-700 text-blue-50"
          onClick={() => {
            setPremiumUpdate(!premiumUpdate);
            setNewPremium(null);
          }}
        >
          {premiumUpdate ? "cancel update" : "update premium"}
        </span>
        {premiumUpdate && (
          <div className="flex flex-col justify-end mt-2">
            <div>
              <input
                type="text"
                className="rounded-md mr-4 px-2 py-1 w-1/4 outline-none"
                defaultValue={policyData.premium}
                onChange={(e) => setNewPremium(e.target.value)}
              />
              <button
                className={
                  newPremium <= 0 || newPremium > Math.pow(10, 6)
                    ? "bg-gray-400 text-white px-4 py-1 cursor-not-allowed rounded-md"
                    : "bg-green-300 rounded-md px-4 py-1 hover:text-white"
                }
                onClick={() => handleUpdate()}
                disabled={newPremium <= 0 || newPremium > Math.pow(10, 6)}
              >
                Update
              </button>
            </div>
            {
              <span className="text-red-700 text-sm mt-4">
                *** Premium amount should be between 0-1000000.
              </span>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyDetailsCard;
