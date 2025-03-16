function replaceSubdomain() {
    const input = document.getElementById('subdomainInput');
    const brevoResult = document.getElementById('brevoResult');
    const shopifyResult = document.getElementById('shopifyResult');
    const resultContainer = document.getElementById('resultContainer');
    const subdomain = input.value.trim();
    
    if (subdomain) {
        // Brevo commands
        const brevoTexts = [
            `/owly websiteflag ${subdomain} data_sync_skip enabled`,
            `/owly delete_brevo_subaccount ${subdomain}`,
            `/owly websiteflag ${subdomain} brevo_merchant enabled`,
            `/owly websiteflag ${subdomain} brevo_mfe disable`
        ];
        
        // Shopify commands
        const shopifyTexts = [
            `/owly delete_brevo_subaccount ${subdomain}`,
            `/owly websiteflag ${subdomain} brevo_merchant enabled`,
            `/owly websiteflag ${subdomain} brevo_mfe disable`
        ];
        
        // Create HTML content for Brevo commands
        const brevoContent = brevoTexts.map((text, index) => `
            <div class="result-box">
                <div class="result-line">${text}</div>
                <i class="fas fa-copy copy-icon" onclick="copyText('brevo', ${index})" title="Copy to clipboard"></i>
            </div>
        `).join('');
        
        // Create HTML content for Shopify commands
        const shopifyContent = shopifyTexts.map((text, index) => `
            <div class="result-box">
                <div class="result-line">${text}</div>
                <i class="fas fa-copy copy-icon" onclick="copyText('shopify', ${index})" title="Copy to clipboard"></i>
            </div>
        `).join('');
        
        brevoResult.innerHTML = brevoContent;
        shopifyResult.innerHTML = shopifyContent;
        resultContainer.classList.remove('hidden');
    }
}

function copyText(section, index) {
    const resultLines = document.querySelectorAll(`#${section}Result .result-line`);
    const text = resultLines[index].textContent;
    const copyIcon = document.querySelectorAll(`#${section}Result .copy-icon`)[index];
    
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
        });
    }
}

// Add event listener for Enter key
document.getElementById('subdomainInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        replaceSubdomain();
    }
});