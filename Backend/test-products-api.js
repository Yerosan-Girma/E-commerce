import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/products',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('\nParsed data:');
      console.log('Success:', parsed.success);
      console.log('Number of products:', parsed.data?.length || 0);
      if (parsed.data && parsed.data.length > 0) {
        parsed.data.forEach((prod, i) => {
          console.log(`Product ${i + 1}: ${prod.title} - Category: ${prod.category?.name || 'None'}`);
        });
      }
    } catch (e) {
      console.log('Failed to parse JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
