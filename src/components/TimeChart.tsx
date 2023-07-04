import { LineChart, XAxis, YAxis, ResponsiveContainer, Line } from "recharts";
import { FC } from "react";

const TimeChart: FC<{data:any}> = ({data}) => {
    return (
        <ResponsiveContainer width='100%'>
            <LineChart data={data}>
                <XAxis dataKey='month' type="number" ticks={Array.from({length: 12}, (value:any, index:any) => index +1)}/>
                <YAxis dataKey='count' type="number"/>
                <Line type="monotone" dataKey="count" stroke="#0d0d15"/>
            </LineChart>
        </ResponsiveContainer>
    )
}

// ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}

export default TimeChart

