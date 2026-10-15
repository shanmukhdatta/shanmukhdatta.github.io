'use client';
import {useEffect, type RefObject} from 'react';

/** Keep keyboard focus inside overlays and restore the opener on close. */
export function useDialogFocus(open:boolean,ref:RefObject<HTMLElement|null>){
 useEffect(()=>{
  if(!open||!ref.current)return;
  const root=ref.current,previous=document.activeElement;
  const focusable=()=>Array.from(root.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
  const before=document.body.style.overflow;document.body.style.overflow='hidden';
  focusable()[0]?.focus();
  function key(e:KeyboardEvent){if(e.key!=='Tab')return;const items=focusable(),first=items[0],last=items.at(-1);if(!first){e.preventDefault();return;}if(e.shiftKey&&(document.activeElement===first||!root.contains(document.activeElement))){e.preventDefault();last?.focus();}else if(!e.shiftKey&&(document.activeElement===last||!root.contains(document.activeElement))){e.preventDefault();first.focus();}}
  document.addEventListener('keydown',key);
  return()=>{document.body.style.overflow=before;document.removeEventListener('keydown',key);if(previous instanceof HTMLElement&&previous.isConnected)previous.focus();};
 },[open,ref]);
}
