# Sample API Requests - Blood Donation Management System (Simplified)

This document contains step-by-step instructions and raw cURL command examples to interact with the backend API.

---

## Base URL

By default, the application runs on:
`http://localhost:8080`

---

## 1. Authentication Module (Public)

### Register a User (Donor Role)
* **Endpoint**: `POST /api/auth/register`
* **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john@gmail.com",
    "password": "Password@123",
    "phoneNumber": "9876543210",
    "role": "DONOR"
  }
  ```
* **cURL Command**:
  ```bash
  curl -X POST http://localhost:8080/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"fullName":"John Doe","email":"john@gmail.com","password":"Password@123","phoneNumber":"9876543210","role":"DONOR"}'
  ```
* **Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

---

### Register a User (Admin Role)
* **Endpoint**: `POST /api/auth/register`
* **cURL Command**:
  ```bash
  curl -X POST http://localhost:8080/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"fullName":"System Admin","email":"admin@gmail.com","password":"Admin@123","phoneNumber":"9999999999","role":"ADMIN"}'
  ```

---

### Login User
* **Endpoint**: `POST /api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "john@gmail.com",
    "password": "Password@123"
  }
  ```
* **cURL Command**:
  ```bash
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john@gmail.com","password":"Password@123"}'
  ```
* **Response**:
  ```json
  {
    "token": "DISABLED",
    "role": "DONOR",
    "email": "john@gmail.com"
  }
  ```

---

## 2. Donor Management Module (Public)

> [!NOTE]
> All endpoints below are fully public. You do not need to provide a `Authorization` header.

### Register Donor Profile
* **Endpoint**: `POST /api/donors`
* **Request Body**:
  ```json
  {
    "userId": 1,
    "bloodGroup": "O_POSITIVE",
    "age": 25,
    "gender": "Male",
    "weight": 75.5,
    "city": "New York",
    "state": "NY",
    "lastDonationDate": "2026-03-01",
    "availableForDonation": true
  }
  ```
* **cURL Command**:
  ```bash
  curl -X POST http://localhost:8080/api/donors \
    -H "Content-Type: application/json" \
    -d '{"userId":1,"bloodGroup":"O_POSITIVE","age":25,"gender":"Male","weight":75.5,"city":"New York","state":"NY","lastDonationDate":"2026-03-01","availableForDonation":true}'
  ```
* **Response**:
  ```json
  {
    "id": 1,
    "userId": 1,
    "fullName": "John Doe",
    "email": "john@gmail.com",
    "phoneNumber": "9876543210",
    "bloodGroup": "O_POSITIVE",
    "age": 25,
    "gender": "Male",
    "weight": 75.5,
    "city": "New York",
    "state": "NY",
    "lastDonationDate": "2026-03-01",
    "availableForDonation": true,
    "createdAt": "2026-06-17T10:50:00",
    "updatedAt": "2026-06-17T10:50:00"
  }
  ```

---

### Get All Donors
* **Endpoint**: `GET /api/donors`
* **cURL Command**:
  ```bash
  curl -X GET http://localhost:8080/api/donors
  ```

---

### Get Donor By ID
* **Endpoint**: `GET /api/donors/1`
* **cURL Command**:
  ```bash
  curl -X GET http://localhost:8080/api/donors/1
  ```

---

### Update Donor Profile
* **Endpoint**: `PUT /api/donors/1`
* **Request Body**:
  ```json
  {
    "userId": 1,
    "bloodGroup": "O_POSITIVE",
    "age": 26,
    "gender": "Male",
    "weight": 77.0,
    "city": "Boston",
    "state": "MA",
    "lastDonationDate": "2026-03-01",
    "availableForDonation": false
  }
  ```
* **cURL Command**:
  ```bash
  curl -X PUT http://localhost:8080/api/donors/1 \
    -H "Content-Type: application/json" \
    -d '{"userId":1,"bloodGroup":"O_POSITIVE","age":26,"gender":"Male","weight":77.0,"city":"Boston","state":"MA","lastDonationDate":"2026-03-01","availableForDonation":false}'
  ```

---

### Search Donors by Blood Group
* **Endpoint**: `GET /api/donors/search/blood-group/O_POSITIVE`
* **cURL Command**:
  ```bash
  curl -X GET http://localhost:8080/api/donors/search/blood-group/O_POSITIVE
  ```

---

### Search Donors by City
* **Endpoint**: `GET /api/donors/search/city/Boston`
* **cURL Command**:
  ```bash
  curl -X GET http://localhost:8080/api/donors/search/city/Boston
  ```

---

### Search Available Donors
* **Endpoint**: `GET /api/donors/search/available`
* **cURL Command**:
  ```bash
  curl -X GET http://localhost:8080/api/donors/search/available
  ```

---

### Delete Donor Profile
* **Endpoint**: `DELETE /api/donors/1`
* **cURL Command**:
  ```bash
  curl -X DELETE http://localhost:8080/api/donors/1
  ```

---

## 3. Blood Request Module (Public)

### Create Request
* **Endpoint**: `POST /api/blood-requests`
* **Request Body**:
  ```json
  {
    "patientName": "Jane Smith",
    "bloodGroup": "A_NEGATIVE",
    "unitsRequired": 2,
    "hospitalName": "Boston General Hospital",
    "city": "Boston",
    "requiredDate": "2026-06-25",
    "contactNumber": "8888888888"
  }
  ```
* **cURL Command**:
  ```bash
  curl -X POST http://localhost:8080/api/blood-requests \
    -H "Content-Type: application/json" \
    -d '{"patientName":"Jane Smith","bloodGroup":"A_NEGATIVE","unitsRequired":2,"hospitalName":"Boston General Hospital","city":"Boston","requiredDate":"2026-06-25","contactNumber":"8888888888"}'
  ```
* **Response**:
  ```json
  {
    "id": 1,
    "patientName": "Jane Smith",
    "bloodGroup": "A_NEGATIVE",
    "unitsRequired": 2,
    "hospitalName": "Boston General Hospital",
    "city": "Boston",
    "requiredDate": "2026-06-25",
    "contactNumber": "8888888888",
    "status": "PENDING",
    "createdAt": "2026-06-17T11:00:00"
  }
  ```

---

### Get All Requests
* **Endpoint**: `GET /api/blood-requests`
* **cURL Command**:
  ```bash
  curl -X GET http://localhost:8080/api/blood-requests
  ```

---

### Update Request Status
* **Endpoint**: `PUT /api/blood-requests/1/status`
* **Request Body**:
  ```json
  {
    "status": "APPROVED"
  }
  ```
* **cURL Command**:
  ```bash
  curl -X PUT http://localhost:8080/api/blood-requests/1/status \
    -H "Content-Type: application/json" \
    -d '{"status":"APPROVED"}'
  ```

---

## 4. Admin Dashboard (Public)

### Get Dashboard Stats
* **Endpoint**: `GET /api/admin/dashboard`
* **cURL Command**:
  ```bash
  curl -X GET http://localhost:8080/api/admin/dashboard
  ```
* **Response**:
  ```json
  {
    "totalUsers": 5,
    "totalDonors": 3,
    "totalRequests": 2,
    "availableDonors": 2
  }
  ```
