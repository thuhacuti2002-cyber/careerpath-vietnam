import {Router} from 'express';
import db from '../db.js';
import {requireAuth} from '../middleware/auth.js';
const router=Router();
// Deletes the account and all related assessment/chat records via FK cascade.
router.delete('/data',requireAuth,(req,res)=>{
  db.prepare('DELETE FROM users WHERE id=?').run(req.user.id);
  res.clearCookie('cp_token',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/'});
  res.json({ok:true,message:'Đã xóa tài khoản, kết quả đánh giá và lịch sử chat.'});
});
export default router;
