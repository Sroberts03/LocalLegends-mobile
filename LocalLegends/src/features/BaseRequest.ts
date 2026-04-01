import { supabase } from '@/src/lib/supabase';

// Note: Removed dotenv.config() - Expo handles .env automatically
export default async function BaseRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
    data: any, 
    endpoint: string
) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    let url = `${process.env.EXPO_PUBLIC_API_URL}/${endpoint}`;

    if (method === "GET" && data) {
        const queryParams = new URLSearchParams(data).toString();
        url += `?${queryParams}`;
    }

    const options: any = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
    };

    if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        
        return null; 
    } catch (error) {
        console.error("BaseRequest Failed:", error);
        throw error;
    }
}