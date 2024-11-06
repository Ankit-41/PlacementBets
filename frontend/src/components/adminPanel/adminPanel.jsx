import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, AlertTriangle, Check, PlusCircle, RefreshCw } from 'lucide-react';
import { AddCompanyDialog } from './companydialog';
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from 'framer-motion';

function ImprovedAdminPanel() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [updatedCompanyStatus, setUpdatedCompanyStatus] = useState('');
  const [updatedIndividualResults, setUpdatedIndividualResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://jobjinxbackend.vercel.app/api/companies/active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success' && Array.isArray(response.data.data)) {
        setCompanies(response.data.data);
      } else {
        setError('Received invalid data format for companies');
        setCompanies([]);
      }
    } catch (err) {
      setError('Failed to fetch companies: ' + (err.response?.data?.message || err.message));
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setUpdatedCompanyStatus(company.status);
    const initialResults = {};
    company.individuals.forEach(individual => {
      initialResults[individual.id] = individual.result;
    });
    setUpdatedIndividualResults(initialResults);
    setIsDialogOpen(true);
    setSubmitError('');
    setSuccessMessage('');
  };

  const handleCompanyStatusChange = (value) => {
    setUpdatedCompanyStatus(value);
  };

  const handleIndividualResultChange = (individualId, value) => {
    setUpdatedIndividualResults(prev => ({
      ...prev,
      [individualId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCompany) return;

    setSubmitLoading(true);
    setSubmitError('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const requests = [];

      if (updatedCompanyStatus !== selectedCompany.status) {
        const companyStatusRequest = axios.put(
          `https://jobjinxbackend.vercel.app/api/admin/companies/${selectedCompany._id}/status`,
          { status: updatedCompanyStatus },
          { headers }
        );
        requests.push(companyStatusRequest);
      }

      for (const individual of selectedCompany.individuals) {
        const newResult = updatedIndividualResults[individual.id];
        if (newResult && newResult !== individual.result) {
          const individualResultRequest = axios.put(
            `https://jobjinxbackend.vercel.app/api/admin/companies/${selectedCompany._id}/individuals/${individual.id}/result`,
            { result: newResult },
            { headers }
          );
          requests.push(individualResultRequest);
        }
      }

      if (requests.length === 0) {
        setSubmitError('No changes to submit.');
        setSubmitLoading(false);
        return;
      }

      await Promise.all(requests);

      setSuccessMessage('Changes submitted successfully and bets have been processed.');
      await fetchCompanies();
      setIsDialogOpen(false);
    } catch (err) {
      setSubmitError('Failed to submit changes: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'expired': return 'bg-red-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleCompanyAdded = () => {
    fetchCompanies();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Betting Admin Panel
      </motion.h1>

      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={() => setIsAddCompanyDialogOpen(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Company
        </Button>
        <Button
          onClick={fetchCompanies}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Refresh
        </Button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mb-8 bg-red-900/50 border-red-600">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-800/80">
          <CardTitle className="text-2xl flex items-center text-emerald-400">
            <TrendingUp className="mr-2" /> Active Bets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : companies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800/50">
                    <TableHead className="text-emerald-400">Company</TableHead>
                    <TableHead className="text-emerald-400">Profile</TableHead>
                    <TableHead className="text-emerald-400">Expires In</TableHead>
                    <TableHead className="text-emerald-400">Total Token Bet</TableHead>
                    <TableHead className="text-emerald-400">Status</TableHead>
                    <TableHead className="text-emerald-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company._id} className="hover:bg-gray-700/50 transition-colors">
                      <TableCell className="font-medium">{company.company}</TableCell>
                      <TableCell>{company.profile}</TableCell>
                      <TableCell>{company.expiresIn}</TableCell>
                      <TableCell>{company.totalTokenBet}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(company.status)} px-2 py-1 rounded-full text-xs font-semibold`}>
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleCompanyClick(company)}
                          variant="outline"
                          className=" text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:bg-blue-600 transition-colors"
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No active bets found.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-gray-100 max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-xl">
          <DialogHeader className="p-6 bg-gray-800 sticky top-0 z-10">
            <DialogTitle className="text-2xl flex items-center text-emerald-400">
              <Users className="mr-2 h-6 w-6" /> {selectedCompany?.company} - Manage Bets
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-10rem)] p-6">
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Submission Error</AlertTitle>
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="success" className="mb-4 bg-green-900/50 border-green-600 text-green-100">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-emerald-400">Company Status</h2>
              <Select value={updatedCompanyStatus} onValueChange={handleCompanyStatusChange}>
                <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-emerald-600 border-emerald-400">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-emerald-400">Individual Bets</h2>
              {selectedCompany?.individuals && selectedCompany.individuals.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-800/50">
                        <TableHead className="text-emerald-400">Name</TableHead>
                        <TableHead className="text-emerald-400">Enrollment</TableHead>
                        <TableHead className="text-emerald-400">For Stake</TableHead>
                        <TableHead className="text-emerald-400">Against Stake</TableHead>
                        <TableHead className="text-emerald-400">For Tokens</TableHead>
                        <TableHead className="text-emerald-400">Against Tokens</TableHead>
                        <TableHead className="text-emerald-400">Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCompany.individuals.map((individual) => (
                        <TableRow key={individual.id} className="hover:bg-gray-800/50 transition-colors">
                          <TableCell  className="font-medium">{individual.name}</TableCell>
                          <TableCell>{individual.enrollmentNumber}</TableCell>
                          <TableCell>{individual.forStake}</TableCell>
                          <TableCell>{individual.againstStake}</TableCell>
                          <TableCell>{individual.forTokens}</TableCell>
                          <TableCell>{individual.againstTokens}</TableCell>
                          <TableCell>
                            <Select
                              value={updatedIndividualResults[individual.id]}
                              onValueChange={(value) => handleIndividualResultChange(individual.id, value)}
                            >
                              <SelectTrigger className="w-full sm:w-[120px] bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Result" />
                              </SelectTrigger>
                              <SelectContent className="bg-emerald-600 border-emerald-400">
                                <SelectItem value="awaited">Awaited</SelectItem>
                                <SelectItem value="won">Won</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-400">No individual bets found for this company.</p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 bg-gray-800 sticky bottom-0 z-10">
            <Button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddCompanyDialog
        isOpen={isAddCompanyDialogOpen}
        onClose={() => setIsAddCompanyDialogOpen(false)}
        onSuccess={handleCompanyAdded}
      />
    </div>
  );
}

export default ImprovedAdminPanel;