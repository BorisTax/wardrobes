declare namespace Express {
   export interface Request {
      userRole?: string
      files?: { image: { path: string } }
   }
}