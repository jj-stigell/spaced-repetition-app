# Mailer

## Overview

This email service in the application is designed to send various types of emails, including confirmations, password resets,
and account deletions. The service is capable of sending emails in multiple languages and uses templated HTML files for
consistent and styled email layouts.

## Structure

- `locales/`: Contains JSON files for each supported language. These files hold translation data used in email templates.
- `templates/`: Contains HTML files for each type of email (e.g., account confirmation, password reset).
- `index`: Includes functions for sending different types of emails using the templates and locale data.
- `emailClient.ts`: Sets up the email client using NodeMailer and defines the `sendMail` function.

## How It Works

- The `index` file contains functions such as `sendEmailConfirmation`, `sendPasswordResetLink`, and `sendDeletionNotice`.
  Each function accepts parameters like language, username, email address, and other relevant data.
- The `emailClient` file sets up a NodeMailer transport using SMTP credentials and contains the `sendMail` function.
  This function reads the specified HTML template, injects data using Handlebars, and sends the email.
- The email templates in `templates/` are HTML files with placeholders for dynamic content.
  These templates are styled and structured to ensure a consistent and professional layout for emails.
- The `locales/` directory contains translation files in JSON format, which provide translated content for each supported language.

## Usage Example

```javascript
// Sending an email confirmation
sendEmailConfirmation('EN', 'username', 'user@example.com', '123456789');
```

This command would send an email using the English language template with the provided user details.
