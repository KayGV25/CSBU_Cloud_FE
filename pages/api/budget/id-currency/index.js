export default async function id_currencyHandler(req, res) {
    const backendUrl = 'http://localhost:8080/api/v1/finance';
    const { method, body, query } = req;

    let url = `${backendUrl}/budgets/id-currency`;
    if (method === 'GET') {
        if (Object.keys(query).length > 1) {
            const params = new URLSearchParams(query);
            params.delete('path');
            url += `?${params.toString()}`;
        }
    }


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

        const data = await backendResponse.json();
        res.status(backendResponse.status).json(data);
    } catch (error) {
        console.error('Error communicating with the backend:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}
