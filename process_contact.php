<?php
// Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// If this is an OPTIONS request, just return 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once 'config/db_config.php';

// Initialize response array
$response = array('success' => false, 'message' => '');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize inputs
    if (
        isset($_POST['name']) && !empty($_POST['name']) &&
        isset($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) &&
        isset($_POST['subject']) && !empty($_POST['subject']) &&
        isset($_POST['message']) && !empty($_POST['message'])
    ) {
        // Sanitize inputs
        $name = $conn->real_escape_string(trim($_POST['name']));
        $email = $conn->real_escape_string(trim($_POST['email']));
        $subject = $conn->real_escape_string(trim($_POST['subject']));
        $message = $conn->real_escape_string(trim($_POST['message']));
        
        // Insert into database
        $sql = "INSERT INTO contact_messages (name, email, subject, message) 
                VALUES ('$name', '$email', '$subject', '$message')";
        
        if ($conn->query($sql) === TRUE) {
            $response['success'] = true;
            $response['message'] = "Thank you! Your message has been sent successfully.";
        } else {
            $response['message'] = "Error: Unable to send message. Please try again later.";
        }
    } else {
        $response['message'] = "Please fill in all fields correctly.";
    }
}

// Return JSON response if it's an AJAX request
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
} else {
    // Redirect back to homepage with status
    $redirect = 'index.html';
    if ($response['success']) {
        $redirect .= '?contact=success&message=' . urlencode($response['message']);
    } else {
        $redirect .= '?contact=error&message=' . urlencode($response['message']);
    }
    header("Location: $redirect#contact");
    exit;
}

// Close connection
$conn->close();
?>
