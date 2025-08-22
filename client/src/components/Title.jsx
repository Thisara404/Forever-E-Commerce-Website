import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-foreground font-medium'>
        {text1}
        <span className='text-muted-foreground font-normal ml-2'>
          {text2}
        </span>
      </p>
      <div className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-foreground'></div>
    </div>
  )
}

export default Title;
