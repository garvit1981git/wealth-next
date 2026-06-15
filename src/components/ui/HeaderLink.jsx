// import { Link } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const HeaderLink = ({url, icon, label}) => {
  return (
    <div>
        <Link 
      href={url} 
      className="group relative flex items-center justify-center p-2 rounded-xl hover:bg-purple-600/20 transition-colors"
    >
      {/* Your Icon */}
 {icon}
      {/* Tooltip Popup */}
      <span className="absolute  sm:inline top-14 scale-0 rounded bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all duration-100 ease-in-out group-hover:scale-100 origin-top">
        {label}
      </span>
    </Link>
         
    </div>
  )
}

export default HeaderLink
