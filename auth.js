import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import db from '../db.js';
import {requireAuth} from '../middleware/auth.js';
const router=Router();
const registerSchema=z.object({name:z.string().trim().min(2).max(80),email:z.string().trim().email().max(254),password:z.string().min(10).max(128)});
const loginSchema=z.object({email:z.string().trim().email().max(254),password:z.string().min(1).max(128)});
function issue(res,user){const token=jwt.sign({},process.env.JWT_SECRET,{subject:user.id,expiresIn:process.env.JWT_EXPIRES_IN||'2h'});res.cookie('cp_token',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:2*60*60*1000,path:'/'});res.json({user:{id:user.id,name:user.name,email:user.email}});}
router.post('/register',async(req,res)=>{const parsed=registerSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Thông tin đăng ký chưa hợp lệ.'});const {name,email,password}=parsed.data;try{const id=randomUUID(),hash=await bcrypt.hash(password,12);db.prepare('INSERT INTO users(id,name,email,password_hash,created_at) VALUES(?,?,?,?,?)').run(id,name,email.toLowerCase(),hash,new Date().toISOString());issue(res,{id,name,email:email.toLowerCase()});}catch(e){if(String(e).includes('UNIQUE'))return res.status(409).json({error:'Email đã được sử dụng.'});res.status(500).json({error:'Không thể tạo tài khoản.'});}});
router.post('/login',async(req,res)=>{const parsed=loginSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Email hoặc mật khẩu không hợp lệ.'});const user=db.prepare('SELECT * FROM users WHERE email=?').get(parsed.data.email.toLowerCase());if(!user||!(await bcrypt.compare(parsed.data.password,user.password_hash)))return res.status(401).json({error:'Email hoặc mật khẩu không chính xác.'});issue(res,user);});
router.post('/logout',(req,res)=>{res.clearCookie('cp_token',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/'});res.json({ok:true});});
router.get('/me',requireAuth,(req,res)=>{const user=db.prepare('SELECT id,name,email FROM users WHERE id=?').get(req.user.id);if(!user)return res.status(404).json({error:'Không tìm thấy tài khoản.'});res.json({user});});
export default router;
