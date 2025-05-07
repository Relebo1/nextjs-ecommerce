import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import { connectToDatabase } from '../../lib/db'

export default async function handler(req: { method: string; body: { email: any; password: any } }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; token?: never; user?: any }): any; new(): any } } }) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid password' })
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_TOKEN,
        { expiresIn: '1h' }
      )
      

      // Exclude password from user data
      const { password: _, ...userData } = user.toObject()

      return res.status(200).json({ message: 'Login successful', token, user: userData })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
