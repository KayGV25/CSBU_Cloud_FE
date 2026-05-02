export default async function handler(req, res) {
    const { id } = req.query; 
    const backendUrl = `http://localhost:8050/api/v1/finance/transactions/${id}`;
    console.log(backendUrl);
    
    if (req.method === 'DELETE') {
        try {
            const backendResponse = await fetch(backendUrl, { method: 'DELETE' });

            if (!backendResponse.ok) {
                const errorText = await backendResponse.text();
                return res.status(backendResponse.status).json({ error: errorText });
            }

            const message = await backendResponse.text();
            return res.status(200).json({ message });
        } catch (error) {
            console.error('Error communicating with backend:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
