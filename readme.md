### **Low-Level Design (LLD):**

1. **Technical Design Document:**
   - A comprehensive document detailing the interaction between different system components such as the API, image processing service, database, and webhook.
2. **System Diagram:**

   - visual diagram :
     - API Endpoints:
     ```
     /upload
     /status/:requestId
     ```
     - Image Processing Service: Reducing img size by 50
     - Database Interaction
     - Webhook Handling
     - Asynchronous Workers

3. **Component Roles and Functions:**

   - **Image Processing Service Interaction:**

     - This will handle the async communication with the external service responsible for compressing images and returning the processed output.
     - The system should send URLs from the CSV for image processing and handle the response asynchronously.

   - **Database Interaction:**
     - Store the product data along with input image URLs, output image URLs, and the current status (e.g., pending, in progress, completed).
     - Use MongoDB or SQL to track the status of the image processing requests.
   - **API Endpoints:**
     - **Upload API:** Accepts the CSV, validates it, and returns a unique request ID for tracking.
     - **Status API:** Allows users to check the processing status using the request ID.

---

### **Database Schema:**

The schema should store product data and track the status of the image processing.

#### **MongoDB Example Schema:**

```json
{
  "_id": "unique_request_id",
  "requestId": "uuid",
  "products": [
    {
      "serialNumber": "1",
      "productName": "SKU1",
      "inputImageUrls": [
        "https://example.com/input1.jpg",
        "https://example.com/input2.jpg"
      ],
      "outputImageUrls": [
        "https://example.com/output1.jpg",
        "https://example.com/output2.jpg"
      ]
    }
  ],
  "status": "Completed"
}
```

- **`requestId`:** Unique ID for tracking the image processing request.
- **`products`:** Array containing each product with the input image URLs and the corresponding output URLs once processed.
- **`status`:** The current status of the processing (e.g., "pending", "in progress", "completed").

---

### **API Documentation:**

1. **Upload API:**

   - **Endpoint:** `POST /api/upload`
   - **Description:** Uploads a CSV file, validates the formatting, and returns a unique request ID.
   - **Request Body:**
     ```bash
     Content-Type: multipart/form-data
     Body: {
       file: <csv-file>
     }
     ```
   - **Response:**
     ```json
     {
       "requestId": "12345-unique-request-id"
     }
     ```

2. **Status API:**
   - **Endpoint:** `GET /api/status/:requestId`
   - **Description:** Returns the current status of the image processing request.
   - **Response:**
     ```json
     {
       "requestId": "12345-unique-request-id",
       "status": "completed",
       "products": [
         {
           "serialNumber": 1,
           "productName": "SKU1",
           "inputImageUrls": ["https://example.com/input1.jpg"],
           "outputImageUrls": ["https://example.com/output1.jpg"]
         }
       ]
     }
     ```

---

### **Asynchronous Workers Documentation:**

- **Image Processing Worker:**
  - The worker is responsible for taking the input image URLs, sending them to the external image processing service, and storing the compressed image URLs in the database.
- **Webhook Worker:**
  - Listens for the webhook callback once the external image processing is complete. Updates the database with the output image URLs and marks the processing as "completed."

---

### **GitHub Repository:**

---

### **Postman Collection:**

https://www.postman.com/ayadav7/workspace/public-parsecsv/collection/23284222-6f3f0df1-1862-463f-8546-221d770822a9?action=share&creator=23284222
