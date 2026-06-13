import { toast } from "@/components/ui/Toast";

/**
 * Export data to CSV file and trigger browser download
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) {
    toast.warning("Tidak ada data untuk diekspor.");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Map rows
  const csvRows = data.map(row => 
    headers.map(fieldName => {
      const value = row[fieldName];
      const stringVal = value !== null && value !== undefined ? String(value) : '';
      // Escape double quotes
      const escaped = stringVal.replace(/"/g, '""');
      // Wrap in quotes if contains comma, quote, or newline
      if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')) {
        return `"${escaped}"`;
      }
      return escaped;
    }).join(',')
  );

  // Combine header and rows
  const csvContent = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Export data to PDF using browser print window and custom styled report layout
 */
export function exportToPDF(title: string, headers: string[], rows: any[][], filename: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Pop-up diblokir. Harap izinkan pop-up untuk mencetak PDF.");
    return;
  }

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Inter', 'Outfit', sans-serif;
            color: #1e293b;
            padding: 40px;
            margin: 0;
          }
          .header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 5px 0;
          }
          .subtitle {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .date {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #f8fafc;
            border-bottom: 2px solid #cbd5e1;
            color: #475569;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 12px 10px;
            text-align: left;
          }
          td {
            border-bottom: 1px solid #e2e8f0;
            padding: 12px 10px;
            font-size: 12px;
            color: #334155;
          }
          tr:nth-child(even) td {
            background-color: #f8fafc/50;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            @page { margin: 1.5cm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${title}</h1>
          <p class="subtitle">Koneksi Desa - Digitalisasi BUMDes & UMKM</p>
          <div class="date">Dicetak pada: ${dateStr}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell !== null && cell !== undefined ? cell : ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          Laporan ini dibuat otomatis oleh Sistem Informasi Ekosistem Digital Koneksi Desa.
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
