document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('extract').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractJobDetails,
    }, (results) => {
      const jobDetails = results[0].result;
      const today = new Date().toISOString().split('T')[0];

      const jobData = {
        companyName: jobDetails.companyName || 'Not found',
        location: jobDetails.location || 'Not found',
        jobTitle: jobDetails.jobTitle || 'Not found',
        applyLink: jobDetails.applyLink || 'Not found',
        date: today
      };

      chrome.storage.local.get({ jobs: [] }, (result) => {
        const jobs = result.jobs;
        jobs.push(jobData);
        chrome.storage.local.set({ jobs }, () => {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.jpg',
            title: 'Job Details Saved',
            message: 'Job details have been saved and are ready to download.'
          });
        });
      });
    });
  });
});

function extractJobDetails() {
  const jobTitle = document.querySelector('div.job-details-jobs-unified-top-card__company-name')?.innerText;
  const companyName = document.querySelector('h1.t-24')?.innerText;
  const location = document.querySelector('li.job-card-container__metadata-item ')?.innerText;
  const applyLink = document.querySelector('h1.t-24 a').href

  console.log('jobTitle:', jobTitle);
  console.log('companyName:', companyName);
  console.log('location:', location);
  console.log('applyLink:', applyLink);

  return {
    jobTitle,
    companyName,
    location,
    applyLink
  };
}
