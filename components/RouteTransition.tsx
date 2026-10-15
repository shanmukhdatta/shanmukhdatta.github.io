'use client';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';
export function RouteTransition(){const path=usePathname();const [nonce,setNonce]=useState(0);useEffect(()=>{setNonce(n=>n+1)},[path]);return <div className="route-transition" key={nonce} aria-hidden="true"/>;}
