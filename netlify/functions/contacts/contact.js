exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const { name, email, service, message, phone } = data;
    if (!name || !email || !service || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        })
      };
    }

    // Here you can:
    // 1. Send email (using Nodemailer, SendGrid, etc.)
    // 2. Save to database (Supabase, MongoDB, etc.)
    // 3. Send to Slack/Discord
    // 4. Save to Airtable or Google Sheets
    
    console.log('Form submission:', data);
    
    // Example: Send email notification
    // await sendEmail(data);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message! We will get back to you within 24 hours.'
      })
    };
    
  } catch (error) {
    console.error('Form processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};
