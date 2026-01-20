// contact.js - Client-side form validation and submission handling

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Clear error messages when user starts typing
document.addEventListener('input', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        const fieldId = e.target.id;
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            e.target.classList.remove('is-invalid');
        }
    }
});

// Validate individual fields
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    let isValid = true;
    let errorMessage = '';

    if (!field || !errorElement) {
        return true;
    }

    const value = field.value.trim();

    switch (fieldId) {
        case 'fullName':
            if (!value) {
                errorMessage = 'Full name is required.';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Full name must be at least 2 characters.';
                isValid = false;
            } else if (value.length > 100) {
                errorMessage = 'Full name must not exceed 100 characters.';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required.';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
            break;

        case 'phone':
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!value) {
                errorMessage = 'Phone number is required.';
                isValid = false;
            } else if (!phoneRegex.test(value)) {
                errorMessage = 'Please enter a valid phone number.';
                isValid = false;
            }
            break;

        case 'company':
            if (value.length > 100) {
                errorMessage = 'Company name must not exceed 100 characters.';
                isValid = false;
            }
            break;

        case 'subject':
            if (!value) {
                errorMessage = 'Subject is required.';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Message is required.';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters.';
                isValid = false;
            } else if (value.length > 5000) {
                errorMessage = 'Message must not exceed 5000 characters.';
                isValid = false;
            }
            break;

        case 'privacy':
            if (!field.checked) {
                errorMessage = 'You must agree to the privacy policy.';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        errorElement.textContent = errorMessage;
        field.classList.add('is-invalid');
    } else {
        errorElement.textContent = '';
        field.classList.remove('is-invalid');
    }

    return isValid;
}

// Handle form submission
async function handleContactSubmit(event) {
    event.preventDefault();

    // Hide previous alerts
    document.getElementById('successAlert').style.display = 'none';
    document.getElementById('errorAlert').style.display = 'none';

    // Validate all fields
    const fieldsToValidate = ['fullName', 'email', 'phone', 'company', 'subject', 'message', 'privacy'];
    let allValid = true;

    fieldsToValidate.forEach(fieldId => {
        if (!validateField(fieldId)) {
            allValid = false;
        }
    });

    if (!allValid) {
        return;
    }

    // Prepare form data
    const formData = new FormData(event.target);

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

    try {
        // Send form data to PHP backend
        const response = await fetch('contact.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            showSuccessAlert(data.message);

            // Reset form
            event.target.reset();

            // Scroll to alert
            document.getElementById('successAlert').scrollIntoView({ behavior: 'smooth' });

            // Clear validation states
            fieldsToValidate.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.classList.remove('is-invalid');
                }
            });
        } else {
            // Handle validation errors from server
            if (data.errors && Object.keys(data.errors).length > 0) {
                Object.keys(data.errors).forEach(fieldId => {
                    const errorElement = document.getElementById(fieldId + 'Error');
                    const field = document.getElementById(fieldId);
                    if (errorElement) {
                        errorElement.textContent = data.errors[fieldId];
                    }
                    if (field) {
                        field.classList.add('is-invalid');
                    }
                });
            } else {
                showErrorAlert(data.message || 'An error occurred. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorAlert('Network error. Please check your connection and try again.');
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Show success alert
function showSuccessAlert(message) {
    const successAlert = document.getElementById('successAlert');
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successAlert.style.display = 'block';
}

// Show error alert
function showErrorAlert(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorAlert.style.display = 'block';
    errorAlert.scrollIntoView({ behavior: 'smooth' });
}

// Add Bootstrap form styling for validation feedback
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    if (form) {
        // Validate fields on blur
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', function () {
                validateField(this.id);
            });
        });
    }
});
