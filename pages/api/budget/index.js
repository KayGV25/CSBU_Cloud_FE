export default async function budgetHandler(req, res) {
    const backendUrl = 'http://localhost:8050/api/v1/finance';
    const { method, body, query } = req;

    let url = `${backendUrl}/budgets`;
    if (method === 'GET') {
        const params = new URLSearchParams(query);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }
    }

    console.log("Backend URL:", url);

    try {
        const backendResponse = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(req.headers.authorization && {
                    'Authorization': req.headers.authorization,
                }),
            },
            body: method !== 'GET' ? JSON.stringify(body) : null,
        });

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            console.error('Error from backend:', errorText);
            return res.status(backendResponse.status).json({ message: 'Error communicating with backend', error: errorText });
        }

        const contentType = backendResponse.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await backendResponse.json();
        } else {
            const errorText = await backendResponse.text();
            console.warn('Received plain text instead of JSON:', errorText);
            data = { message: errorText };
        }

        res.status(backendResponse.status).json(data);
    } catch (error) {
        console.error('Error communicating with the backend:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}
