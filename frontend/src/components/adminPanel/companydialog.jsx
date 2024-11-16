import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Loader2, AlertTriangle, Coins, Plus, Trash2, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from 'axios';

export function AddCompanyDialog({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    company: '',
    profile: '',
    expiresIn: '',
    logo: 'https://cdn2.hubspot.net/hubfs/53/image8-2.jpg',
    individuals: [],
    totalTokenBet: 0
  });

  const [individuals, setIndividuals] = useState([{
    id: 1,
    name: '',
    enrollmentNumber: '',
    forStake: 1.0,
    againstStake: 1.0,
    forTokens: 0,
    againstTokens: 0
  }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const total = individuals.reduce((sum, ind) => 
      sum + (Number(ind.forTokens) || 0) + (Number(ind.againstTokens) || 0), 0);
    
    setFormData(prev => ({
      ...prev,
      totalTokenBet: total
    }));
  }, [individuals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIndividualChange = (index, field, value) => {
    const newIndividuals = [...individuals];
    let processedValue = value;

    if (field.includes('Stake')) {
      processedValue = parseFloat(value) || 1.0;
    } else if (field.includes('Tokens')) {
      processedValue = parseInt(value) || 0;
      if (processedValue < 0) processedValue = 0;
    }

    newIndividuals[index] = {
      ...newIndividuals[index],
      [field]: processedValue
    };

    setIndividuals(newIndividuals);
  };

  const addIndividual = () => {
    setIndividuals(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: '',
        enrollmentNumber: '',
        forStake: 1.0,
        againstStake: 1.0,
        forTokens: 0,
        againstTokens: 0
      }
    ]);
  };

  const removeIndividual = (index) => {
    if (individuals.length > 1) {
      const newIndividuals = individuals.filter((_, i) => i !== index);
      newIndividuals.forEach((ind, i) => {
        ind.id = i + 1;
      });
      setIndividuals(newIndividuals);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.company || !formData.profile || !formData.expiresIn) {
        throw new Error('Please fill in all company fields');
      }

      const validIndividuals = individuals.every(ind => 
        ind.name && 
        ind.enrollmentNumber && 
        ind.enrollmentNumber.length === 8 &&
        ind.forStake >= 1 &&
        ind.againstStake >= 1 &&
        (ind.forTokens >= 0 || ind.againstTokens >= 0)
      );

      if (!validIndividuals) {
        throw new Error('Please fill in all individual fields correctly. Enrollment number must be 8 digits and tokens must be non-negative.');
      }

      const finalData = {
        ...formData,
        individuals: individuals.map(ind => ({
          ...ind,
          result: 'awaited'
        }))
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://jobjinxbackend.vercel.app/api/companies/create',
        finalData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] md:max-w-2xl lg:max-w-4xl bg-gray-900 text-white p-0 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 mt-4 p-4 sm:p-6">
          <DialogHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2 sm:mt-0">
            <DialogTitle className="text-lg flex items-center">
              <Building2 className="mr-2" /> Add New Company
            </DialogTitle>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <Badge 
                variant="secondary" 
                className="bg-emerald-600 text-white flex items-center gap-2"
              >
                <Coins className="h-4 w-4" />
                Total Bet: {formData.totalTokenBet}
              </Badge>
              <Button
                onClick={onClose}
                variant="ghost"
                className="p-2 rounded-full hover:bg-gray-700"
              >
                <X className="h-6 w-6 text-gray-400 hover:text-white" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="px-4 py-6 pb-4 max-h-[calc(100vh-8rem)]">
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-600/20 border-red-600">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Company Details */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile">Profile</Label>
                <Input
                  id="profile"
                  name="profile"
                  value={formData.profile}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresIn">expires on</Label>
                <Input
                  id="expiresIn"
                  name="expiresIn"
                  value={formData.expiresIn}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g., 2 days"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL (optional)</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            {/* Individuals */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold block">Individuals</Label>
              <div className="space-y-6">
                {individuals.map((individual, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={individual.name}
                          onChange={(e) => handleIndividualChange(index, 'name', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Enrollment</Label>
                        <Input
                          value={individual.enrollmentNumber}
                          onChange={(e) => handleIndividualChange(index, 'enrollmentNumber', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                          maxLength={8}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label>For Stake</Label>
                        <Input
                          type="number"
                          value={individual.forStake}
                          onChange={(e) => handleIndividualChange(index, 'forStake', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                          min="1"
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Against Stake</Label>
                        <Input
                          type="number"
                          value={individual.againstStake}
                          onChange={(e) => handleIndividualChange(index, 'againstStake', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                          min="1"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label>For Tokens</Label>
                        <Input
                          type="number"
                          value={individual.forTokens}
                          onChange={(e) => handleIndividualChange(index, 'forTokens', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Against Tokens</Label>
                        <Input
                          type="number"
                          value={individual.againstTokens}
                          onChange={(e) => handleIndividualChange(index, 'againstTokens', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                          min="0"
                        />
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => removeIndividual(index)}
                      disabled={individuals.length === 1}
                      className="mt-2 bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={addIndividual}
                variant="outline"
                className="mt-4 bg-gray-700 hover:bg-gray-600 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Individual
              </Button>
            </div>
          </div>
          <div className="mt-6 mb-4 px-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Company'
              )}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}



export default AddCompanyDialog;;