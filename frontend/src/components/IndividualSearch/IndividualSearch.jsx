'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Search, GraduationCap, AlertTriangle, Loader2, Users } from 'lucide-react'
import { User } from "@mynaui/icons-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios'

export default function IndividualSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [branchQuery, setBranchQuery] = useState('')
    const [branchSuggestions, setBranchSuggestions] = useState([])
    const [selectedBranch, setSelectedBranch] = useState('')
    const [individuals, setIndividuals] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [availableBranches, setAvailableBranches] = useState([])
    const [showBranchDropdown, setShowBranchDropdown] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })

    const branchInputRef = useRef(null)

    const defaultBranches = [
        'B.Tech. (Chemical Engineering)',
        'B.Tech. (Computer Science)',
        'B.Tech. (Electronics and Communication)',
        'B.Tech. (Mechanical Engineering)',
        'B.Tech. (Electrical Engineering)'
    ]

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get('https://jobjinxbackend.vercel.app/api/individuals/branches', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.status === 'success') {
                    setAvailableBranches(response.data.branches)
                } else {
                    setAvailableBranches(defaultBranches)
                }
            } catch (err) {
                console.error('Error fetching branches:', err)
                setAvailableBranches(defaultBranches)
            }
        }
        fetchBranches()
    }, [])

    useEffect(() => {
        if (branchQuery) {
            const filtered = availableBranches.filter(branch =>
                branch.toLowerCase().includes(branchQuery.toLowerCase()) &&
                branch !== selectedBranch
            )
            setBranchSuggestions(filtered)
            setShowBranchDropdown(true)
        } else {
            setBranchSuggestions([])
            setShowBranchDropdown(false)
        }
    }, [branchQuery, availableBranches, selectedBranch])
    useEffect(() => {
        const fetchAllIndividuals = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://jobjinxbackend.vercel.app/api/individuals/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.status === 'success') {
                    setIndividuals(response.data.data);
                } else {
                    setError('Failed to fetch individuals.');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching all individuals');
            } finally {
                setLoading(false);
            }
        };

        fetchAllIndividuals();
    }, []); // Runs only once when the component mounts


    const sortedIndividuals = React.useMemo(() => {
        let sortableItems = [...individuals];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (sortConfig.key === 'count') {
                    const aCount = a.companies ? a.companies.length : 0;
                    const bCount = b.companies ? b.companies.length : 0;
                    return sortConfig.direction === 'ascending' ? aCount - bCount : bCount - aCount;
                }
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [individuals, sortConfig]);


    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    const handleProfileClick = (enrollmentNumber) => {
        window.open(`https://channeli.in/student_profile/${enrollmentNumber}/`, '_blank')
    };

    const isEnrollmentNumber = (query) => {
        return /^\d+$/.test(query.trim())
    }

    const handleSearch = async () => {
        if (!searchQuery.trim() && !selectedBranch) {
            // If no filters, reset to all individuals
            const fetchAllIndividuals = async () => {
                setLoading(true);
                try {
                    const response = await axios.get('https://jobjinxbackend.vercel.app/api/individuals/', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (response.data.status === 'success') {
                        setIndividuals(response.data.data);
                    } else {
                        setError('Failed to fetch individuals.');
                    }
                } catch (error) {
                    setError(error.response?.data?.message || 'Error fetching all individuals');
                } finally {
                    setLoading(false);
                }
            };

            fetchAllIndividuals();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = {};

            if (searchQuery.trim()) {
                if (isEnrollmentNumber(searchQuery)) {
                    params.enrollmentNumber = searchQuery.trim();
                } else {
                    params.name = searchQuery.trim();
                }
            }

            if (selectedBranch) {
                params.branch = selectedBranch;
            }

            const response = await axios.get('https://jobjinxbackend.vercel.app/api/individuals/search', {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setIndividuals(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching individual data');
            setIndividuals([]);
        } finally {
            setLoading(false);
        }
    };



    const ResultTable = ({ individuals, requestSort, sortConfig }) => {
        const getClassNamesFor = (name) => {
            if (!sortConfig) {
                return;
            }
            return sortConfig.key === name ? sortConfig.direction : undefined;
        };


        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-emerald-400 flex items-center gap-2">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        Search Results
                    </h2>
                    <Badge className="bg-emerald-500 text-white text-xs">
                        {individuals.length} {individuals.length === 1 ? 'Result' : 'Results'}
                    </Badge>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-emerald-400 text-xs sm:text-sm">Name</TableHead>
                                <TableHead className="text-emerald-400 text-xs sm:text-sm">Enrol. No</TableHead>
                                <TableHead className="text-emerald-400 text-xs sm:text-sm">Branch</TableHead>
                                <TableHead className="text-emerald-400 text-xs sm:text-sm">View</TableHead>
                                <TableHead
                                    className="text-emerald-400 text-xs sm:text-sm text-center cursor-pointer"
                                    onClick={() => requestSort('count')}
                                >
                                    Count
                                    {getClassNamesFor('count') === 'ascending' ? (
                                        <ChevronUp className="inline-block ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline-block ml-1 h-4 w-4" />
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {individuals.map((individual, index) => (
                                <TableRow key={individual._id || index}>
                                    <TableCell className="font-medium text-gray-200 text-xs sm:text-sm">
                                        <span
                                            className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
                                            onClick={() => handleProfileClick(individual.enrollmentNumber)}
                                        >
                                            {individual.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-300 text-xs sm:text-sm">
                                        <span
                                            className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
                                            onClick={() => handleProfileClick(individual.enrollmentNumber)}
                                        >
                                            {individual.enrollmentNumber}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-300 text-xs sm:text-sm">{individual.branch}</TableCell>

                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-gray-700">
                                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-gray-200">
                                                <h3 className="text-lg font-semibold mb-2 text-emerald-400">Shortlisted Companies</h3>
                                                {individual.companies && individual.companies.length > 0 ? (
                                                    <ul className="space-y-1">
                                                        {individual.companies.map((company, idx) => (
                                                            <li key={idx} className="text-xs sm:text-sm flex items-center">
                                                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                                                                {company.companyName}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs sm:text-sm text-gray-400">No companies shortlisted</p>
                                                )}
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell className="text-gray-300 text-xs sm:text-sm text-center">{individual.companies ? individual.companies.length : 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }




    return (
        <div className="min-h-screen space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                    See Shortlists
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">Search for individuals and view their shortlists, filter by branch</p>
            </motion.div>

            <motion.div
                className="max-w-3xl mx-auto space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Enter name or enrollment number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 text-sm sm:text-base"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch()
                            }
                        }}
                    />
                </div>

                <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        ref={branchInputRef}
                        type="text"
                        placeholder="Filter by branch..."
                        value={branchQuery}
                        onChange={(e) => setBranchQuery(e.target.value)}
                        onFocus={() => setShowBranchDropdown(true)}
                        className="w-full pl-10 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 text-sm sm:text-base"
                    />

                    <AnimatePresence>
                        {showBranchDropdown && branchSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg"
                            >
                                <ScrollArea className="max-h-60">
                                    {branchSuggestions.map((branch, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 text-xs sm:text-sm"
                                            onClick={() => {
                                                setSelectedBranch(branch)
                                                setBranchQuery('')
                                                setShowBranchDropdown(false)
                                                if (branchInputRef.current) {
                                                    branchInputRef.current.blur()
                                                }
                                            }}
                                        >
                                            {branch}
                                        </div>
                                    ))}
                                </ScrollArea>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {selectedBranch && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                    >
                        <Badge className="bg-emerald-500 text-white px-2 py-1 text-xs sm:text-sm">
                            {selectedBranch}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedBranch('')
                                setBranchQuery('')
                            }}
                            className="text-gray-400 hover:text-red-400"
                        >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-3 sm:mt-4"
                >
                    <Button
                        onClick={handleSearch}
                        disabled={loading || (!searchQuery.trim() && !selectedBranch)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </>
                        )}
                    </Button>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-red-400 mt-4 text-sm sm:text-base"
                    >
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-2" />
                        {error}
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center mt-8"
                    >
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </motion.div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center mt-8 text-red-400"
                    >
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <p className="text-sm sm:text-base">{error}</p>
                    </motion.div>
                ) : individuals.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-6xl mx-auto px-4"
                    >
                        <ResultTable
                            individuals={sortedIndividuals}
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

