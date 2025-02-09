import { Resend } from 'resend';

const RESEND_API_KEY = 're_ED1HbRs2_EoGcm2ZffAyKWVnAiu2aaVWE';
const resend = new Resend(RESEND_API_KEY);
const generateEmail = (token: string) =>
	`
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        
        .logo {
            width: 40px;
            height: 40px;
            margin-bottom: 30px;
        }
        
        .title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .title span {
            background-color: #ffeeb3;
            padding: 2px 4px;
        }
        
        .subtitle {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 40px;
        }
        
        .content {
            font-size: 18px;
            color: #4a4a4a;
            margin-bottom: 40px;
        }
        
        .content span {
            background-color: #ffeeb3;
        }
        
        .button {
            display: inline-block;
            background-color: #2e856e;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 18px;
            margin-bottom: 40px;
        }
        
        .button span {
            background-color: #ffeeb3;
            color: black;
            padding: 2px 4px;
        }
        
        .disclaimer {
            color: #666;
            font-size: 18px;
            margin-bottom: 40px;
        }
        
        .footer {
            color: #999;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <img src="logo.svg" alt="Supabase Logo" class="logo">
    
    <div class="title">
        Confirm your email address
    </div>
    
    <div class="subtitle">
        to start building with Supabase
    </div>
    
    <div class="content">
        You can start building with Supabase right away once you've confirmed that <a href="mailto:sty.hoareau+1@gmail.com">sty.hoareau+1@gmail.com</a> is your email. Click the button below to confirm.
    </div>
    
    <a href="http://localhost:5173/signup/verify?token=${token}" class="button">
        Confirm Email Address
    </a>
    
    <div class="disclaimer">
        If you didn't request for this, you can safely ignore this email.
    </div>
    
    <div class="footer">
        Supabase Inc, 3500 S. DuPont Highway, Kent 19901, Dover, Delaware, USA
    </div>
</body>
`;

export const POST = async ({ request }) => {
	const { uuid: token } = await request.json();
	console.log('TOKEN === ', token);
	const { data, error } = await resend.emails.send({
		from: 'Capsule <onboarding@resend.dev>',
		to: ['sty.hoareau@gmail.com'],
		subject: 'Confirm your email and create your own Capsule!',
		html: generateEmail(token)
	});

	if (error) {
		console.log(error);
	}
	console.log(data);
	return new Response('response');
};
