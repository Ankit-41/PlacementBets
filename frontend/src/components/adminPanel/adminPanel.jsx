import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { AddCompanyDialog } from './companydialog';
import { PlusCircle } from 'lucide-react';
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
  // Inside your AdminPanel component, add this state:
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/companies/active', {
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
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch companies: ' + (err.response?.data?.message || err.message));
      setCompanies([]);
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

  // In your AdminPanel.jsx

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

      // Update company status if changed
      if (updatedCompanyStatus !== selectedCompany.status) {
        console.log('Updating company status:', {
          companyId: selectedCompany._id,
          status: updatedCompanyStatus
        });

        const companyStatusRequest = axios.put(
          `http://localhost:5000/api/admin/companies/${selectedCompany._id}/status`,
          { status: updatedCompanyStatus },
          { headers }
        );
        requests.push(companyStatusRequest);
      }

      // Update individual results if changed
      for (const individual of selectedCompany.individuals) {
        const newResult = updatedIndividualResults[individual.id];
        if (newResult && newResult !== individual.result) {
          console.log('Updating individual result:', {
            companyId: selectedCompany._id,
            individualId: individual.id,
            result: newResult
          });

          const individualResultRequest = axios.put(
            `http://localhost:5000/api/admin/companies/${selectedCompany._id}/individuals/${individual.id}/result`,
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

      // Execute all requests
      const results = await Promise.all(requests);
      console.log('Update results:', results);

      setSuccessMessage('Changes submitted successfully and bets have been processed.');
      await fetchCompanies(); // Refresh the companies list
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Submit error:', err);
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

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
  const handleCompanyAdded = () => {
    fetchCompanies();  // Refresh the companies list
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Betting Admin Panel</h1>


      <Button
        onClick={() => setIsAddCompanyDialogOpen(true)}
        className="bg-green-600 hover:bg-green-700"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Company
      </Button>
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <TrendingUp className="mr-2" /> Active Bets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {companies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Company</TableHead>
                  <TableHead className="text-gray-300">Profile</TableHead>
                  <TableHead className="text-gray-300">Expires In</TableHead>
                  <TableHead className="text-gray-300">Total Token Bet</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id} className="hover:bg-gray-700">
                    <TableCell className="font-medium">{company.company}</TableCell>
                    <TableCell>{company.profile}</TableCell>
                    <TableCell>{company.expiresIn}</TableCell>
                    <TableCell>{company.totalTokenBet}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleCompanyClick(company)}
                        variant="outline"
                        className=" bg-gray-800 hover:bg-green-600 transition-colors"
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-400">No active bets found.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Users className="mr-2" /> {selectedCompany?.company} - Manage Bets
            </DialogTitle>
          </DialogHeader>
          {submitError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Submission Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="success" className="mb-4 bg-green-600 text-white">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Company Status</h2>
            <Select value={updatedCompanyStatus} onValueChange={handleCompanyStatusChange}>
              <SelectTrigger className="w-[200px] bg-gray-700">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Individual Bets</h2>
            {selectedCompany?.individuals && selectedCompany.individuals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Enrollment</TableHead>
                    <TableHead className="text-gray-300">For Stake</TableHead>
                    <TableHead className="text-gray-300">Against Stake</TableHead>
                    <TableHead className="text-gray-300">For Tokens</TableHead>
                    <TableHead className="text-gray-300">Against Tokens</TableHead>
                    <TableHead className="text-gray-300">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCompany.individuals.map((individual) => (
                    <TableRow key={individual.id} className="hover:bg-gray-700">
                      <TableCell>{individual.name}</TableCell>
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
                          <SelectTrigger className="w-[120px] bg-gray-700">
                            <SelectValue placeholder="Result" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700">
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
            ) : (
              <p className="text-center text-gray-400">No individual bets found for this company.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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