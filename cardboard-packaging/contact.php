<?php
// contact.php - Backend for handling contact form submissions

// Set header to return JSON
header('Content-Type: application/json');

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    $response['message'] = 'Method not allowed. Please use POST request.';
    echo json_encode($response);
    exit;
}

// Get POST data
$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$company = isset($_POST['company']) ? trim($_POST['company']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$privacy = isset($_POST['privacy']) ? $_POST['privacy'] : '';

// Validation function
function validateInput(&$response) {
    global $fullName, $email, $phone, $company, $subject, $message, $privacy;
    
    $isValid = true;
    
    // Validate Full Name
    if (empty($fullName)) {
        $response['errors']['fullName'] = 'Full name is required.';
        $isValid = false;
    } elseif (strlen($fullName) < 2) {
        $response['errors']['fullName'] = 'Full name must be at least 2 characters.';
        $isValid = false;
    } elseif (strlen($fullName) > 100) {
        $response['errors']['fullName'] = 'Full name must not exceed 100 characters.';
        $isValid = false;
    }
    
    // Validate Email
    if (empty($email)) {
        $response['errors']['email'] = 'Email is required.';
        $isValid = false;
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Please enter a valid email address.';
        $isValid = false;
    }
    
    // Validate Phone
    if (empty($phone)) {
        $response['errors']['phone'] = 'Phone number is required.';
        $isValid = false;
    } elseif (!preg_match('/^[\d\s\-\+\(\)]{10,}$/', $phone)) {
        $response['errors']['phone'] = 'Please enter a valid phone number.';
        $isValid = false;
    }
    
    // Validate Company (optional, but if provided, validate length)
    if (!empty($company) && strlen($company) > 100) {
        $response['errors']['company'] = 'Company name must not exceed 100 characters.';
        $isValid = false;
    }
    
    // Validate Subject
    if (empty($subject)) {
        $response['errors']['subject'] = 'Subject is required.';
        $isValid = false;
    }
    
    // Validate Message
    if (empty($message)) {
        $response['errors']['message'] = 'Message is required.';
        $isValid = false;
    } elseif (strlen($message) < 10) {
        $response['errors']['message'] = 'Message must be at least 10 characters.';
        $isValid = false;
    } elseif (strlen($message) > 5000) {
        $response['errors']['message'] = 'Message must not exceed 5000 characters.';
        $isValid = false;
    }
    
    // Validate Privacy Policy Agreement
    if ($privacy !== 'on') {
        $response['errors']['privacy'] = 'You must agree to the privacy policy.';
        $isValid = false;
    }
    
    return $isValid;
}

// Validate input
if (!validateInput($response)) {
    http_response_code(400);
    $response['message'] = 'Please fix the errors below.';
    echo json_encode($response);
    exit;
}

// Sanitize inputs to prevent injection
$fullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$company = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
$subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Recipient email
$recipientEmail = 'support@paperpackaginghub.com';

// Email subject
$emailSubject = "New Contact Form Submission - " . $subject;

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

// Email body
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; padding: 20px; }
        .header { background-color: #0d6efd; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .field-label { font-weight: bold; color: #0d6efd; }
        .field-value { margin-top: 5px; }
        .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>Full Name:</div>
                <div class='field-value'>" . $fullName . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Email Address:</div>
                <div class='field-value'><a href='mailto:" . $email . "'>" . $email . "</a></div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Phone Number:</div>
                <div class='field-value'><a href='tel:" . $phone . "'>" . $phone . "</a></div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Company Name:</div>
                <div class='field-value'>" . (!empty($company) ? $company : 'Not provided') . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Subject:</div>
                <div class='field-value'>" . $subject . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='field-value'>" . nl2br($message) . "</div>
            </div>
            
            <div class='field' style='border-bottom: none;'>
                <div class='field-label'>Submission Date & Time:</div>
                <div class='field-value'>" . date('Y-m-d H:i:s') . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This is an automated email. Please reply to the sender's email address to respond.</p>
        </div>
    </div>
</body>
</html>
";

// Try to send email
try {
    // Attempt to send the email
    if (mail($recipientEmail, $emailSubject, $emailBody, $headers)) {
        // Email sent successfully, log it
        logContactSubmission($fullName, $email, $phone, $company, $subject, $message);
        
        $response['success'] = true;
        $response['message'] = 'Thank you for contacting us! Your message has been sent successfully. We will get back to you within 24 hours.';
        http_response_code(200);
    } else {
        // Email failed to send
        error_log("Email failed to send for contact: " . $email);
        $response['message'] = 'Failed to send email. Please try again later.';
        http_response_code(500);
    }
} catch (Exception $e) {
    error_log("Exception occurred: " . $e->getMessage());
    $response['message'] = 'An error occurred while processing your request. Please try again later.';
    http_response_code(500);
}

// Function to log contact submissions (optional)
function logContactSubmission($fullName, $email, $phone, $company, $subject, $message) {
    $logFile = dirname(__FILE__) . '/logs/contact_submissions.log';
    
    // Create logs directory if it doesn't exist
    if (!is_dir(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    
    $logEntry = "[" . date('Y-m-d H:i:s') . "] ";
    $logEntry .= "Name: " . $fullName . " | ";
    $logEntry .= "Email: " . $email . " | ";
    $logEntry .= "Phone: " . $phone . " | ";
    $logEntry .= "Company: " . $company . " | ";
    $logEntry .= "Subject: " . $subject . "\n";
    
    // Append to log file
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Return JSON response
echo json_encode($response);
?>
