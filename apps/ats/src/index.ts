import express, { type Express } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { config } from "@agentapply/config";
import { logger } from "@agentapply/logger";
import type { Application } from "@agentapply/types";

export const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store applications in memory (simulating a database)
const applications: Application[] = [];

// Serve the ATS form
app.get("/ats/", (req, res) => {
	res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mock ATS - Job Application</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 40px;
          max-width: 600px;
          width: 100%;
        }
        h1 {
          color: #333;
          margin-bottom: 8px;
          font-size: 28px;
        }
        .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 6px;
          color: #555;
          font-weight: 500;
          font-size: 14px;
        }
        label .required {
          color: #e53e3e;
          margin-left: 2px;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
        }
        .delayed-field {
          opacity: 0.7;
          transition: opacity 0.5s;
        }
        .delayed-field.visible {
          opacity: 1;
        }
        .file-upload {
          border: 2px dashed #e2e8f0;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
          position: relative;
        }
        .file-upload:hover {
          border-color: #667eea;
        }
        .file-upload input[type="file"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .file-upload .file-label {
          color: #718096;
          font-size: 14px;
        }
        .file-upload .file-name {
          color: #667eea;
          font-weight: 500;
        }
        .file-upload.uploaded {
          border-color: #48bb78;
          background: #f0fff4;
        }
        button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .success-message {
          display: none;
          background: #f0fff4;
          border: 2px solid #48bb78;
          border-radius: 10px;
          padding: 20px;
          color: #276749;
          margin-top: 20px;
        }
        .success-message.show {
          display: block;
        }
        .debug-info {
          margin-top: 20px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
          font-size: 12px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Apply for Position</h1>
        <p class="subtitle">Software Engineer at TechCorp</p>

        <form id="applicationForm" enctype="multipart/form-data">
          <div class="form-group">
            <label>Full Name <span class="required">*</span></label>
            <input type="text" id="applicantName" name="applicantName" placeholder="John Doe" required>
          </div>

          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input type="email" id="email" name="email" placeholder="john@example.com" required>
          </div>

          <div class="form-group">
            <label>Phone <span class="required">*</span></label>
            <input type="tel" id="phone" name="phone" placeholder="+1 (555) 000-0000" required>
          </div>

          <div class="form-group delayed-field" id="companyGroup">
            <label>Current Company</label>
            <input type="text" id="currentCompany" name="currentCompany" placeholder="Acme Inc." disabled>
          </div>

          <div class="form-group">
            <label>LinkedIn URL</label>
            <input type="url" id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/johndoe">
          </div>

          <div class="form-group">
            <label>Resume <span class="required">*</span></label>
            <div class="file-upload" id="fileUpload">
              <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
              <div class="file-label">
                <span class="file-name" id="fileName">Choose a file</span> or drag and drop
                <br>
                <small>PDF, DOC, DOCX (max 10MB)</small>
              </div>
            </div>
          </div>

          <button type="submit" id="submitBtn" disabled>Submit Application</button>
        </form>

        <div class="success-message" id="successMessage">
          <strong>✓ Application Submitted!</strong>
          <p style="margin-top: 8px; font-size: 14px;">Your application has been received. We'll be in touch soon.</p>
        </div>

        <div class="debug-info" id="debugInfo">
          <strong>Debug Info:</strong>
          <br>
          Resume uploaded: <span id="uploadStatus">No</span>
          <br>
          Submit button: <span id="submitStatus">Disabled</span>
        </div>
      </div>

      <script>
        // Simulate delayed field
        setTimeout(() => {
          const companyGroup = document.getElementById('companyGroup');
          companyGroup.classList.add('visible');
          document.getElementById('currentCompany').disabled = false;
        }, 2000);

        // File upload handling
        const fileInput = document.getElementById('resume');
        const fileName = document.getElementById('fileName');
        const fileUpload = document.getElementById('fileUpload');
        const submitBtn = document.getElementById('submitBtn');
        const uploadStatus = document.getElementById('uploadStatus');
        const submitStatus = document.getElementById('submitStatus');

        fileInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            fileName.textContent = this.files[0].name;
            fileUpload.classList.add('uploaded');
            uploadStatus.textContent = 'Yes';
            uploadStatus.style.color = '#48bb78';
            submitBtn.disabled = false;
            submitStatus.textContent = 'Enabled';
            submitStatus.style.color = '#48bb78';
          }
        });

        // Form submission
        const form = document.getElementById('applicationForm');
        const successMessage = document.getElementById('successMessage');

        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';

          const formData = new FormData(this);

          try {
            const response = await fetch('/ats/apply', {
              method: 'POST',
              body: formData
            });

            const result = await response.json();

            if (result.success) {
              successMessage.classList.add('show');
              form.style.display = 'none';
            } else {
              alert('Error: ' + result.error);
              submitBtn.disabled = false;
              submitBtn.textContent = 'Submit Application';
            }
          } catch (error) {
            alert('Error submitting application: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Application';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// API endpoint for form submission
app.post("/ats/apply", (req, res) => {
	try {
		const { applicantName, email, phone, currentCompany, linkedinUrl } = req.body;

		// Validate required fields
		if (!applicantName || !email || !phone) {
			return res.status(400).json({
				success: false,
				error: "Missing required fields",
			});
		}

		// Store application
		const application: Application = {
			id: uuidv4(),
			applicantName,
			email,
			phone,
			currentCompany: currentCompany || "",
			linkedinUrl: linkedinUrl || "",
			submittedAt: new Date().toISOString(),
		};

		applications.push(application);

		logger.info({ applicationId: application.id, email }, "Application submitted to mock ATS");

		res.json({
			success: true,
			message: "Application submitted successfully",
			applicationId: application.id,
		});
	} catch (error) {
		logger.error({ error }, "Error processing application");
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
});

// API endpoint to get all applications
app.get("/ats/applications", (req, res) => {
	res.json({
		success: true,
		data: applications,
	});
});

// API endpoint to reset the ATS
app.delete("/ats/reset", (req, res) => {
	applications.length = 0;
	logger.info("Mock ATS reset");
	res.json({
		success: true,
		message: "ATS reset successfully",
	});
});

// Health check
app.get("/", (req, res) => {
	res.json({
		status: "healthy",
		timestamp: new Date().toISOString(),
	});
});

app.listen(config.ats.port, () => {
	logger.info({ port: config.ats.port, environment: config.app.environment }, "Mock ATS server started");
});
