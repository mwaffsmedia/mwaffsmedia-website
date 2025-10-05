const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const data = JSON.parse(event.body);
        
        // Validate required fields
        const { name, email, service, message, phone } = data;
        
        if (!name || !email || !service || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Missing required fields: name, email, service, message' 
                })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid email format'
                })
            };
        }

        // Here you can integrate with various services:
        // Option A: Send email via SendGrid, Mailgun, etc.
        // Option B: Save to database
        // Option C: Send to Slack/Discord
        // For now, we'll just log and return success

        console.log('Contact form submission:', {
            name,
            email,
            phone: phone || 'Not provided',
            service,
            message,
            timestamp: new Date().toISOString()
        });

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Thank you for your message! We will get back to you within 24 hours.'
            })
        };

    } catch (error) {
        console.error('Error processing contact form:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error. Please try again later.'
            })
        };
    }
};
