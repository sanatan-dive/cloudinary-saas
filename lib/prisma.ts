import {PrismaClient} from '@prisma/client'
import exp from 'constants'

const prismaClientSiglton = ()=>{
    return new PrismaClient()
}

type prismaClientSiglton = ReturnType<typeof prismaClientSiglton>

const globalForPrisma = globalThis as unknown as {prisma: PrismaClient|undefined}

 const prisma = globalForPrisma.prisma ?? prismaClientSiglton()



 if(process.env.NODE_ENV !== 'production'){
    globalForPrisma.prisma = prisma
 }

 export default prisma