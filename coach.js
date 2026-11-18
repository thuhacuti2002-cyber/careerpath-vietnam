export async function generateCoachReply(message, context){
  const safeContext=context && typeof context==='object' ? context : null;
  // Optional provider integration stays server-side. Keep provider-specific request format
  // behind this adapter; never expose AI_API_KEY to the browser.
  if(process.env.AI_API_URL && process.env.AI_API_KEY){
    try{
      const response=await fetch(process.env.AI_API_URL,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.AI_API_KEY}`},body:JSON.stringify({model:process.env.AI_MODEL,messages:[{role:'system',content:'Bạn là Career Coach tại Việt Nam. Trả lời tiếng Việt, thực tế, không khẳng định kết quả trắc nghiệm là chẩn đoán. Nêu rõ khi dữ liệu chỉ là tham khảo.'},{role:'user',content:`Ngữ cảnh Holland: ${JSON.stringify(safeContext)}\\nCâu hỏi: ${message}`} ]})});
      if(response.ok){const data=await response.json();return data.choices?.[0]?.message?.content || 'Mình chưa tạo được câu trả lời lúc này.';}
    }catch{ /* safe fallback below */ }
  }
  const top=(safeContext?.top||[]).join(', ');
  if(top)return `Mình đã tham chiếu kết quả khám phá hiện tại của bạn (nhóm nổi bật: ${top}). Với câu hỏi “${message}”, hãy thử kiểm chứng bằng một dự án nhỏ, phỏng vấn người đang làm nghề và đối chiếu môn học bạn yêu thích. Điểm Holland là gợi ý khám phá, không quyết định khả năng thành công.`;
  return `Cảm ơn bạn đã hỏi. Để chọn hướng đi, hãy đối chiếu sở thích, kỹ năng đang có và giá trị bạn ưu tiên. Bạn có thể làm bài đánh giá 24 câu để mình đưa ra gợi ý cụ thể hơn.`;
}
