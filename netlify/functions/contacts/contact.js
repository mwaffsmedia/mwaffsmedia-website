const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  // Handle CORS - allows your website to call this function
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the form data
    const formData = JSON.parse(event.body);
    
    // Check if all required fields are filled
    const { name, email, service, message, phone } = formData;
    
    if (!name || !email || !service || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Please fill in all required fields: name, email, service, message' 
        })
      };
    }

    // Save to Supabase database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: name,
          email: email,
          phone: phone || null,
          service: service,
          message: message,
          status: 'new',
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Thank you! Your message has been sent successfully. We will contact you soon.' 
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Sorry, there was an error sending your message. Please try again or contact us directly at mwaffsmedia@gmail.com.' 
      })
    };
  }
};
