import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import FileUploader from './components/FileUploader';
import DataTable from './components/DataTable';
import DetailPanel from './components/DetailPanel';
import { CustomerData, AnalysisResult } from './types';
import { analyzeCustomers } from './utils/analysisEngine';
import './App.css';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customerData, setCustomerData] = useState<CustomerData[] | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Dosya yüklendiğinde çağrılır
  const handleDataProcessed = (data: CustomerData[]) => {
    setCustomerData(data);
    setCurrentStep(2);
    
    // Otomatik analiz başlat
    startAnalysis(data);
  };

  // AI analizini başlat
  const startAnalysis = async (data: CustomerData[]) => {
    setIsAnalyzing(true);
    try {
      const results = await analyzeCustomers(data);
      setAnalysisResults(results);
      setCurrentStep(3);
      
      // İlk müşteriyi seç
      if (results.length > 0) {
        setSelectedCustomer(results[0]);
      }
    } catch (error) {
      console.error('Analiz hatası:', error);
      alert('Analiz sırasında hata oluştu: ' + error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Müşteri seçimi
  const handleCustomerSelect = (customer: AnalysisResult) => {
    setSelectedCustomer(customer);
  };

  // PDF export fonksiyonu
  const handleExportPDF = () => {
    if (selectedCustomer) {
      alert(`PDF export işlemi: ${selectedCustomer.customerName} için rapor hazırlanıyor...`);
      // Buraya PDF oluşturma kodu eklenecek
    } else {
      alert('Lütfen önce bir müşteri seçin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          currentStep={currentStep}
          totalCustomers={customerData?.length || 0}
          onExportData={() => {/* İleride eklenecek */}}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Step 1: Dosya Yükleme */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 gap-6">
                <FileUploader onDataProcessed={handleDataProcessed} />
                
                {/* Örnek Veri ile Hızlı Başlangıç */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-3">🚀 Hızlı Başlangıç</h3>
                  <p className="text-blue-700 mb-4">
                    Test etmek için örnek veri ile başlayabilirsiniz:
                  </p>
                  <button
                    onClick={() => {
                      // Örnek veri ile test
                      const sampleData: CustomerData[] = [
                        {
                          id: '1',
                          name: 'Ahmet Yılmaz',
                          pastPurchases: ['Ürün A', 'Ürün B', 'Ürün C'],
                          lastContact: '2024-01-15',
                          segment: 'B2B',
                          averageOrder: 2500
                        },
                        {
                          id: '2', 
                          name: 'Ayşe Kaya',
                          pastPurchases: ['Ürün B', 'Ürün D'],
                          lastContact: '2024-01-10',
                          segment: 'B2C',
                          averageOrder: 1200
                        }
                      ];
                      handleDataProcessed(sampleData);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Örnek Veri ile Test Et
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Analiz Yükleniyor */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  AI Analiz Yapılıyor
                </h3>
                <p className="text-gray-600">
                  {customerData?.length} müşteri verisi analiz ediliyor...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Bu işlem birkaç saniye sürebilir
                </p>
              </div>
            )}

            {/* Step 3: Sonuçlar */}
            {currentStep === 3 && analysisResults && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol: Dosya Yükleme (Küçük) */}
                <div className="lg:col-span-1">
                  <FileUploader onDataProcessed={handleDataProcessed} />
                </div>

                {/* Orta: Sonuç Tablosu */}
                <div className="lg:col-span-1">
                  <DataTable 
                    data={analysisResults}
                    onCustomerSelect={handleCustomerSelect}
                    selectedCustomer={selectedCustomer}
                  />
                </div>

                {/* Sağ: Detaylı Öneri */}
                <div className="lg:col-span-1">
                  <DetailPanel 
                    customer={selectedCustomer}
                    onExportPDF={handleExportPDF}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;