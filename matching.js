export const hollandNames = {R:"Thực tế",I:"Nghiên cứu",A:"Nghệ thuật",S:"Xã hội",E:"Quản lý",C:"Nghiệp vụ"};
export function calculateResult(answers, questions, careers) {
  const holland = {R:0,I:0,A:0,S:0,E:0,C:0}, skill = {};
  questions.forEach(q => { const v = Number(answers[q.id] || 3); if(q.group==="RIASEC") holland[q.code] = v; else skill[q.code] = v; });
  const top = Object.entries(holland).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const raw = careers.map(c => {
    const h = c.tags.reduce((s,t)=>s+(holland[t]||0),0)/c.tags.length;
    const k = c.match.reduce((s,t)=>s+(skill[t]||3),0)/c.match.length;
    return {...c, raw: h*.55+k*.45};
  }).sort((a,b)=>b.raw-a.raw).slice(0,8);
  const min = Math.min(...raw.map(x=>x.raw)), max = Math.max(...raw.map(x=>x.raw));
  const ranked = raw.map(x=>({...x, score:Math.round(68+((x.raw-min)/(max-min||1))*27)}));
  return {holland, skill, top, careers:ranked};
}
