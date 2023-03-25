import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import React from 'react'
import useDarkSide from 'src/_ezs/hooks/useDarkSide'

const IconDarkTheme = () => {
  const { theme, onChangeTheme } = useDarkSide()
  return (
    <div
      className="flex items-center justify-center ml-1 text-gray-700 transition rounded cursor-pointer dark:text-dark-muted w-11 h-11 hover:bg-light dark:hover:bg-dark-light hover:text-primary"
      onClick={onChangeTheme}
    >
      {theme ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </div>
  )
}

export { IconDarkTheme }
