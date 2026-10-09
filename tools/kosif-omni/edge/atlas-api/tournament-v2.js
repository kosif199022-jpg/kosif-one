export async function runTournament(task,candidates,judge){
  const groups=[];
  for(let i=0;i<candidates.length;i+=10){
    const rows=candidates.slice(i,i+10);
    const options=Object.fromEntries(rows.map((c,j)=>["c"+j,(c.skill||"")+" - "+(c.description||"")]));
    const first=await judge({task,options});
    const reversed=Object.fromEntries(Object.entries(options).reverse());
    const second=await judge({task,options:reversed});
    groups.push({start:i,rows,first,second});
  }
  return groups;
}
