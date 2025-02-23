export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
    try {
        const supabase = createClient(
            import.meta.env.PUBLIC_SUPABASE_URL,
            import.meta.env.PUBLIC_SUPABASE_ANON_KEY
        );

        const body = await request.json();
        const email = body.email;

        if (!email) {
            return new Response(
                JSON.stringify({ error: { message: 'Email is required' } }),
                { status: 400 }
            );
        }

        // Get the current origin (localhost:4321 in dev, d2health.club in prod)
        const origin = request.headers.get('origin') || import.meta.env.SITE;

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/update-password`,
        });

        console.log('Reset attempt:', { email, error, data });

        return new Response(
            JSON.stringify({ error }),
            {
                status: error ? 400 : 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error: any) {
        console.error('Reset error:', error);
        return new Response(
            JSON.stringify({ error: { message: error.message || 'Invalid request' } }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 