import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const db=new PGlite();
try{
 await db.exec('create role anon; create role authenticated; create role service_role;');
 await db.exec(readFileSync('db/schema.sql','utf8'));
 const save=(revision,draft,published=null)=>db.query('select * from save_portfolio_document($1,$2,$3,$4)',['site',JSON.stringify(draft),published?JSON.stringify(published):null,revision]);
 assert.equal((await save(0,{name:'Draft A'})).rows.length,1);
 assert.equal((await save(0,{name:'Stale insert'})).rows.length,0);
 assert.equal((await save(1,{name:'Published B'},{name:'Published B'})).rows.length,1);
 assert.equal((await save(1,{name:'Stale overwrite'})).rows.length,0);
 let r=await db.query('select draft,published,revision from portfolio_documents');assert.equal(r.rows[0].revision,2);assert.equal(r.rows[0].published.name,'Published B');
 assert.equal((await db.query('select * from portfolio_history order by id')).rows.length,2);
 await db.query("insert into portfolio_otp(email,code_hash,expires_at) values('owner@example.com','correct',now()+interval '10 minutes')");
 const consume=async hash=>(await db.query("select consume_portfolio_otp('owner@example.com',$1) as ok",[hash])).rows[0].ok;
 assert.equal(await consume('wrong'),false);assert.equal(await consume('correct'),true);assert.equal(await consume('correct'),false);
 await db.query("insert into portfolio_otp(email,code_hash,expires_at) values('owner@example.com','correct',now()+interval '10 minutes')");
 for(let i=0;i<5;i++)assert.equal(await consume('wrong'),false);assert.equal(await consume('correct'),false);
 await db.query("update portfolio_otp set attempts=0,expires_at=now()-interval '1 second'");assert.equal(await consume('correct'),false);
 assert.equal((await db.query("select consume_rate_limit('test',2,60) as ok")).rows[0].ok,true);assert.equal((await db.query("select consume_rate_limit('test',2,60) as ok")).rows[0].ok,true);assert.equal((await db.query("select consume_rate_limit('test',2,60) as ok")).rows[0].ok,false);
 await db.exec('set role anon');await assert.rejects(db.query('select * from portfolio_documents'));await assert.rejects(db.query('select * from portfolio_history'));await db.exec('reset role');
 console.log('PostgreSQL schema checks passed: revision conflicts, draft/publish separation, transactional history, OTP single-use, attempt cap, expiry, rate limits and denied anonymous reads.');
}finally{await db.close();}
