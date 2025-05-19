<?php
// Include database connection
require_once 'config/db_config.php';

// Initialize response array
$response = array('success' => false, 'message' => '');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate email
    if(isset($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $email = $conn->real_escape_string($_POST['email']);
        
        // Check if email already exists
        $check_sql = "SELECT * FROM newsletter_subscribers WHERE email = '$email'";
        $result = $conn->query($check_sql);
        
        if ($result->num_rows > 0) {
            // Email already subscribed
            $response['message'] = "This email is already subscribed!";
        } else {
            // Insert new email
            $sql = "INSERT INTO newsletter_subscribers (email) VALUES ('$email')";
            
            if ($conn->query($sql) === TRUE) {
                $response['success'] = true;
                $response['message'] = "Thank you for subscribing!";
            } else {
                $response['message'] = "Error: " . $conn->error;
            }
        }
    } else {
        $response['message'] = "Please provide a valid email address.";
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
        $redirect .= '?subscription=success&message=' . urlencode($response['message']);
    } else {
        $redirect .= '?subscription=error&message=' . urlencode($response['message']);
    }
    header("Location: $redirect");
    exit;
}

// Close connection
$conn->close();
?>
