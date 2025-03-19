function replaceSubdomain() {
    const input = document.getElementById('subdomainInput');
    const resultContainer = document.getElementById('resultContainer');
    const subdomain = input.value.trim();
    
    if (subdomain) {
        // Update URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('subdomain', subdomain);
        window.history.pushState({}, '', newUrl);

        // Migration Commands
        const brevoTexts = [
            `/owly websiteflag ${subdomain} data_sync_skip enabled`,
            `/owly delete_brevo_subaccount ${subdomain}`,
            `/owly websiteflag ${subdomain} brevo_merchant enabled`
        ];
        
        const shopifyTexts = [
            `/owly delete_brevo_subaccount ${subdomain}`,
            `/owly websiteflag ${subdomain} brevo_merchant enabled`,
            `/owly websiteflag ${subdomain} brevo_mfe disable`
        ];

        // Early Stage Commands
        const earlyStageTexts = [
            `/owly earlystage ${subdomain}`,
          `  /owly changeplan ${subdomain} business_omni_free_v4 email_impressions_1000_price_0.00 webpush_impressions_1000_price_0.00`,
           `/owly cancelcharge ${subdomain}@shopify`
        ];

        // Fraud Commands
        const fraudTexts = [
            `/owly unblock_fraudulent_website ${subdomain}@shopify`,
        ];

        updateResultSection('brevoResult', brevoTexts);
        updateResultSection('shopifyResult', shopifyTexts);
        updateResultSection('earlyStageResult', earlyStageTexts);
        updateResultSection('fraudResult', fraudTexts);
        
        resultContainer.classList.remove('hidden');
    }
}

function updateResultSection(elementId, texts) {
    const element = document.getElementById(elementId);
    const content = texts.map((text, index) => `
        <div class="result-box">
            <div class="result-line">${text}</div>
            <i class="fas fa-copy copy-icon" onclick="copyText('${elementId}', ${index})" title="Copy to clipboard"></i>
        </div>
    `).join('');
    element.innerHTML = content;
}

function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Add active class to clicked button
    event.currentTarget.classList.add('active');
}

function copyText(sectionId, index) {
    const resultLines = document.querySelectorAll(`#${sectionId} .result-line`);
    const text = resultLines[index].textContent;
    const copyIcon = document.querySelectorAll(`#${sectionId} .copy-icon`)[index];
    
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback for copy success
            copyIcon.classList.add('copied');
            
            // Change icon temporarily
            copyIcon.classList.remove('fa-copy');
            copyIcon.classList.add('fa-check');
            
            // Reset icon after 1.5 seconds
            setTimeout(() => {
                copyIcon.classList.remove('copied');
                copyIcon.classList.remove('fa-check');
                copyIcon.classList.add('fa-copy');
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

// Add event listener for Enter key
document.getElementById('subdomainInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        replaceSubdomain();
    }
});