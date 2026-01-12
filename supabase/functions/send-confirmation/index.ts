import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { registration_id } = await req.json()

    if (!registration_id) {
      return new Response(
        JSON.stringify({ error: 'registration_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch registration details
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registration_id)
      .single()

    if (fetchError || !registration) {
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get event password from environment variable
    const eventPassword = Deno.env.get('EVENT_PASSWORD') || 'CASINO2024'

    // Helper function to get grade levels display
    const getGradeLevelsDisplay = () => {
      if (registration.grade_levels && Array.isArray(registration.grade_levels) && registration.grade_levels.length > 0) {
        return registration.grade_levels.join(', ')
      }
      if (registration.grade_level) {
        return registration.grade_level
      }
      return 'N/A'
    }

    const gradeLevelsDisplay = getGradeLevelsDisplay()
    const registrationId = registration.registration_id || 'N/A'
    const voteCount = registration.vote_count || registration.num_adults || 1
    const isVip = registration.is_vip || false

    // Prepare email content
    const eventDetails = `
CASINO NIGHT EVENT

Date: [Event Date]
Time: [Event Time]
Location: [Event Location]

Entry Password: ${eventPassword}

${isVip ? '🎉 CONGRATULATIONS! You are among the first 50 registrations and will receive VIP treatment!' : ''}

Registration Details:
- Parent Name(s): ${registration.parent_names}
- Grade Level(s): ${gradeLevelsDisplay}
- Number of Adults: ${registration.num_adults}
- Vote Count: ${voteCount}

Registration ID: #${registrationId}

We look forward to seeing you at the event!

Best regards,
Event Organizers
`

    // For now, we'll use Supabase's built-in email or you can integrate with Resend/SendGrid
    // This is a placeholder - you'll need to configure actual email sending
    // Option 1: Use Supabase's email service (if available)
    // Option 2: Use Resend API
    // Option 3: Use SendGrid API

    // Example with Resend (uncomment and configure):
    /*
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@yourevent.com',
          to: registration.email,
          subject: 'Casino Night Registration Confirmation',
          html: eventDetails.replace(/\n/g, '<br>'),
        }),
      })
      
      if (!resendResponse.ok) {
        throw new Error('Failed to send email via Resend')
      }
    }
    */

    // For development/testing, log the email content
    console.log('Email would be sent to:', registration.email)
    console.log('Email content:', eventDetails)

    // Mark confirmation as sent
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ confirmation_sent: true })
      .eq('id', registration_id)

    if (updateError) {
      console.error('Error updating confirmation_sent:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent',
        // In production, remove this debug info
        debug: { email: registration.email, content: eventDetails }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in send-confirmation function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

