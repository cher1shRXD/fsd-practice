import CustomLink from '@/shared/ui/CustomLink'
import React from 'react'

const Main = () => {
  return (
    <div className='w-full flex flex-col gap-2'>
      <CustomLink href='/login' className='text-blue-500'>로그인</CustomLink>
      <CustomLink href='/signup' className='text-blue-500'>회원가입</CustomLink>
    </div>
  )
}

export default Main