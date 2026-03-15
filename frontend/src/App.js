import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";

function App() {

const [form,setForm] = useState({
amount:"",
oldbalanceOrg:"",
newbalanceOrig:"",
oldbalanceDest:"",
newbalanceDest:""
});

const [result,setResult] = useState("");
const [riskScore,setRiskScore] = useState(0);
const [history,setHistory] = useState([]);
const [filter,setFilter] = useState("all");

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const checkTransaction = async ()=>{

const transaction = {
step:1,
type:1,
amount:Number(form.amount),
oldbalanceOrg:Number(form.oldbalanceOrg),
newbalanceOrig:Number(form.newbalanceOrig),
oldbalanceDest:Number(form.oldbalanceDest),
newbalanceDest:Number(form.newbalanceDest),
isFlaggedFraud:0
};

const response = await axios.post(
"http://127.0.0.1:8000/transaction",
transaction
);

const status = response.data.status;

setResult(status);

const risk = status==="fraud"
? Math.floor(Math.random()*30)+70
: Math.floor(Math.random()*40)+10;

setRiskScore(risk);

setHistory([...history,{
amount:form.amount,
status:status
}]);

};

const fraudCount = history.filter(t=>t.status==="fraud").length;
const normalCount = history.filter(t=>t.status!=="fraud").length;

const chartData = [
{ name:"Fraud", value:fraudCount },
{ name:"Normal", value:normalCount }
];

const filteredHistory = history.filter(t=>{
if(filter==="all") return true;
return t.status===filter;
});

const exportCSV = ()=>{

const csv =
"Amount,Status\n" +
history.map(t=>`${t.amount},${t.status}`).join("\n");

const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});

saveAs(blob,"fraud_report.csv");

};

return(

<div style={{fontFamily:"Arial",background:"#f5f5f5",minHeight:"100vh"}}>

{/* NAVBAR */}

<div style={{
background:"white",
padding:"15px 40px",
display:"flex",
justifyContent:"space-between",
boxShadow:"0 2px 5px rgba(0,0,0,0.1)"
}}>

<h2>Fraud Detection Dashboard</h2>

<button onClick={exportCSV}>
Download Fraud Report
</button>

</div>

{/* MAIN */}

<div style={{display:"flex",padding:"40px",gap:"40px"}}>

{/* LEFT PANEL */}

<div style={{
background:"white",
padding:"30px",
borderRadius:"10px",
width:"350px",
boxShadow:"0 3px 10px rgba(0,0,0,0.1)"
}}>

<h3>Check Transaction</h3>

<input
name="amount"
placeholder="Amount"
onChange={handleChange}
style={{width:"100%",margin:"10px 0",padding:"8px"}}
/>

<input
name="oldbalanceOrg"
placeholder="Old Balance Org"
onChange={handleChange}
style={{width:"100%",margin:"10px 0",padding:"8px"}}
/>

<input
name="newbalanceOrig"
placeholder="New Balance Orig"
onChange={handleChange}
style={{width:"100%",margin:"10px 0",padding:"8px"}}
/>

<input
name="oldbalanceDest"
placeholder="Old Balance Dest"
onChange={handleChange}
style={{width:"100%",margin:"10px 0",padding:"8px"}}
/>

<input
name="newbalanceDest"
placeholder="New Balance Dest"
onChange={handleChange}
style={{width:"100%",margin:"10px 0",padding:"8px"}}
/>

<button
onClick={checkTransaction}
style={{
width:"100%",
padding:"10px",
background:"#6366f1",
border:"none",
color:"white",
marginTop:"10px"
}}

>

Detect Fraud </button>

{result && (

<div style={{
marginTop:"15px",
padding:"10px",
background: result==="fraud" ? "#fee2e2" : "#dcfce7"
}}>

Result: {result} <br/>

Fraud Risk Score: {riskScore}%

{result==="fraud" && (

<div style={{marginTop:"10px",color:"red"}}>
🚨 Fraud Alert Detected
</div>
)}

</div>
)}

</div>

{/* RIGHT DASHBOARD */}

<div style={{flex:1}}>

{/* STATS */}

<div style={{display:"flex",gap:"20px"}}>

<div style={{
background:"white",
padding:"20px",
borderRadius:"10px",
flex:1
}}>
<h3>Total Transactions</h3>
<p>{history.length}</p>
</div>

<div style={{
background:"white",
padding:"20px",
borderRadius:"10px",
flex:1
}}>
<h3>Fraud Detected</h3>
<p>{fraudCount}</p>
</div>

<div style={{
background:"white",
padding:"20px",
borderRadius:"10px",
flex:1
}}>
<h3>Legitimate</h3>
<p>{normalCount}</p>
</div>

</div>

{/* GRAPH */}

<div style={{
background:"white",
marginTop:"30px",
padding:"20px",
borderRadius:"10px",
height:"300px"
}}>

<h3>Fraud Analytics</h3>

<ResponsiveContainer width="100%" height="80%">
<BarChart data={chartData}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="value" fill="#6366f1"/>
</BarChart>
</ResponsiveContainer>

</div>

{/* TRANSACTION HISTORY */}

<div style={{
background:"white",
marginTop:"30px",
padding:"20px",
borderRadius:"10px"
}}>

<h3>Transaction History</h3>

<select onChange={(e)=>setFilter(e.target.value)}>

<option value="all">All</option>
<option value="fraud">Fraud Only</option>
<option value="normal">Normal Only</option>
</select>

<table style={{
width:"100%",
borderCollapse:"collapse",
marginTop:"10px"
}}>

<thead>
<tr>
<th style={{textAlign:"left"}}>Amount</th>
<th style={{textAlign:"left"}}>Status</th>
</tr>
</thead>

<tbody>

{filteredHistory.map((t,i)=>(

<tr key={i}>
<td style={{padding:"8px"}}>{t.amount}</td>
<td style={{padding:"8px"}}>{t.status}</td>
</tr>
))}

</tbody>

</table>

</div>

</div>

</div>

</div>

);

}

export default App;
