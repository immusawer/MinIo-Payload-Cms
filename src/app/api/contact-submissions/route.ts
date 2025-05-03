import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

// Helper function to handle CORS
function corsResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsResponse(
    new NextResponse(null, {
      status: 200,
    })
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.comments) {
      return corsResponse(
        NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        )
      );
    }

    // Initialize payload
    const payload = await getPayload({
      config,
    });

    // Create the contact submission in the database
    const submission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        comments: body.comments,
        status: 'new'
      }
    });

    return corsResponse(
      NextResponse.json(
        { message: 'Contact submission created successfully', submission },
        { status: 201 }
      )
    );
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return corsResponse(
      NextResponse.json(
        { message: 'Error creating contact submission', error: error.message },
        { status: 500 }
      )
    );
  }
}

export async function GET() {
  try {
    const submissions = await payload.find({
      collection: 'contact-submissions',
      sort: '-createdAt',
    });

    return corsResponse(
      NextResponse.json(submissions)
    );
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return corsResponse(
      NextResponse.json(
        { message: 'Error fetching contact submissions' },
        { status: 500 }
      )
    );
  }
}