import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

export async function POST(request: NextRequest) {
	try {
		const { apiKey } = await request.json()

		if (!apiKey || typeof apiKey !== 'string') {
			return NextResponse.json({ error: 'API key is required' }, { status: 400 })
		}

		if (!apiKey.startsWith('sk_')) {
			return NextResponse.json({ error: 'Invalid API key format' }, { status: 400 })
		}

		// Test the API key by calling the usage endpoint
		const response = await fetch(`${API_BASE_URL}/v1/usage`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const data = await response.json().catch(() => ({}))
			return NextResponse.json(
				{ error: data.error || 'Invalid API key' },
				{ status: 401 }
			)
		}

		const data = await response.json()

		return NextResponse.json({ data })
	} catch (err) {
		console.error('API key validation error:', err)
		return NextResponse.json(
			{ error: 'Failed to validate API key' },
			{ status: 500 }
		)
	}
}
