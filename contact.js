// Initialize Email.js
(function() {
    emailjs.init("rSNr20n308U632PR0");
})();

window.addEventListener('DOMContentLoaded', (event) => {
    var form = document.getElementById('contactForm');
    var statusEl = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = document.getElementById('cName').value.trim();
        var email = document.getElementById('cEmail').value.trim();
        var subject = document.getElementById('cSubject').value.trim() || 'Portfolio Contact';
        var message = document.getElementById('cMsg').value.trim();

        if (!name || !email || !message) {
            statusEl.className = 'form-status error';
            statusEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.';
            statusEl.style.display = 'flex';
            setTimeout(function() { statusEl.style.display = 'none'; }, 3000);
            return;
        }

        // UI Loading State
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        statusEl.className = 'form-status';
        statusEl.style.display = 'none';

        // Send via Email.js
        const now = new Date();
        const time = now.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        emailjs.send('service_rscux7f', 'template_44cnnuz', {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            time: time,
            to_email: 'abuzafor.dev@gmail.com'
        })
        .then(function(response) {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
            submitBtn.style.background = '#00e5a0';
            statusEl.className = 'form-status success';
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Message sent! I\'ll get back to you soon.';
            statusEl.style.display = 'flex';
            form.reset();
            
            setTimeout(function() {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                statusEl.style.display = 'none';
            }, 5000);
        })
        .catch(function(error) {
            console.error('Email send failed:', error);
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitBtn.disabled = false;
            statusEl.className = 'form-status error';
            statusEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again.';
            statusEl.style.display = 'flex';
            setTimeout(function() { statusEl.style.display = 'none'; }, 5000);
        });
    });
});