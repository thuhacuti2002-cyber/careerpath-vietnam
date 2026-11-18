import {Router} from 'express';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import rateLimit from 'express-rate-limit';
import db from '../db.js';
import {requireAuth} from '../middleware/auth.js';
import {generateCoachReply} from '../services/coach.js';
const router=Router();
const chatLimit=rateLimit({windowMs:60_000,limit:12,standardHeaders:true,legacyHeaders:false,message:{error:'Bạn gửi hơi nhanh. Vui lòng thử lại sau một phút.'}});
const schema=z.object({message:z.string().trim().min(1).max(1500),context:z.object({holland:z.record(z.string(),z.number().min(1).max(5)).optional(),top:z.array(z.string().max(2)).max(3).optional()}).nullable().optional(),sessionId:z.string().uuid().optional()});
router.post('/',requireAuth,chatLimit,async(req,res)=>{const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:'Tin nhắn không hợp lệ.'});const {message,context}=p.data;let sessionId=p.data.sessionId; if(sessionId){const owned=db.prepare('SELECT id FROM chat_sessions WHERE id=? AND user_id=?').get(sessionId,req.user.id);if(!owned)return res.status(404).json({error:'Không tìm thấy phiên chat.'});}else{sessionId=randomUUID();db.prepare('INSERT INTO chat_sessions(id,user_id,created_at) VALUES(?,?,?)').run(sessionId,req.user.id,new Date().toISOString());}
 const reply=await generateCoachReply(message,context);const insert=db.prepare('INSERT INTO chat_messages(id,session_id,role,content,created_at) VALUES(?,?,?,?,?)');const now=new Date().toISOString();insert.run(randomUUID(),sessionId,'user',message,now);insert.run(randomUUID(),sessionId,'assistant',reply,now);res.json({sessionId,reply});});
router.get('/:sessionId',requireAuth,(req,res)=>{const session=db.prepare('SELECT id FROM chat_sessions WHERE id=? AND user_id=?').get(req.params.sessionId,req.user.id);if(!session)return res.status(404).json({error:'Không tìm thấy phiên chat.'});const messages=db.prepare('SELECT role,content,created_at FROM chat_messages WHERE session_id=? ORDER BY created_at').all(session.id);res.json({messages});});
router.delete('/:sessionId',requireAuth,(req,res)=>{const session=db.prepare('SELECT id FROM chat_sessions WHERE id=? AND user_id=?').get(req.params.sessionId,req.user.id);if(!session)return res.status(404).json({error:'Không tìm thấy phiên chat.'});db.prepare('DELETE FROM chat_sessions WHERE id=? AND user_id=?').run(session.id,req.user.id);res.json({ok:true});});
export default router;
