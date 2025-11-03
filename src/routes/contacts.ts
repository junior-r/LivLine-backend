import { HomeController } from '@/controllers/home'
import { Router } from 'express'

export const contactRouter = () => {
  const router = Router()
  const controller = new HomeController()

  router.post('/send-message', controller.sendMessage)

  return router
}
