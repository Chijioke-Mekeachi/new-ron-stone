import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react";
import { Transaction, formatCurrency } from "@/lib/demoData";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TransactionExportProps {
  transactions: Transaction[];
  userName: string;
  accountNumber: string;
}

const TransactionExport = ({ transactions, userName, accountNumber }: TransactionExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filterTransactionsByDate = () => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= new Date(dateRange.start) && txDate <= new Date(dateRange.end);
    });
  };

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const filteredTransactions = filterTransactionsByDate();
      const headers = ["Date", "Description", "Type", "Amount", "Currency", "Status"];
      
      const csvContent = [
        // Add header info
        `Ron Stone Bank - Transaction Statement`,
        `Account Holder: ${userName}`,
        `Account Number: ****${accountNumber.slice(-4)}`,
        `Statement Period: ${dateRange.start} to ${dateRange.end}`,
        `Generated: ${new Date().toLocaleDateString()}`,
        "",
        headers.join(","),
        ...filteredTransactions.map(tx => 
          [
            tx.date,
            `"${tx.description}"`,
            tx.type,
            tx.type === 'credit' ? tx.amount : -tx.amount,
            tx.currency,
            tx.status
          ].join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `ron-stone-statement-${dateRange.start}-to-${dateRange.end}.csv`;
      link.click();
      
      toast({
        title: "Export Successful",
        description: `${filteredTransactions.length} transactions exported to CSV`
      });
    } catch {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your transactions",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const filteredTransactions = filterTransactionsByDate();
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(15, 23, 42); // Navy color
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("Ron Stone Bank", 20, 20);
      
      doc.setFontSize(12);
      doc.text("Transaction Statement", 20, 30);
      
      // Account info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Account Holder: ${userName}`, 20, 55);
      doc.text(`Account Number: ****${accountNumber.slice(-4)}`, 20, 62);
      doc.text(`Statement Period: ${dateRange.start} to ${dateRange.end}`, 20, 69);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 76);
      
      // Summary
      const totalCredits = filteredTransactions
        .filter(tx => tx.type === 'credit')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const totalDebits = filteredTransactions
        .filter(tx => tx.type === 'debit')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 82, 170, 25, 'F');
      
      doc.setFontSize(10);
      doc.text("Summary", 25, 90);
      doc.setTextColor(34, 197, 94);
      doc.text(`Total Credits: ${formatCurrency(totalCredits, 'USD')}`, 25, 98);
      doc.setTextColor(239, 68, 68);
      doc.text(`Total Debits: ${formatCurrency(totalDebits, 'USD')}`, 100, 98);
      doc.setTextColor(0, 0, 0);
      doc.text(`Net: ${formatCurrency(totalCredits - totalDebits, 'USD')}`, 25, 105);
      
      // Transactions table
      const tableData = filteredTransactions.map(tx => [
        tx.date,
        tx.description,
        tx.type === 'credit' ? 'Credit' : 'Debit',
        `${tx.type === 'credit' ? '+' : '-'}${formatCurrency(tx.amount, tx.currency)}`,
        tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
      ]);
      
      autoTable(doc, {
        startY: 115,
        head: [["Date", "Description", "Type", "Amount", "Status"]],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 60 },
          2: { cellWidth: 20 },
          3: { cellWidth: 35, halign: 'right' },
          4: { cellWidth: 25 }
        }
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          "This statement is for informational purposes only. Ron Stone Bank - Secure Digital Banking.",
          105,
          290,
          { align: 'center' }
        );
        doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
      }
      
      doc.save(`ron-stone-statement-${dateRange.start}-to-${dateRange.end}.pdf`);
      
      toast({
        title: "Export Successful",
        description: `${filteredTransactions.length} transactions exported to PDF`
      });
    } catch {
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF statement",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Download className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-lg">Export Statements</h3>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            From
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            To
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={exportToPDF}
          disabled={isExporting}
          className="h-auto py-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Export as PDF</p>
              <p className="text-xs opacity-80">Formatted bank statement</p>
            </div>
          </div>
        </Button>
        
        <Button
          onClick={exportToCSV}
          disabled={isExporting}
          variant="outline"
          className="h-auto py-4"
        >
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
            <div className="text-left">
              <p className="font-semibold">Export as CSV</p>
              <p className="text-xs text-muted-foreground">For spreadsheets</p>
            </div>
          </div>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        {filterTransactionsByDate().length} transactions in selected period
      </p>
    </div>
  );
};

export default TransactionExport;
