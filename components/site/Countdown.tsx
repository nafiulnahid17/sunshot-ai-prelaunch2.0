"use client";
import { useEffect, useState } from "react";

export function Countdown(){const [time,setTime]=useState({days:0,hours:0,minutes:0,seconds:0});useEffect(()=>{const target=new Date("2026-10-26T00:00:00+06:00").getTime();const tick=()=>{const distance=Math.max(0,target-Date.now());setTime({days:Math.floor(distance/86400000),hours:Math.floor(distance/3600000)%24,minutes:Math.floor(distance/60000)%60,seconds:Math.floor(distance/1000)%60})};tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer)},[]);return <div className="countdown">{Object.entries(time).map(([label,value])=><div key={label}><strong>{String(value).padStart(2,"0")}</strong><span>{label}</span></div>)}</div>}
