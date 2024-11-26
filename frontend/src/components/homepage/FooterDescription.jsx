import React from 'react'
import { Info } from 'lucide-react'

export default function FooterDescription() {
  return (
    <footer className="bg-gray-900 px-4 py-3 sm:py-4">
      <div className=" mx-auto flex items-center justify-center">
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 flex-shrink-0" />
        <p className="text-xs sm:text-sm text-gray-400 text-center">
          For entertainment only. Not affiliated with IIT Roorkee or placement cells. Any resemblance to persons or events is coincidental. No real job predictions or monetary rewards. Participation is purely for fun—please enjoy responsibly.
        </p>
      </div>
    </footer>
  )
}