document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('downloadCSV').addEventListener('click', () => {
      chrome.storage.local.get({ jobs: [] }, (result) => {
        const jobs = result.jobs;
        if (jobs.length > 0) {
          const csvContent = generateCSV(jobs);
          downloadCSV(csvContent, 'job_details.csv');
        } else {
          alert('No job details found.');
        }
      });
    });
  
    function generateCSV(data) {
      const header = ["Company Name", "Location", "Position", "Apply Link", "Date"];
      const rows = data.map(job => [
        job.companyName,
        job.location,
        job.jobTitle,
        job.applyLink,
        job.date
      ]);
      const csvRows = [header, ...rows].map(row => row.join(","));
      return csvRows.join("\n");
    }
  
    function downloadCSV(csvContent, filename) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
  