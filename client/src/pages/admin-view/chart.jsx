import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { fetchDailyOrders } from "../../../store/admin/data-slice/index";

const Chart = () => {
  const dispatch = useDispatch();
  const { dailyOrders } = useSelector((state) => state.ordersData);

  useEffect(() => {
    dispatch(fetchDailyOrders()); // Fetch orders when component mounts
  }, [dispatch]);

  console.log("dailyOrders", dailyOrders);

  // Calculate max totalOrders value for dynamic Y-Axis range
  const maxTotalOrders = Math.max(...dailyOrders.map((order) => order.totalOrders));

  // Generate Y-Axis ticks with a fixed gap of 1, from 0 to the maximum totalOrders value
  const yAxisTicks = [];
  for (let i = 0; i <= maxTotalOrders; i++) {
    yAxisTicks.push(i);
  }

  return (
    <div>


      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyOrders}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="day" >
          <Label value="Days" offset={0} position="insideBottom" />
          </XAxis> */}
          <XAxis
  dataKey="date"
  tickFormatter={(date) => new Date(date).getDate()} // Extracts only the day
>
  <Label value="Days" offset={0} position="insideBottom" />
</XAxis>

          <YAxis 
            domain={[0, maxTotalOrders]}  // Dynamic Y-Axis range
            ticks={yAxisTicks}            // Fixed gap of 1 for Y-Axis ticks
          >
            <Label value="Total Orders" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="totalOrders" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    
    </div>
  );
};

export default Chart;
