'use client'

import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { BettingMenuDialog } from '../ActiveBets/BettingMenuDialog'
import { CarouselSkeleton } from './CarouselcardSkeleton'
import axios from 'axios'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const CustomArrow = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
      direction === 'prev' ? '-left-2 md:-left-4' : '-right-2 md:-right-4'
    } bg-white bg-opacity-30 hover:bg-opacity-50 p-1 md:p-2 rounded-full shadow-lg transition-all duration-200`}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="text-white h-4 w-4 md:h-6 md:w-6" />
    ) : (
      <ChevronRight className="text-white h-4 w-4 md:h-6 md:w-6" />
    )}
  </button>
)

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  prevArrow: <CustomArrow direction="prev" />,
  nextArrow: <CustomArrow direction="next" />,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
  swipe: true,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true
}

export default function CompanyCarousel() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://jobjinxbackend.vercel.app/api/companies/active', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.data.status === 'success') {
          const topCompanies = response.data.data
            .sort((a, b) => b.totalTokenBet - a.totalTokenBet)
            .slice(0, 4)
            .map(company => ({
              ...company,
              id: company._id,
              companyId: company._id,
              users: company.individuals.map(individual => ({
                id: individual.id,
                name: individual.name,
                enrollmentNumber: individual.enrollmentNumber,
                forStake: individual.forStake,
                againstStake: individual.againstStake,
                forTokens: individual.forTokens || 0,
                againstTokens: individual.againstTokens || 0
              }))
            }))
          setCompanies(topCompanies)
        }
      } catch (err) {
        setError('Failed to fetch companies')
        console.error('Error fetching companies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const handleBetClick = (company) => {
    setSelectedCompany(company)
  }

  if (loading) {
    return <CarouselSkeleton count={4} />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-b from-gray-900 to-gray-800">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="relative px-4 py-6 mx-auto max-w-[1200px]">
      <style jsx global>{`
        .slick-dots li button:before {
          color: #ffffff;
        }
        .slick-dots li.slick-active button:before {
          color: #10b981;
        }
      `}</style>
      <Slider {...sliderSettings}>
        {companies.map((company, index) => (
          <Dialog 
            key={company.id}
            onOpenChange={(open) => {
              if (open) handleBetClick(company)
              else setSelectedCompany(null)
            }}
          >
            <DialogTrigger asChild>
              <div className="px-2">
                <Card className="h-64 md:h-80 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 hover:border-emerald-500 rounded-xl overflow-hidden shadow-2xl relative group transition-all duration-300 transform">
                  <CardContent className="p-4 md:p-6 h-full flex flex-col justify-between relative z-10">
                    <div>
                      <div className="flex justify-between items-start mb-2 md:mb-4">
                        <Badge variant="secondary" className="bg-emerald-500 rounded-xl text-gray-900 text-xs">
                          {company.status.toUpperCase()}
                        </Badge>
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">{company.company}</h2>
                      <p className="text-xs md:text-sm text-gray-300 mb-2 md:mb-4">{company.profile}</p>
                      
                      <div className="flex items-center text-gray-300 text-xs md:text-sm mb-1 md:mb-2">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-emerald-500" />
                        expires on: {company.expiresIn}
                      </div>
                      <div className="flex items-center text-gray-300 text-xs md:text-sm">
                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-emerald-500" />
                        Total Tokens: {company.totalTokenBet}
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-4">
                      <Button 
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold text-xs md:text-sm py-1 md:py-2"
                      >
                        Place Bet
                      </Button>
                    </div>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute top-0 right-0 h-16 w-16 md:h-24 md:w-24 m-5 opacity-70">
                    <img 
                      src={company.logo} 
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Card>
              </div>
            </DialogTrigger>
            {selectedCompany && selectedCompany.id === company.id && (
              <BettingMenuDialog 
                bet={selectedCompany}
                onClose={() => setSelectedCompany(null)}
              />
            )}
          </Dialog>
        ))}
      </Slider>
    </div>
  )
}