import { LineChart, XAxis, YAxis, ResponsiveContainer, Line, Label, Tooltip, Legend } from "recharts";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const fakeData = [
    {month: 1, count: 20}, 
    {month: 2, count: 22}, 
    {month: 3, count: 30}, 
    {month: 4, count: 20}, 
    {month: 5, count: 25}, 
    {month: 6, count: 34}, 
    {month: 7, count: 19}, 
    {month: 8, count: 18}, 
    {month: 9, count: 21}, 
    {month: 10, count: 42}, 
    {month: 11, count: 10}, 
    {month: 12, count: 26}, 
]

const TimeChart: FC<{data:any}> = ({data}) => {
    console.log(data)
    return (
        <ResponsiveContainer width='100%'>
            <LineChart data={fakeData}>
                <XAxis dataKey='month' type='number' ticks={Array.from({length: 12}, (value:any, index:any) => index +1)}/>
                <YAxis dataKey='count' type='number'/>
                <Tooltip/>
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0d0d15" strokeWidth={3}/>
            </LineChart>
        </ResponsiveContainer>
    )
}

// ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}

export default TimeChart

