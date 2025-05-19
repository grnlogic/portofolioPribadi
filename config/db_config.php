<?php
// File-based storage mode untuk tugas (tanpa database)
class MockConnection {
    public $connect_error = false;
    public $error = "";
    
    // Data akan disimpan di file
    private $subscribers_file = "data/subscribers.json";
    private $messages_file = "data/messages.json";
    
    public function __construct() {
        // Buat folder data jika belum ada
        if (!file_exists("data")) {
            mkdir("data", 0755, true);
        }
        
        // Inisialisasi file jika belum ada
        if (!file_exists($this->subscribers_file)) {
            file_put_contents($this->subscribers_file, json_encode([]));
        }
        
        if (!file_exists($this->messages_file)) {
            file_put_contents($this->messages_file, json_encode([]));
        }
    }
    
    public function real_escape_string($str) {
        return $str; // Tidak perlu escape dalam mode simulasi
    }
    
    public function query($sql) {
        // Penanganan sederhana untuk INSERT newsletter_subscribers
        if (stripos($sql, 'INSERT INTO newsletter_subscribers') !== false) {
            preg_match("/VALUES \('(.+?)'\)/", $sql, $matches);
            if (isset($matches[1])) {
                $email = $matches[1];
                return $this->add_subscriber($email);
            }
        }
        // Penanganan SELECT newsletter_subscribers
        else if (stripos($sql, 'SELECT * FROM newsletter_subscribers WHERE email') !== false) {
            preg_match("/email = '(.+?)'/", $sql, $matches);
            if (isset($matches[1])) {
                $email = $matches[1];
                return $this->check_subscriber($email);
            }
        }
        // Penanganan INSERT contact_messages
        else if (stripos($sql, 'INSERT INTO contact_messages') !== false) {
            preg_match("/VALUES \('(.+?)', '(.+?)', '(.+?)', '(.+?)'\)/", $sql, $matches);
            if (count($matches) >= 5) {
                return $this->add_message($matches[1], $matches[2], $matches[3], $matches[4]);
            }
        }
        // Penanganan CREATE DATABASE dan CREATE TABLE
        else if (stripos($sql, 'CREATE DATABASE') !== false || stripos($sql, 'CREATE TABLE') !== false) {
            return true;
        }

        return true;
    }
    
    private function add_subscriber($email) {
        $subscribers = json_decode(file_get_contents($this->subscribers_file), true);
        $subscribers[] = [
            'id' => count($subscribers) + 1,
            'email' => $email,
            'created_at' => date('Y-m-d H:i:s')
        ];
        file_put_contents($this->subscribers_file, json_encode($subscribers, JSON_PRETTY_PRINT));
        return true;
    }
    
    private function check_subscriber($email) {
        $subscribers = json_decode(file_get_contents($this->subscribers_file), true);
        $result = new MockResult();
        foreach ($subscribers as $subscriber) {
            if ($subscriber['email'] === $email) {
                $result->num_rows = 1;
                return $result;
            }
        }
        $result->num_rows = 0;
        return $result;
    }
    
    private function add_message($name, $email, $subject, $message) {
        $messages = json_decode(file_get_contents($this->messages_file), true);
        $messages[] = [
            'id' => count($messages) + 1,
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'created_at' => date('Y-m-d H:i:s'),
            'is_read' => false
        ];
        file_put_contents($this->messages_file, json_encode($messages, JSON_PRETTY_PRINT));
        return true;
    }
    
    public function select_db($db) {
        return true;
    }
    
    public function close() {
        return true;
    }
}

class MockResult {
    public $num_rows = 0;
}

// Ganti koneksi MySQL dengan MockConnection
$conn = new MockConnection();

// Set variabel database (tidak digunakan tapi tetap disediakan)
$host = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$database = "portfolio_db";
?>
